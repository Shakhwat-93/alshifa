"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Flame,
  Clock,
  Star,
} from "lucide-react";

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="pt-4 pb-8 sm:pt-8 sm:pb-14 md:py-16 lg:py-20 bg-white border-b border-stone-200/70">
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Top Trust Pill */}
        <div className="text-center mb-3 sm:mb-4 lg:mb-6">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200/90 px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs lg:text-sm font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
            <span>২৭টি দুর্লভ ভেষজ উপাদানের সংমিশ্রণ • ল্যাব অনুমোদিত</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.3] sm:leading-[1.25]">
            হাঁটু, কোমর আর জয়েন্টের তীব্র ব্যথায়{" "}
            <span className="text-rose-600 font-black">
              প্রতিদিন কষ্ট পাচ্ছেন?
            </span>
          </h1>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base md:text-lg lg:text-xl text-stone-600 font-normal leading-relaxed max-w-2xl lg:max-w-3xl mx-auto">
            পেইনকিলার খেয়ে সাময়িক আরাম নয়; ঘরে বসেই মাত্র <strong className="text-emerald-800 font-bold">১০ মিনিটের সহজ ম্যাসাজে</strong> প্রকৃতির ছোঁয়ায় ব্যথামুক্ত স্বাভাবিক জীবনের আরামদায়ক স্বস্তি পান।
          </p>
        </div>

        {/* Main Product Showcase Card - Fluid Responsive */}
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto bg-[#fafaf8] rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 shadow-soft mb-6 sm:mb-8 lg:mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 lg:gap-12 items-center">
            {/* Left: Product Image */}
            <div className="md:col-span-5 lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[260px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[420px] xl:max-w-[460px] aspect-square rounded-2xl bg-white p-4 sm:p-6 border border-stone-200/70 flex items-center justify-center shadow-xs">
                <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded shadow-xs">
                  ৫০% ছাড়
                </div>
                <div className="relative w-full h-full">
                  <Image
                    src="/images/product-bottle-main.png"
                    alt="শিফা পেইন কেয়ার অয়েল বোতল"
                    fill
                    sizes="(max-width: 640px) 260px, (max-width: 1024px) 360px, 460px"
                    priority
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Right: Offer Details & CTA */}
            <div className="md:col-span-7 lg:col-span-7 flex flex-col justify-center">
              {/* Limited Stock Notice */}
              <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-300/80 text-amber-900 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-lg mb-3 w-fit">
                <Flame className="w-4 h-4 text-orange-600 shrink-0" />
                <span>স্টক সীমিত: আজকের অফারে আর মাত্র ১৭টি বোতল বাকি!</span>
              </div>

              <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-stone-900 mb-2 leading-snug">
                শিফা পেইন কেয়ার অয়েল (১০০% অরিজিনাল)
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-stone-600 mb-4 sm:mb-6 leading-relaxed">
                কালোজিরার তেল, ক্যাস্টর অয়েল, আদা ও আকন্দ পাতার বিশেষ নির্যাস ত্বকের গভীরে প্রবেশ করে দ্রুত রক্ত সঞ্চালন স্বাভাবিক করে এবং পেশীর আড়ষ্টতা দূর করে।
              </p>

              {/* Countdown Timer */}
              <div className="bg-white border border-stone-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex items-center justify-between text-[11px] sm:text-xs text-stone-500 mb-2">
                  <span className="font-semibold text-emerald-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> অফার শেষ হতে বাকি:
                  </span>
                  <span className="text-red-600 font-bold">আজ রাত ১২টা পর্যন্ত</span>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                  <div className="bg-stone-900 text-white rounded-lg py-2 px-2 sm:px-3">
                    <div className="text-base sm:text-xl lg:text-2xl font-black font-latin">
                      {formatNum(timeLeft.hours)}
                    </div>
                    <div className="text-[9px] sm:text-xs text-stone-400">ঘণ্টা</div>
                  </div>
                  <div className="bg-stone-900 text-white rounded-lg py-2 px-2 sm:px-3">
                    <div className="text-base sm:text-xl lg:text-2xl font-black font-latin">
                      {formatNum(timeLeft.minutes)}
                    </div>
                    <div className="text-[9px] sm:text-xs text-stone-400">মিনিট</div>
                  </div>
                  <div className="bg-stone-900 text-white rounded-lg py-2 px-2 sm:px-3">
                    <div className="text-base sm:text-xl lg:text-2xl font-black text-amber-400 font-latin">
                      {formatNum(timeLeft.seconds)}
                    </div>
                    <div className="text-[9px] sm:text-xs text-amber-400">সেকেন্ড</div>
                  </div>
                </div>
              </div>

              {/* Price & Primary CTA */}
              <div className="space-y-3">
                <div className="flex items-baseline gap-2.5 sm:gap-3">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-800 font-latin">
                    ৳950
                  </span>
                  <span className="text-sm sm:text-base lg:text-lg text-stone-400 line-through font-latin">
                    ৳1,450
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded">
                    ৳৫০০ সাশ্রয়
                  </span>
                </div>

                <a
                  href="#order-section"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-sm sm:text-base lg:text-lg py-3.5 sm:py-4 lg:py-4.5 px-6 rounded-xl shadow-cta transition active:scale-[0.98] animate-cta-pulse cursor-pointer"
                >
                  <span>অর্ডার করতে এখানে ক্লিক করুন</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>

                <p className="text-center text-[11px] sm:text-xs lg:text-sm text-stone-500 font-medium">
                  🔒 ক্যাশ অন ডেলিভারি • পণ্য হাতে পেয়ে দেখে টাকা দিবেন
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Trust Badges - 2x2 on Mobile, 4 Cols on Tablet/Desktop/Large */}
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-5 text-left">
          <div className="bg-white p-3 sm:p-3.5 lg:p-4 rounded-xl border border-stone-200/80 shadow-soft flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-stone-900 truncate">১০০% গ্যারান্টি</p>
              <p className="text-[10px] sm:text-xs text-stone-500 truncate">ল্যাব টেস্ট অনুমোদিত</p>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-3.5 lg:p-4 rounded-xl border border-stone-200/80 shadow-soft flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-stone-900 truncate">ফ্রি ডেলিভারি</p>
              <p className="text-[10px] sm:text-xs text-stone-500 truncate">সারা দেশে দ্রুত হোম ডেলিভারি</p>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-3.5 lg:p-4 rounded-xl border border-stone-200/80 shadow-soft flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-stone-900 truncate">ক্যাশ অন ডেলিভারি</p>
              <p className="text-[10px] sm:text-xs text-stone-500 truncate">আগে পণ্য দেখুন</p>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-3.5 lg:p-4 rounded-xl border border-stone-200/80 shadow-soft flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-teal-600 text-teal-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-stone-900 truncate">৪.৯ রেটিং</p>
              <p className="text-[10px] sm:text-xs text-stone-500 truncate">হাজারো সন্তুষ্ট গ্রাহক</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
