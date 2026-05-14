import { DataTable } from "../../../components/shared/DataTable";
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

interface ReconciliationTableProps {
  entries: LedgerEntry[];
  selectedId?: string;
  onSelect: (entry: LedgerEntry) => void;
}

export function ReconciliationTable({ entries, selectedId, onSelect }: ReconciliationTableProps) {
  const headers = ["Ledger ID", "TXN ID", "Amount", "Type", "Posted", "Status"];

  return (
    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
      <DataTable headers={headers}>
        {entries.map((entry) => (
          <tr 
            key={entry.id} 
            onClick={() => onSelect(entry)} 
            className={`border-b border-gray-50 cursor-pointer transition-colors ${
              selectedId === entry.id ? "bg-blue-50" : "hover:bg-gray-50/50"
            }`}
          >
            <td className="px-4 py-3 font-mono text-xs text-gray-600">{entry.id}</td>
            <td className="px-4 py-3 font-mono text-xs text-gray-700">{entry.txnId}</td>
            <td className="px-4 py-3 font-semibold text-gray-800">{entry.amount}</td>
            <td className="px-4 py-3">
              <StatusBadge status={entry.type} />
            </td>
            <td className="px-4 py-3 text-xs text-gray-500">{entry.posted}</td>
            <td className="px-4 py-3">
              <StatusBadge status={entry.status} />
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
