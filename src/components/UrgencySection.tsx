import React from "react";
import { ArrowRight, AlertTriangle } from "lucide-react";

export default function UrgencySection() {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-amber-500/10 border-b border-amber-200/60">
      <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-center">
        <div className="inline-flex items-center gap-1.5 bg-amber-100 border border-amber-300 text-amber-900 px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold mb-3.5">
          <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700 shrink-0" />
          <span>একটি জরুরি কথা সবসময় মনে রাখবেন</span>
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-snug mb-3.5 max-w-3xl lg:max-w-4xl mx-auto">
          আজকের সামান্য ব্যথা অবহেলা করলে{" "}
          <span className="text-amber-800 underline decoration-amber-400 underline-offset-4">
            কাল স্থায়ী বাতের ব্যথায়
          </span>{" "}
          রূপ নিতে পারে!
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-stone-700 leading-relaxed max-w-xl lg:max-w-2xl mx-auto mb-6 font-normal">
          শরীরের জয়েন্ট ও পেশীর নমনীয়তা হারিয়ে ফেলা মানে বয়সের আগেই নিজেকে অন্যের ওপর নির্ভরশীল করে ফেলা। পেইনকিলার খেয়ে শরীরের ক্ষতি না করে, আজই প্রকৃতির নিরাপদ সমাধান বেছে নিন।
        </p>

        <a
          href="#order-section"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-sm sm:text-base lg:text-lg py-3 sm:py-3.5 lg:py-4 px-6 sm:px-8 rounded-xl shadow-cta transition active:scale-95 cursor-pointer"
        >
          <span>আজই অর্ডার করে সুস্থ থাকুন</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>
      </div>
    </section>
  );
}
