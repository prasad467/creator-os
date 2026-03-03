import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/adminAuth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user from auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get user profile
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    return NextResponse.json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name:
          profile?.full_name ||
          authData.user.user_metadata?.full_name ||
          "",
        avatar_url:
          profile?.avatar_url ||
          authData.user.user_metadata?.avatar_url ||
          null,
        plan: profile?.plan || "basic",
        created_at: authData.user.created_at,
        email_confirmed_at: authData.user.email_confirmed_at,
        last_sign_in_at: authData.user.last_sign_in_at,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
