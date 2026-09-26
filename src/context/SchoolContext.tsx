import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SystemSettings,
  SystemUser,
  StaffMember,
  Faculty,
  Department,
  AcademicProgram,
  Course,
  StudentRecord,
  StudentProfileExtra,
  AdmissionApplication,
  AttendanceSession,
  CarryoverItem,
  CourseAttempt,
  AcademicWarning,
  SystemDocument,
  GraduationCandidate,
  Announcement,
  AuditLogEntry,
  NotificationItem,
  PushSubscriptionPreferences,
  EmailLogEntry,
  ApplicationStatus,
  GraduationCandidateStatus,
  CourseRegistrationSlip,
  RegistrationStatus,
  AdmissionOffer,
  DocumentVerificationStatus,
  ApplicationStatusHistory,
  ApplicantDocument
} from '../types';
import {
  DEFAULT_SYSTEM_SETTINGS,
  SAMPLE_USERS,
  SAMPLE_STAFF,
  SAMPLE_FACULTIES,
  SAMPLE_DEPARTMENTS,
  SAMPLE_PROGRAMS,
  SAMPLE_COURSES,
  SAMPLE_ALL_STUDENTS,
  SAMPLE_STUDENT,
  SAMPLE_STUDENT_PROFILE_EXTRA,
  SAMPLE_APPLICATIONS,
  SAMPLE_ATTENDANCE_SESSIONS,
  SAMPLE_CARRYOVERS,
  SAMPLE_COURSE_ATTEMPTS,
  SAMPLE_ACADEMIC_WARNINGS,
  SAMPLE_SYSTEM_DOCUMENTS,
  SAMPLE_GRADUATION_CANDIDATES,
  SAMPLE_ANNOUNCEMENTS,
  SAMPLE_AUDIT_LOGS,
  SAMPLE_NOTIFICATIONS,
  SAMPLE_EMAIL_LOGS
} from '../data/mockData';
import {
  isSupabaseConfigured,
  testSupabaseConnection,
  supabaseDb,
  supabase
} from '../lib/supabase';
import { academicEngine } from '../services/academics/academicEngine';
import { realtimeSyncManager } from '../services/realtime/realtimeService';
import { emailService } from '../services/notifications/emailService';
import { pushService } from '../services/notifications/pushService';
import { useAuth } from './AuthContext';
import {
  sanitizeApplicationForStorage,
  sanitizeApplicationsForStorage
} from '../services/storage/indexedDbStorage';

export interface StudentFinancialLedger {
  studentId: string;
  totalBilled: number;
  totalPaid: number;
  balance: number;
  isCleared: boolean;
  transactions: Array<{
    id: string;
    reference: string;
    amount: number;
    description: string;
    date: string;
    gateway: string;
    status: 'successful' | 'pending' | 'failed';
  }>;
}

export interface SchoolContextType {
  // Settings
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;

  // Users & Staff
  users: SystemUser[];
  addUser: (user: Omit<SystemUser, 'id' | 'createdAt' | 'lastLogin'>) => void;
  updateUserStatus: (id: string, status: SystemUser['status']) => void;
  staff: StaffMember[];
  staffList: StaffMember[];
  financialRecords: any[];
  addStaff: (staff: Omit<StaffMember, 'id' | 'staffId'>) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;

  // Structure
  faculties: Faculty[];
  addFaculty: (faculty: Omit<Faculty, 'id' | 'departmentCount' | 'totalStudents'>) => void;
  updateFaculty: (id: string, updates: Partial<Faculty>) => void;
  deleteFaculty: (id: string) => void;
  departments: Department[];
  addDepartment: (dept: Omit<Department, 'id' | 'programCount'>) => void;
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  programs: AcademicProgram[];
  addProgram: (program: Omit<AcademicProgram, 'id'>) => void;
  updateProgram: (id: string, updates: Partial<AcademicProgram>) => void;
  deleteProgram: (id: string) => void;
  courses: Course[];
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  // Students & Profile
  students: StudentRecord[];
  activeStudent: StudentRecord;
  setActiveStudent: (student: StudentRecord | ((prev: StudentRecord) => StudentRecord)) => void;
  updateStudent: (id: string, updates: Partial<StudentRecord>) => void;
  studentProfileExtra: StudentProfileExtra;
  updateStudentProfileExtra: (updates: Partial<StudentProfileExtra>) => void;

  // Admissions Lifecycle
  applications: AdmissionApplication[];
  refreshApplications: () => void;
  saveApplicationDraft: (draftData: Partial<AdmissionApplication>) => AdmissionApplication;
  submitApplication: (applicationData: Partial<AdmissionApplication>) => AdmissionApplication;
  updateApplicationStatus: (id: string, status: ApplicationStatus, notes?: string) => void;
  requestApplicationCorrection: (applicationId: string, fields: string[], reason: string, deadline?: string) => void;
  resubmitApplication: (applicationId: string, updates: Partial<AdmissionApplication>) => void;
  issueAdmissionOffer: (applicationId: string, conditions?: string[], deadline?: string) => AdmissionOffer;
  respondToAdmissionOffer: (applicationId: string, accept: boolean) => void;
  updateApplicantDocumentStatus: (applicationId: string, docId: string, status: DocumentVerificationStatus, reason?: string) => void;
  enrollApplicantAsStudent: (applicationId: string) => { studentId: string; matricNo: string };

  // Course Registrations
  registrations: CourseRegistrationSlip[];
  submitCourseRegistration: (registration: CourseRegistrationSlip) => void;
  approveCourseRegistration: (registrationId: string, approvedBy?: string) => void;
  rejectCourseRegistration: (registrationId: string, reason: string) => void;

  // Academics, Warnings & Attendance
  carryovers: CarryoverItem[];
  courseAttempts: CourseAttempt[];
  recordCourseGrade: (payload: {
    studentId: string;
    courseCode: string;
    courseTitle: string;
    credits: number;
    score: number;
    academicSession?: string;
    semester?: string;
  }) => void;
  academicWarnings: AcademicWarning[];
  issueWarning: (warning: Omit<AcademicWarning, 'id' | 'issuedDate' | 'status'>) => void;
  resolveWarning: (id: string) => void;
  attendanceSessions: AttendanceSession[];
  recordAttendance: (session: Omit<AttendanceSession, 'id'>) => void;

  // Finance & Bursary
  financialLedgers: Record<string, StudentFinancialLedger>;
  recordPayment: (payment: {
    studentId: string;
    studentName: string;
    matricNo: string;
    amount: number;
    description: string;
    gateway: string;
    reference: string;
  }) => void;

  // Documents & Graduation
  documents: SystemDocument[];
  addDocument: (doc: Omit<SystemDocument, 'id' | 'uploadedAt'>) => void;
  graduationCandidates: GraduationCandidate[];
  updateGraduationStatus: (id: string, status: GraduationCandidateStatus) => void;

  // Communication & Notifications
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'publishedAt' | 'readCount'>) => void;
  notifications: NotificationItem[];
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  pushPreferences: PushSubscriptionPreferences;
  updatePushPreferences: (prefs: Partial<PushSubscriptionPreferences>) => void;
  emailLogs: EmailLogEntry[];

  // Audit Logs
  auditLogs: AuditLogEntry[];
  logAction: (action: string, entity: string, details: string, entityId?: string) => void;

  // Global Search Modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Supabase Status & Live Sync
  supabaseStatus: {
    configured: boolean;
    connected: boolean;
    latencyMs?: number;
    message?: string;
  };
  refreshSupabaseData: () => Promise<void>;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: authUser, student: authStudent, role } = useAuth();

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('premier_system_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SYSTEM_SETTINGS;
  });

  const [users, setUsers] = useState<SystemUser[]>(() => {
    try {
      const saved = localStorage.getItem('premier_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SAMPLE_USERS;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem('premier_staff');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SAMPLE_STAFF;
  });

  useEffect(() => {
    try { localStorage.setItem('premier_users', JSON.stringify(users)); } catch {}
  }, [users]);

  useEffect(() => {
    try { localStorage.setItem('premier_staff', JSON.stringify(staff)); } catch {}
  }, [staff]);

  // Persistent & Realtime Academic Structure Entities
  const [faculties, setFaculties] = useState<Faculty[]>(() => {
    try {
      const saved = localStorage.getItem('premier_faculties');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SAMPLE_FACULTIES;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    try {
      const saved = localStorage.getItem('premier_departments');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SAMPLE_DEPARTMENTS;
  });

  const [programs, setPrograms] = useState<AcademicProgram[]>(() => {
    try {
      const saved = localStorage.getItem('premier_academic_programs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SAMPLE_PROGRAMS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('premier_courses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SAMPLE_COURSES;
  });

  useEffect(() => {
    try { localStorage.setItem('premier_faculties', JSON.stringify(faculties)); } catch {}
  }, [faculties]);

  useEffect(() => {
    try { localStorage.setItem('premier_departments', JSON.stringify(departments)); } catch {}
  }, [departments]);

  useEffect(() => {
    try { localStorage.setItem('premier_academic_programs', JSON.stringify(programs)); } catch {}
  }, [programs]);

  useEffect(() => {
    try { localStorage.setItem('premier_courses', JSON.stringify(courses)); } catch {}
  }, [courses]);

  const [students, setStudents] = useState<StudentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('premier_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const map = new Map<string, StudentRecord>();
          SAMPLE_ALL_STUDENTS.forEach(s => map.set(s.id, s));
          parsed.forEach((s: StudentRecord) => map.set(s.id, s));
          return Array.from(map.values());
        }
      }
    } catch {}
    return SAMPLE_ALL_STUDENTS;
  });

  useEffect(() => {
    try { localStorage.setItem('premier_students', JSON.stringify(students)); } catch {}
  }, [students]);

  const [activeStudent, setActiveStudentState] = useState<StudentRecord>(() => {
    try {
      const cached = localStorage.getItem('premier_active_student');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.firstName) return parsed;
      }
      const authUserStr = localStorage.getItem('premier_auth_user');
      if (authUserStr) {
        const authUser = JSON.parse(authUserStr);
        if (authUser.role === 'student') {
          const rawStudents = localStorage.getItem('premier_students');
          if (rawStudents) {
            const list: StudentRecord[] = JSON.parse(rawStudents);
            const found = list.find(s =>
              s.email.toLowerCase() === authUser.email.toLowerCase() ||
              (s.applicantEmail && s.applicantEmail.toLowerCase() === authUser.email.toLowerCase()) ||
              `${s.firstName} ${s.lastName}`.toLowerCase() === `${authUser.firstName} ${authUser.lastName}`.toLowerCase()
            );
            if (found) return found;
          }
        }
      }
    } catch {}
    return SAMPLE_STUDENT;
  });

  const setActiveStudent = useCallback((st: StudentRecord | ((prev: StudentRecord) => StudentRecord)) => {
    setActiveStudentState(prev => {
      const next = typeof st === 'function' ? st(prev) : st;
      try {
        localStorage.setItem('premier_active_student', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // Synchronize activeStudent whenever auth user or authStudent changes
  useEffect(() => {
    if (role === 'student') {
      if (authStudent) {
        setActiveStudentState(authStudent);
        try { localStorage.setItem('premier_active_student', JSON.stringify(authStudent)); } catch {}
      } else if (authUser) {
        const found = students.find(s =>
          s.email.toLowerCase() === authUser.email.toLowerCase() ||
          (s.applicantEmail && s.applicantEmail.toLowerCase() === authUser.email.toLowerCase()) ||
          `${s.firstName} ${s.lastName}`.toLowerCase() === `${authUser.firstName} ${authUser.lastName}`.toLowerCase()
        );
        if (found) {
          setActiveStudentState(found);
          try { localStorage.setItem('premier_active_student', JSON.stringify(found)); } catch {}
        }
      }
    }
  }, [authStudent, authUser, role, students]);

  const [studentProfileExtra, setStudentProfileExtra] = useState<StudentProfileExtra>(SAMPLE_STUDENT_PROFILE_EXTRA);

  // Resilient Admissions Applications state: Merges default samples, bulk storage, and individual applicant backups
  const loadAllStoredApplications = useCallback((): AdmissionApplication[] => {
    const map = new Map<string, AdmissionApplication>();
    SAMPLE_APPLICATIONS.forEach(a => map.set(a.id, a));

    try {
      const saved = localStorage.getItem('premier_admission_applications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((a: AdmissionApplication) => {
            if (a && a.id) map.set(a.id, a);
          });
        }
      }
    } catch (e) {
      console.error('Failed to parse cached applications', e);
    }

    // Recover any individual applicant backups stored as premier_applicant_app_*
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('premier_applicant_app_')) {
          const itemStr = localStorage.getItem(key);
          if (itemStr) {
            const item = JSON.parse(itemStr);
            if (item && item.id) {
              map.set(item.id, item);
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error recovering individual applicant backups:', e);
    }

    return Array.from(map.values());
  }, []);

  const [applications, setApplications] = useState<AdmissionApplication[]>(() => {
    return loadAllStoredApplications();
  });

  useEffect(() => {
    try {
      const sanitized = sanitizeApplicationsForStorage(applications);
      localStorage.setItem('premier_admission_applications', JSON.stringify(sanitized));
    } catch (e) {
      console.error('Failed to cache applications', e);
    }
  }, [applications]);
  
  const DEFAULT_REGISTRATIONS: CourseRegistrationSlip[] = [
    {
      id: 'reg-2025-2026-sem1-01',
      studentId: SAMPLE_STUDENT.studentId,
      semesterId: 'sem-2025-2026-1',
      academicSession: '2025/2026',
      semester: 'First Semester',
      level: '300',
      status: 'approved',
      submittedAt: '2025-09-10 14:30:00',
      approvedAt: '2025-09-12 09:15:00',
      approvedBy: 'Prof. Evelyn Ofori-Atta (Registrar)',
      items: [
        { id: 'item-1', courseId: 'crs-it301', code: 'IT301', title: 'Database Administration & Architecture', creditHours: 3, type: 'core', status: 'approved' },
        { id: 'item-2', courseId: 'crs-it303', code: 'IT303', title: 'Software Engineering & Methodologies', creditHours: 3, type: 'core', status: 'approved' },
        { id: 'item-3', courseId: 'crs-it305', code: 'IT305', title: 'Computer Networks & Telecommunications', creditHours: 3, type: 'core', status: 'approved' },
        { id: 'item-4', courseId: 'crs-it307', code: 'IT307', title: 'Web Systems & Cloud Infrastructure', creditHours: 3, type: 'core', status: 'approved' },
        { id: 'item-5', courseId: 'crs-it309', code: 'IT309', title: 'Information Security & Cryptography', creditHours: 3, type: 'core', status: 'approved' },
        { id: 'item-6', courseId: 'crs-gen301', code: 'GEN301', title: 'Research Methodology & Ethics', creditHours: 2, type: 'general', status: 'approved' }
      ],
      totalCredits: 17
    }
  ];

  // Registration state with localStorage persistence
  const [registrations, setRegistrations] = useState<CourseRegistrationSlip[]>(() => {
    try {
      const saved = localStorage.getItem('premier_course_registrations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_REGISTRATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('premier_course_registrations', JSON.stringify(registrations));
    } catch {}
  }, [registrations]);

  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>(() => {
    try {
      const saved = localStorage.getItem('premier_attendance_sessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SAMPLE_ATTENDANCE_SESSIONS;
  });

  const [carryovers, setCarryovers] = useState<CarryoverItem[]>(SAMPLE_CARRYOVERS);
  const [courseAttempts, setCourseAttempts] = useState<CourseAttempt[]>(() => {
    try {
      const saved = localStorage.getItem('premier_course_attempts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SAMPLE_COURSE_ATTEMPTS;
  });

  useEffect(() => {
    try { localStorage.setItem('premier_course_attempts', JSON.stringify(courseAttempts)); } catch {}
  }, [courseAttempts]);

  const [academicWarnings, setAcademicWarnings] = useState<AcademicWarning[]>(() => {
    try {
      const saved = localStorage.getItem('premier_academic_warnings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SAMPLE_ACADEMIC_WARNINGS;
  });

  const [documents, setDocuments] = useState<SystemDocument[]>(() => {
    try {
      const saved = localStorage.getItem('premier_system_documents');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SAMPLE_SYSTEM_DOCUMENTS;
  });

  const [graduationCandidates, setGraduationCandidates] = useState<GraduationCandidate[]>(() => {
    try {
      const saved = localStorage.getItem('premier_graduation_candidates');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SAMPLE_GRADUATION_CANDIDATES;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem('premier_announcements');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SAMPLE_ANNOUNCEMENTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('premier_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SAMPLE_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('premier_audit_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SAMPLE_AUDIT_LOGS;
  });

  useEffect(() => {
    try { localStorage.setItem('premier_attendance_sessions', JSON.stringify(attendanceSessions)); } catch {}
  }, [attendanceSessions]);

  useEffect(() => {
    try { localStorage.setItem('premier_academic_warnings', JSON.stringify(academicWarnings)); } catch {}
  }, [academicWarnings]);

  useEffect(() => {
    try { localStorage.setItem('premier_system_documents', JSON.stringify(documents)); } catch {}
  }, [documents]);

  useEffect(() => {
    try { localStorage.setItem('premier_graduation_candidates', JSON.stringify(graduationCandidates)); } catch {}
  }, [graduationCandidates]);

  useEffect(() => {
    try { localStorage.setItem('premier_announcements', JSON.stringify(announcements)); } catch {}
  }, [announcements]);

  useEffect(() => {
    try { localStorage.setItem('premier_notifications', JSON.stringify(notifications)); } catch {}
  }, [notifications]);

  useEffect(() => {
    try { localStorage.setItem('premier_audit_logs', JSON.stringify(auditLogs)); } catch {}
  }, [auditLogs]);

  const [emailLogs, setEmailLogs] = useState<EmailLogEntry[]>(SAMPLE_EMAIL_LOGS);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const DEFAULT_FINANCIAL_LEDGERS: Record<string, StudentFinancialLedger> = {
    [SAMPLE_STUDENT.studentId]: {
      studentId: SAMPLE_STUDENT.studentId,
      totalBilled: 5800,
      totalPaid: 5800,
      balance: 0,
      isCleared: true,
      transactions: [
        {
          id: 'txn-2025-001',
          reference: 'PU-PAY-2025-918231',
          amount: 3500,
          description: 'Level 300 First Semester Academic Tuition Fee',
          date: '2025-09-08',
          gateway: 'paystack',
          status: 'successful'
        },
        {
          id: 'txn-2025-002',
          reference: 'PU-PAY-2025-918232',
          amount: 2300,
          description: 'ICT Lab, Library & Verification Fee',
          date: '2025-09-09',
          gateway: 'hubtel_momo',
          status: 'successful'
        }
      ]
    },
    'PU202301': {
      studentId: 'PU202301',
      totalBilled: 5800,
      totalPaid: 4200,
      balance: 1600,
      isCleared: false,
      transactions: [
        {
          id: 'txn-2025-003',
          reference: 'PU-PAY-2025-110201',
          amount: 4200,
          description: 'First Semester Tuition Deposit',
          date: '2025-09-11',
          gateway: 'bank_transfer',
          status: 'successful'
        }
      ]
    },
    'PU202302': {
      studentId: 'PU202302',
      totalBilled: 5800,
      totalPaid: 3500,
      balance: 2300,
      isCleared: false,
      transactions: [
        {
          id: 'txn-2025-004',
          reference: 'PU-PAY-2025-110202',
          amount: 3500,
          description: 'Initial Tuition Payment',
          date: '2025-09-12',
          gateway: 'paystack',
          status: 'successful'
        }
      ]
    },
    'PU202303': {
      studentId: 'PU202303',
      totalBilled: 5800,
      totalPaid: 5800,
      balance: 0,
      isCleared: true,
      transactions: [
        {
          id: 'txn-2025-005',
          reference: 'PU-PAY-2025-110203',
          amount: 5800,
          description: 'Full Academic Session Tuition Settlement',
          date: '2025-09-07',
          gateway: 'paystack',
          status: 'successful'
        }
      ]
    },
    'PU202304': {
      studentId: 'PU202304',
      totalBilled: 5000,
      totalPaid: 3000,
      balance: 2000,
      isCleared: false,
      transactions: [
        {
          id: 'txn-2025-006',
          reference: 'PU-PAY-2025-110204',
          amount: 3000,
          description: 'Part-Payment Academic Fees',
          date: '2025-09-14',
          gateway: 'hubtel_momo',
          status: 'successful'
        }
      ]
    },
    'PU202401': {
      studentId: 'PU202401',
      totalBilled: 5000,
      totalPaid: 5000,
      balance: 0,
      isCleared: true,
      transactions: [
        {
          id: 'txn-2025-007',
          reference: 'PU-PAY-2025-110205',
          amount: 5000,
          description: 'Full Session Fees - Level 200',
          date: '2025-09-09',
          gateway: 'bank_transfer',
          status: 'successful'
        }
      ]
    },
    'PU202501': {
      studentId: 'PU202501',
      totalBilled: 4500,
      totalPaid: 4500,
      balance: 0,
      isCleared: true,
      transactions: [
        {
          id: 'txn-2025-008',
          reference: 'PU-PAY-2025-110206',
          amount: 4500,
          description: 'Freshmen Admission & Academic Tuition',
          date: '2025-09-05',
          gateway: 'paystack',
          status: 'successful'
        }
      ]
    }
  };

  // Financial Ledgers by student matric number with localStorage persistence
  const [financialLedgers, setFinancialLedgers] = useState<Record<string, StudentFinancialLedger>>(() => {
    try {
      const saved = localStorage.getItem('premier_financial_ledgers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_FINANCIAL_LEDGERS, ...parsed };
        }
      }
    } catch {}
    return DEFAULT_FINANCIAL_LEDGERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('premier_financial_ledgers', JSON.stringify(financialLedgers));
    } catch {}
  }, [financialLedgers]);

  const [supabaseStatus, setSupabaseStatus] = useState<{
    configured: boolean;
    connected: boolean;
    latencyMs?: number;
    message?: string;
  }>({
    configured: isSupabaseConfigured(),
    connected: false,
    message: isSupabaseConfigured() ? 'Connecting to Supabase...' : 'Running in Standalone Mode (Mock & Local Persistence)'
  });

  const [pushPreferences, setPushPreferences] = useState<PushSubscriptionPreferences>({
    enabled: true,
    academicAlerts: true,
    registrationDeadlines: true,
    resultPublications: true,
    financialReminders: true,
    campusAnnouncements: true
  });

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('premier_system_settings', JSON.stringify(settings));
  }, [settings]);

  // Synchronize state with Supabase if configured
  const refreshSupabaseData = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setSupabaseStatus({
        configured: false,
        connected: false,
        message: 'Supabase credentials not set. Operating in resilient standalone mode with institutional seed state.'
      });
      return;
    }

    try {
      const ping = await testSupabaseConnection();
      setSupabaseStatus({
        configured: true,
        connected: ping.connected,
        latencyMs: ping.latencyMs,
        message: ping.message
      });

      if (!ping.connected) return;

      // Fetch all core entities in parallel
      const [
        remoteSettings,
        remoteFaculties,
        remoteDepartments,
        remotePrograms,
        remoteCourses,
        remoteStudents,
        remoteApplications,
        remoteAnnouncements,
        remoteLogs
      ] = await Promise.all([
        supabaseDb.getSettings(),
        supabaseDb.getFaculties(),
        supabaseDb.getDepartments(),
        supabaseDb.getPrograms(),
        supabaseDb.getCourses(),
        supabaseDb.getStudents(),
        supabaseDb.getApplications(),
        supabaseDb.getAnnouncements(),
        supabaseDb.getAuditLogs()
      ]);

      if (remoteSettings) setSettings(prev => ({ ...prev, ...remoteSettings }));
      if (remoteFaculties && remoteFaculties.length > 0) setFaculties(remoteFaculties);
      if (remoteDepartments && remoteDepartments.length > 0) setDepartments(remoteDepartments);
      if (remotePrograms && remotePrograms.length > 0) setPrograms(remotePrograms);
      if (remoteCourses && remoteCourses.length > 0) setCourses(remoteCourses);
      if (remoteStudents && remoteStudents.length > 0) {
        setStudents(remoteStudents);
        setActiveStudent(remoteStudents[0]);
      }
      if (remoteApplications && remoteApplications.length > 0) {
        setApplications(prev => {
          const map = new Map<string, AdmissionApplication>();
          SAMPLE_APPLICATIONS.forEach(a => map.set(a.id, a));
          remoteApplications.forEach(a => map.set(a.id, a));
          prev.forEach(a => map.set(a.id, a));
          try {
            const raw = localStorage.getItem('premier_admission_applications');
            if (raw) {
              const localSaved = JSON.parse(raw);
              if (Array.isArray(localSaved)) {
                localSaved.forEach((a: AdmissionApplication) => map.set(a.id, a));
              }
            }
          } catch {}
          const merged = Array.from(map.values());
          try {
            localStorage.setItem('premier_admission_applications', JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
      if (remoteAnnouncements && remoteAnnouncements.length > 0) setAnnouncements(remoteAnnouncements);
      if (remoteLogs && remoteLogs.length > 0) setAuditLogs(remoteLogs);
    } catch (err: any) {
      console.warn('[SchoolContext] Supabase sync caught error, preserving local state:', err);
      setSupabaseStatus(prev => ({
        ...prev,
        connected: false,
        message: `Sync warning: ${err.message || 'Preserving local state'}`
      }));
    }
  }, []);

  // Initialize Realtime subscriptions and initial sync
  useEffect(() => {
    refreshSupabaseData();

    // Initialize Realtime Channel (Supabase if configured, plus BroadcastChannel cross-tab stream)
    realtimeSyncManager.initialize();

    // Listen for real-time Admission Application submissions & status changes
    const unbindApplications = realtimeSyncManager.on('admission_applications', (event) => {
      if (event.eventType === 'INSERT') {
        setApplications(prev => {
          if (prev.some(a => a.id === event.newRecord.id)) return prev;
          return [event.newRecord, ...prev];
        });
        addNotification({
          title: `New Online Application: ${event.newRecord.applicationNumber}`,
          message: `${event.newRecord.firstName} ${event.newRecord.lastName} applied for ${event.newRecord.programChoiceName}`,
          category: 'important',
          isRead: false
        });
      } else if (event.eventType === 'UPDATE') {
        setApplications(prev => prev.map(a => a.id === event.newRecord.id ? { ...a, ...event.newRecord } : a));
      } else if (event.eventType === 'DELETE') {
        setApplications(prev => prev.filter(a => a.id !== event.oldRecord.id));
      }
    });

    // Listen for remote Student mutations
    const unbindStudents = realtimeSyncManager.on('students', (event) => {
      if (event.eventType === 'INSERT') {
        setStudents(prev => [event.newRecord, ...prev.filter(s => s.id !== event.newRecord.id)]);
      } else if (event.eventType === 'UPDATE') {
        setStudents(prev => prev.map(s => s.id === event.newRecord.id ? { ...s, ...event.newRecord } : s));
      } else if (event.eventType === 'DELETE') {
        setStudents(prev => prev.filter(s => s.id !== event.oldRecord.id));
      }
    });

    // Listen for remote Course Registrations
    const unbindRegistrations = realtimeSyncManager.on('course_registrations', (event) => {
      if (event.eventType === 'INSERT') {
        setRegistrations(prev => [event.newRecord, ...prev.filter(r => r.id !== event.newRecord.id)]);
      } else if (event.eventType === 'UPDATE') {
        setRegistrations(prev => prev.map(r => r.id === event.newRecord.id ? { ...r, ...event.newRecord } : r));
        if (event.newRecord.status === 'approved') {
          realtimeSyncManager.playChime('approval');
        }
      } else if (event.eventType === 'DELETE') {
        setRegistrations(prev => prev.filter(r => r.id !== event.oldRecord.id));
      }
    });

    // Listen for remote Financial Ledgers updates
    const unbindFinancialLedgers = realtimeSyncManager.on('financial_ledgers', (event) => {
      if (event.eventType === 'UPDATE' || event.eventType === 'INSERT') {
        if (event.newRecord && typeof event.newRecord === 'object') {
          setFinancialLedgers(event.newRecord);
        }
      }
    });

    // Listen for remote Student Course Grades / Attempts updates
    const unbindCourseAttempts = realtimeSyncManager.on('student_course_grades', (event) => {
      if (event.eventType === 'INSERT' || event.eventType === 'UPDATE') {
        setCourseAttempts(prev => [event.newRecord, ...prev.filter(a => a.id !== event.newRecord.id)]);
      }
    });

    // Listen for remote Announcements
    const unbindAnnouncements = realtimeSyncManager.on('announcements', (event) => {
      if (event.eventType === 'INSERT') {
        setAnnouncements(prev => [event.newRecord, ...prev]);
        addNotification({
          title: `Announcement: ${event.newRecord.title}`,
          message: event.newRecord.content?.slice(0, 100) || 'New institutional announcement published',
          category: 'announcements',
          isRead: false
        });
      }
    });

    // Listen for remote Settings updates
    const unbindSettings = realtimeSyncManager.on('system_settings', (event) => {
      if (event.eventType === 'UPDATE' && event.newRecord) {
        setSettings(prev => ({ ...prev, ...event.newRecord }));
      }
    });

    // Listen for Academic Structure real-time changes
    const unbindFaculties = realtimeSyncManager.on('faculties', (event) => {
      if (event.eventType === 'INSERT') {
        setFaculties(prev => prev.some(f => f.id === event.newRecord.id) ? prev : [...prev, event.newRecord]);
      } else if (event.eventType === 'UPDATE') {
        setFaculties(prev => prev.map(f => f.id === event.newRecord.id ? { ...f, ...event.newRecord } : f));
      } else if (event.eventType === 'DELETE') {
        setFaculties(prev => prev.filter(f => f.id !== (event.oldRecord?.id || event.newRecord?.id)));
      }
    });

    const unbindDepartments = realtimeSyncManager.on('departments', (event) => {
      if (event.eventType === 'INSERT') {
        setDepartments(prev => prev.some(d => d.id === event.newRecord.id) ? prev : [...prev, event.newRecord]);
      } else if (event.eventType === 'UPDATE') {
        setDepartments(prev => prev.map(d => d.id === event.newRecord.id ? { ...d, ...event.newRecord } : d));
      } else if (event.eventType === 'DELETE') {
        setDepartments(prev => prev.filter(d => d.id !== (event.oldRecord?.id || event.newRecord?.id)));
      }
    });

    const unbindPrograms = realtimeSyncManager.on('academic_programs', (event) => {
      if (event.eventType === 'INSERT') {
        setPrograms(prev => prev.some(p => p.id === event.newRecord.id) ? prev : [...prev, event.newRecord]);
      } else if (event.eventType === 'UPDATE') {
        setPrograms(prev => prev.map(p => p.id === event.newRecord.id ? { ...p, ...event.newRecord } : p));
      } else if (event.eventType === 'DELETE') {
        setPrograms(prev => prev.filter(p => p.id !== (event.oldRecord?.id || event.newRecord?.id)));
      }
    });

    const unbindCourses = realtimeSyncManager.on('courses', (event) => {
      if (event.eventType === 'INSERT') {
        setCourses(prev => prev.some(c => c.id === event.newRecord.id) ? prev : [...prev, event.newRecord]);
      } else if (event.eventType === 'UPDATE') {
        setCourses(prev => prev.map(c => c.id === event.newRecord.id ? { ...c, ...event.newRecord } : c));
      } else if (event.eventType === 'DELETE') {
        setCourses(prev => prev.filter(c => c.id !== (event.oldRecord?.id || event.newRecord?.id)));
      }
    });

    // Cross-tab storage change listener for instant state sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'premier_active_student' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && parsed.firstName) {
            setActiveStudentState(parsed);
          }
        } catch {}
      }
      if (e.key === 'premier_admission_applications' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setApplications(parsed);
          }
        } catch {}
      }
      if (e.key && e.key.startsWith('premier_applicant_app_') && e.newValue) {
        try {
          const newApp = JSON.parse(e.newValue);
          if (newApp && newApp.id) {
            setApplications(prev => {
              if (prev.some(a => a.id === newApp.id)) {
                return prev.map(a => a.id === newApp.id ? newApp : a);
              }
              return [newApp, ...prev];
            });
          }
        } catch {}
      }
      if (e.key === 'premier_faculties' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setFaculties(parsed);
        } catch {}
      }
      if (e.key === 'premier_departments' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setDepartments(parsed);
        } catch {}
      }
      if (e.key === 'premier_academic_programs' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setPrograms(parsed);
        } catch {}
      }
      if (e.key === 'premier_courses' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setCourses(parsed);
        } catch {}
      }
      if (e.key === 'premier_students' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setStudents(parsed);
        } catch {}
      }
      if (e.key === 'premier_course_registrations' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setRegistrations(parsed);
        } catch {}
      }
      if (e.key === 'premier_financial_ledgers' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object') setFinancialLedgers(parsed);
        } catch {}
      }
      if (e.key === 'premier_users' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setUsers(parsed);
        } catch {}
      }
      if (e.key === 'premier_staff' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setStaff(parsed);
        } catch {}
      }
      if (e.key === 'premier_attendance_sessions' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setAttendanceSessions(parsed);
        } catch {}
      }
      if (e.key === 'premier_academic_warnings' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setAcademicWarnings(parsed);
        } catch {}
      }
      if (e.key === 'premier_system_documents' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setDocuments(parsed);
        } catch {}
      }
      if (e.key === 'premier_graduation_candidates' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setGraduationCandidates(parsed);
        } catch {}
      }
      if (e.key === 'premier_announcements' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setAnnouncements(parsed);
        } catch {}
      }
      if (e.key === 'premier_notifications' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setNotifications(parsed);
        } catch {}
      }
      if (e.key === 'premier_course_attempts' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setCourseAttempts(parsed);
        } catch {}
      }
      if (e.key === 'premier_audit_logs' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setAuditLogs(parsed);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      unbindApplications();
      unbindStudents();
      unbindRegistrations();
      unbindFinancialLedgers();
      unbindCourseAttempts();
      unbindAnnouncements();
      unbindSettings();
      unbindFaculties();
      unbindDepartments();
      unbindPrograms();
      unbindCourses();
      window.removeEventListener('storage', handleStorageChange);
      realtimeSyncManager.cleanup();
    };
  }, [refreshSupabaseData]);

  // Logging helper
  const logAction = (action: string, entity: string, details: string, entityId?: string) => {
    const newLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      userId: "usr-active",
      userName: "Authenticated Administrator",
      userRole: "admin_registrar",
      action,
      entity,
      entityId,
      details,
      ipAddress: "192.168.1.10",
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAuditLogs(prev => [newLog, ...prev]);

    if (isSupabaseConfigured()) {
      supabaseDb.createAuditLog(newLog).catch(() => {});
    }
  };

  const addNotification = (notifData: Omit<NotificationItem, 'id' | 'timestamp'>) => {
    const newNotif: NotificationItem = {
      ...notifData,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Local browser notification trigger
    pushService.showLocalNotification({
      title: newNotif.title,
      body: newNotif.message,
      category: newNotif.category === 'announcements' ? 'announcements' : 'academic'
    });

    if (isSupabaseConfigured()) {
      supabaseDb.createNotification({
        title: newNotif.title,
        message: newNotif.message,
        category: newNotif.category
      }).catch(() => {});
    }
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    if (isSupabaseConfigured()) {
      supabaseDb.updateSettings(newSettings).catch(err => {
        console.warn('Failed to push settings to Supabase:', err);
      });
    }
    logAction('UPDATE_SYSTEM_SETTINGS', 'SystemSettings', `Updated institutional configuration.`);
  };

  const addUser = (userData: Omit<SystemUser, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newUser: SystemUser = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    };
    setUsers(prev => [newUser, ...prev]);
    logAction('CREATE_USER', 'SystemUser', `Created user account for ${newUser.name} (${newUser.email})`);
  };

  const updateUserStatus = (id: string, status: SystemUser['status']) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
    logAction('UPDATE_USER_STATUS', 'SystemUser', `Changed status of user ${id} to ${status}`);
  };

  const addStaff = (staffData: Omit<StaffMember, 'id' | 'staffId'>) => {
    const newStaff: StaffMember = {
      ...staffData,
      id: `stf-${Date.now()}`,
      staffId: `PU/STF/${new Date().getFullYear()}/${String(staff.length + 1).padStart(3, '0')}`
    };
    setStaff(prev => [newStaff, ...prev]);
    logAction('ADD_STAFF_MEMBER', 'StaffMember', `Added staff member ${newStaff.firstName} ${newStaff.lastName}`);
  };

  const updateStaff = (id: string, updates: Partial<StaffMember>) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    logAction('UPDATE_STAFF_MEMBER', 'StaffMember', `Updated details for staff ID ${id}`);
  };

  const addFaculty = (facData: Omit<Faculty, 'id' | 'departmentCount' | 'totalStudents'>) => {
    const newFaculty: Faculty = {
      ...facData,
      id: `fac-${facData.code.toLowerCase()}-${Date.now().toString(36)}`,
      departmentCount: 0,
      totalStudents: 0
    };
    setFaculties(prev => {
      const next = [...prev, newFaculty];
      try { localStorage.setItem('premier_faculties', JSON.stringify(next)); } catch {}
      return next;
    });
    realtimeSyncManager.broadcast('faculties', 'INSERT', newFaculty);
    if (isSupabaseConfigured()) {
      supabaseDb.createFaculty(facData).catch(() => {});
    }
    logAction('CREATE_FACULTY', 'Faculty', `Created faculty ${newFaculty.name} (${newFaculty.code})`, newFaculty.id);
  };

  const updateFaculty = (id: string, updates: Partial<Faculty>) => {
    let updated: Faculty | undefined;
    setFaculties(prev => {
      const next = prev.map(f => {
        if (f.id === id) {
          updated = { ...f, ...updates };
          return updated;
        }
        return f;
      });
      try { localStorage.setItem('premier_faculties', JSON.stringify(next)); } catch {}
      return next;
    });
    if (updated) {
      realtimeSyncManager.broadcast('faculties', 'UPDATE', updated);
    }
    logAction('UPDATE_FACULTY', 'Faculty', `Updated faculty parameters for ${id}`, id);
  };

  const deleteFaculty = (id: string) => {
    let deleted: Faculty | undefined;
    setFaculties(prev => {
      deleted = prev.find(f => f.id === id);
      const next = prev.filter(f => f.id !== id);
      try { localStorage.setItem('premier_faculties', JSON.stringify(next)); } catch {}
      return next;
    });
    if (deleted) {
      realtimeSyncManager.broadcast('faculties', 'DELETE', deleted, deleted);
    }
    logAction('DELETE_FACULTY', 'Faculty', `Deleted faculty ID ${id}`, id);
  };

  const addDepartment = (deptData: Omit<Department, 'id' | 'programCount'>) => {
    const newDept: Department = {
      ...deptData,
      id: `dept-${deptData.code.toLowerCase()}-${Date.now().toString(36)}`,
      programCount: 0
    };
    setDepartments(prev => {
      const next = [...prev, newDept];
      try { localStorage.setItem('premier_departments', JSON.stringify(next)); } catch {}
      return next;
    });
    setFaculties(prev => {
      const next = prev.map(f => f.id === deptData.facultyId ? { ...f, departmentCount: f.departmentCount + 1 } : f);
      try { localStorage.setItem('premier_faculties', JSON.stringify(next)); } catch {}
      return next;
    });
    realtimeSyncManager.broadcast('departments', 'INSERT', newDept);
    if (isSupabaseConfigured()) {
      supabaseDb.createDepartment(deptData).catch(() => {});
    }
    logAction('CREATE_DEPARTMENT', 'Department', `Created department ${newDept.name} (${newDept.code})`, newDept.id);
  };

  const updateDepartment = (id: string, updates: Partial<Department>) => {
    let updated: Department | undefined;
    setDepartments(prev => {
      const next = prev.map(d => {
        if (d.id === id) {
          updated = { ...d, ...updates };
          return updated;
        }
        return d;
      });
      try { localStorage.setItem('premier_departments', JSON.stringify(next)); } catch {}
      return next;
    });
    if (updated) {
      realtimeSyncManager.broadcast('departments', 'UPDATE', updated);
    }
    logAction('UPDATE_DEPARTMENT', 'Department', `Updated department parameters for ${id}`, id);
  };

  const deleteDepartment = (id: string) => {
    let deleted: Department | undefined;
    setDepartments(prev => {
      deleted = prev.find(d => d.id === id);
      const next = prev.filter(d => d.id !== id);
      try { localStorage.setItem('premier_departments', JSON.stringify(next)); } catch {}
      return next;
    });
    if (deleted) {
      realtimeSyncManager.broadcast('departments', 'DELETE', deleted, deleted);
    }
    logAction('DELETE_DEPARTMENT', 'Department', `Deleted department ID ${id}`, id);
  };

  const addProgram = (progData: Omit<AcademicProgram, 'id'>) => {
    const newProg: AcademicProgram = {
      ...progData,
      id: `prg-${progData.code.toLowerCase()}-${Date.now().toString(36)}`
    };
    setPrograms(prev => {
      const next = [...prev, newProg];
      try { localStorage.setItem('premier_academic_programs', JSON.stringify(next)); } catch {}
      return next;
    });
    realtimeSyncManager.broadcast('academic_programs', 'INSERT', newProg);
    if (isSupabaseConfigured()) {
      supabaseDb.createProgram(progData).catch(() => {});
    }
    logAction('CREATE_PROGRAM', 'AcademicProgram', `Created program ${newProg.name} (${newProg.code})`, newProg.id);
  };

  const updateProgram = (id: string, updates: Partial<AcademicProgram>) => {
    let updated: AcademicProgram | undefined;
    setPrograms(prev => {
      const next = prev.map(p => {
        if (p.id === id) {
          updated = { ...p, ...updates };
          return updated;
        }
        return p;
      });
      try { localStorage.setItem('premier_academic_programs', JSON.stringify(next)); } catch {}
      return next;
    });
    if (updated) {
      realtimeSyncManager.broadcast('academic_programs', 'UPDATE', updated);
    }
    logAction('UPDATE_PROGRAM', 'AcademicProgram', `Updated degree program ${id}`, id);
  };

  const deleteProgram = (id: string) => {
    let deleted: AcademicProgram | undefined;
    setPrograms(prev => {
      deleted = prev.find(p => p.id === id);
      const next = prev.filter(p => p.id !== id);
      try { localStorage.setItem('premier_academic_programs', JSON.stringify(next)); } catch {}
      return next;
    });
    if (deleted) {
      realtimeSyncManager.broadcast('academic_programs', 'DELETE', deleted, deleted);
    }
    logAction('DELETE_PROGRAM', 'AcademicProgram', `Deleted program ID ${id}`, id);
  };

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `crs-${courseData.code.toLowerCase()}-${Date.now().toString(36)}`
    };
    setCourses(prev => {
      const next = [...prev, newCourse];
      try { localStorage.setItem('premier_courses', JSON.stringify(next)); } catch {}
      return next;
    });
    realtimeSyncManager.broadcast('courses', 'INSERT', newCourse);
    if (isSupabaseConfigured()) {
      supabaseDb.createCourse(courseData).catch(() => {});
    }
    logAction('CREATE_COURSE', 'Course', `Added curriculum course ${newCourse.code}: ${newCourse.title}`, newCourse.id);
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    let updated: Course | undefined;
    setCourses(prev => {
      const next = prev.map(c => {
        if (c.id === id) {
          updated = { ...c, ...updates };
          return updated;
        }
        return c;
      });
      try { localStorage.setItem('premier_courses', JSON.stringify(next)); } catch {}
      return next;
    });
    if (updated) {
      realtimeSyncManager.broadcast('courses', 'UPDATE', updated);
    }
    if (isSupabaseConfigured()) {
      supabaseDb.updateCourse(id, updates).catch(() => {});
    }
    logAction('UPDATE_COURSE', 'Course', `Updated course parameters for ${id}`, id);
  };

  const deleteCourse = (id: string) => {
    let deleted: Course | undefined;
    setCourses(prev => {
      deleted = prev.find(c => c.id === id);
      const next = prev.filter(c => c.id !== id);
      try { localStorage.setItem('premier_courses', JSON.stringify(next)); } catch {}
      return next;
    });
    if (deleted) {
      realtimeSyncManager.broadcast('courses', 'DELETE', deleted, deleted);
    }
    logAction('DELETE_COURSE', 'Course', `Deleted course unit ID ${id}`, id);
  };

  const updateStudent = (id: string, updates: Partial<StudentRecord>) => {
    let updatedRecord: StudentRecord | undefined;
    setStudents(prev => {
      const next = prev.map(s => {
        if (s.id === id || s.studentId === id) {
          updatedRecord = { ...s, ...updates };
          return updatedRecord;
        }
        return s;
      });
      try { localStorage.setItem('premier_students', JSON.stringify(next)); } catch {}
      return next;
    });

    if (activeStudent && (activeStudent.id === id || activeStudent.studentId === id)) {
      setActiveStudent(prev => {
        const next = { ...prev, ...updates };
        try { localStorage.setItem('premier_active_student', JSON.stringify(next)); } catch {}
        return next;
      });
    }

    if (updatedRecord) {
      realtimeSyncManager.broadcast('students', 'UPDATE', updatedRecord);
    }
    if (isSupabaseConfigured()) {
      supabaseDb.updateStudent(id, updates).catch(() => {});
    }
    logAction('UPDATE_STUDENT_RECORD', 'StudentRecord', `Updated profile for student ID ${id}`);
  };

  const updateStudentProfileExtra = (updates: Partial<StudentProfileExtra>) => {
    setStudentProfileExtra(prev => {
      const merged = { ...prev, ...updates };
      let score = 50;
      if (merged.bloodGroup) score += 10;
      if (merged.emergencyContact?.name && merged.emergencyContact?.phone) score += 20;
      if (merged.hallOfResidence) score += 10;
      if (merged.residentialAddress) score += 10;
      merged.profileCompletionPercentage = Math.min(100, score);
      return merged;
    });
  };

  const saveApplicationDraft = (draftData: Partial<AdmissionApplication>): AdmissionApplication => {
    const randomSuffix = String(Math.floor(100000 + Math.random() * 900000));
    const now = new Date().toISOString();
    let savedApp: AdmissionApplication;

    const existingIndex = applications.findIndex(
      a => (draftData.id && a.id === draftData.id) ||
           (draftData.email && a.email.toLowerCase() === draftData.email.toLowerCase() && a.status === 'draft')
    );

    if (existingIndex >= 0) {
      const existing = applications[existingIndex];
      savedApp = {
        ...existing,
        ...draftData,
        id: existing.id,
        applicationNumber: existing.applicationNumber || `APP-2026-${randomSuffix}`,
        status: 'draft',
        isDraft: true,
        lastUpdatedAt: now
      };
      setApplications(prev => {
        const next = [...prev];
        next[existingIndex] = savedApp;
        try {
          const sanitizedList = sanitizeApplicationsForStorage(next);
          localStorage.setItem('premier_admission_applications', JSON.stringify(sanitizedList));
          if (savedApp.email) {
            localStorage.setItem(`premier_applicant_app_${savedApp.email.toLowerCase()}`, JSON.stringify(sanitizeApplicationForStorage(savedApp)));
          }
        } catch {}
        return next;
      });
    } else {
      savedApp = {
        id: draftData.id || `app-${Date.now()}`,
        applicationNumber: draftData.applicationNumber || `APP-2026-${randomSuffix}`,
        firstName: draftData.firstName || '',
        lastName: draftData.lastName || '',
        email: draftData.email || '',
        phone: draftData.phone || '',
        dateOfBirth: draftData.dateOfBirth || '',
        gender: draftData.gender || 'Male',
        nationality: draftData.nationality || 'Ghanaian',
        address: draftData.address || '',
        programChoiceId: draftData.programChoiceId || '',
        programChoiceName: draftData.programChoiceName || '',
        secondarySchool: draftData.secondarySchool || '',
        completionYear: draftData.completionYear || 2025,
        aggregateScore: draftData.aggregateScore || 12,
        status: 'draft',
        isDraft: true,
        documents: draftData.documents || [],
        lastUpdatedAt: now,
        ...draftData
      };
      setApplications(prev => {
        const next = [savedApp, ...prev];
        try {
          const sanitizedList = sanitizeApplicationsForStorage(next);
          localStorage.setItem('premier_admission_applications', JSON.stringify(sanitizedList));
          if (savedApp.email) {
            localStorage.setItem(`premier_applicant_app_${savedApp.email.toLowerCase()}`, JSON.stringify(sanitizeApplicationForStorage(savedApp)));
          }
        } catch {}
        return next;
      });
    }

    logAction('SAVE_APPLICATION_DRAFT', 'AdmissionApplication', `Saved application draft ${savedApp.applicationNumber} for ${savedApp.firstName} ${savedApp.lastName}`, savedApp.id);
    return savedApp;
  };

  const submitApplication = (applicationData: Partial<AdmissionApplication>): AdmissionApplication => {
    const randomSuffix = String(Math.floor(100000 + Math.random() * 900000));
    const now = new Date().toISOString();
    const appNumber = applicationData.applicationNumber && applicationData.applicationNumber.startsWith('APP-')
      ? applicationData.applicationNumber
      : `APP-2026-${randomSuffix}`;

    const newHistoryEntry: ApplicationStatusHistory = {
      id: `hist-${Date.now()}`,
      applicationId: applicationData.id || `app-${Date.now()}`,
      previousStatus: applicationData.status || 'draft',
      newStatus: 'submitted',
      changedBy: `${applicationData.firstName || 'Applicant'} ${applicationData.lastName || ''}`.trim(),
      actorRole: 'applicant',
      notes: 'Initial online application submitted with verified declaration.',
      timestamp: now
    };

    const rawApp: AdmissionApplication = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '2006-01-01',
      gender: 'Male',
      nationality: 'Ghanaian',
      address: '',
      programChoiceId: 'prg-bsc-se',
      programChoiceName: 'BSc Software Engineering',
      secondarySchool: '',
      completionYear: 2025,
      aggregateScore: 12,
      documents: [],
      ...applicationData,
      id: applicationData.id || `app-${Date.now()}`,
      applicationNumber: appNumber,
      submittedAt: now,
      status: 'submitted',
      isDraft: false,
      statusHistory: [...(applicationData.statusHistory || []), newHistoryEntry]
    };

    // Sanitize documents to IndexedDB to guarantee lightweight storage and instant broadcast
    const newApp = sanitizeApplicationForStorage(rawApp);

    setApplications(prev => {
      const updated = [newApp, ...prev.filter(a => a.id !== newApp.id)];
      try {
        const sanitizedList = sanitizeApplicationsForStorage(updated);
        localStorage.setItem('premier_admission_applications', JSON.stringify(sanitizedList));
      } catch (e) {
        console.error('Failed to cache applications:', e);
      }
      return updated;
    });

    // Save dedicated applicant backup key for 100% resilient retrieval on page refresh
    if (newApp.email) {
      try {
        localStorage.setItem(`premier_applicant_app_${newApp.email.toLowerCase()}`, JSON.stringify(newApp));
      } catch (e) {
        console.error('Failed to save applicant backup:', e);
      }
    }

    // Real-time broadcast to Admin Portal across tabs & windows (fast & lightweight)
    realtimeSyncManager.broadcast('admission_applications', 'INSERT', newApp);
    realtimeSyncManager.playChime('submission');

    // Add internal system notification
    addNotification({
      title: "Application Received",
      message: `Your application ${newApp.applicationNumber} for ${newApp.programChoiceName} has been received and queued for review.`,
      category: "academic",
      isRead: false
    });

    logAction('SUBMIT_APPLICATION', 'AdmissionApplication', `New online application submitted: ${newApp.applicationNumber} (${newApp.firstName} ${newApp.lastName})`, newApp.id);

    if (isSupabaseConfigured()) {
      supabaseDb.createApplication(newApp).catch(err => {
        console.warn('Failed to push application to Supabase:', err);
      });
    }

    return newApp;
  };

  const refreshApplications = useCallback(() => {
    setApplications(loadAllStoredApplications());
  }, [loadAllStoredApplications]);

  const updateApplicationStatus = (id: string, status: ApplicationStatus, notes?: string) => {
    let updatedApp: AdmissionApplication | undefined;
    const now = new Date().toISOString();

    setApplications(prev => {
      const next = prev.map(app => {
        if (app.id === id) {
          const hist: ApplicationStatusHistory = {
            id: `hist-${Date.now()}`,
            applicationId: id,
            previousStatus: app.status,
            newStatus: status,
            changedBy: 'Academic Affairs Registry',
            actorRole: 'admin_registrar',
            notes: notes || `Application transitioned to ${status}`,
            timestamp: now
          };

          updatedApp = {
            ...app,
            status,
            reviewNotes: notes || app.reviewNotes,
            reviewedBy: 'Academic Affairs Registry',
            statusHistory: [...(app.statusHistory || []), hist]
          };
          return updatedApp;
        }
        return app;
      });
      try {
        const sanitizedList = sanitizeApplicationsForStorage(next);
        localStorage.setItem('premier_admission_applications', JSON.stringify(sanitizedList));
        if (updatedApp && (updatedApp as AdmissionApplication).email) {
          localStorage.setItem(`premier_applicant_app_${(updatedApp as AdmissionApplication).email.toLowerCase()}`, JSON.stringify(sanitizeApplicationForStorage(updatedApp)));
        }
      } catch {}
      return next;
    });

    if (updatedApp) {
      realtimeSyncManager.broadcast('admission_applications', 'UPDATE', sanitizeApplicationForStorage(updatedApp));
      if (status === 'approved' || status === 'enrolled') {
        realtimeSyncManager.playChime('approval');
      }
    }

    if (isSupabaseConfigured()) {
      supabaseDb.updateApplicationStatus(id, status, notes).catch(() => {});
    }

    logAction('REVIEW_ADMISSION_APPLICATION', 'AdmissionApplication', `Set status to ${status} for application ${id}`);
  };

  const requestApplicationCorrection = (applicationId: string, fields: string[], reason: string, deadline?: string) => {
    let updatedApp: AdmissionApplication | undefined;
    const now = new Date().toISOString();

    setApplications(prev => {
      const next = prev.map(app => {
        if (app.id === applicationId) {
          const hist: ApplicationStatusHistory = {
            id: `hist-${Date.now()}`,
            applicationId,
            previousStatus: app.status,
            newStatus: 'correction_required',
            changedBy: 'Academic Affairs Registry',
            actorRole: 'admin_registrar',
            notes: `Correction requested: ${reason}`,
            timestamp: now
          };

          updatedApp = {
            ...app,
            status: 'correction_required',
            correctionRequested: {
              fields,
              reason,
              deadline,
              requestedAt: now,
              requestedBy: 'Academic Affairs Registry'
            },
            statusHistory: [...(app.statusHistory || []), hist]
          };
          return updatedApp;
        }
        return app;
      });
      try {
        const sanitizedList = sanitizeApplicationsForStorage(next);
        localStorage.setItem('premier_admission_applications', JSON.stringify(sanitizedList));
        if (updatedApp && (updatedApp as AdmissionApplication).email) {
          localStorage.setItem(`premier_applicant_app_${(updatedApp as AdmissionApplication).email.toLowerCase()}`, JSON.stringify(sanitizeApplicationForStorage(updatedApp)));
        }
      } catch {}
      return next;
    });

    if (updatedApp) {
      realtimeSyncManager.broadcast('admission_applications', 'UPDATE', sanitizeApplicationForStorage(updatedApp));
      emailService.sendEmail({
        to: (updatedApp as AdmissionApplication).email,
        recipientName: `${(updatedApp as AdmissionApplication).firstName} ${(updatedApp as AdmissionApplication).lastName}`,
        event: 'application_correction',
        subject: `Action Required: Application Correction - ${settings.institutionName}`,
        templateData: {
          title: "Application Corrections Required",
          message: `The Academic Registry has reviewed your application (${(updatedApp as AdmissionApplication).applicationNumber}) and identified sections requiring correction before evaluation can proceed.`,
          details: {
            "Required Corrections": fields.join(', '),
            "Registry Comments": reason,
            "Resubmission Deadline": deadline || "Within 7 business days"
          }
        },
        institutionName: settings.institutionName
      });
    }

    logAction('REQUEST_APPLICATION_CORRECTION', 'AdmissionApplication', `Requested corrections for application ${applicationId}: ${reason}`, applicationId);
  };

  const resubmitApplication = (applicationId: string, updates: Partial<AdmissionApplication>) => {
    let updatedApp: AdmissionApplication | undefined;
    const now = new Date().toISOString();

    setApplications(prev => {
      const next = prev.map(app => {
        if (app.id === applicationId) {
          const hist: ApplicationStatusHistory = {
            id: `hist-${Date.now()}`,
            applicationId,
            previousStatus: app.status,
            newStatus: 'resubmitted',
            changedBy: `${app.firstName} ${app.lastName}`,
            actorRole: 'applicant',
            notes: 'Applicant resubmitted revised details and updated documents.',
            timestamp: now
          };

          updatedApp = {
            ...app,
            ...updates,
            status: 'resubmitted',
            lastUpdatedAt: now,
            correctionRequested: undefined,
            statusHistory: [...(app.statusHistory || []), hist]
          };
          return updatedApp;
        }
        return app;
      });
      try {
        const sanitizedList = sanitizeApplicationsForStorage(next);
        localStorage.setItem('premier_admission_applications', JSON.stringify(sanitizedList));
        if (updatedApp && (updatedApp as AdmissionApplication).email) {
          localStorage.setItem(`premier_applicant_app_${(updatedApp as AdmissionApplication).email.toLowerCase()}`, JSON.stringify(sanitizeApplicationForStorage(updatedApp)));
        }
      } catch {}
      return next;
    });

    if (updatedApp) {
      realtimeSyncManager.broadcast('admission_applications', 'UPDATE', sanitizeApplicationForStorage(updatedApp));
      realtimeSyncManager.playChime('submission');
    }

    logAction('RESUBMIT_APPLICATION', 'AdmissionApplication', `Application ${applicationId} resubmitted by candidate`, applicationId);
  };

  const updateApplicantDocumentStatus = (
    applicationId: string,
    docId: string,
    status: DocumentVerificationStatus,
    rejectionReason?: string
  ) => {
    let updatedApp: AdmissionApplication | undefined;

    setApplications(prev => {
      const next = prev.map(app => {
        if (app.id === applicationId) {
          const updatedDocs = app.documents.map(doc => {
            if (doc.id === docId) {
              return {
                ...doc,
                status,
                verificationStatus: status,
                verifiedAt: status === 'verified' ? new Date().toISOString() : undefined,
                rejectionReason: status === 'rejected' || status === 'replacement_required' ? rejectionReason : undefined
              };
            }
            return doc;
          });

          updatedApp = {
            ...app,
            documents: updatedDocs
          };
          return updatedApp;
        }
        return app;
      });
      try {
        const sanitizedList = sanitizeApplicationsForStorage(next);
        localStorage.setItem('premier_admission_applications', JSON.stringify(sanitizedList));
        if (updatedApp && (updatedApp as AdmissionApplication).email) {
          localStorage.setItem(`premier_applicant_app_${(updatedApp as AdmissionApplication).email.toLowerCase()}`, JSON.stringify(sanitizeApplicationForStorage(updatedApp)));
        }
      } catch {}
      return next;
    });

    if (updatedApp) {
      realtimeSyncManager.broadcast('admission_applications', 'UPDATE', sanitizeApplicationForStorage(updatedApp));
    }

    logAction('VERIFY_APPLICANT_DOCUMENT', 'ApplicantDocument', `Set document ${docId} in application ${applicationId} to ${status}`);
  };

  const issueAdmissionOffer = (
    applicationId: string,
    conditions?: string[],
    deadline?: string
  ): AdmissionOffer => {
    const app = applications.find(a => a.id === applicationId);
    if (!app) throw new Error("Application not found");

    const now = new Date().toISOString();
    const expiry = deadline || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const offer: AdmissionOffer = {
      id: `off-${Date.now()}`,
      applicationId: app.id,
      applicationNumber: app.applicationNumber,
      applicantId: app.applicantId || app.id,
      applicantName: `${app.firstName} ${app.lastName}`,
      programId: app.programChoiceId,
      programName: app.programChoiceName,
      facultyName: app.facultyName || 'Faculty of Computing & Information Systems',
      departmentName: app.departmentName || 'Department of Information Technology',
      academicSession: settings.currentSession,
      entryLevel: '100',
      studyMode: app.studyMode || 'Full-Time Regular',
      offerDate: now.split('T')[0],
      acceptanceDeadline: expiry,
      status: 'offered',
      admissionConditions: conditions && conditions.length > 0 ? conditions : [
        'Submission of original WASSCE / SSCE statement of results for registry verification',
        'Satisfactory medical examination report from an accredited institutional clinic',
        'Payment of academic acceptance facility fee prior to enrollment orientation'
      ]
    };

    const hist: ApplicationStatusHistory = {
      id: `hist-${Date.now()}`,
      applicationId: app.id,
      previousStatus: app.status,
      newStatus: 'admission_offered',
      changedBy: 'Admissions & Matriculation Directorate',
      actorRole: 'admin_registrar',
      notes: `Official admission offer generated for ${app.programChoiceName}. Acceptance deadline: ${expiry}`,
      timestamp: now
    };

    const updatedApp: AdmissionApplication = {
      ...app,
      status: 'admission_offered',
      offer,
      statusHistory: [...(app.statusHistory || []), hist]
    };

    setApplications(prev => {
      const next = prev.map(a => a.id === applicationId ? updatedApp : a);
      try {
        const sanitizedList = sanitizeApplicationsForStorage(next);
        localStorage.setItem('premier_admission_applications', JSON.stringify(sanitizedList));
        if (updatedApp.email) {
          localStorage.setItem(`premier_applicant_app_${updatedApp.email.toLowerCase()}`, JSON.stringify(sanitizeApplicationForStorage(updatedApp)));
        }
      } catch {}
      return next;
    });

    realtimeSyncManager.broadcast('admission_applications', 'UPDATE', sanitizeApplicationForStorage(updatedApp));
    realtimeSyncManager.playChime('approval');

    // Create formal system document for Offer Letter
    const offerDoc: SystemDocument = {
      id: `doc-offer-${Date.now()}`,
      title: `Official Offer of Admission - ${app.firstName} ${app.lastName}`,
      fileName: `Admission_Offer_${app.applicationNumber}.pdf`,
      category: "admission_letter",
      fileSize: "385 KB",
      fileType: "PDF",
      uploadedBy: "Admissions Directorate",
      uploadedAt: now.split('T')[0],
      studentId: app.id,
      downloadUrl: "#",
      isVerified: true,
      status: "active"
    };
    setDocuments(prev => [offerDoc, ...prev]);

    emailService.sendEmail({
      to: app.email,
      recipientName: `${app.firstName} ${app.lastName}`,
      event: 'admission_offered',
      subject: `Official Offer of Admission - ${settings.institutionName}`,
      templateData: {
        title: "Provisional Offer of Admission",
        message: `Congratulations ${app.firstName}! The Admissions Board has approved your application into ${app.programChoiceName}. Please review and formally accept your admission offer via your Applicant Portal.`,
        details: {
          "Application Ref": app.applicationNumber,
          "Offered Program": app.programChoiceName,
          "Commencing Level": "100",
          "Acceptance Deadline": expiry
        }
      },
      institutionName: settings.institutionName
    });

    logAction('ISSUE_ADMISSION_OFFER', 'AdmissionOffer', `Issued offer ${offer.id} for application ${app.applicationNumber}`, offer.id);
    return offer;
  };

  const respondToAdmissionOffer = (applicationId: string, accept: boolean) => {
    const now = new Date().toISOString();
    let updatedApp: AdmissionApplication | undefined;

    setApplications(prev => {
      const next = prev.map(app => {
        if (app.id === applicationId) {
          const nextStatus: ApplicationStatus = accept ? 'offer_accepted' : 'offer_declined';
          const updatedOffer: AdmissionOffer | undefined = app.offer ? {
            ...app.offer,
            status: accept ? 'accepted' : 'declined',
            decisionDate: now
          } : undefined;

          const hist: ApplicationStatusHistory = {
            id: `hist-${Date.now()}`,
            applicationId,
            previousStatus: app.status,
            newStatus: nextStatus,
            changedBy: `${app.firstName} ${app.lastName}`,
            actorRole: 'applicant',
            notes: accept
              ? 'Applicant accepted the provisional offer of admission.'
              : 'Applicant declined the offer of admission.',
            timestamp: now
          };

          updatedApp = {
            ...app,
            status: nextStatus,
            offer: updatedOffer,
            statusHistory: [...(app.statusHistory || []), hist]
          };
          return updatedApp;
        }
        return app;
      });
      try {
        const sanitizedList = sanitizeApplicationsForStorage(next);
        localStorage.setItem('premier_admission_applications', JSON.stringify(sanitizedList));
        if (updatedApp && (updatedApp as AdmissionApplication).email) {
          localStorage.setItem(`premier_applicant_app_${(updatedApp as AdmissionApplication).email.toLowerCase()}`, JSON.stringify(sanitizeApplicationForStorage(updatedApp)));
        }
      } catch {}
      return next;
    });

    if (updatedApp) {
      realtimeSyncManager.broadcast('admission_applications', 'UPDATE', sanitizeApplicationForStorage(updatedApp));
      if (accept) {
        realtimeSyncManager.playChime('approval');
        try {
          enrollApplicantAsStudent(applicationId);
        } catch (e) {
          console.error("Auto-enroll on offer acceptance:", e);
        }
      }
    }

    logAction(accept ? 'ACCEPT_ADMISSION_OFFER' : 'DECLINE_ADMISSION_OFFER', 'AdmissionApplication', `Candidate ${accept ? 'accepted' : 'declined'} admission offer for ${applicationId}`, applicationId);
  };

  // Admissions -> Student Record Conversion Engine (Idempotent & Multi-Tenancy Safe)
  const enrollApplicantAsStudent = (applicationId: string) => {
    const app = applications.find(a => a.id === applicationId);
    if (!app) throw new Error("Application not found");

    // Idempotency: If already enrolled, return existing student ID
    if (app.status === 'enrolled' && app.allocatedStudentId) {
      return { studentId: app.id, matricNo: app.allocatedStudentId };
    }

    // Lookup academic program details dynamically
    const prog = programs.find(p => p.id === app.programChoiceId);
    const progCode = prog?.code || (app.programChoiceName.includes('Information') ? 'BIT' : 'BCS');
    const deptName = prog?.departmentName || app.departmentName || "Department of Information Technology";
    const facName = prog?.facultyName || app.facultyName || "Faculty of Computing & Information Systems";

    const newMatric = `PU/${progCode}/2026/${String(students.length + 1).padStart(3, '0')}`;
    const newStudentId = `std-${Date.now()}`;

    const newStudentRecord: StudentRecord = {
      id: newStudentId,
      profileId: `usr-${newStudentId}`,
      studentId: newMatric,
      firstName: app.firstName,
      lastName: app.lastName,
      email: `${app.firstName.toLowerCase()}.${app.lastName.toLowerCase()}@premier.edu`,
      phone: app.phone,
      programId: app.programChoiceId,
      programName: app.programChoiceName,
      programCode: progCode,
      department: deptName,
      faculty: facName,
      currentLevel: "100",
      status: "active",
      currentCgpa: 0.00,
      creditsEarned: 0,
      requiredCredits: 132,
      admissionSession: settings.currentSession,
      admissionDate: new Date().toISOString().split('T')[0],
      academicStanding: "Good Standing",
      applicantEmail: app.email
    };

    setStudents(prev => [newStudentRecord, ...prev]);
    setActiveStudent(newStudentRecord);

    // Initialize Tuition Ledger for the new student
    const defaultTuition = 4500;
    setFinancialLedgers(prev => {
      if (prev[newMatric]) return prev;
      const next = {
        ...prev,
        [newMatric]: {
          studentId: newMatric,
          totalBilled: defaultTuition,
          totalPaid: 0,
          balance: defaultTuition,
          isCleared: false,
          transactions: []
        }
      };
      try { localStorage.setItem('premier_financial_ledgers', JSON.stringify(next)); } catch {}
      return next;
    });

    // Persist system user accounts for student login (both institutional & applicant email)
    try {
      const localUsers = localStorage.getItem('premier_system_users');
      const userList: any[] = localUsers ? JSON.parse(localUsers) : [];
      let studentPwd = 'premier2026';
      try {
        const rawAccs = localStorage.getItem('premier_applicant_accounts');
        if (rawAccs) {
          const accList: any[] = JSON.parse(rawAccs);
          const matchedAcc = accList.find((a: any) => a.email.toLowerCase() === app.email.toLowerCase());
          if (matchedAcc?.password) studentPwd = matchedAcc.password;
        }
      } catch {}

      const sysUserInst = {
        id: newStudentRecord.profileId,
        name: `${app.firstName} ${app.lastName}`,
        email: newStudentRecord.email,
        role: 'student',
        status: 'active',
        department: deptName,
        lastLogin: 'Never',
        createdAt: new Date().toISOString(),
        phone: app.phone,
        password: studentPwd
      };

      const sysUserApp = {
        id: `usr-app-${newStudentId}`,
        name: `${app.firstName} ${app.lastName}`,
        email: app.email,
        role: 'student',
        status: 'active',
        department: deptName,
        lastLogin: 'Never',
        createdAt: new Date().toISOString(),
        phone: app.phone,
        password: studentPwd
      };

      const nextUsers = [
        sysUserInst,
        sysUserApp,
        ...userList.filter((u: any) => u.email.toLowerCase() !== newStudentRecord.email.toLowerCase() && u.email.toLowerCase() !== app.email.toLowerCase())
      ];
      localStorage.setItem('premier_system_users', JSON.stringify(nextUsers));
    } catch {}

    const hist: ApplicationStatusHistory = {
      id: `hist-${Date.now()}`,
      applicationId: app.id,
      previousStatus: app.status,
      newStatus: 'enrolled',
      changedBy: 'Academic Affairs Registry',
      actorRole: 'admin_registrar',
      notes: `Applicant matriculated as student ${newMatric}.`,
      timestamp: new Date().toISOString()
    };

    // Update application state
    const enrolledApp: AdmissionApplication = {
      ...app,
      status: 'enrolled',
      allocatedStudentId: newMatric,
      statusHistory: [...(app.statusHistory || []), hist]
    };

    setApplications(prev => {
      const next = prev.map(a => a.id === applicationId ? enrolledApp : a);
      try {
        const sanitizedList = sanitizeApplicationsForStorage(next);
        localStorage.setItem('premier_admission_applications', JSON.stringify(sanitizedList));
        if (enrolledApp.email) {
          localStorage.setItem(`premier_applicant_app_${enrolledApp.email.toLowerCase()}`, JSON.stringify(sanitizeApplicationForStorage(enrolledApp)));
        }
      } catch {}
      return next;
    });

    // Broadcast in real-time so applicant portal turns to enrolled and unlocks SIS
    realtimeSyncManager.broadcast('admission_applications', 'UPDATE', sanitizeApplicationForStorage(enrolledApp));
    realtimeSyncManager.broadcast('students', 'INSERT', newStudentRecord);
    realtimeSyncManager.playChime('approval');

    // Create admission letter document
    const admissionDoc: SystemDocument = {
      id: `doc-${Date.now()}`,
      title: `Undergraduate Admission Letter - ${app.firstName} ${app.lastName}`,
      fileName: `Admission_Letter_${newMatric.replace(/\//g, '_')}.pdf`,
      category: "admission_letter",
      fileSize: "410 KB",
      fileType: "PDF",
      uploadedBy: "Admissions Directorate",
      uploadedAt: new Date().toISOString().split('T')[0],
      studentId: newStudentId,
      downloadUrl: "#",
      isVerified: true,
      status: "active"
    };
    setDocuments(prev => [admissionDoc, ...prev]);

    // Dispatch email notification
    emailService.sendEmail({
      to: app.email,
      recipientName: `${app.firstName} ${app.lastName}`,
      event: "admission_enrolled",
      subject: `Official Admission & Matriculation Notice - ${settings.institutionName}`,
      templateData: {
        title: "Offer of Admission & Matriculation Confirmed",
        message: `Congratulations ${app.firstName}! You have been formally matriculated into the ${app.programChoiceName} programme. Your official Student Identification Number is ${newMatric}.`,
        details: {
          "Student ID / Matric No": newMatric,
          "Academic Programme": app.programChoiceName,
          "Commencing Level": "100",
          "Session": settings.currentSession
        }
      },
      institutionName: settings.institutionName
    });

    const emailLog: EmailLogEntry = {
      id: `eml-${Date.now()}`,
      recipientEmail: app.email,
      recipientName: `${app.firstName} ${app.lastName}`,
      subject: `Official Admission & Matriculation Notice - ${settings.institutionName}`,
      event: "admission_enrolled",
      status: "delivered",
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      triggerSource: "Admissions Onboarding Engine"
    };
    setEmailLogs(prev => [emailLog, ...prev]);

    // Push remote DB mutation
    if (isSupabaseConfigured()) {
      supabaseDb.createStudent(newStudentRecord).catch(() => {});
      supabaseDb.updateApplicationStatus(applicationId, 'enrolled', undefined, newMatric).catch(() => {});
    }

    logAction('ENROLLED_NEW_STUDENT', 'StudentRecord', `Enrolled applicant ${app.firstName} ${app.lastName} as student ${newMatric}`, newStudentId);

    return { studentId: newStudentId, matricNo: newMatric };
  };

  // Course Registration Workflow Engine
  const submitCourseRegistration = (registration: CourseRegistrationSlip) => {
    setRegistrations(prev => {
      const next = [registration, ...prev.filter(r => r.id !== registration.id)];
      try { localStorage.setItem('premier_course_registrations', JSON.stringify(next)); } catch {}
      return next;
    });

    realtimeSyncManager.broadcast('course_registrations', 'INSERT', registration);

    addNotification({
      title: "Course Registration Submitted",
      message: `Your registration slip for ${registration.academicSession} (${registration.totalCredits} credits) has been submitted for Academic Board review.`,
      category: "registration",
      isRead: false
    });

    if (isSupabaseConfigured()) {
      supabaseDb.createRegistration(registration).catch(() => {});
    }

    logAction('SUBMIT_COURSE_REGISTRATION', 'CourseRegistration', `Submitted ${registration.totalCredits} credits for student ${registration.studentId}`);
  };

  const approveCourseRegistration = (registrationId: string, approvedBy: string = 'Registrar Office') => {
    let approvedRecord: CourseRegistrationSlip | undefined;

    setRegistrations(prev => {
      const next = prev.map(reg => {
        if (reg.id === registrationId) {
          approvedRecord = {
            ...reg,
            status: 'approved',
            approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            approvedBy,
            items: reg.items.map(it => ({ ...it, status: 'approved' }))
          };

          // Generate official Course Registration Slip document
          const regDoc: SystemDocument = {
            id: `doc-reg-${Date.now()}`,
            title: `Official Registration Slip - ${reg.academicSession} ${reg.semester}`,
            fileName: `Registration_Slip_${reg.studentId.replace(/\//g, '_')}_${reg.semester.replace(/\s+/g, '_')}.pdf`,
            category: 'registration_slip',
            fileSize: '240 KB',
            fileType: 'PDF',
            uploadedBy: approvedBy,
            uploadedAt: new Date().toISOString().split('T')[0],
            studentId: reg.studentId,
            downloadUrl: '#',
            isVerified: true,
            status: 'active'
          };
          setDocuments(dPrev => [regDoc, ...dPrev]);

          addNotification({
            title: "Registration Approved",
            message: `Your course registration for ${reg.academicSession} has been approved by the Registrar. Official registration slip is now available in your documents.`,
            category: "registration",
            isRead: false
          });

          return approvedRecord;
        }
        return reg;
      });
      try { localStorage.setItem('premier_course_registrations', JSON.stringify(next)); } catch {}
      return next;
    });

    if (approvedRecord) {
      realtimeSyncManager.broadcast('course_registrations', 'UPDATE', approvedRecord);
      realtimeSyncManager.playChime('approval');
    }

    if (isSupabaseConfigured()) {
      supabaseDb.updateRegistrationStatus(registrationId, 'approved', approvedBy).catch(() => {});
    }

    logAction('APPROVE_COURSE_REGISTRATION', 'CourseRegistration', `Approved course registration ${registrationId} by ${approvedBy}`);
  };

  const rejectCourseRegistration = (registrationId: string, reason: string) => {
    let rejectedRecord: CourseRegistrationSlip | undefined;

    setRegistrations(prev => {
      const next = prev.map(reg => {
        if (reg.id === registrationId) {
          rejectedRecord = { ...reg, status: 'rejected' };
          return rejectedRecord;
        }
        return reg;
      });
      try { localStorage.setItem('premier_course_registrations', JSON.stringify(next)); } catch {}
      return next;
    });

    if (rejectedRecord) {
      realtimeSyncManager.broadcast('course_registrations', 'UPDATE', rejectedRecord);
    }
    
    addNotification({
      title: "Registration Rejected",
      message: `Your course registration was rejected: ${reason}. Please update your course selection and resubmit.`,
      category: "registration",
      isRead: false
    });

    if (isSupabaseConfigured()) {
      supabaseDb.updateRegistrationStatus(registrationId, 'rejected').catch(() => {});
    }

    logAction('REJECT_COURSE_REGISTRATION', 'CourseRegistration', `Rejected registration ${registrationId}: ${reason}`);
  };

  // Academic Warnings
  const issueWarning = (warningData: Omit<AcademicWarning, 'id' | 'issuedDate' | 'status'>) => {
    const newWarning: AcademicWarning = {
      ...warningData,
      id: `wrn-${Date.now()}`,
      issuedDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    setAcademicWarnings(prev => [newWarning, ...prev]);

    addNotification({
      title: `Academic Alert: ${newWarning.severity.toUpperCase()} WARNING`,
      message: newWarning.reason,
      category: "academic",
      isRead: false
    });

    logAction('ISSUED_ACADEMIC_WARNING', 'AcademicWarning', `Issued ${newWarning.severity} warning to ${newWarning.studentName}`, newWarning.id);
  };

  const resolveWarning = (id: string) => {
    setAcademicWarnings(prev => prev.map(w => w.id === id ? { ...w, status: 'resolved' } : w));
    logAction('RESOLVED_ACADEMIC_WARNING', 'AcademicWarning', `Resolved warning record ${id}`);
  };

  // Attendance Engine with configurable warning thresholds
  const recordAttendance = (sessionData: Omit<AttendanceSession, 'id'>) => {
    const newSession: AttendanceSession = {
      ...sessionData,
      id: `att-ses-${Date.now()}`
    };
    setAttendanceSessions(prev => [newSession, ...prev]);

    // Check attendance percentage against SystemSettings warning threshold
    const attendancePercent = (newSession.presentCount / newSession.totalStudents) * 100;
    const threshold = settings.attendanceWarningThresholdPercent || 75;

    if (attendancePercent < threshold) {
      // Find absent students in this session to issue attendance warnings to
      const absentRecords = newSession.records?.filter(r => r.status === 'absent') || [];
      if (absentRecords.length > 0) {
        absentRecords.forEach(rec => {
          const targetStudent = students.find(s => s.id === rec.studentId || s.studentId === rec.matricNo || s.studentId === rec.studentId);
          if (targetStudent) {
            issueWarning({
              studentId: targetStudent.studentId,
              studentName: `${targetStudent.firstName} ${targetStudent.lastName}`,
              matricNo: targetStudent.studentId,
              program: targetStudent.programName,
              level: targetStudent.currentLevel,
              cgpa: targetStudent.currentCgpa,
              failedCoursesCount: 0,
              severity: 'moderate',
              reason: `Course attendance for ${newSession.courseCode} is below the required ${threshold}% institutional threshold (recorded absent on ${newSession.date}).`,
              remediationPlan: `Meet with course instructor and maintain regular class attendance.`
            });
          }
        });
      }
    }

    if (isSupabaseConfigured()) {
      supabaseDb.recordAttendance(newSession).catch(() => {});
    }

    logAction('RECORDED_ATTENDANCE', 'AttendanceSession', `Recorded session for ${newSession.courseCode} (${newSession.presentCount}/${newSession.totalStudents} present)`);
  };

  // Student Course Grade & Assessment Engine
  const recordCourseGrade = (payload: {
    studentId: string;
    courseCode: string;
    courseTitle: string;
    credits: number;
    score: number;
    academicSession?: string;
    semester?: string;
  }) => {
    const scale = settings.gradingScale || DEFAULT_SYSTEM_SETTINGS.gradingScale;
    const gradeDetails = academicEngine.getGradeDetails(payload.score, scale);
    const session = payload.academicSession || settings.currentSession;
    const semester = payload.semester || settings.currentSemester;

    const newAttempt: CourseAttempt = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      studentId: payload.studentId,
      courseCode: payload.courseCode,
      courseTitle: payload.courseTitle,
      credits: payload.credits,
      academicSession: session,
      semester: semester,
      attemptNumber: 1,
      score: payload.score,
      totalScore: payload.score,
      grade: gradeDetails.grade,
      gradePoint: gradeDetails.gradePoint,
      status: gradeDetails.isPassing ? 'passed' : 'failed'
    };

    setCourseAttempts(prev => {
      const existingIdx = prev.findIndex(a =>
        (a.studentId === payload.studentId || (!a.studentId && (payload.studentId === activeStudent.studentId || payload.studentId === activeStudent.id))) &&
        a.courseCode === payload.courseCode &&
        a.academicSession === session &&
        a.semester === semester
      );
      let next: CourseAttempt[];
      if (existingIdx >= 0) {
        next = [...prev];
        next[existingIdx] = {
          ...prev[existingIdx],
          ...newAttempt,
          attemptNumber: (prev[existingIdx].attemptNumber || 1) + 1
        };
      } else {
        next = [newAttempt, ...prev];
      }
      try {
        localStorage.setItem('premier_course_attempts', JSON.stringify(next));
      } catch {}
      return next;
    });

    realtimeSyncManager.broadcast('student_course_grades', 'INSERT', newAttempt);

    // Recalculate and update cumulative CGPA & Credits in real time
    const studentAttempts = courseAttempts.filter(a =>
      a.studentId === payload.studentId ||
      a.studentId === activeStudent.studentId ||
      a.studentId === activeStudent.id ||
      (!a.studentId && payload.studentId === activeStudent.studentId)
    );
    const updatedAttempts = [newAttempt, ...studentAttempts.filter(a => a.courseCode !== payload.courseCode)];
    const cum = academicEngine.calculateCumulativeCgpa(updatedAttempts, scale);

    updateStudent(payload.studentId, {
      currentCgpa: cum.cgpa,
      creditsEarned: cum.totalCreditsEarned
    });

    if (activeStudent.studentId === payload.studentId || activeStudent.id === payload.studentId) {
      setActiveStudent(prev => ({
        ...prev,
        currentCgpa: cum.cgpa,
        creditsEarned: cum.totalCreditsEarned
      }));
    }

    logAction('RECORD_COURSE_GRADE', 'AcademicGrade', `Recorded grade ${gradeDetails.grade} (${payload.score}%) for ${payload.studentId} in ${payload.courseCode}`, newAttempt.id);
  };

  // Finance & Bursary Payment Engine
  const recordPayment = (payment: {
    studentId: string;
    studentName: string;
    matricNo: string;
    amount: number;
    description: string;
    gateway: string;
    reference: string;
  }) => {
    setFinancialLedgers(prev => {
      const current = prev[payment.matricNo] || prev[payment.studentId] || {
        studentId: payment.matricNo,
        totalBilled: payment.amount,
        totalPaid: 0,
        balance: payment.amount,
        isCleared: false,
        transactions: []
      };

      const newTotalPaid = current.totalPaid + payment.amount;
      const newBalance = Math.max(0, current.totalBilled - newTotalPaid);
      const isCleared = newBalance <= 0;

      const newTxn = {
        id: `txn-${Date.now()}`,
        reference: payment.reference,
        amount: payment.amount,
        description: payment.description,
        date: new Date().toISOString().split('T')[0],
        gateway: payment.gateway,
        status: 'successful' as const
      };

      const updatedLedger = {
        ...current,
        totalPaid: newTotalPaid,
        balance: newBalance,
        isCleared,
        transactions: [newTxn, ...current.transactions]
      };

      const nextLedgers = {
        ...prev,
        [payment.matricNo]: updatedLedger,
        ...(payment.studentId && payment.studentId !== payment.matricNo ? { [payment.studentId]: updatedLedger } : {})
      };

      try {
        localStorage.setItem('premier_financial_ledgers', JSON.stringify(nextLedgers));
      } catch {}

      realtimeSyncManager.broadcast('financial_ledgers', 'UPDATE', nextLedgers);
      realtimeSyncManager.playChime('payment');

      return nextLedgers;
    });

    // Generate Payment Receipt Document
    const receiptDoc: SystemDocument = {
      id: `doc-rcpt-${Date.now()}`,
      title: `Official Bursary Receipt - ${payment.reference}`,
      fileName: `Receipt_${payment.reference}.pdf`,
      category: 'financial_receipt',
      fileSize: '190 KB',
      fileType: 'PDF',
      uploadedBy: 'Bursary Payment Gateway',
      uploadedAt: new Date().toISOString().split('T')[0],
      studentId: payment.matricNo,
      downloadUrl: '#',
      isVerified: true,
      status: 'active'
    };
    setDocuments(prev => [receiptDoc, ...prev]);

    addNotification({
      title: "Payment Receipt Generated",
      message: `Your payment of ${settings.currency || 'GHS'} ${payment.amount.toLocaleString()} has been verified. Official receipt #${payment.reference} has been issued.`,
      category: "finance",
      isRead: false
    });

    logAction('VERIFIED_BURSARY_PAYMENT', 'FinancialTransaction', `Reconciled payment ${payment.reference} of ${payment.amount} for student ${payment.matricNo}`);
  };

  const addDocument = (docData: Omit<SystemDocument, 'id' | 'uploadedAt'>) => {
    const newDoc: SystemDocument = {
      ...docData,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [newDoc, ...prev]);
    logAction('UPLOADED_DOCUMENT', 'SystemDocument', `Uploaded document: ${newDoc.title}`);
  };

  // Graduation Approval Workflow
  const updateGraduationStatus = (id: string, status: GraduationCandidateStatus) => {
    setGraduationCandidates(prev => prev.map(c => {
      if (c.id === id) {
        const certNum = status === 'graduated' && !c.certificateNumber 
          ? `PU/CERT/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}` 
          : c.certificateNumber;

        const compDate = status === 'graduated' && !c.completionDate 
          ? new Date().toISOString().split('T')[0] 
          : c.completionDate;

        if (status === 'graduated') {
          // Generate Degree Certificate document
          const certDoc: SystemDocument = {
            id: `doc-cert-${Date.now()}`,
            title: `Official Degree Certificate - ${c.studentName}`,
            fileName: `Degree_Certificate_${c.studentId.replace(/\//g, '_')}.pdf`,
            category: 'completion_certificate',
            fileSize: '820 KB',
            fileType: 'PDF',
            uploadedBy: 'University Senate',
            uploadedAt: new Date().toISOString().split('T')[0],
            studentId: c.studentId,
            downloadUrl: '#',
            isVerified: true,
            status: 'active'
          };
          setDocuments(dPrev => [certDoc, ...dPrev]);

          addNotification({
            title: "Degree Awarded & Conferred",
            message: `Congratulations! Your Bachelor's Degree has been conferred by Senate. Certificate #${certNum} is now available in your document repository.`,
            category: "graduation",
            isRead: false
          });
        }

        return {
          ...c,
          status,
          certificateNumber: certNum,
          completionDate: compDate
        };
      }
      return c;
    }));

    logAction('UPDATED_GRADUATION_STATUS', 'GraduationCandidate', `Set candidate ${id} status to ${status}`);
  };

  const addAnnouncement = (annData: Omit<Announcement, 'id' | 'publishedAt' | 'readCount'>) => {
    const newAnn: Announcement = {
      ...annData,
      id: `ann-${Date.now()}`,
      publishedAt: new Date().toISOString().split('T')[0],
      readCount: 0
    };
    setAnnouncements(prev => [newAnn, ...prev]);

    addNotification({
      title: `Announcement: ${newAnn.title}`,
      message: newAnn.content.slice(0, 120) + (newAnn.content.length > 120 ? '...' : ''),
      category: "announcements",
      isRead: false
    });

    if (isSupabaseConfigured()) {
      supabaseDb.createAnnouncement(annData).catch(() => {});
    }

    logAction('PUBLISHED_ANNOUNCEMENT', 'Announcement', `Published announcement: ${newAnn.title}`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const updatePushPreferences = (prefs: Partial<PushSubscriptionPreferences>) => {
    setPushPreferences(prev => ({ ...prev, ...prefs }));
  };

  return (
    <SchoolContext.Provider
      value={{
        settings,
        updateSettings,
        users,
        addUser,
        updateUserStatus,
        staff,
        staffList: staff,
        financialRecords: Object.values(financialLedgers),
        addStaff,
        updateStaff,
        faculties,
        addFaculty,
        updateFaculty,
        deleteFaculty,
        departments,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        programs,
        addProgram,
        updateProgram,
        deleteProgram,
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        students,
        activeStudent,
        setActiveStudent,
        updateStudent,
        studentProfileExtra,
        updateStudentProfileExtra,
        applications,
        refreshApplications,
        saveApplicationDraft,
        submitApplication,
        updateApplicationStatus,
        requestApplicationCorrection,
        resubmitApplication,
        issueAdmissionOffer,
        respondToAdmissionOffer,
        updateApplicantDocumentStatus,
        enrollApplicantAsStudent,
        registrations,
        submitCourseRegistration,
        approveCourseRegistration,
        rejectCourseRegistration,
        carryovers,
        courseAttempts,
        recordCourseGrade,
        academicWarnings,
        issueWarning,
        resolveWarning,
        attendanceSessions,
        recordAttendance,
        financialLedgers,
        recordPayment,
        documents,
        addDocument,
        graduationCandidates,
        updateGraduationStatus,
        announcements,
        addAnnouncement,
        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        pushPreferences,
        updatePushPreferences,
        emailLogs,
        auditLogs,
        logAction,
        isSearchOpen,
        setIsSearchOpen,
        supabaseStatus,
        refreshSupabaseData
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = (): SchoolContextType => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
