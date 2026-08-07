'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AuthGuard } from '@/components/common/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import { getDashboardStatsByUser, getProjectsByUser, ProjectRecord } from '@/lib/supabase-db';
import { FolderKanban, MessageSquare, FileText, Zap, ArrowRight, Plus, Clock, Cpu, BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const userId = user?.id || 'usr_demo_101';

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalChats: 0,
    totalDocuments: 0,
    totalAICalls: 0,
    savedHours: '0h',
  });

  const [recentProjects, setRecentProjects] = useState<ProjectRecord[]>([]);

  useEffect(() => {
    async function loadRealStats() {
      const data = await getDashboardStatsByUser(userId);
      setStats(data);

      const projects = await getProjectsByUser(userId);
      setRecentProjects(projects.slice(0, 5));
    }
    loadRealStats();
  }, [userId]);

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Dashboard Quản Trị & Workspace</h1>
              <p className="text-xs sm:text-sm text-gray-400">Theo dõi số liệu thực tế từ Supabase, tạo dự án mới và tương tác với AI Assistant</p>
            </div>

            <Link href="/projects" className="px-5 py-2.5 rounded-xl bg-brand-gradient text-white text-xs font-semibold shadow-lg shadow-brand-indigo/30 hover:scale-105 transition-transform flex items-center justify-center gap-2 self-start md:self-auto">
              <Plus className="w-4 h-4" />
              <span>Tạo Dự Án AI Mới</span>
            </Link>
          </div>

          {/* REAL STATS CARDS (Dynamic Supabase Data) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="glass-panel p-5 rounded-2xl glow-border flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block mb-1">Tổng Số Dự Án</span>
                <span className="text-2xl font-bold text-white font-mono">{stats.totalProjects}</span>
                <span className="text-[10px] text-emerald-400 block mt-1">Lưu trữ trên Supabase</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
                <FolderKanban className="w-5 h-5" />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl glow-border flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block mb-1">Lượt Gọi AI Engine</span>
                <span className="text-2xl font-bold text-white font-mono">{stats.totalAICalls}</span>
                <span className="text-[10px] text-brand-cyan block mt-1">Gemini 1.5 Active</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 border border-brand-indigo/30 flex items-center justify-center text-brand-indigo">
                <Cpu className="w-5 h-5" />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl glow-border flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block mb-1">Tài Liệu SRS & ERD</span>
                <span className="text-2xl font-bold text-white font-mono">{stats.totalDocuments}</span>
                <span className="text-[10px] text-brand-purple block mt-1">Ready to Export</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl glow-border flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block mb-1">Thời Gian Tiết Kiệm</span>
                <span className="text-2xl font-bold text-white font-mono">{stats.savedHours}</span>
                <span className="text-[10px] text-emerald-400 block mt-1">Tự động hóa 85%</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* QUICK AI ACTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/projects" className="glass-panel p-6 rounded-2xl hover:bg-surface-hover transition-all group border-brand-cyan/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
                  <Zap className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Sinh Dự Án Phần Mềm AI</h3>
              <p className="text-xs text-gray-400">Phân tích SRS, Use Case, ERD Diagram, RESTful API Specs & SQL trong 1 click.</p>
            </Link>

            <Link href="/chat" className="glass-panel p-6 rounded-2xl hover:bg-surface-hover transition-all group border-brand-indigo/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 border border-brand-indigo/30 flex items-center justify-center text-brand-indigo">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">AI Chat Assistant Stream</h3>
              <p className="text-xs text-gray-400">Trò chuyện thời gian thực, hỏi đáp thuật toán, review code và refactoring.</p>
            </Link>

            <Link href="/documents" className="glass-panel p-6 rounded-2xl hover:bg-surface-hover transition-all group border-brand-purple/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple">
                  <FileText className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Document Studio & Export</h3>
              <p className="text-xs text-gray-400">Đọc, chỉnh sửa Markdown và xuất bộ tài liệu hoàn chỉnh ra file PDF, DOCX.</p>
            </Link>
          </div>

          {/* REAL RECENT PROJECTS TABLE */}
          <div className="glass-panel rounded-2xl border-surface-border overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-cyan" />
                <span>Dự Án Gần Đây Từ Supabase ({recentProjects.length})</span>
              </h3>
              <Link href="/projects" className="text-xs text-brand-cyan hover:underline font-medium">
                Xem tất cả
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-surface/50 text-gray-400 uppercase text-[10px] font-mono border-b border-surface-border">
                  <tr>
                    <th className="px-6 py-3">Tên Dự Án</th>
                    <th className="px-6 py-3">Lĩnh Vực</th>
                    <th className="px-6 py-3">Kiến Trúc</th>
                    <th className="px-6 py-3">Ngày Tạo</th>
                    <th className="px-6 py-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/50">
                  {recentProjects.length > 0 ? (
                    recentProjects.map((p) => (
                      <tr key={p.id} className="hover:bg-surface-hover/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-white">{p.name}</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 font-mono text-[10px]">{p.category}</span></td>
                        <td className="px-6 py-4 text-gray-400">{p.architecture_type}</td>
                        <td className="px-6 py-4 font-mono text-gray-400">{p.created_at}</td>
                        <td className="px-6 py-4 text-right">
                          <Link href="/projects" className="text-brand-cyan hover:underline font-medium">Chi tiết</Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">
                        Chưa có dự án nào. Hãy nhấn vào "Tạo Dự Án AI Mới" để sinh dự án đầu tiên!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
