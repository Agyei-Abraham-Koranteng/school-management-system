import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  HeartHandshake,
  Building,
  Activity,
  Trophy,
  Users,
  Sparkles,
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Compass,
  Wifi,
  Coffee,
  HelpCircle,
  Landmark,
  Stethoscope,
  Cpu,
  ChevronRight,
  Camera,
  Navigation
} from 'lucide-react';
import { usePublicContent } from '../../../context/PublicContentContext';

// ─── Three Main Campuses Data ────────────────────────────────────────────────
const MAIN_CAMPUSES = [
  {
    id: 'legon-hill',
    name: 'Legon Hill Main Campus',
    tagline: 'The Historic Core of Academic Life',
    desc: 'The intellectual heart of Premier University, established in 1962. Home to the iconic Great Hall, historic residential colleges, central university libraries, green quadrangles, and university governance.',
    image: '/images/campus-aerial.jpg',
    highlights: ['The Great Hall & Clock Tower', 'Balme Research Library', '6 Residential Halls', 'Botanical Gardens & Arboretum'],
    stats: '18,500 Scholars · 420 Acres'
  },
  {
    id: 'waterfront-tech',
    name: 'Waterfront Innovation Park',
    tagline: 'Engineering, Robotics & Clean Tech',
    desc: 'Bordering the scenic university river, this state-of-the-art campus houses the School of Engineering, advanced robotics laboratories, AI venture incubators, and the varsity rowing boathouse.',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&auto=format&fit=crop&q=80',
    highlights: ['Robotics & Quantum Hardware Pavilions', 'Clean Energy Microgrid', 'Varsity Boathouse & Regatta Course', 'Student Enterprise Hub'],
    stats: '6,200 Scholars · 110 Acres'
  },
  {
    id: 'city-medical',
    name: 'City Health & Law Precinct',
    tagline: 'Clinical Medicine & Jurisprudence',
    desc: 'Located adjacent to the premier teaching hospital and international courts. A bustling urban medical center where medical candidates, nursing scholars, and legal jurists train at the cutting edge.',
    image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=1200&auto=format&fit=crop&q=80',
    highlights: ['Premier University Teaching Hospital', 'Genomic Medicine Institute', 'Moot Court Chambers', 'Public Health Clinics'],
    stats: '3,800 Scholars · Urban Complex'
  }
];

export const CampusLifePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { campusServices, housing, healthWellness, sports, clubs } = usePublicContent();

  const [activeTab, setActiveTab] = useState<'all' | 'campuses' | 'services' | 'housing' | 'health' | 'sports' | 'clubs'>('all');
  const [selectedCampus, setSelectedCampus] = useState(MAIN_CAMPUSES[0]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
      if (['campuses', 'services', 'housing', 'health', 'sports', 'clubs'].includes(id)) {
        setActiveTab(id as any);
      }
    }
  }, [location]);

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen selection:bg-[#A51C30] selection:text-white">

      {/* ── 1. CAMPUS LIFE HERO (Matches User Reference Image) ── */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-end justify-center overflow-hidden bg-neutral-950">
        {/* Full-Bleed Panoramic Aerial Landscape */}
        <div className="absolute inset-0">
          <img
            src="/images/campus-aerial.jpg"
            alt="Premier University Panoramic Campus and River"
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
          />
          {/* Subtle Dark Gradient Vignette for Razor-Sharp White Serif Typography */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/65" />
          <div className="absolute inset-0 bg-neutral-950/20 backdrop-blur-[0.5px]" />
        </div>

        {/* Hero Content Grid (Left: "Campus", Right: Description) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 xs:pt-28 sm:pt-36 pb-8 sm:pb-16 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-end">

            {/* Left Column: Big Elegant Serif "Campus" */}
            <div className="lg:col-span-5 space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/20 text-[11px] sm:text-xs font-semibold tracking-wider text-rose-300 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>Collegiate Experience & Heritage</span>
              </div>

              <h1
                className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal text-white tracking-tight leading-tight sm:leading-none drop-shadow-2xl"
                style={{ fontFamily: "'Playfair Display', 'Newsreader', 'Libre Baskerville', Georgia, serif" }}
              >
                Campus
              </h1>
            </div>

            {/* Right Column: Narrative Lead Paragraph */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <p
                className="text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl text-neutral-100 font-light leading-relaxed drop-shadow-xl"
                style={{ fontFamily: "'Playfair Display', 'Newsreader', 'Libre Baskerville', Georgia, serif" }}
              >
                Our three main campuses—in Legon Hill, Waterfront, and City Innovation Hub—are a home to students and faculty, a hub of research and innovation, and a destination for visitors from all over the world.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
                <a
                  href="#campuses"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('campuses')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs sm:text-sm tracking-wide shadow-xl active:scale-[0.98] transition-all text-center"
                >
                  <span>Explore Three Campuses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    navigate('/apply');
                    window.scrollTo({ top: 0 });
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3 rounded-xl bg-[#A51C30] hover:bg-[#8f1829] text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg active:scale-[0.98] transition-all text-center"
                >
                  <span>Join Our Community</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. QUICK NAV ANCHOR DOCK ── */}
      <div className="sticky top-16 sm:top-20 z-30 bg-neutral-950/90 backdrop-blur-md border-y border-neutral-800/80 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'campuses', label: 'The Three Campuses', icon: Compass },
              { id: 'housing', label: 'Housing & Residences', icon: Building },
              { id: 'services', label: 'Student Support Services', icon: HeartHandshake },
              { id: 'health', label: 'Health & Wellness', icon: Activity },
              { id: 'sports', label: 'Athletics & Recreation', icon: Trophy },
              { id: 'clubs', label: 'Clubs & Traditions', icon: Users },
            ].map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(id as any);
                  const el = document.getElementById(id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                  activeTab === id
                    ? 'bg-[#A51C30] text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-32">

        {/* ── 3. OUR THREE MAIN CAMPUSES SHOWCASE ── */}
        <section id="campuses" className="scroll-mt-36">
          <div className="space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A51C30]">
              Geographic Footprint
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              The Three Main Campuses
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Spanning historic Georgian quadrangles, riverfront robotics labs, and high-intensity clinical hospitals, Premier University offers an unmatched geographic and intellectual environment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {MAIN_CAMPUSES.map((campus) => (
              <div
                key={campus.id}
                className="group rounded-3xl overflow-hidden bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between hover:shadow-2xl"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={campus.image}
                      alt={campus.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold bg-black/60 text-rose-300 backdrop-blur-md border border-white/10">
                      {campus.stats}
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400">
                        {campus.tagline}
                      </span>
                      <h3
                        className="text-2xl font-normal text-white mt-1 group-hover:text-rose-200 transition-colors"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {campus.name}
                      </h3>
                    </div>

                    <p className="text-sm text-neutral-300 leading-relaxed font-light">
                      {campus.desc}
                    </p>

                    <div className="pt-4 border-t border-neutral-800 space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        Campus Landmarks
                      </p>
                      <ul className="space-y-1.5 text-xs text-neutral-300">
                        {campus.highlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/contact');
                      window.scrollTo({ top: 0 });
                    }}
                    className="w-full py-3 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-xs font-bold text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Campus Map & Directions</span>
                    <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. HOUSING & RESIDENTIAL LIFE ── */}
        <section id="housing" className="scroll-mt-36">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-neutral-800 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#A51C30]">
                Residential Community
              </span>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight mt-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Collegiate Housing & Residences
              </h2>
              <p className="text-sm text-neutral-400 mt-2 max-w-xl">
                More than just dorms. Our residential halls are lifelong living and learning communities led by faculty deans in residence.
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-[#A51C30] hover:bg-[#8f1829] text-white font-bold text-xs transition-colors shadow-lg"
            >
              Apply for Room Allocation
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {housing.map((h) => (
              <div
                key={h.id}
                className="group rounded-3xl overflow-hidden bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between hover:shadow-xl"
              >
                <div>
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={h.image}
                      alt={h.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-950/80 text-white backdrop-blur-md">
                      {h.type}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-rose-300 transition-colors">
                        {h.name}
                      </h3>
                      <p className="text-xs text-rose-400 font-bold mt-0.5">{h.pricePerSemester}</p>
                    </div>

                    <p className="text-xs text-neutral-400 font-medium">Capacity: {h.capacity}</p>

                    <div className="space-y-1.5 pt-2 border-t border-neutral-800">
                      {h.amenities.map((a, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-neutral-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-2.5 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-xs font-bold text-neutral-200 transition-colors"
                  >
                    View Room Options
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. STUDENT SUPPORT & GUIDANCE SERVICES ── */}
        <section id="services" className="scroll-mt-36">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-neutral-800 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#A51C30]">
                Holistic Care
              </span>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight mt-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Student Support & Guidance Services
              </h2>
              <p className="text-sm text-neutral-400 mt-2 max-w-xl">
                Dedicated directorates ensuring your well-being, accessibility, academic advising, and career trajectory.
              </p>
            </div>
            <button
              onClick={() => navigate('/contact')}
              className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors border border-white/10"
            >
              Contact Student Affairs
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {campusServices.map((srv) => (
              <div
                key={srv.id}
                className="p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-white">{srv.title}</h3>
                  <p className="text-sm text-neutral-300 leading-relaxed font-light">{srv.desc}</p>
                </div>
                <div className="pt-6 mt-6 border-t border-neutral-800 text-xs space-y-1.5 text-neutral-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{srv.location}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium text-neutral-200">
                    <Phone className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{srv.contact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. HEALTH & WELLNESS ── */}
        <section id="health" className="scroll-mt-36">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-neutral-800 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#A51C30]">
                24/7 Medical Directorate
              </span>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight mt-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Health & Wellness
              </h2>
              <p className="text-sm text-neutral-400 mt-2 max-w-xl">
                Round-the-clock acute medical care, counseling, psychological support, and health promotion for the university community.
              </p>
            </div>
            <div className="p-3 px-4 rounded-2xl bg-rose-950/40 border border-rose-900/50 text-rose-300 text-xs font-bold flex items-center gap-2">
              <Phone className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Campus Ambulance Hotline: +233 30 277 1911</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {healthWellness.map((h) => (
              <div
                key={h.id}
                className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 shadow-sm space-y-5"
              >
                <div>
                  <h3 className="font-bold text-xl text-white">{h.title}</h3>
                  <p className="text-xs text-emerald-400 font-bold mt-1">{h.hours}</p>
                </div>

                <p className="text-sm text-neutral-300 leading-relaxed font-light">{h.desc}</p>

                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Available Medical Services</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {h.services.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 text-xs flex items-center justify-between text-neutral-400">
                  <span>Emergency Line: <strong className="text-white">{h.emergencyPhone}</strong></span>
                  <span className="text-emerald-400 font-semibold">Free for Enrolled Students</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 7. SPORTS & RECREATION ── */}
        <section id="sports" className="scroll-mt-36">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-neutral-800 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#A51C30]">
                Athletic Excellence
              </span>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight mt-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Sports & Recreation
              </h2>
              <p className="text-sm text-neutral-400 mt-2 max-w-xl">
                World-class sporting pavilions, Olympic aquatics, river rowing regattas, and intramural competitions.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {sports.map((s) => (
              <div
                key={s.id}
                className="group rounded-3xl overflow-hidden bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all hover:shadow-xl"
              >
                <div className="aspect-[16/9] overflow-hidden relative">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-black/70 text-white backdrop-blur-md">
                    {s.facility}
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <h3 className="font-bold text-xl text-white group-hover:text-rose-300 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-sm text-neutral-300 leading-relaxed font-light">{s.desc}</p>

                  <div className="pt-2 border-t border-neutral-800 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Varsity & Club Teams</p>
                    <div className="flex flex-wrap gap-2">
                      {s.teams.map((t, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-neutral-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 8. CLUBS & SOCIETIES ── */}
        <section id="clubs" className="scroll-mt-36">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-neutral-800 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#A51C30]">
                Student Societies
              </span>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight mt-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Student Clubs & Organizations
              </h2>
              <p className="text-sm text-neutral-400 mt-2 max-w-xl">
                Explore your passions, debate global affairs, pioneer tech ventures, and create lifelong bonds across 120+ active organizations.
              </p>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-rose-950/60 border border-rose-900/50 text-rose-300 text-xs font-bold self-start md:self-auto">
              Over 120+ Registered Societies
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clubs.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between hover:shadow-lg"
              >
                <div className="space-y-3">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-rose-300">
                    {c.category}
                  </span>
                  <h3 className="font-bold text-base text-white">{c.name}</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light">{c.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-800 text-xs space-y-1 text-neutral-400">
                  <p className="font-medium text-rose-400">{c.memberCount}</p>
                  <p className="text-[11px]">Led by: {c.lead}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default CampusLifePage;
