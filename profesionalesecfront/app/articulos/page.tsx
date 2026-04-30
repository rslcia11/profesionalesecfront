"use client"

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageLoader from "@/components/page-loader"
import Link from "next/link"
import { articulosApi, type Articulo, type PageMeta } from "@/lib/api"
import { formatUrl } from "@/lib/utils"
import {
  BookOpen,
  Calendar,
  User,
  ArrowRight,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const PAGE_SIZE = 12

function formatDate(dateStr: string) {
  try {
    return format(new Date(dateStr), "d 'de' MMMM 'de' yyyy", { locale: es })
  } catch {
    return dateStr
  }
}

function estimateReadTime(content: string) {
  const words = content?.split(/\s+/).length || 0
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min`
}

function ArticulosPageInner() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const urlKeyword = searchParams.get("q") ?? ""
  const urlPage = useMemo(() => {
    const raw = searchParams.get("page")
    const parsed = raw ? parseInt(raw, 10) : 1
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
  }, [searchParams])

  // Estado local para el input — el debounce sincroniza al URL.
  const [searchInput, setSearchInput] = useState(urlKeyword)
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [meta, setMeta] = useState<PageMeta>({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: PAGE_SIZE,
  })
  const [loading, setLoading] = useState(true)

  // Si el URL cambia desde fuera (back/forward), reflejarlo en el input.
  useEffect(() => {
    setSearchInput(urlKeyword)
  }, [urlKeyword])

  // Escribe filtros en URL (replace para no llenar el history).
  const writeUrl = useCallback(
    (next: { keyword?: string; page?: number }) => {
      const params = new URLSearchParams()
      const targetKeyword = next.keyword ?? urlKeyword
      const targetPage = next.page ?? urlPage
      if (targetKeyword) params.set("q", targetKeyword)
      if (targetPage > 1) params.set("page", String(targetPage))
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, urlKeyword, urlPage],
  )

  // Debounce del input → URL. Cualquier cambio de keyword vuelve a página 1.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (searchInput === urlKeyword) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      writeUrl({ keyword: searchInput, page: 1 })
    }, 350)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchInput, urlKeyword, writeUrl])

  // Fetch desde el server con cancelación. La URL es la fuente de verdad.
  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    const run = async () => {
      setLoading(true)
      try {
        const result = await articulosApi.listarPublicados({
          page: urlPage,
          limit: PAGE_SIZE,
          keyword: urlKeyword || undefined,
        })
        if (cancelled) return
        setArticulos(result.data)
        setMeta(result.meta)
      } catch (error: any) {
        if (!cancelled && error?.name !== "AbortError") {
          console.error("Error loading articles:", error)
          setArticulos([])
          setMeta({ totalItems: 0, totalPages: 1, currentPage: 1, itemsPerPage: PAGE_SIZE })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [urlKeyword, urlPage])

  const handlePageChange = useCallback(
    (newPage: number) => {
      writeUrl({ page: newPage })
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    [writeUrl],
  )

  const showEmptyState = !loading && articulos.length === 0
  const hasResults = !loading && articulos.length > 0

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <BookOpen className="text-primary" size={20} />
              <span className="text-sm font-semibold text-primary">Blog Profesional</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">Artículos y Consejos</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Conocimiento compartido por profesionales verificados. Aprende de los mejores expertos en diversas áreas.
            </p>

            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="text"
                placeholder="Buscar artículos..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-11 pr-4 py-3 bg-card border border-border/50 rounded-full"
                aria-label="Buscar artículos"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Listado */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {loading && articulos.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
          </div>
        ) : showEmptyState ? (
          <div className="text-center py-20">
            <BookOpen className="mx-auto text-muted-foreground mb-4" size={48} />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {urlKeyword ? "Sin resultados" : "Aún no hay artículos"}
            </h3>
            <p className="text-muted-foreground">
              {urlKeyword
                ? "Intenta con otros términos de búsqueda."
                : "Los profesionales verificados pronto compartirán contenido valioso."}
            </p>
          </div>
        ) : (
          hasResults && (
            <>
              <div className="mb-6 text-sm text-muted-foreground flex items-center justify-between">
                <span>
                  {meta.totalItems} artículo{meta.totalItems !== 1 ? "s" : ""} encontrado
                  {meta.totalItems !== 1 ? "s" : ""}
                </span>
                {loading && <span className="animate-pulse text-blue-500">Actualizando...</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articulos.map((articulo, index) => (
                  <Link
                    key={articulo.id}
                    href={`/articulos/${articulo.id}`}
                    className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-6"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                      {articulo.imagen_url ? (
                        <img
                          src={formatUrl(articulo.imagen_url) || ""}
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

                    <div className="p-6">
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

                      <div className="pt-4 border-t border-border/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {articulo.autor?.foto_url ? (
                              <img
                                src={formatUrl(articulo.autor.foto_url) || ""}
                                alt={articulo.autor.nombre}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User size={14} className="text-primary" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {articulo.autor?.nombre || "Autor"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {articulo.autor?.perfiles_profesionales?.[0]?.profesion?.nombre ||
                                  "Profesional verificado"}
                              </p>
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

              {meta.totalPages > 1 && (
                <div className="mt-12 flex flex-col items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(Math.max(1, urlPage - 1))}
                      disabled={urlPage === 1}
                      className="p-3 rounded-full border border-gray-200 hover:bg-primary hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-black transition"
                      title="Página anterior"
                      aria-label="Página anterior"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <div className="flex items-center gap-1">
                      {(() => {
                        const totalPages = meta.totalPages
                        const items: Array<number | "..."> = []
                        if (totalPages <= 7) {
                          for (let i = 1; i <= totalPages; i++) items.push(i)
                        } else {
                          items.push(1)
                          if (urlPage > 3) items.push("...")
                          const start = Math.max(2, urlPage - 1)
                          const end = Math.min(totalPages - 1, urlPage + 1)
                          for (let i = start; i <= end; i++) items.push(i)
                          if (urlPage < totalPages - 2) items.push("...")
                          items.push(totalPages)
                        }
                        return items.map((p, idx) =>
                          p === "..." ? (
                            <span key={`dots-${idx}`} className="px-2 text-gray-400">
                              ...
                            </span>
                          ) : (
                            <button
                              key={`page-${p}`}
                              onClick={() => handlePageChange(p)}
                              className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition ${
                                urlPage === p
                                  ? "bg-primary text-primary-foreground shadow-md"
                                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                              }`}
                              title={`Ir a página ${p}`}
                              aria-label={`Página ${p}`}
                              aria-current={urlPage === p ? "page" : undefined}
                            >
                              {p}
                            </button>
                          ),
                        )
                      })()}
                    </div>

                    <button
                      onClick={() => handlePageChange(Math.min(meta.totalPages, urlPage + 1))}
                      disabled={urlPage === meta.totalPages}
                      className="p-3 rounded-full border border-gray-200 hover:bg-primary hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-black transition"
                      title="Página siguiente"
                      aria-label="Página siguiente"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  <span className="text-xs text-gray-400 mt-2">
                    Página {urlPage} de {meta.totalPages}
                  </span>
                </div>
              )}
            </>
          )
        )}
      </section>

      <Footer />
    </main>
  )
}

export default function ArticulosPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ArticulosPageInner />
    </Suspense>
  )
}
