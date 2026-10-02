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
  ChevronUp,
  Sparkles
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
    <div id="login-view" className="min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-[#070D18] text-slate-900 dark:text-white antialiased">
      {/* DESKTOP LEFT PANEL: Official Brand Showcase with Student Illustration & Colors (Deep Blue, Red, White) */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[44%] relative flex-col justify-between p-8 xl:p-12 bg-gradient-to-b from-[#070E1C] via-[#0B1528] to-[#060B16] text-white border-r border-blue-950/80 select-none overflow-hidden">
        {/* Ambient background glows matching deep blue & university red */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A51C30]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Bar: Back navigation & Institutional Crest */}
        <div className="relative z-10 flex items-center justify-between">
          {onBack ? (
            <button
              onClick={onBack}
              type="button"
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-200 hover:text-white transition-colors cursor-pointer group px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to website</span>
            </button>
          ) : (
            <span className="text-xs text-blue-300/80 font-medium">Campus Gateway</span>
          )}

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-blue-200">
            <Sparkles className="w-3 h-3 text-[#A51C30]" />
            <span>Official Academic Portal</span>
          </div>
        </div>

        {/* Centerpiece: Student Illustration & University Identity */}
        <div className="relative z-10 my-auto py-6 space-y-6 max-w-md mx-auto w-full">
          {/* Brand Header */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#0F1E36] via-[#1E3A8A] to-[#A51C30] text-white flex items-center justify-center shadow-lg shadow-black/40 border border-white/15 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight text-white leading-tight">
                Premier University
              </h1>
              <p className="text-xs text-blue-200/80 font-medium">
                Student Information & Academic Management
              </p>
            </div>
          </div>

          {/* Featured Graduate Illustration Card */}
          <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#0A1324]/70 shadow-2xl backdrop-blur-sm group">
            <img
              src="/images/auth-student-official.jpg"
              alt="Premier University Graduate"
              className="w-full h-auto object-cover max-h-[340px] xl:max-h-[380px] select-none transition-transform duration-500 group-hover:scale-[1.01]"
            />
            {/* Integrated Institutional Overlay Badge */}
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#070E1C]/90 backdrop-blur-md border border-white/15 flex items-center justify-between gap-3 shadow-lg">
              <div>
                <span className="block font-bold text-white text-xs">Excellence & Leadership</span>
                <span className="block text-[11px] text-blue-200">Shaping the future of academia</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#A51C30] text-white uppercase tracking-wider shrink-0 shadow-xs">
                Class of 2026
              </span>
            </div>
          </div>

          {/* Institutional Statement */}
          <div className="space-y-1.5 pt-1">
            <h2 className="text-xl xl:text-2xl font-bold tracking-tight text-white leading-snug">
              Your academic journey, <br />
              connected in one place.
            </h2>
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Unified institutional access for students, faculty, and administrative officers.
            </p>
          </div>
        </div>

        {/* Bottom Institutional Microcopy */}
        <div className="relative z-10 text-[11px] text-blue-300/70 flex items-center justify-between border-t border-white/10 pt-4">
          <span>© {new Date().getFullYear()} Premier University</span>
          <span className="text-[10px] tracking-wider uppercase text-blue-200 font-semibold">Veritas & Scientia</span>
        </div>
      </div>

      {/* RIGHT PANE: Focused Authentication Experience (Clean White / Deep Blue / Red Accents) */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 overflow-y-auto">
        {/* Mobile Header (Shown on small screens with student avatar) */}
        <div className="lg:hidden pb-4 mb-4 border-b border-slate-200 dark:border-blue-950">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0F1E36] to-[#A51C30] text-white flex items-center justify-center shadow-xs">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white block">
                Premier University
              </span>
            </div>

            {onBack && (
              <button
                onClick={onBack}
                type="button"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-blue-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
          </div>

          {/* Mobile Student Showcase Banner */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-[#070E1C] via-[#0B1528] to-[#0A1324] text-white border border-blue-900/50 shadow-sm">
            <img
              src="/images/auth-student-official.jpg"
              alt="Premier University Graduate"
              className="w-12 h-12 rounded-lg object-cover shrink-0 border border-white/20 shadow-xs"
            />
            <div className="min-w-0 flex-1">
              <span className="block font-bold text-xs text-white truncate">
                Academic Portal Gateway
              </span>
              <span className="block text-[11px] text-blue-200 truncate">
                Sign in with institutional credentials
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#A51C30] text-white uppercase tracking-wider shrink-0">
              Portal
            </span>
          </div>
        </div>

        {/* Centered Form Wrapper */}
        <div className="w-full max-w-[440px] mx-auto my-auto py-2 sm:py-6 space-y-6">
          {/* Welcome Heading */}
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-blue-200/80">
              Sign in with your verified institutional credentials to continue.
            </p>
          </div>

          {/* Portal Selector (Segmented Grid with Crimson Red Active State) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-blue-200">
              Select portal
            </label>
            <div className="p-1 rounded-xl bg-slate-100 dark:bg-[#0A1324] border border-slate-200 dark:border-blue-950/80 space-y-1">
              {/* Row 1: Student, Registrar, Faculty */}
              <div className="grid grid-cols-3 gap-1">
                {PORTAL_ROLES.slice(0, 3).map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleSelect(role.id)}
                    className={`py-2 px-2 rounded-lg text-xs font-medium transition-all text-center cursor-pointer ${
                      selectedRole === role.id
                        ? 'bg-[#A51C30] text-white font-bold shadow-xs border border-red-700/60'
                        : 'text-slate-600 dark:text-blue-200/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-blue-900/30 border border-transparent'
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
                        ? 'bg-[#A51C30] text-white font-bold shadow-xs border border-red-700/60'
                        : 'text-slate-600 dark:text-blue-200/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-blue-900/30 border border-transparent'
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
              className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-900 dark:text-red-200 text-xs flex items-start gap-2.5 transition-all"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-[#A51C30] dark:text-red-400 mt-0.5" />
              <div className="leading-snug">
                <span className="font-bold block text-red-950 dark:text-red-200">{loginError.title}</span>
                <span className="text-red-800 dark:text-red-300">{loginError.message}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / ID Field */}
            <div>
              <label 
                htmlFor="login-email"
                className="block text-xs font-semibold text-slate-700 dark:text-blue-200 mb-1.5"
              >
                {selectedRole === 'student' ? 'Email, Applicant Email or Student ID' : 'University Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-blue-400 pointer-events-none" />
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
                      ? 'border-red-300 dark:border-red-800 bg-red-50/30 dark:bg-red-950/10 focus:ring-red-500/20 focus:border-[#A51C30]' 
                      : 'border-slate-200 dark:border-blue-950/90 bg-slate-50/50 dark:bg-[#0A1324]/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-blue-300/40 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/20 focus:border-[#A51C30]'
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
                className="block text-xs font-semibold text-slate-700 dark:text-blue-200 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-blue-400 pointer-events-none" />
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
                      ? 'border-red-300 dark:border-red-800 bg-red-50/30 dark:bg-red-950/10 focus:ring-red-500/20 focus:border-[#A51C30]' 
                      : 'border-slate-200 dark:border-blue-950/90 bg-slate-50/50 dark:bg-[#0A1324]/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-blue-300/40 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/20 focus:border-[#A51C30]'
                  }`}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-blue-400 dark:hover:text-blue-200 p-1 focus:outline-none cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-0.5">
              <label 
                htmlFor="remember-device" 
                className="flex items-center gap-2 text-xs text-slate-600 dark:text-blue-200/80 cursor-pointer select-none"
              >
                <input
                  id="remember-device"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-blue-800 text-[#A51C30] focus:ring-[#A51C30]/30 dark:bg-[#0A1324] cursor-pointer"
                />
                <span>Remember this device</span>
              </label>
            </div>

            {/* Submit Button (Official Crimson Red) */}
            <button
              id="login-submit-button"
              type="submit"
              disabled={isLoading}
              className="w-full h-11 sm:h-12 rounded-xl bg-[#A51C30] hover:bg-[#8F1829] active:bg-[#781322] text-white font-bold text-xs sm:text-sm tracking-wide transition-colors flex items-center justify-center gap-2 shadow-md shadow-red-950/20 disabled:opacity-60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#A51C30]/40 active:scale-[0.99]"
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
          <div className="text-center text-xs text-slate-500 dark:text-blue-300/70 pt-1">
            Need help accessing your account?{' '}
            <span className="text-slate-700 dark:text-white font-semibold">
              Contact the ICT Helpdesk
            </span>
          </div>

          {/* Discreet Development Accounts Helper (Collapsible) */}
          <div className="pt-4 border-t border-slate-200 dark:border-blue-950/80">
            <button
              type="button"
              onClick={() => setShowDevAccounts(!showDevAccounts)}
              className="w-full flex items-center justify-between text-[11px] text-slate-400 dark:text-blue-400/80 hover:text-slate-600 dark:hover:text-blue-200 transition-colors py-1 cursor-pointer"
            >
              <span>Development demo accounts</span>
              {showDevAccounts ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showDevAccounts && (
              <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-[#0A1324] border border-slate-200 dark:border-blue-950 text-[11px] text-slate-600 dark:text-blue-200/80 space-y-2">
                <div className="flex items-center justify-between font-mono text-[10px] pb-1.5 border-b border-slate-200 dark:border-blue-950">
                  <span className="text-slate-500 dark:text-blue-300/70">Default Password:</span>
                  <span className="text-[#A51C30] dark:text-red-300 font-bold bg-red-50 dark:bg-red-950/60 px-1.5 py-0.5 rounded">
                    premier2026
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-1 text-[10px] font-mono text-slate-500 dark:text-blue-300/70">
                  <div>• Student: <span className="text-slate-800 dark:text-white">abraham.koranteng@premier.edu</span></div>
                  <div>• Registrar: <span className="text-slate-800 dark:text-white">registrar@premier.edu</span></div>
                  <div>• Faculty: <span className="text-slate-800 dark:text-white">kwesi.mensah@premier.edu</span></div>
                  <div>• Finance: <span className="text-slate-800 dark:text-white">finance@premier.edu</span></div>
                  <div>• Super Admin: <span className="text-slate-800 dark:text-white">superadmin@premier.edu</span></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom spacer for balance */}
        <div className="hidden sm:block text-center text-[11px] text-slate-400 dark:text-blue-300/50 py-2">
          Premier University Academic Systems
        </div>
      </div>
    </div>
  );
};
