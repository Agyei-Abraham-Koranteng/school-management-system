import React, { useState } from 'react';
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
  ShieldCheck
} from 'lucide-react';
import { usePublicContent } from '../../../context/PublicContentContext';

export const ContactPage: React.FC = () => {
  const { contactPage } = usePublicContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'admissions',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="pt-24 pb-20 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* ── Page Hero ── */}
      <section className="relative py-16 lg:py-20 bg-gradient-to-b from-indigo-950 via-neutral-950 to-neutral-950 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1600&auto=format&fit=crop&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-bold text-indigo-300 backdrop-blur-md mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{contactPage.heroBadge}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            {contactPage.heroTitle}
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-300 leading-relaxed">
            {contactPage.heroSubtitle}
          </p>
        </div>
      </section>

      {/* ── Main Content Area ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xl">
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Direct Inquiries</span>
                <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white mt-1">Send Us a Message</h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Fill in the details below and your ticket will be routed directly to the appropriate university department.
                </p>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl text-neutral-900 dark:text-white">Message Dispatched!</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 max-w-sm mx-auto">
                      Thank you for contacting Premier University, {formData.name}. Our staff will review your message and respond to <span className="font-semibold text-neutral-800 dark:text-neutral-200">{formData.email}</span> shortly.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. / Mr. / Ms. Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="you@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-neutral-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        placeholder="+233 XX XXX XXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Target Department</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-neutral-900"
                      >
                        <option value="admissions">Admissions & Enrollment</option>
                        <option value="academic">Academic Affairs & Records</option>
                        <option value="research">Research & Commercialization</option>
                        <option value="finance">Student Accounts & Fees</option>
                        <option value="international">International Student Office</option>
                        <option value="general">General Administrative Inquiries</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="Brief summary of inquiry..."
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Message Content</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Please include any relevant student ID numbers, application reference IDs, or details..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-neutral-900 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Transmit Inquiries to Department
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Key Offices & Campus Location (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Campus Address Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">Main Campus Location</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Premier University, Legon Hill</p>
                </div>
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {contactPage.campusAddress}<br />
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold font-mono">Digital Address: {contactPage.digitalAddress}</span>
              </p>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Compass className="w-4 h-4 text-indigo-500" />
                  {contactPage.airportProximity}
                </span>
              </div>
            </div>

            {/* Department Office Directory */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 px-1">
                Departmental Contacts
              </h3>
              {contactPage.offices.map((office) => (
                <div
                  key={office.id}
                  className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-2"
                >
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white">{office.title}</h4>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{office.lead}</p>
                  
                  <div className="pt-1 text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{office.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{office.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Support Banner */}
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-300 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold">{contactPage.emergencyTitle}</p>
                <p className="text-amber-700 dark:text-amber-400 mt-0.5">Emergency Hotline: {contactPage.emergencyHotline} (Available all hours)</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
