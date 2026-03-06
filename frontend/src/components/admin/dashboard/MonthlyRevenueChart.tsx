"use client"

import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const data = [
  { month: "January", revenue: 120000, expense: 80000 },
  { month: "February", revenue: 150000, expense: 90000 },
  { month: "March", revenue: 180000, expense: 110000 },
  { month: "April", revenue: 200000, expense: 120000 },
  { month: "May", revenue: 170000, expense: 100000 },
  { month: "June", revenue: 220000, expense: 140000 },
  { month: "July", revenue: 210000, expense: 130000 },
  { month: "August", revenue: 230000, expense: 150000 },
  { month: "September", revenue: 245000, expense: 160000 },
  { month: "October", revenue: 265000, expense: 170000 },
  { month: "November", revenue: 285000, expense: 185000 },
  { month: "December", revenue: 300000, expense: 200000 },
].map((d) => ({
  ...d,
  profit: d.revenue - d.expense, // 🔑 Profit
}))

export function MonthlyRevenueChart() {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          <span className="text-black">Monthly </span>
          <span className="text-blue-600">Revenue</span>
          <span className="text-slate-800">, </span>
          <span className="text-rose-500">Expense</span>
          <span className="text-slate-800"> and </span>
          <span className="text-yellow-500">Profit</span>
        </h3>
        <p className="text-sm text-slate-500">
          Overview of financial performance
        </p>
      </div>

      <div className="w-full h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="month"
              tick={{ fill: "#475569", fontSize: 12 }}
            />

            <YAxis
              tick={{ fill: "#475569", fontSize: 12 }}
              tickFormatter={(v) => `฿${v / 1000}k`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
              }}
              formatter={(value, name) => {
                if (name === "Profit") {
                  return `฿${value}`
                }
                return `฿${(value as number) / 1000}k`
              }}
            />

            <Legend />

            {/* Revenue */}
            <Bar
              dataKey="revenue"
              name="Revenue"
              fill="#2563eb" // Blue
              radius={[8, 8, 0, 0]}
            />

            {/* Expense */}
            <Bar
              dataKey="expense"
              name="Expense"
              fill="#f43f5e" // Red (soft)
              radius={[8, 8, 0, 0]}
            />

            {/* 🔥 Profit Line */}
            <Line
              type="monotone"
              dataKey="profit"
              name="Profit"
              stroke="#ffd500ff" // Green
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}