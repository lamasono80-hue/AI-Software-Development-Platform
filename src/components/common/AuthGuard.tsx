'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      toast.error('Vui lòng đăng nhập để truy cập trang này!');
      router.push('/login');
      return;
    }

    if (requireAdmin && user.role !== 'admin') {
      toast.error('Bạn không có quyền truy cập trang Quản trị!');
      router.push('/dashboard');
    }
  }, [user, loading, requireAdmin, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-gradient animate-spin flex items-center justify-center">
            <div className="w-6 h-6 rounded-lg bg-background" />
          </div>
          <span className="text-xs text-gray-400 font-mono">Đang kiểm tra quyền truy cập...</span>
        </div>
      </div>
    );
  }

  if (!user || (requireAdmin && user.role !== 'admin')) {
    return null;
  }

  return <>{children}</>;
}
