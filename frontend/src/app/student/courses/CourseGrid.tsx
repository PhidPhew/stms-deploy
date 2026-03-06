"use client"

import { motion } from "framer-motion"
import CourseCard, { Course } from "./CourseCard"

/* ================== ANIMATION ================== */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

/* ================== GRID ================== */

export default function CourseGrid({
  courses,
}: {
  courses: Course[]
}) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="
        grid gap-6
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      {courses.map((course) => (
        <motion.div
          key={course.id}
          variants={item}
        >
          <CourseCard course={course} />
        </motion.div>
      ))}
    </motion.div>
  )
}