import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Printer, 
  RotateCw, 
  ShieldCheck, 
  Heart, 
  Phone, 
  Home, 
  Save,
  Sparkles,
  MapPin,
  Calendar
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { QrCode } from '../../components/shared/QrCode';

export const StudentIDAndProfileView: React.FC = () => {
  const { activeStudent, studentProfileExtra, updateStudentProfileExtra, settings } = useSchool();
  const { showToast } = useToast();

  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');
  const [formData, setFormData] = useState({
    bloodGroup: studentProfileExtra.bloodGroup || 'O+',
    allergies: Array.isArray(studentProfileExtra.allergies) 
      ? studentProfileExtra.allergies.join(', ') 
      : (typeof studentProfileExtra.allergies === 'string' ? studentProfileExtra.allergies : 'None'),
    emergencyName: studentProfileExtra.emergencyContact?.name || '',
    emergencyPhone: studentProfileExtra.emergencyContact?.phone || '',
    emergencyRelation: studentProfileExtra.emergencyContact?.relationship || '',
    hall: studentProfileExtra.hallOfResidence || 'Non-Resident',
    roomNumber: studentProfileExtra.roomNumber || 'N/A',
    address: studentProfileExtra.residentialAddress || ''
  });

  React.useEffect(() => {
    setFormData({
      bloodGroup: studentProfileExtra.bloodGroup || 'O+',
      allergies: Array.isArray(studentProfileExtra.allergies) 
        ? studentProfileExtra.allergies.join(', ') 
        : (typeof studentProfileExtra.allergies === 'string' ? studentProfileExtra.allergies : 'None'),
      emergencyName: studentProfileExtra.emergencyContact?.name || '',
      emergencyPhone: studentProfileExtra.emergencyContact?.phone || '',
      emergencyRelation: studentProfileExtra.emergencyContact?.relationship || '',
      hall: studentProfileExtra.hallOfResidence || 'Non-Resident',
      roomNumber: studentProfileExtra.roomNumber || 'N/A',
      address: studentProfileExtra.residentialAddress || ''
    });
  }, [studentProfileExtra, activeStudent.studentId]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfileExtra({
      bloodGroup: formData.bloodGroup,
      allergies: formData.allergies.split(',').map(s => s.trim()).filter(Boolean),
      emergencyContact: {
        name: formData.emergencyName,
        phone: formData.emergencyPhone,
        relationship: formData.emergencyRelation
      },
      hallOfResidence: formData.hall,
      roomNumber: formData.roomNumber,
      residentialAddress: formData.address
    });
    showToast('Student onboarding profile details saved successfully.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const qrPayload = JSON.stringify({
    institution: settings.institutionName,
    studentId: activeStudent.studentId,
    name: `${activeStudent.firstName} ${activeStudent.lastName}`,
    program: activeStudent.programName,
    validUntil: "2028-08-31",
    verificationStatus: "OFFICIALLY_ENROLLED"
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Digital Student ID & Onboarding Profile
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Official verifiable smart identity card, residential assignment, and institutional onboarding records.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setCardSide(prev => prev === 'front' ? 'back' : 'front')}
            className="w-full sm:w-auto min-h-[42px] inline-flex items-center justify-center gap-2 px-3 py-2 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 ef-tap-area cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Flip ({cardSide === 'front' ? 'Back' : 'Front'})
          </button>
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto min-h-[42px] inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-xl text-xs font-semibold shadow-xs ef-tap-area cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print ID Card
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Digital ID Card Showcase */}
        <div className="lg:col-span-6 flex flex-col items-center justify-start space-y-4">
          {/* Physical Ratio Card Container */}
          <div className="w-full max-w-md perspective">
            {cardSide === 'front' ? (
              /* FRONT OF CARD */
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-4 sm:p-6 shadow-2xl border border-indigo-500/30 flex flex-col justify-between aspect-[1.586/1] min-h-[240px] sm:min-h-[260px]">
                {/* Micro pattern overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

                {/* Top Row: Institution Crest & Name */}
                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-xs shrink-0">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-white truncate">
                        {settings.institutionName}
                      </h4>
                      <p className="text-[8px] sm:text-[9px] text-indigo-200 uppercase tracking-widest font-mono">
                        Student Identity Card
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    LEVEL {activeStudent.currentLevel}
                  </span>
                </div>

                {/* Middle Row: Photo, Info, and QR Code */}
                <div className="relative z-10 flex items-center gap-3 sm:gap-4 my-2">
                  <div className="relative shrink-0">
                    <img
                      src={activeStudent.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"}
                      alt={activeStudent.firstName}
                      className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-xl border-2 border-white/30 shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-0.5 rounded-full border-2 border-slate-900">
                      <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-black text-white truncate">
                      {activeStudent.firstName} {activeStudent.lastName}
                    </p>
                    <p className="text-[11px] sm:text-xs font-mono font-bold text-amber-300 tracking-wider mt-0.5">
                      {activeStudent.studentId}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-neutral-300 truncate mt-0.5">
                      {activeStudent.programName}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-indigo-200/80 truncate">
                      {activeStudent.faculty}
                    </p>
                  </div>

                  {/* QR Code */}
                  <div className="shrink-0 bg-white p-1 rounded-lg shadow-sm">
                    <QrCode value={qrPayload} size={52} />
                  </div>
                </div>

                {/* Bottom Row: Validity & Gold Security Stripe */}
                <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[9px] sm:text-[10px]">
                  <span className="text-neutral-400 font-mono">
                    ISSUED: {activeStudent.admissionDate}
                  </span>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ACTIVE
                  </div>
                  <span className="text-amber-300 font-mono">
                    EXP: {parseInt((activeStudent.admissionDate || '2024').split('-')[0]) + 4}-08
                  </span>
                </div>
              </div>
            ) : (
              /* BACK OF CARD */
              <div className="relative overflow-hidden rounded-2xl bg-neutral-900 text-neutral-300 p-4 sm:p-6 shadow-2xl border border-neutral-800 flex flex-col justify-between aspect-[1.586/1] min-h-[240px] sm:min-h-[260px]">
                {/* Magnetic Stripe */}
                <div className="w-full h-7 sm:h-8 bg-black -mx-4 sm:-mx-6 mb-2" />

                <div className="text-[8px] sm:text-[9px] text-neutral-400 space-y-1.5 leading-tight">
                  <p>
                    This identity credential remains the property of {settings.institutionName}. It must be presented upon request by authorized university personnel.
                  </p>
                  <p>
                    If found, please deliver to: Security Directorate, {settings.campusAddress}, or call emergency line <strong>+233 302 700 000</strong>.
                  </p>
                </div>

                {/* Signatures & Barcode */}
                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                  <div>
                    <p className="text-[8px] uppercase tracking-wider text-neutral-500">Authorized Signature</p>
                    <p className="font-serif italic text-neutral-200 text-xs mt-0.5">Dr. K. Asare (Registrar)</p>
                  </div>

                  <div className="text-right">
                    <p className="text-[8px] uppercase tracking-wider text-neutral-500 font-mono">CHIP SERIAL</p>
                    <p className="text-[9px] font-mono text-neutral-400">PU-RFID-{(activeStudent.studentId || '8921').replace(/[^A-Za-z0-9]/g, '').slice(-4)}-XG</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="text-[11px] text-neutral-400 text-center">
            NFC & 2D QR Enabled. Scannable at campus library turns, exams halls, and security gates.
          </p>
        </div>

        {/* Right Column: Profile Completion & Onboarding Form */}
        <div className="lg:col-span-6 space-y-6">
          {/* Progress Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Institutional Onboarding Completion
              </h3>
              <span className="text-sm font-black font-mono text-indigo-600 dark:text-indigo-400">
                {studentProfileExtra.profileCompletionPercentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${studentProfileExtra.profileCompletionPercentage}%` }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Biometrics & Photograph Verified
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Level 100 Matriculation Cleared
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Academic Registration Approved
              </span>
              <span className={`flex items-center gap-1.5 ${formData.emergencyPhone ? 'text-emerald-600' : 'text-amber-500'}`}>
                {formData.emergencyPhone ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                Emergency Contact on File
              </span>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSaveProfile} className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4 text-xs">
            <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              Medical & Emergency Profile
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1 text-neutral-700 dark:text-neutral-300">Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                >
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-neutral-700 dark:text-neutral-300">Known Allergies</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Peanuts"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold block mb-1 text-neutral-700 dark:text-neutral-300">Next of Kin / Contact</label>
                <input
                  type="text"
                  required
                  value={formData.emergencyName}
                  onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                  className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-neutral-700 dark:text-neutral-300">Relationship</label>
                <input
                  type="text"
                  required
                  value={formData.emergencyRelation}
                  onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                  className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-neutral-700 dark:text-neutral-300">Phone</label>
                <input
                  type="text"
                  required
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>

            <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2 pt-2">
              <Home className="w-4 h-4 text-amber-500" />
              Residential & Hostel Allocation
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1 text-neutral-700 dark:text-neutral-300">Hall of Residence</label>
                <input
                  type="text"
                  value={formData.hall}
                  onChange={(e) => setFormData({ ...formData, hall: e.target.value })}
                  className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1 text-neutral-700 dark:text-neutral-300">Room Number</label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-neutral-700 dark:text-neutral-300">Permanent Home Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs ef-tap-area cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Update Student Records
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
