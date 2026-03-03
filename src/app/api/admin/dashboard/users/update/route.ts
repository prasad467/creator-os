import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    const { userId, action, plan } = await req.json();

    if (!userId || !action) {
      return NextResponse.json({ error: "User ID and action are required" }, { status: 400 });
    }

    if (action === "upgrade" && !plan) {
      return NextResponse.json({ error: "Plan is required for upgrade" }, { status: 400 });
    }

    if (action === "upgrade") {
      // Update user to pro/enterprise plan
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ 
          plan: plan,
        })
        .eq("id", userId);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: `User upgraded to ${plan}` });
    } 
    else if (action === "downgrade") {
      // Downgrade user to basic
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ 
          plan: "basic",
        })
        .eq("id", userId);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: "User downgraded to basic" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
