import cron from 'node-cron';
import { prisma } from '../db.js';

// Define BirthdayUser interface at the top level
interface BirthdayUser {
  id: string;
  email: string | null;

  firstName: string;
  dob: Date;
}

// Runs every day at 10:00 AM
export const initBirthdayCron = () => {
  cron.schedule('0 10 * * *', async () => {
    try {
      console.log('Running daily birthday check...');
      
      // Calculate date 5 days from now
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 5);
      
      const targetMonth = targetDate.getMonth() + 1; // 1-12
      const targetDay = targetDate.getDate();

      // Find users whose birthday is exactly 5 days from today
      // Postgres extract logic or we can fetch all and filter, 
      // but in Prisma we might need a raw query for month/day matching
      const users = await prisma.$queryRaw<BirthdayUser[]>`
        SELECT id, email, "firstName", dob
        FROM "User"
        WHERE EXTRACT(MONTH FROM dob) = ${targetMonth} 
          AND EXTRACT(DAY FROM dob) = ${targetDay}
      `;

      if (users.length === 0) {
        console.log('No birthdays 5 days from now.');
        return;
      }

      for (const user of users) {
        // Here we would integrate Resend for Email and Twilio for WhatsApp
        console.log(`Sending birthday greeting to ${user.firstName} at ${user.email}`);
        // TODO: Implement actual Email / WhatsApp sending
      }
    } catch (error) {
      console.error('Error running birthday cron:', error);
    }
  });
};
