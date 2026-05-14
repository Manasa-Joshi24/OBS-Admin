import { LucideIcon } from "lucide-react";
import { StatusBadge } from "../../../components/shared/StatusBadge";

interface ServiceMetric {
  label: string;
  value: string;
  color?: string;
}

interface ServiceCardProps {
  name: string;
  status: string;
  icon?: LucideIcon;
  metrics?: ServiceMetric[];
  detail?: string;
  variant?: "health" | "infra";
}

export function ServiceCard({ name, status, icon: Icon, metrics, detail, variant = "health" }: ServiceCardProps) {
  const isOperational = status === "Operational" || status === "Healthy";
  const isWarning = status === "Degraded" || status === "Warning";
  
  if (variant === "infra") {
    return (
      <div className="p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm hover:border-gray-200 transition-all">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-sm font-medium text-gray-800">{name}</p>
          <div className={`w-2 h-2 rounded-full ${isOperational ? "bg-green-500" : isWarning ? "bg-amber-500" : "bg-red-500"} shadow-sm`} />
        </div>
        {detail && <p className="text-xs text-gray-500 mb-2 leading-relaxed">{detail}</p>}
        <StatusBadge status={status} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-blue-100 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${isOperational ? "bg-green-50 group-hover:bg-green-100" : "bg-amber-50 group-hover:bg-amber-100"}`}>
            {Icon && <Icon size={16} className={isOperational ? "text-green-600" : "text-amber-600"} />}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-800">{name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isOperational ? "bg-green-500" : "bg-amber-500"} animate-pulse`} />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isOperational ? "text-green-600" : "text-amber-600"}`}>{status}</span>
            </div>
          </div>
        </div>
      </div>
      {metrics && (
        <div className="grid grid-cols-3 gap-2 text-center">
          {metrics.map((m, idx) => (
            <div key={idx} className="p-2 rounded bg-gray-50/80 group-hover:bg-white transition-colors">
              <p className={`text-[11px] font-bold ${m.color || "text-gray-800"} truncate`}>{m.value}</p>
              <p className="text-[10px] text-gray-400 font-medium">{m.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
