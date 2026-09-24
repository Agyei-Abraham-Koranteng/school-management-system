/**
 * PREMIER EDTECH SAAS - SUPABASE CLIENT & DATA SYNCHRONIZATION LAYER
 * Provides resilient, multi-tenant database connection to Supabase PostgreSQL.
 * Supports transparent fallback to seeded offline data if Supabase credentials
 * are not yet supplied in the environment.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  SystemSettings,
  Faculty,
  Department,
  AcademicProgram,
  Course,
  StudentRecord,
  StudentProfileExtra,
  AdmissionApplication,
  AttendanceSession,
  AcademicWarning,
  SystemDocument,
  GraduationCandidate,
  Announcement,
  AuditLogEntry,
  SystemUser,
  StaffMember,
  CourseRegistrationSlip,
  CourseRegistrationItem,
  NotificationItem,
  ApplicationStatus,
  GraduationCandidateStatus
} from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    supabaseUrl.startsWith('http')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

/**
 * Diagnostic ping to test Supabase availability.
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  latencyMs?: number;
}> {
  if (!supabase || !isSupabaseConfigured()) {
    return {
      connected: false,
      message: 'Supabase credentials not configured in environment (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)'
    };
  }

  const start = performance.now();
  try {
    const { error } = await supabase.from('faculties').select('id').limit(1);
    const latencyMs = Math.round(performance.now() - start);

    if (error) {
      return {
        connected: false,
        message: `Database ping returned error: ${error.message}`,
        latencyMs
      };
    }

    return {
      connected: true,
      message: 'Successfully connected to institutional Supabase PostgreSQL cluster',
      latencyMs
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Connection failed: ${err.message || 'Unknown network error'}`
    };
  }
}

/**
 * Remote Data Fetching & Mutation Service with Schema Mapping
 */
export const supabaseDb = {
  // 1. System Settings
  async getSettings(): Promise<SystemSettings | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .limit(1)
        .single();
      if (error || !data) return null;
      return {
        institutionName: data.institution_name,
        institutionMotto: data.institution_motto,
        institutionCode: data.institution_code || 'UNIV',
        contactEmail: data.contact_email || '',
        contactPhone: data.contact_phone || '',
        campusAddress: data.campus_address || '',
        currentSession: data.current_session,
        currentSemester: data.current_semester,
        minRegistrationCredits: data.min_registration_credits,
        maxRegistrationCredits: data.max_registration_credits,
        minProgressionCgpa: Number(data.min_progression_cgpa),
        minGraduationCredits: data.min_graduation_credits,
        attendanceWarningThresholdPercent: data.attendance_warning_threshold || 75,
        attendanceWarningThreshold: data.attendance_warning_threshold,
        currency: data.currency_code || 'GHS',
        currencyCode: data.currency_code,
        timezone: data.timezone || 'Africa/Accra',
        gradingScale: data.grading_scale || [],
        pushNotificationsEnabled: Boolean(data.push_notifications_enabled),
        maintenanceMode: Boolean(data.maintenance_mode)
      };
    } catch {
      return null;
    }
  },

  async updateSettings(settings: Partial<SystemSettings>): Promise<boolean> {
    if (!supabase) return false;
    try {
      const payload: Record<string, any> = {};
      if (settings.institutionName) payload.institution_name = settings.institutionName;
      if (settings.institutionMotto) payload.institution_motto = settings.institutionMotto;
      if (settings.currentSession) payload.current_session = settings.currentSession;
      if (settings.currentSemester) payload.current_semester = settings.currentSemester;
      if (settings.minRegistrationCredits) payload.min_registration_credits = settings.minRegistrationCredits;
      if (settings.maxRegistrationCredits) payload.max_registration_credits = settings.maxRegistrationCredits;
      if (settings.minProgressionCgpa) payload.min_progression_cgpa = settings.minProgressionCgpa;
      if (settings.minGraduationCredits) payload.min_graduation_credits = settings.minGraduationCredits;
      if (settings.attendanceWarningThresholdPercent !== undefined || settings.attendanceWarningThreshold !== undefined) {
        payload.attendance_warning_threshold = settings.attendanceWarningThresholdPercent ?? settings.attendanceWarningThreshold;
      }
      if (settings.currency || settings.currencyCode) {
        payload.currency_code = settings.currency ?? settings.currencyCode;
      }
      if (settings.gradingScale) payload.grading_scale = settings.gradingScale;

      const { error } = await supabase
        .from('system_settings')
        .update(payload)
        .neq('institution_name', '');
      return !error;
    } catch {
      return false;
    }
  },

  // 2. Faculties
  async getFaculties(): Promise<Faculty[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('faculties').select('*');
      if (error || !data) return null;
      return data.map(f => ({
        id: f.id,
        name: f.name,
        code: f.code,
        deanName: f.dean_name || '',
        deanEmail: f.dean_email || '',
        description: f.description || '',
        status: (f.status || 'active') as 'active' | 'archived',
        departmentCount: 0,
        totalStudents: 0
      }));
    } catch {
      return null;
    }
  },

  async createFaculty(faculty: Omit<Faculty, 'id' | 'departmentCount' | 'totalStudents'>): Promise<Faculty | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('faculties')
        .insert({
          tenant_id: DEFAULT_TENANT_ID,
          name: faculty.name,
          code: faculty.code,
          dean_name: faculty.deanName
        })
        .select()
        .single();
      if (error || !data) return null;
      return {
        id: data.id,
        name: data.name,
        code: data.code,
        deanName: data.dean_name || '',
        deanEmail: faculty.deanEmail || '',
        description: faculty.description || '',
        status: 'active',
        departmentCount: 0,
        totalStudents: 0
      };
    } catch {
      return null;
    }
  },

  // 3. Departments
  async getDepartments(): Promise<Department[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('departments').select('*');
      if (error || !data) return null;
      return data.map(d => ({
        id: d.id,
        facultyId: d.faculty_id,
        facultyName: d.faculty_name || '',
        name: d.name,
        code: d.code,
        headOfDepartment: d.hod_name || '',
        hodEmail: d.hod_email || '',
        description: d.description || '',
        status: (d.status || 'active') as 'active' | 'archived',
        programCount: 0
      }));
    } catch {
      return null;
    }
  },

  async createDepartment(dept: Omit<Department, 'id' | 'programCount'>): Promise<Department | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('departments')
        .insert({
          tenant_id: DEFAULT_TENANT_ID,
          faculty_id: dept.facultyId,
          name: dept.name,
          code: dept.code,
          hod_name: dept.headOfDepartment
        })
        .select()
        .single();
      if (error || !data) return null;
      return {
        id: data.id,
        facultyId: data.faculty_id,
        facultyName: dept.facultyName || '',
        name: data.name,
        code: data.code,
        headOfDepartment: data.hod_name || '',
        hodEmail: dept.hodEmail || '',
        description: dept.description || '',
        status: 'active',
        programCount: 0
      };
    } catch {
      return null;
    }
  },

  // 4. Programs
  async getPrograms(): Promise<AcademicProgram[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('academic_programs').select('*');
      if (error || !data) return null;
      return data.map(p => ({
        id: p.id,
        departmentId: p.department_id,
        departmentName: p.department_name || '',
        facultyName: p.faculty_name || '',
        name: p.name,
        code: p.code,
        degree: p.degree_type || p.degree || 'Bachelor of Science',
        durationYears: p.duration_years || 4,
        totalRequiredCredits: p.total_credits_required || 120,
        coreCreditsRequired: p.core_credits || 100,
        electiveCreditsRequired: p.elective_credits || 20,
        description: p.description || '',
        status: (p.status || 'active') as 'active' | 'archived'
      }));
    } catch {
      return null;
    }
  },

  async createProgram(prog: Omit<AcademicProgram, 'id'>): Promise<AcademicProgram | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('academic_programs')
        .insert({
          tenant_id: DEFAULT_TENANT_ID,
          department_id: prog.departmentId,
          name: prog.name,
          code: prog.code,
          degree_type: prog.degree,
          duration_years: prog.durationYears,
          total_credits_required: prog.totalRequiredCredits
        })
        .select()
        .single();
      if (error || !data) return null;
      return {
        id: data.id,
        departmentId: data.department_id,
        departmentName: prog.departmentName || '',
        facultyName: prog.facultyName || '',
        name: data.name,
        code: data.code,
        degree: data.degree_type,
        durationYears: data.duration_years,
        totalRequiredCredits: data.total_credits_required,
        coreCreditsRequired: prog.coreCreditsRequired || 100,
        electiveCreditsRequired: prog.electiveCreditsRequired || 20,
        description: prog.description || '',
        status: 'active'
      };
    } catch {
      return null;
    }
  },

  // 5. Courses
  async getCourses(): Promise<Course[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('courses').select('*');
      if (error || !data) return null;
      return data.map(c => ({
        id: c.id,
        code: c.code,
        title: c.title,
        creditHours: c.credit_hours,
        level: c.level,
        semester: c.semester,
        type: c.type,
        department: 'Computing & Engineering',
        capacity: 60,
        enrolledCount: 35,
        description: c.description || ''
      }));
    } catch {
      return null;
    }
  },

  async createCourse(course: Omit<Course, 'id'>): Promise<Course | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({
          tenant_id: DEFAULT_TENANT_ID,
          department_id: '00000000-0000-0000-0000-000000000001',
          code: course.code,
          title: course.title,
          credit_hours: course.creditHours,
          level: course.level,
          semester: course.semester,
          type: course.type
        })
        .select()
        .single();
      if (error || !data) return null;
      return {
        id: data.id,
        code: data.code,
        title: data.title,
        creditHours: data.credit_hours,
        level: data.level,
        semester: data.semester,
        type: data.type,
        department: course.department,
        capacity: course.capacity || 60,
        enrolledCount: 0,
        description: course.description
      };
    } catch {
      return null;
    }
  },

  async updateCourse(id: string, updates: Partial<Course>): Promise<boolean> {
    if (!supabase) return false;
    try {
      const payload: Record<string, any> = {};
      if (updates.title) payload.title = updates.title;
      if (updates.creditHours) payload.credit_hours = updates.creditHours;
      if (updates.level) payload.level = updates.level;
      if (updates.semester) payload.semester = updates.semester;
      if (updates.type) payload.type = updates.type;

      const { error } = await supabase
        .from('courses')
        .update(payload)
        .eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // 6. Students
  async getStudents(): Promise<StudentRecord[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          academic_programs (
            name,
            code
          )
        `);
      if (error || !data) return null;
      return data.map(s => ({
        id: s.id,
        profileId: s.user_id || s.id,
        studentId: s.matric_no,
        firstName: s.first_name,
        lastName: s.last_name,
        email: s.email,
        phone: s.phone || '',
        programId: s.program_id,
        programName: s.academic_programs?.name || 'Undergraduate Degree',
        programCode: s.academic_programs?.code || 'DEG',
        department: 'Academic Affairs',
        faculty: 'Institutional Faculty',
        currentLevel: s.current_level,
        status: s.status,
        currentCgpa: Number(s.current_cgpa),
        creditsEarned: s.credits_earned,
        requiredCredits: 132,
        admissionSession: s.admission_session,
        admissionDate: s.admission_date,
        academicStanding: s.academic_standing
      }));
    } catch {
      return null;
    }
  },

  async createStudent(student: Omit<StudentRecord, 'id'>): Promise<StudentRecord | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('students')
        .insert({
          tenant_id: DEFAULT_TENANT_ID,
          matric_no: student.studentId,
          first_name: student.firstName,
          last_name: student.lastName,
          email: student.email,
          phone: student.phone,
          program_id: student.programId || '00000000-0000-0000-0000-000000000001',
          current_level: student.currentLevel,
          status: student.status,
          current_cgpa: student.currentCgpa,
          credits_earned: student.creditsEarned,
          admission_session: student.admissionSession,
          admission_date: student.admissionDate,
          academic_standing: student.academicStanding
        })
        .select()
        .single();
      if (error || !data) return null;
      return {
        ...student,
        id: data.id
      };
    } catch {
      return null;
    }
  },

  async updateStudent(id: string, updates: Partial<StudentRecord>): Promise<boolean> {
    if (!supabase) return false;
    try {
      const payload: Record<string, any> = {};
      if (updates.firstName) payload.first_name = updates.firstName;
      if (updates.lastName) payload.last_name = updates.lastName;
      if (updates.email) payload.email = updates.email;
      if (updates.phone) payload.phone = updates.phone;
      if (updates.currentLevel) payload.current_level = updates.currentLevel;
      if (updates.status) payload.status = updates.status;
      if (updates.currentCgpa !== undefined) payload.current_cgpa = updates.currentCgpa;
      if (updates.creditsEarned !== undefined) payload.credits_earned = updates.creditsEarned;
      if (updates.academicStanding) payload.academic_standing = updates.academicStanding;

      const { error } = await supabase
        .from('students')
        .update(payload)
        .eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // 7. Admissions Applications & Lifecycle
  async getApplications(): Promise<AdmissionApplication[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('admission_applications').select('*');
      if (error || !data) return null;
      return data.map(a => ({
        id: a.id,
        applicationNumber: a.application_number,
        applicantId: a.applicant_user_id,
        title: a.title,
        firstName: a.first_name,
        lastName: a.last_name,
        otherNames: a.other_names,
        email: a.email,
        phone: a.phone,
        alternativePhone: a.alternative_phone,
        dateOfBirth: a.date_of_birth,
        gender: a.gender,
        nationality: a.nationality,
        countryOfResidence: a.country_of_residence,
        identificationType: a.identification_type,
        identificationNumber: a.identification_number,
        maritalStatus: a.marital_status,
        address: a.address,
        postalAddress: a.postal_address,
        region: a.region,
        city: a.city,
        country: a.country,
        nextOfKin: a.next_of_kin,
        guardianName: a.guardian_name,
        guardianPhone: a.guardian_phone,
        facultyId: a.faculty_id,
        departmentId: a.department_id,
        programChoiceId: a.program_choice_id,
        programChoiceName: 'Selected Program',
        secondChoiceProgramId: a.second_choice_program_id,
        studyMode: a.study_mode,
        admissionSession: a.admission_session,
        entryLevel: a.entry_level,
        secondarySchool: a.secondary_school,
        completionYear: a.completion_year,
        aggregateScore: Number(a.aggregate_score),
        wassceAggregate: Number(a.wassce_aggregate || a.aggregate_score),
        qualifications: a.qualifications || [],
        wassceResults: a.wassce_results || [],
        status: a.status,
        currentStep: a.current_step || 1,
        progressPercent: a.progress_percent || 0,
        isDraft: a.is_draft,
        submittedAt: a.submitted_at,
        appliedDate: a.submitted_at ? a.submitted_at.split('T')[0] : undefined,
        reviewedBy: a.reviewed_by,
        reviewedAt: a.reviewed_at,
        reviewNotes: a.review_notes,
        internalRegistryNotes: a.internal_registry_notes,
        correctionRequested: a.correction_requested,
        allocatedStudentId: a.allocated_student_id,
        declarationConfirmed: a.declaration_confirmed,
        documents: []
      }));
    } catch {
      return null;
    }
  },

  async createApplication(app: Partial<AdmissionApplication>): Promise<AdmissionApplication | null> {
    if (!supabase) return null;
    try {
      const payload: Record<string, any> = {
        tenant_id: DEFAULT_TENANT_ID,
        application_number: app.applicationNumber,
        first_name: app.firstName,
        last_name: app.lastName,
        email: app.email,
        phone: app.phone,
        date_of_birth: app.dateOfBirth || '2006-01-01',
        gender: app.gender || 'Male',
        nationality: app.nationality || 'Ghanaian',
        address: app.address || 'Address',
        program_choice_id: app.programChoiceId || '00000000-0000-0000-0000-000000000001',
        secondary_school: app.secondarySchool || 'Senior High School',
        completion_year: app.completionYear || 2025,
        aggregate_score: app.aggregateScore || 10,
        status: app.status || 'draft',
        is_draft: app.isDraft || false,
        submitted_at: app.status === 'submitted' ? new Date().toISOString() : null
      };

      const { data, error } = await supabase
        .from('admission_applications')
        .insert(payload)
        .select()
        .single();
      if (error || !data) return null;
      return {
        ...app,
        id: data.id
      } as AdmissionApplication;
    } catch {
      return null;
    }
  },

  async updateApplicationStatus(id: string, status: ApplicationStatus, notes?: string, allocatedStudentId?: string, correctionDetails?: any): Promise<boolean> {
    if (!supabase) return false;
    try {
      const payload: Record<string, any> = { 
        status,
        updated_at: new Date().toISOString()
      };
      if (notes) payload.review_notes = notes;
      if (allocatedStudentId) payload.allocated_student_id = allocatedStudentId;
      if (correctionDetails) payload.correction_requested = correctionDetails;

      const { error } = await supabase
        .from('admission_applications')
        .update(payload)
        .eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // 8. Registrations
  async createRegistration(reg: CourseRegistrationSlip): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { data: regRow, error: regError } = await supabase
        .from('course_registrations')
        .insert({
          tenant_id: DEFAULT_TENANT_ID,
          student_id: reg.studentId,
          academic_session: reg.academicSession,
          semester: reg.semester,
          level: reg.level,
          status: reg.status,
          total_credits: reg.totalCredits
        })
        .select()
        .single();
      if (regError || !regRow) return false;

      if (reg.items && reg.items.length > 0) {
        const itemsPayload = reg.items.map(it => ({
          registration_id: regRow.id,
          course_id: it.courseId || '00000000-0000-0000-0000-000000000001',
          credit_hours: it.creditHours,
          status: it.status
        }));
        await supabase.from('registered_course_items').insert(itemsPayload);
      }
      return true;
    } catch {
      return false;
    }
  },

  async updateRegistrationStatus(id: string, status: string, approvedBy?: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const payload: Record<string, any> = { status };
      if (approvedBy) {
        payload.approved_by = approvedBy;
        payload.approved_at = new Date().toISOString();
      }
      const { error } = await supabase
        .from('course_registrations')
        .update(payload)
        .eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // 9. Attendance
  async recordAttendance(session: AttendanceSession): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { data, error } = await supabase
        .from('attendance_sessions')
        .insert({
          tenant_id: DEFAULT_TENANT_ID,
          course_id: (session as any).courseId || session.courseCode || '00000000-0000-0000-0000-000000000001',
          lecturer_id: '00000000-0000-0000-0000-000000000001',
          session_date: session.date,
          session_topic: session.topic,
          present_count: session.presentCount,
          total_students: session.totalStudents
        });
      return !error;
    } catch {
      return false;
    }
  },

  // 10. Audit Logs
  async getAuditLogs(): Promise<AuditLogEntry[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error || !data) return null;
      return data.map(l => ({
        id: l.id,
        userId: l.user_id || 'system',
        userName: l.user_name || 'System Operator',
        userRole: l.user_role || 'admin_registrar',
        action: l.action,
        entity: l.entity,
        entityId: l.entity_id,
        details: l.details || '',
        ipAddress: l.ip_address || '127.0.0.1',
        timestamp: l.created_at
      }));
    } catch {
      return null;
    }
  },

  async createAuditLog(log: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          tenant_id: DEFAULT_TENANT_ID,
          user_id: log.userId,
          user_name: log.userName,
          user_role: log.userRole,
          action: log.action,
          entity: log.entity,
          entity_id: log.entityId,
          details: log.details,
          ip_address: log.ipAddress
        });
      return !error;
    } catch {
      return false;
    }
  },

  // 11. Announcements
  async getAnnouncements(): Promise<Announcement[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (error || !data) return null;
      return data.map(an => ({
        id: an.id,
        title: an.title,
        content: an.content,
        targetAudience: an.target_audience,
        priority: an.priority,
        category: an.category,
        authorName: an.author_name || 'Registry Office',
        authorRole: an.author_role || 'Registrar',
        publishedAt: an.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        expiresAt: an.expires_at,
        isPinned: an.is_pinned,
        readCount: an.read_count || 0
      }));
    } catch {
      return null;
    }
  },

  async createAnnouncement(ann: Omit<Announcement, 'id' | 'publishedAt' | 'readCount'>): Promise<Announcement | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert({
          tenant_id: DEFAULT_TENANT_ID,
          title: ann.title,
          content: ann.content,
          target_audience: ann.targetAudience,
          priority: ann.priority,
          category: ann.category,
          author_name: ann.authorName,
          author_role: ann.authorRole,
          is_pinned: ann.isPinned,
          expires_at: ann.expiresAt
        })
        .select()
        .single();
      if (error || !data) return null;
      return {
        ...ann,
        id: data.id,
        publishedAt: data.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        readCount: 0
      };
    } catch {
      return null;
    }
  },

  // 12. Notifications
  async createNotification(notif: { title: string; message: string; category: string; userId?: string }): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          tenant_id: DEFAULT_TENANT_ID,
          user_id: notif.userId || '00000000-0000-0000-0000-000000000001',
          title: notif.title,
          message: notif.message,
          category: notif.category,
          is_read: false
        });
      return !error;
    } catch {
      return false;
    }
  }
};
