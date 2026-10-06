import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let query = supabaseAdmin
      .from("alshifa_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(
        `customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%,order_id.ilike.%${search}%`
      );
    }

    const { data: orders, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Stats
    const { data: allOrders } = await supabaseAdmin
      .from("alshifa_orders")
      .select("status, total_price");

    const stats = {
      total: allOrders?.length || 0,
      pending: allOrders?.filter((o) => o.status === "pending").length || 0,
      confirmed: allOrders?.filter((o) => o.status === "confirmed").length || 0,
      delivered: allOrders?.filter((o) => o.status === "delivered").length || 0,
      cancelled: allOrders?.filter((o) => o.status === "cancelled").length || 0,
      revenue:
        allOrders
          ?.filter((o) => o.status !== "cancelled")
          .reduce((sum, o) => sum + Number(o.total_price || 0), 0) || 0,
    };

    return NextResponse.json({ orders: orders || [], stats });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status, notes } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    const { data, error } = await supabaseAdmin
      .from("alshifa_orders")
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("alshifa_orders")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
