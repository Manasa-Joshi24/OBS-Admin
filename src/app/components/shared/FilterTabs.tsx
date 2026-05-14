interface FilterTabsProps {
  options: string[];
  activeFilter: string;
  onChange: (filter: string) => void;
}

export function FilterTabs({ options, activeFilter, onChange }: FilterTabsProps) {
  return (
    <div className="flex gap-1 flex-wrap">
      {options.map(option => (
        <button 
          key={option} 
          onClick={() => onChange(option)} 
          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
            activeFilter === option 
              ? "bg-blue-600 text-white" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
