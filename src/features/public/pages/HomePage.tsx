import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, BookOpen, Users, Award, ArrowRight, ChevronRight,
  Star, Globe, Microscope, Lightbulb, Building2, BarChart3,
  Sparkles, TrendingUp, ChevronDown, Quote, Shield, Play, Pause,
  Calendar, Clock, Bookmark, ArrowUpRight, CheckCircle2, ChevronLeft,
  X, ExternalLink, HeartPulse, Scale, Cpu, Landmark, Stethoscope
} from 'lucide-react';
import { usePublicContent } from '../../../context/PublicContentContext';

// ─── Reusable: Animated Counter ─────────────────────────────────────────────
export const AnimatedCounter: React.FC<{ end: number; suffix?: string; duration?: number }> = ({
  end,
  suffix = '',
  duration = 2000,
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const step = Math.ceil(end / (duration / 16));
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + step, end);
            setCount(current);
            if (current >= end) clearInterval(timer);
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// ─── Harvard-Style Featured Research Stories ─────────────────────────────────
interface StoryItem {
  id: string;
  tag: string;
  headline: string;
  subhead: string;
  image: string;
  readTime: string;
  author: string;
  department: string;
  overview: string;
  bullets: string[];
}

const FEATURED_STORIES: StoryItem[] = [
  {
    id: 'transformative-treatments',
    tag: 'MEDICINE & HEALTH',
    headline: 'Transformative Treatments',
    subhead: 'Using innovative approaches, advanced research, and nanotechnology, Premier University scientists are finding new ways to treat Alzheimer’s, cancer, diabetes, and more.',
    image: '/images/hero-research.jpg',
    readTime: '6 min read',
    author: 'Office of Vice Provost for Research',
    department: 'Premier Medical School & Biomedical Institute',
    overview: 'A multidisciplinary team of biochemists, nanotechnologists, and clinical neuroscientists have synthesized targeted lipid nanoparticles capable of safely permeating the blood-brain barrier to reverse early-stage cellular degradation in neurodegenerative conditions.',
    bullets: [
      'Over 94% target cell uptake observed in initial phase II mammalian trials',
      'Minimizes cytotoxic off-target exposure across healthy endocrine pathways',
      'Joint clinical partnership between Premier Medical School and university teaching hospitals'
    ]
  },
  {
    id: 'quantum-frontiers',
    tag: 'ENGINEERING & APPLIED SCIENCES',
    headline: 'Quantum Frontiers in Computing',
    subhead: 'Pioneering fault-tolerant quantum algorithms and photonic hardware to solve cryptographic, climate, and molecular simulation challenges at lightspeed.',
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1920&auto=format&fit=crop&q=85',
    readTime: '5 min read',
    author: 'Quantum Science Initiative',
    department: 'John A. Paulson School of Engineering',
    overview: 'Researchers have engineered coherent neutral-atom quantum processors with record-breaking coherence times, unlocking atomic-scale simulations that predict revolutionary room-temperature superconductors.',
    bullets: [
      'Demonstrated 48 logical qubits with active quantum error correction',
      'Accelerates synthetic catalyst design for industrial carbon capture',
      'Collaboration across Physics, Chemistry, and Electrical Engineering'
    ]
  },
  {
    id: 'constitutional-democracy',
    tag: 'LAW & PUBLIC POLICY',
    headline: 'Safeguarding Global Democracy',
    subhead: 'Legal scholars and international jurists analyze evolving electoral frameworks and institutional integrity to protect civil liberties worldwide.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&auto=format&fit=crop&q=85',
    readTime: '8 min read',
    author: 'Center for Democratic Governance',
    department: 'Premier Law School & Governance Institute',
    overview: 'In response to rapid shifts in digital communications, geopolitical tensions, and synthetic media, our faculty convene global summits establishing actionable legal standards for electoral transparency and privacy rights.',
    bullets: [
      'Drafted policy framework adopted by 24 international electoral commissions',
      'Comprehensive study on digital election integrity and AI-generated disinformation',
      'Fellowship program funding 80+ international human rights advocates'
    ]
  },
  {
    id: 'climate-resilience',
    tag: 'SUSTAINABILITY & ENVIRONMENT',
    headline: 'Solutions for a Warming Planet',
    subhead: 'Developing ocean thermal energy conversion, drought-resistant agriculture, and scalable carbon removal technologies for resilient communities.',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1920&auto=format&fit=crop&q=85',
    readTime: '7 min read',
    author: 'Salata Institute for Climate & Sustainability',
    department: 'Faculty of Arts and Sciences',
    overview: 'Field trials across sub-Saharan Africa and Southeast Asia demonstrate novel bioengineered root architectures that double crop yields while requiring 40% less groundwater.',
    bullets: [
      'Deploys solar microgrids and climate-adaptive seeds across 600 farming cooperatives',
      'Satellite-guided methane tracking in partnership with international climate consortiums',
      '$250M committed endowment for student-led climate ventures'
    ]
  }
];

// ─── University Schools Directory ───────────────────────────────────────────
const UNIVERSITY_SCHOOLS = [
  {
    name: 'College of Arts & Sciences',
    desc: 'Undergraduate education in liberal arts and sciences, fostering curious minds since 1962.',
    dean: 'Faculty of Arts and Sciences',
    icon: Landmark,
    accent: '#A51C30',
    link: '/programs?faculty=arts-sciences'
  },
  {
    name: 'School of Medicine & Health Sciences',
    desc: 'Dedicated to alleviating human suffering through compassionate clinical practice and biomedical research.',
    dean: 'School of Medicine',
    icon: Stethoscope,
    accent: '#00629B',
    link: '/programs?faculty=medicine'
  },
  {
    name: 'Faculty of Law & Jurisprudence',
    desc: 'Educating leaders who advance justice, uphold the rule of law, and serve society globally.',
    dean: 'Faculty of Law',
    icon: Scale,
    accent: '#4A154B',
    link: '/programs?faculty=law'
  },
  {
    name: 'School of Engineering & Applied Sciences',
    desc: 'Inventing the future at the intersection of computing, bioengineering, physics, and robotics.',
    dean: 'Engineering Directorate',
    icon: Cpu,
    accent: '#00843D',
    link: '/programs?faculty=engineering'
  },
  {
    name: 'Business School & Executive Leadership',
    desc: 'Educating leaders who make a profound difference in the world across enterprise and technology.',
    dean: 'Graduate Business Faculty',
    icon: BarChart3,
    accent: '#C5A059',
    link: '/programs?faculty=business'
  },
  {
    name: 'School of Public Health & Global Health',
    desc: 'Powerful science and visionary leadership for global health equity and pandemic preparedness.',
    dean: 'School of Public Health',
    icon: HeartPulse,
    accent: '#D9381E',
    link: '/programs?faculty=public-health'
  }
];

// ─── Home Page Component ───────────────────────────────────────────────────
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { homePage } = usePublicContent();

  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [modalStory, setModalStory] = useState<StoryItem | null>(null);

  const activeStory = FEATURED_STORIES[activeStoryIndex];

  // Auto-advance carousel
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStoryIndex((prev) => (prev + 1) % FEATURED_STORIES.length);
    }, 7500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const goToAdmissions = () => {
    navigate('/apply');
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen selection:bg-[#A51C30] selection:text-white">

      {/* ── 1. THE HERO SECTION (Matches Harvard Reference Image) ── */}
      <section
        id="hero"
        className="relative min-h-[92vh] sm:min-h-screen flex items-end justify-center overflow-hidden bg-neutral-950"
      >
        {/* Full-Bleed Photographic Background with Smooth Transition */}
        {FEATURED_STORIES.map((story, idx) => (
          <div
            key={story.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeStoryIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
            }`}
          >
            <img
              src={story.image}
              alt={story.headline}
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
            />
            {/* Cinematic Gradient Overlays for High-Contrast Harvard Serif Typography */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-neutral-950/70" />
            <div className="absolute inset-0 bg-neutral-950/30 backdrop-blur-[0.5px]" />
          </div>
        ))}

        {/* Hero Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 xs:pt-28 sm:pt-32 pb-8 sm:pb-16 lg:pb-20">
          <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Category / Research Frontier Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/40 border border-white/20 text-[11px] sm:text-xs md:text-sm font-semibold tracking-wider text-rose-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>{activeStory.tag}</span>
            </div>

            {/* Responsive Iconic Headline */}
            <h1
              className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal text-white tracking-tight leading-[1.12] sm:leading-[1.05] drop-shadow-xl"
              style={{ fontFamily: "'Playfair Display', 'Newsreader', 'Libre Baskerville', Georgia, serif" }}
            >
              {activeStory.headline}
            </h1>

            {/* Subhead / Lead Paragraph */}
            <p
              className="text-xs xs:text-sm sm:text-base md:text-xl lg:text-2xl text-neutral-100/90 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-md"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {activeStory.subhead}
            </p>

            {/* Action Buttons: Responsive 2-column for Small Screens */}
            <div className="w-full max-w-xl mx-auto pt-2 space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center sm:justify-center sm:gap-4">
                <button
                  type="button"
                  onClick={() => setModalStory(activeStory)}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-7 py-2.5 sm:py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs sm:text-sm tracking-wide shadow-xl active:scale-[0.98] transition-all text-center"
                >
                  <span>Read Story</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={goToAdmissions}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-[#A51C30] hover:bg-[#8f1829] text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-rose-950/40 active:scale-[0.98] transition-all text-center"
                >
                  <span>Apply Now</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <span>Sign In to SIS Portal</span>
                  <ArrowRight className="w-3 h-3 text-neutral-400" />
                </button>
              </div>
            </div>

            {/* Story Switcher Tabs & Controls - Compact Single Row on Mobile */}
            <div className="pt-5 sm:pt-8 flex flex-row items-center justify-between gap-2 border-t border-white/15 w-full">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-neutral-300">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                >
                  {isPlaying ? <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                </button>
                <span className="hidden xs:inline">
                  Story {activeStoryIndex + 1} of {FEATURED_STORIES.length}
                </span>
                <span className="xs:hidden">
                  {activeStoryIndex + 1}/{FEATURED_STORIES.length}
                </span>
              </div>

              {/* Story indicators */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {FEATURED_STORIES.map((story, i) => (
                  <button
                    key={story.id}
                    type="button"
                    onClick={() => setActiveStoryIndex(i)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                      i === activeStoryIndex ? 'w-6 sm:w-8 bg-[#A51C30]' : 'w-1.5 sm:w-2 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${i + 1}: ${story.headline}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveStoryIndex((prev) => (prev === 0 ? FEATURED_STORIES.length - 1 : prev - 1))}
                  className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Previous story"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStoryIndex((prev) => (prev + 1) % FEATURED_STORIES.length)}
                  className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Next story"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-white/50 animate-bounce">
          <span className="text-[10px] tracking-widest uppercase">Explore Campus</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* ── 2. HARVARD GAZETTE: STORIES FROM ACROSS THE UNIVERSITY ── */}
      <section className="py-20 sm:py-28 bg-[#0d0d10] border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-widest mb-2">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                <span>The University Gazette</span>
              </div>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight"
                style={{ fontFamily: "'Playfair Display', 'Libre Baskerville', Georgia, serif" }}
              >
                Latest News & Discoveries
              </h2>
            </div>
            <p className="text-neutral-400 text-sm max-w-md">
              Reporting on groundbreaking faculty research, undergraduate discoveries, campus life, and university leadership.
            </p>
          </div>

          {/* Editorial Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            {FEATURED_STORIES.slice(1).concat(FEATURED_STORIES.slice(0, 1)).slice(0, 3).map((story) => (
              <article
                key={story.id}
                onClick={() => setModalStory(story)}
                className="group cursor-pointer flex flex-col justify-between rounded-2xl bg-neutral-900/60 border border-neutral-800/80 overflow-hidden hover:border-neutral-700 transition-all hover:shadow-2xl"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.headline}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-rose-300 uppercase tracking-wider">
                      {story.tag}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {story.readTime}
                      </span>
                      <span>•</span>
                      <span>{story.department}</span>
                    </div>

                    <h3
                      className="text-xl sm:text-2xl font-normal text-white group-hover:text-rose-200 transition-colors leading-snug"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {story.headline}
                    </h3>

                    <p className="text-sm text-neutral-300 leading-relaxed line-clamp-3">
                      {story.subhead}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs font-semibold text-rose-400 group-hover:text-rose-300">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* ── 3. ACADEMICS & SCHOOLS DIRECTORY ── */}
      <section className="py-20 sm:py-28 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A51C30]">
              Faculties & Degree Programs
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight"
              style={{ fontFamily: "'Playfair Display', 'Libre Baskerville', Georgia, serif" }}
            >
              Schools of Study & Research
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              Premier University is devoted to excellence in teaching, learning, and research, and to developing leaders who make a difference globally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {UNIVERSITY_SCHOOLS.map((school) => {
              const Icon = school.icon;
              return (
                <div
                  key={school.name}
                  onClick={() => {
                    navigate(school.link);
                    window.scrollTo({ top: 0 });
                  }}
                  className="group cursor-pointer p-7 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#A51C30]/20 transition-colors">
                        <Icon className="w-6 h-6 text-white group-hover:text-rose-400 transition-colors" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                        Degree Granting
                      </span>
                    </div>

                    <h3
                      className="text-2xl font-normal text-white group-hover:text-rose-200 transition-colors"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {school.name}
                    </h3>

                    <p className="text-sm text-neutral-300 leading-relaxed">
                      {school.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-neutral-800 flex items-center justify-between text-xs font-semibold text-neutral-400 group-hover:text-white transition-colors">
                    <span>Explore Curricula & Faculty</span>
                    <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 4. BY THE NUMBERS: UNIVERSITY VITAL STATISTICS ── */}
      <section className="py-20 bg-gradient-to-br from-[#A51C30] via-[#851626] to-[#5a0f1a] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-200">
              Institutional Distinction
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Premier University by the Numbers
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 text-center">
            <div className="space-y-2">
              <Award className="w-8 h-8 text-rose-200 mx-auto mb-2 opacity-80" />
              <p className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                <AnimatedCounter end={48} suffix="" />
              </p>
              <p className="text-rose-100 text-sm font-medium">Nobel Laureates Affiliated</p>
            </div>

            <div className="space-y-2">
              <Microscope className="w-8 h-8 text-rose-200 mx-auto mb-2 opacity-80" />
              <p className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                $<AnimatedCounter end={4} suffix=".2B" />
              </p>
              <p className="text-rose-100 text-sm font-medium">Annual Sponsored Research</p>
            </div>

            <div className="space-y-2">
              <Users className="w-8 h-8 text-rose-200 mx-auto mb-2 opacity-80" />
              <p className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                <AnimatedCounter end={28000} suffix="+" />
              </p>
              <p className="text-rose-100 text-sm font-medium">Degree Candidates from 150+ Nations</p>
            </div>

            <div className="space-y-2">
              <Shield className="w-8 h-8 text-rose-200 mx-auto mb-2 opacity-80" />
              <p className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                <AnimatedCounter end={100} suffix="%" />
              </p>
              <p className="text-rose-100 text-sm font-medium">Need-Blind Financial Aid Promise</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. ADMISSIONS & FINANCIAL AID INVITATION ── */}
      <section className="py-20 sm:py-28 bg-[#0d0d10] border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 p-8 sm:p-14 lg:p-18">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-rose-300 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Applications for 2026/2027 Cycle Now Open</span>
              </div>

              <h2
                className="text-3xl sm:text-5xl font-normal text-white tracking-tight leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Begin Your Journey at Premier University
              </h2>

              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed font-light">
                Whether you are an aspiring undergraduate, a prospective doctoral candidate, or an executive scholar, our admissions directorates welcome applications from exceptional thinkers of every background.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={goToAdmissions}
                  className="px-8 py-4 rounded-xl bg-[#A51C30] hover:bg-[#8f1829] text-white font-bold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <span>Start Online Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/programs')}
                  className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Browse All Degree Concentrations</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. RESEARCH STORY MODAL (Detailed Harvard Gazette Reading View) ── */}
      {modalStory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setModalStory(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl text-white p-6 sm:p-10 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  {modalStory.tag}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModalStory(null)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-neutral-800">
              <img
                src={modalStory.image}
                alt={modalStory.headline}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3">
              <h2
                className="text-3xl sm:text-4xl font-normal leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {modalStory.headline}
              </h2>
              <p className="text-neutral-400 text-xs font-mono">
                Published by {modalStory.author} · {modalStory.department} · {modalStory.readTime}
              </p>
            </div>

            <p className="text-base sm:text-lg text-neutral-200 leading-relaxed font-light">
              {modalStory.overview}
            </p>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Key Breakthroughs & Clinical Data
              </h4>
              <ul className="space-y-2.5">
                {modalStory.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setModalStory(null);
                  navigate('/apply');
                  window.scrollTo({ top: 0 });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#A51C30] hover:bg-[#8f1829] text-white font-bold text-xs tracking-wide"
              >
                Join Faculty & Graduate Research
              </button>

              <button
                type="button"
                onClick={() => setModalStory(null)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Back to Homepage
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomePage;
