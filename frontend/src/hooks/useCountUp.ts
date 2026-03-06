import { useEffect, useState } from "react"

export function useCountUp(
  end: number,
  duration = 800
) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let start = 0
    const startTime = performance.now()

    const animate = (time: number) => {
      const progress = Math.min(
        (time - startTime) / duration,
        1
      )

      const eased = 1 - Math.pow(1 - progress, 3) // easeOut
      setValue(Math.floor(eased * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration])

  return value
}