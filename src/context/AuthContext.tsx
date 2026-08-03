'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  role: 'admin' | 'user';
  provider: string;
  createdAt: string;
  projectCount: number;
  aiRequestCount: number;
  documentCount: number;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  toggleRole: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
  updateProfile: () => {},
  toggleRole: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. Check local demo user storage
        const localUserStr = localStorage.getItem('devpilot_user');
        if (localUserStr) {
          const parsed = JSON.parse(localUserStr);
          setUser({
            id: parsed.id || 'usr_demo_101',
            email: parsed.email || 'user@devpilot.ai',
            displayName: parsed.displayName || 'Nguyễn Văn A',
            avatarUrl: parsed.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            role: parsed.role || 'user',
            provider: parsed.provider || 'email',
            createdAt: parsed.createdAt || '03/08/2026',
            projectCount: parsed.projectCount ?? 12,
            aiRequestCount: parsed.aiRequestCount ?? 148,
            documentCount: parsed.documentCount ?? 34,
          });
          setLoading(false);
          return;
        }

        // 2. Check Supabase Auth session if env available
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Nguyễn Văn A',
            avatarUrl: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            role: (session.user.user_metadata?.role as any) || 'user',
            provider: session.user.app_metadata?.provider || 'email',
            createdAt: new Date(session.user.created_at).toLocaleDateString(),
            projectCount: 12,
            aiRequestCount: 148,
            documentCount: 34,
          });
        }
      } catch (err) {
        // Fallback
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = () => {
    try {
      localStorage.removeItem('devpilot_user');
      const supabase = createClient();
      supabase.auth.signOut();
    } catch (err) {}
    setUser(null);
    toast.success('Đã đăng xuất thành công!');
    router.push('/login');
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('devpilot_user', JSON.stringify(updated));
    toast.success('Cập nhật thông tin hồ sơ thành công!');
  };

  const toggleRole = () => {
    if (!user) return;
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    updateProfile({ role: newRole });
    toast.info(`Đã chuyển quyền tài khoản sang: ${newRole.toUpperCase()}`);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, updateProfile, toggleRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
