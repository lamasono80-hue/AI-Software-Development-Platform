'use client';

import { useState } from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { FileText, Download, FileCode, CheckCircle2, FileSpreadsheet, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function DocumentsPage() {
  const [activeDoc, setActiveDoc] = useState<'srs' | 'erd' | 'api'>('srs');

  const handleExport = (format: 'pdf' | 'docx' | 'md') => {
    toast.success(`Đang xuất bộ tài liệu định dạng .${format.toUpperCase()}... File sẽ tự động tải xuống!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Document Studio & Export Engine</h1>
            <p className="text-xs sm:text-sm text-gray-400">Xem, chỉnh sửa tài liệu phần mềm và xuất bộ tài liệu chính thức</p>
          </div>

          {/* Export Toolbar */}
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

        {/* Studio Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Navigation Tree */}
          <div className="glass-panel p-4 rounded-2xl border-surface-border space-y-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest px-2 block mb-2">Tài liệu Dự án</span>
            
            <button
              onClick={() => setActiveDoc('srs')}
              className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                activeDoc === 'srs' ? 'bg-brand-gradient text-white shadow-md' : 'text-gray-300 hover:bg-surface-hover'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Báo Cáo Phân Tích SRS</span>
            </button>

            <button
              onClick={() => setActiveDoc('erd')}
              className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                activeDoc === 'erd' ? 'bg-brand-gradient text-white shadow-md' : 'text-gray-300 hover:bg-surface-hover'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Sơ Đồ ERD & SQL Schema</span>
            </button>

            <button
              onClick={() => setActiveDoc('api')}
              className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                activeDoc === 'api' ? 'bg-brand-gradient text-white shadow-md' : 'text-gray-300 hover:bg-surface-hover'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>RESTful API Specifications</span>
            </button>
          </div>

          {/* Right Document Viewer Area */}
          <div className="lg:col-span-3 glass-panel p-6 sm:p-8 rounded-2xl border-surface-border bg-[#0D1117]">
            {activeDoc === 'srs' && (
              <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-4">
                <h1 className="text-xl font-bold text-white border-b border-surface-border pb-2">1. BÁO CÁO YÊU CẦU PHÂN TÍCH SRS - HỆ THỐNG QUẢN LÝ BỆNH VIỆN</h1>
                <h2 className="text-sm font-semibold text-brand-cyan">1.1. Tổng Quan Hệ Thống</h2>
                <p className="text-gray-300">
                  Hệ thống Quản lý Bệnh viện tự động hóa việc đăng ký khám bệnh, quản lý lịch trình bác sĩ, theo dõi sơ đồ phòng khám và cấp hóa đơn viện phí.
                </p>
                <h2 className="text-sm font-semibold text-brand-cyan">1.2. Danh Sách Các Phân Hệ Chính</h2>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  <li><strong>Module 1:</strong> Quản lý Bệnh nhân & Đăng ký Khám bệnh.</li>
                  <li><strong>Module 2:</strong> Quản lý Lịch làm việc Bác sĩ.</li>
                  <li><strong>Module 3:</strong> Hồ sơ Bệnh án & Đơn thuốc Điện tử.</li>
                  <li><strong>Module 4:</strong> Viện phí, Hóa đơn & Báo cáo Thống kê.</li>
                </ul>
              </div>
            )}

            {activeDoc === 'erd' && (
              <div className="space-y-4 font-mono text-xs">
                <h2 className="text-lg font-bold text-white border-b border-surface-border pb-2">2. SƠ ĐỒ DATABASE ERD & CHI TIẾT TABLES</h2>
                <pre className="text-brand-cyan bg-surface/50 p-4 rounded-xl overflow-x-auto leading-relaxed">
{`erDiagram
    PATIENTS ||--o{ APPOINTMENTS : has
    DOCTORS ||--o{ APPOINTMENTS : conducts
    APPOINTMENTS ||--o| MEDICAL_RECORDS : generates

    PATIENTS {
        uuid id PK
        string full_name
        string phone
    }`}
                </pre>
              </div>
            )}

            {activeDoc === 'api' && (
              <div className="space-y-4 text-xs">
                <h2 className="text-lg font-bold text-white border-b border-surface-border pb-2">3. RESTFUL API ENDPOINTS SPECIFICATION</h2>
                <div className="p-3 rounded-xl bg-surface/50 font-mono text-brand-cyan">
                  POST /api/v1/patients - Đăng ký bệnh nhân mới
                </div>
                <div className="p-3 rounded-xl bg-surface/50 font-mono text-brand-indigo">
                  GET /api/v1/appointments - Tra cứu danh sách lịch khám
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
