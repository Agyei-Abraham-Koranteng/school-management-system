-- ==============================================================================
-- PREMIER EDTECH SAAS SCHOOL MANAGEMENT SYSTEM
-- Production Relational Schema, Multi-Tenant Architecture & Supabase RLS Hardening
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. MULTI-TENANT INSTITUTIONAL STRUCTURE
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(128) UNIQUE NOT NULL,
    logo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_settings (
    tenant_id UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
    institution_name VARCHAR(255) NOT NULL,
    institution_motto VARCHAR(255),
    current_session VARCHAR(32) NOT NULL DEFAULT '2025/2026',
    current_semester VARCHAR(32) NOT NULL DEFAULT 'First Semester',
    min_registration_credits INT NOT NULL DEFAULT 15 CHECK (min_registration_credits >= 6),
    max_registration_credits INT NOT NULL DEFAULT 21 CHECK (max_registration_credits <= 30),
    min_progression_cgpa NUMERIC(3,2) NOT NULL DEFAULT 1.50 CHECK (min_progression_cgpa >= 1.00 AND min_progression_cgpa <= 3.00),
    min_graduation_credits INT NOT NULL DEFAULT 132 CHECK (min_graduation_credits >= 60),
    attendance_warning_threshold INT NOT NULL DEFAULT 75 CHECK (attendance_warning_threshold BETWEEN 50 AND 100),
    currency_code VARCHAR(8) NOT NULL DEFAULT 'GHS',
    grading_scale JSONB NOT NULL DEFAULT '[
        {"grade": "A", "minScore": 80, "maxScore": 100, "gradePoint": 4.0, "description": "Excellent"},
        {"grade": "B+", "minScore": 75, "maxScore": 79, "gradePoint": 3.5, "description": "Very Good"},
        {"grade": "B", "minScore": 70, "maxScore": 74, "gradePoint": 3.0, "description": "Good"},
        {"grade": "C+", "minScore": 65, "maxScore": 69, "gradePoint": 2.5, "description": "Fairly Good"},
        {"grade": "C", "minScore": 60, "maxScore": 64, "gradePoint": 2.0, "description": "Pass"},
        {"grade": "D+", "minScore": 55, "maxScore": 59, "gradePoint": 1.5, "description": "Weak Pass"},
        {"grade": "D", "minScore": 50, "maxScore": 54, "gradePoint": 1.0, "description": "Barely Pass"},
        {"grade": "F", "minScore": 0, "maxScore": 49, "gradePoint": 0.0, "description": "Fail"}
    ]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. USERS & ROLES
-- ------------------------------------------------------------------------------

CREATE TYPE user_role_type AS ENUM (
    'student',
    'lecturer',
    'finance_officer',
    'admin_registrar',
    'super_admin'
);

CREATE TYPE account_status_type AS ENUM (
    'active',
    'suspended',
    'inactive',
    'pending_verification'
);

CREATE TABLE IF NOT EXISTS app_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    auth_user_id UUID UNIQUE, -- Supabase auth.users reference
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role_type NOT NULL,
    status account_status_type NOT NULL DEFAULT 'active',
    department_name VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    CONSTRAINT unique_tenant_email UNIQUE(tenant_id, email)
);

CREATE TABLE IF NOT EXISTS staff_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
    staff_id VARCHAR(64) NOT NULL,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64),
    department VARCHAR(255) NOT NULL,
    faculty VARCHAR(255) NOT NULL,
    position VARCHAR(128) NOT NULL,
    qualification VARCHAR(255),
    office_location VARCHAR(128),
    courses_assigned JSONB NOT NULL DEFAULT '[]'::jsonb,
    status account_status_type NOT NULL DEFAULT 'active',
    CONSTRAINT unique_tenant_staff_id UNIQUE(tenant_id, staff_id)
);

-- ------------------------------------------------------------------------------
-- 3. ACADEMIC STRUCTURE & CURRICULUM
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS faculties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(32) NOT NULL,
    dean_name VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_tenant_faculty_code UNIQUE(tenant_id, code)
);

CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES faculties(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(32) NOT NULL,
    hod_name VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_tenant_dept_code UNIQUE(tenant_id, code)
);

CREATE TABLE IF NOT EXISTS academic_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(32) NOT NULL,
    degree_type VARCHAR(64) NOT NULL DEFAULT 'B.Sc.',
    duration_years INT NOT NULL DEFAULT 4 CHECK (duration_years BETWEEN 1 AND 7),
    total_credits_required INT NOT NULL DEFAULT 132 CHECK (total_credits_required >= 60),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_tenant_prog_code UNIQUE(tenant_id, code)
);

CREATE TYPE course_type AS ENUM ('core', 'elective', 'general');

CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    code VARCHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    credit_hours INT NOT NULL CHECK (credit_hours BETWEEN 1 AND 6),
    level VARCHAR(8) NOT NULL CHECK (level IN ('100', '200', '300', '400', '500')),
    semester VARCHAR(32) NOT NULL CHECK (semester IN ('First Semester', 'Second Semester')),
    type course_type NOT NULL DEFAULT 'core',
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_tenant_course_code UNIQUE(tenant_id, code)
);

CREATE TABLE IF NOT EXISTS course_prerequisites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    prerequisite_course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    CONSTRAINT unique_course_prereq UNIQUE(course_id, prerequisite_course_id),
    CONSTRAINT check_no_self_prereq CHECK (course_id <> prerequisite_course_id)
);

-- ------------------------------------------------------------------------------
-- 4. STUDENTS & ADMISSIONS LIFECYCLE
-- ------------------------------------------------------------------------------

CREATE TYPE student_status_type AS ENUM (
    'active',
    'probation',
    'suspended',
    'withdrawn',
    'graduated'
);

CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
    matric_no VARCHAR(64) NOT NULL,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    other_names VARCHAR(128),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64),
    program_id UUID NOT NULL REFERENCES academic_programs(id) ON DELETE RESTRICT,
    current_level VARCHAR(8) NOT NULL DEFAULT '100' CHECK (current_level IN ('100', '200', '300', '400', '500')),
    status student_status_type NOT NULL DEFAULT 'active',
    current_cgpa NUMERIC(4,2) NOT NULL DEFAULT 0.00 CHECK (current_cgpa >= 0.00 AND current_cgpa <= 5.00),
    credits_earned INT NOT NULL DEFAULT 0 CHECK (credits_earned >= 0),
    admission_session VARCHAR(32) NOT NULL,
    admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
    academic_standing VARCHAR(64) NOT NULL DEFAULT 'Good Standing',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_tenant_matric_no UNIQUE(tenant_id, matric_no)
);

CREATE TABLE IF NOT EXISTS student_profiles_extra (
    student_id UUID PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    blood_group VARCHAR(8),
    allergies TEXT,
    emergency_contact JSONB,
    residential_address TEXT,
    hall_of_residence VARCHAR(128),
    room_number VARCHAR(64),
    profile_completion_pct INT NOT NULL DEFAULT 50 CHECK (profile_completion_pct BETWEEN 0 AND 100),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE application_status_type AS ENUM (
    'pending_review',
    'under_review',
    'approved',
    'rejected',
    'enrolled'
);

CREATE TABLE IF NOT EXISTS admission_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    application_number VARCHAR(64) NOT NULL,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    other_names VARCHAR(128),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(16) NOT NULL,
    nationality VARCHAR(64) NOT NULL,
    address TEXT NOT NULL,
    program_choice_id UUID NOT NULL REFERENCES academic_programs(id) ON DELETE RESTRICT,
    secondary_school VARCHAR(255) NOT NULL,
    completion_year INT NOT NULL CHECK (completion_year >= 1990),
    aggregate_score INT NOT NULL CHECK (aggregate_score BETWEEN 6 AND 60),
    status application_status_type NOT NULL DEFAULT 'pending_review',
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_by VARCHAR(255),
    review_notes TEXT,
    allocated_student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    CONSTRAINT unique_tenant_app_number UNIQUE(tenant_id, application_number)
);

CREATE TABLE IF NOT EXISTS applicant_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    application_id UUID NOT NULL REFERENCES admission_applications(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(64) NOT NULL,
    file_url TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (status IN ('verified', 'pending', 'rejected')),
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. COURSE REGISTRATION & VALIDATION
-- ------------------------------------------------------------------------------

CREATE TYPE registration_status_type AS ENUM (
    'draft',
    'submitted',
    'approved',
    'rejected'
);

CREATE TABLE IF NOT EXISTS course_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    academic_session VARCHAR(32) NOT NULL,
    semester VARCHAR(32) NOT NULL,
    total_credits INT NOT NULL CHECK (total_credits BETWEEN 6 AND 30),
    status registration_status_type NOT NULL DEFAULT 'submitted',
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES app_users(id),
    CONSTRAINT unique_student_session_registration UNIQUE(student_id, academic_session, semester)
);

CREATE TABLE IF NOT EXISTS registered_course_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    registration_id UUID NOT NULL REFERENCES course_registrations(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_registration_course UNIQUE(registration_id, course_id)
);

-- ------------------------------------------------------------------------------
-- 6. GRADING, RESULTS, CGPA & ACADEMIC AUDIT
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS student_course_grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    academic_session VARCHAR(32) NOT NULL,
    semester VARCHAR(32) NOT NULL,
    ca_score NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (ca_score BETWEEN 0 AND 30),
    exam_score NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (exam_score BETWEEN 0 AND 70),
    total_score NUMERIC(5,2) NOT NULL CHECK (total_score BETWEEN 0 AND 100),
    grade VARCHAR(4) NOT NULL,
    grade_point NUMERIC(3,2) NOT NULL CHECK (grade_point BETWEEN 0.00 AND 4.00),
    is_published BOOLEAN NOT NULL DEFAULT false,
    lecturer_id UUID REFERENCES staff_profiles(id),
    approved_by UUID REFERENCES app_users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_student_course_sitting UNIQUE(student_id, course_id, academic_session, semester)
);

CREATE TABLE IF NOT EXISTS academic_warnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    session_issued VARCHAR(32) NOT NULL,
    semester_issued VARCHAR(32) NOT NULL,
    severity VARCHAR(32) NOT NULL CHECK (severity IN ('advisory', 'moderate', 'critical')),
    reason TEXT NOT NULL,
    remediation_plan TEXT,
    cgpa_at_issuance NUMERIC(4,2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'dismissed')),
    issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS carryover_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    failed_session VARCHAR(32) NOT NULL,
    failed_semester VARCHAR(32) NOT NULL,
    failed_score NUMERIC(5,2) NOT NULL,
    failed_grade VARCHAR(4) NOT NULL,
    eligible_for_retake BOOLEAN NOT NULL DEFAULT true,
    is_cleared BOOLEAN NOT NULL DEFAULT false,
    cleared_session VARCHAR(32),
    cleared_grade VARCHAR(4),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_student_uncleared_carryover UNIQUE(student_id, course_id, failed_session)
);

-- ------------------------------------------------------------------------------
-- 7. ATTENDANCE MONITORING & COMPLIANCE
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS attendance_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    lecturer_id UUID REFERENCES staff_profiles(id),
    session_date DATE NOT NULL,
    time_slot VARCHAR(64) NOT NULL,
    venue VARCHAR(128) NOT NULL,
    topic TEXT NOT NULL,
    total_students INT NOT NULL CHECK (total_students >= 0),
    present_count INT NOT NULL CHECK (present_count >= 0 AND present_count <= total_students),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    status VARCHAR(16) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_session_student_attendance UNIQUE(session_id, student_id)
);

-- ------------------------------------------------------------------------------
-- 8. FINANCE & BURSARY TRANSACTIONS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS student_ledgers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    academic_session VARCHAR(32) NOT NULL,
    semester VARCHAR(32) NOT NULL,
    total_billed NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (total_billed >= 0.00),
    total_paid NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (total_paid >= 0.00),
    outstanding_balance NUMERIC(10,2) NOT NULL CHECK (outstanding_balance = total_billed - total_paid),
    is_cleared BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_student_ledger_period UNIQUE(student_id, academic_session, semester)
);

CREATE TABLE IF NOT EXISTS financial_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    reference_no VARCHAR(128) NOT NULL,
    receipt_no VARCHAR(128) NOT NULL,
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0.00),
    payment_method VARCHAR(64) NOT NULL,
    academic_session VARCHAR(32) NOT NULL,
    semester VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'verified' CHECK (status IN ('pending', 'verified', 'reversed')),
    verified_by UUID REFERENCES app_users(id),
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_tenant_payment_ref UNIQUE(tenant_id, reference_no),
    CONSTRAINT unique_tenant_receipt_no UNIQUE(tenant_id, receipt_no)
);

-- ------------------------------------------------------------------------------
-- 9. GRADUATION & CREDENTIALS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS graduation_clearances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    credits_cleared BOOLEAN NOT NULL DEFAULT false,
    core_courses_cleared BOOLEAN NOT NULL DEFAULT false,
    carryovers_cleared BOOLEAN NOT NULL DEFAULT false,
    financial_clearance BOOLEAN NOT NULL DEFAULT false,
    project_defense_cleared BOOLEAN NOT NULL DEFAULT false,
    final_cgpa NUMERIC(4,2) NOT NULL,
    honours_class VARCHAR(128) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'cleared', 'approved', 'graduated', 'rejected')),
    certificate_number VARCHAR(128),
    completion_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_student_graduation UNIQUE(student_id)
);

-- ------------------------------------------------------------------------------
-- 10. SYSTEM DOCUMENTS & VERIFICATION
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS system_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    file_size VARCHAR(32) NOT NULL,
    file_type VARCHAR(16) NOT NULL,
    uploaded_by VARCHAR(255) NOT NULL,
    download_url TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. AUDIT LOGS (IMMUTABLE)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID,
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(64) NOT NULL,
    action VARCHAR(128) NOT NULL,
    entity VARCHAR(128) NOT NULL,
    entity_id VARCHAR(128),
    details TEXT NOT NULL,
    ip_address VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 12. ANNOUNCEMENTS & NOTIFICATIONS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    target_audience VARCHAR(32) NOT NULL CHECK (target_audience IN ('all', 'students', 'lecturers', 'finance')),
    priority VARCHAR(16) NOT NULL CHECK (priority IN ('normal', 'important', 'urgent')),
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    author_name VARCHAR(255) NOT NULL,
    published_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES app_users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- DATABASE INTEGRITY INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_users_tenant_role ON app_users(tenant_id, role);
CREATE INDEX IF NOT EXISTS idx_students_tenant_matric ON students(tenant_id, matric_no);
CREATE INDEX IF NOT EXISTS idx_students_tenant_prog_level ON students(tenant_id, program_id, current_level);
CREATE INDEX IF NOT EXISTS idx_grades_student_session ON student_course_grades(tenant_id, student_id, academic_session, semester);
CREATE INDEX IF NOT EXISTS idx_course_dept ON courses(tenant_id, department_id);
CREATE INDEX IF NOT EXISTS idx_reg_student_session ON course_registrations(tenant_id, student_id, academic_session);
CREATE INDEX IF NOT EXISTS idx_att_session_course ON attendance_sessions(tenant_id, course_id, session_date);
CREATE INDEX IF NOT EXISTS idx_audit_tenant_action ON audit_logs(tenant_id, action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(tenant_id, user_id, is_read);

-- ==============================================================================
-- TRIGGERS FOR TAMPER-PROOF AUDIT & IMMUTABILITY
-- ==============================================================================

-- Prevent tampering with audit logs (APPEND-ONLY)
CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit log entries are immutable and cannot be updated or deleted.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_immutable_audit_logs ON audit_logs;
CREATE TRIGGER trg_immutable_audit_logs
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();

-- Prevent grade modification once approved by Registrar
CREATE OR REPLACE FUNCTION prevent_approved_grade_tampering()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.approved_by IS NOT NULL AND OLD.is_published = true THEN
        IF NEW.total_score <> OLD.total_score OR NEW.grade <> OLD.grade THEN
            RAISE EXCEPTION 'Approved examination grades cannot be directly modified. Submit an official Academic Board grade appeal.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_approved_grades ON student_course_grades;
CREATE TRIGGER trg_protect_approved_grades
BEFORE UPDATE ON student_course_grades
FOR EACH ROW EXECUTE FUNCTION prevent_approved_grade_tampering();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_prerequisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles_extra ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE applicant_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE registered_course_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_course_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE carryover_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_ledgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE graduation_clearances ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper functions for JWT claims
CREATE OR REPLACE FUNCTION current_tenant_id() RETURNS UUID AS $$
    SELECT COALESCE(
        (current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id')::UUID,
        '00000000-0000-0000-0000-000000000000'::UUID
    );
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION current_user_role() RETURNS TEXT AS $$
    SELECT COALESCE(
        current_setting('request.jwt.claims', true)::jsonb ->> 'user_role',
        'anonymous'
    );
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION current_user_id() RETURNS UUID AS $$
    SELECT COALESCE(
        (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')::UUID,
        '00000000-0000-0000-0000-000000000000'::UUID
    );
$$ LANGUAGE sql STABLE;

-- ------------------------------------------------------------------------------
-- RLS POLICIES BY DOMAIN
-- ------------------------------------------------------------------------------

-- STUDENTS: Can read self, Registrars/Super Admins full access
CREATE POLICY student_select_policy ON students
    FOR SELECT USING (
        tenant_id = current_tenant_id() AND (
            current_user_role() IN ('super_admin', 'admin_registrar', 'lecturer', 'finance_officer')
            OR user_id = current_user_id()
        )
    );

CREATE POLICY student_update_policy ON students
    FOR UPDATE USING (
        tenant_id = current_tenant_id() AND current_user_role() IN ('super_admin', 'admin_registrar')
    );

-- GRADES: Students can read published grades for self; Lecturers can insert/update draft; Registrar approves
CREATE POLICY grades_select_policy ON student_course_grades
    FOR SELECT USING (
        tenant_id = current_tenant_id() AND (
            current_user_role() IN ('super_admin', 'admin_registrar')
            OR (current_user_role() = 'student' AND student_id = (SELECT id FROM students WHERE user_id = current_user_id()) AND is_published = true)
            OR (current_user_role() = 'lecturer' AND lecturer_id = (SELECT id FROM staff_profiles WHERE user_id = current_user_id()))
        )
    );

CREATE POLICY grades_insert_policy ON student_course_grades
    FOR INSERT WITH CHECK (
        tenant_id = current_tenant_id() AND current_user_role() IN ('super_admin', 'admin_registrar', 'lecturer')
    );

CREATE POLICY grades_update_policy ON student_course_grades
    FOR UPDATE USING (
        tenant_id = current_tenant_id() AND current_user_role() IN ('super_admin', 'admin_registrar', 'lecturer')
    );

-- ATTENDANCE: Students read self; Lecturers record attendance
CREATE POLICY attendance_select_policy ON attendance_records
    FOR SELECT USING (
        tenant_id = current_tenant_id() AND (
            current_user_role() IN ('super_admin', 'admin_registrar', 'lecturer')
            OR student_id = (SELECT id FROM students WHERE user_id = current_user_id())
        )
    );

CREATE POLICY attendance_insert_policy ON attendance_records
    FOR INSERT WITH CHECK (
        tenant_id = current_tenant_id() AND current_user_role() IN ('super_admin', 'admin_registrar', 'lecturer')
    );

-- FINANCIAL TRANSACTIONS & LEDGER: Finance Officers & Super Admins manage; Students view self
CREATE POLICY ledger_select_policy ON student_ledgers
    FOR SELECT USING (
        tenant_id = current_tenant_id() AND (
            current_user_role() IN ('super_admin', 'finance_officer', 'admin_registrar')
            OR student_id = (SELECT id FROM students WHERE user_id = current_user_id())
        )
    );

CREATE POLICY transactions_manage_policy ON financial_transactions
    FOR ALL USING (
        tenant_id = current_tenant_id() AND current_user_role() IN ('super_admin', 'finance_officer')
    );

-- AUDIT LOGS: Super Admins and Registrars can view, no updates/deletions allowed
CREATE POLICY audit_select_policy ON audit_logs
    FOR SELECT USING (
        tenant_id = current_tenant_id() AND current_user_role() IN ('super_admin', 'admin_registrar')
    );

CREATE POLICY audit_insert_policy ON audit_logs
    FOR INSERT WITH CHECK (
        tenant_id = current_tenant_id()
    );

-- ANNOUNCEMENTS: Public to tenant users
CREATE POLICY announcements_select_policy ON announcements
    FOR SELECT USING (
        tenant_id = current_tenant_id()
    );

CREATE POLICY announcements_manage_policy ON announcements
    FOR ALL USING (
        tenant_id = current_tenant_id() AND current_user_role() IN ('super_admin', 'admin_registrar')
    );

-- SYSTEM DOCUMENTS: Tenant users can view; Super Admins & Registrars manage
ALTER TABLE system_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY system_documents_select_policy ON system_documents
    FOR SELECT USING (
        tenant_id = current_tenant_id() AND (
            current_user_role() IN ('super_admin', 'admin_registrar', 'lecturer', 'finance_officer')
            OR student_id IS NULL
            OR student_id = (SELECT id FROM students WHERE user_id = current_user_id())
        )
    );

CREATE POLICY system_documents_manage_policy ON system_documents
    FOR ALL USING (
        tenant_id = current_tenant_id() AND current_user_role() IN ('super_admin', 'admin_registrar')
    );

-- ------------------------------------------------------------------------------
-- 12. COMPLETE ADMISSIONS LIFECYCLE, OFFERS & APPLICANT DOCUMENTS
-- ------------------------------------------------------------------------------

CREATE TYPE application_status_type AS ENUM (
    'draft',
    'submitted',
    'under_review',
    'correction_required',
    'corrections_requested',
    'resubmitted',
    'approved',
    'rejected',
    'admission_offered',
    'offer_accepted',
    'offer_declined',
    'matriculation_pending',
    'admitted',
    'enrolled',
    'withdrawn'
);

CREATE TABLE IF NOT EXISTS admission_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    applicant_user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
    application_number VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(32),
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    other_names VARCHAR(128),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    alternative_phone VARCHAR(64),
    date_of_birth DATE NOT NULL,
    gender VARCHAR(32) NOT NULL,
    nationality VARCHAR(128) NOT NULL,
    country_of_residence VARCHAR(128),
    identification_type VARCHAR(64),
    identification_number VARCHAR(128),
    marital_status VARCHAR(32),
    address TEXT NOT NULL,
    postal_address TEXT,
    region VARCHAR(128),
    city VARCHAR(128),
    country VARCHAR(128),
    next_of_kin JSONB,
    guardian_name VARCHAR(128),
    guardian_phone VARCHAR(64),
    faculty_id UUID REFERENCES faculties(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    program_choice_id UUID REFERENCES academic_programs(id) ON DELETE RESTRICT,
    second_choice_program_id UUID REFERENCES academic_programs(id) ON DELETE SET NULL,
    study_mode VARCHAR(64) DEFAULT 'Full-Time Regular',
    admission_session VARCHAR(64) NOT NULL,
    entry_level VARCHAR(16) DEFAULT '100',
    secondary_school VARCHAR(255) NOT NULL,
    completion_year INT NOT NULL,
    aggregate_score NUMERIC(4,1) NOT NULL,
    wassce_aggregate NUMERIC(4,1),
    qualifications JSONB DEFAULT '[]'::jsonb,
    wassce_results JSONB DEFAULT '[]'::jsonb,
    status application_status_type NOT NULL DEFAULT 'draft',
    current_step INT DEFAULT 1,
    progress_percent INT DEFAULT 0,
    is_draft BOOLEAN DEFAULT false,
    submitted_at TIMESTAMPTZ,
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    internal_registry_notes TEXT,
    correction_requested JSONB,
    allocated_student_id VARCHAR(64),
    declaration_confirmed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applicant_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    application_id UUID NOT NULL REFERENCES admission_applications(id) ON DELETE CASCADE,
    document_type VARCHAR(128) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    mime_type VARCHAR(128),
    file_size VARCHAR(64),
    verification_status VARCHAR(64) NOT NULL DEFAULT 'uploaded',
    verified_by VARCHAR(255),
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admission_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    application_id UUID NOT NULL REFERENCES admission_applications(id) ON DELETE CASCADE,
    application_number VARCHAR(64) NOT NULL,
    applicant_id VARCHAR(64) NOT NULL,
    applicant_name VARCHAR(255) NOT NULL,
    program_id UUID NOT NULL REFERENCES academic_programs(id),
    academic_session VARCHAR(64) NOT NULL,
    entry_level VARCHAR(16) NOT NULL DEFAULT '100',
    study_mode VARCHAR(64) NOT NULL DEFAULT 'Full-Time Regular',
    offer_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    acceptance_deadline TIMESTAMPTZ NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'offered',
    decision_date TIMESTAMPTZ,
    admission_conditions JSONB DEFAULT '[]'::jsonb,
    allocated_student_id VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS application_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    application_id UUID NOT NULL REFERENCES admission_applications(id) ON DELETE CASCADE,
    previous_status VARCHAR(64) NOT NULL,
    new_status VARCHAR(64) NOT NULL,
    changed_by VARCHAR(255) NOT NULL,
    actor_role VARCHAR(64) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: Enable security on Admissions tables
ALTER TABLE admission_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE applicant_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;

-- Applicants access self; Admissions & Registrars access all within tenant
CREATE POLICY applications_select_policy ON admission_applications
    FOR SELECT USING (
        tenant_id = current_tenant_id() AND (
            current_user_role() IN ('super_admin', 'admin_registrar')
            OR applicant_user_id = current_user_id()
        )
    );

CREATE POLICY applications_applicant_insert_policy ON admission_applications
    FOR INSERT WITH CHECK (
        tenant_id = current_tenant_id()
    );

CREATE POLICY applications_update_policy ON admission_applications
    FOR UPDATE USING (
        tenant_id = current_tenant_id() AND (
            current_user_role() IN ('super_admin', 'admin_registrar')
            OR (applicant_user_id = current_user_id() AND status IN ('draft', 'correction_required'))
        )
    );

CREATE POLICY documents_select_policy ON applicant_documents
    FOR SELECT USING (
        tenant_id = current_tenant_id() AND (
            current_user_role() IN ('super_admin', 'admin_registrar')
            OR application_id IN (SELECT id FROM admission_applications WHERE applicant_user_id = current_user_id())
        )
    );

CREATE POLICY documents_manage_policy ON applicant_documents
    FOR ALL USING (
        tenant_id = current_tenant_id()
    );

CREATE POLICY offers_select_policy ON admission_offers
    FOR SELECT USING (
        tenant_id = current_tenant_id() AND (
            current_user_role() IN ('super_admin', 'admin_registrar')
            OR application_id IN (SELECT id FROM admission_applications WHERE applicant_user_id = current_user_id())
        )
    );

CREATE POLICY offers_manage_policy ON admission_offers
    FOR ALL USING (
        tenant_id = current_tenant_id() AND (
            current_user_role() IN ('super_admin', 'admin_registrar')
            OR application_id IN (SELECT id FROM admission_applications WHERE applicant_user_id = current_user_id())
        )
    );

CREATE POLICY app_history_select_policy ON application_status_history
    FOR SELECT USING (
        tenant_id = current_tenant_id() AND (
            current_user_role() IN ('super_admin', 'admin_registrar')
            OR application_id IN (SELECT id FROM admission_applications WHERE applicant_user_id = current_user_id())
        )
    );

CREATE POLICY app_history_insert_policy ON application_status_history
    FOR INSERT WITH CHECK (
        tenant_id = current_tenant_id()
    );
