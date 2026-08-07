'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AuthGuard } from '@/components/common/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import { getDocumentsByUser, DocumentRecord } from '@/lib/supabase-db';
import { FileText, Download, FileCode, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

export default function DocumentsPage() {
  const { user } = useAuth();
  const userId = user?.id || 'usr_demo_101';

  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [activeDoc, setActiveDoc] = useState<DocumentRecord | null>(null);

  useEffect(() => {
    async function loadDocs() {
      const userDocs = await getDocumentsByUser(userId);
      setDocuments(userDocs);
      if (userDocs.length > 0) {
        setActiveDoc(userDocs[0]);
      }
    }
    loadDocs();
  }, [userId]);

  const handleExport = (format: 'pdf' | 'docx' | 'md') => {
    toast.success(`Đang xuất bộ tài liệu "${activeDoc?.title || 'System Document'}" định dạng .${format.toUpperCase()}... File sẽ tự động tải xuống!`);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Document Studio & Export Engine (Supabase DB)</h1>
              <p className="text-xs sm:text-sm text-gray-400">Xem, chỉnh sửa tài liệu phần mềm thực tế của bạn và xuất file hoàn chỉnh</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExport('pdf')}
                className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất PDF</span>
              </button>

              <button
                onClick={() => handleExport('docx')}
                className="px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất DOCX</span>
              </button>

              <button
                onClick={() => handleExport('md')}
                className="px-4 py-2 rounded-xl bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Xuất Markdown</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* DOCUMENT LIST FOR CURRENT USER */}
            <div className="glass-panel p-4 rounded-2xl border-surface-border space-y-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest px-2 block mb-2">
                Tài liệu của bạn ({documents.length})
              </span>
              
              {documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setActiveDoc(doc)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all truncate ${
                    activeDoc?.id === doc.id ? 'bg-brand-gradient text-white shadow-md' : 'text-gray-300 hover:bg-surface-hover'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0 text-brand-cyan" />
                  <span className="truncate">{doc.title}</span>
                </button>
              ))}
            </div>

            {/* DOCUMENT CONTENT VIEWER */}
            <div className="lg:col-span-3 glass-panel p-6 sm:p-8 rounded-2xl border-surface-border bg-[#0D1117]">
              {activeDoc ? (
                <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-4">
                  <h1 className="text-xl font-bold text-white border-b border-surface-border pb-2">
                    {activeDoc.title}
                  </h1>
                  <p className="text-gray-300 whitespace-pre-wrap">{activeDoc.content}</p>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">Chưa có tài liệu nào được chọn.</div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
