import React from "react";
import { Phone, Flame } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-[#064e3b] text-white py-2 px-4 sm:px-6 lg:px-8 xl:px-12 text-[12px] sm:text-xs font-medium border-b border-emerald-800">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 truncate">
          <span className="inline-flex items-center justify-center bg-amber-400 text-stone-950 font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0">
            অফার
          </span>
          <span className="truncate">
            আজকের স্পেশাল অফারে সারাদেশে <strong>ক্যাশ অন হোম ডেলিভারি ফ্রি!</strong>
          </span>
        </div>

        <a
          href="tel:09638014666"
          className="shrink-0 inline-flex items-center gap-1 text-emerald-200 hover:text-white transition font-semibold"
        >
          <Phone className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="hidden sm:inline">হটলাইন:</span>
          <span className="font-latin font-bold">09638014666</span>
        </a>
      </div>
    </div>
  );
}
