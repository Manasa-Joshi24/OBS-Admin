interface RoleCardProps {
  role: string;
  perms: string;
  count: number;
  color: string;
}

const colorStyles: Record<string, { bg: string; border: string; text: string }> = {
  blue: { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-700" },
  purple: { bg: "bg-purple-50", border: "border-purple-100", text: "text-purple-700" },
  green: { bg: "bg-green-50", border: "border-green-100", text: "text-green-700" },
  amber: { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-700" },
  indigo: { bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-700" },
  gray: { bg: "bg-gray-50", border: "border-gray-100", text: "text-gray-700" },
};

export function RoleCard({ role, perms, count, color }: RoleCardProps) {
  const styles = colorStyles[color] || colorStyles.gray;
  return (
    <div className={`p-3 rounded-xl ${styles.bg} border ${styles.border} transition-all hover:shadow-sm`}>
      <p className={`text-xs font-semibold ${styles.text}`}>{role}</p>
      <p className="text-lg font-bold text-gray-800 my-1">{count}</p>
      <p className="text-xs text-gray-500 leading-tight">{perms}</p>
    </div>
  );
}
