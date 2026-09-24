import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Info, 
  Printer, 
  ShieldAlert, 
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Course, CourseRegistrationSlip } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';

export const CourseRegistration: React.FC = () => {
  const { 
    courses, 
    settings, 
    activeStudent, 
    addDocument, 
    logAction,
    submitCourseRegistration,
    financialLedgers,
    registrations
  } = useSchool();
  const { success, warning, error } = useToast();

  const MIN_CREDITS = settings.minRegistrationCredits || 15;
  const MAX_CREDITS = settings.maxRegistrationCredits || 21;

  // Check if student has fee clearance
  const studentLedger = financialLedgers[activeStudent.studentId];
  const hasFeeClearance = !studentLedger || studentLedger.isCleared || studentLedger.balance <= 0;

  // Level-aware default courses for current student
  const defaultCourseIds = useMemo(() => {
    const matched = courses.filter(c => c.level === activeStudent.currentLevel);
    if (matched.length > 0) return matched.map(c => c.id);
    return courses.slice(0, 5).map(c => c.id);
  }, [courses, activeStudent.currentLevel]);

  // Check if student has an existing submitted registration
  const existingRegistration = useMemo(() => {
    return registrations.find(
      r => r.studentId === activeStudent.studentId && 
           (r.academicSession === settings.currentSession || r.semester === settings.currentSemester)
    );
  }, [registrations, activeStudent.studentId, settings.currentSession, settings.currentSemester]);

  // Selected course IDs with localStorage persistence
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>(() => {
    if (existingRegistration && existingRegistration.items?.length > 0) {
      return existingRegistration.items.map(i => i.courseId);
    }
    try {
      const saved = localStorage.getItem(`premier_course_reg_draft_${activeStudent.studentId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return defaultCourseIds;
  });

  const [filterType, setFilterType] = useState<string>('all');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => Boolean(existingRegistration));
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  // Sync state if existing registration changes or activeStudent changes
  useEffect(() => {
    if (existingRegistration && existingRegistration.items?.length > 0) {
      setIsSubmitted(true);
      setSelectedCourseIds(existingRegistration.items.map(i => i.courseId));
    } else {
      setIsSubmitted(false);
      try {
        const saved = localStorage.getItem(`premier_course_reg_draft_${activeStudent.studentId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSelectedCourseIds(parsed);
            return;
          }
        }
      } catch {}
      setSelectedCourseIds(defaultCourseIds);
    }
  }, [existingRegistration, activeStudent.studentId, defaultCourseIds]);

  // Auto-save draft course selections to localStorage
  useEffect(() => {
    if (!isSubmitted) {
      try {
        localStorage.setItem(`premier_course_reg_draft_${activeStudent.studentId}`, JSON.stringify(selectedCourseIds));
      } catch {}
    }
  }, [selectedCourseIds, isSubmitted, activeStudent.studentId]);

  // Derive selected course objects & credits
  const selectedCourses = courses.filter(c => selectedCourseIds.includes(c.id));
  const totalCredits = selectedCourses.reduce((acc, curr) => acc + curr.creditHours, 0);

  const isBelowMin = totalCredits < MIN_CREDITS;
  const isAboveMax = totalCredits > MAX_CREDITS;
  const isValidRegistration = !isBelowMin && !isAboveMax && selectedCourses.length > 0;

  const toggleCourse = (course: Course) => {
    if (isSubmitted) {
      warning("Registration Locked", "Your registration has already been submitted for official vetting.");
      return;
    }

    if (selectedCourseIds.includes(course.id)) {
      setSelectedCourseIds(prev => prev.filter(id => id !== course.id));
    } else {
      if (totalCredits + course.creditHours > MAX_CREDITS) {
        warning("Maximum Credit Limit Exceeded", `Adding ${course.code} would total ${totalCredits + course.creditHours} credits (Maximum allowed is ${MAX_CREDITS}).`);
        return;
      }
      setSelectedCourseIds(prev => [...prev, course.id]);
    }
  };

  const handleSubmitRegistration = () => {
    if (!hasFeeClearance) {
      error(
        "Financial Clearance Required",
        `You have an outstanding fee balance of ${settings.currency || 'GHS'} ${studentLedger?.balance?.toLocaleString()}. Please complete your bursary clearance before submitting course registration.`
      );
      return;
    }

    if (!isValidRegistration) {
      if (isBelowMin) {
        error("Minimum Credit Requirement", `You must register at least ${MIN_CREDITS} credits (Currently ${totalCredits}).`);
      } else if (isAboveMax) {
        error("Maximum Credit Limit", `Exceeded maximum allowable limit of ${MAX_CREDITS} credits.`);
      }
      return;
    }

    // Persist registration slip into institutional document repository
    const registrationSlipDoc = {
      studentId: activeStudent.id,
      title: `Course Registration Slip - ${settings.currentSemester} ${settings.currentSession}`,
      fileName: `Course_Registration_${activeStudent.studentId.replace(/\//g, '_')}.pdf`,
      category: 'registration_slip' as const,
      fileSize: '340 KB',
      fileType: 'PDF',
      uploadedBy: 'Registrar Directorate',
      downloadUrl: '#',
      isVerified: true,
      status: 'active' as const
    };

    addDocument(registrationSlipDoc);

    const newSlip: CourseRegistrationSlip = {
      id: `reg-${Date.now()}`,
      studentId: activeStudent.studentId,
      semesterId: `sem-${settings.currentSession.replace('/', '-')}-1`,
      academicSession: settings.currentSession,
      semester: settings.currentSemester,
      level: activeStudent.currentLevel,
      status: 'submitted',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      items: selectedCourses.map(c => ({
        id: `it-${c.id}`,
        courseId: c.id,
        code: c.code,
        title: c.title,
        creditHours: c.creditHours,
        type: c.type,
        status: 'pending'
      })),
      totalCredits
    };

    submitCourseRegistration(newSlip);

    logAction(
      'COURSE_REGISTRATION_SUBMITTED',
      'CourseRegistration',
      `Student ${activeStudent.studentId} (${activeStudent.firstName} ${activeStudent.lastName}) registered ${selectedCourses.length} courses (${totalCredits} credits) for ${settings.currentSession}.`
    );

    setIsSubmitted(true);
    try {
      localStorage.removeItem(`premier_course_reg_draft_${activeStudent.studentId}`);
    } catch {}
    success("Registration Submitted Successfully", "Your course registration slip has been dispatched to the Registrar for vetting and archived in your Document Repository.");
  };

  const handlePrintSlip = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };

  const filteredCourses = courses.filter(course => {
    if (filterType === 'all') return true;
    return course.type === filterType;
  });

  return (
    <div id="course-registration-page" className="max-w-7xl mx-auto space-y-8 pb-28">
      {/* Header & Academic Regulations Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            {settings.currentSession} · {settings.currentSemester}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
            Course Registration & Curriculum Selection
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Program: <strong className="text-neutral-900 dark:text-neutral-100">{activeStudent.programName}</strong> · Current Level: <strong>{activeStudent.currentLevel}</strong>
          </p>
        </div>

        {isSubmitted && (
          <button
            type="button"
            onClick={handlePrintSlip}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Download Registration Slip</span>
          </button>
        )}
      </div>

      {/* Rules Notice */}
      <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 flex items-start gap-3">
        <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="text-xs text-sky-900 dark:text-sky-200 leading-relaxed">
          <strong>Registration Regulations:</strong> Students must register between <strong>{MIN_CREDITS}</strong> and <strong>{MAX_CREDITS}</strong> credits per regular semester. Core curriculum courses are strictly compulsory for graduation clearance. Prerequisites must be completed in prior semesters.
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['all', 'core', 'elective', 'required'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
              filterType === type
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200/80 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            {type === 'all' ? 'All Catalog Courses' : `${type} Courses`}
          </button>
        ))}
      </div>

      {/* Course Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {filteredCourses.map((course) => {
          const isSelected = selectedCourseIds.includes(course.id);
          const hasPrereq = course.prerequisites && course.prerequisites.length > 0;

          return (
            <motion.div
              key={course.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-500/80 dark:border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20 shadow-sm'
                  : 'border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-xs font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                      {course.code}
                    </span>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 leading-snug mt-0.5">
                      {course.title}
                    </h3>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize shrink-0 ${
                    course.type === 'core'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      : course.type === 'elective'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                      : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                  }`}>
                    {course.type}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3 mb-4">
                  {course.description}
                </p>

                {/* Prerequisite & Lecturer info */}
                <div className="space-y-1.5 py-3 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px]">
                  {hasPrereq && (
                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 font-medium">
                      <span>Prerequisite:</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        {course.prerequisites?.join(', ')} ✓ Passed
                      </span>
                    </div>
                  )}
                  {course.lecturerName && (
                    <div className="text-neutral-500 dark:text-neutral-400">
                      Instructor: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{course.lecturerName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom selection control */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  {course.creditHours} Credit Hours
                </span>

                <button
                  type="button"
                  onClick={() => toggleCourse(course)}
                  disabled={isSubmitted}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      : 'border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  } ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Selected</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Select Course</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Sticky Registration Drawer Summary at Bottom */}
      <div 
        id="registration-sticky-summary"
        className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 py-3.5 px-4 md:px-8 shadow-2xl transition-all"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 w-full md:w-auto justify-between md:justify-start">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Courses Selected
              </div>
              <div className="text-lg font-extrabold text-neutral-900 dark:text-neutral-100">
                {selectedCourses.length} Courses
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Total Credits
              </div>
              <div className={`text-lg font-extrabold ${
                isBelowMin || isAboveMax ? 'text-rose-600 dark:text-rose-400' : 'text-indigo-600 dark:text-indigo-400'
              }`}>
                {totalCredits} <span className="text-xs font-semibold text-neutral-400">/ {MAX_CREDITS} Max</span>
              </div>
            </div>

            <div className="hidden sm:block">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Validation Status
              </div>
              {isValidRegistration ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Valid for Submission</span>
                </div>
              ) : isBelowMin ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Need +{MIN_CREDITS - totalCredits} credits</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Exceeds max limit</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-auto flex items-center gap-3">
            {isSubmitted ? (
              <div className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Registration Submitted (Pending Vetting)</span>
              </div>
            ) : (
              <button
                id="submit-registration-button"
                type="button"
                onClick={handleSubmitRegistration}
                disabled={!isValidRegistration}
                className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 ${
                  isValidRegistration
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 active:scale-95'
                    : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                }`}
              >
                <span>Submit Course Registration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
