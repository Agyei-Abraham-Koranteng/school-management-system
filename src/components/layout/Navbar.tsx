import React from 'react';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  Calendar,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useSchool } from '../../context/SchoolContext';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
}

const ROLE_DISPLAY: Record<string, string> = {
  student: 'Student',
  lecturer: 'Faculty Member',
  admin_registrar: 'Registrar',
  finance_officer: 'Finance Officer',
  super_admin: 'Administrator',
  applicant: 'Applicant'
};

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileMenu,
  unreadNotificationsCount = 1,
  onOpenNotifications
}) => {
  const { theme, toggleTheme } = useTheme();
  const { role, user, logout } = useAuth();
  const { settings } = useSchool();

  const getInitials = (firstName?: string, lastName?: string) => {
    const f = firstName?.[0] ?? '';
    const l = lastName?.[0] ?? '';
    return (f + l).toUpperCase() || 'U';
  };

  return (
    <header className="ef-header">
      {/* Left Side */}
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          id="mobile-nav-toggle"
          type="button"
          onClick={onOpenMobileMenu}
          className="ef-btn-icon lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Academic Session Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border"
          style={{
            background: 'var(--bg-surface-raised)',
            borderColor: 'var(--border-default)',
            color: 'var(--text-secondary)'
          }}>
          <Calendar className="w-3 h-3 shrink-0" style={{ color: 'var(--brand)' }} />
          <span>{settings.currentSession}</span>
          <span style={{ color: 'var(--text-muted)' }}>·</span>
          <span style={{ color: 'var(--brand)' }}>{settings.currentSemester}</span>
        </div>

        {/* Global Search Trigger */}
        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
          }}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs border transition-colors"
          style={{
            background: 'var(--bg-surface-raised)',
            borderColor: 'var(--border-default)',
            color: 'var(--text-muted)'
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
          }}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Quick search...</span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border font-bold"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-muted)'
            }}>
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-1.5">
        {/* Theme Toggle */}
        <button
          id="theme-toggle-button"
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          className="ef-btn-icon"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light'
            ? <Moon className="w-4 h-4" />
            : <Sun className="w-4 h-4" />
          }
        </button>

        {/* Notifications */}
        <button
          id="notifications-button"
          type="button"
          onClick={onOpenNotifications}
          className="ef-btn-icon relative"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full ring-2 ring-white dark:ring-neutral-900"
              style={{ background: 'var(--brand)' }}
            />
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-6 mx-1" style={{ background: 'var(--border-default)' }} />

        {/* User Info */}
        <div className="flex items-center gap-2.5 cursor-default">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.firstName || 'User'}
              className="ef-avatar w-8 h-8"
            />
          ) : (
            <div className="ef-avatar-initials w-8 h-8 text-xs">
              {getInitials(user?.firstName, user?.lastName)}
            </div>
          )}
          <div className="hidden md:block">
            <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              {ROLE_DISPLAY[role] || role}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          id="logout-button"
          type="button"
          onClick={logout}
          title="Sign out"
          className="ef-btn-icon ml-0.5"
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
