import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, address, quantity = 1, unitPrice = 950 } = body;

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

    const orderId = "SHIFA-" + Math.floor(100000 + Math.random() * 900000);
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const price = parseInt(unitPrice, 10) || 950;
    const totalPrice = qty * price;

    const { data, error } = await supabaseAdmin
      .from("alshifa_orders")
      .insert({
        order_id: orderId,
        customer_name: name.trim(),
        customer_phone: cleanPhone,
        customer_address: address.trim(),
        quantity: qty,
        unit_price: price,
        total_price: totalPrice,
        delivery_fee: 0,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase order insert error:", error);
      return NextResponse.json(
        { error: "অর্ডার ডাটাবেজে সংরক্ষণ করা যায়নি।" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: data,
    });
  } catch (err: any) {
    console.error("Order API exception:", err);
    return NextResponse.json(
      { error: "সার্ভারে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
