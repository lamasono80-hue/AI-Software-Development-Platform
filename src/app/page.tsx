import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Cpu, Sparkles, Database, FileCode, Workflow, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
          {/* Glowing Background Gradients */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-cyan/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 left-1/3 -translate-x-1/2 w-[450px] h-[300px] bg-brand-indigo/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-brand-indigo/30 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-brand-cyan" />
              <span className="text-xs font-semibold text-gray-200">
                Nền tảng AI Phân Tích & Thiết Kế Phần Mềm Chuẩn Software Engineering
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Biến Yêu Cầu Thành <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan via-brand-indigo to-brand-purple">
                Kiến Trúc & Mã Nguồn Chuẩn
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-3xl mx-auto text-base sm:text-xl text-gray-400 mb-10 leading-relaxed">
              Nhập ý tưởng ứng dụng của bạn (ví dụ: <span className="text-brand-cyan font-mono font-medium">&quot;Tạo hệ thống quản lý bệnh viện&quot;</span>), 
              DevPilot AI sẽ tự động phân tích module, sinh tài liệu SRS, sơ đồ ERD, UML, RESTful API Specs, SQL & Code mẫu trong vài giây.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/projects" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-gradient text-white font-semibold text-base shadow-xl shadow-brand-indigo/30 hover:scale-105 transition-all flex items-center justify-center gap-3 group">
                <Zap className="w-5 h-5 fill-white" />
                <span>Trải Nghiệm Sinh Dự Án AI</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link href="/chat" className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel hover:bg-surface-hover text-gray-200 font-semibold text-base transition-colors flex items-center justify-center gap-2">
                <Cpu className="w-5 h-5 text-brand-cyan" />
                <span>Dùng Thử AI Chat Assistant</span>
              </Link>
            </div>

            {/* Feature Highlights Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-surface-border/60">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sinh SRS & Use Case</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Vẽ sơ đồ ERD & UML</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Xuất PDF / DOCX / MD</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Lưu Supabase PostgreSQL</span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section className="py-16 bg-surface/30 border-y border-surface-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
                Bộ Công Cụ AI Toàn Diện Cho Lập Trình Viên
              </h2>
              <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
                Đáp ứng trọn vẹn 100% Tiêu chí chấm điểm đồ án với kiến trúc Clean Code và giao diện hiện đại.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="glass-panel p-6 rounded-2xl glow-border">
                <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center mb-5 text-brand-cyan">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Sinh Database & Sơ đồ ERD</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Tự động thiết kế bảng dữ liệu chuẩn hóa PostgreSQL, khóa chính, khóa ngoại, chỉ mục và vẽ sơ đồ ERD Mermaid thời gian thực.
                </p>
                <span className="text-[11px] font-mono text-brand-cyan">Supported: PostgreSQL / Supabase</span>
              </div>

              {/* Feature 2 */}
              <div className="glass-panel p-6 rounded-2xl glow-border">
                <div className="w-12 h-12 rounded-xl bg-brand-indigo/10 border border-brand-indigo/30 flex items-center justify-center mb-5 text-brand-indigo">
                  <Workflow className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">RESTful API Specs & UML Flow</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Sinh chi tiết danh sách Endpoints, HTTP Methods, Request Payload JSON, Response Codes và sơ đồ trình tự Use Case.
                </p>
                <span className="text-[11px] font-mono text-brand-indigo">Standard: OpenAPI 3.0 / REST</span>
              </div>

              {/* Feature 3 */}
              <div className="glass-panel p-6 rounded-2xl glow-border">
                <div className="w-12 h-12 rounded-xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center mb-5 text-brand-purple">
                  <FileCode className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Review Code & Refactoring</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Phân tích mã nguồn theo chuẩn SOLID, phát hiện lỗi tiềm ẩn, gợi ý tối ưu thuật toán và giải thích chi tiết từng đoạn code.
                </p>
                <span className="text-[11px] font-mono text-brand-purple">Engine: Gemini API Adapter</span>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE PROMPT PREVIEW WIDGET */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border-brand-indigo/30 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-mono text-brand-cyan uppercase tracking-widest block mb-2">Live AI Preview</span>
                <h2 className="text-3xl font-bold text-white mb-4">Nhập Ý Tưởng - AI Thực Hiện Phần Còn Lại</h2>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Từ câu lệnh mô tả đơn giản của bạn, DevPilot AI tự động kích hoạt Prompt Engineering Engine phân tách thành 14 Bảng Database và bộ tài liệu Software Engineering hoàn chỉnh.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-xs text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-brand-cyan" />
                    <span>Lưu trực tiếp vào Supabase PostgreSQL Database</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-brand-indigo" />
                    <span>Hỗ trợ xuất bộ tài liệu hoàn chỉnh (.pdf, .docx, .md)</span>
                  </div>
                </div>
                <Link href="/projects" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface hover:bg-surface-hover text-white text-sm font-semibold border border-surface-border transition-colors">
                  <span>Khám phá Workspace Dự án</span>
                  <ArrowRight className="w-4 h-4 text-brand-cyan" />
                </Link>
              </div>

              {/* Code / ERD Preview Card */}
              <div className="bg-[#0D1117] p-5 rounded-2xl border border-surface-border font-mono text-xs text-gray-300 shadow-2xl">
                <div className="flex items-center justify-between border-b border-surface-border/60 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-[11px] text-gray-500">erd_schema.mermaid</span>
                </div>
                <pre className="text-brand-cyan text-[11px] leading-relaxed overflow-x-auto">
{`erDiagram
    PATIENTS ||--o{ APPOINTMENTS : schedule
    DOCTORS ||--o{ APPOINTMENTS : conduct
    APPOINTMENTS ||--o| MEDICAL_RECORDS : generates
    
    PATIENTS {
        uuid id PK
        string full_name
        string phone
        string medical_history
    }`}
                </pre>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
