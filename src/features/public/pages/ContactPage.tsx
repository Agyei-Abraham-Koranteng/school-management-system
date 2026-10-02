import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  Compass,
  Globe,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Calendar,
  Navigation
} from 'lucide-react';
import { usePublicContent } from '../../../context/PublicContentContext';

// ─── Contact Hero Slideshow Data ────────────────────────────────────────────
interface ContactSlide {
  id: string;
  tag: string;
  headline: string;
  subhead: string;
  image: string;
  badge: string;
}

const CONTACT_SLIDES: ContactSlide[] = [
  {
    id: 'registry',
    tag: 'UNIVERSITY REGISTRY & INQUIRIES',
    headline: 'Connect with Premier University',
    subhead: 'Our academic registry, admissions counselors, faculty deans, and student affairs directorates are here to assist your collegiate journey.',
    image: '/images/campus-aerial.jpg',
    badge: 'Open Monday – Friday, 8:00 AM – 5:00 PM GMT'
  },
  {
    id: 'tours',
    tag: 'CAMPUS VISITS & TOURS',
    headline: 'Experience Our Historic Quad in Person',
    subhead: 'Join student-led walking tours through historic lecture halls, advanced robotics laboratories, residential houses, and the riverfront boathouse.',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&auto=format&fit=crop&q=85',
    badge: 'Daily Campus Walking Tours Available'
  },
  {
    id: 'emergency',
    tag: 'ROUND-THE-CLOCK ASSISTANCE',
    headline: 'Dedicated Support & Emergency Dispatch',
    subhead: '24/7 campus ambulance dispatch, mental health emergency counseling hotlines, and international student crisis support across all three campus hubs.',
    image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=1920&auto=format&fit=crop&q=85',
    badge: '24/7 Central Emergency Dispatch'
  }
];

export const ContactPage: React.FC = () => {
  const { contactPage } = usePublicContent();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'admissions',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const activeSlide = CONTACT_SLIDES[currentSlideIndex];

  // Auto-advance slideshow
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % CONTACT_SLIDES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen selection:bg-[#A51C30] selection:text-white">

      {/* ── 1. CINEMATIC CONTACT HERO SLIDESHOW ── */}
      <section className="relative min-h-[82vh] sm:min-h-[88vh] flex items-end justify-center overflow-hidden bg-neutral-950">
        
        {/* Full-bleed Slideshow Backgrounds with Smooth Crossfade */}
        {CONTACT_SLIDES.map((slide, idx) => (
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
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-16 sm:pb-20">
          <div className="max-w-4xl space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-700">

            {/* Pill & Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 border border-white/20 text-xs sm:text-sm font-semibold tracking-wider text-rose-300 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>{activeSlide.tag}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-neutral-300 border border-white/10">
                {activeSlide.badge}
              </span>
            </div>

            {/* Display Serif Headline */}
            <h1
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-white tracking-tight leading-[1.06] drop-shadow-2xl"
              style={{ fontFamily: "'Playfair Display', 'Newsreader', 'Libre Baskerville', Georgia, serif" }}
            >
              {activeSlide.headline}
            </h1>

            {/* Lead Subtitle */}
            <p
              className="text-lg sm:text-xl md:text-2xl text-neutral-100/95 max-w-3xl leading-relaxed sm:leading-relaxed font-light drop-shadow-md"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {activeSlide.subhead}
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <a
                href="#message-form"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('message-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-sm tracking-wide shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Send a Direct Message</span>
                <ArrowRight className="w-4 h-4 text-neutral-700" />
              </a>

              <a
                href="#offices"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('offices')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#A51C30] hover:bg-[#8f1829] text-white font-bold text-sm tracking-wide shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Departmental Directory</span>
              </a>

              <a
                href="#campus-visit"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('campus-visit')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/20 text-white font-semibold text-sm backdrop-blur-md transition-all"
              >
                <span>Plan a Campus Visit</span>
              </a>
            </div>

            {/* Slideshow Selector & Controls */}
            <div className="pt-8 sm:pt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-white/15">
              
              {/* Slide indicators / tabs */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {CONTACT_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
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
                  onClick={() => setCurrentSlideIndex((prev) => (prev === 0 ? CONTACT_SLIDES.length - 1 : prev - 1))}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % CONTACT_SLIDES.length)}
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

      {/* ── 2. EMERGENCY & ASSISTANCE BANNER ── */}
      <div className="bg-rose-950/60 border-y border-rose-900/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-rose-300 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
            <span className="font-bold">{contactPage.emergencyTitle}:</span>
            <span>24/7 Security & Medical Hotline</span>
          </div>
          <a
            href={`tel:${contactPage.emergencyHotline}`}
            className="px-3.5 py-1.5 rounded-xl bg-rose-900/80 hover:bg-rose-800 text-white font-mono font-bold tracking-wider transition-colors flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{contactPage.emergencyHotline}</span>
          </a>
        </div>
      </div>

      {/* ── 3. MAIN CONTACT & DIRECTORY AREA ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-32">

        {/* Message Form & Key Coordinates */}
        <section id="message-form" className="scroll-mt-36">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Interactive Inquiry Form (7 Cols) */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900/60 border border-neutral-800 shadow-2xl">
                <div className="mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#A51C30]">
                    Direct Correspondence
                  </span>
                  <h2
                    className="text-3xl sm:text-4xl font-normal text-white mt-1"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Send Us an Official Message
                  </h2>
                  <p className="text-xs text-neutral-400 mt-2">
                    Inquiries are routed directly to departmental directorates and responded to within 1 business day.
                  </p>
                </div>

                {submitted ? (
                  <div className="py-14 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-white">Message Dispatched Successfully</h3>
                      <p className="text-xs text-neutral-400 mt-2 max-w-sm mx-auto">
                        Thank you for contacting Premier University, {formData.name}. Our staff will review your message and reply to <span className="font-semibold text-rose-300">{formData.email}</span>.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-400 mb-1">Your Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Dr. / Mr. / Ms. Full Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-sm text-white focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-400 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="you@domain.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-sm text-white focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-400 mb-1">Phone Number (Optional)</label>
                        <input
                          type="tel"
                          placeholder="+233 ..."
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-sm text-white focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-400 mb-1">Department</label>
                        <select
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-sm text-white focus:outline-none focus:border-rose-500"
                        >
                          <option value="admissions">Undergraduate & Graduate Admissions</option>
                          <option value="registry">Academic Affairs & Registry</option>
                          <option value="finance">Bursary & Student Accounts</option>
                          <option value="research">Office of Research & Innovation</option>
                          <option value="student-affairs">Dean of Student Affairs & Housing</option>
                          <option value="international">International Students Office</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Subject</label>
                      <input
                        type="text"
                        required
                        placeholder="Nature of your inquiry..."
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-sm text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Detailed Message</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Please share specific details so we can route your ticket directly..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-sm text-white focus:outline-none focus:border-rose-500 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-[#A51C30] hover:bg-[#8f1829] text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>Transmit Message to Directorate</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right: Key University Coordinates (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#A51C30]">
                  Official Address
                </span>
                <h3
                  className="text-2xl font-normal text-white"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Premier University Campus
                </h3>

                <div className="space-y-4 text-xs text-neutral-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Main Campus:</strong>
                      <span>{contactPage.campusAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Navigation className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">GPS Digital Address:</strong>
                      <span>{contactPage.digitalAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Compass className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Airport Access:</strong>
                      <span>{contactPage.airportProximity}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Public Hours:</strong>
                      <span>Monday – Friday, 8:00 AM – 5:00 PM GMT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── 4. DEPARTMENTAL DIRECTORY ── */}
        <section id="offices" className="scroll-mt-36">
          <div className="space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A51C30]">
              Institutional Directory
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Principal Offices & Directorates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactPage.offices.map((office) => (
              <div
                key={office.id}
                className="p-7 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3
                    className="text-xl font-normal text-white"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {office.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">{office.location}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-800 space-y-1.5 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="font-mono">{office.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="font-mono text-neutral-400">{office.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default ContactPage;
