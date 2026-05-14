interface InputFieldProps {
  label?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  unit?: string;
  type?: string;
  width?: string;
  required?: boolean;
  layout?: "row" | "col";
}

export function InputField({ 
  label, 
  defaultValue, 
  value, 
  onChange, 
  placeholder, 
  unit, 
  type = "text", 
  width = "w-32",
  required = false,
  layout = "row"
}: InputFieldProps) {
  if (layout === "col") {
    return (
      <div className="flex flex-col gap-1.5 w-full transition-all">
        {label && (
          <label className="text-xs font-semibold text-gray-600 ml-0.5">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="flex items-center gap-2 relative">
          <input
            type={type}
            defaultValue={defaultValue}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`w-full p-2.5 text-sm rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400`}
          />
          {unit && <span className="text-xs text-gray-500 absolute right-3 pointer-events-none">{unit}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${label ? "p-3 rounded-lg bg-gray-50 border border-transparent hover:border-gray-200" : ""} transition-all`}>
      {label && (
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">{label}</p>
        </div>
      )}
      <div className="flex items-center gap-2 relative">
        <input
          type={type}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`${width} p-2 text-sm rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500/30 text-right font-medium transition-all`}
        />
        {unit && <span className="text-xs text-gray-500 w-12 shrink-0">{unit}</span>}
      </div>
    </div>
  );
}
