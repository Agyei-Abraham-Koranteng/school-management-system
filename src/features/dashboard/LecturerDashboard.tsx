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
  const { courses, students, attendanceSessions, settings } = useSchool();
  const { user } = useAuth();

  const lecturerName = user?.firstName 
    ? `${user.role === 'lecturer' ? 'Dr.' : ''} ${user.firstName} ${user.lastName}`.trim() 
    : (user?.name || 'Faculty Member');
  const lecturerDept = user?.department || 'Department of Information Technology';

  // Real assigned courses for the logged-in lecturer
  const myCourses = courses.filter(c => 
    (user?.id && c.assignedLecturerId === user.id) ||
    (c.department && c.department.toLowerCase() === lecturerDept.toLowerCase())
  );
  const displayCourses = myCourses.length > 0 ? myCourses : courses.slice(0, 4);
  const totalStudentsTaught = students.length;
  const myAttendance = attendanceSessions.filter(s => 
    displayCourses.some(c => c.code === s.courseCode)
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
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Assigned Courses</p>
          <p className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-1">{displayCourses.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Students Taught</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">{totalStudentsTaught}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Recorded Sessions</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{myAttendance.length || attendanceSessions.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Active Curriculum Units</p>
          <p className="text-xs font-bold text-amber-600 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All Units Synced
          </p>
        </div>
      </div>

      {/* My Courses & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Assigned Instructional Modules
            </h3>
            <button 
              onClick={() => onNavigate('admin-academic-structure')}
              className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline"
            >
              Curriculum Catalog →
            </button>
          </div>

          <div className="space-y-3">
            {displayCourses.map(c => (
              <div key={c.id} className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">{c.code}</span>
                    <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">{c.title}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {c.creditHours} Credits • Level {c.level} • {c.semester} • {c.enrolledCount || students.length} Enrolled
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('attendance')}
                    className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 cursor-pointer"
                  >
                    Attendance
                  </button>
                  <button
                    onClick={() => onNavigate('admin-students')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold cursor-pointer"
                  >
                    Roster
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            Upcoming Lectures
          </h3>
          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3 text-xs">
            {displayCourses.slice(0, 3).map((c, i) => (
              <div key={c.id} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/50 dark:border-neutral-700/50">
                <span className={`text-[10px] font-mono font-bold ${i === 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600'}`}>
                  {i === 0 ? '10:00 AM - 12:00 PM' : i === 1 ? '02:00 PM - 04:00 PM' : '08:00 AM - 10:00 AM'}
                </span>
                <p className="font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">{c.code} - {c.title}</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Hall {String.fromCharCode(65 + i)}, {c.department}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
