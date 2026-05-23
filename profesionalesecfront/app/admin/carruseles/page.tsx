"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { carouselsApi } from "@/lib/api/carousels"
import { getToken, multimediaApi } from "@/lib/api"
import type { CarouselPlacement, ManagedCarouselSlide } from "@/lib/validators/carousel"
import { ArrowDown, ArrowUp, Image as ImageIcon, Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react"

type PlacementData = {
  placement: CarouselPlacement
  slides: ManagedCarouselSlide[]
}

type SlideFormState = {
  title: string
  subtitle: string
  imageUrl: string
  imagePublicId: string
  ctaLabel: string
  ctaUrl: string
  isActive: boolean
}

const EMPTY_FORM: SlideFormState = {
  title: "",
  subtitle: "",
  imageUrl: "",
  imagePublicId: "",
  ctaLabel: "",
  ctaUrl: "",
  isActive: true,
}

export default function AdminCarruselesPage() {
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [placements, setPlacements] = useState<CarouselPlacement[]>([])
  const [selectedPlacementKey, setSelectedPlacementKey] = useState("")
  const [placementData, setPlacementData] = useState<PlacementData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<ManagedCarouselSlide | null>(null)
  const [form, setForm] = useState<SlideFormState>(EMPTY_FORM)

  const loadPlacements = useCallback(async (nextPlacementKey?: string) => {
    setIsLoading(true)

    try {
      const nextPlacements = await carouselsApi.listAdminPlacements()
      setPlacements(nextPlacements)

      const defaultPlacementKey = nextPlacementKey || nextPlacements[0]?.key || ""
      setSelectedPlacementKey(defaultPlacementKey)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar los carruseles.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const loadPlacement = useCallback(async (placementKey: string) => {
    setIsLoading(true)

    try {
      const data = await carouselsApi.getAdminPlacement(placementKey, true)
      setPlacementData(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo cargar el placement.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadPlacements()
  }, [loadPlacements])

  useEffect(() => {
    if (!selectedPlacementKey) return

    loadPlacement(selectedPlacementKey)
  }, [selectedPlacementKey, loadPlacement])

  function openCreateModal() {
    setEditingSlide(null)
    setForm(EMPTY_FORM)
    setIsModalOpen(true)
  }

  function openEditModal(slide: ManagedCarouselSlide) {
    setEditingSlide(slide)
    setForm({
      title: slide.title,
      subtitle: slide.subtitle || "",
      imageUrl: slide.imageUrl,
      imagePublicId: slide.imagePublicId || "",
      ctaLabel: slide.ctaLabel || "",
      ctaUrl: slide.ctaUrl || "",
      isActive: slide.isActive,
    })
    setIsModalOpen(true)
  }

  async function handleSave() {
    if (!selectedPlacementKey) return
    if (!form.title.trim() || !form.imageUrl.trim()) {
      toast({
        title: "Datos incompletos",
        description: "El título y la imagen son obligatorios.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const payload = {
        placementKey: selectedPlacementKey,
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || undefined,
        imageUrl: form.imageUrl.trim(),
        imagePublicId: form.imagePublicId.trim() || undefined,
        ctaLabel: form.ctaLabel.trim() || undefined,
        ctaUrl: form.ctaUrl.trim() || undefined,
        isActive: form.isActive,
        sortOrder: editingSlide ? editingSlide.sortOrder : placementData?.slides.length,
      }

      if (editingSlide) {
        await carouselsApi.updateSlide(editingSlide.id, payload)
        toast({ title: "Slide actualizado", description: "Los cambios se guardaron correctamente." })
      } else {
        await carouselsApi.createSlide(payload)
        toast({ title: "Slide creado", description: "El slide fue agregado al placement." })
      }

      setIsModalOpen(false)
      setForm(EMPTY_FORM)
      await loadPlacements(selectedPlacementKey)
      await loadPlacement(selectedPlacementKey)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar el slide.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(slide: ManagedCarouselSlide) {
    if (!window.confirm(`Eliminar el slide "${slide.title}"?`)) {
      return
    }

    try {
      await carouselsApi.deleteSlide(slide.id)
      toast({ title: "Slide eliminado", description: "El slide fue eliminado correctamente." })
      await loadPlacements(selectedPlacementKey)
      await loadPlacement(selectedPlacementKey)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el slide.",
        variant: "destructive",
      })
    }
  }

  async function handleToggle(slide: ManagedCarouselSlide, isActive: boolean) {
    try {
      await carouselsApi.updateSlide(slide.id, { isActive })
      await loadPlacements(selectedPlacementKey)
      await loadPlacement(selectedPlacementKey)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el estado.",
        variant: "destructive",
      })
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    if (!placementData) return

    const nextSlides = [...placementData.slides]
    const swapIndex = direction === "up" ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= nextSlides.length) return

    ;[nextSlides[index], nextSlides[swapIndex]] = [nextSlides[swapIndex], nextSlides[index]]

    try {
      await carouselsApi.reorderSlides({
        placementKey: placementData.placement.key,
        slideIds: nextSlides.map((slide) => slide.id),
      })
      await loadPlacement(selectedPlacementKey)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo reordenar el slide.",
        variant: "destructive",
      })
    }
  }

  async function handleUpload(file: File | null) {
    if (!file) return

    const token = getToken()
    if (!token) {
      toast({ title: "Error", description: "No autenticado.", variant: "destructive" })
      return
    }

    setIsUploading(true)

    try {
      const result = await multimediaApi.subir(file, "carousels", token)
      setForm((current) => ({
        ...current,
        imageUrl: result.url,
        imagePublicId: result.public_id,
      }))
      toast({ title: "Imagen subida", description: "La imagen fue cargada correctamente." })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo subir la imagen.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold">Gestión de Carruseles</h1>
          <p className="text-muted-foreground">Administra slides por placement sin depender de publicidades.</p>
        </div>

        <Button onClick={openCreateModal} disabled={!selectedPlacementKey} className="rounded-2xl">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Slide
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Placement</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[280px_1fr]">
          <div className="space-y-2">
            <Label>Selecciona un placement</Label>
            <Select value={selectedPlacementKey} onValueChange={setSelectedPlacementKey}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un placement" />
              </SelectTrigger>
              <SelectContent>
                {placements.map((placement) => (
                  <SelectItem key={placement.key} value={placement.key}>
                    {placement.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-900">Ruta:</span> {placementData?.placement.routePath || "-"}</p>
              <p><span className="font-semibold text-slate-900">Activos:</span> {placements.find((placement) => placement.key === selectedPlacementKey)?.activeSlides || 0}</p>
              <p><span className="font-semibold text-slate-900">Total:</span> {placements.find((placement) => placement.key === selectedPlacementKey)?.totalSlides || 0}</p>
            </div>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : placementData?.slides.length ? (
              placementData.slides.map((slide, index) => (
                <Card key={slide.id} className="border-slate-200">
                  <CardContent className="p-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex gap-4">
                      <div className="h-28 w-40 overflow-hidden rounded-2xl border bg-slate-100">
                        {slide.imageUrl ? (
                          <img src={slide.imageUrl} alt={slide.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-400">
                            <ImageIcon className="h-8 w-8" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h2 className="text-lg font-semibold">{slide.title}</h2>
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${slide.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
                            {slide.isActive ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                        {slide.subtitle && <p className="text-sm text-muted-foreground">{slide.subtitle}</p>}
                        <p className="text-xs text-slate-500">Orden guardado: {slide.sortOrder + 1}</p>
                        {slide.ctaLabel && slide.ctaUrl && (
                          <p className="text-xs text-slate-500">CTA: {slide.ctaLabel} ({slide.ctaUrl})</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                      <div className="flex items-center gap-2 rounded-full border px-3 py-2">
                        <span className="text-xs font-medium text-slate-600">Activo</span>
                        <Switch checked={slide.isActive} onCheckedChange={(checked) => handleToggle(slide, checked)} />
                      </div>
                      <Button variant="outline" size="icon" onClick={() => handleMove(index, "up")} disabled={index === 0}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleMove(index, "down")} disabled={index === placementData.slides.length - 1}>
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => openEditModal(slide)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(slide)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-muted-foreground">
                No hay slides en este placement. Crea el primero para comenzar.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-full sm:max-w-xl flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>{editingSlide ? "Editar Slide" : "Nuevo Slide"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 pt-0">
            <div className="grid gap-1.5">
              <Label htmlFor="title">Título</Label>
              <Input id="title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Textarea id="subtitle" rows={2} value={form.subtitle} onChange={(event) => setForm((current) => ({ ...current, subtitle: event.target.value }))} />
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="imageUrl">Imagen</Label>
                <Label htmlFor="imageUpload" className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1 text-sm font-medium hover:bg-slate-50">
                  <Upload className="h-3.5 w-3.5" />
                  {isUploading ? "Subiendo..." : "Subir imagen"}
                </Label>
              </div>
              <Input id="imageUpload" type="file" accept="image/*" className="hidden" onChange={(event) => handleUpload(event.target.files?.[0] || null)} />
              <Input id="imageUrl" value={form.imageUrl} onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))} placeholder="https://... o /ruta/local" />
            </div>

            {form.imageUrl && (
              <div className="relative overflow-hidden rounded-xl border">
                <img src={form.imageUrl} alt={form.title || "Preview"} className="h-40 w-full object-cover" />
                <div className={`absolute inset-0 bg-black/40 ${selectedPlacementKey === "home" ? "flex items-center justify-start" : "flex flex-col items-center justify-center"}`}>
                  <div className={selectedPlacementKey === "home" ? "px-6 max-w-[60%]" : "px-4"}>
                    {form.title && (
                      <h3 className={`text-white text-base font-bold drop-shadow-lg ${selectedPlacementKey === "home" ? "text-left" : "text-center"}`}>
                        {form.title}
                      </h3>
                    )}
                    {form.subtitle && (
                      <p className={`text-white/90 text-xs drop-shadow-md mt-0.5 ${selectedPlacementKey === "home" ? "text-left" : "text-center"}`}>
                        {form.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving || isUploading}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingSlide ? "Guardar cambios" : "Crear slide"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}