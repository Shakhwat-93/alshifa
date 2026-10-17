"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Save,
  Rocket,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  History,
  Image as ImageIcon,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Layers,
  Globe,
  Loader2,
  RefreshCw,
} from "lucide-react";
import ImageUploadField from "./ImageUploadField";

interface SectionMeta {
  key: string;
  name: string;
  category: string;
  description: string;
}

const SECTION_METAS: Record<string, SectionMeta> = {
  announcement: {
    key: "announcement",
    name: "অ্যানাউন্সমেন্ট ও প্রমোশনাল স্ট্রিপ",
    category: "হেডার",
    description: "পেজের একদম উপরে স্পেশাল অফার টেক্সট ও হটলাইন বাটন",
  },
  hero: {
    key: "hero",
    name: "হিরো সেকশন ও মেইন ব্যানার",
    category: "হিরো",
    description: "মূল হেডিং, সাব-টাইটেল, পণ্য পরিচিতি, অর্ডার বাটন ও মেইন বোতল ইমেজ",
  },
  gallery: {
    key: "gallery",
    name: "ইমেজ গ্যালারি ও ফটো স্লাইডার",
    category: "মিডিয়া",
    description: "পণ্যের দুর্লভ উপাদান ও ফলাফল প্রদর্শনের স্লাইডার",
  },
  offer_banner: {
    key: "offer_banner",
    name: "কুইক অফার ও অ্যাকশন স্ট্রিপ",
    category: "অ্যাকশন",
    description: "গ্যালারির নিচে সরাসরি অর্ডারে যাওয়ার কুইক বাটন",
  },
  badges: {
    key: "badges",
    name: "ট্রাস্ট ব্যাজ ও বিশেষত্ব (৩টি কার্ড)",
    category: "ট্রাস্ট",
    description: "প্রাকৃতিক উপাদান, সাইড-ইফেক্ট মুক্ত ও ডেলিভারি ব্যাজ",
  },
  intro: {
    key: "intro",
    name: "পণ্যের বিস্তারিত পরিচিতি",
    category: "কনটেন্ট",
    description: "শিফা পেইন কেয়ার অয়েলের বিস্তারিত বিবরণী বক্স",
  },
  ingredients: {
    key: "ingredients",
    name: "ভেষজ উপাদান সমূহ (১৪টি ভেষজ নির্যাস)",
    category: "কনটেন্ট",
    description: "ক্যাস্টর অয়েল, কালোজিরা, আদা, লবঙ্গ সহ দুর্লভ উপাদানের লিস্ট",
  },
  usage: {
    key: "usage",
    name: "ব্যবহারের নিয়ম ও নির্দেশিকা",
    category: "গাইড",
    description: "মালিশ করার সঠিক নিয়ম ও দৈনিক ব্যবহার বিধি",
  },
  certification: {
    key: "certification",
    name: "ল্যাব টেস্ট ও সার্টিফিকেশন এপ্রুভাল",
    category: "ট্রাস্ট",
    description: "অফিসিয়াল অনুমোদন ও সার্টিফিকেট ইমেজ",
  },
  mid_cta: {
    key: "mid_cta",
    name: "মিড-পেজ কল টু অ্যাকশন ব্যানার",
    category: "অ্যাকশন",
    description: "পেজের মাঝামাঝি আকর্ষণীয় অর্ডার কলআউট স্ট্রিপ",
  },
  reviews: {
    key: "reviews",
    name: "সম্মানিত গ্রাহকদের মতামত (টেস্টিমোনিয়ালস)",
    category: "সোশ্যাল প্রুফ",
    description: "গ্রাহকের নাম, ছবি, জেলা, স্টার রেটিং ও রিভিউ মেসেজ",
  },
  timer: {
    key: "timer",
    name: "কাউন্টডাউন টাইমার ও অফার আরজেন্সি",
    category: "আরজেন্সি",
    description: "সীমিত সময়ের অফার শেষ হওয়ার লাইভ টাইমার বক্স",
  },
  final_cta: {
    key: "final_cta",
    name: "ফাইনাল অর্ডার ব্যানার ও হটলাইন",
    category: "অ্যাকশন",
    description: "চেকআউট ফর্মের ঠিক পূর্বে বড় অর্ডার বাটন ও হটলাইন নম্বর",
  },
  checkout: {
    key: "checkout",
    name: "চেকআউট ও ক্যাশ অন ডেলিভারি ফর্ম",
    category: "অর্ডার",
    description: "অর্ডার ফর্ম শিরোনাম, ফ্রি ডেলিভারি ব্যাজ ও সাবমিট বাটন টেক্সট",
  },
};

function cleanNumericInput(val: any): string {
  const bnToEn: Record<string, string> = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  };
  return String(val ?? "")
    .replace(/[০-৯]/g, (d) => bnToEn[d] || d)
    .replace(/[^0-9]/g, "");
}

export default function LandingCmsEditor({ onSaved }: { onSaved?: () => void } = {}) {
  const [activeSubTab, setActiveSubTab] = useState<"sections" | "seo" | "media">("sections");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string>("hero");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Core CMS state
  const [status, setStatus] = useState<string>("published");
  const [publishedAt, setPublishedAt] = useState<string>("");
  const [sectionsOrder, setSectionsOrder] = useState<string[]>([]);
  const [sectionsData, setSectionsData] = useState<Record<string, any>>({});
  const [seoData, setSeoData] = useState({
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    og_image: "",
    canonical_url: "",
  });

  // Revisions & Media
  const [revisions, setRevisions] = useState<any[]>([]);
  const [showRevisionsModal, setShowRevisionsModal] = useState(false);
  const [mediaAssets, setMediaAssets] = useState<any[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch initial landing CMS data
  const fetchLandingData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/landing?t=${Date.now()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok && data.landing) {
        const landing = data.landing;
        setStatus(landing.status || "published");
        setPublishedAt(landing.published_at || "");
        
        // Prefer draft data if current status is draft, or published
        const currentData = landing.draft_sections_data && Object.keys(landing.draft_sections_data).length > 0
          ? landing.draft_sections_data
          : landing.sections_data || {};

        const currentOrder = landing.draft_sections_order && landing.draft_sections_order.length > 0
          ? landing.draft_sections_order
          : landing.sections_order || Object.keys(SECTION_METAS);

        setSectionsData(currentData);
        setSectionsOrder(currentOrder);
        setSeoData({
          seo_title: landing.seo_title || "",
          seo_description: landing.seo_description || "",
          seo_keywords: landing.seo_keywords || "",
          og_image: landing.og_image || "",
          canonical_url: landing.canonical_url || "",
        });
        setRevisions(data.revisions || []);
        setIsDirty(false);
      }
    } catch (err) {
      showToast("ল্যান্ডিং পেজ কনটেন্ট লোড করতে ব্যর্থ হয়েছে।", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLandingData();
  }, [fetchLandingData]);

  // Fetch Media Assets when media tab is opened
  const fetchMediaAssets = async () => {
    setMediaLoading(true);
    try {
      const res = await fetch("/api/admin/media?limit=60");
      const data = await res.json();
      if (res.ok && data.assets) {
        setMediaAssets(data.assets);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMediaLoading(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === "media") {
      fetchMediaAssets();
    }
  }, [activeSubTab]);

  // Handle section property updates
  const updateSectionField = (sectionKey: string, field: string, value: any) => {
    setIsDirty(true);
    setSectionsData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...(prev[sectionKey] || {}),
        [field]: value,
      },
    }));
  };

  // Reorder sections
  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sectionsOrder.length) return;

    setIsDirty(true);
    const updated = [...sectionsOrder];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setSectionsOrder(updated);
  };

  // Toggle visibility
  const toggleVisibility = (sectionKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDirty(true);
    const current = sectionsData[sectionKey]?.visible !== false;
    updateSectionField(sectionKey, "visible", !current);
  };

  // Save changes (Draft or Live Publish)
  const handleSave = async (action: "save_draft" | "publish") => {
    setSaving(true);
    try {
      const payload = {
        action,
        sections_data: sectionsData,
        sections_order: sectionsOrder,
        ...seoData,
      };

      const res = await fetch("/api/admin/landing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsDirty(false);
        setStatus(action === "publish" ? "published" : "draft");
        if (action === "publish") {
          setPublishedAt(new Date().toISOString());
        }
        showToast(
          action === "publish"
            ? "🚀 ল্যান্ডিং পেজ ও নতুন মূল্য সফলভাবে লাইভ পাবলিশ করা হয়েছে!"
            : "💾 ড্রাফট ও মূল্য সফলভাবে সেভ হয়েছে।"
        );
        fetchLandingData();
        if (onSaved) onSaved();
      } else {
        showToast(data.error || "সেভ করতে ব্যর্থ হয়েছে।", "error");
      }
    } catch (err: any) {
      showToast("সার্ভার কানেকশন ত্রুটি।", "error");
    } finally {
      setSaving(false);
    }
  };

  // Restore Revision
  const handleRestoreRevision = async (revId: string) => {
    if (!confirm("আপনি কি নিশ্চিত এই রিভিশনটি রিস্টোর করতে চান? লাইভ পেজ এই কনটেন্টে ফেরত যাবে।")) {
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/landing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore_revision", revision_id: revId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("রিভিশন সফলভাবে রিস্টোর করা হয়েছে!");
        setShowRevisionsModal(false);
        fetchLandingData();
      } else {
        showToast(data.error || "রিস্টোর ব্যর্থ হয়েছে", "error");
      }
    } catch (e) {
      showToast("সার্ভার ত্রুটি", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 shadow-xs">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff3f60] mx-auto mb-3" />
        <p className="text-sm font-semibold text-gray-700">ল্যান্ডিং পেজ কনটেন্ট লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================= TOP ACTION BAR & STATUS ================= */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-lg font-bold text-gray-900">ল্যান্ডিং পেজ CMS ও সেকশন বিল্ডার</h3>
            {status === "published" && !isDirty ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" /> লাইভ সক্রিয়
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                <AlertCircle className="w-3.5 h-3.5" /> ড্রাফট / আনপাবলিশড পরিবর্তন
              </span>
            )}
            {isDirty && (
              <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md animate-pulse">
                • সেভ না করা পরিবর্তন রয়েছে
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            সেকশন ড্র্যাগ করে সাজান, কনটেন্ট বা ইমেজ পরিবর্তন করুন এবং ড্রাফট বা লাইভ পাবলিশ করুন।
            {publishedAt && (
              <span className="ml-1 text-gray-400">
                (সর্বশেষ পাবলিশ: {new Date(publishedAt).toLocaleString("bn-BD")})
              </span>
            )}
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {/* History Revisions Button */}
          <button
            type="button"
            onClick={() => setShowRevisionsModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700 flex items-center gap-1.5 cursor-pointer"
            title="পূর্ববর্তী সংস্করণসমূহ দেখুন"
          >
            <History className="w-4 h-4 text-gray-500" />
            <span className="hidden sm:inline">হিস্ট্রি</span>
          </button>

          {/* Live Preview Button */}
          <a
            href="/?preview=true"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>লাইভ প্রিভিউ</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>

          {/* Save Draft */}
          <button
            type="button"
            onClick={() => handleSave("save_draft")}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-xs font-semibold text-gray-800 flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-gray-600" />
            <span>{saving ? "ড্রাফট হচ্ছে..." : "ড্রাফট সেভ"}</span>
          </button>

          {/* Live Publish */}
          <button
            type="button"
            onClick={() => handleSave("publish")}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20 hover:opacity-95 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Rocket className="w-4 h-4" />
            )}
            <span>{saving ? "পাবলিশ হচ্ছে..." : "লাইভ পাবলিশ করুন"}</span>
          </button>
        </div>
      </div>

      {/* Toast alert */}
      {toast && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs"
              : "bg-rose-50 text-rose-800 border border-rose-200 shadow-xs"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ================= NAVIGATION SUB-TABS ================= */}
      <div className="flex border-b border-gray-200 space-x-1 sm:space-x-3">
        <button
          type="button"
          onClick={() => setActiveSubTab("sections")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 cursor-pointer transition-colors ${
            activeSubTab === "sections"
              ? "border-[#ff3f60] text-[#ff3f60]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>সেকশনসমূহ ও ক্রমান্বয় ({sectionsOrder.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("seo")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 cursor-pointer transition-colors ${
            activeSubTab === "seo"
              ? "border-[#ff3f60] text-[#ff3f60]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>এসইও ও সোশ্যাল মেটাডাটা</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("media")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 cursor-pointer transition-colors ${
            activeSubTab === "media"
              ? "border-[#ff3f60] text-[#ff3f60]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>মিডিয়া লাইব্রেরি</span>
        </button>
      </div>

      {/* ================= TAB 1: SECTIONS & REORDERING ================= */}
      {activeSubTab === "sections" && (
        <div className="space-y-4">
          <div className="bg-amber-50/70 border border-amber-200/60 p-3.5 rounded-2xl flex items-center justify-between text-xs text-amber-900">
            <span>
              💡 <b>টিপস:</b> প্রতিটি সেকশনের পাশের আপ/ডাউন বাটনে ক্লিক করে সেকশনের অর্ডার পরিবর্তন করতে পারেন এবং চোখের আইকনে ক্লিক করে সেকশনটি হাইড/শো করতে পারেন।
            </span>
          </div>

          <div className="space-y-3">
            {sectionsOrder.map((key, index) => {
              const meta = SECTION_METAS[key] || {
                key,
                name: key,
                category: "অন্যান্য",
                description: "সেকশন কনটেন্ট",
              };
              const sData = sectionsData[key] || {};
              const isVisible = sData.visible !== false;
              const isExpanded = expandedSection === key;

              return (
                <div
                  key={key}
                  className={`bg-white rounded-3xl border transition-all ${
                    isExpanded
                      ? "border-[#ff3f60]/40 shadow-md ring-1 ring-[#ff3f60]/20"
                      : "border-gray-200 hover:border-gray-300 shadow-xs"
                  }`}
                >
                  {/* Section Item Header */}
                  <div
                    onClick={() => setExpandedSection(isExpanded ? "" : key)}
                    className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      {/* Order indicator */}
                      <span className="w-7 h-7 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-gray-900">{meta.name}</h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                            {meta.category}
                          </span>
                          {!isVisible && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700">
                              হাইড করা
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                          {meta.description}
                        </p>
                      </div>
                    </div>

                    {/* Section Header Controls */}
                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {/* Move Up */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveSection(index, "up")}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                        title="উপরে নিন"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        disabled={index === sectionsOrder.length - 1}
                        onClick={() => moveSection(index, "down")}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                        title="নিচে নিন"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Visibility Toggle */}
                      <button
                        type="button"
                        onClick={(e) => toggleVisibility(key, e)}
                        className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                          isVisible
                            ? "border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                            : "border-gray-200 text-gray-400 bg-gray-100 hover:bg-gray-200"
                        }`}
                        title={isVisible ? "হাইড করুন" : "শো করুন"}
                      >
                        {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {/* Expand Toggle Chevron */}
                      <button
                        type="button"
                        onClick={() => setExpandedSection(isExpanded ? "" : key)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Section Expanded Deep Editor */}
                  {isExpanded && (
                    <div className="p-5 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl space-y-4">
                      {/* Visibility banner inside editor */}
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
                        <span className="text-xs font-semibold text-gray-700">
                          সেকশনের ভিজিবিলিটি:
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isVisible}
                            onChange={(e) => updateSectionField(key, "visible", e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                          <span className="ml-2 text-xs font-semibold text-gray-700">
                            {isVisible ? "ওয়েবসাইটে দৃশ্যমান" : "লুকানো (Hidden)"}
                          </span>
                        </label>
                      </div>

                      {/* 1. ANNOUNCEMENT STRIP */}
                      {key === "announcement" && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">অ্যানাউন্সমেন্ট টেক্সট</label>
                            <input
                              type="text"
                              value={sData.text || ""}
                              onChange={(e) => updateSectionField("announcement", "text", e.target.value)}
                              placeholder="সীমিত সময়ের অফার..."
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-[#ff3f60] outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">হটলাইন নম্বর</label>
                              <input
                                type="text"
                                value={sData.phone || ""}
                                onChange={(e) => updateSectionField("announcement", "phone", e.target.value)}
                                placeholder="01886367377"
                                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs focus:ring-2 focus:ring-[#ff3f60] outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">কল বাটন লেবেল</label>
                              <input
                                type="text"
                                value={sData.link_text || "কল করুন: "}
                                onChange={(e) => updateSectionField("announcement", "link_text", e.target.value)}
                                placeholder="কল করুন: "
                                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs focus:ring-2 focus:ring-[#ff3f60] outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2. HERO SECTION */}
                      {key === "hero" && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">টপ ব্যাজ / ট্যাগ</label>
                              <input
                                type="text"
                                value={sData.badge_text || ""}
                                onChange={(e) => updateSectionField("hero", "badge_text", e.target.value)}
                                placeholder="১০০% প্রাকৃতিক ও নিরাপদ"
                                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs focus:ring-2 focus:ring-[#ff3f60] outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">মূল শিরোনাম (Title)</label>
                              <input
                                type="text"
                                value={sData.title || ""}
                                onChange={(e) => updateSectionField("hero", "title", e.target.value)}
                                placeholder="শিফা পেইন কেয়ার অয়েল"
                                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold focus:ring-2 focus:ring-[#ff3f60] outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">উপ-শিরোনাম (Subtitle)</label>
                              <input
                                type="text"
                                value={sData.subtitle || ""}
                                onChange={(e) => updateSectionField("hero", "subtitle", e.target.value)}
                                placeholder="প্রকৃতির ছোঁয়ায় ব্যথা নিরাময়ের বিশ্বস্ত সঙ্গী"
                                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs focus:ring-2 focus:ring-[#ff3f60] outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">পণ্য পরিচিতি / ডেসক্রিপশন</label>
                            <textarea
                              rows={3}
                              value={sData.description || ""}
                              onChange={(e) => updateSectionField("hero", "description", e.target.value)}
                              placeholder="শরীরের বিভিন্ন অংশে ব্যথা, পেশীর অস্বস্তি ও ক্লান্তির সময়..."
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs focus:ring-2 focus:ring-[#ff3f60] outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">CTA বাটন টেক্সট</label>
                              <input
                                type="text"
                                value={sData.cta_text || "এখনই অর্ডার করুন"}
                                onChange={(e) => updateSectionField("hero", "cta_text", e.target.value)}
                                placeholder="এখনই অর্ডার করুন"
                                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-[#ff3f60] outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">CTA বাটন লিংক</label>
                              <input
                                type="text"
                                value={sData.cta_url || "#checkout"}
                                onChange={(e) => updateSectionField("hero", "cta_url", e.target.value)}
                                placeholder="#checkout"
                                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs focus:ring-2 focus:ring-[#ff3f60] outline-none"
                              />
                            </div>
                          </div>

                          <div className="pt-2">
                            <ImageUploadField
                              label="হিরো মেইন বোতল ইমেজ"
                              value={sData.image_url || "/images/product-bottle-main.png"}
                              onChange={(url) => updateSectionField("hero", "image_url", url)}
                              altValue={sData.image_alt || "শিফা পেইন কেয়ার অয়েল বোতল"}
                              onAltChange={(alt) => updateSectionField("hero", "image_alt", alt)}
                              sectionKey="hero"
                              helperText="হিরো ব্যানারে প্রদর্শিত পণ্যের বোতলের মূল ছবি"
                            />
                          </div>
                        </div>
                      )}

                      {/* 3. GALLERY SLIDER */}
                      {key === "gallery" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold text-gray-800">গ্যালারি স্লাইডস ({sData.items?.length || 0}টি ছবি)</h5>
                            <button
                              type="button"
                              onClick={() => {
                                const current = sData.items || [];
                                updateSectionField("gallery", "items", [
                                  ...current,
                                  { src: "/images/product-ad-banner.png", alt: "শিফা পেইন কেয়ার ব্যানার" },
                                ]);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" /> স্লাইড যোগ করুন
                            </button>
                          </div>

                          <div className="space-y-3">
                            {(sData.items || []).map((item: any, idx: number) => (
                              <div key={idx} className="p-3.5 bg-white rounded-2xl border border-gray-200 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-gray-700">স্লাইড #{idx + 1}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = (sData.items || []).filter((_: any, i: number) => i !== idx);
                                      updateSectionField("gallery", "items", updated);
                                    }}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                                    title="মুছে ফেলুন"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <ImageUploadField
                                  label={`স্লাইড #${idx + 1} ইমেজ`}
                                  value={item.src || ""}
                                  onChange={(url) => {
                                    const updated = [...(sData.items || [])];
                                    updated[idx].src = url;
                                    updateSectionField("gallery", "items", updated);
                                  }}
                                  altValue={item.alt || ""}
                                  onAltChange={(alt) => {
                                    const updated = [...(sData.items || [])];
                                    updated[idx].alt = alt;
                                    updateSectionField("gallery", "items", updated);
                                  }}
                                  sectionKey="gallery"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 4. QUICK OFFER STRIP */}
                      {key === "offer_banner" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">অর্ডার বাটন টেক্সট</label>
                            <input
                              type="text"
                              value={sData.cta_text || "এখনই অর্ডার করুন"}
                              onChange={(e) => updateSectionField("offer_banner", "cta_text", e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-[#ff3f60] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">বাটন লিংক</label>
                            <input
                              type="text"
                              value={sData.cta_url || "#checkout"}
                              onChange={(e) => updateSectionField("offer_banner", "cta_url", e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs focus:ring-2 focus:ring-[#ff3f60] outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* 5. BADGES */}
                      {key === "badges" && (
                        <div className="space-y-3">
                          <h5 className="text-xs font-bold text-gray-800">৩টি ট্রাস্ট ব্যাজ</h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {(sData.items || []).map((badge: any, bIdx: number) => (
                              <div key={bIdx} className="p-3 bg-white rounded-2xl border border-gray-200 space-y-2">
                                <label className="block text-[11px] font-bold text-gray-600">ব্যাজ #{bIdx + 1}</label>
                                <input
                                  type="text"
                                  value={badge.title || ""}
                                  onChange={(e) => {
                                    const updated = [...(sData.items || [])];
                                    updated[bIdx].title = e.target.value;
                                    updateSectionField("badges", "items", updated);
                                  }}
                                  placeholder="ব্যাজের শিরোনাম"
                                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold"
                                />
                                <div>
                                  <label className="block text-[10px] text-gray-500 mb-1">আইকন টাইপ</label>
                                  <select
                                    value={badge.icon || "drop"}
                                    onChange={(e) => {
                                      const updated = [...(sData.items || [])];
                                      updated[bIdx].icon = e.target.value;
                                      updateSectionField("badges", "items", updated);
                                    }}
                                    className="w-full px-2 py-1 rounded-lg border border-gray-200 text-xs bg-white"
                                  >
                                    <option value="drop">তেলের ড্রপ (Drop)</option>
                                    <option value="leaf">ভেষজ পাতা (Leaf)</option>
                                    <option value="recycle">রিসাইকেল / নিরাপদ (Recycle)</option>
                                  </select>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 6. INTRO */}
                      {key === "intro" && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">সেকশন শিরোনাম</label>
                            <input
                              type="text"
                              value={sData.title || ""}
                              onChange={(e) => updateSectionField("intro", "title", e.target.value)}
                              placeholder="পণ্যের পরিচিতি"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">পরিচিতির বিস্তারিত টেক্সট</label>
                            <textarea
                              rows={3}
                              value={sData.text || ""}
                              onChange={(e) => updateSectionField("intro", "text", e.target.value)}
                              placeholder="শিফা পেইন কেয়ার অয়েল হলো..."
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs"
                            />
                          </div>
                        </div>
                      )}

                      {/* 7. INGREDIENTS */}
                      {key === "ingredients" && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">সেকশন হেডিং</label>
                              <input
                                type="text"
                                value={sData.title || ""}
                                onChange={(e) => updateSectionField("ingredients", "title", e.target.value)}
                                placeholder="উপাদান সমূহ"
                                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">সেকশন সাবটাইটেল</label>
                              <input
                                type="text"
                                value={sData.subtitle || ""}
                                onChange={(e) => updateSectionField("ingredients", "subtitle", e.target.value)}
                                placeholder="কোনো ক্ষতিকর কেমিক্যাল ছাড়াই..."
                                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">হাইলাইট বক্স হেডিং</label>
                              <input
                                type="text"
                                value={sData.highlight_title || ""}
                                onChange={(e) => updateSectionField("ingredients", "highlight_title", e.target.value)}
                                placeholder="🌿 Shifa Pain Care Oil"
                                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">হাইলাইট সাবটাইটেল</label>
                              <input
                                type="text"
                                value={sData.highlight_subtitle || ""}
                                onChange={(e) => updateSectionField("ingredients", "highlight_subtitle", e.target.value)}
                                placeholder="২৭টি দুর্লভ ও মূল্যবান ভেষজ উপাদান..."
                                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs"
                              />
                            </div>
                          </div>

                          <div className="pt-2">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-xs font-bold text-gray-800">উপাদান ও উপকারিতা তালিকা ({sData.items?.length || 0}টি)</h5>
                              <button
                                type="button"
                                onClick={() => {
                                  const current = sData.items || [];
                                  updateSectionField("ingredients", "items", [
                                    ...current,
                                    { name: "নতুন ভেষজ উপাদান", type: "leaf", benefit: "প্রাকৃতিক উপাদানে তৈরি যা ব্যথা ও ফোলা ভাব দ্রুত কমায়।" },
                                  ]);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" /> উপাদান যোগ করুন
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                              {(sData.items || []).map((ing: any, iIdx: number) => (
                                <div key={iIdx} className="p-2.5 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-gray-400 w-5 text-center shrink-0">#{iIdx + 1}</span>
                                    <select
                                      value={ing.type || "leaf"}
                                      onChange={(e) => {
                                        const updated = [...(sData.items || [])];
                                        updated[iIdx] = { ...updated[iIdx], type: e.target.value };
                                        updateSectionField("ingredients", "items", updated);
                                      }}
                                      className="px-2 py-1 rounded-lg border border-gray-200 text-xs bg-gray-50 shrink-0 font-medium"
                                    >
                                      <option value="leaf">🌿 পাতা</option>
                                      <option value="drop">💧 ড্রপ</option>
                                    </select>
                                    <input
                                      type="text"
                                      value={ing.name || ""}
                                      onChange={(e) => {
                                        const updated = [...(sData.items || [])];
                                        updated[iIdx] = { ...updated[iIdx], name: e.target.value };
                                        updateSectionField("ingredients", "items", updated);
                                      }}
                                      placeholder="উপাদানের নাম"
                                      className="flex-1 px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-bold text-gray-800"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = (sData.items || []).filter((_: any, i: number) => i !== iIdx);
                                        updateSectionField("ingredients", "items", updated);
                                      }}
                                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition shrink-0"
                                      title="মুছে ফেলুন"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <div>
                                    <input
                                      type="text"
                                      value={ing.benefit || ""}
                                      onChange={(e) => {
                                        const updated = [...(sData.items || [])];
                                        updated[iIdx] = { ...updated[iIdx], benefit: e.target.value };
                                        updateSectionField("ingredients", "items", updated);
                                      }}
                                      placeholder="উপকারিতা / কার্যকারিতা (যেমন: জয়েন্টের শুষ্কতা ও ব্যথা উপশম করে)"
                                      className="w-full px-2.5 py-1 rounded-lg border border-gray-200 text-xs text-gray-600 bg-gray-50/50 focus:bg-white focus:border-emerald-500"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 8. USAGE */}
                      {key === "usage" && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">সেকশন হেডিং</label>
                            <input
                              type="text"
                              value={sData.title || ""}
                              onChange={(e) => updateSectionField("usage", "title", e.target.value)}
                              placeholder="ব্যবহারের নিয়ম"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">ব্যবহারের বিস্তারিত নির্দেশিকা</label>
                            <textarea
                              rows={3}
                              value={sData.text || ""}
                              onChange={(e) => updateSectionField("usage", "text", e.target.value)}
                              placeholder="প্রয়োজনীয় পরিমাণ তেল ব্যথাযুক্ত স্থানে নিয়ে..."
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs"
                            />
                          </div>
                        </div>
                      )}

                      {/* 9. CERTIFICATION */}
                      {key === "certification" && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">সেকশন শিরোনাম</label>
                            <input
                              type="text"
                              value={sData.title || ""}
                              onChange={(e) => updateSectionField("certification", "title", e.target.value)}
                              placeholder="আমাদের সার্টিফিকেশন"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold"
                            />
                          </div>
                          <ImageUploadField
                            label="সার্টিফিকেট ও অনুমোদন ছবি"
                            value={sData.image_url || "/images/certification-approval.jpg"}
                            onChange={(url) => updateSectionField("certification", "image_url", url)}
                            altValue={sData.image_alt || "শিফা পেইন কেয়ার অয়েল সার্টিফিকেট"}
                            onAltChange={(alt) => updateSectionField("certification", "image_alt", alt)}
                            sectionKey="certification"
                            helperText="অফিসিয়াল ল্যাব টেস্ট ও সার্টিফিকেটের হাই-রেজোলিউশন ইমেজ"
                          />
                        </div>
                      )}

                      {/* 10. MID CTA */}
                      {key === "mid_cta" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">শিরোনাম</label>
                            <input
                              type="text"
                              value={sData.title || ""}
                              onChange={(e) => updateSectionField("mid_cta", "title", e.target.value)}
                              placeholder="শিফা পেইন কেয়ার অয়েল"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">উপ-শিরোনাম</label>
                            <input
                              type="text"
                              value={sData.subtitle || ""}
                              onChange={(e) => updateSectionField("mid_cta", "subtitle", e.target.value)}
                              placeholder="প্রকৃতির ছোঁয়ায় ব্যথা নিরাময়ের বিশ্বস্ত সঙ্গী"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">বাটন টেক্সট</label>
                            <input
                              type="text"
                              value={sData.cta_text || "এখনই অর্ডার করুন"}
                              onChange={(e) => updateSectionField("mid_cta", "cta_text", e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">বাটন লিংক</label>
                            <input
                              type="text"
                              value={sData.cta_url || "#checkout"}
                              onChange={(e) => updateSectionField("mid_cta", "cta_url", e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs"
                            />
                          </div>
                        </div>
                      )}

                      {/* 11. REVIEWS */}
                      {key === "reviews" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 mr-4">
                              <label className="block text-xs font-semibold text-gray-700 mb-1">রিভিউ সেকশন শিরোনাম</label>
                              <input
                                type="text"
                                value={sData.title || ""}
                                onChange={(e) => updateSectionField("reviews", "title", e.target.value)}
                                placeholder="সম্মানিত গ্রাহকদের মতামত"
                                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const current = sData.items || [];
                                updateSectionField("reviews", "items", [
                                  ...current,
                                  {
                                    id: Date.now(),
                                    name: "নতুন গ্রাহক",
                                    location: "ঢাকা",
                                    rating: 5,
                                    text: "খুবই ভালো এবং কার্যকরী প্রডাক্ট।",
                                    image: "/images/review-rahima-khatun.avif",
                                  },
                                ]);
                              }}
                              className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-1 cursor-pointer mt-4"
                            >
                              <Plus className="w-3.5 h-3.5" /> রিভিউ যোগ করুন
                            </button>
                          </div>

                          <div className="space-y-3">
                            {(sData.items || []).map((rev: any, rIdx: number) => (
                              <div key={rIdx} className="p-4 bg-white rounded-2xl border border-gray-200 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-gray-700">রিভিউ #{rIdx + 1}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = (sData.items || []).filter((_: any, i: number) => i !== rIdx);
                                      updateSectionField("reviews", "items", updated);
                                    }}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div>
                                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">গ্রাহকের নাম</label>
                                    <input
                                      type="text"
                                      value={rev.name || ""}
                                      onChange={(e) => {
                                        const updated = [...(sData.items || [])];
                                        updated[rIdx].name = e.target.value;
                                        updateSectionField("reviews", "items", updated);
                                      }}
                                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">লোকেশন / জেলা</label>
                                    <input
                                      type="text"
                                      value={rev.location || ""}
                                      onChange={(e) => {
                                        const updated = [...(sData.items || [])];
                                        updated[rIdx].location = e.target.value;
                                        updateSectionField("reviews", "items", updated);
                                      }}
                                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">স্টার রেটিং</label>
                                    <select
                                      value={rev.rating || 5}
                                      onChange={(e) => {
                                        const updated = [...(sData.items || [])];
                                        updated[rIdx].rating = Number(e.target.value);
                                        updateSectionField("reviews", "items", updated);
                                      }}
                                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold bg-white"
                                    >
                                      <option value={5}>⭐⭐⭐⭐⭐ (৫ স্টার)</option>
                                      <option value={4}>⭐⭐⭐⭐ (৪ স্টার)</option>
                                      <option value={3}>⭐⭐⭐ (৩ স্টার)</option>
                                    </select>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">মন্তব্য / রিভিউ টেক্সট</label>
                                  <textarea
                                    rows={2}
                                    value={rev.text || rev.review || ""}
                                    onChange={(e) => {
                                      const updated = [...(sData.items || [])];
                                      updated[rIdx].text = e.target.value;
                                      updated[rIdx].review = e.target.value;
                                      updateSectionField("reviews", "items", updated);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs"
                                  />
                                </div>

                                <ImageUploadField
                                  label="গ্রাহকের ছবি / অবতার"
                                  value={rev.image || "/images/review-rahima-khatun.avif"}
                                  onChange={(url) => {
                                    const updated = [...(sData.items || [])];
                                    updated[rIdx].image = url;
                                    updateSectionField("reviews", "items", updated);
                                  }}
                                  sectionKey="reviews"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 12. TIMER */}
                      {key === "timer" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">টাইমার শিরোনাম</label>
                            <input
                              type="text"
                              value={sData.title || ""}
                              onChange={(e) => updateSectionField("timer", "title", e.target.value)}
                              placeholder="অফার টি শেষ হতে বাকি আছে আর মাত্র"
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">সময়কাল (ঘণ্টা)</label>
                            <input
                              type="number"
                              min={1}
                              max={72}
                              value={sData.duration_hours || 5}
                              onChange={(e) => updateSectionField("timer", "duration_hours", Number(e.target.value))}
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold"
                            />
                          </div>
                        </div>
                      )}

                      {/* 13. FINAL CTA */}
                      {key === "final_cta" && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">ব্যানার হেডিং</label>
                            <input
                              type="text"
                              value={sData.title || ""}
                              onChange={(e) => updateSectionField("final_cta", "title", e.target.value)}
                              placeholder="আজই অর্ডার করুন শিফা পেইন কেয়ার অয়েল"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">অর্ডার বাটন টেক্সট</label>
                              <input
                                type="text"
                                value={sData.cta_text || "এখনই অর্ডার করুন"}
                                onChange={(e) => updateSectionField("final_cta", "cta_text", e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">হটলাইন নম্বর</label>
                              <input
                                type="text"
                                value={sData.phone || "01886367377"}
                                onChange={(e) => updateSectionField("final_cta", "phone", e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">হটলাইন লেবেল</label>
                              <input
                                type="text"
                                value={sData.phone_label || "Hotline: "}
                                onChange={(e) => updateSectionField("final_cta", "phone_label", e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 14. CHECKOUT */}
                      {key === "checkout" && (
                        <div className="space-y-6">
                          {/* Group 1: Form Header */}
                          <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-3">
                            <h5 className="text-xs font-bold text-gray-800 border-b border-gray-100 pb-2">
                              ১. ফর্ম হেডার ও পরিচিতি (Form Header)
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">ফর্ম হেডার শিরোনাম</label>
                                <input
                                  type="text"
                                  value={sData.header_title ?? "অর্ডার ফর্ম (ক্যাশ অন ডেলিভারি)"}
                                  onChange={(e) => updateSectionField("checkout", "header_title", e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold focus:ring-2 focus:ring-[#ff3f60] outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">ফর্ম সাব-শিরোনাম</label>
                                <input
                                  type="text"
                                  value={sData.header_subtitle ?? "আপনার অর্ডারটি প্লেস করতে নিচের প্রয়োজনীয় তথ্যগুলো পূরণ করুন।"}
                                  onChange={(e) => updateSectionField("checkout", "header_subtitle", e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs focus:ring-2 focus:ring-[#ff3f60] outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Group 2: Product & Pricing */}
                          <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200/70 space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/60 pb-2">
                              <h5 className="text-xs font-bold text-emerald-900">
                                ২. পণ্য ও মূল্য নির্ধারণ (Product & Price Configuration)
                              </h5>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                                  বর্তমান বিক্রয় মূল্য: ৳{sData.price_current !== undefined && sData.price_current !== null && sData.price_current !== "" ? sData.price_current : 950}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleSave("publish")}
                                  disabled={saving}
                                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white text-[11px] font-bold flex items-center gap-1 shadow-xs hover:opacity-95 cursor-pointer disabled:opacity-50"
                                >
                                  <Rocket className="w-3 h-3" />
                                  <span>{saving ? "সেভ হচ্ছে..." : "মূল্য লাইভ সেভ করুন"}</span>
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">পণ্য সেকশন শিরোনাম</label>
                                <input
                                  type="text"
                                  value={sData.product_section_title ?? "আপনার পণ্য"}
                                  onChange={(e) => updateSectionField("checkout", "product_section_title", e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">পণ্যের নাম ও প্যাকেজ টেক্সট</label>
                                <input
                                  type="text"
                                  value={sData.product_name ?? "শিফা পেইন কেয়ার অয়েল (১ বোতল)"}
                                  onChange={(e) => updateSectionField("checkout", "product_name", e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-emerald-800 mb-1">
                                  মূল বিক্রয় মূল্য (৳) * (কাস্টমার এই দামে কিনবে)
                                </label>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  placeholder="যেমন: 950, ৯৫০ বা 0"
                                  value={
                                    sData.price_current !== undefined && sData.price_current !== null
                                      ? String(sData.price_current)
                                      : "950"
                                  }
                                  onChange={(e) => {
                                    const cleaned = cleanNumericInput(e.target.value);
                                    updateSectionField("checkout", "price_current", cleaned === "" ? "" : Number(cleaned));
                                  }}
                                  className="w-full px-3 py-2 rounded-xl border-2 border-emerald-500 bg-white text-sm font-black text-emerald-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                                  পূর্বের কাটা দাম (ঐচ্ছিক - না চাইলে ০ দিন)
                                </label>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  placeholder="যেমন: 1450 বা ০"
                                  value={
                                    sData.price_regular !== undefined && sData.price_regular !== null
                                      ? String(sData.price_regular)
                                      : "1450"
                                  }
                                  onChange={(e) => {
                                    const cleaned = cleanNumericInput(e.target.value);
                                    updateSectionField("checkout", "price_regular", cleaned === "" ? "" : Number(cleaned));
                                  }}
                                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-600"
                                />
                              </div>
                            </div>

                            {/* Quick Price Presets */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[11px] font-semibold text-emerald-800">কুইক প্রাইস সিলেক্ট:</span>
                              {[0, 650, 750, 850, 950, 1050, 1200, 1350, 1450].map((preset) => (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => updateSectionField("checkout", "price_current", preset)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                                    sData.price_current !== "" && Number(sData.price_current) === preset
                                      ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                                      : "bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                                  }`}
                                >
                                  ৳{preset}
                                </button>
                              ))}
                            </div>

                            <ImageUploadField
                              label="চেকআউট ফর্মে প্রদর্শিত পণ্যের ছবি"
                              value={sData.product_image || "/images/product-bottle-main.png"}
                              onChange={(url) => updateSectionField("checkout", "product_image", url)}
                              sectionKey="checkout"
                            />

                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-200/60">
                              <div>
                                <span className="text-xs font-bold text-gray-800 block">
                                  চেকআউট বক্সে পণ্যের মূল্য দেখান
                                </span>
                                <span className="text-[10px] text-gray-500">
                                  {sData.show_product_price !== false ? "পণ্যের মূল্য কার্ডে প্রদর্শিত হবে" : "পণ্যের কার্ড থেকে মূল্য লুকানো থাকবে"}
                                </span>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={sData.show_product_price !== false}
                                  onChange={(e) => updateSectionField("checkout", "show_product_price", e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                              </label>
                            </div>
                          </div>

                          {/* Group 3: Customer Info Fields */}
                          <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-3">
                            <h5 className="text-xs font-bold text-gray-800 border-b border-gray-100 pb-2">
                              ৩. গ্রাহকের তথ্য ইনপুট ফিল্ডস (Customer Info Labels & Placeholders)
                            </h5>
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-700 mb-1">সেকশন হেডিং</label>
                              <input
                                type="text"
                                value={sData.customer_section_title ?? "আপনার তথ্য দিন"}
                                onChange={(e) => updateSectionField("checkout", "customer_section_title", e.target.value)}
                                className="w-full sm:w-1/2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-600 mb-1">নামের ফিল্ড লেবেল</label>
                                <input
                                  type="text"
                                  value={sData.name_label ?? "আপনার সম্পূর্ণ নাম লিখুন"}
                                  onChange={(e) => updateSectionField("checkout", "name_label", e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-600 mb-1">নামের প্লেসহোল্ডার</label>
                                <input
                                  type="text"
                                  value={sData.name_placeholder ?? "যেমন: মোঃ সাকিব হোসেন"}
                                  onChange={(e) => updateSectionField("checkout", "name_placeholder", e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-gray-600 mb-1">মোবাইল নাম্বার লেবেল</label>
                                <input
                                  type="text"
                                  value={sData.phone_label ?? "১১ ডিজিটের মোবাইল নাম্বার লিখুন"}
                                  onChange={(e) => updateSectionField("checkout", "phone_label", e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-600 mb-1">মোবাইল নাম্বার প্লেসহোল্ডার</label>
                                <input
                                  type="text"
                                  value={sData.phone_placeholder ?? "যেমন: 017XXXXXXXX"}
                                  onChange={(e) => updateSectionField("checkout", "phone_placeholder", e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-gray-600 mb-1">ঠিকানার লেবেল</label>
                                <input
                                  type="text"
                                  value={sData.address_label ?? "সম্পূর্ণ ঠিকানা (গ্রাম বা এলাকা, থানা ও জেলা)"}
                                  onChange={(e) => updateSectionField("checkout", "address_label", e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-600 mb-1">ঠিকানার প্লেসহোল্ডার</label>
                                <input
                                  type="text"
                                  value={sData.address_placeholder ?? "যেমন: বাড়ি ১২, রোড ৪, সেক্টর ৭, উত্তরা, ঢাকা"}
                                  onChange={(e) => updateSectionField("checkout", "address_placeholder", e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Group 4: Delivery Method & Charge */}
                          <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-3">
                            <h5 className="text-xs font-bold text-gray-800 border-b border-gray-100 pb-2">
                              ৪. ডেলিভারি মেথড ও চার্জ (Delivery Method & Charge)
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">ডেলিভারি সেকশন শিরোনাম</label>
                                <input
                                  type="text"
                                  value={sData.delivery_section_title ?? "ডেলিভারি মেথড"}
                                  onChange={(e) => updateSectionField("checkout", "delivery_section_title", e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">ডেলিভারি মেথড ব্যাজ টেক্সট</label>
                                <input
                                  type="text"
                                  value={sData.shipping_badge ?? "সারাদেশে ক্যাশ অন ডেলিভারি"}
                                  onChange={(e) => updateSectionField("checkout", "shipping_badge", e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-emerald-800"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">ডেলিভারি চার্জ (৳) (০ = ফ্রি)</label>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  placeholder="0 বা 60"
                                  value={
                                    sData.delivery_charge !== undefined
                                      ? String(sData.delivery_charge)
                                      : "0"
                                  }
                                  onChange={(e) => {
                                    const cleaned = cleanNumericInput(e.target.value);
                                    updateSectionField("checkout", "delivery_charge", cleaned === "" ? "" : Number(cleaned));
                                  }}
                                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-emerald-800"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Group 5: Order Review Summary Table */}
                          <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-3">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                              <h5 className="text-xs font-bold text-gray-800">
                                ৫. অর্ডার বিবরণী টেবিল কনফিগারেশন (Order Summary Table)
                              </h5>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                              <div>
                                <span className="text-xs font-bold text-gray-800 block">
                                  অর্ডার বিবরণী টেবিল প্রদর্শন করুন
                                </span>
                                <span className="text-[10px] text-gray-500">
                                  {sData.show_review_table === true ? "টেবিল বর্তমানে চালু রয়েছে" : "টেবিলটি বর্তমানে লুকানো আছে (Hidden)"}
                                </span>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={sData.show_review_table === true}
                                  onChange={(e) => updateSectionField("checkout", "show_review_table", e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                              </label>
                            </div>

                            {sData.show_review_table === true && (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                <div>
                                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">টেবিল হেডিং</label>
                                  <input
                                    type="text"
                                    value={sData.review_table_title ?? "আপনার অর্ডার বিবরণী"}
                                    onChange={(e) => updateSectionField("checkout", "review_table_title", e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">কলাম ১ লেবেল (বাম)</label>
                                  <input
                                    type="text"
                                    value={sData.col_product_label ?? "পণ্য বিবরণ"}
                                    onChange={(e) => updateSectionField("checkout", "col_product_label", e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">কলাম ২ লেবেল (ডান)</label>
                                  <input
                                    type="text"
                                    value={sData.col_price_label ?? "মূল্য"}
                                    onChange={(e) => updateSectionField("checkout", "col_price_label", e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">সাবটোটাল রো লেবেল</label>
                                  <input
                                    type="text"
                                    value={sData.subtotal_label ?? "সাবটোটাল"}
                                    onChange={(e) => updateSectionField("checkout", "subtotal_label", e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">ডেলিভারি চার্জ রো লেবেল</label>
                                  <input
                                    type="text"
                                    value={sData.delivery_charge_label ?? "ডেলিভারি চার্জ"}
                                    onChange={(e) => updateSectionField("checkout", "delivery_charge_label", e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">মোট প্রদেয় বিল রো লেবেল</label>
                                  <input
                                    type="text"
                                    value={sData.total_label ?? "মোট প্রদেয় বিল"}
                                    onChange={(e) => updateSectionField("checkout", "total_label", e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-emerald-800"
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Group 6: Submit Button & Confirmation Modal */}
                          <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-3">
                            <h5 className="text-xs font-bold text-gray-800 border-b border-gray-100 pb-2">
                              ৬. সাবমিট বাটন ও কনফার্মেশন পপ-আপ (Submit Button & Modal)
                            </h5>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                              <div>
                                <span className="text-xs font-bold text-gray-800 block">
                                  সাবমিট বাটনে মূল্য যুক্ত করুন
                                </span>
                                <span className="text-[10px] text-gray-500">
                                  {sData.show_button_price === true ? "বাটনে মূল্য প্রদর্শিত হবে (যেমন: অর্ডার কনফার্ম করুন - ৳ ৯৫০)" : "বাটনে কোনো মূল্য প্রদর্শিত হবে না (শুধু: অর্ডার কনফার্ম করুন)"}
                                </span>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={sData.show_button_price === true}
                                  onChange={(e) => updateSectionField("checkout", "show_button_price", e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                              </label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">সাবমিট বাটন টেক্সট</label>
                                <input
                                  type="text"
                                  value={sData.submit_btn_text ?? "অর্ডার কনফার্ম করুন"}
                                  onChange={(e) => updateSectionField("checkout", "submit_btn_text", e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">প্রসেসিং টেক্সট</label>
                                <input
                                  type="text"
                                  value={sData.submitting_btn_text ?? "অর্ডার প্রসেস হচ্ছে..."}
                                  onChange={(e) => updateSectionField("checkout", "submitting_btn_text", e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">অর্ডার সাকসেস টাইটেল</label>
                                <input
                                  type="text"
                                  value={sData.success_title ?? "আলহামদুলিল্লাহ! আপনার অর্ডার সফল হয়েছে"}
                                  onChange={(e) => updateSectionField("checkout", "success_title", e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">সাকসেস ক্লোজ বাটন</label>
                                <input
                                  type="text"
                                  value={sData.success_btn_text ?? "ঠিক আছে"}
                                  onChange={(e) => updateSectionField("checkout", "success_btn_text", e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Bottom Save & Publish Action Bar inside Checkout Section */}
                          <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => handleSave("publish")}
                              disabled={saving}
                              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-orange-500/20 hover:opacity-95 cursor-pointer disabled:opacity-50"
                            >
                              {saving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Rocket className="w-4 h-4" />
                              )}
                              <span>{saving ? "পাবলিশ হচ্ছে..." : "পরিবর্তনগুলো সেভ ও লাইভ পাবলিশ করুন"}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: SEO & SOCIAL METADATA ================= */}
      {activeSubTab === "seo" && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-gray-900">গুগল সার্চ ও সোশ্যাল মেটাডাটা সেটিংস</h4>
            <p className="text-xs text-gray-500">
              সার্চ ইঞ্জিন ও ফেসবুক/হোয়াটসঅ্যাপে শেয়ার করার সময় প্রদর্শিত তথ্য
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">SEO মেটা টাইটেল (Title Tag)</label>
                <span className="text-[11px] text-gray-400 font-mono">
                  {seoData.seo_title.length} / ৬০ অক্ষর
                </span>
              </div>
              <input
                type="text"
                value={seoData.seo_title}
                onChange={(e) => {
                  setIsDirty(true);
                  setSeoData({ ...seoData, seo_title: e.target.value });
                }}
                placeholder="শিফা পেইন কেয়ার অয়েল | Al-Shifa Care"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:ring-2 focus:ring-[#ff3f60] outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">মেটা ডেসক্রিপশন (Meta Description)</label>
                <span className="text-[11px] text-gray-400 font-mono">
                  {seoData.seo_description.length} / ১৬০ অক্ষর
                </span>
              </div>
              <textarea
                rows={3}
                value={seoData.seo_description}
                onChange={(e) => {
                  setIsDirty(true);
                  setSeoData({ ...seoData, seo_description: e.target.value });
                }}
                placeholder="প্রাকৃতিক উপাদানে তৈরি শিফা পেইন কেয়ার অয়েল..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#ff3f60] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">কি-ওয়ার্ডস (Keywords)</label>
                <input
                  type="text"
                  value={seoData.seo_keywords}
                  onChange={(e) => {
                    setIsDirty(true);
                    setSeoData({ ...seoData, seo_keywords: e.target.value });
                  }}
                  placeholder="shifa pain care, herbal oil, pain relief bd"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">ক্যানোনিকাল URL (Canonical URL)</label>
                <input
                  type="text"
                  value={seoData.canonical_url}
                  onChange={(e) => {
                    setIsDirty(true);
                    setSeoData({ ...seoData, canonical_url: e.target.value });
                  }}
                  placeholder="https://shifacarebd.online"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <ImageUploadField
                label="ওপেন গ্রাফ (OG) সোশ্যাল শেয়ারিং ইমেজ"
                value={seoData.og_image || "/images/product-bottle-main.png"}
                onChange={(url) => {
                  setIsDirty(true);
                  setSeoData({ ...seoData, og_image: url });
                }}
                sectionKey="seo"
                helperText="ফেসবুক, হোয়াটসঅ্যাপ বা টুইটারে পেজ শেয়ার করলে প্রদর্শিত প্রিভিউ ব্যানার (1200x630)"
              />
            </div>

            {/* Google Search Live Simulation Card */}
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-700 mb-2">গুগল সার্চ প্রিভিউ (SERP Preview)</label>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl max-w-xl space-y-1">
                <span className="text-[11px] text-gray-500 font-mono block">shifacarebd.online</span>
                <h5 className="text-sm font-semibold text-blue-700 hover:underline line-clamp-1">
                  {seoData.seo_title || "শিফা পেইন কেয়ার অয়েল | Al-Shifa Care"}
                </h5>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {seoData.seo_description || "প্রাকৃতিক উপাদানে তৈরি শিফা পেইন কেয়ার অয়েল। বাত-ব্যথা, জয়েন্ট ও মাংসপেশির অস্বস্তি নিরাময়ে বিশ্বস্ত সঙ্গী।"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: MEDIA LIBRARY ================= */}
      {activeSubTab === "media" && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-gray-900">আপলোডকৃত মিডিয়া অ্যাসেটস</h4>
              <p className="text-xs text-gray-500">ক্লাউড স্টোরেজে সেভ হওয়া সমস্ত ছবি ও ব্যানারের লাইব্রেরি</p>
            </div>
            <button
              type="button"
              onClick={fetchMediaAssets}
              disabled={mediaLoading}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${mediaLoading ? "animate-spin" : ""}`} />
              <span>রিফ্রেশ</span>
            </button>
          </div>

          {/* Quick upload dropzone */}
          <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
            <ImageUploadField
              label="নতুন মিডিয়া ফাইল আপলোড করুন"
              value=""
              onChange={() => {
                showToast("ছবি সফলভাবে আপলোড হয়েছে!");
                fetchMediaAssets();
              }}
              sectionKey="library"
            />
          </div>

          {/* Media grid */}
          {mediaLoading ? (
            <div className="py-12 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#ff3f60] mx-auto mb-2" />
              <p className="text-xs text-gray-500">মিডিয়া ফাইল লোড হচ্ছে...</p>
            </div>
          ) : mediaAssets.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">এখনও কোনো মিডিয়া ফাইল আপলোড করা হয়নি।</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {mediaAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  <div className="aspect-square bg-gray-50 overflow-hidden flex items-center justify-center p-2">
                    <img
                      src={asset.public_url}
                      alt={asset.alt_text || asset.file_name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-2 bg-white border-t border-gray-100 flex items-center justify-between text-[10px]">
                    <span className="truncate max-w-[80px] font-mono text-gray-600" title={asset.file_name}>
                      {asset.file_name}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(asset.public_url);
                        showToast("ছবির URL কপি করা হয়েছে!");
                      }}
                      className="p-1 text-gray-500 hover:text-gray-900 cursor-pointer"
                      title="URL কপি করুন"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= REVISION HISTORY MODAL ================= */}
      {showRevisionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h4 className="text-base font-bold text-gray-900">রিভিশন হিস্ট্রি ও রোলব্যাক</h4>
                <p className="text-xs text-gray-500">পূর্বে প্রকাশিত সংস্করণে ১-ক্লিকে ফিরে যান</p>
              </div>
              <button
                type="button"
                onClick={() => setShowRevisionsModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {revisions.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-6">কোনো পূর্ববর্তী রিভিশন পাওয়া যায়নি।</p>
              ) : (
                revisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3 bg-gray-50 hover:bg-gray-100/80 rounded-2xl border border-gray-200 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-800">{rev.revision_name}</p>
                      <p className="text-[11px] text-gray-500">
                        {new Date(rev.created_at).toLocaleString("bn-BD")}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleRestoreRevision(rev.id)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-xs font-semibold text-gray-700 hover:text-emerald-700 cursor-pointer disabled:opacity-50"
                    >
                      রিস্টোর
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowRevisionsModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-semibold text-gray-700 hover:bg-gray-200 cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
