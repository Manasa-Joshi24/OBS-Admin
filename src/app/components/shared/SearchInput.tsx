import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search..." }: SearchInputProps) {
  return (
    <div className="relative flex-1 w-full sm:max-w-xs">
      <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
      <input 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder} 
        className="w-full pl-8 pr-3 py-2 text-sm bg-gray-100 rounded-lg border-0 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" 
      />
    </div>
  );
}
