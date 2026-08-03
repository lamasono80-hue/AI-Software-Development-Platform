'use client';

import { useState } from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AuthGuard } from '@/components/common/AuthGuard';
import {
  Shield,
  Users,
  FolderKanban,
  FileText,
  History,
  Bell,
  Activity,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Send,
  X,
  Cpu,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';

interface UserRecord {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended';
  createdAt: string;
}

interface ProjectRecord {
  id: string;
  name: string;
  ownerEmail: string;
  category: string;
  architecture: string;
  createdAt: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'metrics' | 'users' | 'projects' | 'documents' | 'history' | 'notifications' | 'logs'>('users');

  // Search & Filter States
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal States
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'user' | 'admin'>('user');

  // Broadcast Notification State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Sample Users Data (CRUD Target)
  const [users, setUsers] = useState<UserRecord[]>([
    { id: 'usr_1', email: 'admin@devpilot.ai', displayName: 'Senior Software Architect', role: 'admin', status: 'active', createdAt: '01/08/2026' },
    { id: 'usr_2', email: 'student@cntt.edu.vn', displayName: 'Sinh viên CNTT', role: 'user', status: 'active', createdAt: '02/08/2026' },
    { id: 'usr_3', email: 'devteam@company.com', displayName: 'Fullstack Dev Team', role: 'user', status: 'active', createdAt: '03/08/2026' },
    { id: 'usr_4', email: 'spammer@tempmail.org', displayName: 'Tài khoản Spam', role: 'user', status: 'suspended', createdAt: '03/08/2026' },
  ]);

  // Sample Projects Data
  const [projects, setProjects] = useState<ProjectRecord[]>([
    { id: 'p1', name: 'Hệ thống Quản lý Bệnh viện', ownerEmail: 'student@cntt.edu.vn', category: 'Hospital', architecture: 'Layered', createdAt: '03/08/2026' },
    { id: 'p2', name: 'Sàn Thương mại Điện tử E-Commerce', ownerEmail: 'devteam@company.com', category: 'E-Commerce', architecture: 'Microservices', createdAt: '03/08/2026' },
  ]);

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.displayName.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Admin CRUD Handlers
  const handleToggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u))
    );
    toast.success('Đã cập nhật trạng thái người dùng thành công!');
  };

  const handleToggleUserRole = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u))
    );
    toast.success('Đã thay đổi phân quyền Role người dùng thành công!');
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success('Đã xóa người dùng khỏi hệ thống!');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserRecord = {
      id: `usr_${Date.now()}`,
      email: newUserEmail,
      displayName: newUserName,
      role: newUserRole,
      status: 'active',
      createdAt: new Date().toLocaleDateString(),
    };
    setUsers((prev) => [newUser, ...prev]);
    setIsAddUserModalOpen(false);
    setNewUserEmail('');
    setNewUserName('');
    toast.success('Đã thêm người dùng mới thành công!');
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast.success('Đã xóa dự án khỏi hệ thống!');
  };

  const handleSendBroadcastNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;
    toast.success('Đã phát thông báo hệ thống tới toàn bộ người dùng!');
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  return (
    <AuthGuard requireAdmin={true}>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-7 h-7 text-brand-purple" />
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Trang Quản Trị Hệ Thống (Admin Panel)</h1>
              </div>
              <p className="text-xs sm:text-sm text-gray-400">Quản lý toàn bộ Người dùng, Dự án, Tài liệu, AI Logs và Thông báo hệ thống</p>
            </div>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-brand-purple hover:opacity-90 text-white text-xs font-semibold shadow-lg shadow-brand-purple/20 flex items-center justify-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm User Mới</span>
            </button>
          </div>

          {/* TAB NAVIGATION BAR */}
          <div className="flex items-center gap-2 border-b border-surface-border overflow-x-auto pb-3 mb-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'users' ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/30' : 'text-gray-400 hover:text-white hover:bg-surface'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Quản lý Users ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'projects' ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/30' : 'text-gray-400 hover:text-white hover:bg-surface'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Quản lý Projects ({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'metrics' ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/30' : 'text-gray-400 hover:text-white hover:bg-surface'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>System Metrics & Logs</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'notifications' ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/30' : 'text-gray-400 hover:text-white hover:bg-surface'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Gửi Thông Báo Broadcast</span>
            </button>
          </div>

          {/* TAB 1: USERS MANAGEMENT (FULL CRUD) */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Search & Filter Bar */}
              <div className="glass-panel p-4 rounded-2xl border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên hoặc email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-surface/80 border border-surface-border rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-surface/80 border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="all">Tất cả Roles</option>
                    <option value="user">User Member</option>
                    <option value="admin">Administrator</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-surface/80 border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="all">Tất cả Trạng thái</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="glass-panel rounded-2xl border-surface-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-surface/50 text-gray-400 uppercase text-[10px] font-mono border-b border-surface-border">
                      <tr>
                        <th className="px-6 py-3">Họ và Tên</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3">Trạng Thái</th>
                        <th className="px-6 py-3">Ngày Tạo</th>
                        <th className="px-6 py-3 text-right">Thao Tác CRUD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border/50">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-surface-hover/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-white">{u.displayName}</td>
                          <td className="px-6 py-4 font-mono text-gray-400">{u.email}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleUserRole(u.id)}
                              title="Bấm để thay đổi Role"
                              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase transition-transform hover:scale-105 ${
                                u.role === 'admin' ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple/40' : 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40'
                              }`}
                            >
                              {u.role.toUpperCase()}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                              u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {u.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-gray-400">{u.createdAt}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleToggleUserStatus(u.id)}
                                title={u.status === 'active' ? 'Khoá tài khoản' : 'Kích hoạt lại'}
                                className={`p-1.5 rounded-lg border transition-colors ${
                                  u.status === 'active' ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10' : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                                }`}
                              >
                                {u.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              </button>

                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                title="Xóa vĩnh viễn user"
                                className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS MANAGEMENT */}
          {activeTab === 'projects' && (
            <div className="glass-panel rounded-2xl border-surface-border overflow-hidden">
              <div className="px-6 py-4 border-b border-surface-border">
                <h3 className="text-base font-bold text-white">Quản Lý Toàn Bộ Dự Án Hệ Thống</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-surface/50 text-gray-400 uppercase text-[10px] font-mono border-b border-surface-border">
                    <tr>
                      <th className="px-6 py-3">Tên Dự Án</th>
                      <th className="px-6 py-3">Chủ Sở Hữu</th>
                      <th className="px-6 py-3">Lĩnh Vực</th>
                      <th className="px-6 py-3">Kiến Trúc</th>
                      <th className="px-6 py-3">Ngày Tạo</th>
                      <th className="px-6 py-3 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border/50">
                    {projects.map((p) => (
                      <tr key={p.id} className="hover:bg-surface-hover/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-white">{p.name}</td>
                        <td className="px-6 py-4 font-mono text-gray-400">{p.ownerEmail}</td>
                        <td className="px-6 py-4"><span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px]">{p.category}</span></td>
                        <td className="px-6 py-4 text-gray-400">{p.architecture}</td>
                        <td className="px-6 py-4 font-mono text-gray-400">{p.createdAt}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteProject(p.id)}
                            className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SYSTEM METRICS */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                <div className="glass-panel p-5 rounded-2xl">
                  <span className="text-xs text-gray-400 block mb-1">Tổng Số Users</span>
                  <span className="text-2xl font-bold text-white">{users.length}</span>
                </div>
                <div className="glass-panel p-5 rounded-2xl">
                  <span className="text-xs text-gray-400 block mb-1">Tổng Số Projects</span>
                  <span className="text-2xl font-bold text-white">{projects.length}</span>
                </div>
                <div className="glass-panel p-5 rounded-2xl">
                  <span className="text-xs text-gray-400 block mb-1">AI Tokens Called</span>
                  <span className="text-2xl font-bold text-brand-purple">2.4M</span>
                </div>
                <div className="glass-panel p-5 rounded-2xl">
                  <span className="text-xs text-gray-400 block mb-1">Hạ Tầng Server</span>
                  <span className="text-2xl font-bold text-emerald-400">100% Operational</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BROADCAST NOTIFICATION */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleSendBroadcastNotification} className="glass-panel p-8 rounded-3xl border-surface-border space-y-4 max-w-2xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-surface-border pb-3">
                <Bell className="w-5 h-5 text-brand-purple" />
                <span>Phát Thông Báo Broadcast Toàn Hệ Thống</span>
              </h3>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Tiêu đề thông báo</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Cập nhật tính năng AI Provider Gemini 1.5 Flash..."
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full bg-surface/80 border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Nội dung thông báo</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Nội dung thông báo tới toàn bộ người dùng..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full bg-surface/80 border border-surface-border rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand-purple text-white text-xs font-semibold shadow-lg shadow-brand-purple/30 hover:opacity-90 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Gửi Thông Báo Cho Tất Cả Users</span>
              </button>
            </form>
          )}

          {/* ADD USER MODAL */}
          {isAddUserModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="glass-panel w-full max-w-md p-6 rounded-3xl border-brand-purple/30 relative shadow-2xl">
                <button onClick={() => setIsAddUserModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-lg font-bold text-white mb-4">Thêm Người Dùng Mới</h3>

                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Họ và Tên</label>
                    <input
                      type="text"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full bg-surface/80 border border-surface-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-purple"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full bg-surface/80 border border-surface-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-purple"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Phân Quyền Role</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as any)}
                      className="w-full bg-surface/80 border border-surface-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-purple"
                    >
                      <option value="user">User Member</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-brand-purple text-white text-xs font-semibold shadow-lg shadow-brand-purple/30 hover:opacity-90 flex items-center justify-center gap-2 mt-4"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm User Mới</span>
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
