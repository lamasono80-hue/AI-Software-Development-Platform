'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Cpu, UserPlus, Mail, Lock, User, Github } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) {
        toast.error(error.message || 'Đăng ký thất bại!');
      } else {
        toast.success('Đăng ký thành công! Hãy đăng nhập để bắt đầu.');
        router.push('/login');
      }
    } catch (err: any) {
      toast.error('Có lỗi xảy ra khi đăng ký.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-cyan/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-8 glass-panel p-8 sm:p-10 rounded-3xl border-surface-border relative z-10 shadow-2xl">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-lg shadow-brand-cyan/20">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-xl text-white">DevPilot AI</span>
          </Link>
          <h2 className="text-2xl font-bold text-white">Tạo tài khoản mới</h2>
          <p className="text-xs text-gray-400">Trải nghiệm tự động hóa Software Engineering ngay hôm nay</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Họ và tên</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Nguyễn Văn A"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-surface/80 border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface/80 border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Mật khẩu</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface/80 border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-gradient text-white text-xs font-semibold shadow-lg shadow-brand-indigo/30 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Đang đăng ký...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Đăng Ký Tài Khoản</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-brand-cyan hover:underline font-semibold">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
