"use client"

import { useEffect, useState } from "react"

type Point = { x: number; y: number }

export default function GlowBackground({
    children,
}: {
    children: React.ReactNode
}) {
    const [points, setPoints] = useState<Point[]>([])

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            setPoints((prev) => {
                const next = [...prev, { x: e.clientX, y: e.clientY }]
                return next.slice(-10) // 🔥 ความยาวหาง
            })
        }

        window.addEventListener("mousemove", handleMove)
        return () => window.removeEventListener("mousemove", handleMove)
    }, [])

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

            {/* 🏀 Basketball Trail */}
            {points.map((p, i) => (
                <span
                    key={i}
                    className="pointer-events-none absolute select-none"
                    style={{
                        left: p.x - 10,
                        top: p.y - 10,
                        fontSize: 30,
                        opacity: i / points.length,
                        transform: `scale(${i / points.length + 0.6})`,
                        filter: "drop-shadow(0 0 6px rgba(249,115,22,0.6))",
                    }}
                >
                    ⚽️
                </span>
            ))}

            {/* content */}
            <div className="relative z-10">{children}</div>
        </div>
    )
}