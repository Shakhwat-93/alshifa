import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("alshifa_settings")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ settings: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { settings } = await request.json();

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Invalid settings data" }, { status: 400 });
    }

    // Upsert all key-values
    const upserts = Object.entries(settings).map(([key, value]) => ({
      key,
      value: String(value),
      updated_at: new Date().toISOString(),
    }));

    for (const item of upserts) {
      await supabaseAdmin
        .from("alshifa_settings")
        .upsert(item, { onConflict: "key" });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
