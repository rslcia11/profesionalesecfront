"use client"

import { Play } from "lucide-react"
import { useState } from "react"

export default function VideoSection() {
  const [selectedVideo, setSelectedVideo] = useState(0)

  const videos = [
    {
      title: "Cómo comenzar en Profesionales.EC",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      description: "Descubre cómo registrarte y crear tu perfil profesional en minutos",
    },
    {
      title: "Consejos para destacar",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      description: "Aprende estrategias para atraer más clientes y proyectos",
    },
    {
      title: "Historias de éxito",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      description: "Testimonios reales de profesionales que crecieron con nosotros",
    },
  ]

  return (
    <section className="py-24 md:py-32 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">Aprende y crece</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Videos educativos para maximizar tu potencial profesional
          </p>
        </div>

        {/* Main Video */}
        <div className="mb-12 rounded-2xl overflow-hidden bg-black/5 aspect-video relative group">
          <img
            src={videos[selectedVideo].thumbnail || "/placeholder.svg"}
            alt={videos[selectedVideo].title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <button className="bg-primary text-primary-foreground p-5 rounded-full shadow-lg hover:bg-primary/90 transition-all transform hover:scale-110">
              <Play size={28} fill="currentColor" />
            </button>
          </div>
        </div>

        {/* Video Info */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-3">{videos[selectedVideo].title}</h3>
          <p className="text-muted-foreground text-lg">{videos[selectedVideo].description}</p>
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedVideo(idx)}
              className={`text-left group transition-all duration-300 ${
                idx === selectedVideo ? "opacity-100" : "opacity-60 hover:opacity-100"
              }`}
            >
              <div className="relative rounded-lg overflow-hidden mb-4 aspect-video">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Play size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {idx === selectedVideo && <div className="absolute inset-0 border-2 border-primary rounded-lg" />}
              </div>
              <h4 className="font-semibold text-foreground text-sm">{video.title}</h4>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
