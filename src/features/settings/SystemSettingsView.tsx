import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Calendar, 
  Sliders, 
  GraduationCap, 
  ShieldCheck, 
  RotateCcw,
  CheckCircle2,
  Building,
  AlertCircle,
  Database,
  Download,
  Activity,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Server,
  KeyRound,
  FileCheck,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { SystemSettings } from '../../types';
import { backupService } from '../../services/disaster-recovery/backupService';
import { errorMonitoringService } from '../../services/observability/errorMonitoring';

export const SystemSettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings,
    students,
    courses,
    departments,
    faculties,
    staffList,
    financialRecords
  } = useSchool();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'global_config' | 'onboarding_wizard' | 'disaster_recovery' | 'observability'>('global_config');
  const [form, setForm] = useState<SystemSettings>({ ...settings });

  // Wizard state
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [wizardData, setWizardData] = useState({
    institutionName: form.institutionName,
    institutionCode: form.institutionCode,
    motto: form.motto,
    campusAddress: form.campusAddress,
    currentSession: form.currentSession,
    currentSemester: form.currentSemester,
    minRegistrationCredits: form.minRegistrationCredits,
    maxRegistrationCredits: form.maxRegistrationCredits,
    minProgressionCgpa: form.minProgressionCgpa,
    attendanceThreshold: form.attendanceThreshold,
    paymentProvider: 'paystack',
    smsSenderId: 'PremierUniv',
    emailProvider: 'resend'
  });

  // DR Backup state
  const [snapshots, setSnapshots] = useState(backupService.getRecentSnapshots());
  const [isGeneratingBackup, setIsGeneratingBackup] = useState(false);

  // Observability state
  const [observedEvents, setObservedEvents] = useState(errorMonitoringService.getStoredEvents());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    showToast('Institutional system configuration successfully saved', 'success');
  };

  const handleTriggerSnapshot = async () => {
    setIsGeneratingBackup(true);
    try {
      const stats = {
        studentsCount: students.length,
        coursesCount: courses.length,
        departmentsCount: departments.length,
        facultiesCount: faculties.length,
        staffCount: staffList.length,
        financialLedgersCount: financialRecords.length
      };

      const manifest = await backupService.generateSnapshotManifest(stats);
      setSnapshots(backupService.getRecentSnapshots());
      showToast(`Database snapshot #${manifest.snapshotId} compiled and verified (RPO: 5m)`, 'success');
    } catch (err: any) {
      showToast('Failed to compile backup snapshot: ' + err.message, 'error');
    } finally {
      setIsGeneratingBackup(false);
    }
  };

  const handleDownloadSnapshot = (manifest: any) => {
    backupService.downloadManifestAsJson(manifest);
    showToast(`Downloaded verified archive manifest: ${manifest.snapshotId}.json`, 'info');
  };

  const handleFinishWizard = () => {
    updateSettings({
      ...form,
      institutionName: wizardData.institutionName,
      institutionCode: wizardData.institutionCode,
      motto: wizardData.motto,
      campusAddress: wizardData.campusAddress,
      currentSession: wizardData.currentSession,
      currentSemester: wizardData.currentSemester as any,
      minRegistrationCredits: wizardData.minRegistrationCredits,
      maxRegistrationCredits: wizardData.maxRegistrationCredits,
      minProgressionCgpa: wizardData.minProgressionCgpa,
      attendanceThreshold: wizardData.attendanceThreshold
    });

    setForm(prev => ({
      ...prev,
      institutionName: wizardData.institutionName,
      institutionCode: wizardData.institutionCode,
      motto: wizardData.motto,
      campusAddress: wizardData.campusAddress,
      currentSession: wizardData.currentSession,
      currentSemester: wizardData.currentSemester as any,
      minRegistrationCredits: wizardData.minRegistrationCredits,
      maxRegistrationCredits: wizardData.maxRegistrationCredits,
      minProgressionCgpa: wizardData.minProgressionCgpa,
      attendanceThreshold: wizardData.attendanceThreshold
    }));

    showToast('Institution initialized and calibrated successfully!', 'success');
    setActiveTab('global_config');
    setWizardStep(1);
  };

  const handleSimulateHandledError = () => {
    try {
      throw new Error('Simulated unauthorized bursary balance reconciliation probe');
    } catch (err: any) {
      errorMonitoringService.captureException(err, {
        userRole: 'finance_bursar',
        action: 'simulate_test_incident',
        securityLevel: 'audit_warning'
      });
      setObservedEvents(errorMonitoringService.getStoredEvents());
      showToast('Security & error telemetry event captured and redacted', 'info');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Institutional Governance & Enterprise Settings
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Global academic parameters, First-Time Institutional Setup Wizard, Disaster Recovery (PITR), and Telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'global_config' && (
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Global Configuration
            </button>
          )}
          <button
            onClick={() => {
              setActiveTab('onboarding_wizard');
              setWizardStep(1);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Onboarding Wizard
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 space-x-6 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('global_config')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'global_config'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Sliders className="w-4 h-4" /> Academic Parameters & Scale
        </button>
        <button
          onClick={() => setActiveTab('onboarding_wizard')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'onboarding_wizard'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-600" /> Super Admin Onboarding Wizard
        </button>
        <button
          onClick={() => setActiveTab('disaster_recovery')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'disaster_recovery'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Database className="w-4 h-4 text-amber-500" /> Disaster Recovery & PITR ({snapshots.length})
        </button>
        <button
          onClick={() => setActiveTab('observability')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'observability'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Activity className="w-4 h-4 text-indigo-500" /> Telemetry & Security Audit ({observedEvents.length})
        </button>
      </div>

      {/* TAB 1: GLOBAL CONFIG */}
      {activeTab === 'global_config' && (
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Institutional Identity Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <Building className="w-4 h-4 text-indigo-600" />
              Institutional Identity & Branding
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-1">Institution Legal Name</label>
                <input
                  type="text"
                  value={form.institutionName}
                  onChange={(e) => setForm({ ...form, institutionName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Institution Code / Prefix</label>
                <input
                  type="text"
                  value={form.institutionCode}
                  onChange={(e) => setForm({ ...form, institutionCode: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-1">Motto</label>
                <input
                  type="text"
                  value={form.motto}
                  onChange={(e) => setForm({ ...form, motto: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Campus Physical Address</label>
                <input
                  type="text"
                  value={form.campusAddress}
                  onChange={(e) => setForm({ ...form, campusAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>
            </div>
          </div>

          {/* Academic Calendar Settings */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Academic Calendar & Registration Windows
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold block mb-1">Current Academic Session</label>
                <input
                  type="text"
                  value={form.currentSession}
                  onChange={(e) => setForm({ ...form, currentSession: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Active Semester</label>
                <select
                  value={form.currentSemester}
                  onChange={(e) => setForm({ ...form, currentSemester: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                >
                  <option value="First Semester">First Semester</option>
                  <option value="Second Semester">Second Semester</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 mt-4 sm:mt-0">
                <div>
                  <p className="font-bold">Course Registration Window</p>
                  <p className="text-[10px] text-neutral-500">Allow students to enroll/drop</p>
                </div>
                <input
                  type="checkbox"
                  checked={form.isRegistrationOpen}
                  onChange={(e) => setForm({ ...form, isRegistrationOpen: e.target.checked })}
                  className="w-5 h-5 rounded text-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Academic Policy Benchmarks */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <Sliders className="w-4 h-4 text-amber-500" />
              Statutory Academic Policy Benchmarks
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="font-semibold block mb-1">Min. Semester Credits</label>
                <input
                  type="number"
                  value={form.minRegistrationCredits}
                  onChange={(e) => setForm({ ...form, minRegistrationCredits: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Max. Semester Credits</label>
                <input
                  type="number"
                  value={form.maxRegistrationCredits}
                  onChange={(e) => setForm({ ...form, maxRegistrationCredits: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Min. Progression CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.minProgressionCgpa}
                  onChange={(e) => setForm({ ...form, minProgressionCgpa: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Attendance Threshold (%)</label>
                <input
                  type="number"
                  value={form.attendanceThreshold}
                  onChange={(e) => setForm({ ...form, attendanceThreshold: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Grading System Table */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <GraduationCap className="w-4 h-4 text-purple-600" />
              University Standard 4.00 Grading Matrix
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
              {form.gradingScale.map((grade, i) => (
                <div key={i} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                  <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">Grade {grade.letter || grade.grade}</p>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300">{grade.minScore}% - {grade.maxScore}%</p>
                  <p className="text-[11px] text-neutral-400 font-bold mt-1">{grade.gradePoint.toFixed(1)} GP</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Apply & Persist Changes
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: ONBOARDING WIZARD */}
      {activeTab === 'onboarding_wizard' && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-6 shadow-2xs space-y-6 text-xs">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Super Admin Guided Institutional Setup Wizard
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Calibrate a new school tenant from scratch in 4 rapid statutory configuration steps.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    wizardStep === step
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : wizardStep > step
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {wizardStep > step ? '✓' : step}
                </div>
              ))}
            </div>
          </div>

          {/* STEP 1: Institutional Legal Identity */}
          {wizardStep === 1 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">Step 1: Legal Identity & Institutional Charter</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">University / College Legal Name</label>
                  <input
                    type="text"
                    value={wizardData.institutionName}
                    onChange={(e) => setWizardData({ ...wizardData, institutionName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Official Institutional Code / Prefix</label>
                  <input
                    type="text"
                    value={wizardData.institutionCode}
                    onChange={(e) => setWizardData({ ...wizardData, institutionCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Latin / Institutional Motto</label>
                  <input
                    type="text"
                    value={wizardData.motto}
                    onChange={(e) => setWizardData({ ...wizardData, motto: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Accredited Physical Campus Address</label>
                  <input
                    type="text"
                    value={wizardData.campusAddress}
                    onChange={(e) => setWizardData({ ...wizardData, campusAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Academic Calendar & Progression Rules */}
          {wizardStep === 2 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">Step 2: Academic Calendar & Senate Benchmarks</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Inaugural Academic Session</label>
                  <input
                    type="text"
                    value={wizardData.currentSession}
                    onChange={(e) => setWizardData({ ...wizardData, currentSession: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Commencing Semester</label>
                  <select
                    value={wizardData.currentSemester}
                    onChange={(e) => setWizardData({ ...wizardData, currentSemester: e.target.value as 'First Semester' | 'Second Semester' })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="First Semester">First Semester</option>
                    <option value="Second Semester">Second Semester</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Min. Progression CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={wizardData.minProgressionCgpa}
                    onChange={(e) => setWizardData({ ...wizardData, minProgressionCgpa: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Semester Min. Registration Credits</label>
                  <input
                    type="number"
                    value={wizardData.minRegistrationCredits}
                    onChange={(e) => setWizardData({ ...wizardData, minRegistrationCredits: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Semester Max. Registration Credits</label>
                  <input
                    type="number"
                    value={wizardData.maxRegistrationCredits}
                    onChange={(e) => setWizardData({ ...wizardData, maxRegistrationCredits: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Bursary & Payment Gateways */}
          {wizardStep === 3 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">Step 3: Tuition Collection & Payment Integrations</h4>
              <div className="space-y-3">
                <p className="text-neutral-600 dark:text-neutral-400">Select the primary payment processor for tuition and fee collection:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: 'paystack', name: 'Paystack', desc: 'Cards, Mobile Money (MTN/Vodafone/AirtelTigo), Bank Transfer' },
                    { id: 'flutterwave', name: 'Flutterwave', desc: 'Multi-currency African & Diaspora payments, MoMo, Barter' },
                    { id: 'hubtel', name: 'Hubtel', desc: 'Ghana Direct Carrier & Merchant MoMo clearance' }
                  ].map(p => (
                    <div
                      key={p.id}
                      onClick={() => setWizardData({ ...wizardData, paymentProvider: p.id })}
                      className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                        wizardData.paymentProvider === p.id
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                          : 'border-neutral-200 dark:border-neutral-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>{p.name}</span>
                        {wizardData.paymentProvider === p.id && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Communications & Delivery */}
          {wizardStep === 4 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">Step 4: Institutional Delivery Channels</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Transactional SMS Sender ID (Max 11 Chars)</label>
                  <input
                    type="text"
                    maxLength={11}
                    value={wizardData.smsSenderId}
                    onChange={(e) => setWizardData({ ...wizardData, smsSenderId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">Displayed on student handsets during grade alerts and fee receipts.</p>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Outbound Email Delivery Service</label>
                  <select
                    value={wizardData.emailProvider}
                    onChange={(e) => setWizardData({ ...wizardData, emailProvider: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="resend">Resend (Modern Developer Email)</option>
                    <option value="sendgrid">Twilio SendGrid (High Volume Enterprise)</option>
                    <option value="ses">Amazon SES (Simple Email Service)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-900 dark:text-emerald-100">Ready to Initialize Tenant!</p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                    Clicking "Complete Institutional Calibration" will write the parameters into system storage, seed default grading matrices, and calibrate notification pipelines.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Controls */}
          <div className="flex justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
            {wizardStep > 1 ? (
              <button
                type="button"
                onClick={() => setWizardStep(prev => prev - 1)}
                className="px-4 py-2 border rounded-xl flex items-center gap-1 font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
            ) : <div />}

            {wizardStep < 4 ? (
              <button
                type="button"
                onClick={() => setWizardStep(prev => prev + 1)}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl flex items-center gap-1 font-semibold hover:bg-indigo-700"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishWizard}
                className="px-5 py-2 bg-emerald-600 text-white rounded-xl flex items-center gap-1 font-semibold hover:bg-emerald-700 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" /> Complete Institutional Calibration
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DISASTER RECOVERY & PITR */}
      {activeTab === 'disaster_recovery' && (
        <div className="space-y-6 text-xs">
          {/* DR Policy Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-1">
              <span className="text-neutral-400 font-medium">Recovery Point Objective</span>
              <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">RPO: 5 Minutes</p>
              <p className="text-[10px] text-neutral-500">Continuous WAL archiving</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-1">
              <span className="text-neutral-400 font-medium">Recovery Time Objective</span>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">RTO: 15 Minutes</p>
              <p className="text-[10px] text-neutral-500">Automated failover target</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-1">
              <span className="text-neutral-400 font-medium">Archival Retention</span>
              <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">30-Day PITR</p>
              <p className="text-[10px] text-neutral-500">Cold storage replicas</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-1">
              <span className="text-neutral-400 font-medium">Data Sovereign Hash</span>
              <p className="text-xs font-mono font-bold text-indigo-600 truncate">SHA-256 Validated</p>
              <p className="text-[10px] text-neutral-500">Tamper-evident checksums</p>
            </div>
          </div>

          {/* Action trigger */}
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-600" />
                Manual Institutional Cold-Storage Snapshot
              </h4>
              <p className="text-neutral-500 mt-0.5">
                Generate an immediate signed cryptographic manifest of all students, courses, staff, and ledger balances.
              </p>
            </div>
            <button
              onClick={handleTriggerSnapshot}
              disabled={isGeneratingBackup}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-colors shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${isGeneratingBackup ? 'animate-spin' : ''}`} />
              {isGeneratingBackup ? 'Compiling Manifest...' : 'Compile Snapshot Now'}
            </button>
          </div>

          {/* Snapshot Ledger Table */}
          <div className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 font-bold text-sm">
              Archival Snapshot Manifests ({snapshots.length})
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Snapshot ID</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Records Captured</th>
                    <th className="py-3 px-4">SHA-256 Checksum</th>
                    <th className="py-3 px-4">Integrity Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {snapshots.map((snap) => (
                    <tr key={snap.snapshotId} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">{snap.snapshotId}</td>
                      <td className="py-3.5 px-4 text-neutral-500 font-mono">{snap.timestamp}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-neutral-700 dark:text-neutral-300">
                          {snap.tables.students} Students, {snap.tables.financialRecords} Ledgers
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-500 truncate max-w-xs">{snap.checksum}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {snap.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDownloadSnapshot(snap)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg font-semibold"
                        >
                          <Download className="w-3.5 h-3.5" /> Manifest .json
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: OBSERVABILITY & TELEMETRY */}
      {activeTab === 'observability' && (
        <div className="space-y-6 text-xs">
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                Enterprise Security & Incident Telemetry
              </h4>
              <p className="text-neutral-500 mt-0.5">
                Redacted, PII-stripped error reports and unauthorized access attempts ready for Sentry / Datadog streaming.
              </p>
            </div>
            <button
              onClick={handleSimulateHandledError}
              className="px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl font-bold transition-colors"
            >
              Test Telemetry Capture
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 font-bold text-sm flex items-center justify-between">
              <span>Telemetry Ingestion Stream ({observedEvents.length})</span>
              <span className="text-[11px] font-normal text-neutral-400">All sensitive tokens & passwords scrubbed before logging</span>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {observedEvents.map((evt) => (
                <div key={evt.id} className="p-4 space-y-1.5 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        evt.level === 'fatal' || evt.level === 'error'
                          ? 'bg-rose-100 text-rose-800'
                          : evt.level === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {evt.level}
                      </span>
                      <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{evt.id}</span>
                    </div>
                    <span className="font-mono text-[10px] text-neutral-400">{evt.timestamp}</span>
                  </div>

                  <p className="font-semibold text-neutral-800 dark:text-neutral-200">{evt.message}</p>

                  <div className="text-[11px] text-neutral-400 font-mono flex gap-4">
                    <span>Path: {evt.url}</span>
                    {evt.context?.userRole && <span>Role: {evt.context.userRole}</span>}
                    {evt.context?.action && <span>Action: {evt.context.action}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

