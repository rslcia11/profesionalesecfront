"use client"

import { Play, Pause } from "lucide-react"
import { useState, useRef } from "react"

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <section className="relative w-full h-screen flex items-center justify-start overflow-hidden bg-black">
      <div className="absolute inset-0 w-full h-full">
        <video ref={videoRef} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-60">
          <source src="https://cdn.pixabay.com/video/2023/05/02/160966-822707893_large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.95] text-white">
            Conectando
            <br />
            profesionales
            <br />
            de excelencia
          </h1>

          <button
            onClick={toggleVideo}
            className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
          >
            <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:border-white/50 transition-colors">
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </div>
            <span className="text-sm font-medium">Ver video completo</span>
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
        <span className="text-xs uppercase tracking-wider">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  )
}
