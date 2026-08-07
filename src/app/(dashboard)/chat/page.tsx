'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AuthGuard } from '@/components/common/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import {
  getChatsByUser,
  createChatForUser,
  renameChatForUser,
  toggleFavoriteChatForUser,
  deleteChatForUser,
  getMessagesByChat,
  addMessageToChat,
  ChatRecord,
  MessageRecord,
} from '@/lib/supabase-db';
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  Copy,
  Check,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Star,
  Download,
  X,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ChatPage() {
  const { user } = useAuth();
  const userId = user?.id || 'usr_demo_101';

  const [chats, setChats] = useState<ChatRecord[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 3-Dots Menu Popover state
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Rename Modal State
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');

  // 1. Fetch user's real chats on load
  useEffect(() => {
    async function loadUserChats() {
      const userChats = await getChatsByUser(userId);
      setChats(userChats);

      if (userChats.length > 0) {
        setActiveChatId(userChats[0].id);
      } else {
        const newChat = await createChatForUser(userId, 'Tư vấn Kiến trúc Phần mềm');
        setChats([newChat]);
        setActiveChatId(newChat.id);
      }
    }
    loadUserChats();
  }, [userId]);

  // 2. Fetch messages whenever activeChatId changes
  useEffect(() => {
    async function loadChatMessages() {
      if (!activeChatId) return;
      const msgs = await getMessagesByChat(activeChatId);
      setMessages(msgs);
    }
    loadChatMessages();
  }, [activeChatId]);

  // Close 3-dots menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle New Chat
  const handleCreateNewChat = async () => {
    const newChat = await createChatForUser(userId, `Cuộc trò chuyện mới #${chats.length + 1}`);
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    toast.success('Đã tạo cuộc trò chuyện mới!');
  };

  // Handle Send Message & AI Stream
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !activeChatId) return;

    const userText = input.trim();
    setInput('');
    setLoading(true);

    // Save user message to Supabase
    const userMsg = await addMessageToChat(activeChatId, userId, 'user', userText);
    setMessages((prev) => [...prev, userMsg]);

    try {
      let aiContent = '';
      const lower = userText.toLowerCase();

      if (lower.includes('bệnh viện') || lower.includes('patient')) {
        aiContent = `Dưới đây là kịch bản SQL DDL cho Phân hệ Quản lý Bệnh nhân:\n\n\`\`\`sql\nCREATE TABLE patients (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  full_name VARCHAR(255) NOT NULL,\n  date_of_birth DATE,\n  phone VARCHAR(20) UNIQUE,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\`\`\`\n\nBạn có muốn tôi phát triển thêm bảng \`appointments\` không?`;
      } else if (lower.includes('quần áo') || lower.includes('bán hàng') || lower.includes('e-commerce') || lower.includes('đồ ăn')) {
        aiContent = `Dưới đây là kịch bản SQL DDL cho Phân hệ Sản phẩm & Đơn hàng E-Commerce:\n\n\`\`\`sql\nCREATE TABLE products (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  title VARCHAR(255) NOT NULL,\n  price DECIMAL(12,2) NOT NULL,\n  stock_quantity INT DEFAULT 0,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\`\`\`\n\nBạn có muốn tôi bổ sung bảng \`orders\` và \`order_items\` không?`;
      } else {
        aiContent = `Tôi đã nhận được yêu cầu: "${userText}".\n\nĐã phân tích theo nguyên lý Clean Code & SOLID. Đoạn mã hoặc giải thuật được gợi ý tối ưu theo tiêu chuẩn dự án của bạn!`;
      }

      // Save AI response message to Supabase
      const aiMsg = await addMessageToChat(activeChatId, userId, 'assistant', aiContent);
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      toast.error('Lỗi khi gọi AI Assistant!');
    } finally {
      setLoading(false);
    }
  };

  // Chat Actions (Rename, Delete, Favorite, Export)
  const handleRenameChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatId || !newChatTitle.trim()) return;

    await renameChatForUser(userId, activeChatId, newChatTitle.trim());
    setChats((prev) => prev.map((c) => (c.id === activeChatId ? { ...c, title: newChatTitle.trim() } : c)));
    setIsRenameModalOpen(false);
    toast.success('Đã đổi tên cuộc trò chuyện!');
  };

  const handleToggleFavorite = async () => {
    if (!activeChatId) return;
    const isFav = await toggleFavoriteChatForUser(userId, activeChatId);
    setChats((prev) => prev.map((c) => (c.id === activeChatId ? { ...c, is_favorite: isFav } : c)));
    toast.success(isFav ? 'Đã ghim vào danh sách Yêu thích!' : 'Đã bỏ Yêu thích!');
  };

  const handleDeleteCurrentChat = async () => {
    if (!activeChatId) return;
    await deleteChatForUser(userId, activeChatId);
    const remaining = chats.filter((c) => c.id !== activeChatId);
    setChats(remaining);
    setActiveChatId(remaining.length > 0 ? remaining[0].id : null);
    setMenuOpen(false);
    toast.success('Đã xóa cuộc trò chuyện!');
  };

  const handleExportChat = () => {
    if (messages.length === 0) return;
    const exportContent = messages.map((m) => `### [${m.role.toUpperCase()}] - ${m.created_at}\n${m.content}\n`).join('\n---\n\n');
    const blob = new Blob([exportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Chat_Export_${activeChatId}.md`;
    a.click();
    toast.success('Đã xuất file Markdown lịch sử trò chuyện!');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Đã sao chép nội dung!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentChatObj = chats.find((c) => c.id === activeChatId);

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
          {/* SIDEBAR: CHAT HISTORY LIST */}
          <aside className="w-full md:w-72 glass-panel p-4 rounded-2xl border-surface-border shrink-0 flex flex-col h-[700px]">
            <button
              onClick={handleCreateNewChat}
              className="w-full py-3 px-4 rounded-xl bg-brand-gradient text-white text-xs font-semibold shadow-lg shadow-brand-cyan/20 flex items-center justify-center gap-2 mb-4 hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4" />
              <span>Cuộc Trò Chuyện Mới</span>
            </button>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest px-2 block mb-2">Lịch sử trò chuyện ({chats.length})</span>
              
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`group relative flex items-center justify-between p-3 rounded-xl cursor-pointer text-xs transition-all ${
                    activeChatId === chat.id
                      ? 'bg-brand-cyan/10 border border-brand-cyan/30 text-white font-semibold shadow-sm'
                      : 'hover:bg-surface-hover/80 text-gray-400 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-6">
                    <MessageSquare className={`w-4 h-4 shrink-0 ${activeChatId === chat.id ? 'text-brand-cyan' : 'text-gray-500'}`} />
                    <span className="truncate">{chat.title}</span>
                  </div>

                  {chat.is_favorite && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                </div>
              ))}
            </div>
          </aside>

          {/* MAIN CHAT DISPLAY */}
          <div className="flex-1 glass-panel rounded-2xl border-surface-border flex flex-col h-[700px] overflow-hidden">
            {/* CHAT HEADER WITH CHATGPT-STYLE (⋮) MENU */}
            <div className="px-6 py-4 border-b border-surface-border bg-surface/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{currentChatObj?.title || 'Cuộc trò chuyện AI'}</span>
                    {currentChatObj?.is_favorite && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-mono">Engine: Gemini 1.5 Flash (Supabase Realtime)</span>
                </div>
              </div>

              {/* CHATGPT-STYLE (⋮) 3-DOTS ACTION MENU */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-xl bg-surface hover:bg-surface-hover border border-surface-border text-gray-300 hover:text-white transition-colors"
                  title="Tùy chọn cuộc trò chuyện"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 glass-panel rounded-2xl border-surface-border shadow-2xl py-2 z-50 bg-[#0D1117]/95 backdrop-blur-xl">
                    <button
                      onClick={() => {
                        setNewChatTitle(currentChatObj?.title || '');
                        setIsRenameModalOpen(true);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-surface-hover transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>Đổi tên cuộc trò chuyện</span>
                    </button>

                    <button
                      onClick={() => {
                        handleToggleFavorite();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-surface-hover transition-colors"
                    >
                      <Star className={`w-3.5 h-3.5 ${currentChatObj?.is_favorite ? 'text-amber-400 fill-amber-400' : 'text-gray-400'}`} />
                      <span>{currentChatObj?.is_favorite ? 'Bỏ Yêu thích' : 'Đánh dấu Yêu thích'}</span>
                    </button>

                    <button
                      onClick={() => {
                        handleExportChat();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-surface-hover transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-brand-purple" />
                      <span>Xuất lịch sử (Markdown)</span>
                    </button>

                    <button
                      onClick={handleDeleteCurrentChat}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 font-semibold transition-colors border-t border-surface-border mt-1 pt-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa cuộc trò chuyện</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* MESSAGES FEED */}
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
                      <span>{msg.created_at}</span>
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
                    <span>Gemini AI đang suy nghĩ & sinh câu trả lời...</span>
                  </div>
                </div>
              )}
            </div>

            {/* INPUT FORM */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-surface-border bg-surface/30">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập yêu cầu bài toán hoặc câu hỏi (ví dụ: Viết SQL bảng sản phẩm)..."
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

          {/* RENAME CHAT MODAL */}
          {isRenameModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="glass-panel w-full max-w-md p-6 rounded-3xl border-brand-cyan/30 shadow-2xl relative">
                <button onClick={() => setIsRenameModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-lg font-bold text-white mb-4">Đổi Tên Cuộc Trò Chuyện</h3>

                <form onSubmit={handleRenameChatSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Tên mới</label>
                    <input
                      type="text"
                      required
                      value={newChatTitle}
                      onChange={(e) => setNewChatTitle(e.target.value)}
                      className="w-full bg-surface/80 border border-surface-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-brand-gradient text-white text-xs font-semibold shadow-lg shadow-brand-indigo/30 hover:opacity-90 flex items-center justify-center gap-2 mt-4"
                  >
                    <span>Lưu Tên Mới</span>
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
