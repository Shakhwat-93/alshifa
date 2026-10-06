import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const revalidate = 0;

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from("app_pages").select("*");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ pages: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { slug, title_primary, title_secondary, content_primary, content_secondary } = body;

    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from("app_pages")
      .upsert({
        slug,
        title_primary,
        title_secondary,
        content_primary,
        content_secondary,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, page: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
  }
}
