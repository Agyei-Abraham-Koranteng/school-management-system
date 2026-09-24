import React, { useState } from 'react';
import { 
  Shield, 
  Search, 
  Download, 
  Clock, 
  User, 
  Activity, 
  Filter,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useSchool();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action.includes(actionFilter.toUpperCase());
    return matchesSearch && matchesAction;
  });

  const handleExportCSV = () => {
    let csv = "ID,Timestamp,User,Role,Action,Entity,Details,IP\n";
    auditLogs.forEach(l => {
      csv += `"${l.id}","${l.timestamp}","${l.userName}","${l.userRole}","${l.action}","${l.entity}","${l.details.replace(/"/g, '""')}","${l.ipAddress}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Security_Audit_Logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('Audit ledger exported successfully', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Security & Governance Audit Ledger
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Immutable tracking of registry authorizations, grade modifications, financial receipts, and account escalations.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900 rounded-xl text-xs font-semibold shadow-xs"
        >
          <Download className="w-4 h-4" />
          Export Audit Trail
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by action, user, or entity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
          >
            <option value="all">All Operations</option>
            <option value="PROMOTION">Promotions & Progression</option>
            <option value="USER">User & Identity Admin</option>
            <option value="SETTINGS">System Settings</option>
            <option value="ADMISSION">Admissions & Onboarding</option>
            <option value="WARNING">Academic Warnings</option>
            <option value="ATTENDANCE">Attendance Events</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Operation Details</th>
                <th className="py-3 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                  <td className="py-3 px-4 font-mono text-[11px] text-neutral-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-neutral-900 dark:text-neutral-100">{log.userName}</p>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-[11px] text-indigo-600 dark:text-indigo-400">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-neutral-500">
                    {log.entity}
                  </td>
                  <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[11px] text-neutral-400">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
