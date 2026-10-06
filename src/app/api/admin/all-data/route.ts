import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const revalidate = 0;

export async function GET() {
  try {
    const [
      ordersRes,
      orderItemsRes,
      productsRes,
      categoriesRes,
      inventoryRes,
      chatsRes,
      chatMessagesRes,
      landingRes,
      pagesRes,
      couponsRes,
      adminUsersRes,
      settingsRes,
    ] = await Promise.all([
      supabaseAdmin.from("app_orders").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("app_order_items").select("*"),
      supabaseAdmin.from("app_products").select("*").order("sort_order", { ascending: true }),
      supabaseAdmin.from("app_categories").select("*").order("sort_order", { ascending: true }),
      supabaseAdmin.from("app_inventory_transactions").select("*").order("created_at", { ascending: false }).limit(50),
      supabaseAdmin.from("app_chats").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("app_chat_messages").select("*").order("created_at", { ascending: true }),
      supabaseAdmin.from("app_landing_pages").select("*").limit(1).single(),
      supabaseAdmin.from("app_pages").select("*"),
      supabaseAdmin.from("app_coupons").select("*"),
      supabaseAdmin.from("app_admin_users").select("id, username, role, permissions, created_at"),
      supabaseAdmin.from("app_settings").select("*").eq("id", 1).single(),
    ]);

    // Attach items to orders
    const itemsByOrder: Record<string, any[]> = {};
    if (orderItemsRes.data) {
      orderItemsRes.data.forEach((item) => {
        if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
        itemsByOrder[item.order_id].push(item);
      });
    }

    const ordersWithItems = (ordersRes.data || []).map((order) => ({
      ...order,
      items: itemsByOrder[order.id] || [],
    }));

    return NextResponse.json({
      success: true,
      orders: ordersWithItems,
      products: productsRes.data || [],
      categories: categoriesRes.data || [],
      inventory_transactions: inventoryRes.data || [],
      chats: chatsRes.data || [],
      chat_messages: chatMessagesRes.data || [],
      landing: landingRes.data || null,
      pages: pagesRes.data || [],
      coupons: couponsRes.data || [],
      users: adminUsersRes.data || [],
      settings: settingsRes.data || null,
    });
  } catch (err: any) {
    console.error("All data fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 });
  }
}
