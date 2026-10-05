import React from "react";
import { Laptop, Heart, Home, Car, Dumbbell } from "lucide-react";

const personas = [
  {
    icon: Laptop,
    title: "ডেস্ক জব ও আইটি পেশাজীবী",
    desc: "কম্পিউটারের সামনে টানা দীর্ঘক্ষণ বসে কাজ করার ফলে যাদের কোমর, ঘাড় ও কাঁধের মাংসপেশী শক্ত হয়ে তীব্র ব্যথা করে।",
  },
  {
    icon: Heart,
    title: "প্রবীণ পিতা-মাতা ও অভিভাবক",
    desc: "হাঁটুর জয়েন্টে ক্ষয় বা বাতের ব্যথায় যাদের বসা থেকে উঠতে কষ্ট হয় এবং নামাজ পড়তে সমস্যা হয়।",
  },
  {
    icon: Home,
    title: "গৃহিণী ও সম্মানিত মা-বোনেরা",
    desc: "রান্নাঘরে দীর্ঘক্ষণ দাঁড়িয়ে কাজ করা ও সংসারের টানা পরিশ্রমে কোমর ও পায়ের গোড়ালির ব্যথায় ভোগেন যারা।",
  },
  {
    icon: Car,
    title: "চালক ও ভ্রমণকারী",
    desc: "যানজট ও দীর্ঘ পথ ড্রাইভ করার কারণে ব্যাকপেইন ও মেরুদণ্ডের চাপে প্রতিনিয়ত অস্বস্তিতে থাকা মানুষদের জন্য।",
  },
  {
    icon: Dumbbell,
    title: "খেলোয়াড় ও শারীরিক পরিশ্রমকারী",
    desc: "খেলাধুলা, জিম বা ভারী কাজের পর মাংসপেশীর টান ও পেশীর আড়ষ্টতা দ্রুত কমাতে।",
  },
];

export default function TargetAudienceSection() {
  return (
    <section className="py-8 sm:py-14 md:py-16 lg:py-20 bg-[#f8f8f6] border-b border-stone-200/70">
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center max-w-3xl lg:max-w-4xl mx-auto mb-6 sm:mb-8 lg:mb-12">
          <span className="text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full inline-block">
            কাদের জন্য সবচেয়ে উপকারী
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-snug">
            কারা এই তেল ব্যবহারে{" "}
            <span className="text-emerald-800">সর্বোচ্চ আরাম পাবেন?</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-stone-600">
            প্রতিটি বয়সের মানুষের জয়েন্ট ও পেশীর স্বস্তির জন্য এটি বিশেষভাবে কার্যকর:
          </p>
        </div>

        {/* 5 Personas: 1 col on mobile -> 2/3 on tablet -> 5 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-4.5">
          {personas.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/80 shadow-soft flex flex-col justify-between hover:border-emerald-300 transition"
              >
                <div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-1.5 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
