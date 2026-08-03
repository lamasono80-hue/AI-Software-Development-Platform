'use client';

import { useState } from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Settings, Moon, Sun, Cpu, Key, Bell, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [provider, setProvider] = useState('gemini');
  const [apiKey, setApiKey] = useState('');
  const [theme, setTheme] = useState('dark');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Đã lưu cấu hình cài đặt thành công!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Cài Đặt Hệ Thống</h1>
          <p className="text-xs sm:text-sm text-gray-400">Tùy chỉnh giao diện, chọn nhà cung cấp AI và cấu hình API key cá nhân</p>
        </div>

        <form onSubmit={handleSaveSettings} className="glass-panel p-8 rounded-3xl border-surface-border space-y-6">
          {/* AI Provider Section */}
          <div className="space-y-4 pb-6 border-b border-surface-border">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-brand-cyan" />
              <span>AI Provider Manager (Adapter Configuration)</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Nhà cung cấp AI mặc định</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-surface/80 border border-surface-border rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-cyan transition-colors"
              >
                <option value="gemini">Google Gemini API (Active Engine - Triển khai thực tế)</option>
                <option value="openai">OpenAI API (Pluggable Adapter Interface)</option>
                <option value="claude">Anthropic Claude (Pluggable Adapter Interface)</option>
                <option value="deepseek">DeepSeek AI (Pluggable Adapter Interface)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Gemini API Key cá nhân (Tùy chọn)</label>
              <div className="relative">
                <Key className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-surface/80 border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Theme Section */}
          <div className="space-y-4 pb-6 border-b border-surface-border">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Moon className="w-5 h-5 text-brand-indigo" />
              <span>Giao Diện & Theme Mode</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  theme === 'dark' ? 'border-brand-cyan bg-brand-cyan/10 text-white' : 'border-surface-border text-gray-400'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Sleek Dark</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  theme === 'light' ? 'border-brand-cyan bg-brand-cyan/10 text-white' : 'border-surface-border text-gray-400'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Modern Light</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  theme === 'system' ? 'border-brand-cyan bg-brand-cyan/10 text-white' : 'border-surface-border text-gray-400'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Hệ Thống</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-brand-gradient text-white text-xs font-semibold shadow-lg shadow-brand-indigo/30 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Tùy Chỉnh Cài Đặt</span>
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
