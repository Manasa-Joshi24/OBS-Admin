import { GitMerge, RefreshCw } from "lucide-react";
import { StatusBadge } from "../../../components/shared/StatusBadge";

interface LedgerEntry {
  id: string;
  txnId: string;
  type: string;
  amount: string;
  account: string;
  posted: string;
  settlement: string;
  status: string;
  mismatch: string | null;
}

interface ReconciliationDetailsPanelProps {
  selected: LedgerEntry | null;
  onReprocess?: (id: string) => void;
}

export function ReconciliationDetailsPanel({ selected, onReprocess }: ReconciliationDetailsPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 h-fit">
      {selected ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Entry Details</h3>
            <StatusBadge status={selected.status} />
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: "Ledger ID", value: selected.id },
              { label: "TXN ID", value: selected.txnId },
              { label: "Amount", value: selected.amount },
              { label: "Type", value: selected.type },
              { label: "Account", value: selected.account },
              { label: "Posted At", value: selected.posted },
              { label: "Settlement", value: selected.settlement },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-center">
                <span className="text-gray-500">{row.label}</span>
                <span className="font-medium text-gray-800 text-right text-xs">{row.value}</span>
              </div>
            ))}
          </div>
          {selected.mismatch && (
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-xs font-medium text-amber-700 mb-0.5">Mismatch Details</p>
              <p className="text-xs text-amber-600">{selected.mismatch}</p>
            </div>
          )}
          <div className="space-y-2">
            {selected.status !== "Matched" && (
              <>
                <button 
                  onClick={() => onReprocess?.(selected.id)}
                  className="w-full py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw size={13} /> Reprocess Entry
                </button>
                <button className="w-full py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                  Flag for Manual Review
                </button>
              </>
            )}
            <button className="w-full py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
              View Transaction History
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <GitMerge size={32} className="text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">Select a ledger entry to inspect</p>
        </div>
      )}
    </div>
  );
}
