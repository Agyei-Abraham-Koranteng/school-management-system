import React, { useMemo, useState } from 'react';
import { Calendar, Clock, MapPin, User, FileText, Filter } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';

export const TimetableView: React.FC = () => {
  const { courses, activeStudent, registrations, staff } = useSchool();
  const { currentRole, user } = useAuth();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

  // Derive relevant courses for current user
  const relevantCourses = useMemo(() => {
    if (currentRole === 'lecturer') {
      const myCourses = courses.filter(c => 
        (user?.id && c.assignedLecturerId === user.id) ||
        (user?.department && c.department?.toLowerCase() === user.department.toLowerCase())
      );
      return myCourses.length > 0 ? myCourses : courses.slice(0, 4);
    }

    // Student role: get active approved or registered courses
    const studentReg = registrations.find(r => r.studentId === activeStudent.studentId);
    if (studentReg && studentReg.items && studentReg.items.length > 0) {
      return studentReg.items.map(it => {
        const found = courses.find(c => c.code === it.code);
        return found || {
          id: it.id,
          code: it.code,
          title: it.title,
          creditHours: it.creditHours,
          department: activeStudent.programName,
          level: activeStudent.currentLevel,
          semester: 'First Semester',
          type: 'core'
        };
      });
    }

    // Fallback: curriculum courses for activeStudent.currentLevel
    const levelCourses = courses.filter(c => c.level === activeStudent.currentLevel);
    return levelCourses.length > 0 ? levelCourses : courses.slice(0, 6);
  }, [currentRole, user, courses, registrations, activeStudent]);

  // Dynamically map relevant courses to weekly schedule slots
  const dynamicTimetable = useMemo(() => {
    const timeSlots = [
      { start: '08:00 AM', end: '10:00 AM' },
      { start: '10:30 AM', end: '12:30 PM' },
      { start: '02:00 PM', end: '04:00 PM' }
    ];

    const halls = [
      'Hall C, Computer Science Block',
      'Software Engineering Lab 3',
      'Central Science Auditorium',
      'Engineering Complex Room 102',
      'Innovation Center Lab B'
    ];

    const slots: Array<{
      id: string;
      day: typeof days[number];
      courseCode: string;
      courseTitle: string;
      time: string;
      room: string;
      lecturer: string;
    }> = [];

    relevantCourses.forEach((c: any, index: number) => {
      const dayIndex = index % days.length;
      const day = days[dayIndex];
      const slotIndex = Math.floor(index / days.length) % timeSlots.length;
      const slot = timeSlots[slotIndex];
      const room = halls[index % halls.length];
      const assignedStaff = staff.find(s => s.department === c.department);
      const lecturer = assignedStaff ? `Dr. ${assignedStaff.firstName} ${assignedStaff.lastName}` : 'Dr. Kwesi Mensah';

      slots.push({
        id: `slot-${c.code}-${day}`,
        day,
        courseCode: c.code,
        courseTitle: c.title,
        time: `${slot.start} - ${slot.end}`,
        room,
        lecturer
      });
    });

    return slots;
  }, [relevantCourses, staff, days]);

  return (
    <div id="timetable-view" className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            Curriculum Schedule
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 mt-2">
            Weekly Lecture Timetable & Venue Matrix
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            {currentRole === 'lecturer' 
              ? `Instructional timetable for ${user?.firstName ? `${user.firstName} ${user.lastName}` : 'Faculty Instructor'}`
              : `Personal lecture allocations for ${activeStudent.firstName} ${activeStudent.lastName} (Level ${activeStudent.currentLevel})`}
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-xs font-semibold text-neutral-600 dark:text-neutral-300 shadow-2xs">
          Active Modules: <strong className="text-indigo-600 dark:text-indigo-400">{relevantCourses.length} Courses Scheduled</strong>
        </div>
      </div>

      {/* Days Matrix */}
      <div className="space-y-6">
        {days.map((day) => {
          const slots = dynamicTimetable.filter(s => s.day === day);

          return (
            <div key={day} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
                <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>{day}</span>
                </h3>
                <span className="text-xs font-semibold text-neutral-500">
                  {slots.length} {slots.length === 1 ? 'Lecture' : 'Lectures'}
                </span>
              </div>

              {slots.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-400">
                  No scheduled lecture sessions on {day}.
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {slots.map((slot) => (
                    <div key={slot.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold flex flex-col items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/60">
                          <span className="text-xs font-extrabold">{slot.courseCode.substring(0, 2)}</span>
                          <span className="text-[10px]">{slot.courseCode.substring(2)}</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                              {slot.courseCode}
                            </span>
                            <span className="text-neutral-400">•</span>
                            <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                              {slot.courseTitle}
                            </h4>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                              {slot.room}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-neutral-400" />
                              {slot.lecturer}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>{slot.startTime} – {slot.endTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
