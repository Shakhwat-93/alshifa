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
  ShieldAlert,
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
  const [orderModalMode, setOrderModalMode] = useState<"view" | "edit" | "add" | "invoice" | "pos" | "courier_book" | "courier_fraud" | null>(null);
  const [checkingCourierId, setCheckingCourierId] = useState<string | null>(null);

  // Staff & Status Filter States
  const [staffList, setStaffList] = useState<string[]>([
    "Aminur",
    "Asraful",
    "Bisnu",
    "Habib",
    "Rohim",
    "Mizanur",
  ]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const [manageStaffModalOpen, setManageStaffModalOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");

  // New Order Form State
  const [newOrderForm, setNewOrderForm] = useState({
    customer_name: "",
    phone: "",
    address: "",
    district: "Dhaka",
    product_name: "শিফা পেইন কেয়ার অয়েল",
    quantity: 1,
    price: 950,
    delivery_charge: 60,
    note: "",
    status: "processing",
    assigned_to: "",
  });

  // Edit Order Form State
  const [editOrderForm, setEditOrderForm] = useState<any>({
    id: "",
    order_number: "",
    customer_name: "",
    phone: "",
    address: "",
    district: "Dhaka",
    status: "processing",
    assigned_to: "",
    product_name: "শিফা পেইন কেয়ার অয়েল",
    selected_variant: "",
    quantity: 1,
    price: 950,
    subtotal: 950,
    delivery_charge: 60,
    discount_amount: 0,
    grand_total: 1010,
    note: "",
    steadfast_consignment_id: "",
    steadfast_tracking_code: "",
    pathao_consignment_id: "",
  });
  const [isSavingOrder, setIsSavingOrder] = useState(false);

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
  const [creatingUser, setCreatingUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    username: "",
    password: "",
    role: "moderator",
    permissions: ["orders", "products"] as string[],
  });
  const [editUserModal, setEditUserModal] = useState(false);
  const [editUserForm, setEditUserForm] = useState({
    id: "",
    username: "",
    password: "",
    role: "moderator",
    permissions: [] as string[],
  });
  const [savingUserEdit, setSavingUserEdit] = useState(false);
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [deletingUser, setDeletingUser] = useState(false);
  const [userToast, setUserToast] = useState<{ text: string; type: "success" | "error" } | null>(null);

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
        if (Array.isArray(data.settings?.staff_list) && data.settings.staff_list.length > 0) {
          setStaffList(data.settings.staff_list);
        }

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
    const totalOrders = orders.filter((o) => o.status !== "trash").length;
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled" && o.status !== "fake" && o.status !== "trash")
      .reduce((sum, o) => sum + (Number(o.grand_total) || 0), 0);

    const todayStr = new Date().toISOString().split("T")[0];
    const todayOrders = orders.filter((o) => o.status !== "trash" && (o.created_at || "").startsWith(todayStr)).length;
    const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing").length;
    const deliveredOrders = orders.filter((o) => o.status === "delivered" || o.status === "completed").length;
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

  // ==================== STATUS COUNTS (WooCommerce Standard Hierarchy) ====================
  const orderCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: 0,
      processing: 0,
      on_hold: 0,
      completed: 0,
      cancelled: 0,
      refunded: 0,
      failed: 0,
      trash: 0,
    };
    staffList.forEach((st) => {
      counts[st.toLowerCase()] = 0;
    });

    orders.forEach((o) => {
      const st = (o.status || "").toLowerCase();
      const assigned = (o.assigned_to || "").toLowerCase();

      if (st === "trash") {
        counts.trash = (counts.trash || 0) + 1;
        return;
      }

      // Non-trash orders are counted in "All"
      counts.all = (counts.all || 0) + 1;

      // Check if order belongs to a staff member
      const matchedStaff = staffList.find(
        (staff) => staff.toLowerCase() === st || staff.toLowerCase() === assigned
      );

      if (matchedStaff) {
        const key = matchedStaff.toLowerCase();
        counts[key] = (counts[key] || 0) + 1;
      } else if (st === "processing" || st === "pending") {
        counts.processing = (counts.processing || 0) + 1;
      } else if (st === "on-hold" || st === "on_hold") {
        counts.on_hold = (counts.on_hold || 0) + 1;
      } else if (st === "completed" || st === "delivered" || st === "shipped") {
        counts.completed = (counts.completed || 0) + 1;
      } else if (st === "cancelled" || st === "fake") {
        counts.cancelled = (counts.cancelled || 0) + 1;
      } else if (st === "refunded") {
        counts.refunded = (counts.refunded || 0) + 1;
      } else if (st === "failed") {
        counts.failed = (counts.failed || 0) + 1;
      } else {
        counts.processing = (counts.processing || 0) + 1;
      }
    });

    return counts;
  }, [orders, staffList]);

  // ==================== ORDERS FILTERING ====================
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const st = (o.status || "").toLowerCase();
      const assigned = (o.assigned_to || "").toLowerCase();
      const currentFilter = orderStatusFilter.toLowerCase();

      let matchStatus = false;
      if (currentFilter === "all") {
        matchStatus = st !== "trash";
      } else if (currentFilter === "trash") {
        matchStatus = st === "trash";
      } else if (currentFilter === "processing") {
        matchStatus =
          (st === "processing" || st === "pending") &&
          !staffList.some(
            (s) => s.toLowerCase() === st || s.toLowerCase() === assigned
          );
      } else if (currentFilter === "on_hold" || currentFilter === "on-hold") {
        matchStatus =
          (st === "on-hold" || st === "on_hold") &&
          !staffList.some(
            (s) => s.toLowerCase() === st || s.toLowerCase() === assigned
          );
      } else if (currentFilter === "completed") {
        matchStatus =
          (st === "completed" || st === "delivered" || st === "shipped") &&
          !staffList.some(
            (s) => s.toLowerCase() === st || s.toLowerCase() === assigned
          );
      } else if (currentFilter === "cancelled") {
        matchStatus =
          (st === "cancelled" || st === "fake") &&
          !staffList.some(
            (s) => s.toLowerCase() === st || s.toLowerCase() === assigned
          );
      } else if (currentFilter === "refunded") {
        matchStatus =
          st === "refunded" &&
          !staffList.some(
            (s) => s.toLowerCase() === st || s.toLowerCase() === assigned
          );
      } else if (currentFilter === "failed") {
        matchStatus =
          st === "failed" &&
          !staffList.some(
            (s) => s.toLowerCase() === st || s.toLowerCase() === assigned
          );
      } else {
        // Staff filter
        matchStatus = st === currentFilter || assigned === currentFilter;
      }

      const search = (orderSearchTerm || globalSearch).toLowerCase().trim();
      const matchSearch =
        !search ||
        (o.order_number || "").toLowerCase().includes(search) ||
        (o.customer_name || "").toLowerCase().includes(search) ||
        (o.phone || "").toLowerCase().includes(search) ||
        (o.address || "").toLowerCase().includes(search) ||
        (o.assigned_to || "").toLowerCase().includes(search);

      return matchStatus && matchSearch;
    });
  }, [orders, orderStatusFilter, staffList, orderSearchTerm, globalSearch]);

  // Update order status quick action or staff assignment
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const matchedStaff = staffList.find(
        (s) => s.toLowerCase() === newStatus.toLowerCase()
      );
      const updates: any = { id: orderId, status: newStatus };
      if (matchedStaff) {
        updates.assigned_to = matchedStaff;
      } else if (newStatus === "processing") {
        updates.assigned_to = null;
      }

      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
        );
        if (soundEnabled) playNotificationChime();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMoveToTrash = async (orderId: string) => {
    await handleUpdateOrderStatus(orderId, "trash");
  };

  const handleRestoreOrder = async (orderId: string) => {
    await handleUpdateOrderStatus(orderId, "processing");
  };

  // Bulk Actions
  const handleApplyBulkAction = async () => {
    if (selectedOrderIds.length === 0 || !bulkAction) return;

    try {
      if (bulkAction === "trash") {
        const res = await fetch("/api/admin/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedOrderIds, status: "trash" }),
        });
        if (res.ok) {
          setOrders((prev) =>
            prev.map((o) =>
              selectedOrderIds.includes(o.id) ? { ...o, status: "trash" } : o
            )
          );
          setSelectedOrderIds([]);
          setBulkAction("");
          if (soundEnabled) playNotificationChime();
        }
      } else if (bulkAction === "restore") {
        const res = await fetch("/api/admin/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedOrderIds, status: "processing" }),
        });
        if (res.ok) {
          setOrders((prev) =>
            prev.map((o) =>
              selectedOrderIds.includes(o.id) ? { ...o, status: "processing" } : o
            )
          );
          setSelectedOrderIds([]);
          setBulkAction("");
          if (soundEnabled) playNotificationChime();
        }
      } else if (bulkAction === "delete_permanently") {
        if (
          !confirm(
            `আপনি কি নিশ্চিতভাবে নির্বাচিত ${selectedOrderIds.length}টি অর্ডার স্থায়ীভাবে ডিলিট করতে চান?`
          )
        )
          return;
        const res = await fetch(`/api/admin/orders?ids=${selectedOrderIds.join(",")}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setOrders((prev) =>
            prev.filter((o) => !selectedOrderIds.includes(o.id))
          );
          setSelectedOrderIds([]);
          setBulkAction("");
        }
      } else if (bulkAction.startsWith("assign_")) {
        const staffName = bulkAction.replace("assign_", "");
        const res = await fetch("/api/admin/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ids: selectedOrderIds,
            status: staffName.toLowerCase(),
            assigned_to: staffName,
          }),
        });
        if (res.ok) {
          setOrders((prev) =>
            prev.map((o) =>
              selectedOrderIds.includes(o.id)
                ? { ...o, status: staffName.toLowerCase(), assigned_to: staffName }
                : o
            )
          );
          setSelectedOrderIds([]);
          setBulkAction("");
          if (soundEnabled) playNotificationChime();
        }
      } else {
        const res = await fetch("/api/admin/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedOrderIds, status: bulkAction }),
        });
        if (res.ok) {
          setOrders((prev) =>
            prev.map((o) =>
              selectedOrderIds.includes(o.id) ? { ...o, status: bulkAction } : o
            )
          );
          setSelectedOrderIds([]);
          setBulkAction("");
          if (soundEnabled) playNotificationChime();
        }
      }
    } catch (e) {
      console.error("Bulk action failed:", e);
    }
  };

  // Staff Management
  const handleAddStaff = async () => {
    const trimmed = newStaffName.trim();
    if (!trimmed) return;
    if (staffList.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      alert("এই নামের স্টাফ ইতিমধ্যে তালিকায় রয়েছে।");
      return;
    }
    const updated = [...staffList, trimmed];
    setStaffList(updated);
    setNewStaffName("");
    try {
      await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staff_list: updated }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveStaff = async (nameToRemove: string) => {
    if (!confirm(`আপনি কি "${nameToRemove}" কে স্টাফ তালিকা থেকে মুছে ফেলতে চান?`)) return;
    const updated = staffList.filter((s) => s !== nameToRemove);
    setStaffList(updated);
    try {
      await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staff_list: updated }),
      });
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
          product_name: "শিফা পেইন কেয়ার অয়েল",
          quantity: 1,
          price: 950,
          delivery_charge: 60,
          note: "",
          status: "processing",
          assigned_to: "",
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

  // Open Edit Order Modal
  const handleOpenEditOrderModal = (order: any) => {
    setSelectedOrder(order);
    const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
    const qty = firstItem ? Number(firstItem.quantity) || 1 : 1;
    const unitPrice = firstItem ? Number(firstItem.price) || 950 : 950;
    const sub = order.subtotal !== undefined && order.subtotal !== null ? Number(order.subtotal) : qty * unitPrice;
    const delCharge = order.delivery_charge !== undefined && order.delivery_charge !== null ? Number(order.delivery_charge) : 60;
    const disc = order.discount_amount !== undefined && order.discount_amount !== null ? Number(order.discount_amount) : 0;
    const grand = order.grand_total !== undefined && order.grand_total !== null ? Number(order.grand_total) : sub + delCharge - disc;

    setEditOrderForm({
      id: order.id,
      order_number: order.order_number,
      customer_name: order.customer_name || "",
      phone: order.phone || "",
      address: order.address || "",
      district: order.district || "Dhaka",
      status: order.status || "processing",
      assigned_to: order.assigned_to || "",
      product_name: firstItem?.product_name || "শিফা পেইন কেয়ার অয়েল",
      selected_variant: firstItem?.selected_variant || "",
      quantity: qty,
      price: unitPrice,
      subtotal: sub,
      delivery_charge: delCharge,
      discount_amount: disc,
      grand_total: grand,
      note: order.note || "",
      steadfast_consignment_id: order.steadfast_consignment_id || "",
      steadfast_tracking_code: order.steadfast_tracking_code || "",
      pathao_consignment_id: order.pathao_consignment_id || "",
    });
    setOrderModalMode("edit");
  };

  // Save Edited Order to Database
  const handleSaveEditOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editOrderForm.id) return;
    setIsSavingOrder(true);

    try {
      const qty = Math.max(1, Number(editOrderForm.quantity) || 1);
      const unitPrice = Number(editOrderForm.price) || 0;
      const sub = Number(editOrderForm.subtotal) || qty * unitPrice;
      const delCharge = Number(editOrderForm.delivery_charge) || 0;
      const disc = Number(editOrderForm.discount_amount) || 0;
      const total = Number(editOrderForm.grand_total) || sub + delCharge - disc;

      // Check if status is a staff name
      const matchedStaff = staffList.find(
        (s) => s.toLowerCase() === (editOrderForm.status || "").toLowerCase()
      );
      const finalAssigned = matchedStaff || (editOrderForm.assigned_to ? editOrderForm.assigned_to : null);

      const payload: any = {
        id: editOrderForm.id,
        order_number: editOrderForm.order_number ? editOrderForm.order_number.trim() : undefined,
        customer_name: editOrderForm.customer_name.trim(),
        phone: editOrderForm.phone.trim(),
        address: editOrderForm.address.trim(),
        district: editOrderForm.district.trim(),
        status: editOrderForm.status,
        assigned_to: finalAssigned,
        subtotal: sub,
        delivery_charge: delCharge,
        discount_amount: disc,
        grand_total: total,
        note: editOrderForm.note || null,
        steadfast_consignment_id: editOrderForm.steadfast_consignment_id || null,
        steadfast_tracking_code: editOrderForm.steadfast_tracking_code || null,
        pathao_consignment_id: editOrderForm.pathao_consignment_id || null,
        items: [
          {
            product_name: editOrderForm.product_name,
            selected_variant: editOrderForm.selected_variant || null,
            quantity: qty,
            price: unitPrice,
          },
        ],
      };

      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) =>
          prev.map((o) => (o.id === data.order.id ? { ...o, ...data.order } : o))
        );
        setOrderModalMode(null);
        setUserToast({
          text: `অর্ডার (${data.order.order_number || editOrderForm.order_number}) এর সকল তথ্য সফলভাবে সংরক্ষিত হয়েছে!`,
          type: "success",
        });
        setTimeout(() => setUserToast(null), 3500);
        if (soundEnabled) playNotificationChime();
      } else {
        alert(data.error || "অর্ডার আপডেট করতে সমস্যা হয়েছে।");
      }
    } catch (err) {
      console.error("Save edit order failed:", err);
      alert("সার্ভার সমস্যা হয়েছে।");
    } finally {
      setIsSavingOrder(false);
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

  // ==================== BDCOURIER FRAUD CHECK ====================
  const handleCheckBDCourier = async (orderId: string, phone: string) => {
    if (!phone) {
      alert("অর্ডারে কোনো ফোন নাম্বার পাওয়া যায়নি।");
      return;
    }
    setCheckingCourierId(orderId);
    try {
      const res = await fetch("/api/admin/bdcourier-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, phone }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, courier_ratio_data: data.data } : o
          )
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev: any) => ({ ...prev, courier_ratio_data: data.data }));
        }
        if (soundEnabled) playNotificationChime();
      } else {
        alert(data.error || "BDCourier ফ্রড চেক ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      console.error("BDCourier check failed:", err);
      alert("সার্ভার কানেকশন ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setCheckingCourierId(null);
    }
  };

  // ==================== PRODUCT ACTIONS ====================
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        id: editingProduct?.id,
        price: Number(productForm.price) || 0,
        original_price: Number(productForm.original_price) || 0,
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
        if (payload.id) {
          setProducts((prev) =>
            prev.map((p) => (p.id === payload.id ? { ...p, ...payload } : p))
          );
        }
        fetchAllData();
        if (soundEnabled) playNotificationChime();
        setUserToast({
          text: `পণ্য ও মূল্য (৳${payload.price}) সফলভাবে সংরক্ষণ করা হয়েছে! ল্যান্ডিং পেজে লাইভ হয়েছে।`,
          type: "success",
        });
        setTimeout(() => setUserToast(null), 3500);
      } else {
        setUserToast({ text: data.error || "পণ্য সংরক্ষণ করতে সমস্যা হয়েছে", type: "error" });
        setTimeout(() => setUserToast(null), 3500);
      }
    } catch (e) {
      console.error(e);
      setUserToast({ text: "সার্ভার এরর, আবার চেষ্টা করুন", type: "error" });
      setTimeout(() => setUserToast(null), 3500);
    }
  };

  const handleQuickUpdatePrice = async (prodId: string, newPrice: number, newOriginalPrice?: number) => {
    try {
      const payload: any = {
        id: prodId,
        price: Number(newPrice) || 0,
      };
      if (newOriginalPrice !== undefined) {
        payload.original_price = Number(newOriginalPrice) || 0;
      }
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === prodId ? { ...p, ...payload } : p))
        );
        fetchAllData();
        if (soundEnabled) playNotificationChime();
        setUserToast({
          text: `পণ্যের মূল্য সফলভাবে ৳${payload.price}-তে আপডেট হয়েছে! ল্যান্ডিং পেজে লাইভ।`,
          type: "success",
        });
        setTimeout(() => setUserToast(null), 3500);
      } else {
        setUserToast({ text: data.error || "মূল্য আপডেট করতে ব্যর্থ হয়েছে", type: "error" });
        setTimeout(() => setUserToast(null), 3500);
      }
    } catch (err) {
      console.error(err);
      setUserToast({ text: "সার্ভার এরর", type: "error" });
      setTimeout(() => setUserToast(null), 3500);
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

  // ==================== RBAC & ADMIN USERS CRUD ====================
  const AVAILABLE_RBAC_PERMISSIONS = [
    { id: "dashboard", label: "ড্যাশবোর্ড (Dashboard)" },
    { id: "orders", label: "অর্ডারস (Orders)" },
    { id: "products", label: "প্রোডাক্টস (Products)" },
    { id: "inventory", label: "ইনভেন্টরি (Inventory)" },
    { id: "courier", label: "কুরিয়ার ও ফ্রড (Courier)" },
    { id: "inbox", label: "ইনবক্স ও চ্যাট (Inbox)" },
    { id: "landing", label: "ল্যান্ডিং পেজ (Landing)" },
    { id: "pages", label: "কাস্টম পেজ (Pages)" },
    { id: "reports", label: "রিপোর্টস (Reports)" },
    { id: "users", label: "টিম মেম্বার (Users)" },
    { id: "settings", label: "স্টোর সেটিংস (Settings)" },
  ];

  const getRolePresetPermissions = (role: string): string[] => {
    if (role === "superadmin") {
      return AVAILABLE_RBAC_PERMISSIONS.map((p) => p.id);
    }
    if (role === "manager") {
      return ["dashboard", "orders", "products", "inventory", "courier", "inbox", "landing", "pages", "reports"];
    }
    return ["orders", "products"];
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.username.trim() || !newUserForm.password) {
      alert("ইউজারনেম এবং পাসওয়ার্ড দিন!");
      return;
    }
    setCreatingUser(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserForm),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setAdminUsers((prev) => [...prev, data.user]);
        setAddUserModal(false);
        setNewUserForm({
          username: "",
          password: "",
          role: "moderator",
          permissions: ["orders", "products"],
        });
        setUserToast({ text: "নতুন টিম মেম্বার সফলভাবে যুক্ত করা হয়েছে!", type: "success" });
        setTimeout(() => setUserToast(null), 3000);
        if (soundEnabled) playNotificationChime();
      } else {
        alert(data.error || "ইউজার তৈরি করতে সমস্যা হয়েছে");
      }
    } catch (e) {
      console.error(e);
      alert("সার্ভার এরর: ইউজার তৈরি করা যায়নি");
    } finally {
      setCreatingUser(false);
    }
  };

  const handleOpenEditUser = (u: any) => {
    setEditUserForm({
      id: u.id,
      username: u.username || "",
      password: "",
      role: u.role || "moderator",
      permissions: Array.isArray(u.permissions) ? [...u.permissions] : [],
    });
    setEditUserModal(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUserForm.id) return;
    if (!editUserForm.username.trim()) {
      alert("ইউজারনেম দিন!");
      return;
    }
    setSavingUserEdit(true);
    try {
      const payload: Record<string, any> = {
        id: editUserForm.id,
        username: editUserForm.username.trim(),
        role: editUserForm.role,
        permissions: editUserForm.permissions,
      };
      if (editUserForm.password && editUserForm.password.trim().length > 0) {
        payload.password = editUserForm.password.trim();
      }
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setAdminUsers((prev) =>
          prev.map((user) => (user.id === data.user.id ? data.user : user))
        );
        // Also update currentUser in state if editing own profile
        if (currentUser?.id === data.user.id || currentUser?.username === editUserForm.username) {
          const updatedCurr = { ...currentUser, ...data.user };
          setCurrentUser(updatedCurr);
          localStorage.setItem("alshifa_admin_user", JSON.stringify(updatedCurr));
        }
        setEditUserModal(false);
        setUserToast({ text: "টিম মেম্বার তথ্য সফলভাবে আপডেট হয়েছে!", type: "success" });
        setTimeout(() => setUserToast(null), 3000);
        if (soundEnabled) playNotificationChime();
      } else {
        alert(data.error || "ইউজার আপডেট করতে সমস্যা হয়েছে");
      }
    } catch (err) {
      console.error(err);
      alert("সার্ভার এরর: ইউজার আপডেট করা সম্ভব হয়নি");
    } finally {
      setSavingUserEdit(false);
    }
  };

  const handleOpenDeleteUser = (u: any) => {
    if (currentUser?.username === u.username) {
      alert("আপনি আপনার নিজের অ্যাকাউন্ট ডিলিট করতে পারবেন না!");
      return;
    }
    setUserToDelete(u);
    setDeleteUserModal(true);
  };

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete?.id) return;
    setDeletingUser(true);
    try {
      const res = await fetch(`/api/admin/users?id=${userToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setAdminUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
        setDeleteUserModal(false);
        setUserToDelete(null);
        setUserToast({ text: "ইউজার সফলভাবে মুছে ফেলা হয়েছে!", type: "success" });
        setTimeout(() => setUserToast(null), 3000);
        if (soundEnabled) playNotificationChime();
      } else {
        alert(data.error || "ইউজার ডিলিট করা যায়নি");
      }
    } catch (err) {
      console.error(err);
      alert("সার্ভার এরর: ইউজার ডিলিট করা সম্ভব হয়নি");
    } finally {
      setDeletingUser(false);
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
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-35 md:hidden transition-opacity cursor-pointer"
          aria-hidden="true"
        />
      )}

      {/* ===================== SIDEBAR ===================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
          sidebarCollapsed ? "w-20" : "w-64"
        } ${mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Brand Header */}
        <div className="h-16 sm:h-18 px-4 sm:px-5 border-b border-gray-100 flex items-center justify-between">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#ff3f60] to-[#ff783e] text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-md shadow-orange-500/20">
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
            className="hidden md:flex text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-gray-400 hover:text-gray-600 p-1.5 rounded-lg cursor-pointer"
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
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
              className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer"
              title="লগআউট"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ===================== MAIN CONTENT WRAPPER ===================== */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 min-w-0 ${sidebarCollapsed ? "md:pl-20" : "md:pl-64"}`}>
        {/* Top Navbar */}
        <header className="h-16 sm:h-18 bg-white border-b border-gray-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 shrink-0 cursor-pointer"
              aria-label="মেনু খুলুন"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative flex-1 min-w-0 max-w-[190px] sm:max-w-xs md:max-w-md">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="অর্ডার, ফোন বা প্রোডাক্ট খুঁজুন..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff3f60] text-xs bg-gray-50/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Audio Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playNotificationChime();
              }}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
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
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
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
              className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:opacity-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">নতুন অর্ডার</span>
            </button>

            {/* Storefront Link */}
            <Link
              href="/"
              target="_blank"
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
              title="লাইভ সাইট দেখুন"
            >
              <span className="hidden sm:inline">লাইভ সাইট</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </Link>
          </div>
        </header>

        {/* Global Toast */}
        {landingSavedToast && (
          <div className="fixed top-20 right-4 sm:right-6 z-50 bg-emerald-600 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-lg flex items-center gap-2 text-xs sm:text-sm font-medium animate-bounce max-w-[90vw]">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>ল্যান্ডিং পেজের সকল পরিবর্তন সফলভাবে সংরক্ষিত ও লাইভ হয়েছে!</span>
          </div>
        )}
        {settingsSavedToast && (
          <div className="fixed top-20 right-4 sm:right-6 z-50 bg-emerald-600 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-lg flex items-center gap-2 text-xs sm:text-sm font-medium animate-bounce max-w-[90vw]">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>স্টোর সেটিংস সফলভাবে সংরক্ষিত হয়েছে!</span>
          </div>
        )}
        {userToast && (
          <div
            className={`fixed top-20 right-4 sm:right-6 z-50 ${
              userToast.type === "error" ? "bg-rose-600" : "bg-emerald-600"
            } text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-lg flex items-center gap-2 text-xs sm:text-sm font-medium animate-bounce max-w-[90vw]`}
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{userToast.text}</span>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-5 md:p-6 lg:p-8 max-w-7xl w-full mx-auto min-w-0">
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
                    <table className="w-full text-left text-xs min-w-[520px]">
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
            <div className="space-y-4">
              {/* WordPress / WooCommerce Style Header */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Title & Add Order Button */}
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
                    <button
                      onClick={() => {
                        setSelectedOrder(null);
                        setOrderModalMode("add");
                      }}
                      className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add order</span>
                    </button>
                  </div>

                  {/* Right side tools */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => setManageStaffModalOpen(true)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      title="স্টাফ ও এজেন্ট তালিকা পরিচালনা করুন"
                    >
                      <Users className="w-3.5 h-3.5 text-gray-500" />
                      <span className="hidden sm:inline">Manage Staff</span>
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-gray-500" />
                      <span>CSV</span>
                    </button>
                  </div>
                </div>

                {/* WooCommerce Subsubsub Status Filter Links (All | Processing | On hold | Completed | Cancelled | Refunded | Failed | Staff... | Trash) */}
                <div className="flex items-center gap-1.5 text-xs sm:text-[13px] pt-1 border-t border-gray-100 overflow-x-auto pb-1.5 scrollbar-none whitespace-nowrap">
                  {/* All */}
                  <button
                    onClick={() => setOrderStatusFilter("all")}
                    className={`cursor-pointer transition-colors whitespace-nowrap px-1 py-0.5 rounded ${
                      orderStatusFilter === "all"
                        ? "font-bold text-gray-900 underline decoration-2 underline-offset-4"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    All <span className="text-gray-500 font-normal">({orderCounts.all || 0})</span>
                  </button>
                  <span className="text-gray-300 mx-0.5 select-none font-light">|</span>

                  {/* Processing */}
                  <button
                    onClick={() => setOrderStatusFilter("processing")}
                    className={`cursor-pointer transition-colors whitespace-nowrap px-1 py-0.5 rounded ${
                      orderStatusFilter === "processing"
                        ? "font-bold text-emerald-700 underline decoration-2 underline-offset-4"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    Processing <span className="text-gray-500 font-normal">({orderCounts.processing || 0})</span>
                  </button>
                  <span className="text-gray-300 mx-0.5 select-none font-light">|</span>

                  {/* On hold */}
                  <button
                    onClick={() => setOrderStatusFilter("on_hold")}
                    className={`cursor-pointer transition-colors whitespace-nowrap px-1 py-0.5 rounded ${
                      orderStatusFilter === "on_hold" || orderStatusFilter === "on-hold"
                        ? "font-bold text-amber-700 underline decoration-2 underline-offset-4"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    On hold <span className="text-gray-500 font-normal">({orderCounts.on_hold || 0})</span>
                  </button>
                  <span className="text-gray-300 mx-0.5 select-none font-light">|</span>

                  {/* Completed */}
                  <button
                    onClick={() => setOrderStatusFilter("completed")}
                    className={`cursor-pointer transition-colors whitespace-nowrap px-1 py-0.5 rounded ${
                      orderStatusFilter === "completed"
                        ? "font-bold text-blue-800 underline decoration-2 underline-offset-4"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    Completed <span className="text-gray-500 font-normal">({orderCounts.completed || 0})</span>
                  </button>
                  <span className="text-gray-300 mx-0.5 select-none font-light">|</span>

                  {/* Cancelled */}
                  <button
                    onClick={() => setOrderStatusFilter("cancelled")}
                    className={`cursor-pointer transition-colors whitespace-nowrap px-1 py-0.5 rounded ${
                      orderStatusFilter === "cancelled"
                        ? "font-bold text-rose-700 underline decoration-2 underline-offset-4"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    Cancelled <span className="text-gray-500 font-normal">({orderCounts.cancelled || 0})</span>
                  </button>
                  <span className="text-gray-300 mx-0.5 select-none font-light">|</span>

                  {/* Refunded */}
                  <button
                    onClick={() => setOrderStatusFilter("refunded")}
                    className={`cursor-pointer transition-colors whitespace-nowrap px-1 py-0.5 rounded ${
                      orderStatusFilter === "refunded"
                        ? "font-bold text-purple-700 underline decoration-2 underline-offset-4"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    Refunded <span className="text-gray-500 font-normal">({orderCounts.refunded || 0})</span>
                  </button>
                  <span className="text-gray-300 mx-0.5 select-none font-light">|</span>

                  {/* Failed */}
                  <button
                    onClick={() => setOrderStatusFilter("failed")}
                    className={`cursor-pointer transition-colors whitespace-nowrap px-1 py-0.5 rounded ${
                      orderStatusFilter === "failed"
                        ? "font-bold text-red-700 underline decoration-2 underline-offset-4"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    Failed <span className="text-gray-500 font-normal">({orderCounts.failed || 0})</span>
                  </button>
                  <span className="text-gray-300 mx-0.5 select-none font-light">|</span>

                  {/* Staff / Agent Tabs (Aminur, Asraful, Bisnu, Habib, Rohim, Mizanur, etc.) */}
                  {staffList.map((staffName) => {
                    const key = staffName.toLowerCase();
                    return (
                      <React.Fragment key={key}>
                        <button
                          onClick={() => setOrderStatusFilter(key)}
                          className={`cursor-pointer transition-colors whitespace-nowrap px-1 py-0.5 rounded ${
                            orderStatusFilter === key
                              ? "font-bold text-indigo-700 underline decoration-2 underline-offset-4"
                              : "text-blue-600 hover:text-blue-800"
                          }`}
                        >
                          {staffName} <span className="text-gray-500 font-normal">({orderCounts[key] || 0})</span>
                        </button>
                        <span className="text-gray-300 mx-0.5 select-none font-light">|</span>
                      </React.Fragment>
                    );
                  })}

                  {/* Trash */}
                  <button
                    onClick={() => setOrderStatusFilter("trash")}
                    className={`cursor-pointer transition-colors whitespace-nowrap px-1 py-0.5 rounded ${
                      orderStatusFilter === "trash"
                        ? "font-bold text-gray-900 underline decoration-2 underline-offset-4"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    Trash <span className="text-gray-500 font-normal">({orderCounts.trash || 0})</span>
                  </button>
                </div>

                {/* Bulk Actions & Search Toolbar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                    <select
                      value={bulkAction}
                      onChange={(e) => setBulkAction(e.target.value)}
                      className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-gray-700 min-w-[130px]"
                    >
                      <option value="">Bulk actions</option>
                      {orderStatusFilter === "trash" ? (
                        <>
                          <option value="restore">Restore</option>
                          <option value="delete_permanently">Delete permanently</option>
                        </>
                      ) : (
                        <>
                          <option value="trash">Move to Trash</option>
                          <option value="processing">Change status to Processing</option>
                          <option value="on-hold">Change status to On hold</option>
                          <option value="completed">Change status to Completed</option>
                          <option value="cancelled">Change status to Cancelled</option>
                          <option value="refunded">Change status to Refunded</option>
                          <option value="failed">Change status to Failed</option>
                          <optgroup label="── Assign to Staff ──">
                            {staffList.map((staff) => (
                              <option key={staff} value={`assign_${staff}`}>
                                Assign to {staff}
                              </option>
                            ))}
                          </optgroup>
                        </>
                      )}
                    </select>
                    <button
                      onClick={handleApplyBulkAction}
                      disabled={!bulkAction || selectedOrderIds.length === 0}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                        !bulkAction || selectedOrderIds.length === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs"
                      }`}
                    >
                      Apply
                    </button>
                    {selectedOrderIds.length > 0 && (
                      <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md shrink-0">
                        {selectedOrderIds.length} selected
                      </span>
                    )}
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-80">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="অর্ডার #, নাম, ফোন, জেলা দিয়ে সার্চ..."
                      value={orderSearchTerm}
                      onChange={(e) => setOrderSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-8 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-gray-50/50"
                    />
                    {orderSearchTerm && (
                      <button
                        onClick={() => setOrderSearchTerm("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ==================== ORDERS DATA PRESENTATION ==================== */}
              {/* Mobile View: Adaptive Cards (< sm) */}
              <div className="sm:hidden space-y-3">
                {/* Mobile Select All Toolbar */}
                {filteredOrders.length > 0 && (
                  <div className="flex items-center justify-between px-3.5 py-2.5 bg-white rounded-2xl border border-gray-100 shadow-2xs text-xs">
                    <label className="flex items-center gap-2 font-medium text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          filteredOrders.length > 0 &&
                          filteredOrders.every((o) => selectedOrderIds.includes(o.id))
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrderIds(filteredOrders.map((o) => o.id));
                          } else {
                            setSelectedOrderIds([]);
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>সব অর্ডার সিলেক্ট ({filteredOrders.length})</span>
                    </label>
                    {selectedOrderIds.length > 0 && (
                      <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md text-[11px]">
                        {selectedOrderIds.length} টি নির্বাচিত
                      </span>
                    )}
                  </div>
                )}

                {filteredOrders.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100 text-xs">
                    কোনো অর্ডার পাওয়া যায়নি।
                  </div>
                ) : (
                  filteredOrders.map((order) => {
                    const isAssignedToStaff = staffList.some(
                      (s) =>
                        s.toLowerCase() ===
                        (order.assigned_to || order.status || "").toLowerCase()
                    );
                    const assignedStaffName = staffList.find(
                      (s) =>
                        s.toLowerCase() ===
                        (order.assigned_to || order.status || "").toLowerCase()
                    );

                    return (
                      <div
                        key={order.id}
                        className={`bg-white rounded-2xl p-4 border transition-all space-y-3 ${
                          selectedOrderIds.includes(order.id)
                            ? "border-blue-400 bg-blue-50/20 shadow-xs"
                            : "border-gray-100 shadow-2xs hover:shadow-xs"
                        }`}
                      >
                        {/* Card Top: Checkbox + Order Number + Date */}
                        <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <input
                              type="checkbox"
                              checked={selectedOrderIds.includes(order.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedOrderIds([...selectedOrderIds, order.id]);
                                } else {
                                  setSelectedOrderIds(
                                    selectedOrderIds.filter((id) => id !== order.id)
                                  );
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <button
                              type="button"
                              onClick={() => handleOpenEditOrderModal(order)}
                              className="font-bold text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 cursor-pointer truncate"
                              title="অর্ডার এডিট করতে ক্লিক করুন"
                            >
                              <span>{order.order_number}</span>
                              <Edit className="w-3 h-3 text-gray-400 shrink-0" />
                            </button>
                          </div>
                          <span className="text-[10px] text-gray-400 shrink-0">
                            {new Date(order.created_at).toLocaleDateString("bn-BD")}
                          </span>
                        </div>

                        {/* Customer & Contact Row */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-gray-900 text-sm truncate">{order.customer_name}</p>
                            <p className="text-xs text-gray-600 mt-0.5 line-clamp-2" title={order.address}>
                              {order.address}
                            </p>
                            <div className="flex items-center gap-1.5 flex-wrap mt-1">
                              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">
                                {order.district || "Dhaka"}
                              </span>
                              {order.assigned_to && (
                                <span className="flex items-center gap-0.5 text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded">
                                  <Users className="w-2.5 h-2.5" />
                                  <span>{order.assigned_to}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quick 1-Tap Call & WhatsApp */}
                          <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                            <a
                              href={`tel:${order.phone}`}
                              className="p-2 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 transition-colors cursor-pointer"
                              title="কল করুন"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`https://wa.me/88${order.phone.replace(/^0/, "")}?text=${encodeURIComponent(
                                `আসসালামু আলাইকুম ${order.customer_name}, আল-শিফা কেয়ার থেকে আপনার অর্ডার নং ${order.order_number} এর ব্যাপারে যোগাযোগ করছি।`
                              )}`}
                              target="_blank"
                              className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
                              title="WhatsApp এ মেসেজ দিন"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>

                        {/* Price & BDCourier Row */}
                        <div className="p-2.5 rounded-xl bg-gray-50/80 flex items-center justify-between gap-2">
                          <div>
                            <p className="text-[10px] text-gray-500">
                              {order.items && order.items.length > 0
                                ? `${order.items[0].quantity}x ${order.items[0].product_name}`
                                : "১ বোতল"}
                            </p>
                            <p className="text-base font-extrabold text-gray-900">৳{order.grand_total}</p>
                          </div>

                          {/* BDCourier Badge */}
                          <div>
                            {checkingCourierId === order.id ? (
                              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 font-semibold text-[10px] animate-pulse">
                                <RefreshCw className="w-3 h-3 animate-spin text-purple-600" />
                                <span>যাচাই...</span>
                              </div>
                            ) : order.courier_ratio_data ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setOrderModalMode("courier_fraud");
                                }}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border font-semibold text-[10px] cursor-pointer ${
                                  order.courier_ratio_data.risk === "high"
                                    ? "bg-red-50 border-red-200 text-red-700"
                                    : order.courier_ratio_data.risk === "medium"
                                    ? "bg-amber-50 border-amber-200 text-amber-700"
                                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
                                }`}
                              >
                                {order.courier_ratio_data.risk === "high" ? (
                                  <ShieldAlert className="w-3 h-3 text-red-600" />
                                ) : order.courier_ratio_data.risk === "medium" ? (
                                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                                ) : (
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                )}
                                <span>{order.courier_ratio_data.success_rate}% সাকসেস</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleCheckBDCourier(order.id, order.phone)}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-semibold text-[10px] cursor-pointer"
                              >
                                <ShieldCheck className="w-3 h-3 text-purple-600" />
                                <span>BDCourier</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Status Dropdown & Action Buttons */}
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
                          {/* Status Dropdown */}
                          <select
                            value={
                              order.status === "trash"
                                ? "trash"
                                : isAssignedToStaff
                                ? (assignedStaffName || order.status).toLowerCase()
                                : order.status === "pending" || order.status === "processing"
                                ? "processing"
                                : order.status === "on-hold" || order.status === "on_hold"
                                ? "on-hold"
                                : order.status === "completed" ||
                                  order.status === "delivered" ||
                                  order.status === "shipped"
                                ? "completed"
                                : order.status === "cancelled" || order.status === "fake"
                                ? "cancelled"
                                : order.status === "refunded"
                                ? "refunded"
                                : order.status === "failed"
                                ? "failed"
                                : order.status
                            }
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className={`text-[11px] font-bold px-2 py-1 rounded-xl border focus:outline-none cursor-pointer max-w-[130px] ${
                              order.status === "trash"
                                ? "bg-gray-100 text-gray-700 border-gray-300"
                                : isAssignedToStaff
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                : order.status === "processing" || order.status === "pending"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : order.status === "on-hold" || order.status === "on_hold"
                                ? "bg-amber-50 text-amber-800 border-amber-300"
                                : order.status === "completed" ||
                                  order.status === "delivered" ||
                                  order.status === "shipped"
                                ? "bg-blue-50 text-blue-800 border-blue-300"
                                : order.status === "refunded"
                                ? "bg-purple-50 text-purple-800 border-purple-300"
                                : order.status === "failed"
                                ? "bg-red-50 text-red-800 border-red-300"
                                : "bg-rose-50 text-rose-800 border-rose-300"
                            }`}
                          >
                            <option value="processing">Processing</option>
                            <option value="on-hold">On hold</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="refunded">Refunded</option>
                            <option value="failed">Failed</option>
                            <optgroup label="── Staff / Agents ──">
                              {staffList.map((st) => (
                                <option key={st} value={st.toLowerCase()}>
                                  {st}
                                </option>
                              ))}
                            </optgroup>
                            <option value="trash">Trash</option>
                          </select>

                          {/* Quick Actions Toolbar */}
                          <div className="flex items-center gap-1">
                            {/* Edit Order */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditOrderModal(order)}
                              className="px-2 py-1 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                              title="এডিট"
                            >
                              <Edit className="w-3 h-3 text-amber-600" />
                              <span>এডিট</span>
                            </button>

                            {/* 1-Click Courier Booking */}
                            {order.status !== "trash" && (
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setOrderModalMode("courier_book");
                                }}
                                className="p-1 rounded-lg text-purple-600 hover:bg-purple-50 border border-gray-200 cursor-pointer"
                                title="কুরিয়ারে বুক করুন"
                              >
                                <Truck className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Thermal POS Print */}
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setOrderModalMode("pos");
                              }}
                              className="p-1 rounded-lg text-gray-600 hover:bg-gray-100 border border-gray-200 cursor-pointer"
                              title="থার্মাল স্লিপ"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            {/* A4 Invoice Print */}
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setOrderModalMode("invoice");
                              }}
                              className="p-1 rounded-lg text-blue-600 hover:bg-blue-50 border border-gray-200 cursor-pointer"
                              title="A4 ইনভয়েস"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>

                            {/* Trash or Restore/Permanent Delete */}
                            {order.status === "trash" ? (
                              <>
                                <button
                                  onClick={() => handleRestoreOrder(order.id)}
                                  className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 border border-gray-200 cursor-pointer"
                                  title="রিস্টোর"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 border border-gray-200 cursor-pointer"
                                  title="স্থায়ীভাবে মুছে ফেলুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleMoveToTrash(order.id)}
                                className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 border border-gray-200 cursor-pointer"
                                title="ট্র্যাশ"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Desktop & Tablet Table (sm:block) */}
              <div className="hidden sm:block bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[760px]">
                    <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      <tr>
                        <th className="py-3 px-3 w-8">
                          <input
                            type="checkbox"
                            checked={
                              filteredOrders.length > 0 &&
                              filteredOrders.every((o) => selectedOrderIds.includes(o.id))
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedOrderIds(filteredOrders.map((o) => o.id));
                              } else {
                                setSelectedOrderIds([]);
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </th>
                        <th className="py-3 px-4">অর্ডার #</th>
                        <th className="py-3 px-4">গ্রাহকের তথ্য</th>
                        <th className="py-3 px-4">ঠিকানা ও জেলা</th>
                        <th className="py-3 px-4">পরিমাণ ও মূল্য</th>
                        <th className="py-3 px-4">BDCourier ফ্রড চেক</th>
                        <th className="py-3 px-4">স্ট্যাটাস / অ্যাসাইন</th>
                        <th className="py-3 px-4 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-gray-400">
                            কোনো অর্ডার পাওয়া যায়নি।
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => {
                          const isAssignedToStaff = staffList.some(
                            (s) =>
                              s.toLowerCase() ===
                              (order.assigned_to || order.status || "").toLowerCase()
                          );
                          const assignedStaffName = staffList.find(
                            (s) =>
                              s.toLowerCase() ===
                              (order.assigned_to || order.status || "").toLowerCase()
                          );

                          return (
                            <tr
                              key={order.id}
                              className={`transition-colors ${
                                selectedOrderIds.includes(order.id)
                                  ? "bg-blue-50/40"
                                  : "hover:bg-gray-50/50"
                              }`}
                            >
                              <td className="py-4 px-3">
                                <input
                                  type="checkbox"
                                  checked={selectedOrderIds.includes(order.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedOrderIds([...selectedOrderIds, order.id]);
                                    } else {
                                      setSelectedOrderIds(
                                        selectedOrderIds.filter((id) => id !== order.id)
                                      );
                                    }
                                  }}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                              </td>
                              <td className="py-4 px-4 font-bold text-gray-900">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditOrderModal(order)}
                                  className="text-left font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex items-center gap-1 group"
                                  title="অর্ডার এডিট করতে ক্লিক করুন"
                                >
                                  <span>{order.order_number}</span>
                                  <Edit className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
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
                                {checkingCourierId === order.id ? (
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 font-semibold text-[10px] animate-pulse">
                                    <RefreshCw className="w-3 h-3 animate-spin text-purple-600" />
                                    <span>যাচাই হচ্ছে...</span>
                                  </div>
                                ) : order.courier_ratio_data ? (
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedOrder(order);
                                        setOrderModalMode("courier_fraud");
                                      }}
                                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border font-semibold text-[10px] cursor-pointer hover:shadow-xs transition-all ${
                                        order.courier_ratio_data.risk === "high"
                                          ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                          : order.courier_ratio_data.risk === "medium"
                                          ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                                          : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                                      }`}
                                      title="বিস্তারিত ফ্রড হিস্টোরি রিপোর্ট দেখতে ক্লিক করুন"
                                    >
                                      {order.courier_ratio_data.risk === "high" ? (
                                        <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                                      ) : order.courier_ratio_data.risk === "medium" ? (
                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                      ) : (
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                      )}
                                      <span>
                                        {order.courier_ratio_data.success_rate}% সাকসেস
                                        {order.courier_ratio_data.risk === "high" ? " (রিস্ক!)" : ""}
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCheckBDCourier(order.id, order.phone);
                                      }}
                                      title="পুনরায় যাচাই করুন"
                                      className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                                    >
                                      <RefreshCw className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleCheckBDCourier(order.id, order.phone)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-semibold text-[10px] transition-all"
                                    title="BDCourier থেকে ফ্রড হিস্টোরি ও ডেলিভারি সাকসেস রেট চেক করুন"
                                  >
                                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                                    <span>BDCourier চেক</span>
                                  </button>
                                )}
                              </td>
                              {/* Status & Staff Column */}
                              <td className="py-4 px-4">
                                <div className="space-y-1">
                                  <select
                                    value={
                                      order.status === "trash"
                                        ? "trash"
                                        : isAssignedToStaff
                                        ? (assignedStaffName || order.status).toLowerCase()
                                        : order.status === "pending" || order.status === "processing"
                                        ? "processing"
                                        : order.status === "on-hold" || order.status === "on_hold"
                                        ? "on-hold"
                                        : order.status === "completed" ||
                                          order.status === "delivered" ||
                                          order.status === "shipped"
                                        ? "completed"
                                        : order.status === "cancelled" || order.status === "fake"
                                        ? "cancelled"
                                        : order.status === "refunded"
                                        ? "refunded"
                                        : order.status === "failed"
                                        ? "failed"
                                        : order.status
                                    }
                                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                    className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer transition-all ${
                                      order.status === "trash"
                                        ? "bg-gray-100 text-gray-700 border-gray-300"
                                        : isAssignedToStaff
                                        ? "bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold"
                                        : order.status === "processing" || order.status === "pending"
                                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                        : order.status === "on-hold" || order.status === "on_hold"
                                        ? "bg-amber-50 text-amber-800 border-amber-300"
                                        : order.status === "completed" ||
                                          order.status === "delivered" ||
                                          order.status === "shipped"
                                        ? "bg-blue-50 text-blue-800 border-blue-300"
                                        : order.status === "refunded"
                                        ? "bg-purple-50 text-purple-800 border-purple-300"
                                        : order.status === "failed"
                                        ? "bg-red-50 text-red-800 border-red-300"
                                        : "bg-rose-50 text-rose-800 border-rose-300"
                                    }`}
                                  >
                                    <option value="processing">Processing</option>
                                    <option value="on-hold">On hold</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="refunded">Refunded</option>
                                    <option value="failed">Failed</option>
                                    <optgroup label="── Staff / Agents ──">
                                      {staffList.map((st) => (
                                        <option key={st} value={st.toLowerCase()}>
                                          {st}
                                        </option>
                                      ))}
                                    </optgroup>
                                    <option value="trash">Trash</option>
                                  </select>

                                  {order.assigned_to && (
                                    <div className="flex items-center gap-1 text-[10px] text-indigo-600 font-medium">
                                      <Users className="w-2.5 h-2.5" />
                                      <span>{order.assigned_to}</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Edit Order - Prominent Pill Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditOrderModal(order)}
                                    className="px-2.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] inline-flex items-center gap-1 transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                                    title="অর্ডারের সকল তথ্য এডিট করুন (Edit All Details)"
                                  >
                                    <Edit className="w-3.5 h-3.5 text-amber-600" />
                                    <span>এডিট</span>
                                  </button>

                                  {/* 1-Click Courier Booking */}
                                  {order.status !== "trash" && (
                                    <button
                                      onClick={() => {
                                        setSelectedOrder(order);
                                        setOrderModalMode("courier_book");
                                      }}
                                      className="p-1.5 rounded-xl text-purple-600 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 transition-all cursor-pointer"
                                      title="কুরিয়ারে বুক করুন (Steadfast/Pathao)"
                                    >
                                      <Truck className="w-3.5 h-3.5" />
                                    </button>
                                  )}

                                  {/* Thermal POS Print */}
                                  <button
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setOrderModalMode("pos");
                                    }}
                                    className="p-1.5 rounded-xl text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all cursor-pointer"
                                    title="থার্মাল স্লিপ প্রিন্ট"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                  </button>

                                  {/* A4 Invoice Print */}
                                  <button
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setOrderModalMode("invoice");
                                    }}
                                    className="p-1.5 rounded-xl text-blue-600 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all cursor-pointer"
                                    title="A4 ইনভয়েস প্রিন্ট"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Trash or Restore/Permanent Delete */}
                                  {order.status === "trash" ? (
                                    <>
                                      <button
                                        onClick={() => handleRestoreOrder(order.id)}
                                        className="p-1.5 rounded-xl text-emerald-600 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 transition-all cursor-pointer"
                                        title="রিস্টোর করুন (Move to Processing)"
                                      >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteOrder(order.id)}
                                        className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-gray-200 hover:border-rose-300 transition-all cursor-pointer"
                                        title="স্থায়ীভাবে মুছে ফেলুন"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => handleMoveToTrash(order.id)}
                                      className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-gray-200 hover:border-rose-300 transition-all cursor-pointer"
                                      title="ট্র্যাশে পাঠান (Move to Trash)"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                      description: "প্রাকৃতিক ভেষজ ব্যথানাশক তেল, যা বাত-ব্যথা, কোমর, ঘাড়, হাঁটু ও মাংসপেশির দীর্ঘস্থায়ী যন্ত্রণা উপশম করতে সহায়তা করে।",
                      images: ["/images/product-bottle-main.png"],
                      benefits: ["বাত-ব্যথা ও জয়েন্ট পেইন উপশম করে", "হাঁটু ও কোমর ব্যথায় দ্রুত আরাম দেয়", "মাংসপেশির টান ও ফোলাভাব কমায়"],
                      is_active: true,
                      is_featured: true,
                    });
                    setProductModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন প্রোডাক্ট যোগ করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
                          const newPrice = prompt("নতুন বিক্রয় মূল্য (৳) লিখুন:", String(prod.price || 950));
                          if (newPrice !== null && !isNaN(Number(newPrice)) && Number(newPrice) > 0) {
                            const newOrig = prompt("আসল/কাটা দাগের মূল্য (৳) লিখুন (ঐচ্ছিক):", String(prod.original_price || 1450));
                            handleQuickUpdatePrice(prod.id, Number(newPrice), newOrig ? Number(newOrig) : undefined);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 hover:bg-amber-100 flex items-center gap-1 transition"
                        title="দ্রুত মূল্য পরিবর্তন করুন"
                      >
                        <span>৳ মূল্য বদলান</span>
                      </button>
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
                  <table className="w-full text-left text-xs min-w-[620px]">
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
                  <table className="w-full text-left text-xs min-w-[520px]">
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
                  <table className="w-full text-left text-xs min-w-[600px]">
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
                        placeholder="প্রাকৃতিক ভেষজ উপাদানে বাত ও ব্যথামুক্ত জীবনের সেরা সমাধান"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">উপ-শিরোনাম (Subtitle)</label>
                      <input
                        type="text"
                        value={landingForm.subtitle}
                        onChange={(e) => setLandingForm({ ...landingForm, subtitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#ff3f60]"
                        placeholder="শিফা পেইন কেয়ার অয়েল — প্রাকৃতিক ভেষজ ব্যথা নিরাময়ে বিশুদ্ধ সঙ্গী"
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
                      placeholder="শরীরের বিভিন্ন অংশের পুরনো বাত-ব্যথা, কোমর, ঘাড়, জয়েন্ট ও হাঁটুর যন্ত্রণায় নিয়মিত ম্যাসাজে দ্রুত আরামদায়ক অনুভূতি পেতে..."
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 items-center">
                          <input
                            type="text"
                            value={test.name}
                            onChange={(e) => {
                              const updated = [...landingForm.testimonials];
                              updated[index].name = e.target.value;
                              setLandingForm({ ...landingForm, testimonials: updated });
                            }}
                            placeholder="গ্রাহকের নাম"
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold bg-white w-full"
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
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white w-full"
                          />
                          <select
                            value={test.rating}
                            onChange={(e) => {
                              const updated = [...landingForm.testimonials];
                              updated[index].rating = Number(e.target.value);
                              setLandingForm({ ...landingForm, testimonials: updated });
                            }}
                            className="px-2 py-1.5 rounded-lg border border-gray-200 text-xs bg-white font-bold w-full"
                          >
                            <option value={5}>⭐⭐⭐⭐⭐ (5 Star)</option>
                            <option value={4}>⭐⭐⭐⭐ (4 Star)</option>
                            <option value={3}>⭐⭐⭐ (3 Star)</option>
                          </select>
                          <div className="flex justify-end sm:justify-start">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = landingForm.testimonials.filter((_, i) => i !== index);
                                setLandingForm({ ...landingForm, testimonials: updated });
                              }}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="রিভিউ মুছে ফেলুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">গ্লোবাল সেটিংস ও মার্কেটিং হাব</h3>
                  <p className="text-xs text-gray-500">ডেলিভারি ট্যারিফ, পিক্সেল ট্যাগ ও কুরিয়ার API কি</p>
                </div>
                <button
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-orange-500/20 disabled:opacity-50 self-start sm:self-auto cursor-pointer"
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

                {/* Main Product Pricing Settings */}
                <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        মেইন প্রোডাক্ট ও বিক্রয় মূল্য কনফিগারেশন
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        এখানে মূল্য পরিবর্তন করলে মূল ল্যান্ডিং পেজে স্বয়ংক্রিয়ভাবে নতুন মূল্য কার্যকর হবে।
                      </p>
                    </div>
                    {products[0] && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs">
                        বর্তমান মূল্য: ৳{products[0].price}
                      </span>
                    )}
                  </div>

                  {products[0] ? (
                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-3">
                      <div className="text-xs font-semibold text-emerald-950">
                        পণ্য: <span className="font-bold">{products[0].name_primary}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            বিক্রয় মূল্য (৳) <span className="text-emerald-700">* (কাস্টমার এই মূল্যে কিনবে)</span>
                          </label>
                          <input
                            type="number"
                            defaultValue={products[0].price}
                            id="settings_product_price"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            আসল/রেগুলার মূল্য (৳) <span className="text-gray-400">(কাটা দাগে দেখাবে)</span>
                          </label>
                          <input
                            type="number"
                            defaultValue={products[0].original_price || 1450}
                            id="settings_product_orig_price"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      {/* Quick Presets */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] text-gray-500 font-medium">কুইক প্রিসেট:</span>
                        {[750, 850, 950, 1050, 1200, 1450].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              const el = document.getElementById("settings_product_price") as HTMLInputElement;
                              if (el) el.value = String(preset);
                            }}
                            className="px-2.5 py-1 text-xs rounded-lg bg-white border border-emerald-200 text-emerald-800 font-bold hover:bg-emerald-100 transition"
                          >
                            ৳{preset}
                          </button>
                        ))}
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            const pEl = document.getElementById("settings_product_price") as HTMLInputElement;
                            const oEl = document.getElementById("settings_product_orig_price") as HTMLInputElement;
                            const newP = Number(pEl?.value) || products[0].price;
                            const newO = Number(oEl?.value) || products[0].original_price;
                            handleQuickUpdatePrice(products[0].id, newP, newO);
                          }}
                          className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>মূল্য সংরক্ষণ করুন (Save Price)</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">কোনো প্রোডাক্ট লোড হয়নি</p>
                  )}
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
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Google Analytics 4 (GA4 ID)</label>
                      <input
                        type="text"
                        value={settingsForm.tracking_ga4_id || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tracking_ga4_id: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono"
                        placeholder="G-XXXXXXXXXX"
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

                {/* BDCourier Intelligence Credentials */}
                <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-4 bg-gradient-to-br from-white to-purple-50/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-purple-600" />
                        <h4 className="text-sm font-bold text-gray-900">BDCourier ফ্রড চেক API ক্রেডেনশিয়াল</h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        গ্রাহকের ফোন নাম্বার দিয়ে কুরিয়ার ডেলিভারি রেট ও ফ্রড রিপোর্ট যাচাই করার অফিসিয়াল API।
                      </p>
                    </div>
                    <a
                      href="https://bdcourier.com"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-semibold w-fit"
                    >
                      <span>bdcourier.com</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      BDCourier API Key / Bearer Token
                    </label>
                    <input
                      type="text"
                      value={settingsForm.bdcourier_api_key || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, bdcourier_api_key: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono focus:ring-1 focus:ring-purple-500"
                      placeholder="আপনার BDCourier ড্যাশবোর্ড থেকে প্রাপ্ত API Key দিন"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      BDCourier অ্যাকাউন্ট না থাকলে bdcourier.com এ সাইন আপ করে API কী সংগ্রহ করুন। এটি অর্ডার টেবিলে গ্রাহক যাচাই করতে কাজ করবে।
                    </p>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ===================== TAB: REPORTS & ANALYTICS ===================== */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">সেলস ও অর্ডার অ্যানালিটিক্স</h3>
                  <p className="text-xs text-gray-500">কনভার্শন রেট ও আর্থিক পারফরম্যান্স</p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 shadow-sm self-start sm:self-auto cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>সম্পূর্ণ রিপোর্ট ডাউনলোড (CSV)</span>
                </button>
              </div>

              {/* Conversion Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase">মোট সেলস রেভিনিউ</p>
                  <p className="text-2xl font-extrabold text-gray-900 mt-1">৳{metrics.totalRevenue.toLocaleString()}</p>
                  <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">গড় অর্ডার মূল্য ৳৯৫২</span>
                </div>
                <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase">ডেলিভারি সাকসেস রেশিও</p>
                  <p className="text-2xl font-extrabold text-emerald-600 mt-1">৯৬.৪%</p>
                  <span className="text-xs text-gray-500 font-semibold mt-1 inline-block">খুবই সন্তোষজনক পারফরম্যান্স</span>
                </div>
                <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">টিম মেম্বার ও পারমিশন কন্ট্রোল</h3>
                  <p className="text-xs text-gray-500">গ্র্যানুলার রোল-বেসড অ্যাক্সেস কন্ট্রোল (RBAC)</p>
                </div>
                <button
                  onClick={() => setAddUserModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন স্টাফ যোগ করুন</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[640px]">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">ইউজারনেম</th>
                      <th className="py-3 px-4">রোল</th>
                      <th className="py-3 px-4">পারমিশন স্কোপ</th>
                      <th className="py-3 px-4">যোগদানের তারিখ</th>
                      <th className="py-3 px-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-gray-900 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-orange-100 text-[#ff3f60] flex items-center justify-center font-bold text-xs shrink-0">
                            {u.username[0]?.toUpperCase() || "U"}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span>{u.username}</span>
                            {currentUser?.username === u.username && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-700 font-medium border border-emerald-200">
                                আপনি (Current)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              u.role === "superadmin"
                                ? "bg-purple-100 text-purple-700"
                                : u.role === "manager"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-md">
                            {(u.permissions || []).map((perm: string, i: number) => (
                              <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px]">
                                {perm}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap">
                          {new Date(u.created_at).toLocaleDateString("bn-BD")}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditUser(u)}
                              className="px-2.5 py-1.5 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/70 text-gray-700 hover:text-blue-600 font-semibold transition-all flex items-center gap-1 text-[11px]"
                              title="ইউজার তথ্য ও পারমিশন এডিট করুন"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>এডিট</span>
                            </button>
                            <button
                              onClick={() => handleOpenDeleteUser(u)}
                              disabled={currentUser?.username === u.username}
                              className={`px-2.5 py-1.5 rounded-xl border font-semibold transition-all flex items-center gap-1 text-[11px] ${
                                currentUser?.username === u.username
                                  ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                                  : "border-gray-200 hover:border-rose-500 hover:bg-rose-50/70 text-gray-700 hover:text-rose-600"
                              }`}
                              title={
                                currentUser?.username === u.username
                                  ? "নিজের অ্যাকাউন্ট ডিলিট করা সম্ভব নয়"
                                  : "ইউজার মুছে ফেলুন"
                              }
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>ডিলিট</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {adminUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-400">
                          কোনো টিম মেম্বার পাওয়া যায়নি
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        </main>
      </div>

      {/* ===================== MODALS ===================== */}

      {/* 1. Thermal POS Slip Modal */}
      {orderModalMode === "pos" && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 sm:p-6 shadow-2xl relative font-mono text-xs my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setOrderModalMode(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div id="pos-print-area" className="text-center border-b border-dashed border-gray-300 pb-4 mb-4">
              <h2 className="font-extrabold text-base tracking-widest">AL-SHIFA CARE</h2>
              <p className="text-[10px]">Natural Wellness & Pain Relief</p>
              <p className="text-[10px]">Hotline: {settingsData?.hotline_number || "01886367377"}</p>
              <div className="mt-2 text-left text-[11px] space-y-0.5 break-words">
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
              className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-black cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>থার্মাল প্রিন্ট করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Standard A4 Invoice Modal */}
      {orderModalMode === "invoice" && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setOrderModalMode(null)}
              className="absolute right-4 top-4 sm:right-5 sm:top-5 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 border-b border-gray-200 pb-5 sm:pb-6 mb-5 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Al-Shifa Care</h2>
                <p className="text-xs text-gray-500">Official Invoice / চালান</p>
                <p className="text-xs text-gray-500 mt-1">হটলাইন: {settingsData?.hotline_number || "01886367377"}</p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">ইনভয়েস #</span>
                <p className="text-sm sm:text-base font-extrabold text-gray-900">{selectedOrder.order_number}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  তারিখ: {new Date(selectedOrder.created_at).toLocaleDateString("bn-BD")}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-5 sm:mb-6 text-xs">
              <div className="break-words">
                <p className="font-bold text-gray-400 uppercase mb-1">বিল টু (গ্রাহক)</p>
                <p className="font-bold text-gray-900 text-sm">{selectedOrder.customer_name}</p>
                <p className="text-gray-600 mt-0.5">{selectedOrder.phone}</p>
                <p className="text-gray-600 mt-0.5">{selectedOrder.address}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-bold text-gray-400 uppercase mb-1">পেমেন্ট মেথড</p>
                <p className="font-bold text-emerald-600 text-sm">Cash on Delivery (COD)</p>
                <p className="text-gray-500 mt-1">ডেলিভারি জেলা: {selectedOrder.district || "Dhaka"}</p>
              </div>
            </div>
            <div className="overflow-x-auto min-w-0 mb-5 sm:mb-6 border border-gray-100 rounded-xl">
              <table className="w-full text-left text-xs min-w-[320px]">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">পণ্যের বিবরণ</th>
                    <th className="py-2.5 px-3 text-center">পরিমাণ</th>
                    <th className="py-2.5 px-3 text-right">মূল্য</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-gray-800">শিফা পেইন কেয়ার অয়েল (Shifa Pain Care Oil)</td>
                    <td className="py-3 px-3 text-center">{selectedOrder.quantity || 1}</td>
                    <td className="py-3 px-3 text-right font-bold">৳{selectedOrder.grand_total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <p className="text-xs text-gray-500">পণ্য হাতে পেয়ে চেক করে টাকা পরিশোধ করুন।</p>
              <div className="text-left sm:text-right w-full sm:w-auto flex sm:block justify-between items-baseline">
                <span className="text-xs text-gray-500 sm:mr-4">সর্বমোট প্রদেয়:</span>
                <span className="text-xl font-extrabold text-gray-900">৳{selectedOrder.grand_total}</span>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>A4 ইনভয়েস প্রিন্ট করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Courier Booking Modal */}
      {orderModalMode === "courier_book" && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setOrderModalMode(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setCourierProvider("steadfast")}
                    className={`p-3 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                      courierProvider === "steadfast"
                        ? "border-purple-600 bg-purple-50 text-purple-700 shadow-xs"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    Steadfast Courier
                  </button>
                  <button
                    type="button"
                    onClick={() => setCourierProvider("pathao")}
                    className={`p-3 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                      courierProvider === "pathao"
                        ? "border-red-600 bg-red-50 text-red-700 shadow-xs"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    Pathao Logistics
                  </button>
                </div>
              </div>
              <div className="p-3.5 bg-gray-50 rounded-2xl space-y-1.5 text-gray-600 border border-gray-100 break-words">
                <p><span className="text-gray-400 font-medium">গ্রাহক:</span> <span className="font-semibold text-gray-800">{selectedOrder.customer_name}</span></p>
                <p><span className="text-gray-400 font-medium">ফোন:</span> <span className="font-semibold text-gray-800">{selectedOrder.phone}</span></p>
                <p><span className="text-gray-400 font-medium">ঠিকানা:</span> <span className="font-medium text-gray-700">{selectedOrder.address}</span></p>
                <p className="font-bold text-gray-900 pt-1 border-t border-gray-200/60 mt-1">COD ক্যাশ কালেকশন: ৳{selectedOrder.grand_total}</p>
              </div>
              <button
                type="button"
                onClick={handleConfirmCourierBooking}
                disabled={isBookingShipment}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 disabled:opacity-50 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>{isBookingShipment ? "চালান তৈরি হচ্ছে..." : "বুকিং নিশ্চিত করুন"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3.5. Edit Order Modal */}
      {orderModalMode === "edit" && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl p-5 sm:p-7 shadow-2xl relative my-auto max-h-[94vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
              <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className="p-2 sm:p-2.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200 shrink-0 mt-0.5 sm:mt-0">
                  <Edit className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <h3 className="font-bold text-gray-900 text-base">অর্ডার সম্পাদনা</h3>
                    <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-lg px-2 py-0.5">
                      <span className="text-[10px] text-blue-600 font-bold uppercase">অর্ডার #</span>
                      <input
                        type="text"
                        value={editOrderForm.order_number}
                        onChange={(e) =>
                          setEditOrderForm({ ...editOrderForm, order_number: e.target.value })
                        }
                        className="bg-transparent text-blue-800 font-bold text-xs focus:outline-none max-w-[120px]"
                        title="অর্ডার নাম্বার এডিট করুন"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1 sm:line-clamp-none">
                    অর্ডারের গ্রাহক, প্রোডাক্ট, মূল্য, কুরিয়ার ও স্ট্যাটাস যেকোনো তথ্য পরিবর্তন করে ডাটাবেজে সংরক্ষণ করুন
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOrderModalMode(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form */}
            <form onSubmit={handleSaveEditOrder} className="flex-1 overflow-y-auto py-4 space-y-5 text-xs pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left Column: Customer & Items */}
                <div className="space-y-4">
                  {/* Customer Information Card */}
                  <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-gray-800 text-xs border-b border-gray-200 pb-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>গ্রাহকের তথ্য (Customer Details)</span>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">গ্রাহকের নাম *</label>
                      <input
                        type="text"
                        required
                        value={editOrderForm.customer_name}
                        onChange={(e) =>
                          setEditOrderForm({ ...editOrderForm, customer_name: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="গ্রাহকের পুরো নাম"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-semibold text-gray-700">মোবাইল নাম্বার *</label>
                          <div className="flex items-center gap-1.5">
                            {editOrderForm.phone && (
                              <a
                                href={`tel:${editOrderForm.phone}`}
                                className="text-[10px] text-emerald-600 hover:underline flex items-center gap-0.5"
                                title="কল টেস্ট করুন"
                              >
                                <Phone className="w-2.5 h-2.5" />
                                <span>কল</span>
                              </a>
                            )}
                          </div>
                        </div>
                        <input
                          type="text"
                          required
                          value={editOrderForm.phone}
                          onChange={(e) =>
                            setEditOrderForm({ ...editOrderForm, phone: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                          placeholder="01XXXXXXXXX"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">জেলা</label>
                        <input
                          type="text"
                          value={editOrderForm.district}
                          onChange={(e) =>
                            setEditOrderForm({ ...editOrderForm, district: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          placeholder="ঢাকা"
                        />
                        {/* Quick District Pills */}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {["ঢাকা", "চট্টগ্রাম", "কুমিল্লা", "সিলেট", "রাজশাহী", "খুলনা", "গাজীপুর", "নারায়ণগঞ্জ"].map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => {
                                const newDelCharge = d === "ঢাকা" ? 60 : (editOrderForm.delivery_charge === 60 ? 120 : editOrderForm.delivery_charge);
                                const newGrand = Number(editOrderForm.subtotal || 0) + newDelCharge - Number(editOrderForm.discount_amount || 0);
                                setEditOrderForm({
                                  ...editOrderForm,
                                  district: d,
                                  delivery_charge: newDelCharge,
                                  grand_total: newGrand,
                                });
                              }}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-all ${
                                editOrderForm.district === d
                                  ? "bg-blue-600 text-white font-bold"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">সম্পূর্ণ ডেলিভারি ঠিকানা *</label>
                      <textarea
                        required
                        rows={2}
                        value={editOrderForm.address}
                        onChange={(e) =>
                          setEditOrderForm({ ...editOrderForm, address: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white leading-relaxed"
                        placeholder="বাসা/রোড, এলাকা, থানা, পোস্ট কোড..."
                      />
                    </div>
                  </div>

                  {/* Product & Items Card */}
                  <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-gray-800 text-xs border-b border-gray-200 pb-2">
                      <Package className="w-4 h-4 text-emerald-600" />
                      <span>পণ্য ও আইটেম বিবরণ (Order Items)</span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-semibold text-gray-700">পণ্যের নাম</label>
                        {products && products.length > 0 && (
                          <select
                            onChange={(e) => {
                              const selectedProd = products.find((p: any) => p.name_primary === e.target.value);
                              if (selectedProd) {
                                const newPrice = Number(selectedProd.price_regular || selectedProd.price_sale) || editOrderForm.price;
                                const newSub = Number(editOrderForm.quantity) * newPrice;
                                const newGrand = newSub + Number(editOrderForm.delivery_charge || 0) - Number(editOrderForm.discount_amount || 0);
                                setEditOrderForm({
                                  ...editOrderForm,
                                  product_name: selectedProd.name_primary,
                                  price: newPrice,
                                  subtotal: newSub,
                                  grand_total: newGrand,
                                });
                              }
                            }}
                            className="text-[10px] text-blue-600 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5 font-semibold focus:outline-none cursor-pointer"
                          >
                            <option value="">ক্যাটালগ থেকে পছন্দ করুন...</option>
                            {products.map((p: any) => (
                              <option key={p.id} value={p.name_primary}>
                                {p.name_primary} (৳{p.price_regular || p.price_sale})
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <input
                        type="text"
                        value={editOrderForm.product_name}
                        onChange={(e) =>
                          setEditOrderForm({ ...editOrderForm, product_name: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-2">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">ভ্যারিয়েন্ট</label>
                        <input
                          type="text"
                          value={editOrderForm.selected_variant || ""}
                          onChange={(e) =>
                            setEditOrderForm({ ...editOrderForm, selected_variant: e.target.value })
                          }
                          className="w-full px-2.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                          placeholder="১ বোতল (১০০ মিলি)"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">পরিমাণ (Qty)</label>
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() => {
                              const q = Math.max(1, (Number(editOrderForm.quantity) || 1) - 1);
                              const sub = q * (Number(editOrderForm.price) || 0);
                              const grand = sub + Number(editOrderForm.delivery_charge || 0) - Number(editOrderForm.discount_amount || 0);
                              setEditOrderForm({
                                ...editOrderForm,
                                quantity: q,
                                subtotal: sub,
                                grand_total: grand,
                              });
                            }}
                            className="px-2.5 py-2 bg-gray-100 hover:bg-gray-200 rounded-l-xl font-bold border border-r-0 border-gray-200 text-gray-600 cursor-pointer"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={editOrderForm.quantity}
                            onChange={(e) => {
                              const q = Math.max(1, Number(e.target.value) || 1);
                              const p = Number(editOrderForm.price) || 0;
                              const sub = q * p;
                              const grand = sub + Number(editOrderForm.delivery_charge || 0) - Number(editOrderForm.discount_amount || 0);
                              setEditOrderForm({
                                ...editOrderForm,
                                quantity: q,
                                subtotal: sub,
                                grand_total: grand,
                              });
                            }}
                            className="w-full text-center px-1 py-2 border-y border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const q = (Number(editOrderForm.quantity) || 1) + 1;
                              const sub = q * (Number(editOrderForm.price) || 0);
                              const grand = sub + Number(editOrderForm.delivery_charge || 0) - Number(editOrderForm.discount_amount || 0);
                              setEditOrderForm({
                                ...editOrderForm,
                                quantity: q,
                                subtotal: sub,
                                grand_total: grand,
                              });
                            }}
                            className="px-2.5 py-2 bg-gray-100 hover:bg-gray-200 rounded-r-xl font-bold border border-l-0 border-gray-200 text-gray-600 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">ইউনিট মূল্য (৳)</label>
                        <input
                          type="number"
                          value={editOrderForm.price}
                          onChange={(e) => {
                            const p = Number(e.target.value) || 0;
                            const q = Number(editOrderForm.quantity) || 1;
                            const sub = q * p;
                            const grand = sub + Number(editOrderForm.delivery_charge || 0) - Number(editOrderForm.discount_amount || 0);
                            setEditOrderForm({
                              ...editOrderForm,
                              price: p,
                              subtotal: sub,
                              grand_total: grand,
                            });
                          }}
                          className="w-full px-2.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Status, Pricing & Courier */}
                <div className="space-y-4">
                  {/* Status & Assignment Card */}
                  <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-gray-800 text-xs border-b border-gray-200 pb-2">
                      <Sliders className="w-4 h-4 text-purple-600" />
                      <span>স্ট্যাটাস ও স্টাফ অ্যাসাইন (Status & Assignment)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">অর্ডার স্ট্যাটাস</label>
                        <select
                          value={editOrderForm.status}
                          onChange={(e) => {
                            const val = e.target.value;
                            const matchedStaff = staffList.find(
                              (s) => s.toLowerCase() === val.toLowerCase()
                            );
                            setEditOrderForm({
                              ...editOrderForm,
                              status: val,
                              assigned_to: matchedStaff || (val === "processing" ? "" : editOrderForm.assigned_to),
                            });
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white font-bold text-xs cursor-pointer"
                        >
                          <option value="processing">🟢 Processing (প্রসেসিং)</option>
                          <option value="on-hold">🟡 On hold (অন হোল্ড)</option>
                          <option value="completed">🔵 Completed (কমপ্লিটেড)</option>
                          <option value="cancelled">🔴 Cancelled (বাতিল)</option>
                          <option value="refunded">🟣 Refunded (রিফান্ডেড)</option>
                          <option value="failed">⛔ Failed (ফেইল্ড)</option>
                          <optgroup label="── স্টাফ / এজেন্ট ──">
                            {staffList.map((st) => (
                              <option key={st} value={st.toLowerCase()}>
                                👤 {st}
                              </option>
                            ))}
                          </optgroup>
                          <option value="trash">🗑️ Trash (ট্র্যাশ)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">দায়িত্বপ্রাপ্ত স্টাফ</label>
                        <select
                          value={editOrderForm.assigned_to || ""}
                          onChange={(e) =>
                            setEditOrderForm({ ...editOrderForm, assigned_to: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white font-medium text-xs cursor-pointer"
                        >
                          <option value="">কোনো স্টাফ নেই (Unassigned)</option>
                          {staffList.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Total Card */}
                  <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-gray-800 text-xs border-b border-gray-200 pb-2">
                      <DollarSign className="w-4 h-4 text-amber-600" />
                      <span>বিলিং ও মূল্য বিবরণ (Pricing Breakdown)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-2">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">সাবটোটাল (৳)</label>
                        <input
                          type="number"
                          value={editOrderForm.subtotal}
                          onChange={(e) => {
                            const sub = Number(e.target.value) || 0;
                            const grand = sub + Number(editOrderForm.delivery_charge || 0) - Number(editOrderForm.discount_amount || 0);
                            setEditOrderForm({
                              ...editOrderForm,
                              subtotal: sub,
                              grand_total: grand,
                            });
                          }}
                          className="w-full px-2.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">ডেলিভারি চার্জ (৳)</label>
                        <input
                          type="number"
                          value={editOrderForm.delivery_charge}
                          onChange={(e) => {
                            const del = Number(e.target.value) || 0;
                            const grand = Number(editOrderForm.subtotal || 0) + del - Number(editOrderForm.discount_amount || 0);
                            setEditOrderForm({
                              ...editOrderForm,
                              delivery_charge: del,
                              grand_total: grand,
                            });
                          }}
                          className="w-full px-2.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">ডিসকাউন্ট (৳)</label>
                        <input
                          type="number"
                          value={editOrderForm.discount_amount}
                          onChange={(e) => {
                            const disc = Number(e.target.value) || 0;
                            const grand = Number(editOrderForm.subtotal || 0) + Number(editOrderForm.delivery_charge || 0) - disc;
                            setEditOrderForm({
                              ...editOrderForm,
                              discount_amount: disc,
                              grand_total: grand,
                            });
                          }}
                          className="w-full px-2.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white font-bold"
                        />
                      </div>
                    </div>

                    {/* Quick Delivery Charge Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <span className="text-[10px] text-gray-500 font-semibold">ডেলিভারি রেট:</span>
                      {[
                        { label: "৳০ (ফ্রি)", value: 0 },
                        { label: "৳৬০ (ঢাকা)", value: 60 },
                        { label: "৳১০০", value: 100 },
                        { label: "৳১২০ (বাইরে)", value: 120 },
                        { label: "৳১৫০", value: 150 },
                      ].map((chip) => (
                        <button
                          key={chip.value}
                          type="button"
                          onClick={() => {
                            const grand = Number(editOrderForm.subtotal || 0) + chip.value - Number(editOrderForm.discount_amount || 0);
                            setEditOrderForm({
                              ...editOrderForm,
                              delivery_charge: chip.value,
                              grand_total: grand,
                            });
                          }}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-all cursor-pointer ${
                            Number(editOrderForm.delivery_charge) === chip.value
                              ? "bg-amber-600 text-white font-bold"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>

                    {/* Grand Total Box */}
                    <div className="p-3.5 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded-2xl border-2 border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                      <div>
                        <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                          সর্বমোট প্রদেয় বিল (Grand Total)
                        </span>
                        <p className="text-[10px] text-gray-500">
                          সাবটোটাল (৳{editOrderForm.subtotal || 0}) + ডেলিভারি (৳{editOrderForm.delivery_charge || 0}) - ডিসকাউন্ট (৳{editOrderForm.discount_amount || 0})
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <span className="text-xl font-black text-emerald-600">৳</span>
                        <input
                          type="number"
                          value={editOrderForm.grand_total}
                          onChange={(e) =>
                            setEditOrderForm({
                              ...editOrderForm,
                              grand_total: Number(e.target.value) || 0,
                            })
                          }
                          className="w-24 text-right px-2 py-1 bg-white rounded-lg border border-emerald-300 font-black text-lg text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Courier Tracking & Note Card */}
                  <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-gray-800 text-xs border-b border-gray-200 pb-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span>কুরিয়ার ট্র্যাকিং ও অর্ডার নোট</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">কুরিয়ার ট্র্যাকিং কোড</label>
                        <input
                          type="text"
                          value={editOrderForm.steadfast_tracking_code || ""}
                          onChange={(e) =>
                            setEditOrderForm({
                              ...editOrderForm,
                              steadfast_tracking_code: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono text-[11px]"
                          placeholder="STF-XXXXXX"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">কনসাইনমেন্ট আইডি</label>
                        <input
                          type="text"
                          value={editOrderForm.steadfast_consignment_id || editOrderForm.pathao_consignment_id || ""}
                          onChange={(e) =>
                            setEditOrderForm({
                              ...editOrderForm,
                              steadfast_consignment_id: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono text-[11px]"
                          placeholder="CID-XXXXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">অর্ডার নোট বা বিশেষ মন্তব্য</label>
                      <input
                        type="text"
                        value={editOrderForm.note || ""}
                        onChange={(e) =>
                          setEditOrderForm({ ...editOrderForm, note: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="গ্রাহকের বিশেষ নির্দেশনা বা কল সেন্টারের মন্তব্য..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-3 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setOrderModalMode(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold cursor-pointer transition-colors text-center"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSavingOrder}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isSavingOrder ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>পরিবর্তন সংরক্ষণ করুন</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Manual Order Add Modal */}
      {orderModalMode === "add" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setOrderModalMode(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">স্ট্যাটাস / অ্যাসাইন</label>
                  <select
                    value={newOrderForm.status}
                    onChange={(e) => {
                      const val = e.target.value;
                      const isStaff = staffList.some((s) => s.toLowerCase() === val.toLowerCase());
                      setNewOrderForm({
                        ...newOrderForm,
                        status: val,
                        assigned_to: isStaff ? staffList.find((s) => s.toLowerCase() === val.toLowerCase()) || val : "",
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-1 focus:ring-blue-500 font-semibold text-xs"
                  >
                    <option value="processing">Processing (প্রসেসিং)</option>
                    <option value="on-hold">On hold (অন হোল্ড)</option>
                    <option value="completed">Completed (কমপ্লিটেড)</option>
                    <option value="cancelled">Cancelled (বাতিল)</option>
                    <option value="refunded">Refunded (রিফান্ডেড)</option>
                    <option value="failed">Failed (ফেইল্ড)</option>
                    <optgroup label="── স্টাফ / এজেন্ট ──">
                      {staffList.map((st) => (
                        <option key={st} value={st.toLowerCase()}>
                          {st}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">নোট (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={newOrderForm.note}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, note: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                    placeholder="অর্ডার সংক্রান্ত বিশেষ নোট..."
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white font-bold text-xs shadow-md mt-2 cursor-pointer hover:opacity-95 transition-opacity"
              >
                অর্ডার সেভ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Product Add / Edit Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setProductModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    বিক্রয় মূল্য (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold text-gray-900"
                  />
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                    • ল্যান্ডিং পেজে এই মূল্যে সেল হবে
                  </span>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    আসল মূল্য (৳)
                  </label>
                  <input
                    type="number"
                    value={productForm.original_price}
                    onChange={(e) => setProductForm({ ...productForm, original_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold text-gray-500"
                  />
                  <span className="text-[10px] text-gray-400 block mt-1">
                    • কাটা দাগে (strikethrough) দেখাবে
                  </span>
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
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white font-bold text-xs shadow-md mt-2 cursor-pointer hover:opacity-95 transition-opacity"
              >
                সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. Stock Adjust Modal */}
      {stockAdjustModal && selectedProductForAdjust && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 sm:p-6 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setStockAdjustModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
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
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md mt-2 cursor-pointer hover:opacity-95 transition-opacity"
              >
                স্টক আপডেট ও লগ এন্ট্রি
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Add Staff Modal */}
      {addUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setAddUserModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ff3f60] to-[#ff783e] flex items-center justify-center text-white shadow-sm shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">নতুন টিম মেম্বার যোগ করুন</h3>
                <p className="text-xs text-gray-500">গ্র্যানুলার রোল ও পারমিশন কন্ট্রোল সেটআপ করুন</p>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">ইউজারনেম *</label>
                  <input
                    type="text"
                    required
                    value={newUserForm.username}
                    onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#ff3f60]"
                    placeholder="staff_rahim"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">পাসওয়ার্ড *</label>
                  <input
                    type="password"
                    required
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#ff3f60]"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">রোল (Role Preset)</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => {
                    const nextRole = e.target.value;
                    const presetPerms = getRolePresetPermissions(nextRole);
                    setNewUserForm({
                      ...newUserForm,
                      role: nextRole,
                      permissions: presetPerms,
                    });
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 font-semibold focus:outline-none focus:border-[#ff3f60]"
                >
                  <option value="moderator">মডারেটর (অর্ডার ও প্রোডাক্টস এক্সেস)</option>
                  <option value="manager">ম্যানেজার (সবকিছু এক্সেপ্ট সেটিংস ও ইউজার)</option>
                  <option value="superadmin">সুপার এডমিন (ফুল কন্ট্রোল এক্সেস)</option>
                </select>
              </div>

              {/* Granular Permissions Section */}
              <div className="border border-gray-100 rounded-2xl p-3 bg-gray-50/50">
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                  <span className="font-bold text-gray-700 text-[11px]">
                    পারমিশন স্কোপ নির্বাচন ({newUserForm.permissions.length}/{AVAILABLE_RBAC_PERMISSIONS.length})
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setNewUserForm({
                          ...newUserForm,
                          permissions: AVAILABLE_RBAC_PERMISSIONS.map((p) => p.id),
                        })
                      }
                      className="text-[10px] text-blue-600 hover:underline font-semibold cursor-pointer"
                    >
                      সব সিলেক্ট
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={() => setNewUserForm({ ...newUserForm, permissions: [] })}
                      className="text-[10px] text-gray-500 hover:underline font-semibold cursor-pointer"
                    >
                      সব ক্লিয়ার
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {AVAILABLE_RBAC_PERMISSIONS.map((p) => {
                    const isChecked = newUserForm.permissions.includes(p.id);
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => {
                          const updated = isChecked
                            ? newUserForm.permissions.filter((x) => x !== p.id)
                            : [...newUserForm.permissions, p.id];
                          setNewUserForm({ ...newUserForm, permissions: updated });
                        }}
                        className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-medium text-left transition-all flex items-center justify-between cursor-pointer ${
                          isChecked
                            ? "bg-[#ff3f60]/10 border-[#ff3f60]/40 text-[#ff3f60] font-semibold"
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <span className="truncate">{p.label}</span>
                        {isChecked && <CheckCircle2 className="w-3 h-3 text-[#ff3f60] shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddUserModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 text-center cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white font-bold shadow-md hover:opacity-95 disabled:opacity-50 text-center cursor-pointer"
                >
                  {creatingUser ? "তৈরি হচ্ছে..." : "ইউজার তৈরি করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7b. Edit Staff Modal */}
      {editUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setEditUserModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm shrink-0">
                <Edit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">টিম মেম্বার এডিট করুন</h3>
                <p className="text-xs text-gray-500">ইউজারনেম, রোল, পাসওয়ার্ড ও পারমিশন স্কোপ পরিবর্তন করুন</p>
              </div>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">ইউজারনেম *</label>
                  <input
                    type="text"
                    required
                    value={editUserForm.username}
                    onChange={(e) => setEditUserForm({ ...editUserForm, username: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500"
                    placeholder="staff_username"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">রোল (Role)</label>
                  <select
                    value={editUserForm.role}
                    onChange={(e) => {
                      const nextRole = e.target.value;
                      setEditUserForm({
                        ...editUserForm,
                        role: nextRole,
                      });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 font-semibold focus:outline-none focus:border-blue-500"
                  >
                    <option value="moderator">মডারেটর (অর্ডার ও প্রোডাক্টস এক্সেস)</option>
                    <option value="manager">ম্যানেজার (সবকিছু এক্সেপ্ট সেটিংস ও ইউজার)</option>
                    <option value="superadmin">সুপার এডমিন (ফুল কন্ট্রোল এক্সেস)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  নতুন পাসওয়ার্ড <span className="text-gray-400 font-normal">(ঐচ্ছিক - অপরিবর্তিত রাখতে ফাঁকা রাখুন)</span>
                </label>
                <input
                  type="password"
                  value={editUserForm.password}
                  onChange={(e) => setEditUserForm({ ...editUserForm, password: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500"
                  placeholder="নতুন পাসওয়ার্ড লিখুন..."
                />
              </div>

              {/* Granular Permissions Section */}
              <div className="border border-gray-100 rounded-2xl p-3 bg-gray-50/50">
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                  <span className="font-bold text-gray-700 text-[11px]">
                    পারমিশন স্কোপ ({editUserForm.permissions.length}/{AVAILABLE_RBAC_PERMISSIONS.length})
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setEditUserForm({
                          ...editUserForm,
                          permissions: AVAILABLE_RBAC_PERMISSIONS.map((p) => p.id),
                        })
                      }
                      className="text-[10px] text-blue-600 hover:underline font-semibold cursor-pointer"
                    >
                      সব সিলেক্ট
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={() =>
                        setEditUserForm({
                          ...editUserForm,
                          permissions: getRolePresetPermissions(editUserForm.role),
                        })
                      }
                      className="text-[10px] text-purple-600 hover:underline font-semibold cursor-pointer"
                    >
                      রোল ডিফল্ট
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={() => setEditUserForm({ ...editUserForm, permissions: [] })}
                      className="text-[10px] text-gray-500 hover:underline font-semibold cursor-pointer"
                    >
                      সব ক্লিয়ার
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {AVAILABLE_RBAC_PERMISSIONS.map((p) => {
                    const isChecked = editUserForm.permissions.includes(p.id);
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => {
                          const updated = isChecked
                            ? editUserForm.permissions.filter((x) => x !== p.id)
                            : [...editUserForm.permissions, p.id];
                          setEditUserForm({ ...editUserForm, permissions: updated });
                        }}
                        className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-medium text-left transition-all flex items-center justify-between cursor-pointer ${
                          isChecked
                            ? "bg-blue-50 border-blue-300 text-blue-700 font-semibold"
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <span className="truncate">{p.label}</span>
                        {isChecked && <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditUserModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 text-center cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={savingUserEdit}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingUserEdit ? "সেভ হচ্ছে..." : "পরিবর্তন সেভ করুন"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7c. Delete Staff Confirmation Modal */}
      {deleteUserModal && userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 sm:p-6 shadow-2xl relative text-center my-auto max-h-[92vh] overflow-y-auto">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-4 border border-rose-100 shadow-xs">
              <Trash2 className="w-7 h-7" />
            </div>

            <h3 className="font-bold text-gray-900 text-base mb-1">ইউজার মুছে ফেলতে চান?</h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              আপনি কি নিশ্চিত যে <span className="font-bold text-gray-800">@{userToDelete.username}</span> কে স্থায়ীভাবে ডিলিট করতে চান? এই ইউজারের অ্যাক্সেস অবিলম্বে বন্ধ হয়ে যাবে।
            </p>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteUserModal(false);
                  setUserToDelete(null);
                }}
                disabled={deletingUser}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 cursor-pointer"
              >
                না, বাতিল
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                disabled={deletingUser}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deletingUser ? "ডিলিট হচ্ছে..." : "হ্যাঁ, মুছে ফেলুন"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. BDCourier Fraud Intelligence Details Modal */}
      {orderModalMode === "courier_fraud" && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setOrderModalMode(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  selectedOrder.courier_ratio_data?.risk === "high"
                    ? "bg-red-50 text-red-600"
                    : selectedOrder.courier_ratio_data?.risk === "medium"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {selectedOrder.courier_ratio_data?.risk === "high" ? (
                  <ShieldAlert className="w-6 h-6" />
                ) : (
                  <ShieldCheck className="w-6 h-6" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-gray-900 text-base">BDCourier ফ্রড ও পার্সেল রিপোর্ট</h3>
                <p className="text-xs text-gray-500 font-mono truncate">
                  {selectedOrder.customer_name} • {selectedOrder.phone}
                </p>
              </div>
            </div>

            {selectedOrder.courier_ratio_data ? (
              <div className="space-y-4 text-xs">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                  <div className="p-2.5 sm:p-3 bg-gray-50 rounded-2xl text-center border border-gray-100">
                    <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 block uppercase">মোট পার্সেল</span>
                    <span className="text-base sm:text-lg font-extrabold text-gray-800">
                      {selectedOrder.courier_ratio_data.total_orders ?? 0}
                    </span>
                  </div>
                  <div className="p-2.5 sm:p-3 bg-emerald-50 rounded-2xl text-center border border-emerald-100">
                    <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 block uppercase">সফল ডেলিভারি</span>
                    <span className="text-base sm:text-lg font-extrabold text-emerald-700">
                      {selectedOrder.courier_ratio_data.success_orders ?? 0}
                    </span>
                  </div>
                  <div className="p-2.5 sm:p-3 bg-red-50 rounded-2xl text-center border border-red-100">
                    <span className="text-[9px] sm:text-[10px] font-bold text-red-500 block uppercase">বাতিল / রিটার্ন</span>
                    <span className="text-base sm:text-lg font-extrabold text-red-600">
                      {selectedOrder.courier_ratio_data.canceled_orders ?? 0}
                    </span>
                  </div>
                </div>

                {/* Success Rate Card */}
                <div className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-between">
                  <span className="font-semibold text-gray-700">ডেলিভারি সাকসেস রেট:</span>
                  <span
                    className={`text-base font-extrabold ${
                      selectedOrder.courier_ratio_data.risk === "high"
                        ? "text-red-600"
                        : selectedOrder.courier_ratio_data.risk === "medium"
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {selectedOrder.courier_ratio_data.success_rate ?? 0}%
                    <span className="text-xs font-normal ml-1 text-gray-500">
                      ({selectedOrder.courier_ratio_data.risk === "high"
                        ? "উচ্চ ঝুঁকি"
                        : selectedOrder.courier_ratio_data.risk === "medium"
                        ? "মাঝারি ঝুঁকি"
                        : "নিরাপদ"})
                    </span>
                  </span>
                </div>

                {/* Fraud Reports List if any */}
                {selectedOrder.courier_ratio_data.reports && selectedOrder.courier_ratio_data.reports.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="font-bold text-red-600 text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>মার্চেন্ট রিপোর্ট বা অভিযোগ ({selectedOrder.courier_ratio_data.reports.length}টি)</span>
                    </h4>
                    <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 bg-red-50/50 rounded-xl border border-red-100">
                      {selectedOrder.courier_ratio_data.reports.map((rep: any, idx: number) => (
                        <div key={idx} className="p-2.5 bg-white rounded-lg border border-red-100 text-[11px] text-gray-700 space-y-0.5">
                          <p className="font-bold text-red-700">{rep.reason || rep.title || "অভিযোগ রিপোর্ট"}</p>
                          {rep.description && <p className="text-gray-600">{rep.description}</p>}
                          {rep.courier && <p className="text-[10px] text-gray-400">কুরিয়ার: {rep.courier}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <p className="text-[11px]">এই ফোন নাম্বারে অন্য কোনো সেলারের কোনো প্রতারণার রিপোর্ট নেই।</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleCheckBDCourier(selectedOrder.id, selectedOrder.phone);
                    }}
                    disabled={checkingCourierId === selectedOrder.id}
                    className="flex-1 py-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${checkingCourierId === selectedOrder.id ? "animate-spin" : ""}`} />
                    <span>{checkingCourierId === selectedOrder.id ? "যাচাই হচ্ছে..." : "পুনরায় চেক করুন"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderModalMode(null)}
                    className="px-5 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold text-xs cursor-pointer text-center"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <p className="text-gray-500 text-xs">এখনও BDCourier ফ্রড চেক করা হয়নি।</p>
                <button
                  type="button"
                  onClick={() => handleCheckBDCourier(selectedOrder.id, selectedOrder.phone)}
                  disabled={checkingCourierId === selectedOrder.id}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 mx-auto shadow-md cursor-pointer hover:bg-purple-700 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{checkingCourierId === selectedOrder.id ? "যাচাই হচ্ছে..." : "এখনই BDCourier ফ্রড চেক করুন"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. Manage Staff / Agent Statuses Modal */}
      {manageStaffModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setManageStaffModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">স্টাফ ও অর্ডার স্ট্যাটাস তালিকা</h3>
                <p className="text-[11px] text-gray-500">টেলিকলার ও এজেন্ট অনুযায়ী অর্ডার ফিল্টার ট্যাব</p>
              </div>
            </div>

            {/* Add new staff input */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input
                type="text"
                placeholder="নতুন স্টাফের নাম লিখুন (যেমন: Shakil)..."
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddStaff();
                  }
                }}
                className="flex-1 px-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddStaff}
                disabled={!newStaffName.trim()}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl cursor-pointer disabled:opacity-40 transition-colors"
              >
                যোগ করুন
              </button>
            </div>

            {/* Staff list chips/cards */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {staffList.map((st) => {
                const count = orderCounts[st.toLowerCase()] || 0;
                return (
                  <div
                    key={st}
                    className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[11px]">
                        {st.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-800">{st}</p>
                        <p className="text-[10px] text-gray-400">{count}টি অর্ডার অ্যাসাইন করা</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveStaff(st)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setManageStaffModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl cursor-pointer transition-colors text-center"
              >
                সম্পন্ন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
