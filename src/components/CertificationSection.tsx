import React from "react";
import Image from "next/image";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";

export default function CertificationSection() {
  return (
    <section className="py-8 sm:py-14 md:py-16 lg:py-20 bg-[#f8f8f6] border-b border-stone-200/70">
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center max-w-3xl lg:max-w-4xl mx-auto mb-6 sm:mb-8 lg:mb-12">
          <span className="text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full inline-block">
            কোয়ালিটি ও অনুমোদন
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-snug">
            আমাদের ল্যাব টেস্ট ও{" "}
            <span className="text-emerald-800">অফিসিয়াল অনুমোদন</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-stone-600">
            শিফা পেইন কেয়ার অয়েল কঠোর ল্যাব পরীক্ষায় উত্তীর্ণ ও ক্ষতিকর কেমিক্যালমুক্ত:
          </p>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 border border-stone-200/80 shadow-soft max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Certificate Preview */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[220px] sm:max-w-[280px] lg:max-w-[320px] aspect-[3/4] rounded-2xl overflow-hidden border border-stone-300 shadow-soft bg-stone-50 p-2">
                <Image
                  src="/images/certification-approval.jpg"
                  alt="শিফা পেইন কেয়ার অয়েল সার্টিফিকেশন"
                  fill
                  sizes="(max-width: 768px) 240px, 320px"
                  className="object-contain"
                />
              </div>
            </div>

            {/* Checklist */}
            <div className="md:col-span-7 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-base sm:text-lg lg:text-xl">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700 shrink-0" />
                <span>কোয়ালিটি ও নিরাপত্তার শতভাগ নিশ্চয়তা</span>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-stone-600 leading-relaxed font-normal">
                বাজারের সাধারণ রাসায়নিক তেলের মতো এটি ত্বকে কোনো পোড়াভাব বা এলার্জি তৈরি করে না। নিয়মিত ব্যবহারের জন্য সম্পূর্ণ বিশ্বস্ত।
              </p>
              <div className="space-y-2.5 pt-2 text-xs sm:text-sm md:text-base text-stone-800 font-medium">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                  <span>ল্যাব টেস্টে পরীক্ষিত ও ক্ষতিকর স্টেরয়েডমুক্ত</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                  <span>১০০% প্রাকৃতিক খাঁটি ভেষজ নির্যাস</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                  <span>কোনো ধরনের ত্বকের এলার্জি বা চর্মরোগের ঝুঁকি নেই</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                  <span>ইনট্যাক্ট সিলযুক্ত অরিজিনাল বোতল প্যাকেজিং</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Countdown Timer Under Certificate */}
        <div className="max-w-md mx-auto">
          <CountdownTimer />
        </div>
      </div>
    </section>
  );
}
