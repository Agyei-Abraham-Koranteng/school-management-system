import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Printer, 
  ShieldCheck, 
  Sparkles, 
  GraduationCap, 
  FileCheck,
  Search,
  School,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { GraduationCandidate } from '../../types';
import { QrCode } from '../../components/shared/QrCode';

export const GraduationManagementView: React.FC = () => {
  const { graduationCandidates, updateGraduationStatus, settings, logAction } = useSchool();
  const { showToast } = useToast();

  const [selectedCandidate, setSelectedCandidate] = useState<GraduationCandidate | null>(null);
  const [viewCertificateCandidate, setViewCertificateCandidate] = useState<GraduationCandidate | null>(null);
  const [viewDeficitCandidate, setViewDeficitCandidate] = useState<GraduationCandidate | null>(null);

  const handleApproveGraduation = (candidate: GraduationCandidate) => {
    updateGraduationStatus(candidate.id, 'graduated');
    logAction(
      'DEGREE_CONFERRED',
      'GraduationCandidate',
      `Official degree conferred to ${candidate.studentName} (${candidate.matricNo}), Class of Honours: ${candidate.classification}, CGPA: ${candidate.cgpa.toFixed(2)}.`
    );
    showToast(`Degree officially conferred to ${candidate.studentName}! Certificate issued.`, 'success');
    setSelectedCandidate(null);
  };

  const isFullyCleared = (c: GraduationCandidate) => {
    return c.creditsCleared && c.coreCoursesCleared && c.carryoversCleared && c.financialClearance && c.projectDefenseCleared;
  };

  const getDeficits = (c: GraduationCandidate) => {
    const deficits: string[] = [];
    if (!c.creditsCleared) {
      deficits.push(`Credit Shortfall: Earned ${c.creditsEarned} of ${c.requiredCredits} required credits (${c.requiredCredits - c.creditsEarned} credits remaining).`);
    }
    if (!c.coreCoursesCleared) {
      deficits.push(`Core Curriculum Deficiency: Required Level 400 departmental core courses pending final examination clearance.`);
    }
    if (!c.carryoversCleared) {
      deficits.push(`Unresolved Carryovers: Student possesses uncleared retake course registrations.`);
    }
    if (!c.projectDefenseCleared) {
      deficits.push(`Capstone Project Defense: Final undergraduate research dissertation defense score not yet submitted to the Academic Board.`);
    }
    if (!c.financialClearance) {
      deficits.push(`Bursary Clearance Hold: Outstanding institutional tuition or accommodation ledger fees require settlement.`);
    }
    return deficits;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Graduation & Degree Clearance Directorate
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Conduct 5-point academic & financial degree audits, compute honours classifications, and issue official graduation certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
            Min Graduation Credits: <strong className="text-indigo-600 dark:text-indigo-400">{settings.minimumGraduationCredits} Cr</strong>
          </div>
        </div>
      </div>

      {/* Graduation Candidates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {graduationCandidates.map(cand => {
          const cleared = isFullyCleared(cand);
          return (
            <div 
              key={cand.id}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{cand.studentName}</h3>
                    <p className="text-xs font-mono text-neutral-400">{cand.matricNo}</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{cand.programName}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    cand.status === 'graduated'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      : cand.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {cand.status.toUpperCase()}
                  </span>
                </div>

                <div className="p-3 my-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50 text-xs flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-neutral-400 uppercase font-bold">Final CGPA</p>
                    <p className="text-base font-black font-mono text-indigo-600 dark:text-indigo-400">
                      {cand.cgpa.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-neutral-400 uppercase font-bold">Classification</p>
                    <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{cand.classification}</p>
                  </div>
                </div>

                {/* 5-Point Clearance Audit Checklist */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">1. Credits Requirement ({cand.creditsEarned}/{cand.requiredCredits})</span>
                    {cand.creditsCleared ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">2. Core Curriculum Courses</span>
                    {cand.coreCoursesCleared ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">3. Outstanding Carryovers (0)</span>
                    {cand.carryoversCleared ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">4. Capstone Defense (Passed)</span>
                    {cand.projectDefenseCleared ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">5. Bursary Financial Balance (0)</span>
                    {cand.financialClearance ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                {cand.status === 'graduated' ? (
                  <button
                    onClick={() => setViewCertificateCandidate(cand)}
                    className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Award className="w-4 h-4" />
                    View Degree Certificate
                  </button>
                ) : (
                  <div className="w-full space-y-2">
                    {cleared ? (
                      <button
                        onClick={() => handleApproveGraduation(cand)}
                        className="w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                      >
                        <GraduationCap className="w-4 h-4" />
                        Confer Degree & Issue Certificate
                      </button>
                    ) : (
                      <button
                        onClick={() => setViewDeficitCandidate(cand)}
                        className="w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 transition-colors"
                      >
                        <AlertCircle className="w-4 h-4" />
                        Clearance Incomplete · Audit Deficits
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Clearance Deficit Modal */}
      {viewDeficitCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded-md">
                  Clearance Audit Deficiency Report
                </span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {viewDeficitCandidate.studentName}
                </h3>
                <p className="text-xs text-neutral-500 font-mono">
                  {viewDeficitCandidate.matricNo} · {viewDeficitCandidate.programName}
                </p>
              </div>
              <button
                onClick={() => setViewDeficitCandidate(null)}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Outstanding Degree Clearances ({getDeficits(viewDeficitCandidate).length})
              </h4>
              <div className="space-y-2">
                {getDeficits(viewDeficitCandidate).map((deficit, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-900 dark:text-rose-200"
                  >
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{deficit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/50 dark:border-neutral-700/50 text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
              <p className="font-bold text-neutral-900 dark:text-neutral-200">Required Administrative Action:</p>
              <p>The candidate has been notified via their institutional portal. Clearances must be resolved before the Senate Academic Board convocation deadline.</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setViewDeficitCandidate(null)}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold shadow-xs hover:opacity-90"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Certificate Presentation Modal */}
      {viewCertificateCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-4 border-amber-400/40 p-10 text-neutral-900 relative space-y-6 print:border-none print:shadow-none print:p-0">
            {/* Certificate Header */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-indigo-950 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-md">
                PU
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-wider uppercase text-neutral-900">
                {settings.institutionName}
              </h2>
              <p className="text-xs font-serif italic text-neutral-600">
                By authority of the University Council and the Academic Board
              </p>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-4 py-4">
              <p className="text-xs font-serif uppercase tracking-widest text-neutral-500">
                Be it known that
              </p>
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-indigo-950 underline decoration-amber-400/60 underline-offset-8">
                {viewCertificateCandidate.studentName}
              </h3>
              <p className="text-xs font-serif text-neutral-600 max-w-lg mx-auto leading-relaxed">
                having completed the prescribed course of study and fulfilled all academic and statutory conditions has been admitted to the degree of
              </p>
              <h4 className="text-xl font-serif font-bold text-neutral-900 uppercase tracking-wide">
                {viewCertificateCandidate.programName}
              </h4>
              <p className="text-sm font-serif font-semibold text-amber-800">
                with {viewCertificateCandidate.classification}
              </p>
            </div>

            {/* Certificate Footer */}
            <div className="pt-8 border-t border-neutral-300 flex items-end justify-between text-xs">
              <div className="text-center">
                <p className="font-serif italic text-sm">Prof. Nana B. Osei</p>
                <div className="w-36 h-0.5 bg-neutral-800 mx-auto my-1" />
                <p className="font-bold text-[10px] uppercase tracking-wider text-neutral-600">Vice-Chancellor</p>
              </div>

              {/* Gold Crest */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full border-4 border-amber-400 bg-amber-50 flex flex-col items-center justify-center shadow-inner mx-auto text-[8px] font-mono font-bold text-amber-800 uppercase">
                  <ShieldCheck className="w-7 h-7 text-amber-600 mb-0.5" />
                  SEAL OF COUNCIL
                </div>
                <p className="text-[9px] font-mono text-neutral-400 mt-2 font-bold">
                  {viewCertificateCandidate.certificateNumber}
                </p>
              </div>

              <div className="text-center">
                <p className="font-serif italic text-sm">Dr. Kwesi Asare</p>
                <div className="w-36 h-0.5 bg-neutral-800 mx-auto my-1" />
                <p className="font-bold text-[10px] uppercase tracking-wider text-neutral-600">Registrar</p>
              </div>
            </div>

            {/* Actions for Modal */}
            <div className="print:hidden pt-4 flex justify-between items-center border-t border-neutral-100">
              <button
                onClick={() => setViewCertificateCandidate(null)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
              >
                Close Preview
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
