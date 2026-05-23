"use client"

import { useEffect, useState } from "react"
import { carouselsApi } from "@/lib/api/carousels"
import { getCarouselFallback } from "@/lib/carousels/fallbacks"
import type { ManagedCarouselSlide } from "@/lib/validators/carousel"

export function useManagedCarousel(placementKey: string): ManagedCarouselSlide[] {
  const [slides, setSlides] = useState<ManagedCarouselSlide[]>(() => getCarouselFallback(placementKey))

  useEffect(() => {
    let cancelled = false

    setSlides(getCarouselFallback(placementKey))

    carouselsApi
      .getPublic(placementKey)
      .then((result) => {
        if (cancelled) return
        setSlides(result.slides.length > 0 ? result.slides : getCarouselFallback(placementKey))
      })
      .catch(() => {
        if (cancelled) return
        setSlides(getCarouselFallback(placementKey))
      })

    return () => {
      cancelled = true
    }
  }, [placementKey])

  return slides
}
