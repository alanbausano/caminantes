import { prisma } from '../db.js';

export const createRedemptionRequest = async (userId: string) => {
  // 1. Verify user has at least 10 visits
  const visits = await prisma.visit.findMany({
    where: { userId }
  });

  if (visits.length < 10) {
    throw new Error('No tenés suficientes visitas para canjear un premio (mínimo 10)');
  }

  // 2. Check if there's already a pending request
  const pendingRequest = await prisma.redemptionRequest.findFirst({
    where: { userId, status: 'PENDING' }
  });

  if (pendingRequest) {
    throw new Error('Ya tenés un pedido de canje pendiente. Avisá en caja.');
  }

  // 3. Create the request
  return await prisma.redemptionRequest.create({
    data: { userId, status: 'PENDING' },
    include: { user: true }
  });
};

export const getPendingRedemptions = async () => {
  return await prisma.redemptionRequest.findMany({
    where: { status: 'PENDING' },
    include: { 
      user: {
        select: { firstName: true, lastName: true, phone: true }
      } 
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getCompletedRedemptions = async () => {
  return await prisma.redemptionRequest.findMany({
    where: { status: 'COMPLETED' },
    include: { 
      user: {
        select: { firstName: true, lastName: true, phone: true }
      } 
    },
    orderBy: { processedAt: 'desc' }
  });
};

export const completeRedemption = async (redemptionId: string) => {
  const request = await prisma.redemptionRequest.findUnique({
    where: { id: redemptionId }
  });

  if (!request) throw new Error('Pedido no encontrado');
  if (request.status !== 'PENDING') throw new Error('Este pedido ya fue procesado');

  // Atomic transaction: Complete request AND delete visits
  return await prisma.$transaction(async (tx: any) => {
    // 1. Mark request as completed
    const completed = await tx.redemptionRequest.update({
      where: { id: redemptionId },
      data: { status: 'COMPLETED', processedAt: new Date() }
    });

    // 2. Reset user visits
    // User said "reset to 0 the coupons", so let's delete all current visits for this user.
    await tx.visit.deleteMany({
      where: { userId: request.userId }
    });

    return completed;
  });
};
