import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './context/AuthContext';
import { useSchool } from './context/SchoolContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { GlobalSearchModal } from './components/shared/GlobalSearchModal';
import { ShieldAlert } from 'lucide-react';

import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { PublicLayout } from './components/public/PublicLayout';
import HomePage from './features/public/pages/HomePage';
import ProgramsPage from './features/public/pages/ProgramsPage';
import AdmissionsPage from './features/public/pages/AdmissionsPage';
import CampusLifePage from './features/public/pages/CampusLifePage';
import ResearchPage from './features/public/pages/ResearchPage';
import ContactPage from './features/public/pages/ContactPage';
import { ApplyPage } from './features/public/pages/ApplyPage';
import { PublicWebsiteCMSView } from './features/admin/PublicWebsiteCMSView';

// Existing Views
import { StudentDashboard } from './features/dashboard/StudentDashboard';
import { AcademicJourney } from './components/shared/AcademicJourney';
import { CourseRegistration } from './features/registration/CourseRegistration';
import { ResultsView } from './features/results/ResultsView';
import { TimetableView } from './features/timetable/TimetableView';
import { FinanceView } from './features/finance/FinanceView';
import { NotificationsCenter } from './features/notifications/NotificationsCenter';
import { AcademicProgressionAdmin } from './features/progression/AcademicProgressionAdmin';
import { StudentsDirectory } from './features/students/StudentsDirectory';
import { LoginView } from './features/auth/LoginView';
import { AdminDashboard } from './features/admin/AdminDashboard';

// Enterprise SaaS Extension Modules
import { StudentIDAndProfileView } from './features/student-profile/StudentIDAndProfileView';
import { TranscriptsAndSlipsView } from './features/transcripts/TranscriptsAndSlipsView';
import { AdmissionsView } from './features/admissions/AdmissionsView';
import { AcademicStructureView } from './features/academic-structure/AcademicStructureView';
import { StaffManagementView } from './features/admin/StaffManagementView';
import { UserManagementView } from './features/admin/UserManagementView';
import { AcademicWarningAndCarryoversView } from './features/academics/AcademicWarningAndCarryoversView';
import { AttendanceView } from './features/attendance/AttendanceView';
import { GraduationManagementView } from './features/graduation/GraduationManagementView';
import { DocumentsView } from './features/documents/DocumentsView';
import { AnnouncementsView } from './features/announcements/AnnouncementsView';
import { ReportsView } from './features/reports/ReportsView';
import { AuditLogsView } from './features/audit/AuditLogsView';
import { SystemSettingsView } from './features/settings/SystemSettingsView';
import { LecturerDashboard } from './features/dashboard/LecturerDashboard';
import { FinanceDashboard } from './features/dashboard/FinanceDashboard';

// Authorization matrix for tab permissions across roles
export const ROLE_ALLOWED_TABS: Record<string, string[]> = {
  student: [
    'dashboard', 'student-profile', 'academic-journey', 'registration',
    'results', 'transcripts', 'timetable', 'finance', 'attendance',
    'documents', 'notifications'
  ],
  lecturer: [
    'lecturer-dashboard', 'attendance', 'timetable', 'results',
    'admin-students', 'admin-academic-structure', 'documents', 'notifications'
  ],
  finance_officer: [
    'finance-dashboard', 'finance', 'admin-students', 'graduation',
    'documents', 'reports', 'notifications'
  ],
  admin_registrar: [
    'admin-dashboard', 'admin-public-cms', 'admin-admissions', 'admin-students',
    'admin-academic-structure', 'admin-staff', 'admin-progression',
    'admin-warnings', 'graduation', 'reports', 'transcripts',
    'attendance', 'documents', 'notifications'
  ],
  super_admin: [
    'admin-dashboard', 'admin-public-cms', 'admin-admissions', 'admin-students',
    'admin-academic-structure', 'admin-staff', 'admin-users',
    'admin-progression', 'admin-warnings', 'graduation', 'reports',
    'transcripts', 'attendance', 'documents', 'notifications',
    'audit-logs', 'system-settings', 'lecturer-dashboard', 'finance-dashboard'
  ]
};

export const normalizeTabAlias = (tab: string): string => {
  const clean = tab.trim().toLowerCase();
  const aliases: Record<string, string> = {
    'admissions': 'admin-admissions',
    'admission': 'admin-admissions',
    'students': 'admin-students',
    'student': 'admin-students',
    'curriculum': 'admin-academic-structure',
    'structure': 'admin-academic-structure',
    'academic-structure': 'admin-academic-structure',
    'staff': 'admin-staff',
    'faculty': 'admin-staff',
    'users': 'admin-users',
    'user-management': 'admin-users',
    'progression': 'admin-progression',
    'warnings': 'admin-warnings',
    'carryovers': 'admin-warnings',
    'settings': 'system-settings',
    'system': 'system-settings',
    'cms': 'admin-public-cms',
    'website': 'admin-public-cms',
    'announcements': 'notifications',
    'announcement': 'notifications',
    'bulletins': 'notifications',
    'profile': 'student-profile',
    'journey': 'academic-journey',
    'schedule': 'timetable',
    'courses': 'registration',
    'cgpa': 'results',
    'grades': 'results',
    'transcript': 'transcripts',
    'fees': 'finance',
    'tuition': 'finance',
    'audit': 'audit-logs'
  };
  return aliases[clean] || clean;
};

export const getDefaultTabForRole = (userRole: string): string => {
  switch (userRole) {
    case 'lecturer': return 'lecturer-dashboard';
    case 'finance_officer': return 'finance-dashboard';
    case 'admin_registrar':
    case 'super_admin':
      return 'admin-dashboard';
    case 'student':
    default:
      return 'dashboard';
  }
};

export const resolveInitialTab = (userRole: string): string => {
  const defaultTab = getDefaultTabForRole(userRole);
  const allowed = ROLE_ALLOWED_TABS[userRole] || ROLE_ALLOWED_TABS.student;

  const isValidForRole = (tab: string): boolean => {
    if (!allowed.includes(tab)) return false;
    if (userRole !== 'student' && tab === 'dashboard') return false;
    if (userRole === 'student' && (tab === 'admin-dashboard' || tab === 'lecturer-dashboard' || tab === 'finance-dashboard')) return false;
    return true;
  };

  // 1. Inspect URL query param ?tab=...
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const rawUrlTab = searchParams.get('tab');
    if (rawUrlTab) {
      const normalized = normalizeTabAlias(rawUrlTab);
      if (isValidForRole(normalized)) {
        return normalized;
      }
    }
  } catch {}

  // 2. Inspect URL hash #...
  try {
    const rawHash = window.location.hash.replace('#', '');
    if (rawHash) {
      const normalized = normalizeTabAlias(rawHash);
      if (isValidForRole(normalized)) {
        return normalized;
      }
    }
  } catch {}

  // 3. Inspect saved tab in localStorage
  try {
    const saved = localStorage.getItem('premier_active_tab');
    if (saved) {
      const normalized = normalizeTabAlias(saved);
      if (isValidForRole(normalized)) {
        return normalized;
      }
    }
  } catch {}

  return defaultTab;
};

export default function App() {
  const { isAuthenticated, role, student, logout } = useAuth();
  const { activeStudent, setActiveStudent, students } = useSchool();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(() => resolveInitialTab(role));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Synchronize authenticated student with activeStudent across the institutional context
  useEffect(() => {
    if (student) {
      if (
        !activeStudent ||
        activeStudent.id !== student.id ||
        activeStudent.studentId !== student.studentId ||
        activeStudent.email !== student.email ||
        activeStudent.firstName !== student.firstName
      ) {
        setActiveStudent(student);
      }
    }
  }, [student, activeStudent?.id, activeStudent?.studentId, activeStudent?.email, activeStudent?.firstName, setActiveStudent]);

  // Centralized tab selection with URL sync and localStorage persistence
  const handleSelectTab = useCallback((tabId: string) => {
    const allowed = ROLE_ALLOWED_TABS[role] || ROLE_ALLOWED_TABS.student;
    const normalized = normalizeTabAlias(tabId);
    const targetTab = allowed.includes(normalized) ? normalized : getDefaultTabForRole(role);

    setActiveTab(targetTab);

    try {
      localStorage.setItem('premier_active_tab', targetTab);
    } catch {}

    try {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('tab') !== targetTab) {
        searchParams.set('tab', targetTab);
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({ tab: targetTab }, '', newUrl);
      }
    } catch {}
  }, [role]);

  // Keep URL query param and localStorage in sync with activeTab
  useEffect(() => {
    if (!isAuthenticated || role === 'applicant') return;
    try {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('tab') !== activeTab) {
        searchParams.set('tab', activeTab);
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.replaceState({ tab: activeTab }, '', newUrl);
      }
      localStorage.setItem('premier_active_tab', activeTab);
    } catch {}
  }, [activeTab, isAuthenticated, role]);

  // Browser Back / Forward navigation support (popstate)
  useEffect(() => {
    const handlePopState = () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const urlTab = searchParams.get('tab');
        const allowed = ROLE_ALLOWED_TABS[role] || ROLE_ALLOWED_TABS.student;
        if (urlTab && allowed.includes(urlTab)) {
          setActiveTab(urlTab);
          localStorage.setItem('premier_active_tab', urlTab);
        } else {
          const fallback = resolveInitialTab(role);
          setActiveTab(fallback);
        }
      } catch {}
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [role]);

  // When logged in, ensure user is not stranded on /login
  useEffect(() => {
    if (isAuthenticated && window.location.pathname === '/login') {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Global search keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // When role changes, ensure user is immediately transitioned to that role's default workspace
  const prevRoleRef = useRef<string>(role);
  useEffect(() => {
    if (prevRoleRef.current !== role) {
      prevRoleRef.current = role;
      const defaultTab = getDefaultTabForRole(role);
      handleSelectTab(defaultTab);
      return;
    }

    const allowed = ROLE_ALLOWED_TABS[role] || ROLE_ALLOWED_TABS.student;
    if (
      !allowed.includes(activeTab) || 
      (role !== 'student' && activeTab === 'dashboard') || 
      (role === 'student' && (activeTab === 'admin-dashboard' || activeTab === 'lecturer-dashboard' || activeTab === 'finance-dashboard'))
    ) {
      const defaultTab = getDefaultTabForRole(role);
      handleSelectTab(defaultTab);
    }
  }, [role, activeTab, handleSelectTab]);

  // When not authenticated: render public multi-page website or login route
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginView onBack={() => navigate('/')} />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/campus-life" element={<CampusLifePage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // APPLICANT WORKSPACE LOCKDOWN:
  // Applicants MUST NOT access student dashboard until admin reviews and approves/enrolls!
  if (role === 'applicant') {
    return (
      <Routes>
        <Route path="/apply" element={<ApplyPage />} />
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/campus-life" element={<CampusLifePage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/apply" replace />} />
      </Routes>
    );
  }

  const effectiveStudent = students.find(s => 
    (activeStudent && (s.id === activeStudent.id || s.studentId === activeStudent.studentId)) ||
    (student && (s.id === student.id || s.studentId === student.studentId || s.email.toLowerCase() === student.email.toLowerCase()))
  ) || activeStudent || student;
  const allowedTabs = ROLE_ALLOWED_TABS[role] || ROLE_ALLOWED_TABS.student;
  const isTabAuthorized = allowedTabs.includes(activeTab);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex transition-colors duration-200">
      {/* Global Quick Search Modal */}
      <GlobalSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab) => {
          handleSelectTab(tab);
          setIsSearchOpen(false);
        }}
      />

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-68">
        {/* Top Navbar */}
        <Navbar
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          unreadNotificationsCount={2}
          onOpenNotifications={() => handleSelectTab('notifications')}
        />

        {/* Dynamic Route/View Render */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {!isTabAuthorized ? (
            <div className="max-w-md mx-auto my-16 p-8 text-center bg-white dark:bg-neutral-900 rounded-3xl border border-red-200 dark:border-red-900/50 shadow-lg space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-neutral-900 dark:text-neutral-50">403 · Access Denied</h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Your account role (<span className="font-mono font-bold uppercase">{role}</span>) does not possess institutional clearance to access the requested directorate ({activeTab}). This security violation has been logged to the institutional audit trail.
              </p>
              <button
                onClick={() => handleSelectTab(allowedTabs[0])}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold transition-transform hover:scale-105 shadow-xs"
              >
                Return to Authorized Workspace
              </button>
            </div>
          ) : (
            <>
              {/* STUDENT VIEWS - strictly restricted to student role */}
              {role === 'student' && activeTab === 'dashboard' && effectiveStudent && (
                <StudentDashboard student={effectiveStudent} onNavigate={handleSelectTab} />
              )}

              {role === 'student' && activeTab === 'student-profile' && (
                <StudentIDAndProfileView />
              )}

              {role === 'student' && activeTab === 'academic-journey' && effectiveStudent && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <AcademicJourney
                    currentLevel={effectiveStudent.currentLevel}
                    cgpa={effectiveStudent.currentCgpa}
                    creditsEarned={effectiveStudent.creditsEarned}
                    requiredCredits={effectiveStudent.requiredCredits}
                  />
                </div>
              )}

              {role === 'student' && activeTab === 'registration' && <CourseRegistration />}

              {activeTab === 'results' && <ResultsView />}

              {activeTab === 'transcripts' && <TranscriptsAndSlipsView />}

              {activeTab === 'timetable' && <TimetableView />}

              {activeTab === 'finance' && <FinanceView />}

              {activeTab === 'attendance' && <AttendanceView />}

              {activeTab === 'documents' && <DocumentsView />}

              {activeTab === 'notifications' && <AnnouncementsView />}

              {/* FACULTY / LECTURER VIEWS */}
              {activeTab === 'lecturer-dashboard' && (
                <LecturerDashboard onNavigate={handleSelectTab} />
              )}

              {/* FINANCE OFFICER VIEWS */}
              {activeTab === 'finance-dashboard' && (
                <FinanceDashboard onNavigate={handleSelectTab} />
              )}

              {/* ADMIN / REGISTRAR / SUPER ADMIN VIEWS */}
              {(activeTab === 'admin-dashboard' || (role !== 'student' && activeTab === 'dashboard')) && (
                <AdminDashboard onNavigate={handleSelectTab} />
              )}

          {activeTab === 'admin-admissions' && (
            <AdmissionsView />
          )}

          {activeTab === 'admin-students' && (
            <StudentsDirectory />
          )}

          {activeTab === 'admin-academic-structure' && (
            <AcademicStructureView />
          )}

          {activeTab === 'admin-staff' && (
            <StaffManagementView />
          )}

          {activeTab === 'admin-users' && (
            <UserManagementView />
          )}

          {activeTab === 'admin-progression' && (
            <AcademicProgressionAdmin />
          )}

          {activeTab === 'admin-warnings' && (
            <AcademicWarningAndCarryoversView />
          )}

          {activeTab === 'graduation' && (
            <GraduationManagementView />
          )}

          {activeTab === 'reports' && (
            <ReportsView />
          )}

          {activeTab === 'audit-logs' && (
            <AuditLogsView />
          )}

          {activeTab === 'system-settings' && (
            <SystemSettingsView />
          )}

          {activeTab === 'admin-public-cms' && (
            <PublicWebsiteCMSView />
          )}
          </>
          )}
        </main>

        {/* Mobile Navigation Bar */}
        <MobileNav activeTab={activeTab} onSelectTab={handleSelectTab} />
      </div>
    </div>
  );
}
