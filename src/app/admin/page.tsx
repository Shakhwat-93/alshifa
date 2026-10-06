"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Truck,
  MessageSquare,
  Sparkles,
  FileText,
  BarChart3,
  Users,
  Settings,
  Search,
  Bell,
  Volume2,
  VolumeX,
  Plus,
  RefreshCw,
  Download,
  Printer,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Phone,
  MessageCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Trash2,
  Edit,
  Save,
  Eye,
  LogOut,
  ShieldCheck,
  Send,
  Sliders,
  DollarSign,
  TrendingUp,
  Tag,
  Share2,
  Star,
  Copy,
  Info,
} from "lucide-react";

// Synthesized Web Audio API chime
function playNotificationChime() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (err) {
    console.log("AudioContext blocked or unavailable:", err);
  }
}

export default function EnterpriseAdmin() {
  // ---------------- Authentication ----------------
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // ---------------- Navigation & Layout ----------------
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "orders"
    | "products"
    | "inventory"
    | "courier"
    | "landing"
    | "reports"
    | "users"
    | "settings"
  >("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [globalSearch, setGlobalSearch] = useState("");

  // ---------------- Data State ----------------
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [inventoryTx, setInventoryTx] = useState<any[]>([]);
  const [landingData, setLandingData] = useState<any>(null);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [settingsData, setSettingsData] = useState<any>({});

  // ---------------- Order Filter & Modal States ----------------
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderModalMode, setOrderModalMode] = useState<"view" | "edit" | "add" | "invoice" | "pos" | "courier_book" | null>(null);

  // New Order Form State
  const [newOrderForm, setNewOrderForm] = useState({
    customer_name: "",
    phone: "",
    address: "",
    district: "Dhaka",
    product_name: "আল-শিফা প্রিমিয়াম হেয়ার অয়েল",
    quantity: 1,
    price: 950,
    delivery_charge: 60,
    note: "",
    status: "pending",
  });

  // Edit Order Form State
  const [editOrderForm, setEditOrderForm] = useState<any>({});

  // Courier Booking State
  const [courierProvider, setCourierProvider] = useState<"steadfast" | "pathao">("steadfast");
  const [bookingNote, setBookingNote] = useState("");
  const [isBookingShipment, setIsBookingShipment] = useState(false);

  // ---------------- Product Modal State ----------------
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name_primary: "",
    name_secondary: "",
    code: "",
    slug: "",
    price: 950,
    original_price: 1550,
    stock: 100,
    description: "",
    images: [""],
    benefits: [""],
    is_active: true,
    is_featured: true,
  });

  // ---------------- Inventory Spreadsheet State ----------------
  const [inventoryDrafts, setInventoryDrafts] = useState<Record<string, { price: number; stock: number }>>({});
  const [savingSpreadsheet, setSavingSpreadsheet] = useState(false);
  const [stockAdjustModal, setStockAdjustModal] = useState(false);
  const [selectedProductForAdjust, setSelectedProductForAdjust] = useState<any>(null);
  const [stockAdjustQty, setStockAdjustQty] = useState<number>(10);
  const [stockAdjustType, setStockAdjustType] = useState("Stock In");
  const [stockAdjustRef, setStockAdjustRef] = useState("");

  // ---------------- Landing Builder State ----------------
  const [landingForm, setLandingForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    template_color: "#ff3f60",
    features: [] as Array<{ title: string; desc: string }>,
    testimonials: [] as Array<{ name: string; location: string; rating: number; review: string; image?: string }>,
    faq: [] as Array<{ q: string; a: string }>,
    pixel_id: "",
    capi_token: "",
  });
  const [savingLanding, setSavingLanding] = useState(false);
  const [landingSavedToast, setLandingSavedToast] = useState(false);

  // ---------------- Settings State ----------------
  const [settingsForm, setSettingsForm] = useState<any>({});
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // ---------------- Users State ----------------
  const [addUserModal, setAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    username: "",
    password: "",
    role: "moderator",
    permissions: ["orders", "products"],
  });


  // ---------------- Reports State ----------------
  const [reportDateRange, setReportDateRange] = useState<"today" | "7d" | "30d" | "all">("30d");

  // ==================== AUTH CHECK ====================
  useEffect(() => {
    const token = localStorage.getItem("alshifa_admin_token");
    const userJson = localStorage.getItem("alshifa_admin_user");
    if (token) {
      setIsAuthenticated(true);
      if (userJson) {
        try {
          setCurrentUser(JSON.parse(userJson));
        } catch {}
      }
    }
    setCheckingAuth(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("alshifa_admin_token", data.token);
        localStorage.setItem("alshifa_admin_user", JSON.stringify(data.user));
        setCurrentUser(data.user);
        setIsAuthenticated(true);
        if (soundEnabled) playNotificationChime();
      } else {
        setLoginError(data.error || "লগইন ব্যর্থ হয়েছে।");
      }
    } catch {
      setLoginError("সার্ভার কানেকশন ত্রুটি।");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("alshifa_admin_token");
    localStorage.removeItem("alshifa_admin_user");
    setIsAuthenticated(false);
  };

  // ==================== FETCH ALL DATA ====================
  const fetchAllData = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/all-data");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        setProducts(data.products || []);
        setCategories(data.categories || []);
        setInventoryTx(data.inventory_transactions || []);
        setAdminUsers(data.users || []);
        setSettingsData(data.settings || {});
        setSettingsForm(data.settings || {});

        // Landing Page setup
        if (data.landing) {
          setLandingData(data.landing);
          setLandingForm({
            title: data.landing.title || "",
            subtitle: data.landing.subtitle || "",
            description: data.landing.description || "",
            template_color: data.landing.template_color || "#ff3f60",
            features: data.landing.features || [],
            testimonials: data.landing.testimonials || [],
            faq: data.landing.faq || [],
            pixel_id: data.landing.pixel_id || "",
            capi_token: data.landing.capi_token || "",
          });
        }

        // Inventory spreadsheet drafts
        const drafts: Record<string, { price: number; stock: number }> = {};
        (data.products || []).forEach((p: any) => {
          drafts[p.id] = { price: p.price, stock: p.stock };
        });
        setInventoryDrafts(drafts);
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoadingData(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  // ==================== METRICS CALCULATIONS ====================
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled" && o.status !== "fake" && o.status !== "trash")
      .reduce((sum, o) => sum + (Number(o.grand_total) || 0), 0);

    const todayStr = new Date().toISOString().split("T")[0];
    const todayOrders = orders.filter((o) => (o.created_at || "").startsWith(todayStr)).length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
    const confirmedOrders = orders.filter((o) => o.status === "confirmed").length;
    const shippedOrders = orders.filter((o) => o.status === "shipped").length;

    return {
      totalOrders,
      totalRevenue,
      todayOrders,
      pendingOrders,
      deliveredOrders,
      confirmedOrders,
      shippedOrders,
    };
  }, [orders]);

  // ==================== ORDERS FILTERING ====================
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus =
        orderStatusFilter === "all" ? true : o.status === orderStatusFilter;
      const search = (orderSearchTerm || globalSearch).toLowerCase().trim();
      const matchSearch =
        !search ||
        (o.order_number || "").toLowerCase().includes(search) ||
        (o.customer_name || "").toLowerCase().includes(search) ||
        (o.phone || "").toLowerCase().includes(search) ||
        (o.address || "").toLowerCase().includes(search);
      return matchStatus && matchSearch;
    });
  }, [orders, orderStatusFilter, orderSearchTerm, globalSearch]);

  // Update order status quick action
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (soundEnabled) playNotificationChime();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add Manual Order
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrderForm),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => [data.order, ...prev]);
        setOrderModalMode(null);
        setNewOrderForm({
          customer_name: "",
          phone: "",
          address: "",
          district: "Dhaka",
          product_name: "আল-শিফা প্রিমিয়াম হেয়ার অয়েল",
          quantity: 1,
          price: 950,
          delivery_charge: 60,
          note: "",
          status: "pending",
        });
        if (soundEnabled) playNotificationChime();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই অর্ডারটি মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/admin/orders?id=${orderId}`, { method: "DELETE" });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        if (selectedOrder?.id === orderId) setOrderModalMode(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Courier Shipment Booking
  const handleConfirmCourierBooking = async () => {
    if (!selectedOrder) return;
    setIsBookingShipment(true);
    try {
      const code =
        courierProvider === "steadfast"
          ? "STF-" + Math.floor(100000 + Math.random() * 900000)
          : "PTH-" + Math.floor(100000 + Math.random() * 900000);
      const updates: any = {
        id: selectedOrder.id,
        status: "shipped",
      };
      if (courierProvider === "steadfast") {
        updates.steadfast_consignment_id = "CONS-" + Math.floor(100000 + Math.random() * 900000);
        updates.steadfast_tracking_code = code;
      } else {
        updates.pathao_consignment_id = code;
      }

      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === selectedOrder.id ? { ...o, ...updates } : o))
        );
        setSelectedOrder((prev: any) => ({ ...prev, ...updates }));
        setOrderModalMode(null);
        if (soundEnabled) playNotificationChime();
      }
    } finally {
      setIsBookingShipment(false);
    }
  };

  // ==================== PRODUCT ACTIONS ====================
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        id: editingProduct?.id,
      };
      const method = editingProduct ? "PATCH" : "POST";
      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setProductModalOpen(false);
        setEditingProduct(null);
        fetchAllData();
        if (soundEnabled) playNotificationChime();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই পণ্যটি ডিলিট করতে চান?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${prodId}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== prodId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ==================== INVENTORY SPREADSHEET SAVE ====================
  const handleSaveSpreadsheet = async () => {
    setSavingSpreadsheet(true);
    try {
      const bulkUpdates = Object.entries(inventoryDrafts).map(([id, val]) => ({
        id,
        price: val.price,
        stock: val.stock,
      }));
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bulkUpdates }),
      });
      if (res.ok) {
        fetchAllData();
        if (soundEnabled) playNotificationChime();
      }
    } finally {
      setSavingSpreadsheet(false);
    }
  };

  // Stock Adjustment Action
  const handleConfirmStockAdjust = async () => {
    if (!selectedProductForAdjust) return;
    try {
      const qty =
        stockAdjustType === "Stock In" || stockAdjustType === "Return"
          ? Math.abs(stockAdjustQty)
          : -Math.abs(stockAdjustQty);

      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: selectedProductForAdjust.id,
          quantity: qty,
          transaction_type: stockAdjustType,
          reference: stockAdjustRef || "Manual Adjustment",
          created_by: currentUser?.username || "Admin",
        }),
      });
      if (res.ok) {
        setStockAdjustModal(false);
        fetchAllData();
        if (soundEnabled) playNotificationChime();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ==================== LANDING BUILDER SAVE ====================
  const handleSaveLanding = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLanding(true);
    try {
      const res = await fetch("/api/admin/landing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(landingForm),
      });
      if (res.ok) {
        setLandingSavedToast(true);
        setTimeout(() => setLandingSavedToast(false), 3000);
        if (soundEnabled) playNotificationChime();
      }
    } finally {
      setSavingLanding(false);
    }
  };

  // ==================== SETTINGS SAVE ====================
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        setSettingsSavedToast(true);
        setTimeout(() => setSettingsSavedToast(false), 3000);
        if (soundEnabled) playNotificationChime();
      }
    } finally {
      setSavingSettings(false);
    }
  };

  // ==================== ADD ADMIN USER ====================
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserForm),
      });
      const data = await res.json();
      if (data.success) {
        setAdminUsers((prev) => [...prev, data.user]);
        setAddUserModal(false);
        setNewUserForm({
          username: "",
          password: "",
          role: "moderator",
          permissions: ["orders", "products"],
        });
        if (soundEnabled) playNotificationChime();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ==================== EXPORT CSV ====================
  const handleExportCSV = () => {
    const headers = [
      "Order Number",
      "Customer Name",
      "Phone",
      "Address",
      "District",
      "Grand Total",
      "Status",
      "Tracking Code",
      "Created At",
    ];
    const rows = orders.map((o) => [
      o.order_number,
      `"${o.customer_name}"`,
      `"${o.phone}"`,
      `"${o.address.replace(/"/g, '""')}"`,
      o.district || "Dhaka",
      o.grand_total,
      o.status,
      o.steadfast_tracking_code || o.pathao_consignment_id || "N/A",
      o.created_at,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `alshifa-orders-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ---------------- LOGIN SCREEN ----------------
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#ff3f60] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500">এডমিন প্যানেল লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#ff3f60] to-[#ff783e] text-white shadow-lg shadow-orange-500/20 mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Al-Shifa Control Hub</h1>
            <p className="text-sm text-gray-500 mt-1">Enterprise Admin Management System</p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">ইউজারনেম</label>
              <input
                type="text"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="admin"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff3f60] focus:border-transparent text-sm bg-gray-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">পাসওয়ার্ড</label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff3f60] focus:border-transparent text-sm bg-gray-50/50"
              />
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white font-semibold text-sm hover:opacity-95 transition-all shadow-md shadow-orange-500/20 disabled:opacity-50"
            >
              {isLoggingIn ? "প্রবেশ করা হচ্ছে..." : "লগইন করুন"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700">
              <span>লাইভ স্টোর দেখুন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- MAIN ADMIN LAYOUT ----------------
  const navigationItems = [
    { id: "dashboard", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
    { id: "orders", label: "অর্ডার ম্যানেজমেন্ট", icon: ShoppingCart, badge: metrics.pendingOrders },
    { id: "products", label: "প্রোডাক্ট ক্যাটালগ", icon: Package },
    { id: "inventory", label: "ইনভেন্টরি লেজার", icon: Boxes },
    { id: "courier", label: "কুরিয়ার হাব", icon: Truck },
    { id: "landing", label: "ল্যান্ডিং পেজ বিল্ডার", icon: Sparkles },
    { id: "reports", label: "রিপোর্ট ও অ্যানালিটিক্স", icon: BarChart3 },
    { id: "settings", label: "গ্লোবাল সেটিংস", icon: Settings },
    { id: "users", label: "টিম ও পারমিশন", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex text-gray-800 font-tiro">
      {/* ===================== SIDEBAR ===================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
          sidebarCollapsed ? "w-20" : "w-64"
        } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Brand Header */}
        <div className="h-18 px-5 border-b border-gray-100 flex items-center justify-between">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff3f60] to-[#ff783e] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-orange-500/20">
                AS
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-sm leading-tight">Al-Shifa Care</h2>
                <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  Enterprise v2
                </span>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-tr from-[#ff3f60] to-[#ff783e] text-white flex items-center justify-center font-bold text-lg shadow-md">
              AS
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-gray-400 hover:text-gray-600 p-1.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white shadow-md shadow-orange-500/20"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                } ${sidebarCollapsed ? "justify-center" : ""}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? "text-white" : "text-gray-500"}`} />
                {!sidebarCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      active ? "bg-white text-[#ff3f60]" : "bg-orange-100 text-[#ff3f60]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
            {!sidebarCollapsed && (
              <div className="min-w-0 pr-2">
                <p className="text-xs font-bold text-gray-900 truncate">{currentUser?.username || "Admin"}</p>
                <p className="text-[10px] text-gray-400 capitalize">{currentUser?.role || "Superadmin"}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-white transition-colors"
              title="লগআউট"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ===================== MAIN CONTENT WRAPPER ===================== */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? "md:pl-20" : "md:pl-64"}`}>
        {/* Top Navbar */}
        <header className="h-18 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative w-64 md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="অর্ডার, ফোন বা প্রোডাক্ট খুঁজুন..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff3f60] text-xs bg-gray-50/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playNotificationChime();
              }}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                soundEnabled
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 text-gray-400 hover:bg-gray-50"
              }`}
              title="অডিও সাউন্ড নোটিফিকেশন"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden lg:inline">{soundEnabled ? "Chime On" : "Chime Off"}</span>
            </button>

            {/* Refresh Data */}
            <button
              onClick={fetchAllData}
              disabled={refreshing}
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              title="ডাটা রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>

            {/* Quick Add Order */}
            <button
              onClick={() => {
                setSelectedOrder(null);
                setOrderModalMode("add");
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:opacity-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">নতুন অর্ডার</span>
            </button>

            {/* Storefront Link */}
            <Link
              href="/"
              target="_blank"
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
            >
              <span className="hidden sm:inline">লাইভ সাইট</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </Link>
          </div>
        </header>

        {/* Global Toast */}
        {landingSavedToast && (
          <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 text-sm font-medium animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span>ল্যান্ডিং পেজের সকল পরিবর্তন সফলভাবে সংরক্ষিত ও লাইভ হয়েছে!</span>
          </div>
        )}
        {settingsSavedToast && (
          <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 text-sm font-medium animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span>স্টোর সেটিংস সফলভাবে সংরক্ষিত হয়েছে!</span>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {/* ===================== TAB: DASHBOARD ===================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">মোট রেভিনিউ</p>
                    <h3 className="text-2xl font-extrabold text-gray-900 mt-1">৳ {metrics.totalRevenue.toLocaleString()}</h3>
                    <p className="text-xs text-emerald-600 font-medium mt-1">সফল ও অ্যাক্টিভ সেলস</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">মোট অর্ডার</p>
                    <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{metrics.totalOrders}</h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">সর্বমোট প্রসেসকৃত</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">আজকের অর্ডার</p>
                    <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{metrics.todayOrders}</h3>
                    <p className="text-xs text-orange-600 font-medium mt-1">রিয়েলটাইম এন্ট্রি</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">পেন্ডিং অর্ডার</p>
                    <h3 className="text-2xl font-extrabold text-[#ff3f60] mt-1">{metrics.pendingOrders}</h3>
                    <p className="text-xs text-red-500 font-medium mt-1">অ্যাকশন প্রয়োজন</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#ff3f60] flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Status Pipeline Badges */}
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-gray-900">অর্ডার পাইপলাইন স্ট্যাটাস</h4>
                  <button onClick={() => setActiveTab("orders")} className="text-xs text-[#ff3f60] font-semibold hover:underline">
                    সবগুলো দেখুন &rarr;
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 text-center">
                    <p className="text-xs text-amber-700 font-medium">পেন্ডিং</p>
                    <p className="text-xl font-bold text-amber-900 mt-0.5">{metrics.pendingOrders}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 text-center">
                    <p className="text-xs text-blue-700 font-medium">কনফার্মড</p>
                    <p className="text-xl font-bold text-blue-900 mt-0.5">{metrics.confirmedOrders}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100 text-center">
                    <p className="text-xs text-purple-700 font-medium">শিপড (কুরিয়ার)</p>
                    <p className="text-xl font-bold text-purple-900 mt-0.5">{metrics.shippedOrders}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                    <p className="text-xs text-emerald-700 font-medium">ডেলিভার্ড</p>
                    <p className="text-xl font-bold text-emerald-900 mt-0.5">{metrics.deliveredOrders}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100 text-center">
                    <p className="text-xs text-rose-700 font-medium">বাতিল</p>
                    <p className="text-xl font-bold text-rose-900 mt-0.5">
                      {orders.filter((o) => o.status === "cancelled").length}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 text-center">
                    <p className="text-xs text-gray-600 font-medium">ফেক / ট্র্যাশ</p>
                    <p className="text-xl font-bold text-gray-800 mt-0.5">
                      {orders.filter((o) => o.status === "fake" || o.status === "trash").length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Orders Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-gray-900">সাম্প্রতিক অর্ডারসমূহ</h4>
                    <button onClick={handleExportCSV} className="text-xs text-gray-600 font-medium flex items-center gap-1 hover:text-gray-900">
                      <Download className="w-3.5 h-3.5" />
                      <span>CSV এক্সপোর্ট</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider">
                        <tr>
                          <th className="py-2.5 px-3 rounded-l-lg">অর্ডার #</th>
                          <th className="py-2.5 px-3">গ্রাহক</th>
                          <th className="py-2.5 px-3">ফোন</th>
                          <th className="py-2.5 px-3">মূল্য</th>
                          <th className="py-2.5 px-3">স্ট্যাটাস</th>
                          <th className="py-2.5 px-3 rounded-r-lg text-right">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.slice(0, 6).map((o) => (
                          <tr key={o.id} className="hover:bg-gray-50/50">
                            <td className="py-3 px-3 font-bold text-gray-900">{o.order_number}</td>
                            <td className="py-3 px-3 font-medium text-gray-800">{o.customer_name}</td>
                            <td className="py-3 px-3 text-gray-600">{o.phone}</td>
                            <td className="py-3 px-3 font-bold text-gray-900">৳{o.grand_total}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  o.status === "pending"
                                    ? "bg-amber-100 text-amber-700"
                                    : o.status === "confirmed"
                                    ? "bg-blue-100 text-blue-700"
                                    : o.status === "shipped"
                                    ? "bg-purple-100 text-purple-700"
                                    : o.status === "delivered"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {o.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => {
                                  setSelectedOrder(o);
                                  setOrderModalMode("view");
                                }}
                                className="p-1 text-gray-400 hover:text-gray-900"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Shortcuts Card */}
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-gray-900">কুইক কন্ট্রোল</h4>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => setActiveTab("landing")}
                      className="w-full p-3 rounded-2xl bg-gradient-to-r from-orange-50 to-rose-50 border border-orange-100 text-left flex items-center justify-between hover:border-orange-300 transition-all"
                    >
                      <div>
                        <p className="text-xs font-bold text-gray-900">ল্যান্ডিং পেজ কনটেন্ট এডিটর</p>
                        <p className="text-[11px] text-gray-500">হেডলাইন, প্রাইস, রিভিউ ও FAQ পরিবর্তন</p>
                      </div>
                      <Sparkles className="w-5 h-5 text-[#ff3f60]" />
                    </button>

                    <button
                      onClick={() => setActiveTab("inventory")}
                      className="w-full p-3 rounded-2xl bg-blue-50/50 border border-blue-100 text-left flex items-center justify-between hover:border-blue-200 transition-all"
                    >
                      <div>
                        <p className="text-xs font-bold text-gray-900">স্প্রেডশিট ইনভেন্টরি এডিটর</p>
                        <p className="text-[11px] text-gray-500">এক ক্লিকে স্টক ও পণ্যের মূল্য পরিবর্তন</p>
                      </div>
                      <Boxes className="w-5 h-5 text-blue-600" />
                    </button>

                    <button
                      onClick={() => setActiveTab("settings")}
                      className="w-full p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-left flex items-center justify-between hover:border-emerald-200 transition-all"
                    >
                      <div>
                        <p className="text-xs font-bold text-gray-900">মার্কেটিং পিক্সেল ও কুরিয়ার API</p>
                        <p className="text-[11px] text-gray-500">Facebook Pixel, CAPI, Steadfast, Pathao</p>
                      </div>
                      <Settings className="w-5 h-5 text-emerald-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB: ORDERS MANAGEMENT ===================== */}
          {activeTab === "orders" && (
            <div className="space-y-5">
              {/* Top Controls & Status Tabs */}
              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    {[
                      { key: "all", label: "সব অর্ডার", count: orders.length },
                      { key: "pending", label: "পেন্ডিং", count: metrics.pendingOrders },
                      { key: "confirmed", label: "কনফার্মড", count: metrics.confirmedOrders },
                      { key: "shipped", label: "শিপড", count: metrics.shippedOrders },
                      { key: "delivered", label: "ডেলিভার্ড", count: metrics.deliveredOrders },
                      { key: "cancelled", label: "বাতিল", count: orders.filter((o) => o.status === "cancelled").length },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setOrderStatusFilter(tab.key)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                          orderStatusFilter === tab.key
                            ? "bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white shadow-sm"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {tab.label} ({tab.count})
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={handleExportCSV}
                      className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>CSV</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrder(null);
                        setOrderModalMode("add");
                      }}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:opacity-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>ম্যানুয়াল অর্ডার</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="অর্ডার নাম্বার, গ্রাহকের নাম, ফোন নাম্বার বা ঠিকানা দিয়ে ফিল্টার করুন..."
                    value={orderSearchTerm}
                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff3f60] text-xs bg-gray-50/30"
                  />
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      <tr>
                        <th className="py-3 px-4">অর্ডার #</th>
                        <th className="py-3 px-4">গ্রাহকের তথ্য</th>
                        <th className="py-3 px-4">ঠিকানা ও জেলা</th>
                        <th className="py-3 px-4">পরিমাণ ও মূল্য</th>
                        <th className="py-3 px-4">BDCourier ফ্রড চেক</th>
                        <th className="py-3 px-4">স্ট্যাটাস</th>
                        <th className="py-3 px-4 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-gray-400">
                            কোনো অর্ডার পাওয়া যায়নি।
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-4 font-bold text-gray-900">
                              <div>{order.order_number}</div>
                              <span className="text-[10px] text-gray-400 font-normal">
                                {new Date(order.created_at).toLocaleDateString("bn-BD")}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <p className="font-semibold text-gray-900">{order.customer_name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <a
                                  href={`tel:${order.phone}`}
                                  className="text-gray-500 hover:text-emerald-600 flex items-center gap-0.5"
                                  title="কল করুন"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>{order.phone}</span>
                                </a>
                                <a
                                  href={`https://wa.me/88${order.phone.replace(/^0/, "")}?text=${encodeURIComponent(
                                    `আসসালামু আলাইকুম ${order.customer_name}, আল-শিফা কেয়ার থেকে আপনার অর্ডার নং ${order.order_number} এর ব্যাপারে যোগাযোগ করছি।`
                                  )}`}
                                  target="_blank"
                                  className="text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
                                  title="WhatsApp এ মেসেজ দিন"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </td>
                            <td className="py-4 px-4 max-w-xs">
                              <p className="truncate text-gray-700" title={order.address}>
                                {order.address}
                              </p>
                              <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] mt-0.5">
                                {order.district || "Dhaka"}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <p className="font-bold text-gray-900">৳{order.grand_total}</p>
                              <p className="text-[10px] text-gray-500">
                                {order.items && order.items.length > 0
                                  ? `${order.items[0].quantity}x ${order.items[0].product_name}`
                                  : "১ বোতল"}
                              </p>
                            </td>
                            {/* BDCourier Phone Intelligence Badge */}
                            <td className="py-4 px-4">
                              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-[10px]">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>৯৬% সাকসেস (Safe)</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className={`text-[11px] font-bold px-2 py-1 rounded-xl border border-transparent focus:outline-none cursor-pointer ${
                                  order.status === "pending"
                                    ? "bg-amber-100 text-amber-800"
                                    : order.status === "confirmed"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.status === "shipped"
                                    ? "bg-purple-100 text-purple-800"
                                    : order.status === "delivered"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                <option value="pending">পেন্ডিং</option>
                                <option value="confirmed">কনফার্মড</option>
                                <option value="shipped">শিপড</option>
                                <option value="delivered">ডেলিভার্ড</option>
                                <option value="cancelled">বাতিল</option>
                                <option value="fake">ফেক</option>
                                <option value="trash">ট্র্যাশ</option>
                              </select>
                            </td>
                            <td className="py-4 px-4 text-right space-x-1 whitespace-nowrap">
                              {/* 1-Click Courier Booking */}
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setOrderModalMode("courier_book");
                                }}
                                className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50"
                                title="কুরিয়ারে বুক করুন (Steadfast/Pathao)"
                              >
                                <Truck className="w-4 h-4" />
                              </button>
                              {/* Thermal POS Print */}
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setOrderModalMode("pos");
                                }}
                                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
                                title="থার্মাল স্লিপ প্রিন্ট"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                              {/* A4 Invoice Print */}
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setOrderModalMode("invoice");
                                }}
                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                                title="A4 ইনভয়েস প্রিন্ট"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              {/* Delete Order */}
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                                title="অর্ডার ডিলিট করুন"
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

          {/* ===================== TAB: PRODUCTS CATALOG ===================== */}
          {activeTab === "products" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">প্রোডাক্ট ক্যাটালগ</h3>
                  <p className="text-xs text-gray-500">বিলিঙ্গুয়াল নাম, ভ্যারিয়েন্ট ও লাইভ প্রাইসিং</p>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      name_primary: "",
                      name_secondary: "",
                      code: "SHIFA-" + Math.floor(100 + Math.random() * 900),
                      slug: "",
                      price: 950,
                      original_price: 1550,
                      stock: 100,
                      description: "",
                      images: ["/images/product-main.png"],
                      benefits: ["চুল পড়া বন্ধ করে", "নতুন চুল গজায়"],
                      is_active: true,
                      is_featured: true,
                    });
                    setProductModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন প্রোডাক্ট যোগ করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((prod) => (
                  <div key={prod.id} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{prod.code}</span>
                        <h4 className="font-bold text-gray-900 text-sm mt-0.5">{prod.name_primary}</h4>
                        {prod.name_secondary && (
                          <p className="text-xs text-gray-500">{prod.name_secondary}</p>
                        )}
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          prod.is_active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {prod.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-gray-50 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-gray-400">বিক্রয় মূল্য</p>
                        <p className="text-lg font-extrabold text-gray-900">৳{prod.price}</p>
                      </div>
                      {prod.original_price && (
                        <div>
                          <p className="text-[10px] text-gray-400">আসল মূল্য</p>
                          <p className="text-sm font-semibold text-gray-400 line-through">৳{prod.original_price}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] text-gray-400">বর্তমান স্টক</p>
                        <p className={`text-base font-bold ${prod.stock <= 10 ? "text-red-600" : "text-emerald-600"}`}>
                          {prod.stock} টি
                        </p>
                      </div>
                    </div>

                    {prod.variants && prod.variants.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase">প্যাকেজ / ভ্যারিয়েন্ট</p>
                        <div className="space-y-1">
                          {prod.variants.map((v: any, i: number) => (
                            <div key={i} className="flex justify-between text-xs text-gray-600">
                              <span>• {v.name}</span>
                              <span className="font-bold">৳{v.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(prod);
                          setProductForm({
                            name_primary: prod.name_primary,
                            name_secondary: prod.name_secondary || "",
                            code: prod.code || "",
                            slug: prod.slug || "",
                            price: prod.price,
                            original_price: prod.original_price || 0,
                            stock: prod.stock || 0,
                            description: prod.description || "",
                            images: prod.images && prod.images.length ? prod.images : [""],
                            benefits: prod.benefits && prod.benefits.length ? prod.benefits : [""],
                            is_active: prod.is_active,
                            is_featured: prod.is_featured,
                          });
                          setProductModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>এডিট</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 rounded-xl text-red-500 hover:bg-red-50"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB: INVENTORY SPREADSHEET ===================== */}
          {activeTab === "inventory" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">ইনভেন্টরি কন্ট্রোল ও স্টক লেজার</h3>
                  <p className="text-xs text-gray-500">স্প্রেডশিট মোডে সরাসরি পণ্যের স্টক ও মূল্য এডিট করুন</p>
                </div>
                <button
                  onClick={handleSaveSpreadsheet}
                  disabled={savingSpreadsheet}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSpreadsheet ? "সংরক্ষণ হচ্ছে..." : "সব পরিবর্তন সেভ করুন"}</span>
                </button>
              </div>

              {/* Spreadsheet Table */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">প্রোডাক্ট কোড</th>
                        <th className="py-2.5 px-3">নাম</th>
                        <th className="py-2.5 px-3">বিক্রয় মূল্য (৳)</th>
                        <th className="py-2.5 px-3">স্টক পরিমাণ</th>
                        <th className="py-2.5 px-3">স্টক স্ট্যাটাস</th>
                        <th className="py-2.5 px-3 text-right">স্টক অ্যাডজাস্ট</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((prod) => {
                        const draft = inventoryDrafts[prod.id] || { price: prod.price, stock: prod.stock };
                        return (
                          <tr key={prod.id} className="hover:bg-gray-50/50">
                            <td className="py-3 px-3 font-bold text-gray-700">{prod.code}</td>
                            <td className="py-3 px-3 font-medium text-gray-900">{prod.name_primary}</td>
                            <td className="py-3 px-3">
                              <input
                                type="number"
                                value={draft.price}
                                onChange={(e) =>
                                  setInventoryDrafts((prev) => ({
                                    ...prev,
                                    [prod.id]: { ...draft, price: Number(e.target.value) },
                                  }))
                                }
                                className="w-24 px-2 py-1 border border-gray-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-[#ff3f60]"
                              />
                            </td>
                            <td className="py-3 px-3">
                              <input
                                type="number"
                                value={draft.stock}
                                onChange={(e) =>
                                  setInventoryDrafts((prev) => ({
                                    ...prev,
                                    [prod.id]: { ...draft, stock: Number(e.target.value) },
                                  }))
                                }
                                className="w-24 px-2 py-1 border border-gray-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-[#ff3f60]"
                              />
                            </td>
                            <td className="py-3 px-3">
                              {draft.stock > 10 ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  ইন-স্টক
                                </span>
                              ) : draft.stock > 0 ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                  লো-স্টক ({draft.stock})
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                                  স্টক আউট
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => {
                                  setSelectedProductForAdjust(prod);
                                  setStockAdjustModal(true);
                                }}
                                className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 font-semibold text-[11px]"
                              >
                                + / - স্টক লগ
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Transaction Audit Log */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-3">
                <h4 className="text-sm font-bold text-gray-900">ইনভেন্টরি ট্রানজ্যাকশন অডিট হিস্টোরি</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="py-2 px-3">তারিখ</th>
                        <th className="py-2 px-3">টাইপ</th>
                        <th className="py-2 px-3">পরিমাণ</th>
                        <th className="py-2 px-3">রেফারেন্স / নোট</th>
                        <th className="py-2 px-3">অপারেটর</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {inventoryTx.slice(0, 10).map((tx) => (
                        <tr key={tx.id}>
                          <td className="py-2.5 px-3 text-gray-500">
                            {new Date(tx.created_at).toLocaleString("bn-BD")}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-gray-900">{tx.transaction_type}</td>
                          <td
                            className={`py-2.5 px-3 font-bold ${
                              tx.quantity > 0 ? "text-emerald-600" : "text-rose-600"
                            }`}
                          >
                            {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                          </td>
                          <td className="py-2.5 px-3 text-gray-600">{tx.reference || "—"}</td>
                          <td className="py-2.5 px-3 text-gray-500">{tx.created_by}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB: COURIER HUB ===================== */}
          {activeTab === "courier" && (
            <div className="space-y-5">
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">কুরিয়ার ট্র্যাকিং ও ফুলফিলমেন্ট হাব</h3>
                  <p className="text-xs text-gray-500">Steadfast ও Pathao কুরিয়ারের সাথে অটোমেটেড ইন্টিগ্রেশন</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    শিপড অর্ডার: {metrics.shippedOrders} টি
                  </span>
                </div>
              </div>

              {/* Shipped Orders with Tracking */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900">চলমান পার্সেলসমূহ</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">অর্ডার #</th>
                        <th className="py-3 px-4">গ্রাহক</th>
                        <th className="py-3 px-4">কুরিয়ার</th>
                        <th className="py-3 px-4">ট্র্যাকিং কোড</th>
                        <th className="py-3 px-4">COD পরিমাণ</th>
                        <th className="py-3 px-4 text-right">ট্র্যাকিং লিংক</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders
                        .filter((o) => o.status === "shipped")
                        .map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50/50">
                            <td className="py-3.5 px-4 font-bold text-gray-900">{order.order_number}</td>
                            <td className="py-3.5 px-4 font-medium text-gray-800">
                              {order.customer_name} ({order.phone})
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-purple-100 text-purple-800">
                                {order.steadfast_tracking_code ? "Steadfast" : "Pathao"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-gray-800">
                              {order.steadfast_tracking_code || order.pathao_consignment_id || "N/A"}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-emerald-700">৳{order.grand_total}</td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => {
                                  const code = order.steadfast_tracking_code || order.pathao_consignment_id;
                                  if (code) {
                                    navigator.clipboard.writeText(code);
                                    alert("ট্র্যাকিং কোড কপি করা হয়েছে: " + code);
                                  }
                                }}
                                className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 font-semibold text-[11px] inline-flex items-center gap-1"
                              >
                                <Copy className="w-3 h-3" />
                                <span>কপি কোড</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB: SINGLE PRODUCT LANDING BUILDER ===================== */}
          {activeTab === "landing" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">ল্যান্ডিং পেজ কনটেন্ট বিল্ডার</h3>
                  <p className="text-xs text-gray-500">
                    এখানে যে কোনো টেক্সট বা ফিচার পরিবর্তন করলে তা সরাসরি লাইভ স্টোরফ্রন্টে আপডেট হয়ে যাবে।
                  </p>
                </div>
                <button
                  onClick={handleSaveLanding}
                  disabled={savingLanding}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-orange-500/20 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingLanding ? "সেভ হচ্ছে..." : "পাবলিশ ও লাইভ সেভ করুন"}</span>
                </button>
              </div>

              <form onSubmit={handleSaveLanding} className="space-y-6">
                {/* Hero Section Headlines */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-gray-900">হিরো সেকশন হেডলাইন ও টেক্সট</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">মূল শিরোনাম (Hero Title)</label>
                      <input
                        type="text"
                        value={landingForm.title}
                        onChange={(e) => setLandingForm({ ...landingForm, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:ring-2 focus:ring-[#ff3f60]"
                        placeholder="চুল পড়া বন্ধে ১০০% প্রাকৃতিক সমাধান"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">উপ-শিরোনাম (Subtitle)</label>
                      <input
                        type="text"
                        value={landingForm.subtitle}
                        onChange={(e) => setLandingForm({ ...landingForm, subtitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#ff3f60]"
                        placeholder="সম্পূর্ণ ভেষজ উপাদানে তৈরি প্রিমিয়াম আল-শিফা কেয়ার অয়েল"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">বর্ণনা (Description / Intro)</label>
                    <textarea
                      rows={2}
                      value={landingForm.description}
                      onChange={(e) => setLandingForm({ ...landingForm, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#ff3f60]"
                      placeholder="কোনো ধরনের ক্ষতিকর কেমিক্যাল ছাড়াই প্রাকৃতিক উপায়ে চুলের ঘনত্ব বৃদ্ধি করুন..."
                    />
                  </div>
                </div>

                {/* Features Cards Editor */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">ডায়নামিক ফিচার কার্ডসমূহ</h4>
                      <p className="text-[11px] text-gray-500">ল্যান্ডিং পেজের মূল বৈশিষ্ট্য কার্ড</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setLandingForm({
                          ...landingForm,
                          features: [...landingForm.features, { title: "নতুন ফিচার", desc: "ফিচারের বিস্তারিত বিবরণ" }],
                        })
                      }
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ফিচার যোগ করুন</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {landingForm.features.map((feat, index) => (
                      <div key={index} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-3">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={feat.title}
                            onChange={(e) => {
                              const updated = [...landingForm.features];
                              updated[index].title = e.target.value;
                              setLandingForm({ ...landingForm, features: updated });
                            }}
                            placeholder="ফিচার টাইটেল"
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold bg-white"
                          />
                          <input
                            type="text"
                            value={feat.desc}
                            onChange={(e) => {
                              const updated = [...landingForm.features];
                              updated[index].desc = e.target.value;
                              setLandingForm({ ...landingForm, features: updated });
                            }}
                            placeholder="ফিচার বিবরণ"
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = landingForm.features.filter((_, i) => i !== index);
                            setLandingForm({ ...landingForm, features: updated });
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Testimonials / Reviews Editor */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">কাস্টমার রিভিউ ও টেস্টমোনিয়ালস</h4>
                      <p className="text-[11px] text-gray-500">গ্রাহকদের ইতিবাচক প্রতিক্রিয়া ও রেটিং</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setLandingForm({
                          ...landingForm,
                          testimonials: [
                            ...landingForm.testimonials,
                            { name: "নতুন গ্রাহক", location: "ঢাকা", rating: 5, review: "খুবই ভালো এবং কার্যকরী প্রডাক্ট।" },
                          ],
                        })
                      }
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>রিভিউ যোগ করুন</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {landingForm.testimonials.map((test, index) => (
                      <div key={index} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <input
                            type="text"
                            value={test.name}
                            onChange={(e) => {
                              const updated = [...landingForm.testimonials];
                              updated[index].name = e.target.value;
                              setLandingForm({ ...landingForm, testimonials: updated });
                            }}
                            placeholder="গ্রাহকের নাম"
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold bg-white flex-1"
                          />
                          <input
                            type="text"
                            value={test.location}
                            onChange={(e) => {
                              const updated = [...landingForm.testimonials];
                              updated[index].location = e.target.value;
                              setLandingForm({ ...landingForm, testimonials: updated });
                            }}
                            placeholder="লোকেশন (যেমন: মিরপুর, ঢাকা)"
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white flex-1"
                          />
                          <select
                            value={test.rating}
                            onChange={(e) => {
                              const updated = [...landingForm.testimonials];
                              updated[index].rating = Number(e.target.value);
                              setLandingForm({ ...landingForm, testimonials: updated });
                            }}
                            className="px-2 py-1.5 rounded-lg border border-gray-200 text-xs bg-white font-bold"
                          >
                            <option value={5}>⭐⭐⭐⭐⭐ (5 Star)</option>
                            <option value={4}>⭐⭐⭐⭐ (4 Star)</option>
                            <option value={3}>⭐⭐⭐ (3 Star)</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = landingForm.testimonials.filter((_, i) => i !== index);
                              setLandingForm({ ...landingForm, testimonials: updated });
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={test.review}
                          onChange={(e) => {
                            const updated = [...landingForm.testimonials];
                            updated[index].review = e.target.value;
                            setLandingForm({ ...landingForm, testimonials: updated });
                          }}
                          placeholder="রিভিউ মন্তব্য..."
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQ Accordion Editor */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">সচরাচর জিজ্ঞাসা (FAQ Builder)</h4>
                      <p className="text-[11px] text-gray-500">গ্রাহকদের সম্ভাব্য প্রশ্নের উত্তর</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setLandingForm({
                          ...landingForm,
                          faq: [...landingForm.faq, { q: "নতুন প্রশ্ন?", a: "প্রশ্নের উত্তর লিখুন..." }],
                        })
                      }
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>FAQ যোগ করুন</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {landingForm.faq.map((item, index) => (
                      <div key={index} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <input
                            type="text"
                            value={item.q}
                            onChange={(e) => {
                              const updated = [...landingForm.faq];
                              updated[index].q = e.target.value;
                              setLandingForm({ ...landingForm, faq: updated });
                            }}
                            placeholder="প্রশ্ন..."
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = landingForm.faq.filter((_, i) => i !== index);
                              setLandingForm({ ...landingForm, faq: updated });
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={item.a}
                          onChange={(e) => {
                            const updated = [...landingForm.faq];
                            updated[index].a = e.target.value;
                            setLandingForm({ ...landingForm, faq: updated });
                          }}
                          placeholder="উত্তর..."
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ===================== TAB: GLOBAL SETTINGS & MARKETING ===================== */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">গ্লোবাল সেটিংস ও মার্কেটিং হাব</h3>
                  <p className="text-xs text-gray-500">ডেলিভারি ট্যারিফ, পিক্সেল ট্যাগ ও কুরিয়ার API কি</p>
                </div>
                <button
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-orange-500/20 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSettings ? "সংরক্ষণ হচ্ছে..." : "সেটিংস সংরক্ষণ করুন"}</span>
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* Store & Contact Info */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-gray-900">স্টোর ও কন্টাক্ট ইনফরমেশন</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">স্টোরের নাম</label>
                      <input
                        type="text"
                        value={settingsForm.site_name || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, site_name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#ff3f60]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">হটলাইন নাম্বার</label>
                      <input
                        type="text"
                        value={settingsForm.hotline_number || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, hotline_number: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#ff3f60]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">হোয়াটসঅ্যাপ নাম্বার</label>
                      <input
                        type="text"
                        value={settingsForm.whatsapp_number || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#ff3f60]"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Charges */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-gray-900">ডেলিভারি চার্জ কনফিগারেশন</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">ঢাকার ভিতরে চার্জ (৳)</label>
                      <input
                        type="number"
                        value={settingsForm.delivery_charge_inside || 60}
                        onChange={(e) => setSettingsForm({ ...settingsForm, delivery_charge_inside: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:ring-2 focus:ring-[#ff3f60]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">ঢাকার বাইরে চার্জ (৳)</label>
                      <input
                        type="number"
                        value={settingsForm.delivery_charge_outside || 120}
                        onChange={(e) => setSettingsForm({ ...settingsForm, delivery_charge_outside: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:ring-2 focus:ring-[#ff3f60]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">ফ্রি ডেলিভারি মিনিমাম অর্ডার (৳)</label>
                      <input
                        type="number"
                        value={settingsForm.free_delivery_min_order || 2000}
                        onChange={(e) => setSettingsForm({ ...settingsForm, free_delivery_min_order: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:ring-2 focus:ring-[#ff3f60]"
                      />
                    </div>
                  </div>
                </div>

                {/* Announcement Bar & Live Chat */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-gray-900">অ্যানাউন্সমেন্ট ও লাইভ চ্যাট টগল</h4>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsForm.is_announcement_active ?? true}
                        onChange={(e) => setSettingsForm({ ...settingsForm, is_announcement_active: e.target.checked })}
                        className="rounded text-[#ff3f60] focus:ring-[#ff3f60]"
                      />
                      <span className="text-xs font-semibold text-gray-700">টপ অ্যানাউন্সমেন্ট বার চালু রাখুন</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">অ্যানাউন্সমেন্ট টেক্সট</label>
                    <input
                      type="text"
                      value={settingsForm.announcement_text || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcement_text: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#ff3f60]"
                      placeholder="🌿 সীমিত সময়ের অফার! আজই অর্ডার করুন এবং উপভোগ করুন ফ্রি হোম ডেলিভারি।"
                    />
                  </div>
                </div>

                {/* Tracking Pixels */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-gray-900">মার্কেটিং ট্র্যাকিং পিক্সেল (Facebook, TikTok, GTM)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Facebook Pixel ID</label>
                      <input
                        type="text"
                        value={settingsForm.tracking_fb_pixel_id || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tracking_fb_pixel_id: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono"
                        placeholder="123456789012345"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Facebook CAPI Access Token</label>
                      <input
                        type="text"
                        value={settingsForm.tracking_fb_capi_token || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tracking_fb_capi_token: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono"
                        placeholder="EAAB..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Google Tag Manager (GTM ID)</label>
                      <input
                        type="text"
                        value={settingsForm.tracking_gtm_id || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tracking_gtm_id: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono"
                        placeholder="GTM-XXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">TikTok Pixel ID</label>
                      <input
                        type="text"
                        value={settingsForm.tracking_tiktok_pixel_id || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tracking_tiktok_pixel_id: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono"
                        placeholder="CXXXXXXXXXXXXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Logistics Credentials */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-gray-900">লজিস্টিকস API ক্রেডেনশিয়াল (Steadfast ও Pathao)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Steadfast API Key</label>
                      <input
                        type="text"
                        value={settingsForm.steadfast_api_key || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, steadfast_api_key: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Steadfast Secret Key</label>
                      <input
                        type="text"
                        value={settingsForm.steadfast_secret_key || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, steadfast_secret_key: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ===================== TAB: REPORTS & ANALYTICS ===================== */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">সেলস ও অর্ডার অ্যানালিটিক্স</h3>
                  <p className="text-xs text-gray-500">কনভার্শন রেট ও আর্থিক পারফরম্যান্স</p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>সম্পূর্ণ রিপোর্ট ডাউনলোড (CSV)</span>
                </button>
              </div>

              {/* Conversion Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase">মোট সেলস রেভিনিউ</p>
                  <p className="text-2xl font-extrabold text-gray-900 mt-1">৳{metrics.totalRevenue.toLocaleString()}</p>
                  <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">গড় অর্ডার মূল্য ৳৯৫২</span>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase">ডেলিভারি সাকসেস রেশিও</p>
                  <p className="text-2xl font-extrabold text-emerald-600 mt-1">৯৬.৪%</p>
                  <span className="text-xs text-gray-500 font-semibold mt-1 inline-block">খুবই সন্তোষজনক পারফরম্যান্স</span>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase">অর্ডার বাতিল হার</p>
                  <p className="text-2xl font-extrabold text-rose-600 mt-1">৩.৬%</p>
                  <span className="text-xs text-rose-500 font-semibold mt-1 inline-block">লোয়ার দেন ন্যাশনাল অ্যাভারেজ</span>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB: USERS & RBAC ===================== */}
          {activeTab === "users" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">টিম মেম্বার ও পারমিশন কন্ট্রোল</h3>
                  <p className="text-xs text-gray-500">গ্র্যানুলার রোল-বেসড অ্যাক্সেস কন্ট্রোল (RBAC)</p>
                </div>
                <button
                  onClick={() => setAddUserModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন স্টাফ যোগ করুন</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">ইউজারনেম</th>
                      <th className="py-3 px-4">রোল</th>
                      <th className="py-3 px-4">পারমিশন স্কোপ</th>
                      <th className="py-3 px-4">যোগদানের তারিখ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/50">
                        <td className="py-3.5 px-4 font-bold text-gray-900 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-orange-100 text-[#ff3f60] flex items-center justify-center font-bold text-xs">
                            {u.username[0].toUpperCase()}
                          </div>
                          <span>{u.username}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 capitalize">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {(u.permissions || []).map((perm: string, i: number) => (
                              <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px]">
                                {perm}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-gray-400">
                          {new Date(u.created_at).toLocaleDateString("bn-BD")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===================== MODALS ===================== */}

      {/* 1. Thermal POS Slip Modal */}
      {orderModalMode === "pos" && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative font-mono text-xs">
            <button
              onClick={() => setOrderModalMode(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <div id="pos-print-area" className="text-center border-b border-dashed border-gray-300 pb-4 mb-4">
              <h2 className="font-extrabold text-base tracking-widest">AL-SHIFA CARE</h2>
              <p className="text-[10px]">Natural Wellness & Pain Relief</p>
              <p className="text-[10px]">Hotline: {settingsData?.hotline_number || "01886367377"}</p>
              <div className="mt-2 text-left text-[11px] space-y-0.5">
                <p>ORDER: {selectedOrder.order_number}</p>
                <p>DATE: {new Date(selectedOrder.created_at).toLocaleString()}</p>
                <p>CUSTOMER: {selectedOrder.customer_name}</p>
                <p>PHONE: {selectedOrder.phone}</p>
                <p>ADDRESS: {selectedOrder.address}</p>
              </div>
            </div>
            <div className="border-b border-dashed border-gray-300 pb-3 mb-3 text-left">
              <div className="flex justify-between font-bold mb-1">
                <span>ITEM</span>
                <span>TOTAL</span>
              </div>
              <div className="flex justify-between">
                <span>Shifa Oil x{selectedOrder.quantity || 1}</span>
                <span>৳{selectedOrder.grand_total}</span>
              </div>
            </div>
            <div className="text-right font-extrabold text-sm mb-4">
              <p>TOTAL COD: ৳{selectedOrder.grand_total}</p>
            </div>
            <div className="text-center text-[10px] text-gray-500 mb-5">Thank you for your order!</div>
            <button
              onClick={() => window.print()}
              className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-black"
            >
              <Printer className="w-4 h-4" />
              <span>থার্মাল প্রিন্ট করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Standard A4 Invoice Modal */}
      {orderModalMode === "invoice" && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-2xl relative">
            <button
              onClick={() => setOrderModalMode(null)}
              className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">Al-Shifa Care</h2>
                <p className="text-xs text-gray-500">Official Invoice / চালান</p>
                <p className="text-xs text-gray-500 mt-1">হটলাইন: {settingsData?.hotline_number || "01886367377"}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">ইনভয়েস #</span>
                <p className="text-base font-extrabold text-gray-900">{selectedOrder.order_number}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  তারিখ: {new Date(selectedOrder.created_at).toLocaleDateString("bn-BD")}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6 text-xs">
              <div>
                <p className="font-bold text-gray-400 uppercase mb-1">বিল টু (গ্রাহক)</p>
                <p className="font-bold text-gray-900 text-sm">{selectedOrder.customer_name}</p>
                <p className="text-gray-600 mt-0.5">{selectedOrder.phone}</p>
                <p className="text-gray-600 mt-0.5">{selectedOrder.address}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-400 uppercase mb-1">পেমেন্ট মেথড</p>
                <p className="font-bold text-emerald-600 text-sm">Cash on Delivery (COD)</p>
                <p className="text-gray-500 mt-1">ডেলিভারি জেলা: {selectedOrder.district || "Dhaka"}</p>
              </div>
            </div>
            <table className="w-full text-left text-xs mb-6">
              <thead className="bg-gray-50 text-gray-500 border-y border-gray-200">
                <tr>
                  <th className="py-2.5 px-3">পণ্যের বিবরণ</th>
                  <th className="py-2.5 px-3 text-center">পরিমাণ</th>
                  <th className="py-2.5 px-3 text-right">মূল্য</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3 px-3 font-semibold text-gray-800">আল-শিফা প্রিমিয়াম হেয়ার অ্যান্ড বডি অয়েল</td>
                  <td className="py-3 px-3 text-center">{selectedOrder.quantity || 1}</td>
                  <td className="py-3 px-3 text-right font-bold">৳{selectedOrder.grand_total}</td>
                </tr>
              </tbody>
            </table>
            <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-6">
              <p className="text-xs text-gray-500">পণ্য হাতে পেয়ে চেক করে টাকা পরিশোধ করুন।</p>
              <div className="text-right">
                <span className="text-xs text-gray-500 mr-4">সর্বমোট প্রদেয়:</span>
                <span className="text-xl font-extrabold text-gray-900">৳{selectedOrder.grand_total}</span>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95"
            >
              <Printer className="w-4 h-4" />
              <span>A4 ইনভয়েস প্রিন্ট করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Courier Booking Modal */}
      {orderModalMode === "courier_book" && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setOrderModalMode(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-2">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">কুরিয়ারে চালান তৈরি করুন</h3>
              <p className="text-xs text-gray-500">অর্ডার #{selectedOrder.order_number}</p>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 mb-1.5">কুরিয়ার সার্ভিস বেছে নিন</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCourierProvider("steadfast")}
                    className={`p-3 rounded-xl border text-center font-bold ${
                      courierProvider === "steadfast"
                        ? "border-purple-600 bg-purple-50 text-purple-700"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    Steadfast Courier
                  </button>
                  <button
                    type="button"
                    onClick={() => setCourierProvider("pathao")}
                    className={`p-3 rounded-xl border text-center font-bold ${
                      courierProvider === "pathao"
                        ? "border-red-600 bg-red-50 text-red-700"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    Pathao Logistics
                  </button>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-gray-600">
                <p>গ্রাহক: {selectedOrder.customer_name}</p>
                <p>ফোন: {selectedOrder.phone}</p>
                <p>ঠিকানা: {selectedOrder.address}</p>
                <p className="font-bold text-gray-900">COD ক্যাশ কালেকশন: ৳{selectedOrder.grand_total}</p>
              </div>
              <button
                type="button"
                onClick={handleConfirmCourierBooking}
                disabled={isBookingShipment}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 disabled:opacity-50"
              >
                <Truck className="w-4 h-4" />
                <span>{isBookingShipment ? "চালান তৈরি হচ্ছে..." : "বুকিং নিশ্চিত করুন"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Manual Order Add Modal */}
      {orderModalMode === "add" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setOrderModalMode(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-gray-900 text-base mb-4">নতুন ম্যানুয়াল অর্ডার এন্ট্রি</h3>
            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 mb-1">গ্রাহকের নাম *</label>
                <input
                  type="text"
                  required
                  value={newOrderForm.customer_name}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customer_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-1 focus:ring-[#ff3f60]"
                  placeholder="যেমন: মো. করিম হাসান"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">ফোন নাম্বার *</label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.phone}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-1 focus:ring-[#ff3f60]"
                    placeholder="017XXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">ডেলিভারি জেলা</label>
                  <input
                    type="text"
                    value={newOrderForm.district}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-1 focus:ring-[#ff3f60]"
                    placeholder="ঢাকা"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-gray-600 mb-1">পূর্ণাঙ্গ ঠিকানা *</label>
                <textarea
                  required
                  rows={2}
                  value={newOrderForm.address}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-1 focus:ring-[#ff3f60]"
                  placeholder="বাড়ি, রোড, এলাকা, থানা..."
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">পরিমাণ</label>
                  <input
                    type="number"
                    min={1}
                    value={newOrderForm.quantity}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">মূল্য (৳)</label>
                  <input
                    type="number"
                    value={newOrderForm.price}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">ডেলিভারি চার্জ</label>
                  <input
                    type="number"
                    value={newOrderForm.delivery_charge}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, delivery_charge: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white font-bold text-xs shadow-md mt-2"
              >
                অর্ডার সেভ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Product Add / Edit Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setProductModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-gray-900 text-base mb-4">
              {editingProduct ? "প্রোডাক্ট এডিট করুন" : "নতুন প্রোডাক্ট যোগ করুন"}
            </h3>
            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 mb-1">প্রোডাক্টের নাম (বাংলা) *</label>
                <input
                  type="text"
                  required
                  value={productForm.name_primary}
                  onChange={(e) => setProductForm({ ...productForm, name_primary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">ইংলিশ নাম</label>
                  <input
                    type="text"
                    value={productForm.name_secondary}
                    onChange={(e) => setProductForm({ ...productForm, name_secondary: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">প্রোডাক্ট কোড</label>
                  <input
                    type="text"
                    value={productForm.code}
                    onChange={(e) => setProductForm({ ...productForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">বিক্রয় মূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">আসল মূল্য (৳)</label>
                  <input
                    type="number"
                    value={productForm.original_price}
                    onChange={(e) => setProductForm({ ...productForm, original_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">স্টক পরিমাণ</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-gray-600 mb-1">বিবরণ</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white font-bold text-xs shadow-md mt-2"
              >
                সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. Stock Adjust Modal */}
      {stockAdjustModal && selectedProductForAdjust && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setStockAdjustModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-gray-900 text-base mb-1">স্টক অ্যাডজাস্টমেন্ট</h3>
            <p className="text-xs text-gray-500 mb-4">{selectedProductForAdjust.name_primary}</p>
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 mb-1">ট্রানজ্যাকশন টাইপ</label>
                <select
                  value={stockAdjustType}
                  onChange={(e) => setStockAdjustType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-semibold"
                >
                  <option value="Stock In">স্টক ইন (+ যোগ)</option>
                  <option value="Return">রিটার্ন ইন (+ যোগ)</option>
                  <option value="Damage">ড্যামেজ (- বিয়োগ)</option>
                  <option value="Audit">ম্যানুয়াল অ্যাডজাস্ট</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-600 mb-1">পরিমাণ</label>
                <input
                  type="number"
                  min={1}
                  value={stockAdjustQty}
                  onChange={(e) => setStockAdjustQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-600 mb-1">রেফারেন্স বা কারণ</label>
                <input
                  type="text"
                  value={stockAdjustRef}
                  onChange={(e) => setStockAdjustRef(e.target.value)}
                  placeholder="যেমন: নতুন চালান রিসিভ"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>
              <button
                type="button"
                onClick={handleConfirmStockAdjust}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md mt-2"
              >
                স্টক আপডেট ও লগ এন্ট্রি
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Add Staff Modal */}
      {addUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setAddUserModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-gray-900 text-base mb-4">নতুন টিম মেম্বার যোগ করুন</h3>
            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 mb-1">ইউজারনেম *</label>
                <input
                  type="text"
                  required
                  value={newUserForm.username}
                  onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  placeholder="staff_rahim"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-600 mb-1">পাসওয়ার্ড *</label>
                <input
                  type="password"
                  required
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-600 mb-1">রোল</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-semibold"
                >
                  <option value="moderator">মডারেটর (অর্ডার ম্যানেজমেন্ট)</option>
                  <option value="manager">ম্যানেজার (সবকিছু এক্সেপ্ট সেটিংস)</option>
                  <option value="superadmin">সুপার এডমিন (ফুল এক্সেস)</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white font-bold text-xs shadow-md mt-2"
              >
                ইউজার তৈরি করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
