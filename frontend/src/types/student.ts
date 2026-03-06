export type Attendance = {
  id: number
  courseId: number
  date: string
  status: "present" | "absent"
}

export type EnrolledCourse = {
  // 🔹 ของเดิม
  id: number
  title: string
  totalSessions: number

  // 🔹 เพิ่มจาก admin / ระบบเรียนจริง
  startDate: string
  endDate: string
  nextClassDate?: string

  attendance: Attendance[]

  // 🔹 optional เผื่อ reuse กับ CourseCard
  coachName?: string
  schedule?: string
  level?: "beginner" | "advanced"
  sport?: "badminton" | "football" | "basketball" | "swimming" | "tennis"
}