import React from 'react';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  Calendar,
  LogOut,
  GraduationCap
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
    <header className="ef-header px-3 sm:px-5">
      {/* Left Side */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile menu */}
        <button
          id="mobile-nav-toggle"
          type="button"
          onClick={onOpenMobileMenu}
          className="ef-btn-icon lg:hidden w-10 h-10 flex items-center justify-center shrink-0 cursor-pointer"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Brand Identity */}
        <div className="flex items-center gap-2 lg:hidden min-w-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
          >
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-sm tracking-tight truncate font-display" style={{ color: 'var(--text-primary)' }}>
            EduFlow
          </span>
        </div>

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
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* Mobile Search Button */}
        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
          }}
          className="ef-btn-icon md:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer"
          title="Search"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          id="theme-toggle-button"
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          className="ef-btn-icon w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button
          id="notifications-button"
          type="button"
          onClick={onOpenNotifications}
          className="ef-btn-icon relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2 ring-white dark:ring-neutral-900"
              style={{ background: 'var(--brand)' }}
            />
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-5 sm:h-6 mx-0.5 sm:mx-1" style={{ background: 'var(--border-default)' }} />

        {/* User Info Avatar (Clickable on mobile to open drawer) */}
        <div
          onClick={onOpenMobileMenu}
          className="flex items-center gap-2 cursor-pointer p-0.5 rounded-full hover:ring-2 hover:ring-indigo-500/30 transition-all"
          title="View Profile & Navigation"
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.firstName || 'User'}
              className="ef-avatar w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="ef-avatar-initials w-8 h-8 text-xs font-bold rounded-full flex items-center justify-center">
              {getInitials(user?.firstName, user?.lastName)}
            </div>
          )}
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold leading-tight truncate max-w-[120px]" style={{ color: 'var(--text-primary)' }}>
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
              {ROLE_DISPLAY[role] || role}
            </p>
          </div>
        </div>

        {/* Desktop Logout Button */}
        <button
          id="logout-button"
          type="button"
          onClick={logout}
          title="Sign out"
          className="hidden md:flex ef-btn-icon ml-0.5 cursor-pointer"
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
