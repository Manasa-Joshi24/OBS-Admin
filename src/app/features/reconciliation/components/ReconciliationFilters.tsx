import { SearchInput } from "../../../components/shared/SearchInput";
import { FilterTabs } from "../../../components/shared/FilterTabs";

interface ReconciliationFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function ReconciliationFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ReconciliationFiltersProps) {
  const statusOptions = ["All", "Matched", "Mismatch", "Duplicate", "Failed Posting"];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-gray-100">
      <SearchInput 
        value={search} 
        onChange={onSearchChange} 
        placeholder="Search TXN ID, account..." 
      />
      <FilterTabs 
        options={statusOptions} 
        activeFilter={statusFilter} 
        onChange={onStatusFilterChange} 
      />
    </div>
  );
}
