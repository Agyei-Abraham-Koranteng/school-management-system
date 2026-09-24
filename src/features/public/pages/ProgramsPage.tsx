import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Laptop,
  FlaskConical,
  Building2,
  HeartHandshake,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Search,
  GraduationCap,
  Clock,
  Users,
  Award,
  CalendarDays,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { usePublicContent, ProgramItem } from '../../../context/PublicContentContext';

const FACULTY_META: Record<string, { icon: any; color: string; dean: string; students: string; overview: string }> = {
  'Faculty of Computing & Information Technology': {
    icon: Laptop,
    color: 'indigo',
    dean: 'Prof. Ama Asante-Darko, PhD (MIT)',
    students: '4,200+',
    overview: 'A world-class computing faculty with strong ties to Silicon Valley tech giants and Africa’s fast-growing startup ecosystem.',
  },
  'Faculty of Pure & Applied Sciences': {
    icon: FlaskConical,
    color: 'violet',
    dean: 'Prof. Kwabena Opoku-Sarfo, PhD (Cambridge)',
    students: '3,800+',
    overview: 'Cutting-edge laboratory facilities and active research partnerships with leading international science institutions.',
  },
  'Premier Business School': {
    icon: Building2,
    color: 'blue',
    dean: 'Prof. Efua Mensah-Bonsu, DBA (Harvard)',
    students: '6,100+',
    overview: 'AACSB-accredited and ranked among Africa’s top business schools, producing transformative leaders for the global economy.',
  },
  'College of Health Sciences': {
    icon: HeartHandshake,
    color: 'emerald',
    dean: 'Prof. Nana Yaw Asante, FWACS (UCL)',
    students: '3,200+',
    overview: 'Our 500-bed teaching hospital provides unmatched clinical training. Graduates are sought after globally.',
  },
  'Faculty of Engineering': {
    icon: Lightbulb,
    color: 'amber',
    dean: 'Prof. Kofi Boadi-Asante, CEng (Imperial College)',
    students: '5,000+',
    overview: 'Engineering programmes accredited by GhIE. Graduates lead energy, civil infrastructure, and robotics innovation.',
  },
  'Faculty of Humanities & Social Sciences': {
    icon: BookOpen,
    color: 'rose',
    dean: 'Prof. Akosua Baffoe-Bonnie, DPhil (Oxford)',
    students: '4,500+',
    overview: 'Providing a rich intellectual formation in the liberal arts, public policy, diplomacy, and cultural studies.',
  },
};

const colorMap: Record<string, { accent: string; bg: string; border: string; badge: string; iconBg: string }> = {
  indigo:  { accent: 'text-indigo-600 dark:text-indigo-400',  bg: 'bg-indigo-50 dark:bg-indigo-950/30',  border: 'border-indigo-200 dark:border-indigo-800/50',  badge: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300', iconBg: 'bg-indigo-100 dark:bg-indigo-900/50' },
  violet:  { accent: 'text-violet-600 dark:text-violet-400',  bg: 'bg-violet-50 dark:bg-violet-950/30',  border: 'border-violet-200 dark:border-violet-800/50',  badge: 'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300', iconBg: 'bg-violet-100 dark:bg-violet-900/50' },
  blue:    { accent: 'text-blue-600 dark:text-blue-400',      bg: 'bg-blue-50 dark:bg-blue-950/30',      border: 'border-blue-200 dark:border-blue-800/50',      badge: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300',       iconBg: 'bg-blue-100 dark:bg-blue-900/50' },
  emerald: { accent: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800/50', badge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300', iconBg: 'bg-emerald-100 dark:bg-emerald-900/50' },
  amber:   { accent: 'text-amber-600 dark:text-amber-400',    bg: 'bg-amber-50 dark:bg-amber-950/30',    border: 'border-amber-200 dark:border-amber-800/50',    badge: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300',   iconBg: 'bg-amber-100 dark:bg-amber-900/50' },
  rose:    { accent: 'text-rose-600 dark:text-rose-400',      bg: 'bg-rose-50 dark:bg-rose-950/30',      border: 'border-rose-200 dark:border-rose-800/50',      badge: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300',       iconBg: 'bg-rose-100 dark:bg-rose-900/50' },
};

const LEVELS = ['All', 'Undergraduate', 'Postgraduate', 'Doctoral', 'Short Courses', 'Academic Calendar'];

export const ProgramsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { programs, academicCalendar } = usePublicContent();

  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [expandedFaculty, setExpandedFaculty] = useState<string | null>(null);

  // Sync with query params or hash
  useEffect(() => {
    const levelParam = searchParams.get('level');
    if (levelParam) {
      const match = LEVELS.find(l => l.toLowerCase().replace(/\s+/g, '-') === levelParam.toLowerCase().replace(/\s+/g, '-'));
      if (match) setLevelFilter(match);
    }
    if (location.hash === '#calendar') {
      setLevelFilter('Academic Calendar');
      const el = document.getElementById('calendar-section');
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [searchParams, location]);

  // Group programs by faculty
  const facultyNames = Array.from(new Set(programs.map(p => p.faculty)));

  const facultiesWithPrograms = facultyNames.map(faculty => {
    const meta = FACULTY_META[faculty] || {
      icon: BookOpen,
      color: 'indigo',
      dean: 'Academic Directorate',
      students: '3,000+',
      overview: 'Dedicated academic faculty promoting rigor and scholarship.',
    };

    const matchingPrograms = programs.filter(p => {
      if (p.faculty !== faculty) return false;
      const matchesSearch = search === '' || p.name.toLowerCase().includes(search.toLowerCase()) || faculty.toLowerCase().includes(search.toLowerCase());
      const matchesLevel = levelFilter === 'All' || p.level.toLowerCase().replace(/\s+/g, '-') === levelFilter.toLowerCase().replace(/\s+/g, '-');
      return matchesSearch && matchesLevel;
    });

    return {
      faculty,
      ...meta,
      programs: matchingPrograms,
    };
  }).filter(f => f.programs.length > 0);

  return (
    <>
      {/* Page Header */}
      <div className="pt-24 pb-16 bg-gradient-to-br from-neutral-950 via-indigo-950/30 to-neutral-950 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4">Academic Excellence Directorate</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Degrees & <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">Curriculum</span>
          </h1>
          <p className="text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Explore world-class accredited programmes — from undergraduate bachelors to doctoral research and executive certifications.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
            {[
              { icon: GraduationCap, label: `${programs.length}+ Programs`, sub: 'Real-time updated' },
              { icon: Users, label: '26,000+ Students', sub: 'Across 6 faculties' },
              { icon: Award, label: 'GTEC Accredited', sub: 'Highest academic standard' },
              { icon: Clock, label: '1–6 Years', sub: 'Flexible durations' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-indigo-300" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-white text-sm">{label}</p>
                  <p className="text-xs text-neutral-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search programs, degrees or faculties..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 placeholder:text-neutral-400"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {LEVELS.map(level => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  levelFilter === level
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── ACADEMIC CALENDAR VIEW (When chosen or hash #calendar) ── */}
      {levelFilter === 'Academic Calendar' ? (
        <section id="calendar-section" className="py-16 bg-white dark:bg-neutral-950 scroll-mt-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
                  Official Academic Calendar
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Approved session schedule, exam periods, and graduation congregation
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4 divide-y divide-neutral-200 dark:divide-neutral-800">
              {academicCalendar.map((item, idx) => (
                <div key={item.id} className={idx === 0 ? 'space-y-1' : 'pt-4 space-y-1'}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 mb-1">
                        {item.type}
                      </span>
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white">{item.title}</h3>
                      <p className="text-xs text-neutral-500">{item.description}</p>
                    </div>
                    <span className="self-start sm:self-center px-3 py-1 rounded-xl text-xs font-bold bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-300 border border-neutral-200 dark:border-neutral-700 shrink-0">
                      {item.dateRange}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        /* ── FACULTIES AND PROGRAMS ACCORDION ── */
        <section className="py-16 bg-white dark:bg-neutral-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {facultiesWithPrograms.length === 0 ? (
              <div className="text-center py-20 text-neutral-500 dark:text-neutral-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-bold text-lg">No programs found for "{levelFilter}"</p>
                <p className="text-sm mt-1">Try selecting "All" or a different category.</p>
                <button
                  onClick={() => { setLevelFilter('All'); setSearch(''); }}
                  className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              facultiesWithPrograms.map(({ icon: Icon, color, faculty, dean, students, overview, programs: facultyProgs }) => {
                const c = colorMap[color] || colorMap.indigo;
                const isExpanded = expandedFaculty === faculty || facultyProgs.length <= 4;
                return (
                  <div
                    key={faculty}
                    className={`rounded-3xl border ${c.border} ${c.bg} overflow-hidden transition-all`}
                  >
                    {/* Faculty Header */}
                    <div
                      className="p-6 lg:p-8 cursor-pointer"
                      onClick={() => setExpandedFaculty(expandedFaculty === faculty ? null : faculty)}
                    >
                      <div className="flex items-start gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${c.iconBg}`}>
                          <Icon className={`w-6 h-6 ${c.accent}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div>
                              <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white leading-snug">{faculty}</h2>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Dean: {dean}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.badge}`}>
                                {facultyProgs.length} programme{facultyProgs.length !== 1 ? 's' : ''}
                              </span>
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">{students} students</span>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform ${isExpanded ? 'rotate-180' : ''} ${c.iconBg}`}>
                                <svg className={`w-3 h-3 ${c.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3 leading-relaxed">{overview}</p>
                        </div>
                      </div>
                    </div>

                    {/* Programs List */}
                    {isExpanded && (
                      <div className="border-t border-neutral-200/60 dark:border-neutral-800/60 px-6 lg:px-8 py-6">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {facultyProgs.map((prog) => (
                            <div
                              key={prog.id}
                              className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all flex flex-col justify-between"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${c.badge}`}>
                                    {prog.level}
                                  </span>
                                  <span className="text-[11px] text-neutral-400">{prog.years} Years · {prog.credits} Cr</span>
                                </div>
                                <h3 className="text-sm font-bold text-neutral-900 dark:text-white leading-snug">{prog.name}</h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">{prog.description}</p>
                              </div>

                              <div className="pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                                <button
                                  onClick={() => {
                                    navigate('/apply');
                                    window.scrollTo({ top: 0 });
                                  }}
                                  className={`inline-flex items-center gap-1 text-xs font-bold ${c.accent} hover:underline`}
                                >
                                  Apply for program <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-5">
          <h2 className="text-3xl font-extrabold">Ready to begin your academic journey?</h2>
          <p className="text-indigo-200">Our faculty counselors and admissions desk are ready to assist with your enrollment.</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => { navigate('/apply'); window.scrollTo({ top: 0 }); }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-indigo-700 font-extrabold shadow-xl hover:scale-[1.02] transition-all"
            >
              Apply for Admission <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => { navigate('/contact'); window.scrollTo({ top: 0 }); }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-white/30 hover:bg-white/10 text-white font-bold transition-all"
            >
              Request Syllabus
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProgramsPage;
