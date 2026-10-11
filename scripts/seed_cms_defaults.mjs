const baseUrl = 'http://supabasekong-k7v0e6lnxjwerisif54rzczl.187.77.131.65.sslip.io';
const serviceKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4MjAzOTkwMCwiZXhwIjo0OTM3NzEzNTAwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.DrdZTVKHvVSgJsJWciIIOyq91lJodQAzUTZ8FCTV7h4';

const defaultSectionsOrder = [
  "announcement",
  "hero",
  "gallery",
  "offer_banner",
  "badges",
  "intro",
  "ingredients",
  "usage",
  "certification",
  "mid_cta",
  "reviews",
  "timer",
  "final_cta",
  "checkout"
];

const defaultSectionsData = {
  announcement: {
    visible: true,
    text: "🌿 সীমিত সময়ের অফার! আজই অর্ডার করুন এবং উপভোগ করুন ফ্রি হোম ডেলিভারি।",
    phone: "01886367377",
    link_text: "কল করুন: "
  },
  hero: {
    visible: true,
    badge_text: "১০০% প্রাকৃতিক ও নিরাপদ",
    title: "শিফা পেইন কেয়ার অয়েল",
    subtitle: "প্রকৃতির ছোঁয়ায় ব্যথা নিরাময়ের বিশ্বস্ত সঙ্গী",
    description: "শরীরের বিভিন্ন অংশে ব্যথা, পেশীর অস্বস্তি ও ক্লান্তির সময় ম্যাসাজের মাধ্যমে আরামদায়ক অনুভূতি পেতে এটি ব্যবহার করা যেতে পারে।",
    cta_text: "এখনই অর্ডার করুন",
    cta_url: "#checkout",
    image_url: "/images/product-bottle-main.png",
    image_alt: "শিফা পেইন কেয়ার অয়েল বোতল"
  },
  gallery: {
    visible: true,
    items: [
      { src: "/images/natural-pain-relief-promise.png", alt: "শিফা পেইন কেয়ার অয়েল" },
      { src: "/images/herbal-ingredients-showcase.png", alt: "শিফা পেইন কেয়ার অয়েল ভেষজ উপাদান" },
      { src: "/images/product-ad-banner.png", alt: "শিফা পেইন কেয়ার অয়েল বিজ্ঞাপন" }
    ]
  },
  offer_banner: {
    visible: true,
    cta_text: "এখনই অর্ডার করুন",
    cta_url: "#checkout"
  },
  badges: {
    visible: true,
    items: [
      { title: "শরীরের ব্যথা নিরাময়ে তেল", icon: "drop" },
      { title: "২৭টি ভেষজ প্রাকৃতিক উপাদানে তৈরি", icon: "leaf" },
      { title: "পরিবেশবান্ধব ও নিরাপদ", icon: "recycle" }
    ]
  },
  intro: {
    visible: true,
    title: "পণ্যের পরিচিতি",
    text: "শিফা পেইন কেয়ার অয়েল হলো ম্যাসাজের জন্য তৈরি একটি পেইন-রিলিফ অয়েল। শরীরের বিভিন্ন অংশে ব্যথা, পেশীর অস্বস্তি ও ক্লান্তির সময় ম্যাসাজের মাধ্যমে আরামদায়ক অনুভূতি পেতে এটি ব্যবহার করা যেতে পারে।"
  },
  ingredients: {
    visible: true,
    title: "উপাদান সমূহ",
    highlight_title: "🌿 Shifa Pain Care Oil",
    highlight_subtitle: "২৭টি দুর্লভ ও মূল্যবান ভেষজ প্রাকৃতিক উপাদানের সমন্বয়ে তৈরি।",
    items: [
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
      { name: "পেপারমিন্ট অয়েল", type: "drop" }
    ]
  },
  usage: {
    visible: true,
    title: "ব্যবহারের নিয়ম",
    text: "প্রয়োজনীয় পরিমাণ তেল ব্যথাযুক্ত বা অস্বস্তিকর স্থানে নিয়ে ৫-১০ মিনিট হালকা হাতে ম্যাসাজ করুন। প্রয়োজন অনুযায়ী দিনে ২-৩ বার ব্যবহার করা যেতে পারে।"
  },
  certification: {
    visible: true,
    title: "আমাদের সার্টিফিকেশন",
    image_url: "/images/certification-approval.jpg",
    image_alt: "শিফা পেইন কেয়ার অয়েল সার্টিফিকেট"
  },
  mid_cta: {
    visible: true,
    title: "শিফা পেইন কেয়ার অয়েল",
    subtitle: "প্রকৃতির ছোঁয়ায় ব্যথা নিরাময়ের বিশ্বস্ত সঙ্গী",
    cta_text: "এখনই অর্ডার করুন",
    cta_url: "#checkout"
  },
  reviews: {
    visible: true,
    title: "সম্মানিত গ্রাহকদের মতামত",
    items: [
      { id: 1, name: "রহিমা খাতুন", location: "রাজশাহী", image: "/images/review-rahima-khatun.avif", text: "কোমরের ব্যথায় রাতে ঘুমানোর আগে ম্যাসাজ করি, বেশ আরাম পাই। তেলের গন্ধটাও ভালো লেগেছে।", rating: 5 },
      { id: 2, name: "মোঃ আব্দুল করিম", location: "নাটোর", image: "/images/review-abdul-karim.jpg", text: "আম্মার হাঁটুর ব্যথার জন্য নিয়েছিলাম। নিয়মিত ম্যাসাজ করে দিচ্ছি, উনি আরাম পাচ্ছেন।", rating: 5 },
      { id: 3, name: "মোঃ সাকিব হোসেন", location: "মিরপুর, ঢাকা", image: "/images/review-sakib-hossain.jpg", text: "অফিস শেষে ঘাড়ে আর কাঁধে হালকা ম্যাসাজ করলে ক্লান্তি অনেকটাই কমে যায়।", rating: 5 },
      { id: 4, name: "তানভীর হাসান", location: "চট্টগ্রাম", image: "/images/review-tanvir-hasan.jpg", text: "খেলাধুলার পর পেশীর অস্বস্তিতে ব্যবহার করি, ভালো লাগে। ডেলিভারিও তাড়াতাড়ি পেয়েছি।", rating: 5 },
      { id: 5, name: "মোঃ জাহিদুল ইসলাম", location: "বগুড়া", image: "/images/review-zahidul-islam.jpg", text: "আব্বার পায়ের ব্যথায় প্রতিদিন ম্যাসাজ করে দেই, উনি বেশ আরাম পান। আবার অর্ডার করব।", rating: 5 }
    ]
  },
  timer: {
    visible: true,
    title: "অফার টি শেষ হতে বাকি আছে আর মাত্র",
    duration_hours: 5
  },
  final_cta: {
    visible: true,
    title: "আজই অর্ডার করুন শিফা পেইন কেয়ার অয়েল",
    cta_text: "এখনই অর্ডার করুন",
    cta_url: "#checkout",
    phone: "01886367377",
    phone_label: "Hotline: "
  },
  checkout: {
    visible: true,
    header_title: "অর্ডার ফর্ম (ক্যাশ অন ডেলিভারি)",
    header_subtitle: "আপনার অর্ডারটি প্লেস করতে নিচের প্রয়োজনীয় তথ্যগুলো পূরণ করুন।",
    shipping_badge: "সারাদেশে ক্যাশ অন ডেলিভারি",
    submit_btn_text: "অর্ডার কনফার্ম করুন"
  }
};

const seoMetadata = {
  title: "শিফা পেইন কেয়ার অয়েল | Al-Shifa Care",
  description: "প্রাকৃতিক উপাদানে তৈরি শিফা পেইন কেয়ার অয়েল। বাত-ব্যথা, জয়েন্ট ও মাংসপেশির অস্বস্তি নিরাময়ে বিশ্বস্ত সঙ্গী।",
  keywords: "shifa pain care, herbal oil, pain relief bd, আল শিফা",
  og_image: "/images/product-bottle-main.png",
  canonical_url: "https://alshifacare.com"
};

async function seed() {
  const checkRes = await fetch(`${baseUrl}/pg/query`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        SELECT id, sections_order, sections_data FROM public.app_landing_pages WHERE slug = 'shifa-care' LIMIT 1;
      `
    }),
  });

  const existing = await checkRes.json();
  console.log("Existing landing row:", existing);

  const payload = {
    sections_order: defaultSectionsOrder,
    sections_data: defaultSectionsData,
    draft_sections_order: defaultSectionsOrder,
    draft_sections_data: defaultSectionsData,
    seo_title: seoMetadata.title,
    seo_description: seoMetadata.description,
    seo_keywords: seoMetadata.keywords,
    og_image: seoMetadata.og_image,
    canonical_url: seoMetadata.canonical_url,
    status: 'published',
  };

  const updateSql = `
    UPDATE public.app_landing_pages
    SET 
      sections_order = '${JSON.stringify(payload.sections_order).replace(/'/g, "''")}'::jsonb,
      sections_data = '${JSON.stringify(payload.sections_data).replace(/'/g, "''")}'::jsonb,
      draft_sections_order = '${JSON.stringify(payload.draft_sections_order).replace(/'/g, "''")}'::jsonb,
      draft_sections_data = '${JSON.stringify(payload.draft_sections_data).replace(/'/g, "''")}'::jsonb,
      seo_title = '${payload.seo_title.replace(/'/g, "''")}',
      seo_description = '${payload.seo_description.replace(/'/g, "''")}',
      seo_keywords = '${payload.seo_keywords.replace(/'/g, "''")}',
      og_image = '${payload.og_image.replace(/'/g, "''")}',
      canonical_url = '${payload.canonical_url.replace(/'/g, "''")}',
      status = 'published',
      published_at = NOW(),
      updated_at = NOW()
    WHERE slug = 'shifa-care';
  `;

  const updateRes = await fetch(`${baseUrl}/pg/query`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: updateSql }),
  });

  const updateData = await updateRes.json();
  console.log("Update result:", updateData);
}

seed().catch(console.error);
