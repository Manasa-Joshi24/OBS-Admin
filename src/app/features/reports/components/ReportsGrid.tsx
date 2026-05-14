import { ReportCard, ReportType } from "./ReportCard";

interface ReportsGridProps {
  reports: ReportType[];
  selectedId?: string;
  onSelect: (report: ReportType) => void;
}

export function ReportsGrid({ reports, selectedId, onSelect }: ReportsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
      {reports.map((report) => (
        <ReportCard
          key={report.id}
          report={report}
          isSelected={selectedId === report.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
