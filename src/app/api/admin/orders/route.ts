import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const revalidate = 0;

// GET: List all orders
export async function GET() {
  try {
    const { data: orders, error } = await supabaseAdmin
      .from("app_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: items } = await supabaseAdmin.from("app_order_items").select("*");
    const itemsMap: Record<string, any[]> = {};
    if (items) {
      items.forEach((it) => {
        if (!itemsMap[it.order_id]) itemsMap[it.order_id] = [];
        itemsMap[it.order_id].push(it);
      });
    }

    const fullOrders = (orders || []).map((o) => ({
      ...o,
      items: itemsMap[o.id] || [],
    }));

    return NextResponse.json({ orders: fullOrders });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST: Add manual order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customer_name,
      phone,
      address,
      district = "Dhaka",
      product_name = "শিফা পেইন কেয়ার অয়েল",
      quantity = 1,
      price = 950,
      delivery_charge = 60,
      note = "",
      status = "pending",
    } = body;

    const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const subtotal = quantity * price;
    const grandTotal = subtotal + delivery_charge;

    const { data: order, error } = await supabaseAdmin
      .from("app_orders")
      .insert({
        order_number: orderNumber,
        customer_name,
        phone,
        address,
        district,
        subtotal,
        delivery_charge,
        grand_total: grandTotal,
        status,
        note,
        courier_ratio_data: {
          success_rate: 98,
          risk: "low",
          total_orders: 1,
        },
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (order?.id) {
      await supabaseAdmin.from("app_order_items").insert({
        order_id: order.id,
        product_name,
        quantity,
        price,
      });
    }

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// PATCH: Update order status, courier info, notes
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("app_orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

// DELETE: Delete order
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("app_orders").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
