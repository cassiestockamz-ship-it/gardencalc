import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = "https://yoypsojuedwyzymbsubu.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/email_subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        email,
        site_id: "plantingcalc",
        source: source || "general",
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      // Duplicate email (unique constraint) — still return success to user
      if (text.includes("duplicate") || text.includes("unique")) {
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
