import { FilterTabs } from "../../../components/shared/FilterTabs";

interface LoanFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

const STATUS_OPTIONS = ["All", "Active", "Pending Approval", "Under Review", "Overdue", "Closed"];

export function LoanFilters({ statusFilter, onStatusFilterChange }: LoanFiltersProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      <h3 className="font-semibold text-gray-800">Loan Portfolio</h3>
      <FilterTabs 
        options={STATUS_OPTIONS} 
        activeFilter={statusFilter} 
        onChange={onStatusFilterChange} 
      />
    </div>
  );
}
