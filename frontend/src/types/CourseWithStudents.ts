import { Course } from "./course"

export type Student = {
  id: number
  name: string
  email: string
}

export type CourseWithStudents = Course & {
  students?: Student[]
}