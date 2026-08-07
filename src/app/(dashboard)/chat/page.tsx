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

  // Auto-scroll ref
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Popover 3-Dots Menu State
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Rename Modal State
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');

  // 1. Load user's chats from Supabase DB on mount
  useEffect(() => {
    async function loadUserChats() {
      const userChats = await getChatsByUser(userId);
      setChats(userChats);

      if (userChats.length > 0) {
        setActiveChatId(userChats[0].id);
      } else {
        const newChat = await createChatForUser(userId, 'Tư vấn Lập trình & AI');
        setChats([newChat]);
        setActiveChatId(newChat.id);
      }
    }
    loadUserChats();
  }, [userId]);

  // 2. Fetch messages from Supabase DB whenever activeChatId changes
  useEffect(() => {
    async function loadChatMessages() {
      if (!activeChatId) return;
      const msgs = await getMessagesByChat(activeChatId);
      setMessages(msgs);
      scrollToBottom();
    }
    loadChatMessages();
  }, [activeChatId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

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

  // Handle Create New Chat
  const handleCreateNewChat = async () => {
    const newChat = await createChatForUser(userId, `Cuộc trò chuyện mới #${chats.length + 1}`);
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    toast.success('Đã tạo cuộc trò chuyện mới!');
  };

  // Real Gemini Streaming Chat Handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !activeChatId) return;

    const userText = input.trim();
    setInput('');
    setLoading(true);

    // Save user message to Supabase DB
    const userMsg = await addMessageToChat(activeChatId, userId, 'user', userText);
    setMessages((prev) => [...prev, userMsg]);
    scrollToBottom();

    // Placeholder for AI streaming response in UI
    const tempAiMsgId = `msg_stream_${Date.now()}`;
    const tempAiMsg: MessageRecord = {
      id: tempAiMsgId,
      chat_id: activeChatId,
      user_id: userId,
      role: 'assistant',
      content: '',
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, tempAiMsg]);

    try {
      // Build conversation history payload
      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Lỗi phản hồi từ server AI!');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullAiText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullAiText += chunk;

        // Stream update UI chunk by chunk
        setMessages((prev) =>
          prev.map((m) => (m.id === tempAiMsgId ? { ...m, content: fullAiText } : m))
        );
        scrollToBottom();
      }

      // Save complete Gemini AI response into Supabase DB
      if (fullAiText.trim()) {
        await addMessageToChat(activeChatId, userId, 'assistant', fullAiText);
      }
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi kết nối với Gemini AI Engine!');
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempAiMsgId
            ? { ...m, content: `⚠️ Lỗi kết nối Gemini AI Engine: ${err.message || 'Không thể tạo phản hồi'}` }
            : m
        )
      );
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
          {/* SIDEBAR: CHATS HISTORY LIST */}
          <aside className="w-full md:w-72 glass-panel p-4 rounded-2xl border-surface-border shrink-0 flex flex-col h-[750px]">
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

          {/* MAIN CHAT DISPLAY - FIXED HEADER & FOOTER, ONLY FEED SCROLLS */}
          <div className="flex-1 glass-panel rounded-2xl border-surface-border flex flex-col h-[750px] overflow-hidden relative">
            {/* FIXED HEADER WITH (⋮) MENU */}
            <div className="sticky top-0 z-10 px-6 py-4 border-b border-surface-border bg-[#0D1117]/90 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{currentChatObj?.title || 'Cuộc trò chuyện AI'}</span>
                    {currentChatObj?.is_favorite && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-mono">Engine: Gemini 1.5 Flash SSE Stream (Active)</span>
                </div>
              </div>

              {/* CHATGPT-STYLE (⋮) 3-DOTS MENU */}
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

            {/* MESSAGES FEED - ONLY THIS AREA SCROLLS */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-xl bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div className={`space-y-1 max-w-[85%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-brand-gradient text-white shadow-md rounded-tr-none'
                            : 'bg-[#0D1117] text-gray-200 border border-surface-border rounded-tl-none'
                        }`}
                      >
                        <div className="whitespace-pre-wrap font-sans">{msg.content || (loading && msg.role === 'assistant' ? '...' : '')}</div>
                      </div>

                      <div className="flex items-center gap-2 px-1 text-[10px] text-gray-500 justify-end">
                        <span>{msg.created_at}</span>
                        {msg.role === 'assistant' && msg.content && (
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

                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-xl bg-brand-indigo text-white flex items-center justify-center shrink-0 shadow-md">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {loading && messages[messages.length - 1]?.content === '' && (
                  <div className="flex gap-3.5 items-center max-w-3xl">
                    <div className="w-8 h-8 rounded-xl bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#0D1117] text-gray-400 text-xs border border-surface-border flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-cyan animate-pulse" />
                      <span>Gemini AI đang suy nghĩ & gõ chữ...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* FIXED BOTTOM INPUT FORM */}
            <form onSubmit={handleSendMessage} className="sticky bottom-0 z-10 p-4 border-t border-surface-border bg-[#0D1117]/95 backdrop-blur-md">
              <div className="max-w-4xl mx-auto relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập bất kỳ câu hỏi nào (ví dụ: hi, bạn tên gì, viết code React, tạo database SQL)..."
                  className="w-full bg-[#111827] border border-surface-border rounded-xl pl-4 pr-12 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
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
