"use client"

import { useEffect, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Upload, X, Image as ImageIcon, Link as LinkIcon, CloudUpload, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { BeneficiosInput } from "./BeneficiosInput"
import {
  crearConvenioSchema,
  actualizarConvenioSchema,
  type CrearConvenioData,
  type ActualizarConvenioData,
  type Convenio,
} from "@/lib/validators/convenio"
import { cn } from "@/lib/utils"
import { multimediaApi, getToken } from "@/lib/api"

type ConvenioFormData = CrearConvenioData | ActualizarConvenioData

interface ConvenioModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  convenio?: Convenio | null
  onSubmit: (data: ConvenioFormData) => Promise<void>
  isSubmitting?: boolean
}

export function ConvenioModal({
  open,
  onOpenChange,
  convenio,
  onSubmit,
  isSubmitting = false,
}: ConvenioModalProps) {
  const isEditing = !!convenio
  const [beneficios, setBeneficios] = useState<string[]>([])
  const [logoUrl, setLogoUrl] = useState("")
  const [bannerUrl, setBannerUrl] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  // Upload states
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null)
  const [bannerUploadError, setBannerUploadError] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ConvenioFormData>({
    resolver: zodResolver(isEditing ? actualizarConvenioSchema : crearConvenioSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      link: "",
      beneficios: [],
      categorias: "",
      orden: 0,
      logoUrl: "",
      bannerUrl: "",
    },
  })

  // Reset form when modal opens/closes or convenio changes
  useEffect(() => {
    if (open) {
      if (convenio) {
        reset({
          titulo: convenio.titulo || "",
          descripcion: convenio.descripcion || "",
          link: convenio.link || "",
          categorias: convenio.categorias || "",
          orden: convenio.orden || 0,
          logoUrl: convenio.logoUrl || "",
          bannerUrl: convenio.bannerUrl || "",
        })
        setBeneficios(convenio.beneficios || [])
        setLogoUrl(convenio.logoUrl || "")
        setBannerUrl(convenio.bannerUrl || "")
        setLogoPreview(convenio.logoUrl || null)
        setBannerPreview(convenio.bannerUrl || null)
      } else {
        reset({
          titulo: "",
          descripcion: "",
          link: "",
          beneficios: [],
          categorias: "",
          orden: 0,
          logoUrl: "",
          bannerUrl: "",
        })
        setBeneficios([])
        setLogoUrl("")
        setBannerUrl("")
        setLogoPreview(null)
        setBannerPreview(null)
      }
      setLogoFile(null)
      setBannerFile(null)
      setLogoUploadError(null)
      setBannerUploadError(null)
      setIsUploadingLogo(false)
      setIsUploadingBanner(false)
    }
  }, [open, convenio, reset])

  // Sync beneficios to form
  useEffect(() => {
    setValue("beneficios", beneficios)
  }, [beneficios, setValue])

  // Sync logo URL to form
  useEffect(() => {
    setValue("logoUrl", logoUrl)
  }, [logoUrl, setValue])

  // Sync banner URL to form
  useEffect(() => {
    setValue("bannerUrl", bannerUrl)
  }, [bannerUrl, setValue])

  const onFormSubmit = async (data: ConvenioFormData) => {
    // Merge beneficios from state
    const dataWithBeneficios = {
      ...data,
      beneficios,
      logoUrl: logoUrl || undefined,
      bannerUrl: bannerUrl || undefined,
    }
    await onSubmit(dataWithBeneficios)
    onOpenChange(false)
  }

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      setLogoUploadError(null)
      // Create local preview immediately
      const previewUrl = URL.createObjectURL(file)
      setLogoPreview(previewUrl)
      // Upload to Cloudinary
      uploadLogo(file)
    }
  }

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerFile(file)
      setBannerUploadError(null)
      const previewUrl = URL.createObjectURL(file)
      setBannerPreview(previewUrl)
      // Upload to Cloudinary
      uploadBanner(file)
    }
  }

  const uploadLogo = useCallback(async (file: File) => {
    setIsUploadingLogo(true)
    setLogoUploadError(null)
    try {
      const token = getToken()
      if (!token) {
        setLogoUploadError("No autenticado")
        return
      }
      const result = await multimediaApi.subir(file, "convenios/logos", token)
      // Use the Cloudinary URL
      setLogoUrl(result.url)
    } catch (error: any) {
      console.error("Error uploading logo:", error)
      setLogoUploadError(error.message || "Error al subir logo")
      setLogoPreview(null)
    } finally {
      setIsUploadingLogo(false)
    }
  }, [])

  const uploadBanner = useCallback(async (file: File) => {
    setIsUploadingBanner(true)
    setBannerUploadError(null)
    try {
      const token = getToken()
      if (!token) {
        setBannerUploadError("No autenticado")
        return
      }
      const result = await multimediaApi.subir(file, "convenios/banners", token)
      // Use the Cloudinary URL
      setBannerUrl(result.url)
    } catch (error: any) {
      console.error("Error uploading banner:", error)
      setBannerUploadError(error.message || "Error al subir banner")
      setBannerPreview(null)
    } finally {
      setIsUploadingBanner(false)
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Convenio" : "Nuevo Convenio"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los campos que desees actualizar."
              : "Completa todos los campos para crear un nuevo convenio."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="titulo" className="text-sm font-medium">
              Título *
            </Label>
            <Input
              id="titulo"
              placeholder="Ej: Universidad Central del Ecuador"
              {...register("titulo")}
              className={cn(errors.titulo && "border-destructive")}
            />
            {errors.titulo && (
              <p className="text-xs text-destructive">{errors.titulo.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-sm font-medium">
              Descripción *
            </Label>
            <Textarea
              id="descripcion"
              placeholder="Describe el convenio y sus términos..."
              rows={4}
              {...register("descripcion")}
              className={cn(errors.descripcion && "border-destructive")}
            />
            {errors.descripcion && (
              <p className="text-xs text-destructive">{errors.descripcion.message}</p>
            )}
          </div>

          {/* Link */}
          <div className="space-y-2">
            <Label htmlFor="link" className="text-sm font-medium">
              Link externo
            </Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="link"
                type="url"
                placeholder="https://ejemplo.com/convenio"
                className="pl-10"
                {...register("link")}
              />
            </div>
            {errors.link && (
              <p className="text-xs text-destructive">{errors.link.message}</p>
            )}
          </div>

          {/* Categorías */}
          <div className="space-y-2">
            <Label htmlFor="categorias" className="text-sm font-medium">
              Categorías
            </Label>
            <Input
              id="categorias"
              placeholder="Ej: Educación, Empresarial (separadas por coma)"
              {...register("categorias")}
            />
          </div>

          {/* Orden */}
          <div className="space-y-2">
            <Label htmlFor="orden" className="text-sm font-medium">
              Orden de visualización
            </Label>
            <Input
              id="orden"
              type="number"
              min="0"
              {...register("orden", { valueAsNumber: true })}
              className="w-32"
            />
          </div>

          {/* Beneficios */}
          <BeneficiosInput beneficios={beneficios} onChange={setBeneficios} />
          {errors.beneficios && (
            <p className="text-xs text-destructive">{errors.beneficios.message}</p>
          )}

          {/* Logo URL */}
          <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
            <Label className="text-sm font-semibold">Logo</Label>

            {/* File upload */}
            <div className="space-y-2">
              <Label htmlFor="logo_file" className="text-xs text-muted-foreground">
                Subir archivo:
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="logo_file"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                  disabled={isUploadingLogo}
                  className="flex-1"
                />
                {isUploadingLogo && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                {logoUrl && !isUploadingLogo && <CheckCircle className="h-4 w-4 text-emerald-600" />}
              </div>
              {isUploadingLogo && (
                <p className="text-xs text-blue-600 animate-pulse">Subiendo a Cloudinary...</p>
              )}
              {logoUploadError && (
                <p className="text-xs text-destructive">{logoUploadError}</p>
              )}
            </div>

            <div className="text-xs text-center text-muted-foreground">- O -</div>

            {/* URL input */}
            <div className="space-y-2">
              <Label htmlFor="logo_url" className="text-xs text-muted-foreground">
                Usar URL externa:
              </Label>
              <Input
                id="logo_url"
                type="url"
                placeholder="https://ejemplo.com/logo.png"
                value={logoUrl}
                onChange={(e) => {
                  setLogoUrl(e.target.value)
                  setLogoPreview(e.target.value)
                  setLogoFile(null)
                  setLogoUploadError(null)
                }}
                disabled={isUploadingLogo}
              />
            </div>

            {/* Preview */}
            {(logoPreview || logoUrl) && (
              <div className="mt-2 rounded-lg overflow-hidden border border-border/50 h-24 w-24 flex items-center justify-center bg-background">
                <img
                  src={logoUrl || logoPreview || ""}
                  alt="Logo preview"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = "none"
                  }}
                />
              </div>
            )}
          </div>

          {/* Banner URL */}
          <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
            <Label className="text-sm font-semibold">Banner</Label>

            {/* File upload */}
            <div className="space-y-2">
              <Label htmlFor="banner_file" className="text-xs text-muted-foreground">
                Subir archivo:
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="banner_file"
                  type="file"
                  accept="image/*"
                  onChange={handleBannerFileChange}
                  disabled={isUploadingBanner}
                  className="flex-1"
                />
                {isUploadingBanner && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                {bannerUrl && !isUploadingBanner && <CheckCircle className="h-4 w-4 text-emerald-600" />}
              </div>
              {isUploadingBanner && (
                <p className="text-xs text-blue-600 animate-pulse">Subiendo a Cloudinary...</p>
              )}
              {bannerUploadError && (
                <p className="text-xs text-destructive">{bannerUploadError}</p>
              )}
            </div>

            <div className="text-xs text-center text-muted-foreground">- O -</div>

            {/* URL input */}
            <div className="space-y-2">
              <Label htmlFor="banner_url" className="text-xs text-muted-foreground">
                Usar URL externa:
              </Label>
              <Input
                id="banner_url"
                type="url"
                placeholder="https://ejemplo.com/banner.jpg"
                value={bannerUrl}
                onChange={(e) => {
                  setBannerUrl(e.target.value)
                  setBannerPreview(e.target.value)
                  setBannerFile(null)
                  setBannerUploadError(null)
                }}
                disabled={isUploadingBanner}
              />
            </div>

            {/* Preview */}
            {(bannerPreview || bannerUrl) && (
              <div className="mt-2 rounded-lg overflow-hidden border border-border/50 h-32 w-full flex items-center justify-center bg-background">
                <img
                  src={bannerUrl || bannerPreview || ""}
                  alt="Banner preview"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = "none"
                  }}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <DialogFooter className="pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || isUploadingLogo || isUploadingBanner}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploadingLogo || isUploadingBanner}
            >
              {(isSubmitting || isUploadingLogo || isUploadingBanner) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Actualizar" : "Crear Convenio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
