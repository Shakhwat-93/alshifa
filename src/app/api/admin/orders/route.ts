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
      status = "processing",
      assigned_to = null,
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
        assigned_to: assigned_to || (status !== "processing" && status !== "completed" && status !== "cancelled" && status !== "trash" ? status : null),
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

// PATCH: Update order status, courier info, notes, items, etc. (single or bulk)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ids, items, ...updates } = body;

    // Bulk update support
    if (ids && Array.isArray(ids) && ids.length > 0) {
      const { data, error } = await supabaseAdmin
        .from("app_orders")
        .update(updates)
        .in("id", ids)
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, orders: data, count: ids.length });
    }

    if (!id) {
      return NextResponse.json({ error: "Order ID or IDs required" }, { status: 400 });
    }

    // Prevent overwriting primary immutable fields if sent
    delete updates.id;
    delete updates.created_at;

    const { data, error } = await supabaseAdmin
      .from("app_orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update order items if provided
    if (items && Array.isArray(items)) {
      await supabaseAdmin.from("app_order_items").delete().eq("order_id", id);
      if (items.length > 0) {
        await supabaseAdmin.from("app_order_items").insert(
          items.map((it: any) => ({
            order_id: id,
            product_name: it.product_name || "শিফা পেইন কেয়ার অয়েল",
            quantity: Number(it.quantity) || 1,
            price: Number(it.price) || 0,
            selected_variant: it.selected_variant || null,
            product_id: it.product_id || null,
          }))
        );
      }
    }

    // Retrieve fresh items
    const { data: orderItems } = await supabaseAdmin
      .from("app_order_items")
      .select("*")
      .eq("order_id", id);

    return NextResponse.json({
      success: true,
      order: {
        ...data,
        items: orderItems || [],
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

// DELETE: Delete order (single or bulk)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const ids = searchParams.get("ids");

    if (ids) {
      const idList = ids.split(",").map((s) => s.trim()).filter(Boolean);
      if (idList.length > 0) {
        const { error } = await supabaseAdmin.from("app_orders").delete().in("id", idList);
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, count: idList.length });
      }
    }

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
