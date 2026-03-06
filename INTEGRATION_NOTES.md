# Sports Academy — Integration Notes

## Architecture

```
sports-academy/frontend   (Next.js 14, port 3000)
        |
        | HTTP + JWT Bearer Token (localStorage)
        v
sports-academy/backend    (Next.js 14 API Routes, port 4000)
        |
        |--- Prisma ORM ----> MySQL 8.0  (Docker, port 3306)
        |
        \--- Mongoose -------> MongoDB 6.0 (Docker, port 27017, audit logs)
```

## How to Run Locally

### Step 1 — Start Databases

```bash
cd sports-academy
docker-compose up -d
```

### Step 2 — Set up Backend

```bash
cd sports-academy/backend
cp .env.example .env        # then fill in your values
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
# Runs on http://localhost:4000
```

### Step 3 — Set up Frontend

```bash
cd sports-academy/frontend
cp .env.example .env.local  # then fill in your values
npm install
npm run dev
# Runs on http://localhost:3000
```

### Step 4 — Open Browser

```
http://localhost:3000
```

## Environment Variables

### backend/.env

| Variable       | Value (local)                                                                         | Description            |
| -------------- | ------------------------------------------------------------------------------------- | ---------------------- |
| `DATABASE_URL` | `mysql://stms_user:stms_password@localhost:3306/stms_db`                              | MySQL connection       |
| `MONGODB_URI`  | `mongodb://stms_admin:stms_mongo_password@localhost:27017/stms_logs?authSource=admin` | MongoDB for audit logs |
| `JWT_SECRET`   | `local-dev-secret-do-not-use-in-prod`                                                 | JWT signing key        |
| `PORT`         | `4000`                                                                                | Backend port           |
| `FRONTEND_URL` | `http://localhost:3000`                                                               | CORS allowed origin    |

### frontend/.env.local

| Variable              | Value                   | Description |
| --------------------- | ----------------------- | ----------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Backend URL |
