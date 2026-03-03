import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/adminAuth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const { data: admin, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !admin) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

  if (admin.password !== password) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

  if (admin.is_totp_enabled) {
    // Already 2FA enabled → require OTP
    return NextResponse.json({ requireTOTP: true, userId: admin.id });
  }

  // Not yet 2FA enabled → login success
  return NextResponse.json({ success: true, userId: admin.id });
}