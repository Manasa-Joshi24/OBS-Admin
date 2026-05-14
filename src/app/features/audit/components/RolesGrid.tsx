import { RoleCard } from "./RoleCard";

interface Role {
  role: string;
  perms: string;
  count: number;
  color: string;
}

interface RolesGridProps {
  roles: Role[];
}

export function RolesGrid({ roles }: RolesGridProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-800 mb-3">Admin Roles & Permissions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {roles.map((r) => (
          <RoleCard key={r.role} {...r} />
        ))}
      </div>
    </div>
  );
}
