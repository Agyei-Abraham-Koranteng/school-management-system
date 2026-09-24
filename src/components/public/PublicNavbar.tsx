import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, ChevronRight } from 'lucide-react';

interface PublicNavbarProps {
  onLoginClick: () => void;
}

const NAV_LINKS = [
  { label: 'About', href: '/#about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Campus Life', href: '/campus-life' },
  { label: 'Research', href: '/research' },
  { label: 'Contact', href: '/contact' },
];

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ onLoginClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith('/#')) {
      // Navigate home then scroll
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
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md shadow-sm border-b border-neutral-200/60 dark:border-neutral-800/60'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <span className={`font-extrabold text-base tracking-tight transition-colors ${scrolled ? 'text-neutral-900 dark:text-white' : 'text-white'}`}>
                  Premier University
                </span>
                <p className={`text-[10px] font-medium transition-colors ${scrolled ? 'text-neutral-500 dark:text-neutral-400' : 'text-indigo-200'}`}>
                  Est. 1962 · Accra, Ghana
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    scrolled
                      ? 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={onLoginClick}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  scrolled
                    ? 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { navigate('/apply'); window.scrollTo({ top: 0 }); }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:scale-[1.02] transition-all"
              >
                Apply Now
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled
                  ? 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-white dark:bg-neutral-950 shadow-2xl transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6 space-y-4 pt-20">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
              <button
                onClick={() => { setMobileOpen(false); onLoginClick(); }}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Sign In to Portal
              </button>
              <button
                onClick={() => { setMobileOpen(false); navigate('/apply'); window.scrollTo({ top: 0 }); }}
                className="w-full px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-colors"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
