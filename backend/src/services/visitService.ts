import { prisma } from '../db.js';

export async function recordVisit(userId: string, code?: string) {
  if (!code || !code.startsWith('loscami-visit-')) {
    return { error: 'Código QR inválido o no proporcionado.' };
  }

  // Extract timestamp from 'loscami-visit-randomChars-1736123456789'
  const parts = code.split('-');
  const timestampStr = parts[parts.length - 1] || '';
  const timestamp = parseInt(timestampStr, 10);
  const now = Date.now();

  // Validate token freshness (max 30 seconds old, no future tokens)
  if (isNaN(timestamp) || now - timestamp > 30000 || timestamp > now + 30000) {
    return { error: 'Este código QR expiró por seguridad. Pedíle al cajero que te muestre uno nuevo.' };
  }

  // Check if they already have 10 visits
  const currentVisits = await prisma.visit.count({ where: { userId } });
  if (currentVisits >= 10) {
    return { error: '¡Ya tenés 10 visitas! Pedí tu hamburguesa gratis antes de seguir sumando.' };
  }

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
  
  // Check if the user reached exactly 10 visits
  const totalVisits = currentVisits + 1;
  
  return { newVisit, totalVisits };
}
