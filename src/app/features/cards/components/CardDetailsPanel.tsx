import { CreditCard, Settings2, ShieldAlert, RefreshCw, Ban, Lock, Unlock } from "lucide-react";
import { Card } from "../types";
import { Badge } from "../../../components/Badge";

interface CardDetailsPanelProps {
  card: Card | null;
  onModifyLimits: () => void;
}

export function CardDetailsPanel({ card, onModifyLimits }: CardDetailsPanelProps) {
  if (!card) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 h-full flex flex-col items-center justify-center min-h-[400px] text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
          <CreditCard size={32} className="text-gray-300" />
        </div>
        <h4 className="text-gray-900 font-semibold mb-1">No Card Selected</h4>
        <p className="text-sm text-gray-500 max-w-[200px]">Select a card from the list to view its details and management options.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full min-h-0 overflow-hidden">
      <div className="p-5 border-b border-gray-50 shrink-0">
        <h3 className="font-bold text-slate-900">Card Management</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        {/* Card Visual */}
        <div className="relative h-44 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 p-6 text-white overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-blue-400/10 translate-y-1/2 -translate-x-1/2 blur-xl" />
          
          <div className="flex justify-between items-start relative z-10">
            <p className="text-xs font-bold tracking-[0.2em] opacity-80 uppercase">Vertex Premium</p>
            <div className="w-10 h-7 bg-amber-400/20 rounded-md backdrop-blur-sm border border-amber-400/30 flex items-center justify-center">
              <div className="w-6 h-4 bg-amber-400/40 rounded-sm" />
            </div>
          </div>
          
          <p className="font-mono text-xl mt-6 tracking-[0.25em] relative z-10">•••• •••• •••• {card.card_number?.slice(-4)}</p>
          
          <div className="flex items-end justify-between mt-6 relative z-10">
            <div>
              <p className="text-[10px] opacity-50 uppercase tracking-wider mb-0.5">Cardholder</p>
              <p className="text-sm font-semibold tracking-wide">{card.users?.full_name?.toUpperCase() || 'UNKNOWN'}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] opacity-50 uppercase tracking-wider mb-0.5">Expiry</p>
              <p className="font-mono text-sm">{card.expiry_date}</p>
            </div>
          </div>
        </div>
        
        {/* Details List */}
        <div className="space-y-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Specifications</p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { label: "Card ID", value: card.id },
              { label: "Card Type", value: card.card_type },
              { label: "Status", value: card.status },
              { label: "Account No.", value: card.accounts?.account_number },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">{row.label}</span>
                <span className="font-semibold text-slate-900">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="space-y-2 pt-2 border-t border-gray-50">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Actions</p>
          
          <button 
            onClick={onModifyLimits} 
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-[0.98]"
          >
            <Settings2 size={18} />
            Modify Card
          </button>
          
          <button className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all active:scale-[0.98]">
            <Unlock size={18} />
            Unblock Card
          </button>

          <button className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition-all active:scale-[0.98]">
            <Lock size={18} />
            Block Card
          </button>

          <button className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98]">
            <RefreshCw size={18} />
            Replace Card
          </button>
        </div>
      </div>
    </div>
  );
}
