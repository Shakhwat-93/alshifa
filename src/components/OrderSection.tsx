"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Truck,
  ShieldCheck,
  ShoppingBag,
  Flame,
  ArrowRight,
} from "lucide-react";

interface PackageOption {
  id: string;
  name: string;
  subtitle: string;
  bottles: number;
  price: number;
  regularPrice: number;
  savings: number;
  isPopular?: boolean;
  tag?: string;
}

const packages: PackageOption[] = [
  {
    id: "single",
    name: "১টি ফাইল (একক ব্যবহারকারী)",
    subtitle: "১ জনের জন্য সাধারণ ট্রায়াল প্যাক",
    bottles: 1,
    price: 950,
    regularPrice: 1450,
    savings: 500,
  },
  {
    id: "combo",
    name: "২টি ফাইল (কম্বো অফার)",
    subtitle: "ফ্রি ডেলিভারি + সর্বোচ্চ সাশ্রয়ী প্যাকেজ",
    bottles: 2,
    price: 1750,
    regularPrice: 2900,
    savings: 1150,
    isPopular: true,
    tag: "🔥 সেরা অফার (জনপ্রিয়)",
  },
  {
    id: "family",
    name: "৩টি ফাইল (ফ্যামিলি মেগা সেভার)",
    subtitle: "পরিবারের সবার জন্য দীর্ঘমেয়াদী স্বস্তি",
    bottles: 3,
    price: 2450,
    regularPrice: 4350,
    savings: 1900,
    tag: "🏆 সর্বোচ্চ সাশ্রয়",
  },
];

export default function OrderSection() {
  const [selectedPkg, setSelectedPkg] = useState<PackageOption>(packages[1]); // Default popular combo
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [shippingArea, setShippingArea] = useState("all-bd-free");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);

  const validate = () => {
    const err: { [key: string]: string } = {};
    if (!name.trim()) err.name = "আপনার নাম লিখুন";
    if (!phone.trim()) {
      err.phone = "১১ ডিজিটের মোবাইল নম্বর দিন";
    } else if (!/^01[3-9]\d{8}$/.test(phone.replace(/\s+/g, ""))) {
      err.phone = "সঠিক মোবাইল নম্বর দিন (যেমন: 01712345678)";
    }
    if (!address.trim() || address.length < 8) {
      err.address = "জেলা ও থানাসহ বিস্তারিত ঠিকানা লিখুন";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const orderData = {
        orderId: "SHIFA-" + Math.floor(100000 + Math.random() * 900000),
        name,
        phone,
        address,
        package: selectedPkg.name,
        total: selectedPkg.price,
      };

      setOrderSuccess(orderData);

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Fallback
      }
    }, 600);
  };

  return (
    <section id="order-section" className="py-8 sm:py-16 md:py-20 bg-[#f5f5f3] border-b border-stone-200/70 scroll-mt-14 lg:scroll-mt-20">
      <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10 max-w-2xl lg:max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-900 border border-orange-300 px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold mb-2.5">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />
            <span>ক্যাশ অন ডেলিভারি অর্ডার</span>
          </div>

          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-snug">
            অর্ডার করতে নিচের তথ্যগুলো পূরণ করুন
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm md:text-base text-stone-600">
            পণ্য হাতে পেয়ে দেখে টাকা পরিশোধ করবেন • কোনো অগ্রিম টাকা লাগবে না
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 shadow-card p-5 sm:p-8 lg:p-10">
          <form onSubmit={handleOrderSubmit} className="space-y-6 sm:space-y-8">
            {/* Step 1: Package Selector - Stack on Mobile, 3-Cols on Tablet/Desktop */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs sm:text-sm md:text-base font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold font-latin">
                    ১
                  </span>
                  <span>প্যাকেজ নির্বাচন করুন:</span>
                </label>
                <span className="text-[11px] sm:text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                  ফ্রি হোম ডেলিভারি
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
                {packages.map((pkg) => {
                  const isSelected = selectedPkg.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPkg(pkg)}
                      className={`relative rounded-xl p-3.5 sm:p-4 lg:p-5 border-2 transition cursor-pointer flex sm:flex-col justify-between items-center sm:items-start gap-3 ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                          : "border-stone-200 hover:border-emerald-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <input
                          type="radio"
                          name="package"
                          checked={isSelected}
                          onChange={() => setSelectedPkg(pkg)}
                          className="w-4 h-4 text-emerald-700 mt-1 shrink-0 accent-emerald-700"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-stone-900 text-xs sm:text-sm md:text-base leading-tight">
                              {pkg.name}
                            </h4>
                            {pkg.tag && (
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                  pkg.isPopular
                                    ? "bg-orange-500 text-white"
                                    : "bg-emerald-700 text-white"
                                }`}
                              >
                                {pkg.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] sm:text-xs text-stone-500 font-normal leading-tight mt-1">
                            {pkg.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="text-right sm:text-left shrink-0 sm:pt-3 sm:border-t sm:border-stone-200/80 sm:w-full">
                        <div className="text-base sm:text-xl lg:text-2xl font-black text-emerald-800 font-latin leading-tight">
                          ৳{pkg.price}
                        </div>
                        <div className="text-[10px] sm:text-xs text-stone-400 line-through font-latin">
                          ৳{pkg.regularPrice}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Customer Form */}
            <div>
              <label className="text-xs sm:text-sm md:text-base font-bold text-stone-900 flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold font-latin">
                  ২
                </span>
                <span>আপনার ডেলিভারি তথ্য দিন:</span>
              </label>

              <div className="space-y-4">
                {/* Full Name & Phone: 1 col on mobile, 2 col on tablet/desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-1">
                      আপনার সম্পূর্ণ নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="যেমন: মোঃ কামরুল হাসান"
                      className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border text-sm transition focus:outline-hidden focus:ring-1 bg-[#fafaf8] ${
                        errors.name
                          ? "border-red-400 focus:ring-red-300"
                          : "border-stone-300 focus:border-emerald-600 focus:ring-emerald-200"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-red-600 mt-1 font-medium">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-1">
                      ১১ ডিজিটের মোবাইল নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border text-sm transition focus:outline-hidden focus:ring-1 bg-[#fafaf8] font-latin ${
                        errors.phone
                          ? "border-red-400 focus:ring-red-300"
                          : "border-stone-300 focus:border-emerald-600 focus:ring-emerald-200"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-red-600 mt-1 font-medium">
                        {errors.phone}
                      </p>
                    )}
                    <p className="text-[10px] sm:text-xs text-stone-500 mt-1">
                      ডেলিভারির সময় এই নম্বরে কল দিয়ে কনফার্ম করা হবে।
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-1">
                    সম্পূর্ণ ঠিকানা (গ্রাম বা এলাকা, থানা ও জেলা) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="যেমন: বাড়ি নং ১২, রোড নং ৫, ব্লক-বি, মিরপুর-১০, ঢাকা"
                    className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border text-sm transition focus:outline-hidden focus:ring-1 bg-[#fafaf8] ${
                      errors.address
                        ? "border-red-400 focus:ring-red-300"
                        : "border-stone-300 focus:border-emerald-600 focus:ring-emerald-200"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Shipping Area */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-1.5">
                    ডেলিভারি এলাকা
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs sm:text-sm ${
                        shippingArea === "dhaka"
                          ? "border-emerald-600 bg-emerald-50/50"
                          : "border-stone-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingArea === "dhaka"}
                          onChange={() => setShippingArea("dhaka")}
                          className="accent-emerald-700"
                        />
                        <span className="font-semibold text-stone-900">ঢাকার ভেতরে</span>
                      </div>
                      <span className="font-bold text-emerald-700">ফ্রি</span>
                    </label>

                    <label
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs sm:text-sm ${
                        shippingArea === "all-bd-free"
                          ? "border-emerald-600 bg-emerald-50/50"
                          : "border-stone-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingArea === "all-bd-free"}
                          onChange={() => setShippingArea("all-bd-free")}
                          className="accent-emerald-700"
                        />
                        <span className="font-semibold text-stone-900">ঢাকার বাইরে</span>
                      </div>
                      <span className="font-bold text-emerald-700">ফ্রি</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Order Summary */}
            <div className="bg-[#fafaf8] rounded-xl p-4 sm:p-5 border border-stone-200 text-xs sm:text-sm space-y-2">
              <div className="flex justify-between items-center text-stone-600">
                <span>পণ্য:</span>
                <span className="font-bold text-stone-900">শিফা পেইন কেয়ার অয়েল</span>
              </div>
              <div className="flex justify-between items-center text-stone-600">
                <span>প্যাকেজ:</span>
                <span className="font-bold text-emerald-800">{selectedPkg.name}</span>
              </div>
              <div className="flex justify-between items-center text-stone-600 border-b border-stone-200 pb-2">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-bold text-emerald-700">সম্পূর্ণ ফ্রি (৳০)</span>
              </div>
              <div className="flex justify-between items-center text-sm sm:text-base font-extrabold text-stone-900 pt-1">
                <span>সর্বমোট বিল:</span>
                <span className="text-emerald-800 text-lg sm:text-xl font-latin font-black">৳{selectedPkg.price}</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="space-y-2.5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 text-white font-extrabold text-sm sm:text-base lg:text-lg py-3.5 sm:py-4 px-6 rounded-xl shadow-cta transition active:scale-[0.98] disabled:opacity-70 cursor-pointer animate-cta-pulse"
              >
                {isSubmitting ? (
                  <span>অর্ডার প্রসেস হচ্ছে...</span>
                ) : (
                  <>
                    <span>অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] sm:text-xs text-stone-500 font-medium">
                ✅ কোনো অগ্রিম টাকা লাগবে না • পণ্য হাতে পেয়ে দেখে টাকা দিবেন
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-sm sm:max-w-md w-full p-6 sm:p-8 text-center shadow-xl border border-stone-200 animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3.5">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-1">
              আপনার অর্ডারটি গ্রহণ করা হয়েছে!
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mb-3.5">
              অর্ডার আইডি: <strong className="text-emerald-800 font-latin">{orderSuccess.orderId}</strong>
            </p>

            <div className="bg-[#fafaf8] rounded-xl p-3.5 text-left text-xs sm:text-sm text-stone-700 space-y-1.5 mb-5 border border-stone-200">
              <p><strong>নাম:</strong> {orderSuccess.name}</p>
              <p><strong>মোবাইল:</strong> <span className="font-latin">{orderSuccess.phone}</span></p>
              <p><strong>ঠিকানা:</strong> {orderSuccess.address}</p>
              <p><strong>প্যাকেজ:</strong> {orderSuccess.package}</p>
              <p className="pt-1.5 border-t border-stone-200 font-bold text-emerald-800 text-xs sm:text-sm">
                সর্বমোট বিল: <span className="font-latin">৳{orderSuccess.total}</span> (ক্যাশ অন ডেলিভারি)
              </p>
            </div>

            <p className="text-[11px] sm:text-xs text-stone-500 mb-5">
              আমাদের প্রতিনিধি কল দিয়ে আপনার সাথে ডেলিভারি কনফার্ম করবেন।
            </p>

            <div className="space-y-2">
              <a
                href={`https://wa.me/8809638014666?text=${encodeURIComponent(
                  `আসসালামু আলাইকুম, আমি শিফা পেইন কেয়ার অয়েল অর্ডার করেছি। অর্ডার আইডি: ${orderSuccess.orderId}।`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm py-3 rounded-xl transition"
              >
                <span>হোয়াটসঅ্যাপে যোগাযোগ করুন</span>
              </a>

              <button
                onClick={() => setOrderSuccess(null)}
                className="w-full text-xs text-stone-500 hover:text-stone-800 py-1.5"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
