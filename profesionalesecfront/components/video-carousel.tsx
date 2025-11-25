"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"

interface VideoCarouselProps {
  videos: string[]
  autoplay?: boolean
  autoplayInterval?: number
  showControls?: boolean
}

export default function VideoCarousel({
  videos,
  autoplay = true,
  autoplayInterval = 6000,
  showControls = true,
}: VideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isPlaying || !autoplay || videos.length <= 1) return

    autoplayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length)
    }, autoplayInterval)

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current)
    }
  }, [isPlaying, autoplay, videos.length, autoplayInterval])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current)
    setIsPlaying(true)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="w-full h-full bg-black/50 rounded-lg flex items-center justify-center">No videos available</div>
    )
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg group">
      {/* Video Container */}
      <div className="relative w-full h-full bg-black">
        {videos.map((video, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <video
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              autoPlay={index === currentIndex && isPlaying}
            >
              <source src={video} type="video/mp4" />
            </video>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
          </div>
        ))}
      </div>

      {/* Controls - Show only if multiple videos or explicitly enabled */}
      {showControls && videos.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 duration-300"
            aria-label="Previous video"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 duration-300"
            aria-label="Next video"
          >
            <ChevronRight size={24} />
          </button>

          {/* Play/Pause Button - Center */}
          <button
            onClick={togglePlayPause}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all hover:scale-110"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>

          {/* Indicators - Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex ? "bg-white w-8 h-2" : "bg-white/50 hover:bg-white/70 w-2 h-2"
                }`}
                aria-label={`Go to video ${index + 1}`}
              />
            ))}
          </div>

          {/* Video Counter */}
          <div className="absolute top-4 right-4 z-20 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white/90 text-sm font-medium">
            {currentIndex + 1} / {videos.length}
          </div>
        </>
      )}
    </div>
  )
}
