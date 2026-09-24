import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronRight, 
  GraduationCap, 
  Mail, 
  Phone, 
  Calendar,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { StudentRecord } from '../../types';

export const StudentsDirectory: React.FC = () => {
  const { students } = useSchool();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  const filtered = students.filter(std => {
    const matchesSearch = 
      std.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = selectedLevel === 'all' || std.currentLevel === selectedLevel;

    return matchesSearch && matchesLevel;
  });

  const handleExportCSV = () => {
    let csv = "Student ID,First Name,Last Name,Email,Phone,Program,Faculty,Level,CGPA,Standing,Enrolled Date\n";
    filtered.forEach(s => {
      csv += `"${s.studentId}","${s.firstName}","${s.lastName}","${s.email}","${s.phone}","${s.programName}","${s.faculty}","${s.currentLevel}","${s.currentCgpa}","${s.academicStanding}","${s.enrollmentDate}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Student_Directory_Roster_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div id="students-directory-page" className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            Admissions & Student Registry
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 mt-2">
            Institutional Student Directory
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Active matriculated student records ({students.length} Total Enrolled), program enrollments, and academic standings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Roster (CSV)</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            id="student-search-input"
            type="text"
            placeholder="Search by student ID, name, email or program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full sm:w-auto text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
          >
            <option value="all">All Levels</option>
            <option value="100">Level 100</option>
            <option value="200">Level 200</option>
            <option value="300">Level 300</option>
            <option value="400">Level 400</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/40 text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3 px-5">Student</th>
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4 text-center">Level</th>
                <th className="py-3 px-4 text-center">CGPA</th>
                <th className="py-3 px-4 text-center">Credits Earned</th>
                <th className="py-3 px-4">Academic Standing</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-medium text-neutral-800 dark:text-neutral-200">
              {filtered.map((std) => (
                <tr key={std.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-neutral-900 dark:text-neutral-100">
                      {std.firstName} {std.lastName}
                    </div>
                    <div className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                      {std.studentId} · {std.email}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold">
                    {std.programName}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold">
                    L{std.currentLevel}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold font-mono">
                    <span className={std.currentCgpa >= 3.5 ? 'text-emerald-600' : std.currentCgpa < 1.5 ? 'text-rose-600' : 'text-neutral-900 dark:text-neutral-100'}>
                      {std.currentCgpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {std.creditsEarned} / {std.requiredCredits}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      std.academicStanding.includes('Dean')
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                        : std.academicStanding.includes('Good')
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : std.academicStanding.includes('Eligible')
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}>
                      {std.academicStanding}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedStudent(std)}
                      className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    >
                      Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Dossier Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Student Record File
                </span>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="text-neutral-400 hover:text-neutral-600 text-xs font-bold p-1"
              >
                Close ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/50 dark:border-neutral-700/50">
                <span className="text-neutral-400 block text-[11px]">Student ID</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{selectedStudent.studentId}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/50 dark:border-neutral-700/50">
                <span className="text-neutral-400 block text-[11px]">Cumulative CGPA</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{selectedStudent.currentCgpa.toFixed(2)} / 4.00</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/50 dark:border-neutral-700/50">
                <span className="text-neutral-400 block text-[11px]">Current Level</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">Level {selectedStudent.currentLevel}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/50 dark:border-neutral-700/50">
                <span className="text-neutral-400 block text-[11px]">Credits Completed</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">{selectedStudent.creditsEarned} / {selectedStudent.requiredCredits}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <p>Program: <strong className="text-neutral-900 dark:text-neutral-100">{selectedStudent.programName}</strong></p>
              <p>Faculty: <strong className="text-neutral-900 dark:text-neutral-100">{selectedStudent.faculty}</strong></p>
              <p>Admission Date: <strong className="text-neutral-900 dark:text-neutral-100">{selectedStudent.admissionDate}</strong></p>
              <p>Standing: <strong className="text-emerald-600 dark:text-emerald-400">{selectedStudent.academicStanding}</strong></p>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
