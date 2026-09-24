import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Layers, 
  BookOpen, 
  GraduationCap, 
  Plus, 
  Search, 
  FileText, 
  CheckCircle,
  Hash,
  Clock,
  Award,
  Edit3,
  Trash2,
  X,
  AlertTriangle,
  Radio,
  Users,
  Check,
  Filter
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { Faculty, Department, AcademicProgram, Course, AcademicLevel, CourseType } from '../../types';

export const AcademicStructureView: React.FC = () => {
  const { 
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
    students
  } = useSchool();

  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'faculties' | 'departments' | 'programs' | 'courses'>('faculties');
  const [searchQuery, setSearchQuery] = useState('');

  // Create Modals state
  const [isFacModalOpen, setIsFacModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isProgModalOpen, setIsProgModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  // Edit Modals state
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [editingProgram, setEditingProgram] = useState<AcademicProgram | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Delete Confirmation state
  const [deletingItem, setDeletingItem] = useState<{
    type: 'faculty' | 'department' | 'program' | 'course';
    id: string;
    name: string;
    warning?: string;
  } | null>(null);

  // Forms for Create
  const [facForm, setFacForm] = useState({ name: '', code: '', deanName: '', deanEmail: '', description: '' });
  const [deptForm, setDeptForm] = useState({ name: '', code: '', facultyId: '', headOfDepartment: '', hodEmail: '', description: '' });
  const [progForm, setProgForm] = useState({ name: '', code: '', departmentId: '', degree: 'Bachelor of Science (Honours)', durationYears: 4, totalRequiredCredits: 132, coreCreditsRequired: 108, electiveCreditsRequired: 24, description: '' });
  const [courseForm, setCourseForm] = useState({
    code: '',
    title: '',
    description: '',
    creditHours: 3,
    level: '100' as AcademicLevel,
    semester: 'First Semester' as 'First Semester' | 'Second Semester',
    type: 'core' as CourseType,
    department: '',
    prerequisites: ''
  });

  // Dynamic calculations for relationships
  const facultyStats = useMemo(() => {
    const map = new Map<string, { deptCount: number; studentCount: number }>();
    faculties.forEach(fac => {
      const depts = departments.filter(d => d.facultyId === fac.id);
      const deptNames = depts.map(d => d.name);
      const studentCount = students.filter(s => s.faculty === fac.name || deptNames.includes(s.department)).length;
      map.set(fac.id, { deptCount: depts.length, studentCount });
    });
    return map;
  }, [faculties, departments, students]);

  const departmentStats = useMemo(() => {
    const map = new Map<string, { progCount: number; studentCount: number }>();
    departments.forEach(dept => {
      const progs = programs.filter(p => p.departmentId === dept.id);
      const studentCount = students.filter(s => s.department === dept.name).length;
      map.set(dept.id, { progCount: progs.length, studentCount });
    });
    return map;
  }, [departments, programs, students]);

  // Real-time search filtering across all 4 tabs
  const filteredFaculties = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return faculties;
    return faculties.filter(f => 
      f.name.toLowerCase().includes(q) ||
      f.code.toLowerCase().includes(q) ||
      f.deanName.toLowerCase().includes(q) ||
      f.deanEmail.toLowerCase().includes(q) ||
      (f.description && f.description.toLowerCase().includes(q))
    );
  }, [faculties, searchQuery]);

  const filteredDepartments = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return departments;
    return departments.filter(d => 
      d.name.toLowerCase().includes(q) ||
      d.code.toLowerCase().includes(q) ||
      d.facultyName.toLowerCase().includes(q) ||
      d.headOfDepartment.toLowerCase().includes(q) ||
      d.hodEmail.toLowerCase().includes(q) ||
      (d.description && d.description.toLowerCase().includes(q))
    );
  }, [departments, searchQuery]);

  const filteredPrograms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return programs;
    return programs.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.departmentName.toLowerCase().includes(q) ||
      (p.facultyName && p.facultyName.toLowerCase().includes(q)) ||
      p.degree.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }, [programs, searchQuery]);

  const filteredCourses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return courses;
    return courses.filter(c => 
      c.code.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q) ||
      c.level.toLowerCase().includes(q) ||
      c.semester.toLowerCase().includes(q) ||
      c.type.toLowerCase().includes(q) ||
      (c.lecturerName && c.lecturerName.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  }, [courses, searchQuery]);

  // Handle Faculty Actions
  const handleCreateFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    addFaculty({
      name: facForm.name.trim(),
      code: facForm.code.trim().toUpperCase(),
      deanName: facForm.deanName.trim(),
      deanEmail: facForm.deanEmail.trim(),
      description: facForm.description.trim(),
      status: 'active'
    });
    showToast(`Faculty ${facForm.code.toUpperCase()} successfully initialized`, 'success');
    setIsFacModalOpen(false);
    setFacForm({ name: '', code: '', deanName: '', deanEmail: '', description: '' });
  };

  const handleUpdateFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaculty) return;
    updateFaculty(editingFaculty.id, {
      name: editingFaculty.name.trim(),
      code: editingFaculty.code.trim().toUpperCase(),
      deanName: editingFaculty.deanName.trim(),
      deanEmail: editingFaculty.deanEmail.trim(),
      description: editingFaculty.description?.trim() || ''
    });
    showToast(`Faculty ${editingFaculty.code} updated successfully`, 'success');
    setEditingFaculty(null);
  };

  // Handle Department Actions
  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    const targetFacId = deptForm.facultyId || faculties[0]?.id;
    const fac = faculties.find(f => f.id === targetFacId);
    addDepartment({
      name: deptForm.name.trim(),
      code: deptForm.code.trim().toUpperCase(),
      facultyId: targetFacId,
      facultyName: fac?.name || '',
      headOfDepartment: deptForm.headOfDepartment.trim(),
      hodEmail: deptForm.hodEmail.trim(),
      description: deptForm.description.trim(),
      status: 'active'
    });
    showToast(`Department ${deptForm.code.toUpperCase()} created under ${fac?.name}`, 'success');
    setIsDeptModalOpen(false);
    setDeptForm({ name: '', code: '', facultyId: '', headOfDepartment: '', hodEmail: '', description: '' });
  };

  const handleUpdateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDepartment) return;
    const fac = faculties.find(f => f.id === editingDepartment.facultyId);
    updateDepartment(editingDepartment.id, {
      name: editingDepartment.name.trim(),
      code: editingDepartment.code.trim().toUpperCase(),
      facultyId: editingDepartment.facultyId,
      facultyName: fac?.name || editingDepartment.facultyName,
      headOfDepartment: editingDepartment.headOfDepartment.trim(),
      hodEmail: editingDepartment.hodEmail.trim(),
      description: editingDepartment.description?.trim() || ''
    });
    showToast(`Department ${editingDepartment.code} updated successfully`, 'success');
    setEditingDepartment(null);
  };

  // Handle Program Actions
  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    const targetDeptId = progForm.departmentId || departments[0]?.id;
    const dept = departments.find(d => d.id === targetDeptId);
    addProgram({
      name: progForm.name.trim(),
      code: progForm.code.trim().toUpperCase(),
      departmentId: targetDeptId,
      departmentName: dept?.name || '',
      facultyName: dept?.facultyName || '',
      degree: progForm.degree.trim(),
      durationYears: Number(progForm.durationYears),
      totalRequiredCredits: Number(progForm.totalRequiredCredits),
      coreCreditsRequired: Number(progForm.coreCreditsRequired),
      electiveCreditsRequired: Number(progForm.electiveCreditsRequired),
      description: progForm.description.trim(),
      status: 'active'
    });
    showToast(`Degree Program ${progForm.code.toUpperCase()} initialized`, 'success');
    setIsProgModalOpen(false);
    setProgForm({ name: '', code: '', departmentId: '', degree: 'Bachelor of Science (Honours)', durationYears: 4, totalRequiredCredits: 132, coreCreditsRequired: 108, electiveCreditsRequired: 24, description: '' });
  };

  const handleUpdateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram) return;
    const dept = departments.find(d => d.id === editingProgram.departmentId);
    updateProgram(editingProgram.id, {
      name: editingProgram.name.trim(),
      code: editingProgram.code.trim().toUpperCase(),
      departmentId: editingProgram.departmentId,
      departmentName: dept?.name || editingProgram.departmentName,
      facultyName: dept?.facultyName || editingProgram.facultyName,
      degree: editingProgram.degree.trim(),
      durationYears: Number(editingProgram.durationYears),
      totalRequiredCredits: Number(editingProgram.totalRequiredCredits),
      coreCreditsRequired: Number(editingProgram.coreCreditsRequired),
      electiveCreditsRequired: Number(editingProgram.electiveCreditsRequired),
      description: editingProgram.description?.trim() || ''
    });
    showToast(`Program ${editingProgram.code} updated successfully`, 'success');
    setEditingProgram(null);
  };

  // Handle Course Actions
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const prereqList = courseForm.prerequisites
      ? courseForm.prerequisites.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
      : [];

    const deptName = courseForm.department || departments[0]?.name || 'Department of Information Technology';

    addCourse({
      code: courseForm.code.trim().toUpperCase(),
      title: courseForm.title.trim(),
      description: courseForm.description.trim(),
      creditHours: Number(courseForm.creditHours),
      level: courseForm.level,
      semester: courseForm.semester,
      type: courseForm.type,
      department: deptName,
      prerequisites: prereqList,
      capacity: 60,
      enrolledCount: 0
    });
    showToast(`Curriculum course ${courseForm.code.toUpperCase()} created`, 'success');
    setIsCourseModalOpen(false);
    setCourseForm({
      code: '',
      title: '',
      description: '',
      creditHours: 3,
      level: '100',
      semester: 'First Semester',
      type: 'core',
      department: '',
      prerequisites: ''
    });
  };

  const handleUpdateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    updateCourse(editingCourse.id, {
      code: editingCourse.code.trim().toUpperCase(),
      title: editingCourse.title.trim(),
      description: editingCourse.description?.trim() || '',
      creditHours: Number(editingCourse.creditHours),
      level: editingCourse.level,
      semester: editingCourse.semester,
      type: editingCourse.type,
      department: editingCourse.department,
      prerequisites: Array.isArray(editingCourse.prerequisites) ? editingCourse.prerequisites : []
    });
    showToast(`Course ${editingCourse.code} parameters updated`, 'success');
    setEditingCourse(null);
  };

  // Delete Handlers
  const triggerDelete = (type: 'faculty' | 'department' | 'program' | 'course', id: string, name: string) => {
    let warning: string | undefined;
    if (type === 'faculty') {
      const childDepts = departments.filter(d => d.facultyId === id);
      if (childDepts.length > 0) {
        warning = `This faculty contains ${childDepts.length} department(s) (${childDepts.map(d => d.code).join(', ')}). Deleting it will detach these departments.`;
      }
    } else if (type === 'department') {
      const childProgs = programs.filter(p => p.departmentId === id);
      if (childProgs.length > 0) {
        warning = `This department offers ${childProgs.length} degree program(s) (${childProgs.map(p => p.code).join(', ')}).`;
      }
    }
    setDeletingItem({ type, id, name, warning });
  };

  const confirmDelete = () => {
    if (!deletingItem) return;
    const { type, id, name } = deletingItem;
    if (type === 'faculty') {
      deleteFaculty(id);
      showToast(`Faculty ${name} deleted`, 'info');
    } else if (type === 'department') {
      deleteDepartment(id);
      showToast(`Department ${name} deleted`, 'info');
    } else if (type === 'program') {
      deleteProgram(id);
      showToast(`Academic Program ${name} deleted`, 'info');
    } else if (type === 'course') {
      deleteCourse(id);
      showToast(`Curriculum Course ${name} deleted`, 'info');
    }
    setDeletingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header with Live Sync Status & Add Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                Academic Structure & Curriculum Engine
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Manage institutional faculties, academic departments, degree program curricula, and syllabus courses in real time.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'faculties' && (
            <button
              onClick={() => setIsFacModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Faculty
            </button>
          )}
          {activeTab === 'departments' && (
            <button
              onClick={() => {
                setDeptForm(prev => ({ ...prev, facultyId: faculties[0]?.id || '' }));
                setIsDeptModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Department
            </button>
          )}
          {activeTab === 'programs' && (
            <button
              onClick={() => {
                setProgForm(prev => ({ ...prev, departmentId: departments[0]?.id || '' }));
                setIsProgModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Degree Program
            </button>
          )}
          {activeTab === 'courses' && (
            <button
              onClick={() => {
                setCourseForm(prev => ({ ...prev, department: departments[0]?.name || '' }));
                setIsCourseModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Course Unit
            </button>
          )}
        </div>
      </div>

      {/* Real-Time Filter & Search Toolbar */}
      <div className="p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 w-full sm:w-auto justify-between sm:justify-end">
          <span>
            Showing{' '}
            <strong className="text-neutral-900 dark:text-neutral-100 font-mono">
              {activeTab === 'faculties' && filteredFaculties.length}
              {activeTab === 'departments' && filteredDepartments.length}
              {activeTab === 'programs' && filteredPrograms.length}
              {activeTab === 'courses' && filteredCourses.length}
            </strong>
            {' '}of{' '}
            <span className="font-mono">
              {activeTab === 'faculties' && faculties.length}
              {activeTab === 'departments' && departments.length}
              {activeTab === 'programs' && programs.length}
              {activeTab === 'courses' && courses.length}
            </span>
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 space-x-6 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('faculties')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'faculties'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Building2 className="w-4 h-4" /> Faculties ({faculties.length})
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'departments'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Layers className="w-4 h-4" /> Departments ({departments.length})
        </button>
        <button
          onClick={() => setActiveTab('programs')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'programs'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" /> Academic Programs ({programs.length})
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'courses'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Curriculum Courses ({courses.length})
        </button>
      </div>

      {/* Content for Faculties */}
      {activeTab === 'faculties' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredFaculties.map(fac => {
            const stats = facultyStats.get(fac.id) || { deptCount: 0, studentCount: 0 };
            return (
              <div 
                key={fac.id} 
                className="group p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs hover:border-indigo-500/30 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                      {fac.code}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingFaculty(fac)}
                        className="p-1 text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Edit Faculty"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => triggerDelete('faculty', fac.id, `${fac.name} (${fac.code})`)}
                        className="p-1 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Delete Faculty"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md ml-1">
                        Active
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{fac.name}</h3>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">{fac.description || 'Institutional academic division.'}</p>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs space-y-1.5 text-neutral-600 dark:text-neutral-400">
                  <p className="truncate"><span className="text-neutral-400 font-medium">Dean:</span> <strong>{fac.deanName}</strong></p>
                  <p className="truncate"><span className="text-neutral-400 font-medium">Email:</span> {fac.deanEmail}</p>
                  <div className="flex justify-between pt-2 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      <strong>{stats.deptCount}</strong> Departments
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-500" />
                      <strong>{stats.studentCount}</strong> Students
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredFaculties.length === 0 && (
            <div className="col-span-full py-12 text-center text-neutral-400 text-xs">
              No faculties matching your search.
            </div>
          )}
        </div>
      )}

      {/* Content for Departments */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDepartments.map(dept => {
            const stats = departmentStats.get(dept.id) || { progCount: 0, studentCount: 0 };
            return (
              <div 
                key={dept.id} 
                className="group p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs hover:border-indigo-500/30 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                      {dept.code}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-neutral-400 truncate max-w-[150px]">{dept.facultyName}</span>
                      <button
                        onClick={() => setEditingDepartment(dept)}
                        className="p-1 text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Edit Department"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => triggerDelete('department', dept.id, `${dept.name} (${dept.code})`)}
                        className="p-1 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Delete Department"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{dept.name}</h3>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">{dept.description}</p>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs space-y-1.5 text-neutral-600 dark:text-neutral-400">
                  <p className="truncate"><span className="text-neutral-400 font-medium">HOD:</span> <strong>{dept.headOfDepartment}</strong> ({dept.hodEmail})</p>
                  <div className="flex justify-between pt-1 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                      <strong>{stats.progCount}</strong> Degree Programs
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-500" />
                      <strong>{stats.studentCount}</strong> Active Students
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredDepartments.length === 0 && (
            <div className="col-span-full py-12 text-center text-neutral-400 text-xs">
              No departments matching your search.
            </div>
          )}
        </div>
      )}

      {/* Content for Programs */}
      {activeTab === 'programs' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredPrograms.map(prog => (
            <div 
              key={prog.id} 
              className="group p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs hover:border-indigo-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {prog.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-neutral-500">{prog.durationYears} Years</span>
                    <button
                      onClick={() => setEditingProgram(prog)}
                      className="p-1 text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="Edit Program"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => triggerDelete('program', prog.id, `${prog.name} (${prog.code})`)}
                      className="p-1 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="Delete Program"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{prog.name}</h3>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">{prog.degree}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{prog.departmentName}</p>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2">{prog.description}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/50 dark:border-neutral-700/50 grid grid-cols-3 text-center text-xs mt-4">
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase font-bold">Total</p>
                  <p className="font-bold text-neutral-900 dark:text-neutral-100">{prog.totalRequiredCredits} Cr</p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase font-bold">Core</p>
                  <p className="font-bold text-neutral-900 dark:text-neutral-100">{prog.coreCreditsRequired} Cr</p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase font-bold">Elective</p>
                  <p className="font-bold text-neutral-900 dark:text-neutral-100">{prog.electiveCreditsRequired} Cr</p>
                </div>
              </div>
            </div>
          ))}
          {filteredPrograms.length === 0 && (
            <div className="col-span-full py-12 text-center text-neutral-400 text-xs">
              No academic programs matching your search.
            </div>
          )}
        </div>
      )}

      {/* Content for Courses */}
      {activeTab === 'courses' && (
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 font-semibold border-b border-neutral-200/80 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Code & Title</th>
                  <th className="py-3 px-4">Department & Level</th>
                  <th className="py-3 px-4">Credits</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Prerequisites</th>
                  <th className="py-3 px-4">Instructor</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                {filteredCourses.map(course => (
                  <tr key={course.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{course.code}</span>
                        <span>{course.title}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">{course.description}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">Level {course.level} • {course.semester}</span>
                      <p className="text-[11px] text-neutral-400 truncate max-w-[180px]">{course.department}</p>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">{course.creditHours} Cr</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        course.type === 'core'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : course.type === 'elective'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}>
                        {course.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {course.prerequisites && course.prerequisites.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {course.prerequisites.map(pr => (
                            <span key={pr} className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-bold text-neutral-700 dark:text-neutral-300">
                              {pr}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-neutral-400 text-[11px]">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 font-medium">
                      {course.lecturerName || "To be assigned"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setEditingCourse(course)}
                          className="p-1.5 text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          title="Edit Course"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => triggerDelete('course', course.id, `${course.code}: ${course.title}`)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCourses.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-400 text-xs">
                      No curriculum courses matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODALS SECTION ================= */}

      {/* 1. Add Faculty Modal */}
      {isFacModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                Add Academic Faculty
              </h3>
              <button onClick={() => setIsFacModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateFaculty} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Faculty Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faculty of Allied Health Sciences"
                  value={facForm.name}
                  onChange={(e) => setFacForm({ ...facForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Faculty Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FAHS"
                  value={facForm.code}
                  onChange={(e) => setFacForm({ ...facForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 uppercase font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Dean's Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Prof. Kwaku Boateng"
                    value={facForm.deanName}
                    onChange={(e) => setFacForm({ ...facForm, deanName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Dean's Email</label>
                  <input
                    type="email"
                    required
                    placeholder="dean.fahs@premier.edu"
                    value={facForm.deanEmail}
                    onChange={(e) => setFacForm({ ...facForm, deanEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Overview Description</label>
                <textarea
                  rows={2}
                  value={facForm.description}
                  onChange={(e) => setFacForm({ ...facForm, description: e.target.value })}
                  placeholder="Brief summary of academic scope and research domains"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
                <button type="button" onClick={() => setIsFacModalOpen(false)} className="px-4 py-2 border rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs">Create Faculty</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Edit Faculty Modal */}
      {editingFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Academic Faculty
              </h3>
              <button onClick={() => setEditingFaculty(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdateFaculty} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Faculty Name</label>
                <input
                  type="text"
                  required
                  value={editingFaculty.name}
                  onChange={(e) => setEditingFaculty({ ...editingFaculty, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Faculty Code</label>
                <input
                  type="text"
                  required
                  value={editingFaculty.code}
                  onChange={(e) => setEditingFaculty({ ...editingFaculty, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 uppercase font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Dean's Name</label>
                  <input
                    type="text"
                    required
                    value={editingFaculty.deanName}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, deanName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Dean's Email</label>
                  <input
                    type="email"
                    required
                    value={editingFaculty.deanEmail}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, deanEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Overview Description</label>
                <textarea
                  rows={2}
                  value={editingFaculty.description || ''}
                  onChange={(e) => setEditingFaculty({ ...editingFaculty, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
                <button type="button" onClick={() => setEditingFaculty(null)} className="px-4 py-2 border rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add Department Modal */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Add Department
              </h3>
              <button onClick={() => setIsDeptModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateDepartment} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Parent Faculty</label>
                <select
                  value={deptForm.facultyId || faculties[0]?.id}
                  onChange={(e) => setDeptForm({ ...deptForm, facultyId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-medium"
                >
                  {faculties.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Department of Data Science & Analytics"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Department Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DDSA"
                  value={deptForm.code}
                  onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 uppercase font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">HOD Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Abigail Arthur"
                    value={deptForm.headOfDepartment}
                    onChange={(e) => setDeptForm({ ...deptForm, headOfDepartment: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">HOD Email</label>
                  <input
                    type="email"
                    required
                    placeholder="hod.dsa@premier.edu"
                    value={deptForm.hodEmail}
                    onChange={(e) => setDeptForm({ ...deptForm, hodEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                  placeholder="Department specializations, research focus, and labs"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
                <button type="button" onClick={() => setIsDeptModalOpen(false)} className="px-4 py-2 border rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs">Create Department</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Edit Department Modal */}
      {editingDepartment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Department
              </h3>
              <button onClick={() => setEditingDepartment(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdateDepartment} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Parent Faculty</label>
                <select
                  value={editingDepartment.facultyId}
                  onChange={(e) => setEditingDepartment({ ...editingDepartment, facultyId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-medium"
                >
                  {faculties.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  value={editingDepartment.name}
                  onChange={(e) => setEditingDepartment({ ...editingDepartment, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Department Code</label>
                <input
                  type="text"
                  required
                  value={editingDepartment.code}
                  onChange={(e) => setEditingDepartment({ ...editingDepartment, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 uppercase font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">HOD Name</label>
                  <input
                    type="text"
                    required
                    value={editingDepartment.headOfDepartment}
                    onChange={(e) => setEditingDepartment({ ...editingDepartment, headOfDepartment: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">HOD Email</label>
                  <input
                    type="email"
                    required
                    value={editingDepartment.hodEmail}
                    onChange={(e) => setEditingDepartment({ ...editingDepartment, hodEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingDepartment.description || ''}
                  onChange={(e) => setEditingDepartment({ ...editingDepartment, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
                <button type="button" onClick={() => setEditingDepartment(null)} className="px-4 py-2 border rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Add Degree Program Modal */}
      {isProgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Add Degree Program Curriculum
              </h3>
              <button onClick={() => setIsProgModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateProgram} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Parent Department</label>
                <select
                  value={progForm.departmentId || departments[0]?.id}
                  onChange={(e) => setProgForm({ ...progForm, departmentId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-medium"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="font-semibold block mb-1">Program Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BSc Artificial Intelligence & Robotics"
                    value={progForm.name}
                    onChange={(e) => setProgForm({ ...progForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Program Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BSC-AIR"
                    value={progForm.code}
                    onChange={(e) => setProgForm({ ...progForm, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 uppercase font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Degree Award Title</label>
                  <input
                    type="text"
                    required
                    value={progForm.degree}
                    onChange={(e) => setProgForm({ ...progForm, degree: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Duration (Years)</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    required
                    value={progForm.durationYears}
                    onChange={(e) => setProgForm({ ...progForm, durationYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Total Credits</label>
                  <input
                    type="number"
                    min={60}
                    max={200}
                    required
                    value={progForm.totalRequiredCredits}
                    onChange={(e) => setProgForm({ ...progForm, totalRequiredCredits: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Core Credits</label>
                  <input
                    type="number"
                    min={40}
                    max={180}
                    required
                    value={progForm.coreCreditsRequired}
                    onChange={(e) => setProgForm({ ...progForm, coreCreditsRequired: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Elective Credits</label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    required
                    value={progForm.electiveCreditsRequired}
                    onChange={(e) => setProgForm({ ...progForm, electiveCreditsRequired: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Program Overview</label>
                <textarea
                  rows={2}
                  value={progForm.description}
                  onChange={(e) => setProgForm({ ...progForm, description: e.target.value })}
                  placeholder="Curriculum outcomes, professional accreditation, career pathways"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
                <button type="button" onClick={() => setIsProgModalOpen(false)} className="px-4 py-2 border rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs">Add Program</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Edit Degree Program Modal */}
      {editingProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Academic Program
              </h3>
              <button onClick={() => setEditingProgram(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdateProgram} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Parent Department</label>
                <select
                  value={editingProgram.departmentId}
                  onChange={(e) => setEditingProgram({ ...editingProgram, departmentId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-medium"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="font-semibold block mb-1">Program Name</label>
                  <input
                    type="text"
                    required
                    value={editingProgram.name}
                    onChange={(e) => setEditingProgram({ ...editingProgram, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Program Code</label>
                  <input
                    type="text"
                    required
                    value={editingProgram.code}
                    onChange={(e) => setEditingProgram({ ...editingProgram, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 uppercase font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Degree Title</label>
                  <input
                    type="text"
                    required
                    value={editingProgram.degree}
                    onChange={(e) => setEditingProgram({ ...editingProgram, degree: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Duration (Years)</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    required
                    value={editingProgram.durationYears}
                    onChange={(e) => setEditingProgram({ ...editingProgram, durationYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Total Credits</label>
                  <input
                    type="number"
                    min={60}
                    max={200}
                    required
                    value={editingProgram.totalRequiredCredits}
                    onChange={(e) => setEditingProgram({ ...editingProgram, totalRequiredCredits: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Core Credits</label>
                  <input
                    type="number"
                    min={40}
                    max={180}
                    required
                    value={editingProgram.coreCreditsRequired}
                    onChange={(e) => setEditingProgram({ ...editingProgram, coreCreditsRequired: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Elective Credits</label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    required
                    value={editingProgram.electiveCreditsRequired}
                    onChange={(e) => setEditingProgram({ ...editingProgram, electiveCreditsRequired: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProgram.description || ''}
                  onChange={(e) => setEditingProgram({ ...editingProgram, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
                <button type="button" onClick={() => setEditingProgram(null)} className="px-4 py-2 border rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Add Course Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Add Course Unit
              </h3>
              <button onClick={() => setIsCourseModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IT401"
                    value={courseForm.code}
                    onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Credit Hours</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    required
                    value={courseForm.creditHours}
                    onChange={(e) => setCourseForm({ ...courseForm, creditHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence & Machine Learning"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Level</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value as AcademicLevel })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="100">Level 100</option>
                    <option value="200">Level 200</option>
                    <option value="300">Level 300</option>
                    <option value="400">Level 400</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Semester</label>
                  <select
                    value={courseForm.semester}
                    onChange={(e) => setCourseForm({ ...courseForm, semester: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="First Semester">First Semester</option>
                    <option value="Second Semester">Second Semester</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Type</label>
                  <select
                    value={courseForm.type}
                    onChange={(e) => setCourseForm({ ...courseForm, type: e.target.value as CourseType })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="core">Core</option>
                    <option value="elective">Elective</option>
                    <option value="required">Required</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Department Offering</label>
                <select
                  value={courseForm.department || departments[0]?.name}
                  onChange={(e) => setCourseForm({ ...courseForm, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Prerequisites (comma-separated codes)</label>
                <input
                  type="text"
                  placeholder="e.g. IT201, MATH101"
                  value={courseForm.prerequisites}
                  onChange={(e) => setCourseForm({ ...courseForm, prerequisites: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Description & Syllabus</label>
                <textarea
                  rows={2}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
                <button type="button" onClick={() => setIsCourseModalOpen(false)} className="px-4 py-2 border rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Curriculum Course
              </h3>
              <button onClick={() => setEditingCourse(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdateCourse} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.code}
                    onChange={(e) => setEditingCourse({ ...editingCourse, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Credit Hours</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    required
                    value={editingCourse.creditHours}
                    onChange={(e) => setEditingCourse({ ...editingCourse, creditHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Level</label>
                  <select
                    value={editingCourse.level}
                    onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value as AcademicLevel })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="100">Level 100</option>
                    <option value="200">Level 200</option>
                    <option value="300">Level 300</option>
                    <option value="400">Level 400</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Semester</label>
                  <select
                    value={editingCourse.semester}
                    onChange={(e) => setEditingCourse({ ...editingCourse, semester: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="First Semester">First Semester</option>
                    <option value="Second Semester">Second Semester</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Type</label>
                  <select
                    value={editingCourse.type}
                    onChange={(e) => setEditingCourse({ ...editingCourse, type: e.target.value as CourseType })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="core">Core</option>
                    <option value="elective">Elective</option>
                    <option value="required">Required</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Department</label>
                <select
                  value={editingCourse.department}
                  onChange={(e) => setEditingCourse({ ...editingCourse, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Prerequisites (comma-separated)</label>
                <input
                  type="text"
                  value={Array.isArray(editingCourse.prerequisites) ? editingCourse.prerequisites.join(', ') : ''}
                  onChange={(e) => setEditingCourse({
                    ...editingCourse,
                    prerequisites: e.target.value.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
                  })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCourse.description || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
                <button type="button" onClick={() => setEditingCourse(null)} className="px-4 py-2 border rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Confirm Deletion</h4>
                <p className="text-xs text-neutral-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300">
              Are you sure you want to delete <strong className="text-neutral-900 dark:text-neutral-100">{deletingItem.name}</strong>?
            </p>

            {deletingItem.warning && (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-700 dark:text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{deletingItem.warning}</span>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-3.5 py-1.5 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
