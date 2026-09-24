import React, { useState } from 'react';
import { 
  FileCheck, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Eye, 
  School, 
  Award, 
  GraduationCap, 
  Search, 
  Filter, 
  ArrowRight,
  Sparkles,
  FileText,
  AlertTriangle,
  Send,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  FileBadge,
  History,
  ShieldCheck,
  Check, 
  X, 
  RefreshCw,
  Download
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { AdmissionApplication, ApplicationStatus, DocumentVerificationStatus } from '../../types';
import { realtimeSyncManager } from '../../services/realtime/realtimeService';
import { indexedDbStorage } from '../../services/storage/indexedDbStorage';

export const AdmissionsView: React.FC = () => {
  const { 
    applications, 
    refreshApplications,
    submitApplication, 
    updateApplicationStatus, 
    requestApplicationCorrection,
    issueAdmissionOffer,
    updateApplicantDocumentStatus,
    enrollApplicantAsStudent, 
    settings 
  } = useSchool();
  
  const { showToast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const [statusTab, setStatusTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState<'details' | 'documents' | 'history'>('details');
  const [reviewNote, setReviewNote] = useState('');
  
  // Correction Modal State
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [correctionFields, setCorrectionFields] = useState<string[]>(['Date of Birth', 'WASSCE Result Slip']);
  const [correctionReason, setCorrectionReason] = useState('');
  const [correctionDeadline, setCorrectionDeadline] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Offer Modal State
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offerConditionsText, setOfferConditionsText] = useState(
    'Submission of original WASSCE / SSCE certificate for registry verification\nSatisfactory medical examination clearance\nPayment of academic acceptance registration fee'
  );
  const [offerDeadline, setOfferDeadline] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Document Rejection / Replacement Modal State
  const [docActionModal, setDocActionModal] = useState<{
    open: boolean;
    docId: string;
    docName: string;
    action: 'reject' | 'replace';
    reason: string;
  }>({
    open: false,
    docId: '',
    docName: '',
    action: 'replace',
    reason: ''
  });

  const [enrolledStudentInfo, setEnrolledStudentInfo] = useState<{ studentId: string; matricNo: string; name: string } | null>(null);
  const [lastRealtimeEvent, setLastRealtimeEvent] = useState<string | null>(null);

  // Document preview state for Admissions Admin
  const [previewDoc, setPreviewDoc] = useState<{ id: string; name: string; type: string; fileSize: string; fileUrl: string } | null>(null);
  const [resolvedPreviewUrl, setResolvedPreviewUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (!previewDoc) {
      setResolvedPreviewUrl(null);
      return;
    }
    if (previewDoc.fileUrl && previewDoc.fileUrl.startsWith('indexeddb:')) {
      indexedDbStorage.getDocumentBlob(previewDoc.id).then(data => {
        setResolvedPreviewUrl(data);
      });
    } else {
      setResolvedPreviewUrl(previewDoc.fileUrl);
    }
  }, [previewDoc]);

  // Subscribe to real-time incoming applications & mutations
  React.useEffect(() => {
    const unbind = realtimeSyncManager.on('admission_applications', (event) => {
      if (event.eventType === 'INSERT') {
        setLastRealtimeEvent(`New applicant: ${event.newRecord.firstName} ${event.newRecord.lastName} (${event.newRecord.applicationNumber})`);
        showToast(`🔔 Real-Time: New application received from ${event.newRecord.firstName} ${event.newRecord.lastName}!`, 'info');
      } else if (event.eventType === 'UPDATE') {
        setLastRealtimeEvent(`Updated: ${event.newRecord.applicationNumber} -> ${event.newRecord.status}`);
        // If the drawer is currently inspecting this application, keep it synced!
        setSelectedApp(current => {
          if (current && current.id === event.newRecord.id) {
            return event.newRecord as AdmissionApplication;
          }
          return current;
        });
      }
    });

    return () => unbind();
  }, [showToast]);

  // Auto-sync applications whenever the admin focuses or switches back to this tab
  React.useEffect(() => {
    const handleFocus = () => {
      refreshApplications();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refreshApplications]);

  const handleManualSync = () => {
    setIsSyncing(true);
    refreshApplications();
    setTimeout(() => {
      setIsSyncing(false);
      showToast(`Registry synchronized! ${applications.length} applications loaded.`, 'success');
    }, 450);
  };

  const handleSimulateRealtimeApplicant = () => {
    const names = [
      { first: 'Nana', last: 'Akua Boakye', agg: 8, school: 'Wesley Girls High School', prog: 'BSc Computer Science' },
      { first: 'Kofi', last: 'Osei-Tutu', agg: 9, school: 'Opoku Ware School', prog: 'BSc Software Engineering' },
      { first: 'Abena', last: 'Appiah', agg: 7, school: 'Holy Child School', prog: 'BSc Information Technology' },
      { first: 'Kwabena', last: 'Adu-Gyamfi', agg: 10, school: 'Prempeh College', prog: 'BSc Data Science' }
    ];
    const pick = names[Math.floor(Math.random() * names.length)];

    submitApplication({
      firstName: pick.first,
      lastName: pick.last,
      email: `${pick.first.toLowerCase()}.${pick.last.replace(/\s+/g, '').toLowerCase()}${Math.floor(Math.random() * 90 + 10)}@gmail.com`,
      phone: `+233 24 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`,
      dateOfBirth: '2006-03-15',
      gender: pick.first === 'Nana' || pick.first === 'Abena' ? 'Female' : 'Male',
      nationality: 'Ghanaian',
      address: 'Airport Residential Area, Accra',
      guardianName: `Mr. ${pick.last}`,
      guardianPhone: '+233 20 555 1234',
      programChoiceId: 'prg-bsc-se',
      programChoiceName: pick.prog,
      secondarySchool: pick.school,
      completionYear: 2025,
      aggregateScore: pick.agg,
      wassceAggregate: pick.agg,
      status: 'submitted',
      documents: [
        {
          id: `doc-${Date.now()}-1`,
          name: 'Official_WASSCE_Statement.pdf',
          type: 'WASSCE / High School Certificate',
          fileUrl: '#',
          fileSize: '1.3 MB',
          uploadedAt: new Date().toISOString().split('T')[0],
          status: 'verified'
        },
        {
          id: `doc-${Date.now()}-2`,
          name: 'National_Identification_Card.pdf',
          type: 'National ID',
          fileUrl: '#',
          fileSize: '890 KB',
          uploadedAt: new Date().toISOString().split('T')[0],
          status: 'verified'
        }
      ],
      wassceResults: [
        { subject: 'English Language', grade: 'A1' },
        { subject: 'Core Mathematics', grade: 'A1' },
        { subject: 'Integrated Science', grade: 'B2' },
        { subject: 'Social Studies', grade: 'A1' },
        { subject: 'Elective Mathematics', grade: 'B2' },
        { subject: 'Physics', grade: 'A1' }
      ]
    });
  };

  const filteredApps = applications.filter(app => {
    const matchesTab = 
      statusTab === 'all' || 
      app.status === statusTab ||
      (statusTab === 'pending_review' && (app.status === 'submitted' || app.status === 'under_review' || app.status === 'resubmitted')) ||
      (statusTab === 'offers' && (app.status === 'admission_offered' || app.status === 'offer_accepted' || app.status === 'offer_declined'));

    const matchesSearch = 
      `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.programChoiceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleStatusChange = (status: ApplicationStatus) => {
    if (!selectedApp) return;
    updateApplicationStatus(selectedApp.id, status, reviewNote);
    showToast(`Application ${selectedApp.applicationNumber} moved to ${status.replace(/_/g, ' ').toUpperCase()}`, 'info');
    setSelectedApp(prev => prev ? { ...prev, status, reviewNotes: reviewNote } : null);
    setReviewNote('');
  };

  const handleEnrollStudent = (app: AdmissionApplication) => {
    try {
      const res = enrollApplicantAsStudent(app.id);
      setEnrolledStudentInfo({
        studentId: res.studentId,
        matricNo: res.matricNo,
        name: `${app.firstName} ${app.lastName}`
      });
      showToast(`Matriculation completed! ${app.firstName} ${app.lastName} assigned ${res.matricNo}`, 'success');
      setSelectedApp(prev => prev ? { ...prev, status: 'enrolled', allocatedStudentId: res.matricNo } : null);
    } catch (err: any) {
      showToast(err.message || 'Failed to enroll student.', 'error');
    }
  };

  const handleSendCorrectionRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    if (correctionFields.length === 0) {
      showToast('Please select at least one field requiring correction.', 'error');
      return;
    }
    if (!correctionReason.trim()) {
      showToast('Please provide detailed instructions for the applicant.', 'error');
      return;
    }

    requestApplicationCorrection(
      selectedApp.id, 
      correctionFields, 
      correctionReason.trim(), 
      correctionDeadline
    );

    showToast(`Correction request dispatched to ${selectedApp.firstName} ${selectedApp.lastName}.`, 'success');
    setCorrectionModalOpen(false);
    setCorrectionReason('');
  };

  const handleIssueAdmissionOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    const conditions = offerConditionsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    issueAdmissionOffer(selectedApp.id, conditions, offerDeadline);
    showToast(`Formal Admission Offer extended to ${selectedApp.firstName} ${selectedApp.lastName}!`, 'success');
    setOfferModalOpen(false);
  };

  const handleDocumentAction = (docId: string, status: DocumentVerificationStatus, reason?: string) => {
    if (!selectedApp) return;
    updateApplicantDocumentStatus(selectedApp.id, docId, status, reason);
    showToast(`Document verification status updated to ${status}.`, 'info');
    setDocActionModal({ open: false, docId: '', docName: '', action: 'replace', reason: '' });
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'enrolled':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">MATRICULATED</span>;
      case 'offer_accepted':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">OFFER ACCEPTED</span>;
      case 'admission_offered':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">OFFER EXTENDED</span>;
      case 'approved':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">APPROVED</span>;
      case 'correction_required':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">CORRECTION REQUIRED</span>;
      case 'resubmitted':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">RESUBMITTED</span>;
      case 'under_review':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">UNDER REVIEW</span>;
      case 'rejected':
      case 'offer_declined':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">{status.replace(/_/g, ' ').toUpperCase()}</span>;
      case 'draft':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">DRAFT</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">SUBMITTED</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Directorate Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Admissions Directorate & Matriculation Board
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            End-to-end lifecycle management: review WASSCE credentials, verify documents, request corrections, extend offers, and matriculate students into SIS.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Real-Time Ingestion Active</span>
          </div>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 transition-colors shadow-2xs"
            title="Force reload all applications from local cache & live streams"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-500 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync Applications ({applications.length})</span>
          </button>

          <button
            onClick={handleSimulateRealtimeApplicant}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 transition-colors shadow-2xs"
            title="Simulate a prospective student submitting an application in real-time"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>Simulate Real-Time Applicant</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <span>Session:</span>
            <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{settings.currentSession}</strong>
          </div>
        </div>
      </div>

      {lastRealtimeEvent && (
        <div className="p-2.5 px-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span>Live Sync Event: <strong className="text-white">{lastRealtimeEvent}</strong></span>
          </div>
          <span className="text-[10px] text-indigo-400 font-mono">Real-Time Sync Across All Tabs & Windows</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Applicants</p>
          <p className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-1">{applications.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Pending Review</p>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {applications.filter(a => a.status === 'submitted' || a.status === 'under_review' || a.status === 'resubmitted').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">Corrections Req.</p>
          <p className="text-2xl font-black text-orange-600 mt-1">
            {applications.filter(a => a.status === 'correction_required').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Offers Extended</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {applications.filter(a => a.status === 'admission_offered' || a.status === 'offer_accepted' || a.status === 'approved').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Matriculated</p>
          <p className="text-2xl font-black text-purple-600 mt-1">
            {applications.filter(a => a.status === 'enrolled').length}
          </p>
        </div>
      </div>

      {/* Filter and Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 space-x-1 text-xs font-semibold overflow-x-auto w-full sm:w-auto pb-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'pending_review', label: 'In Review' },
            { key: 'correction_required', label: 'Correction Req.' },
            { key: 'resubmitted', label: 'Resubmitted' },
            { key: 'offers', label: 'Offers / Accepted' },
            { key: 'enrolled', label: 'Matriculated' },
            { key: 'rejected', label: 'Rejected' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusTab(tab.key)}
              className={`pb-2 px-3 border-b-2 whitespace-nowrap transition-colors ${
                statusTab === tab.key
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate, ref, program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 font-semibold border-b border-neutral-200/80 dark:border-neutral-800">
              <tr>
                <th className="py-3 px-4">Applicant Profile</th>
                <th className="py-3 px-4">Application Ref</th>
                <th className="py-3 px-4">Program Choice</th>
                <th className="py-3 px-4">Academic Background</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
              {filteredApps.map(app => (
                <tr key={app.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-neutral-900 dark:text-neutral-100">{app.firstName} {app.lastName}</p>
                    <p className="text-[11px] text-neutral-400">{app.email} • {app.phone}</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-neutral-600 dark:text-neutral-400">
                    {app.applicationNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{app.programChoiceName}</span>
                    <p className="text-[11px] text-neutral-400">{app.studyMode || 'Full-Time Regular'}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded font-mono font-bold text-xs ${
                        (app.wassceAggregate ?? app.aggregateScore ?? 12) <= 10 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        Agg. {app.wassceAggregate ?? app.aggregateScore ?? 12}
                      </span>
                      <span className="text-[11px] text-neutral-400 truncate max-w-[140px]">
                        {app.secondarySchool || app.previousSchool || 'Senior High School'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(app.status)}
                    {app.allocatedStudentId && (
                      <p className="text-[10px] font-mono text-purple-600 dark:text-purple-400 mt-0.5 font-bold">
                        {app.allocatedStudentId}
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-500 text-[11px]">
                    {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Recent'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setReviewNote(app.reviewNotes || '');
                          setActiveDrawerTab('details');
                        }}
                        className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect
                      </button>

                      {app.status === 'offer_accepted' && !app.allocatedStudentId && (
                        <button
                          onClick={() => handleEnrollStudent(app)}
                          className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold inline-flex items-center gap-1 shadow-2xs"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          Matriculate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400 text-xs">
                    No applications match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Applicant Inspection Drawer / Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-black text-neutral-900 dark:text-neutral-100">
                    {selectedApp.firstName} {selectedApp.lastName}
                  </h3>
                  {getStatusBadge(selectedApp.status)}
                </div>
                <p className="text-xs text-neutral-400 font-mono mt-1">
                  Application Number: <strong className="text-indigo-600 dark:text-indigo-400">{selectedApp.applicationNumber}</strong> • Applied: {selectedApp.submittedAt ? new Date(selectedApp.submittedAt).toLocaleDateString() : 'Recent'}
                </p>
              </div>
              <button 
                onClick={() => setSelectedApp(null)} 
                className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Sub-tabs in Drawer */}
            <div className="flex border-b border-neutral-200 dark:border-neutral-800 space-x-3 text-xs font-bold">
              <button
                onClick={() => setActiveDrawerTab('details')}
                className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-colors ${
                  activeDrawerTab === 'details'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Bio-data & Grades</span>
              </button>
              <button
                onClick={() => setActiveDrawerTab('documents')}
                className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-colors ${
                  activeDrawerTab === 'documents'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <FileBadge className="w-3.5 h-3.5" />
                <span>Documents ({selectedApp.documents.length})</span>
              </button>
              <button
                onClick={() => setActiveDrawerTab('history')}
                className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-colors ${
                  activeDrawerTab === 'history'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Audit & History ({selectedApp.statusHistory?.length || 1})</span>
              </button>
            </div>

            {/* TAB 1: BIO-DATA & GRADES */}
            {activeDrawerTab === 'details' && (
              <div className="space-y-5">
                {/* Highlight banner if correction requested */}
                {selectedApp.correctionRequested && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-amber-300">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Correction Requested on {new Date(selectedApp.correctionRequested.requestedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-neutral-300 pl-6">
                      Required sections: <strong className="text-white">{selectedApp.correctionRequested.fields.join(', ')}</strong>
                    </p>
                    <p className="text-neutral-300 pl-6 italic">
                      "{selectedApp.correctionRequested.reason}"
                    </p>
                  </div>
                )}

                {/* Candidate Overview Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-800 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Applied Program</span>
                    <strong className="text-neutral-900 dark:text-neutral-100">{selectedApp.programChoiceName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Study Mode</span>
                    <strong className="text-neutral-900 dark:text-neutral-100">{selectedApp.studyMode || 'Full-Time Regular'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Date of Birth & Gender</span>
                    <span className="text-neutral-700 dark:text-neutral-300">{selectedApp.dateOfBirth} ({selectedApp.gender})</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Nationality</span>
                    <span className="text-neutral-700 dark:text-neutral-300">{selectedApp.nationality}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Email Address</span>
                    <span className="text-neutral-700 dark:text-neutral-300 font-mono">{selectedApp.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Phone Number</span>
                    <span className="text-neutral-700 dark:text-neutral-300">{selectedApp.phone}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Residential Address</span>
                    <span className="text-neutral-700 dark:text-neutral-300">{selectedApp.address}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Next of Kin / Guardian</span>
                    <span className="text-neutral-700 dark:text-neutral-300">{selectedApp.guardianName || selectedApp.nextOfKin?.fullName || 'N/A'} ({selectedApp.guardianPhone || selectedApp.nextOfKin?.phone || 'N/A'})</span>
                  </div>
                </div>

                {/* Academic Qualifications & WASSCE Slip */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      WASSCE / High School Examination Results
                    </h4>
                    <span className="text-xs font-mono font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      Aggregate Score: {selectedApp.wassceAggregate ?? selectedApp.aggregateScore ?? 10}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400">
                    School of Origin: <strong className="text-neutral-200">{selectedApp.secondarySchool || selectedApp.previousSchool || 'Senior High School'}</strong> (Year: {selectedApp.completionYear})
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {(selectedApp.wassceResults || []).map((res, i) => (
                      <div key={i} className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/80 flex justify-between items-center text-xs">
                        <span className="font-medium text-neutral-700 dark:text-neutral-300 truncate mr-2">{res.subject}</span>
                        <span className={`px-2 py-0.5 rounded font-mono font-black ${
                          res.grade.startsWith('A') 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : res.grade.startsWith('B')
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {res.grade}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admission Offer Details if already offered */}
                {selectedApp.offer && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 uppercase tracking-wider">Official Admission Offer</span>
                      <span className="font-mono text-emerald-300 font-bold">Status: {selectedApp.offer.status.toUpperCase()}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-neutral-300">
                      <p>Offered Program: <strong className="text-white">{selectedApp.offer.programName}</strong></p>
                      <p>Commencing Level: <strong className="text-white">Level 100</strong></p>
                      <p>Acceptance Deadline: <strong className="text-white">{selectedApp.offer.acceptanceDeadline}</strong></p>
                      <p>Decision Date: <strong className="text-white">{selectedApp.offer.decisionDate || 'Awaiting Applicant Response'}</strong></p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: DOCUMENTS */}
            {activeDrawerTab === 'documents' && (
              <div className="space-y-3">
                <p className="text-xs text-neutral-400">
                  Verify credential authenticity. You can mark documents as Verified, Rejected, or Request Replacement.
                </p>

                <div className="space-y-2.5">
                  {selectedApp.documents.map((doc) => (
                    <div 
                      key={doc.id}
                      className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-neutral-100">{doc.name}</p>
                          <p className="text-[11px] text-neutral-400">{doc.type} • {doc.fileSize} • Uploaded {doc.uploadedAt}</p>
                          {doc.rejectionReason && (
                            <p className="text-rose-400 text-[11px] mt-1 font-semibold">
                              Rejection note: "{doc.rejectionReason}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          doc.status === 'verified'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : doc.status === 'replacement_required' || doc.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {doc.status.replace(/_/g, ' ')}
                        </span>

                        {doc.fileUrl && doc.fileUrl !== '#' && (
                          <button
                            type="button"
                            onClick={() => setPreviewDoc(doc)}
                            className="p-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600"
                            title="Preview Document"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {doc.status !== 'verified' && (
                          <button
                            onClick={() => handleDocumentAction(doc.id, 'verified')}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
                            title="Verify Document"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {doc.status !== 'replacement_required' && (
                          <button
                            onClick={() => setDocActionModal({
                              open: true,
                              docId: doc.id,
                              docName: doc.name,
                              action: 'replace',
                              reason: ''
                            })}
                            className="p-1.5 rounded-lg bg-amber-600 text-white hover:bg-amber-500"
                            title="Request Replacement"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: AUDIT & STATUS HISTORY */}
            {activeDrawerTab === 'history' && (
              <div className="space-y-3">
                <p className="text-xs text-neutral-400">
                  Immutable audit log of all application transitions and registry actions.
                </p>

                <div className="space-y-2 border-l-2 border-indigo-600/40 pl-4 py-1">
                  {(selectedApp.statusHistory || []).map((hist, i) => (
                    <div key={hist.id || i} className="relative pb-3 text-xs space-y-0.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 absolute -left-[21px] top-1" />
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-[11px]">
                          {hist.previousStatus} → {hist.newStatus}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {new Date(hist.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500">By {hist.changedBy} ({hist.actorRole})</p>
                      {hist.notes && <p className="text-neutral-300 italic text-[11px]">"{hist.notes}"</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Internal Registry Notes Input */}
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                Registry Committee Internal Comments & Notes
              </label>
              <textarea
                rows={2}
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Enter admissions panel observations, merit list notes, or conditions..."
                className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              />
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {selectedApp.status !== 'rejected' && selectedApp.status !== 'enrolled' && (
                  <button
                    onClick={() => handleStatusChange('rejected')}
                    className="px-3 py-2 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-xs font-semibold"
                  >
                    Reject Application
                  </button>
                )}

                {selectedApp.status !== 'correction_required' && selectedApp.status !== 'enrolled' && (
                  <button
                    onClick={() => setCorrectionModalOpen(true)}
                    className="px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-800 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/60 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Request Corrections
                  </button>
                )}

                {selectedApp.status !== 'under_review' && selectedApp.status !== 'enrolled' && selectedApp.status !== 'admission_offered' && (
                  <button
                    onClick={() => handleStatusChange('under_review')}
                    className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold"
                  >
                    Mark Under Review
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Issue Offer Button */}
                {selectedApp.status !== 'admission_offered' && selectedApp.status !== 'offer_accepted' && selectedApp.status !== 'enrolled' && (
                  <button
                    onClick={() => setOfferModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                  >
                    <Award className="w-4 h-4" />
                    Extend Admission Offer
                  </button>
                )}

                {/* Matriculate Button (active when offer accepted or approved) */}
                {(selectedApp.status === 'offer_accepted' || selectedApp.status === 'approved') && !selectedApp.allocatedStudentId && (
                  <button
                    onClick={() => handleEnrollStudent(selectedApp)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 hover:scale-105 transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    Matriculate & Activate Student ID
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: REQUEST APPLICATION CORRECTIONS */}
      {correctionModalOpen && selectedApp && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xs">
          <form onSubmit={handleSendCorrectionRequest} className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-5 text-neutral-100 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Request Application Corrections
              </h3>
              <button type="button" onClick={() => setCorrectionModalOpen(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-neutral-400">
              Specify which sections candidate <strong className="text-white">{selectedApp.firstName} {selectedApp.lastName}</strong> must correct before admission can be decided.
            </p>

            {/* Checkable fields */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-2">Sections Requiring Rectification:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Personal Bio-data',
                  'Date of Birth',
                  'Identification Document',
                  'WASSCE Result Slip',
                  'Birth Certificate',
                  'Passport Photograph',
                  'Program Choice',
                  'Next of Kin Details'
                ].map(field => (
                  <label key={field} className="p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={correctionFields.includes(field)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCorrectionFields(prev => [...prev, field]);
                        } else {
                          setCorrectionFields(prev => prev.filter(f => f !== field));
                        }
                      }}
                      className="rounded text-indigo-600 focus:ring-indigo-500 bg-neutral-700 border-neutral-600"
                    />
                    <span className="text-neutral-200">{field}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Admissions Directorate Instructions *</label>
              <textarea
                required
                rows={3}
                value={correctionReason}
                onChange={(e) => setCorrectionReason(e.target.value)}
                placeholder="e.g. Uploaded WASSCE certificate is blurred. Please provide a clear, high-resolution scan. Date of birth also differs from national ID."
                className="w-full text-xs p-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Resubmission Deadline</label>
              <input
                type="date"
                value={correctionDeadline}
                onChange={(e) => setCorrectionDeadline(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
              />
            </div>

            <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCorrectionModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch Correction Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: EXTEND FORMAL ADMISSION OFFER */}
      {offerModalOpen && selectedApp && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xs">
          <form onSubmit={handleIssueAdmissionOffer} className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-5 text-neutral-100 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Issue Official Admission Offer
              </h3>
              <button type="button" onClick={() => setOfferModalOpen(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-800/80 border border-neutral-700/80 text-xs space-y-1">
              <p>Candidate: <strong className="text-white">{selectedApp.firstName} {selectedApp.lastName}</strong> ({selectedApp.applicationNumber})</p>
              <p>Degree: <strong className="text-indigo-400">{selectedApp.programChoiceName}</strong></p>
              <p>Level: <strong className="text-emerald-400">Level 100 Undergraduate Entry</strong></p>
              <p>Academic Session: <strong className="text-neutral-200">{settings.currentSession}</strong></p>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Admission Conditions (One per line):
              </label>
              <textarea
                rows={3}
                value={offerConditionsText}
                onChange={(e) => setOfferConditionsText(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Candidate Acceptance Deadline</label>
              <input
                type="date"
                value={offerDeadline}
                onChange={(e) => setOfferDeadline(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
              />
            </div>

            <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOfferModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Issue Official Offer Letter
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: DOCUMENT REPLACEMENT MODAL */}
      {docActionModal.open && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 text-neutral-100 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-400" />
              Request Document Replacement
            </h3>
            <p className="text-xs text-neutral-400">
              Document: <strong className="text-white">{docActionModal.docName}</strong>
            </p>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Reason for Replacement *
              </label>
              <textarea
                rows={2}
                value={docActionModal.reason}
                onChange={(e) => setDocActionModal({ ...docActionModal, reason: e.target.value })}
                placeholder="e.g. Scanned copy is illegible or missing grade seals."
                className="w-full text-xs p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
              />
            </div>

            <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDocActionModal({ ...docActionModal, open: false })}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDocumentAction(docActionModal.docId, 'replacement_required', docActionModal.reason)}
                className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
              >
                Set Replacement Required
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Matriculation Success Modal */}
      {enrolledStudentInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 rounded-2xl mx-auto flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-neutral-900 dark:text-neutral-100">
                Official Matriculation Confirmed!
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Applicant <strong className="text-neutral-800 dark:text-neutral-200">{enrolledStudentInfo.name}</strong> has been enrolled as a bona fide undergraduate student.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/60">
              <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Assigned Matriculation Number</p>
              <p className="text-xl font-black font-mono text-purple-950 dark:text-purple-200 mt-0.5">
                {enrolledStudentInfo.matricNo}
              </p>
              <p className="text-[11px] text-purple-700 dark:text-purple-300 mt-2">
                Level 100 • Admission Letter generated in Documents • Student SIS Dashboard is now fully activated.
              </p>
            </div>

            <button
              onClick={() => setEnrolledStudentInfo(null)}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900 rounded-xl text-xs font-bold shadow-xs"
            >
              Done & Return to Admissions
            </button>
          </div>
        </div>
      )}

      {/* Admin Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-2xl text-neutral-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h4 className="font-bold text-sm text-white">{previewDoc.name}</h4>
                <p className="text-xs text-neutral-400">{previewDoc.type} • {previewDoc.fileSize}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center min-h-[300px]">
              {resolvedPreviewUrl && resolvedPreviewUrl.startsWith('data:image') ? (
                <img 
                  src={resolvedPreviewUrl} 
                  alt={previewDoc.name}
                  className="max-h-[400px] object-contain rounded-xl"
                />
              ) : resolvedPreviewUrl && resolvedPreviewUrl.startsWith('data:application/pdf') ? (
                <iframe
                  src={resolvedPreviewUrl}
                  title={previewDoc.name}
                  className="w-full h-[400px] rounded-xl border-0"
                />
              ) : (
                <div className="text-center space-y-3 p-6">
                  <FileText className="w-16 h-16 text-indigo-400 mx-auto" />
                  <p className="text-xs font-bold text-white">{previewDoc.name}</p>
                  <p className="text-[11px] text-neutral-400">Institutional Document Ready for Registry Verification</p>
                  {resolvedPreviewUrl && (
                    <a
                      href={resolvedPreviewUrl}
                      download={previewDoc.name}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Document
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionsView;
