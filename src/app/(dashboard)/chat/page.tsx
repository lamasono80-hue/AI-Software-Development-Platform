'use client';

import { useState } from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AuthGuard } from '@/components/common/AuthGuard';
import { MessageSquare, Send, Bot, User, Sparkles, RefreshCw, Copy, Check, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      content: 'Chào bạn! Tôi là DevPilot AI Assistant. Tôi có thể giúp gì cho bạn hôm nay? Bạn có thể yêu cầu tôi thiết kế Database, viết tài liệu SRS, review code hoặc giải đáp thuật toán.',
      timestamp: '19:40',
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentPrompt = input;
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let aiContent = '';
      if (currentPrompt.toLowerCase().includes('bệnh viện') || currentPrompt.toLowerCase().includes('database')) {
        aiContent = `Dưới đây là thiết kế Bảng dữ liệu **PostgreSQL** cho Phân hệ Quản lý Bệnh nhân:\n\n\`\`\`sql\nCREATE TABLE patients (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  full_name VARCHAR(255) NOT NULL,\n  date_of_birth DATE,\n  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),\n  phone VARCHAR(20) UNIQUE,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\`\`\`\n\nBạn có muốn tôi phát triển thêm bảng **` + '`appointments`' + `** và **` + '`doctors`' + `** không?`;
      } else {
        aiContent = `Tôi đã nhận được câu hỏi: "${currentPrompt}". Đã phân tích theo kiến trúc Clean Code & SOLID. Bạn có thể sử dụng cấu hình Gemini Provider Adapter để tối ưu tốc độ phản hồi!`;
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 1000);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Đã sao chép nội dung!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 glass-panel p-4 rounded-2xl border-surface-border shrink-0 flex flex-col">
            <button className="w-full py-2.5 px-4 rounded-xl bg-brand-gradient text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 mb-4 hover:scale-105 transition-transform">
              <Plus className="w-4 h-4" />
              <span>Cuộc Trò Chuyện Mới</span>
            </button>

            <div className="flex-1 overflow-y-auto space-y-1">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest px-2 block mb-2">Hôm nay</span>
              <button className="w-full text-left p-2.5 rounded-lg bg-surface/80 text-white text-xs font-medium flex items-center gap-2 truncate">
                <MessageSquare className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                <span className="truncate">Tạo hệ thống quản lý bệnh viện</span>
              </button>
              <button className="w-full text-left p-2.5 rounded-lg hover:bg-surface/50 text-gray-400 text-xs flex items-center gap-2 truncate transition-colors">
                <MessageSquare className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <span className="truncate">Review Code Auth Middleware</span>
              </button>
            </div>
          </aside>

          <div className="flex-1 glass-panel rounded-2xl border-surface-border flex flex-col h-[700px] overflow-hidden">
            <div className="px-6 py-3.5 border-b border-surface-border bg-surface/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">DevPilot AI Assistant Streaming</h3>
                  <span className="text-[10px] text-emerald-400 font-mono">Engine: Gemini 1.5 Flash (Active)</span>
                </div>
              </div>

              <button
                onClick={() => setMessages([])}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-hover border border-surface-border transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Xóa lịch sử</span>
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      msg.role === 'user' ? 'bg-brand-indigo text-white' : 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`space-y-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-brand-gradient text-white shadow-md'
                          : 'bg-[#0D1117] text-gray-200 border border-surface-border'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                    </div>

                    <div className="flex items-center gap-2 px-1 text-[10px] text-gray-500">
                      <span>{msg.timestamp}</span>
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-gray-300 flex items-center gap-1 ml-2"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Copy</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 max-w-3xl">
                  <div className="w-8 h-8 rounded-lg bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 flex items-center justify-center">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-4 rounded-2xl bg-[#0D1117] text-gray-400 text-xs border border-surface-border flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-cyan animate-pulse" />
                    <span>DevPilot AI đang suy nghĩ & sinh câu trả lời...</span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-surface-border bg-surface/30">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập câu hỏi hoặc yêu cầu (ví dụ: Viết SQL bảng bệnh nhân)..."
                  className="w-full bg-[#0D1117] border border-surface-border rounded-xl pl-4 pr-12 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center text-white hover:scale-105 disabled:opacity-50 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
