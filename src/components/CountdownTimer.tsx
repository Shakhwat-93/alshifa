"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 33,
    seconds: 40,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-soft max-w-md mx-auto">
      <div className="flex items-center justify-between text-xs sm:text-sm text-stone-600 mb-3">
        <span className="font-bold text-emerald-800 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-emerald-700" />
          <span>অফার শেষ হতে বাকি:</span>
        </span>
        <span className="text-red-600 font-bold">আজ রাত ১২টা পর্যন্ত</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
        <div className="bg-stone-900 text-white rounded-xl py-2.5 px-2">
          <div className="text-xl sm:text-2xl font-black font-latin">
            {formatNum(timeLeft.hours)}
          </div>
          <div className="text-[10px] sm:text-xs text-stone-400 mt-0.5">ঘণ্টা</div>
        </div>
        <div className="bg-stone-900 text-white rounded-xl py-2.5 px-2">
          <div className="text-xl sm:text-2xl font-black font-latin">
            {formatNum(timeLeft.minutes)}
          </div>
          <div className="text-[10px] sm:text-xs text-stone-400 mt-0.5">মিনিট</div>
        </div>
        <div className="bg-stone-900 text-white rounded-xl py-2.5 px-2">
          <div className="text-xl sm:text-2xl font-black text-amber-400 font-latin">
            {formatNum(timeLeft.seconds)}
          </div>
          <div className="text-[10px] sm:text-xs text-amber-400 mt-0.5">সেকেন্ড</div>
        </div>
      </div>
    </div>
  );
}
