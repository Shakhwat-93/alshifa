"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Settings,
  Star,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Search,
  ExternalLink,
  LogOut,
  Save,
  Trash2,
  Plus,
  RefreshCw,
  Phone,
  ShieldAlert,
} from "lucide-react";

interface Order {
  id: number;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  delivery_fee: number;
  status: string;
  notes: string | null;
  created_at: string;
}

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  delivered: number;
  cancelled: number;
  revenue: number;
}

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  review_text: string;
  image_url: string;
  is_active: boolean;
}

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"orders" | "settings" | "reviews">("orders");

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    delivered: 0,
    cancelled: 0,
    revenue: 0,
  });
  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    location: "",
    rating: 5,
    review_text: "",
  });

  // Check login on mount
  useEffect(() => {
    const saved = localStorage.getItem("alshifa_admin_auth");
    if (saved === "true") {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, []);

  // Fetch Orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const url = `/api/admin/orders?status=${statusFilter}&search=${encodeURIComponent(
        orderSearch
      )}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
        setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch Settings
  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.settings) {
        const obj: Record<string, string> = {};
        data.settings.forEach((s: { key: string; value: string }) => {
          obj[s.key] = s.value;
        });
        setSettings(obj);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSettings(false);
    }
  };

  // Fetch Reviews
  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === "orders") fetchOrders();
      if (activeTab === "settings") fetchSettings();
      if (activeTab === "reviews") fetchReviews();
    }
  }, [isAuthenticated, activeTab, statusFilter]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("alshifa_admin_auth", "true");
      } else {
        setLoginError(data.error || "লগইন ব্যর্থ হয়েছে");
      }
    } catch {
      setLoginError("সার্ভার কানেকশন এরর");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("alshifa_admin_auth");
    fetch("/api/admin/login", { method: "DELETE" }).catch(() => {});
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (id: number, status: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিত এই অর্ডারটি মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (res.ok) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSettings(false);
    }
  };

  // Add Review
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
      if (res.ok) {
        setShowAddReview(false);
        setNewReview({ name: "", location: "", rating: 5, review_text: "" });
        fetchReviews();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Review
  const handleDeleteReview = async (id: number) => {
    if (!confirm("রিভিউটি মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <p className="text-stone-600 font-medium">লোড হচ্ছে...</p>
      </div>
    );
  }

  // 1. LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6F4] p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-stone-200/80 p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#0E5A2E] text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <Package className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-[#08441F]">
              শিফা কেয়ার এডমিন প্যানেল
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              অর্ডার ও ল্যান্ডিং পেজ কনটেন্ট পরিচালনা করুন
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                ইউজারনেম
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0E5A2E] text-stone-800 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                পাসওয়ার্ড
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0E5A2E] text-stone-800 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#0E5A2E] hover:bg-[#167a40] text-white font-bold rounded-xl shadow-md transition duration-150 disabled:opacity-60 text-sm"
            >
              {isLoggingIn ? "লগইন হচ্ছে..." : "এডমিন প্যানেলে প্রবেশ করুন"}
            </button>
          </form>

          <p className="text-xs text-center text-stone-400 mt-6">
            Default credentials: <span className="font-mono text-stone-600">admin</span> /{" "}
            <span className="font-mono text-stone-600">admin123</span>
          </p>
        </div>
      </div>
    );
  }

  // 2. DASHBOARD SCREEN
  return (
    <div className="min-h-screen bg-[#F6F8F6] text-[#1E2B22] font-sans pb-16">
      {/* Top Navbar */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0E5A2E] text-white rounded-xl flex items-center justify-center font-bold shadow-sm">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base text-[#08441F] leading-tight">
                Shifa Care Admin
              </h1>
              <p className="text-[11px] text-stone-500">
                Supabase Connected (Isolated Schema)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              লাইভ পেজ দেখুন
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              লগআউট
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Nav Tabs */}
        <div className="flex space-x-2 border-b border-stone-200 pb-2 mb-6">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === "orders"
                ? "bg-[#0E5A2E] text-white shadow"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <Package className="w-4 h-4" />
            অর্ডার সমূহ ({stats.total})
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === "settings"
                ? "bg-[#0E5A2E] text-white shadow"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <Settings className="w-4 h-4" />
            ল্যান্ডিং পেজ কনটেন্ট এডিটর
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === "reviews"
                ? "bg-[#0E5A2E] text-white shadow"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <Star className="w-4 h-4" />
            ক্রেতাদের রিভিউ ({reviews.length})
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: ORDERS DASHBOARD                                   */}
        {/* ========================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                <p className="text-xs font-semibold text-stone-500">মোট অর্ডার</p>
                <p className="text-2xl font-bold text-stone-900 mt-1">{stats.total}</p>
              </div>
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 shadow-sm">
                <p className="text-xs font-semibold text-amber-700">পেন্ডিং</p>
                <p className="text-2xl font-bold text-amber-800 mt-1">{stats.pending}</p>
              </div>
              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200/80 shadow-sm">
                <p className="text-xs font-semibold text-blue-700">কনফার্মড</p>
                <p className="text-2xl font-bold text-blue-800 mt-1">{stats.confirmed}</p>
              </div>
              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80 shadow-sm">
                <p className="text-xs font-semibold text-emerald-700">ডেলিভারড</p>
                <p className="text-2xl font-bold text-emerald-800 mt-1">{stats.delivered}</p>
              </div>
              <div className="bg-red-50/60 p-4 rounded-xl border border-red-200/80 shadow-sm">
                <p className="text-xs font-semibold text-red-700">বাতিল</p>
                <p className="text-2xl font-bold text-red-800 mt-1">{stats.cancelled}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                <p className="text-xs font-semibold text-stone-500">মোট বিক্রয়</p>
                <p className="text-xl font-bold text-[#0E5A2E] mt-1">৳ {stats.revenue}</p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {["all", "pending", "confirmed", "delivered", "cancelled"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                      statusFilter === st
                        ? "bg-[#0E5A2E] text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {st === "all"
                      ? "সবগুলো"
                      : st === "pending"
                      ? "পেন্ডিং"
                      : st === "confirmed"
                      ? "কনফার্মড"
                      : st === "delivered"
                      ? "ডেলিভারড"
                      : "বাতিল"}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-80">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchOrders()}
                    placeholder="নাম, ফোন বা অর্ডার আইডি..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A2E]"
                  />
                </div>
                <button
                  onClick={fetchOrders}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-bold"
                >
                  খুঁজুন
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase font-semibold">
                      <th className="py-3 px-4">অর্ডার আইডি</th>
                      <th className="py-3 px-4">তারিখ</th>
                      <th className="py-3 px-4">গ্রাহক</th>
                      <th className="py-3 px-4">ফোন নাম্বার</th>
                      <th className="py-3 px-4">ঠিকানা</th>
                      <th className="py-3 px-4">পরিমাণ</th>
                      <th className="py-3 px-4">মূল্য</th>
                      <th className="py-3 px-4">স্ট্যাটাস</th>
                      <th className="py-3 px-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {loadingOrders ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-stone-500">
                          অর্ডার লোড হচ্ছে...
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-stone-500">
                          কোনো অর্ডার পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="hover:bg-stone-50/60 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                            {order.order_id}
                          </td>
                          <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                            {new Date(order.created_at).toLocaleDateString("bn-BD")}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-stone-800">
                            {order.customer_name}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-medium text-stone-700">
                            <a
                              href={`tel:${order.customer_phone}`}
                              className="text-emerald-700 hover:underline"
                            >
                              {order.customer_phone}
                            </a>
                          </td>
                          <td className="py-3.5 px-4 text-stone-600 max-w-[200px] truncate" title={order.customer_address}>
                            {order.customer_address}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-center">
                            {order.quantity} টি
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#0E5A2E]">
                            ৳ {order.total_price}
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleUpdateOrderStatus(order.id, e.target.value)
                              }
                              className={`text-xs font-bold py-1 px-2 rounded-lg border focus:outline-none ${
                                order.status === "pending"
                                  ? "bg-amber-50 text-amber-800 border-amber-300"
                                  : order.status === "confirmed"
                                  ? "bg-blue-50 text-blue-800 border-blue-300"
                                  : order.status === "delivered"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  : "bg-red-50 text-red-800 border-red-300"
                              }`}
                            >
                              <option value="pending">পেন্ডিং</option>
                              <option value="confirmed">কনফার্মড</option>
                              <option value="delivered">ডেলিভারড</option>
                              <option value="cancelled">বাতিল</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-stone-100 transition"
                              title="অর্ডার মুছুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: LANDING PAGE CONTENT & SETTINGS                    */}
        {/* ========================================================= */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <div>
                <h2 className="font-bold text-stone-900 text-base">
                  ল্যান্ডিং পেজ কনটেন্ট কাস্টমাইজেশন
                </h2>
                <p className="text-xs text-stone-500">
                  এখানে পরিবর্তন করে সেভ করলে তা সরাসরি লাইভ ওয়েবসাইটে আপডেট হয়ে যাবে।
                </p>
              </div>
              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E5A2E] hover:bg-[#15793e] text-white font-bold text-xs rounded-xl shadow transition"
              >
                <Save className="w-4 h-4" />
                {savingSettings ? "সেভ হচ্ছে..." : "পরিবর্তন সেভ করুন"}
              </button>
            </div>

            {settingsSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                সবকিছু সফলভাবে সেভ করা হয়েছে! লাইভ ওয়েবসাইটে আপডেট হয়ে গেছে।
              </div>
            )}

            {/* Product Pricing Card */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-bold text-stone-800 text-sm border-b pb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#0E5A2E]" />
                প্রোডাক্ট ও প্রাইসিং সেটিংস
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    প্রোডাক্টের নাম
                  </label>
                  <input
                    type="text"
                    value={settings.product_name || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, product_name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A2E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    অফার মূল্য (টাকা)
                  </label>
                  <input
                    type="number"
                    value={settings.price_current || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, price_current: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A2E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    রেগুলার মূল্য (টাকা)
                  </label>
                  <input
                    type="number"
                    value={settings.price_regular || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, price_regular: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A2E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    ডেলিভারি টেক্সট
                  </label>
                  <input
                    type="text"
                    value={settings.shipping_text || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, shipping_text: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A2E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    হটলাইন নাম্বার
                  </label>
                  <input
                    type="text"
                    value={settings.hotline_number || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, hotline_number: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A2E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    অফার টাইমার (ঘণ্টা)
                  </label>
                  <input
                    type="number"
                    value={settings.timer_hours || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, timer_hours: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A2E]"
                  />
                </div>
              </div>
            </div>

            {/* Hero Section Content */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-bold text-stone-800 text-sm border-b pb-2">
                হিরো সেকশন কনটেন্ট
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    ট্যাগলাইন
                  </label>
                  <input
                    type="text"
                    value={settings.hero_tag || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, hero_tag: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A2E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    মূল শিরোনাম (H1)
                  </label>
                  <input
                    type="text"
                    value={settings.hero_title || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, hero_title: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A2E]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    উপ-শিরোনাম
                  </label>
                  <input
                    type="text"
                    value={settings.hero_subtitle || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, hero_subtitle: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A2E]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    পরিচিতি প্যারাগ্রাফ
                  </label>
                  <textarea
                    rows={3}
                    value={settings.hero_intro || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, hero_intro: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A2E]"
                  />
                </div>
              </div>
            </div>

            {/* Badges Section */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-bold text-stone-800 text-sm border-b pb-2">
                ৩টি ফিচার ব্যাজ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    ব্যাজ ১
                  </label>
                  <input
                    type="text"
                    value={settings.badge_1 || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, badge_1: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A2E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    ব্যাজ ২
                  </label>
                  <input
                    type="text"
                    value={settings.badge_2 || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, badge_2: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A2E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    ব্যাজ ৩
                  </label>
                  <input
                    type="text"
                    value={settings.badge_3 || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, badge_3: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A2E]"
                  />
                </div>
              </div>
            </div>

            {/* Usage & Highlight */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-bold text-stone-800 text-sm border-b pb-2">
                ব্যবহারের নিয়ম ও অন্যান্য সেকশন
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    হাইলাইট বক্স টাইটেল
                  </label>
                  <input
                    type="text"
                    value={settings.highlight_title || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, highlight_title: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A2E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    হাইলাইট টেক্সট
                  </label>
                  <input
                    type="text"
                    value={settings.highlight_subtitle || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, highlight_subtitle: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A2E]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    ব্যবহারের নিয়ম নির্দেশিকা
                  </label>
                  <textarea
                    rows={3}
                    value={settings.usage_text || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, usage_text: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A2E]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-3 bg-[#0E5A2E] hover:bg-[#15793e] text-white font-bold text-sm rounded-xl shadow transition"
              >
                {savingSettings ? "সেভ হচ্ছে..." : "পরিবর্তন সেভ করুন"}
              </button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CUSTOMER REVIEWS                                   */}
        {/* ========================================================= */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <div>
                <h2 className="font-bold text-stone-900 text-base">
                  গ্রাহকদের মতামত পরিচালনা
                </h2>
                <p className="text-xs text-stone-500">
                  ল্যান্ডিং পেজে প্রদর্শিত রিভিউগুলো যোগ বা মুছতে পারবেন।
                </p>
              </div>
              <button
                onClick={() => setShowAddReview(!showAddReview)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0E5A2E] text-white font-bold text-xs rounded-xl shadow"
              >
                <Plus className="w-4 h-4" />
                নতুন রিভিউ যোগ করুন
              </button>
            </div>

            {/* Add Review Form Modal */}
            {showAddReview && (
              <form onSubmit={handleAddReview} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-stone-800">নতুন রিভিউ তথ্য</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      গ্রাহকের নাম
                    </label>
                    <input
                      type="text"
                      required
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                      className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      ঠিকানা / এলাকা
                    </label>
                    <input
                      type="text"
                      required
                      value={newReview.location}
                      onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                      placeholder="যেমন: ধানমন্ডি, ঢাকা"
                      className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      রেটিং (১-৫)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      required
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A2E]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      রিভিউ টেক্সট
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newReview.review_text}
                      onChange={(e) => setNewReview({ ...newReview, review_text: e.target.value })}
                      placeholder="তেলটি ব্যবহার করে আমার হাঁটুর ব্যথায় অনেক আরাম পেয়েছি..."
                      className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A2E]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddReview(false)}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-bold"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0E5A2E] hover:bg-[#167a40] text-white rounded-lg text-xs font-bold"
                  >
                    যোগ করুন
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{rev.name}</h4>
                        <p className="text-xs text-stone-500">{rev.location}</p>
                      </div>
                      <div className="text-amber-500 text-xs">
                        {"★".repeat(rev.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 italic mt-3 bg-stone-50 p-3 rounded-lg border border-stone-100">
                      &quot;{rev.review_text}&quot;
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t flex justify-end">
                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="text-stone-400 hover:text-red-600 p-1 rounded hover:bg-stone-100 transition"
                      title="মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
