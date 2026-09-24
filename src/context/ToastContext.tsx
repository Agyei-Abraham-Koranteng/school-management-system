import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (first: ToastType | string, second?: string, third?: string, duration?: number) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const showToast = (
    first: ToastType | string, 
    second?: string, 
    third?: string, 
    duration = 4000
  ) => {
    let type: ToastType = 'info';
    let title = '';
    let message: string | undefined = undefined;

    if (first === 'success' || first === 'error' || first === 'warning' || first === 'info') {
      type = first;
      title = second || '';
      message = third;
    } else {
      title = first;
      if (second === 'success' || second === 'error' || second === 'warning' || second === 'info') {
        type = second;
        message = third;
      } else {
        message = second;
      }
    }

    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { id, type, title, message, duration };
    setToasts(prev => [newToast, ...prev].slice(0, 4));

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const success = (title: string, message?: string) => showToast('success', title, message);
  const error = (title: string, message?: string) => showToast('error', title, message);
  const warning = (title: string, message?: string) => showToast('warning', title, message);
  const info = (title: string, message?: string) => showToast('info', title, message);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      {/* Toast Overlay */}
      <div 
        id="toast-container"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        <AnimatePresence>
          {toasts.map(toast => {
            let icon = <Info className="w-5 h-5 text-sky-500 shrink-0" />;
            let borderColor = "border-sky-200 dark:border-sky-800/60";
            let bgGlow = "bg-sky-50/90 dark:bg-sky-950/40";
            
            if (toast.type === 'success') {
              icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
              borderColor = "border-emerald-200 dark:border-emerald-800/60";
              bgGlow = "bg-emerald-50/90 dark:bg-emerald-950/40";
            } else if (toast.type === 'error') {
              icon = <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />;
              borderColor = "border-rose-200 dark:border-rose-800/60";
              bgGlow = "bg-rose-50/90 dark:bg-rose-950/40";
            } else if (toast.type === 'warning') {
              icon = <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />;
              borderColor = "border-amber-200 dark:border-amber-800/60";
              bgGlow = "bg-amber-50/90 dark:bg-amber-950/40";
            }

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto rounded-xl border ${borderColor} ${bgGlow} backdrop-blur-md p-4 shadow-lg shadow-black/5 flex items-start gap-3 bg-white dark:bg-neutral-900`}
              >
                {icon}
                <div className="flex-1 min-w-0 pr-1">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                    {toast.title}
                  </h4>
                  {toast.message && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                      {toast.message}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  aria-label="Close notification"
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
