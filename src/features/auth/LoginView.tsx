import React, { useState } from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Sparkles,
  AlertCircle,
  Key,
  Info,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const LoginView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState<string>('abraham.koranteng@premier.edu');
  const [password, setPassword] = useState<string>('premier2026');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [showCredentialsHint, setShowCredentialsHint] = useState<boolean>(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setLoginError('');
    setPassword('premier2026');
    if (role === 'student') setEmail('abraham.koranteng@premier.edu');
    else if (role === 'admin_registrar') setEmail('registrar@premier.edu');
    else if (role === 'lecturer') setEmail('kwesi.mensah@premier.edu');
    else if (role === 'finance_officer') setEmail('finance@premier.edu');
    else if (role === 'super_admin') setEmail('superadmin@premier.edu');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!email.trim()) {
      setLoginError(selectedRole === 'student' ? 'Please enter your university email, applicant email or Student ID.' : 'Please enter your university email address.');
      return;
    }

    if (!password.trim()) {
      setLoginError('Please enter your account password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = login(email, password, selectedRole);
      if (!result.success) {
        setLoginError(result.error || 'Authentication failed. Please verify your credentials.');
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div id="login-view" className="min-h-screen w-full flex flex-col lg:flex-row bg-neutral-900 text-neutral-100">
      {/* LEFT PANE: Premium Brand & Technology Showcase */}
      <div className="relative flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-950 via-neutral-900 to-black border-b lg:border-b-0 lg:border-r border-neutral-800">
        {/* Back to website button */}
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-5 left-5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-semibold transition-all border border-white/10"
          >
            ← Back to Website
          </button>
        )}
        {/* Abstract animated glowing orbs */}
        <div className="absolute -left-24 -top-24 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg tracking-tight text-white">
              Premier University
            </h2>
            <p className="text-xs font-semibold text-indigo-300">
              Student Information & Academic Management
            </p>
          </div>
        </div>

        {/* Centerpiece Hero Statement */}
        <div className="relative z-10 my-12 lg:my-0 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-xs font-bold text-indigo-300 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Strict Zero-Trust Authentication</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Academic excellence through modern intelligence.
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            A unified, secure ecosystem governing the complete academic journey: admissions verification, dynamic course curricula, progression rules, and institutional access control.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800/80">
            <div className="space-y-1">
              <span className="text-xl sm:text-2xl font-extrabold text-white">100%</span>
              <p className="text-xs text-neutral-400">Strict Role & Password Match</p>
            </div>
            <div className="space-y-1">
              <span className="text-xl sm:text-2xl font-extrabold text-indigo-400">Locked</span>
              <p className="text-xs text-neutral-400">Zero Fake Account Bypasses</p>
            </div>
          </div>
        </div>

        {/* Footer Security Pill */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Institutional Single Sign-On (SSO) & Role Authorization Standard</span>
        </div>
      </div>

      {/* RIGHT PANE: Modern Form Authentication */}
      <div className="flex-1 p-6 sm:p-12 lg:p-16 flex items-center justify-center bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Sign in to your portal
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
              Select your university role and authenticate with your verified credentials.
            </p>
          </div>

          {/* Quick Role Selector Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Institutional Role Profile
              </label>
              <button
                type="button"
                onClick={() => setShowCredentialsHint(!showCredentialsHint)}
                className="text-[11px] text-indigo-500 hover:text-indigo-400 flex items-center gap-1 font-semibold"
              >
                <Key className="w-3 h-3" />
                <span>{showCredentialsHint ? 'Hide sample credentials' : 'View sample credentials'}</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { r: 'student', label: 'Student' },
                { r: 'admin_registrar', label: 'Registrar' },
                { r: 'lecturer', label: 'Faculty' },
                { r: 'finance_officer', label: 'Finance' },
                { r: 'super_admin', label: 'Super Admin' }
              ].map(({ r, label }) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleSelect(r as UserRole)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                    selectedRole === r
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* DEMO CREDENTIALS HELPER DRAWER */}
          {showCredentialsHint && (
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-indigo-400">
                <Info className="w-3.5 h-3.5" />
                <span>Preset Institutional Accounts (Default Password: <code className="bg-indigo-950/60 px-1 py-0.5 rounded text-indigo-200">premier2026</code>)</span>
              </div>
              <ul className="text-[11px] text-neutral-300 space-y-1">
                <li>• <strong>Student:</strong> abraham.koranteng@premier.edu</li>
                <li>• <strong>Accepted Students:</strong> Sign in with your applicant email or assigned Student ID</li>
                <li>• <strong>Registrar:</strong> registrar@premier.edu</li>
                <li>• <strong>Faculty:</strong> kwesi.mensah@premier.edu</li>
                <li>• <strong>Finance:</strong> finance@premier.edu</li>
                <li>• <strong>Super Admin:</strong> superadmin@premier.edu</li>
                <li>• <strong>Suspended Test:</strong> beatrice.aidoo@premier.edu (rejection demo)</li>
              </ul>
            </div>
          )}

          {/* ERROR ALERT BANNER */}
          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="block font-bold text-rose-200 mb-0.5">Authentication Denied</strong>
                <span>{loginError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                {selectedRole === 'student' ? 'University Email, Applicant Email or Student ID' : 'University Email Address'} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  id="login-email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 ${
                    loginError 
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-500/5 dark:bg-rose-950/20' 
                      : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 focus:ring-indigo-500/20'
                  }`}
                  placeholder={selectedRole === 'student' ? 'e.g. yourname@premier.edu, applicant email or PU/BIT/2026/...' : 'e.g. yourname@premier.edu'}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Password <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-neutral-400">Demo Pass: <strong className="text-indigo-400 font-mono">premier2026</strong></span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 ${
                    loginError 
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-500/5 dark:bg-rose-950/20' 
                      : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 focus:ring-indigo-500/20'
                  }`}
                  placeholder="Enter your account password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            <button
              id="login-submit-button"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-400">
            For academic queries or account assistance, contact the <span className="font-semibold text-neutral-600 dark:text-neutral-300">ICT Directorate Helpdesk</span>.
          </div>
        </div>
      </div>
    </div>
  );
};
