import { Download } from "lucide-react";
import { SearchInput } from "../../../components/shared/SearchInput";
import { FilterTabs } from "../../../components/shared/FilterTabs";

interface AuditFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sensitiveFilter: string;
  onSensitiveFilterChange: (value: string) => void;
  onExport?: () => void;
}

export function AuditFilters({
  search,
  onSearchChange,
  sensitiveFilter,
  onSensitiveFilterChange,
  onExport,
}: AuditFiltersProps) {
  const filterOptions = ["All", "Sensitive", "Normal"];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-gray-100">
      <SearchInput 
        value={search} 
        onChange={onSearchChange} 
        placeholder="Search admin, action, target..." 
      />
      <FilterTabs 
        options={filterOptions} 
        activeFilter={sensitiveFilter} 
        onChange={onSensitiveFilterChange} 
      />
      <button 
        onClick={onExport}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 ml-auto transition-colors"
      >
        <Download size={13} /> Export
      </button>
    </div>
  );
}
