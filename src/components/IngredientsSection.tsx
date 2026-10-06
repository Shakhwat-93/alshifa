"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const ingredients = [
  { name: "ক্যাস্টর অয়েল", benefit: "গভীর প্রদাহ ও বাতের ব্যথা প্রশমিত করে" },
  { name: "কালোজিরার তেল", benefit: "প্রাকৃতিক অ্যান্টিঅক্সিডেন্ট ও জয়েন্ট সচলকারী" },
  { name: "আদার নির্যাস", benefit: "রক্ত সঞ্চালন দ্রুত বাড়ায় ও ফোলাভাব কমায়" },
  { name: "রসুনের নির্যাস", benefit: "প্রাকৃতিক অ্যান্টি-ইনফ্ল্যামেটরি উপাদান" },
  { name: "লবঙ্গের নির্যাস", benefit: "তীব্র ব্যথায় প্রাকৃতিক অবশকারী অনুভূতি দেয়" },
  { name: "দারুচিনি", benefit: "পেশীর আড়ষ্টতা ও জড়তা দূর করতে সাহায্য করে" },
  { name: "অ্যালোভেরা", benefit: "ত্বক মসৃণ রাখে ও দ্রুত শোষণ নিশ্চিত করে" },
  { name: "আকন্দ পাতার নির্যাস", benefit: "প্রাচীনকাল থেকেই বাতের ব্যথায় অত্যন্ত কার্যকর" },
  { name: "নিমপাতার নির্যাস", benefit: "চামড়ার সুরক্ষা ও অ্যান্টি-ব্যাকটেরিয়াল গুণ" },
  { name: "হলুদের নির্যাস", benefit: "প্রদাহ নিরাময় ও টিস্যু সুস্থ রাখতে সহায়ক" },
  { name: "ক্যাপসাইসিন", benefit: "ব্যথার স্নায়বিক সংকেত কমিয়ে আরাম দেয়" },
  { name: "ইউক্যালিপটাস তেল", benefit: "রিফ্রেশিং অনুভূতি ও পেশী রিল্যাক্সেশন" },
  { name: "মেনথল", benefit: "ত্বকে তাৎক্ষণিক শীতল প্রশান্তি বয়ে আনে" },
  { name: "পেপারমিন্ট তেল", benefit: "দীর্ঘস্থায়ী আরাম ও সতেজ অনুভূতি দেয়" },
];

export default function IngredientsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Group ingredients into pairs for mobile display (2 cards per slide)
  const ingredientPairs: (typeof ingredients)[] = [];
  for (let i = 0; i < ingredients.length; i += 2) {
    ingredientPairs.push(ingredients.slice(i, i + 2));
  }

  const totalSlides = ingredientPairs.length;

  // Auto-slide on mobile every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
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
        <div className="text-center max-w-3xl lg:max-w-4xl mx-auto mb-6 sm:mb-8 lg:mb-10">
          <span className="text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>বিশুদ্ধ প্রাকৃতিক উপাদান</span>
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-snug">
            ২৭টি দুর্লভ ভেষজ উপাদানের সমন্বয়ে{" "}
            <span className="text-emerald-800">বিশেষ ফর্মুলেশন</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-stone-600">
            সম্পূর্ণ রাসায়নিকমুক্ত ও প্রাকৃতিক উপায়ে সংগৃহীত ভেষজের সমন্বয়ে তৈরি:
          </p>
        </div>

        {/* Showcase Banner - Hidden on mobile as requested, Visible on Tablet & Desktop */}
        <div className="hidden sm:block mb-6 sm:mb-8 lg:mb-10 rounded-2xl overflow-hidden border border-stone-200 shadow-soft bg-stone-100">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/9] w-full">
            <Image
              src="/images/herbal-ingredients-showcase.png"
              alt="শিফা পেইন কেয়ার অয়েল ভেষজ উপাদান"
              fill
              sizes="(max-width: 1024px) 100vw, 1536px"
              className="object-cover"
            />
          </div>
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
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {ingredientPairs.map((pair, pairIdx) => (
                <div key={pairIdx} className="w-full shrink-0 px-1">
                  <div className="space-y-3">
                    {pair.map((item, itemIdx) => {
                      const globalIdx = pairIdx * 2 + itemIdx + 1;
                      return (
                        <div
                          key={itemIdx}
                          className="bg-[#fafaf8] border border-emerald-200/90 p-4 rounded-xl flex items-start gap-3 shadow-soft hover:border-emerald-400 transition"
                        >
                          <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 font-latin shadow-2xs">
                            {globalIdx}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-stone-900 text-sm">
                              {item.name}
                            </h4>
                            <p className="text-xs text-stone-600 leading-relaxed mt-0.5">
                              {item.benefit}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Controls: Prev / Dots / Next */}
          <div className="flex items-center justify-between mt-4 px-2">
            <button
              onClick={handlePrev}
              aria-label="পূর্ববর্তী উপাদান"
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200 flex items-center justify-center transition active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {ingredientPairs.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  aria-label={`স্লাইড ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === i
                      ? "w-6 bg-emerald-700"
                      : "w-2 bg-stone-300 hover:bg-stone-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="পরবর্তী উপাদান"
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200 flex items-center justify-center transition active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= DESKTOP & TABLET GRID (hidden sm:grid) ================= */}
        <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2.5 sm:gap-3 lg:gap-3.5">
          {ingredients.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#fafaf8] border border-stone-200/80 p-3 rounded-xl flex items-start gap-2.5 hover:border-emerald-300 transition"
            >
              <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 font-latin">
                {idx + 1}
              </span>
              <div className="min-w-0">
                <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                  {item.name}
                </h4>
                <p className="text-[10px] sm:text-xs text-stone-500 leading-tight mt-0.5">
                  {item.benefit}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
