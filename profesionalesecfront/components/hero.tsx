"use client"

import { useRef } from "react"
import VideoCarousel from "./video-carousel"

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  const carouselVideos = [
    "https://cdn.pixabay.com/video/2023/05/02/160966-822707893_large.mp4",
    "https://cdn.pixabay.com/video/2024/03/04/204740-917035783_large.mp4",
    "https://cdn.pixabay.com/video/2023/08/15/176297-849318455_large.mp4",
  ]

  return (
    <section className="relative w-full h-screen flex items-center justify-start overflow-hidden bg-black">
      <div className="absolute inset-0 w-full h-full">
        <VideoCarousel videos={carouselVideos} autoplay={true} autoplayInterval={6000} showControls={false} />
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
