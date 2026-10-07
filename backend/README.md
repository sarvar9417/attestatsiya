# Attestatsiya Backend

Fastify + Supabase backend API endi asosiy **Attestatsiya monorepo** ichida
`backend/` katalogida saqlanadi.

- **Source-of-truth:** `sarvar9417/attestatsiya/backend`
- **Production:** https://attestatsiya-backend.vercel.app
- **Endpointlar:** `/api/health`, `/api/auth/*`, `/api/exam/*`,
  `/api/progress/*`, `/api/content/*`, `/api/admin/*`
- **Lokal:** repository rootidan `npm run dev:backend`, yoki
  `cd backend && npm install && npm run dev`
- **Env:** `backend/.env.example` → `backend/.env`;
  `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `AUTH_REDIRECT_URL`

Eski `sarvar9417/attestatsiya-backend` repository T-028 cutover davomida
rollback/deploy fallback sifatida vaqtincha saqlanadi. Yangi backend o‘zgarishlari
shu monorepodagi `backend/` ichida qilinadi.
