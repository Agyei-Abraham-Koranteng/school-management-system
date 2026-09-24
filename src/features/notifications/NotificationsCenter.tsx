import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Filter, 
  BookOpen, 
  CreditCard, 
  Award, 
  Calendar, 
  AlertCircle 
} from 'lucide-react';
import { SAMPLE_NOTIFICATIONS } from '../../data/mockData';
import { NotificationItem, NotificationCategory } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useSchool } from '../../context/SchoolContext';

export const NotificationsCenter: React.FC = () => {
  const { info } = useToast();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useSchool();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const markAllAsRead = () => {
    markAllNotificationsRead();
    info("All Cleared", "All notification items marked as read.");
  };

  const toggleRead = (id: string) => {
    markNotificationRead(id);
  };

  const filtered = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !n.isRead;
    return n.category === activeFilter;
  });

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'academic':
        return <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'registration':
        return <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'finance':
        return <CreditCard className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'graduation':
        return <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
    }
  };

  return (
    <div id="notification-center-page" className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Academic Notification Center</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Realtime institutional announcements, registration statuses, and grade alerts.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllAsRead}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-colors"
        >
          <CheckCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Categories Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'unread', 'registration', 'academic', 'finance', 'announcements'].map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
              activeFilter === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200/80 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map(item => (
          <div
            key={item.id}
            onClick={() => toggleRead(item.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
              !item.isRead
                ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/80 shadow-xs'
                : 'bg-white dark:bg-neutral-900 border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 shrink-0">
              {getCategoryIcon(item.category)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <span>{item.title}</span>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                  )}
                </h3>
                <span className="text-[11px] text-neutral-400 shrink-0">
                  {item.timestamp}
                </span>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                {item.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
