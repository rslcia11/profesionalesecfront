"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload } from "lucide-react" // Added Upload
import type { Articulo } from "@/lib/api"

interface ArticleFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    article?: Articulo | null
    onSubmit: (data: FormData | { titulo: string; contenido: string; resumen?: string; imagen_url?: string }) => Promise<void>
}

export default function ArticleFormModal({
    open,
    onOpenChange,
    article,
    onSubmit,
}: ArticleFormModalProps) {
    const [titulo, setTitulo] = useState("")
    const [resumen, setResumen] = useState("")
    const [contenido, setContenido] = useState("")
    const [imagenUrl, setImagenUrl] = useState("")
    const [imagenFile, setImagenFile] = useState<File | null>(null) // New state for image file
    const [pdfFile, setPdfFile] = useState<File | null>(null) // New state for PDF file
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState<{ titulo?: string; contenido?: string }>({})

    const isEditing = !!article

    useEffect(() => {
        if (article) {
            setTitulo(article.titulo || "")
            setResumen(article.resumen || "")
            setContenido(article.contenido || "")
            setImagenUrl(article.imagen_url || "")
            // Reset files when editing logic opens - files start empty (can't prepopulate file inputs)
            setImagenFile(null)
            setPdfFile(null)
        } else {
            setTitulo("")
            setResumen("")
            setContenido("")
            setImagenUrl("")
            setImagenFile(null)
            setPdfFile(null)
        }
        setErrors({})
    }, [article, open])

    const validate = () => {
        const newErrors: { titulo?: string; contenido?: string } = {}
        if (!titulo.trim()) newErrors.titulo = "El título es obligatorio"
        if (!contenido.trim()) newErrors.contenido = "El contenido es obligatorio"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setSubmitting(true)
        try {
            const formData = new FormData()
            formData.append("titulo", titulo.trim())
            formData.append("contenido", contenido.trim())
            if (resumen.trim()) formData.append("resumen", resumen.trim())

            // Image handling preference: File > URL > Existing
            if (imagenFile) {
                formData.append("imagen", imagenFile)
            } else if (imagenUrl.trim()) {
                formData.append("imagen_url", imagenUrl.trim())
            }

            // PDF handling
            if (pdfFile) {
                formData.append("pdf", pdfFile)
            }

            // onSubmit handles FormData now (as per updated api/dashboard logic)
            // @ts-ignore - We updated parent signature but TS might complain until full compilation
            await onSubmit(formData)
            onOpenChange(false)
        } catch (error) {
            console.error("Error submitting article:", error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
        const file = e.target.files?.[0] || null
        if (type === 'image') {
            setImagenFile(file)
            // Optional: Create preview URL for immediate feedback
            if (file) {
                // Clear manual URL if file is selected to avoid confusion
                setImagenUrl("")
            }
        } else {
            setPdfFile(file)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Artículo" : "Nuevo Artículo"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Modifica los campos que desees actualizar."
                            : "Comparte tu conocimiento con la comunidad. Los artículos se publican inmediatamente."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Titulo */}
                    <div className="space-y-2">
                        <Label htmlFor="titulo">Título *</Label>
                        <Input
                            id="titulo"
                            placeholder="Ej: 5 consejos para mantener una buena salud dental"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            className={errors.titulo ? "border-destructive" : ""}
                        />
                        {errors.titulo && <p className="text-xs text-destructive">{errors.titulo}</p>}
                    </div>

                    {/* Resumen */}
                    <div className="space-y-2">
                        <Label htmlFor="resumen">Resumen (opcional)</Label>
                        <Textarea
                            id="resumen"
                            placeholder="Un breve resumen del artículo que aparecerá en las tarjetas de preview..."
                            value={resumen}
                            onChange={(e) => setResumen(e.target.value)}
                            rows={2}
                        />
                    </div>

                    {/* Contenido */}
                    <div className="space-y-2">
                        <Label htmlFor="contenido">Contenido *</Label>
                        <Textarea
                            id="contenido"
                            placeholder="Escribe el contenido completo de tu artículo aquí..."
                            value={contenido}
                            onChange={(e) => setContenido(e.target.value)}
                            rows={10}
                            className={errors.contenido ? "border-destructive" : ""}
                        />
                        {errors.contenido && <p className="text-xs text-destructive">{errors.contenido}</p>}
                    </div>

                    {/* Imagen Selection */}
                    <div className="space-y-3 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                        <Label className="font-semibold">Imagen Destacada</Label>

                        {/* Option 1: File Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="imagen_file" className="text-xs text-muted-foreground">Subir desde PC:</Label>
                            <Input
                                id="imagen_file"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'image')}
                            />
                        </div>

                        <div className="text-xs text-center text-muted-foreground">- O -</div>

                        {/* Option 2: URL */}
                        <div className="space-y-2">
                            <Label htmlFor="imagen_url" className="text-xs text-muted-foreground">Usar URL externa:</Label>
                            <Input
                                id="imagen_url"
                                type="url"
                                placeholder="https://ejemplo.com/imagen.jpg"
                                value={imagenUrl}
                                onChange={(e) => {
                                    setImagenUrl(e.target.value)
                                    setImagenFile(null) // Clear file if URL is typed
                                }}
                                disabled={!!imagenFile}
                            />
                        </div>

                        {/* Preview */}
                        {(imagenFile || imagenUrl) && (
                            <div className="mt-2 rounded-lg overflow-hidden border border-border/50 h-32 w-full flex items-center justify-center bg-background">
                                {imagenFile ? (
                                    <span className="text-sm text-green-600 flex items-center gap-2">
                                        <Upload size={16} /> Imagen seleccionada: {imagenFile.name}
                                    </span>
                                ) : (
                                    <img
                                        src={imagenUrl}
                                        alt="Preview"
                                        className="h-full object-contain"
                                        onError={(e) => (e.target as HTMLImageElement).style.display = "none"}
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* PDF Upload */}
                    <div className="space-y-3 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                        <Label className="font-semibold">Documento PDF (Opcional)</Label>
                        <div className="space-y-2">
                            <Input
                                id="pdf_file"
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => handleFileChange(e, 'pdf')}
                            />
                            <p className="text-xs text-muted-foreground">
                                Sube un archivo PDF complementario (ej: guías, estudios, brochures).
                            </p>
                            {pdfFile && (
                                <p className="text-xs text-green-600 font-medium">
                                    Archivo seleccionado: {pdfFile.name}
                                </p>
                            )}
                        </div>
                    </div>


                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={submitting}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? "Actualizar" : "Publicar artículo"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
