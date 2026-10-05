import React from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PainPointsSection from "@/components/PainPointsSection";
import RootCauseSection from "@/components/RootCauseSection";
import FeaturesSection from "@/components/FeaturesSection";
import IngredientsSection from "@/components/IngredientsSection";
import TargetAudienceSection from "@/components/TargetAudienceSection";
import UsageSection from "@/components/UsageSection";
import CertificationSection from "@/components/CertificationSection";
import UrgencySection from "@/components/UrgencySection";
import ReviewsSection from "@/components/ReviewsSection";
import FAQSection from "@/components/FAQSection";
import OrderSection from "@/components/OrderSection";
import FloatingStickyBar from "@/components/FloatingStickyBar";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import Footer from "@/components/Footer";

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

      {/* 5. Root Cause & Herbal Solution Explanation */}
      <RootCauseSection />

      {/* 6. Key Benefits & Physical Functions */}
      <FeaturesSection />

      {/* 7. 27 Herbal Ingredients Showcase Banner & List */}
      <IngredientsSection />

      {/* 8. Target Audience Personas */}
      <TargetAudienceSection />

      {/* 9. 3-Step Simple Usage Guide */}
      <UsageSection />

      {/* 10. Official Lab Test & Quality Certification */}
      <CertificationSection />

      {/* 11. Emotional Warning / Urgency Callout */}
      <UrgencySection />

      {/* 12. Verified Customer Reviews & Testimonials */}
      <ReviewsSection />

      {/* 13. Frequently Asked Questions (FAQ Accordion) */}
      <FAQSection />

      {/* 14. High-Converting Checkout Order Form with Package Selector */}
      <OrderSection />

      {/* 15. Mobile Sticky Bottom Action Bar */}
      <FloatingStickyBar />

      {/* 16. Floating WhatsApp Direct Assistance Widget */}
      <WhatsAppWidget />

      {/* 17. Agency-Level Footer */}
      <Footer />
    </main>
  );
}
