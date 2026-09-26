import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Calendar, 
  Clock, 
  UserCheck, 
  UserX, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Plus, 
  BookOpen,
  Users,
  Save
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AttendanceStatus } from '../../types';

export const AttendanceView: React.FC = () => {
  const { courses, students, attendanceSessions, recordAttendance, activeStudent, settings } = useSchool();
  const { currentRole, user } = useAuth();
  const { showToast } = useToast();

  const isLecturerOrAdmin = currentRole === 'lecturer' || currentRole === 'admin_registrar' || currentRole === 'super_admin';

  const [selectedCourseCode, setSelectedCourseCode] = useState(courses[0]?.code || 'IT301');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [topic, setTopic] = useState('');
  const [venue, setVenue] = useState('Lab 3, CS Block');
  
  // Roster attendance state for the roll-call session (all students default to present)
  const [roster, setRoster] = useState<{ [studentId: string]: AttendanceStatus }>({});

  const handleToggleStudent = (studentId: string, status: AttendanceStatus) => {
    setRoster(prev => ({ ...prev, [studentId]: status }));
  };

  const lecturerName = user?.firstName 
    ? `${user.role === 'lecturer' ? 'Dr.' : ''} ${user.firstName} ${user.lastName}`.trim() 
    : 'Dr. Kwesi Mensah';

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const course = courses.find(c => c.code === selectedCourseCode);
    const studentList = students.map(s => ({
      studentId: s.id,
      studentName: `${s.firstName} ${s.lastName}`,
      matricNo: s.studentId,
      status: roster[s.id] || 'present'
    }));

    const presentCount = studentList.filter(s => s.status === 'present' || s.status === 'late').length;

    recordAttendance({
      courseCode: selectedCourseCode,
      courseTitle: course?.title || 'Lecture Session',
      date: sessionDate,
      timeSlot: "10:00 - 12:00",
      lecturerName,
      venue,
      topic: topic || "Course Lecture & Lab Practical",
      totalStudents: studentList.length,
      presentCount,
      records: studentList as any,
      students: studentList
    });

    showToast(`Attendance recorded for ${selectedCourseCode} (${presentCount}/${studentList.length} present)`, 'success');
    setTopic('');
  };

  // Student specific calculations
  const studentSessions = attendanceSessions.flatMap(ses => {
    const record = ses.students?.find(s => s.studentId === activeStudent.id || s.matricNo === activeStudent.studentId);
    if (!record) return [];
    return [{
      courseCode: ses.courseCode,
      courseTitle: ses.courseTitle,
      date: ses.date,
      venue: ses.venue,
      topic: ses.topic,
      status: record.status
    }];
  });

  const studentTotalSessions = studentSessions.length;
  const studentAttendedCount = studentSessions.filter(s => s.status === 'present' || s.status === 'late').length;
  const studentAttendancePct = studentTotalSessions > 0 ? Math.round((studentAttendedCount / studentTotalSessions) * 100) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Classroom Attendance & Engagement System
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Track lecture attendance compliance, monitor absenteeism alerts, and ensure eligibility for end-of-semester examinations.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
          Mandatory Exam Threshold: <strong className="text-indigo-600 dark:text-indigo-400">{settings.attendanceThreshold || 75}%</strong>
        </div>
      </div>

      {/* STUDENT VIEW */}
      {!isLecturerOrAdmin && (
        <div className="space-y-6">
          {/* Attendance KPI Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Personal Attendance Rating</span>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black font-mono text-neutral-900 dark:text-neutral-100">
                  {studentAttendancePct !== null ? `${studentAttendancePct}%` : 'N/A'}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  studentAttendancePct === null
                    ? 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                    : studentAttendancePct >= (settings.attendanceThreshold || 75)
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {studentAttendancePct === null 
                    ? 'NO SESSIONS RECORDED' 
                    : studentAttendancePct >= (settings.attendanceThreshold || 75) 
                    ? 'EXAM ELIGIBLE' 
                    : 'BELOW 75% BENCHMARK'}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                {studentTotalSessions === 0 
                  ? 'No roll call attendance records logged for your registered courses this semester.'
                  : `You have attended ${studentAttendedCount} of ${studentTotalSessions} registered lecture hours this semester.`}
              </p>
            </div>

            {/* Attendance Progress Ring Indicator */}
            <div className="w-full md:w-64 space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span>Compliance</span>
                <span>{studentAttendancePct}% / 100%</span>
              </div>
              <div className="w-full h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    studentAttendancePct >= settings.attendanceThreshold ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${studentAttendancePct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Student Session History */}
          <div className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
            <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 font-bold text-sm">
              Lecture Attendance History
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Topic / Module</th>
                  <th className="py-3 px-4">Venue</th>
                  <th className="py-3 px-4 text-right">Your Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {studentSessions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-neutral-400">
                      No classroom lecture attendance sessions recorded yet for your registered courses this semester.
                    </td>
                  </tr>
                ) : (
                  studentSessions.map((s, i) => (
                    <tr key={i} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-mono text-neutral-600 dark:text-neutral-400">{s.date}</td>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{s.courseCode}</td>
                      <td className="py-3 px-4 text-neutral-800 dark:text-neutral-200">{s.topic}</td>
                      <td className="py-3 px-4 text-neutral-500">{s.venue}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          s.status === 'present'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : s.status === 'late'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LECTURER / ADMIN VIEW */}
      {isLecturerOrAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Roll Call Form */}
          <div className="lg:col-span-8 space-y-6">
            <form onSubmit={handleSaveAttendance} className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Take Lecture Roll Call
                </h3>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Course Unit</label>
                  <select
                    value={selectedCourseCode}
                    onChange={(e) => setSelectedCourseCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono font-bold"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.code}>{c.code} - {c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Session Date</label>
                  <input
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Lecture Venue / Lab</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Syllabus Topic / Lecture Module</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Consensus & Raft Protocol"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              {/* Student Roster Table */}
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden mt-4">
                <div className="bg-neutral-50 dark:bg-neutral-800/60 px-4 py-2 flex items-center justify-between font-bold text-neutral-600 dark:text-neutral-300">
                  <span>Enrolled Student Roster ({students.length})</span>
                  <span className="text-[10px] uppercase font-mono">Mark Attendance Status</span>
                </div>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {students.map(std => {
                    const status = roster[std.id] || 'present';
                    return (
                      <div key={std.id} className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-neutral-100">{std.firstName} {std.lastName}</p>
                          <p className="text-[11px] font-mono text-neutral-400">{std.studentId} • Level {std.currentLevel}</p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {(['present', 'late', 'absent', 'excused'] as AttendanceStatus[]).map(st => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleToggleStudent(std.id, st)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                                status === st
                                  ? st === 'present'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : st === 'late'
                                    ? 'bg-amber-600 text-white shadow-xs'
                                    : st === 'absent'
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save & Lock Attendance Session
                </button>
              </div>
            </form>
          </div>

          {/* Past Sessions Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Recorded Lecture Sessions ({attendanceSessions.length})
            </h3>
            <div className="space-y-3">
              {attendanceSessions.map(ses => (
                <div key={ses.id} className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{ses.courseCode}</span>
                    <span className="font-mono text-neutral-400">{ses.date}</span>
                  </div>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200">{ses.topic}</p>
                  <div className="flex justify-between items-center text-[11px] text-neutral-500 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                    <span>Venue: {ses.venue}</span>
                    <span className="font-bold text-emerald-600">
                      {ses.presentCount} / {ses.totalStudents} ({Math.round((ses.presentCount / ses.totalStudents) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
