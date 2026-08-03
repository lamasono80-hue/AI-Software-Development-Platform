import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-purple/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="text-center max-w-lg space-y-6 relative z-10 glass-panel p-10 rounded-3xl border-surface-border">
          <span className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-indigo to-brand-purple tracking-widest font-mono">
            404
          </span>
          
          <h2 className="text-xl font-bold text-white">Trang Không Tồn Tại</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Đường dẫn bạn yêu cầu không tồn tại hoặc đã được di chuyển trong hệ thống DevPilot AI.
          </p>

          <Link href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-gradient text-white text-xs font-semibold shadow-lg shadow-brand-indigo/30 hover:scale-105 transition-transform">
            <Home className="w-4 h-4" />
            <span>Quay về Trang Chủ</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
