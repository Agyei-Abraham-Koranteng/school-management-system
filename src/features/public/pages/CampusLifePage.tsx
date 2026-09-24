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
  HelpCircle
} from 'lucide-react';
import { usePublicContent } from '../../../context/PublicContentContext';

export const CampusLifePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { campusServices, housing, healthWellness, sports, clubs } = usePublicContent();

  const [activeTab, setActiveTab] = useState<'all' | 'services' | 'housing' | 'health' | 'sports' | 'clubs'>('all');

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
      if (['services', 'housing', 'health', 'sports', 'clubs'].includes(id)) {
        setActiveTab(id as any);
      }
    }
  }, [location]);

  return (
    <div className="pt-24 pb-20 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* ── Page Hero ── */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-b from-indigo-950 via-neutral-950 to-neutral-950 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1600&auto=format&fit=crop&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-bold text-indigo-300 backdrop-blur-md mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Vibrant Campus Community</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            Life at <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">Premier University</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-300 leading-relaxed">
            More than just an education. Experience a world-class collegiate atmosphere with premier residences, championship athletics, holistic wellness, and over 120 student organizations.
          </p>

          {/* Quick Nav Anchors */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            {[
              { id: 'services', label: 'Student Services', icon: HeartHandshake },
              { id: 'housing', label: 'Housing & Residences', icon: Building },
              { id: 'health', label: 'Health & Wellness', icon: Activity },
              { id: 'sports', label: 'Sports & Recreation', icon: Trophy },
              { id: 'clubs', label: 'Clubs & Societies', icon: Users },
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
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-neutral-200 border border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        
        {/* ── 1. STUDENT SERVICES ── */}
        <section id="services" className="scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-neutral-200 dark:border-neutral-800 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Holistic Care</span>
              <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 flex items-center gap-3">
                <HeartHandshake className="w-8 h-8 text-indigo-600" />
                Student Support & Guidance Services
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Dedicated directorates ensuring your well-being, accessibility, and career acceleration.
              </p>
            </div>
            <button
              onClick={() => navigate('/contact')}
              className="self-start md:self-auto px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 transition-colors"
            >
              Contact Student Affairs
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {campusServices.map((srv) => (
              <div
                key={srv.id}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <h3 className="font-extrabold text-lg text-neutral-900 dark:text-white">{srv.title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{srv.desc}</p>
                </div>
                <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800 text-xs space-y-1.5 text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{srv.location}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium text-neutral-700 dark:text-neutral-300">
                    <Phone className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{srv.contact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 2. HOUSING & RESIDENCES ── */}
        <section id="housing" className="scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-neutral-200 dark:border-neutral-800 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Residential Life</span>
              <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 flex items-center gap-3">
                <Building className="w-8 h-8 text-indigo-600" />
                Housing & Residences
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Modern, safe, and community-centered collegiate living on and around Legon Hill campus.
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="self-start md:self-auto px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-colors shadow-sm"
            >
              Apply for Room Allocation
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {housing.map((h) => (
              <div
                key={h.id}
                className="group rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
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
                      <h3 className="font-extrabold text-base text-neutral-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                        {h.name}
                      </h3>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">{h.pricePerSemester}</p>
                    </div>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Capacity: {h.capacity}</p>

                    <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      {h.amenities.map((a, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-200 transition-colors"
                  >
                    View Room Options
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. HEALTH & WELLNESS ── */}
        <section id="health" className="scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-neutral-200 dark:border-neutral-800 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Medical Services</span>
              <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 flex items-center gap-3">
                <Activity className="w-8 h-8 text-emerald-600" />
                Health & Wellness
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                24/7 acute healthcare, counseling, and wellness clinics for students and staff.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-600" />
              <span>Campus Ambulance Hotline: +233 30 277 1911</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {healthWellness.map((h) => (
              <div
                key={h.id}
                className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5"
              >
                <div>
                  <h3 className="font-extrabold text-xl text-neutral-900 dark:text-white">{h.title}</h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">{h.hours}</p>
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{h.desc}</p>

                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Available Medical Services</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {h.services.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs flex items-center justify-between text-neutral-500">
                  <span>Emergency Line: <strong className="text-neutral-900 dark:text-white">{h.emergencyPhone}</strong></span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Free for Enrolled Students</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. SPORTS & RECREATION ── */}
        <section id="sports" className="scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-neutral-200 dark:border-neutral-800 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Athletics</span>
              <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 flex items-center gap-3">
                <Trophy className="w-8 h-8 text-amber-500" />
                Sports & Recreation
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                World-class sporting venues, varsity championships, and active recreation programs.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {sports.map((s) => (
              <div
                key={s.id}
                className="group rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="aspect-[16/9] overflow-hidden relative">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-neutral-950/80 text-white backdrop-blur-md">
                    {s.facility}
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <h3 className="font-extrabold text-xl text-neutral-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{s.desc}</p>

                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Varsity & Club Teams</p>
                    <div className="flex flex-wrap gap-2">
                      {s.teams.map((t, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
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

        {/* ── 5. CLUBS & SOCIETIES ── */}
        <section id="clubs" className="scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-neutral-200 dark:border-neutral-800 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Student Voice & Passions</span>
              <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 flex items-center gap-3">
                <Users className="w-8 h-8 text-indigo-600" />
                Student Clubs & Organizations
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Explore your interests, gain leadership experience, and create lasting friendships.
              </p>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold self-start md:self-auto">
              Over 120+ Registered Societies
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clubs.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    {c.category}
                  </span>
                  <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">{c.name}</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{c.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs space-y-1 text-neutral-500">
                  <p className="font-medium text-indigo-600 dark:text-indigo-400">{c.memberCount}</p>
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
