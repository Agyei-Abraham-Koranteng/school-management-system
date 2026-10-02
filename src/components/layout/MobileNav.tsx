import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Bell, 
  MoreHorizontal,
  Contact,
  ClipboardCheck,
  Calendar,
  CreditCard,
  BarChart3,
  Users,
  Award,
  UserPlus,
  FolderOpen,
  LogOut,
  X,
  Sparkles,
  Shield,
  Layers,
  Settings,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { getDefaultTabForRole } from '../../App';

interface MobileNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  unreadCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onSelectTab,
  unreadCount = 1
}) => {
  const { role, user, logout, switchRole } = useAuth();
  const [isMoreOpen, setIsMoreOpen] = useState<boolean>(false);

  // Role-adaptive Primary Bottom Navigation Configuration (Strictly 5 items max)
  let primaryItems: Array<{ id: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: boolean }> = [];
  let moreItems: Array<{ id: string; label: string; icon: React.ComponentType<{ className?: string }>; category?: string }> = [];

  if (role === 'lecturer') {
    primaryItems = [
      { id: 'lecturer-dashboard', label: 'Faculty', icon: LayoutDashboard },
      { id: 'attendance', label: 'Roll Call', icon: ClipboardCheck },
      { id: 'admin-students', label: 'Roster', icon: Users },
      { id: 'results', label: 'Gradebook', icon: FileText }
    ];
    moreItems = [
      { id: 'timetable', label: 'Teaching Schedule', icon: Calendar, category: 'Academics' },
      { id: 'admin-academic-structure', label: 'Course Catalog', icon: Layers, category: 'Academics' },
      { id: 'documents', label: 'Document Archive', icon: FolderOpen, category: 'Services' },
      { id: 'notifications', label: 'Bulletins & Alerts', icon: Bell, category: 'Services' }
    ];
  } else if (role === 'finance_officer') {
    primaryItems = [
      { id: 'finance-dashboard', label: 'Bursary', icon: LayoutDashboard },
      { id: 'finance', label: 'Ledgers', icon: CreditCard },
      { id: 'admin-students', label: 'Debtors', icon: Users },
      { id: 'reports', label: 'Reports', icon: BarChart3 }
    ];
    moreItems = [
      { id: 'graduation', label: 'Degree Clearance', icon: Award, category: 'Audit' },
      { id: 'documents', label: 'Financial Receipts', icon: FolderOpen, category: 'Services' },
      { id: 'notifications', label: 'Campus Alerts', icon: Bell, category: 'Services' }
    ];
  } else if (role === 'admin_registrar' || role === 'super_admin') {
    primaryItems = [
      { id: 'admin-dashboard', label: 'Executive', icon: LayoutDashboard },
      { id: 'admin-admissions', label: 'Admissions', icon: UserPlus },
      { id: 'admin-students', label: 'Students', icon: Users },
      { id: 'graduation', label: 'Graduation', icon: Award }
    ];
    moreItems = [
      { id: 'admin-academic-structure', label: 'Curriculum & Courses', icon: Layers, category: 'Academic Board' },
      { id: 'admin-progression', label: 'Academic Progression', icon: BarChart3, category: 'Academic Board' },
      { id: 'admin-warnings', label: 'Probation & Carryovers', icon: FileText, category: 'Academic Board' },
      { id: 'transcripts', label: 'Official Transcripts', icon: GraduationCap, category: 'Academic Board' },
      { id: 'attendance', label: 'Attendance Audit', icon: ClipboardCheck, category: 'Registry' },
      { id: 'admin-staff', label: 'Faculty & Staff', icon: Users, category: 'Registry' },
      { id: 'documents', label: 'Document Repository', icon: FolderOpen, category: 'Services' },
      { id: 'reports', label: 'Institutional Reports', icon: BarChart3, category: 'Services' },
      { id: 'notifications', label: 'Announcements', icon: Bell, category: 'Services' }
    ];
    if (role === 'super_admin') {
      moreItems.push(
        { id: 'admin-users', label: 'User Management', icon: Shield, category: 'System Governance' },
        { id: 'audit-logs', label: 'Security Audit Logs', icon: FileText, category: 'System Governance' },
        { id: 'system-settings', label: 'System Configuration', icon: Settings, category: 'System Governance' }
      );
    }
  } else {
    // Student default
    primaryItems = [
      { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
      { id: 'registration', label: 'Courses', icon: BookOpen },
      { id: 'results', label: 'Results', icon: FileText },
      { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadCount > 0 }
    ];
    moreItems = [
      { id: 'student-profile', label: 'Digital Student ID', icon: Contact, category: 'Credentials' },
      { id: 'attendance', label: 'Attendance & Roll Call', icon: ClipboardCheck, category: 'Academics' },
      { id: 'timetable', label: 'Lecture Timetable', icon: Calendar, category: 'Academics' },
      { id: 'transcripts', label: 'Transcripts & Slips', icon: GraduationCap, category: 'Academics' },
      { id: 'academic-journey', label: 'Academic Journey', icon: Sparkles, category: 'Academics' },
      { id: 'finance', label: 'Tuition Fees & Payments', icon: CreditCard, category: 'Finance' },
      { id: 'documents', label: 'Document Repository', icon: FolderOpen, category: 'Services' }
    ];
  }

  const isMoreActive = moreItems.some(i => i.id === activeTab);

  const handleSelectMoreTab = (tabId: string) => {
    onSelectTab(tabId);
    setIsMoreOpen(false);
  };

  return (
    <>
      {/* 1. Mobile Bottom Dock */}
      <nav
        id="mobile-bottom-nav"
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-200/80 dark:border-neutral-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl transition-all"
        style={{ paddingBottom: 'max(0.5rem, var(--safe-bottom, 0px))' }}
      >
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all duration-200 ef-touch-target cursor-pointer ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-[1.04]'
                  : 'text-neutral-500 dark:text-neutral-400 font-medium hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              {isActive && (
                <span className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-2xl -z-10 animate-fade-in" />
              )}
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.4] scale-110' : 'stroke-[1.7]'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-neutral-900" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight font-medium">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* 5th Button: Dedicated "More" Action */}
        <button
          id="mobile-nav-more"
          type="button"
          onClick={() => setIsMoreOpen(true)}
          className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all duration-200 ef-touch-target cursor-pointer ${
            isMoreActive || isMoreOpen
              ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-[1.04]'
              : 'text-neutral-500 dark:text-neutral-400 font-medium hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          {(isMoreActive || isMoreOpen) && (
            <span className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-2xl -z-10 animate-fade-in" />
          )}
          <div className="relative">
            <MoreHorizontal className={`w-5 h-5 transition-transform ${isMoreActive || isMoreOpen ? 'stroke-[2.4] scale-110' : 'stroke-[1.7]'}`} />
            {isMoreActive && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-neutral-900" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight font-medium">
            More
          </span>
        </button>
      </nav>

      {/* 2. Interactive "More" Bottom Sheet Drawer */}
      {isMoreOpen && (
        <div 
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs lg:hidden animate-fade-in"
          onClick={() => setIsMoreOpen(false)}
        >
          <div
            className="w-full bg-white dark:bg-neutral-900 rounded-t-3xl border-t border-neutral-200 dark:border-neutral-800 p-5 space-y-4 max-h-[82vh] overflow-y-auto shadow-2xl animate-slide-up"
            style={{ paddingBottom: 'max(2rem, var(--safe-bottom, 0px))' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle & Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <MoreHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    Additional Services
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {user?.firstName} {user?.lastName} · {role.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Role Portal Switcher (Mobile Touch-Friendly) */}
            <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Switch Portal
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { r: 'student', label: 'Student' },
                  { r: 'lecturer', label: 'Faculty' },
                  { r: 'admin_registrar', label: 'Registrar' },
                  { r: 'finance_officer', label: 'Bursary' },
                  { r: 'super_admin', label: 'Admin' }
                ].map(({ r, label }) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      switchRole(r as UserRole);
                      onSelectTab(getDefaultTabForRole(r as UserRole));
                      setIsMoreOpen(false);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                      role === r
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items List */}
            <div className="space-y-1">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectMoreTab(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all ef-touch-target cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-indigo-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="block">{item.label}</span>
                        {item.category && (
                          <span className="text-[10px] text-neutral-400 font-normal">{item.category}</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sign Out Action */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  setIsMoreOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition-colors ef-touch-target cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
