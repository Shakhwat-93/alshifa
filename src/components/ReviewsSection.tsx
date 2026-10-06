"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Star, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  {
    name: "রহিমা খাতুন",
    location: "রাজশাহী",
    comment:
      "কোমরের ব্যথায় রাতে ঘুমানোর আগে ম্যাসাজ করি, বেশ আরাম পাই। তেলের গন্ধটাও ভালো লেগেছে।",
    avatar: "/images/review-rahima-khatun.avif",
  },
  {
    name: "মোঃ আব্দুল করিম",
    location: "নাটোর",
    comment:
      "আম্মার হাঁটুর ব্যথার জন্য নিয়েছিলাম। নিয়মিত ম্যাসাজ করে দিচ্ছি, উনি বেশ আরাম পাচ্ছেন।",
    avatar: "/images/review-abdul-karim.jpg",
  },
  {
    name: "মোঃ সাকিব হোসেন",
    location: "মিরপুর, ঢাকা",
    comment:
      "অফিস শেষে ঘাড়ে আর কাঁধে হালকা ম্যাসাজ করলে ক্লান্তি অনেকটাই কমে যায়। বেশ কার্যকর।",
    avatar: "/images/review-sakib-hossain.jpg",
  },
  {
    name: "তানভীর হাসান",
    location: "চট্টগ্রাম",
    comment:
      "খেলাধুলার পর পেশীর অস্বস্তিতে ব্যবহার করি, ভালো লাগে। ডেলিভারিও তাড়াতাড়ি পেয়েছি।",
    avatar: "/images/review-tanvir-hasan.jpg",
  },
  {
    name: "মোঃ জাহিদুল ইসলাম",
    location: "বগুড়া",
    comment:
      "আব্বার পায়ের ব্যথায় প্রতিদিন ম্যাসাজ করে দেই, উনি আরাম পান। আবার অর্ডার করব ইনশাআল্লাহ।",
    avatar: "/images/review-zahidul-islam.jpg",
  },
];

export default function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Auto-slide on mobile every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
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
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center max-w-3xl lg:max-w-4xl mx-auto mb-6 sm:mb-8 lg:mb-12">
          <span className="text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full inline-block">
            গ্রাহক মতামত
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-snug">
            আমাদের সন্তুষ্ট ক্রেতাদের{" "}
            <span className="text-emerald-800">বাস্তব অভিজ্ঞতা</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-stone-600">
            নিয়মিত ব্যবহারকারী গ্রাহকরা যা বলছেন:
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
              {reviews.map((rev, idx) => (
                <div key={idx} className="w-full shrink-0 px-1">
                  <div className="bg-[#fafaf8] rounded-2xl p-5 border border-stone-200/90 shadow-soft flex flex-col justify-between min-h-[220px]">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400 shrink-0 shadow-sm">
                          <Image
                            src={rev.avatar}
                            alt={rev.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-stone-900 text-sm leading-tight">
                            {rev.name}
                          </h4>
                          <p className="text-xs text-stone-500 font-medium">
                            {rev.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 mb-2.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>

                      <p className="text-xs text-stone-700 leading-relaxed font-normal">
                        “{rev.comment}”
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-emerald-800 text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>ভেরিফাইড পারচেজ</span>
                      </div>
                      <span className="text-[11px] text-stone-400 font-latin">
                        {idx + 1} / {reviews.length}
                      </span>
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
              aria-label="আগের রিভিউ"
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200 flex items-center justify-center transition active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`রিভিউ ${i + 1}`}
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
              aria-label="পরের রিভিউ"
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200 flex items-center justify-center transition active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= DESKTOP & TABLET GRID (hidden sm:grid) ================= */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-4.5">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-[#fafaf8] rounded-xl p-4 sm:p-4.5 border border-stone-200/80 shadow-soft flex flex-col justify-between hover:border-emerald-300 transition"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-emerald-300 shrink-0">
                    <Image
                      src={rev.avatar}
                      alt={rev.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm leading-tight">
                      {rev.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 font-medium">
                      {rev.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 mb-2 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                  “{rev.comment}”
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-stone-200/60 flex items-center gap-1 text-emerald-800 text-[10px] sm:text-[11px] font-semibold">
                <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>ভেরিফাইড পারচেজ</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
