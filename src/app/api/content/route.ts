import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";
export const revalidate = 0; // Always serve fresh data

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isPreview = searchParams.get("preview") === "true" || searchParams.get("draft") === "true";

    const [settingsRes, productRes, landingRes, pagesRes] = await Promise.all([
      supabaseAdmin.from("app_settings").select("*").eq("id", 1).maybeSingle(),
      supabaseAdmin
        .from("app_products")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabaseAdmin
        .from("app_landing_pages")
        .select("*")
        .eq("slug", "shifa-care")
        .maybeSingle(),
      supabaseAdmin.from("app_pages").select("*"),
    ]);

    let product = productRes.data || null;
    if (!product) {
      const fallbackProd = await supabaseAdmin
        .from("app_products")
        .select("*")
        .order("sort_order", { ascending: true })
        .limit(1)
        .maybeSingle();
      product = fallbackProd.data || null;
    }

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

    const landing = landingRes.data || null;
    const pages = pagesRes.data || [];

    const activePrice = product && Number(product.price) > 0 ? Number(product.price) : 950;
    const regularPrice = product && Number(product.original_price) > 0 ? Number(product.original_price) : 1450;

    // Pick sections data: Draft if in preview mode, else Published
    const activeSectionsData = isPreview
      ? (landing?.draft_sections_data || landing?.sections_data || {})
      : (landing?.sections_data || landing?.draft_sections_data || {});

    const activeSectionsOrder = isPreview
      ? (landing?.draft_sections_order || landing?.sections_order || [])
      : (landing?.sections_order || landing?.draft_sections_order || []);

    const heroSection = activeSectionsData?.hero || {};
    const announcementSection = activeSectionsData?.announcement || {};

    // Map backwards-compatible settings dictionary for existing components
    const settingsDict: Record<string, string> = {
      site_name: settings.site_name || "Al-Shifa Care",
      hotline_number: announcementSection.phone || settings.hotline_number || "01886367377",
      whatsapp_number: settings.whatsapp_number || "01886367377",
      whatsapp_default_message: settings.whatsapp_default_message || "",
      delivery_charge_inside: String(settings.delivery_charge_inside || 60),
      delivery_charge_outside: String(settings.delivery_charge_outside || 120),
      announcement_text: announcementSection.text || settings.announcement_text || "",
      is_announcement_active: announcementSection.visible !== false && settings.is_announcement_active !== false ? "true" : "false",
      price_current: String(activePrice),
      price_regular: String(regularPrice),
      product_name: product?.name_primary || "শিফা পেইন কেয়ার অয়েল",
      hero_tag: heroSection.badge_text || "১০০% প্রাকৃতিক ও নিরাপদ",
      hero_title: heroSection.title || landing?.title || product?.name_primary || "শিফা পেইন কেয়ার অয়েল",
      hero_subtitle: heroSection.subtitle || landing?.subtitle || "প্রকৃতির ছোঁয়ায় ব্যথা নিরাময়ের বিশ্বস্ত সঙ্গী",
      hero_intro: heroSection.description || landing?.description || "",
      template_color: landing?.template_color || "#ff3f60",
    };

    // Specific section items
    const reviews = activeSectionsData?.reviews?.items || landing?.testimonials || [];
    const badges = activeSectionsData?.badges?.items || landing?.features || [];
    const ingredients = activeSectionsData?.ingredients?.items || [];
    const gallery = activeSectionsData?.gallery?.items || [];

    const seo = {
      title: landing?.seo_title || "শিফা পেইন কেয়ার অয়েল | Al-Shifa Care",
      description: landing?.seo_description || "প্রাকৃতিক উপাদানে তৈরি শিফা পেইন কেয়ার অয়েল। বাত-ব্যথা, জয়েন্ট ও মাংসপেশির অস্বস্তি নিরাময়ে বিশ্বস্ত সঙ্গী।",
      keywords: landing?.seo_keywords || "shifa pain care, herbal oil, pain relief bd, আল শিফা",
      og_image: landing?.og_image || heroSection.image_url || "/images/product-bottle-main.png",
      canonical_url: landing?.canonical_url || "",
    };

    return NextResponse.json(
      {
        success: true,
        isPreview,
        status: landing?.status || "published",
        settings: settingsDict,
        raw_settings: settings,
        product,
        landing,
        sections_data: activeSectionsData,
        sections_order: activeSectionsOrder,
        seo,
        reviews,
        features: badges,
        ingredients,
        gallery,
        pages,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (err: any) {
    console.error("Content API error:", err);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}
