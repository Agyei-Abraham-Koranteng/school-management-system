import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  CreditCard, 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  FileText, 
  Calendar, 
  Bell, 
  Sliders, 
  Sparkles, 
  Search,
  Check,
  X,
  Radio,
  Building2,
  Briefcase
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { AnimatedCounter } from '../../components/shared/AnimatedCounter';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { 
    settings, 
    students, 
    applications, 
    registrations, 
    approveCourseRegistration, 
    rejectCourseRegistration, 
    faculties, 
    departments, 
    programs, 
    courses, 
    staff, 
    financialLedgers, 
    academicWarnings, 
    auditLogs,
    supabaseStatus
  } = useSchool();

  const { success, error: toastError } = useToast();
  const [rejectModalSlipId, setRejectModalSlipId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('Course prerequisite or credit limit requirement not met');

  // Real Dynamic Calculations: Students
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const level100Count = students.filter(s => s.currentLevel === '100').length;
  const level200Count = students.filter(s => s.currentLevel === '200').length;
  const level300Count = students.filter(s => s.currentLevel === '300').length;
  const level400Count = students.filter(s => s.currentLevel === '400').length;

  // Real Dynamic Calculations: Admissions
  const totalApplications = applications.length;
  const pendingReviewApps = applications.filter(a => ['submitted', 'resubmitted', 'under_review'].includes(a.status)).length;
  const offeredApps = applications.filter(a => ['admission_offered', 'offer_accepted'].includes(a.status)).length;
  const enrolledApps = applications.filter(a => a.status === 'enrolled').length;

  // Real Dynamic Calculations: Financial Ledgers
  const ledgerList = Object.values(financialLedgers);
  const totalBilled = ledgerList.reduce((acc, curr) => acc + (curr.totalBilled || 0), 0);
  const totalCollected = ledgerList.reduce((acc, curr) => acc + (curr.totalPaid || 0), 0);
  const totalArrears = Math.max(0, totalBilled - totalCollected);
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 100;

  // Real Dynamic Calculations: Registrations
  const pendingRegistrations = registrations.filter(r => r.status === 'submitted');
  const approvedRegistrations = registrations.filter(r => r.status === 'approved');

  // Real Dynamic Calculations: Active Warnings
  const activeWarnings = academicWarnings.filter(w => w.status === 'active');

  const handleApproveSlip = (slipId: string) => {
    approveCourseRegistration(slipId, 'Registry Academic Directorate');
    success('Registration Approved', `Course registration slip ${slipId} has been formally approved.`);
  };

  const handleConfirmReject = () => {
    if (!rejectModalSlipId) return;
    rejectCourseRegistration(rejectModalSlipId, rejectionReason);
    toastError('Registration Rejected', `Slip ${rejectModalSlipId} has been sent back for student corrections.`);
    setRejectModalSlipId(null);
  };

  return (
    <div id="admin-dashboard-root" className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      {/* 1. Executive Overview Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-neutral-900 via-indigo-950 to-neutral-950 text-white p-6 md:p-8 border border-neutral-800 shadow-xl"
      >
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 w-64 h-64 rounded-full bg-emerald-600/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Institutional Control Center</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Institutional Executive Overview
            </h1>

            <p className="text-sm text-neutral-300 max-w-2xl leading-relaxed">
              Real-time operational intelligence across university admissions, student academic progression, bursary tuition collections, and faculty governance.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Session: <strong className="text-white">{settings.currentSession}</strong> ({settings.currentSemester})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                Live Sync Stream: <strong className="text-emerald-400">Active (Cross-Tab & Cloud)</strong>
              </span>
            </div>
          </div>

          {/* Quick Action Shortlinks */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('admin-admissions')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-wide shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Admissions Directorate</span>
              {pendingReviewApps > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-white text-indigo-900 font-black text-[10px]">
                  {pendingReviewApps}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('admin-students')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-xs tracking-wide flex items-center justify-center gap-2 backdrop-blur-xs transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Students Directory</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. Key Institutional Performance Metrics (100% Real Live Computed) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Total Enrolled Students */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onClick={() => onNavigate('admin-students')}
          className="cursor-pointer bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-700 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Enrolled Students</span>
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <GraduationCap className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
              <AnimatedCounter value={totalStudents} />
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {activeStudents} Active
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
            <span>L100: <strong className="text-neutral-800 dark:text-neutral-200">{level100Count}</strong></span>
            <span>L200: <strong className="text-neutral-800 dark:text-neutral-200">{level200Count}</strong></span>
            <span>L300: <strong className="text-neutral-800 dark:text-neutral-200">{level300Count}</strong></span>
            <span>L400: <strong className="text-neutral-800 dark:text-neutral-200">{level400Count}</strong></span>
          </div>
        </motion.div>

        {/* Admissions Pipeline Status */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => onNavigate('admin-admissions')}
          className="cursor-pointer bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-700 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Admissions Pipeline</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <UserPlus className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
              <AnimatedCounter value={totalApplications} />
            </span>
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Total Applicants</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px]">
            <span className="text-amber-600 dark:text-amber-400 font-semibold">
              {pendingReviewApps} Pending Review
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {enrolledApps} Enrolled
            </span>
          </div>
        </motion.div>

        {/* Bursary & Tuition Collections */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => onNavigate('finance')}
          className="cursor-pointer bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-purple-400 dark:hover:border-purple-700 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Tuition Fees Collected</span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
              GHS <AnimatedCounter value={totalCollected} />
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px]">
            <span className="text-neutral-500 dark:text-neutral-400">
              Billed: <strong>GHS {totalBilled.toLocaleString()}</strong>
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              {collectionRate}% Cleared
            </span>
          </div>
        </motion.div>

        {/* Academic Structure & Catalog */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => onNavigate('admin-academic-structure')}
          className="cursor-pointer bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-700 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Academic Infrastructure</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
              <AnimatedCounter value={programs.length} />
            </span>
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Degree Programs</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
            <span>{faculties.length} Faculties</span>
            <span>{departments.length} Departments</span>
            <span className="font-bold text-neutral-800 dark:text-neutral-200">{courses.length} Courses</span>
          </div>
        </motion.div>
      </div>

      {/* 3. Operational Grid: Pending Course Registrations & Live Admissions Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: Real-Time Course Registration Approvals */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 md:p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Course Registrations Audit Queue
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {pendingRegistrations.length} slip(s) awaiting Academic Board clearance
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              {approvedRegistrations.length} Approved Slips
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {pendingRegistrations.length > 0 ? (
              pendingRegistrations.map((slip) => {
                const std = students.find(s => s.studentId === slip.studentId || s.id === slip.studentId);
                const studentName = std ? `${std.firstName} ${std.lastName}` : `Student (${slip.studentId})`;

                return (
                  <div
                    key={slip.id}
                    className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                          {studentName}
                        </strong>
                        <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-md bg-white dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-semibold border border-neutral-200 dark:border-neutral-600">
                          {slip.studentId}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Level {slip.level} · {slip.items?.length || 0} Courses · <strong>{slip.totalCredits} Credits</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleApproveSlip(slip.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRejectModalSlipId(slip.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center rounded-xl bg-neutral-50 dark:bg-neutral-800/30 border border-dashed border-neutral-200 dark:border-neutral-800 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  All Course Registrations Cleared
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
                  No pending student registration slips require registrar verification at this moment.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Recent Online Admissions Activity */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 md:p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Admissions Application Feed
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Recent applicant activity across online application portals
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('admin-admissions')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Full Directorate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {applications.slice(0, 4).map((app) => {
              const statusColor = 
                app.status === 'enrolled' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                app.status === 'offer_accepted' ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300' :
                app.status === 'admission_offered' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300' :
                app.status === 'under_review' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';

              return (
                <div
                  key={app.id}
                  onClick={() => onNavigate('admin-admissions')}
                  className="cursor-pointer p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/70 flex items-center justify-between gap-3 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors shadow-2xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                        {app.firstName} {app.lastName}
                      </strong>
                      <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                        {app.applicationNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                      {app.programChoiceName} · Aggregate: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{app.aggregateScore}</span>
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize whitespace-nowrap ${statusColor}`}>
                    {app.status.replace(/_/g, ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Secondary Row: Staff & Faculty Overview + Live Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff & Faculty Directorate Widget */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 md:p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Staff & Faculty Directorate
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {staff.length} Active Academic Staff
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('admin-staff')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Manage →
            </button>
          </div>

          <div className="space-y-2.5">
            {staff.slice(0, 3).map((member) => (
              <div
                key={member.id}
                className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between text-xs"
              >
                <div>
                  <strong className="block font-semibold text-neutral-900 dark:text-neutral-100">
                    {member.title} {member.firstName} {member.lastName}
                  </strong>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {member.designation} · {member.department}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-neutral-500 dark:text-neutral-400">
                  {member.staffId}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Institutional Security & Audit Trail */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl p-5 md:p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Live Security & Governance Audit Trail
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Immutable event stream tracking registry and student activities
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('audit-logs')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Full Audit Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {auditLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                      {log.action}
                    </span>
                    <strong className="text-neutral-900 dark:text-neutral-100 truncate">
                      {log.userName}
                    </strong>
                    <span className="text-[10px] text-neutral-400">
                      ({log.userRole})
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                    {log.details}
                  </p>
                </div>

                <span className="text-[10px] font-medium text-neutral-400 shrink-0">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reject Slip Modal */}
      {rejectModalSlipId && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Reject Registration Slip
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Please specify the institutional reason for rejecting registration slip <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{rejectModalSlipId}</span>. The candidate will receive an immediate notice to correct their course selection.
            </p>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Registry Comments / Rejection Reason:
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalSlipId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
