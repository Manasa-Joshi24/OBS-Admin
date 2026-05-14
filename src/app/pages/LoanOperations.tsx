import { useEffect, useState, useMemo } from "react";
import { Banknote, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { LoanFilters } from "../features/loans/components/LoanFilters";
import { LoanTable } from "../features/loans/components/LoanTable";
import { LoanDetailsPanel } from "../features/loans/components/LoanDetailsPanel";
import { ApproveModal } from "../features/loans/components/ApproveModal";
import { Loan } from "../features/loans/types";
import { TableRowSkeleton, StatCardSkeleton } from "../components/Skeleton";
import { useAdminStore } from "../store/adminStore";

export function LoanOperations() {
  const { loans, analytics, loading, fetchLoans, fetchAnalytics } = useAdminStore();
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<any | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);

  useEffect(() => {
    fetchLoans();
    fetchAnalytics();
  }, [fetchLoans, fetchAnalytics]);

  const filtered = useMemo(() => {
    if (!Array.isArray(loans)) return [];
    return loans.filter(l => statusFilter === "All" || l.status?.toLowerCase() === statusFilter.toLowerCase());
  }, [loans, statusFilter]);

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
            <StatCard title="Active Loans" value={analytics?.totalLoans?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={Banknote} iconColor="text-blue-600" iconBg="bg-blue-50" />
            <StatCard title="Pending Approval" value={analytics?.pendingLoans?.toLocaleString() ?? "0"} change="—" trend="neutral" icon={Clock} iconColor="text-amber-600" iconBg="bg-amber-50" />
            <StatCard title="Overdue Accounts" value="0" change="—" trend="neutral" icon={AlertTriangle} iconColor="text-red-600" iconBg="bg-red-50" />
            <StatCard title="System Flags" value="0" change="—" trend="neutral" icon={CheckCircle} iconColor="text-green-600" iconBg="bg-green-50" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Main List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <LoanFilters 
            statusFilter={statusFilter} 
            onStatusFilterChange={setStatusFilter} 
          />
          {loading ? (
            <div className="p-4 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={6} />)}
            </div>
          ) : (
            <LoanTable 
              loans={filtered} 
              selectedLoanId={selected?.id} 
              onSelectLoan={setSelected} 
            />
          )}
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-1 sticky top-4 h-[calc(100vh-8rem)]">
          <LoanDetailsPanel 
            loan={selected} 
            onApproveModalOpen={() => setShowApproveModal(true)} 
          />
        </div>
      </div>

      {selected && (
        <ApproveModal 
          loan={selected} 
          isOpen={showApproveModal} 
          onClose={() => setShowApproveModal(false)} 
          onApprove={() => setShowApproveModal(false)} 
        />
      )}
    </div>
  );
}
