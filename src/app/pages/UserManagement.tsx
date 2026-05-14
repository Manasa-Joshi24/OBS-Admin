import { useEffect, useState } from "react";
import { Search, UserCheck, Lock, LogOut, RefreshCw, Eye, Users, UserMinus, Shield, CreditCard, ArrowLeftRight, User, X } from "lucide-react";
import { Badge } from "../components/Badge";
import { StatCard } from "../components/StatCard";
import { TableRowSkeleton, StatCardSkeleton } from "../components/Skeleton";
import { useAdminStore } from "../store/adminStore";

type ModalAction = "Activate" | "Deactivate" | "Freeze" | "Reset Password" | "Force Logout" | null;

export function UserManagement() {
  const { users, analytics, transactions, cards, loading, searchQuery, fetchUsers, fetchAnalytics, updateUserStatus, fetchTransactions, fetchCards } = useAdminStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "cards">("overview");
  const [action, setAction] = useState<ModalAction>(null);

  useEffect(() => {
    fetchUsers();
    fetchAnalytics();
  }, [fetchUsers, fetchAnalytics]);

  const filtered = (Array.isArray(users) ? users : []).filter((u) => {
    const s = (search || searchQuery).toLowerCase();
    const matchSearch = (u.full_name?.toLowerCase() || "").includes(s) || 
                      (u.email?.toLowerCase() || "").includes(s) || 
                      (u.user_id?.toLowerCase() || "").includes(s);
    const matchStatus = statusFilter === "All" || u.account_status === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setActiveTab("overview");
    fetchTransactions({ user_id: user.user_id });
    fetchCards({ user_id: user.user_id });
  };

  const handleAction = (user: any, act: ModalAction, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedUser(user);
    setAction(act);
  };

  const confirmAction = async () => {
    if (selectedUser && action) {
      let newStatus = selectedUser.account_status;
      if (action === "Freeze") newStatus = "frozen";
      if (action === "Activate") newStatus = "active";
      if (action === "Deactivate") newStatus = "inactive";
      
      await updateUserStatus(selectedUser.user_id, newStatus);
      setAction(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading && !analytics ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard title="Total Users" value={analytics?.totalUsers?.toLocaleString() ?? "0"} icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50" />
            <StatCard title="Active Users" value={analytics?.activeUsers?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={UserCheck} iconColor="text-green-600" iconBg="bg-green-50" />
            <StatCard title="Pending KYC" value={analytics?.pendingKyc?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={UserMinus} iconColor="text-amber-600" iconBg="bg-amber-50" />
            <StatCard title="Security Flags" value={analytics?.securityFlags?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={Shield} iconColor="text-red-600" iconBg="bg-red-50" />
          </>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-gray-100">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, ID..."
              className="w-full pl-8 pr-3 py-2 text-sm bg-gray-100 rounded-lg border-0 outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            {["All", "Active", "Frozen", "Inactive"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors whitespace-nowrap ${statusFilter === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">KYC</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && users.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={4} />)
              ) : filtered.length > 0 ? (
                filtered.map((user) => (
                  <tr 
                    key={user.user_id} 
                    onClick={() => handleUserSelect(user)}
                    className={`border-b border-gray-50 transition-colors cursor-pointer ${selectedUser?.user_id === user.user_id ? "bg-blue-50" : "hover:bg-gray-50/50"}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0 overflow-hidden">
                          {user.profile_photo ? (
                            <img src={user.profile_photo} alt="" className="w-full h-full object-cover" />
                          ) : (
                            (user.full_name || "U").split(" ").map((n: string) => n[0]).join("").slice(0, 2)
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.full_name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge 
                        label={user.kyc_status} 
                        variant={user.kyc_status === "verified" ? "success" : user.kyc_status === "pending" ? "warning" : "danger"} 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Badge 
                        label={user.account_status} 
                        variant={user.account_status === "active" ? "success" : user.account_status === "frozen" ? "info" : "danger"} 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={(e) => handleAction(user, "Freeze", e)} className="p-1.5 rounded hover:bg-amber-50 text-amber-600" title="Freeze">
                          <Lock size={14} />
                        </button>
                        <button onClick={(e) => handleAction(user, "Reset Password", e)} className="p-1.5 rounded hover:bg-purple-50 text-purple-600" title="Reset Password">
                          <RefreshCw size={14} />
                        </button>
                        <button onClick={(e) => handleAction(user, "Force Logout", e)} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="Force Logout">
                          <LogOut size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Users size={32} className="mb-2 opacity-20" />
                      <p>No users found matching your filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          {selectedUser ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
                    {selectedUser.full_name[0]}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{selectedUser.full_name}</h2>
                    <p className="text-sm text-gray-500 font-mono">{selectedUser.user_id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100 px-6">
                {[
                  { id: "overview", label: "Overview", icon: User },
                  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
                  { id: "cards", label: "Cards", icon: CreditCard }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative ${
                      activeTab === tab.id ? "text-blue-600" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Contact Information</h3>
                      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Email Address</p>
                          <p className="text-sm font-medium text-gray-800">{selectedUser.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Phone Number</p>
                          <p className="text-sm font-medium text-gray-800">{selectedUser.phone || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Account Status</h3>
                      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">KYC Status</p>
                          <Badge label={selectedUser.kyc_status} variant={selectedUser.kyc_status === "verified" ? "success" : "warning"} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Last Login</p>
                          <p className="text-sm font-medium text-gray-800">{selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleString() : "Never"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "transactions" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recent Transactions</h3>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-gray-100">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reference</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {loading ? (
                            Array.from({ length: 3 }).map((_, i) => <TableRowSkeleton key={i} columns={5} />)
                          ) : transactions.length > 0 ? (
                            transactions.map((tx: any) => (
                              <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 font-mono text-xs text-gray-600">{tx.id.slice(0, 8)}...</td>
                                <td className="px-4 py-3 font-semibold text-gray-800">₹{tx.amount.toLocaleString()}</td>
                                <td className="px-4 py-3 text-gray-600">{tx.type}</td>
                                <td className="px-4 py-3">
                                  <Badge label={tx.status} variant={tx.status === "completed" ? "success" : "warning"} />
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 italic">No transactions found for this user.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "cards" && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Issued Cards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {loading ? (
                         <div className="h-32 bg-gray-100 animate-pulse rounded-xl" />
                      ) : cards.length > 0 ? (
                        cards.map((card: any) => (
                          <div key={card.id} className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                              <CreditCard size={80} />
                            </div>
                            <div className="relative z-10">
                              <div className="flex justify-between items-start mb-8">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{card.card_type} Card</p>
                                <div className="w-10 h-6 bg-amber-400/20 rounded border border-amber-400/30" />
                              </div>
                              <p className="text-lg font-mono tracking-[0.2em] mb-4">**** **** **** {card.last_four || "4242"}</p>
                              <div className="flex justify-between items-end">
                                <div>
                                  <p className="text-[10px] text-gray-400 uppercase mb-1">Card Holder</p>
                                  <p className="text-xs font-bold">{selectedUser.full_name}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] text-gray-400 uppercase mb-1">Status</p>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${card.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                    {card.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 italic">
                          No active cards found for this user.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-12 text-center text-gray-400">
              <User size={48} className="mx-auto mb-4 opacity-10" />
              <p className="text-sm">Select a user from the table to view detailed information, transactions, and cards.</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {action && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="font-semibold text-gray-800 mb-1">{action}: {selectedUser.full_name}</h3>
            <p className="text-sm text-gray-500 mb-4">This action requires a reason and will be recorded in the audit log.</p>
            <textarea
              placeholder="Enter reason for this action (required)..."
              className="w-full p-3 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500/30 h-24 resize-none"
            />
            <div className="flex gap-2 mt-4 justify-end">
              <button onClick={() => setAction(null)} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
              <button onClick={confirmAction} className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">Confirm {action}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

