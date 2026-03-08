"use client"

import { useState, useEffect } from "react"
import { CourseStatus } from "./CourseTable"
import axios from "@/lib/axios"

type Coach = {
  id: number
  name: string
}

type Props = {
  open: boolean
  onClose: () => void
  onAdd: (course: {
    title: string
    description: string
    coach: string
    price: number
    status: CourseStatus
    startDate: string
    endDate: string
    classDays: number[]
  }) => void
}

export function AddCourseModal({ open, onClose, onAdd }: Props) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [coach, setCoach] = useState("")
  const [price, setPrice] = useState<string>("")
  const [status, setStatus] = useState<CourseStatus>("draft")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [classDays, setClassDays] = useState<number[]>([])
  const [coaches, setCoaches] = useState<Coach[]>([])

  useEffect(() => {
    if (open) {
      axios.get("/api/admin/coaches").then((res) => {
        const list = (res.data.data ?? []).map((c: any) => ({
          id: c.profileId ?? c.id,
          name: c.name,
        }))
        setCoaches(list)
        if (list.length > 0) setCoach(String(list[0].id))
      })
    }
  }, [open])

  const handleSave = () => {
    onAdd({ title, description, coach, price: Number(price || 0), status, startDate, endDate, classDays })
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl">
        <div className="px-6 py-4 border-b font-semibold text-blue-900">Add Course</div>
        <div className="px-6 py-4 space-y-4">
          <input placeholder="Course title" className="w-full border px-3 py-2 rounded text-blue-900"
            value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea placeholder="Description" className="w-full border px-3 py-2 rounded text-gray-400"
            value={description} onChange={(e) => setDescription(e.target.value)} />

          <select className="w-full border px-3 py-2 rounded text-blue-900"
            value={coach} onChange={(e) => setCoach(e.target.value)}>
            {coaches.map((c) => (
              <option key={c.id} value={String(c.id)}>{c.name}</option>
            ))}
          </select>

          <input type="number" placeholder="Price" className="w-full border px-3 py-2 rounded text-blue-900"
            value={price} onChange={(e) => setPrice(e.target.value)} min={0} />

          <div className="grid grid-cols-2 gap-3 text-gray-400">
            <input type="date" className="border rounded-md px-3 py-2"
              value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" className="border rounded-md px-3 py-2"
              value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-blue-900">Class Days</div>
            <div className="flex flex-wrap gap-2">
              {[{label:"Sun",value:0},{label:"Mon",value:1},{label:"Tue",value:2},{label:"Wed",value:3},{label:"Thu",value:4},{label:"Fri",value:5},{label:"Sat",value:6}].map((d) => (
                <button key={d.value} type="button"
                  className={`px-3 py-1 rounded-full text-sm border ${classDays.includes(d.value) ? "bg-blue-600 text-white border-blue-600" : "text-gray-600 border-gray-300"}`}
                  onClick={() => setClassDays((prev) => prev.includes(d.value) ? prev.filter((x) => x !== d.value) : [...prev, d.value])}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded border text-gray-600">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded bg-blue-600 text-white">Add</button>
        </div>
      </div>
    </div>
  )
}
