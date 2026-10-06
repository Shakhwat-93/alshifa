import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const revalidate = 0; // Don't cache on server, always fresh

export async function GET() {
  try {
    const [settingsRes, reviewsRes] = await Promise.all([
      supabaseAdmin.from("alshifa_settings").select("key, value"),
      supabaseAdmin
        .from("alshifa_reviews")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true }),
    ]);

    const settingsObj: Record<string, string> = {};
    if (settingsRes.data) {
      settingsRes.data.forEach((item: { key: string; value: string }) => {
        settingsObj[item.key] = item.value;
      });
    }

    return NextResponse.json({
      settings: settingsObj,
      reviews: reviewsRes.data || [],
    });
  } catch (err: any) {
    console.error("Content API error:", err);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}
