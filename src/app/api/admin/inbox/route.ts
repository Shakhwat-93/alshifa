import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const revalidate = 0;

export async function GET() {
  try {
    const { data: chats, error } = await supabaseAdmin
      .from("app_chats")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data: messages } = await supabaseAdmin
      .from("app_chat_messages")
      .select("*")
      .order("created_at", { ascending: true });

    return NextResponse.json({ chats, messages: messages || [] });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch chat data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { chat_id, sender_role = "agent", sender_name = "Admin Staff", message_body, is_internal = false } = body;

    if (!chat_id || !message_body) {
      return NextResponse.json({ error: "chat_id and message_body required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("app_chat_messages")
      .insert({
        chat_id,
        sender_role: is_internal ? "internal_note" : sender_role,
        sender_name,
        body: message_body,
        is_seen: true,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, message: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, label } = body;

    if (!id) return NextResponse.json({ error: "Chat ID required" }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from("app_chats")
      .update({ status, label })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, chat: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update chat" }, { status: 500 });
  }
}
