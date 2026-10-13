import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function hasNumericValue(val: any): boolean {
  return val !== undefined && val !== null && String(val).trim() !== "";
}

function parseNumeric(val: any): number {
  if (val === null || val === undefined || val === "") return 0;
  const bnToEn: Record<string, string> = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  };
  const cleaned = String(val)
    .replace(/[০-৯]/g, (d) => bnToEn[d] || d)
    .replace(/[^0-9.]/g, "");
  return Number(cleaned) || 0;
}

export async function GET() {
  try {
    const [{ data: landing, error }, { data: prod }] = await Promise.all([
      supabaseAdmin
        .from("app_landing_pages")
        .select("*")
        .eq("slug", "shifa-care")
        .maybeSingle(),
      supabaseAdmin
        .from("app_products")
        .select("*")
        .order("sort_order", { ascending: true })
        .limit(1)
        .maybeSingle(),
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (landing) {
      const fallbackPrice =
        prod && hasNumericValue(prod.price)
          ? parseNumeric(prod.price)
          : 950;
      const fallbackOrig =
        prod && hasNumericValue(prod.original_price)
          ? parseNumeric(prod.original_price)
          : 1450;

      if (landing.sections_data) {
        const co = landing.sections_data.checkout || {};
        landing.sections_data.checkout = {
          ...co,
          price_current: hasNumericValue(co.price_current) ? parseNumeric(co.price_current) : fallbackPrice,
          price_regular: hasNumericValue(co.price_regular) ? parseNumeric(co.price_regular) : fallbackOrig,
        };
      }
      if (landing.draft_sections_data) {
        const co = landing.draft_sections_data.checkout || {};
        landing.draft_sections_data.checkout = {
          ...co,
          price_current: hasNumericValue(co.price_current) ? parseNumeric(co.price_current) : fallbackPrice,
          price_regular: hasNumericValue(co.price_regular) ? parseNumeric(co.price_regular) : fallbackOrig,
        };
      }
    }

    // Fetch latest revisions
    let revisions: any[] = [];
    if (landing?.id) {
      const { data: revData } = await supabaseAdmin
        .from("app_landing_page_revisions")
        .select("id, revision_name, created_at, seo_metadata")
        .eq("landing_page_id", landing.id)
        .order("created_at", { ascending: false })
        .limit(10);
      revisions = revData || [];
    }

    return NextResponse.json({
      success: true,
      landing,
      product: prod || null,
      revisions,
    });
  } catch (err: any) {
    console.error("Fetch landing error:", err);
    return NextResponse.json({ error: "Failed to fetch landing" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      action = "publish", // 'publish' | 'save_draft' | 'restore_revision'
      revision_id,
      sections_data,
      sections_order,
      seo_title,
      seo_description,
      seo_keywords,
      og_image,
      canonical_url,
      title,
      subtitle,
      description,
      template_color,
      features,
      testimonials,
      faq,
      pixel_id,
      capi_token,
      is_active,
    } = body;

    // Fetch existing landing page record
    const { data: existing } = await supabaseAdmin
      .from("app_landing_pages")
      .select("*")
      .eq("slug", "shifa-care")
      .maybeSingle();

    if (!existing) {
      return NextResponse.json({ error: "Landing page record not found" }, { status: 404 });
    }

    const now = new Date().toISOString();

    // 1. ACTION: RESTORE REVISION
    if (action === "restore_revision" && revision_id) {
      const { data: rev, error: revError } = await supabaseAdmin
        .from("app_landing_page_revisions")
        .select("*")
        .eq("id", revision_id)
        .single();

      if (revError || !rev) {
        return NextResponse.json({ error: "রিভিশন খুঁজে পাওয়া যায়নি।" }, { status: 404 });
      }

      const updatePayload: any = {
        sections_data: rev.sections_data,
        sections_order: rev.sections_order,
        draft_sections_data: rev.sections_data,
        draft_sections_order: rev.sections_order,
        seo_title: rev.seo_metadata?.title || existing.seo_title,
        seo_description: rev.seo_metadata?.description || existing.seo_description,
        seo_keywords: rev.seo_metadata?.keywords || existing.seo_keywords,
        og_image: rev.seo_metadata?.og_image || existing.og_image,
        canonical_url: rev.seo_metadata?.canonical_url || existing.canonical_url,
        status: "published",
        published_at: now,
        updated_at: now,
      };

      const { data: updated, error: updateError } = await supabaseAdmin
        .from("app_landing_pages")
        .update(updatePayload)
        .eq("id", existing.id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      try {
        revalidatePath("/", "page");
        revalidatePath("/api/content");
      } catch (e) {}

      return NextResponse.json({
        success: true,
        message: "রিভিশন সফলভাবে রিস্টোর করা হয়েছে।",
        landing: updated,
      });
    }

    // 2. Prepare payload based on sections_data or legacy inputs
    const targetSectionsData = sections_data || existing.draft_sections_data || existing.sections_data || {};
    const targetSectionsOrder = sections_order || existing.draft_sections_order || existing.sections_order || [];

    // Sanitize and normalize checkout pricing (allow 0 or any positive number)
    if (targetSectionsData?.checkout) {
      const co = targetSectionsData.checkout;
      const effectivePrice = hasNumericValue(co.price_current)
        ? parseNumeric(co.price_current)
        : hasNumericValue(existing.sections_data?.checkout?.price_current)
        ? parseNumeric(existing.sections_data?.checkout?.price_current)
        : 950;

      const effectiveRegular = hasNumericValue(co.price_regular)
        ? parseNumeric(co.price_regular)
        : 0;

      const rawDelivery = hasNumericValue(co.delivery_charge)
        ? parseNumeric(co.delivery_charge)
        : 0;

      targetSectionsData.checkout = {
        ...co,
        price_current: effectivePrice,
        price_regular: effectiveRegular,
        delivery_charge: rawDelivery,
      };
    }

    // Sync legacy columns for compatibility if modified
    const syncFeatures = features || targetSectionsData?.badges?.items || existing.features;
    const syncTestimonials = testimonials || targetSectionsData?.reviews?.items || existing.testimonials;
    const syncFaq = faq || existing.faq;
    const syncTitle = title || targetSectionsData?.hero?.title || existing.title;
    const syncSubtitle = subtitle || targetSectionsData?.hero?.subtitle || existing.subtitle;
    const syncDescription = description || targetSectionsData?.hero?.description || existing.description;

    const baseUpdate: any = {
      title: syncTitle,
      subtitle: syncSubtitle,
      description: syncDescription,
      template_color: template_color || existing.template_color || "#ff3f60",
      features: syncFeatures,
      testimonials: syncTestimonials,
      faq: syncFaq,
      pixel_id: pixel_id !== undefined ? pixel_id : existing.pixel_id,
      capi_token: capi_token !== undefined ? capi_token : existing.capi_token,
      is_active: is_active !== undefined ? is_active : existing.is_active,
      seo_title: seo_title || existing.seo_title,
      seo_description: seo_description || existing.seo_description,
      seo_keywords: seo_keywords || existing.seo_keywords,
      og_image: og_image || existing.og_image,
      canonical_url: canonical_url || existing.canonical_url,
      updated_at: now,
    };

    if (action === "save_draft") {
      // Save draft, and also sync checkout pricing live so price changes are never stuck
      baseUpdate.draft_sections_data = targetSectionsData;
      baseUpdate.draft_sections_order = targetSectionsOrder;
      if (targetSectionsData?.checkout) {
        baseUpdate.sections_data = {
          ...(existing.sections_data || {}),
          checkout: targetSectionsData.checkout,
        };
      }
      baseUpdate.status = "draft";
    } else {
      // Publish live
      baseUpdate.sections_data = targetSectionsData;
      baseUpdate.sections_order = targetSectionsOrder;
      baseUpdate.draft_sections_data = targetSectionsData;
      baseUpdate.draft_sections_order = targetSectionsOrder;
      baseUpdate.status = "published";
      baseUpdate.published_at = now;
    }

    const { data: updatedLanding, error: saveError } = await supabaseAdmin
      .from("app_landing_pages")
      .update(baseUpdate)
      .eq("id", existing.id)
      .select()
      .single();

    if (saveError) {
      console.error("Landing update error:", saveError);
      return NextResponse.json({ error: saveError.message }, { status: 500 });
    }

    // Always sync product price & name to app_products so both tables match 100%
    const checkoutCfg = targetSectionsData?.checkout;
    if (checkoutCfg) {
      const prodUpdate: any = {};
      if (hasNumericValue(checkoutCfg.price_current)) {
        prodUpdate.price = parseNumeric(checkoutCfg.price_current);
      }
      if (checkoutCfg.price_regular !== undefined) {
        const regVal = parseNumeric(checkoutCfg.price_regular);
        prodUpdate.original_price = regVal > 0 ? regVal : null;
      }
      if (checkoutCfg.product_name) {
        prodUpdate.name_primary = checkoutCfg.product_name;
      }
      if (Object.keys(prodUpdate).length > 0) {
        const { data: allProds } = await supabaseAdmin
          .from("app_products")
          .select("id")
          .order("sort_order", { ascending: true })
          .limit(1);
        if (allProds && allProds[0]?.id) {
          await supabaseAdmin
            .from("app_products")
            .update(prodUpdate)
            .eq("id", allProds[0].id);
        }
      }
    }

    // If published, create revision snapshot
    if (action === "publish") {
      await supabaseAdmin.from("app_landing_page_revisions").insert({
        landing_page_id: existing.id,
        revision_name: `পাবলিশড - ${new Date().toLocaleDateString("bn-BD")} ${new Date().toLocaleTimeString("bn-BD")}`,
        sections_data: targetSectionsData,
        sections_order: targetSectionsOrder,
        seo_metadata: {
          title: baseUpdate.seo_title,
          description: baseUpdate.seo_description,
          keywords: baseUpdate.seo_keywords,
          og_image: baseUpdate.og_image,
          canonical_url: baseUpdate.canonical_url,
        },
      });
    }

    // Targeted Next.js cache revalidation
    try {
      revalidatePath("/", "page");
      revalidatePath("/api/content");
    } catch (err) {
      console.warn("Revalidation notice:", err);
    }

    return NextResponse.json({
      success: true,
      message: action === "save_draft" ? "ড্রাফট ও মূল্য সফলভাবে সেভ হয়েছে।" : "ল্যান্ডিং পেজ সফলভাবে লাইভ পাবলিশ হয়েছে!",
      landing: updatedLanding,
    });
  } catch (err: any) {
    console.error("Landing patch error:", err);
    return NextResponse.json({ error: "Failed to update landing page" }, { status: 500 });
  }
}
