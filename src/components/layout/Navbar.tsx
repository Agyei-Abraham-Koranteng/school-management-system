import React from 'react';
import { 
  Menu, 
  Sun, 
  Moon, 
  Bell, 
  Search, 
  Calendar,
  Sparkles,
  LogOut
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { CURRENT_ACADEMIC_SESSION, CURRENT_SEMESTER } from '../../data/mockData';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileMenu,
  unreadNotificationsCount = 1,
  onOpenNotifications
}) => {
  const { theme, toggleTheme } = useTheme();
  const { role, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3 md:gap-4">
        {/* Mobile menu toggle */}
        <button
          id="mobile-nav-toggle"
          type="button"
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Academic Session Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100/80 dark:bg-neutral-800/80 text-xs font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-200/50 dark:border-neutral-700/50">
          <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{CURRENT_ACADEMIC_SESSION}</span>
          <span className="text-neutral-400">•</span>
          <span className="text-indigo-600 dark:text-indigo-400">{CURRENT_SEMESTER}</span>
        </div>

        {/* Global Search Trigger */}
        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
          }}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 border border-neutral-200/60 dark:border-neutral-700/60 text-xs transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Quick search...</span>
          <kbd className="text-[10px] font-mono bg-white dark:bg-neutral-700 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-600 font-bold">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Dark/Light mode toggle */}
        <button
          id="theme-toggle-button"
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Notifications Icon Button */}
        <button
          id="notifications-button"
          type="button"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-neutral-900" />
          )}
        </button>

        {/* User Mini Avatar Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-neutral-200 dark:border-neutral-800">
          <img
            src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
            alt={user?.firstName || "User"}
            className="w-8 h-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
          />
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 capitalize">
              {role.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          id="logout-button"
          type="button"
          onClick={logout}
          title="Sign out"
          className="p-2 rounded-xl text-neutral-500 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800/50"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
