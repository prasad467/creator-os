import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/adminAuth";

export async function GET() {
  try {
    // Get all auth users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    const users = authData?.users || [];
    const totalUsers = users.length;
    
    const proUsers = users.filter((u: any) => u.user_metadata?.is_pro === true || u.user_metadata?.plan === 'pro' || u.user_metadata?.plan === 'enterprise').length;
    const freeUsers = totalUsers - proUsers;

    // Calculate daily signups for the last 30 days
    const dailySignups = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const signups = users.filter((u: any) => {
        const createdAt = new Date(u.created_at);
        return createdAt >= date && createdAt < nextDate;
      }).length;

      dailySignups.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count: signups,
      });
    }

    // Calculate conversion rate
    const conversionRate = totalUsers > 0 ? ((proUsers / totalUsers) * 100).toFixed(1) : "0";

    // Plan distribution from user_metadata
    const planDistribution = {
      pro: users.filter((u: any) => u.user_metadata?.plan === 'pro' || u.user_metadata?.is_pro).length,
      enterprise: users.filter((u: any) => u.user_metadata?.plan === 'enterprise').length,
      basic: users.filter((u: any) => !u.user_metadata?.is_pro && (!u.user_metadata?.plan || u.user_metadata?.plan === 'basic')).length,
    };

    // Monthly recurring revenue estimation
    const monthlyRevenue = (planDistribution.pro * 29) + (planDistribution.enterprise * 99);

    // Growth rate (compared to 30 days ago)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const usersLast30Days = users.filter((u: any) => new Date(u.created_at) >= thirtyDaysAgo).length;
    const usersPrevious30Days = users.filter((u: any) => {
      const createdAt = new Date(u.created_at);
      return createdAt >= sixtyDaysAgo && createdAt < thirtyDaysAgo;
    }).length;

    const growthRate = usersPrevious30Days > 0 
      ? (((usersLast30Days - usersPrevious30Days) / usersPrevious30Days) * 100).toFixed(1)
      : "0";

    // Daily averages
    const avgSignupsPerDay = (usersLast30Days / 30).toFixed(1);

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers: proUsers,
        freeUsers,
        conversionRate: parseFloat(conversionRate),
        growthRate: parseFloat(growthRate),
        avgSignupsPerDay: parseFloat(avgSignupsPerDay),
      },
      dailySignups,
      planDistribution,
      revenue: {
        monthly: monthlyRevenue,
        projectedAnnual: monthlyRevenue * 12,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal server error",
      overview: {
        totalUsers: 0,
        activeUsers: 0,
        freeUsers: 0,
        conversionRate: 0,
        growthRate: 0,
        avgSignupsPerDay: 0,
      },
      dailySignups: [],
      planDistribution: { pro: 0, enterprise: 0, basic: 0 },
      revenue: { monthly: 0, projectedAnnual: 0 },
    }, { status: 500 });
  }
}
