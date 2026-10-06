import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      address,
      district = "Dhaka",
      quantity = 1,
      unitPrice = 950,
      deliveryCharge = 0,
      note = "",
      productId,
      variant = "",
    } = body;

    if (!name || !phone || !address) {
      return NextResponse.json(
        { error: "সকল প্রয়োজনীয় তথ্য পূরণ করুন।" },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone).replace(/\s+/g, "");
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: "সঠিক ১১ ডিজিটের মোবাইল নাম্বার লিখুন।" },
        { status: 400 }
      );
    }

    const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const price = parseInt(unitPrice, 10) || 950;
    const delCharge = parseInt(deliveryCharge, 10) || 0;
    const subtotal = qty * price;
    const grandTotal = subtotal + delCharge;

    // 1. Insert Order into app_orders
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from("app_orders")
      .insert({
        order_number: orderNumber,
        customer_name: name.trim(),
        phone: cleanPhone,
        address: address.trim(),
        district: district.trim(),
        subtotal: subtotal,
        delivery_charge: delCharge,
        discount_amount: 0,
        grand_total: grandTotal,
        status: "pending",
        note: note || null,
        courier_ratio_data: {
          success_rate: 96,
          risk: "low",
          total_orders: 1,
          canceled_orders: 0,
        },
      })
      .select()
      .single();

    if (orderError) {
      console.error("app_orders insert error:", orderError);
      return NextResponse.json(
        { error: "অর্ডার ডাটাবেজে সংরক্ষণ করা যায়নি।" },
        { status: 500 }
      );
    }

    // 2. Fetch or fallback product
    let targetProductId = productId;
    let targetProductName = "আল-শিফা প্রিমিয়াম হেয়ার অয়েল";

    if (!targetProductId) {
      const { data: prod } = await supabaseAdmin
        .from("app_products")
        .select("id, name_primary, stock")
        .limit(1)
        .single();
      if (prod) {
        targetProductId = prod.id;
        targetProductName = prod.name_primary;

        // Decrement stock
        if (prod.stock !== undefined && prod.stock !== null) {
          await supabaseAdmin
            .from("app_products")
            .update({ stock: Math.max(0, prod.stock - qty) })
            .eq("id", prod.id);
        }
      }
    }

    // 3. Insert order item
    if (orderData?.id) {
      await supabaseAdmin.from("app_order_items").insert({
        order_id: orderData.id,
        product_id: targetProductId || null,
        product_name: targetProductName,
        selected_variant: variant || null,
        quantity: qty,
        price: price,
      });

      // 4. Log Inventory Transaction
      if (targetProductId) {
        await supabaseAdmin.from("app_inventory_transactions").insert({
          product_id: targetProductId,
          quantity: -qty,
          transaction_type: "Sale",
          reference: orderNumber,
          created_by: "System / Online Checkout",
        });
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: orderData.id,
        order_id: orderData.order_number,
        customer_name: orderData.customer_name,
        customer_phone: orderData.phone,
        customer_address: orderData.address,
        quantity: qty,
        unit_price: price,
        total_price: grandTotal,
        status: orderData.status,
      },
    });
  } catch (err: any) {
    console.error("Order API exception:", err);
    return NextResponse.json(
      { error: "সার্ভারে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
