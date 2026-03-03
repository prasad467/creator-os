"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Users, 
  DollarSign, 
  Settings,
  Search,
  Menu,
  X,
  ChevronDown,
  RefreshCw,
  MoreHorizontal,
  Mail,
  Shield,
  BarChart3,
  UserCheck,
  Crown,
  Zap,
  ArrowUpRight,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

// Types
interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  plan: string;
  stripe_customer_id?: string;
  avatar_url?: string;
  revenue?: number;
  status?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UserResponse {
  users: User[];
  pagination: Pagination;
  stats: {
    totalRevenue: number;
    activeUsers: number;
    basicUsers: number;
    proUsers: number;
  };
}

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    freeUsers: number;
    conversionRate: number;
    growthRate: number;
    avgSignupsPerDay: number;
  };
  dailySignups: { date: string; count: number }[];
  planDistribution: { pro: number; enterprise: number; basic: number };
  revenue: { monthly: number; projectedAnnual: number };
}

interface RevenueData {
  summary: {
    monthlyRevenue: number;
    annualRevenue: number;
    arpu: string;
    totalRevenue: number;
  };
  monthlyData: {
    month: string;
    revenue: number;
    proUsers: number;
    enterpriseUsers: number;
    totalUsers: number;
  }[];
  revenueByPlan: {
    enterprise: { revenue: number; users: number; price: number };
    pro: { revenue: number; users: number; price: number };
    basic: { revenue: number; users: number; price: number };
  };
  churnRate: number;
  totalUsers: number;
  activeSubscribers: number;
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [userStats, setUserStats] = useState({ totalRevenue: 0, activeUsers: 0, basicUsers: 0, proUsers: 0 });
  const [analytics, setAnalytics] = useState<any>(null);
  const [revenue, setRevenue] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState<string | null>(null);
  
  // Action states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);

  // Handle View User
  const handleViewUser = async (userId: string) => {
    setUserMenuOpen(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/dashboard/users/${userId}`);
      const data = await res.json();
      if (data.user) {
        setUserDetails(data.user);
        setSelectedUser(users.find(u => u.id === userId) || null);
        setViewModalOpen(true);
      } else {
        alert(data.error || "Failed to fetch user details");
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      alert("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit User (Upgrade/Downgrade)
  const handleEditUser = async (userId: string, action: string, plan?: string) => {
    setUserMenuOpen(null);
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action, plan }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchUsers(pagination.page, searchQuery);
        fetchStats();
        fetchAnalytics();
        fetchRevenue();
        setEditModalOpen(false);
      } else {
        alert(data.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId: string) => {
    setUserMenuOpen(null);
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchUsers(pagination.page, searchQuery);
        fetchStats();
        fetchAnalytics();
        fetchRevenue();
        setDeleteConfirmOpen(false);
        setSelectedUser(null);
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/dashboard/stats");
      const data = await res.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  }, []);

  const fetchUsers = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/dashboard/users?${params}`);
      const data: UserResponse = await res.json();
      setUsers(data.users || []);
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
      setUserStats(data.stats || { totalRevenue: 0, activeUsers: 0, basicUsers: 0, proUsers: 0 });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/dashboard/analytics");
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  }, []);

  const fetchRevenue = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/dashboard/revenue");
      const data = await res.json();
      setRevenue(data);
    } catch (error) {
      console.error("Failed to fetch revenue:", error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchAnalytics();
    fetchRevenue();
  }, [fetchStats, fetchUsers, fetchAnalytics, fetchRevenue]);

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers(pagination.page, searchQuery);
    }
  }, [activeTab, pagination.page, searchQuery, fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1, searchQuery);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isUserActive = (plan: string) => plan === "pro" || plan === "enterprise";

  const navItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "revenue", label: "Revenue", icon: DollarSign },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: string; icon: any; color: string }) => (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-zinc-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Users" 
          value={formatNumber(stats?.totalUsers || 0)} 
          icon={Users} 
          color="bg-blue-500/20 text-blue-400"
        />
        <StatCard 
          title="Active Subscribers" 
          value={formatNumber(stats?.proUsers || 0)} 
          icon={Crown} 
          color="bg-purple-500/20 text-purple-400"
        />
        <StatCard 
          title="Monthly Revenue" 
          value={formatCurrency(stats?.estimatedMonthlyRevenue || 0)} 
          icon={DollarSign} 
          color="bg-green-500/20 text-green-400"
        />
        <StatCard 
          title="New Users (30d)" 
          value={formatNumber(stats?.newUsersLastMonth || 0)} 
          icon={UserCheck} 
          color="bg-orange-500/20 text-orange-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
            <button className="text-zinc-400 hover:text-white transition">
              <RefreshCw size={18} />
            </button>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {(revenue?.monthlyData || []).slice(-6).map((item: any, idx: number) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-500 hover:to-blue-300"
                  style={{ height: `${Math.max((item.revenue / (revenue?.summary?.monthlyRevenue || 1)) * 100, 5)}%`, minHeight: "20px" }}
                />
                <span className="text-xs text-zinc-500">{item.month?.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Plan Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-zinc-300">Pro Plan</span>
              </div>
              <span className="text-white font-medium">{analytics?.planDistribution?.pro || 0} users</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min((analytics?.planDistribution?.pro || 0) / (stats?.totalUsers || 1) * 100, 100)}%` }} />
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-zinc-300">Enterprise</span>
              </div>
              <span className="text-white font-medium">{analytics?.planDistribution?.enterprise || 0} users</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((analytics?.planDistribution?.enterprise || 0) / (stats?.totalUsers || 1) * 100, 100)}%` }} />
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-zinc-500" />
                <span className="text-zinc-300">Basic</span>
              </div>
              <span className="text-white font-medium">{analytics?.planDistribution?.basic || 0} users</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div className="bg-zinc-500 h-2 rounded-full" style={{ width: `${Math.min((analytics?.planDistribution?.basic || 0) / (stats?.totalUsers || 1) * 100, 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Users</h3>
          <button onClick={() => setActiveTab("users")} className="text-blue-400 hover:text-blue-300 text-sm">
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left text-zinc-400 text-sm font-medium pb-4">User</th>
                <th className="text-left text-zinc-400 text-sm font-medium pb-4">Plan</th>
                <th className="text-left text-zinc-400 text-sm font-medium pb-4">Status</th>
                <th className="text-left text-zinc-400 text-sm font-medium pb-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 5).map((user) => (
                <tr key={user.id} className="border-b border-zinc-800/50">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                        {user.full_name?.[0] || user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.full_name || "N/A"}</p>
                        <p className="text-zinc-500 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isUserActive(user.plan) ? "bg-purple-500/20 text-purple-400" : "bg-zinc-700 text-zinc-300"
                    }`}>
                      {user.plan || "basic"}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isUserActive(user.plan) ? "bg-green-500/20 text-green-400" : "bg-zinc-700 text-zinc-400"
                    }`}>
                      {isUserActive(user.plan) ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 text-zinc-400">{formatDate(user.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Users</h2>
          <p className="text-zinc-400">Manage and monitor your users</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-400 text-sm">Total Revenue</p>
          <p className="text-xl font-bold text-white mt-1">{formatCurrency(userStats.totalRevenue)}</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-400 text-sm">Active Users</p>
          <p className="text-xl font-bold text-white mt-1">{userStats.activeUsers}</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-400 text-sm">Pro Users</p>
          <p className="text-xl font-bold text-purple-400 mt-1">{userStats.proUsers}</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-400 text-sm">Basic Users</p>
          <p className="text-xl font-bold text-zinc-300 mt-1">{userStats.basicUsers}</p>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-800/50">
              <tr>
                <th className="text-left text-zinc-400 text-sm font-medium px-6 py-4">User</th>
                <th className="text-left text-zinc-400 text-sm font-medium px-6 py-4">Plan</th>
                <th className="text-left text-zinc-400 text-sm font-medium px-6 py-4">Revenue</th>
                <th className="text-left text-zinc-400 text-sm font-medium px-6 py-4">Status</th>
                <th className="text-left text-zinc-400 text-sm font-medium px-6 py-4">Joined</th>
                <th className="text-left text-zinc-400 text-sm font-medium px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-zinc-400">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-zinc-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t border-zinc-800/50 hover:bg-zinc-800/30 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                          {user.full_name?.[0] || user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.full_name || "N/A"}</p>
                          <p className="text-zinc-500 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isUserActive(user.plan) ? "bg-purple-500/20 text-purple-400" : "bg-zinc-700 text-zinc-300"
                      }`}>
                        {user.plan || "basic"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white">
                      {formatCurrency(user.revenue || 0)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isUserActive(user.plan) ? "bg-green-500/20 text-green-400" : "bg-zinc-700 text-zinc-400"
                      }`}>
                        {isUserActive(user.plan) ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{formatDate(user.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button 
                          onClick={() => setUserMenuOpen(userMenuOpen === user.id ? null : user.id)}
                          className="p-2 hover:bg-zinc-800 rounded-lg transition"
                        >
                          <MoreHorizontal size={18} className="text-zinc-400" />
                        </button>
                        {userMenuOpen === user.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-10">
                            <button 
                              onClick={() => handleViewUser(user.id)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-left text-zinc-300 hover:bg-zinc-700"
                            >
                              <Eye size={16} /> View Details
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedUser(user);
                                setEditModalOpen(true);
                                setUserMenuOpen(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-left text-zinc-300 hover:bg-zinc-700"
                            >
                              <Edit size={16} /> Change Plan
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedUser(user);
                                setDeleteConfirmOpen(true);
                                setUserMenuOpen(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-400 hover:bg-zinc-700"
                            >
                              <Trash2 size={16} /> Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800">
          <p className="text-zinc-400 text-sm">
            Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
              disabled={pagination.page >= pagination.totalPages}
              className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Analytics</h2>
        <p className="text-zinc-400">Track your platform growth and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">Total Users</p>
          <p className="text-3xl font-bold text-white mt-2">{formatNumber(analytics?.overview?.totalUsers || 0)}</p>
          <div className="flex items-center gap-1 mt-2 text-green-400 text-sm">
            <ArrowUpRight size={16} />
            <span>+{analytics?.overview?.growthRate || 0}%</span>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">Conversion Rate</p>
          <p className="text-3xl font-bold text-white mt-2">{analytics?.overview?.conversionRate || 0}%</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">Avg Signups/Day</p>
          <p className="text-3xl font-bold text-white mt-2">{analytics?.overview?.avgSignupsPerDay || 0}</p>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Daily Signups (Last 30 Days)</h3>
        <div className="h-64 flex items-end justify-between gap-1">
          {(analytics?.dailySignups || []).map((day: any, idx: number) => {
            const maxCount = Math.max(...(analytics?.dailySignups?.map((d: any) => d.count) || [1]), 1);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md hover:from-blue-500 hover:to-blue-300 transition-all cursor-pointer"
                  style={{ height: `${Math.max((day.count / maxCount) * 100, 5)}%`, minHeight: "4px" }}
                  title={`${day.date}: ${day.count} signups`}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-zinc-500">
          <span>30 days ago</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );

  const renderRevenue = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Revenue</h2>
        <p className="text-zinc-400">Monitor your subscription revenue</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">Monthly Revenue</p>
          <p className="text-2xl font-bold text-white mt-2">{formatCurrency(revenue?.summary?.monthlyRevenue || 0)}</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">Annual Revenue</p>
          <p className="text-2xl font-bold text-white mt-2">{formatCurrency(revenue?.summary?.annualRevenue || 0)}</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">ARPU</p>
          <p className="text-2xl font-bold text-white mt-2">{formatCurrency(parseFloat(revenue?.summary?.arpu || "0"))}</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">Churn Rate</p>
          <p className="text-2xl font-bold text-white mt-2">{revenue?.churnRate || 0}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="text-purple-400" size={24} />
            <div>
              <p className="text-purple-400 font-medium">Enterprise</p>
              <p className="text-zinc-400 text-sm">{revenue?.revenueByPlan?.enterprise?.users || 0} users</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(revenue?.revenueByPlan?.enterprise?.revenue || 0)}</p>
          <p className="text-zinc-400 text-sm">@ ${revenue?.revenueByPlan?.enterprise?.price || 99}/mo</p>
        </div>
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-blue-400" size={24} />
            <div>
              <p className="text-blue-400 font-medium">Pro</p>
              <p className="text-zinc-400 text-sm">{revenue?.revenueByPlan?.pro?.users || 0} users</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(revenue?.revenueByPlan?.pro?.revenue || 0)}</p>
          <p className="text-zinc-400 text-sm">@ ${revenue?.revenueByPlan?.pro?.price || 29}/mo</p>
        </div>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 border border-zinc-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-zinc-400" size={24} />
            <div>
              <p className="text-zinc-400 font-medium">Basic</p>
              <p className="text-zinc-500 text-sm">{revenue?.revenueByPlan?.basic?.users || 0} users</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-500">$0</p>
          <p className="text-zinc-500 text-sm">Free tier</p>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-zinc-400">Manage your admin account</p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Admin Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-zinc-400 text-sm mb-2">Email</label>
            <input 
              type="email" 
              defaultValue="admin@creatoros.com"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-2">Full Name</label>
            <input 
              type="text" 
              defaultValue="Admin"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Security</h3>
        <div className="space-y-4">
          <button className="flex items-center justify-between w-full p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition">
            <div className="flex items-center gap-3">
              <Shield className="text-zinc-400" size={20} />
              <span className="text-white">Change Password</span>
            </div>
            <ChevronDown className="text-zinc-400" size={20} />
          </button>
          <button className="flex items-center justify-between w-full p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition">
            <div className="flex items-center gap-3">
              <Mail className="text-zinc-400" size={20} />
              <span className="text-white">Two-Factor Authentication</span>
            </div>
            <span className="text-zinc-500">Not enabled</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Render Modals
  const renderModals = () => (
    <>
      {viewModalOpen && userDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">User Details</h3>
              <button onClick={() => setViewModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-medium">
                  {userDetails.full_name?.[0] || userDetails.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{userDetails.full_name || "N/A"}</p>
                  <p className="text-zinc-400 text-sm">{userDetails.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-zinc-400 text-sm">Plan</p>
                  <p className="text-white font-medium">{userDetails.plan || "basic"}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isUserActive(userDetails.plan) ? "bg-green-500/20 text-green-400" : "bg-zinc-700 text-zinc-300"
                  }`}>
                    {isUserActive(userDetails.plan) ? "Active" : "Inactive"}
                  </span>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Joined</p>
                  <p className="text-white font-medium">{formatDate(userDetails.created_at)}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Last Login</p>
                  <p className="text-white font-medium">{userDetails.last_sign_in_at ? formatDate(userDetails.last_sign_in_at) : "Never"}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setViewModalOpen(false)}
              className="mt-6 w-full bg-zinc-800 text-white py-2 rounded-lg hover:bg-zinc-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {editModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Change Plan</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <p className="text-zinc-400 mb-4">Select a new plan for {selectedUser.email}</p>
            <div className="space-y-3">
              <button 
                onClick={() => handleEditUser(selectedUser.id, "upgrade", "pro")}
                disabled={actionLoading || selectedUser.plan === "pro"}
                className="w-full p-4 bg-blue-900/30 border border-blue-500/30 rounded-xl hover:bg-blue-900/50 transition disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="text-blue-400" size={20} />
                    <span className="text-white font-medium">Pro Plan</span>
                  </div>
                  <span className="text-blue-400">$29/mo</span>
                </div>
              </button>
              <button 
                onClick={() => handleEditUser(selectedUser.id, "upgrade", "enterprise")}
                disabled={actionLoading || selectedUser.plan === "enterprise"}
                className="w-full p-4 bg-purple-900/30 border border-purple-500/30 rounded-xl hover:bg-purple-900/50 transition disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="text-purple-400" size={20} />
                    <span className="text-white font-medium">Enterprise Plan</span>
                  </div>
                  <span className="text-purple-400">$99/mo</span>
                </div>
              </button>
              <button 
                onClick={() => handleEditUser(selectedUser.id, "downgrade")}
                disabled={actionLoading || selectedUser.plan === "basic"}
                className="w-full p-4 bg-zinc-800/30 border border-zinc-700 rounded-xl hover:bg-zinc-800 transition disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="text-zinc-400" size={20} />
                    <span className="text-white font-medium">Basic Plan</span>
                  </div>
                  <span className="text-zinc-400">Free</span>
                </div>
              </button>
            </div>
            <button 
              onClick={() => setEditModalOpen(false)}
              className="mt-4 w-full bg-zinc-800 text-white py-2 rounded-lg hover:bg-zinc-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {deleteConfirmOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-red-500/30 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Delete User</h3>
              <button onClick={() => setDeleteConfirmOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <p className="text-zinc-400 mb-4">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="bg-zinc-800/50 p-4 rounded-lg mb-6">
              <p className="text-white font-medium">{selectedUser.email}</p>
              <p className="text-zinc-400 text-sm">Plan: {selectedUser.plan || "basic"}</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirmOpen(false)}
                className="flex-1 bg-zinc-800 text-white py-2 rounded-lg hover:bg-zinc-700 transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteUser(selectedUser.id)}
                disabled={actionLoading}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-zinc-950 border-r border-zinc-800 flex flex-col transition-all duration-300 fixed lg:relative h-screen z-50`}>
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">CreatorOS</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-zinc-400 hover:text-white">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
              A
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Admin</p>
                <p className="text-xs text-zinc-500">admin@creatoros.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/50">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-zinc-400 hover:text-white lg:hidden">
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-white capitalize">{navItems.find(n => n.id === activeTab)?.label}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { fetchStats(); fetchUsers(); fetchAnalytics(); fetchRevenue(); }}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
              title="Refresh"
            >
              <RefreshCw size={20} />
            </button>
            <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition">
              <Settings size={20} />
            </button>
          </div>
        </header>

        <div className="p-6">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "users" && renderUsers()}
          {activeTab === "analytics" && renderAnalytics()}
          {activeTab === "revenue" && renderRevenue()}
          {activeTab === "settings" && renderSettings()}
        </div>
      </main>

      {renderModals()}
    </div>
  );
}
