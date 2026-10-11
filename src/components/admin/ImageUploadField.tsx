"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, Check } from "lucide-react";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  altValue?: string;
  onAltChange?: (alt: string) => void;
  sectionKey?: string;
  helperText?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  altValue,
  onAltChange,
  sectionKey = "general",
  helperText,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showManualUrl, setShowManualUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (12MB)
    if (file.size > 12 * 1024 * 1024) {
      setUploadError("ছবির সাইজ ১২ মেগাবাইটের কম হতে হবে।");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("section_key", sectionKey);
      if (altValue) formData.append("alt_text", altValue);

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        onChange(data.url);
      } else {
        setUploadError(data.error || "আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      }
    } catch (err: any) {
      setUploadError("নেটওয়ার্ক ত্রুটি। আবার চেষ্টা করুন।");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > 12 * 1024 * 1024) {
      setUploadError("ছবির সাইজ ১২ মেগাবাইটের কম হতে হবে।");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("section_key", sectionKey);
      if (altValue) formData.append("alt_text", altValue);

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        onChange(data.url);
      } else {
        setUploadError(data.error || "আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      }
    } catch (err: any) {
      setUploadError("নেটওয়ার্ক ত্রুটি। আবার চেষ্টা করুন।");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700">{label}</label>
        <button
          type="button"
          onClick={() => setShowManualUrl(!showManualUrl)}
          className="text-[11px] text-[#ff3f60] hover:underline cursor-pointer"
        >
          {showManualUrl ? "ছবি প্রিভিউ মোড" : "URL সরাসরি লিখুন"}
        </button>
      </div>

      {helperText && <p className="text-[11px] text-gray-500">{helperText}</p>}

      {/* Manual URL Input */}
      {showManualUrl ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... বা /images/..."
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#ff3f60] outline-none"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
              title="রিমুভ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* Image Preview + Dropzone */
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="p-3 border-2 border-dashed border-gray-200 hover:border-[#ff3f60]/50 rounded-2xl bg-gray-50/70 transition-colors"
        >
          {value ? (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-xs shrink-0 flex items-center justify-center">
                <img
                  src={value}
                  alt={altValue || "প্রিভিউ"}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/product-bottle-main.png";
                  }}
                />
              </div>

              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-gray-500 truncate max-w-[200px]" title={value}>
                    {value.startsWith("http") ? value.split("/").pop() : value}
                  </span>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700">
                    <Check className="w-3 h-3" /> সিলেক্টেড
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isUploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ff3f60]" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-gray-500" />
                    )}
                    <span>{isUploading ? "আপলোড হচ্ছে..." : "ছবি পরিবর্তন করুন"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChange("")}
                    disabled={isUploading}
                    className="px-3 py-1.5 rounded-lg bg-white border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>রিমুভ</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto mb-2 text-gray-400">
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-[#ff3f60]" />
                ) : (
                  <ImageIcon className="w-5 h-5" />
                )}
              </div>
              <p className="text-xs font-semibold text-gray-700 mb-0.5">
                {isUploading ? "ছবি আপলোড হচ্ছে..." : "নতুন ছবি নির্বাচন করুন বা ড্র্যাগ করে ছাড়ুন"}
              </p>
              <p className="text-[11px] text-gray-400 mb-3">PNG, JPG, WebP বা AVIF (সর্বোচ্চ ১২ MB)</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#ff3f60] to-[#ff783e] text-white text-xs font-semibold shadow-xs hover:opacity-95 cursor-pointer disabled:opacity-50"
              >
                ডিভাইস থেকে ছবি আপলোড
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* Alt Text Input */}
      {onAltChange && (
        <div className="pt-1">
          <label className="block text-[11px] text-gray-500 mb-1">ছবির বিবরণ / Alt Text (SEO)</label>
          <input
            type="text"
            value={altValue || ""}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="ছবির বর্ণনা দিন..."
            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white focus:ring-1 focus:ring-[#ff3f60] outline-none"
          />
        </div>
      )}

      {uploadError && <p className="text-xs text-red-600 font-medium">{uploadError}</p>}
    </div>
  );
}
