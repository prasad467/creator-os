import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/adminAuth";

export async function GET() {
  try {
    // Get all users from auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    const totalAuthUsers = authData?.users?.length || 0;
    
    // Get profiles for additional data
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    // Calculate real stats from auth users
    const authUsers = authData?.users || [];
    
    const proUsers = authUsers.filter((u: any) => 
      u.user_metadata?.is_pro === true || 
      u.user_metadata?.plan === 'pro' ||
      u.user_metadata?.plan === 'enterprise'
    ).length;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsersLastMonth = authUsers.filter((u: any) => {
      const createdAt = new Date(u.created_at);
      return createdAt >= thirtyDaysAgo;
    }).length;

    // Generate weekly data for the chart (last 12 weeks)
    const weeklyData = [];
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      
      const weekUsers = authUsers.filter((u: any) => {
        const createdAt = new Date(u.created_at);
        return createdAt >= weekStart && createdAt < weekEnd;
      }).length;
      
      weeklyData.push(weekUsers);
    }

    // Normalize for chart display (max 100)
    const maxWeekly = Math.max(...weeklyData, 1);
    const normalizedWeeklyData = weeklyData.map(w => Math.round((w / maxWeekly) * 100));

    return NextResponse.json({
      stats: {
        totalUsers: totalAuthUsers,
        activeUsers: proUsers,
        newUsersLastMonth,
        estimatedMonthlyRevenue: proUsers * 29,
        proUsers,
      },
      weeklyData: normalizedWeeklyData,
      weeklyLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Unknown error",
      stats: {
        totalUsers: 0,
        activeUsers: 0,
        newUsersLastMonth: 0,
        estimatedMonthlyRevenue: 0,
        proUsers: 0,
      },
      weeklyData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      weeklyLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    }, { status: 500 });
  }
}
