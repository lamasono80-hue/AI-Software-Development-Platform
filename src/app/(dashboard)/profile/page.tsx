import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { User, Mail, Shield, Upload, Calendar } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Hồ Sơ Cá Nhân</h1>
          <p className="text-xs sm:text-sm text-gray-400">Quản lý thông tin tài khoản và quyền hạn sử dụng DevPilot AI</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border-surface-border space-y-6">
          <div className="flex items-center gap-6 pb-6 border-b border-surface-border">
            <div className="w-20 h-20 rounded-2xl bg-brand-gradient flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-brand-indigo/30">
              U
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">User DevTeam Senior</h2>
              <p className="text-xs text-gray-400">user@devpilot.ai</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-md bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-[10px] font-mono uppercase">
                  Role: User
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                  Status: Active
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-surface/50 space-y-1">
              <span className="text-gray-400 block">Phương thức đăng nhập</span>
              <span className="font-semibold text-white">Supabase Auth (Email / OAuth)</span>
            </div>

            <div className="p-4 rounded-xl bg-surface/50 space-y-1">
              <span className="text-gray-400 block">Ngày tham gia</span>
              <span className="font-semibold text-white">03 Tháng 08, 2026</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
