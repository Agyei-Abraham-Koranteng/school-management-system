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
  Building
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';

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
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-transparent border border-emerald-200/60 dark:border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 font-mono">
            Bursary & Financial Directorate
          </span>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mt-1">
            Financial Ledger & Revenue Operations
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Live tuition fee tracking, payment reconciliation, student debt audits ({students.length} Total Matriculants).
          </p>
        </div>

        <button
          onClick={() => onNavigate('finance')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          Access Bursary Terminal
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Total Billed</p>
          <p className="text-2xl font-black font-mono text-neutral-900 dark:text-neutral-100 mt-1">
            {settings.currency || 'GHS'} {totalTuitionReceivable.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Total Collected</p>
          <p className="text-2xl font-black font-mono text-emerald-600 mt-1">
            {settings.currency || 'GHS'} {totalCollected.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Collection Rate</p>
          <p className="text-2xl font-black font-mono text-indigo-600 mt-1">{collectionRate}%</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Outstanding Receivables</p>
          <p className="text-2xl font-black font-mono text-amber-600 mt-1">
            {settings.currency || 'GHS'} {outstandingDebt.toLocaleString()}
          </p>
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
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Program & Level</th>
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
