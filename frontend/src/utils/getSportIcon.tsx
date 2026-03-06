import {
  CircleDot,
  Dumbbell,
  Volleyball,
  Waves,
  Activity,
  Shield,
} from "lucide-react"

export function getSportIcon(title: string) {
  const text = title.toLowerCase()

  if (text.includes("badminton"))
    return CircleDot
  if (text.includes("football"))
    return Dumbbell
  if (text.includes("basketball"))
    return Volleyball
  if (text.includes("swimming"))
    return Waves
  if (text.includes("tennis"))
    return Activity
  if (
    text.includes("martial") ||
    text.includes("boxing") ||
    text.includes("taekwondo")
  )
    return Shield

  // default
  return CircleDot
}