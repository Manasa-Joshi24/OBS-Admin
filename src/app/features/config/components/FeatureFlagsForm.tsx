import { Badge } from "../../../components/Badge";

interface FeatureFlag {
  name: string;
  key: string;
  enabled: boolean;
  env: string;
}

interface FeatureFlagsFormProps {
  flags: FeatureFlag[];
  onToggle: (key: string) => void;
}

export function FeatureFlagsForm({ flags, onToggle }: FeatureFlagsFormProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Feature Flags</h3>
        <p className="text-xs text-gray-500 mt-0.5">Toggle features for specific environments. Changes require dual approval for production.</p>
      </div>
      <div className="p-4 space-y-3">
        {flags.map((flag) => (
          <div key={flag.key} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100/50 transition-colors">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{flag.name}</p>
              <div className="mt-1">
                <Badge 
                  label={flag.env} 
                  variant={flag.env === "Production" ? "success" : flag.env === "Staging" ? "warning" : "info"} 
                />
              </div>
            </div>
            <button
              onClick={() => onToggle(flag.key)}
              className={`relative w-11 h-6 rounded-full transition-all duration-200 ${flag.enabled ? "bg-blue-600 shadow-inner" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${flag.enabled ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
