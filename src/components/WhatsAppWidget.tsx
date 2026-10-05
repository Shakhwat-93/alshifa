import React from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppWidget() {
  return (
    <aside
      aria-label="WhatsApp Support Widget"
      className="hidden md:block fixed bottom-6 right-6 z-40"
    >
      <a
        href="https://wa.me/8809638014666?text=%E0%A6%86%E0%A6%B8%E0%A6%B8%E0%A6%BE%E0%A6%BA%E0%A6%BE%E0%A6%AE%E0%A7%81%20%E0%A6%86%E0%A6%B2%E0%A6%BE%E0%A6%87%E0%A6%95%E0%A7%81%E0%A6%AE%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A6%B6%E0%A6%BF%E0%A6%AB%E0%A6%BE%20%E0%A6%AA%E0%A7%87%E0%A6%87%E0%A6%A8%20%E0%A6%95%E0%A7%87%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%B0%20%E0%A6%85%E0%A6%AF%E0%A6%BC%E0%A7%87%E0%A6%B2%20%E0%A6%B8%E0%A6%AE%E0%A7%8D%E0%A6%AA%E0%A6%B0%E0%A7%8D%E0%A6%95%E0%A7%87%20%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2.5 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="WhatsApp Helpline"
      >
        <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
        <span className="font-bold text-xs">
          হোয়াটসঅ্যাপ হেল্পলাইন
        </span>
      </a>
    </aside>
  );
}
