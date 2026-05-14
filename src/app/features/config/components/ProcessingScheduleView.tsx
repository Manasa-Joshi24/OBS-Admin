interface ScheduleItem {
  label: string;
  value: string;
}

interface Holiday {
  date: string;
  name: string;
  country: string;
}

interface ProcessingScheduleViewProps {
  schedule: ScheduleItem[];
  holidays: Holiday[];
}

export function ProcessingScheduleView({ schedule, holidays }: ProcessingScheduleViewProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">Processing Schedule</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {schedule.map((item) => (
          <div key={item.label} className="p-3 rounded-lg bg-gray-50 border border-gray-100 hover:border-blue-100 transition-all">
            <p className="text-xs text-gray-500 font-medium">{item.label}</p>
            <p className="text-sm font-semibold text-gray-800 mt-1">{item.value}</p>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-700">Business Holidays</h4>
        <button className="text-xs text-blue-600 hover:underline font-medium">+ Add Holiday</button>
      </div>
      
      <div className="space-y-2">
        {holidays.map((h) => (
          <div key={h.date} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-white transition-all">
            <div>
              <p className="text-sm font-medium text-gray-800">{h.name}</p>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{h.country}</p>
            </div>
            <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{h.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
