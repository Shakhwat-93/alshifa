"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import {
  trackViewItem,
  trackAddToCart,
  trackBeginCheckout,
  trackPurchase,
  trackContact,
} from "@/lib/analytics";

// Convert English numbers to Bengali digits
function toBengaliDigits(num: number | string): string {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/\d/g, (d) => bnDigits[Number(d)]);
}

function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

// Bengali and English phone number normalizer
function normalizeBDPhone(phone: any): string {
  const bnToEn: Record<string, string> = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  };
  let cleaned = String(phone || "")
    .replace(/[০-৯]/g, (d) => bnToEn[d] || d)
    .replace(/[^0-9]/g, "");
  if (cleaned.startsWith("880")) {
    cleaned = cleaned.slice(2);
  }
  return cleaned;
}

const DEFAULT_GALLERY = [
  {
    src: "/images/natural-pain-relief-promise.png",
    alt: "শিফা পেইন কেয়ার অয়েল",
  },
  {
    src: "/images/herbal-ingredients-showcase.png",
    alt: "শিফা পেইন কেয়ার অয়েল ভেষজ উপাদান",
  },
  {
    src: "/images/product-ad-banner.png",
    alt: "শিফা পেইন কেয়ার অয়েল বিজ্ঞাপন",
  },
];

const DEFAULT_REVIEWS = [
  {
    id: 1,
    name: "রহিমা খাতুন",
    location: "রাজশাহী",
    image: "/images/review-rahima-khatun.avif",
    text: "কোমরের ব্যথায় রাতে ঘুমানোর আগে ম্যাসাজ করি, বেশ আরাম পাই। তেলের গন্ধটাও ভালো লেগেছে।",
  },
  {
    id: 2,
    name: "মোঃ আব্দুল করিম",
    location: "নাটোর",
    image: "/images/review-abdul-karim.jpg",
    text: "আম্মার হাঁটুর ব্যথার জন্য নিয়েছিলাম। নিয়মিত ম্যাসাজ করে দিচ্ছি, উনি আরাম পাচ্ছেন।",
  },
  {
    id: 3,
    name: "মোঃ সাকিব হোসেন",
    location: "মিরপুর, ঢাকা",
    image: "/images/review-sakib-hossain.jpg",
    text: "অফিস শেষে ঘাড়ে আর কাঁধে হালকা ম্যাসাজ করলে ক্লান্তি অনেকটাই কমে যায়।",
  },
  {
    id: 4,
    name: "তানভীর হাসান",
    location: "চট্টগ্রাম",
    image: "/images/review-tanvir-hasan.jpg",
    text: "খেলাধুলার পর পেশীর অস্বস্তিতে ব্যবহার করি, ভালো লাগে। ডেলিভারিও তাড়াতাড়ি পেয়েছি।",
  },
  {
    id: 5,
    name: "মোঃ জাহিদুল ইসলাম",
    location: "বগুড়া",
    image: "/images/review-zahidul-islam.jpg",
    text: "আব্বার পায়ের ব্যথায় প্রতিদিন ম্যাসাজ করে দেই, উনি বেশ আরাম পান। আবার অর্ডার করব।",
  },
];

const DEFAULT_INGREDIENTS = [
  { name: "ক্যাস্টর অয়েল", type: "drop" },
  { name: "আদার দ্রবণীয় নির্যাস", type: "leaf" },
  { name: "রসুনের দ্রবণীয় নির্যাস", type: "leaf" },
  { name: "লবঙ্গের নির্যাস", type: "leaf" },
  { name: "দারুচিনি", type: "leaf" },
  { name: "কালোজিরার তেল", type: "drop" },
  { name: "অ্যালোভেরার নির্যাস", type: "leaf" },
  { name: "আকন্দ পাতার নির্যাস", type: "leaf" },
  { name: "নিমপাতার নির্যাস", type: "leaf" },
  { name: "হলুদের নির্যাস", type: "leaf" },
  { name: "ক্যাপসাইসিন", type: "leaf" },
  { name: "ইউক্যালিপটাস অয়েল", type: "drop" },
  { name: "মেনথল", type: "leaf" },
  { name: "পেপারমিন্ট অয়েল", type: "drop" },
];

export default function ShifaLandingPage() {
  // ---- Dynamic Editable State from Supabase ----
  const [content, setContent] = useState<Record<string, string>>({
    hero_tag: "Natural Care, Everyday Comfort",
    hero_title: "শিফা পেইন কেয়ার অয়েল",
    hero_subtitle: "প্রকৃতির ছোঁয়ায় ব্যথা নিরাময়ের বিশ্বস্ত সঙ্গী",
    hero_intro:
      "শরীরের বিভিন্ন অংশে ব্যথা, পেশীর অস্বস্তি ও ক্লান্তির সময় ম্যাসাজের মাধ্যমে আরামদায়ক অনুভূতি পেতে এটি ব্যবহার করা যেতে পারে।",
    product_name: "শিফা পেইন কেয়ার অয়েল",
    price_current: "950",
    price_regular: "1450",
    shipping_text: "ফ্রী ডেলিভারী",
    hotline_number: "01886367377",
    whatsapp_number: "01886367377",
    timer_hours: "5",
    badge_1: "শরীরের ব্যথা নিরাময়ে তেল",
    badge_2: "২৭টি ভেষজ প্রাকৃতিক উপাদানে তৈরি",
    badge_3: "পরিবেশবান্ধব ও নিরাপদ",
    intro_heading: "পণ্যের পরিচিতি",
    intro_text:
      "শিফা পেইন কেয়ার অয়েল হলো ম্যাসাজের জন্য তৈরি একটি পেইন-রিলিফ অয়েল। শরীরের বিভিন্ন অংশে ব্যথা, পেশীর অস্বস্তি ও ক্লান্তির সময় ম্যাসাজের মাধ্যমে আরামদায়ক অনুভূতি পেতে এটি ব্যবহার করা যেতে পারে।",
    ingredients_heading: "উপাদান সমূহ",
    highlight_title: "🌿 Shifa Pain Care Oil",
    highlight_subtitle:
      "২৭টি দুর্লভ ও মূল্যবান ভেষজ প্রাকৃতিক উপাদানের সমন্বয়ে তৈরি।",
    usage_heading: "ব্যবহারের নিয়ম",
    usage_text:
      "প্রয়োজনীয় পরিমাণ তেল ব্যথাযুক্ত বা অস্বস্তিকর স্থানে নিয়ে ৫-১০ মিনিট হালকা হাতে ম্যাসাজ করুন। প্রয়োজন অনুযায়ী দিনে ২-৩ বার ব্যবহার করা যেতে পারে।",
    cert_heading: "আমাদের সার্টিফিকেশন",
    timer_heading: "অফার টি শেষ হতে বাকি আছে আর মাত্র",
    final_cta_heading: "আজই অর্ডার করুন শিফা পেইন কেয়ার অয়েল",
  });

  const [rawSettings, setRawSettings] = useState<any>({
    delivery_charge_inside: 60,
    delivery_charge_outside: 120,
    free_delivery_min_order: 2000,
    announcement_text: "🌿 সীমিত সময়ের অফার! আজই অর্ডার করুন এবং উপভোগ করুন ফ্রি হোম ডেলিভারি।",
    is_announcement_active: true,
    hotline_number: "01886367377",
    whatsapp_number: "01886367377",
    whatsapp_default_message: "হ্যালো, আমি শিফা পেইন কেয়ার অয়েল সম্পর্কে জানতে চাই।",
  });

  const [productData, setProductData] = useState<any>(null);
  const [landingData, setLandingData] = useState<any>(null);
  const [reviewsList, setReviewsList] = useState(DEFAULT_REVIEWS);
  const [featuresList, setFeaturesList] = useState<any[]>([]);

  // ---- Fetch Dynamic Content from Supabase ----
  useEffect(() => {
    fetch(`/api/content?t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.raw_settings) {
          setRawSettings(data.raw_settings);
        }
        if (data.settings && Object.keys(data.settings).length > 0) {
          setContent((prev) => ({ ...prev, ...data.settings }));
        }
        if (data.product) {
          setProductData(data.product);
        }
        if (data.landing) {
          setLandingData(data.landing);
        }
        if (data.reviews && data.reviews.length > 0) {
          setReviewsList(
            data.reviews.map((r: any, idx: number) => ({
              id: r.id || idx + 1,
              name: r.name || "সম্মানিত গ্রাহক",
              location: r.location || "বাংলাদেশ",
              image: r.image_url || r.image || "/images/review-rahima-khatun.avif",
              text: r.review || r.review_text || "",
            }))
          );
        }
        if (data.features && data.features.length > 0) {
          setFeaturesList(data.features);
        }
      })
      .catch((e) => console.log("Failed to load dynamic content:", e));
  }, []);

  // Dynamic Product Bottle Image with Safe Fallback
  const productMainImg =
    productData?.images?.[0] && productData.images[0].trim() !== ""
      ? productData.images[0]
      : "/images/product-bottle-main.png";

  // ---- Dynamic Gallery Images ----
  const galleryImages =
    productData?.images && productData.images.length > 1
      ? productData.images.map((img: string, i: number) => ({
          src: img,
          alt: `${content.product_name} ছবি ${i + 1}`,
        }))
      : DEFAULT_GALLERY;

  // ---- Smooth scroll to checkout ----
  const scrollToCheckout = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const el = document.getElementById("checkout") || document.getElementById("order-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ---- Image Gallery State ----
  const [galIndex, setGalIndex] = useState(0);
  const galTouchStart = useRef<number>(0);

  const nextGal = useCallback(() => {
    setGalIndex((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const prevGal = useCallback(() => {
    setGalIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  useEffect(() => {
    const timer = setInterval(nextGal, 3400);
    return () => clearInterval(timer);
  }, [nextGal]);

  const handleGalTouchStart = (e: React.TouchEvent) => {
    galTouchStart.current = e.touches[0].clientX;
  };

  const handleGalTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - galTouchStart.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0) nextGal();
      else prevGal();
    }
  };

  // ---- Reviews Slider State ----
  const [revIndex, setRevIndex] = useState(0);
  const [perView, setPerView] = useState(3);
  const revTouchStart = useRef<number>(0);
  const isHovered = useRef<boolean>(false);

  useEffect(() => {
    const updatePerView = () => {
      const w = window.innerWidth;
      if (w <= 767) setPerView(1);
      else if (w <= 1024) setPerView(2);
      else setPerView(3);
    };
    updatePerView();
    window.addEventListener("resize", updatePerView);
    return () => window.removeEventListener("resize", updatePerView);
  }, []);

  const maxRevIndex = Math.max(0, reviewsList.length - perView);

  const nextRev = useCallback(() => {
    setRevIndex((prev) => (prev >= maxRevIndex ? 0 : prev + 1));
  }, [maxRevIndex]);

  const prevRev = useCallback(() => {
    setRevIndex((prev) => (prev <= 0 ? maxRevIndex : prev - 1));
  }, [maxRevIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovered.current) {
        nextRev();
      }
    }, 3500);
    return () => clearInterval(timer);
  }, [nextRev]);

  const handleRevTouchStart = (e: React.TouchEvent) => {
    revTouchStart.current = e.touches[0].clientX;
  };

  const handleRevTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - revTouchStart.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0) nextRev();
      else prevRev();
    }
  };

  // ---- Countdown Timer (Persistent hours from settings) ----
  const timerHours = parseInt(content.timer_hours || "5", 10) || 5;
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: timerHours, m: 0, s: 0 });

  useEffect(() => {
    const KEY = "shifa_offer_end";
    const DUR = timerHours * 60 * 60 * 1000;
    let end: number;

    try {
      end = parseInt(localStorage.getItem(KEY) || "0", 10);
    } catch {
      end = 0;
    }

    if (!end || end <= Date.now()) {
      end = Date.now() + DUR;
      try {
        localStorage.setItem(KEY, String(end));
      } catch {}
    }

    const tick = () => {
      let diff = end - Date.now();
      if (diff <= 0) {
        end = Date.now() + DUR;
        try {
          localStorage.setItem(KEY, String(end));
        } catch {}
        diff = DUR;
      }
      let sec = Math.floor(diff / 1000);
      const d = Math.floor(sec / 86400);
      sec %= 86400;
      const h = Math.floor(sec / 3600);
      sec %= 3600;
      const m = Math.floor(sec / 60);
      sec %= 60;
      setTimeLeft({ d, h, m, s: sec });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [timerHours]);

  // ---- Order Form & Pricing (Single bottle package, 100% Free Delivery) ----
  const [quantity, setQuantity] = useState(1);

  const baseUnitPrice =
    productData && Number(productData.price) > 0
      ? Number(productData.price)
      : Number(content.price_current) > 0
      ? Number(content.price_current)
      : 950;

  const baseOriginalPrice =
    productData && Number(productData.original_price) > 0
      ? Number(productData.original_price)
      : Number(content.price_regular) > 0
      ? Number(content.price_regular)
      : 1450;

  const subtotal = quantity * baseUnitPrice;
  const deliveryCharge = 0; // 100% Free delivery nationwide
  const grandTotal = subtotal;

  // Analytics tracking guards
  const hasFiredViewItem = useRef(false);
  const hasFiredBeginCheckout = useRef(false);

  useEffect(() => {
    if (baseUnitPrice > 0 && !hasFiredViewItem.current) {
      hasFiredViewItem.current = true;
      trackViewItem({
        item_id: productData?.id || "shifa-001",
        item_name: productData?.name_primary || content.product_name || "শিফা পেইন কেয়ার অয়েল",
        price: baseUnitPrice,
        quantity: 1,
      });
    }
  }, [baseUnitPrice, productData, content.product_name]);

  const triggerBeginCheckout = useCallback(() => {
    if (!hasFiredBeginCheckout.current) {
      hasFiredBeginCheckout.current = true;
      trackBeginCheckout({
        currency: "BDT",
        value: grandTotal,
        items: [
          {
            item_id: productData?.id || "shifa-001",
            item_name: productData?.name_primary || content.product_name || "শিফা পেইন কেয়ার অয়েল",
            price: baseUnitPrice,
            quantity,
          },
        ],
      });
    }
  }, [grandTotal, productData, content.product_name, baseUnitPrice, quantity]);

  // Form Inputs & Validation
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderId: string;
    name: string;
    phone: string;
    address: string;
    quantity: number;
    total: number;
  } | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const err: { [key: string]: string } = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      err.name = "আপনার সম্পূর্ণ নাম লিখুন";
    }
    if (!formData.address.trim() || formData.address.trim().length < 5) {
      err.address = "গ্রাম বা এলাকা, থানা ও জেলা সঠিকভাবে লিখুন";
    }

    const cleanPhone = normalizeBDPhone(formData.phone);
    if (!cleanPhone) {
      err.phone = "১১ ডিজিটের মোবাইল নাম্বার লিখুন";
    } else if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      err.phone = "সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন (যেমন: 01712345678)";
    }

    setErrors(err);

    if (Object.keys(err).length > 0) {
      setSubmitError("অনুগ্রহ করে লাল চিহ্নিত তথ্যগুলো সঠিকভাবে পূরণ করুন।");
      if (err.name) {
        nameInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        nameInputRef.current?.focus();
      } else if (err.phone) {
        phoneInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        phoneInputRef.current?.focus();
      } else if (err.address) {
        addressInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        addressInputRef.current?.focus();
      }
      return false;
    }

    setSubmitError("");
    return true;
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError("");

    const cleanPhone = normalizeBDPhone(formData.phone);

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: cleanPhone,
          address: formData.address.trim(),
          district: "বাংলাদেশ (ফ্রি ডেলিভারি)",
          quantity,
          unitPrice: baseUnitPrice,
          deliveryCharge: 0,
          variant: "১ বোতল",
          productId: productData?.id || null,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setOrderSuccess({
          orderId: data.order.order_id,
          name: data.order.customer_name,
          phone: data.order.customer_phone,
          address: data.order.customer_address,
          quantity: data.order.quantity,
          total: data.order.total_price,
        });

        // Trigger Centralized eCommerce Purchase Event (GA4 + Meta Pixel) with Guaranteed Deduplication
        trackPurchase({
          transaction_id: data.order.order_id,
          value: Number(data.order.total_price) || grandTotal,
          currency: "BDT",
          shipping: deliveryCharge,
          items: [
            {
              item_id: productData?.id || "shifa-001",
              item_name: productData?.name_primary || content.product_name || "শিফা পেইন কেয়ার অয়েল",
              price: baseUnitPrice,
              quantity,
              item_variant: "১ বোতল",
            },
          ],
        });

        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch {}
      } else {
        const errorMsg = data.error || "অর্ডার প্রসেস করা সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।";
        setSubmitError(errorMsg);
        alert(errorMsg);
      }
    } catch (err) {
      const netMsg = "সার্ভার কানেকশন ত্রুটি। অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ চেক করে আবার চেষ্টা করুন।";
      setSubmitError(netMsg);
      alert(netMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeHotline = rawSettings.hotline_number || content.hotline_number || "01886367377";

  return (
    <div className="w-full bg-white text-[#1E2B22]">
      {/* ========================================================= */}
      {/* 0. DYNAMIC ANNOUNCEMENT BAR                               */}
      {/* ========================================================= */}
      {rawSettings.is_announcement_active !== false && rawSettings.announcement_text && (
        <div className="s-announcement-bar">
          <span>{rawSettings.announcement_text}</span>
          <a href={`tel:${activeHotline}`} onClick={() => trackContact("phone", activeHotline)}>
            কল করুন: {activeHotline}
          </a>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. ORIGINAL SHIFA LANDING PAGE CONTAINER (#shifa-lp)      */}
      {/* ========================================================= */}
      <div id="shifa-lp">
        {/* ---------- TOP SECTION (HERO + GALLERY + OFFER) ---------- */}
        <div className="s-top">
          {/* HERO */}
          <section className="s-hero">
            <div className="s-hero-txt">
              <span className="s-tag">{landingData?.subtitle ? "১০০% প্রাকৃতিক ও নিরাপদ" : content.hero_tag}</span>
              <h1>{landingData?.title || productData?.name_primary || content.hero_title}</h1>
              <p className="s-sub">{landingData?.subtitle || productData?.name_secondary || content.hero_subtitle}</p>
              <p className="s-intro">{landingData?.description || productData?.description || content.hero_intro}</p>
              <a className="s-btn s-order" href="#checkout" onClick={scrollToCheckout}>
                <svg fill="none" viewBox="0 0 24 24">
                  <path
                    d="M3 4h2.2l2.3 10.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.1L21 8H6.3"
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.6"
                  />
                  <circle cx="9.5" cy="19.5" r="1.6" stroke="#fff" strokeWidth="2.4" />
                  <circle cx="17" cy="19.5" r="1.6" stroke="#fff" strokeWidth="2.4" />
                </svg>
                এখনই অর্ডার করুন
              </a>
            </div>
            <div className="s-hero-img">
              <img
                alt={content.hero_title}
                src={productMainImg}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/product-bottle-main.png";
                }}
                loading="eager"
              />
            </div>
          </section>

          {/* IMAGE SLIDER */}
          <div
            className="s-gal"
            onTouchStart={handleGalTouchStart}
            onTouchEnd={handleGalTouchEnd}
          >
            <div
              className="s-gal-track"
              style={{
                transform: `translateX(-${galIndex * 100}%)`,
                transition: "transform .6s ease",
              }}
            >
              {galleryImages.map((img: any, i: number) => (
                <img
                  key={i}
                  alt={img.alt}
                  src={img.src}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              ))}
            </div>
            <div className="s-gal-dots">
              {galleryImages.map((_: any, i: number) => (
                <i
                  key={i}
                  className={i === galIndex ? "on" : ""}
                  onClick={() => setGalIndex(i)}
                />
              ))}
            </div>
          </div>

          {/* OFFER BUTTON */}
          <div className="s-offer">
            <a className="s-btn s-order" href="#checkout" onClick={scrollToCheckout}>
              <svg fill="none" viewBox="0 0 24 24">
                <path
                  d="M3 4h2.2l2.3 10.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.1L21 8H6.3"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.6"
                />
                <circle cx="9.5" cy="19.5" r="1.6" stroke="#fff" strokeWidth="2.4" />
                <circle cx="17" cy="19.5" r="1.6" stroke="#fff" strokeWidth="2.4" />
              </svg>
              এখনই অর্ডার করুন
            </a>
          </div>
        </div>

        {/* ---------- MAIN WRAPPER ---------- */}
        <div className="s-wrap">
          {/* BADGES */}
          <div className="s-badges">
            <div className="s-badge">
              <span className="s-ico oil a-drip">
                <svg viewBox="0 0 24 24">
                  <path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z" />
                  <path d="M9.5 14.5a2.6 2.6 0 0 0 2.5 2.5" />
                </svg>
              </span>
              <b>{featuresList[0]?.title || content.badge_1}</b>
            </div>
            <div className="s-badge">
              <span className="s-ico a-sway">
                <svg viewBox="0 0 24 24">
                  <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z" />
                  <path d="M5 19l7-7" />
                </svg>
              </span>
              <b>{featuresList[1]?.title || content.badge_2}</b>
            </div>
            <div className="s-badge">
              <span className="s-ico a-spin">
                <svg viewBox="0 0 24 24">
                  <path d="M7 7.5l2.5-4 2.5 4" />
                  <path d="M4 15l-1.5-3.2 2.7-4.3" />
                  <path d="M8 20h9l2-3.5" />
                  <path d="M14 6.5l3.5 0.5 2 4" />
                  <path d="M9.5 3.5L6 9" />
                  <path d="M3 15.5L5 19h3" />
                </svg>
              </span>
              <b>{featuresList[2]?.title || content.badge_3}</b>
            </div>
          </div>

          {/* INTRO */}
          <section className="s-sec">
            <div className="s-intro-box">
              <div className="s-head center">
                <span className="s-ico a-pulse">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 11v6" />
                    <path d="M12 7.5v.5" />
                  </svg>
                </span>
                <h2>{content.intro_heading}</h2>
              </div>
              <p className="s-text">
                {productData?.description || landingData?.description || content.intro_text}
              </p>
            </div>
          </section>

          {/* DYNAMIC BENEFITS / INGREDIENTS */}
          <section className="s-sec">
            <div className="s-head center">
              <span className="s-ico a-sway">
                <svg viewBox="0 0 24 24">
                  <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z" />
                  <path d="M5 19l7-7" />
                </svg>
              </span>
              <h2>{content.ingredients_heading}</h2>
            </div>

            {/* 14 Pure Herbal Ingredients */}
            <ul className="s-ing">
              {DEFAULT_INGREDIENTS.map((ing, i) => (
                <li key={i}>
                  {ing.type === "drop" ? (
                    <svg viewBox="0 0 24 24">
                      <path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24">
                      <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z" />
                      <path d="M5 19l7-7" />
                    </svg>
                  )}
                  {ing.name}
                </li>
              ))}
            </ul>

            <div className="s-hl">
              <b>{productData?.name_primary || content.highlight_title}</b>
              <p>{landingData?.subtitle || content.highlight_subtitle}</p>
            </div>
          </section>

          {/* HOW TO USE */}
          <section className="s-sec">
            <div className="s-use">
              <div className="s-head">
                <span className="s-ico oil a-drip">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z" />
                    <path d="M9.5 14.5a2.6 2.6 0 0 0 2.5 2.5" />
                  </svg>
                </span>
                <h2>{content.usage_heading}</h2>
              </div>
              <p className="s-text">{content.usage_text}</p>
            </div>
          </section>

          {/* CERTIFICATE */}
          <section className="s-sec">
            <div className="s-head center">
              <span className="s-ico a-pulse">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="9" r="6" />
                  <path d="M9.5 9l1.8 1.8L14.8 7.3" />
                  <path d="M8.5 14l-1.5 7 5-2.5 5 2.5-1.5-7" />
                </svg>
              </span>
              <h2>{content.cert_heading}</h2>
            </div>
            <div className="s-cert">
              <img
                alt="শিফা পেইন কেয়ার অয়েল সার্টিফিকেট"
                src="/images/certification-approval.jpg"
                loading="lazy"
              />
            </div>
          </section>

          {/* MID CTA */}
          <div className="s-mid">
            <p>
              {landingData?.title || productData?.name_primary || content.hero_title}
              <small>{landingData?.subtitle || content.hero_subtitle}</small>
            </p>
            <a className="s-btn s-order" href="#checkout" onClick={scrollToCheckout}>
              <svg fill="none" viewBox="0 0 24 24">
                <path
                  d="M3 4h2.2l2.3 10.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.1L21 8H6.3"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.6"
                />
                <circle cx="9.5" cy="19.5" r="1.6" stroke="#fff" strokeWidth="2.4" />
                <circle cx="17" cy="19.5" r="1.6" stroke="#fff" strokeWidth="2.4" />
              </svg>
              এখনই অর্ডার করুন
            </a>
          </div>

          {/* DYNAMIC REVIEWS */}
          <section className="s-sec">
            <div className="s-head center">
              <span className="s-ico oil a-pulse">
                <svg viewBox="0 0 24 24">
                  <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z" />
                </svg>
              </span>
              <h2>সম্মানিত গ্রাহকদের মতামত</h2>
            </div>
            <div className="s-rev-row">
              <button
                aria-label="আগের রিভিউ"
                className="s-arrow s-prev"
                onClick={prevRev}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>

              <div
                className="s-viewport"
                onMouseEnter={() => {
                  isHovered.current = true;
                }}
                onMouseLeave={() => {
                  isHovered.current = false;
                }}
                onTouchStart={handleRevTouchStart}
                onTouchEnd={handleRevTouchEnd}
              >
                <div
                  className="s-track"
                  style={{
                    transform: `translateX(-${revIndex * (100 / perView)}%)`,
                    transition: "transform .55s ease",
                  }}
                >
                  {reviewsList.map((rev: any) => (
                    <div key={rev.id} className="s-rev">
                      <div className="s-rev-in">
                        <svg className="s-quote" viewBox="0 0 24 24">
                          <path d="M4 18v-5.5C4 8.4 6.2 6 10 5.5V8c-2 .5-3 1.8-3 4h3v6zm10 0v-5.5c0-4.1 2.2-6.5 6-7V8c-2 .5-3 1.8-3 4h3v6z" />
                        </svg>
                        <div className="s-stars">★★★★★</div>
                        <p>{rev.text || rev.review}</p>
                        <div className="s-who">
                          <img
                            alt={rev.name}
                            className="s-av"
                            src={rev.image || "/images/review-rahima-khatun.avif"}
                            loading="lazy"
                          />
                          <div>
                            <b>{rev.name}</b>
                            <span>{rev.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                aria-label="পরের রিভিউ"
                className="s-arrow s-next"
                onClick={nextRev}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="s-dots">
              {Array.from({ length: maxRevIndex + 1 }).map((_, i) => (
                <i
                  key={i}
                  className={i === revIndex ? "on" : ""}
                  onClick={() => setRevIndex(i)}
                />
              ))}
            </div>
          </section>

          {/* TIMER */}
          <div className="s-timer">
            <h3>{content.timer_heading}</h3>
            <div className="s-tboxes">
              <div className="s-tbox">
                <b className="t-d">{toBengaliDigits(timeLeft.d)}</b>
                <span>দিন</span>
              </div>
              <div className="s-tbox">
                <b className="t-h">{toBengaliDigits(padZero(timeLeft.h))}</b>
                <span>ঘণ্টা</span>
              </div>
              <div className="s-tbox">
                <b className="t-m">{toBengaliDigits(padZero(timeLeft.m))}</b>
                <span>মিনিট</span>
              </div>
              <div className="s-tbox">
                <b className="t-s">{toBengaliDigits(padZero(timeLeft.s))}</b>
                <span>সেকেন্ড</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- FINAL CTA SECTION ---------- */}
        <section className="s-final">
          <h2>{content.final_cta_heading}</h2>
          <a className="s-btn s-order" href="#checkout" onClick={scrollToCheckout}>
            <svg fill="none" viewBox="0 0 24 24">
              <path
                d="M3 4h2.2l2.3 10.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.1L21 8H6.3"
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.6"
              />
              <circle cx="9.5" cy="19.5" r="1.6" stroke="#fff" strokeWidth="2.4" />
              <circle cx="17" cy="19.5" r="1.6" stroke="#fff" strokeWidth="2.4" />
            </svg>
            এখনই অর্ডার করুন
          </a>
          <div>
            <a
              className="s-call"
              href={`tel:${activeHotline}`}
              onClick={() => trackContact("phone", activeHotline)}
            >
              <svg viewBox="0 0 24 24">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
              </svg>
              Hotline: {activeHotline}
            </a>
          </div>
        </section>
      </div>

      {/* ========================================================= */}
      {/* 2. EXACT CHECKOUT ORDER FORM SECTION (#checkout)          */}
      {/* ========================================================= */}
      <section className="s-checkout-section" id="checkout">
        <div className="s-checkout-card" id="order-form">
          {/* Green Card Header with Cart Icon */}
          <div className="s-checkout-header">
            <div className="s-checkout-cart-icon">
              <svg viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z" />
              </svg>
            </div>
            <h2>অর্ডার ফর্ম (ক্যাশ অন ডেলিভারি)</h2>
            <p>আপনার অর্ডারটি প্লেস করতে নিচের প্রয়োজনীয় তথ্যগুলো পূরণ করুন।</p>
          </div>

          {/* White Card Body */}
          <div className="s-checkout-body">
            <form onSubmit={handleOrderSubmit}>
              {/* Product Option - Single Bottle */}
              <div className="s-cf-group">
                <h3 className="s-cf-heading">আপনার পণ্য</h3>
                <div className="s-cf-product">
                  <input
                    type="radio"
                    checked
                    readOnly
                    className="s-cf-radio"
                  />
                  <img
                    src={productMainImg}
                    alt={content.product_name}
                    className="s-cf-prod-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/product-bottle-main.png";
                    }}
                  />
                  <div className="s-cf-prod-info">
                    <span className="s-cf-prod-title">
                      {productData?.name_primary || content.product_name || "শিফা পেইন কেয়ার অয়েল (১ বোতল)"}
                    </span>
                    <div className="s-cf-qty">
                      <button
                        type="button"
                        className="s-cf-qty-btn"
                        onClick={() => {
                          const nextQ = Math.max(1, quantity - 1);
                          setQuantity(nextQ);
                          trackAddToCart({
                            item_id: productData?.id || "shifa-001",
                            item_name: productData?.name_primary || content.product_name || "শিফা পেইন কেয়ার অয়েল",
                            price: baseUnitPrice,
                            quantity: nextQ,
                          });
                        }}
                      >
                        −
                      </button>
                      <input
                        type="text"
                        readOnly
                        value={toBengaliDigits(quantity)}
                        className="s-cf-qty-val"
                      />
                      <button
                        type="button"
                        className="s-cf-qty-btn"
                        onClick={() => {
                          const nextQ = quantity + 1;
                          setQuantity(nextQ);
                          trackAddToCart({
                            item_id: productData?.id || "shifa-001",
                            item_name: productData?.name_primary || content.product_name || "শিফা পেইন কেয়ার অয়েল",
                            price: baseUnitPrice,
                            quantity: nextQ,
                          });
                        }}
                      >
                        +
                      </button>
                    </div>
                    <div className="s-cf-prod-price flex flex-col items-end justify-center">
                      {baseOriginalPrice > baseUnitPrice && (
                        <span className="text-[11px] sm:text-xs text-stone-400 line-through font-normal">
                          ৳ {toBengaliDigits(baseOriginalPrice * quantity)}
                        </span>
                      )}
                      <span className="text-base sm:text-lg font-black text-emerald-800">
                        ৳ {toBengaliDigits(subtotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="s-cf-group">
                <h3 className="s-cf-heading">আপনার তথ্য দিন</h3>

                <div className="s-cf-field">
                  <label className="s-cf-label">
                    আপনার সম্পূর্ণ নাম লিখুন <span className="req">*</span>
                  </label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={formData.name}
                    onFocus={triggerBeginCheckout}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: "" });
                      if (submitError) setSubmitError("");
                    }}
                    placeholder="যেমন: মোঃ সাকিব হোসেন"
                    className="s-cf-input"
                    style={{ borderColor: errors.name ? "#dc2626" : undefined }}
                  />
                  {errors.name && <p className="s-cf-error">{errors.name}</p>}
                </div>

                <div className="s-cf-field">
                  <label className="s-cf-label">
                    ১১ ডিজিটের মোবাইল নাম্বার লিখুন <span className="req">*</span>
                  </label>
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    value={formData.phone}
                    onFocus={triggerBeginCheckout}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: "" });
                      if (submitError) setSubmitError("");
                    }}
                    placeholder="যেমন: 017XXXXXXXX"
                    className="s-cf-input"
                    style={{ borderColor: errors.phone ? "#dc2626" : undefined }}
                  />
                  {errors.phone && <p className="s-cf-error">{errors.phone}</p>}
                </div>

                <div className="s-cf-field">
                  <label className="s-cf-label">
                    সম্পূর্ণ ঠিকানা (গ্রাম বা এলাকা, থানা ও জেলা) <span className="req">*</span>
                  </label>
                  <input
                    ref={addressInputRef}
                    type="text"
                    value={formData.address}
                    onFocus={triggerBeginCheckout}
                    onChange={(e) => {
                      setFormData({ ...formData, address: e.target.value });
                      if (errors.address) setErrors({ ...errors, address: "" });
                      if (submitError) setSubmitError("");
                    }}
                    placeholder="যেমন: বাড়ি ১২, রোড ৪, সেক্টর ৭, উত্তরা, ঢাকা"
                    className="s-cf-input"
                    style={{ borderColor: errors.address ? "#dc2626" : undefined }}
                  />
                  {errors.address && <p className="s-cf-error">{errors.address}</p>}
                </div>
              </div>

              {/* Delivery Method */}
              <div className="s-cf-group">
                <h3 className="s-cf-heading">ডেলিভারি মেথড</h3>
                <div className="s-cf-shipping-row">
                  <input
                    type="radio"
                    checked
                    readOnly
                    className="s-cf-radio"
                  />
                  <span style={{ fontWeight: 600, color: "#0E5A2E" }}>
                    সারাদেশে ক্যাশ অন ডেলিভারি
                  </span>
                </div>
              </div>

              {/* Order Review Table */}
              <div className="s-cf-group">
                <h3 className="s-cf-heading">আপনার অর্ডার বিবরণী</h3>
                <table className="s-cf-table">
                  <thead>
                    <tr>
                      <th>পণ্য বিবরণ</th>
                      <th style={{ textAlign: "right" }}>মূল্য</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {productData?.name_primary || content.product_name} × {toBengaliDigits(quantity)}
                      </td>
                      <td className="val">
                        ৳ {toBengaliDigits(subtotal)}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>সাবটোটাল</th>
                      <td className="val">
                        ৳ {toBengaliDigits(subtotal)}
                      </td>
                    </tr>
                    <tr>
                      <th>ডেলিভারি চার্জ</th>
                      <td className="val" style={{ color: "#0E5A2E", fontWeight: 700 }}>
                        ৳ {toBengaliDigits(deliveryCharge)}
                      </td>
                    </tr>
                    <tr className="total">
                      <th>মোট প্রদেয় বিল</th>
                      <td className="val">
                        ৳ {toBengaliDigits(grandTotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Submit Error Alert */}
              {submitError && (
                <div className="s-cf-alert-banner">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{submitError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="s-cf-submit-btn"
              >
                {isSubmitting ? (
                  <span>অর্ডার প্রসেস হচ্ছে...</span>
                ) : (
                  <span>
                    অর্ডার কনফার্ম করুন - ৳ {toBengaliDigits(grandTotal)}
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. ORDER CONFIRMATION MODAL                               */}
      {/* ========================================================= */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 text-center shadow-2xl border border-emerald-100">
            <div className="w-16 h-16 bg-emerald-100 text-[#0E5A2E] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-[#08441F] mb-1">
              আলহামদুলিল্লাহ! আপনার অর্ডার সফল হয়েছে
            </h3>
            <p className="text-stone-600 text-sm mb-4">
              অর্ডার আইডি: <span className="font-bold text-stone-900">{orderSuccess.orderId}</span>
            </p>

            <div className="bg-[#FFF9E7] border border-[#F0D99B] rounded-xl p-4 text-left text-sm space-y-2 mb-6">
              <p className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <span className="text-stone-600">গ্রাহকের নাম:</span>
                <span className="font-semibold text-stone-900">{orderSuccess.name}</span>
              </p>
              <p className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <span className="text-stone-600">মোবাইল নাম্বার:</span>
                <span className="font-semibold text-stone-900">{orderSuccess.phone}</span>
              </p>
              <p className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <span className="text-stone-600">ঠিকানা:</span>
                <span className="font-semibold text-stone-900 text-right max-w-[200px]">{orderSuccess.address}</span>
              </p>
              <p className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <span className="text-stone-600">পরিমাণ:</span>
                <span className="font-semibold text-stone-900">
                  {toBengaliDigits(orderSuccess.quantity)}টি ফাইল
                </span>
              </p>
              <p className="flex justify-between pt-1 text-base font-bold text-[#0E5A2E]">
                <span>মোট প্রদেয় বিল:</span>
                <span>৳ {toBengaliDigits(orderSuccess.total)} (ফ্রি হোম ডেলিভারি)</span>
              </p>
            </div>

            <button
              onClick={() => {
                setOrderSuccess(null);
                setFormData({ name: "", address: "", phone: "" });
              }}
              className="w-full bg-[#0E5A2E] hover:bg-[#2E8B4A] text-white font-bold py-3 px-6 rounded-xl transition duration-200 shadow-lg text-lg cursor-pointer"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}


    </div>
  );
}
