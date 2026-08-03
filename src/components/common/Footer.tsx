import Link from 'next/link';
import { Cpu, Github, Globe, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-background/80 backdrop-blur-md mt-auto py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">DevPilot AI</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Nền tảng AI hỗ trợ phân tích, thiết kế sơ đồ ERD/UML, sinh tài liệu SRS và mã nguồn chuyên nghiệp cho lập trình viên.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Tính Năng Nổi Bật</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link href="/projects" className="hover:text-brand-cyan transition-colors">Tự động Phân tích SRS</Link></li>
              <li><Link href="/projects" className="hover:text-brand-cyan transition-colors">Sinh sơ đồ ERD & SQL Schema</Link></li>
              <li><Link href="/chat" className="hover:text-brand-cyan transition-colors">Streaming AI Assistant</Link></li>
              <li><Link href="/documents" className="hover:text-brand-cyan transition-colors">Xuất File PDF / DOCX / MD</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Trang Ứng Dụng</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link href="/dashboard" className="hover:text-brand-cyan transition-colors">Dashboard Quản trị</Link></li>
              <li><Link href="/projects" className="hover:text-brand-cyan transition-colors">Danh sách Dự án</Link></li>
              <li><Link href="/history" className="hover:text-brand-cyan transition-colors">Lịch sử AI Generation</Link></li>
              <li><Link href="/about" className="hover:text-brand-cyan transition-colors">Về Chúng Tôi</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Kết Nối & Công Nghệ</h4>
            <div className="flex items-center gap-3 mb-3">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-gray-400 hover:text-white hover:bg-surface-hover transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://vercel.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-gray-400 hover:text-white hover:bg-surface-hover transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[11px] text-gray-500 font-mono">
              Powering by Next.js 14, Supabase & Gemini API
            </p>
          </div>
        </div>

        <div className="border-t border-surface-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 DevPilot AI. Đồ án Học phần Software Engineering.</p>
          <div className="flex items-center gap-1">
            <span>Thiết kế với</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>bởi DevTeam Senior</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
