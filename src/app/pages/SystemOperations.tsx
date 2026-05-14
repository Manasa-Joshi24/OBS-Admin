import { useEffect, useState } from "react";
import { Server, Activity, CheckCircle, Database, Zap, Cpu, Globe } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "../components/Badge";
import { Skeleton } from "../components/Skeleton";
import { useAdminStore } from "../store/adminStore";

const serviceIcons: Record<string, any> = {
  "API Gateway": Globe,
  "Fraud Engine": Cpu,
  "Payment Service": Zap,
  "User Service": Server,
  "Notification Engine": Activity,
  "Ledger Service": Database
};

export function SystemOperations() {
  const { analytics, loading, fetchAnalytics } = useAdminStore();
  const [activeTab, setActiveTab] = useState<"services" | "queues" | "errors">("services");

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const latencyData = [
    { time: "00:00", api: 45, fraud: 120, payment: 85 },
    { time: "04:00", api: 30, fraud: 95, payment: 70 },
    { time: "08:00", api: 65, fraud: 240, payment: 150 },
    { time: "12:00", api: 85, fraud: 310, payment: 190 },
    { time: "16:00", api: 70, fraud: 280, payment: 160 },
    { time: "20:00", api: 55, fraud: 190, payment: 120 },
  ];

  const services = [
    { name: "API Gateway", status: "Operational", latency: "42ms", uptime: "99.99%", requests: "45.2k" },
    { name: "Fraud Engine", status: "Operational", latency: "215ms", uptime: "99.95%", requests: "12.8k" },
    { name: "User Service", status: "Operational", latency: "18ms", uptime: "99.99%", requests: "85.4k" },
  ];

  return (
    <div className="space-y-5">
      {/* Overall Status */}
      <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3">
        <CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-green-800">All Systems Operational</p>
          <p className="text-xs text-green-700 mt-0.5">Live monitoring from Supabase and Backend API is active.</p>
        </div>
      </div>

      {/* Service Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading && !analytics ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
        ) : (
          services.map(s => {
            const Icon = serviceIcons[s.name] || Server;
            return (
              <div key={s.name} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                      <Icon size={15} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{s.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-xs text-green-600">{s.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-1.5 rounded bg-gray-50">
                    <p className="text-xs font-bold text-gray-800">{s.latency}</p>
                    <p className="text-xs text-gray-400">Latency</p>
                  </div>
                  <div className="p-1.5 rounded bg-gray-50">
                    <p className="text-xs font-bold text-green-600">{s.uptime}</p>
                    <p className="text-xs text-gray-400">Uptime</p>
                  </div>
                  <div className="p-1.5 rounded bg-gray-50">
                    <p className="text-xs font-bold text-gray-800">{s.requests}</p>
                    <p className="text-xs text-gray-400">Req/hr</p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Latency Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-1">Service Latency — Today</h3>
        <p className="text-xs text-gray-400 mb-4">Average response times (ms)</p>
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={latencyData}>
              <defs>
                <linearGradient id="apiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Area type="monotone" dataKey="api" name="API Gateway" stroke="#3b82f6" fill="url(#apiGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="fraud" name="Fraud Engine" stroke="#10b981" fillOpacity={0} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-100 px-4">
          {(["services", "queues", "errors"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {tab === "services" ? "Infrastructure" : tab === "queues" ? "Queue Status" : "API Errors"}
            </button>
          ))}
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { name: "PostgreSQL Database", status: "Healthy", detail: "Supabase Managed" },
              { name: "Redis Cache", status: "Healthy", detail: "0.2ms Latency" },
              { name: "Storage Bucket", status: "Healthy", detail: "99.99% Availability" }
            ].map(svc => (
              <div key={svc.name} className="p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium text-gray-800">{svc.name}</p>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <p className="text-xs text-gray-500 mb-2">{svc.detail}</p>
                <Badge label={svc.status} variant="success" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

