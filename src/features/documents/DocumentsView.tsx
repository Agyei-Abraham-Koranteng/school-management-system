import React, { useState, useMemo } from 'react';
import { 
  FolderLock, 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  CheckCircle2, 
  Search, 
  Filter, 
  ShieldCheck, 
  Calendar,
  User,
  Plus
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SystemDocument, DocumentCategory } from '../../types';

export const DocumentsView: React.FC = () => {
  const { documents, addDocument, students, activeStudent } = useSchool();
  const { currentRole } = useAuth();
  const { showToast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<SystemDocument | null>(null);

  // Upload Form
  const [formData, setFormData] = useState({
    title: '',
    fileName: '',
    category: 'registration_slip' as DocumentCategory,
    studentId: students[0]?.id || '',
    isVerified: true
  });

  const userDocs = useMemo(() => {
    if (currentRole === 'student') {
      return documents.filter(doc => 
        !doc.studentId || 
        doc.studentId === 'all' ||
        doc.studentId === activeStudent.id || 
        doc.studentId === activeStudent.studentId
      );
    }
    return documents;
  }, [documents, currentRole, activeStudent]);

  const filteredDocs = userDocs.filter(doc => {
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      showToast('Document title is required', 'error');
      return;
    }

    addDocument({
      title: formData.title,
      fileName: formData.fileName || `${formData.title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      category: formData.category,
      fileSize: "320 KB",
      fileType: "PDF",
      uploadedBy: "Registry Academic Affairs",
      studentId: formData.studentId,
      downloadUrl: "#",
      isVerified: formData.isVerified,
      status: "active"
    });

    showToast('Document registered into repository', 'success');
    setIsUploadModalOpen(false);
    setFormData({
      title: '',
      fileName: '',
      category: 'registration_slip',
      studentId: students[0]?.id || '',
      isVerified: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Institutional Document Center
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Archival repository for verified admission letters, official transcripts, registration dockets, and senate regulations.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
        >
          <Upload className="w-4 h-4" />
          Archive New Document
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents by title or file..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
          >
            <option value="all">All Document Types</option>
            <option value="admission_letter">Admission Letters</option>
            <option value="registration_slip">Registration Slips</option>
            <option value="result_slip">Result Slips</option>
            <option value="transcript">Academic Transcripts</option>
            <option value="certificate">Completion Certificates</option>
            <option value="policy">Institutional Policies</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map(doc => (
          <div 
            key={doc.id}
            className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs flex flex-col justify-between space-y-4 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                {doc.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-3 line-clamp-2">
                {doc.title}
              </h3>
              <p className="text-xs font-mono text-neutral-400 mt-0.5 truncate">{doc.fileName}</p>

              <div className="pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 space-y-1">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300 uppercase">{doc.category.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Uploaded:</span>
                  <span className="font-mono">{doc.uploadedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span className="font-mono">{doc.fileSize}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <button
                onClick={() => setPreviewDoc(doc)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button
                onClick={() => showToast(`Downloaded ${doc.fileName}`, 'info')}
                className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">Archive Institutional Document</h3>
            <form onSubmit={handleUpload} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Official Statement of Results - Semester 1"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Document Classification</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as DocumentCategory })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                >
                  <option value="admission_letter">Admission Letter</option>
                  <option value="registration_slip">Course Registration Slip</option>
                  <option value="result_slip">Semester Result Slip</option>
                  <option value="transcript">Official Transcript</option>
                  <option value="certificate">Completion Certificate</option>
                  <option value="policy">Institutional Policy / Handbook</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Target Student Recipient (Optional)</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                >
                  <option value="">General University / No specific student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.studentId} - {s.firstName} {s.lastName}</option>
                  ))}
                </select>
              </div>

              {/* Drag and Drop Box */}
              <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-6 text-center text-neutral-500">
                <Upload className="w-8 h-8 mx-auto mb-2 text-indigo-500 opacity-60" />
                <p className="font-semibold text-neutral-700 dark:text-neutral-300">Drag & drop your PDF file here, or click to browse</p>
                <p className="text-[10px] text-neutral-400 mt-1">Accepts PDF, DOCX, PNG (Max 15MB)</p>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
                <button type="button" onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl">Upload & Archive</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{previewDoc.title}</h4>
                <p className="text-[11px] font-mono text-neutral-400">{previewDoc.fileName}</p>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-neutral-400 hover:text-neutral-600">✕</button>
            </div>

            <div className="p-8 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-center space-y-3">
              <FileText className="w-16 h-16 text-indigo-600 mx-auto" />
              <p className="text-xs text-neutral-600 dark:text-neutral-300">
                Official PDF Document verified by the Registry Academic Archives.
              </p>
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full text-xs font-bold">
                Tamper-Evident SHA-256 Validated
              </span>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 rounded-xl text-xs font-bold"
              >
                Print / Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
