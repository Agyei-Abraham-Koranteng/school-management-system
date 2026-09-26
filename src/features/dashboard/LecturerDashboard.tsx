import React from 'react';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Award, 
  ArrowRight,
  ClipboardCheck,
  Building,
  GraduationCap
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
    ? `${user.role === 'lecturer' ? 'Dr.' : ''} ${user.firstName} ${user.lastName}`.trim() 
    : (user?.name || 'Faculty Member');
  const lecturerDept = user?.department || 'Department of Information Technology';

  // Authoritative assigned course offerings for the authenticated lecturer
  const myAssignments = lecturerAssignments.filter(a => 
    (user?.id && a.lecturerId === user.id) || 
    (user?.email && a.lecturerEmail?.toLowerCase() === user.email.toLowerCase())
  );
  
  const myOfferings = courseOfferings.filter(o => 
    (user?.id && o.primaryLecturerId === user.id) || 
    myAssignments.some(a => a.courseOfferingId === o.id)
  );

  // If lecturer has specific assignments, strictly display only those; otherwise if admin show all
  const displayOfferings = myOfferings.length > 0 
    ? myOfferings 
    : (user?.role === 'super_admin' || user?.role === 'admin_registrar' ? courseOfferings : myOfferings);

  // Compute exact roster and unique students taught across all my offerings
  const studentsTaughtSet = new Set<string>();
  const offeringsWithRoster = displayOfferings.map(o => {
    const enrolledRegistrations = registrations.filter(r => 
      r.status === 'approved' &&
      r.items.some(i => i.courseOfferingId === o.id || i.code === o.courseCode)
    );
    enrolledRegistrations.forEach(r => studentsTaughtSet.add(r.studentId));
    return {
      ...o,
      activeEnrolledCount: enrolledRegistrations.length
    };
  });

  const totalStudentsTaught = studentsTaughtSet.size;
  const myAttendance = attendanceSessions.filter(s => 
    displayOfferings.some(o => o.courseCode === s.courseCode || o.id === s.courseOfferingId)
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent border border-amber-200/60 dark:border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400 font-mono">
            Faculty & Instructional Portal
          </span>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mt-1">
            Welcome back, {lecturerName}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {lecturerDept} • {settings.currentSemester} {settings.currentSession} Teaching Session
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('attendance')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <ClipboardCheck className="w-4 h-4" />
            Launch Roll Call
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Assigned Offerings</p>
          <p className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-1">{offeringsWithRoster.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Students Taught</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">{totalStudentsTaught}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Recorded Sessions</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{myAttendance.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Teaching Status</p>
          <p className="text-xs font-bold text-amber-600 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Allocated & Active
          </p>
        </div>
      </div>

      {/* My Courses & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Assigned Course Offerings ({offeringsWithRoster.length})
            </h3>
            <button 
              onClick={() => onNavigate('admin-academic-structure')}
              className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline"
            >
              Curriculum Catalog →
            </button>
          </div>

          <div className="space-y-3">
            {offeringsWithRoster.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                <BookOpen className="w-8 h-8 text-neutral-400 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">No active course allocations found</p>
                <p className="text-[11px] text-neutral-400 mt-1">You are not currently assigned to any course offerings for {settings.currentSemester} {settings.currentSession}.</p>
              </div>
            ) : (
              offeringsWithRoster.map(o => (
                <div key={o.id} className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">{o.courseCode}</span>
                      <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">{o.courseTitle}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                        {o.section}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      {o.creditHours} Credits • Level {o.level} • {o.semester} • <strong className="text-neutral-700 dark:text-neutral-300">{o.activeEnrolledCount}</strong> Enrolled / {o.capacity} Cap
                      {o.venue && ` • Venue: ${o.venue}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('attendance', { offeringId: o.id, courseCode: o.courseCode })}
                      className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer flex items-center gap-1.5"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      Roll Call
                    </button>
                    <button
                      onClick={() => onNavigate('results', { offeringId: o.id, courseCode: o.courseCode })}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5" />
                      Gradebook
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Schedule Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            Upcoming Lectures
          </h3>
          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3 text-xs">
            {offeringsWithRoster.slice(0, 3).map((o, i) => (
              <div key={o.id} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/50 dark:border-neutral-700/50">
                <span className={`text-[10px] font-mono font-bold ${i === 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600'}`}>
                  {o.schedule || (i === 0 ? '10:00 AM - 12:00 PM' : i === 1 ? '02:00 PM - 04:00 PM' : '08:00 AM - 10:00 AM')}
                </span>
                <p className="font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">{o.courseCode} - {o.courseTitle}</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Venue: {o.venue || 'Lecture Theatre 2'} • {o.section}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
