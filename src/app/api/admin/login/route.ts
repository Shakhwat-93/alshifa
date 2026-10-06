import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "ইউজারনেম এবং পাসওয়ার্ড দিন।" },
        { status: 400 }
      );
    }

    const { data: admin, error } = await supabaseAdmin
      .from("alshifa_admins")
      .select("*")
      .eq("username", username.trim())
      .single();

    if (error || !admin) {
      return NextResponse.json(
        { error: "ভুল ইউজারনেম বা পাসওয়ার্ড।" },
        { status: 401 }
      );
    }

    // Direct match or standard check (default password_hash is 'admin123')
    if (admin.password_hash !== password) {
      return NextResponse.json(
        { error: "ভুল পাসওয়ার্ড।" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
      },
    });

    // Set secure cookie
    response.cookies.set("alshifa_admin_token", "authenticated_" + admin.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: "সার্ভার এরর।" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("alshifa_admin_token");
  return response;
}
