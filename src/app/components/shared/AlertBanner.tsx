import { AlertTriangle, LucideIcon } from "lucide-react";

interface AlertBannerProps {
  title?: string;
  message: string;
  icon?: LucideIcon;
  variant?: "warning" | "info" | "danger" | "success";
}

export function AlertBanner({ title, message, icon: Icon = AlertTriangle, variant = "warning" }: AlertBannerProps) {
  const styles = {
    warning: "bg-amber-50 border-amber-200 text-amber-800 icon-text-amber-600",
    info: "bg-blue-50 border-blue-200 text-blue-800 icon-text-blue-600",
    danger: "bg-red-50 border-red-200 text-red-800 icon-text-red-600",
    success: "bg-green-50 border-green-200 text-green-800 icon-text-green-600",
  };

  const currentStyle = styles[variant];
  const iconColor = currentStyle.split(" ").pop()?.replace("icon-text-", "text-") || "text-amber-600";

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 ${currentStyle.split(" ").slice(0, 2).join(" ")}`}>
      <Icon size={16} className={`${iconColor} mt-0.5 shrink-0`} />
      <div>
        {title && <p className="text-sm font-semibold mb-0.5">{title}</p>}
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
