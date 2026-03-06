export type CourseStatus = "draft" | "published"
export type CourseLevel = "Beginner" | "Advanced"

export type Course = {
  id: number
  title: string
  description: string
  coach: string
  price: number
  status: CourseStatus
  level?: CourseLevel
  startDate?: string      // YYYY-MM-DD
  endDate?: string        // YYYY-MM-DD
  classDays?: number[]    // 0-6 (อา–ส)
}