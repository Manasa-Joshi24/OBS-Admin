import { useEffect, useState } from "react";
import { ClipboardList, Shield, Download, Search, AlertTriangle, User, Settings, Lock, FileText } from "lucide-react";
import { Badge } from "../components/Badge";
import { TableRowSkeleton, StatCardSkeleton } from "../components/Skeleton";
import { useAdminStore } from "../store/adminStore";

const actionIcon: Record<string, typeof User> = {
  "Freeze Account": Lock,
  "Reset Password": Shield,
  "Clear Fraud Case": AlertTriangle,
  "Update Transfer Limit": Settings,
  "Assign Ticket": User,
  "Export Audit Log": Download,
  "Approve Loan": ClipboardList,
  "Update Risk Rule": Settings,
};

export function AuditCompliance() {
  const { auditLogs, loading, fetchAuditLogs } = useAdminStore();
  const [search, setSearch] = useState("");
  const [sensitiveFilter, setSensitiveFilter] = useState<"all" | "sensitive" | "normal">("all");

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const filtered = auditLogs.filter(log => {
    const searchStr = `${log.admin_name} ${log.action} ${log.target_resource}`.toLowerCase();
    const matchSearch = searchStr.includes(search.toLowerCase());
    const matchSensitive = sensitiveFilter === "all" || (sensitiveFilter === "sensitive" ? log.is_sensitive : !log.is_sensitive);
    return matchSearch && matchSensitive;
  });

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading && auditLogs.length === 0 ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 font-medium">Total Audit Events</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{auditLogs.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 font-medium">Sensitive Actions</p>
              <p className="text-2xl font-semibold text-amber-600 mt-1">{auditLogs.filter(l => l.is_sensitive).length}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 font-medium">Compliance Score</p>
              <p className="text-2xl font-semibold text-blue-600 mt-1">98%</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 font-medium">Last Security Audit</p>
              <p className="text-lg font-semibold text-green-600 mt-1">Passed</p>
            </div>
          </>
        )}
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-gray-100">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search admin, action, target..." className="w-full pl-8 pr-3 py-2 text-sm bg-gray-100 rounded-lg border-0 outline-none" />
          </div>
          <div className="flex gap-1">
            {[{ key: "all", label: "All" }, { key: "sensitive", label: "Sensitive" }, { key: "normal", label: "Normal" }].map(f => (
              <button
                key={f.key}
                onClick={() => setSensitiveFilter(f.key as any)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${sensitiveFilter === f.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 ml-auto">
            <Download size={13} /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Admin</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Target</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">IP Address</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Time</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && auditLogs.length === 0 ? (
                Array.from({ length: 10 }).map((_, i) => <TableRowSkeleton key={i} columns={6} />)
              ) : filtered.length > 0 ? (
                filtered.map(log => {
                  const Icon = actionIcon[log.action] || ClipboardList;
                  return (
                    <tr key={log.audit_id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-800">{log.admin_name}</p>
                        <p className="text-xs text-gray-400">ID: {log.admin_id.slice(0, 8)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Icon size={13} className="text-gray-500" />
                          <span className="text-sm text-gray-700">{log.action}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-[180px] truncate">{log.target_resource}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{log.ip_address}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        {log.is_sensitive ? (
                          <Badge label="Sensitive" variant="warning" />
                        ) : (
                          <Badge label="Normal" variant="neutral" />
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <FileText size={32} className="mb-2 opacity-20" />
                      <p>No audit events found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
          <p className="text-xs text-gray-400">Audit logs are immutable and cannot be edited or deleted</p>
          <p className="text-xs text-gray-500">Showing {filtered.length} events</p>
        </div>
      </div>
    </div>
  );
}

