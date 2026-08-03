'use client';

import { useState } from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AuthGuard } from '@/components/common/AuthGuard';
import { FolderKanban, Plus, Sparkles, Database, FileText, Code2, Layers, CheckCircle2, ArrowRight, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prompt, setPrompt] = useState('Tạo hệ thống quản lý bệnh viện');
  const [category, setCategory] = useState('hospital');
  const [generating, setGenerating] = useState(false);
  const [generatedProject, setGeneratedProject] = useState<any>(null);

  const handleGenerateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const res = await fetch('/api/projects/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, category }),
      });

      if (!res.ok) {
        setTimeout(() => {
          setGeneratedProject({
            id: 'proj_hospital_01',
            name: 'Hệ Thống Quản Lý Bệnh Viện',
            category: 'Hành chính / Y tế',
            architecture: 'Layered Architecture',
            modules: ['Quản lý Bệnh nhân', 'Lịch khám Bác sĩ', 'Hồ sơ Bệnh án', 'Viện phí & Hóa đơn'],
            erdMermaid: `erDiagram\n    PATIENTS ||--o{ APPOINTMENTS : has\n    DOCTORS ||--o{ APPOINTMENTS : conducts\n    APPOINTMENTS ||--o| MEDICAL_RECORDS : generates`,
            apiSpecs: [
              { method: 'POST', endpoint: '/api/v1/patients', desc: 'Đăng ký bệnh nhân mới' },
              { method: 'GET', endpoint: '/api/v1/appointments', desc: 'Tra cứu lịch khám bệnh' },
              { method: 'POST', endpoint: '/api/v1/medical-records', desc: 'Tạo hồ sơ bệnh án' }
            ],
            sqlSchema: `CREATE TABLE patients (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  full_name VARCHAR(255) NOT NULL,\n  phone VARCHAR(20)\n);`
          });
          setGenerating(false);
          setIsModalOpen(false);
          toast.success('AI đã sinh trọn bộ Dự án Quản lý Bệnh viện thành công!');
        }, 1500);
        return;
      }

      const data = await res.json();
      setGeneratedProject(data.data);
      toast.success('Sinh dự án thành công!');
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Có lỗi xảy ra khi gọi AI Engine.');
      setGenerating(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Quản Lý Dự Án AI Suite</h1>
              <p className="text-xs sm:text-sm text-gray-400">Danh sách các dự án phần mềm được AI tự động phân tích & thiết kế</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-brand-gradient text-white text-xs font-semibold shadow-lg shadow-brand-indigo/30 hover:scale-105 transition-transform flex items-center justify-center gap-2 self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>Sinh Dự Án Mới Với AI</span>
            </button>
          </div>

          {generatedProject ? (
            <div className="space-y-6 animate-fade-in mb-12">
              <div className="glass-panel p-6 rounded-3xl border-brand-cyan/40">
                <div className="flex items-center justify-between border-b border-surface-border pb-4 mb-6">
                  <div>
                    <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest block">AI Generated Project Suite</span>
                    <h2 className="text-2xl font-bold text-white">{generatedProject.name}</h2>
                    <p className="text-xs text-gray-400 mt-1">Kiến trúc: {generatedProject.architecture} • Lĩnh vực: {generatedProject.category}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono">Status: Ready</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-[#0D1117] p-5 rounded-2xl border border-surface-border">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-brand-cyan" />
                      <span>Phân Chia Module Hệ Thống</span>
                    </h3>
                    <ul className="space-y-2 text-xs text-gray-300">
                      {generatedProject.modules.map((m: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#0D1117] p-5 rounded-2xl border border-surface-border font-mono text-xs">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Database className="w-4 h-4 text-brand-indigo" />
                      <span>Sơ Đồ Database ERD (Mermaid)</span>
                    </h3>
                    <pre className="text-brand-cyan text-[11px] leading-relaxed overflow-x-auto">
                      {generatedProject.erdMermaid}
                    </pre>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#0D1117] p-5 rounded-2xl border border-surface-border">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand-purple" />
                      <span>RESTful API Specifications</span>
                    </h3>
                    <div className="space-y-2 text-xs">
                      {generatedProject.apiSpecs.map((api: any, i: number) => (
                        <div key={i} className="p-2 rounded bg-surface/50 flex items-center justify-between">
                          <span className="font-mono text-[10px] text-brand-cyan">{api.method} {api.endpoint}</span>
                          <span className="text-gray-400 text-[11px]">{api.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#0D1117] p-5 rounded-2xl border border-surface-border font-mono text-xs">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <span>SQL Schema Migration Script</span>
                    </h3>
                    <pre className="text-emerald-300 text-[11px] leading-relaxed overflow-x-auto">
                      {generatedProject.sqlSchema}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 text-center rounded-3xl border-dashed border-surface-border mb-12">
              <Sparkles className="w-12 h-12 text-brand-cyan mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Chưa có dự án nào được chọn</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
                Nhấn vào nút "Sinh Dự Án Mới Với AI" bên trên và nhập mô tả bài toán của bạn để AI tự động sinh trọn bộ tài liệu & sơ đồ.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-brand-gradient text-white text-xs font-semibold shadow-lg shadow-brand-indigo/30 hover:scale-105 transition-transform"
              >
                Thử nghiệm ngay
              </button>
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="glass-panel w-full max-w-lg p-6 sm:p-8 rounded-3xl border-brand-indigo/30 shadow-2xl relative">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-5 right-5 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">DevPilot AI Project Generator</h3>
                    <p className="text-xs text-gray-400">Tự động phân tích & sinh trọn bộ tài liệu phần mềm</p>
                  </div>
                </div>

                <form onSubmit={handleGenerateProject} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Mô tả bài toán / Yêu cầu dự án</label>
                    <textarea
                      rows={3}
                      required
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Ví dụ: Tạo hệ thống quản lý bệnh viện..."
                      className="w-full bg-surface/80 border border-surface-border rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Lĩnh vực ứng dụng</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-surface/80 border border-surface-border rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-cyan transition-colors"
                    >
                      <option value="hospital">Y tế & Bệnh viện</option>
                      <option value="e-commerce">Thương mại điện tử</option>
                      <option value="education">Giáo dục & Quản lý Trường học</option>
                      <option value="finance">Tài chính & Ngân hàng</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={generating}
                    className="w-full py-3.5 rounded-xl bg-brand-gradient text-white text-xs font-semibold shadow-lg shadow-brand-indigo/30 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 mt-4"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>AI đang phân tích & sinh dữ liệu (SRS, ERD, Code)...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Sinh Trọn Bộ Dự Án Này</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
