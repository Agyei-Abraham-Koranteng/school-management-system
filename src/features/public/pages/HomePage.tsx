import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, BookOpen, Users, Award, ArrowRight, ChevronRight,
  Star, Globe, Microscope, Lightbulb, Building2, BarChart3,
  Sparkles, TrendingUp, ChevronDown, Quote, Shield
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

// ─── Home Page ───────────────────────────────────────────────────────────────
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { homePage } = usePublicContent();

  const goToAdmissions = () => {
    navigate('/apply');
    window.scrollTo({ top: 0 });
  };

  const highlightIcons = [Globe, Microscope, Award, BarChart3];

  return (
    <>
      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-neutral-950">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${homePage.heroImage}')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-neutral-950/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
        </div>

        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none animate-pulse" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-xs font-bold text-indigo-300 backdrop-blur-sm mb-8">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{homePage.heroBadge}</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6">
              {homePage.heroTitle}{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                {homePage.heroHighlight}
              </span>{' '}
              with Knowledge
            </h1>

            <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed mb-10 max-w-2xl">
              {homePage.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-16">
              <button
                onClick={goToAdmissions}
                className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.99] transition-all"
              >
                {homePage.heroApplyBtn}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-6 py-4 rounded-2xl border border-white/20 hover:border-white/40 text-white font-semibold text-base hover:bg-white/5 transition-all"
              >
                {homePage.heroPortalBtn}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/10">
              {homePage.heroStats.map(({ end, suffix, label }) => (
                <div key={label}>
                  <p className="text-3xl font-extrabold text-white">
                    <AnimatedCounter end={end} suffix={suffix} />
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <ChevronDown className="w-5 h-5 text-neutral-500" />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-24 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">
                  {homePage.aboutBadge}
                </p>
                <h2 className="text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white leading-tight">
                  {homePage.aboutTitle}
                </h2>
              </div>

              <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {homePage.aboutParagraph1}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {homePage.aboutParagraph2}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {homePage.aboutHighlights.map(({ title, desc }, idx) => {
                  const Icon = highlightIcons[idx % highlightIcons.length];
                  return (
                    <div key={title} className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mb-3 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                        <Icon className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <p className="font-bold text-sm text-neutral-900 dark:text-white">{title}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{desc}</p>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => { navigate('/programs'); window.scrollTo({ top: 0 }); }}
                className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline"
              >
                Explore our degree programs <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
                <img
                  src={homePage.aboutImage}
                  alt="University campus"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&auto=format&fit=crop',
                      ].map((src, i) => (
                        <img key={i} src={src} className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="Student" />
                      ))}
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">Over 28,000 enrolled scholars</p>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                        <span className="text-white/80 text-xs ml-1 font-semibold">{homePage.aboutRatingText}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 p-5 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-600/30 text-white max-w-[200px]">
                <BarChart3 className="w-8 h-8 mb-2 opacity-80" />
                <p className="text-2xl font-extrabold">{homePage.aboutFloatingBadgeTitle}</p>
                <p className="text-xs text-indigo-200 leading-tight">{homePage.aboutFloatingBadgeSub}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ── */}
      <section className="py-16 bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
            {homePage.statsBanner.map(({ end, suffix, label }, i) => {
              const icons = [Users, GraduationCap, Globe, TrendingUp];
              const Icon = icons[i % icons.length];
              return (
                <div key={label} className="space-y-2">
                  <Icon className="w-7 h-7 mx-auto text-indigo-200 mb-3" />
                  <p className="text-4xl font-extrabold">
                    <AnimatedCounter end={end} suffix={suffix} />
                  </p>
                  <p className="text-indigo-200 text-sm font-medium">{label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">Student Voices</p>
            <h2 className="text-4xl font-extrabold text-neutral-900 dark:text-white">What our community says</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {homePage.testimonials.map(({ id, name, role, avatar, quote }) => (
              <div key={id || name} className="p-7 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between">
                <div>
                  <Quote className="w-8 h-8 text-indigo-200 dark:text-indigo-800 mb-5" />
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6 italic">"{quote}"</p>
                </div>
                <div className="flex items-center gap-3 pt-5 border-t border-neutral-200 dark:border-neutral-800">
                  <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200 dark:border-indigo-800" />
                  <div>
                    <p className="font-bold text-sm text-neutral-900 dark:text-white">{name}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-6">
          <Shield className="w-12 h-12 text-indigo-200 mx-auto" />
          <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight">
            {homePage.ctaTitle}
          </h2>
          <p className="text-indigo-200 text-lg leading-relaxed">
            {homePage.ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={goToAdmissions}
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-700 font-extrabold text-base shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
            >
              {homePage.ctaApplyBtn}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/30 hover:border-white/60 text-white font-bold text-base hover:bg-white/10 transition-all"
            >
              {homePage.ctaPortalBtn}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
