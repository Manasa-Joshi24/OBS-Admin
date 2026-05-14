interface ConfigSidebarProps {
  sections: { key: string; label: string }[];
  activeSection: string;
  onSectionChange: (key: string) => void;
}

export function ConfigSidebar({ sections, activeSection, onSectionChange }: ConfigSidebarProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 space-y-1 h-fit shadow-sm">
      {sections.map((s) => (
        <button
          key={s.key}
          onClick={() => onSectionChange(s.key)}
          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
            activeSection === s.key 
              ? "bg-blue-600 text-white font-semibold shadow-md translate-x-1" 
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
