'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AuthGuard } from '@/components/common/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import { getAIHistoriesByUser, AIHistoryRecord } from '@/lib/supabase-db';
import { RotateCcw, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function HistoryPage() {
  const { user } = useAuth();
  const userId = user?.id || 'usr_demo_101';

  const [histories, setHistories] = useState<AIHistoryRecord[]>([]);

  useEffect(() => {
    async function loadHistories() {
      const logs = await getAIHistoriesByUser(userId);
      setHistories(logs);
    }
    loadHistories();
  }, [userId]);

  const handleRerun = (prompt: string) => {
    toast.info(`Đang gửi lại yêu cầu prompt: "${prompt}"...`);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Lịch Sử AI Generation (Supabase Log)</h1>
            <p className="text-xs sm:text-sm text-gray-400">Ghi vết các phiên gọi AI Engine thực tế của riêng bạn, Prompt sử dụng và thời gian phản hồi</p>
          </div>

          <div className="glass-panel rounded-2xl border-surface-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-surface/50 text-gray-400 uppercase text-[10px] font-mono border-b border-surface-border">
                  <tr>
                    <th className="px-6 py-3">Thời Gian</th>
                    <th className="px-6 py-3">Loại Hành Động</th>
                    <th className="px-6 py-3">Prompt Sử Dụng</th>
                    <th className="px-6 py-3">Thời Gian Xử Lý</th>
                    <th className="px-6 py-3">Trạng Thái</th>
                    <th className="px-6 py-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/50">
                  {histories.length > 0 ? (
                    histories.map((log) => (
                      <tr key={log.id} className="hover:bg-surface-hover/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-[11px] text-gray-400">{log.created_at}</td>
                        <td className="px-6 py-4 font-semibold text-white">{log.action_type}</td>
                        <td className="px-6 py-4 text-brand-cyan truncate max-w-xs">{log.prompt_used}</td>
                        <td className="px-6 py-4 font-mono text-gray-400">{(log.execution_time_ms / 1000).toFixed(2)}s</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                            {log.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleRerun(log.prompt_used)}
                            className="text-brand-cyan hover:underline flex items-center justify-end gap-1 ml-auto"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Chạy lại</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500 italic">
                        Chưa có lịch sử AI nào. Hãy tạo dự án mới hoặc chat với AI để lưu lịch sử!
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
