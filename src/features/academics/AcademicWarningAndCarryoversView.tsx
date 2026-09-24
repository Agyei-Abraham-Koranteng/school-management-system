import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Repeat, 
  ShieldAlert, 
  CheckCircle, 
  Plus, 
  Search, 
  FileWarning, 
  TrendingUp,
  User,
  BookOpen
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { AcademicWarning, WarningSeverity } from '../../types';

export const AcademicWarningAndCarryoversView: React.FC = () => {
  const { 
    academicWarnings, 
    issueWarning, 
    resolveWarning, 
    carryovers, 
    courseAttempts, 
    students 
  } = useSchool();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'warnings' | 'carryovers' | 'attempts'>('warnings');
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for new warning
  const [warningForm, setWarningForm] = useState({
    studentId: students[0]?.id || '',
    severity: 'moderate' as WarningSeverity,
    reason: '',
    remediationPlan: ''
  });

  const handleIssueWarning = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === warningForm.studentId);
    if (!student) return;

    issueWarning({
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      matricNo: student.studentId,
      program: student.programName,
      level: student.currentLevel,
      cgpa: student.currentCgpa,
      currentCgpa: student.currentCgpa,
      failedCoursesCount: 1,
      severity: warningForm.severity,
      reason: warningForm.reason,
      sessionIssued: "2025/2026",
      semesterIssued: "First Semester",
      remediationPlan: warningForm.remediationPlan
    });

    showToast(`Official academic warning issued to ${student.firstName} ${student.lastName}`, 'success');
    setIsWarningModalOpen(false);
    setWarningForm({
      studentId: students[0]?.id || '',
      severity: 'moderate',
      reason: '',
      remediationPlan: ''
    });
  };

  const handleResolveWarning = (id: string) => {
    resolveWarning(id);
    showToast('Academic warning marked resolved following remediation.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            Academic Standing, Carryovers & Retakes
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Monitor students on academic probation, audit failed course carryovers, and track grade replacement attempts.
          </p>
        </div>

        <button
          onClick={() => setIsWarningModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Issue Academic Warning
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('warnings')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'warnings'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <FileWarning className="w-4 h-4" /> Academic Warnings & Probation ({academicWarnings.length})
        </button>
        <button
          onClick={() => setActiveTab('carryovers')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'carryovers'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" /> Carryover Course Audits ({carryovers.length})
        </button>
        <button
          onClick={() => setActiveTab('attempts')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'attempts'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Retake & Grade Recovery Log ({courseAttempts.length})
        </button>
      </div>

      {/* TAB 1: ACADEMIC WARNINGS */}
      {activeTab === 'warnings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {academicWarnings.map(w => (
              <div 
                key={w.id}
                className={`p-5 rounded-2xl bg-white dark:bg-neutral-900 border shadow-2xs space-y-3 ${
                  w.status === 'resolved' 
                    ? 'border-neutral-200 dark:border-neutral-800 opacity-75'
                    : w.severity === 'critical'
                    ? 'border-rose-300 dark:border-rose-900/60'
                    : 'border-amber-300 dark:border-amber-900/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        w.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : w.severity === 'moderate'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {w.severity} WARNING
                      </span>
                      {w.status === 'resolved' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          RESOLVED
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-2">
                      {w.studentName}
                    </h3>
                    <p className="text-[11px] font-mono text-neutral-400">
                      {w.matricNo} • CGPA: {w.currentCgpa.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">Issued: {w.issuedDate}</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 text-xs space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">Reason for Warning:</span>
                    <p className="text-neutral-800 dark:text-neutral-200 mt-0.5">{w.reason}</p>
                  </div>
                  {w.remediationPlan && (
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Mandatory Remediation Plan:</span>
                      <p className="text-indigo-600 dark:text-indigo-400 mt-0.5">{w.remediationPlan}</p>
                    </div>
                  )}
                </div>

                {w.status === 'active' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleResolveWarning(w.id)}
                      className="px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Mark Remediation Resolved
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CARRYOVERS */}
      {activeTab === 'carryovers' && (
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 font-semibold border-b border-neutral-200/80 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Course Code & Title</th>
                  <th className="py-3 px-4">Credits</th>
                  <th className="py-3 px-4">Semester Failed</th>
                  <th className="py-3 px-4">Failed Score</th>
                  <th className="py-3 px-4">Prerequisite Block</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                {carryovers.map(item => (
                  <tr key={item.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-rose-600 dark:text-rose-400">{item.courseCode}</p>
                      <p className="text-[11px] text-neutral-500">{item.courseTitle}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">{item.creditHours}</td>
                    <td className="py-3.5 px-4">Level {item.level} ({item.semesterFailed})</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-600">{item.failedScore}% (Grade {item.failedGrade})</td>
                    <td className="py-3.5 px-4">
                      {item.prerequisiteFor ? (
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Blocks {item.prerequisiteFor}
                        </span>
                      ) : (
                        <span className="text-neutral-400">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RETAKE ATTEMPTS */}
      {activeTab === 'attempts' && (
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 font-semibold border-b border-neutral-200/80 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">First Attempt (Failed)</th>
                  <th className="py-3 px-4">Second Attempt (Retake)</th>
                  <th className="py-3 px-4">Grade Recovery</th>
                  <th className="py-3 px-4">CGPA Effect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                {courseAttempts.map(att => (
                  <tr key={att.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {att.courseCode}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-rose-600">
                      Attempt 1 ({att.firstAttemptSession}): {att.firstAttemptScore}% [{att.firstAttemptGrade}]
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-600 font-bold">
                      Attempt 2 ({att.secondAttemptSession}): {att.secondAttemptScore}% [{att.secondAttemptGrade}]
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        +{att.secondAttemptScore - att.firstAttemptScore}% GAIN
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-600">
                      Successfully cleared & updated into CGPA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Issue Warning Modal */}
      {isWarningModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">Issue Academic Warning</h3>
            <form onSubmit={handleIssueWarning} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Target Student</label>
                <select
                  value={warningForm.studentId}
                  onChange={(e) => setWarningForm({ ...warningForm, studentId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.studentId}) - CGPA: {s.currentCgpa.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Severity Level</label>
                <select
                  value={warningForm.severity}
                  onChange={(e) => setWarningForm({ ...warningForm, severity: e.target.value as WarningSeverity })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                >
                  <option value="advisory">Advisory Notice (CGPA 1.50 - 1.99)</option>
                  <option value="moderate">Moderate Warning (Probation Risk)</option>
                  <option value="critical">Critical Warning (Imminent Withdrawal)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Registry Reason / Grounds</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Cumulative Grade Point Average fell below 1.50 minimum progression benchmark..."
                  value={warningForm.reason}
                  onChange={(e) => setWarningForm({ ...warningForm, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Required Remediation Plan</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Mandatory attendance at Academic Support Center and bi-weekly tutoring..."
                  value={warningForm.remediationPlan}
                  onChange={(e) => setWarningForm({ ...warningForm, remediationPlan: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
                <button type="button" onClick={() => setIsWarningModalOpen(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-amber-600 text-white font-semibold rounded-xl">Issue Warning Notice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
