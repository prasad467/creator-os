import { nanoid } from "nanoid";
import { supabase } from "./supabase";

export async function ensureReferralCode(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("referral_code")
    .eq("id", userId)
    .single();

  if (!data?.referral_code) {
    const code = nanoid(8);

    await supabase
      .from("profiles")
      .update({ referral_code: code })
      .eq("id", userId);

    return code;
  }

  return data.referral_code;
}