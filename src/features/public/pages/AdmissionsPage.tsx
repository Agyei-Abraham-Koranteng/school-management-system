import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  CalendarDays,
  CheckCircle2,
  Send,
  FileText,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Clock,
  ShieldCheck,
  Globe,
  BookOpen,
  Briefcase,
  AlertCircle,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Compass,
  Download
} from 'lucide-react';
import { usePublicContent } from '../../../context/PublicContentContext';

// ─── Admissions Hero Slideshow Data ──────────────────────────────────────────
interface AdmissionSlide {
  id: string;
  tag: string;
  headline: string;
  subhead: string;
  image: string;
  stat: string;
  badge: string;
  actionText: string;
}

const ADMISSION_SLIDES: AdmissionSlide[] = [
  {
    id: 'undergraduate',
    tag: 'UNDERGRADUATE JOURNEY',
    headline: 'Shape Tomorrow from the Historic Quad',
    subhead: 'Join a vibrant community of thinkers, artists, debaters, and scientists from over 150 countries. Applications for the Fall 2026/2027 entry cycle are now officially open globally.',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&auto=format&fit=crop&q=85',
    stat: 'Early Action & Regular Decision · 120+ Degree Majors',
    badge: 'Undergraduate Class of 2030',
    actionText: 'Start Common Application'
  },
  {
    id: 'postgraduate',
    tag: 'POSTGRADUATE & DOCTORAL',
    headline: 'Advance Knowledge Across Disciplines',
    subhead: 'Pursue fully-funded doctoral research fellowships, clinical medical residencies, and executive MBA programs mentored by internationally acclaimed faculty.',
    image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=1920&auto=format&fit=crop&q=85',
    stat: 'Full Tuition Fellowships & Stipends for PhD Candidates',
    badge: 'Advanced Research Residencies',
    actionText: 'Explore Graduate Programs'
  },
  {
    id: 'international',
    tag: 'GLOBAL PERSPECTIVES',
    headline: 'Welcoming Exceptional Minds Worldwide',
    subhead: 'Dedicated international student advisory, streamlined visa sponsorship, and accredited transcript evaluations for Cambridge A-Levels, IB, and national baccalaureates.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&auto=format&fit=crop&q=85',
    stat: 'Students from 150+ Nations · Dedicated Global Welcome Center',
    badge: 'International Students Office',
    actionText: 'International Entry Guidelines'
  }
];

export const AdmissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { keyDates, admissionSteps, entryRequirements } = usePublicContent();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: '',
    level: 'undergraduate',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const activeSlide = ADMISSION_SLIDES[currentSlideIndex];

  // Auto-advance slideshow
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % ADMISSION_SLIDES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Smooth scroll to anchors on hash change
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const faqs = [
    {
      q: 'What are the minimum entry requirements for Undergraduate degrees?',
      a: 'Applicants must possess credit passes (Grade C6 or better in WASSCE / Grade D or better in SSSCE) in three core subjects including English and Mathematics, plus three elective subjects relevant to the degree.',
    },
    {
      q: 'Can international students apply with foreign qualifications?',
      a: 'Yes, international qualifications such as Cambridge A-Levels, International Baccalaureate (IB), French Baccalaureate, and American High School Diplomas are accredited through the Ghana Tertiary Education Commission (GTEC).',
    },
    {
      q: 'What support services are available for new students?',
      a: 'Premier University provides comprehensive orientation programs, academic mentoring, a student support hub, and dedicated counseling services to ensure every new student transitions successfully into university life.',
    },
    {
      q: 'How does credit transfer work for transfer students?',
      a: 'Transfer applicants from accredited tertiary institutions with a minimum CGPA of 2.75 can transfer up to 50% of total degree credits upon departmental syllabus review.',
    },
  ];

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen selection:bg-[#A51C30] selection:text-white">

      {/* ── 1. CINEMATIC ADMISSIONS HERO SLIDESHOW ── */}
      <section className="relative min-h-[88vh] sm:min-h-[92vh] flex items-end justify-center overflow-hidden bg-neutral-950">
        
        {/* Full-bleed Slideshow Backgrounds with Smooth Crossfade */}
        {ADMISSION_SLIDES.map((slide, idx) => (
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

            {/* Pill & Badge */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/50 border border-white/20 text-[11px] sm:text-xs md:text-sm font-semibold tracking-wider text-rose-300 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>{activeSlide.tag}</span>
              </span>
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-white/10 text-neutral-300 border border-white/10">
                {activeSlide.badge}
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
                <button
                  type="button"
                  onClick={() => {
                    navigate('/apply');
                    window.scrollTo({ top: 0 });
                  }}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-[#A51C30] hover:bg-[#8f1829] text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg active:scale-[0.98] transition-all text-center"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>

                <a
                  href="#entry-requirements"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('entry-requirements')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs sm:text-sm tracking-wide shadow-xl active:scale-[0.98] transition-all text-center"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                  <span>Requirements</span>
                </a>
              </div>

              <div className="flex items-center justify-start">
                <a
                  href="#dates"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('dates')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <CalendarDays className="w-3.5 h-3.5 text-rose-300" />
                  <span>Admissions Timeline & Deadlines</span>
                  <ArrowRight className="w-3 h-3 text-neutral-400" />
                </a>
              </div>
            </div>

            {/* Slideshow Selector & Controls */}
            <div className="pt-5 sm:pt-8 flex flex-row items-center justify-between gap-2 border-t border-white/15 w-full">
              
              {/* Slide indicators / tabs */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
                {ADMISSION_SLIDES.map((slide, idx) => (
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
                    <span>{idx + 1}. {slide.tag.split(' ')[0]} {slide.tag.split(' ')[1] || ''}</span>
                  </button>
                ))}
              </div>

              {/* Play/Pause and Next/Prev */}
              <div className="flex items-center gap-2 shrink-0">
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
                  onClick={() => setCurrentSlideIndex((prev) => (prev === 0 ? ADMISSION_SLIDES.length - 1 : prev - 1))}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % ADMISSION_SLIDES.length)}
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

      {/* ── 2. STICKY SUB-NAV ANCHOR DOCK ── */}
      <div className="sticky top-16 sm:top-20 z-30 bg-neutral-950/90 backdrop-blur-md border-y border-neutral-800/80 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'key-dates', label: 'Important Deadlines', icon: CalendarDays },
              { id: 'steps', label: 'Application Steps', icon: FileText },
              { id: 'entry-requirements', label: 'Entry Requirements', icon: CheckCircle2 },
              { id: 'inquiries', label: 'Inquiries & FAQ', icon: HelpCircle },
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

        {/* ── 3. KEY DATES & ADMISSION CALENDAR ── */}
        <section id="key-dates" className="scroll-mt-36">
          <div className="space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A51C30]">
              Fall 2026/2027 Schedule
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Key Application Deadlines
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Applications are reviewed on a rolling basis. Early submission is strongly encouraged for priority residential hall allocation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyDates.map((item, idx) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-rose-300">
                    {item.status}
                  </span>
                  <h3
                    className="text-xl font-normal text-white"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {item.event}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-light">{item.badge}</p>
                </div>

                <div className="pt-4 mt-6 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-rose-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Key Date
                  </span>
                  <span className="font-bold">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. STEP-BY-STEP APPLICATION WORKFLOW ── */}
        <section id="steps" className="scroll-mt-36">
          <div className="space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A51C30]">
              Application Procedure
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              How to Apply in 4 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {admissionSteps.map((step, idx) => (
              <div
                key={step.id}
                className="relative p-7 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-400 font-extrabold text-lg">
                  0{idx + 1}
                </div>
                <h3
                  className="text-xl font-normal text-white"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. ENTRY REQUIREMENTS MATRIX ── */}
        <section id="entry-requirements" className="scroll-mt-36">
          <div className="space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A51C30]">
              Accredited Qualifications
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Entry Requirements by Qualification
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {entryRequirements.map((req) => (
              <div
                key={req.id}
                className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-5"
              >
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-rose-400">
                    {req.level}
                  </span>
                  <h3
                    className="text-2xl font-normal text-white mt-1"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {req.qualification}
                  </h3>
                </div>

                <p className="text-sm text-neutral-300 leading-relaxed font-light">{req.details}</p>

                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Minimum Grades Required</p>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-neutral-800 flex items-center gap-2.5 text-xs text-neutral-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{req.minimumGrades}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 7. FAQ ACCORDION & ADMISSION INQUIRIES ── */}
        <section id="inquiries" className="scroll-mt-36">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* FAQ Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#A51C30]">
                Frequently Answered
              </span>
              <h2
                className="text-3xl sm:text-4xl font-normal text-white tracking-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Admissions Questions
              </h2>

              <div className="space-y-3 pt-2">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-rose-200 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-400 transition-transform ${
                          activeFaq === idx ? 'rotate-180 text-rose-400' : ''
                        }`}
                      />
                    </button>
                    {activeFaq === idx && (
                      <div className="p-5 pt-0 text-xs text-neutral-300 leading-relaxed font-light border-t border-neutral-800/60 bg-black/20">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Inquiries Form Right Column */}
            <div className="lg:col-span-5">
              <div className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-5">
                <div>
                  <h3
                    className="text-2xl font-normal text-white"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Contact Admissions
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Have questions regarding your transcripts or program eligibility? Our counselors respond within 24 hours.
                  </p>
                </div>

                {submitted ? (
                  <div className="py-8 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                    <p className="font-bold text-white text-sm">Inquiry Dispatched!</p>
                    <p className="text-xs text-neutral-400">Our team will reach out to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 mb-1">Program of Interest</label>
                      <input
                        type="text"
                        value={formData.program}
                        onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                        placeholder="e.g. BSc Computer Science"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#A51C30] hover:bg-[#8f1829] text-white font-bold text-xs shadow-lg transition-all"
                    >
                      Submit Admissions Inquiry
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default AdmissionsPage;
