import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router";
import {
  LayoutDashboard, Users, FileCheck, Landmark, ArrowLeftRight,
  ShieldAlert, CreditCard, Banknote, FileBarChart, HeadphonesIcon,
  Bell, Settings, ClipboardList, GitMerge, Server,
  ChevronLeft, ChevronRight, LogOut, Search, Moon, Sun, Menu, X,
  Building2
} from "lucide-react";

const navGroups = [
  {
    label: "Overview",
    items: [
      { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "Customer",
    items: [
      { path: "/users", icon: Users, label: "User Management" },
      { path: "/kyc", icon: FileCheck, label: "KYC & Onboarding" },
      { path: "/accounts", icon: Landmark, label: "Account Oversight" },
    ],
  },
  {
    label: "Operations",
    items: [
      { path: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
      { path: "/fraud", icon: ShieldAlert, label: "Fraud & Risk" },
      { path: "/cards", icon: CreditCard, label: "Card Management" },
      { path: "/loans", icon: Banknote, label: "Loan Operations" },
    ],
  },
  {
    label: "Reporting",
    items: [
      { path: "/reports", icon: FileBarChart, label: "Reports" },
      { path: "/reconciliation", icon: GitMerge, label: "Reconciliation" },
    ],
  },
  {
    label: "Support",
    items: [
      { path: "/support", icon: HeadphonesIcon, label: "Support Tickets" },
      { path: "/notifications", icon: Bell, label: "Notifications" },
    ],
  },
  {
    label: "Admin",
    items: [
      { path: "/audit", icon: ClipboardList, label: "Audit & Compliance" },
      { path: "/configuration", icon: Settings, label: "Configuration" },
      { path: "/system", icon: Server, label: "System Operations" },
    ],
  },
];

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  const currentTitle = navGroups
    .flatMap((g) => g.items)
    .find((item) => item.path === location.pathname)?.label ?? "Admin Portal";

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "dark" : ""}`} style={{ background: "#f0f2f5" }}>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-50 flex flex-col h-full
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-16" : "w-60"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ background: "#0f172a" }}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-4 border-b border-white/10 ${collapsed ? "justify-center" : ""}`}>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500 shrink-0">
            <Building2 size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-white text-sm font-semibold leading-none">NexusBank</p>
              <p className="text-blue-400 text-xs mt-0.5">Admin Portal</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-thin">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-1">
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-slate-400 hover:bg-white/10 hover:text-white"
                        } ${collapsed ? "justify-center" : ""}`
                      }
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon size={16} className="shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-2">
          {!collapsed && (
            <div className="flex items-center gap-2 px-2 py-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                SA
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">Super Admin</p>
                <p className="text-slate-400 text-xs truncate">admin@nexusbank.com</p>
              </div>
            </div>
          )}
          <button
            className={`flex items-center gap-2 w-full px-2 py-2 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white text-sm transition-colors ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut size={15} />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-700 border border-slate-600 items-center justify-center text-slate-300 hover:bg-slate-600 z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>
            <h1 className="text-base font-semibold text-gray-800">{currentTitle}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users, transactions, accounts..."
                className="pl-8 pr-12 py-1.5 text-sm bg-gray-100 rounded-lg border-0 outline-none focus:ring-2 focus:ring-blue-500/30 w-64 lg:w-80 transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="text-[10px] font-medium text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded">⌘K</span>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="relative">
              <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 relative">
                <Bell size={16} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
              SA
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
