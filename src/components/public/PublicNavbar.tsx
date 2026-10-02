import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, Search, Globe, Shield, ArrowUpRight } from 'lucide-react';
import { UniversityCrest } from './UniversityCrest';

interface PublicNavbarProps {
  onLoginClick: () => void;
}

const NAV_LINKS = [
  { label: 'Academics', href: '/programs' },
  { label: 'Admissions & Aid', href: '/admissions' },
  { label: 'Research', href: '/research' },
  { label: 'Campus Life', href: '/campus-life' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/contact' },
];

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ onLoginClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith('/#')) {
      navigate('/');
      setTimeout(() => {
        const id = href.replace('/#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(href);
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <>
      {/* ── TOP UTILITY & BREAKING NEWS TICKER (Harvard Style) ── */}
      <div className="bg-[#18181b]/95 text-white/90 text-[11px] sm:text-xs font-medium border-b border-white/10 relative z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
          {/* Breaking announcement with pulsing red dot (matches screenshot) */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
            </span>
            <a
              href="#research"
              onClick={(e) => {
                e.preventDefault();
                navigate('/research');
                window.scrollTo({ top: 0 });
              }}
              className="truncate hover:text-rose-200 transition-colors cursor-pointer group flex items-center gap-1.5"
            >
              <span className="font-semibold text-rose-300">University Action:</span>
              <span className="truncate">Learn about our lawsuits to protect our students and researchers</span>
              <ArrowUpRight className="w-3 h-3 text-rose-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
            </a>
          </div>

          {/* Quick Audience Links */}
          <div className="hidden md:flex items-center gap-5 text-neutral-300 shrink-0 text-[11px]">
            <span className="text-neutral-500">|</span>
            <Link to="/apply" className="hover:text-white transition-colors">Future Students</Link>
            <button onClick={onLoginClick} className="hover:text-white transition-colors">Faculty & Staff</button>
            <Link to="/research" className="hover:text-white transition-colors">Researchers</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Directory</Link>
          </div>
        </div>
      </div>

      {/* ── MAIN HARVARD-STYLE NAVIGATION BAR ── */}
      <nav
        className={`fixed top-8 sm:top-9 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-neutral-950/90 dark:bg-neutral-950/95 backdrop-blur-lg shadow-xl border-b border-neutral-800/80 py-2.5'
            : 'bg-gradient-to-b from-neutral-950/90 via-neutral-950/40 to-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Original Premier University Logo */}
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center group cursor-pointer"
            >
              <UniversityCrest
                size="md"
                theme="dark"
                universityName="Premier University"
                subtext="Est. 1962 · Accra, Ghana"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="px-3.5 py-2 rounded-lg text-xs xl:text-sm font-medium tracking-wide text-white/90 hover:text-white hover:bg-white/10 transition-all"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Action Buttons: Sign In / Apply */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={onLoginClick}
                className="px-4 py-2 rounded-xl text-xs xl:text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 border border-white/20 transition-all"
              >
                Sign In
              </button>

              <button
                onClick={() => { navigate('/apply'); window.scrollTo({ top: 0 }); }}
                className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-[#A51C30] hover:bg-[#8f1829] text-white text-xs xl:text-sm font-bold shadow-lg shadow-rose-950/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Apply for Admission</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={onLoginClick}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE FULL-SCREEN SLIDEOUT DRAWER ── */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-neutral-950 text-white border-l border-neutral-800 shadow-2xl transition-transform duration-300 flex flex-col justify-between p-6 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <UniversityCrest size="sm" theme="dark" universityName="Premier University" subtext="Est. 1962 · Accra, Ghana" />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="block w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium text-neutral-200 hover:bg-neutral-900 hover:text-white transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-3 pt-6 border-t border-neutral-800">
            <button
              onClick={() => { setMobileOpen(false); onLoginClick(); }}
              className="w-full py-3 rounded-xl border border-neutral-700 text-sm font-bold text-white hover:bg-neutral-900 transition-colors"
            >
              Sign In to SIS Portal
            </button>
            <button
              onClick={() => { setMobileOpen(false); navigate('/apply'); window.scrollTo({ top: 0 }); }}
              className="w-full py-3 rounded-xl bg-[#A51C30] hover:bg-[#8f1829] text-white text-sm font-bold transition-colors shadow-lg"
            >
              Apply for 2026/2027
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
