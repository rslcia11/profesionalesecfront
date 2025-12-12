"use client"

import { Play } from "lucide-react"

export default function LearnAndGrow() {
  return (
    <section className="py-8 md:py-10 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">Aprende y crece</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Videos educativos para maximizar tu potencial profesional
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden bg-black/5 aspect-video relative group">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
            alt="Aprende y crece"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <button className="bg-primary text-primary-foreground p-5 rounded-full shadow-lg hover:bg-primary/90 transition-all transform hover:scale-110">
              <Play size={28} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
