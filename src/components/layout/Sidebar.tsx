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
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

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
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile
}) => {
  const { role, user, logout, switchRole } = useAuth();

  // Role-adaptive Navigation Configuration
  let sections: NavSection[] = [];

  if (role === 'student') {
    sections = [
      {
        title: 'Academics',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'student-profile', label: 'Digital Student ID', icon: Contact },
          { id: 'registration', label: 'Course Registration', icon: BookOpen, badge: 'Active' },
          { id: 'timetable', label: 'Class Schedule', icon: Calendar },
          { id: 'attendance', label: 'Attendance & Hours', icon: ClipboardCheck },
          { id: 'results', label: 'Results & CGPA', icon: FileText },
          { id: 'transcripts', label: 'Transcripts & Slips', icon: GraduationCap }
        ]
      },
      {
        title: 'Services & Records',
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
        title: 'Institutional Administration',
        items: [
          { id: 'admin-dashboard', label: 'Executive Overview', icon: LayoutDashboard },
          { id: 'admin-public-cms', label: 'Public Website CMS', icon: Globe, badge: 'Live' },
          { id: 'admin-admissions', label: 'Admissions Directorate', icon: UserPlus, badge: 'New' },
          { id: 'admin-students', label: 'Students Directory', icon: Users },
          { id: 'admin-academic-structure', label: 'Academic Structure', icon: Layers },
          { id: 'admin-staff', label: 'Staff & Faculty', icon: UserCheck }
        ]
      },
      {
        title: 'Academic Operations',
        items: [
          { id: 'admin-progression', label: 'Progression Engine', icon: TrendingUp, badge: 'Audit' },
          { id: 'admin-warnings', label: 'Warnings & Carryovers', icon: FileWarning },
          { id: 'attendance', label: 'Class Attendance', icon: ClipboardCheck },
          { id: 'graduation', label: 'Graduation Clearance', icon: Award },
          { id: 'documents', label: 'Document Center', icon: FolderLock }
        ]
      },
      {
        title: 'Governance & Analytics',
        items: [
          { id: 'notifications', label: 'Communications', icon: Bell },
          { id: 'reports', label: 'Institutional Reports', icon: BarChart3 }
        ]
      }
    ];
  } else if (role === 'super_admin') {
    sections = [
      {
        title: 'Institutional Administration',
        items: [
          { id: 'admin-dashboard', label: 'Executive Overview', icon: LayoutDashboard },
          { id: 'admin-public-cms', label: 'Public Website CMS', icon: Globe, badge: 'Live' },
          { id: 'admin-admissions', label: 'Admissions Directorate', icon: UserPlus, badge: 'New' },
          { id: 'admin-students', label: 'Students Directory', icon: Users },
          { id: 'admin-academic-structure', label: 'Academic Structure', icon: Layers },
          { id: 'admin-staff', label: 'Staff & Faculty', icon: UserCheck },
          { id: 'admin-users', label: 'User & Security Admin', icon: Shield }
        ]
      },
      {
        title: 'Academic Operations',
        items: [
          { id: 'admin-progression', label: 'Progression Engine', icon: TrendingUp, badge: 'Audit' },
          { id: 'admin-warnings', label: 'Warnings & Carryovers', icon: FileWarning },
          { id: 'attendance', label: 'Class Attendance', icon: ClipboardCheck },
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
        title: 'Instructional',
        items: [
          { id: 'lecturer-dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
          { id: 'attendance', label: 'Class Roll Call', icon: ClipboardCheck, badge: 'Live' },
          { id: 'admin-students', label: 'Student Directory', icon: Users },
          { id: 'results', label: 'Gradebook Entry', icon: FileText },
          { id: 'admin-academic-structure', label: 'Curriculum Catalog', icon: BookOpen },
          { id: 'timetable', label: 'Lecture Schedule', icon: Calendar },
          { id: 'notifications', label: 'Campus Bulletins', icon: Bell }
        ]
      }
    ];
  } else if (role === 'finance_officer') {
    sections = [
      {
        title: 'Bursary Directorate',
        items: [
          { id: 'finance-dashboard', label: 'Finance Dashboard', icon: LayoutDashboard },
          { id: 'finance', label: 'Tuition Ledgers', icon: CreditCard },
          { id: 'admin-students', label: 'Student Debtors', icon: Users },
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

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-68 bg-white dark:bg-neutral-900 border-r border-neutral-200/80 dark:border-neutral-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-1.5">
              Premier University
            </h1>
            <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
              Student Information System
            </p>
          </div>
        </div>

        {/* Role Switcher Pill */}
        <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Active Portal
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              <Shield className="w-3 h-3" />
              Live Demo
            </span>
          </div>
          <select
            id="role-portal-switcher"
            value={role}
            onChange={(e) => {
              const targetRole = e.target.value as UserRole;
              if (targetRole !== role) {
                switchRole(targetRole);
              }
            }}
            className="w-full text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="student">
              Student Portal {role === 'student' && user ? `(${user.firstName || (user as any).name?.split(' ')[0] || ''})` : ''}
            </option>
            <option value="admin_registrar">
              Registrar Office {role === 'admin_registrar' && user ? `(${user.firstName || (user as any).name?.split(' ')[0] || ''})` : ''}
            </option>
            <option value="lecturer">
              Faculty / Lecturer {role === 'lecturer' && user ? `(${user.firstName || (user as any).name?.split(' ')[0] || ''})` : ''}
            </option>
            <option value="finance_officer">
              Bursary & Finance {role === 'finance_officer' && user ? `(${user.firstName || (user as any).name?.split(' ')[0] || ''})` : ''}
            </option>
            <option value="super_admin">
              Super Administrator {role === 'super_admin' && user ? `(${user.firstName || (user as any).name?.split(' ')[0] || ''})` : ''}
            </option>
          </select>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {section.title && (
                <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    type="button"
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 shadow-2xs'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive 
                          ? 'bg-indigo-200/70 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-200' 
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 flex items-center justify-between border border-neutral-200/60 dark:border-neutral-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                alt={user?.firstName || "User"}
                className="w-8 h-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 capitalize truncate">
                  {role.replace('_', ' ')}
                </p>
              </div>
            </div>

            <button
              id="logout-button"
              type="button"
              onClick={logout}
              title="Log out"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-white dark:hover:bg-neutral-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
