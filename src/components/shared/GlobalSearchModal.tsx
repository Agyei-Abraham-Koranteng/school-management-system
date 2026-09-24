import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  User, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Bell, 
  Building, 
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, meta?: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { students, staff, courses, programs, announcements, documents, activeStudent } = useSchool();
  const { currentRole, student: authenticatedStudent } = useAuth();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isStaffOrAdmin = currentRole === 'admin_registrar' || currentRole === 'super_admin' || currentRole === 'lecturer';
  const isStudent = currentRole === 'student';

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Role-guarded student filtering: Students can only view their own profile; Staff/Admin can view all
  const filteredStudents = q ? students.filter(s => {
    if (isStudent) {
      // Privacy check: Student can only match their own profile
      const myId = authenticatedStudent?.id || activeStudent?.id;
      if (s.id !== myId) return false;
    }
    return (
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
      s.studentId.toLowerCase().includes(q) ||
      s.programName.toLowerCase().includes(q)
    );
  }).slice(0, isStudent ? 1 : 4) : [];

  // Privacy check: Staff search only visible to staff & admin users
  const filteredStaff = (q && isStaffOrAdmin) ? staff.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
    s.staffId.toLowerCase().includes(q) ||
    s.department.toLowerCase().includes(q) ||
    s.position.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const filteredCourses = q ? courses.filter(c =>
    c.code.toLowerCase().includes(q) ||
    c.title.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  const filteredPrograms = q ? programs.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.code.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const filteredAnnouncements = q ? announcements.filter(a => {
    // Audience check
    if (isStudent && a.targetAudience === 'finance') return false;
    return a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q);
  }).slice(0, 3) : [];

  const totalResults = filteredStudents.length + filteredStaff.length + filteredCourses.length + filteredPrograms.length + filteredAnnouncements.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-100 dark:border-neutral-800 gap-3">
          <Search className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, staff, courses, programs, announcements... (Press ESC to exit)"
            className="flex-1 bg-transparent border-none text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {!q ? (
            <div className="py-12 text-center text-neutral-400 dark:text-neutral-500">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-40 text-indigo-500" />
              <p className="text-xs font-semibold">Quick Unified Search</p>
              <p className="text-[11px] mt-1 text-neutral-400">Type a student ID (e.g. PU/IT/2024), course code (e.g. IT301), staff name, or program</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-10 text-center text-neutral-500 text-xs">
              No matching records found for "{query}".
            </div>
          ) : (
            <>
              {/* Students */}
              {filteredStudents.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3 h-3 text-indigo-500" /> Students ({filteredStudents.length})
                  </h4>
                  <div className="space-y-1">
                    {filteredStudents.map(student => (
                      <button
                        key={student.id}
                        onClick={() => {
                          onNavigate(isStudent ? 'student-profile' : 'admin-students', { studentId: student.id });
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors text-left group"
                      >
                        <div>
                          <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            {student.studentId} • {student.programName} • Level {student.currentLevel}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                            CGPA {student.currentCgpa.toFixed(2)}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Staff */}
              {filteredStaff.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 mb-1.5 flex items-center gap-1.5">
                    <GraduationCap className="w-3 h-3 text-amber-500" /> Faculty & Staff ({filteredStaff.length})
                  </h4>
                  <div className="space-y-1">
                    {filteredStaff.map(stf => (
                      <button
                        key={stf.id}
                        onClick={() => {
                          onNavigate('admin-staff');
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors text-left group"
                      >
                        <div>
                          <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                            {stf.firstName} {stf.lastName}
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            {stf.position} • {stf.department}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Courses */}
              {filteredCourses.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-emerald-500" /> Courses & Curriculum ({filteredCourses.length})
                  </h4>
                  <div className="space-y-1">
                    {filteredCourses.map(course => (
                      <button
                        key={course.id}
                        onClick={() => {
                          onNavigate(isStudent ? 'registration' : 'admin-academic-structure');
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors text-left group"
                      >
                        <div>
                          <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                            <span className="text-indigo-600 dark:text-indigo-400 font-mono mr-1.5">{course.code}</span>
                            {course.title}
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            {course.creditHours} Credits • Level {course.level} • {course.type.toUpperCase()}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Announcements */}
              {filteredAnnouncements.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 mb-1.5 flex items-center gap-1.5">
                    <Bell className="w-3 h-3 text-rose-500" /> Announcements ({filteredAnnouncements.length})
                  </h4>
                  <div className="space-y-1">
                    {filteredAnnouncements.map(ann => (
                      <button
                        key={ann.id}
                        onClick={() => {
                          onNavigate('notifications');
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors text-left group"
                      >
                        <div>
                          <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                            {ann.title}
                          </p>
                          <p className="text-[11px] text-neutral-500 line-clamp-1">
                            {ann.content}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
          <span>Search university directories & curricula</span>
          <span className="text-[10px]">Tip: Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-700 rounded border border-neutral-200 dark:border-neutral-600 font-mono">/</kbd> anywhere to search</span>
        </div>
      </div>
    </div>
  );
};
