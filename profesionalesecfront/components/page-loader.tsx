"use client"

import { useEffect, useState } from "react"

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      // Esperar a que termine la animación de salida
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-all duration-500 ease-out ${
        isExiting ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
      }`}
    >
      <img 
        src="/logo-black.png" 
        alt="Profesionales.ec" 
        className="h-28 w-auto object-contain" 
      />
    </div>
  )
}
