import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authMiddleware, requireRole, addSecurityHeaders } from '@/lib/middleware';
import { logger, createErrorResponse, createSuccessResponse } from '@/lib/logger';

// GET /api/admin/stats - Get admin dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const authResult = await authMiddleware(request);
    if (!authResult.authenticated || !authResult.user) {
      return authResult.response!;
    }

    const roleCheck = await requireRole(['ADMIN', 'MODERATOR'])(request, authResult.user);
    if (!roleCheck.authorized) {
      return roleCheck.response!;
    }

    // Get date range from query params
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch all statistics in parallel
    const [
      totalUsers,
      activeUsers,
      newUsersToday,
      newUsersThisWeek,
      totalMaterials,
      totalProviders,
      totalBookmarks,
      subscriptionStats,
      revenueStats,
      recentUsers,
      topMaterials,
      userGrowth,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),

      // Active users (logged in last 30 days)
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: startDate,
          },
        },
      }),

      // New users today
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),

      // New users this week
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      }),

      // Total materials
      prisma.material.count(),

      // Total providers
      prisma.provider.count(),

      // Total bookmarks
      prisma.bookmark.count(),

      // Subscription statistics
      prisma.subscription.groupBy({
        by: ['plan', 'status'],
        _count: true,
      }),

      // Revenue statistics (from invoices)
      prisma.invoice.aggregate({
        where: {
          status: 'paid',
          createdAt: {
            gte: startDate,
          },
        },
        _sum: {
          amount: true,
        },
        _count: true,
      }),

      // Recent users
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          subscription: {
            select: { plan: true },
          },
        },
      }),

      // Top bookmarked materials
      prisma.material.findMany({
        take: 10,
        orderBy: {
          bookmarks: {
            _count: 'desc',
          },
        },
        select: {
          id: true,
          title: true,
          provider: {
            select: { name: true },
          },
          _count: {
            select: { bookmarks: true },
          },
        },
      }),

      // User growth over time (last 30 days)
      prisma.$queryRaw`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM users
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
    ]);

    // Process subscription stats
    const subscriptionByPlan: Record<string, number> = {};
    const subscriptionByStatus: Record<string, number> = {};

    subscriptionStats.forEach((stat) => {
      subscriptionByPlan[stat.plan] = (subscriptionByPlan[stat.plan] || 0) + stat._count;
      subscriptionByStatus[stat.status] = (subscriptionByStatus[stat.status] || 0) + stat._count;
    });

    const stats = {
      overview: {
        totalUsers,
        activeUsers,
        newUsersToday,
        newUsersThisWeek,
        totalMaterials,
        totalProviders,
        totalBookmarks,
      },
      subscriptions: {
        byPlan: subscriptionByPlan,
        byStatus: subscriptionByStatus,
      },
      revenue: {
        total: (revenueStats._sum.amount || 0) / 100, // Convert cents to dollars
        invoiceCount: revenueStats._count,
        period: `${days} days`,
      },
      recentUsers,
      topMaterials,
      userGrowth,
    };

    logger.info('Admin stats fetched', { adminId: authResult.user.userId });

    const response = NextResponse.json(createSuccessResponse(stats));
    return addSecurityHeaders(response);
  } catch (error) {
    logger.error('Failed to fetch admin stats', error);
    return NextResponse.json(
      createErrorResponse('Failed to fetch admin stats', 500, error),
      { status: 500 }
    );
  }
}
