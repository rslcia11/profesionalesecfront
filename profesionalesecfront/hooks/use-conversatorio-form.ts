import { useState, useCallback } from "react"
import { ponenciasApi, catalogosApi, multimediaApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export type PonenciaForm = {
  titulo: string
  descripcion: string
  fecha_inicio: Date
  hora_inicio: string
  fecha_fin: Date
  hora_fin: string
  precio: number
  es_gratuita: boolean
  cupo: number
  es_ilimitado: boolean
  profesion_id: number
  estado: "borrador" | "publicada" | "finalizada"
  provincia_id: number
  ciudad_id: number
  direccion: string
  latitud?: number
  longitud?: number
  imagen_banner: string
  video_url: string
  galeria_fotos: string[]
  es_destacado: boolean
  url_revista_general: string
  foto_revista_general: string
  subtitulo: string
  dias: Array<{
    id?: number
    fecha: Date
    orden: number
    titulo_dia: string
    hora_inicio: string
    hora_fin: string
    ponentes: Array<{
      id?: number
      usuario_id?: number
      nombre_ponente: string
      profesion: string
      tema_charla: string
      foto_revista_url: string
      url_revista_personal: string
      biografia?: string // NUEVO
      slogan?: string // NUEVO
      video_url?: string // NUEVO
      fondo_banner?: string // PREMIUM
      galeria_fotos?: string[] // PREMIUM
      hora_inicio?: string // NUEVO
      hora_fin?: string // NUEVO
      orden: number
    }>
  }>
}

const initialForm: PonenciaForm = {
  titulo: "",
  descripcion: "",
  fecha_inicio: new Date(),
  hora_inicio: "09:00",
  fecha_fin: new Date(),
  hora_fin: "11:00",
  precio: 0,
  es_gratuita: false,
  cupo: 0,
  es_ilimitado: false,
  profesion_id: 0,
  estado: "borrador",
  provincia_id: 0,
  ciudad_id: 0,
  direccion: "",
  latitud: undefined,
  longitud: undefined,
  imagen_banner: "",
  video_url: "",
  galeria_fotos: [],
  es_destacado: false,
  url_revista_general: "",
  foto_revista_general: "",
  subtitulo: "",
  dias: [],
}

const sanitizeData = (data: Partial<PonenciaForm>): PonenciaForm => {
  const sanitized = { ...initialForm } as any
  
  Object.keys(initialForm).forEach((key) => {
    const k = key as keyof PonenciaForm
    const val = data[k]
    
    if (k === "dias" && Array.isArray(val)) {
      sanitized[k] = val.map((dia: any) => ({
        ...dia,
        fecha: dia.fecha ? new Date(dia.fecha) : new Date(),
        titulo_dia: dia.titulo_dia || "",
        hora_inicio: dia.hora_inicio || "09:00",
        hora_fin: dia.hora_fin || "18:00",
        ponentes: Array.isArray(dia.ponentes) ? dia.ponentes.map((p: any) => ({
          ...p,
          nombre_ponente: p.nombre_ponente || "",
          profesion: p.profesion || "",
          tema_charla: p.tema_charla || "",
          foto_revista_url: p.foto_revista_url || "",
          url_revista_personal: p.url_revista_personal || "",
          biografia: p.biografia || "",
          slogan: p.slogan || "",
          video_url: p.video_url || "",
          fondo_banner: p.fondo_banner || "",
          galeria_fotos: Array.isArray(p.galeria_fotos) ? p.galeria_fotos : [],
          hora_inicio: p.hora_inicio || "09:00",
          hora_fin: p.hora_fin || "10:00",
        })) : []
      }))
    } else if (k === "fecha_inicio" || k === "fecha_fin") {
      sanitized[k] = (val && (typeof val === "string" || typeof val === "number" || val instanceof Date)) ? new Date(val as any) : new Date()
    } else if (Array.isArray(initialForm[k])) {
      sanitized[k] = Array.isArray(val) ? val : []
    } else if (typeof initialForm[k] === "number") {
      sanitized[k] = Number(val || 0)
    } else if (typeof initialForm[k] === "string") {
      sanitized[k] = val || ""
    } else if (typeof initialForm[k] === "boolean") {
      sanitized[k] = !!val
    } else {
      sanitized[k] = val !== null ? val : initialForm[k]
    }
  })
  
  return sanitized
}

export function useConversatorioForm(initialData?: Partial<PonenciaForm>) {
  const { toast } = useToast()
  const router = useRouter()
  // Derivar es_gratuita y es_ilimitado desde precio/cupo si no están definidos (para edición de conversatorios existentes)
  const dataWithSwitches = {
    ...initialData,
    es_gratuita: initialData?.es_gratuita ?? (initialData?.precio === 0),
    es_ilimitado: initialData?.es_ilimitado ?? (initialData?.cupo === 0),
  }
  const [formData, setFormData] = useState<PonenciaForm>(sanitizeData(dataWithSwitches || {}))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [ciudades, setCiudades] = useState<any[]>([])

  const syncItineraryWithDates = useCallback((inicio: Date, fin: Date) => {
    setFormData(prev => {
      const dates: Date[] = []
      let current = new Date(inicio)
      const end = new Date(fin)
      
      // Safety cap (max 30 days) to prevent infinite loops or memory issues
      let count = 0
      while (current <= end && count < 30) {
        dates.push(new Date(current))
        current.setDate(current.getDate() + 1)
        count++
      }

      const newDias = dates.map((date, index) => {
        const dateStr = date.toISOString().split('T')[0]
        // Buscar si ya existe este día en el itinerario actual
        const existingDay = prev.dias.find(d => {
          const dDate = d.fecha instanceof Date ? d.fecha.toISOString().split('T')[0] : d.fecha
          return dDate === dateStr
        })

        if (existingDay) {
          return { ...existingDay, orden: index }
        }

        // Si no existe, crear día nuevo con valores por defecto
        return {
          fecha: date,
          orden: index,
          titulo_dia: `Día ${index + 1}`,
          hora_inicio: "09:00",
          hora_fin: "18:00",
          ponentes: []
        }
      })

      return { ...prev, dias: newDias }
    })
  }, [])

  const updateField = useCallback((field: keyof PonenciaForm, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      
      // Si cambia la fecha de inicio o fin, sincronizamos el itinerario automáticamente
      if (field === "fecha_inicio" || field === "fecha_fin") {
        setTimeout(() => {
          syncItineraryWithDates(updated.fecha_inicio, updated.fecha_fin)
        }, 0)
      }
      
      return updated
    })
  }, [syncItineraryWithDates])

  const handleLocationChange = useCallback((lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, latitud: lat, longitud: lng }))
  }, [])

  const handleProvinciaChange = async (provinciaId: string) => {
    const id = Number(provinciaId)
    updateField("provincia_id", id)
    updateField("ciudad_id", 0)
    setCiudades([])
    if (id) {
      try {
        const res = await catalogosApi.obtenerCiudades(id)
        const filtered = Array.isArray(res) ? res.filter((c: any) => c.provincia_id === id || (c.provincia && c.provincia.id === id)) : []
        setCiudades(filtered)
      } catch (error) {
        console.error("Error loading cities:", error)
      }
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "imagen_banner" | "galeria_fotos" | "foto_revista_general" | "url_revista_general" | { type: "ponente_foto" | "ponente_fondo" | "ponente_revista" | "ponente_galeria", diaIndex: number, ponenteIndex: number }) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const token = localStorage.getItem("auth_token") || ""
      const res = await multimediaApi.subir(file, "conversatorios", token)
      
      if (typeof field === "string") {
        if (field === "imagen_banner") {
          updateField("imagen_banner", res.url)
          toast({ title: "Éxito", description: "Imagen de banner subida correctamente." })
        } else if (field === "foto_revista_general") {
          updateField("foto_revista_general", res.url)
          toast({ title: "Éxito", description: "Portada de revista subida." })
        } else if (field === "url_revista_general") {
          updateField("url_revista_general", res.url)
          toast({ title: "Éxito", description: "Archivo de revista subido correctamente." })
        } else {
          const currentGaleria = Array.isArray(formData.galeria_fotos) ? formData.galeria_fotos : []
          updateField("galeria_fotos", [...currentGaleria, res.url])
          toast({ title: "Éxito", description: "Imagen añadida a la galería." })
        }
      } else if (field.type === "ponente_foto" || field.type === "ponente_fondo" || field.type === "ponente_revista" || field.type === "ponente_galeria") {
        const newDias = [...formData.dias]
        if (field.type === "ponente_foto") {
          newDias[field.diaIndex].ponentes[field.ponenteIndex].foto_revista_url = res.url
          toast({ title: "Éxito", description: "Foto del ponente subida." })
        } else if (field.type === "ponente_fondo") {
          newDias[field.diaIndex].ponentes[field.ponenteIndex].fondo_banner = res.url
          toast({ title: "Éxito", description: "Fondo del banner del ponente subido." })
        } else if (field.type === "ponente_revista") {
          newDias[field.diaIndex].ponentes[field.ponenteIndex].url_revista_personal = res.url
          toast({ title: "Éxito", description: "Archivo de revista/perfil subido." })
        } else if (field.type === "ponente_galeria") {
          const currentGaleria = Array.isArray(newDias[field.diaIndex].ponentes[field.ponenteIndex].galeria_fotos) 
            ? (newDias[field.diaIndex].ponentes[field.ponenteIndex].galeria_fotos as string[]) 
            : []
          newDias[field.diaIndex].ponentes[field.ponenteIndex].galeria_fotos = [...currentGaleria, res.url]
          toast({ title: "Éxito", description: "Imagen añadida a la galería del ponente." })
        }
        updateField("dias", newDias)
      }
    } catch (error: any) {
      toast({ title: "Error", description: "Error al subir archivo: " + error.message, variant: "destructive" })
    } finally {
      setIsUploading(false)
    }
  }

  // --- Helper methods for nested data ---
  const addDay = () => {
    const newDay = {
      fecha: new Date(),
      orden: formData.dias.length,
      titulo_dia: `Día ${formData.dias.length + 1}`,
      hora_inicio: "09:00",
      hora_fin: "18:00",
      ponentes: []
    }
    updateField("dias", [...formData.dias, newDay])
  }

  const removeDay = (index: number) => {
    const newDias = formData.dias.filter((_, i: number) => i !== index)
    updateField("dias", newDias)
  }

  const updateDay = (index: number, field: string, value: any) => {
    const newDias = [...formData.dias]
    newDias[index] = { ...newDias[index], [field]: value }
    updateField("dias", newDias)
  }

  const addSpeaker = (diaIndex: number) => {
    const newSpeaker = {
      nombre_ponente: "",
      profesion: "",
      tema_charla: "",
      foto_revista_url: "",
      url_revista_personal: "",
      biografia: "",
      slogan: "",
      video_url: "",
      fondo_banner: "",
      galeria_fotos: [],
      hora_inicio: "09:00",
      hora_fin: "10:00",
      orden: formData.dias[diaIndex].ponentes.length
    }
    const newDias = [...formData.dias]
    newDias[diaIndex].ponentes.push(newSpeaker)
    updateField("dias", newDias)
  }

  const removeSpeaker = (diaIndex: number, ponenteIndex: number) => {
    const newDias = [...formData.dias]
    newDias[diaIndex].ponentes = newDias[diaIndex].ponentes.filter((_, i: number) => i !== ponenteIndex)
    updateField("dias", newDias)
  }

  const updateSpeaker = (diaIndex: number, ponenteIndex: number, field: string, value: any) => {
    const newDias = [...formData.dias]
    newDias[diaIndex].ponentes[ponenteIndex] = { ...newDias[diaIndex].ponentes[ponenteIndex], [field]: value }
    updateField("dias", newDias)
  }

  const save = async (id?: number) => {
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) throw new Error("No hay token de autenticación")

      // Validaciones básicas
      if (!formData.titulo.trim()) throw new Error("El título del conversatorio es obligatorio")
      if (!formData.descripcion.trim()) throw new Error("La descripción del conversatorio es obligatoria")

      // Validar que cada ponente tenga nombre o usuario vinculado
      formData.dias.forEach((dia, dIdx) => {
        dia.ponentes.forEach((ponente, pIdx) => {
          if (!ponente.nombre_ponente?.trim() && !ponente.usuario_id) {
            throw new Error(`El ponente ${pIdx + 1} del Día ${dIdx + 1} debe tener un nombre o un usuario vinculado.`)
          }
        })
      })

      // Validaciones de negocio
      if (!formData.es_gratuita && formData.precio <= 0) throw new Error("La inversión debe ser mayor a cero")
      if (!formData.es_ilimitado && formData.cupo <= 0) throw new Error("El cupo debe ser mayor a cero")
      if (!formData.latitud || !formData.longitud) throw new Error("Debes ubicar el evento en el mapa")

      const dataToSave = {
        ...formData,
        fecha_inicio: formData.fecha_inicio.toISOString().split('T')[0],
        fecha_fin: formData.fecha_fin.toISOString().split('T')[0],
        galeria_fotos: formData.galeria_fotos,
        dias: formData.dias.map((d: any) => ({
          ...d,
          fecha: d.fecha instanceof Date ? d.fecha.toISOString().split('T')[0] : d.fecha
        }))
      } as any

      if (id) {
        await ponenciasApi.actualizar(id, dataToSave, token)
        toast({ title: "Actualizado", description: "El conversatorio se ha actualizado con éxito." })
      } else {
        await ponenciasApi.crear(dataToSave, token)
        toast({ title: "Creado", description: "El conversatorio se ha creado con éxito." })
      }
      router.push("/admin")
      router.refresh()
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Error al guardar el conversatorio", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    setFormData,
    updateField,
    handleLocationChange,
    handleProvinciaChange,
    handleFileUpload,
    save,
    isSubmitting,
    isUploading,
    ciudades,
    setCiudades,
    addDay,
    removeDay,
    updateDay,
    addSpeaker,
    removeSpeaker,
    updateSpeaker
  }
}
