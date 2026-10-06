import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

function normalizeBDPhone(phone: any): string {
  const bnToEn: Record<string, string> = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  };
  let cleaned = String(phone || "")
    .replace(/[০-৯]/g, (d) => bnToEn[d] || d)
    .replace(/[^0-9]/g, "");
  if (cleaned.startsWith("880")) {
    cleaned = cleaned.slice(2);
  }
  return cleaned;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, phone } = body;

    if (!phone) {
      return NextResponse.json({ error: "মোবাইল নাম্বার দেওয়া হয়নি।" }, { status: 400 });
    }

    const cleanPhone = normalizeBDPhone(phone);

    // 1. Fetch BDCourier API token from app_settings
    const { data: settings } = await supabaseAdmin
      .from("app_settings")
      .select("bdcourier_api_key")
      .eq("id", 1)
      .single();

    const apiKey = settings?.bdcourier_api_key?.trim();

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "BDCourier API Key পাওয়া যায়নি। অনুগ্রহ করে অ্যাডমিন Settings থেকে BDCourier API Key যুক্ত করুন।",
          requiresKey: true,
        },
        { status: 400 }
      );
    }

    // 2. Call official BDCourier check endpoint
    const response = await fetch("https://api.bdcourier.com/courier-check", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: cleanPhone }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("BDCourier API HTTP Error:", response.status, errText);
      return NextResponse.json(
        { error: `BDCourier API রেসপন্স ব্যর্থ (স্ট্যাটাস: ${response.status})। আপনার API Key যাচাই করুন।` },
        { status: 502 }
      );
    }

    const resJson = await response.json();

    const couriersData = resJson?.data || {};
    const summary = couriersData?.summary || {};
    const reports = resJson?.reports || [];

    const totalOrders = Number(summary.total_parcel) || 0;
    const successOrders = Number(summary.success_parcel) || 0;
    const canceledOrders = Number(summary.cancelled_parcel) || (totalOrders - successOrders >= 0 ? totalOrders - successOrders : 0);

    let successRate = 0;
    if (summary.success_ratio !== undefined && summary.success_ratio !== null) {
      successRate = Math.round(Number(summary.success_ratio));
    } else if (totalOrders > 0) {
      successRate = Math.round((successOrders / totalOrders) * 100);
    }

    let risk: "low" | "medium" | "high" = "low";
    if (totalOrders === 0) {
      risk = "low"; // New customer
    } else if (successRate < 60 || (reports && reports.length > 0)) {
      risk = "high";
    } else if (successRate < 80) {
      risk = "medium";
    }

    const ratioData = {
      total_orders: totalOrders,
      success_orders: successOrders,
      canceled_orders: canceledOrders,
      success_rate: successRate,
      risk,
      reports_count: Array.isArray(reports) ? reports.length : 0,
      reports: Array.isArray(reports) ? reports : [],
      raw_couriers: couriersData,
      checked_at: new Date().toISOString(),
    };

    // 3. Save to app_orders if orderId is provided
    if (orderId) {
      await supabaseAdmin
        .from("app_orders")
        .update({ courier_ratio_data: ratioData })
        .eq("id", orderId);
    }

    return NextResponse.json({
      success: true,
      data: ratioData,
    });
  } catch (err: any) {
    console.error("BDCourier check exception:", err);
    return NextResponse.json(
      { error: "সার্ভারে ত্রুটি হয়েছে: " + (err?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
