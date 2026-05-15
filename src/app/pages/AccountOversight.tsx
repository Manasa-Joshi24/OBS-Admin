import { useEffect, useState } from "react";
import { 
  Search, Lock, Unlock, AlertCircle, Eye, TrendingUp, Landmark, 
  ShieldAlert, FileText, Check, X, Filter, ChevronDown, CheckSquare, Plus,
  MoreVertical, Info
} from "lucide-react";
import { Badge } from "../components/Badge";
import { StatCard } from "../components/StatCard";
import { TableRowSkeleton, StatCardSkeleton, Skeleton } from "../components/Skeleton";
import { useAdminStore } from "../store/adminStore";
import { Activity } from "lucide-react";

// Mock Data Types
type Transaction = { id: string; date: string; amount: string; type: string };
type AdminNote = { id: string; date: string; note: string; author: string };

type Account = {
  id: string; user: string; uid: string; email: string; phone: string;
  type: string; balance: number; status: string; currency: string; opened: string;
  overdraft: boolean; lien: boolean; hold: boolean; flagReason: string;
  riskLevel: "Low" | "Medium" | "High"; kycStatus: "Verified" | "Pending" | "Rejected";
  recentTransactions: Transaction[]; adminNotes: AdminNote[];
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

export function AccountOversight() {
  const { accounts, analytics, searchQuery, loading, fetchAccounts, fetchAnalytics } = useAdminStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [balanceFilter, setBalanceFilter] = useState("All");
  const [flagFilter, setFlagFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  
  const [selectedAcc, setSelectedAcc] = useState<any | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [newNote, setNewNote] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<{type: "freeze" | "unfreeze" | "review", accountIds: string[]}>({ type: "freeze", accountIds: [] });

  useEffect(() => {
    fetchAccounts();
    fetchAnalytics();
  }, [fetchAccounts, fetchAnalytics]);

  const filtered = Array.isArray(accounts)
    ? accounts.filter(a => {
        const fullName = a.users?.full_name || "Unknown";
        const email = a.users?.email || "";
        const accNum = a.account_number || "";
        const s = (search || searchQuery).toLowerCase();
        
        const matchSearch = 
          fullName.toLowerCase().includes(s) || 
          accNum.toLowerCase().includes(s) ||
          email.toLowerCase().includes(s);
        
        const matchStatus = statusFilter === "All" || a.account_status?.toLowerCase() === statusFilter.toLowerCase();
        const matchType = typeFilter === "All" || a.account_type?.toLowerCase() === typeFilter.toLowerCase();
        
        let matchBalance = true;
        if (balanceFilter === "<10k") matchBalance = a.balance < 10000;
        else if (balanceFilter === "10k-50k") matchBalance = a.balance >= 10000 && a.balance <= 50000;
        else if (balanceFilter === ">50k") matchBalance = a.balance > 50000;

        return matchSearch && matchStatus && matchType && matchBalance;
      })
    : [];

  const openModal = (type: "freeze" | "unfreeze" | "review", accountIds: string[]) => {
    setModalAction({ type, accountIds });
    setIsModalOpen(true);
  };

  const confirmAction = async () => {
    if (modalAction.accountIds.length > 0) {
      let statusToSet = "";
      if (modalAction.type === "freeze") statusToSet = "frozen";
      else if (modalAction.type === "unfreeze") statusToSet = "active";
      else if (modalAction.type === "review") statusToSet = "under review";

      if (statusToSet) {
        // We use the first ID for simplicity or loop if needed. 
        // The store currently supports one at a time.
        for (const id of modalAction.accountIds) {
          const acc = accounts.find(a => a.id === id);
          if (acc?.user_id) {
            await useAdminStore.getState().updateUserStatus(acc.user_id, statusToSet);
          }
        }
      }
    }
    setIsModalOpen(false);
    setSelectedIds([]);
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedAcc) return;
    console.log("Adding note for account:", selectedAcc.id, newNote);
    // In a real app, this would call an API
    setNewNote("");
  };

  return (
    <div className="space-y-5 relative">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard title="Total Accounts" value={analytics?.totalAccounts?.toLocaleString() ?? "0"} icon={Landmark} iconColor="text-blue-600" iconBg="bg-blue-50" />
            <StatCard title="Active Accounts" value={analytics?.activeAccounts?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={TrendingUp} iconColor="text-green-600" iconBg="bg-green-50" />
            <StatCard title="Frozen/Restricted" value={analytics?.restrictedAccounts?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={Lock} iconColor="text-amber-600" iconBg="bg-amber-50" />
            <StatCard title="Security Flags" value={analytics?.securityFlags?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={AlertCircle} iconColor="text-red-600" iconBg="bg-red-50" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Account Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-gray-100">
            <div className="relative flex-1 w-full">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Search by ID, name, email or phone..." 
                className="w-full pl-8 pr-3 py-2 text-sm bg-gray-100 rounded-lg border-0 outline-none focus:ring-2 focus:ring-blue-500/30" 
              />
            </div>
          </div>
          
          {/* Filter Toggle & Bulk Actions */}
          <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                <Filter size={14} /> Filters
              </button>
              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2 border-l border-gray-300 pl-3">
                  <span className="text-sm text-gray-600 font-medium">{selectedIds.length} selected</span>
                  <button onClick={() => openModal("freeze", selectedIds)} className="px-2.5 py-1 text-xs font-medium rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm">Freeze</button>
                  <button onClick={() => openModal("review", selectedIds)} className="px-2.5 py-1 text-xs font-medium rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm">Mark Review</button>
                </div>
              )}
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="p-3 border-b border-gray-100 bg-gray-50 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-full text-sm rounded-md border-gray-200 shadow-sm py-1.5 bg-white border outline-none">
                <option value="All">All Types</option>
                <option value="Savings">Savings</option>
                <option value="Current">Current</option>
              </select>
              <select value={balanceFilter} onChange={e => setBalanceFilter(e.target.value)} className="w-full text-sm rounded-md border-gray-200 shadow-sm py-1.5 bg-white border outline-none">
                <option value="All">All Balances</option>
                <option value="<10k">Under $10k</option>
                <option value="10k-50k">$10k - $50k</option>
                <option value=">50k">Over $50k</option>
              </select>
              <select value={flagFilter} onChange={e => setFlagFilter(e.target.value)} className="w-full text-sm rounded-md border-gray-200 shadow-sm py-1.5 bg-white border outline-none">
                <option value="All">All Flags</option>
                <option value="Lien">Lien</option>
                <option value="Hold">Hold</option>
              </select>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full text-sm rounded-md border-gray-200 shadow-sm py-1.5 bg-white border outline-none">
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Frozen">Frozen</option>
                <option value="Restricted">Restricted</option>
                <option value="Under Review">Under Review</option>
              </select>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 w-10 text-left">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 w-3.5 h-3.5 cursor-pointer accent-blue-600"
                      checked={selectedIds.length === filtered.length && filtered.length > 0}
                      onChange={(e) => setSelectedIds(e.target.checked ? filtered.map(a => a.id) : [])}
                    />
                  </th>
                  <th className="text-left px-2 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Account</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Balance</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && accounts.length === 0 ? (
                  Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={6} />)
                ) : filtered.length > 0 ? (
                  filtered.map(acc => (
                    <tr key={acc.id} onClick={() => setSelectedAcc(acc)} className={`border-b border-gray-50 cursor-pointer transition-colors ${selectedAcc?.id === acc.id ? "bg-blue-50" : "hover:bg-gray-50/50"}`}>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 w-3.5 h-3.5 cursor-pointer accent-blue-600"
                          checked={selectedIds.includes(acc.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds([...selectedIds, acc.id]);
                            else setSelectedIds(selectedIds.filter(id => id !== acc.id));
                          }}
                        />
                      </td>
                      <td className="px-2 py-3">
                        <p className="font-medium text-gray-800">{acc.account_number}</p>
                        <p className="text-xs text-gray-400">{acc.users?.full_name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-600">{acc.account_type}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        {formatCurrency(acc.balance || 0, "INR")}
                      </td>
                      <td className="px-4 py-3">
                        <Badge label={acc.account_status} variant={acc.account_status === "active" ? "success" : acc.account_status === "frozen" ? "info" : "danger"} />
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-1">
                          <button title="View Details" onClick={() => setSelectedAcc(acc)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"><Eye size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <Landmark size={32} className="mb-2 opacity-20" />
                        <p>No accounts found matching your filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Showing {filtered.length} of {accounts.length} accounts</p>
          </div>
        </div>

        {/* Account Detail Panel */}
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-[calc(100vh-8rem)] sticky top-4">
          {selectedAcc ? (
            <>
              <div className="p-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 text-base">Account Profile</h3>
                  <Badge label={selectedAcc.account_status} variant={selectedAcc.account_status === "active" ? "success" : "danger"} />
                </div>
                
                <div className="mb-4">
                  <p className="text-lg font-bold text-gray-800">{selectedAcc.users?.full_name}</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                    <span>{selectedAcc.account_number}</span>
                    <span>•</span>
                    <span>{selectedAcc.account_type}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                    <span>{selectedAcc.users?.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-1">
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium">Balance</p>
                    <p className="text-base font-bold text-blue-700 mt-0.5">{formatCurrency(selectedAcc.balance || 0, "INR")}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex flex-col justify-center">
                    <p className="text-xs text-gray-500 font-medium">KYC Status</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className={`w-2 h-2 rounded-full ${selectedAcc.users?.kyc_status === 'verified' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                      <p className={`text-sm font-semibold capitalize ${selectedAcc.users?.kyc_status === 'verified' ? 'text-green-600' : 'text-amber-600'}`}>{selectedAcc.users?.kyc_status || 'Pending'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin text-center">
                <Activity size={40} className="mx-auto text-gray-200 mt-10" />
                <p className="text-sm text-gray-400">Detailed logs and transaction history will appear here once activity is detected.</p>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0 space-y-2.5">
                <button 
                  onClick={() => openModal(selectedAcc.account_status === "active" ? "freeze" : "unfreeze", [selectedAcc.id])}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg border border-gray-200 hover:bg-white text-gray-700 transition-colors shadow-sm"
                >
                  {selectedAcc.account_status === "active" ? <Lock size={16} /> : <Unlock size={16} />}
                  {selectedAcc.account_status === "active" ? "Freeze Account" : "Unfreeze Account"}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <Landmark size={28} className="text-gray-300" />
              </div>
              <h3 className="text-gray-800 font-medium mb-1.5 text-lg">No Account Selected</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                Click on an account row from the table to view its full profile and take administrative actions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-800 capitalize">
                {modalAction.type === "review" ? "Mark Under Review" : `${modalAction.type} Account${modalAction.accountIds.length > 1 ? 's' : ''}`}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${modalAction.type === 'freeze' ? 'bg-amber-100 text-amber-600' : modalAction.type === 'unfreeze' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                  {modalAction.type === 'freeze' ? <Lock size={24} /> : modalAction.type === 'unfreeze' ? <Unlock size={24} /> : <ShieldAlert size={24} />}
                </div>
                <div>
                  <p className="text-gray-800 font-semibold mb-1 text-lg">Are you absolutely sure?</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    You are about to {modalAction.type === 'review' ? 'mark' : modalAction.type} <strong>{modalAction.accountIds.length}</strong> account{modalAction.accountIds.length > 1 ? 's' : ''}{modalAction.type === 'review' ? ' as under review' : ''}. This action will be securely logged in the audit trail.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAction} 
                className={`px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${modalAction.type === 'freeze' ? 'bg-amber-600 hover:bg-amber-700' : modalAction.type === 'unfreeze' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
