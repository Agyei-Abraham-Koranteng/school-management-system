import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Microscope,
  Cpu,
  Sun,
  HeartPulse,
  Coins,
  Sprout,
  ArrowRight,
  ExternalLink,
  Award,
  Globe,
  FileText,
  Sparkles,
  Users,
  Search,
  BookOpen,
  Briefcase,
  Rocket,
  DollarSign,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Atom,
  Clock,
  Compass
} from 'lucide-react';
import { usePublicContent } from '../../../context/PublicContentContext';

// ─── Research Hero Slideshow Data ────────────────────────────────────────────
interface ResearchSlide {
  id: string;
  tag: string;
  headline: string;
  subhead: string;
  image: string;
  stat: string;
  institute: string;
}

const RESEARCH_SLIDES: ResearchSlide[] = [
  {
    id: 'biomedical',
    tag: 'BIOMEDICAL BREAKTHROUGHS',
    headline: 'Transformative Cellular Therapies & Genomics',
    subhead: 'Synthesizing targeted lipid nanoparticles and CRISPR gene therapies to treat neurodegenerative diseases, pediatric oncology targets, and emerging infectious pathogens.',
    image: '/images/hero-research.jpg',
    stat: '$28M Clinical Trial Grants · 32 International Teaching Hospitals',
    institute: 'Premier Institute for Genomic Medicine'
  },
  {
    id: 'quantum-ai',
    tag: 'COMPUTATIONAL INTELLIGENCE',
    headline: 'Architecting Fault-Tolerant Quantum & Edge AI',
    subhead: 'Engineered neutral-atom quantum processors with record-breaking coherence times and open-source African language NLP models advancing sovereign computational intelligence.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&auto=format&fit=crop&q=85',
    stat: '48 Logical Qubits Demonstrated · NVIDIA AI Research Lab',
    institute: 'Center for Quantum & Cognitive Systems'
  },
  {
    id: 'clean-energy',
    tag: 'SUSTAINABLE ENGINEERING',
    headline: 'Clean Energy & Climate Resilience for a Warming World',
    subhead: 'Deploying solar microgrids, autonomous atmospheric drone sensors, and bioengineered drought-resilient crops across 600 smallholder agricultural cooperatives.',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1920&auto=format&fit=crop&q=85',
    stat: 'Doubled Crop Yields in Drought Conditions · 40% Less Water',
    institute: 'Salata Climate & Renewable Energy Institute'
  },
  {
    id: 'digital-policy',
    tag: 'GLOBAL POLICY & ECONOMICS',
    headline: 'Sovereign Digital Infrastructure & Inclusive Finance',
    subhead: 'Developing decentralized cross-border settlement protocols and international AI governance frameworks adopted by 24 international regulatory bodies.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1920&auto=format&fit=crop&q=85',
    stat: '$68M in External Research Grants · 34 International Patents',
    institute: 'Institute for Governance & Financial Systems'
  }
];

export const ResearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { researchCentres, publications, industryPartners, innovationHubProjects, researchGrants } = usePublicContent();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const activeSlide = RESEARCH_SLIDES[currentSlideIndex];

  // Auto-advance slideshow
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % RESEARCH_SLIDES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }, [location]);

  const filteredCentres = activeCategory === 'all'
    ? researchCentres
    : researchCentres.filter((c) => c.category === activeCategory);

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen selection:bg-[#A51C30] selection:text-white">

      {/* ── 1. CINEMATIC RESEARCH HERO SLIDESHOW ── */}
      <section className="relative min-h-[88vh] sm:min-h-[92vh] flex items-end justify-center overflow-hidden bg-neutral-950">
        
        {/* Full-bleed Slideshow Backgrounds with Smooth Crossfade */}
        {RESEARCH_SLIDES.map((slide, idx) => (
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

            {/* Pill & Institute */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/50 border border-white/20 text-[11px] sm:text-xs md:text-sm font-semibold tracking-wider text-rose-300 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>{activeSlide.tag}</span>
              </span>
              <span className="text-[11px] sm:text-xs md:text-sm text-neutral-300 font-medium">
                {activeSlide.institute}
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

            {/* Slide Stat Banner */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/10 border border-white/15 text-[11px] sm:text-xs md:text-sm font-medium text-neutral-200 backdrop-blur-md">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
              <span>{activeSlide.stat}</span>
            </div>

            {/* Call to Action Buttons - Balanced 2-column grid on mobile */}
            <div className="w-full max-w-xl pt-2 space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center sm:gap-3.5">
                <a
                  href="#centres"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('centres')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs sm:text-sm tracking-wide shadow-xl active:scale-[0.98] transition-all text-center"
                >
                  <span>Explore Centers</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                </a>

                <a
                  href="#publications"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('publications')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-[#A51C30] hover:bg-[#8f1829] text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg active:scale-[0.98] transition-all text-center"
                >
                  <span>Publications</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>

              <div className="flex items-center justify-start">
                <a
                  href="#innovation-hub"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('innovation-hub')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <span>Innovation Hub & Commercial Ventures</span>
                  <ArrowRight className="w-3 h-3 text-neutral-400" />
                </a>
              </div>
            </div>

            {/* Slideshow Selector & Controls */}
            <div className="pt-5 sm:pt-8 flex flex-row items-center justify-between gap-2 border-t border-white/15 w-full">
              
              {/* Slide indicators / tabs */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
                {RESEARCH_SLIDES.map((slide, idx) => (
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
                    <span>{idx + 1}. {slide.tag.split(' ')[0]}</span>
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
                  onClick={() => setCurrentSlideIndex((prev) => (prev === 0 ? RESEARCH_SLIDES.length - 1 : prev - 1))}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % RESEARCH_SLIDES.length)}
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

      {/* ── 2. RESEARCH VITAL METRICS BAR ── */}
      <section className="py-12 bg-[#0d0d10] border-y border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-800">
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-white">
                $68M+
              </p>
              <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
                Active External Grants
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-white">
                {publications.length}+
              </p>
              <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
                Peer-Reviewed Publications
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-white">
                34
              </p>
              <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
                International Patents Issued
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-rose-400">
                120+
              </p>
              <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
                Global Research Partners
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. STICKY SUB-NAV DOCK ── */}
      <div className="sticky top-16 sm:top-20 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'centres', label: 'Research Centers', icon: Microscope },
              { id: 'publications', label: 'Featured Publications', icon: FileText },
              { id: 'partnerships', label: 'Global Industry Partners', icon: Globe },
              { id: 'innovation-hub', label: 'Innovation Hub & Ventures', icon: Rocket },
              { id: 'grants', label: 'Grants & Funding', icon: DollarSign },
            ].map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-all flex items-center gap-2"
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-32">

        {/* ── 4. RESEARCH CENTERS & INSTITUTES ── */}
        <section id="centres" className="scroll-mt-36">
          <div className="space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A51C30]">
              Interdisciplinary Directorates
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Specialized Research Centers
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Our autonomous research centers bring together chemists, roboticists, economists, and legal scholars to solve humanity's most complex challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCentres.map((centre) => (
              <div
                key={centre.id}
                className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between hover:shadow-2xl"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-400">
                    <Microscope className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400">
                      {centre.category}
                    </span>
                    <h3
                      className="text-2xl font-normal text-white mt-1"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {centre.title}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    {centre.description}
                  </p>
                  <p className="text-xs font-mono text-neutral-400">
                    Director: <strong className="text-white">{centre.director}</strong>
                  </p>
                  {centre.highlights && centre.highlights.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {centre.highlights.map((h, i) => (
                        <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-neutral-400 border border-white/5">
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                  <span>Grants: <strong className="text-neutral-200">{centre.grants}</strong></span>
                  <span className="text-rose-400 font-semibold">{centre.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. PEER-REVIEWED PUBLICATIONS ── */}
        <section id="publications" className="scroll-mt-36">
          <div className="space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A51C30]">
              Scholarly Output
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Featured Publications & Discoveries
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publications.map((pub) => (
              <div
                key={pub.id}
                className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all space-y-4"
              >
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-rose-300 font-bold">
                    {pub.journal}
                  </span>
                  <span>{pub.year}</span>
                </div>

                <h3
                  className="text-xl font-normal text-white leading-snug"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {pub.title}
                </h3>

                <p className="text-xs text-neutral-400 font-mono">
                  Authors: <span className="text-neutral-300">{pub.authors}</span>
                </p>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs font-semibold text-rose-400">
                  <span className="inline-flex items-center gap-1.5 text-neutral-400">
                    <BookOpen className="w-3.5 h-3.5 text-rose-400" />
                    Peer-Reviewed Archive
                  </span>
                  <span className="font-mono text-[11px] text-neutral-500">Vol. {pub.year} Issue</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. INNOVATION HUB & STUDENT VENTURES ── */}
        <section id="innovation-hub" className="scroll-mt-36">
          <div className="space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A51C30]">
              Enterprise Incubation
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Innovation Hub & Spinout Ventures
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Transforming academic lab breakthroughs into venture-backed technology companies, clean tech patents, and humanitarian public health solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {innovationHubProjects.map((proj) => (
              <div
                key={proj.id}
                className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-400">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                      Stage: {proj.stage}
                    </span>
                    <h3
                      className="text-2xl font-normal text-white mt-1"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {proj.name}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    {proj.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-800 text-xs flex items-center justify-between text-neutral-400">
                  <span>Founder: <strong className="text-white">{proj.founder}</strong></span>
                  <span className="font-mono text-emerald-400 font-semibold">{proj.stage}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default ResearchPage;
