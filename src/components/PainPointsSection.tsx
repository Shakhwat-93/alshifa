"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowDown, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

const problems = [
  {
    num: "০১",
    title: "সকালে ঘুম থেকে উঠলে শরীর ও জয়েন্ট শক্ত হয়ে থাকা",
    desc: "ঘুম থেকে উঠলেই কোমর, হাঁটু বা পিঠ জ্যাম হয়ে থাকে। সোজা হয়ে দাঁড়াতে বা কয়েক কদম হাঁটতে বেশ সময় লাগে এবং দিনটাই শুরু হয় অসহ্য যন্ত্রণা দিয়ে।",
  },
  {
    num: "০২",
    title: "অফিসে বা ডেস্কে একটানা বসে থাকার পর কোমর ও ঘাড় ব্যথা",
    desc: "চেয়ারে টানা ২-৩ ঘণ্টা বসে কাজ করলেই মেরুদণ্ডের নিচের দিকে চিনচিনে ব্যথা শুরু হয়, ঘাড়ে অবশ ভাব আসে এবং কাজের মনোযোগ নষ্ট হয়ে যায়।",
  },
  {
    num: "০৩",
    title: "সিঁড়ি দিয়ে উঠতে গেলে বা নামাজ পড়তে বসলে হাঁটুতে চাপ",
    desc: "সিঁড়ি ভাঙার সময় হাঁটুতে কট-কট শব্দ অনুভূত হয়, তীব্র টান লাগে এবং বয়সের আগেই হাঁটু ক্ষয়ে যাওয়ার গভীর দুশ্চিন্তা তৈরি হয়।",
  },
  {
    num: "০৪",
    title: "সামান্য নিচু হতে গেলে বা ওজন তুলতে গেলে পেশীতে টান",
    desc: "শরীরের নমনীয়তা কমে যাওয়ায় একটু ঝুঁকলেই কোমর বা পিঠের মাংসপেশী আড়ষ্ট হয়ে তীব্র ব্যথার সৃষ্টি করে।",
  },
  {
    num: "০৫",
    title: "পুরনো আঘাত, মচকানো বা লিগামেন্টের দীর্ঘস্থায়ী কষ্ট",
    desc: "কখনো পা মচকানো বা পুরনো কোনো আঘাতের ব্যথা যা অনেকদিন আগের হলেও শীতকালে বা বৃষ্টির দিনে আবার নতুন করে মাথাচাড়া দিয়ে ওঠে।",
  },
  {
    num: "০৬",
    title: "দিনের পর দিন পেইনকিলার খেয়ে লিভার ও কিডনির ঝুঁকি",
    desc: "ব্যথা সহ্য করতে না পেরে বারবার ব্যথানাশক ট্যাবলেট খেয়ে হয়তো সাময়িক আরাম পান, কিন্তু এর ক্ষতিকর পার্শ্বপ্রতিক্রিয়া আপনার শরীরের অপূরণীয় ক্ষতি করছে।",
  },
];

export default function PainPointsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Auto-slide on mobile every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % problems.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % problems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? problems.length - 1 : prev - 1));
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
    <section className="py-8 sm:py-14 md:py-16 lg:py-20 bg-[#f8f8f6] border-b border-stone-200/70">
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl lg:max-w-4xl mx-auto mb-6 sm:mb-10 lg:mb-12">
          <span className="inline-block text-rose-700 font-bold text-xs uppercase tracking-wider mb-2 bg-rose-50 border border-rose-200/80 px-3 py-0.5 rounded-full">
            সতর্ক সংকেত
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-snug">
            আপনিও কি এই সাধারণ সমস্যাগুলোতে{" "}
            <span className="text-rose-600 underline decoration-rose-300 underline-offset-4">
              প্রতিদিন ভুগছেন?
            </span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-stone-600">
            সমস্যাগুলো সামান্য মনে হলেও অবহেলা করলে পরবর্তীতে বড় ধরণের স্থায়ী বাতের কারণ হতে পারে:
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
              {problems.map((item, idx) => (
                <div key={idx} className="w-full shrink-0 px-1">
                  <div className="bg-white p-5 rounded-2xl border border-rose-200/90 shadow-soft flex flex-col justify-between min-h-[190px]">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-sm shrink-0 font-latin border border-rose-200 shadow-2xs">
                          {item.num}
                        </span>
                        <h3 className="text-sm font-bold text-stone-900 leading-snug">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-medium">
                      <span className="text-rose-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>দৈনন্দিন কষ্ট</span>
                      </span>
                      <span className="font-latin">{idx + 1} / {problems.length}</span>
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
              aria-label="পূর্ববর্তী সমস্যা"
              className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-200 flex items-center justify-center transition active:scale-95 shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {problems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`সমস্যা ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === i
                      ? "w-6 bg-rose-600"
                      : "w-2 bg-stone-300 hover:bg-stone-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="পরবর্তী সমস্যা"
              className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-200 flex items-center justify-center transition active:scale-95 shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= DESKTOP & TABLET GRID (hidden sm:grid) ================= */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-6">
          {problems.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl border border-stone-200/80 shadow-soft hover:border-rose-300 transition flex items-start gap-3.5"
            >
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 font-latin border border-rose-100">
                {item.num}
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-1.5 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Transition callout */}
        <div className="mt-8 text-center">
          <p className="text-xs sm:text-sm text-stone-600 font-medium inline-flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl border border-stone-200 shadow-soft">
            <span>তাহলে ব্যথার প্রকৃত কারণ কী এবং স্থায়ী সমাধান কীভাবে সম্ভব?</span>
            <ArrowDown className="w-4 h-4 text-emerald-700 animate-bounce" />
          </p>
        </div>
      </div>
    </section>
  );
}
