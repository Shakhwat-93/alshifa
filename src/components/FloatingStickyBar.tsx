"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingBag, MessageCircle } from "lucide-react";

export default function FloatingStickyBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-2xl p-2 md:hidden animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Left: Thumbnail & Price */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative w-9 h-9 rounded-lg bg-[#fafaf8] border border-stone-200 p-0.5 shrink-0 overflow-hidden">
            <Image
              src="/images/product-bottle-main.png"
              alt="Shifa Oil"
              fill
              sizes="36px"
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-stone-900 truncate">
              শিফা পেইন কেয়ার
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-black text-emerald-800 font-latin">৳950</span>
              <span className="text-[10px] text-stone-400 line-through font-latin">৳1,450</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href="https://wa.me/8809638014666?text=%E0%A6%86%E0%A6%B8%E0%A6%B8%E0%A6%BE%E0%A6%BA%E0%A6%BE%E0%A6%AE%E0%A7%81%20%E0%A6%86%E0%A6%B2%E0%A6%BE%E0%A6%87%E0%A6%95%E0%A7%81%E0%A6%AE%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A6%B6%E0%A6%BF%E0%A6%AB%E0%A6%BE%20%E0%A6%AA%E0%A7%87%E0%A6%87%E0%A6%A8%20%E0%A6%95%E0%A7%87%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%B0%20%E0%A6%85%E0%A6%AF%E0%A6%BC%E0%A7%87%E0%A6%B2%20%E0%A6%B8%E0%A6%AE%E0%A7%8D%E0%A6%AA%E0%A6%B0%E0%A7%8D%E0%A6%95%E0%A7%87%20%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4"
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0 transition"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-600 text-white" />
          </a>

          <a
            href="#order-section"
            className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-lg shadow-sm active:scale-95 transition"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>অর্ডার করুন</span>
          </a>
        </div>
      </div>
    </div>
  );
}
