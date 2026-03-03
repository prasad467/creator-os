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

    // Calculate revenue metrics from user metadata
    const proUsers = users.filter((u: any) => u.user_metadata?.is_pro || u.user_metadata?.plan === 'pro');
    const enterpriseUsers = users.filter((u: any) => u.user_metadata?.plan === 'enterprise');
    const basicUsers = users.filter((u: any) => !u.user_metadata?.is_pro && u.user_metadata?.plan !== 'pro' && u.user_metadata?.plan !== 'enterprise');

    const proRevenue = proUsers.length * 29;
    const enterpriseRevenue = enterpriseUsers.length * 99;
    const monthlyRevenue = proRevenue + enterpriseRevenue;

    // Monthly data for the last 12 months
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - i);
      monthDate.setDate(1);
      
      const nextMonth = new Date(monthDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const usersByMonth = users.filter((u: any) => {
        const createdAt = new Date(u.created_at);
        return createdAt < nextMonth;
      });

      const proCount = usersByMonth.filter((u: any) => u.user_metadata?.is_pro || u.user_metadata?.plan === 'pro').length;
      const enterpriseCount = usersByMonth.filter((u: any) => u.user_metadata?.plan === 'enterprise').length;

      const monthRevenue = (proCount * 29) + (enterpriseCount * 99);

      monthlyData.push({
        month: monthDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        revenue: monthRevenue,
        proUsers: proCount,
        enterpriseUsers: enterpriseCount,
        totalUsers: usersByMonth.length,
      });
    }

    // Revenue by plan
    const revenueByPlan = {
      enterprise: {
        revenue: enterpriseRevenue,
        users: enterpriseUsers.length,
        price: 99,
      },
      pro: {
        revenue: proRevenue,
        users: proUsers.length,
        price: 29,
      },
      basic: {
        revenue: 0,
        users: basicUsers.length,
        price: 0,
      },
    };

    const activeSubscribers = proUsers.length + enterpriseUsers.length;
    const arpu = totalUsers > 0 ? (monthlyRevenue / activeSubscribers).toFixed(2) : "0";

    return NextResponse.json({
      summary: {
        monthlyRevenue,
        annualRevenue: monthlyRevenue * 12,
        arpu,
        totalRevenue: monthlyRevenue,
      },
      monthlyData,
      revenueByPlan,
      churnRate: 0,
      totalUsers,
      activeSubscribers,
    });
  } catch (error) {
    console.error("Revenue error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal server error",
      summary: {
        monthlyRevenue: 0,
        annualRevenue: 0,
        arpu: "0",
        totalRevenue: 0,
      },
      monthlyData: [],
      revenueByPlan: {
        enterprise: { revenue: 0, users: 0, price: 99 },
        pro: { revenue: 0, users: 0, price: 29 },
        basic: { revenue: 0, users: 0, price: 0 },
      },
      churnRate: 0,
      totalUsers: 0,
      activeSubscribers: 0,
    }, { status: 500 });
  }
}
