import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const revalidate = 0;

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("app_admin_users")
      .select("id, username, role, permissions, created_at")
      .order("created_at", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ users: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, role = "moderator", permissions = [] } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("app_admin_users")
      .insert({
        username: username.trim(),
        password_hash: password.trim(),
        role,
        permissions,
      })
      .select("id, username, role, permissions, created_at")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, user: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, username, password, role, permissions } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {};
    if (typeof username === "string" && username.trim().length > 0) {
      updatePayload.username = username.trim();
    }
    if (typeof password === "string" && password.trim().length > 0) {
      updatePayload.password_hash = password.trim();
    }
    if (typeof role === "string") {
      updatePayload.role = role;
    }
    if (Array.isArray(permissions)) {
      updatePayload.permissions = permissions;
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("app_admin_users")
      .update(updatePayload)
      .eq("id", id)
      .select("id, username, role, permissions, created_at")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, user: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {}
    }

    if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    const { error } = await supabaseAdmin.from("app_admin_users").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
