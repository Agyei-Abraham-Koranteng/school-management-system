import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  TrendingUp, 
  FileText, 
  Printer, 
  Calendar, 
  BookOpen, 
  CheckCircle,
  HelpCircle
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
import { academicEngine } from '../../services/academics/academicEngine';

export const ResultsView: React.FC = () => {
  const { activeStudent, settings, courseAttempts, registrations, courses, carryovers } = useSchool();

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

        <button
          type="button"
          onClick={handlePrintTranscript}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2 transition-colors shadow-2xs"
        >
          <Printer className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Print Official Transcript</span>
        </button>
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
              <AnimatedCounter value={activeStudent.currentCgpa || 3.42} decimals={2} />
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
            Latest Semester GPA
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
              <AnimatedCounter value={selectedSemester.gpa} decimals={2} />
            </span>
            <span className="text-xs font-semibold text-neutral-400">/ 4.00</span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            {selectedSemester.semesterName} ({selectedSemester.sessionName})
          </p>
        </div>

        {/* Credits Completed */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Total Earned Credits
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
              <AnimatedCounter value={activeStudent.creditsEarned || 78} />
            </span>
            <span className="text-xs font-semibold text-neutral-400">/ {activeStudent.requiredCredits || 132} Required</span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            {carryovers.length} Outstanding / Carryover Courses
          </p>
        </div>
      </div>

      {/* 2. CGPA Progression Chart */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Academic Performance Trendline
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Progression curve of Semester GPA vs Cumulative CGPA across academic sessions
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              Cumulative (CGPA)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              Semester (GPA)
            </span>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
              <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 4.0]} ticks={[1.0, 2.0, 3.0, 4.0]} tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#171717', 
                  borderRadius: '12px', 
                  color: '#fff', 
                  border: 'none',
                  fontSize: '12px' 
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="cgpa" 
                stroke="#6366f1" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
              />
              <Line 
                type="monotone" 
                dataKey="gpa" 
                stroke="#10b981" 
                strokeWidth={2} 
                strokeDasharray="4 4"
                dot={{ r: 3 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Detailed Course Results breakdown per Semester */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs overflow-hidden">
        {/* Semester Selection Tabs */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2 overflow-x-auto">
          {studentResultsHistory.map((sem, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedSemesterIndex(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedSemesterIndex === idx
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              Level {sem.level} · {sem.semesterName} ({sem.sessionName})
            </button>
          ))}
        </div>

        {/* Results Data Table (Responsive Desktop Table + Mobile Cards) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 dark:bg-neutral-800/40 text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-200/80 dark:border-neutral-800">
              <tr>
                <th className="py-3 px-5">Course Code</th>
                <th className="py-3 px-5">Course Title</th>
                <th className="py-3 px-4 text-center">Credit Hours</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-right">Grade Point</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-medium text-neutral-800 dark:text-neutral-200">
              {selectedSemester.courses.map((course) => (
                <tr key={course.code} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {course.code}
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-neutral-900 dark:text-neutral-100">
                    {course.title}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {course.credits}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold">
                    {course.grade === 'IP' ? (
                      <span className="text-neutral-400 font-normal">Pending Exam</span>
                    ) : (
                      course.score
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {course.grade === 'IP' ? (
                      <span className="inline-block px-2 py-0.5 rounded-md font-bold text-[11px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                        IN PROGRESS
                      </span>
                    ) : (
                      <span className={`inline-block px-2 py-0.5 rounded-md font-bold text-xs ${
                        course.grade.startsWith('A')
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : course.grade.startsWith('B')
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {course.grade}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold">
                    {course.grade === 'IP' ? '-' : course.gradePoint.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Render as Cards */}
        <div className="sm:hidden divide-y divide-neutral-100 dark:divide-neutral-800 p-4 space-y-3">
          {selectedSemester.courses.map((course) => (
            <div key={course.code} className="pt-3 first:pt-0 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                  {course.code}
                </span>
                <span className="font-bold text-xs px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                  {course.grade === 'IP' ? 'IN PROGRESS' : `Grade ${course.grade} (${course.score}%)`}
                </span>
              </div>
              <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {course.title}
              </p>
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
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
              <strong className="text-neutral-900 dark:text-neutral-100">{selectedSemester.creditsAttempted}</strong>
            </div>
            <div>
              <span className="text-neutral-500 dark:text-neutral-400">Credits Passed: </span>
              <strong className="text-emerald-600 dark:text-emerald-400">{selectedSemester.creditsEarned}</strong>
            </div>
          </div>

          <div className="flex items-center gap-4 font-bold">
            <span className="text-neutral-700 dark:text-neutral-300">
              Semester GPA: <span className="text-indigo-600 dark:text-indigo-400">{selectedSemester.gpa.toFixed(2)}</span>
            </span>
            <span className="text-neutral-700 dark:text-neutral-300">
              Cumulative CGPA: <span className="text-indigo-600 dark:text-indigo-400">{selectedSemester.cgpa.toFixed(2)}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
