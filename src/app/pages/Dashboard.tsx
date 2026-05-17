import { useState, useEffect } from "react";
import { 
  Users, Landmark, ArrowLeftRight, XCircle, ShieldAlert, 
  FileText, Lock, RefreshCw, UserCheck, ChevronRight, Clock,
  AlertTriangle, Activity, Bell
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StatCard } from "../components/StatCard";
import { Badge } from "../components/Badge";
import { StatCardSkeleton, Skeleton } from "../components/Skeleton";
import { useAdminStore } from "../store/adminStore";

export function Dashboard() {
  const { transactions, analytics, chartData, loading, fetchSortedTransactions, fetchFraudAnalysis, fetchAnalytics, fetchChartData } = useAdminStore();
  const [chartFilter, setChartFilter] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [alertFilter, setAlertFilter] = useState<"All" | "Fraud" | "System" | "KYC">("All");

  useEffect(() => {
    fetchSortedTransactions();
    fetchFraudAnalysis();
    fetchAnalytics();
    fetchChartData();
  }, [fetchSortedTransactions, fetchFraudAnalysis, fetchAnalytics, fetchChartData]);

  return (
    <div className="space-y-6">
      {/* Stats Row 1 */}
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
            <StatCard title="Total Users" value={analytics?.totalUsers?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50" />
            <StatCard title="Active Users" value={analytics?.activeUsers?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={Landmark} iconColor="text-green-600" iconBg="bg-green-50" />
            <StatCard title="Pending KYC" value={analytics?.pendingKyc?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={FileText} iconColor="text-amber-600" iconBg="bg-amber-50" />
            <StatCard title="Security Flags" value={analytics?.securityFlags?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={Lock} iconColor="text-red-600" iconBg="bg-red-50" />
          </>
        )}
      </div>

      {/* Stats Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && !analytics ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard title="Today's Volume" value={`₹${analytics?.todayTransactionVolume?.toLocaleString() ?? "0"}`} change="—" trend="neutral" icon={ArrowLeftRight} iconColor="text-blue-600" iconBg="bg-blue-50" />
            <StatCard title="Today's Count" value={analytics?.todayTransactionCount?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={Clock} iconColor="text-amber-600" iconBg="bg-amber-50" />
            <StatCard title="Failed (24h)" value={analytics?.failedTransactions?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={XCircle} iconColor="text-red-600" iconBg="bg-red-50" />
          </>
        )}
      </div>

      {/* Charts + Pending Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Transaction Volume</h3>
              <p className="text-xs text-gray-400 mt-0.5">Success vs failed transactions</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={18} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
              <Bar dataKey="success" name="Success" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" name="Failed" fill="#fca5a5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-1">Critical Tasks</h3>
          <p className="text-xs text-gray-400 mb-4">Awaiting attention</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <FileText size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Pending KYC</p>
                  <p className="text-xs text-gray-400">Identity verification</p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-800">{analytics?.pendingKyc ?? 0}</span>
            </div>

            {/* Fraud Detection Panel (Graph DFS O(V+E)) */}
            <div className="flex flex-col p-3 rounded-lg bg-gray-50 border border-gray-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white ${analytics?.fraudData?.suspicious_cycles?.length > 0 ? "bg-red-500" : "bg-emerald-500"}`}>
                    <ShieldAlert size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Fraud Detection</p>
                    <p className="text-xs text-gray-400">Circular transfer analysis</p>
                  </div>
                </div>
                <Badge label={analytics?.fraudData?.suspicious_cycles?.length > 0 ? "Alert" : "Clean"} variant={analytics?.fraudData?.suspicious_cycles?.length > 0 ? "warning" : "success"} />
              </div>
              
              {analytics?.fraudData?.suspicious_cycles?.length > 0 ? (
                <div className="space-y-1 mt-2">
                  <p className="text-xs font-bold text-red-600">{analytics.fraudData.suspicious_cycles.length} cycles detected:</p>
                  {analytics.fraudData.suspicious_cycles.slice(0, 2).map((cycle: string[], i: number) => (
                    <div key={i} className="text-[10px] text-gray-600 truncate bg-white p-1 rounded border border-gray-200">
                      {cycle.join(' → ')}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-600 mt-1 font-medium pb-1">No circular transfers detected.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions (Merge Sorted O(n log n)) */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Recent Activity (Sorted Feed)</h3>
          <button className="text-xs text-blue-600 font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {(Array.isArray(transactions) ? transactions : []).slice(0, 10).map((tx: any) => (
            <div key={tx.transaction_id || tx.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${tx.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {tx.sender?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{tx.sender}</p>
                  <p className="text-xs text-gray-400">{new Date(tx.timestamp || tx.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">₹{tx.amount?.toLocaleString()}</p>
                <Badge label={tx.status} variant={tx.status === 'completed' ? 'success' : 'warning'} />
              </div>
            </div>
          ))}
          {transactions.length === 0 && !loading && (
            <div className="text-center py-6 text-gray-500 text-sm">
              <Activity size={24} className="mx-auto mb-2 opacity-20" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

