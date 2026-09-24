import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  Mail, 
  AlertTriangle, 
  Pin, 
  CheckCircle, 
  Smartphone, 
  Calendar, 
  Plus, 
  Filter,
  Users,
  Eye,
  MessageSquare,
  ShieldCheck,
  Radio,
  RefreshCw
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { Announcement, AnnouncementPriority, AnnouncementCategory, TargetAudience } from '../../types';
import { emailService } from '../../services/notifications/emailService';
import { smsService } from '../../services/notifications/smsService';
import { pushService } from '../../services/notifications/pushService';

export const AnnouncementsView: React.FC = () => {
  const { 
    announcements, 
    addAnnouncement, 
    pushPreferences, 
    updatePushPreferences, 
    emailLogs,
    settings,
    activeStudent
  } = useSchool();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'announcements' | 'push_settings' | 'email_logs' | 'sms_gateway' | 'provider_diagnostics'>('announcements');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // SMS Form State
  const [smsPhone, setSmsPhone] = useState('0244123456');
  const [smsMessage, setSmsMessage] = useState('Important: Premier University end-of-semester examination clearance begins next Monday.');
  const [smsLogs, setSmsLogs] = useState([
    {
      id: 'sms-001',
      toPhone: '+233244123456',
      recipientName: 'Kwame Mensah',
      event: 'registration_deadline',
      message: '[PremierUniv] Add/drop course registration deadline ends in 24 hours.',
      status: 'delivered',
      provider: 'hubtel',
      segments: 1,
      dispatchedAt: '2026-09-14 09:30:15'
    },
    {
      id: 'sms-002',
      toPhone: '+233501987654',
      recipientName: 'Ama Serwaa',
      event: 'fee_payment_reminder',
      message: '[PremierUniv] Fee statement: Outstanding balance GHS 750 due before exams.',
      status: 'delivered',
      provider: 'hubtel',
      segments: 1,
      dispatchedAt: '2026-09-13 14:12:00'
    }
  ]);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetAudience: 'all' as TargetAudience,
    priority: 'normal' as AnnouncementPriority,
    category: 'academic' as AnnouncementCategory,
    authorName: 'Academic Affairs Registry',
    authorRole: 'Registrar',
    expiresAt: '2026-06-30'
  });

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      showToast('Title and content are required', 'error');
      return;
    }

    addAnnouncement({
      title: formData.title,
      content: formData.content,
      targetAudience: formData.targetAudience,
      priority: formData.priority,
      category: formData.category,
      authorName: formData.authorName,
      authorRole: formData.authorRole,
      isPinned: formData.priority === 'urgent',
      expiresAt: formData.expiresAt
    });

    showToast('Announcement broadcasted to institutional feed and notification center', 'success');
    setIsAddModalOpen(false);
    setFormData({
      title: '',
      content: '',
      targetAudience: 'all',
      priority: 'normal',
      category: 'academic',
      authorName: 'Academic Affairs Registry',
      authorRole: 'Registrar',
      expiresAt: '2026-06-30'
    });
  };

  const handleTestPush = async () => {
    const res = await pushService.requestPermission();
    if (res.granted) {
      pushService.showLocalNotification({
        title: 'Premier University SIS',
        body: 'Course registration window closes in 48 hours!',
        category: 'academic'
      });
      showToast('Live Web Push dispatched to browser window', 'success');
    } else {
      showToast(`Push notification simulation triggered (Permission: ${res.status})`, 'info');
    }
  };

  const handleSendTestSms = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await smsService.sendSms({
      toPhone: smsPhone,
      recipientName: 'Student Recipient',
      event: 'emergency_campus_alert',
      message: smsMessage,
      senderId: 'PremierUniv'
    });

    const newLog = {
      id: res.messageId || `sms-${Date.now()}`,
      toPhone: res.normalizedPhone,
      recipientName: 'Student Recipient',
      event: 'emergency_campus_alert',
      message: smsMessage,
      status: res.status,
      provider: res.provider,
      segments: res.segments,
      dispatchedAt: res.timestamp
    };

    setSmsLogs(prev => [newLog, ...prev]);
    showToast(`SMS dispatched via ${res.provider.toUpperCase()} to ${res.normalizedPhone} (${res.segments} segment)`, 'success');
  };

  const handleSendTestEmail = async () => {
    const res = await emailService.sendEmail({
      to: activeStudent.email,
      recipientName: `${activeStudent.firstName} ${activeStudent.lastName}`,
      event: 'results_published',
      subject: `Official Academic Results Released - ${settings.currentSession}`,
      templateData: {
        title: 'Semester Grade Point Average Released',
        message: 'The Academic Board has ratified the semester results. Your official statement of results is now accessible.',
        details: {
          'Student Matric': activeStudent.studentId,
          'Academic Session': settings.currentSession,
          'Current Semester': settings.currentSemester
        }
      },
      institutionName: settings.institutionName
    });

    showToast(`Email dispatched via ${res.provider.toUpperCase()} (Status: ${res.status})`, 'success');
  };

  const emailDiag = emailService.getStatusDiagnostic();
  const smsDiag = smsService.getStatusDiagnostic();
  const pushDiag = pushService.getDiagnostic();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Communications & External Delivery Directorate
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Broadcast institutional bulletins, configure Web Push, and manage production Email/SMS delivery pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('provider_diagnostics')}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl text-xs font-semibold"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            Gateway Diagnostics
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Broadcast Bulletin
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 space-x-6 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('announcements')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'announcements'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Bell className="w-4 h-4" /> Campus Bulletins ({announcements.length})
        </button>
        <button
          onClick={() => setActiveTab('push_settings')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'push_settings'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Smartphone className="w-4 h-4" /> Web Push & FCM
        </button>
        <button
          onClick={() => setActiveTab('email_logs')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'email_logs'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Mail className="w-4 h-4" /> Outbound Email Logs ({emailLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('sms_gateway')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'sms_gateway'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> SMS Gateway & Dispatch ({smsLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('provider_diagnostics')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'provider_diagnostics'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> External Gateway Readiness
        </button>
      </div>

      {/* TAB 1: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map(ann => (
              <div 
                key={ann.id}
                className={`p-5 rounded-2xl bg-white dark:bg-neutral-900 border shadow-2xs space-y-3 ${
                  ann.priority === 'urgent'
                    ? 'border-rose-300 dark:border-rose-900/60'
                    : ann.priority === 'important'
                    ? 'border-amber-300 dark:border-amber-900/60'
                    : 'border-neutral-200/80 dark:border-neutral-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {ann.isPinned && (
                      <span className="p-1 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        <Pin className="w-3 h-3" />
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ann.priority === 'urgent'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : ann.priority === 'important'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                    }`}>
                      {ann.priority}
                    </span>
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase">
                      Audience: {ann.targetAudience}
                    </span>
                  </div>

                  <span className="text-[10px] text-neutral-400 font-mono">{ann.publishedAt}</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{ann.title}</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
                    {ann.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
                  <span>Author: <strong className="text-neutral-700 dark:text-neutral-300">{ann.authorName}</strong> ({ann.authorRole})</span>
                  <span>Category: <strong className="uppercase text-neutral-700 dark:text-neutral-300">{ann.category}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PUSH PREFERENCES */}
      {activeTab === 'push_settings' && (
        <div className="max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Push Notification Channels</h3>
              <p className="text-xs text-neutral-500">Configure Web Push (VAPID) and Firebase Cloud Messaging alerts.</p>
            </div>
            <button
              onClick={handleTestPush}
              className="px-3 py-1.5 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-xs font-semibold"
            >
              Dispatch Test Push
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {[
              { key: 'academicAlerts', label: 'Academic Standing & Grade Alerts', desc: 'Notify immediately when exam grades and semester GPAs are computed.' },
              { key: 'registrationDeadlines', label: 'Course Registration Window Alerts', desc: 'Countdown reminders before add/drop course deadlines close.' },
              { key: 'resultPublications', label: 'Official Senate Results Approval', desc: 'Get alerted as soon as Senate ratifies semester results.' },
              { key: 'financialReminders', label: 'Fee Clearance & Bursary Receipts', desc: 'Receipts and tuition payment status confirmations.' },
              { key: 'campusAnnouncements', label: 'University Bulletins & Emergency Directives', desc: 'Emergency campus weather, schedule shifts, or registrar memos.' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                <div>
                  <p className="font-bold text-neutral-900 dark:text-neutral-100">{item.label}</p>
                  <p className="text-[11px] text-neutral-500">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean((pushPreferences as any)[item.key])}
                  onChange={(e) => {
                    updatePushPreferences({ [item.key]: e.target.checked });
                    showToast('Notification preferences updated', 'info');
                  }}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EMAIL AUDIT LOGS */}
      {activeTab === 'email_logs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-semibold">
              Auditable record of all automated transactional outbound emails.
            </span>
            <button
              onClick={handleSendTestEmail}
              className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100"
            >
              Dispatch Live Sample Result Email
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 font-semibold border-b border-neutral-200/80 dark:border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Recipient</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Event Trigger</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Dispatched At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {emailLogs.map(log => (
                    <tr key={log.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-neutral-900 dark:text-neutral-100">{log.recipientName}</p>
                        <p className="text-[11px] text-neutral-400 font-mono">{log.recipientEmail}</p>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-neutral-800 dark:text-neutral-200">{log.subject}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-semibold">
                          {log.event}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[11px] text-neutral-400">
                        {log.sentAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SMS GATEWAY & DISPATCH */}
      {activeTab === 'sms_gateway' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sender form */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-5 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <Send className="w-4 h-4 text-indigo-600" />
                Quick Institutional SMS Dispatch
              </h3>
              <form onSubmit={handleSendTestSms} className="space-y-3">
                <div>
                  <label className="font-semibold block mb-1">Recipient Phone Number (Ghana / International)</label>
                  <input
                    type="text"
                    required
                    value={smsPhone}
                    onChange={(e) => setSmsPhone(e.target.value)}
                    placeholder="e.g. 0244123456 or +233244123456"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono text-xs"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">Normalizes Ghana national format (02X) to +233 automatically.</p>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Sender Tag</label>
                  <input
                    type="text"
                    disabled
                    value="PremierUniv"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">SMS Message Content</label>
                  <textarea
                    rows={3}
                    required
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                    <span>{smsMessage.length} Characters</span>
                    <span>{Math.ceil(smsMessage.length / 160)} SMS Billing Segment(s)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch Outbound SMS
                </button>
              </form>
            </div>

            {/* Outbound SMS logs */}
            <div className="md:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-5 space-y-3 text-xs">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                SMS Telecom Gateway Ledger ({smsLogs.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="py-2.5 px-3">Phone</th>
                      <th className="py-2.5 px-3">Event</th>
                      <th className="py-2.5 px-3">Content</th>
                      <th className="py-2.5 px-2">Provider</th>
                      <th className="py-2.5 px-3 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-medium">
                    {smsLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                        <td className="py-3 px-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">{log.toPhone}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[10px]">
                            {log.event}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400 max-w-xs truncate">{log.message}</td>
                        <td className="py-3 px-2">
                          <span className="px-1.5 py-0.5 rounded uppercase font-bold text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {log.provider}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-[10px] text-neutral-400">{log.dispatchedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: EXTERNAL GATEWAY READINESS */}
      {activeTab === 'provider_diagnostics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          {/* Email Provider Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-indigo-600" />
                Email Infrastructure
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                emailDiag.configured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {emailDiag.configured ? 'Active' : 'Simulation Mode'}
              </span>
            </div>
            <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
              <p>Active Provider: <strong className="uppercase font-mono text-neutral-900 dark:text-neutral-100">{emailDiag.provider}</strong></p>
              <p>Sender: <strong className="font-mono text-neutral-900 dark:text-neutral-100">{emailDiag.fromAddress}</strong></p>
              <p className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                Required Env Vars: <code className="block mt-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded font-mono text-[10px]">{emailDiag.requiredEnvVars.join(', ')}</code>
              </p>
            </div>
          </div>

          {/* SMS Provider Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                SMS Telecom Gateway
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                smsDiag.configured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {smsDiag.configured ? 'Live API' : 'Simulation Mode'}
              </span>
            </div>
            <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
              <p>Target Provider: <strong className="uppercase font-mono text-neutral-900 dark:text-neutral-100">{smsDiag.provider} (Ghana & Global)</strong></p>
              <p>Registered Sender ID: <strong className="font-mono text-neutral-900 dark:text-neutral-100">{smsDiag.defaultSenderId}</strong></p>
              <p className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                Required Env Vars: <code className="block mt-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded font-mono text-[10px]">{smsDiag.requiredEnvVars.join(', ')}</code>
              </p>
            </div>
          </div>

          {/* Web Push Provider Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-purple-600" />
                Web Push & FCM
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                pushDiag.permission === 'granted' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-600'
              }`}>
                Perm: {pushDiag.permission}
              </span>
            </div>
            <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
              <p>Push API Capable: <strong className="text-neutral-900 dark:text-neutral-100">{pushDiag.supported ? 'Supported' : 'Sandboxed / Restricted'}</strong></p>
              <p>VAPID Architecture: <strong className="text-neutral-900 dark:text-neutral-100">Ready</strong></p>
              <p className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                Required Env Vars: <code className="block mt-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded font-mono text-[10px]">{pushDiag.requiredEnvVars.join(', ')}</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">Broadcast Campus Bulletin</h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">Bulletin Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End-of-Semester Examination Timetable Published"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as TargetAudience })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="all">Everyone</option>
                    <option value="students">Students Only</option>
                    <option value="lecturers">Lecturers Only</option>
                    <option value="finance">Finance Only</option>
                    <option value="faculty">Faculty Only</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as AnnouncementPriority })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as AnnouncementCategory })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="academic">Academic</option>
                    <option value="exam">Examinations</option>
                    <option value="event">Campus Events</option>
                    <option value="finance">Bursary / Fees</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Message Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter the official details of the bulletin or notification..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl">Broadcast Message</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
