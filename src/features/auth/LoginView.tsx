import React, { useState } from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2, 
  ArrowLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface PortalRoleOption {
  id: UserRole;
  label: string;
  defaultEmail: string;
}

const PORTAL_ROLES: PortalRoleOption[] = [
  { id: 'student', label: 'Student', defaultEmail: 'abraham.koranteng@premier.edu' },
  { id: 'admin_registrar', label: 'Registrar', defaultEmail: 'registrar@premier.edu' },
  { id: 'lecturer', label: 'Faculty', defaultEmail: 'kwesi.mensah@premier.edu' },
  { id: 'finance_officer', label: 'Finance', defaultEmail: 'finance@premier.edu' },
  { id: 'super_admin', label: 'Super Admin', defaultEmail: 'superadmin@premier.edu' },
];

export const LoginView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState<string>('abraham.koranteng@premier.edu');
  const [password, setPassword] = useState<string>('premier2026');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<{ title: string; message: string } | null>(null);
  const [showDevAccounts, setShowDevAccounts] = useState<boolean>(false);

  const handleRoleSelect = (roleId: UserRole) => {
    setSelectedRole(roleId);
    setLoginError(null);
    const target = PORTAL_ROLES.find(r => r.id === roleId);
    if (target) {
      setEmail(target.defaultEmail);
      setPassword('premier2026');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      setLoginError({
        title: 'Missing email or ID',
        message: selectedRole === 'student' 
          ? 'Please enter your university email, applicant email or Student ID.' 
          : 'Please enter your university email address.'
      });
      return;
    }

    if (!trimmedPassword) {
      setLoginError({
        title: 'Missing password',
        message: 'Please enter your account password.'
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = login(trimmedEmail, trimmedPassword, selectedRole);
      if (!result.success) {
        const rawErr = result.error || '';
        if (rawErr.toLowerCase().includes('suspended') || rawErr.toLowerCase().includes('inactive')) {
          setLoginError({
            title: 'Account unavailable',
            message: 'Your account is currently inactive or suspended. Please contact the ICT Helpdesk.'
          });
        } else {
          setLoginError({
            title: 'Unable to sign in',
            message: rawErr || 'Please check your email/ID and password and try again.'
          });
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }, 350);
  };

  return (
    <div id="login-view" className="min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-[#0c0d12] text-neutral-900 dark:text-neutral-100 antialiased">
      {/* DESKTOP LEFT PANEL: Quiet, Institutional Brand Experience */}
      <div className="hidden lg:flex lg:w-[40%] xl:w-[38%] relative flex-col justify-between p-10 xl:p-14 bg-[#0b0c10] text-neutral-100 border-r border-neutral-800/70 select-none overflow-hidden">
        {/* Subtle, barely noticeable ambient gradient */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top bar: Back Navigation (if onBack) */}
        <div className="relative z-10 flex items-center justify-between">
          {onBack ? (
            <button
              onClick={onBack}
              type="button"
              className="inline-flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to website</span>
            </button>
          ) : (
            <span className="text-xs text-neutral-500 font-medium">Campus Gateway</span>
          )}
        </div>

        {/* Center: University Identity & Short Statement */}
        <div className="relative z-10 my-auto py-12 space-y-8 max-w-sm">
          {/* Logo Mark + Institution Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-white">
                Premier University
              </h1>
              <p className="text-xs text-neutral-400">
                Student Information & Academic Management
              </p>
            </div>
          </div>

          {/* Institutional Statement (One short statement, calm typography) */}
          <div className="space-y-2 pt-2">
            <p className="text-2xl xl:text-3xl font-semibold tracking-tight text-neutral-100 leading-snug">
              Your academic journey, <br />
              connected in one place.
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Unified institutional portal for students, faculty, and administration.
            </p>
          </div>
        </div>

        {/* Bottom Institutional Microcopy */}
        <div className="relative z-10 text-[11px] text-neutral-500 flex items-center gap-2">
          <span>© {new Date().getFullYear()} Premier University</span>
          <span>•</span>
          <span>Secure Institutional Portal</span>
        </div>
      </div>

      {/* RIGHT PANE: Focused Authentication Experience */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 overflow-y-auto">
        {/* Mobile Header (Shown only on small screens) */}
        <div className="lg:hidden flex items-center justify-between pb-6 mb-2 border-b border-neutral-200/70 dark:border-neutral-800/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-100 block">
                Premier University
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block -mt-0.5">
                Academic Management Portal
              </span>
            </div>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              type="button"
              className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
        </div>

        {/* Centered Form Wrapper */}
        <div className="w-full max-w-[440px] mx-auto my-auto py-4 sm:py-6 space-y-6">
          {/* Welcome Heading */}
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-display">
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Sign in with your institutional credentials to continue.
            </p>
          </div>

          {/* Portal Selector (Section 7: Clean Segmented Grid) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Select portal
            </label>
            <div className="p-1 rounded-xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800/80 space-y-1">
              {/* Row 1: Student, Registrar, Faculty */}
              <div className="grid grid-cols-3 gap-1">
                {PORTAL_ROLES.slice(0, 3).map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleSelect(role.id)}
                    className={`py-2 px-2 rounded-lg text-xs font-medium transition-all text-center cursor-pointer ${
                      selectedRole === role.id
                        ? 'bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs border border-neutral-200/60 dark:border-neutral-700/80'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200/40 dark:hover:bg-neutral-800/40 border border-transparent'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>

              {/* Row 2: Finance, Super Admin */}
              <div className="grid grid-cols-2 gap-1">
                {PORTAL_ROLES.slice(3).map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleSelect(role.id)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-all text-center cursor-pointer ${
                      selectedRole === role.id
                        ? 'bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs border border-neutral-200/60 dark:border-neutral-700/80'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200/40 dark:hover:bg-neutral-800/40 border border-transparent'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Human Error Alert Banner */}
          {loginError && (
            <div 
              role="alert"
              className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5 transition-all"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div className="leading-snug">
                <span className="font-semibold block text-rose-900 dark:text-rose-200">{loginError.title}</span>
                <span className="text-rose-700 dark:text-rose-300/90">{loginError.message}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / ID Field */}
            <div>
              <label 
                htmlFor="login-email"
                className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
              >
                {selectedRole === 'student' ? 'Email, Applicant Email or Student ID' : 'University Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  id="login-email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  className={`w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl border text-sm transition-colors ${
                    loginError 
                      ? 'border-rose-300 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/10 focus:ring-rose-500/20 focus:border-rose-500' 
                      : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/40 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600'
                  }`}
                  placeholder={selectedRole === 'student' ? 'Enter your email or ID' : 'Enter your university email'}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="login-password"
                className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  className={`w-full h-11 sm:h-12 pl-10 pr-11 rounded-xl border text-sm transition-colors ${
                    loginError 
                      ? 'border-rose-300 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/10 focus:ring-rose-500/20 focus:border-rose-500' 
                      : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/40 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600'
                  }`}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 focus:outline-none cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-0.5">
              <label 
                htmlFor="remember-device" 
                className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer select-none"
              >
                <input
                  id="remember-device"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-indigo-600 focus:ring-indigo-500/30 dark:bg-neutral-800 cursor-pointer"
                />
                <span>Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-button"
              type="submit"
              disabled={isLoading}
              className="w-full h-11 sm:h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm tracking-wide transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/30 active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Discreet Help / Support Notice */}
          <div className="text-center text-xs text-neutral-500 dark:text-neutral-400 pt-1">
            Need help accessing your account?{' '}
            <span className="text-neutral-700 dark:text-neutral-300 font-medium">
              Contact the ICT Helpdesk
            </span>
          </div>

          {/* Discreet Development Accounts Helper (Rule 9: Non-intrusive collapsible panel) */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
            <button
              type="button"
              onClick={() => setShowDevAccounts(!showDevAccounts)}
              className="w-full flex items-center justify-between text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors py-1 cursor-pointer"
            >
              <span>Development demo accounts</span>
              {showDevAccounts ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showDevAccounts && (
              <div className="mt-2 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 space-y-2">
                <div className="flex items-center justify-between font-mono text-[10px] pb-1.5 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-500">Default Password:</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded">
                    premier2026
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-1 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                  <div>• Student: <span className="text-neutral-700 dark:text-neutral-300">abraham.koranteng@premier.edu</span></div>
                  <div>• Registrar: <span className="text-neutral-700 dark:text-neutral-300">registrar@premier.edu</span></div>
                  <div>• Faculty: <span className="text-neutral-700 dark:text-neutral-300">kwesi.mensah@premier.edu</span></div>
                  <div>• Finance: <span className="text-neutral-700 dark:text-neutral-300">finance@premier.edu</span></div>
                  <div>• Super Admin: <span className="text-neutral-700 dark:text-neutral-300">superadmin@premier.edu</span></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom spacer for balance */}
        <div className="hidden sm:block text-center text-[11px] text-neutral-400/60 py-2">
          Premier University Academic Systems
        </div>
      </div>
    </div>
  );
};
