import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Bell, 
  Contact,
  ClipboardCheck,
  Calendar,
  CreditCard,
  BarChart3,
  Users,
  Award,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
  const { role } = useAuth();

  // Role-adaptive Navigation Configuration
  let navItems: Array<{ id: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: boolean }> = [];

  if (role === 'lecturer') {
    navItems = [
      { id: 'lecturer-dashboard', label: 'Faculty', icon: LayoutDashboard },
      { id: 'attendance', label: 'Roll Call', icon: ClipboardCheck },
      { id: 'admin-students', label: 'Roster', icon: Users },
      { id: 'results', label: 'Gradebook', icon: FileText },
      { id: 'notifications', label: 'Bulletins', icon: Bell, badge: unreadCount > 0 }
    ];
  } else if (role === 'finance_officer') {
    navItems = [
      { id: 'finance-dashboard', label: 'Bursary', icon: LayoutDashboard },
      { id: 'finance', label: 'Ledgers', icon: CreditCard },
      { id: 'admin-students', label: 'Debtors', icon: Users },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
      { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadCount > 0 }
    ];
  } else if (role === 'admin_registrar' || role === 'super_admin') {
    navItems = [
      { id: 'admin-dashboard', label: 'Executive', icon: LayoutDashboard },
      { id: 'admin-admissions', label: 'Admissions', icon: UserPlus },
      { id: 'admin-students', label: 'Directory', icon: Users },
      { id: 'graduation', label: 'Graduation', icon: Award },
      { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadCount > 0 }
    ];
  } else {
    // Student default
    navItems = [
      { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
      { id: 'registration', label: 'Courses', icon: BookOpen },
      { id: 'results', label: 'Results', icon: FileText },
      { id: 'student-profile', label: 'ID Card', icon: Contact },
      { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadCount > 0 }
    ];
  }

  return (
    <nav
      id="mobile-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200/80 dark:border-neutral-800 px-2 py-1.5 flex items-center justify-around shadow-lg"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            id={`mobile-nav-${item.id}`}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-neutral-500 dark:text-neutral-400 font-medium hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {item.badge && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-neutral-900" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
