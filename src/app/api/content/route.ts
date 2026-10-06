import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const revalidate = 0; // Always serve fresh data

export async function GET() {
  try {
    const [settingsRes, productRes, landingRes, pagesRes] = await Promise.all([
      supabaseAdmin.from("app_settings").select("*").eq("id", 1).single(),
      supabaseAdmin
        .from("app_products")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .limit(1)
        .single(),
      supabaseAdmin
        .from("app_landing_pages")
        .select("*")
        .eq("is_active", true)
        .limit(1)
        .single(),
      supabaseAdmin.from("app_pages").select("*"),
    ]);

    const settings = settingsRes.data || {
      site_name: "আল-শিফা কেয়ার (Al-Shifa Care)",
      hotline_number: "01886367377",
      whatsapp_number: "01886367377",
      whatsapp_default_message: "হ্যালো, আমি আল-শিফা ন্যাচারাল অয়েল সম্পর্কে জানতে চাই।",
      delivery_charge_inside: 60,
      delivery_charge_outside: 120,
      free_delivery_min_order: 2000,
      announcement_text: "🌿 সীমিত সময়ের অফার! আজই অর্ডার করুন এবং উপভোগ করুন ফ্রি হোম ডেলিভারি।",
      is_announcement_active: true,
      is_live_chat_active: true,
    };

    const product = productRes.data || null;
    const landing = landingRes.data || null;
    const pages = pagesRes.data || [];

    // Map backwards-compatible settings dictionary for existing components
    const settingsDict: Record<string, string> = {
      site_name: settings.site_name || "Al-Shifa Care",
      hotline_number: settings.hotline_number || "01886367377",
      whatsapp_number: settings.whatsapp_number || "01886367377",
      whatsapp_default_message: settings.whatsapp_default_message || "",
      delivery_charge_inside: String(settings.delivery_charge_inside || 60),
      delivery_charge_outside: String(settings.delivery_charge_outside || 120),
      announcement_text: settings.announcement_text || "",
      is_announcement_active: settings.is_announcement_active ? "true" : "false",
      price_current: product ? String(product.price) : "950",
      price_regular: product && product.original_price ? String(product.original_price) : "1550",
      product_name: product ? product.name_primary : "শিফা পেইন কেয়ার অয়েল",
    };

    if (landing) {
      settingsDict.hero_title = landing.title || "শিফা পেইন কেয়ার অয়েল";
      settingsDict.hero_subtitle = landing.subtitle || "প্রকৃতির ছোঁয়ায় ব্যথা নিরাময়ের বিশ্বস্ত সঙ্গী";
      settingsDict.hero_intro = landing.description || "";
      settingsDict.template_color = landing.template_color || "#ff3f60";
    }

    return NextResponse.json({
      success: true,
      settings: settingsDict,
      raw_settings: settings,
      product,
      landing,
      reviews: landing?.testimonials || [],
      faq: landing?.faq || [],
      features: landing?.features || [],
      pages,
    });
  } catch (err: any) {
    console.error("Content API error:", err);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}
