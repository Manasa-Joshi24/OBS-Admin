interface SelectFieldProps {
  options: string[];
  defaultValue: string;
  onChange?: (value: string) => void;
}

export function SelectField({ options, defaultValue, onChange }: SelectFieldProps) {
  return (
    <select 
      defaultValue={defaultValue} 
      onChange={(e) => onChange?.(e.target.value)}
      className="p-2 text-sm rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium min-w-[120px]"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
