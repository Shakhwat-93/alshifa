import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const revalidate = 0;

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("app_landing_pages")
      .select("*")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ landing: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch landing" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
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

    // Check if row exists
    const { data: existing } = await supabaseAdmin
      .from("app_landing_pages")
      .select("id")
      .limit(1)
      .single();

    let result;
    if (existing?.id) {
      result = await supabaseAdmin
        .from("app_landing_pages")
        .update({
          title,
          subtitle,
          description,
          template_color,
          features,
          testimonials,
          faq,
          pixel_id,
          capi_token,
          is_active: is_active ?? true,
        })
        .eq("id", existing.id)
        .select()
        .single();
    } else {
      result = await supabaseAdmin
        .from("app_landing_pages")
        .insert({
          slug: "shifa-care",
          title,
          subtitle,
          description,
          template_color: template_color || "#ff3f60",
          features: features || [],
          testimonials: testimonials || [],
          faq: faq || [],
          pixel_id,
          capi_token,
          is_active: true,
        })
        .select()
        .single();
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, landing: result.data });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update landing page" }, { status: 500 });
  }
}
