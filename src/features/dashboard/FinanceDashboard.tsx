import React from 'react';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  ArrowUpRight,
  ShieldCheck,
  Building,
  Wallet,
  PieChart
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { AnimatedCounter } from '../../components/shared/AnimatedCounter';

interface FinanceDashboardProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ onNavigate }) => {
  const { students, settings, financialLedgers, recordPayment } = useSchool();
  const { showToast } = useToast();

  // Real dynamic financial state computed strictly from student ledgers
  const allLedgers = React.useMemo(() => {
    return students.map(st => {
      const ledger = financialLedgers[st.studentId] || financialLedgers[st.id] || {
        studentId: st.studentId,
        totalBilled: st.currentLevel === '100' ? 4500 : st.currentLevel === '200' ? 5000 : 5800,
        totalPaid: 0,
        balance: st.currentLevel === '100' ? 4500 : st.currentLevel === '200' ? 5000 : 5800,
        isCleared: false,
        transactions: []
      };
      return { student: st, ledger };
    });
  }, [students, financialLedgers]);

  const totalTuitionReceivable = allLedgers.reduce((acc, item) => acc + item.ledger.totalBilled, 0);
  const totalCollected = allLedgers.reduce((acc, item) => acc + item.ledger.totalPaid, 0);
  const outstandingDebt = allLedgers.reduce((acc, item) => acc + item.ledger.balance, 0);
  const collectionRate = totalTuitionReceivable > 0 ? Math.min(100, Math.round((totalCollected / totalTuitionReceivable) * 100)) : 100;

  // Real students with outstanding debt
  const debtorStudents = allLedgers.filter(item => item.ledger.balance > 0);

  const handleApprovePayment = (studentMatric: string, studentName: string, amount: number, ref: string) => {
    recordPayment({
      studentId: studentMatric,
      studentName,
      matricNo: studentMatric,
      amount,
      description: 'Bursary Direct Bank / MoMo Settlement',
      gateway: 'bank_transfer',
      reference: ref
    });
    showToast(`Payment ${ref} reconciled! GHS ${amount.toLocaleString()} credited to ${studentName}.`, 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600/10 via-indigo-600/10 to-transparent border border-emerald-500/20 dark:border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-bold tracking-wider uppercase text-emerald-700 dark:text-emerald-300 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Bursary & Financial Directorate</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 font-display">
            Financial Ledger & Revenue Operations
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
            Live tuition fee tracking, payment reconciliation, and student debt audits across {students.length} active university matriculants.
          </p>
        </div>

        <button
          onClick={() => onNavigate('finance')}
          className="self-start sm:self-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          <span>Access Bursary Terminal</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all card-hover">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Total Billed</span>
            <span className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1 text-2xl sm:text-3xl font-black font-mono text-neutral-900 dark:text-neutral-50">
            <span className="text-sm font-sans font-bold text-neutral-400">{settings.currency || 'GHS'}</span>
            <AnimatedCounter value={totalTuitionReceivable} />
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2">Annual gross tuition fees</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-all card-hover">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Total Collected</span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1 text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            <span className="text-sm font-sans font-bold text-emerald-400/80">{settings.currency || 'GHS'}</span>
            <AnimatedCounter value={totalCollected} />
          </div>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-2 font-medium">Reconciled bank & mobile money</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all card-hover">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Collection Rate</span>
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <PieChart className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1 text-2xl sm:text-3xl font-black font-mono text-indigo-600 dark:text-indigo-400">
            <AnimatedCounter value={collectionRate} />
            <span className="text-lg font-sans font-bold">%</span>
          </div>
          <p className="text-[11px] text-indigo-600/80 dark:text-indigo-400/80 mt-2 font-medium">Target threshold: 85%</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-800 transition-all card-hover">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Outstanding Receivables</span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1 text-2xl sm:text-3xl font-black font-mono text-amber-600 dark:text-amber-400">
            <span className="text-sm font-sans font-bold text-amber-400/80">{settings.currency || 'GHS'}</span>
            <AnimatedCounter value={outstandingDebt} />
          </div>
          <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-2 font-medium">{debtorStudents.length} student debtors</p>
        </div>
      </div>

      {/* Debtors and Pending Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Active Student Debtors & Payment Reconciliation
            </h3>
            <span className="text-xs text-neutral-400">{debtorStudents.length} Students with Balance</span>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">

            {/* Mobile: Debtor Cards */}
            <div className="block md:hidden divide-y divide-neutral-100 dark:divide-neutral-800">
              {debtorStudents.length === 0 ? (
                <div className="py-6 text-center text-xs text-neutral-400">
                  All students have 100% tuition clearance!
                </div>
              ) : (
                debtorStudents.map(({ student, ledger }) => (
                  <div key={student.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-[11px] font-mono text-neutral-400">{student.studentId}</p>
                        <p className="text-[11px] text-neutral-500 truncate mt-0.5">{student.programName} · L{student.currentLevel}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-mono font-bold text-amber-600 dark:text-amber-400">
                          {settings.currency || 'GHS'} {ledger.balance.toLocaleString()}
                        </p>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                          {ledger.totalPaid > 0 ? 'PARTIAL' : 'UNPAID'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleApprovePayment(student.studentId, `${student.firstName} ${student.lastName}`, ledger.balance, `BANK-RECON-${Date.now().toString().slice(-6)}`)}
                      className="w-full min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Clear — {settings.currency || 'GHS'} {ledger.balance.toLocaleString()}
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Desktop: Full Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Program &amp; Level</th>
                    <th className="py-3 px-4">Outstanding</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {debtorStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-xs text-neutral-400">
                        All enrolled students have 100% tuition clearance! No outstanding debtors.
                      </td>
                    </tr>
                  ) : (
                    debtorStudents.map(({ student, ledger }) => (
                      <tr key={student.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                        <td className="py-3 px-4 font-bold text-neutral-900 dark:text-neutral-100">
                          {student.firstName} {student.lastName} ({student.studentId})
                        </td>
                        <td className="py-3 px-4 text-neutral-500">
                          {student.programName} · L{student.currentLevel}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-600">
                          {settings.currency || 'GHS'} {ledger.balance.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                            {ledger.totalPaid > 0 ? 'PARTIAL PAYMENT' : 'UNPAID'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleApprovePayment(student.studentId, `${student.firstName} ${student.lastName}`, ledger.balance, `BANK-RECON-${Date.now().toString().slice(-6)}`)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] cursor-pointer"
                          >
                            Clear Balance
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-600" />
            Bursary Directives
          </h3>
          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3 text-xs">
            <button
              onClick={() => onNavigate('finance')}
              className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-left font-bold flex items-center justify-between hover:bg-neutral-100"
            >
              <span>Audit All Student Ledgers</span>
              <ArrowUpRight className="w-4 h-4 text-neutral-400" />
            </button>
            <button
              onClick={() => onNavigate('graduation')}
              className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-left font-bold flex items-center justify-between hover:bg-neutral-100"
            >
              <span>Degree Clearance Sign-off</span>
              <ArrowUpRight className="w-4 h-4 text-neutral-400" />
            </button>
            <button
              onClick={() => onNavigate('reports')}
              className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-left font-bold flex items-center justify-between hover:bg-neutral-100"
            >
              <span>Financial Audit Reports</span>
              <ArrowUpRight className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
