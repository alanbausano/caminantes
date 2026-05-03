# Los Caminantes 🍔

A full-stack application featuring a premium landing page and a loyalty reward system for the restaurant "Los Caminantes".

## 🚀 Overview
This project integrates a high-performance restaurant landing page with a comprehensive loyalty application. It allows customers to explore the menu, learn about the brand, and participate in a rewards program through a unified digital experience.

## 🛠 Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Material UI (MUI)](https://mui.com/) & [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [Lottie](https://airbnb.io/lottie/)
- **State Management**: [React Query](https://tanstack.com/query/latest) (TanStack Query)
- **Routing**: [React Router 7](https://reactrouter.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Auth**: JWT (JSON Web Tokens) & Google OAuth
- **Communications**: [Resend](https://resend.com/) for automated emails

## 📂 Project Structure
- `frontend/`: The React client-side application.
- `backend/`: The Express API and database schema.

## ✨ Key Functionalities
- **Landing Page**: Visually rich, responsive design highlighting the menu and story.
- **Loyalty App**:
  - **Auth**: Secure sign-in via Email/Password or Google.
  - **Coupon Tracking**: Real-time progress on rewards and digital coupons.
  - **QR Integration**: QR code generation and scanning for seamless reward redemption.
- **Background Tasks**: Automated cleanup and notifications via cron jobs.

## 🛠 Setup
1. **Frontend**: `cd frontend && npm install && npm run dev`
2. **Backend**: `cd backend && npm install && npx prisma generate && npm run dev`
