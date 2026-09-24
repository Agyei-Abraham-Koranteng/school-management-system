import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  ArrowRight, 
  UploadCloud, 
  FileText, 
  Check, 
  AlertCircle, 
  Sparkles, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Calendar, 
  BookOpen, 
  Award, 
  ChevronRight, 
  LogOut, 
  ArrowLeft, 
  FileCheck, 
  Building2, 
  FileBadge, 
  Save, 
  AlertTriangle, 
  Send, 
  RefreshCw, 
  Eye, 
  Download, 
  Info, 
  Trash2, 
  Plus, 
  X, 
  FileImage,
  Layers
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useSchool } from '../../../context/SchoolContext';
import { useToast } from '../../../context/ToastContext';
import { AdmissionApplication, ApplicantDocument, ApplicationStatus } from '../../../types';
import { realtimeSyncManager } from '../../../services/realtime/realtimeService';
import { COUNTRIES } from '../../../data/countries';
import { indexedDbStorage } from '../../../services/storage/indexedDbStorage';

// Secondary School Course Tracks & Streams
const SHS_STREAMS = [
  {
    id: 'general_science',
    name: 'General Science',
    subjects: [
      { subject: 'English Language', grade: 'A1' },
      { subject: 'Core Mathematics', grade: 'A1' },
      { subject: 'Integrated Science', grade: 'B2' },
      { subject: 'Social Studies', grade: 'A1' },
      { subject: 'Elective Mathematics', grade: 'B2' },
      { subject: 'Physics', grade: 'B3' },
      { subject: 'Chemistry', grade: 'B2' },
      { subject: 'Biology', grade: 'B3' }
    ]
  },
  {
    id: 'general_arts',
    name: 'General Arts',
    subjects: [
      { subject: 'English Language', grade: 'A1' },
      { subject: 'Core Mathematics', grade: 'B2' },
      { subject: 'Integrated Science', grade: 'B3' },
      { subject: 'Social Studies', grade: 'A1' },
      { subject: 'Economics', grade: 'A1' },
      { subject: 'Government', grade: 'A1' },
      { subject: 'Literature-in-English', grade: 'B2' },
      { subject: 'History', grade: 'B2' }
    ]
  },
  {
    id: 'business',
    name: 'Business',
    subjects: [
      { subject: 'English Language', grade: 'A1' },
      { subject: 'Core Mathematics', grade: 'A1' },
      { subject: 'Integrated Science', grade: 'B2' },
      { subject: 'Social Studies', grade: 'A1' },
      { subject: 'Financial Accounting', grade: 'A1' },
      { subject: 'Cost Accounting', grade: 'B2' },
      { subject: 'Business Management', grade: 'A1' },
      { subject: 'Economics', grade: 'B2' }
    ]
  },
  {
    id: 'visual_arts',
    name: 'Visual Arts',
    subjects: [
      { subject: 'English Language', grade: 'A1' },
      { subject: 'Core Mathematics', grade: 'B3' },
      { subject: 'Integrated Science', grade: 'B2' },
      { subject: 'Social Studies', grade: 'A1' },
      { subject: 'General Knowledge in Art', grade: 'A1' },
      { subject: 'Graphic Design', grade: 'A1' },
      { subject: 'Picture Making', grade: 'B2' },
      { subject: 'Textiles', grade: 'B2' }
    ]
  },
  {
    id: 'home_economics',
    name: 'Home Economics',
    subjects: [
      { subject: 'English Language', grade: 'A1' },
      { subject: 'Core Mathematics', grade: 'B2' },
      { subject: 'Integrated Science', grade: 'B2' },
      { subject: 'Social Studies', grade: 'A1' },
      { subject: 'Food and Nutrition', grade: 'A1' },
      { subject: 'Management in Living', grade: 'A1' },
      { subject: 'Clothing and Textiles', grade: 'B2' },
      { subject: 'Biology', grade: 'B3' }
    ]
  },
  {
    id: 'technical',
    name: 'Technical / Engineering',
    subjects: [
      { subject: 'English Language', grade: 'B2' },
      { subject: 'Core Mathematics', grade: 'A1' },
      { subject: 'Integrated Science', grade: 'B2' },
      { subject: 'Social Studies', grade: 'B3' },
      { subject: 'Elective Mathematics', grade: 'B2' },
      { subject: 'Technical Drawing', grade: 'A1' },
      { subject: 'Applied Electricity', grade: 'B2' },
      { subject: 'Physics', grade: 'B3' }
    ]
  },
  {
    id: 'agricultural_science',
    name: 'Agricultural Science',
    subjects: [
      { subject: 'English Language', grade: 'A1' },
      { subject: 'Core Mathematics', grade: 'B2' },
      { subject: 'Integrated Science', grade: 'A1' },
      { subject: 'Social Studies', grade: 'A1' },
      { subject: 'General Agriculture', grade: 'A1' },
      { subject: 'Animal Husbandry', grade: 'B2' },
      { subject: 'Chemistry', grade: 'B3' },
      { subject: 'Physics', grade: 'B3' }
    ]
  },
  {
    id: 'custom',
    name: 'Custom / Other / International',
    subjects: [
      { subject: 'English Language', grade: 'A1' },
      { subject: 'Core Mathematics', grade: 'A1' },
      { subject: 'Integrated Science', grade: 'B2' },
      { subject: 'Social Studies', grade: 'A1' }
    ]
  }
];

const ALL_COMMON_SUBJECTS = [
  'English Language',
  'Core Mathematics',
  'Integrated Science',
  'Social Studies',
  'Elective Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'Government',
  'History',
  'Geography',
  'Literature-in-English',
  'French',
  'Ghanaian Language (Twi/Fante/Ga/Ewe)',
  'Christian Religious Studies',
  'Islamic Religious Studies',
  'Financial Accounting',
  'Cost Accounting',
  'Business Management',
  'General Knowledge in Art',
  'Graphic Design',
  'Picture Making',
  'Textiles',
  'Ceramics',
  'Sculpture',
  'Food and Nutrition',
  'Management in Living',
  'Clothing and Textiles',
  'Technical Drawing',
  'Applied Electricity',
  'Electronics',
  'Auto Mechanics',
  'Woodwork',
  'Metalwork',
  'Building Construction',
  'General Agriculture',
  'Animal Husbandry',
  'Crop Husbandry and Horticulture',
  'Information & Comm. Technology (Elective ICT)'
];

// Document Upload Slots Definition
const REQUIRED_DOCUMENT_SLOTS = [
  {
    id: 'wassce_cert',
    type: 'WASSCE / High School Certificate',
    title: 'WASSCE Statement of Results / Certificate *',
    description: 'Official WASSCE or High School certificate with index number visible.',
    required: true,
    accepted: '.pdf,.jpg,.jpeg,.png'
  },
  {
    id: 'birth_cert',
    type: 'Birth Certificate',
    title: 'Official Birth Certificate *',
    description: 'Government registered birth certificate verifying legal identity and birth date.',
    required: true,
    accepted: '.pdf,.jpg,.jpeg,.png'
  },
  {
    id: 'id_doc',
    type: 'National ID',
    title: 'National ID Card / Passport *',
    description: 'Valid Ghana Card, National Identification, or International Passport page.',
    required: true,
    accepted: '.pdf,.jpg,.jpeg,.png'
  },
  {
    id: 'passport_photo',
    type: 'Passport Photo',
    title: 'Passport-Size Photograph *',
    description: 'Recent clear color photograph with white background.',
    required: true,
    accepted: '.jpg,.jpeg,.png'
  },
  {
    id: 'recommendation',
    type: 'Recommendation Letter',
    title: 'Academic Recommendation / Testimonial Letter (Optional)',
    description: 'Signed letter from previous secondary school head or academic counselor.',
    required: false,
    accepted: '.pdf,.jpg,.jpeg,.png'
  },
  {
    id: 'other_cert',
    type: 'Supporting Document',
    title: 'Additional Certificate / Transcript (Optional)',
    description: 'Any other relevant certificates, awards, or diploma transcripts.',
    required: false,
    accepted: '.pdf,.jpg,.jpeg,.png'
  }
];

export const ApplyPage: React.FC = () => {
  const { 
    role, 
    user, 
    isAuthenticated, 
    applicantAccount, 
    registerApplicant, 
    loginApplicant, 
    linkApplicantApplication,
    logout, 
    proceedToStudentDashboard 
  } = useAuth();
  
  const { 
    applications, 
    saveApplicationDraft, 
    submitApplication, 
    resubmitApplication,
    respondToAdmissionOffer,
    updateApplicantDocumentStatus,
    programs,
    faculties,
    departments,
    settings 
  } = useSchool();

  const { showToast } = useToast();
  const navigate = useNavigate();

  // Mode for unauthenticated visitors: 'register' | 'login'
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');

  // Registration Form State
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Step and Validation Error State
  const [appStep, setAppStep] = useState<number>(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Selected High School Stream
  const [selectedStream, setSelectedStream] = useState<string>('general_science');

  // Multi-step Application Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal Bio-data
    title: 'Mr',
    firstName: '',
    lastName: '',
    otherNames: '',
    dateOfBirth: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    nationality: 'Ghanaian',
    countryOfResidence: 'Ghana',
    identificationType: 'National ID' as 'National ID' | 'Passport' | 'Birth Certificate' | 'Voter ID',
    identificationNumber: '',
    maritalStatus: 'Single' as 'Single' | 'Married' | 'Other',

    // Step 2: Contact Information
    email: '',
    phone: '',
    alternativePhone: '',
    address: '',
    postalAddress: '',
    region: 'Greater Accra',
    city: '',
    country: 'Ghana',

    // Step 3: Next of Kin / Emergency Contact
    guardianName: '',
    guardianPhone: '',
    nextOfKinRelationship: 'Father',
    nextOfKinEmail: '',
    nextOfKinAddress: '',

    // Step 4: Academic Background & WASSCE
    secondarySchool: '',
    secondaryCountry: 'Ghana',
    examinationType: 'WASSCE',
    completionYear: 2025,
    candidateIndexNumber: '',
    aggregateScore: 10,
    wassceResults: [
      { subject: 'English Language', grade: 'A1' },
      { subject: 'Core Mathematics', grade: 'A1' },
      { subject: 'Integrated Science', grade: 'B2' },
      { subject: 'Social Studies', grade: 'A1' },
      { subject: 'Elective Mathematics', grade: 'B2' },
      { subject: 'Physics', grade: 'B3' },
      { subject: 'Chemistry', grade: 'B2' },
      { subject: 'Biology', grade: 'B3' }
    ],

    // Step 5: Program Selection
    facultyId: '',
    departmentId: '',
    programChoiceId: '',
    programChoiceName: '',
    secondChoiceProgramId: '',
    secondChoiceProgramName: '',
    studyMode: 'Full-Time Regular' as 'Full-Time Regular' | 'Evening / Executive' | 'Weekend Modular',
    session: settings.currentSession || '2026/2027 Academic Session',
    entryLevel: '100' as const,

    // Step 6: Documents Uploaded (starts empty, user uploads real files!)
    documents: [] as ApplicantDocument[],

    // Step 7: Review & Declaration
    declarationConfirmed: false
  });

  // Modal State for Previewing Uploaded Document
  const [previewDoc, setPreviewDoc] = useState<ApplicantDocument | null>(null);
  const [resolvedPreviewUrl, setResolvedPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!previewDoc) {
      setResolvedPreviewUrl(null);
      return;
    }
    if (previewDoc.fileUrl && previewDoc.fileUrl.startsWith('indexeddb:')) {
      indexedDbStorage.getDocumentBlob(previewDoc.id).then(data => {
        setResolvedPreviewUrl(data);
      });
    } else {
      setResolvedPreviewUrl(previewDoc.fileUrl);
    }
  }, [previewDoc]);

  // Correction Resubmission Editor State (when application status === 'correction_required')
  const [correctionEditorOpen, setCorrectionEditorOpen] = useState(false);
  const [resubmitDOB, setResubmitDOB] = useState('');
  const [resubmitAddress, setResubmitAddress] = useState('');

  // Pre-fill form when applicant account is ready
  useEffect(() => {
    if (applicantAccount) {
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || applicantAccount.firstName,
        lastName: prev.lastName || applicantAccount.lastName,
        email: applicantAccount.email,
        phone: prev.phone || applicantAccount.phone
      }));
    }
  }, [applicantAccount]);

  // Set default programs and faculties if available
  useEffect(() => {
    if (faculties.length > 0 && !formData.facultyId) {
      setFormData(prev => ({ ...prev, facultyId: faculties[0].id }));
    }
    if (departments.length > 0 && !formData.departmentId) {
      setFormData(prev => ({ ...prev, departmentId: departments[0].id }));
    }
    if (programs.length > 0 && !formData.programChoiceId) {
      setFormData(prev => ({ 
        ...prev, 
        programChoiceId: programs[0].id,
        programChoiceName: programs[0].name
      }));
    }
  }, [faculties, departments, programs, formData.facultyId, formData.departmentId, formData.programChoiceId]);

  // Find if current applicant has an active application
  const existingApp = useMemo(() => {
    if (!applicantAccount) return null;
    const found = applications.find(
      app => app.email.toLowerCase() === applicantAccount.email.toLowerCase() ||
             (applicantAccount.applicationId && app.id === applicantAccount.applicationId)
    );
    if (found) return found;

    // Fail-safe direct lookup for applicant's individual backup application
    try {
      const backupKey = `premier_applicant_app_${applicantAccount.email.toLowerCase()}`;
      const backupStr = localStorage.getItem(backupKey);
      if (backupStr) {
        const parsed = JSON.parse(backupStr);
        if (parsed && (parsed.id || parsed.status)) {
          return parsed as AdmissionApplication;
        }
      }
    } catch {}

    return null;
  }, [applicantAccount, applications]);

  // Set resubmission inputs from existing application
  useEffect(() => {
    if (existingApp) {
      setResubmitDOB(existingApp.dateOfBirth);
      setResubmitAddress(existingApp.address);
    }
  }, [existingApp]);

  const [draftRestored, setDraftRestored] = useState<boolean>(false);

  const getDraftStorageKey = useCallback(() => {
    return applicantAccount 
      ? `premier_admissions_draft_${applicantAccount.email.toLowerCase()}` 
      : 'premier_admissions_draft_guest';
  }, [applicantAccount]);

  // Auto-restore draft on mount/refresh if no submitted application exists
  useEffect(() => {
    if (existingApp && !existingApp.isDraft) return;
    try {
      const key = getDraftStorageKey();
      const savedStr = localStorage.getItem(key);
      if (savedStr) {
        const parsed = JSON.parse(savedStr);
        if (parsed && typeof parsed === 'object') {
          if (parsed.formData) {
            setFormData(prev => ({ ...prev, ...parsed.formData }));
          }
          if (parsed.appStep && typeof parsed.appStep === 'number' && parsed.appStep >= 1 && parsed.appStep <= 7) {
            setAppStep(parsed.appStep);
          }
          if (parsed.selectedStream) {
            setSelectedStream(parsed.selectedStream);
          }
          setDraftRestored(true);
        }
      }
    } catch {}
  }, [applicantAccount, existingApp, getDraftStorageKey]);

  // Debounced auto-save of application form data and step to localStorage
  useEffect(() => {
    if (existingApp && !existingApp.isDraft) return;
    const timer = setTimeout(() => {
      try {
        const key = getDraftStorageKey();
        const draft = {
          appStep,
          selectedStream,
          formData,
          savedAt: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(draft));
      } catch {}
    }, 400);

    return () => clearTimeout(timer);
  }, [appStep, selectedStream, formData, applicantAccount, existingApp, getDraftStorageKey]);

  const handleClearDraft = () => {
    try {
      localStorage.removeItem(getDraftStorageKey());
      localStorage.removeItem('premier_admissions_draft_guest');
    } catch {}
    setAppStep(1);
    setDraftRestored(false);
    showToast('Draft cleared. Form reset to initial step.', 'info');
  };

  // Real-time listener for status updates from Admissions Directorate
  useEffect(() => {
    if (!applicantAccount) return;

    const unbind = realtimeSyncManager.on('admission_applications', (event) => {
      if (event.eventType === 'UPDATE' && event.newRecord) {
        const isMine = 
          (event.newRecord.email && event.newRecord.email.toLowerCase() === applicantAccount.email.toLowerCase()) ||
          (applicantAccount.applicationId && event.newRecord.id === applicantAccount.applicationId);

        if (isMine) {
          const newStatus = event.newRecord.status as ApplicationStatus;
          if (newStatus === 'enrolled') {
            showToast(`🎓 Matriculation Complete! Your Student Account is now active.`, 'success');
            realtimeSyncManager.playChime('approval');
          } else if (newStatus === 'admission_offered') {
            showToast(`🎉 Official Admission Offer Issued! Please review and accept your offer.`, 'success');
            realtimeSyncManager.playChime('approval');
          } else if (newStatus === 'correction_required') {
            showToast(`⚠️ Admissions Action Required: Registry requested corrections on your application.`, 'error');
          } else if (newStatus === 'under_review') {
            showToast(`ℹ️ Status Update: Application is now under Registry review.`, 'info');
          }
        }
      }
    });

    return () => unbind();
  }, [applicantAccount, showToast]);

  // ─────────────────────────────────────────────────────────────────────────────
  // VALIDATION ENGINE
  // ─────────────────────────────────────────────────────────────────────────────
  const validateStep = (stepNumber: number): boolean => {
    const errors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.firstName.trim()) errors.firstName = 'First name is required.';
      if (!formData.lastName.trim()) errors.lastName = 'Last name is required.';
      if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required.';
      if (!formData.nationality.trim()) errors.nationality = 'Nationality is required.';
      if (!formData.identificationNumber.trim()) errors.identificationNumber = 'Identification number is required.';
    } else if (stepNumber === 2) {
      if (!formData.email.trim() || !formData.email.includes('@')) {
        errors.email = 'A valid email address is required.';
      }
      if (!formData.phone.trim() || formData.phone.length < 8) {
        errors.phone = 'A valid contact phone number is required.';
      }
      if (!formData.address.trim()) errors.address = 'Residential street address is required.';
      if (!formData.city.trim()) errors.city = 'City or town is required.';
    } else if (stepNumber === 3) {
      if (!formData.guardianName.trim()) errors.guardianName = 'Next of kin / guardian full name is required.';
      if (!formData.guardianPhone.trim() || formData.guardianPhone.length < 8) {
        errors.guardianPhone = 'Next of kin phone number is required.';
      }
    } else if (stepNumber === 4) {
      if (!formData.secondarySchool.trim()) errors.secondarySchool = 'Senior High School name is required.';
      if (!formData.candidateIndexNumber.trim()) errors.candidateIndexNumber = 'Candidate index number is required.';
      if (formData.wassceResults.length < 6) {
        errors.wassceResults = 'Please provide grades for at least 6 subjects (4 Cores and at least 2 Electives).';
      }
      if (formData.aggregateScore < 6 || formData.aggregateScore > 48) {
        errors.aggregateScore = 'Aggregate score must be between 6 and 48.';
      }
    } else if (stepNumber === 5) {
      if (!formData.programChoiceId) errors.programChoiceId = 'Please select a program of study.';
    } else if (stepNumber === 6) {
      // Check that all 4 mandatory document slots have been uploaded!
      const uploadedTypes = formData.documents.map(d => d.type);
      const missingDocs: string[] = [];

      if (!uploadedTypes.some(t => t.includes('WASSCE') || t.includes('Certificate'))) {
        missingDocs.push('WASSCE Result Slip');
      }
      if (!uploadedTypes.some(t => t.includes('Birth Certificate'))) {
        missingDocs.push('Birth Certificate');
      }
      if (!uploadedTypes.some(t => t.includes('National ID'))) {
        missingDocs.push('National ID / Passport');
      }
      if (!uploadedTypes.some(t => t.includes('Passport Photo'))) {
        missingDocs.push('Passport-size Photograph');
      }

      if (missingDocs.length > 0) {
        errors.documents = `Required documents missing: ${missingDocs.join(', ')}. Please upload all mandatory files.`;
      }
    } else if (stepNumber === 7) {
      if (!formData.declarationConfirmed) {
        errors.declarationConfirmed = 'You must confirm the legal truth declaration before submitting.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = (targetStep: number) => {
    if (validateStep(appStep)) {
      setFormErrors({});
      setAppStep(targetStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToast('Please fill all required fields correctly before proceeding.', 'error');
    }
  };

  // Helper to calculate aggregate score from WASSCE grades
  const calculateAggregate = (results: Array<{ subject: string; grade: string }>) => {
    const gradePoints: Record<string, number> = {
      'A1': 1, 'B2': 2, 'B3': 3, 'C4': 4, 'C5': 5, 'C6': 6, 'D7': 7, 'E8': 8, 'F9': 9
    };
    
    // Sort scores ascending
    const scores = results
      .map(r => gradePoints[r.grade] || 9)
      .sort((a, b) => a - b);
    
    // Sum best 6
    const best6 = scores.slice(0, 6);
    const sum = best6.reduce((acc, curr) => acc + curr, 0);
    return Math.max(6, sum || 10);
  };

  // Handle SHS Stream Change
  const handleStreamChange = (streamId: string) => {
    setSelectedStream(streamId);
    const stream = SHS_STREAMS.find(s => s.id === streamId);
    if (stream) {
      const newResults = [...stream.subjects];
      const newAgg = calculateAggregate(newResults);
      setFormData(prev => ({
        ...prev,
        wassceResults: newResults,
        aggregateScore: newAgg
      }));
      showToast(`Applied ${stream.name} subject syllabus template.`, 'info');
    }
  };

  // Handle Adding Subject
  const handleAddSubject = () => {
    setFormData(prev => {
      const nextResults = [...prev.wassceResults, { subject: 'Elective Mathematics', grade: 'B2' }];
      return {
        ...prev,
        wassceResults: nextResults,
        aggregateScore: calculateAggregate(nextResults)
      };
    });
  };

  // Handle Removing Subject
  const handleRemoveSubject = (index: number) => {
    if (formData.wassceResults.length <= 4) {
      showToast('You must have at least the 4 core subjects.', 'error');
      return;
    }
    setFormData(prev => {
      const nextResults = prev.wassceResults.filter((_, i) => i !== index);
      return {
        ...prev,
        wassceResults: nextResults,
        aggregateScore: calculateAggregate(nextResults)
      };
    });
  };

  // Handle Document File Upload (Real File Picker & FileReader)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, slotType: string, slotTitle: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    // Validate file size: 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size exceeds the 10MB limit. Please upload a smaller file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (uploadEvent) => {
      const rawDataUrl = uploadEvent.target?.result as string || '#';
      const formattedSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      // Safely store binary payload in IndexedDB to prevent localStorage 5MB quota errors
      await indexedDbStorage.saveDocumentBlob(docId, rawDataUrl);

      const newDoc: ApplicantDocument = {
        id: docId,
        name: file.name,
        type: slotType as any,
        fileUrl: `indexeddb:${docId}`,
        fileSize: formattedSize,
        uploadedAt: new Date().toISOString().split('T')[0],
        status: 'pending'
      };

      setFormData(prev => {
        // Replace existing document of the same type or append
        const filtered = prev.documents.filter(d => d.type !== slotType);
        return {
          ...prev,
          documents: [...filtered, newDoc]
        };
      });

      // Clear document error if satisfied
      setFormErrors(prev => {
        const next = { ...prev };
        delete next.documents;
        return next;
      });

      showToast(`Attached ${file.name} successfully!`, 'success');
    };

    reader.readAsDataURL(file);
  };

  // Handle Document Removal
  const handleRemoveDoc = (docId: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d.id !== docId)
    }));
    showToast('Document removed.', 'info');
  };

  // Handle Account Registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!regFirstName.trim() || !regLastName.trim() || !regEmail.trim() || !regPhone.trim()) {
      setAuthError('Please fill out all required personal contact details.');
      return;
    }
    if (regPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setAuthError('Passwords do not match. Please verify your password.');
      return;
    }

    try {
      const acc = registerApplicant({
        firstName: regFirstName,
        lastName: regLastName,
        email: regEmail,
        phone: regPhone,
        password: regPassword
      });
      showToast(`Admissions account created for ${acc.firstName}! You may now complete your application.`, 'success');
    } catch (err: any) {
      setAuthError(err.message || 'Failed to create admissions account.');
    }
  };

  // Handle Account Sign In
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!loginEmail.trim()) {
      setAuthError('Please provide your registered admissions email address.');
      return;
    }
    if (!loginPassword.trim()) {
      setAuthError('Please enter your admissions account password.');
      return;
    }
    try {
      const acc = loginApplicant(loginEmail, loginPassword);
      if (acc) {
        showToast(`Welcome back, ${acc.firstName}! Admissions session active.`, 'success');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Unable to authenticate applicant credentials.');
    }
  };

  // Quick-fill demo applicant
  const handleFillDemoApplicant = () => {
    setRegFirstName('Kwame');
    setRegLastName('Mensah');
    setRegEmail('kwame.mensah.applicant@gmail.com');
    setRegPhone('+233 24 456 7890');
    setRegPassword('premier2026');
    setRegConfirmPassword('premier2026');
    setAuthError('');
  };

  // Save Application Draft
  const handleSaveDraft = () => {
    try {
      const selectedProg = programs.find(p => p.id === formData.programChoiceId);
      const programName = selectedProg ? selectedProg.name : formData.programChoiceName;

      saveApplicationDraft({
        firstName: formData.firstName || (applicantAccount ? applicantAccount.firstName : 'Draft'),
        lastName: formData.lastName || (applicantAccount ? applicantAccount.lastName : 'Applicant'),
        otherNames: formData.otherNames,
        email: applicantAccount ? applicantAccount.email : formData.email,
        phone: formData.phone || (applicantAccount ? applicantAccount.phone : '+233 24 000 0000'),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        nationality: formData.nationality,
        address: formData.address,
        guardianName: formData.guardianName,
        guardianPhone: formData.guardianPhone,
        programChoiceId: formData.programChoiceId,
        programChoiceName: programName,
        secondarySchool: formData.secondarySchool,
        completionYear: Number(formData.completionYear),
        aggregateScore: Number(formData.aggregateScore),
        status: 'draft',
        isDraft: true,
        currentStep: appStep,
        progressPercent: Math.round((appStep / 7) * 100),
        documents: formData.documents,
        wassceResults: formData.wassceResults
      });

      showToast(`Draft progress saved at Step ${appStep}! You can safely exit and resume later.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error saving application draft.', 'error');
    }
  };

  // Submit Final Application with Comprehensive Validation
  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all steps from 1 to 7
    for (let s = 1; s <= 7; s++) {
      if (!validateStep(s)) {
        setAppStep(s);
        showToast(`Please complete all required fields in Section ${s} before submitting.`, 'error');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    try {
      const selectedProgram = programs.find(p => p.id === formData.programChoiceId);
      const programName = selectedProgram ? selectedProgram.name : formData.programChoiceName;
      const selectedFaculty = faculties.find(f => f.id === formData.facultyId);
      const selectedDept = departments.find(d => d.id === formData.departmentId);

      const newApp = submitApplication({
        firstName: formData.firstName || (applicantAccount ? applicantAccount.firstName : 'Applicant'),
        lastName: formData.lastName || (applicantAccount ? applicantAccount.lastName : 'Candidate'),
        otherNames: formData.otherNames,
        email: applicantAccount ? applicantAccount.email : formData.email,
        phone: formData.phone || (applicantAccount ? applicantAccount.phone : '+233 24 000 0000'),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        nationality: formData.nationality,
        address: formData.address,
        guardianName: formData.guardianName,
        guardianPhone: formData.guardianPhone,
        nextOfKin: {
          fullName: formData.guardianName,
          relationship: formData.nextOfKinRelationship,
          phone: formData.guardianPhone,
          email: formData.nextOfKinEmail,
          address: formData.nextOfKinAddress
        },
        facultyId: formData.facultyId,
        facultyName: selectedFaculty?.name,
        departmentId: formData.departmentId,
        departmentName: selectedDept?.name,
        programChoiceId: formData.programChoiceId,
        programChoiceName: programName,
        secondChoiceProgramId: formData.secondChoiceProgramId,
        secondChoiceProgramName: formData.secondChoiceProgramName,
        studyMode: formData.studyMode,
        secondarySchool: formData.secondarySchool,
        completionYear: Number(formData.completionYear),
        aggregateScore: Number(formData.aggregateScore),
        wassceAggregate: Number(formData.aggregateScore),
        documents: formData.documents,
        wassceResults: formData.wassceResults,
        declarationConfirmed: true
      });

      if (newApp && newApp.id) {
        linkApplicantApplication(newApp.id);
      }

      showToast(`Application ${newApp.applicationNumber} submitted successfully!`, 'success');
      try {
        localStorage.removeItem(getDraftStorageKey());
        localStorage.removeItem('premier_admissions_draft_guest');
      } catch {}
      setDraftRestored(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      showToast(err.message || 'Error submitting application.', 'error');
    }
  };

  // Handle Resubmission after Admissions Correction Request
  const handleResubmitCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!existingApp) return;

    try {
      resubmitApplication(existingApp.id, {
        dateOfBirth: resubmitDOB || existingApp.dateOfBirth,
        address: resubmitAddress || existingApp.address
      });

      showToast('Application resubmitted with corrections! Academic Registry notified.', 'success');
      setCorrectionEditorOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to resubmit application.', 'error');
    }
  };

  // Handle Offer Acceptance
  const handleAcceptOffer = () => {
    if (!existingApp) return;
    try {
      respondToAdmissionOffer(existingApp.id, true);
      showToast('🎉 Congratulations! You have formally accepted your Admission Offer.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to accept offer.', 'error');
    }
  };

  // Handle Offer Decline
  const handleDeclineOffer = () => {
    if (!existingApp) return;
    if (window.confirm('Are you sure you wish to decline this admission offer?')) {
      respondToAdmissionOffer(existingApp.id, false);
      showToast('Admission offer declined.', 'info');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // VIEW 1: UN-AUTHENTICATED VISITOR — MUST CREATE ACCOUNT OR LOG IN FIRST
  // ─────────────────────────────────────────────────────────────────────────────
  if (!isAuthenticated || role !== 'applicant') {
    return (
      <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
        {/* Navigation Bar */}
        <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white block">
                  Premier University
                </span>
                <span className="text-[10px] font-semibold text-indigo-400 block -mt-0.5">
                  Admissions & Matriculation Directorate
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Link 
                to="/admissions" 
                className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-neutral-800"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Admission Guidelines
              </Link>
              <Link 
                to="/login" 
                className="text-xs font-bold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-3.5 py-1.5 rounded-xl border border-neutral-700 transition-colors"
              >
                Staff / Student Login
              </Link>
            </div>
          </div>
        </header>

        {/* Hero & Account Gateway */}
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14 flex flex-col lg:flex-row items-center gap-12">
          {/* Left Hero & Explanatory Context */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-xs font-bold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Admissions Portal · {settings.currentSession || '2026/2027'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Begin your application with an Admissions Account.
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              To apply for admission into Premier University, you must first create your applicant profile. 
              Your admissions portal allows you to securely submit academic credentials, upload transcripts, monitor 
              verification by the Academic Registry, and receive official admission offers.
            </p>

            {/* Crucial Institutional Safeguard Alert */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs sm:text-sm space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Admissions Security & Separation Principle</span>
              </div>
              <p className="text-neutral-300 text-xs leading-relaxed pl-6">
                An applicant is <strong className="text-white">NOT a student</strong> until the institution verifies all academic requirements, approves the application, and completes the matriculation process. 
                The full <strong className="text-indigo-300">Student Information System Dashboard</strong> (course registration, results, student ID) will remain locked until your official matriculation is approved.
              </p>
            </div>

            {/* Application Stages Highlight */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Step 1</span>
                <h4 className="text-xs font-bold text-white">Create Portal Account</h4>
                <p className="text-[11px] text-neutral-400">Establish your secure admissions credentials</p>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Step 2</span>
                <h4 className="text-xs font-bold text-white">Save Draft & Submit</h4>
                <p className="text-[11px] text-neutral-400">Fill bio-data, academic choices, & upload docs</p>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Step 3</span>
                <h4 className="text-xs font-bold text-white">Offer & Matriculation</h4>
                <p className="text-[11px] text-neutral-400">Accept offer & unlock your student portal</p>
              </div>
            </div>
          </div>

          {/* Right Card: Account Creation or Sign In */}
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50 space-y-6">
            {/* Form Mode Tabs */}
            <div className="flex rounded-xl bg-neutral-800 p-1 border border-neutral-700/60">
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  authMode === 'register' 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Create Applicant Account
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  authMode === 'login' 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Applicant Sign In
              </button>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            {authMode === 'register' ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Applicant Details</span>
                  <button
                    type="button"
                    onClick={handleFillDemoApplicant}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2"
                  >
                    Auto-Fill Demo Applicant
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kwame"
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mensah"
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. kwame.mensah@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="tel"
                      required
                      placeholder="+233 24 000 0000"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Password *</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Confirm *</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <span>Create Account & Continue to Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Registered Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. emmanuel.tetteh@gmail.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Sign In to Admissions Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-[11px] text-neutral-400 block mb-1.5">Or test with existing sample applicant (Password: <code className="text-indigo-400">premier2026</code>):</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail('emmanuel.tetteh@gmail.com');
                          setLoginPassword('premier2026');
                          try {
                            loginApplicant('emmanuel.tetteh@gmail.com', 'premier2026');
                          } catch (err: any) {
                            setAuthError(err.message);
                          }
                        }}
                        className="flex-1 text-[10px] py-1.5 px-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 font-semibold"
                      >
                        Emmanuel Tetteh (Submitted)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail('mercy.danso@outlook.com');
                          setLoginPassword('premier2026');
                          try {
                            loginApplicant('mercy.danso@outlook.com', 'premier2026');
                          } catch (err: any) {
                            setAuthError(err.message);
                          }
                        }}
                        className="flex-1 text-[10px] py-1.5 px-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 font-semibold"
                      >
                        Mercy Danso (Under Review)
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            <div className="pt-4 border-t border-neutral-800 text-center text-[11px] text-neutral-400">
              Need technical support? Contact <span className="text-neutral-200 font-semibold">admissions@premier.edu</span> or +233 30 200 1199.
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} Premier University Admissions Directorate · Official Institutional Gateway
        </footer>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // VIEW 2: AUTHENTICATED APPLICANT — WITH ACTIVE SUBMITTED / REVIEWED APPLICATION
  // DEDICATED APPLICANT DASHBOARD (LOCKED UNTIL MATRICULATION)
  // ─────────────────────────────────────────────────────────────────────────────
  if (existingApp && existingApp.status !== 'draft') {
    const isEnrolled = existingApp.status === 'enrolled';
    const isOfferExtended = existingApp.status === 'admission_offered';
    const isOfferAccepted = existingApp.status === 'offer_accepted';
    const isCorrectionRequired = existingApp.status === 'correction_required';

    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
        {/* Top Header */}
        <header className="border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white block">
                  Premier University
                </span>
                <span className="text-[10px] font-semibold text-indigo-400 block -mt-0.5">
                  Admissions Status & Review Tracking
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>{applicantAccount?.firstName} {applicantAccount?.lastName}</span>
                <span className="font-mono text-[10px] text-neutral-500">({applicantAccount?.email})</span>
              </div>

              <button
                onClick={() => logout()}
                className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-xl border border-neutral-700 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-8">
          {/* BANNER 1: IF ENROLLED -> GRAND WELCOME & UNLOCK STUDENT PORTAL */}
          {isEnrolled && (
            <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-950/80 via-neutral-900 to-indigo-950/80 border-2 border-purple-500/40 shadow-2xl shadow-purple-500/10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-500 text-neutral-950 inline-block mb-1">
                      Official Matriculation Complete
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                      Congratulations, {existingApp.firstName}!
                    </h2>
                    <p className="text-xs sm:text-sm text-purple-200 mt-1">
                      Your admission has been finalized and your official student account is now active.
                    </p>
                  </div>
                </div>

                {existingApp.allocatedStudentId && (
                  <div className="bg-neutral-900/90 border border-purple-500/30 px-5 py-3.5 rounded-2xl text-right">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Allocated Matriculation No</span>
                    <strong className="text-lg sm:text-xl font-mono text-purple-400 font-black">
                      {existingApp.allocatedStudentId}
                    </strong>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-neutral-300">
                  Your Student Information System (SIS) access is unlocked. You can now register for courses, inspect timetables, and access the student portal.
                </p>
                <button
                  onClick={() => {
                    proceedToStudentDashboard({
                      studentId: existingApp.allocatedStudentId || 'PU/IT/2026/044',
                      firstName: existingApp.firstName,
                      lastName: existingApp.lastName,
                      email: existingApp.email,
                      programName: existingApp.programChoiceName
                    });
                    navigate('/');
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-neutral-950 font-black text-xs sm:text-sm shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <span>Go to Student SIS Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* BANNER 2: IF ADMISSION OFFER EXTENDED -> PROMPT ACCEPTANCE */}
          {isOfferExtended && (
            <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-950/80 via-neutral-900 to-teal-950/80 border-2 border-emerald-500/40 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 text-neutral-950 inline-block mb-1">
                      Offer of Admission Available
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                      Admission Offer Extended!
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                      The Academic Registry Board has approved your admission for <strong className="text-white">{existingApp.programChoiceName}</strong>.
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Response Deadline</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">
                    {existingApp.offer?.acceptanceDeadline || 'Within 14 Days'}
                  </span>
                </div>
              </div>

              {/* Offer details & conditions */}
              <div className="p-4 rounded-2xl bg-neutral-900/90 border border-emerald-500/20 space-y-3 text-xs">
                <h4 className="font-bold text-emerald-300 uppercase tracking-wider text-[11px]">
                  Institutional Admission Conditions:
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                  {(existingApp.offer?.admissionConditions || [
                    'Submission of verified original WASSCE / SSCE statement of results',
                    'Satisfactory institutional medical examination certificate',
                    'Formal matriculation fee payment upon reporting'
                  ]).map((cond, idx) => (
                    <li key={idx}>{cond}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-emerald-500/20 flex flex-wrap items-center justify-end gap-3">
                <button
                  onClick={handleDeclineOffer}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-rose-300 text-xs font-semibold transition-colors"
                >
                  Decline Offer
                </button>
                <button
                  onClick={handleAcceptOffer}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 hover:scale-[1.02]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept Official Admission Offer</span>
                </button>
              </div>
            </div>
          )}

          {/* BANNER 3: IF OFFER ACCEPTED BUT NOT YET MATRICULATED */}
          {isOfferAccepted && (
            <div className="p-6 rounded-3xl bg-neutral-900 border-2 border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Admission Offer Accepted
                  </h3>
                  <p className="text-xs text-neutral-300">
                    Your acceptance has been confirmed. The Academic Registry is generating your official matriculation ID and setting up your student profile.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* BANNER 4: IF CORRECTION REQUIRED -> HIGHLIGHT INSTRUCTIONS & ALLOW RESUBMISSION */}
          {isCorrectionRequired && (
            <div className="p-6 rounded-3xl bg-neutral-900 border-2 border-amber-500/40 shadow-xl shadow-amber-500/5 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Admissions Registry Action Required
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      Ref: {existingApp.applicationNumber}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Application Returned for Correction
                  </h2>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    The Academic Affairs Registry has reviewed your submission and identified sections requiring correction before evaluation can continue.
                  </p>

                  {existingApp.correctionRequested && (
                    <div className="mt-3 p-3.5 rounded-xl bg-neutral-800/90 border border-neutral-700 space-y-1.5 text-xs">
                      <p className="text-neutral-400">
                        Sections needing correction: <strong className="text-white">{existingApp.correctionRequested.fields.join(', ')}</strong>
                      </p>
                      <p className="text-neutral-300 italic">
                        "{existingApp.correctionRequested.reason}"
                      </p>
                      <p className="text-[11px] text-amber-400">
                        Resubmission Deadline: {existingApp.correctionRequested.deadline || 'Within 7 business days'}
                      </p>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={() => setCorrectionEditorOpen(!correctionEditorOpen)}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{correctionEditorOpen ? 'Close Correction Form' : 'Rectify Information & Resubmit'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Collapsible Inline Correction Editor */}
              {correctionEditorOpen && (
                <form onSubmit={handleResubmitCorrection} className="p-5 rounded-2xl bg-neutral-800/80 border border-neutral-700 space-y-4 text-xs">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                    Correct Requested Details:
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-300 font-semibold mb-1">Verify Date of Birth</label>
                      <input
                        type="date"
                        value={resubmitDOB}
                        onChange={(e) => setResubmitDOB(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-300 font-semibold mb-1">Verify Residential Address</label>
                      <input
                        type="text"
                        value={resubmitAddress}
                        onChange={(e) => setResubmitAddress(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-neutral-700">
                    <button
                      type="button"
                      onClick={() => setCorrectionEditorOpen(false)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-700 text-neutral-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Resubmit Corrected Application
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* BANNER 5: PENDING REGISTRY REVIEW & LOCKED DASHBOARD NOTICE */}
          {!isEnrolled && !isOfferExtended && !isOfferAccepted && !isCorrectionRequired && (
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Under Registry Review
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      Ref: {existingApp.applicationNumber}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Application Received & Queued for Evaluation
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pt-1">
                    Your application for <strong className="text-white">{existingApp.programChoiceName}</strong> has been received by the Admissions Directorate. 
                    In accordance with university admissions policy, the full <strong className="text-indigo-300">Student Dashboard</strong> (course registrations, results, student ID) <strong className="text-amber-300">remains locked</strong> until the Academic Registry verifies all requirements and issues your approved matriculation status.
                  </p>
                </div>
              </div>

              {existingApp.reviewNotes && (
                <div className="p-3.5 rounded-xl bg-neutral-800/80 border border-neutral-700/80 flex items-start gap-3">
                  <FileText className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      Registry Note from {existingApp.reviewedBy || 'Admissions Registry'}:
                    </span>
                    <p className="text-xs text-white italic">"{existingApp.reviewNotes}"</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* APPLICATION PROGRESS TIMELINE */}
          <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  Application Lifecycle Pipeline
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Real-time status milestones verified by the Admissions Directorate
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300">
                Status: {existingApp.status.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>

            {/* Stages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="p-4 rounded-2xl bg-neutral-800/40 border border-neutral-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/30">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase text-emerald-400">Complete</span>
                </div>
                <h4 className="text-xs font-bold text-white">Portal Account</h4>
                <p className="text-[11px] text-neutral-400">Verified Identity</p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-800/40 border border-neutral-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/30">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase text-emerald-400">Submitted</span>
                </div>
                <h4 className="text-xs font-bold text-white">Application Form</h4>
                <p className="text-[11px] text-neutral-400 font-mono">{existingApp.applicationNumber}</p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-2 ${
                existingApp.status === 'under_review' || existingApp.status === 'resubmitted' || existingApp.status === 'submitted'
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-neutral-800/40 border-neutral-700/60'
              }`}>
                <div className="flex items-center justify-between">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    existingApp.status === 'submitted' || existingApp.status === 'under_review'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {existingApp.status === 'submitted' || existingApp.status === 'under_review' ? <Clock className="w-3.5 h-3.5" /> : <Check className="w-4 h-4" />}
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${
                    existingApp.status === 'submitted' || existingApp.status === 'under_review' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {existingApp.status === 'submitted' || existingApp.status === 'under_review' ? 'In Review' : 'Verified'}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">Credential Verification</h4>
                <p className="text-[11px] text-neutral-400">WASSCE & ID Slips</p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-2 ${
                isOfferExtended || isOfferAccepted || isEnrolled
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-neutral-800/40 border-neutral-700/60'
              }`}>
                <div className="flex items-center justify-between">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isOfferExtended || isOfferAccepted || isEnrolled
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                  }`}>
                    {isOfferExtended || isOfferAccepted || isEnrolled ? <Check className="w-4 h-4" /> : '4'}
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${
                    isOfferExtended || isOfferAccepted || isEnrolled ? 'text-emerald-400' : 'text-neutral-500'
                  }`}>
                    {isOfferAccepted ? 'Accepted' : isOfferExtended ? 'Offered' : 'Pending'}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">Admission Decision</h4>
                <p className="text-[11px] text-neutral-400">Registry Board</p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-2 ${
                isEnrolled
                  ? 'bg-purple-500/10 border-purple-500/30'
                  : 'bg-neutral-800/40 border-neutral-700/60 opacity-60'
              }`}>
                <div className="flex items-center justify-between">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isEnrolled
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                  }`}>
                    {isEnrolled ? <Check className="w-4 h-4" /> : '5'}
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${
                    isEnrolled ? 'text-purple-400' : 'text-neutral-500'
                  }`}>
                    {isEnrolled ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">Student SIS Access</h4>
                <p className="text-[11px] text-neutral-400">Full Dashboard</p>
              </div>
            </div>
          </div>

          {/* APPLICATION DETAILS & SUBMITTED DOCUMENTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-indigo-400" />
                Submitted Bio-data & Qualifications
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-neutral-800 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Candidate Name</span>
                  <strong className="text-white">{existingApp.firstName} {existingApp.lastName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Program Applied</span>
                  <strong className="text-indigo-300">{existingApp.programChoiceName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Study Mode</span>
                  <span className="text-neutral-300">{existingApp.studyMode || 'Full-Time Regular'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Secondary School</span>
                  <span className="text-neutral-300">{existingApp.secondarySchool} ({existingApp.completionYear})</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">WASSCE Aggregate</span>
                  <strong className="text-emerald-400 font-bold font-mono text-sm">{existingApp.aggregateScore}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Submission Timestamp</span>
                  <span className="text-neutral-300">{existingApp.submittedAt ? new Date(existingApp.submittedAt).toLocaleString() : 'Recent'}</span>
                </div>
              </div>

              {existingApp.wassceResults && existingApp.wassceResults.length > 0 && (
                <div className="pt-4 border-t border-neutral-800 space-y-2">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Recorded WASSCE / SSCE Grades:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {existingApp.wassceResults.map((sub, i) => (
                      <div key={i} className="p-2 rounded-xl bg-neutral-800/60 border border-neutral-700/60 flex items-center justify-between text-xs">
                        <span className="text-neutral-300 truncate max-w-[100px]">{sub.subject}</span>
                        <span className="font-mono font-bold text-indigo-300 px-1.5 py-0.5 rounded bg-indigo-500/10">
                          {sub.grade}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Document Verification Drawer */}
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                <FileBadge className="w-4 h-4 text-indigo-400" />
                Attached Documents ({existingApp.documents.length})
              </h4>

              <div className="space-y-2.5 pt-2 border-t border-neutral-800">
                {existingApp.documents.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-neutral-800/40 border border-neutral-700/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{doc.name}</p>
                        <p className="text-[10px] text-neutral-500">{doc.fileSize} · {doc.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        doc.status === 'verified'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : doc.status === 'replacement_required' || doc.status === 'rejected'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {doc.status.replace(/_/g, ' ')}
                      </span>
                      {doc.fileUrl && doc.fileUrl !== '#' && (
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1 rounded hover:bg-neutral-700 text-neutral-400 hover:text-white"
                          title="Preview Document"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 leading-relaxed">
                For corrections or inquiries, email <span className="text-neutral-300 font-semibold">admissions@premier.edu</span> citing Ref: <strong className="text-white font-mono">{existingApp.applicationNumber}</strong>.
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} Premier University Admissions Directorate · Academic Registry Gate
        </footer>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // VIEW 3: AUTHENTICATED APPLICANT — MULTI-STEP APPLICATION FORM WITH REAL VALIDATION & REAL UPLOADS
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white block">
                Premier University
              </span>
              <span className="text-[10px] font-semibold text-indigo-400 block -mt-0.5">
                Official Admission Application Form · {settings.currentSession || '2026/2027'}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center gap-1.5 text-xs font-bold text-neutral-200 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-xl border border-neutral-700 transition-colors shadow-2xs"
              title="Save progress as draft"
            >
              <Save className="w-3.5 h-3.5 text-indigo-400" />
              <span>Save Draft</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-300 bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Signed in as: <strong className="text-white">{applicantAccount?.firstName} {applicantAccount?.lastName}</strong></span>
            </div>

            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-xl border border-neutral-700 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Multi-Step Form Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        {draftRestored && (
          <div className="px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-xs flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span><strong>Draft Restored:</strong> Your previous inputs and Step {appStep} progress were automatically preserved.</span>
            </div>
            <button
              type="button"
              onClick={handleClearDraft}
              className="text-[11px] font-bold text-neutral-400 hover:text-rose-400 underline shrink-0 transition-colors"
            >
              Reset & Start Over
            </button>
          </div>
        )}

        {/* Banner with Step Tracker */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Step {appStep} of 7 · Progress: {Math.round((appStep / 7) * 100)}%
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Undergraduate & Graduate Admission Application
            </h1>
            <p className="text-xs text-neutral-400">
              All marked fields (<span className="text-rose-400 font-bold">*</span>) are mandatory. The form cannot be submitted with empty or missing entries.
            </p>
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleNextStep(s)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                  appStep === s
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
                    : appStep > s
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-neutral-800 text-neutral-500'
                }`}
                title={`Jump to Step ${s}`}
              >
                {appStep > s ? '✓' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Global Error Banner if Current Step has Missing Fields */}
        {Object.keys(formErrors).length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block text-white font-bold">Please correct the following before continuing:</strong>
              <ul className="list-disc pl-4 space-y-0.5">
                {Object.values(formErrors).map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmitApplication} className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-6">
          {/* STEP 1: PERSONAL INFORMATION */}
          {appStep === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  Section 1: Personal Bio-data
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Verify your personal credentials and identity information as recorded on your official legal documents.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Title</label>
                  <select
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white"
                  >
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Dr">Dr</option>
                    <option value="Rev">Rev</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">First Name <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => {
                      setFormData({ ...formData, firstName: e.target.value });
                      if (formErrors.firstName) setFormErrors({ ...formErrors, firstName: '' });
                    }}
                    className={`w-full px-3 py-2 rounded-xl bg-neutral-800 border text-xs text-white ${
                      formErrors.firstName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-700'
                    }`}
                  />
                  {formErrors.firstName && <p className="text-[11px] text-rose-400 mt-1">{formErrors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Last Name <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => {
                      setFormData({ ...formData, lastName: e.target.value });
                      if (formErrors.lastName) setFormErrors({ ...formErrors, lastName: '' });
                    }}
                    className={`w-full px-3 py-2 rounded-xl bg-neutral-800 border text-xs text-white ${
                      formErrors.lastName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-700'
                    }`}
                  />
                  {formErrors.lastName && <p className="text-[11px] text-rose-400 mt-1">{formErrors.lastName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Middle / Other Names (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Kwabena"
                    value={formData.otherNames}
                    onChange={(e) => setFormData({ ...formData, otherNames: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Date of Birth <span className="text-rose-400">*</span></label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => {
                      setFormData({ ...formData, dateOfBirth: e.target.value });
                      if (formErrors.dateOfBirth) setFormErrors({ ...formErrors, dateOfBirth: '' });
                    }}
                    className={`w-full px-3 py-2 rounded-xl bg-neutral-800 border text-xs text-white ${
                      formErrors.dateOfBirth ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-700'
                    }`}
                  />
                  {formErrors.dateOfBirth && <p className="text-[11px] text-rose-400 mt-1">{formErrors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Gender <span className="text-rose-400">*</span></label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Nationality / Country <span className="text-rose-400">*</span>
                  </label>
                  <select
                    required
                    value={formData.nationality === 'Ghana' ? 'Ghanaian' : formData.nationality}
                    onChange={(e) => {
                      setFormData({ ...formData, nationality: e.target.value });
                      if (formErrors.nationality) setFormErrors({ ...formErrors, nationality: '' });
                    }}
                    className={`w-full px-3 py-2 rounded-xl bg-neutral-800 border text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
                      formErrors.nationality ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-700'
                    }`}
                  >
                    <option value="">-- Select Country / Nationality --</option>
                    <optgroup label="Frequently Selected">
                      <option value="Ghanaian">Ghana (Ghanaian)</option>
                      <option value="Nigerian">Nigeria (Nigerian)</option>
                      <option value="Ivorian">Ivory Coast (Ivorian)</option>
                      <option value="Togolese">Togo (Togolese)</option>
                      <option value="Liberian">Liberia (Liberian)</option>
                      <option value="Sierra Leonean">Sierra Leone (Sierra Leonean)</option>
                      <option value="British">United Kingdom (British)</option>
                      <option value="American">United States (American)</option>
                      <option value="Canadian">Canada (Canadian)</option>
                    </optgroup>
                    <optgroup label="All Countries (A - Z)">
                      {COUNTRIES.map((c) => (
                        <option key={c.name} value={c.nationality}>
                          {c.name} ({c.nationality})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  {formErrors.nationality && <p className="text-[11px] text-rose-400 mt-1">{formErrors.nationality}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Identification Type <span className="text-rose-400">*</span></label>
                  <select
                    value={formData.identificationType}
                    onChange={(e) => setFormData({ ...formData, identificationType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white"
                  >
                    <option value="National ID">Ghana Card (National ID)</option>
                    <option value="Passport">International Passport</option>
                    <option value="Birth Certificate">Birth Certificate</option>
                    <option value="Voter ID">Voter ID Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">ID Number <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GHA-721849102-3"
                    value={formData.identificationNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, identificationNumber: e.target.value });
                      if (formErrors.identificationNumber) setFormErrors({ ...formErrors, identificationNumber: '' });
                    }}
                    className={`w-full px-3 py-2 rounded-xl bg-neutral-800 border text-xs text-white font-mono ${
                      formErrors.identificationNumber ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-700'
                    }`}
                  />
                  {formErrors.identificationNumber && <p className="text-[11px] text-rose-400 mt-1">{formErrors.identificationNumber}</p>}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleNextStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2"
                >
                  <span>Continue to Contact Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONTACT INFORMATION */}
          {appStep === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  Section 2: Contact Information & Residential Address
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Provide verified contact addresses for institutional notifications and admissions letters.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Primary Email Address <span className="text-rose-400">*</span></label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                    }}
                    className={`w-full px-3 py-2 rounded-xl bg-neutral-800 border text-xs text-white ${
                      formErrors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-700'
                    }`}
                  />
                  {formErrors.email && <p className="text-[11px] text-rose-400 mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Primary Mobile Phone <span className="text-rose-400">*</span></label>
                  <input
                    type="tel"
                    required
                    placeholder="+233 24 000 0000"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                    }}
                    className={`w-full px-3 py-2 rounded-xl bg-neutral-800 border text-xs text-white ${
                      formErrors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-700'
                    }`}
                  />
                  {formErrors.phone && <p className="text-[11px] text-rose-400 mt-1">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Alternative Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+233 20 000 0000"
                    value={formData.alternativePhone}
                    onChange={(e) => setFormData({ ...formData, alternativePhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">City / Town <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Accra"
                    value={formData.city}
                    onChange={(e) => {
                      setFormData({ ...formData, city: e.target.value });
                      if (formErrors.city) setFormErrors({ ...formErrors, city: '' });
                    }}
                    className={`w-full px-3 py-2 rounded-xl bg-neutral-800 border text-xs text-white ${
                      formErrors.city ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-700'
                    }`}
                  />
                  {formErrors.city && <p className="text-[11px] text-rose-400 mt-1">{formErrors.city}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Residential Street Address <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. House No. 12, East Legon Hills"
                    value={formData.address}
                    onChange={(e) => {
                      setFormData({ ...formData, address: e.target.value });
                      if (formErrors.address) setFormErrors({ ...formErrors, address: '' });
                    }}
                    className={`w-full px-3 py-2 rounded-xl bg-neutral-800 border text-xs text-white ${
                      formErrors.address ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-700'
                    }`}
                  />
                  {formErrors.address && <p className="text-[11px] text-rose-400 mt-1">{formErrors.address}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Region / State</label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Postal / P.O. Box Address</label>
                  <input
                    type="text"
                    placeholder="e.g. P.O. Box LG 42"
                    value={formData.postalAddress}
                    onChange={(e) => setFormData({ ...formData, postalAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setAppStep(1)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
                >
                  ← Back
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNextStep(3)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <span>Continue to Next of Kin</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: NEXT OF KIN / EMERGENCY CONTACT */}
          {appStep === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  Section 3: Next of Kin / Emergency Contact
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Record official contact information of your parent, guardian, or emergency contact.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Next of Kin Full Name <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Joseph Mensah"
                    value={formData.guardianName}
                    onChange={(e) => {
                      setFormData({ ...formData, guardianName: e.target.value });
                      if (formErrors.guardianName) setFormErrors({ ...formErrors, guardianName: '' });
                    }}
                    className={`w-full px-3 py-2 rounded-xl bg-neutral-800 border text-xs text-white ${
                      formErrors.guardianName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-700'
                    }`}
                  />
                  {formErrors.guardianName && <p className="text-[11px] text-rose-400 mt-1">{formErrors.guardianName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Relationship <span className="text-rose-400">*</span></label>
                  <select
                    value={formData.nextOfKinRelationship}
                    onChange={(e) => setFormData({ ...formData, nextOfKinRelationship: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Contact Phone Number <span className="text-rose-400">*</span></label>
                  <input
                    type="tel"
                    required
                    placeholder="+233 24 000 0000"
                    value={formData.guardianPhone}
                    onChange={(e) => {
                      setFormData({ ...formData, guardianPhone: e.target.value });
                      if (formErrors.guardianPhone) setFormErrors({ ...formErrors, guardianPhone: '' });
                    }}
                    className={`w-full px-3 py-2 rounded-xl bg-neutral-800 border text-xs text-white ${
                      formErrors.guardianPhone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-700'
                    }`}
                  />
                  {formErrors.guardianPhone && <p className="text-[11px] text-rose-400 mt-1">{formErrors.guardianPhone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. guardian@gmail.com"
                    value={formData.nextOfKinEmail}
                    onChange={(e) => setFormData({ ...formData, nextOfKinEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Residential Address</label>
                  <input
                    type="text"
                    placeholder="e.g. East Legon Hills, Accra"
                    value={formData.nextOfKinAddress}
                    onChange={(e) => setFormData({ ...formData, nextOfKinAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setAppStep(2)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
                >
                  ← Back
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNextStep(4)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <span>Continue to Academic History</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ACADEMIC BACKGROUND & FLEXIBLE WASSCE SUBJECTS */}
          {appStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-400" />
                  Section 4: Senior High School & Academic Qualifications
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Select your high school track (Science, Arts, Business, Visual Arts, etc.) or add your specific course subjects and grades.
                </p>
              </div>

              {/* General School Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Senior High School Attended <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Achimota School / PRESEC Legon / Mfantsipim"
                    value={formData.secondarySchool}
                    onChange={(e) => {
                      setFormData({ ...formData, secondarySchool: e.target.value });
                      if (formErrors.secondarySchool) setFormErrors({ ...formErrors, secondarySchool: '' });
                    }}
                    className={`w-full px-3 py-2 rounded-xl bg-neutral-800 border text-xs text-white ${
                      formErrors.secondarySchool ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-700'
                    }`}
                  />
                  {formErrors.secondarySchool && <p className="text-[11px] text-rose-400 mt-1">{formErrors.secondarySchool}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Completion Year <span className="text-rose-400">*</span></label>
                  <input
                    type="number"
                    min="2010"
                    max="2026"
                    value={formData.completionYear}
                    onChange={(e) => setFormData({ ...formData, completionYear: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Examination Type</label>
                  <select
                    value={formData.examinationType}
                    onChange={(e) => setFormData({ ...formData, examinationType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white"
                  >
                    <option value="WASSCE">WASSCE (West African Senior School Certificate)</option>
                    <option value="SSSCE">SSSCE (Senior Secondary School Certificate)</option>
                    <option value="Cambridge A-Levels">Cambridge GCE / A-Levels</option>
                    <option value="IB">International Baccalaureate (IB)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Candidate / Index Number <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0010102043"
                    value={formData.candidateIndexNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, candidateIndexNumber: e.target.value });
                      if (formErrors.candidateIndexNumber) setFormErrors({ ...formErrors, candidateIndexNumber: '' });
                    }}
                    className={`w-full px-3 py-2 rounded-xl bg-neutral-800 border text-xs text-white font-mono ${
                      formErrors.candidateIndexNumber ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-700'
                    }`}
                  />
                  {formErrors.candidateIndexNumber && <p className="text-[11px] text-rose-400 mt-1">{formErrors.candidateIndexNumber}</p>}
                </div>
              </div>

              {/* COURSE TRACK / STREAM PRESET SELECTOR */}
              <div className="p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                    <Layers className="w-4 h-4" />
                    <span>Select Secondary School Programme / Course Track:</span>
                  </label>
                  <span className="text-[11px] text-neutral-400">Loads relevant course electives</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SHS_STREAMS.map(stream => (
                    <button
                      key={stream.id}
                      type="button"
                      onClick={() => handleStreamChange(stream.id)}
                      className={`p-2 rounded-xl text-xs font-semibold text-left transition-all border ${
                        selectedStream === stream.id
                          ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-xs'
                          : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/60'
                      }`}
                    >
                      {stream.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* SUBJECTS & GRADES EDITOR */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Subject Grades Breakdown ({formData.wassceResults.length} Subjects)
                    </span>
                    <p className="text-[11px] text-neutral-400">
                      Edit subject names, grades, or add custom subjects taken
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleAddSubject}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Subject</span>
                    </button>

                    <div className="flex items-center gap-2 bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
                      <span className="text-xs text-neutral-400">Aggregate:</span>
                      <span className="text-xs font-mono font-black text-emerald-400">{formData.aggregateScore}</span>
                    </div>
                  </div>
                </div>

                {formErrors.wassceResults && (
                  <p className="text-xs text-rose-400 font-semibold">{formErrors.wassceResults}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.wassceResults.map((sub, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/60 flex items-center justify-between gap-2">
                      {/* Subject Name / Selector */}
                      <div className="flex-1 min-w-0">
                        {ALL_COMMON_SUBJECTS.includes(sub.subject) ? (
                          <select
                            value={sub.subject}
                            onChange={(e) => {
                              const updated = [...formData.wassceResults];
                              updated[idx].subject = e.target.value;
                              setFormData({ ...formData, wassceResults: updated });
                            }}
                            className="w-full bg-transparent text-xs text-white font-medium border-0 focus:ring-0 truncate"
                          >
                            {ALL_COMMON_SUBJECTS.map(s => (
                              <option key={s} value={s} className="bg-neutral-800 text-white">{s}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={sub.subject}
                            onChange={(e) => {
                              const updated = [...formData.wassceResults];
                              updated[idx].subject = e.target.value;
                              setFormData({ ...formData, wassceResults: updated });
                            }}
                            className="w-full bg-transparent text-xs text-white font-medium border-0 focus:ring-0"
                            placeholder="Subject Name"
                          />
                        )}
                      </div>

                      {/* Grade Selector */}
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={sub.grade}
                          onChange={(e) => {
                            const updated = [...formData.wassceResults];
                            updated[idx].grade = e.target.value;
                            const newAgg = calculateAggregate(updated);
                            setFormData({ 
                              ...formData, 
                              wassceResults: updated,
                              aggregateScore: newAgg
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-neutral-700 border border-neutral-600 text-xs font-mono font-bold text-indigo-300 focus:outline-none"
                        >
                          {['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'].map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>

                        {/* Remove button (allowed for electives) */}
                        {idx >= 4 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSubject(idx)}
                            className="p-1 rounded text-neutral-400 hover:text-rose-400 hover:bg-neutral-700/60"
                            title="Remove Subject"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setAppStep(3)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
                >
                  ← Back
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNextStep(5)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <span>Continue to Program Selection</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PROGRAM SELECTION (FROM ACADEMIC STRUCTURE) */}
          {appStep === 5 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  Section 5: Program Selection (Academic Structure)
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Select your desired major and study mode directly configured from the institutional academic catalogue.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Faculty / School <span className="text-rose-400">*</span></label>
                  <select
                    value={formData.facultyId}
                    onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white"
                  >
                    {faculties.map(fac => (
                      <option key={fac.id} value={fac.id}>{fac.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Department</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white"
                  >
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">First Choice Program of Study <span className="text-rose-400">*</span></label>
                  <select
                    value={formData.programChoiceId}
                    onChange={(e) => {
                      const sel = programs.find(p => p.id === e.target.value);
                      setFormData({
                        ...formData,
                        programChoiceId: e.target.value,
                        programChoiceName: sel ? sel.name : formData.programChoiceName
                      });
                      if (formErrors.programChoiceId) setFormErrors({ ...formErrors, programChoiceId: '' });
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl bg-neutral-800 border text-xs text-white ${
                      formErrors.programChoiceId ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-700'
                    }`}
                  >
                    {programs.map((prog) => (
                      <option key={prog.id} value={prog.id}>
                        {prog.name} ({prog.code}) · {prog.facultyName || 'Computing & Info Systems'}
                      </option>
                    ))}
                  </select>
                  {formErrors.programChoiceId && <p className="text-[11px] text-rose-400 mt-1">{formErrors.programChoiceId}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Second Choice Program (Alternative)</label>
                  <select
                    value={formData.secondChoiceProgramId}
                    onChange={(e) => {
                      const sel = programs.find(p => p.id === e.target.value);
                      setFormData({
                        ...formData,
                        secondChoiceProgramId: e.target.value,
                        secondChoiceProgramName: sel ? sel.name : ''
                      });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white"
                  >
                    <option value="">-- None Selected --</option>
                    {programs.map((prog) => (
                      <option key={prog.id} value={prog.id}>
                        {prog.name} ({prog.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Study Mode</label>
                  <select
                    value={formData.studyMode}
                    onChange={(e) => setFormData({ ...formData, studyMode: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white"
                  >
                    <option value="Full-Time Regular">Full-Time Regular (Day Stream)</option>
                    <option value="Evening / Executive">Evening / Executive Stream</option>
                    <option value="Weekend Modular">Weekend Modular Stream</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Admissions Entry Level</label>
                  <input
                    type="text"
                    disabled
                    value="Level 100 (Direct Undergraduate Entry)"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800/60 border border-neutral-700 text-xs text-neutral-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setAppStep(4)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
                >
                  ← Back
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNextStep(6)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <span>Continue to Document Uploads</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: REAL DOCUMENT UPLOADS & CREDENTIAL VERIFICATION */}
          {appStep === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-indigo-400" />
                  Section 6: Document Uploads & Credential Verification
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Please upload scanned PDF, JPEG, or PNG copies of your required academic certificates and identity cards. Maximum file size per document is 10MB.
                </p>
              </div>

              {formErrors.documents && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{formErrors.documents}</span>
                </div>
              )}

              {/* Document Slots */}
              <div className="space-y-4">
                {REQUIRED_DOCUMENT_SLOTS.map((slot) => {
                  const uploaded = formData.documents.find(d => d.type === slot.type);

                  return (
                    <div 
                      key={slot.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        uploaded 
                          ? 'bg-neutral-800/70 border-emerald-500/40 shadow-xs' 
                          : slot.required && formErrors.documents
                          ? 'bg-neutral-800/40 border-rose-500/50'
                          : 'bg-neutral-800/40 border-neutral-700/60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs sm:text-sm">
                              {slot.title}
                            </span>
                            {slot.required ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                Required
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-700 text-neutral-300">
                                Optional
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400">
                            {slot.description}
                          </p>
                        </div>

                        {/* Upload Trigger / Status */}
                        <div>
                          {uploaded ? (
                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <span className="text-xs font-semibold text-white block truncate max-w-[180px]">
                                  {uploaded.name}
                                </span>
                                <span className="text-[10px] text-neutral-400">
                                  {uploaded.fileSize} · Attached
                                </span>
                              </div>

                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                <span>Attached</span>
                              </span>

                              {/* Preview Action */}
                              <button
                                type="button"
                                onClick={() => setPreviewDoc(uploaded)}
                                className="p-2 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-neutral-200"
                                title="View Document Preview"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Remove Action */}
                              <button
                                type="button"
                                onClick={() => handleRemoveDoc(uploaded.id)}
                                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                title="Remove File"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]">
                              <UploadCloud className="w-4 h-4" />
                              <span>Select / Upload File</span>
                              <input
                                type="file"
                                accept={slot.accepted}
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, slot.type, slot.title)}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setAppStep(5)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
                >
                  ← Back
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNextStep(7)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <span>Review & Final Declaration</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: REVIEW & FINAL DECLARATION */}
          {appStep === 7 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  Section 7: Application Review & Legal Declaration
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Confirm all entered data before submitting for Admissions Committee evaluation.
                </p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Candidate Identity</span>
                  <p className="text-white font-semibold">{formData.firstName} {formData.lastName}</p>
                  <p className="text-neutral-400">{formData.email} • {formData.phone}</p>
                  <p className="text-neutral-400">DOB: {formData.dateOfBirth} ({formData.gender})</p>
                  <p className="text-neutral-400">ID: {formData.identificationType} ({formData.identificationNumber})</p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Program Selected</span>
                  <p className="text-indigo-300 font-semibold">{formData.programChoiceName || 'BSc Software Engineering'}</p>
                  <p className="text-neutral-400">Study Mode: {formData.studyMode}</p>
                  <p className="text-neutral-400">Session: {formData.session}</p>
                  <p className="text-neutral-400">Entry Level: Level 100 Undergraduate</p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Senior High School & WASSCE</span>
                  <p className="text-white font-semibold">{formData.secondarySchool} ({formData.completionYear})</p>
                  <p className="text-neutral-400">Index No: {formData.candidateIndexNumber}</p>
                  <p className="text-neutral-400 font-mono font-bold text-emerald-400">Aggregate Score: {formData.aggregateScore}</p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Uploaded Credentials</span>
                  <p className="text-white font-semibold">{formData.documents.length} Verification Files Attached</p>
                  <div className="space-y-0.5 pt-1">
                    {formData.documents.map((d, i) => (
                      <span key={i} className="inline-block px-2 py-0.5 rounded bg-neutral-700 text-neutral-300 text-[10px] mr-1 mb-1">
                        {d.type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Declaration Checkbox */}
              <div className={`p-4 rounded-2xl border space-y-3 transition-all ${
                formErrors.declarationConfirmed ? 'bg-rose-500/10 border-rose-500' : 'bg-neutral-800/90 border-neutral-700'
              }`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.declarationConfirmed}
                    onChange={(e) => {
                      setFormData({ ...formData, declarationConfirmed: e.target.checked });
                      if (formErrors.declarationConfirmed) {
                        setFormErrors({ ...formErrors, declarationConfirmed: '' });
                      }
                    }}
                    className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-neutral-600 bg-neutral-700"
                  />
                  <div className="text-xs text-neutral-300 leading-relaxed">
                    <strong className="text-white block mb-0.5">Applicant Certification & Truth Declaration</strong>
                    I solemnly certify that the information entered and all attached transcripts and certificates are authentic, true, and complete. I understand that falsification of results results in immediate disqualification and prosecution. I explicitly acknowledge that my <span className="text-amber-300 font-semibold">Student SIS Dashboard remains locked until the Admissions Directorate evaluates my credentials, issues an admission offer, and completes matriculation</span>.
                  </div>
                </label>
                {formErrors.declarationConfirmed && (
                  <p className="text-xs text-rose-400 pl-7">{formErrors.declarationConfirmed}</p>
                )}
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setAppStep(6)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
                >
                  ← Back
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
                  >
                    Save Draft
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 hover:scale-[1.02]"
                  >
                    <span>Submit Application for Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </main>

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-2xl text-neutral-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h4 className="font-bold text-sm text-white">{previewDoc.name}</h4>
                <p className="text-xs text-neutral-400">{previewDoc.type} • {previewDoc.fileSize}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center min-h-[300px]">
              {resolvedPreviewUrl && resolvedPreviewUrl.startsWith('data:image') ? (
                <img 
                  src={resolvedPreviewUrl} 
                  alt={previewDoc.name}
                  className="max-h-[400px] object-contain rounded-xl"
                />
              ) : resolvedPreviewUrl && resolvedPreviewUrl.startsWith('data:application/pdf') ? (
                <iframe
                  src={resolvedPreviewUrl}
                  title={previewDoc.name}
                  className="w-full h-[400px] rounded-xl border-0"
                />
              ) : (
                <div className="text-center space-y-3 p-6">
                  <FileText className="w-16 h-16 text-indigo-400 mx-auto" />
                  <p className="text-xs font-bold text-white">{previewDoc.name}</p>
                  <p className="text-[11px] text-neutral-400">Institutional Document Ready for Registry Verification</p>
                  {resolvedPreviewUrl && (
                    <a
                      href={resolvedPreviewUrl}
                      download={previewDoc.name}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Document
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Premier University Admissions Directorate · Academic Registry Gate
      </footer>
    </div>
  );
};

export default ApplyPage;
