# Los Caminantes - Backend 🛠️

The API and database layer for the "Los Caminantes" loyalty system.

## 🛠 Tech Stack
- **Runtime**: [Node.js](https://nodejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express](https://expressjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)

## 🚀 Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables:
   - Create a `.env` file based on the environment requirements (DATABASE_URL, JWT_SECRET, etc.).
3. Initialize Database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## 📂 Features
- **Authentication**: JWT-based security and Google OAuth integration.
- **Business Logic**: Points calculation, coupon generation, and redemption logic.
- **Automation**: Cron jobs for scheduled maintenance and notifications.
- **Mailing**: Integration with [Resend](https://resend.com/).
