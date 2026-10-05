import React from "react";
import {
  Zap,
  Activity,
  ShieldCheck,
  Clock,
  Moon,
  CheckCircle2,
} from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "ত্বকের গভীরে দ্রুত শোষণ",
    desc: "মালিশের সাথে সাথে তেলের নির্যাস চামড়া ভেদ করে পেশীর গভীরে প্রবেশ করে ব্যথার অনুভূতি স্তিমিত করে।",
  },
  {
    icon: Activity,
    title: "স্বাভাবিক রক্ত চলাচল বৃদ্ধি",
    desc: "আক্রান্ত স্থানের জমাট রক্ত ও স্নায়ুর চাপ স্বাভাবিক করে পেশীতে দ্রুত অক্সিজেন ও পুষ্টি পৌঁছে দেয়।",
  },
  {
    icon: CheckCircle2,
    title: "হাঁটু ও জয়েন্টের গতিশীলতা",
    desc: "বাতের ব্যথা ও জয়েন্টের আড়ষ্টতা দূর করে যাতে সহজেই নামাজ পড়া, বসা থেকে ওঠা এবং সিঁড়ি বাওয়া সম্ভব হয়।",
  },
  {
    icon: Moon,
    title: "রাতে নিশ্চিন্ত আরামদায়ক ঘুম",
    desc: "ঘুমানোর আগে কোমর বা ঘাড়ে ম্যাসাজ করলে পেশী শিথিল হয়ে যায় এবং রাতের গভীর ব্যথামুক্ত ঘুম নিশ্চিত হয়।",
  },
  {
    icon: ShieldCheck,
    title: "১০০% প্রাকৃতিক ও নিরাপদ",
    desc: "কোনো প্রকার স্টেরয়েড বা রাসায়নিক উপাদান নেই। চর্মরোগ বা চামড়ায় কোনো ধরনের অ্যালার্জির ভয় নেই।",
  },
  {
    icon: Clock,
    title: "প্রতিদিন মাত্র ৫-১০ মিনিট",
    desc: "ঝামেলাহীন ব্যবহারের নিয়ম। পরিবারের যে কেউ ঘরে বসেই খুব সহজে এটি নিয়ম মেনে ব্যবহার করতে পারেন।",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-8 sm:py-14 md:py-16 lg:py-20 bg-[#fafaf8] border-b border-stone-200/70">
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center max-w-3xl lg:max-w-4xl mx-auto mb-6 sm:mb-10 lg:mb-12">
          <span className="text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full inline-block">
            সুফল ও উপকারিতা
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-snug">
            ব্যথামুক্ত জীবনের জন্য{" "}
            <span className="text-emerald-800">শিফা কেয়ারের অনন্য কার্যকারিতা</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-stone-600">
            নিয়মিত ম্যাসাজের মাধ্যমে শরীর ফিরে পাবে তার স্বাভাবিক সচলতা ও প্রাণশক্তি:
          </p>
        </div>

        {/* 6 Benefit Cards - 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-6">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl border border-stone-200/80 shadow-soft hover:border-emerald-300 transition"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-1.5 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
