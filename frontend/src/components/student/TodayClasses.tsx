"use client"

export type AttendanceStatus = "present" | "absent"

export type Attendance = {
  id: number
  date: string
  time?: string
  course: string
  status: AttendanceStatus
}

export default function TodayClasses({
  attendanceHistory,
}: {
  attendanceHistory: Attendance[]
}) {
  const today = new Date().toISOString().split("T")[0]

  const todayClasses = attendanceHistory.filter(
    (a) => a.date === today
  )

  return (
    <div className="bg-white border rounded-2xl p-5 space-y-3">
      <p className="font-medium flex items-center gap-2">
        📅 Today&apos;s Classes
      </p>

      {todayClasses.length === 0 ? (
        <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4 text-center">
          No classes scheduled for today 🎉
        </div>
      ) : (
        <div className="space-y-2">
          {todayClasses.map((c) => (
            <div
              key={c.id}
              className={`flex justify-between items-center p-3 rounded-xl
              ${
                c.status === "present"
                  ? "bg-green-50 border border-green-200"
                  : "bg-yellow-50 border border-yellow-200"
              }`}
            >
              <div>
                <p className="font-medium">{c.course}</p>
                <p className="text-sm text-gray-500">
                  {c.time
                    ? `⏱ ${c.time}`
                    : "⏱ Not checked in yet"}
                </p>
              </div>

              <span
                className={`px-4 py-1 rounded-full text-sm font-medium
                ${
                  c.status === "present"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {c.status === "present" ? "✓ Present" : "✕ Absent"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}