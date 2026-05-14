import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, FileText, RefreshCw, Eye } from "lucide-react";
import { Badge } from "../components/Badge";
import { StatCard } from "../components/StatCard";
import { TableRowSkeleton, StatCardSkeleton } from "../components/Skeleton";
import { useAdminStore } from "../store/adminStore";

export function KYCReview() {
  const { users, analytics, loading, fetchUsers, fetchAnalytics, verifyKYC } = useAdminStore();
  const [selected, setSelected] = useState<any | null>(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchAnalytics();
  }, [fetchUsers, fetchAnalytics]);

  const filtered = (Array.isArray(users) ? users : []).filter(u => filterStatus === "All" || u.kyc_status === filterStatus.toLowerCase());

  const handleVerify = async (status: string) => {
    if (selected) {
      await verifyKYC(selected.user_id, status, reason);
      setShowApprove(false);
      setShowReject(false);
      setSelected(null);
      setReason("");
    }
  };

  return (
    <div className="space-y-5">
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
            <StatCard title="Pending Review" value={analytics?.pendingKyc?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={Clock} iconColor="text-amber-600" iconBg="bg-amber-50" />
            <StatCard title="Total Users" value={analytics?.totalUsers?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={Eye} iconColor="text-blue-600" iconBg="bg-blue-50" />
            <StatCard title="Active Users" value={analytics?.activeUsers?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={CheckCircle} iconColor="text-green-600" iconBg="bg-green-50" />
            <StatCard title="Security Flags" value="0" change="—" trend="neutral" icon={XCircle} iconColor="text-red-600" iconBg="bg-red-50" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Applications List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">KYC Applications</h3>
            <div className="flex gap-1 overflow-x-auto pb-2 sm:pb-0">
              {["All", "Pending", "Verified", "Rejected"].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors whitespace-nowrap ${filterStatus === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Applicant</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && users.length === 0 ? (
                  Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={3} />)
                ) : filtered.length > 0 ? (
                  filtered.map(app => (
                    <tr
                      key={app.user_id}
                      onClick={() => setSelected(app)}
                      className={`border-b border-gray-50 cursor-pointer transition-colors ${selected?.user_id === app.user_id ? "bg-blue-50" : "hover:bg-gray-50/50"}`}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{app.full_name}</p>
                        <p className="text-xs text-gray-400">{app.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          label={app.kyc_status}
                          variant={app.kyc_status === "verified" ? "success" : app.kyc_status === "rejected" ? "danger" : "warning"}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {app.kyc_status === "pending" ? (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); setSelected(app); setShowApprove(true); }} className="p-1.5 rounded hover:bg-green-50 text-green-600" title="Approve">
                                <CheckCircle size={14} />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setSelected(app); setShowReject(true); }} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="Reject">
                                <XCircle size={14} />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <FileText size={32} className="mb-2 opacity-20" />
                        <p>No KYC applications found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Review Application</h3>
                <Badge label={selected.kyc_status} variant={selected.kyc_status === "verified" ? "success" : "warning"} />
              </div>
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Full Name</p>
                <p className="text-sm font-medium text-gray-800">{selected.full_name}</p>
                <p className="text-xs text-gray-500 mt-2 uppercase font-bold mb-1">Email Address</p>
                <p className="text-sm font-medium text-gray-800">{selected.email}</p>
              </div>
              {selected.kyc_status === "pending" && (
                <div className="space-y-2">
                  <button onClick={() => setShowApprove(true)} className="w-full py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium">Approve</button>
                  <button onClick={() => setShowReject(true)} className="w-full py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium">Reject</button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <FileText size={32} className="text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">Select an application to review</p>
            </div>
          )}
        </div>
      </div>

      {/* Approve Modal */}
      {showApprove && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="font-semibold text-gray-800 mb-1">Approve KYC: {selected.full_name}</h3>
            <p className="text-sm text-gray-500 mb-4">Set a risk rating and leave optional notes before approving.</p>
            <div className="flex gap-2 mt-4 justify-end">
              <button onClick={() => setShowApprove(false)} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleVerify('verified')} className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700">Confirm Approval</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showReject && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="font-semibold text-gray-800 mb-1">Reject KYC: {selected.full_name}</h3>
            <p className="text-sm text-gray-500 mb-4">Select a rejection reason.</p>
            <textarea 
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Reason for rejection..." 
              className="w-full p-3 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none h-20 resize-none" 
            />
            <div className="flex gap-2 mt-4 justify-end">
              <button onClick={() => setShowReject(false)} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleVerify('rejected')} className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
