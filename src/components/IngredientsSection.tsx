import React from "react";
import Image from "next/image";

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
  return (
    <section className="py-8 sm:py-14 md:py-16 lg:py-20 bg-white border-b border-stone-200/70">
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center max-w-3xl lg:max-w-4xl mx-auto mb-6 sm:mb-8 lg:mb-10">
          <span className="text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full inline-block">
            বিশুদ্ধ প্রাকৃতিক উপাদান
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-snug">
            ২৭টি দুর্লভ ভেষজ উপাদানের সমন্বয়ে{" "}
            <span className="text-emerald-800">বিশেষ ফর্মুলেশন</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-stone-600">
            সম্পূর্ণ রাসায়নিকমুক্ত ও প্রাকৃতিক উপায়ে সংগৃহীত ভেষজের সমন্বয়ে তৈরি:
          </p>
        </div>

        {/* Showcase Banner - Panorama on Desktop */}
        <div className="mb-6 sm:mb-8 lg:mb-10 rounded-2xl overflow-hidden border border-stone-200 shadow-soft bg-stone-100">
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

        {/* 14 Ingredients: 2 col mobile -> 3 col sm -> 4 col md -> 5 col lg -> 7 col xl/2xl */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2.5 sm:gap-3 lg:gap-3.5">
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
