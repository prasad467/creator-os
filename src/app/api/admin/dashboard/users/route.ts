import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/adminAuth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // Get all auth users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // Transform auth users to our format - only use plan field, not is_pro
    let users = (authData?.users || []).map((user: any) => ({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
      created_at: user.created_at,
      plan: user.user_metadata?.plan || "basic",
      stripe_customer_id: user.user_metadata?.stripe_customer_id || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      revenue: (user.user_metadata?.plan === "pro" || user.user_metadata?.plan === "enterprise") 
        ? (user.user_metadata?.plan === "enterprise" ? 99 : 29) 
        : 0,
      status: (user.user_metadata?.plan === "pro" || user.user_metadata?.plan === "enterprise") 
        ? "active" 
        : "inactive",
    }));

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter((u: any) => 
        u.email?.toLowerCase().includes(searchLower) || 
        u.full_name?.toLowerCase().includes(searchLower)
      );
    }

    // Sort by created_at descending
    users.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Calculate pagination
    const total = users.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedUsers = users.slice(startIndex, startIndex + limit);

    // Calculate stats based on plan
    const activeUsers = users.filter((u: any) => u.plan === "pro" || u.plan === "enterprise").length;
    const proUsers = users.filter((u: any) => u.plan === "pro").length;
    const enterpriseUsers = users.filter((u: any) => u.plan === "enterprise").length;
    const basicUsers = users.filter((u: any) => u.plan === "basic" || u.plan === "free" || !u.plan).length;
    const totalRevenue = (proUsers * 29) + (enterpriseUsers * 99);

    return NextResponse.json({
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      stats: {
        totalRevenue,
        activeUsers,
        basicUsers,
        proUsers: proUsers + enterpriseUsers,
      },
    });
  } catch (error) {
    console.error("Users fetch error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal server error",
      users: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      stats: { totalRevenue: 0, activeUsers: 0, basicUsers: 0, proUsers: 0 },
    }, { status: 500 });
  }
}
