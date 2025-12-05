"use client"

import { useEffect, useState } from "react"

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-gray-100 animate-in fade-in duration-300">
      <div className="relative">
        <div className="flex flex-col items-center gap-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-blue-400/30 animate-ping" />
          </div>

          <div className="relative z-10 bg-white rounded-2xl p-6 shadow-2xl border border-gray-200 animate-in zoom-in duration-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">P</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">Profesionales</div>
                <div className="text-sm text-blue-600 font-semibold">.ec</div>
              </div>
            </div>
          </div>

          <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden animate-in slide-in-from-bottom duration-500 delay-300">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 loading-bar" />
          </div>

          <p className="text-gray-600 text-sm font-medium animate-pulse">Cargando...</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 75%;
            margin-left: 12.5%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
        .loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
