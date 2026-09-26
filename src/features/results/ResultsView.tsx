import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  TrendingUp, 
  FileText, 
  Printer, 
  Calendar, 
  BookOpen, 
  CheckCircle,
  HelpCircle,
  Save,
  CheckCircle2,
  Users,
  Search,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { AnimatedCounter } from '../../components/shared/AnimatedCounter';

import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { academicEngine } from '../../services/academics/academicEngine';

export const ResultsView: React.FC = () => {
  const { 
    activeStudent, 
    settings, 
    courseAttempts, 
    registrations, 
    courses, 
    carryovers, 
    students, 
    recordCourseGrade 
  } = useSchool();
  const { currentRole, user } = useAuth();
  const { showToast } = useToast();

  const isFacultyOrAdmin = currentRole === 'lecturer' || currentRole === 'admin_registrar' || currentRole === 'super_admin';
  const [activeMode, setActiveMode] = useState<'gradebook' | 'student'>(currentRole === 'lecturer' ? 'gradebook' : 'student');

  // Filter courses for faculty
  const lecturerCourses = useMemo(() => {
    if (currentRole === 'lecturer') {
      const myCourses = courses.filter(c => 
        (user?.id && c.assignedLecturerId === user.id) ||
        (user?.department && c.department?.toLowerCase() === user.department.toLowerCase())
      );
      return myCourses.length > 0 ? myCourses : courses;
    }
    return courses;
  }, [courses, currentRole, user]);

  const [selectedCourseCode, setSelectedCourseCode] = useState<string>(() => {
    return lecturerCourses[0]?.code || 'IT301';
  });

  const selectedCourse = useMemo(() => {
    return courses.find(c => c.code === selectedCourseCode) || lecturerCourses[0] || courses[0];
  }, [courses, selectedCourseCode, lecturerCourses]);

  // Enrolled students for selected course
  const enrolledStudents = useMemo(() => {
    if (!selectedCourse) return [];
    const regStudentIds = new Set<string>();
    registrations.forEach(r => {
      if (r.items?.some(it => it.code === selectedCourse.code)) {
        regStudentIds.add(r.studentId);
      }
    });

    const matched = students.filter(s => 
      regStudentIds.has(s.studentId) || regStudentIds.has(s.id) ||
      (s.currentLevel === selectedCourse.level)
    );

    return matched.length > 0 ? matched : students.slice(0, 8);
  }, [students, registrations, selectedCourse]);

  // Scores input state for gradebook
  const [scoresInput, setScoresInput] = useState<{ [studentId: string]: number }>({});
  const [searchStudent, setSearchStudent] = useState<string>('');

  const filteredEnrolled = useMemo(() => {
    return enrolledStudents.filter(s => 
      s.firstName.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchStudent.toLowerCase())
    );
  }, [enrolledStudents, searchStudent]);

  const handleScoreChange = (studentId: string, val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    setScoresInput(prev => ({ ...prev, [studentId]: clamped }));
  };

  const handleCommitSingleGrade = (studentId: string) => {
    const st = students.find(s => s.id === studentId || s.studentId === studentId);
    if (!st || !selectedCourse) return;

    const latestAttempt = courseAttempts.find(a => 
      (a.studentId === st.id || a.studentId === st.studentId) && 
      a.courseCode === selectedCourse.code
    );
    const score = scoresInput[st.id] !== undefined ? scoresInput[st.id] : (latestAttempt?.score ?? 75);

    recordCourseGrade({
      studentId: st.id,
      courseCode: selectedCourse.code,
      courseTitle: selectedCourse.title,
      credits: selectedCourse.creditHours,
      score: score,
      academicSession: settings.currentSession,
      semester: selectedCourse.semester as any
    });

    const gradeDetails = academicEngine.getGradeDetails(score, settings.gradingScale);
    showToast(`Published grade ${score}% (${gradeDetails.grade}) for ${st.firstName} ${st.lastName}`, 'success');
  };

  const handleCommitBatchGrades = () => {
    if (!selectedCourse) return;
    let count = 0;
    filteredEnrolled.forEach(st => {
      const latestAttempt = courseAttempts.find(a => 
        (a.studentId === st.id || a.studentId === st.studentId) && 
        a.courseCode === selectedCourse.code
      );
      const score = scoresInput[st.id] !== undefined ? scoresInput[st.id] : (latestAttempt?.score ?? 75);

      recordCourseGrade({
        studentId: st.id,
        courseCode: selectedCourse.code,
        courseTitle: selectedCourse.title,
        credits: selectedCourse.creditHours,
        score: score,
        academicSession: settings.currentSession,
        semester: selectedCourse.semester as any
      });
      count++;
    });

    showToast(`Successfully published grades for ${count} students in ${selectedCourse.code}`, 'success');
  };

  // Dynamic Results History derived from active student's actual enrollment
  const studentResultsHistory = React.useMemo(() => {
    return academicEngine.generateStudentSemesterHistory(
      activeStudent,
      courses,
      registrations,
      settings,
      courseAttempts
    );
  }, [activeStudent, courses, registrations, settings, courseAttempts]);

  const [selectedSemesterIndex, setSelectedSemesterIndex] = useState<number>(0);

  React.useEffect(() => {
    setSelectedSemesterIndex(Math.max(0, studentResultsHistory.length - 1));
  }, [studentResultsHistory.length]);

  const selectedSemester = studentResultsHistory[selectedSemesterIndex] || studentResultsHistory[0];

  // Audit graduation & classification from authoritative academic engine
  const audit = academicEngine.auditGraduationEligibility(
    activeStudent,
    courseAttempts,
    null,
    settings,
    0
  );

  // Prepare chart data from completed semesters
  const chartData = studentResultsHistory.map((s, idx) => ({
    semester: `L${s.level} S${s.semesterName.includes('First') ? '1' : '2'}`,
    gpa: s.gpa,
    cgpa: s.cgpa
  }));

  const handlePrintTranscript = () => {
    window.print();
  };

  // FACULTY GRADEBOOK VIEW
  if (isFacultyOrAdmin && activeMode === 'gradebook') {
    return (
      <div id="gradebook-view" className="max-w-7xl mx-auto space-y-8 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                Instructional Directorate
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                Continuous Assessment & Gradebook Entry
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 mt-2">
              Faculty Gradebook Entry & Mark Sheet
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Enter continuous assessment and exam scores. Submitted grades recalculate student CGPA, credits, and standing in real time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {currentRole !== 'lecturer' && (
              <button
                type="button"
                onClick={() => setActiveMode('student')}
                className="px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300"
              >
                Student Results Preview
              </button>
            )}
            <button
              type="button"
              onClick={handleCommitBatchGrades}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              Publish All Grades
            </button>
          </div>
        </div>

        {/* Course Selector & Info Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Select Teaching Course Unit
              </label>
              <select
                value={selectedCourseCode}
                onChange={(e) => setSelectedCourseCode(e.target.value)}
                className="text-xs font-bold py-2 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {lecturerCourses.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.code}: {c.title} ({c.creditHours} Credits · Level {c.level})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700">
                <span className="text-neutral-500">Academic Period: </span>
                <strong className="text-neutral-900 dark:text-neutral-100">{settings.currentSession} • {settings.currentSemester}</strong>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold">
                {filteredEnrolled.length} Students on Roll
              </div>
            </div>
          </div>
        </div>

        {/* Grade Entry Table */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                Assessment Roster: {selectedCourse?.code} - {selectedCourse?.title}
              </h3>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search student or matric..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 uppercase text-[10px] font-bold tracking-wider border-b border-neutral-200/80 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Matric No.</th>
                  <th className="py-3 px-4">Current Attempt</th>
                  <th className="py-3 px-4 text-center">Score (0-100)</th>
                  <th className="py-3 px-4 text-center">Projected Grade</th>
                  <th className="py-3 px-4 text-center">Grade Point</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredEnrolled.map((st) => {
                  const latestAttempt = courseAttempts.find(a => 
                    (a.studentId === st.id || a.studentId === st.studentId) && 
                    a.courseCode === selectedCourse?.code
                  );
                  const currentScore = scoresInput[st.id] !== undefined ? scoresInput[st.id] : (latestAttempt?.score ?? 75);
                  const gradeDetails = academicEngine.getGradeDetails(currentScore, settings.gradingScale);

                  return (
                    <tr key={st.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-neutral-900 dark:text-neutral-100">
                          {st.firstName} {st.lastName}
                        </div>
                        <div className="text-[10px] text-neutral-500">{st.programName}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-neutral-600 dark:text-neutral-400">
                        {st.studentId}
                      </td>
                      <td className="py-3 px-4">
                        {latestAttempt ? (
                          <span className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                            latestAttempt.status === 'passed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}>
                            {latestAttempt.score}% ({latestAttempt.grade})
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-400 font-mono">Not Graded</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={currentScore}
                          onChange={(e) => handleScoreChange(st.id, parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 text-center font-mono font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </td>
                      <td className="py-3 px-4 text-center font-bold">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                          gradeDetails.isPassing 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {gradeDetails.grade} ({gradeDetails.description})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {gradeDetails.gradePoint.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleCommitSingleGrade(st.id)}
                          className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 dark:text-indigo-300 font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                        >
                          <Save className="w-3 h-3" />
                          Commit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // STUDENT RESULTS & CGPA TRANSCRIPT VIEW
  return (
    <div id="results-view" className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            Official Academic Record
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 mt-2">
            Examination Results & CGPA Transcript
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Student: <strong className="text-neutral-900 dark:text-neutral-100">{activeStudent.firstName} {activeStudent.lastName}</strong> ({activeStudent.studentId}) · Program: <strong>{activeStudent.programName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isFacultyOrAdmin && (
            <button
              type="button"
              onClick={() => setActiveMode('gradebook')}
              className="px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200"
            >
              Faculty Gradebook Entry
            </button>
          )}
          <button
            type="button"
            onClick={handlePrintTranscript}
            className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Print Official Transcript</span>
          </button>
        </div>
      </div>

      {/* 1. Academic Performance Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
        {/* CGPA */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Cumulative CGPA
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">
              <AnimatedCounter value={activeStudent.currentCgpa || 0.00} decimals={2} />
            </span>
            <span className="text-xs font-semibold text-neutral-400">/ 4.00</span>
          </div>
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mt-2">
            Classification: {audit.classification}
          </p>
        </div>

        {/* Latest Semester GPA */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Current Term GPA
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
              <AnimatedCounter value={selectedSemester?.gpa || 0.00} decimals={2} />
            </span>
            <span className="text-xs font-semibold text-neutral-400">/ 4.00</span>
          </div>
          <p className="text-xs font-medium text-neutral-500 mt-2">
            {selectedSemester?.semesterName}
          </p>
        </div>

        {/* Earned Credits */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Total Credits Earned
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
              <AnimatedCounter value={activeStudent.creditsEarned || 0} />
            </span>
            <span className="text-xs font-semibold text-neutral-400">/ {activeStudent.requiredCredits || 132} Cr</span>
          </div>
          <p className="text-xs font-medium text-neutral-500 mt-2">
            {Math.max(0, (activeStudent.requiredCredits || 132) - (activeStudent.creditsEarned || 0))} Credits to Graduation
          </p>
        </div>
      </div>

      {/* 2. CGPA Trajectory Visualization */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Academic Trajectory & Progression
            </h3>
            <p className="text-xs text-neutral-500">
              Semester GPA vs. Cumulative CGPA evolution over academic tenure
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span>Cumulative CGPA</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Term GPA</span>
            </div>
          </div>
        </div>

        <div className="h-56 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="semester" stroke="#9CA3AF" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 4.0]} stroke="#9CA3AF" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  borderColor: '#374151',
                  borderRadius: '0.75rem',
                  color: '#F9FAFB',
                  fontSize: '12px'
                }} 
              />
              <Line type="monotone" dataKey="cgpa" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="CGPA" />
              <Line type="monotone" dataKey="gpa" stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} name="Term GPA" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Semester Selector & Course Marks Breakout */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs overflow-hidden">
        {/* Tab Header */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Select Term Statement:
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {studentResultsHistory.map((sem, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedSemesterIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedSemesterIndex === idx
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100'
                }`}
              >
                Level {sem.level} · {sem.semesterName.includes('First') ? 'Sem 1' : 'Sem 2'}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Semester Banner */}
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900">
          <div>
            <h4 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100">
              {selectedSemester?.semesterName} Statement of Results
            </h4>
            <p className="text-xs text-neutral-500">
              Academic Session: {selectedSemester?.sessionName} · Level {selectedSemester?.level}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Term GPA</span>
              <p className="text-lg font-black font-mono text-indigo-600 dark:text-indigo-400">
                {selectedSemester?.gpa.toFixed(2)}
              </p>
            </div>
            <div className="h-8 w-px bg-neutral-200 dark:border-neutral-800" />
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Term CGPA</span>
              <p className="text-lg font-black font-mono text-neutral-900 dark:text-neutral-100">
                {selectedSemester?.cgpa.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {selectedSemester?.courses.map((course, cIdx) => (
            <div key={cIdx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                  course.grade === 'A' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300' :
                  course.grade === 'B+' || course.grade === 'B' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300' :
                  course.grade === 'C+' || course.grade === 'C' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300' :
                  course.grade === 'D+' || course.grade === 'D' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300' :
                  'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300'
                }`}>
                  {course.grade}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-neutral-900 dark:text-neutral-100">{course.code}</span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      {course.credits} Credits
                    </span>
                  </div>
                  <h5 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
                    {course.title}
                  </h5>
                  <p className="text-xs text-neutral-400 mt-0.5 font-medium">
                    Score: {course.score !== undefined ? `${course.score}%` : 'Pending Examination'}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-end justify-between sm:justify-center text-xs">
                <span>Credit Hours: {course.credits}</span>
                <span className="font-mono font-bold">
                  {course.grade === 'IP' ? 'Exams Pending' : `GP: ${course.gradePoint.toFixed(1)}`}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Summary Strip */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 border-t border-neutral-200/80 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-neutral-500 dark:text-neutral-400">Credits Registered: </span>
              <strong className="text-neutral-900 dark:text-neutral-100">{selectedSemester?.creditsAttempted}</strong>
            </div>
            <div>
              <span className="text-neutral-500 dark:text-neutral-400">Credits Passed: </span>
              <strong className="text-emerald-600 dark:text-emerald-400">{selectedSemester?.creditsEarned}</strong>
            </div>
          </div>

          <div className="flex items-center gap-4 font-bold">
            <span className="text-neutral-700 dark:text-neutral-300">
              Semester GPA: <span className="text-indigo-600 dark:text-indigo-400">{selectedSemester?.gpa.toFixed(2)}</span>
            </span>
            <span className="text-neutral-700 dark:text-neutral-300">
              Cumulative CGPA: <span className="text-indigo-600 dark:text-indigo-400">{selectedSemester?.cgpa.toFixed(2)}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
