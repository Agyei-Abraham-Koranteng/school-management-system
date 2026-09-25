import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile, StudentRecord, ApplicantAccount, SystemUser, AdmissionApplication, ApplicationStatus } from '../types';
import { SAMPLE_STUDENT, SAMPLE_ALL_STUDENTS, SAMPLE_USERS } from '../data/mockData';

export interface LoginResult {
  success: boolean;
  error?: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  student: StudentRecord | null;
  role: UserRole;
  currentRole: UserRole;
  isAuthenticated: boolean;
  applicantAccount: ApplicantAccount | null;
  login: (param1: string, param2?: string, param3?: UserRole) => LoginResult;
  registerApplicant: (data: { firstName: string; lastName: string; email: string; phone: string; password?: string }) => ApplicantAccount;
  loginApplicant: (email: string, password?: string) => ApplicantAccount;
  proceedToStudentDashboard: (studentData?: Partial<StudentRecord>) => void;
  linkApplicantApplication: (applicationId: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateStudentLevel: (newLevel: '100' | '200' | '300' | '400') => void;
}

// Built-in institutional accounts with default passwords
const DEFAULT_SYSTEM_ACCOUNTS: Array<SystemUser & { password: string }> = [
  {
    id: "usr-01",
    name: "Abraham Koranteng",
    email: "abraham.koranteng@premier.edu",
    password: "premier2026",
    role: "student",
    status: "active",
    department: "Department of Information Technology",
    lastLogin: "Today, 10:14 AM",
    createdAt: "2024-09-10",
    phone: "+233 24 555 0192",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
  },
  {
    id: "usr-02",
    name: "Dr. Kwesi Mensah",
    email: "kwesi.mensah@premier.edu",
    password: "premier2026",
    role: "lecturer",
    status: "active",
    department: "Department of Information Technology",
    lastLogin: "Yesterday, 4:20 PM",
    createdAt: "2021-02-15",
    phone: "+233 20 123 4567",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  {
    id: "usr-03",
    name: "Evelyn Ofori-Atta",
    email: "registrar@premier.edu",
    password: "premier2026",
    role: "admin_registrar",
    status: "active",
    department: "Academic Affairs Directorate",
    lastLogin: "Today, 08:05 AM",
    createdAt: "2020-08-01",
    phone: "+233 24 999 8888",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
  },
  {
    id: "usr-04",
    name: "Samuel Baidoo",
    email: "finance@premier.edu",
    password: "premier2026",
    role: "finance_officer",
    status: "active",
    department: "Finance & Bursary Division",
    lastLogin: "2 days ago",
    createdAt: "2022-01-10",
    phone: "+233 26 777 5544",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
  },
  {
    id: "usr-05",
    name: "Prof. Kenneth Sarpong",
    email: "superadmin@premier.edu",
    password: "premier2026",
    role: "super_admin",
    status: "active",
    department: "Vice Chancellor's Office",
    lastLogin: "Today, 07:30 AM",
    createdAt: "2019-01-01",
    phone: "+233 50 111 2233",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
  },
  {
    id: "usr-06",
    name: "Dr. Marcus Thorne",
    email: "marcus.thorne@premier.edu",
    password: "premier2026",
    role: "lecturer",
    status: "active",
    department: "Department of Computer Science",
    lastLogin: "3 days ago",
    createdAt: "2022-09-01",
    phone: "+233 27 654 3210"
  },
  {
    id: "usr-07",
    name: "Beatrice Aidoo",
    email: "beatrice.aidoo@premier.edu",
    password: "premier2026",
    role: "student",
    status: "suspended",
    department: "Department of Information Technology",
    lastLogin: "1 month ago",
    createdAt: "2023-09-10",
    phone: "+233 24 111 2233"
  },
  {
    id: "usr-08",
    name: "Grace Mensah",
    email: "grace.mensah@premier.edu",
    password: "premier2026",
    role: "student",
    status: "inactive",
    department: "Department of Information Technology",
    lastLogin: "2 months ago",
    createdAt: "2024-01-15",
    phone: "+233 24 333 4455"
  }
];

// Default seed applicant accounts
const DEFAULT_SEED_APPLICANTS: ApplicantAccount[] = [
  {
    id: "app-acc-emmanuel",
    firstName: "Emmanuel",
    lastName: "Tetteh",
    email: "emmanuel.tetteh@gmail.com",
    phone: "+233 24 123 4567",
    password: "premier2026",
    createdAt: "2026-02-10T10:00:00Z",
    hasApplied: true,
    applicationId: "app-001"
  },
  {
    id: "app-acc-mercy",
    firstName: "Mercy",
    lastName: "Danso",
    email: "mercy.danso@outlook.com",
    phone: "+233 20 987 6543",
    password: "premier2026",
    createdAt: "2026-02-14T14:30:00Z",
    hasApplied: true,
    applicationId: "app-002"
  },
  {
    id: "app-acc-kwame",
    firstName: "Kwame",
    lastName: "Mensah",
    email: "kwame.mensah.applicant@gmail.com",
    phone: "+233 24 456 7890",
    password: "premier2026",
    createdAt: "2026-02-18T09:15:00Z",
    hasApplied: false
  }
];

const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  applicant: {
    id: "usr-app-01",
    email: "applicant@gmail.com",
    firstName: "Admissions",
    lastName: "Applicant",
    role: "applicant",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    phone: "+233 24 000 1122"
  },
  student: {
    id: "usr-std-01",
    email: "abraham.koranteng@premier.edu",
    firstName: "Abraham",
    lastName: "Koranteng",
    role: "student",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phone: "+233 24 555 0192"
  },
  lecturer: {
    id: "usr-lec-01",
    email: "kwesi.mensah@premier.edu",
    firstName: "Dr. Kwesi",
    lastName: "Mensah",
    role: "lecturer",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    phone: "+233 20 123 4567"
  },
  admin_registrar: {
    id: "usr-adm-01",
    email: "registrar@premier.edu",
    firstName: "Evelyn",
    lastName: "Ofori-Atta",
    role: "admin_registrar",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    phone: "+233 24 999 8888"
  },
  finance_officer: {
    id: "usr-fin-01",
    email: "finance@premier.edu",
    firstName: "Samuel",
    lastName: "Baidoo",
    role: "finance_officer",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    phone: "+233 26 777 5544"
  },
  super_admin: {
    id: "usr-sup-01",
    email: "superadmin@premier.edu",
    firstName: "Prof. Kenneth",
    lastName: "Sarpong",
    role: "super_admin",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    phone: "+233 50 111 2233"
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    try {
      const savedUser = localStorage.getItem('premier_auth_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return parsed.role || 'student';
      }
      const savedApplicant = localStorage.getItem('premier_active_applicant');
      if (savedApplicant) return 'applicant';
    } catch {}
    return 'student';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return Boolean(
        localStorage.getItem('premier_auth_user') || 
        localStorage.getItem('premier_active_applicant')
      );
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem('premier_auth_user');
      if (savedUser) return JSON.parse(savedUser);
      const savedApplicant = localStorage.getItem('premier_active_applicant');
      if (savedApplicant) {
        const app = JSON.parse(savedApplicant);
        return {
          id: app.id,
          email: app.email,
          firstName: app.firstName,
          lastName: app.lastName,
          role: 'applicant',
          phone: app.phone
        };
      }
    } catch {}
    return null;
  });

  const [student, setStudent] = useState<StudentRecord | null>(() => {
    try {
      // 1. Direct cached active student record
      const cachedActive = localStorage.getItem('premier_active_student');
      if (cachedActive) {
        const parsed = JSON.parse(cachedActive);
        if (parsed && parsed.firstName) {
          return parsed;
        }
      }

      // 2. Saved user role check
      const savedUser = localStorage.getItem('premier_auth_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'student') {
          let pool: StudentRecord[] = SAMPLE_ALL_STUDENTS;
          try {
            const rawStored = localStorage.getItem('premier_students');
            if (rawStored) {
              const parsedStored = JSON.parse(rawStored);
              if (Array.isArray(parsedStored) && parsedStored.length > 0) {
                pool = parsedStored;
              }
            }
          } catch {}

          const match = pool.find(s => 
            s.email.toLowerCase() === parsed.email.toLowerCase() ||
            (s.applicantEmail && s.applicantEmail.toLowerCase() === parsed.email.toLowerCase()) ||
            s.id === parsed.id ||
            s.profileId === parsed.id ||
            (s.studentId && s.studentId.toLowerCase() === parsed.email.toLowerCase())
          );
          if (match) return match;

          const matchByName = pool.find(s => 
            `${s.firstName} ${s.lastName}`.toLowerCase() === `${parsed.firstName} ${parsed.lastName}`.toLowerCase()
          );
          if (matchByName) return matchByName;

          // Check admission applications to reconstruct real matric & details
          try {
            const rawApps = localStorage.getItem('premier_admission_applications');
            if (rawApps) {
              const apps = JSON.parse(rawApps);
              const matchedApp = apps.find((a: any) =>
                a.email?.toLowerCase() === parsed.email?.toLowerCase() ||
                `${a.firstName} ${a.lastName}`.toLowerCase() === `${parsed.firstName} ${parsed.lastName}`.toLowerCase()
              );
              if (matchedApp) {
                const progCode = matchedApp.programChoiceName?.includes('Information') ? 'BIT' : 'BCS';
                const matric = matchedApp.allocatedStudentId || `PU/${progCode}/2026/006`;
                const reconstructed: StudentRecord = {
                  ...SAMPLE_STUDENT,
                  id: `std-${matchedApp.id}`,
                  profileId: parsed.id,
                  studentId: matric,
                  firstName: matchedApp.firstName,
                  lastName: matchedApp.lastName,
                  email: matchedApp.email,
                  currentLevel: '100',
                  programName: matchedApp.programChoiceName,
                  programCode: progCode,
                  department: matchedApp.departmentName || "Department of Information Technology",
                  faculty: matchedApp.facultyName || "Faculty of Computing & Information Systems",
                  currentCgpa: 0.00,
                  creditsEarned: 0,
                  academicStanding: "Good Standing"
                };
                return reconstructed;
              }
            }
          } catch {}

          if (parsed.email !== 'abraham.koranteng@premier.edu') {
            return {
              ...SAMPLE_STUDENT,
              id: parsed.id || `std-${Date.now()}`,
              profileId: parsed.id,
              firstName: parsed.firstName,
              lastName: parsed.lastName,
              email: parsed.email,
              currentLevel: '100',
              creditsEarned: 0,
              currentCgpa: 0.00
            };
          }

          return SAMPLE_STUDENT;
        }
      }
    } catch {}
    return null;
  });

  const [applicantAccount, setApplicantAccount] = useState<ApplicantAccount | null>(() => {
    try {
      const saved = localStorage.getItem('premier_active_applicant');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Helper to retrieve all system users (seeded + added + enrolled students + accepted applicants)
  const getAllSystemUsers = (): Array<SystemUser & { password?: string }> => {
    try {
      const map = new Map<string, SystemUser & { password?: string }>();

      // 1. Seed Accounts
      DEFAULT_SYSTEM_ACCOUNTS.forEach(u => map.set(u.email.toLowerCase(), { ...u }));
      SAMPLE_USERS.forEach(u => {
        if (!map.has(u.email.toLowerCase())) {
          map.set(u.email.toLowerCase(), { ...u, password: 'premier2026' });
        }
      });

      // 2. Map applicant passwords from accounts
      const applicantAccounts = getAllApplicantAccounts();
      const applicantPasswordMap = new Map<string, string>();
      applicantAccounts.forEach(a => {
        if (a.email) {
          applicantPasswordMap.set(a.email.toLowerCase(), a.password || 'premier2026');
        }
      });

      // 3. Stored System Users
      const localUsers = localStorage.getItem('premier_system_users');
      const extraUsers: SystemUser[] = localUsers ? JSON.parse(localUsers) : [];
      extraUsers.forEach(u => {
        const existing = map.get(u.email.toLowerCase());
        map.set(u.email.toLowerCase(), {
          ...u,
          password: u.password || applicantPasswordMap.get(u.email.toLowerCase()) || existing?.password || 'premier2026'
        });
      });

      // 4. Stored Enrolled Students
      let studentRecords: StudentRecord[] = [];
      try {
        const rawStudents = localStorage.getItem('premier_students');
        if (rawStudents) {
          const parsed = JSON.parse(rawStudents);
          if (Array.isArray(parsed)) studentRecords = parsed;
        }
      } catch {}

      studentRecords.forEach(s => {
        const pwd = applicantPasswordMap.get(s.email.toLowerCase()) || 
                    (s.applicantEmail && applicantPasswordMap.get(s.applicantEmail.toLowerCase())) || 
                    'premier2026';
        if (s.email) {
          map.set(s.email.toLowerCase(), {
            id: s.profileId || s.id,
            name: `${s.firstName} ${s.lastName}`,
            email: s.email,
            role: 'student',
            status: s.status === 'suspended' ? 'suspended' : s.status !== 'active' ? 'inactive' : 'active',
            department: s.department || s.programName,
            lastLogin: 'Recently',
            createdAt: s.admissionDate || '2026-01-01',
            phone: s.phone,
            password: pwd
          });
        }
        if (s.applicantEmail) {
          map.set(s.applicantEmail.toLowerCase(), {
            id: s.profileId || s.id,
            name: `${s.firstName} ${s.lastName}`,
            email: s.applicantEmail,
            role: 'student',
            status: s.status === 'suspended' ? 'suspended' : s.status !== 'active' ? 'inactive' : 'active',
            department: s.department || s.programName,
            lastLogin: 'Recently',
            createdAt: s.admissionDate || '2026-01-01',
            phone: s.phone,
            password: pwd
          });
        }
      });

      // 5. Accepted / Admitted Admission Applications
      let applications: AdmissionApplication[] = [];
      try {
        const rawApps = localStorage.getItem('premier_admission_applications');
        if (rawApps) {
          const parsed = JSON.parse(rawApps);
          if (Array.isArray(parsed)) applications = parsed;
        }
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('premier_applicant_app_')) {
            try {
              const item = localStorage.getItem(key);
              if (item) {
                const app = JSON.parse(item);
                if (app && app.id && !applications.some(a => a.id === app.id)) {
                  applications.push(app);
                }
              }
            } catch {}
          }
        }
      } catch {}

      const acceptedStatuses: ApplicationStatus[] = [
        'offer_accepted', 'enrolled', 'admission_offered', 'admitted', 'approved', 'matriculation_pending'
      ];

      applications.forEach(app => {
        if (app.email && acceptedStatuses.includes(app.status)) {
          const cleanEmail = app.email.toLowerCase();
          const pwd = applicantPasswordMap.get(cleanEmail) || 'premier2026';
          if (!map.has(cleanEmail) || map.get(cleanEmail)?.role !== 'student') {
            map.set(cleanEmail, {
              id: `usr-std-${app.id}`,
              name: `${app.firstName} ${app.lastName}`,
              email: app.email,
              role: 'student',
              status: 'active',
              department: app.departmentName || app.programChoiceName || 'Computing',
              lastLogin: 'Never',
              createdAt: app.submittedAt || new Date().toISOString(),
              phone: app.phone,
              password: pwd
            });
          }
        }
      });

      return Array.from(map.values());
    } catch {
      return DEFAULT_SYSTEM_ACCOUNTS;
    }
  };

  // Helper to retrieve all applicant accounts (seeded + registered)
  const getAllApplicantAccounts = (): ApplicantAccount[] => {
    try {
      const savedStr = localStorage.getItem('premier_applicant_accounts');
      const saved: ApplicantAccount[] = savedStr ? JSON.parse(savedStr) : [];
      const map = new Map<string, ApplicantAccount>();
      DEFAULT_SEED_APPLICANTS.forEach(a => map.set(a.email.toLowerCase(), a));
      saved.forEach(a => map.set(a.email.toLowerCase(), a));
      return Array.from(map.values());
    } catch {
      return DEFAULT_SEED_APPLICANTS;
    }
  };

  /**
   * Main Login Function with Flexible Credential Verification
   * Supports institutional emails, applicant emails, and Student ID / Matric numbers.
   * Rejects invalid passwords, nonexistent emails, suspended accounts, and role mismatches.
   */
  const login = (param1: string, param2?: string, param3?: UserRole): LoginResult => {
    const VALID_ROLES: UserRole[] = ['student', 'lecturer', 'admin_registrar', 'finance_officer', 'super_admin', 'applicant'];
    let identifier = '';
    let password = '';
    let expectedRole: UserRole | undefined = undefined;

    // Detect if called as (role, email) or (identifier, password, expectedRole)
    if (VALID_ROLES.includes(param1 as UserRole) && !param3) {
      expectedRole = param1 as UserRole;
      identifier = (param2 || '').trim();
      password = 'premier2026';
    } else {
      identifier = (param1 || '').trim();
      password = (param2 || '').trim();
      expectedRole = param3;
    }

    if (!identifier) {
      return { success: false, error: 'Please enter your university email address or student ID.' };
    }

    if (!password) {
      return { success: false, error: 'Please enter your account password.' };
    }

    const allUsers = getAllSystemUsers();
    let matchedUser = allUsers.find(u => 
      u.email.toLowerCase() === identifier.toLowerCase() ||
      u.id.toLowerCase() === identifier.toLowerCase()
    );

    // If not matched by direct email in allUsers, search premier_students by matric number / student ID or applicant email
    if (!matchedUser) {
      let pool: StudentRecord[] = SAMPLE_ALL_STUDENTS;
      try {
        const rawStored = localStorage.getItem('premier_students');
        if (rawStored) {
          const parsedStored = JSON.parse(rawStored);
          if (Array.isArray(parsedStored) && parsedStored.length > 0) pool = parsedStored;
        }
      } catch {}

      const foundStudent = pool.find(s =>
        s.studentId?.toLowerCase() === identifier.toLowerCase() ||
        s.email?.toLowerCase() === identifier.toLowerCase() ||
        (s.applicantEmail && s.applicantEmail.toLowerCase() === identifier.toLowerCase()) ||
        s.id?.toLowerCase() === identifier.toLowerCase()
      );

      if (foundStudent) {
        const applicantAccounts = getAllApplicantAccounts();
        const appAcc = applicantAccounts.find(a => 
          a.email.toLowerCase() === foundStudent.email.toLowerCase() || 
          (foundStudent.applicantEmail && a.email.toLowerCase() === foundStudent.applicantEmail.toLowerCase())
        );
        matchedUser = {
          id: foundStudent.profileId || foundStudent.id,
          name: `${foundStudent.firstName} ${foundStudent.lastName}`,
          email: foundStudent.email,
          role: 'student',
          status: foundStudent.status === 'suspended' ? 'suspended' : foundStudent.status !== 'active' ? 'inactive' : 'active',
          department: foundStudent.department || foundStudent.programName,
          lastLogin: 'Today',
          createdAt: foundStudent.admissionDate || '2026-01-01',
          phone: foundStudent.phone,
          password: appAcc?.password || 'premier2026'
        };
      }
    }

    // If still not matched, check admission applications for this candidate
    if (!matchedUser) {
      let applications: AdmissionApplication[] = [];
      try {
        const rawApps = localStorage.getItem('premier_admission_applications');
        if (rawApps) {
          const parsed = JSON.parse(rawApps);
          if (Array.isArray(parsed)) applications = parsed;
        }
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('premier_applicant_app_')) {
            try {
              const item = localStorage.getItem(key);
              if (item) {
                const app = JSON.parse(item);
                if (app && app.id && !applications.some(a => a.id === app.id)) {
                  applications.push(app);
                }
              }
            } catch {}
          }
        }
      } catch {}

      const matchedApp = applications.find(a =>
        a.email?.toLowerCase() === identifier.toLowerCase() ||
        a.applicationNumber?.toLowerCase() === identifier.toLowerCase() ||
        a.allocatedStudentId?.toLowerCase() === identifier.toLowerCase()
      );

      if (matchedApp) {
        const acceptedStatuses: ApplicationStatus[] = [
          'offer_accepted', 'enrolled', 'admission_offered', 'admitted', 'approved', 'matriculation_pending'
        ];

        if (acceptedStatuses.includes(matchedApp.status)) {
          const applicantAccounts = getAllApplicantAccounts();
          const appAcc = applicantAccounts.find(a => a.email.toLowerCase() === matchedApp.email.toLowerCase());
          const studentPassword = appAcc?.password || 'premier2026';

          let pool: StudentRecord[] = SAMPLE_ALL_STUDENTS;
          try {
            const rawStored = localStorage.getItem('premier_students');
            if (rawStored) {
              const parsedStored = JSON.parse(rawStored);
              if (Array.isArray(parsedStored) && parsedStored.length > 0) pool = parsedStored;
            }
          } catch {}

          let existingStudent = pool.find(s =>
            s.email.toLowerCase() === matchedApp.email.toLowerCase() ||
            (s.applicantEmail && s.applicantEmail.toLowerCase() === matchedApp.email.toLowerCase())
          );

          if (!existingStudent) {
            const progCode = matchedApp.programChoiceName.includes('Information') ? 'BIT' : 'BCS';
            const newMatric = matchedApp.allocatedStudentId || `PU/${progCode}/2026/${String(pool.length + 1).padStart(3, '0')}`;
            const newId = `std-${Date.now()}`;

            existingStudent = {
              ...SAMPLE_STUDENT,
              id: newId,
              profileId: `usr-${newId}`,
              studentId: newMatric,
              firstName: matchedApp.firstName,
              lastName: matchedApp.lastName,
              email: matchedApp.email,
              phone: matchedApp.phone,
              programId: matchedApp.programChoiceId,
              programName: matchedApp.programChoiceName,
              programCode: progCode,
              department: matchedApp.departmentName || "Department of Information Technology",
              faculty: matchedApp.facultyName || "Faculty of Computing & Information Systems",
              currentLevel: "100",
              status: "active",
              currentCgpa: 0.00,
              creditsEarned: 0,
              requiredCredits: 132,
              admissionSession: "2026/2027",
              admissionDate: new Date().toISOString().split('T')[0],
              academicStanding: "Good Standing",
              applicantEmail: matchedApp.email
            };

            const updatedPool = [existingStudent, ...pool];
            try {
              localStorage.setItem('premier_students', JSON.stringify(updatedPool));
            } catch {}

            if (matchedApp.status !== 'enrolled') {
              matchedApp.status = 'enrolled';
              matchedApp.allocatedStudentId = newMatric;
              try {
                localStorage.setItem('premier_admission_applications', JSON.stringify(applications));
                localStorage.setItem(`premier_applicant_app_${matchedApp.email.toLowerCase()}`, JSON.stringify(matchedApp));
              } catch {}
            }
          }

          matchedUser = {
            id: existingStudent.profileId || existingStudent.id,
            name: `${matchedApp.firstName} ${matchedApp.lastName}`,
            email: matchedApp.email,
            role: 'student',
            status: 'active',
            department: matchedApp.programChoiceName,
            lastLogin: 'Today',
            createdAt: matchedApp.submittedAt || new Date().toISOString(),
            phone: matchedApp.phone,
            password: studentPassword
          };

          try {
            const localUsers = localStorage.getItem('premier_system_users');
            const list: SystemUser[] = localUsers ? JSON.parse(localUsers) : [];
            if (!list.some(u => u.email.toLowerCase() === matchedUser!.email.toLowerCase())) {
              list.push(matchedUser);
              localStorage.setItem('premier_system_users', JSON.stringify(list));
            }
          } catch {}
        } else {
          const friendlyStatus = matchedApp.status.replace(/_/g, ' ');
          return {
            success: false,
            error: `Application (${matchedApp.applicationNumber || identifier}) is currently "${friendlyStatus}". Student portal access will unlock once admission is issued and accepted. Please log in via the Admissions Portal at /apply to track your application.`
          };
        }
      }
    }

    // Check if applicant account exists without an accepted application
    if (!matchedUser) {
      const applicantAccounts = getAllApplicantAccounts();
      const matchedApplicant = applicantAccounts.find(a => a.email.toLowerCase() === identifier.toLowerCase());
      if (matchedApplicant && expectedRole === 'student') {
        return {
          success: false,
          error: `Account "${identifier}" is an Admissions Applicant profile. Student portal access is unlocked once your admission offer is issued and accepted. Please sign in via the Admissions Portal at /apply.`
        };
      }
    }

    if (!matchedUser) {
      return {
        success: false,
        error: `No university account found matching "${identifier}". Please verify your email address or Student ID, or contact ICT Directorate.`
      };
    }

    // Account Status Enforcement
    if (matchedUser.status === 'suspended') {
      return {
        success: false,
        error: 'Access Denied: This account has been suspended. Please contact the Academic Affairs Directorate.'
      };
    }

    if (matchedUser.status === 'inactive') {
      return {
        success: false,
        error: 'Access Denied: This account is currently inactive. Please contact the ICT Helpdesk for activation.'
      };
    }

    // Role Match Enforcement
    if (expectedRole && matchedUser.role !== expectedRole) {
      const roleLabels: Record<string, string> = {
        student: 'Student',
        lecturer: 'Lecturer / Faculty',
        admin_registrar: 'Registrar',
        finance_officer: 'Finance Officer',
        super_admin: 'Super Admin',
        applicant: 'Admissions Applicant'
      };
      return {
        success: false,
        error: `Role Mismatch: ${matchedUser.email} is registered as a ${roleLabels[matchedUser.role] || matchedUser.role}, not as ${roleLabels[expectedRole] || expectedRole}. Please select the matching role tab.`
      };
    }

    // Password Enforcement (allows registered password or premier2026)
    const validPassword = matchedUser.password || 'premier2026';
    const isPasswordCorrect = (password === validPassword) || (password === 'premier2026');
    if (!isPasswordCorrect) {
      return {
        success: false,
        error: 'Incorrect password. Please verify your credentials and try again.'
      };
    }

    // Authentication Succeeded
    const userRole = matchedUser.role;
    setRole(userRole);

    const nameParts = matchedUser.name.split(' ');
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || 'Account';

    const userProfile: UserProfile = {
      id: matchedUser.id,
      email: matchedUser.email,
      firstName,
      lastName,
      role: userRole,
      avatarUrl: matchedUser.avatarUrl,
      phone: matchedUser.phone
    };

    setUser(userProfile);
    setIsAuthenticated(true);
    setApplicantAccount(null);

    if (userRole === 'student') {
      let pool = SAMPLE_ALL_STUDENTS;
      try {
        const rawStored = localStorage.getItem('premier_students');
        if (rawStored) {
          const parsedStored = JSON.parse(rawStored);
          if (Array.isArray(parsedStored) && parsedStored.length > 0) pool = parsedStored;
        }
      } catch {}

      const foundStudent = pool.find(s => 
        s.email.toLowerCase() === matchedUser!.email.toLowerCase() ||
        (s.applicantEmail && s.applicantEmail.toLowerCase() === identifier.toLowerCase()) ||
        (s.applicantEmail && s.applicantEmail.toLowerCase() === matchedUser!.email.toLowerCase()) ||
        s.studentId?.toLowerCase() === identifier.toLowerCase() ||
        `${s.firstName} ${s.lastName}`.toLowerCase() === `${firstName} ${lastName}`.toLowerCase()
      );

      let appChoice: AdmissionApplication | undefined;
      try {
        const rawApps = localStorage.getItem('premier_admission_applications');
        if (rawApps) {
          const apps: AdmissionApplication[] = JSON.parse(rawApps);
          appChoice = apps.find(a => 
            a.email.toLowerCase() === matchedUser!.email.toLowerCase() || 
            a.email.toLowerCase() === identifier.toLowerCase()
          );
        }
        if (!appChoice) {
          const backup = localStorage.getItem(`premier_applicant_app_${matchedUser!.email.toLowerCase()}`) ||
                         localStorage.getItem(`premier_applicant_app_${identifier.toLowerCase()}`);
          if (backup) appChoice = JSON.parse(backup);
        }
      } catch {}

      const progName = appChoice?.programChoiceName || matchedUser.department || SAMPLE_STUDENT.programName;
      const progCode = appChoice?.programChoiceName?.includes('Information') ? 'BIT' : 'BCS';
      const allocatedMatric = appChoice?.allocatedStudentId || foundStudent?.studentId || `PU/${progCode}/2026/${String(pool.length + 1).padStart(3, '0')}`;

      const finalStudentRecord: StudentRecord = foundStudent || {
        ...SAMPLE_STUDENT,
        id: `std-${Date.now()}`,
        profileId: matchedUser.id,
        studentId: allocatedMatric,
        firstName,
        lastName,
        email: matchedUser.email,
        applicantEmail: identifier.includes('@') ? identifier : (appChoice?.email || matchedUser.email),
        programName: progName,
        programCode: progCode,
        department: appChoice?.departmentName || matchedUser.department || SAMPLE_STUDENT.department,
        faculty: appChoice?.facultyName || SAMPLE_STUDENT.faculty,
        currentLevel: '100',
        status: 'active',
        academicStanding: 'Good Standing'
      };

      if (!pool.some(s => s.id === finalStudentRecord.id || s.studentId === finalStudentRecord.studentId)) {
        const updatedPool = [finalStudentRecord, ...pool];
        try {
          localStorage.setItem('premier_students', JSON.stringify(updatedPool));
        } catch {}
      }

      setStudent(finalStudentRecord);
      try {
        localStorage.setItem('premier_active_student', JSON.stringify(finalStudentRecord));
      } catch {}
    } else {
      setStudent(null);
      try {
        localStorage.removeItem('premier_active_student');
      } catch {}
    }

    try {
      localStorage.setItem('premier_auth_user', JSON.stringify(userProfile));
      localStorage.removeItem('premier_active_applicant');
    } catch {}

    return { success: true };
  };

  /**
   * Register Applicant Account
   * Validates duplicate emails, password length, and format.
   */
  const registerApplicant = (data: { firstName: string; lastName: string; email: string; phone: string; password?: string }): ApplicantAccount => {
    const cleanEmail = data.email.trim().toLowerCase();
    
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      throw new Error('Please enter a valid email address (e.g. name@example.com).');
    }

    if (!data.firstName.trim() || !data.lastName.trim()) {
      throw new Error('First name and last name are required.');
    }

    if (!data.phone.trim() || data.phone.trim().length < 8) {
      throw new Error('Please provide a valid phone number.');
    }

    const password = data.password || 'premier2026';
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const allApplicants = getAllApplicantAccounts();
    const existing = allApplicants.find(a => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An applicant account with this email address already exists. Please sign in instead.');
    }

    const newAccount: ApplicantAccount = {
      id: `app-acc-${Date.now()}`,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: cleanEmail,
      phone: data.phone.trim(),
      password,
      createdAt: new Date().toISOString(),
      hasApplied: false
    };

    try {
      const currentList = getAllApplicantAccounts();
      const updated = [newAccount, ...currentList];
      localStorage.setItem('premier_applicant_accounts', JSON.stringify(updated));
      localStorage.setItem('premier_active_applicant', JSON.stringify(newAccount));
      localStorage.removeItem('premier_auth_user');
    } catch (e) {
      console.error(e);
    }

    setApplicantAccount(newAccount);
    setRole('applicant');
    setUser({
      id: newAccount.id,
      email: newAccount.email,
      firstName: newAccount.firstName,
      lastName: newAccount.lastName,
      role: 'applicant',
      phone: newAccount.phone
    });
    setStudent(null);
    setIsAuthenticated(true);
    return newAccount;
  };

  /**
   * Login Applicant Account
   * Verifies that the applicant email exists AND password matches.
   * Will NEVER synthesize fake accounts on wrong email!
   */
  const loginApplicant = (email: string, password?: string): ApplicantAccount => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      throw new Error('Please provide your registered admissions email address.');
    }

    const cleanPassword = (password || '').trim();
    if (!cleanPassword) {
      throw new Error('Please enter your admissions account password.');
    }

    const allApplicants = getAllApplicantAccounts();
    const account = allApplicants.find(a => a.email.toLowerCase() === cleanEmail);

    if (!account) {
      throw new Error('No applicant account found with this email. Please check for typos or create an account below.');
    }

    const validPassword = account.password || 'premier2026';
    if (cleanPassword !== validPassword) {
      throw new Error('Incorrect password. Please verify your password and try again.');
    }

    try {
      localStorage.setItem('premier_active_applicant', JSON.stringify(account));
      localStorage.removeItem('premier_auth_user');
    } catch {}

    setApplicantAccount(account);
    setRole('applicant');
    setUser({
      id: account.id,
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
      role: 'applicant',
      phone: account.phone
    });
    setStudent(null);
    setIsAuthenticated(true);
    return account;
  };

  const proceedToStudentDashboard = (studentData?: Partial<StudentRecord>) => {
    const finalId = studentData?.id || `std-${Date.now()}`;
    const studentProfile: StudentRecord = {
      ...SAMPLE_STUDENT,
      ...(studentData || {}),
      id: finalId,
      profileId: studentData?.profileId || `usr-${finalId}`,
      firstName: studentData?.firstName || applicantAccount?.firstName || SAMPLE_STUDENT.firstName,
      lastName: studentData?.lastName || applicantAccount?.lastName || SAMPLE_STUDENT.lastName,
      email: studentData?.email || applicantAccount?.email || SAMPLE_STUDENT.email,
      applicantEmail: applicantAccount?.email || studentData?.email,
      studentId: studentData?.studentId || SAMPLE_STUDENT.studentId,
      currentLevel: studentData?.currentLevel || '100',
      creditsEarned: studentData?.creditsEarned ?? 0,
      currentCgpa: studentData?.currentCgpa ?? 0.00,
    };
    setStudent(studentProfile);
    setRole('student');
    const uProfile: UserProfile = {
      id: studentProfile.profileId,
      email: studentProfile.email,
      firstName: studentProfile.firstName,
      lastName: studentProfile.lastName,
      role: 'student',
      phone: studentProfile.phone
    };
    setUser(uProfile);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('premier_auth_user', JSON.stringify(uProfile));
      localStorage.setItem('premier_active_student', JSON.stringify(studentProfile));
      localStorage.removeItem('premier_active_applicant');

      const rawStored = localStorage.getItem('premier_students');
      const pool: StudentRecord[] = rawStored ? JSON.parse(rawStored) : [];
      if (!pool.some(s => s.id === studentProfile.id || s.studentId === studentProfile.studentId || s.email.toLowerCase() === studentProfile.email.toLowerCase())) {
        pool.unshift(studentProfile);
        localStorage.setItem('premier_students', JSON.stringify(pool));
      }
    } catch {}
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setStudent(null);
    setApplicantAccount(null);
    try {
      localStorage.removeItem('premier_active_applicant');
      localStorage.removeItem('premier_auth_user');
      localStorage.removeItem('premier_active_student');
      localStorage.removeItem('premier_active_tab');
    } catch {}
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === role) return;
    setRole(newRole);

    if (newRole === 'student') {
      let targetStudent: StudentRecord = SAMPLE_STUDENT;
      try {
        const cached = localStorage.getItem('premier_active_student');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.firstName) targetStudent = parsed;
        }
      } catch {}

      setStudent(targetStudent);
      const studentProfile: UserProfile = {
        id: targetStudent.profileId || `usr-${targetStudent.id}`,
        email: targetStudent.email,
        firstName: targetStudent.firstName,
        lastName: targetStudent.lastName,
        role: 'student',
        avatarUrl: targetStudent.avatarUrl,
        phone: targetStudent.phone
      };
      setUser(studentProfile);
      try {
        localStorage.setItem('premier_auth_user', JSON.stringify(studentProfile));
        localStorage.setItem('premier_active_student', JSON.stringify(targetStudent));
        localStorage.removeItem('premier_active_applicant');
      } catch {}
    } else {
      const newProfile = DEMO_PROFILES[newRole];
      setUser(newProfile);
      setStudent(null);
      try {
        localStorage.setItem('premier_auth_user', JSON.stringify(newProfile));
        localStorage.removeItem('premier_active_applicant');
      } catch {}
    }
  };

  const updateStudentLevel = (newLevel: '100' | '200' | '300' | '400') => {
    if (student) {
      setStudent({
        ...student,
        currentLevel: newLevel
      });
    }
  };

  const linkApplicantApplication = (applicationId: string) => {
    setApplicantAccount(prev => {
      if (!prev) return prev;
      const updated: ApplicantAccount = {
        ...prev,
        hasApplied: true,
        applicationId
      };
      try {
        localStorage.setItem('premier_active_applicant', JSON.stringify(updated));
        const allAccounts = getAllApplicantAccounts();
        const updatedList = allAccounts.map(a => 
          a.email.toLowerCase() === updated.email.toLowerCase() ? updated : a
        );
        localStorage.setItem('premier_applicant_accounts', JSON.stringify(updatedList));
      } catch {}
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        role,
        currentRole: role,
        isAuthenticated,
        applicantAccount,
        login,
        registerApplicant,
        loginApplicant,
        proceedToStudentDashboard,
        linkApplicantApplication,
        logout,
        switchRole,
        updateStudentLevel
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
