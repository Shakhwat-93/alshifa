import React from "react";
import { PhoneCall, ShoppingBag } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-soft">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-14 sm:h-16 lg:h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-base sm:text-lg lg:text-xl shadow-xs">
            শ
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-xl lg:text-2xl font-bold text-stone-900 leading-none">
                শিফা কেয়ার
              </span>
              <span className="text-[10px] sm:text-xs font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded leading-none">
                অরিজিনাল
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-500 font-medium leading-tight mt-0.5">
              Shifa Pain Care Oil • ১০০% প্রাকৃতিক ভেষজ
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <a
            href="tel:09638014666"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg transition"
          >
            <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700" />
            <span className="font-latin text-[11px] sm:text-xs lg:text-sm font-bold">09638014666</span>
          </a>

          <a
            href="#order-section"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm lg:text-base px-3.5 sm:px-5 lg:px-6 py-1.5 sm:py-2.5 rounded-lg shadow-sm transition active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>অর্ডার করুন</span>
          </a>
        </div>
      </div>
    </header>
  );
}
