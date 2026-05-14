import { FileBarChart } from "lucide-react";

export interface ReportType {
  id: string;
  name: string;
  desc: string;
  category: string;
}

interface ReportCardProps {
  report: ReportType;
  isSelected: boolean;
  onSelect: (report: ReportType) => void;
}

export function ReportCard({ report, isSelected, onSelect }: ReportCardProps) {
  return (
    <div
      onClick={() => onSelect(report)}
      className={`p-3 rounded-lg border cursor-pointer transition-all ${
        isSelected 
          ? "border-blue-300 bg-blue-50" 
          : "border-gray-100 hover:border-gray-200 bg-gray-50/50 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
          <FileBarChart size={14} className="text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{report.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{report.desc}</p>
          <span className="inline-block mt-1.5 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
            {report.category}
          </span>
        </div>
      </div>
    </div>
  );
}
