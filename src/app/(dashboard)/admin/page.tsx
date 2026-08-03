import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Shield, Users, Database, Cpu, Activity } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-brand-purple" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Trang Quản Trị Hệ Thống (Admin Dashboard)</h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">Quản lý người dùng, phân quyền Role, theo dõi API Usage & Audit Logs toàn hệ thống</p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8">
          <div className="glass-panel p-5 rounded-2xl">
            <span className="text-xs text-gray-400 block mb-1">Tổng Người Dùng</span>
            <span className="text-2xl font-bold text-white">1,240</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl">
            <span className="text-xs text-gray-400 block mb-1">Dự Án AI Đã Sinh</span>
            <span className="text-2xl font-bold text-white">4,890</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl">
            <span className="text-xs text-gray-400 block mb-1">Tổng API Tokens Called</span>
            <span className="text-2xl font-bold text-white">2.4M</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl">
            <span className="text-xs text-gray-400 block mb-1">Trạng Thái Hệ Thống</span>
            <span className="text-2xl font-bold text-emerald-400">100% Operational</span>
          </div>
        </div>

        {/* User Management Table */}
        <div className="glass-panel rounded-2xl border-surface-border overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-border">
            <h3 className="text-base font-bold text-white">Quản Lý Người Dùng & Phân Quyền</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-surface/50 text-gray-400 uppercase text-[10px] font-mono border-b border-surface-border">
                <tr>
                  <th className="px-6 py-3">User Email</th>
                  <th className="px-6 py-3">Họ và Tên</th>
                  <th className="px-6 py-3">Phân Quyền (Role)</th>
                  <th className="px-6 py-3">Trạng Thái</th>
                  <th className="px-6 py-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                <tr className="hover:bg-surface-hover/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-white">admin@devpilot.ai</td>
                  <td className="px-6 py-4 font-semibold text-white">Senior Software Architect</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 rounded bg-brand-purple/20 text-brand-purple text-[10px] font-mono font-bold">ADMIN</span></td>
                  <td className="px-6 py-4"><span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">Active</span></td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-white font-medium">Chỉnh sửa</button>
                  </td>
                </tr>

                <tr className="hover:bg-surface-hover/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-white">student@cntt.edu.vn</td>
                  <td className="px-6 py-4 font-semibold text-white">Sinh viên CNTT</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 rounded bg-brand-cyan/20 text-brand-cyan text-[10px] font-mono">USER</span></td>
                  <td className="px-6 py-4"><span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">Active</span></td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-white font-medium">Chỉnh sửa</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
