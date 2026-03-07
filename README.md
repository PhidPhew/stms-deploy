# STMS — Sports Training Management System

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js 14 API Routes + Prisma ORM
- **Database**: MySQL 8.0 (Clever Cloud — shared cloud database)
- **Audit Logs**: MongoDB Atlas (shared cloud database)

## Project Structure

```
stms-system/
├── frontend/    → Next.js frontend app (port 3000)
├── backend/     → Next.js API backend  (port 4000)
├── .gitignore
├── README.md
└── INTEGRATION_NOTES.md
```

> ไม่ต้องติดตั้ง Docker — database อยู่บน cloud แล้ว ทุกคนใช้ database เดียวกัน

---

## 🚀 วิธีรัน (ครั้งแรก)

### 1. Clone โปรเจค

```bash
git clone https://github.com/PhidPhew/stms-system
cd stms-system
```

### 2. ติดตั้งและตั้งค่า Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
# → http://localhost:4000
```

> ไม่ต้องแก้ไขอะไรใน `.env` — ค่าจริงอยู่ใน `.env.example` ครบแล้ว

### 3. ติดตั้งและตั้งค่า Frontend (เปิด terminal ใหม่)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
# → http://localhost:3000
```

### 4. เปิด Browser

```
http://localhost:3000
```

Login ด้วย: `admin@stms.com` / `123456`

---

## 🔄 การรันครั้งถัดไป

```bash
# Terminal 1 — Backend
cd stms-system/backend
npm run dev

# Terminal 2 — Frontend
cd stms-system/frontend
npm run dev
```

---

## Environment Variables

**backend/.env** (copy จาก `.env.example`)

```
DATABASE_URL="..."   ← Clever Cloud MySQL
MONGODB_URI="..."    ← MongoDB Atlas
JWT_SECRET="..."
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

**frontend/.env.local** (copy จาก `.env.example`)

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## API Overview

| Group   | Base Path       | Auth        |
| ------- | --------------- | ----------- |
| Auth    | `/api/auth/`    | None        |
| Admin   | `/api/admin/`   | ADMIN JWT   |
| Coach   | `/api/coach/`   | COACH JWT   |
| Student | `/api/student/` | STUDENT JWT |

See `INTEGRATION_NOTES.md` for the full API reference.

---

## Roles

| Role    | Redirect หลัง Login |
| ------- | ------------------- |
| ADMIN   | `/admin`            |
| COACH   | `/coach`            |
| STUDENT | `/student`          |

---

## Team

- Frontend Lead: Naravin
- Backend Lead: Achiraya
- Database & Integration Lead: Phidphew