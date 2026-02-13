"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import type { Articulo } from "@/lib/api"

interface ArticleFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    article?: Articulo | null
    onSubmit: (data: { titulo: string; contenido: string; resumen?: string; imagen_url?: string }) => Promise<void>
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
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState<{ titulo?: string; contenido?: string }>({})

    const isEditing = !!article

    useEffect(() => {
        if (article) {
            setTitulo(article.titulo || "")
            setResumen(article.resumen || "")
            setContenido(article.contenido || "")
            setImagenUrl(article.imagen_url || "")
        } else {
            setTitulo("")
            setResumen("")
            setContenido("")
            setImagenUrl("")
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
            await onSubmit({
                titulo: titulo.trim(),
                contenido: contenido.trim(),
                resumen: resumen.trim() || undefined,
                imagen_url: imagenUrl.trim() || undefined,
            })
            onOpenChange(false)
        } catch (error) {
            console.error("Error submitting article:", error)
        } finally {
            setSubmitting(false)
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
                        <p className="text-xs text-muted-foreground">
                            Puedes usar HTML básico para dar formato (negrita, listas, enlaces).
                        </p>
                    </div>

                    {/* Imagen URL */}
                    <div className="space-y-2">
                        <Label htmlFor="imagen_url">URL de Imagen (opcional)</Label>
                        <Input
                            id="imagen_url"
                            type="url"
                            placeholder="https://ejemplo.com/imagen.jpg"
                            value={imagenUrl}
                            onChange={(e) => setImagenUrl(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Imagen destacada del artículo. Pega una URL de imagen pública.
                        </p>
                    </div>

                    {/* Preview de imagen */}
                    {imagenUrl && (
                        <div className="rounded-lg overflow-hidden border border-border/50 h-32">
                            <img
                                src={imagenUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none"
                                }}
                            />
                        </div>
                    )}

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
