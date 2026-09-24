import React, { useState } from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  BookOpen, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Plus, 
  Search, 
  Filter,
  Award,
  Calendar
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { StaffMember, UserRole, AccountStatus } from '../../types';

export const StaffManagementView: React.FC = () => {
  const { staff, addStaff, faculties, departments, courses } = useSchool();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: departments[0]?.name || 'Department of Information Technology',
    faculty: faculties[0]?.name || 'Faculty of Computing & Information Systems',
    position: 'Lecturer',
    role: 'lecturer' as UserRole,
    status: 'active' as AccountStatus,
    qualification: 'MSc Computer Science',
    officeLocation: 'Computing Block C, Room 201',
    assignedCourses: [] as string[]
  });

  const filteredStaff = staff.filter(s => {
    const matchesSearch = 
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.staffId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFaculty = facultyFilter === 'all' || s.faculty === facultyFilter;
    return matchesSearch && matchesFaculty;
  });

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      showToast('Please provide required staff details.', 'error');
      return;
    }

    addStaff({
      userId: `usr-${Date.now()}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      faculty: formData.faculty,
      position: formData.position,
      role: formData.role,
      status: formData.status,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      assignedCourses: formData.assignedCourses,
      qualification: formData.qualification,
      officeLocation: formData.officeLocation
    });

    showToast(`Staff record registered for ${formData.firstName} ${formData.lastName}`, 'success');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Faculty & Staff Directory
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Manage institutional lecturers, academic coordinators, registrar officials, and department heads.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Faculty Member
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search staff by name, ID, or rank..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={facultyFilter}
            onChange={(e) => setFacultyFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="all">All Faculties</option>
            {faculties.map(f => (
              <option key={f.id} value={f.name}>{f.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map(member => (
          <div 
            key={member.id}
            className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatarUrl}
                    alt={member.firstName}
                    className="w-12 h-12 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                      {member.position}
                    </p>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {member.staffId}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  member.status === 'active' 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-neutral-100 text-neutral-600'
                }`}>
                  {member.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2 py-3 border-y border-neutral-100 dark:border-neutral-800/80 text-xs">
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                  <Building className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{member.department}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                  <Award className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{member.qualification}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{member.officeLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
              </div>

              {/* Teaching Assignments */}
              <div className="mt-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> Assigned Courses
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {member.assignedCourses.length > 0 ? (
                    member.assignedCourses.map(c => (
                      <span key={c} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                        {c}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-neutral-400 italic">No teaching courses assigned</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-neutral-500">{member.phone}</span>
              <button
                onClick={() => setSelectedStaff(member)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                View Profile →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                Register New Faculty Member
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kwesi"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mensah"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Institutional Email</label>
                  <input
                    type="email"
                    required
                    placeholder="k.mensah@premier.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+233 20 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Faculty</label>
                  <select
                    value={formData.faculty}
                    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  >
                    {faculties.map(f => (
                      <option key={f.id} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Rank / Position</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Lecturer"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Highest Qualification</label>
                  <input
                    type="text"
                    placeholder="e.g. PhD Computer Science"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Office Location</label>
                <input
                  type="text"
                  placeholder="e.g. Block B, Room 102"
                  value={formData.officeLocation}
                  onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  Save Faculty Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Details Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-3">
                <img src={selectedStaff.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    {selectedStaff.firstName} {selectedStaff.lastName}
                  </h4>
                  <p className="text-[11px] text-neutral-500">{selectedStaff.staffId}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStaff(null)} className="text-neutral-400 hover:text-neutral-600">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <p><span className="text-neutral-400 font-medium">Rank:</span> <strong className="text-neutral-800 dark:text-neutral-200">{selectedStaff.position}</strong></p>
              <p><span className="text-neutral-400 font-medium">Department:</span> <strong className="text-neutral-800 dark:text-neutral-200">{selectedStaff.department}</strong></p>
              <p><span className="text-neutral-400 font-medium">Faculty:</span> <strong className="text-neutral-800 dark:text-neutral-200">{selectedStaff.faculty}</strong></p>
              <p><span className="text-neutral-400 font-medium">Office:</span> <strong className="text-neutral-800 dark:text-neutral-200">{selectedStaff.officeLocation}</strong></p>
              <p><span className="text-neutral-400 font-medium">Email:</span> <strong className="text-neutral-800 dark:text-neutral-200">{selectedStaff.email}</strong></p>
              <p><span className="text-neutral-400 font-medium">Phone:</span> <strong className="text-neutral-800 dark:text-neutral-200">{selectedStaff.phone}</strong></p>
              <p><span className="text-neutral-400 font-medium">Qualifications:</span> <strong className="text-neutral-800 dark:text-neutral-200">{selectedStaff.qualification}</strong></p>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                onClick={() => setSelectedStaff(null)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl text-xs font-semibold text-neutral-800 dark:text-neutral-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
