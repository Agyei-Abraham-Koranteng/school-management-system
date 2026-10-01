import React from 'react';
import {
  BookOpen,
  Users,
  ClipboardCheck,
  Calendar,
  CheckCircle2,
  Award,
  ArrowRight,
  Building,
  GraduationCap,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';

interface LecturerDashboardProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export const LecturerDashboard: React.FC<LecturerDashboardProps> = ({ onNavigate }) => {
  const {
    courseOfferings,
    lecturerAssignments,
    registrations,
    attendanceSessions,
    courseAssessments,
    settings
  } = useSchool();
  const { user } = useAuth();

  const lecturerName = user?.firstName
    ? `${user.firstName} ${user.lastName}`.trim()
    : (user?.name || 'Faculty Member');
  const lecturerDept = user?.department || 'Department of Information Technology';

  // Authoritative assigned course offerings
  const myAssignments = lecturerAssignments.filter(a =>
    (user?.id && a.lecturerId === user.id) ||
    (user?.email && a.lecturerEmail?.toLowerCase() === user.email.toLowerCase())
  );

  const myOfferings = courseOfferings.filter(o =>
    (user?.id && o.primaryLecturerId === user.id) ||
    myAssignments.some(a => a.courseOfferingId === o.id)
  );

  const displayOfferings = myOfferings.length > 0
    ? myOfferings
    : (user?.role === 'super_admin' || user?.role === 'admin_registrar' ? courseOfferings : myOfferings);

  // Compute rosters
  const studentsTaughtSet = new Set<string>();
  const offeringsWithRoster = displayOfferings.map(o => {
    const enrolledRegistrations = registrations.filter(r =>
      r.status === 'approved' &&
      r.items.some(i => i.courseOfferingId === o.id || i.code === o.courseCode)
    );
    enrolledRegistrations.forEach(r => studentsTaughtSet.add(r.studentId));
    return { ...o, activeEnrolledCount: enrolledRegistrations.length };
  });

  const totalStudentsTaught = studentsTaughtSet.size;
  const myAttendance = attendanceSessions.filter(s =>
    displayOfferings.some(o => o.courseCode === s.courseCode || o.id === s.courseOfferingId)
  );

  // Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 max-w-[88rem] mx-auto">

      {/* ── HEADER BANNER ──────────────────────────────────── */}
      <div className="ef-hero-banner">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="ef-label" style={{ color: 'rgba(199,210,254,0.6)' }}>
              Faculty & Instructional Portal
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight" style={{ letterSpacing: '-0.02em' }}>
              {greeting}, {lecturerName.split(' ')[0]}
            </h1>
            <p className="text-sm" style={{ color: 'rgba(199,210,254,0.75)' }}>
              {lecturerDept} · {settings.currentSemester} {settings.currentSession}
            </p>
          </div>
          <button
            onClick={() => onNavigate('attendance')}
            className="ef-btn ef-btn-sm self-start sm:self-auto font-bold"
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <ClipboardCheck className="w-4 h-4" />
            Launch Roll Call
          </button>
        </div>
      </div>

      {/* ── KPI CARDS ──────────────────────────────────────── */}
      <div className="ef-grid-kpi">
        {[
          {
            label: 'Course Offerings',
            value: offeringsWithRoster.length,
            icon: <BookOpen className="w-4 h-4" />,
            iconCls: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
            sub: 'Assigned this semester'
          },
          {
            label: 'Students Taught',
            value: totalStudentsTaught,
            icon: <Users className="w-4 h-4" />,
            iconCls: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
            sub: 'Unique enrolled students'
          },
          {
            label: 'Sessions Recorded',
            value: myAttendance.length,
            icon: <ClipboardCheck className="w-4 h-4" />,
            iconCls: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
            sub: 'Attendance sessions logged'
          },
          {
            label: 'Teaching Status',
            value: null,
            icon: <CheckCircle2 className="w-4 h-4" />,
            iconCls: 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400',
            sub: null,
            custom: (
              <div>
                <div className="text-lg font-bold" style={{ color: 'var(--success)' }}>Active</div>
                <div className="ef-badge ef-badge-success mt-1">Allocated & Teaching</div>
              </div>
            )
          }
        ].map((card, i) => (
          <div key={i} className="ef-metric-card">
            <div className="flex items-center justify-between mb-3">
              <span className="ef-label">{card.label}</span>
              <div className={`ef-metric-icon ${card.iconCls}`}>{card.icon}</div>
            </div>
            {card.custom ? card.custom : (
              <>
                <div className="ef-stat text-2xl mb-1">{card.value}</div>
                <p className="ef-caption">{card.sub}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Course Offerings List — 2 col */}
        <div className="lg:col-span-2 space-y-4">
          <div className="ef-section-header">
            <div>
              <h2 className="ef-h2">Assigned Course Offerings</h2>
              <p className="ef-caption mt-0.5">{offeringsWithRoster.length} offering{offeringsWithRoster.length !== 1 ? 's' : ''} this {settings.currentSemester}</p>
            </div>
            <button
              onClick={() => onNavigate('admin-academic-structure')}
              className="ef-btn ef-btn-ghost ef-btn-xs"
            >
              Curriculum <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {offeringsWithRoster.length === 0 ? (
              <div className="ef-card">
                <div className="ef-empty">
                  <div className="ef-empty-icon" style={{ color: 'var(--brand)' }}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="ef-h3 mb-1">No Course Allocations</h4>
                    <p className="ef-caption max-w-xs mx-auto">
                      You are not currently assigned to any course offerings for {settings.currentSemester} {settings.currentSession}.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              offeringsWithRoster.map(o => (
                <div key={o.id} className="ef-card p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="ef-course-code-badge shrink-0">
                        <span>{o.courseCode.slice(0, 2)}</span>
                        <span>{o.courseCode.slice(2)}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm ef-truncate" style={{ color: 'var(--text-primary)' }}>{o.courseTitle}</span>
                          {o.section && (
                            <span className="ef-badge ef-badge-neutral">{o.section}</span>
                          )}
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                          {o.creditHours} Credits · Level {o.level} ·{' '}
                          <strong style={{ color: 'var(--text-primary)' }}>{o.activeEnrolledCount}</strong> enrolled / {o.capacity} cap
                          {o.venue && ` · ${o.venue}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onNavigate('attendance', { offeringId: o.id, courseCode: o.courseCode })}
                        className="ef-btn ef-btn-ghost ef-btn-xs"
                      >
                        <ClipboardCheck className="w-3.5 h-3.5" /> Roll Call
                      </button>
                      <button
                        onClick={() => onNavigate('results', { offeringId: o.id, courseCode: o.courseCode })}
                        className="ef-btn ef-btn-primary ef-btn-xs"
                      >
                        <Award className="w-3.5 h-3.5" /> Gradebook
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Schedule Sidebar — 1 col */}
        <div className="space-y-4">
          <h3 className="ef-h3 flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color: 'var(--warning)' }} />
            Upcoming Lectures
          </h3>

          <div className="space-y-2.5">
            {offeringsWithRoster.length === 0 ? (
              <div className="ef-card">
                <div className="ef-empty py-6">
                  <div className="ef-empty-icon">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <p className="ef-caption">No scheduled lectures</p>
                </div>
              </div>
            ) : (
              offeringsWithRoster.slice(0, 4).map((o, i) => {
                const timeSlots = ['09:00', '11:00', '14:00', '16:00'];
                const colorClasses = [
                  'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300',
                  'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
                  'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
                  'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300'
                ];
                return (
                  <div key={o.id} className="ef-card p-3 flex items-start gap-3">
                    <div className={`text-center px-2 py-1.5 rounded-md text-xs font-mono font-bold shrink-0 ${colorClasses[i % 4]}`}>
                      {o.schedule?.split(' ')[0] || timeSlots[i]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold ef-truncate" style={{ color: 'var(--text-primary)' }}>
                        {o.courseCode} — {o.courseTitle}
                      </p>
                      <p className="text-[10px] mt-0.5 ef-truncate" style={{ color: 'var(--text-muted)' }}>
                        {o.venue || 'Lecture Theatre'} · {o.activeEnrolledCount} students
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick actions */}
          <div className="ef-card p-4 space-y-2">
            <h4 className="ef-label mb-3">Quick Actions</h4>
            {[
              { label: 'Gradebook Entry', icon: <Award className="w-3.5 h-3.5" />, tab: 'results' },
              { label: 'Student Directory', icon: <Users className="w-3.5 h-3.5" />, tab: 'admin-students' },
              { label: 'Course Curriculum', icon: <BookOpen className="w-3.5 h-3.5" />, tab: 'admin-academic-structure' },
              { label: 'Attendance Reports', icon: <BarChart3 className="w-3.5 h-3.5" />, tab: 'attendance' }
            ].map(action => (
              <button
                key={action.tab}
                onClick={() => onNavigate(action.tab)}
                className="w-full ef-btn ef-btn-ghost ef-btn-xs justify-start"
              >
                {action.icon}
                {action.label}
                <ChevronRight className="w-3 h-3 ml-auto" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
