import { useEffect, useState } from "react";
import { FileBarChart, Download, Clock, CheckCircle, AlertCircle, FileText, Filter } from "lucide-react";
import { Badge } from "../components/Badge";
import api from "../utils/api";
import { TableRowSkeleton, StatCardSkeleton, Skeleton } from "../components/Skeleton";

export function Reports() {
  const [reportTypes, setReportTypes] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<any | null>(null);
  const [showGenerate, setShowGenerate] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [typesRes, recentRes, statsRes] = await Promise.all([
          api.get("/reports/types"),
          api.get("/reports/recent"),
          api.get("/reports/stats")
        ]);
        const extractData = (res: any) => Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
        const extractObject = (res: any) => (res.data?.data && typeof res.data.data === 'object' && !Array.isArray(res.data.data)) ? res.data.data : res.data;
        
        setReportTypes(extractData(typesRes));
        setRecentReports(extractData(recentRes));
        setStats(extractObject(statsRes));
      } catch (error) {
        console.error("Failed to fetch reports data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = ["All", ...Array.from(new Set(Array.isArray(reportTypes) ? reportTypes.map(r => r.category) : []))];
  const filtered = Array.isArray(reportTypes) 
    ? reportTypes.filter(r => categoryFilter === "All" || r.category === categoryFilter)
    : [];

  return (
    <div className="space-y-5">
      {/* Stats */}
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
              <p className="text-xs text-gray-500 font-medium">Reports Generated Today</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{stats?.generatedToday?.toLocaleString() ?? "0"}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 font-medium">Processing</p>
              <p className="text-2xl font-semibold text-amber-600 mt-1">{stats?.processing?.toLocaleString() ?? "0"}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 font-medium">Failed Jobs</p>
              <p className="text-2xl font-semibold text-red-600 mt-1">{stats?.failed?.toLocaleString() ?? "0"}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 font-medium">Scheduled Reports</p>
              <p className="text-2xl font-semibold text-blue-600 mt-1">{stats?.scheduled?.toLocaleString() ?? "0"}</p>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Report Types */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Available Reports</h3>
            <div className="flex gap-1 flex-wrap">
              {categories.map(c => (
                <button key={c} onClick={() => setCategoryFilter(c)} className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${categoryFilter === c ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
            ) : filtered.length > 0 ? (
              filtered.map(report => (
                <div
                  key={report.id}
                  onClick={() => { setSelectedType(report); setShowGenerate(false); }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedType?.id === report.id ? "border-blue-300 bg-blue-50" : "border-gray-100 hover:border-gray-200 bg-gray-50/50 hover:bg-gray-50"}`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <FileBarChart size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{report.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{report.desc}</p>
                      <span className="inline-block mt-1.5 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">{report.category}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-8 text-center text-gray-400">No report types found</div>
            )}
          </div>
        </div>

        {/* Generate Panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          {selectedType ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">{selectedType.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{selectedType.desc}</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" className="p-2 text-xs rounded-lg border border-gray-200 bg-gray-50 outline-none" />
                    <input type="date" className="p-2 text-xs rounded-lg border border-gray-200 bg-gray-50 outline-none" />
                  </div>
                </div>
                {(selectedType.id === "account-statement") && (
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Account ID</label>
                    <input type="text" placeholder="e.g. ACC001" className="w-full p-2 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none" />
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Export Format</label>
                  <select className="w-full p-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none">
                    <option>PDF</option>
                    <option>CSV</option>
                    <option>Admin Format (JSON)</option>
                  </select>
                </div>
              </div>
              <button className="w-full py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">Generate Report</button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <FileBarChart size={32} className="text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">Select a report type to generate</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Recent Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Report</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Generated</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Format</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={6} />)
              ) : recentReports.length > 0 ? (
                recentReports.map(r => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-gray-400" />
                        <span className="font-medium text-gray-800">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{r.type}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.generated}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 font-medium">{r.format}</td>
                    <td className="px-4 py-3">
                      <Badge label={r.status} variant={r.status === "Ready" ? "success" : r.status === "Processing" ? "warning" : "danger"} />
                    </td>
                    <td className="px-4 py-3">
                      {r.status === "Ready" ? (
                        <button className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                          <Download size={12} /> Download {r.size}
                        </button>
                      ) : r.status === "Failed" ? (
                        <button className="text-xs text-red-600 hover:underline">Retry</button>
                      ) : (
                        <span className="text-xs text-gray-400">Processing...</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">No recent reports found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
