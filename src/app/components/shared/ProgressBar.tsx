interface ProgressBarProps {
  progress: number;
  isOverdue?: boolean;
}

export function ProgressBar({ progress, isOverdue = false }: ProgressBarProps) {
  const colorClass = isOverdue ? "bg-red-500" : progress === 100 ? "bg-green-500" : "bg-blue-500";
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-gray-200">
        <div 
          className={`h-1.5 rounded-full transition-all ${colorClass}`} 
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} 
        />
      </div>
      <span className="text-xs text-gray-500">{progress}%</span>
    </div>
  );
}
