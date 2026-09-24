import { 
  StudentRecord, 
  Course, 
  SemesterResult, 
  ProgressionRecord, 
  NotificationItem, 
  StudentFinancialRecord, 
  TimetableSlot,
  FeeStructure,
  CourseRegistrationSlip,
  SystemUser,
  StaffMember,
  Faculty,
  Department,
  AcademicProgram,
  AdmissionApplication,
  StudentProfileExtra,
  CarryoverItem,
  CourseAttempt,
  AcademicWarning,
  AttendanceSession,
  SystemDocument,
  GraduationCandidate,
  Announcement,
  AuditLogEntry,
  SystemSettings,
  EmailLogEntry
} from '../types';

export const CURRENT_ACADEMIC_SESSION = "2026/2027";
export const CURRENT_SEMESTER = "First Semester";

export const SAMPLE_STUDENT: StudentRecord = {
  id: "std-001",
  profileId: "usr-student-01",
  studentId: "PU/IT/2024/001",
  firstName: "Abraham",
  lastName: "Koranteng",
  email: "abraham.koranteng@premier.edu",
  phone: "+233 24 555 0192",
  programId: "prg-bsc-it",
  programName: "BSc Information Technology",
  programCode: "BIT",
  department: "Department of Information Technology",
  faculty: "Faculty of Computing & Information Systems",
  currentLevel: "300",
  status: "active",
  currentCgpa: 3.15,
  creditsEarned: 84,
  requiredCredits: 132,
  admissionSession: "2024/2025",
  admissionDate: "2024-09-12",
  academicStanding: "Good Standing"
};

export const SAMPLE_COURSES: Course[] = [
  {
    id: "crs-it301",
    code: "IT301",
    title: "Database Management Systems",
    description: "Relational database design, normal forms, indexing, ACID transactions, and query optimization.",
    creditHours: 3,
    level: "300",
    semester: "First Semester",
    type: "core",
    department: "Information Technology",
    prerequisites: ["IT201"],
    lecturerName: "Dr. Kwesi Mensah",
    capacity: 65,
    enrolledCount: 42
  },
  {
    id: "crs-it303",
    code: "IT303",
    title: "Web Technologies & Cloud Services",
    description: "Modern full-stack web architecture, cloud deployment primitives, RESTful APIs, and microservices.",
    creditHours: 3,
    level: "300",
    semester: "First Semester",
    type: "core",
    department: "Information Technology",
    prerequisites: ["IT205"],
    lecturerName: "Prof. Elena Vance",
    capacity: 70,
    enrolledCount: 58
  },
  {
    id: "crs-it305",
    code: "IT305",
    title: "Network Security & Cryptography",
    description: "Public key infrastructure, transport layer security, threat modeling, cipher suites, and defense-in-depth.",
    creditHours: 3,
    level: "300",
    semester: "First Semester",
    type: "core",
    department: "Information Technology",
    prerequisites: ["IT203"],
    lecturerName: "Eng. Samuel Osei",
    capacity: 60,
    enrolledCount: 51
  },
  {
    id: "crs-it307",
    code: "IT307",
    title: "Operating Systems & Concurrency",
    description: "Process management, virtual memory paging, scheduling algorithms, and inter-process communication.",
    creditHours: 3,
    level: "300",
    semester: "First Semester",
    type: "core",
    department: "Information Technology",
    prerequisites: ["IT102"],
    lecturerName: "Dr. Marcus Thorne",
    capacity: 55,
    enrolledCount: 39
  },
  {
    id: "crs-it309",
    code: "IT309",
    title: "Human-Computer Interaction (HCI)",
    description: "User research, cognitive psychology, accessibility heuristics, design systems, and rapid interactive prototyping.",
    creditHours: 3,
    level: "300",
    semester: "First Semester",
    type: "elective",
    department: "Information Technology",
    prerequisites: [],
    lecturerName: "Grace Antwi, MSc",
    capacity: 50,
    enrolledCount: 34
  },
  {
    id: "crs-it311",
    code: "IT311",
    title: "Data Science & Python Foundations",
    description: "Data munging, statistical learning algorithms, predictive modeling, and data visualization pipelines.",
    creditHours: 3,
    level: "300",
    semester: "First Semester",
    type: "elective",
    department: "Information Technology",
    prerequisites: ["MATH201"],
    lecturerName: "Dr. David Sterling",
    capacity: 45,
    enrolledCount: 30
  },
  {
    id: "crs-gen301",
    code: "GEN301",
    title: "Research Methodology & Technical Writing",
    description: "Formulating research hypotheses, literature reviews, quantitative survey design, and academic dissemination.",
    creditHours: 2,
    level: "300",
    semester: "First Semester",
    type: "required",
    department: "General Studies",
    prerequisites: [],
    lecturerName: "Prof. Ama Boateng",
    capacity: 120,
    enrolledCount: 88
  }
];

export const SAMPLE_RESULTS_HISTORY: SemesterResult[] = [
  {
    semesterName: "First Semester",
    sessionName: "2024/2025",
    level: "100",
    gpa: 3.20,
    cgpa: 3.20,
    creditsAttempted: 18,
    creditsEarned: 18,
    courses: [
      { code: "IT101", title: "Introduction to Computing", credits: 3, score: 78, grade: "A", gradePoint: 4.0 },
      { code: "MATH101", title: "Discrete Mathematics I", credits: 3, score: 72, grade: "B+", gradePoint: 3.5 },
      { code: "ENG101", title: "Academic English & Communication", credits: 2, score: 81, grade: "A", gradePoint: 4.0 },
      { code: "PHY101", title: "Physics for Computer Science", credits: 3, score: 64, grade: "C+", gradePoint: 2.5 },
      { code: "IT103", title: "Algorithms & Logic Design", credits: 4, score: 70, grade: "B", gradePoint: 3.0 },
      { code: "GEN101", title: "African Studies & Ethics", credits: 3, score: 68, grade: "B", gradePoint: 3.0 }
    ]
  },
  {
    semesterName: "Second Semester",
    sessionName: "2024/2025",
    level: "100",
    gpa: 3.10,
    cgpa: 3.15,
    creditsAttempted: 18,
    creditsEarned: 18,
    courses: [
      { code: "IT102", title: "Object-Oriented Programming (Java)", credits: 4, score: 75, grade: "B+", gradePoint: 3.5 },
      { code: "MATH102", title: "Calculus with Applications", credits: 3, score: 62, grade: "C", gradePoint: 2.0 },
      { code: "IT104", title: "Computer Architecture & Organization", credits: 3, score: 82, grade: "A", gradePoint: 4.0 },
      { code: "IT106", title: "Digital Systems Design", credits: 3, score: 70, grade: "B", gradePoint: 3.0 },
      { code: "IT108", title: "Fundamentals of Networking", credits: 3, score: 74, grade: "B+", gradePoint: 3.5 },
      { code: "GEN102", title: "Critical Thinking & Logic", credits: 2, score: 67, grade: "B", gradePoint: 3.0 }
    ]
  },
  {
    semesterName: "First Semester",
    sessionName: "2025/2026",
    level: "200",
    gpa: 3.12,
    cgpa: 3.14,
    creditsAttempted: 18,
    creditsEarned: 18,
    courses: [
      { code: "IT201", title: "Data Structures & Algorithms", credits: 4, score: 76, grade: "B+", gradePoint: 3.5 },
      { code: "IT203", title: "Data Communications & Internetworking", credits: 3, score: 70, grade: "B", gradePoint: 3.0 },
      { code: "IT205", title: "Web Technologies I", credits: 3, score: 85, grade: "A", gradePoint: 4.0 },
      { code: "MATH201", title: "Probability & Statistics", credits: 3, score: 61, grade: "C", gradePoint: 2.0 },
      { code: "IT207", title: "Software Engineering Principles", credits: 3, score: 73, grade: "B+", gradePoint: 3.5 },
      { code: "GEN201", title: "Leadership & Entrepreneurship", credits: 2, score: 80, grade: "A", gradePoint: 4.0 }
    ]
  },
  {
    semesterName: "Second Semester",
    sessionName: "2025/2026",
    level: "200",
    gpa: 3.18,
    cgpa: 3.15,
    creditsAttempted: 18,
    creditsEarned: 18,
    courses: [
      { code: "IT202", title: "Advanced Database Concepts", credits: 3, score: 79, grade: "B+", gradePoint: 3.5 },
      { code: "IT204", title: "Mobile Application Development", credits: 3, score: 88, grade: "A", gradePoint: 4.0 },
      { code: "IT206", title: "Systems Analysis & Design", credits: 3, score: 72, grade: "B+", gradePoint: 3.5 },
      { code: "IT208", title: "Information Security Fundamentals", credits: 3, score: 66, grade: "B", gradePoint: 3.0 },
      { code: "IT210", title: "Cloud Fundamentals & Virtualization", credits: 3, score: 75, grade: "B+", gradePoint: 3.5 },
      { code: "GEN202", title: "Environmental Studies", credits: 3, score: 63, grade: "C+", gradePoint: 2.5 }
    ]
  }
];

export const SAMPLE_PROGRESSION_RECORDS: ProgressionRecord[] = [
  {
    id: "prg-01",
    studentId: "std-001",
    academicSession: "2024/2025",
    previousLevel: "100",
    newLevel: "200",
    cgpaAtEvaluation: 3.15,
    creditsEarned: 36,
    outstandingCoursesCount: 0,
    decision: "promoted",
    decisionReason: "Passed all prescribed core courses and satisfied the minimum CGPA standard (>= 1.50).",
    evaluatedAt: "2025-07-28T14:30:00Z",
    evaluatedBy: "Academic Board & Registrar"
  },
  {
    id: "prg-02",
    studentId: "std-001",
    academicSession: "2025/2026",
    previousLevel: "200",
    newLevel: "300",
    cgpaAtEvaluation: 3.15,
    creditsEarned: 72,
    outstandingCoursesCount: 0,
    decision: "promoted",
    decisionReason: "Exceeded required credits threshold (72/72) and maintained continuous good academic standing.",
    evaluatedAt: "2026-07-30T10:15:00Z",
    evaluatedBy: "Academic Board & Registrar"
  }
];

export const SAMPLE_REGISTRATION_SLIP: CourseRegistrationSlip = {
  id: "reg-300-1",
  studentId: "std-001",
  semesterId: "sem-2026-s1",
  academicSession: "2026/2027",
  semester: "First Semester",
  level: "300",
  status: "approved",
  submittedAt: "2026-09-02T09:12:00Z",
  approvedAt: "2026-09-04T15:45:00Z",
  approvedBy: "Registrar Office (Dr. A. Mensah)",
  totalCredits: 17,
  items: [
    { id: "ri-1", courseId: "crs-it301", code: "IT301", title: "Database Management Systems", creditHours: 3, type: "core", status: "approved" },
    { id: "ri-2", courseId: "crs-it303", code: "IT303", title: "Web Technologies & Cloud Services", creditHours: 3, type: "core", status: "approved" },
    { id: "ri-3", courseId: "crs-it305", code: "IT305", title: "Network Security & Cryptography", creditHours: 3, type: "core", status: "approved" },
    { id: "ri-4", courseId: "crs-it307", code: "IT307", title: "Operating Systems & Concurrency", creditHours: 3, type: "core", status: "approved" },
    { id: "ri-5", courseId: "crs-it309", code: "IT309", title: "Human-Computer Interaction (HCI)", creditHours: 3, type: "elective", status: "approved" },
    { id: "ri-6", courseId: "crs-gen301", code: "GEN301", title: "Research Methodology & Technical Writing", creditHours: 2, type: "required", status: "approved" }
  ]
};

export const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-01",
    title: "Course Registration Approved",
    message: "Your course registration slip for 2026/2027 First Semester has been vetted and officially approved by the Academic Registry.",
    category: "registration",
    timestamp: "2 hours ago",
    isRead: false
  },
  {
    id: "notif-02",
    title: "Level 200 Results Published",
    message: "Semester 2 cumulative grade point averages and official statements of results have been published for review.",
    category: "academic",
    timestamp: "3 days ago",
    isRead: true
  },
  {
    id: "notif-03",
    title: "Tuition Fee Clearance Notice",
    message: "First installment payment of GHS 4,500 has been verified and applied to your student ledger.",
    category: "finance",
    timestamp: "1 week ago",
    isRead: true
  },
  {
    id: "notif-04",
    title: "Special Guest Lecture: AI & Cloud Security",
    message: "Join the Faculty of Computing session at Great Hall Auditorium this Friday at 10:00 AM.",
    category: "announcements",
    timestamp: "2 weeks ago",
    isRead: true
  }
];

export const SAMPLE_FINANCIAL_RECORD: StudentFinancialRecord = {
  totalBilled: 6200.00,
  totalPaid: 5200.00,
  outstandingBalance: 1000.00,
  status: "partial",
  transactions: [
    {
      id: "txn-101",
      date: "2026-08-15",
      reference: "BNK-ECH-992140",
      description: "Semester 1 Tuition & Facilities Base Deposit",
      amount: 4500.00,
      method: "Bank Transfer",
      receiptNumber: "RCPT-2026-0891"
    },
    {
      id: "txn-102",
      date: "2026-09-01",
      reference: "MOMO-GH-441029",
      description: "ICT Infrastructure & Laboratory Access Surcharge",
      amount: 700.00,
      method: "Mobile Money",
      receiptNumber: "RCPT-2026-1044"
    }
  ]
};

export const SAMPLE_TIMETABLE: TimetableSlot[] = [
  {
    id: "tt-1",
    day: "Monday",
    startTime: "08:30",
    endTime: "10:30",
    courseCode: "IT301",
    courseTitle: "Database Management Systems",
    room: "CS Lab 3, Block B",
    lecturer: "Dr. Kwesi Mensah",
    level: "300"
  },
  {
    id: "tt-2",
    day: "Monday",
    startTime: "11:00",
    endTime: "13:00",
    courseCode: "IT303",
    courseTitle: "Web Technologies & Cloud Services",
    room: "Software Center Hall 1",
    lecturer: "Prof. Elena Vance",
    level: "300"
  },
  {
    id: "tt-3",
    day: "Tuesday",
    startTime: "09:30",
    endTime: "11:30",
    courseCode: "IT305",
    courseTitle: "Network Security & Cryptography",
    room: "Engineering Complex E-204",
    lecturer: "Eng. Samuel Osei",
    level: "300"
  },
  {
    id: "tt-4",
    day: "Wednesday",
    startTime: "13:30",
    endTime: "15:30",
    courseCode: "IT307",
    courseTitle: "Operating Systems & Concurrency",
    room: "Lecture Theatre 4",
    lecturer: "Dr. Marcus Thorne",
    level: "300"
  },
  {
    id: "tt-5",
    day: "Thursday",
    startTime: "10:00",
    endTime: "12:00",
    courseCode: "IT309",
    courseTitle: "Human-Computer Interaction",
    room: "Innovation Hub Lab",
    lecturer: "Grace Antwi, MSc",
    level: "300"
  },
  {
    id: "tt-6",
    day: "Friday",
    startTime: "08:30",
    endTime: "10:30",
    courseCode: "GEN301",
    courseTitle: "Research Methodology",
    room: "Auditorium Main",
    lecturer: "Prof. Ama Boateng",
    level: "300"
  }
];

export const SAMPLE_ALL_STUDENTS: StudentRecord[] = [
  SAMPLE_STUDENT,
  {
    id: "std-002",
    profileId: "usr-std-02",
    studentId: "PU/IT/2024/002",
    firstName: "Esi",
    lastName: "Appiah",
    email: "esi.appiah@premier.edu",
    phone: "+233 20 441 8821",
    programId: "prg-bsc-it",
    programName: "BSc Information Technology",
    programCode: "BIT",
    department: "Department of Information Technology",
    faculty: "Faculty of Computing",
    currentLevel: "300",
    status: "active",
    currentCgpa: 3.82,
    creditsEarned: 84,
    requiredCredits: 132,
    admissionSession: "2024/2025",
    admissionDate: "2024-09-12",
    academicStanding: "Dean's List"
  },
  {
    id: "std-003",
    profileId: "usr-std-03",
    studentId: "PU/CS/2025/014",
    firstName: "Kofi",
    lastName: "Owusu-Ansah",
    email: "kofi.owusu@premier.edu",
    phone: "+233 26 881 9901",
    programId: "prg-bsc-cs",
    programName: "BSc Computer Science",
    programCode: "BCS",
    department: "Department of Computer Science",
    faculty: "Faculty of Computing",
    currentLevel: "200",
    status: "active",
    currentCgpa: 2.85,
    creditsEarned: 48,
    requiredCredits: 132,
    admissionSession: "2025/2026",
    admissionDate: "2025-09-10",
    academicStanding: "Good Standing"
  },
  {
    id: "std-004",
    profileId: "usr-std-04",
    studentId: "PU/SE/2023/008",
    firstName: "Nana",
    lastName: "Agyemang",
    email: "nana.agyemang@premier.edu",
    phone: "+233 54 990 1234",
    programId: "prg-bsc-se",
    programName: "BSc Software Engineering",
    programCode: "BSE",
    department: "Department of Software Engineering",
    faculty: "Faculty of Computing",
    currentLevel: "400",
    status: "completed",
    currentCgpa: 3.65,
    creditsEarned: 132,
    requiredCredits: 132,
    admissionSession: "2023/2024",
    admissionDate: "2023-09-14",
    academicStanding: "Eligible for Graduation"
  },
  {
    id: "std-005",
    profileId: "usr-std-05",
    studentId: "PU/IT/2025/088",
    firstName: "Beatrice",
    lastName: "Aidoo",
    email: "beatrice.aidoo@premier.edu",
    phone: "+233 24 112 3344",
    programId: "prg-bsc-it",
    programName: "BSc Information Technology",
    programCode: "BIT",
    department: "Department of Information Technology",
    faculty: "Faculty of Computing",
    currentLevel: "200",
    status: "active",
    currentCgpa: 1.45,
    creditsEarned: 30,
    requiredCredits: 132,
    admissionSession: "2025/2026",
    admissionDate: "2025-09-10",
    academicStanding: "Academic Probation"
  }
];

// System Settings
export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  institutionName: "Premier University",
  institutionMotto: "Excellence, Integrity and Innovation",
  institutionCode: "PU-GH",
  contactEmail: "registrar@premier.edu",
  contactPhone: "+233 30 212 3456",
  campusAddress: "University Avenue, P.O. Box LG 25, Accra, Ghana",
  currentSession: "2026/2027",
  currentSemester: "First Semester",
  minRegistrationCredits: 15,
  maxRegistrationCredits: 21,
  minProgressionCgpa: 1.50,
  minGraduationCredits: 132,
  attendanceWarningThresholdPercent: 75,
  currency: "GHS",
  timezone: "UTC / GMT",
  pushNotificationsEnabled: true,
  maintenanceMode: false,
  gradingScale: [
    { grade: "A", minScore: 80, maxScore: 100, gradePoint: 4.0, description: "Distinction / Excellent" },
    { grade: "B+", minScore: 75, maxScore: 79, gradePoint: 3.5, description: "Very Good" },
    { grade: "B", minScore: 70, maxScore: 74, gradePoint: 3.0, description: "Good" },
    { grade: "C+", minScore: 65, maxScore: 69, gradePoint: 2.5, description: "Fair / Average" },
    { grade: "C", minScore: 60, maxScore: 64, gradePoint: 2.0, description: "Pass" },
    { grade: "D+", minScore: 55, maxScore: 59, gradePoint: 1.5, description: "Weak Pass" },
    { grade: "D", minScore: 50, maxScore: 54, gradePoint: 1.0, description: "Marginal Pass" },
    { grade: "F", minScore: 0, maxScore: 49, gradePoint: 0.0, description: "Fail" }
  ]
};

// System Users
export const SAMPLE_USERS: SystemUser[] = [
  {
    id: "usr-01",
    name: "Abraham Koranteng",
    email: "abraham.koranteng@premier.edu",
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
    role: "student",
    status: "suspended",
    department: "Department of Information Technology",
    lastLogin: "1 week ago",
    createdAt: "2025-09-10",
    phone: "+233 24 112 3344"
  }
];

// Staff Management
export const SAMPLE_STAFF: StaffMember[] = [
  {
    id: "stf-01",
    staffId: "PU/ACAD/2021/004",
    userId: "usr-02",
    firstName: "Kwesi",
    lastName: "Mensah",
    email: "kwesi.mensah@premier.edu",
    phone: "+233 20 123 4567",
    department: "Department of Information Technology",
    faculty: "Faculty of Computing & Information Systems",
    position: "Senior Lecturer & PG Coordinator",
    role: "lecturer",
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    assignedCourses: ["IT301", "IT202"],
    qualification: "PhD Computer Science (Manchester)",
    officeLocation: "Computing Block C, Room 204"
  },
  {
    id: "stf-02",
    staffId: "PU/ACAD/2020/012",
    userId: "usr-06",
    firstName: "Marcus",
    lastName: "Thorne",
    email: "marcus.thorne@premier.edu",
    phone: "+233 27 654 3210",
    department: "Department of Computer Science",
    faculty: "Faculty of Computing & Information Systems",
    position: "Associate Professor",
    role: "lecturer",
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    assignedCourses: ["IT307", "CS102"],
    qualification: "PhD Distributed Computing (ETH Zurich)",
    officeLocation: "CS Hall, Room 118"
  },
  {
    id: "stf-03",
    staffId: "PU/ADM/2019/001",
    userId: "usr-03",
    firstName: "Evelyn",
    lastName: "Ofori-Atta",
    email: "registrar@premier.edu",
    phone: "+233 24 999 8888",
    department: "Academic Affairs Directorate",
    faculty: "Central Administration",
    position: "Deputy Registrar (Academic Affairs)",
    role: "admin_registrar",
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    assignedCourses: [],
    qualification: "MPA Public Administration (UG)",
    officeLocation: "Admin Block A, Suite 12"
  },
  {
    id: "stf-04",
    staffId: "PU/FIN/2022/003",
    userId: "usr-04",
    firstName: "Samuel",
    lastName: "Baidoo",
    email: "finance@premier.edu",
    phone: "+233 26 777 5544",
    department: "Finance & Bursary Division",
    faculty: "Bursary",
    position: "Senior Accountant (Student Receivables)",
    role: "finance_officer",
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    assignedCourses: [],
    qualification: "FCCA, MSc Financial Economics",
    officeLocation: "Bursary Complex, Counter 4"
  }
];

// Faculties
export const SAMPLE_FACULTIES: Faculty[] = [
  {
    id: "fac-fcis",
    name: "Faculty of Computing & Information Systems",
    code: "FCIS",
    deanName: "Prof. Kwame Gyimah-Boadi",
    deanEmail: "dean.fcis@premier.edu",
    description: "Hub for cutting-edge computing education, artificial intelligence research, and software innovation.",
    status: "active",
    departmentCount: 3,
    totalStudents: 1420
  },
  {
    id: "fac-fba",
    name: "Faculty of Business & Accounting",
    code: "FBA",
    deanName: "Prof. Cynthia Mensah",
    deanEmail: "dean.fba@premier.edu",
    description: "Fostering entrepreneurial leadership, strategic financial mastery, and corporate innovation.",
    status: "active",
    departmentCount: 4,
    totalStudents: 1850
  },
  {
    id: "fac-feng",
    name: "Faculty of Engineering & Applied Sciences",
    code: "FENG",
    deanName: "Ing. Dr. Patrick Addo",
    deanEmail: "dean.feng@premier.edu",
    description: "Pioneering sustainable civil, electrical, and robotic systems engineering.",
    status: "active",
    departmentCount: 3,
    totalStudents: 980
  }
];

// Departments
export const SAMPLE_DEPARTMENTS: Department[] = [
  {
    id: "dept-it",
    facultyId: "fac-fcis",
    facultyName: "Faculty of Computing & Information Systems",
    name: "Department of Information Technology",
    code: "DIT",
    headOfDepartment: "Dr. Kwesi Mensah",
    hodEmail: "hod.it@premier.edu",
    description: "Specialized in cloud platforms, cybersecurity, network architectures, and full-stack engineering.",
    status: "active",
    programCount: 2
  },
  {
    id: "dept-cs",
    facultyId: "fac-fcis",
    facultyName: "Faculty of Computing & Information Systems",
    name: "Department of Computer Science",
    code: "DCS",
    headOfDepartment: "Dr. Marcus Thorne",
    hodEmail: "hod.cs@premier.edu",
    description: "Focused on computational algorithms, machine intelligence, and computer graphics.",
    status: "active",
    programCount: 2
  },
  {
    id: "dept-se",
    facultyId: "fac-fcis",
    facultyName: "Faculty of Computing & Information Systems",
    name: "Department of Software Engineering",
    code: "DSE",
    headOfDepartment: "Prof. Elena Vance",
    hodEmail: "hod.se@premier.edu",
    description: "Dedicated to software craft, agile systems delivery, and enterprise architecture.",
    status: "active",
    programCount: 1
  },
  {
    id: "dept-acc",
    facultyId: "fac-fba",
    facultyName: "Faculty of Business & Accounting",
    name: "Department of Accounting & Finance",
    code: "DAF",
    headOfDepartment: "Dr. Albert Quaynor",
    hodEmail: "hod.acc@premier.edu",
    description: "Professional accounting certifications, auditing, and corporate finance.",
    status: "active",
    programCount: 2
  }
];

// Programs
export const SAMPLE_PROGRAMS: AcademicProgram[] = [
  {
    id: "prg-bsc-it",
    departmentId: "dept-it",
    departmentName: "Department of Information Technology",
    facultyName: "Faculty of Computing & Information Systems",
    name: "BSc Information Technology",
    code: "BIT",
    degree: "Bachelor of Science (Honours)",
    durationYears: 4,
    totalRequiredCredits: 132,
    coreCreditsRequired: 108,
    electiveCreditsRequired: 24,
    description: "Comprehensive degree encompassing network infrastructure, cloud engineering, cybersecurity, and modern systems architecture.",
    status: "active"
  },
  {
    id: "prg-bsc-cs",
    departmentId: "dept-cs",
    departmentName: "Department of Computer Science",
    facultyName: "Faculty of Computing & Information Systems",
    name: "BSc Computer Science",
    code: "BCS",
    degree: "Bachelor of Science (Honours)",
    durationYears: 4,
    totalRequiredCredits: 134,
    coreCreditsRequired: 110,
    electiveCreditsRequired: 24,
    description: "Deep theoretical and algorithmic foundations, operating systems internals, and artificial intelligence.",
    status: "active"
  },
  {
    id: "prg-bsc-se",
    departmentId: "dept-se",
    departmentName: "Department of Software Engineering",
    facultyName: "Faculty of Computing & Information Systems",
    name: "BSc Software Engineering",
    code: "BSE",
    degree: "Bachelor of Science (Honours)",
    durationYears: 4,
    totalRequiredCredits: 136,
    coreCreditsRequired: 112,
    electiveCreditsRequired: 24,
    description: "High-scale engineering practices, software testing, DevSecOps pipelines, and microservice architectures.",
    status: "active"
  }
];

// Admissions Applications
export const SAMPLE_APPLICATIONS: AdmissionApplication[] = [
  {
    id: "app-2026-754689",
    applicationNumber: "APP-2026-754689",
    firstName: "Abraham",
    lastName: "Koranteng",
    email: "abraham.koranteng@premier.edu",
    phone: "+233 24 555 0192",
    dateOfBirth: "2006-05-14",
    gender: "Male",
    nationality: "Ghanaian",
    address: "East Legon Hills, House No. 42, Accra",
    guardianName: "Dr. Kwesi Koranteng",
    guardianPhone: "+233 20 123 4567",
    programChoiceId: "prg-bsc-it",
    programChoiceName: "BSc Information Technology",
    studyMode: "Full-Time Regular",
    secondarySchool: "Presbyterian Boys Senior High School (PRESEC Legon)",
    completionYear: 2025,
    aggregateScore: 9,
    wassceAggregate: 9,
    candidateIndexNumber: "0010102043",
    status: "submitted",
    submittedAt: new Date().toISOString(),
    documents: [
      {
        id: "doc-app-ab-1",
        name: "NASAAG_AWARD_CERTIFICATE.pdf",
        type: "WASSCE / High School Certificate",
        fileUrl: "#",
        fileSize: "6.0 MB",
        uploadedAt: new Date().toISOString().split('T')[0],
        status: "pending"
      },
      {
        id: "doc-app-ab-2",
        name: "Birth_Certificate.pdf",
        type: "Birth Certificate",
        fileUrl: "#",
        fileSize: "1.2 MB",
        uploadedAt: new Date().toISOString().split('T')[0],
        status: "pending"
      },
      {
        id: "doc-app-ab-3",
        name: "National_ID_GhanaCard.pdf",
        type: "National ID",
        fileUrl: "#",
        fileSize: "950 KB",
        uploadedAt: new Date().toISOString().split('T')[0],
        status: "pending"
      },
      {
        id: "doc-app-ab-4",
        name: "Passport_Photo.jpeg",
        type: "Passport Photo",
        fileUrl: "#",
        fileSize: "420 KB",
        uploadedAt: new Date().toISOString().split('T')[0],
        status: "pending"
      }
    ],
    wassceResults: [
      { subject: "English Language", grade: "A1" },
      { subject: "Core Mathematics", grade: "A1" },
      { subject: "Integrated Science", grade: "B2" },
      { subject: "Social Studies", grade: "A1" },
      { subject: "Elective Mathematics", grade: "B2" },
      { subject: "Physics", grade: "B3" },
      { subject: "Elective Chemistry", grade: "B2" },
      { subject: "Biology", grade: "B3" }
    ]
  },
  {
    id: "app-01",
    applicationNumber: "APP-2026-0812",
    firstName: "Emmanuel",
    lastName: "Tetteh",
    otherNames: "Kojo",
    email: "emmanuel.tetteh@gmail.com",
    phone: "+233 24 818 2938",
    dateOfBirth: "2006-04-12",
    gender: "Male",
    nationality: "Ghanaian",
    address: "Plot 14, Haatso West, Accra",
    programChoiceId: "prg-bsc-it",
    programChoiceName: "BSc Information Technology",
    secondarySchool: "Achimota Senior High School",
    completionYear: 2025,
    aggregateScore: 11,
    status: "submitted",
    submittedAt: "2026-08-20T14:30:00Z",
    documents: [
      {
        id: "doc-app-1",
        name: "WASSCE_Official_Statement.pdf",
        type: "WASSCE / High School Certificate",
        fileUrl: "#",
        fileSize: "1.4 MB",
        uploadedAt: "2026-08-20",
        status: "verified"
      },
      {
        id: "doc-app-2",
        name: "Birth_Certificate.pdf",
        type: "Birth Certificate",
        fileUrl: "#",
        fileSize: "840 KB",
        uploadedAt: "2026-08-20",
        status: "verified"
      }
    ]
  },
  {
    id: "app-02",
    applicationNumber: "APP-2026-0941",
    firstName: "Mercy",
    lastName: "Danso",
    email: "mercy.danso@outlook.com",
    phone: "+233 50 334 1122",
    dateOfBirth: "2005-11-03",
    gender: "Female",
    nationality: "Ghanaian",
    address: "24 Ring Road Central, Kokomlemle, Accra",
    programChoiceId: "prg-bsc-se",
    programChoiceName: "BSc Software Engineering",
    secondarySchool: "Wesley Girls' High School",
    completionYear: 2025,
    aggregateScore: 8,
    status: "under_review",
    submittedAt: "2026-08-25T11:15:00Z",
    reviewedBy: "Evelyn Ofori-Atta",
    reviewNotes: "Excellent science elective background. Aggregate 8 satisfies direct merit list threshold.",
    documents: [
      {
        id: "doc-app-3",
        name: "WASSCE_Result_Slip.pdf",
        type: "WASSCE / High School Certificate",
        fileUrl: "#",
        fileSize: "1.1 MB",
        uploadedAt: "2026-08-25",
        status: "verified"
      }
    ]
  },
  {
    id: "app-03",
    applicationNumber: "APP-2026-1029",
    firstName: "David",
    lastName: "Armah",
    email: "david.armah@yahoo.com",
    phone: "+233 26 441 5500",
    dateOfBirth: "2006-02-18",
    gender: "Male",
    nationality: "Ghanaian",
    address: "Adenta Housing Estate, Block F",
    programChoiceId: "prg-bsc-cs",
    programChoiceName: "BSc Computer Science",
    secondarySchool: "Presbyterian Boys' Secondary School (PRESEC)",
    completionYear: 2025,
    aggregateScore: 9,
    status: "approved",
    submittedAt: "2026-08-28T09:40:00Z",
    reviewedBy: "Evelyn Ofori-Atta",
    reviewNotes: "Approved for admission to BSc Computer Science. Ready for matriculation onboarding.",
    documents: [
      {
        id: "doc-app-4",
        name: "Cert_WASSCE.pdf",
        type: "WASSCE / High School Certificate",
        fileUrl: "#",
        fileSize: "1.6 MB",
        uploadedAt: "2026-08-28",
        status: "verified"
      }
    ]
  }
];

// Student Extra Profile / Completion
export const SAMPLE_STUDENT_PROFILE_EXTRA: StudentProfileExtra = {
  bloodGroup: "O+",
  allergies: "None recorded",
  emergencyContact: {
    name: "Mr. Kwabena Koranteng",
    relationship: "Father / Guardian",
    phone: "+233 24 411 9021",
    email: "k.koranteng@gmail.com",
    address: "House 4, Dome Pillar 2, Accra"
  },
  residentialAddress: "Hall 3 (Sarbah Annexe), Room B-12",
  hallOfResidence: "Sarbah Hall",
  profileCompletionPercentage: 85
};

// Carryovers & Retake Attempts
export const SAMPLE_CARRYOVERS: CarryoverItem[] = [
  {
    id: "co-1",
    courseCode: "MATH201",
    courseTitle: "Probability & Statistics for Engineers",
    credits: 3,
    failedSession: "2025/2026",
    failedSemester: "First Semester",
    grade: "F",
    score: 42,
    eligibleForRetake: true
  }
];

export const SAMPLE_COURSE_ATTEMPTS: CourseAttempt[] = [
  {
    id: "att-1",
    courseCode: "MATH201",
    courseTitle: "Probability & Statistics for Engineers",
    credits: 3,
    academicSession: "2025/2026",
    semester: "First Semester",
    attemptNumber: 1,
    score: 42,
    grade: "F",
    gradePoint: 0.0,
    status: "failed"
  },
  {
    id: "att-2",
    courseCode: "IT103",
    courseTitle: "Algorithms & Logic Design",
    credits: 4,
    academicSession: "2024/2025",
    semester: "First Semester",
    attemptNumber: 1,
    score: 70,
    grade: "B",
    gradePoint: 3.0,
    status: "passed"
  }
];

// Academic Warning System
export const SAMPLE_ACADEMIC_WARNINGS: AcademicWarning[] = [
  {
    id: "wrn-01",
    studentId: "std-005",
    studentName: "Beatrice Aidoo",
    matricNo: "PU/IT/2025/088",
    program: "BSc Information Technology",
    level: "200",
    cgpa: 1.45,
    failedCoursesCount: 3,
    severity: "critical",
    reason: "Cumulative CGPA (1.45) below the mandatory institutional progression threshold of 1.50.",
    issuedDate: "2026-08-01",
    status: "active"
  },
  {
    id: "wrn-02",
    studentId: "std-003",
    studentName: "Kofi Owusu-Ansah",
    matricNo: "PU/CS/2025/014",
    program: "BSc Computer Science",
    level: "200",
    cgpa: 2.10,
    failedCoursesCount: 2,
    severity: "advisory",
    reason: "Attendance in CS201 Algorithms fell below 75% requirement. Two outstanding carryovers logged.",
    issuedDate: "2026-09-05",
    status: "active"
  }
];

// Attendance Sessions
export const SAMPLE_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  {
    id: "att-ses-01",
    courseCode: "IT301",
    courseTitle: "Database Management Systems",
    date: "2026-09-14",
    timeSlot: "08:30 - 10:30",
    lecturerName: "Dr. Kwesi Mensah",
    totalStudents: 42,
    presentCount: 39,
    records: [
      { id: "ar-1", studentId: "std-001", studentName: "Abraham Koranteng", matricNo: "PU/IT/2024/001", status: "present" },
      { id: "ar-2", studentId: "std-002", studentName: "Esi Appiah", matricNo: "PU/IT/2024/002", status: "present" },
      { id: "ar-3", studentId: "std-005", studentName: "Beatrice Aidoo", matricNo: "PU/IT/2025/088", status: "absent", notes: "Unexcused absence" }
    ]
  },
  {
    id: "att-ses-02",
    courseCode: "IT303",
    courseTitle: "Web Technologies & Cloud Services",
    date: "2026-09-14",
    timeSlot: "11:00 - 13:00",
    lecturerName: "Prof. Elena Vance",
    totalStudents: 58,
    presentCount: 55,
    records: [
      { id: "ar-4", studentId: "std-001", studentName: "Abraham Koranteng", matricNo: "PU/IT/2024/001", status: "present" },
      { id: "ar-5", studentId: "std-002", studentName: "Esi Appiah", matricNo: "PU/IT/2024/002", status: "late", notes: "Arrived 15 mins into lecture" }
    ]
  }
];

// System Documents
export const SAMPLE_SYSTEM_DOCUMENTS: SystemDocument[] = [
  {
    id: "doc-sys-01",
    title: "Official Academic Transcript - Abraham Koranteng",
    fileName: "PU_Official_Transcript_PU_IT_2024_001.pdf",
    category: "official_transcript",
    fileSize: "245 KB",
    fileType: "PDF",
    uploadedBy: "Academic Affairs Registry",
    uploadedAt: "2026-09-05",
    studentId: "std-001",
    downloadUrl: "#",
    isVerified: true,
    status: "active"
  },
  {
    id: "doc-sys-02",
    title: "Course Registration Slip (2026/2027 S1)",
    fileName: "Registration_Slip_2026_S1.pdf",
    category: "registration_slip",
    fileSize: "180 KB",
    fileType: "PDF",
    uploadedBy: "Automated Registrar Service",
    uploadedAt: "2026-09-04",
    studentId: "std-001",
    downloadUrl: "#",
    isVerified: true,
    status: "active"
  },
  {
    id: "doc-sys-03",
    title: "Undergraduate Provisional Admission Letter",
    fileName: "Admission_Letter_PU_2024.pdf",
    category: "admission_letter",
    fileSize: "512 KB",
    fileType: "PDF",
    uploadedBy: "Directorate of Admissions",
    uploadedAt: "2024-09-01",
    studentId: "std-001",
    downloadUrl: "#",
    isVerified: true,
    status: "active"
  },
  {
    id: "doc-sys-04",
    title: "Premier University Student Handbook & Code of Conduct",
    fileName: "PU_Student_Handbook_2026_2027.pdf",
    category: "institutional_policy",
    fileSize: "3.2 MB",
    fileType: "PDF",
    uploadedBy: "Dean of Student Affairs",
    uploadedAt: "2026-08-10",
    downloadUrl: "#",
    isVerified: true,
    status: "active"
  }
];

// Graduation Candidates
export const SAMPLE_GRADUATION_CANDIDATES: GraduationCandidate[] = [
  {
    id: "grad-01",
    studentId: "std-004",
    matricNo: "PU/SE/2023/008",
    name: "Nana Agyemang",
    program: "BSc Software Engineering",
    cgpa: 3.65,
    classification: "First Class Honours",
    earnedCredits: 132,
    requiredCredits: 132,
    hasPassedAllCore: true,
    hasOutstandingCarryover: false,
    hasFinancialClearance: true,
    hasProjectPassed: true,
    status: "eligible",
    completionDate: "2026-06-30",
    certificateNumber: "PU/CERT/2026/0419"
  },
  {
    id: "grad-02",
    studentId: "std-009",
    matricNo: "PU/IT/2023/044",
    name: "Felix Acheampong",
    program: "BSc Information Technology",
    cgpa: 2.78,
    classification: "Second Class Lower",
    earnedCredits: 129,
    requiredCredits: 132,
    hasPassedAllCore: false,
    hasOutstandingCarryover: true,
    hasFinancialClearance: false,
    hasProjectPassed: true,
    status: "requirements_outstanding"
  }
];

// Announcements
export const SAMPLE_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-01",
    title: "Deadline: 2026/2027 First Semester Course Registration",
    content: "All undergraduate and postgraduate students must complete course add/drop operations before Friday, October 3, 2026 at 11:59 PM. Late registration fines will apply thereafter.",
    category: "academic",
    priority: "urgent",
    targetAudience: "students",
    publishedAt: "2026-09-12",
    expiresAt: "2026-10-04",
    authorName: "Evelyn Ofori-Atta",
    authorRole: "Registrar Office",
    attachmentName: "Registration_Policy_Directive.pdf",
    readCount: 1420
  },
  {
    id: "ann-02",
    title: "Annual Vice Chancellor's Innovation Challenge 2026",
    content: "Submit research posters and prototypes in AI for Agriculture and Health. Prizes up to GHS 50,000 for top winning student teams. Register at the Research Directorate.",
    category: "event",
    priority: "important",
    targetAudience: "all",
    publishedAt: "2026-09-08",
    expiresAt: "2026-10-15",
    authorName: "Prof. Kenneth Sarpong",
    authorRole: "Vice Chancellor",
    readCount: 2840
  },
  {
    id: "ann-03",
    title: "Faculty Board Meeting: Continuous Assessment Submission",
    content: "All faculty members must enter mid-semester scores into the gradebook engine no later than week 8. Scored scripts must be moderated by department leads.",
    category: "exam",
    priority: "important",
    targetAudience: "lecturers",
    publishedAt: "2026-09-10",
    expiresAt: "2026-10-30",
    authorName: "Dr. Kwesi Mensah",
    authorRole: "Head of Department",
    readCount: 68
  }
];

// Audit Logs
export const SAMPLE_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "aud-01",
    userId: "usr-03",
    userName: "Evelyn Ofori-Atta (Registrar)",
    userRole: "admin_registrar",
    action: "PROMOTED_STUDENT_BATCH",
    entity: "AcademicProgression",
    entityId: "batch-2026-p1",
    details: "Processed academic progression for 32 eligible candidates advancing from Level 200 to Level 300.",
    ipAddress: "192.168.1.45",
    timestamp: "2026-09-15 08:34:12"
  },
  {
    id: "aud-02",
    userId: "usr-04",
    userName: "Samuel Baidoo (Finance)",
    userRole: "finance_officer",
    action: "VERIFIED_FEE_PAYMENT",
    entity: "StudentFinancialRecord",
    entityId: "RCPT-2026-1044",
    details: "Verified GHS 700.00 MoMo payment for Abraham Koranteng (PU/IT/2024/001).",
    ipAddress: "192.168.1.88",
    timestamp: "2026-09-14 16:12:08"
  },
  {
    id: "aud-03",
    userId: "usr-02",
    userName: "Dr. Kwesi Mensah",
    userRole: "lecturer",
    action: "ENTERED_ATTENDANCE_RECORD",
    entity: "AttendanceSession",
    entityId: "att-ses-01",
    details: "Submitted lecture attendance roster for IT301 (39 present, 3 absent).",
    ipAddress: "10.0.4.12",
    timestamp: "2026-09-14 10:35:44"
  },
  {
    id: "aud-04",
    userId: "usr-05",
    userName: "Prof. Kenneth Sarpong",
    userRole: "super_admin",
    action: "MODIFIED_SYSTEM_SETTINGS",
    entity: "SystemSettings",
    details: "Updated minimum credit limits from 14 to 15 credits for 2026/2027 session.",
    ipAddress: "192.168.1.10",
    timestamp: "2026-09-10 14:02:50"
  },
  {
    id: "aud-05",
    userId: "usr-01",
    userName: "Abraham Koranteng",
    userRole: "student",
    action: "SUBMITTED_COURSE_REGISTRATION",
    entity: "CourseRegistrationSlip",
    entityId: "reg-300-1",
    details: "Enrolled in 6 courses totaling 17 credit hours.",
    ipAddress: "154.160.22.91",
    timestamp: "2026-09-02 09:12:00"
  }
];

// Email Logs
export const SAMPLE_EMAIL_LOGS: EmailLogEntry[] = [
  {
    id: "eml-01",
    recipientEmail: "abraham.koranteng@premier.edu",
    recipientName: "Abraham Koranteng",
    subject: "Official Notice: Course Registration Approved",
    event: "registration_approved",
    status: "delivered",
    sentAt: "2026-09-04 15:45:00",
    triggerSource: "Registrar Approval Engine"
  },
  {
    id: "eml-02",
    recipientEmail: "emmanuel.tetteh@gmail.com",
    recipientName: "Emmanuel Tetteh",
    subject: "Application Received: PU Undergraduate Admissions 2026/2027",
    event: "admission_application_received",
    status: "delivered",
    sentAt: "2026-08-20 14:31:00",
    triggerSource: "Admissions Gateway"
  },
  {
    id: "eml-03",
    recipientEmail: "beatrice.aidoo@premier.edu",
    recipientName: "Beatrice Aidoo",
    subject: "Academic Advisory Alert: Academic Probation Status",
    event: "academic_warning",
    status: "delivered",
    sentAt: "2026-08-01 09:00:00",
    triggerSource: "Academic Warning System"
  }
];

