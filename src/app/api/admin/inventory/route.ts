import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const revalidate = 0;

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("app_inventory_transactions")
      .select("*, app_products(name_primary, code)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ transactions: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch inventory log" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, quantity, transaction_type, reference, created_by = "Admin" } = body;

    if (!product_id || quantity === undefined || !transaction_type) {
      return NextResponse.json({ error: "product_id, quantity, and transaction_type required" }, { status: 400 });
    }

    const qtyNumber = Number(quantity);

    // 1. Insert transaction
    const { data: tx, error: txErr } = await supabaseAdmin
      .from("app_inventory_transactions")
      .insert({
        product_id,
        quantity: qtyNumber,
        transaction_type,
        reference: reference || null,
        created_by,
      })
      .select()
      .single();

    if (txErr) return NextResponse.json({ error: txErr.message }, { status: 500 });

    // 2. Fetch current stock and update
    const { data: prod } = await supabaseAdmin
      .from("app_products")
      .select("stock")
      .eq("id", product_id)
      .single();

    if (prod) {
      const currentStock = prod.stock || 0;
      const newStock = Math.max(0, currentStock + qtyNumber);
      await supabaseAdmin.from("app_products").update({ stock: newStock }).eq("id", product_id);
    }

    return NextResponse.json({ success: true, transaction: tx });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to log inventory mutation" }, { status: 500 });
  }
}
