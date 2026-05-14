import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  subtitle?: string;
}

export function StatCard({ title, value, change, trend, icon: Icon, iconColor = "text-blue-600", iconBg = "bg-blue-50", subtitle }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon size={18} className={iconColor} />
        </div>
      </div>
      {change && (
        <div className="flex items-center gap-1">
          {trend === "up" && <TrendingUp size={12} className="text-green-500" />}
          {trend === "down" && <TrendingDown size={12} className="text-red-500" />}
          {trend === "neutral" && <Minus size={12} className="text-gray-400" />}
          <span className={`text-xs font-medium ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"}`}>
            {change}
          </span>
        </div>
      )}
    </div>
  );
}
