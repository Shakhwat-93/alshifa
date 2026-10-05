import React from "react";
import Image from "next/image";
import { ShieldCheck, Truck, RotateCcw } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#18181b] text-stone-400 py-10 sm:py-14 border-t border-stone-800 text-xs sm:text-sm">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8 pb-8 border-b border-stone-800">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative h-12 w-12 rounded-xl bg-white p-1 border border-stone-700/80 shadow-sm shrink-0 flex items-center justify-center">
                <Image
                  src="/images/shifa-logo.png"
                  alt="শিফা কেয়ার লোগো"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-base sm:text-lg font-bold text-white block leading-tight">
                  শিফা কেয়ার
                </span>
                <span className="text-xs text-stone-400 font-latin">
                  Shifa Pain Care Oil
                </span>
              </div>
            </div>
            <p className="text-stone-400 leading-relaxed font-normal">
              প্রকৃতির খাঁটি ২৭টি ভেষজ উপাদানের সমন্বয়ে তৈরি শিফা পেইন কেয়ার অয়েল। বাতের ব্যথা, হাঁটু ও কোমর ব্যথায় বিশ্বস্ত প্রাকৃতিক সমাধান।
            </p>
            <p className="text-emerald-400 font-semibold mt-2.5 font-latin text-xs sm:text-sm">
              হটলাইন: 09638014666
            </p>
          </div>

          {/* Guarantees */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">আমাদের সেবা ও নিশ্চয়তা</h4>
            <ul className="space-y-2 text-stone-400">
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>সারা দেশে ক্যাশ অন হোম ডেলিভারি</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>১০০% খাঁটি ও ল্যাব পরীক্ষিত ফর্মুলেশন</span>
              </li>
              <li className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>পণ্য হাতে পেয়ে দেখে টাকা দেওয়ার সুযোগ</span>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">সতর্কতামূলক বিজ্ঞপ্তি</h4>
            <p className="text-stone-500 leading-relaxed text-xs">
              * এটি একটি বহিরাগত আয়ুর্বেদিক ভেষজ ম্যাসাজ তেল, কোনো খাবার ওষুধ নয়। ব্যবহারের পর তীব্র কোনো সমস্যা দেখা দিলে অভিজ্ঞ চিকিৎসকের পরামর্শ নিন।
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-center sm:text-left text-xs">
          <p>© {new Date().getFullYear()} শিফা কেয়ার। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="font-latin">Designed for High Performance & Responsive Across All Devices</p>
        </div>
      </div>
    </footer>
  );
}
