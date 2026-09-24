import React, { createContext, useContext, useState, useEffect } from 'react';

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface ProgramItem {
  id: string;
  name: string;
  level: 'undergraduate' | 'postgraduate' | 'doctoral' | 'short-courses';
  faculty: string;
  years: number;
  credits: number;
  description: string;
}

export interface AcademicCalendarItem {
  id: string;
  title: string;
  dateRange: string;
  semester: string;
  type: 'registration' | 'lectures' | 'exams' | 'break' | 'graduation';
  description: string;
}

export interface AdmissionStepItem {
  id: string;
  num: string;
  title: string;
  desc: string;
  requirement: string;
}

export interface AdmissionKeyDateItem {
  id: string;
  date: string;
  event: string;
  status: 'Open Now' | 'Passed' | 'Upcoming';
  badge: string;
}

export interface EntryRequirementItem {
  id: string;
  level: string;
  qualification: string;
  minimumGrades: string;
  details: string;
}

export interface ScholarshipItem {
  id: string;
  name: string;
  coverage: string;
  eligibility: string;
  deadline: string;
  description: string;
}

export interface CampusLifeServiceItem {
  id: string;
  title: string;
  desc: string;
  contact: string;
  location: string;
}

export interface HousingItem {
  id: string;
  name: string;
  type: 'On-Campus Residence' | 'Off-Campus Affiliate';
  capacity: string;
  pricePerSemester: string;
  amenities: string[];
  image: string;
}

export interface HealthWellnessItem {
  id: string;
  title: string;
  desc: string;
  hours: string;
  emergencyPhone: string;
  services: string[];
}

export interface SportFacilityItem {
  id: string;
  title: string;
  facility: string;
  teams: string[];
  desc: string;
  image: string;
}

export interface StudentClubItem {
  id: string;
  name: string;
  category: string;
  lead: string;
  memberCount: string;
  desc: string;
}

export interface ResearchCentreItem {
  id: string;
  category: 'health' | 'technology' | 'sustainability';
  title: string;
  director: string;
  tag: string;
  grants: string;
  image: string;
  description: string;
  highlights: string[];
}

export interface PublicationItem {
  id: string;
  journal: string;
  title: string;
  authors: string;
  year: number;
}

export interface IndustryPartnerItem {
  id: string;
  name: string;
  sector: string;
  collaboration: string;
  status: string;
}

export interface InnovationHubProjectItem {
  id: string;
  name: string;
  founder: string;
  stage: string;
  desc: string;
}

export interface ResearchGrantItem {
  id: string;
  title: string;
  funder: string;
  amount: string;
  status: 'Active' | 'Open Call' | 'Awarded';
  deadline: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
}

export interface ContactOfficeItem {
  id: string;
  title: string;
  lead: string;
  phone: string;
  email: string;
  location: string;
  hours: string;
}

export interface HomePageContent {
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroImage: string;
  heroApplyBtn: string;
  heroPortalBtn: string;
  heroStats: Array<{ end: number; suffix: string; label: string }>;
  
  aboutBadge: string;
  aboutTitle: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutImage: string;
  aboutRatingText: string;
  aboutFloatingBadgeTitle: string;
  aboutFloatingBadgeSub: string;
  aboutHighlights: Array<{ title: string; desc: string }>;

  statsBanner: Array<{ end: number; suffix: string; label: string }>;
  testimonials: TestimonialItem[];

  ctaTitle: string;
  ctaSubtitle: string;
  ctaApplyBtn: string;
  ctaPortalBtn: string;
}

export interface ContactPageContent {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  campusAddress: string;
  digitalAddress: string;
  airportProximity: string;
  emergencyTitle: string;
  emergencyHotline: string;
  offices: ContactOfficeItem[];
}

export interface SiteSettings {
  institutionName: string;
  motto: string;
  estYear: string;
  locationCity: string;
  mainPhone: string;
  mainEmail: string;
  accreditationText: string;
  copyrightText: string;
  socials: {
    facebook: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
}

// ─── Initial Defaults ───────────────────────────────────────────────────────

export const DEFAULT_HOME_PAGE: HomePageContent = {
  heroBadge: '#1 Ranked University in West Africa — QS Rankings 2026',
  heroTitle: 'Shape the',
  heroHighlight: 'Future',
  heroSubtitle: 'Premier University has been at the forefront of academic excellence for over six decades. Join a community of scholars, innovators, and change-makers transforming Africa and the world.',
  heroImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop&q=80',
  heroApplyBtn: 'Apply for Admission',
  heroPortalBtn: 'Student Portal',
  heroStats: [
    { end: 28000, suffix: '+', label: 'Students Enrolled' },
    { end: 120, suffix: '+', label: 'Academic Programs' },
    { end: 62, suffix: ' yrs', label: 'Years of Excellence' },
    { end: 95, suffix: '%', label: 'Graduate Employment' },
  ],

  aboutBadge: 'About Premier University',
  aboutTitle: 'A legacy of excellence, a future of innovation.',
  aboutParagraph1: 'Founded in 1962, Premier University has grown into one of Africa’s most respected institutions of higher learning. Our commitment to rigorous academics, groundbreaking research, and community service has produced over 150,000 alumni leading global industries.',
  aboutParagraph2: 'We offer an expansive collegiate ecosystem featuring six faculties, accredited medical and engineering colleges, cutting-edge computing laboratories, and high-impact biotechnology institutes.',
  aboutImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
  aboutRatingText: '4.9 / 5.0 Global Student Rating',
  aboutFloatingBadgeTitle: '#1 in West Africa',
  aboutFloatingBadgeSub: 'QS World University Rankings',
  aboutHighlights: [
    { title: '48 Countries', desc: 'Active international scholars and research exchanges' },
    { title: '200+ Laboratories', desc: 'Equipped with Illumina sequencing and clean tech microgrids' },
    { title: '1,400+ Faculty', desc: 'World-class professors and doctoral researchers' },
    { title: '12 Global Honors', desc: 'Recognized for public health and pedagogical innovation' },
  ],

  statsBanner: [
    { end: 28000, suffix: '+', label: 'Active Students' },
    { end: 1400, suffix: '+', label: 'Academic Faculty' },
    { end: 150000, suffix: '+', label: 'Alumni Worldwide' },
    { end: 350, suffix: 'M+', label: 'Research Grants (GHS)' },
  ],

  testimonials: [
    {
      id: 'test-1',
      name: 'Abena Asante',
      role: 'MSc Computer Science, Class of 2025',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&auto=format&fit=crop&q=80',
      quote: 'The AI Research Centre gave me the tools and mentorship to build a startup that is now impacting thousands of smallholder cocoa farmers across Ghana with precision telemetry.',
    },
    {
      id: 'test-2',
      name: 'Kofi Boateng',
      role: 'BBA Business Administration, Class of 2024',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      quote: 'Premier University’s executive faculty opened doors I never imagined. Within two years of graduating, I was appointed Financial Director of a multinational firm in London.',
    },
    {
      id: 'test-3',
      name: 'Ama Owusu-Barimah',
      role: 'MBChB Medicine & Surgery, Class of 2025',
      avatar: 'https://images.unsplash.com/photo-1557053910-d9eadeed1c58?w=150&auto=format&fit=crop&q=80',
      quote: 'Our 500-bed teaching hospital offers unmatched clinical exposure. I assisted in complex neurosurgical procedures under pioneer surgeons — something rare at most institutions.',
    },
  ],

  ctaTitle: 'Ready to begin your academic legacy?',
  ctaSubtitle: 'Join thousands of students who are building careers, making scientific discoveries, and transforming lives at Premier University.',
  ctaApplyBtn: 'Apply for Admission',
  ctaPortalBtn: 'Student Portal',
};

export const DEFAULT_CONTACT_PAGE: ContactPageContent = {
  heroBadge: 'Connect with Premier University',
  heroTitle: 'We Are Here to Assist You',
  heroSubtitle: 'Have questions regarding admissions, faculty collaborations, campus tours, or student records? Reach out to our dedicated support teams.',
  campusAddress: 'University Avenue, Legon Hill Campus, Accra, Greater Accra Region, Ghana',
  digitalAddress: 'GA-234-5678',
  airportProximity: '15 min drive from Kotoka International Airport (ACC)',
  emergencyTitle: '24/7 Campus Emergency Police & Ambulance Service',
  emergencyHotline: '+233 30 277 1999',
  offices: [
    {
      id: 'off-1',
      title: 'Admissions & Student Recruitment',
      lead: 'Directorate of Academic Affairs',
      phone: '+233 30 277 1001',
      email: 'admissions@premier.edu.gh',
      location: 'Central Registry Building, Wing A, Ground Floor',
      hours: 'Mon – Fri: 8:00 AM – 5:00 PM',
    },
    {
      id: 'off-2',
      title: 'Main University Switchboard',
      lead: 'General Enquiries & Administration',
      phone: '+233 30 277 1000',
      email: 'info@premier.edu.gh',
      location: 'Chancellor Hall Administration Complex',
      hours: 'Mon – Fri: 7:30 AM – 6:00 PM',
    },
    {
      id: 'off-3',
      title: 'International Student Affairs',
      lead: 'Global Engagements & Visa Support',
      phone: '+233 30 277 1008',
      email: 'international@premier.edu.gh',
      location: 'International House, West Campus',
      hours: 'Mon – Fri: 8:30 AM – 4:30 PM',
    },
    {
      id: 'off-4',
      title: 'Research & Innovation Office (ORID)',
      lead: 'Grants, Commercialization & Patents',
      phone: '+233 30 277 1020',
      email: 'research@premier.edu.gh',
      location: 'Innovation Complex, Science Quadrangle',
      hours: 'Mon – Fri: 8:00 AM – 5:00 PM',
    },
  ],
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  institutionName: 'Premier University',
  motto: 'Knowledge, Integrity, and Transformative Leadership',
  estYear: '1962',
  locationCity: 'Accra, Ghana',
  mainPhone: '+233 30 277 1000',
  mainEmail: 'info@premier.edu.gh',
  accreditationText: 'Chartered by the National Accreditation Board and GTEC.',
  copyrightText: 'Premier University. All rights reserved.',
  socials: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
  },
};

export const DEFAULT_PROGRAMS: ProgramItem[] = [
  { id: 'cs-1', name: 'BSc Computer Science', level: 'undergraduate', faculty: 'Faculty of Computing & Information Technology', years: 4, credits: 132, description: 'Algorithms, artificial intelligence, software engineering, and network architectures.' },
  { id: 'se-1', name: 'BSc Software Engineering', level: 'undergraduate', faculty: 'Faculty of Computing & Information Technology', years: 4, credits: 134, description: 'Full-stack development, cloud microservices, testing methodologies, and agile system design.' },
  { id: 'it-1', name: 'BSc Information Technology', level: 'undergraduate', faculty: 'Faculty of Computing & Information Technology', years: 4, credits: 130, description: 'Systems administration, cyber-infrastructure, enterprise database management, and network security.' },
  { id: 'cy-1', name: 'BSc Cybersecurity', level: 'undergraduate', faculty: 'Faculty of Computing & Information Technology', years: 4, credits: 136, description: 'Penetration testing, cryptography, cloud security governance, and digital forensics.' },
  { id: 'ai-msc', name: 'MSc Artificial Intelligence', level: 'postgraduate', faculty: 'Faculty of Computing & Information Technology', years: 2, credits: 64, description: 'Deep learning, NLP, computer vision, and ethical neural system deployments.' },
  { id: 'ds-msc', name: 'MSc Data Science', level: 'postgraduate', faculty: 'Faculty of Computing & Information Technology', years: 2, credits: 62, description: 'Big data pipelines, statistical inferencing, predictive modeling, and business intelligence.' },
  { id: 'cs-phd', name: 'PhD Computer Science', level: 'doctoral', faculty: 'Faculty of Computing & Information Technology', years: 4, credits: 90, description: 'Doctoral research in autonomous robotics, distributed systems, and quantum algorithms.' },
  { id: 'bc-1', name: 'BSc Biochemistry', level: 'undergraduate', faculty: 'Faculty of Pure & Applied Sciences', years: 4, credits: 136, description: 'Molecular genetics, enzymology, cellular metabolism, and pharmaceutical biology.' },
  { id: 'ph-1', name: 'BSc Physics', level: 'undergraduate', faculty: 'Faculty of Pure & Applied Sciences', years: 4, credits: 130, description: 'Solid-state physics, quantum mechanics, astrophysics, and computational modeling.' },
  { id: 'math-msc', name: 'MSc Applied Mathematics', level: 'postgraduate', faculty: 'Faculty of Pure & Applied Sciences', years: 2, credits: 60, description: 'Stochastic calculus, numerical analysis, mathematical biology, and optimization.' },
  { id: 'mol-phd', name: 'PhD Molecular Biology', level: 'doctoral', faculty: 'Faculty of Pure & Applied Sciences', years: 4, credits: 90, description: 'Advanced gene therapy vectors, recombinant DNA technologies, and structural bioinformatics.' },
  { id: 'bba-1', name: 'BBA Business Administration', level: 'undergraduate', faculty: 'Premier Business School', years: 4, credits: 128, description: 'Strategic management, corporate finance, organizational behavior, and global marketing.' },
  { id: 'acc-1', name: 'BSc Accounting & Finance', level: 'undergraduate', faculty: 'Premier Business School', years: 4, credits: 132, description: 'Forensic auditing, international taxation, financial accounting, and capital markets.' },
  { id: 'mba-1', name: 'MBA Executive', level: 'postgraduate', faculty: 'Premier Business School', years: 2, credits: 68, description: 'Leadership, corporate governance, cross-border mergers, and executive negotiations.' },
  { id: 'dba-1', name: 'DBA (Doctor of Business Administration)', level: 'doctoral', faculty: 'Premier Business School', years: 4, credits: 88, description: 'Applied managerial research, industry disruption models, and boardroom strategy.' },
  { id: 'sc-cloud', name: 'Executive Certificate in Cloud Solutions Architecture', level: 'short-courses', faculty: 'Faculty of Computing & Information Technology', years: 1, credits: 15, description: 'Intensive 12-week professional immersion in Kubernetes, Terraform, and multi-cloud infra.' },
  { id: 'sc-fintech', name: 'Professional Diploma in FinTech & Digital Payments', level: 'short-courses', faculty: 'Premier Business School', years: 1, credits: 18, description: '8-week executive module on mobile money APIs, AML compliance, and blockchain systems.' },
  { id: 'med-1', name: 'MBChB Medicine & Surgery', level: 'undergraduate', faculty: 'College of Health Sciences', years: 6, credits: 210, description: 'Pre-clinical sciences, clinical rotations, internal medicine, pediatrics, and surgery.' },
  { id: 'nurs-1', name: 'BSc Nursing', level: 'undergraduate', faculty: 'College of Health Sciences', years: 4, credits: 140, description: 'Clinical therapeutics, patient advocacy, perioperative nursing, and community healthcare.' },
  { id: 'epi-msc', name: 'MSc Epidemiology', level: 'postgraduate', faculty: 'College of Health Sciences', years: 2, credits: 60, description: 'Biostatistics, infectious disease outbreak response, field surveillance, and health policy.' },
];

export const DEFAULT_CALENDAR: AcademicCalendarItem[] = [
  { id: 'cal-1', title: 'First Semester Course Registration Closes', dateRange: 'October 15, 2026', semester: 'First Semester 2026/2027', type: 'registration', description: 'Mandatory online registration for all enrolled undergraduate and postgraduate students.' },
  { id: 'cal-2', title: 'Lectures Begin for All Faculties', dateRange: 'October 20, 2026', semester: 'First Semester 2026/2027', type: 'lectures', description: 'Commencement of in-person lectures and laboratory practical sessions across all campuses.' },
  { id: 'cal-3', title: 'Mid-Semester Examinations & Continuous Assessment', dateRange: 'December 1 – 12, 2026', semester: 'First Semester 2026/2027', type: 'exams', description: 'Departmental quizzes, practical assessments, and term paper submissions.' },
  { id: 'cal-4', title: 'Christmas & Winter Academic Recess', dateRange: 'December 20, 2026 – January 5, 2027', semester: 'First Semester 2026/2027', type: 'break', description: 'University offices close for winter holiday recess. Portal remains accessible.' },
  { id: 'cal-5', title: 'First Semester Main Examinations', dateRange: 'February 2 – 20, 2027', semester: 'First Semester 2026/2027', type: 'exams', description: 'Comprehensive end-of-semester proctored exams across all degree disciplines.' },
  { id: 'cal-6', title: 'Annual Congregation & Graduation Ceremony', dateRange: 'April 25, 2027', semester: 'Second Semester 2026/2027', type: 'graduation', description: 'Official conferment of diplomas, bachelor’s, master’s, and doctoral degrees at the Great Hall.' },
];

export const DEFAULT_ADMISSION_STEPS: AdmissionStepItem[] = [
  { id: 'st-1', num: '01', title: 'Create Your Applicant Account', desc: 'Sign up on the admissions portal, verify your email address, and select your target program category.', requirement: 'Valid personal email & phone number' },
  { id: 'st-2', num: '02', title: 'Submit Academic Credentials', desc: 'Complete the digital bio-data sections and upload verified copies of high school certificates or degree transcripts.', requirement: 'WASSCE / A-Levels / Degree transcripts' },
  { id: 'st-3', num: '03', title: 'Entrance Assessment & Interview', desc: 'Candidates sit for an online aptitude evaluation or departmental panel interview depending on the discipline.', requirement: 'Online or in-person evaluation' },
  { id: 'st-4', num: '04', title: 'Receive Offer & Accept Admission', desc: 'Admitted applicants receive formal digital offer letters. Accept and lock in your matriculation enrollment deposit.', requirement: 'Formal matriculation induction' },
];

export const DEFAULT_KEY_DATES: AdmissionKeyDateItem[] = [
  { id: 'kd-1', date: 'October 1, 2026', event: '2026/2027 Admissions Portal Opens Globally', status: 'Passed', badge: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400' },
  { id: 'kd-2', date: 'January 15, 2027', event: 'Early Decision & Merit Scholarship Deadline', status: 'Passed', badge: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400' },
  { id: 'kd-3', date: 'April 30, 2027', event: 'Regular Admissions Cycle Deadline', status: 'Open Now', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' },
  { id: 'kd-4', date: 'May 15 – 30, 2027', event: 'Aptitude Tests & Faculty Selection Interviews', status: 'Upcoming', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300' },
  { id: 'kd-5', date: 'June 20, 2027', event: 'First Batch Offer Letters Dispatched', status: 'Upcoming', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300' },
  { id: 'kd-6', date: 'September 1, 2027', event: 'Freshmen Orientation & Matriculation Commences', status: 'Upcoming', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300' },
];

export const DEFAULT_ENTRY_REQUIREMENTS: EntryRequirementItem[] = [
  { id: 'er-1', level: 'Undergraduate (WASSCE / SSSCE)', qualification: 'West African Senior School Certificate', minimumGrades: 'Credit Passes (Grade C6 or better in WASSCE / D in SSSCE) in 6 subjects', details: 'Must include 3 Core Subjects (English Language, Integrated Science, and Core Mathematics) and 3 Elective Subjects relevant to chosen degree.' },
  { id: 'er-2', level: 'Undergraduate (A-Levels / Cambridge)', qualification: 'Cambridge GCE Advanced Level', minimumGrades: 'Grade C or better in 3 Advanced Level subjects', details: 'Plus 5 passes at O-Level including English and Mathematics. General Paper must be sat.' },
  { id: 'er-3', level: 'Postgraduate (Master’s / MBA)', qualification: 'Accredited Bachelor’s Degree', minimumGrades: 'Second Class Lower Division (Minimum CGPA 2.50) or higher', details: 'Graduates with Third Class and 3+ years demonstrable professional experience are considered via entrance interview.' },
  { id: 'er-4', level: 'Doctoral Studies (PhD / DBA)', qualification: 'Research Master’s (MPhil / MSc with Thesis)', minimumGrades: 'Minimum CGPA of 3.20 or "B+" equivalent in Master’s coursework', details: 'Submission of an approved 10-page research proposal, 2 academic reference letters, and faculty advisor acceptance.' },
  { id: 'er-5', level: 'International Students', qualification: 'International Baccalaureate (IB) / French Bac / High School Diploma', minimumGrades: 'Minimum 28 IB points / French Bac 12/20 / High School GPA 3.0', details: 'Certificates must receive equivalence verification by the Ghana Tertiary Education Commission (GTEC). English proficiency test required if previous instruction was not English.' },
  { id: 'er-6', level: 'Transfer Admissions', qualification: 'Accredited University Transcript', minimumGrades: 'Minimum Cumulative GPA of 2.75 from previous accredited tertiary institution', details: 'Up to 50% of relevant credits may be transferred subject to departmental curriculum benchmarking and Dean’s clearance.' },
];

export const DEFAULT_SCHOLARSHIPS: ScholarshipItem[] = [
  { id: 'sch-1', name: 'Chancellor’s Presidential Academic Excellence Award', coverage: '100% Full Tuition + On-Campus Housing + Laptop', eligibility: 'Top 0.5% matriculating freshmen with straight A1s in WASSCE or straight As in A-Levels.', deadline: 'January 15 annually', description: 'Our highest academic honor recognizing exceptional scholastic accomplishment and leadership potential.' },
  { id: 'sch-2', name: 'Women in STEM & Computing Fellowship', coverage: '75% Tuition Fee Grant for all 4 years', eligibility: 'Female applicants admitted to Computer Science, Cybersecurity, or Engineering disciplines.', deadline: 'March 31 annually', description: 'Funded in partnership with global tech giants to empower the next generation of African female technologists.' },
  { id: 'sch-3', name: 'Pan-African Regional Mobility Bursary', coverage: '$3,500 Annual Travel & Living Subsidy', eligibility: 'International applicants originating from ECOWAS and African Union member states.', deadline: 'April 30 annually', description: 'Promotes regional diversity and cross-border knowledge exchange among promising African scholars.' },
  { id: 'sch-4', name: 'Dean’s Need-Based Student Support Grant', coverage: '25% – 50% Tuition Relief', eligibility: 'Demonstrable financial hardship with continuous minimum 3.0 CGPA standing.', deadline: 'Rolling review prior to each semester', description: 'Administered through the Directorate of Student Affairs to ensure no qualified student drops out due to fees.' },
];

export const DEFAULT_CAMPUS_SERVICES: CampusLifeServiceItem[] = [
  { id: 'srv-1', title: 'Center for Career Development & Corporate Internships', desc: 'One-on-one resume reviews, corporate recruiting fairs with Fortune 500 firms, and alumni career mentorship matching.', contact: 'careers@premier.edu.gh · Ext. 1040', location: 'Student Union Complex, Level 2' },
  { id: 'srv-2', title: 'Office of Accessibility & Disability Support', desc: 'Comprehensive accommodations including assistive technologies, sign language interpreters, wheelchair transport, and extended testing accommodations.', contact: 'accessibility@premier.edu.gh · Ext. 1055', location: 'Chancellor Hall, Ground Floor' },
  { id: 'srv-3', title: 'Student Counseling & Mental Well-Being Center', desc: 'Confidential psychological counseling, stress and mindfulness workshops, crisis intervention, and peer support networks.', contact: 'wellness@premier.edu.gh · 24/7 Helpline: +233 30 277 1099', location: 'Health Services Pavilion' },
  { id: 'srv-4', title: 'Student Governance & Representative Council (SRC)', desc: 'The official governing body for undergraduate and graduate student voice, campus event funding, and student rights representation.', contact: 'src@premier.edu.gh', location: 'SRC Union Secretariat' },
];

export const DEFAULT_HOUSING: HousingItem[] = [
  { id: 'hsg-1', name: 'Legon Hill Heritage Hall', type: 'On-Campus Residence', capacity: '1,400 Residents', pricePerSemester: 'GHS 3,200 / semester', amenities: ['High-Speed Fiber Wi-Fi', '24/7 Power Backups', 'Air-Conditioned Study Rooms', 'Cafeteria & Laundry'], image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80' },
  { id: 'hsg-2', name: 'Kwame Nkrumah Scholars Residence', type: 'On-Campus Residence', capacity: '950 Residents', pricePerSemester: 'GHS 4,500 / semester', amenities: ['En-Suite Bathrooms', 'Biometric Security Access', 'Recreational Gym', 'Solar Water Heating'], image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80' },
  { id: 'hsg-3', name: 'University Gardens Graduate Suites', type: 'On-Campus Residence', capacity: '520 Residents', pricePerSemester: 'GHS 6,000 / semester', amenities: ['Single Executive Studio Units', 'Quiet Research Wing', 'Kitchenette Facilities', 'Dedicated Parking'], image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80' },
  { id: 'hsg-4', name: 'Premier Executive Affiliated Hostels', type: 'Off-Campus Affiliate', capacity: '2,200 Residents', pricePerSemester: 'GHS 3,800 – 5,500', amenities: ['University Shuttle Service every 15 mins', 'Swimming Pool', 'Security Perimeter Guarded', 'Convenience Mini-Mart'], image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80' },
];

export const DEFAULT_HEALTH_WELLNESS: HealthWellnessItem[] = [
  { id: 'hlth-1', title: 'Premier University Hospital (500-Bed Facility)', desc: 'Full-service acute teaching hospital providing 24/7 emergency care, specialized outpatient clinics, internal medicine, surgery, and ambulance services.', hours: 'Open 24 Hours · 365 Days', emergencyPhone: '+233 30 277 1911', services: ['General Outpatient Clinic', 'Pharmacy & Dispensary', 'Radiology & MRI Imaging', 'Clinical Pathology Laboratories', 'Dental & Optometry Suites'] },
  { id: 'hlth-2', title: 'Student Wellness & Preventive Health Clinic', desc: 'Dedicated preventive health examinations, routine immunizations, sexual and reproductive health consultations, and nutritional counseling for enrolled students.', hours: 'Mon – Fri: 8:00 AM – 6:00 PM · Sat: 9:00 AM – 1:00 PM', emergencyPhone: '+233 30 277 1912', services: ['Free Annual Health Screenings', 'Vaccination Center', 'Stress Management Pods', 'Dietary Assessment'] },
];

export const DEFAULT_SPORTS: SportFacilityItem[] = [
  { id: 'spt-1', title: 'University Olympic Sports Stadium', facility: '40,000-Seat Synthetic Arena', teams: ['University Football Club (Premier Lions)', 'Track & Field Athletics Team', 'Rugby Varsity Squad'], desc: 'FIFA-certified natural turf football pitch, 8-lane all-weather tartan running track, and floodlit evening competition lighting.', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80' },
  { id: 'spt-2', title: 'Multi-Court Aquatic & Indoor Sports Complex', facility: 'Olympic 50m Swimming Pool & Arena', teams: ['Men & Women Basketball Teams', 'Varsity Swim Team', 'Volleyball & Badminton Squads'], desc: 'Heated 10-lane competition swimming pool, hardwood basketball courts, squash courts, and fully equipped weight training gymnasium.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80' },
];

export const DEFAULT_CLUBS: StudentClubItem[] = [
  { id: 'clb-1', name: 'Google Developer Student Club & AI Builders', category: 'Technology & Innovation', lead: 'Kwaku Frimpong (Level 400 CS)', memberCount: '850+ Active Members', desc: 'Weekly coding hackathons, machine learning study jams, and software projects solving local agricultural and fintech challenges.' },
  { id: 'clb-2', name: 'Premier Debate Society & Parliamentary Council', category: 'Literary & Public Discourse', lead: 'Esi Nyamekye (Level 300 Law)', memberCount: '320+ Active Members', desc: 'Reigning champions of the All-African University Debating Championship with active international delegations.' },
  { id: 'clb-3', name: 'Enactus Premier Social Entrepreneurship', category: 'Social Impact & Leadership', lead: 'Mawuli Gbeho (Level 400 Business)', memberCount: '410+ Active Members', desc: 'Developing sustainable community social enterprises empowering rural craft cooperatives with clean water and micro-loans.' },
  { id: 'clb-4', name: 'Pan-African Cultural Arts & Symphony Orchestra', category: 'Arts & Culture', lead: 'Ama Serwaa (Level 300 Performing Arts)', memberCount: '280+ Active Members', desc: 'Preserving African choral, percussion, and theatrical heritage with annual international tour performances.' },
];

export const DEFAULT_RESEARCH_CENTRES: ResearchCentreItem[] = [
  {
    id: 'crispr',
    category: 'health',
    title: 'CRISPR Gene Editing & Genomic Medicine Centre',
    director: 'Prof. Kofi Mensah-Agyei, PhD (Oxford)',
    tag: 'Biotechnology & Health',
    grants: '$14.2M Grant Pool',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
    description: 'Leading pioneering gene therapy research targeting sickle cell anemia and infectious disease resistance uniquely prevalent across equatorial Africa.',
    highlights: [
      'Breakthrough clinical trial protocols with WHO',
      'Next-generation Illumina sequencing laboratory',
      'Pan-African genomic variant database partnership',
    ],
  },
  {
    id: 'ai-ml',
    category: 'technology',
    title: 'Centre for Applied AI & Indigenous Language NLP',
    director: 'Dr. Afua Sutherland, PhD (Stanford)',
    tag: 'Artificial Intelligence',
    grants: '$9.8M Research Funding',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    description: 'Developing high-accuracy transformer models for low-resource African languages (Twi, Yoruba, Swahili, Hausa) and deploying AI computer vision for agricultural diagnostics.',
    highlights: [
      'Open-source African NLP benchmarks published at NeurIPS',
      'Diagnostic AI pilot deployed in 40+ rural healthcare clinics',
      'Google & Microsoft Research partnership award',
    ],
  },
  {
    id: 'clean-energy',
    category: 'sustainability',
    title: 'Renewable Energy & Microgrid Innovation Hub',
    director: 'Prof. Emmanuel K. Osei, PhD (Imperial College)',
    tag: 'Clean Tech & Energy',
    grants: '$11.5M EU-Africa Grant',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    description: 'Pioneering durable perovskite solar cell materials optimized for high-humidity climates and designing intelligent decentralized battery storage systems.',
    highlights: [
      'Over 18 decentralized microgrids installed across Ghana',
      'Patented thermal-resistant solar cell coating technology',
      'African Development Bank technical partner',
    ],
  },
];

export const DEFAULT_PUBLICATIONS: PublicationItem[] = [
  { id: 'pub-1', journal: 'Nature Biotechnology · 2025', title: 'Targeted base editing eliminates sickle cell mutation in primary human hematopoietic stem cells in vitro', authors: 'Mensah-Agyei, K., Okyere, S., & Taylor, P.', year: 2025 },
  { id: 'pub-2', journal: 'IEEE Transactions on Artificial Intelligence · 2025', title: 'Low-resource cross-lingual transfer architectures for West African tone languages', authors: 'Sutherland, A., Mensah, F., & Al-Hassan, M.', year: 2025 },
  { id: 'pub-3', journal: 'The Lancet Global Health · 2024', title: 'Integrated genomic surveillance prevents cross-border transmission during dengue resurgence in West Africa', authors: 'Addo, B., Boateng, R., et al.', year: 2024 },
  { id: 'pub-4', journal: 'Solar Energy Materials & Solar Cells · 2024', title: 'Degradation mitigation in lead-free perovskite microgrids under high thermal humidity', authors: 'Osei, E. K., & Mensah, J. B.', year: 2024 },
];

export const DEFAULT_INDUSTRY_PARTNERS: IndustryPartnerItem[] = [
  { id: 'prt-1', name: 'Google Research Africa', sector: 'AI & Machine Learning', collaboration: 'Natural Language Processing grants and graduate internships', status: 'Active (2023–2028)' },
  { id: 'prt-2', name: 'Pfizer Global Health Partnerships', sector: 'Biopharmaceuticals', collaboration: 'Clinical drug discovery protocols and sickle cell genetics lab funding', status: 'Active (2022–2027)' },
  { id: 'prt-3', name: 'Siemens Energy International', sector: 'Decentralized Grid Infrastructure', collaboration: 'Smart grid micro-inverter development and engineering lab sponsorship', status: 'Active (2024–2029)' },
  { id: 'prt-4', name: 'Bank of Ghana & Ecobank Transnational', sector: 'Financial Technology', collaboration: 'eCedi regulatory sandbox and cross-border payment protocol validation', status: 'Active (2023–2027)' },
];

export const DEFAULT_INNOVATION_HUB: InnovationHubProjectItem[] = [
  { id: 'hub-1', name: 'AgroSense Telemetry Solutions', founder: 'Kofi Owusu & Team (MSc Data Science)', stage: 'Seed Round ($250k Raised)', desc: 'IoT solar soil probes transmitting real-time moisture telemetry to smallholder cocoa farmers.' },
  { id: 'hub-2', name: 'SikaPay Offline Mobile Wallets', founder: 'Abena Frimpong (BSc Computer Science)', stage: 'Incubation & Prototype Stage', desc: 'Near-field audio communication protocols enabling smartphone-to-feature-phone digital payments without internet.' },
  { id: 'hub-3', name: 'GeneTrack Diagnostics', founder: 'Dr. Kwame Poku (PhD Biochemistry)', stage: 'Clinical Validation Phase', desc: 'Paper-based diagnostic lateral flow strips detecting sickle cell trait within 5 minutes for under $1.' },
];

export const DEFAULT_GRANTS: ResearchGrantItem[] = [
  { id: 'grt-1', title: 'Pan-African Climate Resilient Infrastructure Fund', funder: 'African Development Bank (AfDB)', amount: '$12,500,000', status: 'Active', deadline: 'December 2027' },
  { id: 'grt-2', title: 'Global Infectious Pathogen Genomic Surveillance', funder: 'Bill & Melinda Gates Foundation', amount: '$18,000,000', status: 'Active', deadline: 'June 2028' },
  { id: 'grt-3', title: 'Sustainable Perovskite Solar Microgrids for Rural Health Posts', funder: 'European Union Horizon Africa', amount: '$8,400,000', status: 'Open Call', deadline: 'August 15, 2027' },
];

// ─── Context Interface ──────────────────────────────────────────────────────

interface PublicContentContextType {
  homePage: HomePageContent;
  contactPage: ContactPageContent;
  siteSettings: SiteSettings;
  programs: ProgramItem[];
  academicCalendar: AcademicCalendarItem[];
  admissionSteps: AdmissionStepItem[];
  keyDates: AdmissionKeyDateItem[];
  entryRequirements: EntryRequirementItem[];
  scholarships: ScholarshipItem[];
  campusServices: CampusLifeServiceItem[];
  housing: HousingItem[];
  healthWellness: HealthWellnessItem[];
  sports: SportFacilityItem[];
  clubs: StudentClubItem[];
  researchCentres: ResearchCentreItem[];
  publications: PublicationItem[];
  industryPartners: IndustryPartnerItem[];
  innovationHubProjects: InnovationHubProjectItem[];
  researchGrants: ResearchGrantItem[];

  // Mutations
  updateHomePage: (updates: Partial<HomePageContent>) => void;
  updateContactPage: (updates: Partial<ContactPageContent>) => void;
  updateSiteSettings: (updates: Partial<SiteSettings>) => void;

  addProgram: (item: Omit<ProgramItem, 'id'>) => void;
  updateProgram: (item: ProgramItem) => void;
  deleteProgram: (id: string) => void;

  addCalendarEvent: (item: Omit<AcademicCalendarItem, 'id'>) => void;
  updateCalendarEvent: (item: AcademicCalendarItem) => void;
  deleteCalendarEvent: (id: string) => void;

  updateAdmissionKeyDate: (item: AdmissionKeyDateItem) => void;
  addAdmissionKeyDate: (item: Omit<AdmissionKeyDateItem, 'id'>) => void;
  deleteAdmissionKeyDate: (id: string) => void;

  updateEntryRequirement: (item: EntryRequirementItem) => void;
  addEntryRequirement: (item: Omit<EntryRequirementItem, 'id'>) => void;
  deleteEntryRequirement: (id: string) => void;

  updateScholarship: (item: ScholarshipItem) => void;
  addScholarship: (item: Omit<ScholarshipItem, 'id'>) => void;
  deleteScholarship: (id: string) => void;

  updateHousingItem: (item: HousingItem) => void;
  addHousingItem: (item: Omit<HousingItem, 'id'>) => void;
  deleteHousingItem: (id: string) => void;

  updateCampusService: (item: CampusLifeServiceItem) => void;
  addCampusService: (item: Omit<CampusLifeServiceItem, 'id'>) => void;
  deleteCampusService: (id: string) => void;

  updateClub: (item: StudentClubItem) => void;
  addClub: (item: Omit<StudentClubItem, 'id'>) => void;
  deleteClub: (id: string) => void;

  updateResearchCentre: (item: ResearchCentreItem) => void;
  addResearchCentre: (item: Omit<ResearchCentreItem, 'id'>) => void;
  deleteResearchCentre: (id: string) => void;

  addPublication: (item: Omit<PublicationItem, 'id'>) => void;
  updatePublication: (item: PublicationItem) => void;
  deletePublication: (id: string) => void;

  updateResearchGrant: (item: ResearchGrantItem) => void;
  addResearchGrant: (item: Omit<ResearchGrantItem, 'id'>) => void;
  deleteResearchGrant: (id: string) => void;

  resetToDefaults: () => void;
}

const STORAGE_KEY = 'premier_university_public_content_v2';

const PublicContentContext = createContext<PublicContentContextType | undefined>(undefined);

export const PublicContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse public content from localStorage', e);
    }
    return {
      homePage: DEFAULT_HOME_PAGE,
      contactPage: DEFAULT_CONTACT_PAGE,
      siteSettings: DEFAULT_SITE_SETTINGS,
      programs: DEFAULT_PROGRAMS,
      academicCalendar: DEFAULT_CALENDAR,
      admissionSteps: DEFAULT_ADMISSION_STEPS,
      keyDates: DEFAULT_KEY_DATES,
      entryRequirements: DEFAULT_ENTRY_REQUIREMENTS,
      scholarships: DEFAULT_SCHOLARSHIPS,
      campusServices: DEFAULT_CAMPUS_SERVICES,
      housing: DEFAULT_HOUSING,
      healthWellness: DEFAULT_HEALTH_WELLNESS,
      sports: DEFAULT_SPORTS,
      clubs: DEFAULT_CLUBS,
      researchCentres: DEFAULT_RESEARCH_CENTRES,
      publications: DEFAULT_PUBLICATIONS,
      industryPartners: DEFAULT_INDUSTRY_PARTNERS,
      innovationHubProjects: DEFAULT_INNOVATION_HUB,
      researchGrants: DEFAULT_GRANTS,
    };
  });

  // Sync to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to write public content to localStorage', e);
    }
  }, [data]);

  // Page level updates
  const updateHomePage = (updates: Partial<HomePageContent>) => {
    setData((prev: any) => ({
      ...prev,
      homePage: { ...prev.homePage, ...updates },
    }));
  };

  const updateContactPage = (updates: Partial<ContactPageContent>) => {
    setData((prev: any) => ({
      ...prev,
      contactPage: { ...prev.contactPage, ...updates },
    }));
  };

  const updateSiteSettings = (updates: Partial<SiteSettings>) => {
    setData((prev: any) => ({
      ...prev,
      siteSettings: { ...prev.siteSettings, ...updates },
    }));
  };

  // CRUD Implementations
  const addProgram = (item: Omit<ProgramItem, 'id'>) => {
    const newItem = { ...item, id: 'prg-' + Date.now() };
    setData((prev: any) => ({ ...prev, programs: [newItem, ...prev.programs] }));
  };
  const updateProgram = (item: ProgramItem) => {
    setData((prev: any) => ({
      ...prev,
      programs: prev.programs.map((p: ProgramItem) => (p.id === item.id ? item : p)),
    }));
  };
  const deleteProgram = (id: string) => {
    setData((prev: any) => ({ ...prev, programs: prev.programs.filter((p: ProgramItem) => p.id !== id) }));
  };

  const addCalendarEvent = (item: Omit<AcademicCalendarItem, 'id'>) => {
    const newItem = { ...item, id: 'cal-' + Date.now() };
    setData((prev: any) => ({ ...prev, academicCalendar: [...prev.academicCalendar, newItem] }));
  };
  const updateCalendarEvent = (item: AcademicCalendarItem) => {
    setData((prev: any) => ({
      ...prev,
      academicCalendar: prev.academicCalendar.map((c: AcademicCalendarItem) => (c.id === item.id ? item : c)),
    }));
  };
  const deleteCalendarEvent = (id: string) => {
    setData((prev: any) => ({ ...prev, academicCalendar: prev.academicCalendar.filter((c: AcademicCalendarItem) => c.id !== id) }));
  };

  const updateAdmissionKeyDate = (item: AdmissionKeyDateItem) => {
    setData((prev: any) => ({
      ...prev,
      keyDates: prev.keyDates.map((k: AdmissionKeyDateItem) => (k.id === item.id ? item : k)),
    }));
  };
  const addAdmissionKeyDate = (item: Omit<AdmissionKeyDateItem, 'id'>) => {
    const newItem = { ...item, id: 'kd-' + Date.now() };
    setData((prev: any) => ({ ...prev, keyDates: [...prev.keyDates, newItem] }));
  };
  const deleteAdmissionKeyDate = (id: string) => {
    setData((prev: any) => ({ ...prev, keyDates: prev.keyDates.filter((k: AdmissionKeyDateItem) => k.id !== id) }));
  };

  const updateEntryRequirement = (item: EntryRequirementItem) => {
    setData((prev: any) => ({
      ...prev,
      entryRequirements: prev.entryRequirements.map((er: EntryRequirementItem) => (er.id === item.id ? item : er)),
    }));
  };
  const addEntryRequirement = (item: Omit<EntryRequirementItem, 'id'>) => {
    const newItem = { ...item, id: 'er-' + Date.now() };
    setData((prev: any) => ({ ...prev, entryRequirements: [...prev.entryRequirements, newItem] }));
  };
  const deleteEntryRequirement = (id: string) => {
    setData((prev: any) => ({ ...prev, entryRequirements: prev.entryRequirements.filter((er: EntryRequirementItem) => er.id !== id) }));
  };

  const updateScholarship = (item: ScholarshipItem) => {
    setData((prev: any) => ({
      ...prev,
      scholarships: prev.scholarships.map((s: ScholarshipItem) => (s.id === item.id ? item : s)),
    }));
  };
  const addScholarship = (item: Omit<ScholarshipItem, 'id'>) => {
    const newItem = { ...item, id: 'sch-' + Date.now() };
    setData((prev: any) => ({ ...prev, scholarships: [newItem, ...prev.scholarships] }));
  };
  const deleteScholarship = (id: string) => {
    setData((prev: any) => ({ ...prev, scholarships: prev.scholarships.filter((s: ScholarshipItem) => s.id !== id) }));
  };

  const updateHousingItem = (item: HousingItem) => {
    setData((prev: any) => ({
      ...prev,
      housing: prev.housing.map((h: HousingItem) => (h.id === item.id ? item : h)),
    }));
  };
  const addHousingItem = (item: Omit<HousingItem, 'id'>) => {
    const newItem = { ...item, id: 'hsg-' + Date.now() };
    setData((prev: any) => ({ ...prev, housing: [newItem, ...prev.housing] }));
  };
  const deleteHousingItem = (id: string) => {
    setData((prev: any) => ({ ...prev, housing: prev.housing.filter((h: HousingItem) => h.id !== id) }));
  };

  const updateCampusService = (item: CampusLifeServiceItem) => {
    setData((prev: any) => ({
      ...prev,
      campusServices: prev.campusServices.map((cs: CampusLifeServiceItem) => (cs.id === item.id ? item : cs)),
    }));
  };
  const addCampusService = (item: Omit<CampusLifeServiceItem, 'id'>) => {
    const newItem = { ...item, id: 'srv-' + Date.now() };
    setData((prev: any) => ({ ...prev, campusServices: [...prev.campusServices, newItem] }));
  };
  const deleteCampusService = (id: string) => {
    setData((prev: any) => ({ ...prev, campusServices: prev.campusServices.filter((cs: CampusLifeServiceItem) => cs.id !== id) }));
  };

  const updateClub = (item: StudentClubItem) => {
    setData((prev: any) => ({
      ...prev,
      clubs: prev.clubs.map((c: StudentClubItem) => (c.id === item.id ? item : c)),
    }));
  };
  const addClub = (item: Omit<StudentClubItem, 'id'>) => {
    const newItem = { ...item, id: 'clb-' + Date.now() };
    setData((prev: any) => ({ ...prev, clubs: [newItem, ...prev.clubs] }));
  };
  const deleteClub = (id: string) => {
    setData((prev: any) => ({ ...prev, clubs: prev.clubs.filter((c: StudentClubItem) => c.id !== id) }));
  };

  const updateResearchCentre = (item: ResearchCentreItem) => {
    setData((prev: any) => ({
      ...prev,
      researchCentres: prev.researchCentres.map((rc: ResearchCentreItem) => (rc.id === item.id ? item : rc)),
    }));
  };
  const addResearchCentre = (item: Omit<ResearchCentreItem, 'id'>) => {
    const newItem = { ...item, id: 'rc-' + Date.now() };
    setData((prev: any) => ({ ...prev, researchCentres: [newItem, ...prev.researchCentres] }));
  };
  const deleteResearchCentre = (id: string) => {
    setData((prev: any) => ({ ...prev, researchCentres: prev.researchCentres.filter((rc: ResearchCentreItem) => rc.id !== id) }));
  };

  const addPublication = (item: Omit<PublicationItem, 'id'>) => {
    const newItem = { ...item, id: 'pub-' + Date.now() };
    setData((prev: any) => ({ ...prev, publications: [newItem, ...prev.publications] }));
  };
  const updatePublication = (item: PublicationItem) => {
    setData((prev: any) => ({
      ...prev,
      publications: prev.publications.map((pub: PublicationItem) => (pub.id === item.id ? item : pub)),
    }));
  };
  const deletePublication = (id: string) => {
    setData((prev: any) => ({ ...prev, publications: prev.publications.filter((pub: PublicationItem) => pub.id !== id) }));
  };

  const updateResearchGrant = (item: ResearchGrantItem) => {
    setData((prev: any) => ({
      ...prev,
      researchGrants: prev.researchGrants.map((rg: ResearchGrantItem) => (rg.id === item.id ? item : rg)),
    }));
  };
  const addResearchGrant = (item: Omit<ResearchGrantItem, 'id'>) => {
    const newItem = { ...item, id: 'grt-' + Date.now() };
    setData((prev: any) => ({ ...prev, researchGrants: [newItem, ...prev.researchGrants] }));
  };
  const deleteResearchGrant = (id: string) => {
    setData((prev: any) => ({ ...prev, researchGrants: prev.researchGrants.filter((rg: ResearchGrantItem) => rg.id !== id) }));
  };

  const resetToDefaults = () => {
    const defaults = {
      homePage: DEFAULT_HOME_PAGE,
      contactPage: DEFAULT_CONTACT_PAGE,
      siteSettings: DEFAULT_SITE_SETTINGS,
      programs: DEFAULT_PROGRAMS,
      academicCalendar: DEFAULT_CALENDAR,
      admissionSteps: DEFAULT_ADMISSION_STEPS,
      keyDates: DEFAULT_KEY_DATES,
      entryRequirements: DEFAULT_ENTRY_REQUIREMENTS,
      scholarships: DEFAULT_SCHOLARSHIPS,
      campusServices: DEFAULT_CAMPUS_SERVICES,
      housing: DEFAULT_HOUSING,
      healthWellness: DEFAULT_HEALTH_WELLNESS,
      sports: DEFAULT_SPORTS,
      clubs: DEFAULT_CLUBS,
      researchCentres: DEFAULT_RESEARCH_CENTRES,
      publications: DEFAULT_PUBLICATIONS,
      industryPartners: DEFAULT_INDUSTRY_PARTNERS,
      innovationHubProjects: DEFAULT_INNOVATION_HUB,
      researchGrants: DEFAULT_GRANTS,
    };
    setData(defaults);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  };

  return (
    <PublicContentContext.Provider
      value={{
        ...data,
        updateHomePage,
        updateContactPage,
        updateSiteSettings,
        addProgram,
        updateProgram,
        deleteProgram,
        addCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        updateAdmissionKeyDate,
        addAdmissionKeyDate,
        deleteAdmissionKeyDate,
        updateEntryRequirement,
        addEntryRequirement,
        deleteEntryRequirement,
        updateScholarship,
        addScholarship,
        deleteScholarship,
        updateHousingItem,
        addHousingItem,
        deleteHousingItem,
        updateCampusService,
        addCampusService,
        deleteCampusService,
        updateClub,
        addClub,
        deleteClub,
        updateResearchCentre,
        addResearchCentre,
        deleteResearchCentre,
        addPublication,
        updatePublication,
        deletePublication,
        updateResearchGrant,
        addResearchGrant,
        deleteResearchGrant,
        resetToDefaults,
      }}
    >
      {children}
    </PublicContentContext.Provider>
  );
};

export const usePublicContent = () => {
  const context = useContext(PublicContentContext);
  if (!context) {
    throw new Error('usePublicContent must be used within a PublicContentProvider');
  }
  return context;
};
