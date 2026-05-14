import { useEffect, useState } from "react";
import { Bell, CheckCircle, XCircle, RefreshCw, MessageSquare, Mail, Smartphone, Settings } from "lucide-react";
import { Badge } from "../components/Badge";
import api from "../utils/api";
import { TableRowSkeleton, StatCardSkeleton, Skeleton } from "../components/Skeleton";

export function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"log" | "templates">("log");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editTemplate, setEditTemplate] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [logsRes, templatesRes, statsRes] = await Promise.all([
          api.get("/notifications/logs"),
          api.get("/notifications/templates"),
          api.get("/notifications/stats")
        ]);
        const extractData = (res: any) => Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
        const extractObject = (res: any) => (res.data?.data && typeof res.data.data === 'object' && !Array.isArray(res.data.data)) ? res.data.data : res.data;
        
        setNotifications(extractData(logsRes));
        setTemplates(extractData(templatesRes));
        setStats(extractObject(statsRes));
      } catch (error) {
        console.error("Failed to fetch notification data:", error);
        setNotifications([]);
        setTemplates([]);
        setStats({ sentToday: 0, deliveryRate: 0, failed: 0, pending: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = Array.isArray(notifications)
    ? notifications.filter(n => statusFilter === "All" || n.status === statusFilter)
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
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 font-medium">Sent Today</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{stats?.sentToday?.toLocaleString() ?? "0"}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 font-medium">Delivery Rate</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">{stats?.deliveryRate ?? "0"}%</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 font-medium">Failed</p>
              <p className="text-2xl font-semibold text-red-600 mt-1">{stats?.failed?.toLocaleString() ?? "0"}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 font-medium">Pending Retry</p>
              <p className="text-2xl font-semibold text-amber-600 mt-1">{stats?.pending?.toLocaleString() ?? "0"}</p>
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-100 px-4">
          {(["log", "templates"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {tab === "log" ? "Notification Log" : "Templates"}
            </button>
          ))}
        </div>

        {activeTab === "log" && (
          <div>
            <div className="flex items-center gap-2 p-4 border-b border-gray-100">
              {["All", "Delivered", "Failed", "Pending", "Scheduled"].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${statusFilter === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Notification</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Channel</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Time</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={6} />)
                  ) : filtered.length > 0 ? (
                    filtered.map(n => (
                      <tr key={n.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800 text-xs">{n.type}</p>
                          <p className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{n.content}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">{n.user}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{n.channel}</td>
                        <td className="px-4 py-3">
                          <Badge label={n.status} variant={n.status === "Delivered" ? "success" : n.status === "Failed" ? "danger" : n.status === "Pending" ? "warning" : "info"} />
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{n.time}</td>
                        <td className="px-4 py-3">
                          {n.status === "Failed" && (
                            <button className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                              <RefreshCw size={11} /> Resend
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-gray-500 flex flex-col items-center">
                        <Bell size={32} className="mb-2 opacity-20" />
                        <p>No notifications found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">Configure notification templates for email, SMS, and push.</p>
              <button className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">+ New Template</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
              ) : templates.length > 0 ? (
                templates.map(tpl => (
                  <div key={tpl.id} className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 bg-gray-50/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-gray-800">{tpl.name}</p>
                          <span className={`w-1.5 h-1.5 rounded-full ${tpl.active ? "bg-green-500" : "bg-gray-400"}`} />
                        </div>
                        <p className="text-xs text-gray-500">{tpl.category}</p>
                        <div className="flex gap-1.5 mt-2">
                          {Array.isArray(tpl.channels) && tpl.channels.map(ch => (
                            <span key={ch} className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">{ch}</span>
                          ))}
                        </div>
                      </div>
                      <button onClick={() => setEditTemplate(tpl)} className="text-xs text-blue-600 hover:underline ml-2 shrink-0">Edit</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-12 text-center text-gray-500">
                  <Settings size={32} className="mx-auto mb-2 opacity-20" />
                  <p>No templates found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Template Modal */}
      {editTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4">
            <h3 className="font-semibold text-gray-800 mb-4">Edit Template: {editTemplate.name}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">SMS Template</label>
                <textarea className="w-full p-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none h-16 resize-none" defaultValue={`Dear {{name}}, your ${editTemplate.name.toLowerCase()} has been processed. Ref: {{ref_id}}`} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Email Subject</label>
                <input type="text" className="w-full p-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none" defaultValue={`NexusBank: ${editTemplate.name}`} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Push Notification</label>
                <textarea className="w-full p-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none h-16 resize-none" defaultValue={`${editTemplate.name} - Tap to view details`} />
              </div>
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <button onClick={() => setEditTemplate(null)} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
              <button onClick={() => setEditTemplate(null)} className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">Save Template</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
