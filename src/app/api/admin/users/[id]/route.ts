import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authMiddleware, requireRole, addSecurityHeaders, auditLog } from '@/lib/middleware';
import { logger, createErrorResponse, createSuccessResponse } from '@/lib/logger';
import { sendNotification } from '@/lib/notifications';

// GET /api/admin/users/[id] - Get user details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await authMiddleware(request);
    if (!authResult.authenticated || !authResult.user) {
      return authResult.response!;
    }

    const roleCheck = await requireRole(['ADMIN', 'MODERATOR'])(request, authResult.user);
    if (!roleCheck.authorized) {
      return roleCheck.response!;
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        subscription: true,
        bookmarks: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        usageMetrics: {
          take: 20,
          orderBy: { recordedAt: 'desc' },
        },
        auditLogs: {
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            bookmarks: true,
            notifications: true,
            auditLogs: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove sensitive data
    const { password, verificationToken, resetToken, ...userWithoutSensitiveData } = user;

    await auditLog(
      authResult.user.userId,
      'VIEW_USER',
      'User',
      id,
      request
    );

    const response = NextResponse.json(
      createSuccessResponse(userWithoutSensitiveData)
    );

    return addSecurityHeaders(response);
  } catch (error) {
    logger.error('Failed to get user details', error);
    return NextResponse.json(
      createErrorResponse('Failed to get user details', 500, error),
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users/[id] - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await authMiddleware(request);
    if (!authResult.authenticated || !authResult.user) {
      return authResult.response!;
    }

    const roleCheck = await requireRole(['ADMIN'])(request, authResult.user);
    if (!roleCheck.authorized) {
      return roleCheck.response!;
    }

    const body = await request.json();
    const { role, isActive, status } = body;

    // Validate updates
    const updateData: any = {};
    if (role && ['USER', 'ADMIN', 'MODERATOR'].includes(role)) {
      updateData.role = role;
    }
    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }
    if (status) {
      updateData.status = status;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        status: true,
      },
    });

    // Send notification to user
    await sendNotification({
      userId: id,
      title: 'Account Updated',
      message: 'Your account has been updated by an administrator.',
      type: 'info',
    });

    // Audit log
    await auditLog(
      authResult.user.userId,
      'UPDATE_USER',
      'User',
      id,
      request,
      updateData
    );

    logger.info('User updated by admin', {
      adminId: authResult.user.userId,
      userId: id,
      updates: updateData,
    });

    const response = NextResponse.json(createSuccessResponse(user));
    return addSecurityHeaders(response);
  } catch (error) {
    logger.error('Failed to update user', error);
    return NextResponse.json(
      createErrorResponse('Failed to update user', 500, error),
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await authMiddleware(request);
    if (!authResult.authenticated || !authResult.user) {
      return authResult.response!;
    }

    const roleCheck = await requireRole(['ADMIN'])(request, authResult.user);
    if (!roleCheck.authorized) {
      return roleCheck.response!;
    }

    // Prevent self-deletion
    if (id === authResult.user.userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Delete user (cascading deletes will handle related records)
    await prisma.user.delete({
      where: { id },
    });

    // Audit log
    await auditLog(
      authResult.user.userId,
      'DELETE_USER',
      'User',
      id,
      request
    );

    logger.info('User deleted by admin', {
      adminId: authResult.user.userId,
      userId: id,
    });

    const response = NextResponse.json(
      createSuccessResponse({ deleted: true })
    );

    return addSecurityHeaders(response);
  } catch (error) {
    logger.error('Failed to delete user', error);
    return NextResponse.json(
      createErrorResponse('Failed to delete user', 500, error),
      { status: 500 }
    );
  }
}
