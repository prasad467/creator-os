import { NextResponse } from "next/server";
import { verifyTOTP, supabaseAdmin } from "@/lib/adminAuth";

export async function POST(req: Request) {
  const { userId, token } = await req.json();

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("totp_secret")
    .eq("id", userId)
    .single();

  if (!profile?.totp_secret) return NextResponse.json({ error: "2FA not setup" }, { status: 400 });

  const valid = verifyTOTP(token, profile.totp_secret);

  if (!valid) return NextResponse.json({ error: "Invalid TOTP" }, { status: 400 });

  // Enable 2FA
  await supabaseAdmin
    .from("profiles")
    .update({ is_totp_enabled: true })
    .eq("id", userId);

  return NextResponse.json({ success: true });
}