import React from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Award, 
  BookCheck, 
  BookOpen, 
  ArrowRight, 
  Calendar, 
  Clock, 
  FileText, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  ClipboardCheck, 
  Bell,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { StudentRecord } from '../../types';
import { AnimatedCounter } from '../../components/shared/AnimatedCounter';
import { useSchool } from '../../context/SchoolContext';
import { academicEngine } from '../../services/academics/academicEngine';
import { DEFAULT_SYSTEM_SETTINGS, SAMPLE_STUDENT } from '../../data/mockData';

interface StudentDashboardProps {
  student: StudentRecord;
  onNavigate: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student: propStudent,
  onNavigate
}) => {
  const { 
    settings, 
    activeStudent,
    students,
    academicWarnings, 
    registrations, 
    financialLedgers, 
    announcements, 
    attendanceSessions,
    courseAttempts,
    courses,
    staff
  } = useSchool();

  // Resolve active live student record dynamically from context
  const student = React.useMemo(() => {
    return students.find(s => 
      s.studentId === propStudent.studentId || 
      s.id === propStudent.id || 
      (propStudent.applicantEmail && s.applicantEmail === propStudent.applicantEmail)
    ) || (activeStudent?.studentId === propStudent.studentId ? activeStudent : propStudent);
  }, [students, activeStudent, propStudent]);

  // Real-time Academic Calculation for CGPA and Credits Earned
  const { liveCgpa, liveCreditsEarned } = React.useMemo(() => {
    const studentAttempts = courseAttempts.filter(ca => 
      ca.studentId === student.studentId || 
      ca.studentId === student.id ||
      (!ca.studentId && (student.studentId === SAMPLE_STUDENT.studentId || student.id === SAMPLE_STUDENT.id))
    );

    if (studentAttempts.length > 0) {
      const scale = settings.gradingScale || DEFAULT_SYSTEM_SETTINGS.gradingScale;
      const cum = academicEngine.calculateCumulativeCgpa(studentAttempts, scale);
      const creditsEarned = Math.max(cum.totalCreditsEarned, student.creditsEarned || 0);
      const cgpa = cum.totalCreditsAttempted > 0 ? cum.cgpa : (student.currentCgpa || 0.00);
      return { liveCgpa: cgpa, liveCreditsEarned: creditsEarned };
    }

    return {
      liveCgpa: student.currentCgpa || 0.00,
      liveCreditsEarned: student.creditsEarned || 0
    };
  }, [courseAttempts, student, settings.gradingScale]);

  const percentageCompleted = Math.min(
    100,
    Math.round(((liveCreditsEarned || 0) / (student.requiredCredits || 132)) * 100)
  );

  // Dynamic Time-of-Day Greeting
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  // Degree Classification Calculation based on real institutional CGPA rules
  const degreeClass = React.useMemo(() => {
    const cgpa = liveCgpa;
    if (cgpa >= 3.60) return { label: 'Class: First Class Honours', color: 'text-emerald-700 dark:text-emerald-400' };
    if (cgpa >= 3.00) return { label: 'Class: Second Class Upper', color: 'text-indigo-700 dark:text-indigo-400' };
    if (cgpa >= 2.50) return { label: 'Class: Second Class Lower', color: 'text-sky-700 dark:text-sky-400' };
    if (cgpa >= 2.00) return { label: 'Class: Third Class', color: 'text-amber-700 dark:text-amber-400' };
    if (cgpa >= 1.50) return { label: 'Class: Pass', color: 'text-orange-700 dark:text-orange-400' };
    return { label: 'Academic Remediation Required', color: 'text-rose-700 dark:text-rose-400' };
  }, [liveCgpa]);

  // Progression Target Description
  const progressionTarget = (() => {
    if (student.academicStanding?.toLowerCase().includes('probation') || student.academicStanding?.toLowerCase().includes('warning')) {
      return 'Subject to Academic Remediation';
    }
    switch (student.currentLevel) {
      case '100': return 'Eligible for Level 200 progression';
      case '200': return 'Eligible for Level 300 progression';
      case '300': return 'Eligible for Level 400 progression';
      case '400': return 'Eligible for Graduation Clearance';
      default: return 'In Good Academic Standing';
    }
  })();

  // Real Active Student Course Registration lookup with priority for active session & semester
  const activeReg = React.useMemo(() => {
    const studentRegs = registrations.filter(r => 
      r.studentId === student.studentId || 
      r.studentId === student.id ||
      (student.applicantEmail && r.studentId === student.applicantEmail)
    );
    if (studentRegs.length === 0) return undefined;
    return studentRegs.find(r => 
      (r.academicSession === settings.currentSession || !r.academicSession) && 
      (r.semester === settings.currentSemester || !r.semester)
    ) || studentRegs[0];
  }, [registrations, student, settings.currentSession, settings.currentSemester]);

  const registeredCoursesCount = activeReg?.items?.length || 0;
  const registeredCreditsCount = activeReg?.totalCredits || 0;
  const regStatus = activeReg?.status || 'unregistered';

  // Real Active Warnings for this student
  const activeStudentWarnings = academicWarnings.filter(w => 
    (w.studentId === student.studentId || w.studentId === student.id) && w.status === 'active'
  );

  // Real Financial Ledger lookup with dynamic multi-key lookup and fallback provisioning
  const defaultTuitionByLevel = student.currentLevel === '100' ? 4500 : student.currentLevel === '200' ? 4800 : student.currentLevel === '300' ? 5200 : 5500;
  
  const ledger = React.useMemo(() => {
    const found = financialLedgers[student.studentId] || 
      financialLedgers[student.id] || 
      (student.applicantEmail ? financialLedgers[student.applicantEmail] : undefined) ||
      Object.values(financialLedgers).find(l => 
        l.studentId === student.studentId || 
        l.studentId === student.id || 
        (student.applicantEmail && l.studentId === student.applicantEmail)
      );

    if (found) return found;

    return {
      studentId: student.studentId,
      totalBilled: defaultTuitionByLevel,
      totalPaid: 0,
      balance: defaultTuitionByLevel,
      isCleared: false,
      transactions: []
    };
  }, [financialLedgers, student, defaultTuitionByLevel]);

  const isFeeCleared = ledger.isCleared || ledger.balance <= 0;

  // Real Latest Institutional Announcement for student
  const latestAnnouncement = announcements.find(a => 
    a.targetAudience === 'students' || a.targetAudience === 'all'
  ) || announcements[0];

  // Real Attendance Calculation for this student
  const studentSessions = attendanceSessions.filter(ses => 
    ses.students && ses.students.some(s => s.studentId === student.id || s.matricNo === student.studentId)
  );
  const presentCount = studentSessions.filter(ses => 
    ses.students.some(s => (s.studentId === student.id || s.matricNo === student.studentId) && s.status === 'present')
  ).length;
  const attendanceRate = studentSessions.length > 0 
    ? Math.round((presentCount / studentSessions.length) * 100) 
    : null;

  // Dynamic Progression Milestones
  const nextLevelThreshold = student.currentLevel === '100' ? 36 : student.currentLevel === '200' ? 72 : student.currentLevel === '300' ? 108 : (student.requiredCredits || 132);
  const creditsNeededForNext = Math.max(0, nextLevelThreshold - (student.creditsEarned || 0));

  return (
    <div id="student-dashboard" className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      {/* Active Academic Warning Alert if present */}
      {activeStudentWarnings.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed flex-1">
            <strong className="font-bold block text-amber-700 dark:text-amber-300">
              Institutional Academic Notice ({activeStudentWarnings[0].severity.toUpperCase()}):
            </strong>
            {activeStudentWarnings[0].reason} {activeStudentWarnings[0].remediationPlan || ''}
          </div>
        </div>
      )}

      {/* 1. Welcoming Hero Banner with Real Dynamic Attributes */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-neutral-950 text-white p-6 md:p-8 border border-indigo-800/40 shadow-xl shadow-indigo-950/10"
      >
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-12 bottom-0 w-64 h-64 rounded-full bg-indigo-600/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-200">
              <span className={`w-2 h-2 rounded-full ${student.academicStanding === 'Good Standing' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {student.academicStanding || 'Good Standing'}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              {greeting}, {student.firstName} 👋
            </h1>

            <p className="text-sm sm:text-base text-indigo-200/90 font-medium max-w-2xl">
              {student.programName} · Level {student.currentLevel} · {settings.currentSemester}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-indigo-300/80">
              <span>ID: <strong className="text-white font-mono">{student.studentId}</strong></span>
              <span>•</span>
              <span>{student.faculty || 'Faculty of Computing & Information Systems'}</span>
              <span>•</span>
              <span>Session {settings.currentSession}</span>
            </div>
          </div>

          {/* Quick Action Pill */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              id="dash-quick-register"
              type="button"
              onClick={() => onNavigate('registration')}
              className="px-5 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Course Registration</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="dash-quick-transcripts"
              type="button"
              onClick={() => onNavigate('transcripts')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 backdrop-blur-xs transition-colors"
            >
              <span>View Transcript</span>
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. Key Academic Metric Cards (Dynamic & Animated) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Cumulative GPA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.25 }}
          onClick={() => onNavigate('results')}
          className="cursor-pointer bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">CGPA</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
              <AnimatedCounter value={liveCgpa} decimals={2} />
            </span>
            <span className="text-xs font-semibold text-neutral-400">/ 4.00</span>
          </div>
          <div className={`mt-2 text-xs font-medium ${degreeClass.color} flex items-center gap-1 truncate`}>
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{degreeClass.label}</span>
          </div>
        </motion.div>

        {/* Credits Earned */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.25 }}
          onClick={() => onNavigate('academic-journey')}
          className="cursor-pointer bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Credits Earned</span>
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <BookCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
              <AnimatedCounter value={liveCreditsEarned} />
            </span>
            <span className="text-xs font-semibold text-neutral-400">/ {student.requiredCredits || 132} Total</span>
          </div>
          <div className="mt-2 w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${percentageCompleted}%` }}
            />
          </div>
        </motion.div>

        {/* Real Enrolled Courses Status */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.25 }}
          onClick={() => onNavigate('registration')}
          className="cursor-pointer bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-purple-300 dark:hover:border-purple-800 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Courses</span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
              <GraduationCap className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
              <AnimatedCounter value={registeredCoursesCount} />
            </span>
            <span className="text-xs font-semibold text-neutral-400">
              {registeredCoursesCount === 1 ? 'Course' : 'Courses'} · {registeredCreditsCount} Credits
            </span>
          </div>
          <div className="mt-2 text-xs font-semibold flex items-center gap-1.5 truncate">
            {regStatus === 'approved' && (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 truncate">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Status: Approved Slip
              </span>
            )}
            {regStatus === 'submitted' && (
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 truncate">
                <Clock className="w-3.5 h-3.5 shrink-0" /> Status: Under Registry Review
              </span>
            )}
            {regStatus === 'rejected' && (
              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 truncate">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Registration Needs Revision
              </span>
            )}
            {regStatus === 'unregistered' && (
              <span className="text-indigo-600 dark:text-indigo-400 font-bold truncate">
                Registration Open · Enroll Now →
              </span>
            )}
          </div>
        </motion.div>

        {/* Real Bursary & Tuition Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.25 }}
          onClick={() => onNavigate('finance')}
          className="cursor-pointer bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Tuition & Bursary</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
              GHS <AnimatedCounter value={ledger.totalPaid || 0} />
            </span>
            <span className="text-xs font-semibold text-neutral-400">Paid</span>
          </div>
          <div className="mt-2 text-xs font-semibold flex items-center gap-1.5">
            {isFeeCleared ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Fees Cleared (100%)
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                Arrears: GHS {ledger.balance.toLocaleString()}
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* 3. Main Dashboard Body: Enrolled Courses & Academic Operational Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Registered Courses for Current Semester */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Active Courses · Semester 1
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Official curriculum schedule registered for Level {student.currentLevel}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('registration')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Manage Slip</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activeReg && activeReg.items && activeReg.items.length > 0 ? (
              activeReg.items.map((item) => {
                const courseMeta = courses.find(c => c.code.toLowerCase() === item.code.toLowerCase() || c.id === item.courseId);
                const lecturer = staff.find(s => s.id === courseMeta?.assignedLecturerId);

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors shadow-2xs"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex flex-col items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-700">
                        <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                          {item.code.substring(0, 2)}
                        </span>
                        <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400">
                          {item.code.substring(2)}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                          {item.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                          <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                            {item.creditHours} Credits
                          </span>
                          <span>•</span>
                          <span className="capitalize px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[11px] font-medium">
                            {item.type}
                          </span>
                          {lecturer && (
                            <>
                              <span>•</span>
                              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                                {lecturer.title} {lecturer.firstName} {lecturer.lastName}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        activeReg.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${activeReg.status === 'approved' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {activeReg.status === 'approved' ? 'Enrolled' : 'Pending Verification'}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  No Courses Registered for Level {student.currentLevel}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                  Your official course registration slip has not been submitted for {settings.currentSemester} ({settings.currentSession}). Complete course selection to obtain lecture schedule clearance.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('registration')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Select & Register Courses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Real Bulletins, Real Milestones, Real Attendance */}
        <div className="space-y-6">
          {/* Real University Bulletin / Announcement Card */}
          {latestAnnouncement ? (
            <div className="rounded-2xl p-5 bg-gradient-to-br from-neutral-900 to-neutral-950 text-white border border-neutral-800 shadow-md space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Bell className="w-3.5 h-3.5" />
                  <span className="uppercase tracking-wider">Campus Notice</span>
                </span>
                <span className="text-[10px] text-neutral-400 font-medium">
                  {latestAnnouncement.publishedAt}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white leading-snug">
                {latestAnnouncement.title}
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">
                {latestAnnouncement.content}
              </p>
              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="text-[11px] text-indigo-300 font-medium capitalize">
                  Audience: {latestAnnouncement.targetAudience}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('notifications')}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : null}

          {/* Real Dynamic Progression Milestone */}
          <div className="rounded-2xl p-5 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Progression Milestone
                </h3>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {percentageCompleted}%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 space-y-2 border border-neutral-200/60 dark:border-neutral-700/60 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Current Level Standing:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Level {student.currentLevel} Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Credits Registered:</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {registeredCreditsCount} Credits Enrolled
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Target to Next Level:</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {creditsNeededForNext > 0 ? `${creditsNeededForNext} Credits Needed` : 'Target Met ✓'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('academic-journey')}
              className="w-full py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Full Journey Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Real Attendance Rate Widget */}
          <div className="rounded-2xl p-5 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Lecture Attendance Rate
                </h3>
              </div>
              <span className={`text-xs font-bold ${
                attendanceRate === null
                  ? 'text-neutral-500 dark:text-neutral-400 font-medium'
                  : attendanceRate >= 75
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}>
                {attendanceRate === null ? 'No records yet' : `${attendanceRate}%`}
              </span>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {attendanceRate === null
                ? 'No roll call attendance records logged for current semester sessions yet.'
                : attendanceRate >= (settings.attendanceWarningThresholdPercent || 75) 
                  ? 'Satisfies institutional examination clearance threshold (≥ 75%).'
                  : 'Caution: Attendance is currently below the mandatory 75% exam clearance threshold.'}
            </p>

            <button
              type="button"
              onClick={() => onNavigate('attendance')}
              className="w-full py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Roll Call Records</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
