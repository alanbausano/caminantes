import { prisma } from '../db.js';

export async function recordVisit(userId: string) {
  // Cooldown logic: max 1 visit per 12 hours
  const lastVisit = await prisma.visit.findFirst({
    where: { userId },
    orderBy: { timestamp: 'desc' },
  });

  if (lastVisit) {
    const hoursSinceLastVisit = (new Date().getTime() - new Date(lastVisit.timestamp).getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastVisit < 12) {
      return { error: 'Solo podés sumar una visita cada 12 horas.' };
    }
  }

  const newVisit = await prisma.visit.create({
    data: { userId }
  });
  
  // Check if the user reached a multiple of 10 visits
  const totalVisits = await prisma.visit.count({ where: { userId } });
  let newCoupon = null;
  
  if (totalVisits > 0 && totalVisits % 10 === 0) {
    newCoupon = await prisma.coupon.create({
      data: { userId }
    });
  }

  return { newVisit, totalVisits, newCoupon };
}
