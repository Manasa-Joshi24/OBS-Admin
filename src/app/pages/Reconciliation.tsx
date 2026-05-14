import { useEffect, useState } from "react";
import { GitMerge, AlertTriangle, CheckCircle, XCircle, RefreshCw, Search, Landmark } from "lucide-react";
import { Badge } from "../components/Badge";
import { StatCard } from "../components/StatCard";
import api from "../utils/api";
import { TableRowSkeleton, StatCardSkeleton, Skeleton } from "../components/Skeleton";

export function Reconciliation() {
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [entriesRes, statsRes] = await Promise.all([
          api.get("/reconciliation/entries"),
          api.get("/reconciliation/stats")
        ]);
        const extractData = (res: any) => Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
        const extractObject = (res: any) => (res.data?.data && typeof res.data.data === 'object' && !Array.isArray(res.data.data)) ? res.data.data : res.data;
        
        setLedgerEntries(extractData(entriesRes));
        setStats(extractObject(statsRes));
      } catch (error) {
        console.error("Failed to fetch reconciliation data:", error);
        setLedgerEntries([]);
        setStats({ matched: "0/0", mismatches: 0, failed: 0, duplicates: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = Array.isArray(ledgerEntries)
    ? ledgerEntries.filter(e => {
        const matchSearch = e.txnId.toLowerCase().includes(search.toLowerCase()) || e.account.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "All" || e.status === statusFilter;
        return matchSearch && matchStatus;
      })
    : [];

  return (
    <div className="space-y-5">
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
            <StatCard title="Matched Entries" value={stats?.matched ?? "0/0"} change="—" trend="neutral" icon={CheckCircle} iconColor="text-green-600" iconBg="bg-green-50" />
            <StatCard title="Mismatches" value={stats?.mismatches?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={AlertTriangle} iconColor="text-amber-600" iconBg="bg-amber-50" />
            <StatCard title="Failed Postings" value={stats?.failed?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={XCircle} iconColor="text-red-600" iconBg="bg-red-50" />
            <StatCard title="Duplicates Found" value={stats?.duplicates?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={GitMerge} iconColor="text-purple-600" iconBg="bg-purple-50" />
          </>
        )}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Last Reconciliation Run", value: "None", ok: true },
          { label: "Settlement Status", value: "Operational", ok: true },
          { label: "WAL Archiving", value: "Operational", ok: true },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-sm font-semibold mt-1 ${s.ok ? "text-green-600" : "text-amber-600"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Ledger Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-gray-100">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search TXN ID, account..." className="w-full pl-8 pr-3 py-2 text-sm bg-gray-100 rounded-lg border-0 outline-none" />
            </div>
            <div className="flex gap-1 flex-wrap">
              {["All", "Matched", "Mismatch", "Duplicate", "Failed Posting"].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-2 py-1 text-xs rounded-lg font-medium transition-colors ${statusFilter === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ledger ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">TXN ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Posted</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={6} />)
                  ) : filtered.length > 0 ? (
                    filtered.map(entry => (
                      <tr key={entry.id} onClick={() => setSelected(entry)} className={`border-b border-gray-50 cursor-pointer transition-colors ${selected?.id === entry.id ? "bg-blue-50" : "hover:bg-gray-50/50"}`}>
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">{entry.id}</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-700">{entry.txnId}</td>
                        <td className="px-4 py-3 font-semibold text-gray-800">{entry.amount}</td>
                        <td className="px-4 py-3">
                          <Badge label={entry.type} variant={entry.type === "Credit" ? "success" : "info"} />
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{entry.posted}</td>
                        <td className="px-4 py-3">
                          <Badge
                            label={entry.status}
                            variant={entry.status === "Matched" ? "success" : entry.status === "Mismatch" ? "warning" : entry.status === "Failed Posting" ? "danger" : "purple"}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-gray-500 flex flex-col items-center">
                        <Landmark size={32} className="mb-2 opacity-20" />
                        <p>No ledger entries found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Entry Detail */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-40 w-full" />
              </div>
            ) : selected ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Entry Details</h3>
                  <Badge label={selected.status} variant={selected.status === "Matched" ? "success" : selected.status === "Mismatch" ? "warning" : "danger"} />
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Ledger ID", value: selected.id },
                    { label: "TXN ID", value: selected.txnId },
                    { label: "Amount", value: selected.amount },
                    { label: "Type", value: selected.type },
                    { label: "Account", value: selected.account },
                    { label: "Posted At", value: selected.posted },
                    { label: "Settlement", value: selected.settlement },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between">
                      <span className="text-gray-500">{row.label}</span>
                      <span className="font-medium text-gray-800 text-right text-xs">{row.value}</span>
                    </div>
                  ))}
                </div>
                {selected.mismatch && (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-xs font-medium text-amber-700 mb-0.5">Mismatch Details</p>
                    <p className="text-xs text-amber-600">{selected.mismatch}</p>
                  </div>
                )}
                <div className="space-y-2">
                  {selected.status !== "Matched" && (
                    <>
                      <button className="w-full py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2">
                        <RefreshCw size={13} /> Reprocess Entry
                      </button>
                      <button className="w-full py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Flag for Manual Review</button>
                    </>
                  )}
                  <button className="w-full py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600">View Transaction History</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <GitMerge size={32} className="text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">Select a ledger entry to inspect</p>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
