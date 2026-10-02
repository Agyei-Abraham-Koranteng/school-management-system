import React from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  FileText,
  Calendar,
  Bell,
  CreditCard,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  Layers,
  Shield,
  UserCheck,
  FileWarning,
  Award,
  FolderLock,
  BarChart3,
  UserPlus,
  Contact,
  ClipboardCheck,
  Sliders,
  Globe,
  ChevronRight,
  BookMarked,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { getDefaultTabForRole } from '../../App';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: 'brand' | 'success' | 'warning' | 'danger';
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const ROLE_LABELS: Record<UserRole, string> = {
  student: 'Student',
  lecturer: 'Faculty',
  admin_registrar: 'Registrar',
  finance_officer: 'Bursary',
  super_admin: 'Administrator',
  applicant: 'Applicant'
};

const ROLE_COLORS: Record<UserRole, { bg: string; text: string }> = {
  student: { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300' },
  lecturer: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300' },
  admin_registrar: { bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-700 dark:text-violet-300' },
  finance_officer: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300' },
  super_admin: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300' },
  applicant: { bg: 'bg-sky-50 dark:bg-sky-950/40', text: 'text-sky-700 dark:text-sky-300' }
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile
}) => {
  const { role, user, logout, switchRole } = useAuth();

  const getInitials = (firstName?: string, lastName?: string) => {
    const f = firstName?.[0] ?? '';
    const l = lastName?.[0] ?? '';
    return (f + l).toUpperCase() || 'U';
  };

  let sections: NavSection[] = [];

  if (role === 'student') {
    sections = [
      {
        title: 'Academics',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'student-profile', label: 'Digital Student ID', icon: Contact },
          { id: 'registration', label: 'Course Registration', icon: BookOpen, badge: 'Open', badgeVariant: 'brand' },
          { id: 'timetable', label: 'Class Schedule', icon: Calendar },
          { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
          { id: 'results', label: 'Results & CGPA', icon: FileText },
          { id: 'transcripts', label: 'Transcripts', icon: GraduationCap }
        ]
      },
      {
        title: 'Services',
        items: [
          { id: 'finance', label: 'Tuition & Fees', icon: CreditCard },
          { id: 'documents', label: 'Document Archive', icon: FolderLock },
          { id: 'notifications', label: 'Bulletins & Alerts', icon: Bell }
        ]
      }
    ];
  } else if (role === 'admin_registrar') {
    sections = [
      {
        title: 'Administration',
        items: [
          { id: 'admin-dashboard', label: 'Executive Overview', icon: LayoutDashboard },
          { id: 'admin-public-cms', label: 'Public Website', icon: Globe, badge: 'Live', badgeVariant: 'success' },
          { id: 'admin-admissions', label: 'Admissions', icon: UserPlus, badge: 'New', badgeVariant: 'brand' },
          { id: 'admin-students', label: 'Students Directory', icon: Users },
          { id: 'admin-academic-structure', label: 'Academic Structure', icon: Layers },
          { id: 'admin-staff', label: 'Staff & Faculty', icon: UserCheck }
        ]
      },
      {
        title: 'Academic Operations',
        items: [
          { id: 'admin-progression', label: 'Progression Engine', icon: TrendingUp },
          { id: 'admin-warnings', label: 'Warnings & Carryovers', icon: FileWarning },
          { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
          { id: 'graduation', label: 'Graduation Clearance', icon: Award },
          { id: 'documents', label: 'Document Center', icon: FolderLock }
        ]
      },
      {
        title: 'Governance',
        items: [
          { id: 'notifications', label: 'Communications', icon: Bell },
          { id: 'reports', label: 'Institutional Reports', icon: BarChart3 }
        ]
      }
    ];
  } else if (role === 'super_admin') {
    sections = [
      {
        title: 'Administration',
        items: [
          { id: 'admin-dashboard', label: 'Executive Overview', icon: LayoutDashboard },
          { id: 'admin-public-cms', label: 'Public Website', icon: Globe, badge: 'Live', badgeVariant: 'success' },
          { id: 'admin-admissions', label: 'Admissions', icon: UserPlus, badge: 'New', badgeVariant: 'brand' },
          { id: 'admin-students', label: 'Students Directory', icon: Users },
          { id: 'admin-academic-structure', label: 'Academic Structure', icon: Layers },
          { id: 'admin-staff', label: 'Staff & Faculty', icon: UserCheck },
          { id: 'admin-users', label: 'User & Security', icon: Shield }
        ]
      },
      {
        title: 'Academic Operations',
        items: [
          { id: 'admin-progression', label: 'Progression Engine', icon: TrendingUp },
          { id: 'admin-warnings', label: 'Warnings & Carryovers', icon: FileWarning },
          { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
          { id: 'graduation', label: 'Graduation Clearance', icon: Award },
          { id: 'documents', label: 'Document Center', icon: FolderLock }
        ]
      },
      {
        title: 'Governance & Analytics',
        items: [
          { id: 'notifications', label: 'Communications', icon: Bell },
          { id: 'reports', label: 'Institutional Reports', icon: BarChart3 },
          { id: 'audit-logs', label: 'Security Audit Log', icon: Sliders },
          { id: 'system-settings', label: 'System Settings', icon: Settings }
        ]
      }
    ];
  } else if (role === 'lecturer') {
    sections = [
      {
        title: 'Teaching',
        items: [
          { id: 'lecturer-dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
          { id: 'attendance', label: 'Attendance', icon: ClipboardCheck, badge: 'Live', badgeVariant: 'success' },
          { id: 'admin-students', label: 'Student Directory', icon: Users },
          { id: 'results', label: 'Gradebook Entry', icon: FileText },
          { id: 'admin-academic-structure', label: 'Curriculum', icon: BookMarked },
          { id: 'timetable', label: 'Lecture Schedule', icon: Calendar },
          { id: 'notifications', label: 'Campus Bulletins', icon: Bell }
        ]
      }
    ];
  } else if (role === 'finance_officer') {
    sections = [
      {
        title: 'Bursary',
        items: [
          { id: 'finance-dashboard', label: 'Finance Dashboard', icon: LayoutDashboard },
          { id: 'finance', label: 'Tuition Ledgers', icon: CreditCard },
          { id: 'admin-students', label: 'Student Accounts', icon: Users },
          { id: 'graduation', label: 'Graduation Clearance', icon: Award },
          { id: 'documents', label: 'Receipt Archives', icon: FolderLock },
          { id: 'reports', label: 'Financial Reports', icon: BarChart3 },
          { id: 'notifications', label: 'Announcements', icon: Bell }
        ]
      }
    ];
  }

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    onCloseMobile();
  };

  const roleColors = ROLE_COLORS[role] || ROLE_COLORS.student;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="app-sidebar"
        className={`ef-sidebar ${isMobileOpen ? 'is-open' : ''}`}
        style={{ width: 'var(--sidebar-w)' }}
      >
        {/* Brand Header */}
        <div className="h-[3.75rem] px-4 sm:px-5 flex items-center justify-between gap-2 border-b shrink-0"
          style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>
                Premier University
              </h1>
              <p className="text-[10px] font-medium truncate" style={{ color: 'var(--text-muted)' }}>
                Student Information System
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden ef-btn-icon w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer"
            aria-label="Close navigation drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Portal Switcher */}
        <div className="px-4 py-3 shrink-0 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface-raised)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="ef-label">Active Portal</span>
            <span className={`ef-badge ef-badge-neutral text-[10px] ${roleColors.bg} ${roleColors.text} border-0`}>
              {ROLE_LABELS[role] || role}
            </span>
          </div>
          <select
            id="role-portal-switcher"
            value={role}
            onChange={(e) => {
              const targetRole = e.target.value as UserRole;
              if (targetRole !== role) {
                switchRole(targetRole);
                onSelectTab(getDefaultTabForRole(targetRole));
              }
            }}
            className="ef-input ef-select text-xs py-1.5"
          >
            <option value="student">Student Portal</option>
            <option value="admin_registrar">Registrar Office</option>
            <option value="lecturer">Faculty Portal</option>
            <option value="finance_officer">Bursary & Finance</option>
            <option value="super_admin">Super Administrator</option>
          </select>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label="Main navigation">
          {sections.map((section, sIdx) => (
            <div key={sIdx}>
              {section.title && (
                <div className="ef-nav-section-label mb-2">{section.title}</div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-${item.id}`}
                      type="button"
                      onClick={() => handleItemClick(item.id)}
                      className={`ef-nav-item ${isActive ? 'is-active' : ''}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="ef-nav-icon w-[1rem] h-[1rem]" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                          item.badgeVariant === 'success' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : item.badgeVariant === 'warning'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <ChevronRight className="w-3 h-3 shrink-0 opacity-50" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Card */}
        <div className="p-3 shrink-0 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl border transition-colors"
            style={{
              background: 'var(--bg-surface-raised)',
              borderColor: 'var(--border-default)'
            }}>

            {/* Avatar */}
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

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] capitalize truncate" style={{ color: 'var(--text-muted)' }}>
                {role.replace('_', ' ')}
              </p>
            </div>

            <button
              id="logout-button"
              type="button"
              onClick={logout}
              title="Sign out"
              className="ef-btn-icon p-1.5 rounded-lg shrink-0"
              aria-label="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
