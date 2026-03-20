import { prisma } from '../db.js';

export async function recordVisit(userId: string) {
  // Cooldown logic: max 1 visit per 8 hours
  const cooldownHours = 8;
  const cooldownMs = cooldownHours * 60 * 60 * 1000;
  const since = new Date(Date.now() - cooldownMs);

  // Check for a recent visit within the cooldown window
  const recentVisit = await prisma.visit.findFirst({
    where: {
      userId,
      timestamp: { gte: since }
    },
  });

  if (recentVisit) {
    return { error: `Solo podés sumar una visita cada ${cooldownHours} horas.` };
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
