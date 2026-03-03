import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/adminAuth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const { data: admin, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !admin) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  if (admin.password !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: "Logged in successfully" });
}
