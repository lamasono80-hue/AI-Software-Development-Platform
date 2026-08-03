'use client';

import Link from 'next/link';
import { Cpu, Terminal, LayoutDashboard, MessageSquare, FolderKanban, LogIn, UserPlus } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-lg shadow-brand-cyan/20 group-hover:scale-105 transition-transform">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
              DevPilot <span className="text-brand-cyan font-extrabold">AI</span>
            </span>
            <span className="text-[10px] text-brand-indigo font-mono tracking-widest uppercase">Platform</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/about" className="px-3.5 py-2 text-sm text-gray-300 hover:text-white rounded-lg hover:bg-surface-hover transition-colors flex items-center gap-2">
            <Terminal className="w-4 h-4 text-brand-cyan" />
            Giới thiệu
          </Link>

          <Link href="/chat" className="px-3.5 py-2 text-sm text-gray-300 hover:text-white rounded-lg hover:bg-surface-hover transition-colors flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-indigo" />
            AI Chat
          </Link>

          <Link href="/dashboard" className="px-3.5 py-2 text-sm text-gray-300 hover:text-white rounded-lg hover:bg-surface-hover transition-colors flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-brand-purple" />
            Dashboard
          </Link>

          <Link href="/projects" className="px-3.5 py-2 text-sm text-gray-300 hover:text-white rounded-lg hover:bg-surface-hover transition-colors flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-brand-blue" />
            Dự án
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-surface-hover rounded-lg transition-colors flex items-center gap-2">
            <LogIn className="w-4 h-4" />
            Đăng nhập
          </Link>

          <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-brand-gradient hover:opacity-90 rounded-lg shadow-md shadow-brand-indigo/30 transition-all hover:scale-105 flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Đăng ký
          </Link>
        </div>
      </div>
    </header>
  );
}
