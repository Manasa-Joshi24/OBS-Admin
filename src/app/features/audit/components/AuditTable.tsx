import { ClipboardList, Shield, AlertTriangle, User, Settings, Lock } from "lucide-react";
import { DataTable } from "../../../components/shared/DataTable";
import { StatusBadge } from "../../../components/shared/StatusBadge";

interface AuditLog {
  id: string;
  admin: string;
  role: string;
  action: string;
  target: string;
  ip: string;
  time: string;
  sensitive: boolean;
  approved: boolean;
}

interface AuditTableProps {
  logs: AuditLog[];
}

const actionIcon: Record<string, any> = {
  "Freeze Account": Lock,
  "Reset Password": Shield,
  "Clear Fraud Case": AlertTriangle,
  "Update Transfer Limit": Settings,
  "Assign Ticket": User,
  "Export Audit Log": Download,
  "Approve Loan": ClipboardList,
  "Update Risk Rule": Settings,
};

import { Download } from "lucide-react";

export function AuditTable({ logs }: AuditTableProps) {
  const headers = ["Event ID", "Admin", "Action", "Target", "IP Address", "Time", "Type"];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <DataTable headers={headers}>
        {logs.map((log) => {
          const Icon = actionIcon[log.action] || ClipboardList;
          return (
            <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{log.id}</td>
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-gray-800">{log.admin}</p>
                <p className="text-xs text-gray-400">{log.role}</p>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <Icon size={13} className="text-gray-500" />
                  <span className="text-sm text-gray-700">{log.action}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-xs text-gray-600 max-w-[180px] truncate">{log.target}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-500">{log.ip}</td>
              <td className="px-4 py-3 text-xs text-gray-500">{log.time}</td>
              <td className="px-4 py-3">
                {log.sensitive ? (
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status="Sensitive" />
                    {log.approved && <StatusBadge status="Approved" />}
                  </div>
                ) : (
                  <StatusBadge status="Normal" />
                )}
              </td>
            </tr>
          );
        })}
      </DataTable>
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100 bg-gray-50/30">
        <p className="text-xs text-gray-400 font-medium italic">Audit logs are immutable and cannot be edited or deleted</p>
        <p className="text-xs text-gray-500 font-medium">Total events: {logs.length}</p>
      </div>
    </div>
  );
}
