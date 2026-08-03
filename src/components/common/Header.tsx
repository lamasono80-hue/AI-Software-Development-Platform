'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Cpu,
  Terminal,
  LayoutDashboard,
  MessageSquare,
  FolderKanban,
  LogIn,
  UserPlus,
  User,
  Settings,
  History,
  Shield,
  LogOut,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';

export function Header() {
  const { user, logout, toggleRole } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        {/* NAVIGATION LINKS BASED ON AUTH STATUS & ROLE */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Public Link: Always Visible */}
          <Link
            href="/about"
            className={`px-3.5 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
              pathname === '/about' ? 'text-white bg-surface font-semibold' : 'text-gray-300 hover:text-white hover:bg-surface-hover'
            }`}
          >
            <Terminal className="w-4 h-4 text-brand-cyan" />
            Giới thiệu
          </Link>

          {/* Logged In Links: Visible to User and Admin */}
          {user && (
            <>
              <Link
                href="/chat"
                className={`px-3.5 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                  pathname === '/chat' ? 'text-white bg-surface font-semibold' : 'text-gray-300 hover:text-white hover:bg-surface-hover'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-brand-indigo" />
                AI Chat
              </Link>

              <Link
                href="/dashboard"
                className={`px-3.5 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                  pathname === '/dashboard' ? 'text-white bg-surface font-semibold' : 'text-gray-300 hover:text-white hover:bg-surface-hover'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-brand-purple" />
                Dashboard
              </Link>

              <Link
                href="/projects"
                className={`px-3.5 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                  pathname === '/projects' ? 'text-white bg-surface font-semibold' : 'text-gray-300 hover:text-white hover:bg-surface-hover'
                }`}
              >
                <FolderKanban className="w-4 h-4 text-brand-blue" />
                Dự án
              </Link>

              {/* Admin Only Link */}
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className={`px-3.5 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                    pathname.startsWith('/admin') ? 'text-brand-purple bg-brand-purple/10 font-bold border border-brand-purple/30' : 'text-brand-purple hover:bg-brand-purple/20'
                  }`}
                >
                  <Shield className="w-4 h-4 text-brand-purple" />
                  Quản trị
                </Link>
              )}
            </>
          )}
        </nav>

        {/* RIGHT AREA: GUEST BUTTONS vs AVATAR USER DROPDOWN */}
        <div className="flex items-center gap-3">
          {!user ? (
            /* GUEST STATE: LOGIN & REGISTER BUTTONS */
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-surface-hover rounded-lg transition-colors flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Đăng nhập
              </Link>

              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-brand-gradient hover:opacity-90 rounded-lg shadow-md shadow-brand-indigo/30 transition-all hover:scale-105 flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Đăng ký
              </Link>
            </>
          ) : (
            /* LOGGED IN STATE: AVATAR USER DROPDOWN MENU */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-surface-hover transition-colors border border-transparent hover:border-surface-border"
              >
                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-brand-cyan/40 shadow-sm bg-brand-gradient flex items-center justify-center text-white font-bold text-xs">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.displayName.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-white max-w-[120px] truncate">
                    {user.displayName}
                  </span>
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${
                    user.role === 'admin' ? 'text-brand-purple' : 'text-brand-cyan'
                  }`}>
                    {user.role === 'admin' ? '🛡️ Admin' : '👤 User'}
                  </span>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* DROPDOWN MENU PANEL */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 glass-panel rounded-2xl border-surface-border shadow-2xl py-2 z-50 animate-fade-in bg-[#0D1117]/95 backdrop-blur-xl">
                  {/* Header info inside dropdown */}
                  <div className="px-4 py-2.5 border-b border-surface-border mb-1">
                    <p className="text-xs font-bold text-white truncate">{user.displayName}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                        user.role === 'admin' ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple/30' : 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30'
                      }`}>
                        Role: {user.role.toUpperCase()}
                      </span>
                      {/* Test Helper Role Switcher */}
                      <button
                        onClick={toggleRole}
                        title="Bấm để chuyển đổi nhanh Role Admin <-> User phục vụ kiểm thử"
                        className="text-[9px] text-gray-400 hover:text-white underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        Switch
                      </button>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-surface-hover transition-colors"
                  >
                    <User className="w-4 h-4 text-brand-cyan" />
                    <span>👤 Hồ sơ cá nhân</span>
                  </Link>

                  <Link
                    href="/projects"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-surface-hover transition-colors"
                  >
                    <FolderKanban className="w-4 h-4 text-brand-blue" />
                    <span>📁 Dự án của tôi</span>
                  </Link>

                  <Link
                    href="/history"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-surface-hover transition-colors"
                  >
                    <History className="w-4 h-4 text-brand-purple" />
                    <span>📄 Lịch sử AI</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-surface-hover transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    <span>⚙️ Cài đặt</span>
                  </Link>

                  {/* Admin Only Dropdown Item */}
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-brand-purple hover:bg-brand-purple/10 font-semibold transition-colors border-t border-surface-border mt-1 pt-2"
                    >
                      <Shield className="w-4 h-4 text-brand-purple" />
                      <span>🛡️ Quản trị hệ thống</span>
                    </Link>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 font-semibold transition-colors border-t border-surface-border mt-1 pt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>🚪 Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
