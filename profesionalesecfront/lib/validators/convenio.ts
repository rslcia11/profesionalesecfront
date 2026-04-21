import { z } from "zod"

/**
 * Schema para crear un nuevo convenio (Zod 3 syntax)
 */
export const crearConvenioSchema = z.object({
  titulo: z
    .string({ required_error: "El título es requerido" })
    .min(1, "El título no puede estar vacío")
    .max(255, "El título no puede exceder 255 caracteres"),
  descripcion: z
    .string({ required_error: "La descripción es requerida" })
    .min(1, "La descripción no puede estar vacía")
    .max(5000, "La descripción no puede exceder 5000 caracteres"),
  link: z
    .string()
    .url("El link debe ser una URL válida")
    .optional()
    .or(z.literal("")),
  beneficios: z.array(z.string()).default([]),
  categorias: z.string().optional(),
  orden: z.number().int().min(0).default(0),
  logoUrl: z
    .string()
    .url("El logo debe ser una URL válida")
    .optional()
    .or(z.literal("")),
  bannerUrl: z
    .string()
    .url("El banner debe ser una URL válida")
    .optional()
    .or(z.literal("")),
})

/**
 * Schema para actualizar un convenio existente
 */
export const actualizarConvenioSchema = z.object({
  titulo: z
    .string()
    .min(1, "El título no puede estar vacío")
    .max(255, "El título no puede exceder 255 caracteres")
    .optional(),
  descripcion: z
    .string()
    .min(1, "La descripción no puede estar vacía")
    .max(5000, "La descripción no puede exceder 5000 caracteres")
    .optional(),
  link: z
    .string()
    .url("El link debe ser una URL válida")
    .optional()
    .or(z.literal("")),
  beneficios: z.array(z.string()).optional(),
  categorias: z.string().optional(),
  orden: z.number().int().min(0).optional(),
  logoUrl: z
    .string()
    .url("El logo debe ser una URL válida")
    .optional()
    .or(z.literal("")),
  bannerUrl: z
    .string()
    .url("El banner debe ser una URL válida")
    .optional()
    .or(z.literal("")),
})

/**
 * Schema para cambiar el estado de un convenio
 */
export const cambiarEstadoSchema = z.object({
  estado: z.enum(["borrador", "publicada", "archivada"], {
    message: "Estado inválido. Valores válidos: borrador, publicada, archivada",
  }),
})

/**
 * Types inferred from schemas
 */
export type CrearConvenioData = z.infer<typeof crearConvenioSchema>
export type ActualizarConvenioData = z.infer<typeof actualizarConvenioSchema>
export type CambiarEstadoData = z.infer<typeof cambiarEstadoSchema>

/**
 * Frontend-only convenience types
 */
export interface Convenio {
  id: number
  titulo: string
  descripcion: string
  link?: string
  beneficios: string[]
  categorias?: string
  orden: number
  logoUrl?: string
  bannerUrl?: string
  estado: "borrador" | "publicada" | "archivada"
  fechaPublicacion?: string
  eliminado?: boolean
  creadoEn?: string
  actualizadoEn?: string
}

export interface ConvenioFiltros {
  page?: number
  limit?: number
  estado?: string
  search?: string
  incluir_eliminados?: boolean
}
