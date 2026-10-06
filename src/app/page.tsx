import React from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PainPointsSection from "@/components/PainPointsSection";
import FeaturesSection from "@/components/FeaturesSection";
import IngredientsSection from "@/components/IngredientsSection";
import UsageSection from "@/components/UsageSection";
import CertificationSection from "@/components/CertificationSection";
import UrgencySection from "@/components/UrgencySection";
import ReviewsSection from "@/components/ReviewsSection";
import OrderSection from "@/components/OrderSection";
import FloatingStickyBar from "@/components/FloatingStickyBar";
import WhatsAppWidget from "@/components/WhatsAppWidget";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#fafaf9]">
      {/* 1. Top Announcement Bar */}
      <TopBar />

      {/* 2. Header with Logo & Quick Order */}
      <Header />

      {/* 3. Hero Section with Price, Timer, Product Packshot & CTAs */}
      <HeroSection />

      {/* 4. Pain Agitation Section (6 Real Daily Problems) */}
      <PainPointsSection />

      {/* 5. Key Benefits & Physical Functions */}
      <FeaturesSection />

      {/* 6. 27 Herbal Ingredients Showcase Banner & List */}
      <IngredientsSection />

      {/* 7. 3-Step Simple Usage Guide */}
      <UsageSection />

      {/* 8. Official Lab Test & Quality Certification */}
      <CertificationSection />

      {/* 9. Emotional Warning / Urgency Callout */}
      <UrgencySection />

      {/* 10. Verified Customer Reviews & Testimonials */}
      <ReviewsSection />

      {/* 11. High-Converting Checkout Order Form with Package Selector */}
      <OrderSection />

      {/* 12. Mobile Sticky Bottom Action Bar */}
      <FloatingStickyBar />

      {/* 13. Floating WhatsApp Direct Assistance Widget */}
      <WhatsAppWidget />

      {/* 14. Clean Minimal Footer */}
      <footer className="py-6 text-center text-xs text-stone-500 bg-[#f5f5f3] pb-24 sm:pb-8 border-t border-stone-200/60">
        <p>© {new Date().getFullYear()} শিফা কেয়ার। সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </main>
  );
}
