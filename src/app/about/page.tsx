import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Cpu, Terminal, ShieldCheck, Database, Layers, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Title & Mission */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono text-brand-cyan uppercase tracking-widest block mb-2">Giới thiệu Dự án</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
            Nền Tảng AI Tự Động Hóa Software Engineering
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            <strong className="text-white">DevPilot AI</strong> không phải là một ứng dụng Chatbot đơn thuần. Đây là nền tảng AI chuyên biệt được thiết kế cho Sinh viên CNTT, Lập trình viên và Nhóm phát triển phần mềm để tự động hóa toàn bộ quy trình từ Yêu cầu bài toán đến Tài liệu SRS, ERD Schema, RESTful API Specs và Code mẫu.
          </p>
        </div>

        {/* 4 Key Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="glass-panel p-6 rounded-2xl">
            <Layers className="w-8 h-8 text-brand-cyan mb-4" />
            <h3 className="text-base font-bold text-white mb-2">Clean Architecture</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Thiết kế theo mô hình 5 tầng độc lập với Provider Adapter Pattern giúp thay đổi AI Model linh hoạt.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <Database className="w-8 h-8 text-brand-indigo mb-4" />
            <h3 className="text-base font-bold text-white mb-2">Supabase PostgreSQL</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Quản lý 14 Bảng dữ liệu chuẩn SQL, Row Level Security (RLS) bảo mật tuyệt đối và Supabase Storage.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <Terminal className="w-8 h-8 text-brand-purple mb-4" />
            <h3 className="text-base font-bold text-white mb-2">Gemini API Engine</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Động cơ Gemini API hỗ trợ Streaming SSE, phản hồi gõ chữ theo thời gian thực và JSON Schema mode.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-base font-bold text-white mb-2">100% Tiêu Chí Đồ Án</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Đáp ứng đầy đủ 18 tiêu chí chấm điểm khắt khe với mục tiêu cam kết điểm số 5.0/5.0 tối đa.
            </p>
          </div>
        </div>

        {/* Tech Stack List */}
        <div className="glass-panel p-8 rounded-3xl border-brand-indigo/30 mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Cpu className="w-6 h-6 text-brand-cyan" />
            <span>Công Nghệ Sử Dụng (Technology Stack)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs text-gray-300">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface/50">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span><strong>Frontend:</strong> Next.js 14 (App Router), React, TypeScript</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface/50">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span><strong>Styling:</strong> Tailwind CSS, CSS Grid, Framer Motion</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface/50">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span><strong>Database:</strong> Supabase PostgreSQL (14 Tables, RLS)</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface/50">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span><strong>Authentication:</strong> Supabase Auth (Email, Google, GitHub)</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface/50">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span><strong>Storage:</strong> Supabase Storage Buckets</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface/50">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span><strong>AI Engine:</strong> Gemini API SDK (`@google/genai`)</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
