import { SearchInput } from "../../../components/shared/SearchInput";
import { FilterTabs } from "../../../components/shared/FilterTabs";

interface CardFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

const STATUS_OPTIONS = ["All", "Active", "Frozen", "Blocked", "Cancelled"];

export function CardFilters({ search, onSearchChange, statusFilter, onStatusFilterChange }: CardFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-gray-100">
      <SearchInput 
        value={search} 
        onChange={onSearchChange} 
        placeholder="Search holder, card number..." 
      />
      <FilterTabs 
        options={STATUS_OPTIONS} 
        activeFilter={statusFilter} 
        onChange={onStatusFilterChange} 
      />
    </div>
  );
}
