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
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  ClipboardCheck,
  Bell,
  TrendingUp,
  AlertTriangle
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

const LEVEL_CREDITS: Record<string, number> = {
  '100': 36,
  '200': 72,
  '300': 108,
  '400': 132
};

const LEVELS = ['100', '200', '300', '400'] as const;

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

  // Resolve live student record
  const student = React.useMemo(() => {
    return students.find(s =>
      s.studentId === propStudent.studentId ||
      s.id === propStudent.id ||
      (propStudent.applicantEmail && s.applicantEmail === propStudent.applicantEmail)
    ) || (activeStudent?.studentId === propStudent.studentId ? activeStudent : propStudent);
  }, [students, activeStudent, propStudent]);

  // Real-time CGPA & credits
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

  const requiredCredits = student.requiredCredits || 132;
  const percentageCompleted = Math.min(100, Math.round(((liveCreditsEarned || 0) / requiredCredits) * 100));

  // Greeting
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  // Degree class
  const degreeClass = React.useMemo(() => {
    if (liveCgpa >= 3.60) return { label: 'First Class Honours',    color: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' };
    if (liveCgpa >= 3.00) return { label: 'Second Class Upper',     color: 'text-indigo-600 dark:text-indigo-400',   dot: 'bg-indigo-500' };
    if (liveCgpa >= 2.50) return { label: 'Second Class Lower',     color: 'text-sky-600 dark:text-sky-400',         dot: 'bg-sky-500' };
    if (liveCgpa >= 2.00) return { label: 'Third Class',            color: 'text-amber-600 dark:text-amber-400',     dot: 'bg-amber-500' };
    if (liveCgpa >= 1.50) return { label: 'Pass',                   color: 'text-orange-600 dark:text-orange-400',   dot: 'bg-orange-500' };
    return                       { label: 'Academic Remediation',   color: 'text-red-600 dark:text-red-400',          dot: 'bg-red-500' };
  }, [liveCgpa]);

  // Active registration
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
  }, [registrations, student, settings]);

  const registeredCoursesCount = activeReg?.items?.length || 0;
  const registeredCreditsCount = activeReg?.totalCredits || 0;
  const regStatus = activeReg?.status || 'unregistered';

  // Active warnings
  const activeStudentWarnings = academicWarnings.filter(w =>
    (w.studentId === student.studentId || w.studentId === student.id) && w.status === 'active'
  );

  // Financial ledger
  const defaultTuition = student.currentLevel === '100' ? 4500 : student.currentLevel === '200' ? 4800 : student.currentLevel === '300' ? 5200 : 5500;
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
    return { studentId: student.studentId, totalBilled: defaultTuition, totalPaid: 0, balance: defaultTuition, isCleared: false, transactions: [] };
  }, [financialLedgers, student, defaultTuition]);

  const isFeeCleared = ledger.isCleared || ledger.balance <= 0;

  // Latest announcement
  const latestAnnouncement = announcements.find(a =>
    a.targetAudience === 'students' || a.targetAudience === 'all'
  ) || announcements[0];

  // Attendance
  const studentSessions = attendanceSessions.filter(ses =>
    ses.students && ses.students.some(s => s.studentId === student.id || s.matricNo === student.studentId)
  );
  const presentCount = studentSessions.filter(ses =>
    ses.students.some(s => (s.studentId === student.id || s.matricNo === student.studentId) && s.status === 'present')
  ).length;
  const attendanceRate = studentSessions.length > 0
    ? Math.round((presentCount / studentSessions.length) * 100)
    : null;

  // Credits needed for next level
  const nextThreshold = LEVEL_CREDITS[student.currentLevel] || requiredCredits;
  const creditsToNext = Math.max(0, nextThreshold - (liveCreditsEarned || 0));

  // KPI cards definition
  const kpiCards = [
    {
      id: 'cgpa',
      label: 'Cumulative GPA',
      value: <><AnimatedCounter value={liveCgpa} decimals={2} /> <span className="text-xl font-semibold" style={{ color: 'var(--text-muted)' }}>/ 4.00</span></>,
      sub: (
        <span className={`flex items-center gap-1 ${degreeClass.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${degreeClass.dot}`} />
          {degreeClass.label}
        </span>
      ),
      icon: <Award className="w-4 h-4" />,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
      tab: 'results',
      accent: 'hover:border-emerald-300 dark:hover:border-emerald-800'
    },
    {
      id: 'credits',
      label: 'Credits Earned',
      value: <><AnimatedCounter value={liveCreditsEarned} /><span className="text-xl font-semibold" style={{ color: 'var(--text-muted)' }}> / {requiredCredits}</span></>,
      sub: (
        <div className="w-full ef-progress mt-1">
          <div className="ef-progress-bar" style={{ width: `${percentageCompleted}%` }} />
        </div>
      ),
      icon: <BookCheck className="w-4 h-4" />,
      iconBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
      tab: 'academic-journey',
      accent: 'hover:border-indigo-300 dark:hover:border-indigo-800'
    },
    {
      id: 'registration',
      label: 'Registered Courses',
      value: <><AnimatedCounter value={registeredCoursesCount} /><span className="text-xl font-semibold" style={{ color: 'var(--text-muted)' }}> courses</span></>,
      sub: regStatus === 'approved'
        ? <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="w-3 h-3" /> Approved · {registeredCreditsCount} Credits</span>
        : regStatus === 'submitted'
        ? <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400"><Clock className="w-3 h-3" /> Under Review</span>
        : regStatus === 'rejected'
        ? <span className="flex items-center gap-1 text-red-600 dark:text-red-400"><AlertCircle className="w-3 h-3" /> Needs Revision</span>
        : <span className="font-semibold" style={{ color: 'var(--brand)' }}>Registration open →</span>,
      icon: <GraduationCap className="w-4 h-4" />,
      iconBg: 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400',
      tab: 'registration',
      accent: 'hover:border-violet-300 dark:hover:border-violet-800'
    },
    {
      id: 'finance',
      label: 'Tuition & Fees',
      value: <span className="ef-currency">GHS <AnimatedCounter value={ledger.totalPaid || 0} /></span>,
      sub: isFeeCleared
        ? <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="w-3 h-3" /> Fees cleared</span>
        : <span className="font-semibold text-amber-600 dark:text-amber-400">Arrears: GHS {ledger.balance.toLocaleString()}</span>,
      icon: <CreditCard className="w-4 h-4" />,
      iconBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
      tab: 'finance',
      accent: 'hover:border-amber-300 dark:hover:border-amber-800'
    }
  ];

  return (
    <div id="student-dashboard" className="space-y-6 max-w-[88rem] mx-auto">

      {/* Academic Warning Banner */}
      {activeStudentWarnings.length > 0 && (
        <div className="ef-alert ef-alert-warning ef-animate-fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
          <div className="text-xs leading-relaxed">
            <strong className="block mb-0.5">Academic Notice — {activeStudentWarnings[0].severity.toUpperCase()}</strong>
            {activeStudentWarnings[0].reason} {activeStudentWarnings[0].remediationPlan || ''}
          </div>
        </div>
      )}

      {/* ── HERO BANNER ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="ef-hero-banner"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Academic standing pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border"
              style={{ background: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)' }}>
              <span className={`w-2 h-2 rounded-full ${student.academicStanding === 'Good Standing' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {student.academicStanding || 'Good Standing'}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight" style={{ letterSpacing: '-0.025em' }}>
                {greeting}, {student.firstName}
              </h1>
              <p className="mt-1 text-sm font-medium" style={{ color: 'rgba(199,210,254,0.9)' }}>
                {student.programName} · Level {student.currentLevel}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: 'rgba(199,210,254,0.7)' }}>
              <span>
                <span style={{ color: 'rgba(199,210,254,0.5)' }}>ID </span>
                <span className="font-mono font-semibold text-white">{student.studentId}</span>
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
              <span>{student.faculty || 'Faculty of Computing & Information Systems'}</span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
              <span>{settings.currentSession} · {settings.currentSemester}</span>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              id="dash-quick-register"
              type="button"
              onClick={() => onNavigate('registration')}
              className="ef-btn ef-btn-sm px-5 py-2.5 font-bold"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <BookOpen className="w-4 h-4" />
              <span>Register Courses</span>
            </button>
            <button
              id="dash-quick-transcripts"
              type="button"
              onClick={() => onNavigate('transcripts')}
              className="ef-btn ef-btn-sm px-5 py-2.5 font-semibold"
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(255,255,255,0.12)'
              }}
            >
              <FileText className="w-4 h-4" />
              <span>Transcripts</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── ACADEMIC LEVEL TIMELINE ─────────────────────────── */}
      <div className="ef-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="ef-h3">Academic Journey</h2>
            <p className="ef-caption mt-0.5">{percentageCompleted}% of programme completed · {liveCreditsEarned}/{requiredCredits} credits</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('academic-journey')}
            className="ef-btn ef-btn-ghost ef-btn-xs"
          >
            Full view <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="ef-level-track">
          {LEVELS.map((lvl, idx) => {
            const threshold = LEVEL_CREDITS[lvl] || 0;
            const isDone = (liveCreditsEarned || 0) >= threshold && student.currentLevel !== lvl;
            const isCurrent = student.currentLevel === lvl;
            return (
              <div key={lvl} className={`ef-level-node ${isDone ? 'is-done' : ''} ${isCurrent ? 'is-current' : ''}`}>
                <div className="ef-level-dot">
                  {isDone ? <CheckCircle2 className="w-3 h-3" /> : idx + 1}
                </div>
                <span className="text-[10px] font-bold" style={{ color: isCurrent ? 'var(--brand)' : isDone ? 'var(--success)' : 'var(--text-muted)' }}>
                  L{lvl}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 ef-progress ef-progress-lg">
          <div className="ef-progress-bar" style={{ width: `${percentageCompleted}%`, background: 'linear-gradient(90deg, var(--brand) 0%, #7c3aed 100%)' }} />
        </div>
      </div>

      {/* ── KPI METRIC CARDS ────────────────────────────────── */}
      <div className="ef-grid-kpi">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
            onClick={() => onNavigate(card.tab)}
            className={`ef-metric-card border ${card.accent} transition-all`}
            style={{ borderColor: 'var(--border-default)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="ef-label">{card.label}</span>
              <div className={`ef-metric-icon ${card.iconBg}`}>{card.icon}</div>
            </div>
            <div className="ef-stat text-2xl mb-2">{card.value}</div>
            <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{card.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* ── BODY: COURSES + WIDGETS ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Registered Courses — 2 col */}
        <div className="lg:col-span-2 space-y-4">
          <div className="ef-section-header">
            <div>
              <h2 className="ef-h2">Active Courses</h2>
              <p className="ef-caption mt-0.5">{settings.currentSemester} · Level {student.currentLevel}</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('registration')}
              className="ef-btn ef-btn-ghost ef-btn-xs"
            >
              Manage <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {activeReg?.items?.length ? (
              activeReg.items.map((item) => {
                const courseMeta = courses.find(c => c.code.toLowerCase() === item.code.toLowerCase() || c.id === item.courseId);
                const lecturer = staff.find(s => s.id === courseMeta?.assignedLecturerId);
                return (
                  <div key={item.id} className="ef-course-card">
                    {/* Course code badge */}
                    <div className="ef-course-code-badge shrink-0">
                      <span>{item.code.slice(0, 2)}</span>
                      <span>{item.code.slice(2)}</span>
                    </div>
                    {/* Course info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="ef-h3 ef-truncate">{item.title}</h3>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                              {item.creditHours} Credits
                            </span>
                            <span style={{ color: 'var(--border-strong)' }}>·</span>
                            <span className="text-xs capitalize px-2 py-0.5 rounded-md" style={{ background: 'var(--bg-surface-raised)', color: 'var(--text-muted)' }}>
                              {item.type}
                            </span>
                            {lecturer && (
                              <>
                                <span style={{ color: 'var(--border-strong)' }}>·</span>
                                <span className="text-xs truncate" style={{ color: 'var(--brand)' }}>
                                  {lecturer.title} {lecturer.firstName} {lecturer.lastName}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <span className={`ef-badge shrink-0 ${activeReg.status === 'approved' ? 'ef-badge-success' : 'ef-badge-warning'}`}>
                          {activeReg.status === 'approved' ? 'Enrolled' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="ef-card">
                <div className="ef-empty">
                  <div className="ef-empty-icon" style={{ color: 'var(--brand)' }}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="ef-h3 mb-1">No Courses Registered</h4>
                    <p className="ef-caption max-w-xs mx-auto">
                      Your course registration for {settings.currentSemester} ({settings.currentSession}) is not yet submitted.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('registration')}
                    className="ef-btn ef-btn-primary ef-btn-sm"
                  >
                    Register Courses <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Widgets — 1 col */}
        <div className="space-y-4">

          {/* Latest Announcement */}
          {latestAnnouncement && (
            <div className="rounded-xl p-4 border space-y-2.5"
              style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                borderColor: 'rgba(99,102,241,0.25)'
              }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Campus Notice
                  </span>
                </div>
                <span className="text-[10px]" style={{ color: 'rgba(199,210,254,0.5)' }}>
                  {latestAnnouncement.publishedAt}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white leading-snug ef-line-clamp-2">
                {latestAnnouncement.title}
              </h3>
              <p className="text-xs ef-line-clamp-2" style={{ color: 'rgba(199,210,254,0.7)' }}>
                {latestAnnouncement.content}
              </p>
              <button
                type="button"
                onClick={() => onNavigate('notifications')}
                className="text-xs font-semibold flex items-center gap-1"
                style={{ color: 'rgba(165,180,252,0.9)' }}
              >
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Progression Milestone */}
          <div className="ef-card p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" style={{ color: 'var(--brand)' }} />
              <h3 className="ef-h3">Progression</h3>
              <span className="ml-auto text-xs font-bold" style={{ color: 'var(--brand)' }}>{percentageCompleted}%</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Current level</span>
                <span className="font-semibold" style={{ color: 'var(--success)' }}>Level {student.currentLevel} Active</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Enrolled credits</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{registeredCreditsCount} credits</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-muted)' }}>To next level</span>
                <span className="font-semibold" style={{ color: creditsToNext > 0 ? 'var(--brand)' : 'var(--success)' }}>
                  {creditsToNext > 0 ? `${creditsToNext} credits needed` : 'Target met ✓'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('academic-journey')}
              className="ef-btn ef-btn-ghost ef-btn-xs w-full justify-center mt-1"
            >
              View Journey <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Attendance Widget */}
          <div className="ef-card p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-emerald-500" />
              <h3 className="ef-h3">Attendance</h3>
              <span
                className={`ml-auto text-xs font-bold ${
                  attendanceRate === null ? '' : attendanceRate >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                }`}
                style={attendanceRate === null ? { color: 'var(--text-muted)' } : {}}
              >
                {attendanceRate === null ? '—' : `${attendanceRate}%`}
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {attendanceRate === null
                ? 'No attendance records for this semester yet.'
                : attendanceRate >= (settings.attendanceWarningThresholdPercent || 75)
                ? 'Satisfies the ≥ 75% examination clearance threshold.'
                : 'Below the mandatory 75% exam clearance threshold.'}
            </p>
            {attendanceRate !== null && (
              <div className="ef-progress">
                <div
                  className="ef-progress-bar"
                  style={{
                    width: `${attendanceRate}%`,
                    background: attendanceRate >= 75 ? 'var(--success)' : 'var(--warning)'
                  }}
                />
              </div>
            )}
            <button
              type="button"
              onClick={() => onNavigate('attendance')}
              className="ef-btn ef-btn-ghost ef-btn-xs w-full justify-center"
            >
              View records <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
