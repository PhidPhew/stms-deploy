# STMS — Sports Training Management System

ระบบจัดการสถาบันกีฬา รองรับ 3 roles: **Admin**, **Coach**, **Student**

---

## Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS, Recharts, Framer Motion |
| Backend | Next.js 16 API Routes, Prisma ORM 5 |
| Database | MySQL (Clever Cloud — Cloud) |
| Logs | MongoDB Atlas (Cloud) |
| Auth | JWT (หมดอายุ 7 วัน) |

---

## โครงสร้างโปรเจค

```
stms-system/
├── backend/      → API + Database (รันที่ port 4000)
└── frontend/     → UI (รันที่ port 3000)
```

---

## วิธี Setup (ทำครั้งแรกครั้งเดียว)

### 1. Clone โปรเจค

```bash
git clone <repo-url>
cd stms-system
```

### 2. ติดตั้ง dependencies

```bash
# Backend
cd backend
npm install

# Frontend (เปิด terminal ใหม่)
cd frontend
npm install
```

### 3. ตั้งค่า Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env
```

ไฟล์ `.env` จะมี credentials พร้อมใช้เลย ไม่ต้องแก้อะไร เพราะ database อยู่บน cloud แล้ว

**Frontend:**

สร้างไฟล์ `frontend/.env.local` แล้วใส่:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## วิธีรัน

ต้องเปิด **2 terminal** พร้อมกัน

**Terminal 1 — Backend**
```bash
cd backend
npm run dev
```
> รันที่ http://localhost:4000

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
```
> รันที่ http://localhost:3000

เปิด browser แล้วไปที่ **http://localhost:3000**

---

## Roles และ URL

| Role | URL | สิทธิ์ |
|------|-----|--------|
| Admin | `/admin` | จัดการ Users, Courses, Coach, Finance |
| Coach | `/coach` | ดู Schedule, Check Attendance, Summary รายได้ |
| Student | `/student` | ดู Courses, Enroll, ชำระเงิน, ดู Attendance |

---

## Database Schema (หลัก)

```
User (ADMIN / COACH / STUDENT)
  ├── CoachProfile (เฉพาะ COACH)
  ├── Enrollment → Course
  ├── Payment → Course
  └── Attendance → Schedule

Course
  ├── Schedule (วัน/เวลาเรียน)
  └── Enrollment

FinanceRecord (revenue / expense)
```

---

## Flow การ Enroll และชำระเงิน

```
1. Student กด Enroll Course
       ↓
2. Payment สร้างอัตโนมัติ (status: PENDING)
       ↓
3. Student อัปโหลด Slip
       ↓
4. Admin กด Approve
       ↓
5. ระบบสร้าง FinanceRecord อัตโนมัติ 2 รายการ
   ├── Revenue: เต็มจำนวน (ค่าคอร์ส)
   └── Expense: 70% (Coach Payout อัตโนมัติ)
```

---

## API Endpoints

### Auth
| Method | Endpoint | คำอธิบาย |
|--------|----------|---------|
| POST | `/api/auth/login` | เข้าสู่ระบบ |
| POST | `/api/auth/register` | สมัครสมาชิก |
| GET | `/api/auth/me` | ดูข้อมูลตัวเอง |

### Admin
| Method | Endpoint | คำอธิบาย |
|--------|----------|---------|
| GET/POST | `/api/admin/users` | จัดการ Users |
| GET/POST/PATCH/DELETE | `/api/admin/courses` | จัดการ Courses |
| GET/POST | `/api/admin/coaches` | จัดการ Coaches |
| GET | `/api/admin/finance/payments` | ดู Payments ทั้งหมด |
| POST | `/api/admin/finance/payments/:id/approve` | Approve Payment |
| GET/POST | `/api/admin/finance/records` | Finance Records |
| GET | `/api/admin/finance/summary` | Summary + Chart Data |

### Coach
| Method | Endpoint | คำอธิบาย |
|--------|----------|---------|
| GET | `/api/coach/schedule` | ดู Schedule 30 วัน |
| GET/POST | `/api/coach/attendance` | Check Attendance |
| GET | `/api/coach/summary` | Income + Course Summary |

### Student
| Method | Endpoint | คำอธิบาย |
|--------|----------|---------|
| GET | `/api/student/courses` | ดู Courses ทั้งหมด |
| GET | `/api/student/courses/:id` | ดูรายละเอียด Course |
| POST | `/api/student/courses/:id/enroll` | Enroll Course |
| GET | `/api/student/payments` | ดู Payments |
| GET | `/api/student/attendance` | ดู Attendance |
| GET | `/api/student/dashboard` | Dashboard ข้อมูลรวม |

---

## คำสั่งอื่นๆ

```bash
# ถ้าแก้ไข Prisma Schema ต้อง sync กับ DB
cd backend
npx prisma db push

# Seed ข้อมูลตัวอย่าง
cd backend
npx ts-node prisma/seed.ts
```

---

## หมายเหตุ

- Database และ MongoDB ใช้ร่วมกันทุกคนในทีม (Cloud)
- Token หมดอายุใน **7 วัน** หลังจากนั้น Login ใหม่
- ถ้าเจอ error 401 บ่อยๆ ให้ลอง Logout แล้ว Login ใหม่