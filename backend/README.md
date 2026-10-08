# Attestatsiya Backend

Fastify + Supabase backend kodi asosiy **Attestatsiya monorepo** ichida
`backend/` katalogida saqlanadi. Backend alohida Vercel project sifatida deploy qilinmaydi.

- **Source-of-truth:** `sarvar9417/attestatsiya/backend`
- **Production app:** `https://attestatsiya-five.vercel.app`
- **Production API:** shu origin ichidagi `/api/*`
- **Vercel entry:** repository rootidagi `api/[...all].ts`
- **Endpointlar:** `/api/health`, `/api/auth/*`, `/api/exam/*`,
  `/api/progress/*`, `/api/content/*`, `/api/admin/*`
- **Lokal:** repository rootidan `npm run dev:backend`, yoki
  `cd backend && npm install && npm run dev`
- **Lokal env:** `backend/.env.example` → `backend/.env`;
  `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `AUTH_REDIRECT_URL`

Production arxitekturasi bitta Vercel application:

```text
attestatsiya-five.vercel.app/
├── /                 React + Vite frontend
└── /api/*            Fastify serverless backend
```

Eski `attestatsiya-backend` Vercel project production trafficdan chiqarilgan va
pauza qilingan. Backend uchun yangi standalone Vercel konfiguratsiya yaratilmang.
