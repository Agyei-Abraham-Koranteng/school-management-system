export type UserRole = 'student' | 'lecturer' | 'admin_registrar' | 'finance_officer' | 'super_admin' | 'applicant';

export interface ApplicantAccount {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  createdAt: string;
  hasApplied: boolean;
  applicationId?: string;
}

export type AcademicLevel = '100' | '200' | '300' | '400';

export type StudentStatus = 
  | 'active' 
  | 'deferred' 
  | 'suspended' 
  | 'withdrawn' 
  | 'dismissed' 
  | 'on_leave' 
  | 'completed' 
  | 'graduated';

export type CourseType = 'core' | 'elective' | 'general' | 'required';

export type RegistrationStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export type ProgressionDecision = 'promoted' | 'repeated' | 'probation' | 'withdrawn' | 'graduated';

export type NotificationCategory = 'academic' | 'registration' | 'graduation' | 'finance' | 'announcements' | 'important';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  name?: string;
  department?: string;
}

export interface StudentRecord {
  id: string;
  profileId: string;
  studentId: string; // e.g., PU/IT/2024/042
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  programId: string;
  programName: string;
  programCode: string;
  department: string;
  faculty: string;
  currentLevel: AcademicLevel;
  status: StudentStatus;
  currentCgpa: number;
  creditsEarned: number;
  requiredCredits: number;
  admissionSession: string;
  admissionDate: string;
  academicStanding: 'Good Standing' | 'Academic Probation' | 'Dean\'s List' | 'Eligible for Graduation';
  applicantEmail?: string;
  avatarUrl?: string;
  enrollmentDate?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  creditHours: number;
  level: AcademicLevel;
  semester: 'First Semester' | 'Second Semester';
  type: CourseType;
  department: string;
  prerequisites?: string[]; // course codes e.g. ['IT201']
  lecturerName?: string;
  assignedLecturerId?: string;
  capacity?: number;
  enrolledCount?: number;
}

export interface CourseRegistrationItem {
  id: string;
  courseId: string;
  code: string;
  title: string;
  creditHours: number;
  type: CourseType;
  status: 'registered' | 'pending' | 'approved' | 'dropped';
  grade?: string;
  score?: number;
  gradePoint?: number;
}

export interface CourseRegistrationSlip {
  id: string;
  studentId: string;
  semesterId: string;
  academicSession: string;
  semester: string;
  level: AcademicLevel;
  status: RegistrationStatus;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  items: CourseRegistrationItem[];
  totalCredits: number;
}

export interface SemesterResult {
  semesterName: string;
  sessionName: string;
  level: AcademicLevel;
  gpa: number;
  cgpa: number;
  creditsAttempted: number;
  creditsEarned: number;
  courses: {
    code: string;
    title: string;
    credits: number;
    score: number;
    grade: string;
    gradePoint: number;
  }[];
}

export interface ProgressionRecord {
  id: string;
  studentId: string;
  academicSession: string;
  previousLevel: AcademicLevel;
  newLevel: AcademicLevel;
  cgpaAtEvaluation: number;
  creditsEarned: number;
  outstandingCoursesCount: number;
  decision: ProgressionDecision;
  decisionReason: string;
  evaluatedAt: string;
  evaluatedBy: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface FeeStructure {
  id: string;
  title: string;
  academicSession: string;
  level: AcademicLevel;
  tuitionFee: number;
  libraryFee: number;
  ictFee: number;
  examinationFee: number;
  totalAmount: number;
  dueDate: string;
}

export interface StudentFinancialRecord {
  totalBilled: number;
  totalPaid: number;
  outstandingBalance: number;
  status: 'fully_paid' | 'partial' | 'overdue';
  transactions: {
    id: string;
    date: string;
    reference: string;
    description: string;
    amount: number;
    method: string;
    receiptNumber: string;
  }[];
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string; // e.g. "08:30"
  endTime: string;   // e.g. "10:30"
  courseCode: string;
  courseTitle: string;
  room: string;
  lecturer: string;
  level: AcademicLevel;
  programCode?: string;
  capacity?: number;
}

// 1. User & Staff Management
export type AccountStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  department?: string;
  lastLogin: string;
  createdAt: string;
  avatarUrl?: string;
  phone?: string;
  password?: string;
}

export interface StaffMember {
  id: string;
  staffId: string; // e.g. "STF-2022-019"
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  faculty: string;
  position: string; // e.g. "Senior Lecturer", "Head of Department", "Registrar Officer"
  role: UserRole;
  status: AccountStatus;
  avatarUrl: string;
  assignedCourses: string[]; // course codes e.g. ["IT301", "IT201"]
  qualification: string;
  officeLocation: string;
  title?: string;
  designation?: string;
}

// 2. Faculty & Department Management
export interface Faculty {
  id: string;
  name: string;
  code: string; // e.g. "FCIS"
  deanName: string;
  deanEmail: string;
  description: string;
  status: 'active' | 'archived';
  departmentCount: number;
  totalStudents: number;
}

export interface Department {
  id: string;
  facultyId: string;
  facultyName: string;
  name: string;
  code: string; // e.g. "DIT"
  headOfDepartment: string;
  hodEmail: string;
  description: string;
  status: 'active' | 'archived';
  programCount: number;
}

// 3. Program & Curriculum Management
export interface AcademicProgram {
  id: string;
  departmentId: string;
  departmentName: string;
  facultyName: string;
  name: string;
  code: string; // e.g. "BIT"
  degree: string; // e.g. "Bachelor of Science"
  durationYears: number;
  totalRequiredCredits: number;
  coreCreditsRequired: number;
  electiveCreditsRequired: number;
  description: string;
  status: 'active' | 'archived';
}

export interface CurriculumSemesterPlan {
  level: AcademicLevel;
  semester: 'First Semester' | 'Second Semester';
  courses: Course[];
  totalCredits: number;
}

// 4. Admissions Module
export type ApplicationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'correction_required'
  | 'corrections_requested'
  | 'resubmitted'
  | 'approved' 
  | 'rejected' 
  | 'admission_offered'
  | 'offer_accepted'
  | 'offer_declined'
  | 'matriculation_pending'
  | 'admitted' 
  | 'enrolled'
  | 'withdrawn';

export type DocumentVerificationStatus = 
  | 'uploaded'
  | 'pending'
  | 'under_review'
  | 'verified'
  | 'rejected'
  | 'replacement_required';

export interface ApplicantDocument {
  id: string;
  applicationId?: string;
  applicantId?: string;
  name: string;
  type: string;
  fileUrl: string;
  fileName?: string;
  mimeType?: string;
  fileSize: string;
  uploadedAt: string;
  status: DocumentVerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface NextOfKin {
  fullName: string;
  relationship: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
}

export interface AcademicQualification {
  id: string;
  institution: string;
  country: string;
  examinationType: 'WASSCE' | 'SSSCE' | 'Cambridge A-Levels' | 'International Baccalaureate' | 'HND' | 'Other';
  examinationYear: number;
  indexNumber: string;
  aggregateScore?: number;
  subjects: Array<{ subject: string; grade: string }>;
}

export interface AdmissionOffer {
  id: string;
  applicationId: string;
  applicationNumber: string;
  applicantId: string;
  applicantName: string;
  programId: string;
  programName: string;
  facultyName: string;
  departmentName: string;
  academicSession: string;
  entryLevel: AcademicLevel;
  studyMode: string;
  offerDate: string;
  acceptanceDeadline: string;
  status: 'offered' | 'accepted' | 'declined' | 'expired';
  decisionDate?: string;
  admissionConditions?: string[];
  allocatedStudentId?: string;
}

export interface ApplicationStatusHistory {
  id: string;
  applicationId: string;
  previousStatus: ApplicationStatus;
  newStatus: ApplicationStatus;
  changedBy: string;
  actorRole: string;
  notes?: string;
  timestamp: string;
}

export interface AdmissionApplication {
  id: string;
  applicationNumber: string; // e.g. "APP-2026-000142"
  applicantId?: string;
  title?: string;
  firstName: string;
  lastName: string;
  otherNames?: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  nationality: string;
  countryOfResidence?: string;
  identificationType?: 'National ID' | 'Passport' | 'Birth Certificate' | 'Voter ID';
  identificationNumber?: string;
  maritalStatus?: 'Single' | 'Married' | 'Other';
  address: string;
  postalAddress?: string;
  region?: string;
  city?: string;
  country?: string;

  // Next of Kin
  nextOfKin?: NextOfKin;
  guardianName?: string;
  guardianPhone?: string;

  // Program Choice
  facultyId?: string;
  facultyName?: string;
  departmentId?: string;
  departmentName?: string;
  programChoiceId: string;
  programChoiceName: string;
  secondChoiceProgramId?: string;
  secondChoiceProgramName?: string;
  studyMode?: 'Full-Time Regular' | 'Evening / Executive' | 'Weekend Modular';
  academicSession?: string;
  entryLevel?: AcademicLevel;

  // Academic Qualifications
  secondarySchool: string;
  previousSchool?: string;
  completionYear: number;
  aggregateScore: number;
  wassceAggregate?: number;
  candidateIndexNumber?: string;
  qualifications?: AcademicQualification[];
  wassceResults?: Array<{ subject: string; grade: string }>;

  // Status & Progress
  status: ApplicationStatus;
  currentStep?: number;
  progressPercent?: number;
  isDraft?: boolean;
  submittedAt?: string;
  appliedDate?: string;
  lastUpdatedAt?: string;

  // Review & Correction Workflow
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  internalRegistryNotes?: string;
  correctionRequested?: {
    fields: string[];
    reason: string;
    deadline?: string;
    requestedAt: string;
    requestedBy: string;
  };
  offer?: AdmissionOffer;
  statusHistory?: ApplicationStatusHistory[];

  // Documents & Security
  documents: ApplicantDocument[];
  allocatedStudentId?: string;
  declarationConfirmed?: boolean;
}

// 5. Student ID & Profile Completion
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface StudentProfileExtra {
  bloodGroup?: string;
  allergies?: string | string[];
  emergencyContact?: EmergencyContact;
  residentialAddress?: string;
  hallOfResidence?: string;
  roomNumber?: string;
  profileCompletionPercentage: number;
}

// 6. Carryovers & Retake Attempts
export interface CourseAttempt {
  id: string;
  studentId?: string;
  courseId?: string;
  courseCode: string;
  courseTitle: string;
  credits: number;
  academicSession: string;
  semester: string;
  attemptNumber: number;
  score: number;
  totalScore?: number;
  grade: string;
  gradePoint: number;
  status: 'passed' | 'failed';
  firstAttemptSession?: string;
  firstAttemptScore?: number;
  firstAttemptGrade?: string;
  secondAttemptSession?: string;
  secondAttemptScore?: number;
  secondAttemptGrade?: string;
}

export interface CarryoverItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  credits: number;
  creditHours?: number;
  level?: AcademicLevel;
  failedSession: string;
  failedSemester: string;
  semesterFailed?: string;
  grade: string;
  score: number;
  failedScore?: number;
  failedGrade?: string;
  eligibleForRetake: boolean;
  prerequisiteFor?: string[];
  status?: string;
}

// 7. Academic Warning System
export type WarningSeverity = 'advisory' | 'moderate' | 'critical';

export interface AcademicWarning {
  id: string;
  studentId: string;
  studentName: string;
  matricNo: string;
  program: string;
  level: AcademicLevel;
  cgpa: number;
  currentCgpa?: number;
  failedCoursesCount: number;
  severity: WarningSeverity;
  reason: string;
  remediationPlan?: string;
  sessionIssued?: string;
  semesterIssued?: string;
  issuedDate: string;
  status: 'active' | 'resolved' | 'dismissed';
}

// 8. Attendance Module
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  matricNo: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface AttendanceSession {
  id: string;
  courseCode: string;
  courseTitle: string;
  date: string;
  timeSlot: string;
  lecturerName: string;
  totalStudents: number;
  presentCount: number;
  venue?: string;
  topic?: string;
  students?: any[];
  records: AttendanceRecord[];
}

// 9. Document Management
export type DocumentCategory = 
  | 'admission_letter'
  | 'registration_slip'
  | 'result_slip'
  | 'official_transcript'
  | 'completion_certificate'
  | 'financial_receipt'
  | 'institutional_policy';

export interface SystemDocument {
  id: string;
  title: string;
  fileName: string;
  category: DocumentCategory;
  fileSize: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  studentId?: string; // If bound to a student
  downloadUrl: string;
  isVerified: boolean;
  status: 'active' | 'archived';
}

// 10. Graduation Management
export type GraduationCandidateStatus = 'eligible' | 'requirements_outstanding' | 'approved' | 'graduated';

export interface GraduationCandidate {
  id: string;
  studentId: string;
  matricNo: string;
  name: string;
  studentName?: string;
  program: string;
  programName?: string;
  cgpa: number;
  classification: string; // e.g. "First Class Honours", "Second Class Upper"
  earnedCredits: number;
  creditsEarned?: number;
  requiredCredits: number;
  hasPassedAllCore: boolean;
  coreCoursesCleared?: boolean;
  hasOutstandingCarryover: boolean;
  carryoversCleared?: boolean;
  hasFinancialClearance: boolean;
  financialClearance?: boolean;
  hasProjectPassed: boolean;
  projectDefenseCleared?: boolean;
  creditsCleared?: boolean;
  status: GraduationCandidateStatus;
  completionDate?: string;
  certificateNumber?: string;
}

// 11. Announcements System
export type AnnouncementPriority = 'normal' | 'important' | 'urgent';
export type AudienceTarget = 'all' | 'students' | 'lecturers' | 'finance' | 'faculty' | 'level';
export type TargetAudience = AudienceTarget;
export type AnnouncementCategory = 'general' | 'academic' | 'exam' | 'finance' | 'event';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'academic' | 'exam' | 'finance' | 'event';
  priority: AnnouncementPriority;
  targetAudience: AudienceTarget;
  targetFilter?: string; // e.g. "Level 300" or "Faculty of Computing"
  publishedAt: string;
  expiresAt: string;
  authorName: string;
  authorRole: string;
  attachmentName?: string;
  readCount: number;
  isPinned?: boolean;
}

// 12. Audit Logs
export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string; // e.g. "PROMOTED_STUDENT_BATCH", "PUBLISHED_SEMESTER_RESULTS", "VERIFIED_FEE_PAYMENT"
  entity: string; // e.g. "AcademicProgression", "CourseRegistration", "FinancialLedger"
  entityId?: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

// 13. System Settings
export interface GradingScaleEntry {
  grade: string;
  letter?: string;
  minScore: number;
  maxScore: number;
  gradePoint: number;
  description: string;
}

export interface SystemSettings {
  institutionName: string;
  institutionMotto: string;
  motto?: string;
  institutionCode: string;
  contactEmail: string;
  contactPhone: string;
  campusAddress: string;
  currentSession: string;
  currentSemester: 'First Semester' | 'Second Semester';
  minRegistrationCredits: number;
  maxRegistrationCredits: number;
  minProgressionCgpa: number;
  minGraduationCredits: number;
  minimumGraduationCredits?: number;
  attendanceWarningThresholdPercent: number;
  attendanceWarningThreshold?: number;
  attendanceThreshold?: number;
  currency: string;
  currencyCode?: string;
  timezone: string;
  gradingScale: GradingScaleEntry[];
  pushNotificationsEnabled: boolean;
  maintenanceMode: boolean;
  isRegistrationOpen?: boolean;
}

// 14. Push & Email Architecture
export interface PushSubscriptionPreferences {
  enabled: boolean;
  academicAlerts: boolean;
  registrationDeadlines: boolean;
  resultPublications: boolean;
  financialReminders: boolean;
  campusAnnouncements: boolean;
}

export interface EmailLogEntry {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  event: string;
  status: 'sent' | 'delivered' | 'queued' | 'failed';
  sentAt: string;
  triggerSource: string;
}

