import { Coach } from "@/types/coach"

export const initialCoaches: Coach[] = [
  {
    id: 1,
    name: "Coach A",
    email: "a@mail.com",
    expertise: ["Badminton"],
    status: "active",
    totalCourses: 2,
  },
  {
    id: 2,
    name: "Coach B",
    email: "b@mail.com",
    expertise: ["Football"],
    status: "inactive",
    totalCourses: 0,
  },
]