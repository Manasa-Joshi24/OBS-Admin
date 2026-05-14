import { Card } from "../types";

interface LimitModalProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export function LimitModal({ card, isOpen, onClose, onApply }: LimitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
        <h3 className="font-semibold text-gray-800 mb-4 text-lg">Modify Card Limits: •••• {card.last4}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-600 font-medium block mb-1.5">Spending Limit (USD)</label>
            <input 
              type="number" 
              defaultValue={5000} 
              className="w-full p-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-sm" 
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 font-medium block mb-1.5">Cash Withdrawal Limit (USD)</label>
            <input 
              type="number" 
              defaultValue={1000} 
              className="w-full p-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-sm" 
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 font-medium block mb-1.5">Merchant Controls</label>
            <select className="w-full p-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none shadow-sm cursor-pointer">
              <option>All merchants allowed</option>
              <option>Online only</option>
              <option>POS only</option>
              <option>Domestic only</option>
            </select>
          </div>
          <textarea 
            placeholder="Reason for change (required)..." 
            className="w-full p-3 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none h-20 resize-none shadow-sm focus:ring-2 focus:ring-blue-500/30 transition-all" 
          />
        </div>
        <div className="flex gap-2 mt-6 justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button 
            onClick={onApply} 
            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}
