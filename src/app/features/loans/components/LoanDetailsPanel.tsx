import { Banknote, Activity, Lock, Unlock } from "lucide-react";
import { Loan } from "../types";
import { Badge } from "../../../components/Badge";

interface LoanDetailsPanelProps {
  loan: Loan | null;
  onApproveModalOpen: () => void;
}

export function LoanDetailsPanel({ loan, onApproveModalOpen }: LoanDetailsPanelProps) {
  if (!loan) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 h-full flex flex-col items-center justify-center min-h-[300px] text-center">
        <Banknote size={32} className="text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">Select a loan to view details</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Loan Details</h3>
          <Badge
            label={loan.status}
            variant={
              loan.status === "active" ? "success" : 
              loan.status === "pending" ? "warning" : 
              loan.status === "closed" ? "neutral" : "danger"
            }
          />
        </div>
        
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 shadow-sm">
          <p className="text-xs text-blue-600 font-medium tracking-wide uppercase">Loan Amount</p>
          <p className="text-2xl font-bold text-blue-700 mt-0.5">₹{(loan.loan_amount || 0).toLocaleString()}</p>
          <p className="text-xs text-blue-500 mt-1">{loan.loan_type}</p>
        </div>
        
        <div className="space-y-2 text-sm">
          {[
            { label: "Loan ID", value: loan.id.slice(0, 8) },
            { label: "Applicant", value: loan.users?.full_name },
            { label: "Interest Rate", value: `${loan.interest_rate}%` },
            { label: "Status", value: loan.status },
            { label: "Created", value: new Date(loan.created_at).toLocaleDateString() },
          ].map(row => (
            <div key={row.label} className="flex justify-between items-center py-0.5">
              <span className="text-gray-500">{row.label}</span>
              <span className="font-medium text-gray-800">
                {row.value}
              </span>
            </div>
          ))}
        </div>
        <div className="space-y-2 pt-2">
          {(loan.status === "pending") && (
            <>
              <button onClick={onApproveModalOpen} className="w-full py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm">
                Approve Loan
              </button>
              <button className="w-full py-2 text-sm font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors shadow-sm">
                Reject Application
              </button>
              <button className="w-full py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors shadow-sm">
                Request More Info
              </button>
            </>
          )}
          
          {loan.status === "active" && (
            <>
              <button className="w-full py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm">
                View EMI Schedule
              </button>
              <button className="w-full py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors shadow-sm">
                Apply Adjustment
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
