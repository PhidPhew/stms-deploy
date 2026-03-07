import { Attendance } from "@/components/student/TodayClasses"

const today = new Date().toISOString().split("T")[0]

export const attendanceHistory: Attendance[] = [
  // ===== TODAY =====
  {
    id: 1,
    date: today,
    time: "17:58",
    course: "Badminton Beginner",
    status: "present",
  },
  {
    id: 2,
    date: today,
    course: "Swimming Technique",
    status: "absent",
  },

  // ===== PAST =====
  {
    id: 3,
    date: "2026-03-05",
    time: "17:55",
    course: "Badminton Beginner",
    status: "present",
  },
  {
    id: 4,
    date: "2026-03-07",
    course: "Advanced Football Training",
    status: "absent",
  },
  {
    id: 5,
    date: "2026-03-10",
    time: "19:01",
    course: "Advanced Football Training",
    status: "present",
  },
]