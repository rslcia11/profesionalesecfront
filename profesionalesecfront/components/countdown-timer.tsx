"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  targetDate: string | Date
  onComplete?: () => void
}

export default function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date()
      
      if (difference <= 0) {
        if (onComplete) onComplete()
        return null
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    setTimeLeft(calculateTimeLeft())

    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  if (!timeLeft) return null

  const items = [
    { label: "Días", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Seg", value: timeLeft.seconds },
  ]

  return (
    <div className="flex gap-3 md:gap-4 justify-center md:justify-start items-center animate-in fade-in slide-in-from-bottom-2 duration-500">
      {items.map((item, idx) => (
        <div key={item.label} className="flex flex-col items-center">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-br from-emerald-500/20 to-blue-600/20 rounded-xl blur-sm opacity-50 transition duration-500" />
            <div className="relative w-12 h-12 md:w-14 md:h-14 bg-black/90 rounded-xl border border-white/5 flex items-center justify-center backdrop-blur-md">
              <span className="text-xl md:text-2xl font-bold text-white tracking-tighter">
                {item.value.toString().padStart(2, "0")}
              </span>
            </div>
          </div>
          <span className="mt-1.5 text-[8px] md:text-[10px] font-medium text-gray-500 uppercase tracking-widest">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}
