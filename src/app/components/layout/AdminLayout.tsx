import { useEffect, useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Users, FileCheck, Landmark, ArrowLeftRight,
  ShieldAlert, CreditCard, Banknote, FileBarChart, HeadphonesIcon,
  Bell, Settings, ClipboardList, GitMerge, Server,
  ChevronLeft, ChevronRight, LogOut, Building2
} from "lucide-react";
import { TopNavbar } from "./TopNavbar";
import { useAdminStore } from "../../store/adminStore";
import logo from "../../../logo.png";

import { ChevronDown } from "lucide-react";

const navGroups = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  {
    label: "Users",
    icon: Users,
    items: [
      { path: "/users", label: "User Management" },
      { path: "/kyc", label: "KYC & Onboarding" },
      { path: "/accounts", label: "Account Oversight" },
    ],
  },
  {
    label: "Operations",
    icon: Banknote,
    items: [
      { path: "/loans", label: "Loans" },
      { path: "/fraud", label: "Fraud & Risk" },
    ],
  },
  {
    label: "Reports",
    icon: FileBarChart,
    items: [
      { path: "/reports", label: "Reports" },
      { path: "/reconciliation", label: "Reconciliation" },
    ],
  },
  {
    label: "Support",
    icon: HeadphonesIcon,
    items: [
      { path: "/support", label: "Support Tickets" },
      { path: "/notifications", label: "Notifications" },
    ],
  },
  {
    label: "Admin",
    icon: ClipboardList,
    items: [
      { path: "/audit", label: "Audit & Compliance" },
      { path: "/configuration", label: "Configuration" },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    items: [
      { path: "/system", label: "System Settings" },
    ],
  },
];

function NavItem({ item, collapsed, mobileOpen, setMobileOpen }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActiveGroup = item.items?.some((sub: any) => location.pathname === sub.path);
  const isSingle = !item.items;

  if (isSingle) {
    return (
      <li>
        <NavLink
          to={item.path}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-slate-500 hover:bg-gray-50 hover:text-slate-900"
            } ${collapsed ? "justify-center px-0 w-12 mx-auto" : ""}`
          }
        >
          <item.icon size={20} className="shrink-0" />
          {!collapsed && <span>{item.label}</span>}
        </NavLink>
      </li>
    );
  }

  return (
    <li className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          isActiveGroup ? "text-blue-700" : "text-slate-500 hover:bg-gray-50 hover:text-slate-900"
        } ${collapsed ? "justify-center px-0 w-12 mx-auto" : ""}`}
      >
        <item.icon size={20} className="shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} />
            </motion.div>
          </>
        )}
      </button>
      <AnimatePresence>
        {isOpen && !collapsed && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pl-9 space-y-1 overflow-hidden"
          >
            {item.items.map((sub: any) => (
              <li key={sub.path}>
                <NavLink
                  to={sub.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? "text-blue-700 bg-blue-50/50" : "text-slate-400 hover:text-slate-900 hover:bg-gray-50"
                    }`
                  }
                >
                  {sub.label}
                </NavLink>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { subscribeToUpdates, fetchAnalytics, fetchUsers } = useAdminStore();

  useEffect(() => {
    fetchUsers();
    fetchAnalytics();
    const unsubscribe = subscribeToUpdates();
    return () => unsubscribe();
  }, [subscribeToUpdates, fetchAnalytics, fetchUsers]);

  const handleSignOut = () => {
    localStorage.removeItem("nexus_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_email");
    navigate("/login");
  };

  const currentTitle = navGroups
    .flatMap((g) => (g.items ? g.items : [g]))
    .find((item) => item.path === location.pathname)?.label ?? "Admin Portal";

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "dark" : ""}`} style={{ background: "#f8fafc" }}>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 256 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`
          fixed lg:relative z-50 flex flex-col h-full bg-white border-r border-gray-100
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          transition-transform lg:transition-none duration-300
        `}
      >
        {/* Branding Section */}
        <div className={`flex items-center gap-4 px-6 py-8 ${collapsed ? "justify-center" : ""}`}>
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <img src={logo} alt="Finova Logo" className="h-10 w-auto object-contain" />
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-slate-900 text-base font-bold leading-none tracking-tight truncate">Finova</p>
                <p className="text-slate-500 text-xs font-medium mt-1 truncate">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 scrollbar-hide">
          <ul className="space-y-1.5">
            {navGroups.map((group) => (
              <NavItem 
                key={group.label || group.path} 
                item={group} 
                collapsed={collapsed} 
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
              />
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-50 mt-auto">
          <div className="space-y-1">
            <button
              onClick={handleSignOut}
              className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 text-sm font-semibold transition-all ${collapsed ? "justify-center px-0 w-12 mx-auto" : ""}`}
            >
              <LogOut size={20} className="shrink-0" />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="truncate"
                  >
                    Sign Out
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-28 w-7 h-7 rounded-full bg-white border border-gray-100 items-center justify-center text-slate-400 hover:text-blue-700 transition-all shadow-sm z-10"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <TopNavbar 
          title={currentTitle}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onMobileMenuOpen={() => setMobileOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
