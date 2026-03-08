import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const courses = await prisma.course.findMany({
    where: {
      startDate: { not: null },
      endDate: { not: null },
    }
  })

  console.log(`Found ${courses.length} courses`)

  for (const course of courses) {
    if (!course.startDate || !course.endDate || !course.classDays) {
      console.log(`Skipping "${course.title}" — missing startDate/endDate/classDays`)
      continue
    }

    let classDays: number[] = []
    try {
      classDays = JSON.parse(course.classDays)
    } catch {
      console.log(`Skipping "${course.title}" — invalid classDays JSON`)
      continue
    }

    // Delete old schedules first (safe re-run)
    await prisma.schedule.deleteMany({ where: { courseId: course.id } })

    const schedules: { courseId: number; date: Date; startTime: string; endTime: string }[] = []
    const current = new Date(course.startDate)
    const end = new Date(course.endDate)

    while (current <= end) {
      const dayOfWeek = current.getDay() // 0=Sun, 6=Sat
      if (classDays.includes(dayOfWeek)) {
        schedules.push({
          courseId: course.id,
          date: new Date(current),
          startTime: "09:00",
          endTime: "11:00",
        })
      }
      current.setDate(current.getDate() + 1)
    }

    await prisma.schedule.createMany({ data: schedules })
    console.log(`"${course.title}" — created ${schedules.length} schedules`)
  }

  console.log("Done!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
