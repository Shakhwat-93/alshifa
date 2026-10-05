"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "শিফা পেইন কেয়ার অয়েল ব্যবহারে কতক্ষণ পর আরাম পাওয়া যায়?",
    a: "হালকা হাতে ৫-১০ মিনিট ম্যাসাজ করলেই ত্বক ভেদ করে তেল ভেতরে প্রবেশ করে রক্ত সঞ্চালন সক্রিয় করে। ফলে কিছুক্ষণের মধ্যেই পেশী শিথিল হয়ে ব্যথার তীব্রতা কমতে শুরু করে। ভালো ফলাফলের জন্য অন্তত ৭-১০ দিন নিয়মিত ব্যবহার করা উচিত।",
  },
  {
    q: "এটি কি সব বয়সের মানুষ ব্যবহার করতে পারবে?",
    a: "হ্যাঁ, এটি সম্পূর্ণ প্রাকৃতিক ভেষজ উপাদানের সমন্বয়ে তৈরি। পরিবারের যেকোনো বয়সের সদস্য এটি নিরাপদে ব্যবহার করতে পারবেন।",
  },
  {
    q: "ত্বকে কোনো পার্শ্বপ্রতিক্রিয়া বা অ্যালার্জির ভয় আছে কি?",
    a: "একদমই না। এতে কোনো প্রকার ক্ষতিকারক কেমিক্যাল বা কৃত্রিম স্টেরয়েড নেই। প্রাকৃতিক ভেষজ উপাদান হওয়ায় এটি ত্বকে কোনো ধরনের জ্বালাপোড়া বা অ্যালার্জি সৃষ্টি করে না।",
  },
  {
    q: "ডেলিভারি চার্জ কত এবং পণ্য হাতে পেতে কত দিন লাগে?",
    a: "আজকের স্পেশাল অফারে সারা বাংলাদেশে ডেলিভারি সম্পূর্ণ ফ্রি! ঢাকার ভেতরে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে এবং ঢাকার বাইরে ২ থেকে ৩ দিনের মধ্যে হোম ডেলিভারি পেয়ে যাবেন।",
  },
  {
    q: "পেমেন্ট কীভাবে করতে হবে?",
    a: "আমাদের রয়েছে সম্পূর্ণ ক্যাশ অন ডেলিভারি সুবিধা। কোনো প্রকার অগ্রিম টাকা দিতে হবে না। ডেলিভারিম্যান আপনার কাছে পার্সেল পৌঁছে দিলে আপনি দেখে মূল্য পরিশোধ করবেন।",
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-8 sm:py-14 md:py-16 lg:py-20 bg-[#f8f8f6] border-b border-stone-200/70">
      <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-12">
          <span className="text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full inline-block">
            সচরাচর জিজ্ঞাসা
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-snug">
            সাধারণ জিজ্ঞাসা ও উত্তর{" "}
            <span className="text-emerald-800">(FAQ)</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-stone-600">
            অর্ডার করার আগে আপনার মনের প্রশ্নগুলোর উত্তর জেনে নিন:
          </p>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-stone-200/80 rounded-xl overflow-hidden shadow-soft"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-4 sm:px-5 lg:px-6 py-3.5 sm:py-4 lg:py-5 text-left flex items-center justify-between gap-3 font-bold text-stone-900 text-xs sm:text-sm md:text-base cursor-pointer select-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-emerald-700 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 lg:px-6 pb-4 pt-0 text-xs sm:text-sm md:text-base text-stone-600 leading-relaxed border-t border-stone-100 font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
