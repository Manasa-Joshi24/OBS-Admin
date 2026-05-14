import { RefreshCw } from "lucide-react";
import { DataTable } from "../../../components/shared/DataTable";
import { StatusBadge } from "../../../components/shared/StatusBadge";

interface Notification {
  id: string;
  user: string;
  type: string;
  channel: string;
  content: string;
  status: string;
  time: string;
}

interface NotificationTableProps {
  notifications: Notification[];
  onResend?: (id: string) => void;
}

export function NotificationTable({ notifications, onResend }: NotificationTableProps) {
  const headers = ["Notification", "User", "Channel", "Status", "Time", "Action"];

  return (
    <DataTable headers={headers}>
      {notifications.map((n) => (
        <tr key={n.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
          <td className="px-4 py-3">
            <p className="font-medium text-gray-800 text-xs">{n.type}</p>
            <p className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{n.content}</p>
          </td>
          <td className="px-4 py-3 text-xs text-gray-600">{n.user}</td>
          <td className="px-4 py-3 text-xs text-gray-600">{n.channel}</td>
          <td className="px-4 py-3">
            <StatusBadge status={n.status} />
          </td>
          <td className="px-4 py-3 text-xs text-gray-500">{n.time}</td>
          <td className="px-4 py-3">
            {n.status === "Failed" && (
              <button 
                onClick={() => onResend?.(n.id)}
                className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
              >
                <RefreshCw size={11} /> Resend
              </button>
            )}
          </td>
        </tr>
      ))}
    </DataTable>
  );
}
