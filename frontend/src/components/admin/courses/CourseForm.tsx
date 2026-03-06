"use client"

import { Coach } from "@/types/coach"
import { useState } from "react"

type Props = {
  coaches: Coach[]
}

export default function CourseForm({ coaches }: Props) {
  const [coachId, setCoachId] = useState<number | "">("")

  return (
    <div className="space-y-3">
      <input placeholder="Course title" />
      <textarea placeholder="Description" />

      {/* ✅ Coach Dropdown */}
      <select
        value={coachId}
        onChange={(e) => setCoachId(Number(e.target.value))}
      >
        <option value="">Select coach</option>
        {coaches
          .filter(c => c.status === "active")
          .map(c => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.expertise.join(", ")})
            </option>
          ))}
      </select>

      <input type="number" placeholder="Price" />
      <button className="btn-primary">Save</button>
    </div>
  )
}