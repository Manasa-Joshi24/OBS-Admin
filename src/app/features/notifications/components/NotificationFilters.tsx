import { FilterTabs } from "../../../components/shared/FilterTabs";

interface NotificationFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function NotificationFilters({
  statusFilter,
  onStatusFilterChange,
}: NotificationFiltersProps) {
  const statusOptions = ["All", "Delivered", "Failed", "Pending", "Scheduled"];

  return (
    <div className="flex items-center gap-2 p-4 border-b border-gray-100">
      <FilterTabs 
        options={statusOptions} 
        activeFilter={statusFilter} 
        onChange={onStatusFilterChange} 
      />
    </div>
  );
}
