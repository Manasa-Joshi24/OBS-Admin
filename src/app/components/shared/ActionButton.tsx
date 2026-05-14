import { ReactNode } from "react";

type ColorVariant = "blue" | "amber" | "green" | "purple" | "red" | "gray";

interface ActionButtonProps {
  icon: ReactNode;
  title: string;
  onClick?: (e: React.MouseEvent) => void;
  variant: ColorVariant;
}

export function ActionButton({ icon, title, onClick, variant }: ActionButtonProps) {
  const colorStyles = {
    blue: "hover:bg-blue-50 text-blue-600",
    amber: "hover:bg-amber-50 text-amber-600",
    green: "hover:bg-green-50 text-green-600",
    purple: "hover:bg-purple-50 text-purple-600",
    red: "hover:bg-red-50 text-red-600",
    gray: "hover:bg-gray-100 text-gray-600",
  };

  return (
    <button 
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${colorStyles[variant]}`} 
      title={title}
    >
      {icon}
    </button>
  );
}
