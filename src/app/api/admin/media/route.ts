import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 40;
    const section = searchParams.get("section");

    let query = supabaseAdmin
      .from("app_media_assets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (section) {
      query = query.eq("section_key", section);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, assets: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch media assets" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const filePath = searchParams.get("file_path");

    if (!id && !filePath) {
      return NextResponse.json({ error: "Asset ID or file path is required" }, { status: 400 });
    }

    let targetPath = filePath;
    if (!targetPath && id) {
      const { data: asset } = await supabaseAdmin
        .from("app_media_assets")
        .select("file_path")
        .eq("id", id)
        .single();
      targetPath = asset?.file_path;
    }

    if (targetPath) {
      await supabaseAdmin.storage.from("landing-assets").remove([targetPath]);
    }

    if (id) {
      await supabaseAdmin.from("app_media_assets").delete().eq("id", id);
    } else if (filePath) {
      await supabaseAdmin.from("app_media_assets").delete().eq("file_path", filePath);
    }

    return NextResponse.json({ success: true, message: "Asset deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete asset" }, { status: 500 });
  }
}
