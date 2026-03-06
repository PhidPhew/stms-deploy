"use client"

import { useParams, useRouter } from "next/navigation"

/* ===== MOCK DATA (ควรย้ายไป shared file ภายหลัง) ===== */
const courses = [
  {
    id: 1,
    title: "Badminton Beginner",
    description:
      "Learn basic badminton skills, footwork, grip techniques, and official game rules.",
    price: 4990,
    totalSessions: 16,
    sport: "badminton",
    level: "beginner",
    syllabus: [
      "Basic grip & stance",
      "Footwork fundamentals",
      "Serve & return",
      "Beginner match play",
    ],
  },
  {
    id: 2,
    title: "Advanced Football Training",
    description:
      "Intensive football program focusing on tactics, positioning, and competitive match strategies.",
    price: 6500,
    totalSessions: 20,
    sport: "football",
    level: "advanced",
    syllabus: [
      "Advanced formations",
      "Tactical pressing",
      "Set-piece strategies",
      "Full match simulations",
    ],
  },
]

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()

  const course = courses.find(
    (c) => c.id === Number(params.id)
  )

  if (!course) {
    return <div className="p-6">Course not found</div>
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-blue-900">
          {course.title}
        </h1>

        <p className="text-gray-600">
          {course.description}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Sessions</span>
            <div className="font-medium">
              {course.totalSessions}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Price</span>
            <div className="font-medium">
              {course.price.toLocaleString()} THB
            </div>
          </div>
        </div>

        {/* syllabus */}
        <div>
          <h3 className="font-semibold mt-4 mb-2">
            Course Content
          </h3>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            {course.syllabus.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <button
          onClick={() =>
            router.push(
              `/student/payment/submit?courseId=${course.id}`
            )
          }
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Enroll & Pay
        </button>
      </div>
    </div>
  )
}