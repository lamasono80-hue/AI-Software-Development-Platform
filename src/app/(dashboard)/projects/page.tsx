'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AuthGuard } from '@/components/common/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import { getProjectsByUser, saveProjectForUser, ProjectRecord } from '@/lib/supabase-db';
import {
  FolderKanban,
  Sparkles,
  Database,
  FileText,
  Code2,
  Layers,
  CheckCircle2,
  X,
  Loader2,
  Copy,
  Check,
  Users,
  GitBranch,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectsPage() {
  const { user } = useAuth();
  const userId = user?.id || 'usr_demo_101';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('general');
  const [generating, setGenerating] = useState(false);
  const [generatedProject, setGeneratedProject] = useState<ProjectRecord | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [projectHistory, setProjectHistory] = useState<ProjectRecord[]>([]);

  // Load user's real projects history on mount
  useEffect(() => {
    async function loadProjects() {
      const projects = await getProjectsByUser(userId);
      setProjectHistory(projects);

      if (projects.length > 0) {
        setGeneratedProject(projects[0]);
      }
    }
    loadProjects();
  }, [userId]);

  const handleGenerateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error('Vui lòng nhập mô tả yêu cầu bài toán dự án!');
      return;
    }

    setGenerating(true);

    try {
      const res = await fetch('/api/projects/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), category, userId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || 'Lỗi khi gọi AI Generator!');
        setGenerating(false);
        return;
      }

      const projectData = data.data;
      const saved = await saveProjectForUser(userId, projectData);

      setGeneratedProject(saved);
      setProjectHistory((prev) => [saved, ...prev.filter((p) => p.id !== saved.id)]);
      setGenerating(false);
      setIsModalOpen(false);
      setPrompt('');
      toast.success(`Gemini AI đã sinh trọn bộ dự án "${saved.name}" thành công!`);
    } catch (err: any) {
      toast.error('Có lỗi kết nối với máy chủ AI Engine!');
      setGenerating(false);
    }
  };

  const handleCopyCode = (section: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    toast.success(`Đã sao chép nội dung ${section}!`);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FolderKanban className="w-7 h-7 text-brand-cyan" />
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Quản Lý Dự Án AI Suite (Supabase DB)</h1>
              </div>
              <p className="text-xs sm:text-sm text-gray-400">Sinh trọn bộ Yêu cầu SRS, Modules, ERD Diagram, RESTful API Specs & SQL Migration bằng Gemini AI Engine</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-brand-gradient text-white text-xs font-semibold shadow-lg shadow-brand-indigo/30 hover:scale-105 transition-transform flex items-center justify-center gap-2 self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>Sinh Dự Án Mới Với AI</span>
            </button>
          </div>

          {/* ACTIVE GENERATED PROJECT VIEW */}
          {generatedProject ? (
            <div className="space-y-8 animate-fade-in mb-12">
              {/* Project Title Card */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border-brand-cyan/40 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-cyan/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-6 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full bg-brand-cyan/20 text-brand-cyan text-xs font-mono font-bold border border-brand-cyan/30">
                        {generatedProject.category || 'Software Engineering'}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-brand-purple/20 text-brand-purple text-xs font-mono font-bold border border-brand-purple/30">
                        {generatedProject.architecture_type || 'Clean Architecture'}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{generatedProject.name}</h2>
                    <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-3xl leading-relaxed">
                      {generatedProject.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                      Status: Active in DB
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      Khởi tạo: {generatedProject.created_at || 'Hôm nay'}
                    </span>
                  </div>
                </div>

                {/* Section 1: Modules & Actors/UseCases */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Modules List */}
                  <div className="bg-[#0D1117] p-6 rounded-2xl border border-surface-border space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-surface-border pb-3">
                      <Layers className="w-4 h-4 text-brand-cyan" />
                      <span>Phân Chia Phân Hệ & Modules Nghiệp Vụ</span>
                    </h3>
                    <ul className="space-y-2 text-xs text-gray-300">
                      {generatedProject.modules?.map((m: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5 bg-surface/40 p-2.5 rounded-xl border border-surface-border/50">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actors & Use Cases */}
                  <div className="bg-[#0D1117] p-6 rounded-2xl border border-surface-border space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-surface-border pb-3">
                      <Users className="w-4 h-4 text-brand-purple" />
                      <span>Actors & Use Cases Nghiệp Vụ</span>
                    </h3>

                    {/* Actors */}
                    <div className="space-y-1 mb-3">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Các Vai Trò Người Dùng (Actors)</span>
                      <div className="flex flex-wrap gap-2">
                        {generatedProject.actors?.map((actor: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-brand-purple/10 text-brand-purple text-xs font-mono font-medium border border-brand-purple/20">
                            👤 {actor}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Use Cases */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Danh Sách Use Cases Chính</span>
                      <ul className="space-y-1.5 text-xs text-gray-300">
                        {generatedProject.useCases?.map((uc: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-xs">
                            <GitBranch className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                            <span>{uc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Section 2: ERD Diagram & SQL Migration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* ERD Mermaid */}
                  <div className="bg-[#0D1117] p-6 rounded-2xl border border-surface-border space-y-3">
                    <div className="flex items-center justify-between border-b border-surface-border pb-3">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Database className="w-4 h-4 text-brand-indigo" />
                        <span>Sơ Đồ Cơ Sở Dữ Liệu ERD (Mermaid)</span>
                      </h3>
                      <button
                        onClick={() => handleCopyCode('ERD', generatedProject.erdMermaid || '')}
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded bg-surface hover:bg-surface-hover transition-colors"
                      >
                        {copiedSection === 'ERD' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <pre className="text-brand-cyan text-[11px] font-mono leading-relaxed overflow-x-auto bg-surface/50 p-4 rounded-xl max-h-64">
                      {generatedProject.erdMermaid}
                    </pre>
                  </div>

                  {/* SQL Schema Script */}
                  <div className="bg-[#0D1117] p-6 rounded-2xl border border-surface-border space-y-3">
                    <div className="flex items-center justify-between border-b border-surface-border pb-3">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-emerald-400" />
                        <span>Kịch Bản SQL DDL Migration Script</span>
                      </h3>
                      <button
                        onClick={() => handleCopyCode('SQL', generatedProject.sqlSchema || '')}
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded bg-surface hover:bg-surface-hover transition-colors"
                      >
                        {copiedSection === 'SQL' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <pre className="text-emerald-300 text-[11px] font-mono leading-relaxed overflow-x-auto bg-surface/50 p-4 rounded-xl max-h-64">
                      {generatedProject.sqlSchema}
                    </pre>
                  </div>
                </div>

                {/* Section 3: RESTful API Specs */}
                <div className="bg-[#0D1117] p-6 rounded-2xl border border-surface-border space-y-4">
                  <div className="flex items-center justify-between border-b border-surface-border pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand-purple" />
                      <span>Danh Sách RESTful API Specifications</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {generatedProject.apiSpecs?.map((api: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-surface/40 border border-surface-border/60 flex items-center justify-between gap-3">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase ${
                          api.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          api.method === 'GET' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          api.method === 'PUT' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {api.method}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-xs text-white truncate">{api.endpoint}</p>
                          <p className="text-[11px] text-gray-400 truncate">{api.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* EMPTY PLACEHOLDER */
            <div className="glass-panel p-12 text-center rounded-3xl border-dashed border-surface-border mb-12 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center mx-auto shadow-xl shadow-brand-cyan/20">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white">Chưa có dự án nào được chọn</h3>
              <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
                Nhấn vào nút <strong>"Sinh Dự Án Mới Với AI"</strong> bên trên, nhập bất kỳ bài toán nào (Ví dụ: <em>"Tạo website đặt đồ ăn"</em> hoặc <em>"Tạo website bán quần áo"</em>) để Gemini AI tự động phân tích và sinh toàn bộ tài liệu kỹ thuật!
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-brand-gradient text-white text-xs font-semibold shadow-lg shadow-brand-indigo/30 hover:scale-105 transition-transform"
              >
                Trải Nghiệm Sinh Dự Án AI
              </button>
            </div>
          )}

          {/* PROJECT HISTORY LIST FROM SUPABASE */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-cyan" />
              <span>Lịch Sử Các Dự Án Của Bạn TRÊN SUPABASE ({projectHistory.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectHistory.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => setGeneratedProject(proj)}
                  className={`glass-panel p-5 rounded-2xl border transition-all cursor-pointer hover:border-brand-cyan/60 ${
                    generatedProject?.id === proj.id ? 'border-brand-cyan bg-brand-cyan/5 shadow-lg' : 'border-surface-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
                      {proj.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">{proj.created_at}</span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-1 truncate">{proj.name}</h4>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{proj.description}</p>

                  <div className="mt-3 pt-3 border-t border-surface-border/50 flex items-center justify-between text-xs text-brand-cyan font-medium">
                    <span>Mở dự án này</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI GENERATOR PROMPT MODAL */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
              <div className="glass-panel w-full max-w-lg p-6 sm:p-8 rounded-3xl border-brand-cyan/40 shadow-2xl relative">
                <button
                  onClick={() => !generating && setIsModalOpen(false)}
                  className="absolute top-5 right-5 text-gray-400 hover:text-white disabled:opacity-50"
                  disabled={generating}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-lg shadow-brand-cyan/20">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">DevPilot AI Project Generator</h3>
                    <p className="text-xs text-gray-400">Sinh trọn bộ tài liệu kỹ thuật theo Prompt bất kỳ</p>
                  </div>
                </div>

                <form onSubmit={handleGenerateProject} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Mô tả bài toán dự án (Prompt)</label>
                    <textarea
                      rows={4}
                      required
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Ví dụ: Website đặt đồ ăn / Website bán quần áo / Tạo hệ thống quản lý trường học / Ứng dụng đặt xe công nghệ..."
                      className="w-full bg-surface/80 border border-surface-border rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Lĩnh vực phần mềm</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-surface/80 border border-surface-border rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-cyan transition-colors"
                    >
                      <option value="general">Tự động nhận diện theo Prompt</option>
                      <option value="y-te">Y tế & Bệnh viện</option>
                      <option value="e-commerce">Bán hàng & Thương mại Điện tử</option>
                      <option value="food-delivery">Đặt đồ ăn & Nhà hàng</option>
                      <option value="giao-duc">Giáo dục & Trường học</option>
                      <option value="van-tai">Vận tải & Logistics</option>
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
                        <span>Gemini AI đang phân tích & sinh dữ liệu thực tế...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Sinh Trọn Bộ Dự Án Với Gemini AI</span>
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
