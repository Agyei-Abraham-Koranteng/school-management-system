import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Youtube, ArrowRight } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const footerNavigation = [
    {
      category: 'Academics',
      links: [
        { label: 'Undergraduate Programs', href: '/programs?level=undergraduate' },
        { label: 'Postgraduate Programs', href: '/programs?level=postgraduate' },
        { label: 'Doctoral Studies', href: '/programs?level=doctoral' },
        { label: 'Short Courses', href: '/programs?level=short-courses' },
        { label: 'Academic Calendar', href: '/programs#calendar' },
      ],
    },
    {
      category: 'Admissions',
      links: [
        { label: 'How to Apply', href: '/apply' },
        { label: 'Entry Requirements', href: '/admissions#entry-requirements' },
        { label: 'Scholarships & Aid', href: '/admissions#scholarships' },
        { label: 'International Students', href: '/admissions#international' },
        { label: 'Transfer Admissions', href: '/admissions#transfer' },
      ],
    },
    {
      category: 'Campus Life',
      links: [
        { label: 'Student Services', href: '/campus-life#services' },
        { label: 'Housing & Residences', href: '/campus-life#housing' },
        { label: 'Health & Wellness', href: '/campus-life#health' },
        { label: 'Sports & Recreation', href: '/campus-life#sports' },
        { label: 'Student Clubs', href: '/campus-life#clubs' },
      ],
    },
    {
      category: 'Research',
      links: [
        { label: 'Research Centers', href: '/research#centres' },
        { label: 'Publications', href: '/research#publications' },
        { label: 'Industry Partnerships', href: '/research#partnerships' },
        { label: 'Innovation Hub', href: '/research#innovation-hub' },
        { label: 'Grants & Funding', href: '/research#grants' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter / X', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' },
  ];

  const handleLinkClick = (href: string) => {
    navigate(href);
    if (href.includes('#')) {
      const id = href.split('#')[1];
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-neutral-950 text-neutral-400 pt-16 pb-8 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 pb-12 border-b border-neutral-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { navigate('/'); window.scrollTo({ top: 0 }); }}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-extrabold text-white tracking-tight">Premier University</p>
                <p className="text-xs text-indigo-400 font-medium">Est. 1962 · Accra, Ghana</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-neutral-500">
              A premier institution of higher learning dedicated to academic excellence, transformative research, and the holistic development of global citizens.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>University Avenue, Legon Hill, Accra, Ghana (GA-234-5678)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>+233 30 277 1000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>info@premier.edu.gh</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-indigo-600 flex items-center justify-center transition-colors group"
                >
                  <Icon className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerNavigation.map(({ category, links }) => (
            <div key={category} className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-300">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className="text-xs text-neutral-500 hover:text-indigo-400 hover:underline transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
          <p>© {currentYear} Premier University. All rights reserved. Chartered by the National Accreditation Board.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/contact')} className="hover:text-neutral-400 transition-colors">Contact Registrar</button>
            <button onClick={() => navigate('/login')} className="hover:text-neutral-400 transition-colors">Staff & Student Portal</button>
            <button onClick={() => navigate('/admissions')} className="hover:text-neutral-400 transition-colors">Admissions Desk</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
