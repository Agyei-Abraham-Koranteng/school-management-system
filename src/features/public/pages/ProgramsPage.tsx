import React, { useState, useEffect, useRef } from 'react';
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
  AlertCircle,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookMarked,
  Layers,
  Compass,
  FileText,
  X,
  Stethoscope,
  Cpu,
  Scale,
  Landmark,
  ShieldCheck,
  Download,
  Globe
} from 'lucide-react';
import { usePublicContent, ProgramItem } from '../../../context/PublicContentContext';

// ─── Academics Hero Slideshow Data ──────────────────────────────────────────
interface AcademicSlide {
  id: string;
  tag: string;
  faculty: string;
  headline: string;
  subhead: string;
  image: string;
  stat: string;
  accreditation: string;
  color: string;
  highlights: string[];
}

const ACADEMIC_SLIDES: AcademicSlide[] = [
  {
    id: 'health-sciences',
    tag: 'ADVANCED CLINICAL MEDICINE',
    faculty: 'College of Health Sciences',
    headline: 'Medicine, Genomics & Global Health',
    subhead: 'Rigorous clinical formations anchored by our 500-bed university teaching hospital, precision cellular genetics labs, and compassionate patient care.',
    image: '/images/hero-research.jpg',
    stat: '99.4% Clinical Licensure Rate · 32 Teaching Clinics',
    accreditation: 'Medical & Dental Council Accredited',
    color: '#00629B',
    highlights: ['Phase II Cellular Immunotherapy Trials', '500-Bed Tertiary Teaching Hospital', 'Joint Fellowships with Global Health Centers']
  },
  {
    id: 'computing-ai',
    tag: 'ALGORITHMIC FRONTIERS',
    faculty: 'Faculty of Computing & Information Technology',
    headline: 'Artificial Intelligence & Cybernetic Systems',
    subhead: 'From foundational deep learning theory to silicon architecture and distributed systems, educating pioneers who drive Africa’s tech renaissance and global enterprise.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&auto=format&fit=crop&q=85',
    stat: 'Silicon Valley Pipeline · 4,200+ Computing Scholars',
    accreditation: 'Global Tech & BCS Aligned Standards',
    color: '#4F46E5',
    highlights: ['NVIDIA High-Performance GPU Cluster', 'AI Telemetry for Sustainable Agriculture', 'Incubator with $12M+ Seed Capital Raised']
  },
  {
    id: 'engineering-mechatronics',
    tag: 'INFRASTRUCTURE & MECHATRONICS',
    faculty: 'Faculty of Engineering',
    headline: 'Engineering the Resilient Future',
    subhead: 'Pioneering renewable energy microgrids, structural robotics, autonomous drones, and climate-adaptive materials across 200+ research laboratory benches.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1920&auto=format&fit=crop&q=85',
    stat: '200+ Research Laboratory Benches · GhIE Accredited',
    accreditation: 'GhIE & Washington Accord Standards',
    color: '#D97706',
    highlights: ['Autonomous Aquatic Drone Project', 'Clean Energy Microgrid Powering Legon Hill', 'Materials Science & Nano-Fabrication Facility']
  },
  {
    id: 'business-leadership',
    tag: 'ENTERPRISE & MARKETS',
    faculty: 'Premier Business School',
    headline: 'Transformative Leadership & Global Enterprise',
    subhead: 'Ranked among Africa’s top executive academies. Cultivating visionary founders, financial economists, and strategic leaders who steer multinational markets.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&auto=format&fit=crop&q=85',
    stat: 'AACSB Accredited · $45M Student Venture Fund',
    accreditation: 'AACSB International Accreditation',
    color: '#C5A059',
    highlights: ['Live Bloomberg Trading Room Terminal', 'Executive MBA with London & Singapore Residencies', '96% Graduate Placement Within 90 Days']
  },
  {
    id: 'law-justice',
    tag: 'RULE OF LAW & DIPLOMACY',
    faculty: 'Faculty of Law & Jurisprudence',
    headline: 'Constitutional Governance & Human Rights',
    subhead: 'Educating jurists of exceptional intellect who defend human rights, negotiate international treaties, and advance ethical jurisprudence in courts worldwide.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&auto=format&fit=crop&q=85',
    stat: '98% Bar Admittance · International Moot Champions',
    accreditation: 'General Legal Council Accredited',
    color: '#A51C30',
    highlights: ['All-Africa Moot Court Championship Laureates', 'Legal Aid Clinic Serving 4,000+ Citizens Annually', 'Constitutional Law Think Tank']
  }
];

// ─── Faculty Metadata ───────────────────────────────────────────────────────
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
    color: 'amber',
    dean: 'Prof. Efua Mensah-Bonsu, DBA (Columbia)',
    students: '6,100+',
    overview: 'AACSB-accredited and ranked among Africa’s top business schools, producing transformative leaders for the global economy.',
  },
  'College of Health Sciences': {
    icon: Stethoscope,
    color: 'emerald',
    dean: 'Prof. Nana Yaw Asante, FWACS (UCL)',
    students: '3,200+',
    overview: 'Our 500-bed teaching hospital provides unmatched clinical training. Graduates are sought after globally.',
  },
  'Faculty of Engineering': {
    icon: Lightbulb,
    color: 'blue',
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
  indigo:  { accent: 'text-indigo-400',  bg: 'bg-neutral-900/60',  border: 'border-neutral-800 hover:border-indigo-500/50',  badge: 'bg-indigo-950 text-indigo-300 border border-indigo-800/40', iconBg: 'bg-indigo-950/80 text-indigo-400' },
  violet:  { accent: 'text-violet-400',  bg: 'bg-neutral-900/60',  border: 'border-neutral-800 hover:border-violet-500/50',  badge: 'bg-violet-950 text-violet-300 border border-violet-800/40', iconBg: 'bg-violet-950/80 text-violet-400' },
  blue:    { accent: 'text-blue-400',    bg: 'bg-neutral-900/60',  border: 'border-neutral-800 hover:border-blue-500/50',    badge: 'bg-blue-950 text-blue-300 border border-blue-800/40',       iconBg: 'bg-blue-950/80 text-blue-400' },
  emerald: { accent: 'text-emerald-400', bg: 'bg-neutral-900/60', border: 'border-neutral-800 hover:border-emerald-500/50', badge: 'bg-emerald-950 text-emerald-300 border border-emerald-800/40', iconBg: 'bg-emerald-950/80 text-emerald-400' },
  amber:   { accent: 'text-amber-400',   bg: 'bg-neutral-900/60',   border: 'border-neutral-800 hover:border-amber-500/50',   badge: 'bg-amber-950 text-amber-300 border border-amber-800/40',   iconBg: 'bg-amber-950/80 text-amber-400' },
  rose:    { accent: 'text-rose-400',    bg: 'bg-neutral-900/60',    border: 'border-neutral-800 hover:border-rose-500/50',    badge: 'bg-rose-950 text-rose-300 border border-rose-800/40',       iconBg: 'bg-rose-950/80 text-rose-400' },
};

const LEVELS = ['All', 'Undergraduate', 'Postgraduate', 'Doctoral', 'Short Courses', 'Academic Calendar'];

export const ProgramsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { programs, academicCalendar } = usePublicContent();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [expandedFaculty, setExpandedFaculty] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(null);

  const activeSlide = ACADEMIC_SLIDES[currentSlideIndex];

  // Auto-advance slideshow every 7 seconds
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % ACADEMIC_SLIDES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPlaying]);

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
      overview: 'Dedicated academic faculty promoting rigor and academic excellence.',
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
    <div className="bg-neutral-950 text-neutral-100 min-h-screen selection:bg-[#A51C30] selection:text-white">

      {/* ── 1. CINEMATIC ACADEMICS SLIDESHOW HERO ── */}
      <section className="relative min-h-[90vh] sm:min-h-[94vh] flex items-end justify-center overflow-hidden bg-neutral-950">
        
        {/* Full-bleed Slideshow Backgrounds with Smooth Crossfade */}
        {ACADEMIC_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlideIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.headline}
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-neutral-950/70" />
            <div className="absolute inset-0 bg-neutral-950/25 backdrop-blur-[0.5px]" />
          </div>
        ))}

        {/* Hero Slideshow Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 xs:pt-28 sm:pt-36 pb-8 sm:pb-16 lg:pb-20">
          <div className="max-w-4xl space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-700">

            {/* Pill & Faculty Origin */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/50 border border-white/20 text-[11px] sm:text-xs md:text-sm font-semibold tracking-wider text-rose-300 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>{activeSlide.tag}</span>
              </span>
              <span className="text-[11px] sm:text-xs md:text-sm text-neutral-300 font-medium">
                {activeSlide.faculty}
              </span>
            </div>

            {/* Display Serif Headline */}
            <h1
              className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal text-white tracking-tight leading-[1.12] sm:leading-[1.06] drop-shadow-2xl"
              style={{ fontFamily: "'Playfair Display', 'Newsreader', 'Libre Baskerville', Georgia, serif" }}
            >
              {activeSlide.headline}
            </h1>

            {/* Lead Subtitle */}
            <p
              className="text-xs xs:text-sm sm:text-base md:text-xl lg:text-2xl text-neutral-100/95 max-w-3xl leading-relaxed font-light drop-shadow-md"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {activeSlide.subhead}
            </p>

            {/* Slide Highlights Badges - Horizontal scrolling on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 sm:flex-wrap">
              {activeSlide.highlights.map((h, i) => (
                <div
                  key={i}
                  className="shrink-0 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium bg-white/10 border border-white/15 text-neutral-200 backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            {/* Call to Action Buttons - Balanced 2-column grid on mobile */}
            <div className="w-full max-w-xl pt-2 space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center sm:gap-3.5">
                <a
                  href="#curriculum"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs sm:text-sm tracking-wide shadow-xl active:scale-[0.98] transition-all text-center"
                >
                  <span>Browse Programs</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    navigate('/apply');
                    window.scrollTo({ top: 0 });
                  }}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-[#A51C30] hover:bg-[#8f1829] text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg active:scale-[0.98] transition-all text-center"
                >
                  <span>Apply Now</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>

              <div className="flex items-center justify-start">
                <button
                  type="button"
                  onClick={() => {
                    setLevelFilter('Academic Calendar');
                    document.getElementById('calendar-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <CalendarDays className="w-3.5 h-3.5 text-rose-300" />
                  <span>Academic Calendar</span>
                  <ArrowRight className="w-3 h-3 text-neutral-400" />
                </button>
              </div>
            </div>

            {/* Slideshow Selector & Controls */}
            <div className="pt-5 sm:pt-8 flex flex-row items-center justify-between gap-2 border-t border-white/15 w-full">
              
              {/* Slide indicators / tabs */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
                {ACADEMIC_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      idx === currentSlideIndex
                        ? 'bg-[#A51C30] text-white font-bold shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-neutral-300 border border-white/10'
                    }`}
                  >
                    <span>{idx + 1}. {slide.faculty.split(' ')[0]} {slide.faculty.split(' ')[1] || ''}</span>
                  </button>
                ))}
              </div>

              {/* Play/Pause and Next/Prev */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSlideIndex((prev) => (prev === 0 ? ACADEMIC_SLIDES.length - 1 : prev - 1))}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % ACADEMIC_SLIDES.length)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── 2. ACADEMICS VITAL STATISTICS BAR ── */}
      <section className="py-12 bg-[#0d0d10] border-y border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-800">
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-white">
                {programs.length}+
              </p>
              <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
                Accredited Degree Programs
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-white">
                1,400+
              </p>
              <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
                Faculty & Doctoral Researchers
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-white">
                6
              </p>
              <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
                Specialized Academic Faculties
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-rose-400">
                96%
              </p>
              <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
                Graduate Career Placement Rate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. SEARCH & DEGREE LEVEL FILTER BAR ── */}
      <div id="curriculum" className="sticky top-16 sm:top-20 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 py-4 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search programs, degrees or faculties..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900/90 text-sm text-neutral-100 focus:outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 placeholder:text-neutral-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {LEVELS.map(level => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  levelFilter === level
                    ? 'bg-[#A51C30] text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ── 4. ACADEMIC CALENDAR VIEW (When selected) ── */}
      {levelFilter === 'Academic Calendar' ? (
        <section id="calendar-section" className="py-20 bg-neutral-950 scroll-mt-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-900/50 text-rose-400 flex items-center justify-center">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <h2
                  className="text-3xl font-normal text-white"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Official Academic Calendar
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Approved semester schedules, registration deadlines, exam periods, and graduation congregation
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 divide-y divide-neutral-800 space-y-4">
              {academicCalendar.map((item, idx) => (
                <div key={item.id} className={idx === 0 ? 'space-y-1' : 'pt-4 space-y-1'}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-rose-300 mb-1">
                        {item.type}
                      </span>
                      <h3 className="text-base font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-neutral-400">{item.description}</p>
                    </div>
                    <span className="self-start sm:self-center px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-neutral-800 text-neutral-200 border border-neutral-700 shrink-0">
                      {item.dateRange}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        /* ── 5. FACULTIES & ACCREDITED DEGREE PROGRAMS ── */
        <section className="py-20 bg-neutral-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {facultiesWithPrograms.length === 0 ? (
              <div className="text-center py-20 text-neutral-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-bold text-lg text-white">No programs found for "{levelFilter}"</p>
                <p className="text-sm mt-1">Try searching another keyword or reset the filter.</p>
                <button
                  onClick={() => { setLevelFilter('All'); setSearch(''); }}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-[#A51C30] hover:bg-[#8f1829] text-white font-bold text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              facultiesWithPrograms.map(({ icon: Icon, color, faculty, dean, students, overview, programs: facultyProgs }) => {
                const c = colorMap[color] || colorMap.indigo;
                const isExpanded = expandedFaculty === faculty || facultyProgs.length <= 6;
                return (
                  <div
                    key={faculty}
                    className={`rounded-3xl border ${c.border} ${c.bg} overflow-hidden transition-all shadow-xl`}
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
                              <h2
                                className="text-2xl font-normal text-white leading-snug"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                              >
                                {faculty}
                              </h2>
                              <p className="text-xs text-neutral-400 mt-1">Dean: {dean}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.badge}`}>
                                {facultyProgs.length} degree{facultyProgs.length !== 1 ? 's' : ''}
                              </span>
                              <span className="text-xs text-neutral-400">{students} scholars</span>
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${isExpanded ? 'rotate-180' : ''} bg-white/10`}>
                                <ChevronRight className="w-3.5 h-3.5 text-white rotate-90" />
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-neutral-300 mt-3 leading-relaxed font-light">{overview}</p>
                        </div>
                      </div>
                    </div>

                    {/* Programs List */}
                    {isExpanded && (
                      <div className="border-t border-neutral-800/80 px-6 lg:px-8 py-6 bg-black/30">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {facultyProgs.map((prog) => (
                            <div
                              key={prog.id}
                              onClick={() => setSelectedProgram(prog)}
                              className="group cursor-pointer p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between hover:shadow-xl"
                            >
                              <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${c.badge}`}>
                                    {prog.level}
                                  </span>
                                  <span className="text-[11px] font-mono text-neutral-400">{prog.years} Years · {prog.credits} Cr</span>
                                </div>
                                <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors leading-snug">
                                  {prog.name}
                                </h3>
                                <p className="text-xs text-neutral-400 line-clamp-2 font-light">{prog.description}</p>
                              </div>

                              <div className="pt-4 mt-4 border-t border-neutral-800 flex items-center justify-between text-xs">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/apply');
                                    window.scrollTo({ top: 0 });
                                  }}
                                  className="inline-flex items-center gap-1 font-bold text-rose-400 hover:text-rose-300 transition-colors"
                                >
                                  <span>Apply Now</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-[11px] text-neutral-500 group-hover:text-neutral-400">View Curriculum</span>
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

      {/* ── 6. CURRICULUM & HONORS PHILOSOPHY ── */}
      <section className="py-20 bg-[#0d0d10] border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <BookMarked className="w-6 h-6 text-rose-400" />
              </div>
              <h3
                className="text-2xl font-normal text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                The Core Curriculum
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed font-light">
                Every undergraduate engages with foundational humanistic inquiries, quantitative reasoning, and scientific ethics before concentrating in their major field.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Layers className="w-6 h-6 text-indigo-400" />
              </div>
              <h3
                className="text-2xl font-normal text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Undergraduate Research (UROP)
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed font-light">
                Over 70% of undergraduates conduct publishable, funded laboratory or field research alongside senior faculty before graduation.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-emerald-400" />
              </div>
              <h3
                className="text-2xl font-normal text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Global Academic Exchanges
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed font-light">
                Direct semester-abroad and research exchange programs with leading universities across North America, Europe, and Asia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. PROGRAM DETAIL MODAL ── */}
      {selectedProgram && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedProgram(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl text-white p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-rose-300">
                {selectedProgram.level} Degree
              </span>
              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">{selectedProgram.faculty}</span>
              <h2
                className="text-3xl font-normal text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {selectedProgram.name}
              </h2>
              <div className="flex items-center gap-4 text-xs font-mono text-rose-300 pt-1">
                <span>Duration: {selectedProgram.years} Years</span>
                <span>•</span>
                <span>Credits: {selectedProgram.credits} Required</span>
              </div>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed font-light">
              {selectedProgram.description}
            </p>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Standard Entry Requirements</p>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Minimum of Credit Passes (A1–C6 in WASSCE / Grade C in GCE A-Levels) in three core subjects including Mathematics and English, plus three relevant elective subjects.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedProgram(null);
                  navigate('/apply');
                  window.scrollTo({ top: 0 });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#A51C30] hover:bg-[#8f1829] text-white font-bold text-xs tracking-wide shadow-lg"
              >
                Apply for this Degree Program
              </button>

              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Back to Curriculum
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 8. ADMISSIONS ENROLLMENT CTA ── */}
      <section className="py-20 bg-gradient-to-br from-[#A51C30] via-[#851626] to-[#5a0f1a] text-white relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <GraduationCap className="w-12 h-12 text-rose-200 mx-auto" />
          <h2
            className="text-3xl sm:text-5xl font-normal leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Ready to Begin Your Academic Journey?
          </h2>
          <p className="text-rose-100 text-base sm:text-lg leading-relaxed font-light">
            Our admissions directorate and academic counselors are available to guide you through application and enrollment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => { navigate('/apply'); window.scrollTo({ top: 0 }); }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-neutral-900 font-bold text-sm shadow-xl hover:scale-[1.02] transition-all"
            >
              <span>Apply for 2026/2027 Admissions</span>
              <ArrowRight className="w-4 h-4 text-neutral-700" />
            </button>
            <button
              onClick={() => { navigate('/contact'); window.scrollTo({ top: 0 }); }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-white/30 hover:bg-white/10 text-white font-semibold text-sm transition-all"
            >
              <span>Contact Admissions Directorate</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ProgramsPage;
