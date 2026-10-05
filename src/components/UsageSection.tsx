import React from "react";
import { Moon } from "lucide-react";

export default function UsageSection() {
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

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="bg-[#fafaf8] p-5 sm:p-6 lg:p-7 rounded-2xl border border-stone-200/80 shadow-soft">
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs sm:text-sm mb-3 font-latin">
              1
            </span>
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-stone-900 mb-1.5">
              পরিমাণমতো তেল নিন
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              হাঁটু, কোমর বা ব্যথাযুক্ত জায়গায় কয়েক ফোঁটা শিফা পেইন কেয়ার অয়েল আলতোভাবে ঢেলে নিন।
            </p>
          </div>

          <div className="bg-[#fafaf8] p-5 sm:p-6 lg:p-7 rounded-2xl border border-stone-200/80 shadow-soft">
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs sm:text-sm mb-3 font-latin">
              2
            </span>
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-stone-900 mb-1.5">
              ৫-১০ মিনিট ম্যাসাজ করুন
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              হাতের তালু দিয়ে বৃত্তাকারে আলতো চাপে ৫-১০ মিনিট ম্যাসাজ করুন যেন তেলটি চামড়ার ভেতরে শোষিত হয়।
            </p>
          </div>

          <div className="bg-[#fafaf8] p-5 sm:p-6 lg:p-7 rounded-2xl border border-stone-200/80 shadow-soft">
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs sm:text-sm mb-3 font-latin">
              3
            </span>
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-stone-900 mb-1.5">
              দিনে ২ বার প্রয়োগ
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              দিনে ১-২ বার ব্যবহার করুন। বিশেষ করে রাতে ঘুমানোর আগে ব্যবহার করলে রাতে শরীর ব্যথামুক্ত রিল্যাক্স থাকে।
            </p>
          </div>
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
