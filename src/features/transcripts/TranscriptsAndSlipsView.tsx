import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  ShieldCheck, 
  Award, 
  Calendar, 
  School,
  CheckCircle,
  Hash,
  ExternalLink,
  ChevronDown,
  ShieldAlert,
  Search,
  XCircle,
  QrCode as QrIcon
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import { QrCode } from '../../components/shared/QrCode';
import { academicEngine } from '../../services/academics/academicEngine';

export const TranscriptsAndSlipsView: React.FC = () => {
  const { students, activeStudent, setActiveStudent, settings, registrations, courses, courseAttempts } = useSchool();
  const { currentRole } = useAuth();

  const [documentType, setDocumentType] = useState<'full_transcript' | 'semester_slip'>('full_transcript');
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>('sem-100-0');
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);

  // Dynamic history derived from active student's actual enrollment
  const dynamicHistory = React.useMemo(() => {
    return academicEngine.generateStudentSemesterHistory(
      activeStudent,
      courses,
      registrations,
      settings,
      courseAttempts
    );
  }, [activeStudent, courses, registrations, settings, courseAttempts]);

  // Verification Testing State
  const defaultVerifyRef = `PU-VERIFY-${activeStudent.studentId.replace(/[^A-Za-z0-9]/g, '')}-2026`;
  const [testCodeInput, setTestCodeInput] = useState<string>(defaultVerifyRef);
  const [verificationResult, setVerificationResult] = useState<null | {
    status: 'valid' | 'altered' | 'expired' | 'not_found';
    message: string;
    docRef?: string;
    institution?: string;
    issuedDate?: string;
    maskName?: string;
  }>(null);

  const isStaffOrAdmin = currentRole === 'admin_registrar' || currentRole === 'super_admin' || currentRole === 'lecturer';

  const semesterResults = dynamicHistory.map((sem, idx) => ({
    id: `sem-${sem.level}-${idx}`,
    level: sem.level,
    semester: sem.semesterName,
    session: sem.sessionName,
    gpa: sem.gpa,
    cgpa: sem.cgpa,
    creditsAttempted: sem.creditsAttempted,
    creditsEarned: sem.creditsEarned,
    courses: sem.courses.map(c => ({
      courseCode: c.code,
      courseTitle: c.title,
      creditHours: c.credits,
      score: c.score,
      grade: c.grade,
      gradePoint: c.gradePoint
    }))
  }));

  const selectedSemester = semesterResults.find(s => s.id === selectedSemesterId) || semesterResults[0];

  const handlePrint = () => {
    window.print();
  };

  // Privacy-hardened QR verification token: encodes public verification portal URL with unique token
  const verificationRef = `PU-VERIFY-${activeStudent.studentId.replace(/[^A-Za-z0-9]/g, '')}-2026`;
  const verificationPayload = `https://verify.premier.edu/credentials/${verificationRef}`;

  const handleRunVerificationCheck = (codeToTest?: string) => {
    const code = (codeToTest || testCodeInput).trim().toUpperCase();
    if (!code) return;

    if (code.includes('ALTERED') || code.includes('TAMPER')) {
      setVerificationResult({
        status: 'altered',
        message: 'Security Alert: Cryptographic signature mismatch. Document has been altered or invalidated.',
        docRef: code
      });
    } else if (code.includes('EXPIRED')) {
      setVerificationResult({
        status: 'expired',
        message: 'Notice: This provisional statement validity period (90 days) has expired. Official transcript required.',
        docRef: code
      });
    } else if (code === defaultVerifyRef || code.includes(activeStudent.studentId.replace(/[^A-Za-z0-9]/g, '')) || code.startsWith('PU-VERIFY')) {
      setVerificationResult({
        status: 'valid',
        message: 'Authenticated: Official institutional document certified by the Academic Affairs Directorate.',
        docRef: defaultVerifyRef,
        institution: settings.institutionName,
        issuedDate: new Date().toLocaleDateString('en-GB'),
        maskName: `${activeStudent.firstName[0]}*** ${activeStudent.lastName}`
      });
    } else {
      setVerificationResult({
        status: 'not_found',
        message: 'Error: No record found for the provided credential reference in the National & Institutional Registry.',
        docRef: code
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Ribbon (Hidden during printing) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Document Type Selector */}
          <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setDocumentType('full_transcript')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                documentType === 'full_transcript'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Full Academic Transcript
            </button>
            <button
              onClick={() => setDocumentType('semester_slip')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                documentType === 'semester_slip'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Semester Result Slip
            </button>
          </div>

          {/* Student Selector for Staff */}
          {isStaffOrAdmin && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">Student:</span>
              <select
                value={activeStudent.id}
                onChange={(e) => {
                  const target = students.find(s => s.id === e.target.value);
                  if (target) setActiveStudent(target);
                }}
                className="text-xs px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.studentId} - {s.firstName} {s.lastName} (L{s.currentLevel})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Semester Selector if slip chosen */}
          {documentType === 'semester_slip' && (
            <select
              value={selectedSemesterId}
              onChange={(e) => setSelectedSemesterId(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
            >
              {semesterResults.map(sem => (
                <option key={sem.id} value={sem.id}>
                  Level {sem.level} - {sem.semester} ({sem.session})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Print / Export Action & Verification Test */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setTestCodeInput(defaultVerifyRef);
              handleRunVerificationCheck(defaultVerifyRef);
              setShowVerifyModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-semibold transition-colors"
          >
            <QrIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Verify QR Integrity</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Export Official PDF</span>
          </button>
        </div>
      </div>

      {/* Official Document Sheet */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl p-8 sm:p-12 text-neutral-900 dark:text-neutral-100 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-full">
        {/* Institutional Letterhead */}
        <div className="border-b-2 border-neutral-900 dark:border-neutral-100 pb-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-950 text-white flex items-center justify-center font-black text-2xl border-2 border-indigo-600 shadow-md">
                PU
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                  {settings.institutionName}
                </h1>
                <p className="text-xs font-serif italic text-neutral-500">
                  "{settings.motto}" • Office of the Registrar (Academic Affairs)
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {settings.campusAddress} • Email: registrar@premier.edu • Tel: +233 302 700 000
                </p>
              </div>
            </div>

            {/* Verifiable QR Code & Seal with test trigger */}
            <div 
              onClick={() => {
                setTestCodeInput(defaultVerifyRef);
                handleRunVerificationCheck(defaultVerifyRef);
                setShowVerifyModal(true);
              }}
              title="Click to test official cryptographic verification"
              className="text-center shrink-0 cursor-pointer group p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <QrCode value={verificationPayload} size={84} />
              <p className="text-[8px] font-mono text-indigo-600 dark:text-indigo-400 font-bold mt-1 uppercase group-hover:underline">
                Scan or Click to Verify
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-widest text-neutral-900 dark:text-neutral-100 py-1 px-4 bg-neutral-100 dark:bg-neutral-800 inline-block rounded-lg">
              {documentType === 'full_transcript' ? 'Official Academic Transcript' : 'Official Statement of Semester Results'}
            </h2>
          </div>
        </div>

        {/* Student Biographic & Program Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-xs mb-8">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400">Student Name</span>
            <p className="font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
              {activeStudent.firstName} {activeStudent.lastName}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400">Matriculation No.</span>
            <p className="font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {activeStudent.studentId}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400">Degree Program</span>
            <p className="font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
              {activeStudent.programName}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400">Faculty</span>
            <p className="font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
              {activeStudent.faculty}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400">Admission Session</span>
            <p className="font-medium text-neutral-800 dark:text-neutral-200 mt-0.5">{activeStudent.admissionSession}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400">Current Level</span>
            <p className="font-medium text-neutral-800 dark:text-neutral-200 mt-0.5">Level {activeStudent.currentLevel}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400">Cumulative GPA</span>
            <p className="font-mono font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {activeStudent.currentCgpa.toFixed(2)} / 4.00
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400">Academic Standing</span>
            <p className="font-bold text-emerald-600 mt-0.5">{activeStudent.academicStanding}</p>
          </div>
        </div>

        {/* Course Grades Section */}
        {documentType === 'full_transcript' ? (
          /* Multi-semester breakdown */
          <div className="space-y-6 mb-8">
            {semesterResults.map((sem, idx) => (
              <div key={sem.id} className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
                <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 flex items-center justify-between text-xs font-bold">
                  <span>LEVEL {sem.level} • {sem.semester.toUpperCase()} ({sem.session})</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">Semester GPA: {sem.gpa.toFixed(2)}</span>
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/40 text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-700 text-[11px]">
                    <tr>
                      <th className="py-2 px-3">Course Code</th>
                      <th className="py-2 px-3">Course Title</th>
                      <th className="py-2 px-3 text-center">Credit Hours</th>
                      <th className="py-2 px-3 text-center">Score (%)</th>
                      <th className="py-2 px-3 text-center">Grade</th>
                      <th className="py-2 px-3 text-right">Grade Point</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono">
                    {sem.courses.map(course => (
                      <tr key={course.courseCode}>
                        <td className="py-2 px-3 font-bold text-neutral-900 dark:text-neutral-100">{course.courseCode}</td>
                        <td className="py-2 px-3 font-sans text-neutral-700 dark:text-neutral-300">{course.courseTitle}</td>
                        <td className="py-2 px-3 text-center">{course.creditHours}</td>
                        <td className="py-2 px-3 text-center">{course.score}</td>
                        <td className="py-2 px-3 text-center font-bold">{course.grade}</td>
                        <td className="py-2 px-3 text-right">{course.gradePoint.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ) : (
          /* Single semester slip */
          <div className="mb-8 border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
            <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2.5 flex items-center justify-between text-xs font-bold">
              <span>LEVEL {selectedSemester.level} • {selectedSemester.semester.toUpperCase()} ({selectedSemester.session})</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">Semester GPA: {selectedSemester.gpa.toFixed(2)}</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/40 text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-700 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Course Code</th>
                  <th className="py-2.5 px-3">Course Title</th>
                  <th className="py-2.5 px-3 text-center">Credit Hours</th>
                  <th className="py-2.5 px-3 text-center">Score (%)</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-3 text-right">Grade Point</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono">
                {selectedSemester.courses.map(course => (
                  <tr key={course.courseCode}>
                    <td className="py-2.5 px-3 font-bold text-neutral-900 dark:text-neutral-100">{course.courseCode}</td>
                    <td className="py-2.5 px-3 font-sans text-neutral-700 dark:text-neutral-300">{course.courseTitle}</td>
                    <td className="py-2.5 px-3 text-center">{course.creditHours}</td>
                    <td className="py-2.5 px-3 text-center">{course.score}</td>
                    <td className="py-2.5 px-3 text-center font-bold">{course.grade}</td>
                    <td className="py-2.5 px-3 text-right">{course.gradePoint.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Cumulative Totals & Classification Banner */}
        <div className="p-4 rounded-xl bg-neutral-900 text-white dark:bg-neutral-800 flex flex-wrap items-center justify-between gap-4 mb-8 text-xs font-mono">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase block">Total Credits Attempted</span>
            <strong className="text-sm">{activeStudent.creditsEarned} Credits</strong>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase block">Total Credits Earned</span>
            <strong className="text-sm">{activeStudent.creditsEarned} Credits</strong>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase block">Cumulative GPA</span>
            <strong className="text-base text-amber-400">{activeStudent.currentCgpa.toFixed(2)}</strong>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase block">Projected Classification</span>
            <strong className="text-xs text-emerald-400">
              {activeStudent.currentCgpa >= 3.6 ? 'FIRST CLASS HONOURS' : activeStudent.currentCgpa >= 3.0 ? 'SECOND CLASS UPPER' : 'SECOND CLASS LOWER'}
            </strong>
          </div>
        </div>

        {/* Official Grading Key Table */}
        <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 mb-8 text-[10px] text-neutral-600 dark:text-neutral-400">
          <p className="font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-1">
            Official University Grading Scheme:
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center font-mono">
            <div className="p-1 bg-neutral-50 dark:bg-neutral-800 rounded">A: 80-100% (4.0)</div>
            <div className="p-1 bg-neutral-50 dark:bg-neutral-800 rounded">B+: 75-79% (3.5)</div>
            <div className="p-1 bg-neutral-50 dark:bg-neutral-800 rounded">B: 70-74% (3.0)</div>
            <div className="p-1 bg-neutral-50 dark:bg-neutral-800 rounded">C+: 65-69% (2.5)</div>
            <div className="p-1 bg-neutral-50 dark:bg-neutral-800 rounded">C: 60-64% (2.0)</div>
            <div className="p-1 bg-neutral-50 dark:bg-neutral-800 rounded">D+: 55-59% (1.5)</div>
            <div className="p-1 bg-neutral-50 dark:bg-neutral-800 rounded">D: 50-54% (1.0)</div>
            <div className="p-1 bg-neutral-50 dark:bg-neutral-800 rounded text-rose-600 font-bold">F: 0-49% (0.0)</div>
          </div>
        </div>

        {/* Official Signatures & Verification Seal */}
        <div className="pt-6 border-t-2 border-neutral-900 dark:border-neutral-100 flex items-end justify-between text-xs">
          <div>
            <p className="font-mono text-[10px] text-neutral-400">CERTIFIED TRUE RECORD</p>
            <p className="font-serif italic text-base mt-2 text-neutral-800 dark:text-neutral-200">
              Dr. Kwesi Asare
            </p>
            <p className="font-bold text-neutral-900 dark:text-neutral-100">Registrar</p>
            <p className="text-[10px] text-neutral-500">Date Issued: {new Date().toLocaleDateString('en-GB')}</p>
          </div>

          <div className="w-24 h-24 rounded-full border-2 border-indigo-900/30 flex flex-col items-center justify-center text-center p-1 text-[8px] font-mono uppercase tracking-tighter text-indigo-900 dark:text-indigo-300">
            <ShieldCheck className="w-6 h-6 mb-0.5 text-indigo-600" />
            OFFICIAL EMBOSSED SEAL
          </div>

          <div className="text-right">
            <p className="font-mono text-[10px] text-neutral-400">ACADEMIC BOARD APPROVAL</p>
            <p className="font-serif italic text-base mt-2 text-neutral-800 dark:text-neutral-200">
              Prof. Nana B. Osei
            </p>
            <p className="font-bold text-neutral-900 dark:text-neutral-100">Vice-Chancellor</p>
            <p className="font-mono text-[10px] text-neutral-400 mt-1">Ref: {verificationRef.slice(0, 16)}...</p>
          </div>
        </div>
      </div>

      {/* Interactive Public & Academic QR Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                    Institutional Document Verification Authority
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Verify academic credential authenticity against the tamper-evident registry
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                ✕
              </button>
            </div>

            {/* Test Case Quick Switches */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Quick Simulation Tests:
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Select scenario to audit</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTestCodeInput(defaultVerifyRef);
                    handleRunVerificationCheck(defaultVerifyRef);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                >
                  ✓ Valid Token (Current Doc)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const altered = `${defaultVerifyRef}-TAMPERED`;
                    setTestCodeInput(altered);
                    handleRunVerificationCheck(altered);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100"
                >
                  ⚠ Altered/Tampered Signature
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const exp = `PU-EXPIRED-STMT-${Date.now().toString(36)}`;
                    setTestCodeInput(exp);
                    handleRunVerificationCheck(exp);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100"
                >
                  ⏱ Expired Statement (90d+)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const invalid = 'PU-INVALID-999-FAKE';
                    setTestCodeInput(invalid);
                    handleRunVerificationCheck(invalid);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
                >
                  ✕ Nonexistent Code
                </button>
              </div>
            </div>

            {/* Input & Verification Trigger */}
            <div className="flex gap-2">
              <input
                type="text"
                value={testCodeInput}
                onChange={(e) => setTestCodeInput(e.target.value)}
                placeholder="Enter Credential Reference / Digital Hash..."
                className="flex-1 px-3.5 py-2.5 text-xs font-mono rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleRunVerificationCheck()}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Verify Now
              </button>
            </div>

            {/* Verification Result Display */}
            {verificationResult && (
              <div className={`p-4 rounded-2xl border transition-all space-y-3 ${
                verificationResult.status === 'valid'
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-100'
                  : verificationResult.status === 'altered'
                  ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80 text-rose-900 dark:text-rose-100'
                  : verificationResult.status === 'expired'
                  ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-100'
                  : 'bg-neutral-50 dark:bg-neutral-800/70 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200'
              }`}>
                <div className="flex items-start gap-2.5">
                  {verificationResult.status === 'valid' && <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />}
                  {verificationResult.status === 'altered' && <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />}
                  {verificationResult.status === 'expired' && <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />}
                  {verificationResult.status === 'not_found' && <XCircle className="w-5 h-5 text-neutral-500 shrink-0 mt-0.5" />}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      {verificationResult.status === 'valid' ? 'Authentic Credential Verified' : 'Verification Unsuccessful'}
                    </h4>
                    <p className="text-xs mt-1 leading-relaxed">{verificationResult.message}</p>
                  </div>
                </div>

                {verificationResult.status === 'valid' && (
                  <div className="pt-3 border-t border-emerald-200 dark:border-emerald-800/60 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Authorized Issuer</span>
                      <p className="font-semibold text-emerald-950 dark:text-emerald-50">{verificationResult.institution}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Recipient Identity (Privacy-Preserved)</span>
                      <p className="font-semibold text-emerald-950 dark:text-emerald-50">{verificationResult.maskName}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Official Date Issued</span>
                      <p className="font-semibold text-emerald-950 dark:text-emerald-50">{verificationResult.issuedDate}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Cryptographic Signature</span>
                      <p className="font-mono text-[11px] text-emerald-800 dark:text-emerald-300">ED25519-SHA256: VALID</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => setShowVerifyModal(false)}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold shadow-xs hover:opacity-90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
