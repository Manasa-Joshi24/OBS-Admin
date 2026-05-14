import { Lock, Unlock, RefreshCw, CreditCard } from "lucide-react";
import { Card } from "../types";
import { DataTable } from "../../../components/shared/DataTable";
import { ActionButton } from "../../../components/shared/ActionButton";
import { Badge } from "../../../components/Badge";
import { TableRowSkeleton } from "../../../components/Skeleton";

interface CardTableProps {
  cards: Card[];
  selectedCardId?: string;
  onSelectCard: (card: Card) => void;
  loading?: boolean;
}

export function CardTable({ cards, selectedCardId, onSelectCard, loading }: CardTableProps) {
  const headers = ["Cardholder", "Card", "Type", "Status", "Expiry", "Actions"];

  return (
    <DataTable headers={headers}>
      {loading ? (
        Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} columns={6} />)
      ) : cards.length > 0 ? (
        cards.map(card => (
          <tr 
            key={card.id} 
            onClick={() => onSelectCard(card)} 
            className={`border-b border-gray-50 cursor-pointer transition-colors ${selectedCardId === card.id ? "bg-blue-50" : "hover:bg-gray-50/50"}`}
          >
            <td className="px-4 py-3">
              <p className="font-medium text-gray-800">{card.users?.full_name || 'Unknown'}</p>
              <p className="text-xs text-gray-400">{card.card_type}</p>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-5 rounded bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">VISA</span>
                </div>
                <span className="font-mono text-sm text-gray-700">{card.masked_card_number?.slice(-4) ?? '••••'}</span>
              </div>
            </td>
            <td className="px-4 py-3 text-xs text-gray-600">Debit</td>
            <td className="px-4 py-3">
              <Badge 
                label={card.status} 
                variant={card.status === "active" ? "success" : card.status === "frozen" ? "info" : "danger"} 
              />
            </td>
            <td className="px-4 py-3 text-xs text-gray-600 font-mono">{card.expiry_date}</td>
            <td className="px-4 py-3">
              <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                <ActionButton icon={<Lock size={14} />} title="Manage" variant="neutral" />
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
            <div className="flex flex-col items-center">
              <CreditCard size={32} className="mb-2 opacity-20" />
              <p>No cards found matching your criteria</p>
            </div>
          </td>
        </tr>
      )}
    </DataTable>
  );
}
