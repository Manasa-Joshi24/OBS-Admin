import { Loan } from "../types";

interface ApproveModalProps {
  loan: Loan;
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
}

export function ApproveModal({ loan, isOpen, onClose, onApprove }: ApproveModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
        <h3 className="font-semibold text-gray-800 mb-1 text-lg">Approve Loan: {loan.id}</h3>
        <p className="text-sm text-gray-500 mb-5">Confirm loan details before disbursement. This requires manager approval for amounts above $100,000.</p>
        
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 space-y-2 text-sm mb-5">
          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-500">Applicant</span>
            <span className="font-medium text-gray-900">{loan.applicant}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-500">Amount</span>
            <span className="font-medium text-gray-900">{loan.amount}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-500">Rate</span>
            <span className="font-medium text-gray-900">{loan.rate}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-500">Term</span>
            <span className="font-medium text-gray-900">{loan.term}</span>
          </div>
        </div>
        
        <textarea 
          placeholder="Approval notes (optional)..." 
          className="w-full p-3 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none h-20 resize-none mb-5 shadow-sm focus:ring-2 focus:ring-blue-500/30 transition-all" 
        />
        
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button 
            onClick={onApprove} 
            className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm"
          >
            Approve & Disburse
          </button>
        </div>
      </div>
    </div>
  );
}
