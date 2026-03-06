# Deployment Guide — Vercel

This project deploys as **two separate Vercel projects**: one for the frontend and one for the backend.

## Prerequisites

- Vercel account
- Railway or PlanetScale account (for MySQL)
- MongoDB Atlas account (for audit logs)

---

## 1. Deploy Backend (sports-academy/backend)

1. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo
2. Set **Root Directory** to `sports-academy/backend`
3. Framework Preset: **Next.js**
4. Add these Environment Variables:

| Key            | Value                                                      |
| -------------- | ---------------------------------------------------------- |
| `DATABASE_URL` | Your Railway/PlanetScale MySQL connection string           |
| `MONGODB_URI`  | Your MongoDB Atlas connection string                       |
| `JWT_SECRET`   | Long random string — run: `openssl rand -base64 32`        |
| `FRONTEND_URL` | Your frontend Vercel URL (fill after frontend is deployed) |

5. Click **Deploy** → copy the backend URL (e.g. `https://sports-academy-backend.vercel.app`)

---

## 2. Deploy Frontend (sports-academy/frontend)

1. **New Project** → same GitHub repo
2. Set **Root Directory** to `sports-academy/frontend`
3. Framework Preset: **Next.js**
4. Add Environment Variables:

| Key                   | Value                               |
| --------------------- | ----------------------------------- |
| `NEXT_PUBLIC_API_URL` | Your backend Vercel URL from Step 1 |

5. Click **Deploy**

---

## 3. Post-Deploy: Update FRONTEND_URL on Backend

Go back to your backend Vercel project → Settings → Environment Variables → update `FRONTEND_URL` to your actual frontend URL → Redeploy.

---

## 4. Run Prisma Migration on Production DB

After backend is live, run once via Railway shell or Vercel CLI:

```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## Local Dev Credentials (Docker)

These values work with the `docker-compose.yml` in this repo:

**backend/.env**

```
DATABASE_URL="mysql://stms_user:stms_password@localhost:3306/stms_db"
MONGODB_URI="mongodb://stms_admin:stms_mongo_password@localhost:27017/stms_logs?authSource=admin"
JWT_SECRET="local-dev-secret-do-not-use-in-prod"
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

**frontend/.env.local**

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```
