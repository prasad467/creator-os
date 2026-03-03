import { createClient } from "@supabase/supabase-js";
import speakeasy from "speakeasy";

// Supabase admin client
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Verify TOTP token against secret
export function verifyTOTP(token: string, secret: string) {
  return speakeasy.totp.verify({
    secret: secret.replace(/\s+/g, ""), // remove spaces
    encoding: "base32",
    token: token.trim(),
    window: 2, // allow slight drift
  });
}