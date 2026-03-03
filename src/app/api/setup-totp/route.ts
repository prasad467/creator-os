// import { NextResponse } from "next/server";
// import { generateTOTPWithQR, supabaseAdmin } from "@/lib/adminAuth";

// export async function POST(req: Request) {
//   const { userId, manualSecret } = await req.json();

//   let base32: string, qrCode: string;

//   if (manualSecret) {
//     // Use manually provided secret
//     base32 = manualSecret;
//     qrCode = ""; // cannot generate QR from manual secret
//   } else {
//     // Generate secret + QR
//     const result = await generateTOTPWithQR();
//     base32 = result.base32;
//     qrCode = result.qrCode;
//   }

//   // Save secret
//   const { error } = await supabaseAdmin
//     .from("profiles")
//     .update({ totp_secret: base32, is_totp_enabled: false })
//     .eq("id", userId);

//   if (error) return NextResponse.json({ error: error.message }, { status: 400 });

//   return NextResponse.json({ qrCode, base32 });
// }