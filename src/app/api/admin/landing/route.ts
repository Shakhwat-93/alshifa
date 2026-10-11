import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const { data: landing, error } = await supabaseAdmin
      .from("app_landing_pages")
      .select("*")
      .eq("slug", "shifa-care")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
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
      // Save draft only
      baseUpdate.draft_sections_data = targetSectionsData;
      baseUpdate.draft_sections_order = targetSectionsOrder;
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

      // Targeted Next.js cache revalidation
      try {
        revalidatePath("/", "page");
        revalidatePath("/api/content");
      } catch (err) {
        console.warn("Revalidation notice:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: action === "save_draft" ? "ড্রাফট সফলভাবে সেভ হয়েছে।" : "ল্যান্ডিং পেজ সফলভাবে লাইভ পাবলিশ হয়েছে!",
      landing: updatedLanding,
    });
  } catch (err: any) {
    console.error("Landing patch error:", err);
    return NextResponse.json({ error: "Failed to update landing page" }, { status: 500 });
  }
}
