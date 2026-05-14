import { LucideIcon } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}

export function Button({ children, onClick, icon: Icon, variant = "primary", className = "" }: ButtonProps) {
  const baseStyles = "flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all font-medium";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm",
    secondary: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 active:scale-95",
    danger: "bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-sm",
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={13} />}
      {children}
    </button>
  );
}
