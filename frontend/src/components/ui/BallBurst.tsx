"use client"

export default function BallBurst() {
  const balls = Array.from({ length: 12 })

  return (
    <div className="ball-burst">
      {balls.map((_, i) => (
        <span
          key={i}
          className="ball"
          style={{
            "--x": `${Math.cos((i / balls.length) * 2 * Math.PI) * 120}px`,
            "--y": `${Math.sin((i / balls.length) * 2 * Math.PI) * 120}px`,
          } as React.CSSProperties}
        >
          {["🏀", "⚽", "🏸"][i % 3]}
        </span>
      ))}
    </div>
  )
}