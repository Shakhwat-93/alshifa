import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const revalidate = 0;

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("app_products")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ products: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name_primary,
      name_secondary,
      code,
      slug,
      price,
      original_price,
      stock,
      description,
      images = [],
      variants = [],
      benefits = [],
      is_active = true,
      is_featured = false,
    } = body;

    const finalSlug =
      slug ||
      (name_secondary || name_primary)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
        "-" +
        Math.floor(100 + Math.random() * 900);

    const { data, error } = await supabaseAdmin
      .from("app_products")
      .insert({
        name_primary,
        name_secondary,
        code: code || "SHIFA-" + Math.floor(100 + Math.random() * 900),
        slug: finalSlug,
        price: Number(price) || 0,
        original_price: original_price ? Number(original_price) : null,
        stock: Number(stock) || 0,
        description,
        images,
        variants,
        benefits,
        is_active,
        is_featured,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Log stock transaction
    if (data?.id && data.stock > 0) {
      await supabaseAdmin.from("app_inventory_transactions").insert({
        product_id: data.id,
        quantity: data.stock,
        transaction_type: "Stock In",
        reference: "Initial Product Creation",
        created_by: "Admin",
      });
    }

    return NextResponse.json({ success: true, product: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    // Support bulk spreadsheet mode updates
    if (Array.isArray(body.bulkUpdates)) {
      for (const item of body.bulkUpdates) {
        if (item.id) {
          await supabaseAdmin
            .from("app_products")
            .update({
              price: item.price !== undefined ? Number(item.price) : undefined,
              original_price: item.original_price !== undefined ? Number(item.original_price) : undefined,
              stock: item.stock !== undefined ? Number(item.stock) : undefined,
            })
            .eq("id", item.id);
        }
      }
      return NextResponse.json({ success: true, message: "Bulk update saved" });
    }

    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from("app_products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, product: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    const { error } = await supabaseAdmin.from("app_products").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
