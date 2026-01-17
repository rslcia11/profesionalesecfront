"use client"

import { useRef } from "react"
import VideoCarousel from "./video-carousel"

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  const carouselMedia = [
    { type: 'image' as const, src: '/1.jpg' },
    { type: 'image' as const, src: '/2.jpg' },
    { type: 'image' as const, src: '/3.jpg' },
    { type: 'image' as const, src: '/4.jpg' },
    { type: 'image' as const, src: '/5.jpg' },
    { type: 'image' as const, src: '/6.jpg' },
    { type: 'image' as const, src: '/7.jpg' },
    { type: 'image' as const, src: '/8.jpg' },
    { type: 'image' as const, src: '/9.jpg' },
    { type: 'image' as const, src: '/10.jpg' },
  ]

  return (
    <section className="relative w-full h-screen flex items-center justify-start overflow-hidden bg-black">
      <div className="absolute inset-0 w-full h-full">
        <VideoCarousel media={carouselMedia} autoplay={true} autoplayInterval={6000} showControls={false} />
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
        </div>
      </div>
    </section>
  )
}