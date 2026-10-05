import React from "react";
import { Check, X, ArrowRight, HeartPulse } from "lucide-react";

export default function RootCauseSection() {
  return (
    <section className="py-8 sm:py-14 md:py-16 lg:py-20 bg-white border-b border-stone-200/70">
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="bg-[#043327] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 text-white shadow-card">
          <div className="max-w-3xl mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-1.5 text-emerald-300 font-bold text-xs sm:text-sm mb-2.5">
              <HeartPulse className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              ব্যথার পেছনের বৈজ্ঞানিক কারণ
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-snug mb-3">
              ব্যথার মূল কারণ কী এবং কেন পেইনকিলারে{" "}
              <span className="text-amber-400">স্থায়ী মুক্তি মেলে না?</span>
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm md:text-base leading-relaxed font-normal">
              বয়স বা অতিরিক্ত চাপের কারণে আমাদের জয়েন্টের মধ্যকার সাইনোভিয়াল ফ্লুইড (লুব্রিকেন্ট) কমে যায় এবং চারপাশের পেশী সংকুচিত হয়ে রক্তনালী চেপে ধরে। ফলে রক্ত চলাচল বাধাগ্রস্ত হয়ে তীব্র ব্যথার সৃষ্টি হয়।
            </p>
          </div>

          {/* Comparison Cards - 1 col on mobile, 2 col on tablet/desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-4 sm:p-5 lg:p-6">
              <div className="flex items-center gap-2 text-red-300 font-bold text-xs sm:text-sm lg:text-base mb-1.5">
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 shrink-0" />
                <span>পেইনকিলার ট্যাবলেট (সাময়িক)</span>
              </div>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-normal">
                পেইনকিলার কেবল সাময়িকভাবে মস্তিষ্কের স্নায়ুকে অসাড় রাখে। ওষুধ বন্ধ করলেই ব্যথা আবার ফিরে আসে এবং নিয়মিত গ্রহণে কিডনি ও লিভারের স্থায়ী ক্ষতি হয়।
              </p>
            </div>

            <div className="bg-emerald-900/40 border border-emerald-400/40 rounded-xl p-4 sm:p-5 lg:p-6">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs sm:text-sm lg:text-base mb-1.5">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                <span>শিফা পেইন কেয়ার অয়েল (স্থায়ী আরাম)</span>
              </div>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-normal">
                ম্যাসাজের সাথে সাথে ত্বক ভেদ করে মাংসপেশির গভীরে পৌঁছায়। রক্ত সঞ্চালন স্বাভাবিক করে আড়ষ্টতা শিথিল করে এবং জয়েন্টের গতিশীলতা ফিরিয়ে আনে।
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-emerald-800">
            <p className="text-xs sm:text-sm text-emerald-200 text-center sm:text-left">
              🌿 কোনো ক্ষতিকর পার্শ্বপ্রতিক্রিয়া ছাড়া শতভাগ প্রাকৃতিক সুরক্ষা।
            </p>
            <a
              href="#order-section"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 text-white font-bold text-xs sm:text-sm lg:text-base py-3 px-6 rounded-xl shadow-sm transition"
            >
              <span>প্রাকৃতিক আরাম বেছে নিন</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
