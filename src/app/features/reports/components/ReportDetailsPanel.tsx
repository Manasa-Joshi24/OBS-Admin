import { FileBarChart } from "lucide-react";
import { ReportType } from "./ReportCard";

interface ReportDetailsPanelProps {
  selectedReport: ReportType | null;
  onGenerate: () => void;
}

export function ReportDetailsPanel({ selectedReport, onGenerate }: ReportDetailsPanelProps) {
  if (!selectedReport) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center justify-center h-48 text-center">
        <FileBarChart size={32} className="text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">Select a report type to generate</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-gray-800">{selectedReport.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{selectedReport.desc}</p>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Date Range</label>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" className="p-2 text-xs rounded-lg border border-gray-200 bg-gray-50 outline-none" />
            <input type="date" className="p-2 text-xs rounded-lg border border-gray-200 bg-gray-50 outline-none" />
          </div>
        </div>

        {selectedReport.id === "account-statement" && (
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Account ID</label>
            <input 
              type="text" 
              placeholder="e.g. ACC001" 
              className="w-full p-2 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none" 
            />
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Export Format</label>
          <select className="w-full p-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none">
            <option>PDF</option>
            <option>CSV</option>
            <option>Admin Format (JSON)</option>
          </select>
        </div>
      </div>

      <button 
        onClick={onGenerate}
        className="w-full py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        Generate Report
      </button>
    </div>
  );
}
