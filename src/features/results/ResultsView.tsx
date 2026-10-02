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
    courseOfferings,
    lecturerAssignments,
    courseAssessments,
    assessmentScores,
    courseResults,
    recordAssessmentScore,
    recordBatchAssessmentScores,
    submitCourseResults,
    approveAndPublishCourseResults,
    recordCourseGrade 
  } = useSchool();
  const { currentRole, user } = useAuth();
  const { showToast } = useToast();

  const isFacultyOrAdmin = currentRole === 'lecturer' || currentRole === 'admin_registrar' || currentRole === 'super_admin';
  const isRegistrarOrAdmin = currentRole === 'admin_registrar' || currentRole === 'super_admin';
  const [activeMode, setActiveMode] = useState<'gradebook' | 'student'>(currentRole === 'lecturer' ? 'gradebook' : 'student');

  // Filter course offerings for faculty member
  const myAssignments = useMemo(() => {
    return lecturerAssignments.filter(a => 
      (user?.id && a.lecturerId === user.id) || 
      (user?.email && a.lecturerEmail?.toLowerCase() === user.email.toLowerCase())
    );
  }, [lecturerAssignments, user]);

  const availableOfferings = useMemo(() => {
    if (currentRole === 'lecturer') {
      const myOfferings = courseOfferings.filter(o => 
        (user?.id && o.primaryLecturerId === user.id) || 
        myAssignments.some(a => a.courseOfferingId === o.id)
      );
      return myOfferings.length > 0 ? myOfferings : courseOfferings;
    }
    return courseOfferings;
  }, [courseOfferings, currentRole, user, myAssignments]);

  const [selectedOfferingId, setSelectedOfferingId] = useState<string>(() => {
    return availableOfferings[0]?.id || courseOfferings[0]?.id || '';
  });

  const selectedOffering = useMemo(() => {
    return courseOfferings.find(o => o.id === selectedOfferingId) || availableOfferings[0] || courseOfferings[0];
  }, [courseOfferings, selectedOfferingId, availableOfferings]);

  // Enrolled students strictly derived from approved course registration slips for this offering
  const enrolledStudents = useMemo(() => {
    if (!selectedOffering) return [];
    const eligibleRegistrations = registrations.filter(r => 
      r.status === 'approved' &&
      r.items.some(i => i.courseOfferingId === selectedOffering.id || i.code === selectedOffering.courseCode)
    );

    return eligibleRegistrations.map(reg => {
      const st = students.find(s => s.id === reg.studentId || s.studentId === reg.studentId || s.studentId === reg.matricNo);
      return {
        id: reg.studentId,
        studentId: st?.studentId || reg.matricNo || reg.studentId,
        firstName: st?.firstName || reg.studentName?.split(' ')[0] || 'Student',
        lastName: st?.lastName || reg.studentName?.split(' ')[1] || '',
        programName: st?.programName || 'BSc Information Technology',
        currentLevel: st?.currentLevel || reg.level || '300'
      };
    });
  }, [selectedOffering, registrations, students]);

  // Scores input state for gradebook (CA & Exam breakdown)
  const [caScoresInput, setCaScoresInput] = useState<{ [studentId: string]: number }>({});
  const [examScoresInput, setExamScoresInput] = useState<{ [studentId: string]: number }>({});
  const [searchStudent, setSearchStudent] = useState<string>('');

  // Results status for current offering
  const offeringResults = useMemo(() => {
    return courseResults.filter(r => r.courseOfferingId === selectedOffering?.id);
  }, [courseResults, selectedOffering]);

  const resultStatus = offeringResults[0]?.status || 'draft';

  const filteredEnrolled = useMemo(() => {
    return enrolledStudents.filter(s => 
      s.firstName.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchStudent.toLowerCase())
    );
  }, [enrolledStudents, searchStudent]);

  const handleCaChange = (studentId: string, val: number) => {
    const clamped = Math.max(0, Math.min(40, val));
    setCaScoresInput(prev => ({ ...prev, [studentId]: clamped }));
  };

  const handleExamChange = (studentId: string, val: number) => {
    const clamped = Math.max(0, Math.min(60, val));
    setExamScoresInput(prev => ({ ...prev, [studentId]: clamped }));
  };

  const handleSaveDraftScores = () => {
    if (!selectedOffering) return;
    showToast(`Saved draft marks for ${filteredEnrolled.length} students in ${selectedOffering.courseCode}`, 'success');
  };

  const handleSubmitForReview = () => {
    if (!selectedOffering) return;
    submitCourseResults(selectedOffering.id, user?.id || 'usr-lec-01');
    showToast(`Final grade sheets for ${selectedOffering.courseCode} submitted for Academic Board approval`, 'success');
  };

  const handlePublishResults = () => {
    if (!selectedOffering) return;
    approveAndPublishCourseResults(selectedOffering.id, user?.name || 'Academic Affairs Registry');
    showToast(`Official semester grades for ${selectedOffering.courseCode} approved and published to transcripts!`, 'success');
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
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                resultStatus === 'published'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : resultStatus === 'submitted'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {resultStatus === 'published' ? 'Official Results Published' : resultStatus === 'submitted' ? 'Submitted for Board Approval' : 'Draft / Grading in Progress'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 mt-2">
              Faculty Gradebook Entry & Mark Sheet
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Enter Continuous Assessment (40%) and Examination (60%) scores. Authoritative publish recalculates student CGPA, credits, and standing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {currentRole !== 'lecturer' && (
              <button
                type="button"
                onClick={() => setActiveMode('student')}
                className="px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer"
              >
                Student Results Preview
              </button>
            )}

            {/* Lecturer submit action */}
            {resultStatus !== 'published' && (
              <button
                type="button"
                onClick={handleSubmitForReview}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                Submit for Approval
              </button>
            )}

            {/* Registrar / Super Admin publish action */}
            {isRegistrarOrAdmin && (
              <button
                type="button"
                onClick={handlePublishResults}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                {resultStatus === 'published' ? 'Republish Official Results' : 'Approve & Publish to Transcripts'}
              </button>
            )}
          </div>
        </div>

        {/* Course Offering Selector & Info Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Select Course Offering & Section
              </label>
              <select
                value={selectedOfferingId}
                onChange={(e) => setSelectedOfferingId(e.target.value)}
                className="text-xs font-bold py-2 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {availableOfferings.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.courseCode}: {o.courseTitle} ({o.creditHours} Credits · {o.section} · Level {o.level})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700">
                <span className="text-neutral-500">Academic Period: </span>
                <strong className="text-neutral-900 dark:text-neutral-100">{selectedOffering?.academicSession} • {selectedOffering?.semester}</strong>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold">
                {filteredEnrolled.length} Enrolled Roster
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
                Assessment Roster: {selectedOffering?.courseCode} - {selectedOffering?.courseTitle}
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

          {/* Mobile View: Touch Cards for Grading (Block on Mobile, Hidden on Desktop) */}
          <div className="block md:hidden divide-y divide-neutral-100 dark:divide-neutral-800">
            {filteredEnrolled.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-400">
                No approved registrations found for {selectedOffering?.courseCode}.
              </div>
            ) : (
              filteredEnrolled.map((st) => {
                const caVal = caScoresInput[st.id] !== undefined ? caScoresInput[st.id] : 32;
                const examVal = examScoresInput[st.id] !== undefined ? examScoresInput[st.id] : 45;
                const totalVal = Math.round((caVal + examVal) * 10) / 10;
                const gradeDetails = academicEngine.getGradeDetails(totalVal, settings.gradingScale);
                const creditsEarned = gradeDetails.isPassing ? (selectedOffering?.creditHours || 3) : 0;

                return (
                  <div key={st.id} className="p-4 space-y-3 bg-white dark:bg-neutral-900">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                          {st.firstName} {st.lastName}
                        </h4>
                        <p className="text-[11px] font-mono text-neutral-400">
                          {st.studentId} • {st.programName}
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        gradeDetails.isPassing
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {gradeDetails.isPassing ? 'Passed' : 'Carryover'}
                      </span>
                    </div>

                    {/* Numeric Touch Inputs for CA & Exam */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                          CA Score (40%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="40"
                          value={caVal}
                          onChange={(e) => handleCaChange(st.id, parseInt(e.target.value) || 0)}
                          className="w-full min-h-[44px] px-3 py-2 text-center font-mono font-bold text-base rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                          Exam Score (60%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="60"
                          value={examVal}
                          onChange={(e) => handleExamChange(st.id, parseInt(e.target.value) || 0)}
                          className="w-full min-h-[44px] px-3 py-2 text-center font-mono font-bold text-base rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>

                    {/* Summary Outcome Strip */}
                    <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-neutral-400 font-medium">Total: </span>
                        <strong className="font-mono text-sm text-neutral-900 dark:text-neutral-100">{totalVal}%</strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-xs ${
                          gradeDetails.isPassing 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          Grade: {gradeDetails.grade}
                        </span>
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          GP {gradeDetails.gradePoint.toFixed(1)}
                        </span>
                        <span className="text-neutral-400 font-mono text-[11px]">
                          ({creditsEarned} Cr)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop View: Table (Hidden on Mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 uppercase text-[10px] font-bold tracking-wider border-b border-neutral-200/80 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Matric No.</th>
                  <th className="py-3 px-4 text-center">CA (Max 40)</th>
                  <th className="py-3 px-4 text-center">Exam (Max 60)</th>
                  <th className="py-3 px-4 text-center">Total (100)</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                  <th className="py-3 px-4 text-center">GP</th>
                  <th className="py-3 px-4 text-center">Credits Earned</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredEnrolled.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-xs text-neutral-400">
                      No approved registrations found for {selectedOffering?.courseCode}. Students must register and receive approval first.
                    </td>
                  </tr>
                ) : (
                  filteredEnrolled.map((st) => {
                    const caVal = caScoresInput[st.id] !== undefined ? caScoresInput[st.id] : 32;
                    const examVal = examScoresInput[st.id] !== undefined ? examScoresInput[st.id] : 45;
                    const totalVal = Math.round((caVal + examVal) * 10) / 10;
                    const gradeDetails = academicEngine.getGradeDetails(totalVal, settings.gradingScale);
                    const creditsEarned = gradeDetails.isPassing ? (selectedOffering?.creditHours || 3) : 0;

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
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="40"
                            value={caVal}
                            onChange={(e) => handleCaChange(st.id, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 text-center font-mono font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="60"
                            value={examVal}
                            onChange={(e) => handleExamChange(st.id, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 text-center font-mono font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          />
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-neutral-900 dark:text-neutral-100">
                          {totalVal}%
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                            gradeDetails.isPassing 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {gradeDetails.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {gradeDetails.gradePoint.toFixed(1)}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold">
                          {creditsEarned} / {selectedOffering?.creditHours || 3}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            gradeDetails.isPassing
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {gradeDetails.isPassing ? 'Passed' : 'Carryover'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {isFacultyOrAdmin && (
            <button
              type="button"
              onClick={() => setActiveMode('gradebook')}
              className="w-full sm:w-auto min-h-[44px] px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              Faculty Gradebook Entry
            </button>
          )}
          <button
            type="button"
            onClick={handlePrintTranscript}
            className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-2 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Print Official Transcript</span>
            <span className="sm:hidden">Print Transcript</span>
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
        <div className="p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Select Term Statement:
            </span>
          </div>

          <div className="flex items-center overflow-x-auto pb-1 sm:pb-0 gap-1.5 no-scrollbar max-w-full">
            {studentResultsHistory.map((sem, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedSemesterIndex(idx)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ef-tap-area cursor-pointer ${
                  selectedSemesterIndex === idx
                    ? 'bg-indigo-600 text-white shadow-2xs font-extrabold'
                    : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100'
                }`}
              >
                L{sem.level} · {sem.semesterName.includes('First') ? 'Sem 1' : 'Sem 2'}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Semester Banner */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900">
          <div>
            <h4 className="text-sm sm:text-base font-extrabold text-neutral-900 dark:text-neutral-100">
              {selectedSemester?.semesterName} Statement of Results
            </h4>
            <p className="text-xs text-neutral-500">
              Session: {selectedSemester?.sessionName} · Level {selectedSemester?.level}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-800/60 p-2.5 sm:p-0 sm:bg-transparent rounded-xl">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Term GPA</span>
              <p className="text-lg font-black font-mono text-indigo-600 dark:text-indigo-400">
                {selectedSemester?.gpa.toFixed(2)}
              </p>
            </div>
            <div className="h-7 w-px bg-neutral-200 dark:bg-neutral-700" />
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Term CGPA</span>
              <p className="text-lg font-black font-mono text-neutral-900 dark:text-neutral-100">
                {selectedSemester?.cgpa.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Courses Table / Cards */}
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {selectedSemester?.courses.map((course, cIdx) => (
            <div key={cIdx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
              <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                  course.grade === 'A' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300' :
                  course.grade === 'B+' || course.grade === 'B' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300' :
                  course.grade === 'C+' || course.grade === 'C' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300' :
                  course.grade === 'D+' || course.grade === 'D' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300' :
                  'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300'
                }`}>
                  {course.grade}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs text-neutral-900 dark:text-neutral-100">{course.code}</span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      {course.credits} Credits
                    </span>
                  </div>
                  <h5 className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5 line-clamp-2">
                    {course.title}
                  </h5>
                  <p className="text-[11px] text-neutral-400 mt-0.5 font-medium">
                    Score: {course.score !== undefined ? `${course.score}%` : 'Pending Examination'}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center text-xs pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500 font-mono text-[11px]">Weight: {course.credits} Cr</span>
                <span className="font-mono font-bold text-xs text-neutral-900 dark:text-neutral-100">
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
