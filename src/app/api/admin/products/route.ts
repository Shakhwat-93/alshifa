import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

async function syncProductToLanding(product: any) {
  if (!product) return;
  try {
    const { data: landing } = await supabaseAdmin
      .from("app_landing_pages")
      .select("id, sections_data, draft_sections_data")
      .eq("slug", "shifa-care")
      .maybeSingle();

    if (landing) {
      const validPrice = parseNumeric(product.price) > 0
        ? parseNumeric(product.price)
        : parseNumeric(product.original_price) > 0
        ? parseNumeric(product.original_price)
        : 950;
      const validOrigPrice = parseNumeric(product.original_price);

      const pubSections = { ...(landing.sections_data || {}) };
      pubSections.checkout = {
        ...(pubSections.checkout || {}),
        price_current: validPrice,
        price_regular: validOrigPrice,
        ...(product.name_primary ? { product_name: product.name_primary } : {}),
      };

      const draftSections = { ...(landing.draft_sections_data || landing.sections_data || {}) };
      draftSections.checkout = {
        ...(draftSections.checkout || {}),
        price_current: validPrice,
        price_regular: validOrigPrice,
        ...(product.name_primary ? { product_name: product.name_primary } : {}),
      };

      await supabaseAdmin
        .from("app_landing_pages")
        .update({
          sections_data: pubSections,
          draft_sections_data: draftSections,
          updated_at: new Date().toISOString(),
        })
        .eq("id", landing.id);
    }

    try {
      revalidatePath("/", "page");
      revalidatePath("/api/content");
    } catch {}
  } catch (err) {
    console.error("Failed to sync product price to landing:", err);
  }
}

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

    const parsedPrice = parseNumeric(price);
    const parsedOrig = parseNumeric(original_price);
    const effectivePrice = parsedPrice > 0 ? parsedPrice : parsedOrig > 0 ? parsedOrig : 950;

    const { data, error } = await supabaseAdmin
      .from("app_products")
      .insert({
        name_primary,
        name_secondary,
        code: code || "SHIFA-" + Math.floor(100 + Math.random() * 900),
        slug: finalSlug,
        price: effectivePrice,
        original_price: parsedOrig > 0 ? parsedOrig : null,
        stock: parseNumeric(stock),
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

    await syncProductToLanding(data);

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
      let firstUpdatedProduct: any = null;
      for (const item of body.bulkUpdates) {
        if (item.id) {
          const parsedP = item.price !== undefined ? parseNumeric(item.price) : undefined;
          const parsedO = item.original_price !== undefined ? parseNumeric(item.original_price) : undefined;
          const { data: updatedProd } = await supabaseAdmin
            .from("app_products")
            .update({
              price: parsedP !== undefined && parsedP > 0 ? parsedP : undefined,
              original_price: parsedO !== undefined ? parsedO : undefined,
              stock: item.stock !== undefined ? parseNumeric(item.stock) : undefined,
            })
            .eq("id", item.id)
            .select()
            .single();
          if (!firstUpdatedProduct && updatedProd) {
            firstUpdatedProduct = updatedProd;
          }
        }
      }
      if (firstUpdatedProduct) {
        await syncProductToLanding(firstUpdatedProduct);
      }
      return NextResponse.json({ success: true, message: "Bulk update saved" });
    }

    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    const cleanUpdates: any = { ...updates };
    if (cleanUpdates.price !== undefined) {
      const p = parseNumeric(cleanUpdates.price);
      const o = cleanUpdates.original_price !== undefined ? parseNumeric(cleanUpdates.original_price) : 0;
      cleanUpdates.price = p > 0 ? p : o > 0 ? o : 950;
    }
    if (cleanUpdates.original_price !== undefined) {
      const o = parseNumeric(cleanUpdates.original_price);
      cleanUpdates.original_price = o > 0 ? o : null;
    }
    if (cleanUpdates.stock !== undefined) {
      cleanUpdates.stock = parseNumeric(cleanUpdates.stock);
    }

    const { data, error } = await supabaseAdmin
      .from("app_products")
      .update(cleanUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await syncProductToLanding(data);

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
