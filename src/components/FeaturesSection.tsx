"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Zap,
  Activity,
  ShieldCheck,
  Clock,
  Moon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "ত্বকের গভীরে দ্রুত শোষণ",
    desc: "মালিশের সাথে সাথে তেলের নির্যাস চামড়া ভেদ করে পেশীর গভীরে প্রবেশ করে ব্যথার অনুভূতি স্তিমিত করে।",
  },
  {
    icon: Activity,
    title: "স্বাভাবিক রক্ত চলাচল বৃদ্ধি",
    desc: "আক্রান্ত স্থানের জমাট রক্ত ও স্নায়ুর চাপ স্বাভাবিক করে পেশীতে দ্রুত অক্সিজেন ও পুষ্টি পৌঁছে দেয়।",
  },
  {
    icon: CheckCircle2,
    title: "হাঁটু ও জয়েন্টের গতিশীলতা",
    desc: "বাতের ব্যথা ও জয়েন্টের আড়ষ্টতা দূর করে যাতে সহজেই নামাজ পড়া, বসা থেকে ওঠা এবং সিঁড়ি বাওয়া সম্ভব হয়।",
  },
  {
    icon: Moon,
    title: "রাতে নিশ্চিন্ত আরামদায়ক ঘুম",
    desc: "ঘুমানোর আগে কোমর বা ঘাড়ে ম্যাসাজ করলে পেশী শিথিল হয়ে যায় এবং রাতের গভীর ব্যথামুক্ত ঘুম নিশ্চিত হয়।",
  },
  {
    icon: ShieldCheck,
    title: "১০০% প্রাকৃতিক ও নিরাপদ",
    desc: "কোনো প্রকার স্টেরয়েড বা রাসায়নিক উপাদান নেই। চর্মরোগ বা চামড়ায় কোনো ধরনের অ্যালার্জির ভয় নেই।",
  },
  {
    icon: Clock,
    title: "প্রতিদিন মাত্র ৫-১০ মিনিট",
    desc: "ঝামেলাহীন ব্যবহারের নিয়ম। পরিবারের যে কেউ ঘরে বসেই খুব সহজে এটি নিয়ম মেনে ব্যবহার করতে পারেন।",
  },
];

export default function FeaturesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Auto-slide on mobile every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % benefits.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % benefits.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? benefits.length - 1 : prev - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setIsPaused(false);
  };

  return (
    <section className="py-8 sm:py-14 md:py-16 lg:py-20 bg-[#fafaf8] border-b border-stone-200/70">
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center max-w-3xl lg:max-w-4xl mx-auto mb-6 sm:mb-10 lg:mb-12">
          <span className="text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full inline-block">
            সুফল ও উপকারিতা
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-snug">
            ব্যথামুক্ত জীবনের জন্য{" "}
            <span className="text-emerald-800">শিফা কেয়ারের অনন্য কার্যকারিতা</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-stone-600">
            নিয়মিত ম্যাসাজের মাধ্যমে শরীর ফিরে পাবে তার স্বাভাবিক সচলতা ও প্রাণশক্তি:
          </p>
        </div>

        {/* ================= MOBILE SLIDER (sm:hidden) ================= */}
        <div className="block sm:hidden">
          <div
            className="overflow-hidden relative touch-pan-y rounded-2xl"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {benefits.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="w-full shrink-0 px-1">
                    <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-soft flex flex-col justify-between min-h-[190px]">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 shadow-2xs">
                          <Icon className="w-5 h-5 text-emerald-700" />
                        </div>
                        <h3 className="text-sm font-bold text-stone-900 mb-1.5 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-stone-600 leading-relaxed font-normal">
                          {item.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-medium">
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <span>প্রাকৃতিক কার্যকারিতা</span>
                        </span>
                        <span className="font-latin">{idx + 1} / {benefits.length}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Slider Controls: Prev / Dots / Next */}
          <div className="flex items-center justify-between mt-4 px-2">
            <button
              onClick={handlePrev}
              aria-label="পূর্ববর্তী সুফল"
              className="w-8 h-8 rounded-full bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200 flex items-center justify-center transition active:scale-95 shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {benefits.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`উপকারিতা ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === i
                      ? "w-6 bg-emerald-700"
                      : "w-2 bg-stone-300 hover:bg-stone-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="পরবর্তী সুফল"
              className="w-8 h-8 rounded-full bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200 flex items-center justify-center transition active:scale-95 shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= DESKTOP & TABLET GRID (hidden sm:grid) ================= */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-6">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl border border-stone-200/80 shadow-soft hover:border-emerald-300 transition"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-1.5 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
