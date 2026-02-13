"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { articulosApi, type Articulo } from "@/lib/api"
import { BookOpen, Calendar, User, ArrowRight, Clock, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function ArticulosPage() {
    const [articulos, setArticulos] = useState<Articulo[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const loadArticulos = async () => {
            try {
                const data = await articulosApi.listarPublicados()
                setArticulos(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error("Error loading articles:", error)
            } finally {
                setLoading(false)
            }
        }
        loadArticulos()
    }, [])

    const filteredArticulos = articulos.filter((a) => {
        if (!searchTerm) return true
        const term = searchTerm.toLowerCase()
        return (
            a.titulo.toLowerCase().includes(term) ||
            (a.resumen || "").toLowerCase().includes(term) ||
            (a.autor?.nombre || "").toLowerCase().includes(term)
        )
    })

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

    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                            <BookOpen className="text-primary" size={20} />
                            <span className="text-sm font-semibold text-primary">Blog Profesional</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
                            Artículos y Consejos
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                            Conocimiento compartido por profesionales verificados. Aprende de los mejores expertos en diversas áreas.
                        </p>

                        {/* Search */}
                        <div className="max-w-md mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                                type="text"
                                placeholder="Buscar artículos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-11 pr-4 py-3 bg-card border border-border/50 rounded-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
                    </div>
                ) : filteredArticulos.length === 0 ? (
                    <div className="text-center py-20">
                        <BookOpen className="mx-auto text-muted-foreground mb-4" size={48} />
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                            {searchTerm ? "Sin resultados" : "Aún no hay artículos"}
                        </h3>
                        <p className="text-muted-foreground">
                            {searchTerm
                                ? "Intenta con otros términos de búsqueda."
                                : "Los profesionales verificados pronto compartirán contenido valioso."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 text-sm text-muted-foreground">
                            {filteredArticulos.length} artículo{filteredArticulos.length !== 1 ? "s" : ""} encontrado{filteredArticulos.length !== 1 ? "s" : ""}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredArticulos.map((articulo, index) => (
                                <Link
                                    key={articulo.id}
                                    href={`/articulos/${articulo.id}`}
                                    className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-6"
                                    style={{ animationDelay: `${index * 80}ms` }}
                                >
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                                        {articulo.imagen_url ? (
                                            <img
                                                src={articulo.imagen_url}
                                                alt={articulo.titulo}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <BookOpen className="text-primary/30" size={64} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent opacity-60" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        {/* Meta */}
                                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {formatDate(articulo.fecha_publicacion)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {estimateReadTime(articulo.contenido)} lectura
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                            {articulo.titulo}
                                        </h3>

                                        {articulo.resumen && (
                                            <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                                                {articulo.resumen}
                                            </p>
                                        )}

                                        {/* Author */}
                                        <div className="pt-4 border-t border-border/50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {articulo.autor?.foto_url ? (
                                                        <img
                                                            src={articulo.autor.foto_url}
                                                            alt={articulo.autor.nombre}
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <User size={14} className="text-primary" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-semibold text-foreground">{articulo.autor?.nombre || "Autor"}</p>
                                                        <p className="text-xs text-muted-foreground">Profesional verificado</p>
                                                    </div>
                                                </div>
                                                <div className="p-2 bg-primary/10 text-primary rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                                    <ArrowRight size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </section>

            <Footer />
        </main>
    )
}
