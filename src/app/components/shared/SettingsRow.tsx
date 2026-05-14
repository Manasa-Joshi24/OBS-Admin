interface SettingsRowProps {
  label: string;
  children: React.ReactNode;
  suffix?: string;
}

export function SettingsRow({ label, children, suffix }: SettingsRowProps) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 border border-transparent hover:border-gray-200 transition-all">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{label}</p>
      </div>
      <div className="flex items-center gap-2">
        {children}
        {suffix && <span className="text-xs text-gray-500 w-20 shrink-0">{suffix}</span>}
      </div>
    </div>
  );
}
