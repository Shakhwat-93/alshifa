import React from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-soft">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-14 sm:h-16 lg:h-20 flex items-center justify-between">
        {/* Brand Logo Only */}
        <a href="#" className="flex items-center group" aria-label="শিফা কেয়ার হোম">
          <div className="relative h-11 w-11 sm:h-13 sm:w-13 lg:h-15 lg:w-15 shrink-0 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/images/shifa-logo.png"
              alt="শিফা পেইন কেয়ার অয়েল লোগো"
              fill
              sizes="(max-width: 640px) 44px, (max-width: 1024px) 52px, 60px"
              priority
              className="object-contain"
            />
          </div>
        </a>

        {/* Order Now Button */}
        <div>
          <a
            href="#order-section"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm lg:text-base px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg shadow-sm transition-all duration-200 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>অর্ডার করুন</span>
          </a>
        </div>
      </div>
    </header>
  );
}
