import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Filter, 
  Users, 
  GraduationCap, 
  DollarSign, 
  BookOpen, 
  Calendar,
  PieChart,
  FileSpreadsheet
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';

export const ReportsView: React.FC = () => {
  const { students, courses, faculties, settings, applications, graduationCandidates, financialLedgers } = useSchool();
  const { showToast } = useToast();

  const [reportType, setReportType] = useState<'enrollment' | 'performance' | 'courses' | 'finance'>('enrollment');
  const [levelFilter, setLevelFilter] = useState('all');

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
      return ledger;
    });
  }, [students, financialLedgers]);

  // Calculations
  const totalStudents = students.length;
  const level100Count = students.filter(s => s.currentLevel === '100').length;
  const level200Count = students.filter(s => s.currentLevel === '200').length;
  const level300Count = students.filter(s => s.currentLevel === '300').length;
  const level400Count = students.filter(s => s.currentLevel === '400').length;

  const firstClassCount = students.filter(s => s.currentCgpa >= 3.60).length;
  const secondUpperCount = students.filter(s => s.currentCgpa >= 3.00 && s.currentCgpa < 3.60).length;
  const secondLowerCount = students.filter(s => s.currentCgpa >= 2.50 && s.currentCgpa < 3.00).length;
  const probationCount = students.filter(s => s.currentCgpa < 1.50).length;

  const avgCgpa = (students.reduce((acc, s) => acc + s.currentCgpa, 0) / (students.length || 1)).toFixed(2);

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (reportType === 'enrollment' || reportType === 'performance') {
      csvContent += "Student ID,First Name,Last Name,Program,Faculty,Level,CGPA,Standing\n";
      students.forEach(s => {
        csvContent += `${s.studentId},${s.firstName},${s.lastName},${s.programName},${s.faculty},${s.currentLevel},${s.currentCgpa},${s.academicStanding}\n`;
      });
    } else if (reportType === 'courses') {
      csvContent += "Course Code,Title,Credit Hours,Level,Type,Department,Enrolled,Capacity\n";
      courses.forEach(c => {
        csvContent += `${c.code},${c.title},${c.creditHours},${c.level},${c.type},${c.department},${c.enrolledCount},${c.capacity}\n`;
      });
    } else if (reportType === 'finance') {
      csvContent += "Student ID,Student Name,Total Billed,Total Paid,Balance,Clearance Status\n";
      allLedgers.forEach(l => {
        const student = students.find(s => s.studentId === l.studentId);
        const name = student ? `${student.firstName} ${student.lastName}` : l.studentId;
        csvContent += `${l.studentId},${name},${l.totalBilled},${l.totalPaid},${l.balance},${l.isCleared || l.balance <= 0 ? 'CLEARED' : 'UNCLEARED'}\n`;
      });
    } else {
      csvContent += "Metric,Value\n";
      csvContent += `Total Enrolled Students,${totalStudents}\n`;
      csvContent += `Total Faculty,${faculties.length}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Premier_University_${reportType}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${reportType} report to CSV`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Institutional Reporting & Intelligence Center
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Aggregate student metrics, academic standing breakdown, course allocations, and graduation analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl text-xs font-semibold text-neutral-800 dark:text-neutral-200 shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 space-x-6 text-xs font-semibold">
        <button
          onClick={() => setReportType('enrollment')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            reportType === 'enrollment'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Users className="w-4 h-4" /> Student Enrollment Demographics
        </button>
        <button
          onClick={() => setReportType('performance')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            reportType === 'performance'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" /> Academic Performance & CGPA
        </button>
        <button
          onClick={() => setReportType('courses')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            reportType === 'courses'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Curriculum & Course Loads
        </button>
        <button
          onClick={() => setReportType('finance')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            reportType === 'finance'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <DollarSign className="w-4 h-4" /> Bursary & Revenue Audit
        </button>
      </div>

      {/* REPORT CONTENT: ENROLLMENT */}
      {reportType === 'enrollment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Total Enrolled</p>
              <p className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-1">{totalStudents}</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Freshmen (Level 100)</p>
              <p className="text-2xl font-black text-indigo-600 mt-1">{level100Count}</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Mid-Career (200-300)</p>
              <p className="text-2xl font-black text-blue-600 mt-1">{level200Count + level300Count}</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Graduating (Level 400)</p>
              <p className="text-2xl font-black text-purple-600 mt-1">{level400Count}</p>
            </div>
          </div>

          {/* Detailed Student Roster Table */}
          <div className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
            <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-xs">
              <h3 className="font-bold text-neutral-900 dark:text-neutral-100">Enrollment Register by Academic Level</h3>
              <span className="text-neutral-400">Showing all {students.length} students</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Matric No</th>
                  <th className="py-3 px-4">Program & Faculty</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Session</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-4 font-bold text-neutral-900 dark:text-neutral-100">{s.firstName} {s.lastName}</td>
                    <td className="py-3 px-4 font-mono text-neutral-600 dark:text-neutral-400">{s.studentId}</td>
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{s.programName}</td>
                    <td className="py-3 px-4 font-bold">Level {s.currentLevel}</td>
                    <td className="py-3 px-4 font-mono">{s.admissionSession}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {s.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: PERFORMANCE */}
      {reportType === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Institutional Mean CGPA</p>
              <p className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-1">{avgCgpa}</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-500">First Class (≥ 3.60)</p>
              <p className="text-2xl font-black text-amber-500 mt-1">{firstClassCount}</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Second Class Upper</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{secondUpperCount}</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Academic Probation</p>
              <p className="text-2xl font-black text-rose-600 mt-1">{probationCount}</p>
            </div>
          </div>

          {/* Performance Table */}
          <div className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Matric No</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Credits Earned</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4 text-right">Academic Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-4 font-bold text-neutral-900 dark:text-neutral-100">{s.firstName} {s.lastName}</td>
                    <td className="py-3 px-4 font-mono text-neutral-600 dark:text-neutral-400">{s.studentId}</td>
                    <td className="py-3 px-4 font-medium">Level {s.currentLevel}</td>
                    <td className="py-3 px-4 font-mono">{s.creditsEarned} Cr</td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{s.currentCgpa.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        s.currentCgpa >= 3.60 
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : s.currentCgpa >= 1.50
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {s.academicStanding}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: COURSES */}
      {reportType === 'courses' && (
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Credit Hours</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Capacity Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {courses.map(c => (
                <tr key={c.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                  <td className="py-3 px-4 font-bold">
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 mr-2">{c.code}</span>
                    <span>{c.title}</span>
                  </td>
                  <td className="py-3 px-4">Level {c.level}</td>
                  <td className="py-3 px-4 font-mono font-bold">{c.creditHours}</td>
                  <td className="py-3 px-4 uppercase font-bold text-[10px] text-neutral-500">{c.type}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${Math.min(100, (c.enrolledCount / c.capacity) * 100)}%` }} />
                      </div>
                      <span className="font-mono text-[11px] text-neutral-500">{c.enrolledCount} / {c.capacity}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* REPORT CONTENT: FINANCE */}
      {reportType === 'finance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Gross Billed</p>
              <p className="text-2xl font-black font-mono text-neutral-900 dark:text-neutral-100 mt-1">
                {settings.currency || 'GHS'} {allLedgers.reduce((acc, l) => acc + l.totalBilled, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Total Collected</p>
              <p className="text-2xl font-black font-mono text-emerald-600 mt-1">
                {settings.currency || 'GHS'} {allLedgers.reduce((acc, l) => acc + l.totalPaid, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Outstanding Debt</p>
              <p className="text-2xl font-black font-mono text-amber-600 mt-1">
                {settings.currency || 'GHS'} {allLedgers.reduce((acc, l) => acc + l.balance, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Cleared Students</p>
              <p className="text-2xl font-black font-mono text-indigo-600 mt-1">
                {allLedgers.filter(l => l.isCleared || l.balance <= 0).length} / {allLedgers.length}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
            <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 font-bold text-xs flex justify-between items-center">
              <span className="text-neutral-900 dark:text-neutral-100">Institutional Bursary Student Ledgers Audit</span>
              <span className="text-neutral-400 font-normal">{allLedgers.length} Accounts Monitored</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Total Billed</th>
                  <th className="py-3 px-4">Paid to Date</th>
                  <th className="py-3 px-4">Balance</th>
                  <th className="py-3 px-4 text-right">Clearance Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {allLedgers.map(l => {
                  const student = students.find(s => s.studentId === l.studentId);
                  return (
                    <tr key={l.studentId} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-bold">
                        <span className="text-neutral-900 dark:text-neutral-100">{student ? `${student.firstName} ${student.lastName}` : l.studentId}</span>
                        <span className="text-[11px] font-mono text-neutral-400 block">{l.studentId}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold">GHS {l.totalBilled.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-600">GHS {l.totalPaid.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-600">GHS {l.balance.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          l.isCleared || l.balance <= 0
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {l.isCleared || l.balance <= 0 ? 'FULLY CLEARED' : 'PENDING SETTLEMENT'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
