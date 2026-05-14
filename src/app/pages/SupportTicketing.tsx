import { useEffect, useState } from "react";
import { HeadphonesIcon, Clock, CheckCircle, AlertTriangle, MessageSquare, Skeleton } from "lucide-react";
import { Badge } from "../components/Badge";
import { StatCard } from "../components/StatCard";
import { TableRowSkeleton, StatCardSkeleton } from "../components/Skeleton";
import { useAdminStore } from "../store/adminStore";

export function SupportTicketing() {
  const { tickets, analytics, loading, fetchSupportTickets, fetchAnalytics } = useAdminStore();
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<any>(null);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    fetchSupportTickets();
    fetchAnalytics();
  }, [fetchSupportTickets, fetchAnalytics]);

  const filtered = tickets.filter(t => statusFilter === "All" || t.status.toLowerCase() === statusFilter.toLowerCase());

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading && tickets.length === 0 ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard title="Open Tickets" value={tickets.filter(t => t.status === 'open').length.toString()} change="—" trend="neutral" icon={HeadphonesIcon} iconColor="text-blue-600" iconBg="bg-blue-50" />
            <StatCard title="Total Tickets" value={tickets.length.toString()} change="—" trend="neutral" icon={MessageSquare} iconColor="text-amber-600" iconBg="bg-amber-50" />
            <StatCard title="Active Users" value={analytics?.activeUsers?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={CheckCircle} iconColor="text-green-600" iconBg="bg-green-50" />
            <StatCard title="Urgent Actions" value="0" change="—" trend="neutral" icon={AlertTriangle} iconColor="text-red-600" iconBg="bg-red-50" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tickets Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Support Tickets</h3>
            <div className="flex gap-1 overflow-x-auto pb-2 sm:pb-0">
              {["All", "Open", "Closed"].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors whitespace-nowrap ${statusFilter === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ticket ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Subject</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Created At</th>
                </tr>
              </thead>
              <tbody>
                {loading && tickets.length === 0 ? (
                  Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={4} />)
                ) : filtered.length > 0 ? (
                  filtered.map(t => (
                    <tr key={t.id} onClick={() => setSelected(t)} className={`border-b border-gray-50 cursor-pointer transition-colors ${selected?.id === t.id ? "bg-blue-50" : "hover:bg-gray-50/50"}`}>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{t.id?.slice(0, 8) ?? 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{t.subject}</td>
                      <td className="px-4 py-3">
                        <Badge label={t.status} variant={t.status === "closed" ? "success" : "warning"} />
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{new Date(t.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <MessageSquare size={32} className="mb-2 opacity-20" />
                        <p>No support tickets found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ticket Detail */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          {selected ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-gray-500">{selected.id}</span>
                  <Badge label={selected.status} variant={selected.status === "closed" ? "success" : "info"} />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">{selected.subject}</h3>
                <p className="text-xs text-gray-400 mt-2">{selected.description}</p>
              </div>

              {/* Internal Notes */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Admin Response</p>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Type your response..."
                  className="w-full p-2.5 text-xs rounded-lg border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500/30 h-24 resize-none"
                />
              </div>
              <div className="space-y-2">
                <button className="w-full py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium">Send Response</button>
                {selected.status !== "closed" && (
                  <button className="w-full py-2 text-sm rounded-lg border border-green-200 text-green-700 hover:bg-green-50 font-medium">Mark Resolved</button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <HeadphonesIcon size={32} className="text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">Select a ticket to manage</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

