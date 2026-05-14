interface TabOption<T extends string> {
  id: T;
  label: string;
}

interface TabsProps<T extends string> {
  options: TabOption<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
}

export function Tabs<T extends string>({ options, activeTab, onChange }: TabsProps<T>) {
  return (
    <div className="flex border-b border-gray-100 px-4">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === option.id
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
