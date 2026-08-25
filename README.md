# Gbemiolofada Foods — Production-ready starter

A professional Nigerian food-ordering platform starter.

## Stack
- React + Vite
- Express + Prisma
- PostgreSQL
- JWT authentication
- Paystack-ready payment architecture
- Responsive, mobile-first UI

## Run locally

### Client
```bash
cd client
npm install
npm run dev
```

### Server
```bash
cd server
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

The client expects the API at `http://localhost:4000/api`.

## Before going live
1. Create a PostgreSQL database.
2. Set `DATABASE_URL`, `JWT_SECRET`, and Paystack keys.
3. Replace demo menu data with real menu records and real food photography.
4. Configure Paystack webhook verification.
5. Deploy the client to Vercel/Netlify and API/database to a managed service.
6. Never put secrets in React source code.
