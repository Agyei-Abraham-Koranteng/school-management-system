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
  DollarSign
} from 'lucide-react';
import { usePublicContent } from '../../../context/PublicContentContext';

export const ResearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { researchCentres, publications, industryPartners, innovationHubProjects, researchGrants } = usePublicContent();

  const [activeCategory, setActiveCategory] = useState<string>('all');

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
    <div className="pt-24 pb-20 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* ── Page Hero ── */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-b from-indigo-950 via-neutral-950 to-neutral-950 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1600&auto=format&fit=crop&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-bold text-indigo-300 backdrop-blur-md mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Research & Innovation Directorate (ORID)</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5">
            Discoveries that <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">Transform Africa & The World</span>
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-neutral-300 leading-relaxed">
            Leading pan-African scientific inquiry, CRISPR gene therapeutics, indigenous language NLP, microgrid clean tech, and sovereign digital fintech innovation.
          </p>

          {/* Quick Nav Anchors */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            {[
              { id: 'centres', label: 'Research Centers' },
              { id: 'publications', label: 'Publications' },
              { id: 'partnerships', label: 'Industry Partnerships' },
              { id: 'innovation-hub', label: 'Innovation Hub' },
              { id: 'grants', label: 'Grants & Funding' },
            ].map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Metrics Strip */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { val: '$68M+', label: 'Active External Grants' },
              { val: `${publications.length}+`, label: 'Peer-Reviewed Articles' },
              { val: '34', label: 'International Patents' },
              { val: '120+', label: 'Global Research Partners' },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                <p className="text-2xl sm:text-3xl font-black text-white">{stat.val}</p>
                <p className="text-xs text-indigo-200 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        
        {/* ── 1. RESEARCH CENTRES ── */}
        <section id="centres" className="scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-200 dark:border-neutral-800 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Institutes of Excellence</span>
              <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">Research Centers</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Explore our state-of-the-art facilities and laboratories</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Fields' },
                { id: 'health', label: 'Health & Genomics' },
                { id: 'technology', label: 'AI & Computing' },
                { id: 'sustainability', label: 'Energy & Climate' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-indigo-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCentres.map((centre) => (
              <div
                key={centre.id}
                className="group rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={centre.image}
                      alt={centre.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-950/80 text-white backdrop-blur-md border border-white/20">
                        {centre.tag}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow-sm">
                        {centre.grants}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div>
                      <h3 className="font-extrabold text-lg text-neutral-900 dark:text-white group-hover:text-indigo-600 transition-colors leading-snug">
                        {centre.title}
                      </h3>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                        Lead: {centre.director}
                      </p>
                    </div>

                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {centre.description}
                    </p>

                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-1.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Key Focus Areas</p>
                      {centre.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full py-2.5 px-4 rounded-xl border border-indigo-200 dark:border-indigo-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    Partner or Inquire with Centre
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 2. PUBLICATIONS ── */}
        <section id="publications" className="scroll-mt-28">
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white">Peer-Reviewed Publications</h2>
                <p className="text-xs text-neutral-500">Breakthrough discoveries published in high-impact scientific journals</p>
              </div>
            </div>

            <div className="space-y-4 divide-y divide-neutral-100 dark:divide-neutral-800">
              {publications.map((pub, idx) => (
                <div key={pub.id} className={idx === 0 ? 'space-y-1' : 'pt-4 space-y-1'}>
                  <span className="inline-block text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {pub.journal}
                  </span>
                  <h4 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                    {pub.title}
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Authors: {pub.authors}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. INDUSTRY PARTNERSHIPS ── */}
        <section id="partnerships" className="scroll-mt-28">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Enterprise Alliances</span>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-indigo-600" />
              Industry Partnerships
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Collaborating with global industry titans and governmental agencies to accelerate technology commercialization.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industryPartners.map((partner) => (
              <div
                key={partner.id}
                className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    {partner.sector}
                  </span>
                  <h3 className="font-extrabold text-base text-neutral-900 dark:text-white mt-2">{partner.name}</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">{partner.collaboration}</p>
                </div>
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {partner.status}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. INNOVATION HUB ── */}
        <section id="innovation-hub" className="scroll-mt-28">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-950 via-neutral-900 to-indigo-950 text-white border border-indigo-900/50 shadow-xl space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Venture Incubation</span>
                <h2 className="text-3xl font-black mt-1 flex items-center gap-3">
                  <Rocket className="w-8 h-8 text-indigo-400" />
                  Premier University Innovation Hub
                </h2>
                <p className="text-sm text-neutral-300 mt-1 max-w-2xl">
                  Empowering student and faculty spin-outs with seed funding, venture mentorship, patent legal support, and prototyping labs.
                </p>
              </div>
              <button
                onClick={() => navigate('/contact')}
                className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-neutral-100 transition-colors shadow-sm"
              >
                Pitch an Innovation
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {innovationHubProjects.map((proj) => (
                <div key={proj.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200">
                      {proj.stage}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-white">{proj.name}</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">{proj.desc}</p>
                  <p className="text-[11px] text-indigo-300 font-semibold pt-1">Founder: {proj.founder}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. GRANTS & FUNDING ── */}
        <section id="grants" className="scroll-mt-28">
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white">Active Grants & Research Funding Pool</h2>
                  <p className="text-xs text-neutral-500">Major external endowments supporting scientific discovery</p>
                </div>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                $68M+ Total Research Capital
              </span>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {researchGrants.map((grant) => (
                <div key={grant.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                        {grant.status}
                      </span>
                      <span className="text-xs text-neutral-400">Funder: {grant.funder}</span>
                    </div>
                    <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white">{grant.title}</h3>
                    <p className="text-xs text-neutral-500">Award / Grant Horizon: {grant.deadline}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">{grant.amount}</p>
                    <span className="text-[11px] text-indigo-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate('/contact')}>
                      Request RFP Guidelines
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ResearchPage;
