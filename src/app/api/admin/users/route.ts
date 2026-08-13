import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import type { Prisma, UserRole } from "@/generated/prisma";
import {
  authMiddleware,
  requireRole,
  addSecurityHeaders,
  auditLog,
} from "@/lib/middleware";
import {
  logger,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/logger";

// GET /api/admin/users - List all users with pagination
export async function GET(request: NextRequest) {
  try {
    // Authenticate and authorize
    const authResult = await authMiddleware(request);
    if (!authResult.authenticated || !authResult.user) {
      return authResult.response!;
    }

    const roleCheck = await requireRole(["ADMIN", "MODERATOR"])(
      request,
      authResult.user,
    );
    if (!roleCheck.authorized) {
      return roleCheck.response!;
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = role as UserRole;
    }

    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }

    // Fetch users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          isActive: true,
          emailVerified: true,
          createdAt: true,
          lastLoginAt: true,
          subscription: {
            select: {
              plan: true,
              status: true,
            },
          },
          _count: {
            select: {
              bookmarks: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    // Audit log
    await auditLog(
      authResult.user.userId,
      "LIST_USERS",
      "User",
      undefined,
      request,
      { page, limit, search, total },
    );

    const response = NextResponse.json(
      createSuccessResponse({
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }),
    );

    return addSecurityHeaders(response);
  } catch (error) {
    logger.error("Failed to list users", error);
    return NextResponse.json(
      createErrorResponse("Failed to list users", 500, error),
      { status: 500 },
    );
  }
}
