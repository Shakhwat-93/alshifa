"use client";

import React, { useState, useEffect, useRef } from "react";
import { Moon, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

const steps = [
  {
    step: "1",
    title: "পরিমাণমতো তেল নিন",
    desc: "হাঁটু, কোমর বা ব্যথাযুক্ত জায়গায় কয়েক ফোঁটা শিফা পেইন কেয়ার অয়েল আলতোভাবে ঢেলে নিন।",
  },
  {
    step: "2",
    title: "৫-১০ মিনিট ম্যাসাজ করুন",
    desc: "হাতের তালু দিয়ে বৃত্তাকারে আলতো চাপে ৫-১০ মিনিট ম্যাসাজ করুন যেন তেলটি চামড়ার ভেতরে শোষিত হয়।",
  },
  {
    step: "3",
    title: "দিনে ২ বার প্রয়োগ",
    desc: "দিনে ১-২ বার ব্যবহার করুন। বিশেষ করে রাতে ঘুমানোর আগে ব্যবহার করলে রাতে শরীর ব্যথামুক্ত রিল্যাক্স থাকে।",
  },
];

export default function UsageSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Auto-slide on mobile every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % steps.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % steps.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
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
    <section className="py-8 sm:py-14 md:py-16 lg:py-20 bg-white border-b border-stone-200/70">
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center max-w-3xl lg:max-w-4xl mx-auto mb-6 sm:mb-8 lg:mb-12">
          <span className="text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full inline-block">
            ব্যবহারের নিয়ম
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-snug">
            ব্যবহারের ৩টি সহজ ধাপ{" "}
            <span className="text-emerald-800">— প্রতিদিন মাত্র ১০ মিনিট</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-stone-600">
            সেরা ফলাফল পেতে নিচের নিয়মে প্রতিদিন মালিশ করুন:
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
              {steps.map((item, idx) => (
                <div key={idx} className="w-full shrink-0 px-1">
                  <div className="bg-[#fafaf8] p-5 rounded-2xl border border-emerald-200/90 shadow-soft flex flex-col justify-between min-h-[190px]">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-9 h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shrink-0 font-latin shadow-2xs">
                          {item.step}
                        </span>
                        <h3 className="text-sm font-bold text-stone-900 leading-snug">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-400 font-medium">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>সহজ নিয়ম</span>
                      </span>
                      <span className="font-latin">{idx + 1} / {steps.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Controls: Prev / Dots / Next */}
          <div className="flex items-center justify-between mt-4 px-2">
            <button
              onClick={handlePrev}
              aria-label="পূর্ববর্তী ধাপ"
              className="w-8 h-8 rounded-full bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200 flex items-center justify-center transition active:scale-95 shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`ধাপ ${i + 1}`}
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
              aria-label="পরবর্তী ধাপ"
              className="w-8 h-8 rounded-full bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200 flex items-center justify-center transition active:scale-95 shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= DESKTOP & TABLET GRID (hidden sm:grid) ================= */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {steps.map((item, idx) => (
            <div key={idx} className="bg-[#fafaf8] p-5 sm:p-6 lg:p-7 rounded-2xl border border-stone-200/80 shadow-soft">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs sm:text-sm mb-3 font-latin">
                {item.step}
              </span>
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-stone-900 mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Home Tip Box */}
        <div className="mt-6 sm:mt-8 bg-amber-50/80 border border-amber-200 p-4 rounded-xl flex items-start gap-3 max-w-2xl lg:max-w-3xl mx-auto">
          <Moon className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-normal">
            <strong>পরামর্শ:</strong> ম্যাসাজের পর আক্রান্ত স্থানে কিছুক্ষণ বাতাস না লাগিয়ে হালকা সুতি কাপড় জড়িয়ে রাখলে তেলটি দ্রুত কাজ করে।
          </p>
        </div>
      </div>
    </section>
  );
}
