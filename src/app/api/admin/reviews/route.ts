import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("alshifa_reviews")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ reviews: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, location, rating = 5, review_text, image_url } = body;

    if (!name || !review_text) {
      return NextResponse.json(
        { error: "নাম এবং রিভিউ টেক্সট আবশ্যক" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("alshifa_reviews")
      .insert({
        name,
        location: location || "বাংলাদেশ",
        rating: Number(rating) || 5,
        review_text,
        image_url: image_url || "/images/review-rahima-khatun.avif",
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, review: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to add review" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("alshifa_reviews")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, review: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("alshifa_reviews")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
