"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { articulosApi, type Articulo } from "@/lib/api"
import { formatUrl } from "@/lib/utils"
import { BookOpen, Calendar, User, ArrowLeft, Clock, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function ArticuloDetallePage() {
    const params = useParams()
    const id = params?.id as string

    const [articulo, setArticulo] = useState<Articulo | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        const loadArticulo = async () => {
            try {
                // Fetch all published articles and find by ID
                // (Backend doesn't have a GET /articulos/:id public endpoint)
                const data = await articulosApi.listarPublicados()
                const list = Array.isArray(data) ? data : []
                const found = list.find((a: Articulo) => a.id.toString() === id)
                if (found) {
                    setArticulo(found)
                } else {
                    setNotFound(true)
                }
            } catch (error) {
                console.error("Error loading article:", error)
                setNotFound(true)
            } finally {
                setLoading(false)
            }
        }

        if (id) loadArticulo()
    }, [id])

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "d 'de' MMMM 'de' yyyy", { locale: es })
        } catch {
            return dateStr
        }
    }

    const estimateReadTime = (content: string) => {
        const words = content?.split(/\s+/).length || 0
        const minutes = Math.max(1, Math.ceil(words / 200))
        return `${minutes} min`
    }

    const handleShare = async () => {
        if (navigator.share && articulo) {
            try {
                await navigator.share({
                    title: articulo.titulo,
                    text: articulo.resumen || articulo.titulo,
                    url: window.location.href,
                })
            } catch {
                // User cancelled or share not supported
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard?.writeText(window.location.href)
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-background">
                <Header />
                <div className="flex items-center justify-center py-32">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
                </div>
                <Footer />
            </main>
        )
    }

    if (notFound || !articulo) {
        return (
            <main className="min-h-screen bg-background">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-32 text-center">
                    <BookOpen className="mx-auto text-muted-foreground mb-4" size={48} />
                    <h1 className="text-2xl font-bold text-foreground mb-2">Artículo no encontrado</h1>
                    <p className="text-muted-foreground mb-6">
                        El artículo que buscas no existe o ha sido archivado.
                    </p>
                    <Link href="/articulos">
                        <Button>
                            <ArrowLeft size={16} className="mr-2" />
                            Volver a artículos
                        </Button>
                    </Link>
                </div>
                <Footer />
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Hero Image */}
            {articulo.imagen_url && (
                <div className="relative h-64 md:h-96 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                    <img
                        src={formatUrl(articulo.imagen_url) || ""}
                        alt={articulo.titulo}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                </div>
            )}

            {/* Article Content */}
            <article className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
                {/* Back Button */}
                <Link
                    href="/articulos"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    Volver a artículos
                </Link>

                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {articulo.titulo}
                </h1>

                {/* Meta Bar */}
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Author */}
                    <div className="flex items-center gap-3">
                        {articulo.autor?.foto_url ? (
                            <img
                                src={formatUrl(articulo.autor.foto_url) || ""}
                                alt={articulo.autor.nombre}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User size={18} className="text-primary" />
                            </div>
                        )}
                        <div>
                            <p className="font-semibold text-foreground">{articulo.autor?.nombre || "Autor"}</p>
                            <p className="text-xs">Profesional verificado</p>
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-6 bg-border" />

                    <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {formatDate(articulo.fecha_publicacion)}
                    </span>

                    <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {estimateReadTime(articulo.contenido)} lectura
                    </span>

                    <button
                        onClick={handleShare}
                        className="ml-auto flex items-center gap-1.5 hover:text-primary transition-colors"
                    >
                        <Share2 size={14} />
                        Compartir
                    </button>
                </div>

                {/* Summary */}
                {articulo.resumen && (
                    <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <p className="text-foreground/80 italic leading-relaxed">{articulo.resumen}</p>
                    </div>
                )}

                {/* Article Body */}
                <div
                    className="prose prose-lg max-w-none text-foreground/90 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700
            prose-headings:text-foreground prose-headings:font-bold
            prose-p:mb-4 prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground
            prose-img:rounded-xl prose-img:shadow-lg"
                    dangerouslySetInnerHTML={{ __html: articulo.contenido }}
                />

                {/* If content is plain text (not HTML), render as paragraphs */}
                {!articulo.contenido.includes("<") && (
                    <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                        {articulo.contenido}
                    </div>
                )}

                {/* Footer CTA */}
                <div className="mt-12 pt-8 border-t border-border/50 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <p className="text-muted-foreground mb-4">¿Te gustó este artículo?</p>
                    <Link href="/articulos">
                        <Button variant="outline" className="gap-2">
                            <BookOpen size={16} />
                            Ver más artículos
                        </Button>
                    </Link>
                </div>
            </article>

            <Footer />
        </main>
    )
}
