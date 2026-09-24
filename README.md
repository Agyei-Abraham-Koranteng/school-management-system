# Premier University - Enterprise School Management System (SIS / ERP)

A comprehensive, modern Higher Education Student Information System (SIS) and Institutional ERP built with React 19, TypeScript, Vite, Tailwind CSS, Supabase, and real-time state synchronization.

---

## 🏛️ System Overview

The **Premier School Management System** is a unified multi-portal digital campus platform supporting four institutional roles:

1. **Student Portal (Academics & Services)**
   - **Interactive Dashboard**: Live semester enrolled units, GPA/CGPA tracker, attendance rate, and fee balance indicators.
   - **Digital Student ID**: Secure biometric-style digital ID with tamper-evident cryptographic QR verification.
   - **Course Registration**: Level-aware registration catalog, prerequisite checks, real-time credit limit validation, and instant submission for academic approval.
   - **Class Timetable & Schedule**: Interactive weekly schedule derived dynamically from approved courses with venue and faculty assignment.
   - **Attendance & Roll Call**: Real-time lecture hours tracking and attendance status monitoring.
   - **Results & CGPA Analytics**: Semester-by-semester breakdown, visual GPA trajectory charts, and academic standing calculation.
   - **Transcripts & Official Slips**: Official downloadable transcripts, registration slips, and grade verification.
   - **Tuition & Bursary Portal**: Itemized fee breakdown, direct digital payments, statement downloads, and verified receipts.
   - **Document Archive**: Institutional letter downloads (admission letters, clearance forms, transcripts).
   - **Bulletins & Campus Announcements**: Real-time push updates and circulars.

2. **Institutional Administration (Super Admin / Registrar)**
   - **Executive Overview**: High-level KPIs across enrollment, revenue collection, admission funnel, and faculty distribution.
   - **Public Website CMS**: Dynamic live content manager for public-facing university landing pages, academic programs, and tuition schedules.
   - **Admissions Directorate**: Comprehensive applicant pipeline with document verification, scoring, interview scheduling, offer letters, and one-click auto-matriculation.
   - **Students Directory**: Central student database with multi-field search, program/level filtering, and CSV export.
   - **Academic Structure**: Dynamic management of Faculties, Departments, Degree Programs, and Course Catalogs.
   - **Staff & Faculty Directory**: Academic appointment management, office allocations, and course assignments.
   - **User & Security Admin**: Role-based access control (RBAC), multi-tenant security, and session management.
   - **Progression Engine**: Automated academic board evaluation, promotion criteria, probation flagging, and graduation audits.
   - **Warnings & Carryovers**: Automated academic advisory notices and carryover course tracking.
   - **Graduation Clearance**: Multi-department clearance workflow (Academic, Bursary, Library, Faculty).
   - **Institutional Reports**: Real-time dynamic reporting across Enrollment, Academic Performance, Course Capacity, and Bursary Audits.
   - **Security Audit Logs**: Immutable system activity trail.
   - **System Settings**: University identity, grading scales, currency, and academic calendar controls.

3. **Instructional Portal (Lecturer / Faculty)**
   - **Faculty Dashboard**: Assigned courses, enrolled students, lecture timetable, and quick shortcuts.
   - **Live Roll Call**: Class roll-call interface with instant student status marking (Present / Absent / Late / Excused).
   - **Gradebook Entry**: Dynamic CA and Exam score recording with automatic letter grade computation.
   - **Curriculum Catalog**: Department course outlines and syllabus review.
   - **Lecture Timetable**: Faculty-specific weekly lecture and lab schedule.

4. **Bursary Directorate (Finance Officer)**
   - **Financial Dashboard**: Gross billing, real-time collections, receivables, and debt recovery rates.
   - **Tuition Ledgers**: Complete student account statements with transaction histories.
   - **Student Debtors**: Filterable debtor roster with automated warning notifications and clearance tools.
   - **Receipt Archives**: Digitally verifiable payment receipts and transaction records.
   - **Financial Reports**: Exportable revenue and collections audit reports.

---

## ⚡ Tech Stack

- **Frontend Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Animation & Visuals**: Motion, Canvas Confetti, Recharts
- **Database & Backend**: Supabase (PostgreSQL, Row Level Security, Auth), IndexedDB, LocalStorage
- **Real-Time Architecture**: Multi-tab broadcast channel (`realtimeSyncManager`) & cross-tab storage event synchronization

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `bun`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Agyei-Abraham-Koranteng/school-management-system.git
   cd school-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Configure your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. Build for production:
   ```bash
   npm run build
   ```

---

## 🔐 Default Demo Accounts

| Role | Email / Identifier | Password |
| :--- | :--- | :--- |
| **Student** | `abraham.koranteng@premier.edu` (or `PU20230001`) | `premier2026` |
| **Super Admin** | `admin@premier.edu` | `premier2026` |
| **Lecturer** | `kwesi.mensah@premier.edu` | `premier2026` |
| **Finance Officer** | `bursar@premier.edu` | `premier2026` |

---

## 📄 License
This project is licensed under the MIT License.
