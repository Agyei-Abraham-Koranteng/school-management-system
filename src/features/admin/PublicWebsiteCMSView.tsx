import React, { useState, useEffect } from 'react';
import {
  Globe,
  BookOpen,
  GraduationCap,
  Calendar,
  Building,
  Activity,
  Trophy,
  Users,
  Microscope,
  FileText,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Home,
  Phone,
  MessageSquare,
  Image,
  Award,
  Layers
} from 'lucide-react';
import {
  usePublicContent,
  ProgramItem,
  ScholarshipItem,
  HousingItem,
  StudentClubItem,
  PublicationItem,
  ResearchGrantItem,
  TestimonialItem,
  ContactOfficeItem
} from '../../context/PublicContentContext';
import { useToast } from '../../context/ToastContext';

export const PublicWebsiteCMSView: React.FC = () => {
  const {
    homePage,
    updateHomePage,
    contactPage,
    updateContactPage,
    siteSettings,
    updateSiteSettings,
    programs,
    addProgram,
    updateProgram,
    deleteProgram,
    academicCalendar,
    addCalendarEvent,
    deleteCalendarEvent,
    admissionSteps,
    keyDates,
    updateAdmissionKeyDate,
    entryRequirements,
    updateEntryRequirement,
    scholarships,
    addScholarship,
    deleteScholarship,
    housing,
    addHousingItem,
    deleteHousingItem,
    campusServices,
    updateCampusService,
    healthWellness,
    sports,
    clubs,
    addClub,
    deleteClub,
    researchCentres,
    updateResearchCentre,
    publications,
    addPublication,
    deletePublication,
    industryPartners,
    innovationHubProjects,
    researchGrants,
    addResearchGrant,
    deleteResearchGrant,
    resetToDefaults,
  } = usePublicContent();

  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'home' | 'programs' | 'calendar' | 'admissions' | 'campus_life' | 'research' | 'contact'>(() => {
    try {
      const saved = localStorage.getItem('premier_cms_active_subtab');
      if (saved && ['home', 'programs', 'calendar', 'admissions', 'campus_life', 'research', 'contact'].includes(saved)) {
        return saved as any;
      }
    } catch {}
    return 'home';
  });

  useEffect(() => {
    try {
      localStorage.setItem('premier_cms_active_subtab', activeTab);
    } catch {}
  }, [activeTab]);

  // Modals state
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [newProgram, setNewProgram] = useState<Omit<ProgramItem, 'id'>>({
    name: '',
    level: 'undergraduate',
    faculty: 'Faculty of Computing & Information Technology',
    years: 4,
    credits: 130,
    description: '',
  });

  const [showAddScholarship, setShowAddScholarship] = useState(false);
  const [newScholarship, setNewScholarship] = useState<Omit<ScholarshipItem, 'id'>>({
    name: '',
    coverage: '100% Tuition',
    eligibility: '',
    deadline: 'April 30 annually',
    description: '',
  });

  const [showAddClub, setShowAddClub] = useState(false);
  const [newClub, setNewClub] = useState<Omit<StudentClubItem, 'id'>>({
    name: '',
    category: 'Technology & Innovation',
    lead: '',
    memberCount: '100+ Members',
    desc: '',
  });

  const [showAddPub, setShowAddPub] = useState(false);
  const [newPub, setNewPub] = useState<Omit<PublicationItem, 'id'>>({
    title: '',
    journal: 'Nature Biotechnology · 2026',
    authors: '',
    year: 2026,
  });

  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState<Omit<TestimonialItem, 'id'>>({
    name: '',
    role: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    quote: '',
  });

  // Action handlers
  const handleSaveHomeHero = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Home page hero settings successfully synchronized live!', 'success');
  };

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgram.name) return;
    addProgram(newProgram);
    setShowAddProgram(false);
    setNewProgram({
      name: '',
      level: 'undergraduate',
      faculty: 'Faculty of Computing & Information Technology',
      years: 4,
      credits: 130,
      description: '',
    });
    showToast('Academic program published live on website!', 'success');
  };

  const handleCreateScholarship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScholarship.name) return;
    addScholarship(newScholarship);
    setShowAddScholarship(false);
    setNewScholarship({
      name: '',
      coverage: '100% Tuition',
      eligibility: '',
      deadline: 'April 30 annually',
      description: '',
    });
    showToast('Scholarship scheme published live on Admissions page!', 'success');
  };

  const handleCreateClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClub.name) return;
    addClub(newClub);
    setShowAddClub(false);
    setNewClub({
      name: '',
      category: 'Technology & Innovation',
      lead: '',
      memberCount: '100+ Members',
      desc: '',
    });
    showToast('Student club published live on Campus Life page!', 'success');
  };

  const handleCreatePub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPub.title) return;
    addPublication(newPub);
    setShowAddPub(false);
    setNewPub({
      title: '',
      journal: 'Nature Biotechnology · 2026',
      authors: '',
      year: 2026,
    });
    showToast('Landmark publication added live to Research page!', 'success');
  };

  const handleCreateTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.name || !newTestimonial.quote) return;
    const newId = 'test-' + Date.now();
    updateHomePage({
      testimonials: [...homePage.testimonials, { ...newTestimonial, id: newId }]
    });
    setShowAddTestimonial(false);
    setNewTestimonial({
      name: '',
      role: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      quote: '',
    });
    showToast('Student testimonial published live on Home page!', 'success');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset all public pages to default institutional records? All custom live edits will be restored.')) {
      resetToDefaults();
      showToast('All public pages successfully restored to defaults', 'info');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-neutral-900 via-indigo-950 to-neutral-900 text-white border border-indigo-900/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Real-Time Public Web Engine · Every Detail is Editable</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
            <Globe className="w-7 h-7 text-indigo-400" />
            Public Website & Portal Content Manager
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl leading-relaxed">
            Modify any page or text element across the public platform. Changes instantly update the live experience without rebuilding the application.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-neutral-100 transition-all flex items-center gap-2 shadow-sm"
          >
            Open Live Website
            <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
          </a>
          <button
            onClick={handleResetDefaults}
            className="p-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
            title="Restore Defaults"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Directorate Page Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
        {[
          { id: 'home', label: '1. Home Page', icon: Home },
          { id: 'programs', label: '2. Academics & Degrees', icon: BookOpen },
          { id: 'calendar', label: '3. Academic Calendar', icon: Calendar },
          { id: 'admissions', label: '4. Admissions & Aid', icon: GraduationCap },
          { id: 'campus_life', label: '5. Campus Life & Housing', icon: Building },
          { id: 'research', label: '6. Research & Innovation', icon: Microscope },
          { id: 'contact', label: '7. Contact & Offices', icon: Phone },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-indigo-400'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ── 1. HOME PAGE CMS ── */}
      {activeTab === 'home' && (
        <div className="space-y-8">
          {/* Hero Section Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">Hero Section Content</h3>
                <p className="text-xs text-neutral-500">Edit headline, announcement pill, subheader, and imagery</p>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                Live on Homepage
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Top Announcement Badge</label>
                <input
                  type="text"
                  value={homePage.heroBadge}
                  onChange={e => updateHomePage({ heroBadge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Headline Prefix</label>
                <input
                  type="text"
                  value={homePage.heroTitle}
                  onChange={e => updateHomePage({ heroTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Headline Gradient Word</label>
                <input
                  type="text"
                  value={homePage.heroHighlight}
                  onChange={e => updateHomePage({ heroHighlight: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm font-bold text-indigo-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Hero Subtitle</label>
                <textarea
                  rows={2}
                  value={homePage.heroSubtitle}
                  onChange={e => updateHomePage({ heroSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Hero Background Image URL</label>
                <input
                  type="text"
                  value={homePage.heroImage}
                  onChange={e => updateHomePage({ heroImage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Apply Button Text</label>
                <input
                  type="text"
                  value={homePage.heroApplyBtn}
                  onChange={e => updateHomePage({ heroApplyBtn: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Portal Button Text</label>
                <input
                  type="text"
                  value={homePage.heroPortalBtn}
                  onChange={e => updateHomePage({ heroPortalBtn: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                />
              </div>
            </div>
          </div>

          {/* About Section Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">About & Institutional Story</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">About Section Overline</label>
                <input
                  type="text"
                  value={homePage.aboutBadge}
                  onChange={e => updateHomePage({ aboutBadge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">About Headline</label>
                <input
                  type="text"
                  value={homePage.aboutTitle}
                  onChange={e => updateHomePage({ aboutTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Historical Narrative (Paragraph 1)</label>
                <textarea
                  rows={2}
                  value={homePage.aboutParagraph1}
                  onChange={e => updateHomePage({ aboutParagraph1: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Campus Ecosystem (Paragraph 2)</label>
                <textarea
                  rows={2}
                  value={homePage.aboutParagraph2}
                  onChange={e => updateHomePage({ aboutParagraph2: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Campus Photo URL</label>
                <input
                  type="text"
                  value={homePage.aboutImage}
                  onChange={e => updateHomePage({ aboutImage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Floating Badge Title</label>
                <input
                  type="text"
                  value={homePage.aboutFloatingBadgeTitle}
                  onChange={e => updateHomePage({ aboutFloatingBadgeTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Testimonials Editor */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">Student Voices & Testimonials</h3>
                <p className="text-xs text-neutral-500">Live testimonials rendered on the homepage</p>
              </div>
              <button
                onClick={() => setShowAddTestimonial(true)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Testimonial
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {homePage.testimonials.map((t) => (
                <div key={t.id} className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3 flex flex-col justify-between">
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 italic line-clamp-3">"{t.quote}"</p>
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
                    <div>
                      <p className="font-bold text-xs text-neutral-900 dark:text-white">{t.name}</p>
                      <p className="text-[10px] text-neutral-500">{t.role}</p>
                    </div>
                    <button
                      onClick={() => {
                        updateHomePage({
                          testimonials: homePage.testimonials.filter(item => item.id !== t.id)
                        });
                        showToast('Testimonial removed from homepage', 'info');
                      }}
                      className="p-1 text-neutral-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 2. ACADEMICS & DEGREES CMS ── */}
      {activeTab === 'programs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-neutral-900 dark:text-white">Academic Degrees & Programs Catalog</h2>
              <p className="text-xs text-neutral-500">Live programs on /programs and the footer links</p>
            </div>
            <button
              onClick={() => setShowAddProgram(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Program
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {prog.level}
                    </span>
                    <span className="text-xs font-semibold text-neutral-400">{prog.years} Years · {prog.credits} Cr</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-neutral-900 dark:text-white">{prog.name}</h3>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">{prog.faculty}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 line-clamp-2 leading-relaxed">{prog.description}</p>
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      const newTitle = prompt('Edit program title:', prog.name);
                      if (newTitle) {
                        updateProgram({ ...prog, name: newTitle });
                        showToast('Program updated live!', 'success');
                      }
                    }}
                    className="text-xs text-indigo-600 font-bold hover:underline"
                  >
                    Edit Title
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete ${prog.name}?`)) {
                        deleteProgram(prog.id);
                        showToast('Program removed from live catalog', 'info');
                      }
                    }}
                    className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. ACADEMIC CALENDAR CMS ── */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-neutral-900 dark:text-white">Academic Calendar & Milestones</h2>
              <p className="text-xs text-neutral-500">Live milestones rendered on /programs#calendar</p>
            </div>
            <button
              onClick={() => {
                const title = prompt('Enter Milestone Title (e.g. Matriculation Ceremony):');
                if (!title) return;
                const dateRange = prompt('Enter Date Range (e.g. Nov 10, 2026):', 'Nov 10, 2026') || '';
                addCalendarEvent({
                  title,
                  dateRange,
                  semester: 'First Semester 2026/2027',
                  type: 'registration',
                  description: 'Mandatory academic milestone.',
                });
                showToast('Milestone added to live Academic Calendar', 'success');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Calendar Event
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800">
            {academicCalendar.map((event) => (
              <div key={event.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    {event.type}
                  </span>
                  <h3 className="font-extrabold text-sm text-neutral-900 dark:text-white">{event.title}</h3>
                  <p className="text-xs text-neutral-500">{event.description}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-xl">
                    {event.dateRange}
                  </span>
                  <button
                    onClick={() => {
                      deleteCalendarEvent(event.id);
                      showToast('Calendar event deleted', 'info');
                    }}
                    className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 4. ADMISSIONS & AID CMS ── */}
      {activeTab === 'admissions' && (
        <div className="space-y-8">
          {/* Key Dates editor */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">Admission Dates & Deadlines</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {keyDates.map((kd) => (
                <div key={kd.id} className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{kd.date}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${kd.badge}`}>{kd.status}</span>
                  </div>
                  <p className="font-bold text-xs text-neutral-900 dark:text-white">{kd.event}</p>
                  <button
                    onClick={() => {
                      const newStatus = kd.status === 'Open Now' ? 'Passed' : kd.status === 'Passed' ? 'Upcoming' : 'Open Now';
                      const newBadge = newStatus === 'Open Now'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : newStatus === 'Passed'
                        ? 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300';
                      updateAdmissionKeyDate({ ...kd, status: newStatus as any, badge: newBadge });
                      showToast(`Deadline status updated to ${newStatus} live!`, 'success');
                    }}
                    className="w-full mt-2 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 transition-colors"
                  >
                    Toggle Status ({kd.status})
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Scholarships Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">Scholarships & Financial Aid Schemes</h3>
                <p className="text-xs text-neutral-500">Live listings on /admissions#scholarships</p>
              </div>
              <button
                onClick={() => setShowAddScholarship(true)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Scholarship
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {scholarships.map((sch) => (
                <div key={sch.id} className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white">{sch.name}</h4>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {sch.coverage}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{sch.description}</p>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-300 font-semibold mt-2">Eligibility: {sch.eligibility}</p>
                  </div>
                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                    <span>Deadline: <strong className="text-neutral-700 dark:text-neutral-300">{sch.deadline}</strong></span>
                    <button
                      onClick={() => {
                        deleteScholarship(sch.id);
                        showToast('Scholarship removed', 'info');
                      }}
                      className="p-1 text-neutral-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 5. CAMPUS LIFE CMS ── */}
      {activeTab === 'campus_life' && (
        <div className="space-y-8">
          {/* Housing Editor */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">Residential Halls & Rates</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {housing.map((h) => (
                <div key={h.id} className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-indigo-600">{h.type}</span>
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{h.pricePerSemester}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white">{h.name}</h4>
                  <p className="text-xs text-neutral-500">Capacity: {h.capacity}</p>
                  <button
                    onClick={() => {
                      const newRate = prompt(`Enter new semester rate for ${h.name}:`, h.pricePerSemester);
                      if (newRate) {
                        usePublicContent().updateHousingItem({ ...h, pricePerSemester: newRate });
                        showToast('Residential rate updated live!', 'success');
                      }
                    }}
                    className="w-full mt-2 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 text-[11px] font-semibold text-indigo-600"
                  >
                    Edit Rate ({h.pricePerSemester})
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Clubs Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">Student Societies & Clubs</h3>
                <p className="text-xs text-neutral-500">Live listings on /campus-life#clubs</p>
              </div>
              <button
                onClick={() => setShowAddClub(true)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Student Club
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {clubs.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">{c.category}</span>
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">{c.name}</h4>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{c.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                    <span className="font-semibold text-indigo-600">{c.memberCount}</span>
                    <button
                      onClick={() => {
                        deleteClub(c.id);
                        showToast('Club removed', 'info');
                      }}
                      className="p-1 text-neutral-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 6. RESEARCH CMS ── */}
      {activeTab === 'research' && (
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">Research Centres & Funding Pools</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {researchCentres.map((rc) => (
                <div key={rc.id} className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase">{rc.tag}</span>
                    <span className="text-xs font-bold text-emerald-600">{rc.grants}</span>
                  </div>
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white">{rc.title}</h4>
                  <p className="text-xs text-neutral-500">Director: {rc.director}</p>
                  <button
                    onClick={() => {
                      const newGrants = prompt(`Update external grants for ${rc.title}:`, rc.grants);
                      if (newGrants) {
                        updateResearchCentre({ ...rc, grants: newGrants });
                        showToast('Research funding updated live!', 'success');
                      }
                    }}
                    className="w-full mt-2 py-1 rounded-lg border border-neutral-200 text-[11px] font-semibold text-indigo-600"
                  >
                    Edit Grants ({rc.grants})
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">Landmark Publications Directory</h3>
                <p className="text-xs text-neutral-500">Peer-reviewed articles live on /research#publications</p>
              </div>
              <button
                onClick={() => setShowAddPub(true)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Publication
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800">
              {publications.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-600">{p.journal}</span>
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">{p.title}</h4>
                    <p className="text-xs text-neutral-500">{p.authors}</p>
                  </div>
                  <button
                    onClick={() => {
                      deletePublication(p.id);
                      showToast('Publication removed', 'info');
                    }}
                    className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 7. CONTACT & OFFICES CMS ── */}
      {activeTab === 'contact' && (
        <div className="space-y-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">Campus Location & Emergency Contacts</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Campus Physical Address</label>
                <input
                  type="text"
                  value={contactPage.campusAddress}
                  onChange={e => updateContactPage({ campusAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Digital Postal Code / GPS</label>
                <input
                  type="text"
                  value={contactPage.digitalAddress}
                  onChange={e => updateContactPage({ digitalAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Airport Distance / Proximity Note</label>
                <input
                  type="text"
                  value={contactPage.airportProximity}
                  onChange={e => updateContactPage({ airportProximity: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Emergency Title</label>
                <input
                  type="text"
                  value={contactPage.emergencyTitle}
                  onChange={e => updateContactPage({ emergencyTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">24/7 Ambulance & Police Hotline</label>
                <input
                  type="text"
                  value={contactPage.emergencyHotline}
                  onChange={e => updateContactPage({ emergencyHotline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm font-bold text-red-600"
                />
              </div>
            </div>
          </div>

          {/* Departmental Offices List */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">Departmental Offices Directory</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {contactPage.offices.map((office) => (
                <div key={office.id} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2">
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white">{office.title}</h4>
                  <p className="text-xs text-indigo-600 font-medium">{office.lead}</p>
                  <p className="text-xs text-neutral-500">{office.location}</p>
                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 text-xs flex items-center justify-between">
                    <span className="font-semibold">{office.phone}</span>
                    <button
                      onClick={() => {
                        const newPhone = prompt(`Update phone for ${office.title}:`, office.phone);
                        if (newPhone) {
                          updateContactPage({
                            offices: contactPage.offices.map(o => o.id === office.id ? { ...o, phone: newPhone } : o)
                          });
                          showToast('Phone number updated live!', 'success');
                        }
                      }}
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      Edit Phone
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      {/* Add Program Modal */}
      {showAddProgram && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-extrabold text-lg text-neutral-900 dark:text-white">Add Academic Degree / Program</h3>
              <button onClick={() => setShowAddProgram(false)} className="text-neutral-400 hover:text-neutral-600">✕</button>
            </div>
            <form onSubmit={handleCreateProgram} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Degree Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BSc Artificial Intelligence"
                  value={newProgram.name}
                  onChange={e => setNewProgram({ ...newProgram, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Level</label>
                  <select
                    value={newProgram.level}
                    onChange={e => setNewProgram({ ...newProgram, level: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                  >
                    <option value="undergraduate">Undergraduate</option>
                    <option value="postgraduate">Postgraduate</option>
                    <option value="doctoral">Doctoral</option>
                    <option value="short-courses">Short Courses</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Duration (Years)</label>
                  <input
                    type="number"
                    value={newProgram.years}
                    onChange={e => setNewProgram({ ...newProgram, years: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Faculty</label>
                <select
                  value={newProgram.faculty}
                  onChange={e => setNewProgram({ ...newProgram, faculty: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                >
                  <option value="Faculty of Computing & Information Technology">Faculty of Computing & IT</option>
                  <option value="Faculty of Pure & Applied Sciences">Faculty of Pure & Applied Sciences</option>
                  <option value="Premier Business School">Premier Business School</option>
                  <option value="College of Health Sciences">College of Health Sciences</option>
                  <option value="Faculty of Engineering">Faculty of Engineering</option>
                  <option value="Faculty of Humanities & Social Sciences">Faculty of Humanities</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summary of curriculum and outcomes..."
                  value={newProgram.description}
                  onChange={e => setNewProgram({ ...newProgram, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm resize-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProgram(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-500"
                >
                  Publish Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Scholarship Modal */}
      {showAddScholarship && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-extrabold text-lg text-neutral-900 dark:text-white">Add Scholarship Scheme</h3>
              <button onClick={() => setShowAddScholarship(false)} className="text-neutral-400 hover:text-neutral-600">✕</button>
            </div>
            <form onSubmit={handleCreateScholarship} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Scheme Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master's Innovation Fellowship"
                  value={newScholarship.name}
                  onChange={e => setNewScholarship({ ...newScholarship, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Coverage</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50% Tuition Relief"
                    value={newScholarship.coverage}
                    onChange={e => setNewScholarship({ ...newScholarship, coverage: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Deadline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. May 30 annually"
                    value={newScholarship.deadline}
                    onChange={e => setNewScholarship({ ...newScholarship, deadline: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Minimum CGPA 3.50 with community service leadership"
                  value={newScholarship.eligibility}
                  onChange={e => setNewScholarship({ ...newScholarship, eligibility: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={newScholarship.description}
                  onChange={e => setNewScholarship({ ...newScholarship, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm resize-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddScholarship(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
                >
                  Publish Scholarship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Testimonial Modal */}
      {showAddTestimonial && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-extrabold text-lg text-neutral-900 dark:text-white">Add Student Voice / Testimonial</h3>
              <button onClick={() => setShowAddTestimonial(false)} className="text-neutral-400 hover:text-neutral-600">✕</button>
            </div>
            <form onSubmit={handleCreateTestimonial} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Student / Alumni Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kwame Boakye"
                  value={newTestimonial.name}
                  onChange={e => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Role / Degree & Class Year</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BSc Computer Science, Class of 2025"
                  value={newTestimonial.role}
                  onChange={e => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={newTestimonial.avatar}
                  onChange={e => setNewTestimonial({ ...newTestimonial, avatar: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Quote</label>
                <textarea
                  rows={3}
                  required
                  placeholder="What was their transformative university experience?"
                  value={newTestimonial.quote}
                  onChange={e => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm resize-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTestimonial(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
                >
                  Publish Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Club Modal */}
      {showAddClub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-extrabold text-lg text-neutral-900 dark:text-white">Register Student Society / Club</h3>
              <button onClick={() => setShowAddClub(false)} className="text-neutral-400 hover:text-neutral-600">✕</button>
            </div>
            <form onSubmit={handleCreateClub} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Club / Society Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Premier Robotics & Drone Club"
                  value={newClub.name}
                  onChange={e => setNewClub({ ...newClub, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Technology & Robotics"
                    value={newClub.category}
                    onChange={e => setNewClub({ ...newClub, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Student Lead</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yaw Poku (Level 300)"
                    value={newClub.lead}
                    onChange={e => setNewClub({ ...newClub, lead: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={newClub.desc}
                  onChange={e => setNewClub({ ...newClub, desc: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm resize-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddClub(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
                >
                  Register Society
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Publication Modal */}
      {showAddPub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-extrabold text-lg text-neutral-900 dark:text-white">Add Landmark Publication</h3>
              <button onClick={() => setShowAddPub(false)} className="text-neutral-400 hover:text-neutral-600">✕</button>
            </div>
            <form onSubmit={handleCreatePub} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Paper Title</label>
                <input
                  type="text"
                  required
                  value={newPub.title}
                  onChange={e => setNewPub({ ...newPub, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Journal & Year</label>
                  <input
                    type="text"
                    required
                    value={newPub.journal}
                    onChange={e => setNewPub({ ...newPub, journal: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Authors</label>
                  <input
                    type="text"
                    required
                    value={newPub.authors}
                    onChange={e => setNewPub({ ...newPub, authors: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPub(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
                >
                  Publish to Research
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PublicWebsiteCMSView;
