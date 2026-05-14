import { Loan } from "../types";
import { DataTable } from "../../../components/shared/DataTable";
import { Badge } from "../../../components/Badge";
import { ProgressBar } from "../../../components/shared/ProgressBar";

interface LoanTableProps {
  loans: Loan[];
  selectedLoanId?: string;
  onSelectLoan: (loan: Loan) => void;
}

export function LoanTable({ loans, selectedLoanId, onSelectLoan }: LoanTableProps) {
  const headers = ["ID", "Applicant", "Amount", "Type", "Status", "Date"];

  return (
    <DataTable headers={headers}>
      {loans.map(loan => (
        <tr 
          key={loan.id} 
          onClick={() => onSelectLoan(loan)} 
          className={`border-b border-gray-50 cursor-pointer transition-colors ${selectedLoanId === loan.id ? "bg-blue-50" : "hover:bg-gray-50/50"}`}
        >
          <td className="px-4 py-3 font-mono text-xs text-gray-700">{loan.id.slice(0, 8)}</td>
          <td className="px-4 py-3">
            <p className="font-medium text-gray-800">{loan.users?.full_name || 'Unknown'}</p>
          </td>
          <td className="px-4 py-3 font-semibold text-gray-800">₹{(loan.amount || 0).toLocaleString()}</td>
          <td className="px-4 py-3 text-xs text-gray-600">{loan.loan_type}</td>
          <td className="px-4 py-3">
            <Badge
              label={loan.status}
              variant={
                loan.status === "active" ? "success" : 
                loan.status === "pending" ? "warning" : 
                loan.status === "closed" ? "neutral" : "danger"
              }
            />
          </td>
          <td className="px-4 py-3 text-xs text-gray-400 font-mono">
            {new Date(loan.created_at).toLocaleDateString()}
          </td>
        </tr>
      ))}
      {loans.length === 0 && (
        <tr>
          <td colSpan={6} className="px-4 py-8 text-center text-gray-500 text-sm">
            No loans found matching your criteria.
          </td>
        </tr>
      )}
    </DataTable>
  );
}
