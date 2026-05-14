import { useEffect, useState } from "react";
import { ShieldAlert, AlertTriangle, CheckCircle, Sliders, MapPin, Smartphone, Eye, TrendingUp, RefreshCw } from "lucide-react";
import { Badge } from "../components/Badge";
import { StatCard } from "../components/StatCard";
import api from "../utils/api";
import { TableRowSkeleton, StatCardSkeleton, Skeleton } from "../components/Skeleton";

export function FraudRisk() {
  const [fraudCases, setFraudCases] = useState<any[]>([]);
  const [riskRules, setRiskRules] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"cases" | "rules" | "watchlist">("cases");
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [casesRes, rulesRes, statsRes] = await Promise.all([
          api.get("/fraud/cases"),
          api.get("/fraud/rules"),
          api.get("/fraud/stats")
        ]);
        setFraudCases(casesRes.data);
        setRiskRules(rulesRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Failed to fetch fraud data:", error);
        setFraudCases([]);
        setRiskRules([]);
        setStats({ openCases: 0, avgRisk: 0, clearedToday: 0, blockedAccounts: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
            <StatCard title="Open Fraud Cases" value={stats?.openCases?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={ShieldAlert} iconColor="text-red-600" iconBg="bg-red-50" />
            <StatCard title="Avg Risk Score" value={stats?.avgRisk?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={TrendingUp} iconColor="text-amber-600" iconBg="bg-amber-50" />
            <StatCard title="Cleared Today" value={stats?.clearedToday?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={CheckCircle} iconColor="text-green-600" iconBg="bg-green-50" />
            <StatCard title="Blocked Accounts" value={stats?.blockedAccounts?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={AlertTriangle} iconColor="text-purple-600" iconBg="bg-purple-50" />
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-100 px-4">
          {(["cases", "rules", "watchlist"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              {tab === "cases" ? "Fraud Cases" : tab === "rules" ? "Risk Rules" : "Watchlists"}
            </button>
          ))}
        </div>

        {activeTab === "cases" && (
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Cases List */}
            <div className="lg:col-span-2 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Case</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Score</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={5} />)
                  ) : fraudCases.length > 0 ? (
                    fraudCases.map(c => (
                      <tr key={c.id} onClick={() => setSelected(c)} className={`border-b border-gray-50 cursor-pointer transition-colors ${selected?.id === c.id ? "bg-blue-50" : "hover:bg-gray-50/50"}`}>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800">{c.id}</p>
                          <p className="text-xs text-gray-400">{c.user}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">{c.type}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 h-1.5 rounded-full bg-gray-200">
                              <div className={`h-1.5 rounded-full ${c.score > 70 ? "bg-red-500" : c.score > 40 ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${c.score}%` }} />
                            </div>
                            <span className="text-xs font-bold text-gray-700">{c.score}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            label={c.status}
                            variant={c.status === "Open" ? "danger" : c.status === "Escalated" ? "warning" : c.status === "Under Review" ? "info" : "success"}
                          />
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{c.time}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-gray-500 flex flex-col items-center">
                        <ShieldAlert size={32} className="mb-2 opacity-20" />
                        <p>No fraud cases found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Case Detail */}
            <div className="border-l border-gray-100 p-4">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : selected ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">{selected.id}</h3>
                    <Badge label={selected.status} variant={selected.status === "Open" ? "danger" : selected.status === "Escalated" ? "warning" : "info"} />
                  </div>
                  <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                    <p className="text-xs text-red-600 font-medium mb-0.5">{selected.type}</p>
                    <p className="text-sm text-red-800">{selected.details}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">User</span><span className="font-medium text-gray-800">{selected.user}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Reported</span><span className="font-medium text-gray-800">{selected.time}</span></div>
                    <div>
                      <span className="text-gray-500">Risk Score</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 rounded-full bg-gray-200">
                          <div className={`h-2 rounded-full ${selected.score > 70 ? "bg-red-500" : "bg-amber-500"}`} style={{ width: `${selected.score}%` }} />
                        </div>
                        <span className="text-sm font-bold text-red-600">{selected.score}/100</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button className="w-full py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700">Escalate Case</button>
                    <button className="w-full py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Clear / Mark Safe</button>
                    <button className="w-full py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600">Add to Watchlist</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <ShieldAlert size={32} className="text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">Select a fraud case</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "rules" && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">Configure risk rules, thresholds, and detection policies.</p>
              <button className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">+ Add Rule</button>
            </div>
            <div className="space-y-2">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
              ) : riskRules.length > 0 ? (
                riskRules.map(rule => (
                  <div key={rule.id} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 bg-gray-50/50">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <Sliders size={14} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{rule.name}</p>
                      <p className="text-xs text-gray-500">{rule.category} · {rule.value}</p>
                    </div>
                    <Badge label={rule.status} variant={rule.status === "Active" ? "success" : "warning"} />
                    <button className="text-xs text-blue-600 hover:underline shrink-0">Edit</button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                   <Sliders size={32} className="mx-auto mb-2 opacity-20" />
                   <p>No risk rules defined</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "watchlist" && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">Manage high-risk users, safe lists, and segments.</p>
              <button className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">+ Add to Watchlist</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "High-Risk Watchlist", count: 284, color: "red", users: ["Mohammed Al-Rashid", "Viktor Petrov", "Kwame Asante"] },
                { label: "Under Monitoring", count: 1420, color: "amber", users: ["Fatima Al-Hassan", "Tariq Hussain", "Samuel Osei"] },
                { label: "Safe List", count: 892, color: "green", users: ["Elena Vasquez", "Priya Mehta", "Adaeze Okonkwo"] },
              ].map(list => (
                <div key={list.label} className={`p-4 rounded-xl border border-${list.color}-100 bg-${list.color}-50/30`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-800">{list.label}</p>
                    <span className={`text-xs font-medium text-${list.color}-700 bg-${list.color}-100 px-2 py-0.5 rounded-full`}>{list.count}</span>
                  </div>
                  <div className="space-y-1.5">
                    {list.users.map(u => (
                      <div key={u} className="flex items-center gap-2 text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        {u}
                      </div>
                    ))}
                    <p className="text-xs text-gray-400 mt-2">+ {list.count - 3} more</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
