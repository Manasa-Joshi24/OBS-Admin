import { Search, Moon, Sun, Bell, Menu } from "lucide-react";
import { useAdminStore } from "../../store/adminStore";
import { useRef, useEffect } from "react";

interface TopNavbarProps {
  title: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onMobileMenuOpen: () => void;
}

export function TopNavbar({ title, darkMode, onToggleDarkMode, onMobileMenuOpen }: TopNavbarProps) {
  const { searchQuery, setSearchQuery } = useAdminStore();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3 shrink-0">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
          onClick={onMobileMenuOpen}
        >
          <Menu size={18} />
        </button>
        <h1 className="text-base font-semibold text-gray-800">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users, transactions, accounts..."
            className="pl-8 pr-12 py-1.5 text-sm bg-gray-100 rounded-lg border-0 outline-none focus:ring-2 focus:ring-blue-500/30 w-64 lg:w-80 transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="text-[10px] font-medium text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded">⌘K</span>
          </div>
        </div>
        <button
          onClick={onToggleDarkMode}
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
  );
}
