import { z } from "zod"

export const carouselSlideSchema = z.object({
  id: z.number(),
  placementKey: z.string(),
  title: z.string(),
  subtitle: z.string().nullable().optional(),
  imageUrl: z.string(),
  imagePublicId: z.string().nullable().optional(),
  ctaLabel: z.string().nullable().optional(),
  ctaUrl: z.string().nullable().optional(),
  sortOrder: z.number(),
  isActive: z.boolean(),
})

export const carouselPlacementSchema = z.object({
  id: z.number(),
  key: z.string(),
  label: z.string(),
  routePath: z.string(),
  isActive: z.boolean(),
  totalSlides: z.number().optional(),
  activeSlides: z.number().optional(),
})

export const carouselPlacementResponseSchema = z.object({
  placement: carouselPlacementSchema,
  slides: z.array(carouselSlideSchema),
})

export const createCarouselSlideSchema = z.object({
  placementKey: z.string().min(1, "El placement es obligatorio"),
  title: z.string().min(1, "El titulo es obligatorio"),
  subtitle: z.string().optional(),
  imageUrl: z.string().min(1, "La imagen es obligatoria"),
  imagePublicId: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

export const updateCarouselSlideSchema = createCarouselSlideSchema.partial()

export const reorderCarouselSlidesSchema = z.object({
  placementKey: z.string().min(1),
  slideIds: z.array(z.number()).min(1),
})

export type ManagedCarouselSlide = z.infer<typeof carouselSlideSchema>
export type CarouselPlacement = z.infer<typeof carouselPlacementSchema>
export type CarouselPlacementResponse = z.infer<typeof carouselPlacementResponseSchema>
export type CreateCarouselSlideData = z.infer<typeof createCarouselSlideSchema>
export type UpdateCarouselSlideData = z.infer<typeof updateCarouselSlideSchema>
export type ReorderCarouselSlidesData = z.infer<typeof reorderCarouselSlidesSchema>
