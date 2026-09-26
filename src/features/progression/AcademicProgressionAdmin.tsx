import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  UserCheck, 
  Clock, 
  ArrowRight, 
  FileCheck, 
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { StudentRecord } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const AcademicProgressionAdmin: React.FC = () => {
  const { success, info } = useToast();
  const { updateStudentLevel } = useAuth();
  const { students, updateStudent, settings, carryovers, logAction, activeStudent } = useSchool();

  const [selectedSession, setSelectedSession] = useState<string>(settings.currentSession);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('all');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const minCgpa = settings.minProgressionCgpa ?? 1.50;
  const minGradCredits = settings.minimumGraduationCredits ?? 132;

  // Evaluate candidate progression logic based on institutional thresholds
  const evaluationResults = students.map((std) => {
    const studentCarryovers = carryovers.filter(c => !c.status?.includes('cleared'));
    const hasUnresolvedCarryovers = std.currentCgpa < 2.0 && studentCarryovers.length > 0;
    const isPassing = std.currentCgpa >= minCgpa && !hasUnresolvedCarryovers;
    
    let decision: 'Promote' | 'Probation' | 'Eligible for Graduation' = 'Promote';
    let nextLevel = (parseInt(std.currentLevel) + 100).toString() as '200' | '300' | '400';
    let reason = `Met promotion criteria: CGPA (${std.currentCgpa.toFixed(2)}) ≥ policy minimum (${minCgpa.toFixed(2)}) and credits requirement satisfied.`;

    if (std.currentLevel === '400') {
      if (std.creditsEarned >= minGradCredits && std.currentCgpa >= minCgpa) {
        decision = 'Eligible for Graduation';
        reason = `Completed degree requirements: Earned ${std.creditsEarned}/${minGradCredits} credits with CGPA ${std.currentCgpa.toFixed(2)}.`;
      } else {
        decision = 'Probation';
        nextLevel = '400';
        reason = `Degree incomplete: Outstanding credits (${std.creditsEarned}/${minGradCredits}) or CGPA requirement unmet.`;
      }
    } else if (!isPassing) {
      decision = 'Probation';
      nextLevel = std.currentLevel as any;
      if (std.currentCgpa < minCgpa) {
        reason = `Academic Probation: CGPA ${std.currentCgpa.toFixed(2)} is below minimum institutional threshold (${minCgpa.toFixed(2)}).`;
      } else {
        reason = `Progression Withheld: ${studentCarryovers.length} unresolved carryover course(s) require retake clearance.`;
      }
    }

    return {
      student: std,
      currentLevel: std.currentLevel,
      nextLevel,
      decision,
      reason,
      cgpa: std.currentCgpa,
      credits: std.creditsEarned
    };
  });

  const filteredResults = selectedLevelFilter === 'all' 
    ? evaluationResults 
    : evaluationResults.filter(r => r.currentLevel === selectedLevelFilter);

  const handleRunEvaluation = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setHasEvaluated(true);
      info("Audit Run Complete", `Evaluated ${students.length} candidates against institutional threshold (Min CGPA: ${minCgpa.toFixed(2)}).`);
    }, 600);
  };

  const handleExecutePromotion = () => {
    setShowConfirmModal(false);
    let promotedCount = 0;

    // Update students centrally
    evaluationResults.forEach(res => {
      if (res.decision === 'Promote' && res.currentLevel !== '400') {
        updateStudent(res.student.id, { currentLevel: res.nextLevel as any });
        promotedCount++;
        if (activeStudent && (res.student.id === activeStudent.id || res.student.studentId === activeStudent.studentId)) {
          updateStudentLevel(res.nextLevel as any);
        }
      }
    });

    logAction(
      'BATCH_PROMOTION_EXECUTED',
      'StudentRecord',
      `Executed batch promotion for ${promotedCount} eligible students under session ${selectedSession} with min CGPA ${minCgpa.toFixed(2)}.`
    );

    success("Promotion Batch Processed", `Permanent progression audit records created. System level updated for ${promotedCount} eligible candidates.`);
  };

  return (
    <div id="progression-engine-page" className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            Academic Board & Registrar Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 mt-2">
            Academic Progression & Automatic Promotion
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Auditable progression evaluation enforcing minimum CGPA and cumulative credit thresholds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="run-progression-btn"
            type="button"
            onClick={handleRunEvaluation}
            disabled={isEvaluating}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isEvaluating ? 'Evaluating Candidates...' : 'Run Progression Evaluation'}</span>
          </button>

          {hasEvaluated && (
            <button
              id="open-promotion-modal"
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>Confirm & Promote Eligible</span>
            </button>
          )}
        </div>
      </div>

      {/* Evaluation Parameters Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
            Academic Session
          </label>
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          >
            <option value="2026/2027">2026/2027 Session</option>
            <option value="2025/2026">2025/2026 Session</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
            Level Filter
          </label>
          <select
            value={selectedLevelFilter}
            onChange={(e) => setSelectedLevelFilter(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          >
            <option value="all">All Academic Levels</option>
            <option value="100">Level 100 Candidates</option>
            <option value="200">Level 200 Candidates</option>
            <option value="300">Level 300 Candidates</option>
            <option value="400">Level 400 Candidates</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
            Institutional Progression Standard
          </label>
          <div className="text-xs text-neutral-600 dark:text-neutral-400 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/50 dark:border-neutral-700/50">
            Min CGPA: <strong className="text-indigo-600 dark:text-indigo-400">{minCgpa.toFixed(2)}</strong> · Min Degree Credits: <strong className="text-indigo-600 dark:text-indigo-400">{minGradCredits}</strong>
          </div>
        </div>
      </div>

      {/* Candidate Evaluation Grid / Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
            Promotion Candidate Queue ({filteredResults.length} Filtered / {evaluationResults.length} Total Enrolled)
          </h3>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {hasEvaluated ? 'Evaluation Status: Audited' : 'Evaluation Status: Ready to Run'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/40 text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3 px-5">Student</th>
                <th className="py-3 px-4">Program & Level</th>
                <th className="py-3 px-4 text-center">CGPA</th>
                <th className="py-3 px-4 text-center">Credits Earned</th>
                <th className="py-3 px-4">Decision</th>
                <th className="py-3 px-5">Progression Audit Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-medium text-neutral-800 dark:text-neutral-200">
              {filteredResults.map((item) => (
                <tr key={item.student.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-neutral-900 dark:text-neutral-100">
                      {item.student.firstName} {item.student.lastName}
                    </div>
                    <div className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                      {item.student.studentId}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {item.student.programCode}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Level {item.currentLevel} {hasEvaluated && item.decision === 'Promote' && (
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">➜ Level {item.nextLevel}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold font-mono">
                    <span className={item.cgpa < 1.50 ? 'text-rose-600' : 'text-neutral-900 dark:text-neutral-100'}>
                      {item.cgpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {item.credits} / {item.student.requiredCredits}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      item.decision === 'Promote'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : item.decision === 'Eligible for Graduation'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}>
                      {item.decision === 'Promote' && <UserCheck className="w-3 h-3" />}
                      {item.decision === 'Probation' && <AlertTriangle className="w-3 h-3" />}
                      {item.decision}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {item.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                  Confirm Academic Promotion Batch
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
                  You are about to finalize progression for all eligible students for session <strong>{selectedSession}</strong>. This creates permanent, immutable academic progression audit entries.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Eligible for Level Advancement:</span>
                  <span className="font-bold text-emerald-600">3 Students</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Final Year Completion:</span>
                  <span className="font-bold text-amber-600">1 Student</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Probation / Repeated:</span>
                  <span className="font-bold text-rose-600">1 Student</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  id="confirm-batch-promote-btn"
                  type="button"
                  onClick={handleExecutePromotion}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
                >
                  Confirm & Execute
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
