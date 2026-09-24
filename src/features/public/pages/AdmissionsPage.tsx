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
  Award,
  BookOpen,
  DollarSign,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { usePublicContent } from '../../../context/PublicContentContext';

export const AdmissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { keyDates, admissionSteps, entryRequirements, scholarships } = usePublicContent();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: '',
    level: 'undergraduate',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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
      q: 'Are scholarships and financial aid opportunities available?',
      a: 'Premier University awards merit-based scholarships covering up to 100% tuition, as well as need-based bursaries and work-study opportunities through the Dean of Student Affairs.',
    },
    {
      q: 'How does credit transfer work for transfer students?',
      a: 'Transfer applicants from accredited tertiary institutions with a minimum CGPA of 2.75 can transfer up to 50% of total degree credits upon departmental syllabus review.',
    },
  ];

  return (
    <div className="pt-24 pb-20 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* ── Page Hero ── */}
      <section className="relative py-16 lg:py-20 bg-gradient-to-b from-indigo-950 via-neutral-950 to-neutral-950 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-bold text-indigo-300 backdrop-blur-md mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>2026/2027 Admissions Open Globally</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            Admissions & <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">Enrollment</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-300 leading-relaxed">
            Begin your journey at Premier University. Explore application procedures, entry requirements, merit scholarships, and international student visas.
          </p>

          {/* Quick Nav Anchors */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            {[
              { id: 'how-to-apply', label: 'How to Apply' },
              { id: 'entry-requirements', label: 'Entry Requirements' },
              { id: 'scholarships', label: 'Scholarships & Aid' },
              { id: 'international', label: 'International Students' },
              { id: 'transfer', label: 'Transfer Admissions' },
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
        </div>
      </section>

      {/* ── Main Admissions Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        
        {/* ── 1. HOW TO APPLY ── */}
        <section id="how-to-apply" className="scroll-mt-28">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Application Pathway</span>
                <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">How to Apply</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                  Follow our four-step digital admissions pipeline designed for seamless application, document evaluation, and offer issuance.
                </p>
              </div>

              {/* Direct Application CTA */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-xl shadow-indigo-600/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-200">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Active Application Intake · 2026/2027</span>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white">Direct Online Application Portal</h3>
                  <p className="text-xs text-indigo-100 max-w-md">
                    Create your admissions account first to access the official application form, submit grades, and track your review status.
                  </p>
                </div>
                <Link
                  to="/apply"
                  className="px-5 py-3 rounded-xl bg-white text-indigo-700 font-extrabold text-xs sm:text-sm hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 shrink-0 shadow-md hover:scale-105"
                >
                  <span>Create Account & Apply</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {admissionSteps.map(({ num, title, desc, requirement }) => (
                  <div
                    key={num}
                    className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex gap-5 items-start"
                  >
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-md shadow-indigo-600/20">
                      {num}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h3 className="font-bold text-base text-neutral-900 dark:text-white">{title}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{desc}</p>
                      <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
                        <FileText className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Key requirement: {requirement}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Dates Schedule */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-neutral-900 dark:text-white">Key Admission Dates (Live)</h3>
                    <p className="text-xs text-neutral-500">Deadlines and announcement milestones</p>
                  </div>
                </div>

                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {keyDates.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">{item.event}</p>
                        <p className="text-xs text-neutral-400">{item.date}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${item.badge}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Direct Enquiry Form */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xl">
                <div className="mb-6">
                  <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                    Official Information Desk
                  </span>
                  <h3 className="text-xl font-black text-neutral-900 dark:text-white mt-2">
                    Request Admission Pack
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Receive prospectus, fee schedule, and scholarship guides directly to your inbox.
                  </p>
                </div>

                {submitted ? (
                  <div className="py-10 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-lg text-neutral-900 dark:text-white">Enquiry Dispatched!</h4>
                    <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                      Thank you, {formData.name}. Our admissions desk will send the complete academic package to <span className="font-semibold text-neutral-800 dark:text-neutral-200">{formData.email}</span>.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kwame Mensah"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="you@email.com"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="+233 XX XXX XXXX"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Study Level</label>
                      <select
                        value={formData.level}
                        onChange={e => setFormData({ ...formData, level: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="undergraduate">Undergraduate Degree (Bachelor's)</option>
                        <option value="postgraduate">Postgraduate Degree (Master's / MBA)</option>
                        <option value="doctoral">Doctoral Program (PhD / DBA)</option>
                        <option value="short-courses">Short Courses & Professional Certificates</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Program of Interest</label>
                      <input
                        type="text"
                        placeholder="e.g. BSc Computer Science, MBA, MBChB"
                        value={formData.program}
                        onChange={e => setFormData({ ...formData, program: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                    >
                      <Send className="w-4 h-4" />
                      Request Admissions Prospectus
                    </button>
                  </form>
                )}
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-tr from-indigo-900 to-violet-800 text-white shadow-md flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-base">Returning Applicant?</h4>
                  <p className="text-xs text-indigo-200 mt-0.5">Track your submitted application status.</p>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-xl bg-white text-indigo-900 font-bold text-xs hover:bg-neutral-100 transition-colors shrink-0 ml-4 shadow-sm"
                >
                  Applicant Portal
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. ENTRY REQUIREMENTS ── */}
        <section id="entry-requirements" className="scroll-mt-28">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Academic Criteria</span>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-600" />
              General Entry Requirements
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Accredited admission benchmarks established under the Ghana Tertiary Education Commission (GTEC).
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entryRequirements.map((er) => (
              <div
                key={er.id}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                    {er.level}
                  </span>
                  <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">{er.qualification}</h3>
                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-neutral-700/60 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    {er.minimumGrades}
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{er.details}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. SCHOLARSHIPS & AID ── */}
        <section id="scholarships" className="scroll-mt-28">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Financial Assistance</span>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-500" />
              Scholarships & Financial Aid
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Over GHS 45M awarded annually in academic merit fellowships, corporate endowments, and need-based bursaries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {scholarships.map((sch) => (
              <div
                key={sch.id}
                className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-extrabold text-lg text-neutral-900 dark:text-white">{sch.name}</h3>
                    <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 shrink-0">
                      {sch.coverage}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{sch.description}</p>
                  
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-neutral-700/60 text-xs space-y-1">
                    <p className="font-bold text-neutral-900 dark:text-white">Eligibility Guidelines:</p>
                    <p className="text-neutral-600 dark:text-neutral-300">{sch.eligibility}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Deadline: <strong className="text-neutral-900 dark:text-white">{sch.deadline}</strong></span>
                  <button
                    onClick={() => {
                      setFormData(prev => ({ ...prev, message: `Inquiring about ${sch.name}` }));
                      const formEl = document.getElementById('how-to-apply');
                      if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                  >
                    Apply for Award →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. INTERNATIONAL STUDENTS ── */}
        <section id="international" className="scroll-mt-28">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-900 via-neutral-900 to-indigo-950 text-white border border-indigo-800/50 shadow-xl space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Global Scholars</span>
              <h2 className="text-3xl font-extrabold mt-1 flex items-center gap-3">
                <Globe className="w-8 h-8 text-indigo-400" />
                International Students & Visa Assistance
              </h2>
              <p className="text-sm text-neutral-300 mt-2 max-w-2xl leading-relaxed">
                We proudly host scholars from over 48 countries. The International Student Office provides end-to-end guidance from airport pick-up to Ghana Immigration residence permits.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Visa & Immigration Clearance', desc: 'Official admission letters are recognized by Ghana diplomatic missions abroad for immediate student study visa issuance.' },
                { title: 'Foreign Credential Accreditation', desc: 'Our registry expedites foreign high school and degree equivalencies directly with the Ghana Tertiary Education Commission (GTEC).' },
                { title: 'Dedicated International House', desc: 'On-campus furnished living suites reserved specifically for international students and visiting exchange scholars.' },
              ].map((card, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2">
                  <h3 className="font-bold text-base text-white">{card.title}</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-indigo-300">Questions? Contact: international@premier.edu.gh · +233 30 277 1008</span>
              <button
                onClick={() => navigate('/contact')}
                className="px-6 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-neutral-100 transition-colors shadow-sm"
              >
                Speak with International Liaison
              </button>
            </div>
          </div>
        </section>

        {/* ── 5. TRANSFER ADMISSIONS ── */}
        <section id="transfer" className="scroll-mt-28">
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white">Transfer Admissions & Credit Articulation</h2>
                <p className="text-xs text-neutral-500">Transferring to Premier University from another university</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <div className="space-y-3">
                <h3 className="font-bold text-neutral-900 dark:text-white text-base">Transfer Eligibility Requirements</h3>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Candidate must have completed at least one full academic year (minimum 30 semester credits) at an accredited college or university.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Minimum cumulative GPA of 2.75 on a 4.0 scale (or equivalent Second Class Lower division).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Good disciplinary and academic standing without active administrative sanctions.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-neutral-900 dark:text-white text-base">Credit Articulation Guidelines</h3>
                <p className="text-xs leading-relaxed">
                  Premier University allows transfer of up to 50% of the total credits required for a degree. Course descriptions, syllabi, and official transcripts sent directly from the originating institution must be evaluated by the departmental admissions committee.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setFormData(prev => ({ ...prev, message: 'Transfer admission credit evaluation inquiry' }));
                      const el = document.getElementById('how-to-apply');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Initiate Transfer Transcript Evaluation <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AdmissionsPage;
