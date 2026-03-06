export type CoachStatus = "active" | "inactive"

export type Coach = {
  id: number
  name: string
  email: string
  expertise: string[]
  status: CoachStatus
  totalCourses: number
}