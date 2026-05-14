import { Save } from "lucide-react";
import { Button } from "./Button";

interface PageHeaderProps {
  title: string;
  onSave?: () => void;
}

export function PageHeader({ title, onSave }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <Button icon={Save} onClick={onSave}>
        Save Changes
      </Button>
    </div>
  );
}
