"use client"

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageLoader from "@/components/page-loader"
import {
  ProfessionalsFilters,
  EMPTY_FILTERS,
  type FilterState,
} from "@/components/professionals-filters"
import { formatUrl } from "@/lib/utils"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
const PAGE_SIZE = 12

type PageMeta = { totalItems: number; totalPages: number; currentPage: number }

interface ProfessionalCard {
  id: number
  slug?: string
  name: string
  specialty: string
  location: string
  image: string
  price: string
  unit: string
  experience: string
  verified: boolean
  description?: string
}

function urlToFilters(sp: URLSearchParams): FilterState {
  return {
    keyword: sp.get("keyword") ?? "",
    profession: sp.get("profesion_id") ?? "",
    specialty: sp.get("especialidad_id") ?? "",
    province: sp.get("provincia_id") ?? "",
    city: sp.get("ciudad_id") ?? "",
    verifiedOnly: sp.get("verificados") === "true",
    sortBy: sp.get("orden") ?? "featured",
  }
}

function filtersToParams(filters: FilterState): URLSearchParams {
  const sp = new URLSearchParams()
  if (filters.keyword) sp.set("keyword", filters.keyword)
  if (filters.profession) sp.set("profesion_id", filters.profession)
  if (filters.specialty) sp.set("especialidad_id", filters.specialty)
  if (filters.province) sp.set("provincia_id", filters.province)
  if (filters.city) sp.set("ciudad_id", filters.city)
  if (filters.verifiedOnly) sp.set("verificados", "true")
  if (filters.sortBy && filters.sortBy !== "featured") sp.set("orden", filters.sortBy)
  return sp
}

function mapProfessional(p: any): ProfessionalCard {
  const tarifa = p.tarifa_hora ?? p.tarifa
  return {
    id: p.id,
    slug: p.slug,
    name: p.usuario?.nombre || "Usuario",
    specialty: p.especialidad?.nombre || p.profesion?.nombre || "Profesional",
    location: p.ciudad
      ? `${p.ciudad.nombre}${p.ciudad.provincia?.nombre ? `, ${p.ciudad.provincia.nombre}` : ""}`
      : "Ecuador",
    image: formatUrl(p.usuario?.foto_url) || "/logo-black.png",
    price: tarifa ? `$${tarifa}` : "A convenir",
    unit: "hora",
    experience: "Experiencia verificada",
    verified: Boolean(p.verificado),
    description: p.descripcion,
  }
}

function sortClientSide(list: ProfessionalCard[], sortBy: string): ProfessionalCard[] {
  if (sortBy !== "price-low" && sortBy !== "price-high") return list
  const parsePrice = (price: string) => {
    const n = parseFloat(price.replace(/[^\d.]/g, ""))
    return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY
  }
  return [...list].sort((a, b) => {
    const diff = parsePrice(a.price) - parsePrice(b.price)
    return sortBy === "price-low" ? diff : -diff
  })
}

function ProfessionalsPageInner() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const filters = useMemo<FilterState>(() => urlToFilters(searchParams), [searchParams])
  const page = useMemo(() => {
    const raw = searchParams.get("page")
    const parsed = raw ? parseInt(raw, 10) : 1
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
  }, [searchParams])

  const [professionals, setProfessionals] = useState<ProfessionalCard[]>([])
  const [meta, setMeta] = useState<PageMeta>({ totalItems: 0, totalPages: 1, currentPage: 1 })
  const [loading, setLoading] = useState(true)

  const writeUrl = useCallback(
    (next: { filters?: FilterState; page?: number }) => {
      const targetFilters = next.filters ?? filters
      const targetPage = next.page ?? page
      const sp = filtersToParams(targetFilters)
      if (targetPage > 1) sp.set("page", String(targetPage))
      const qs = sp.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [filters, page, pathname, router],
  )

  const handleFiltersChange = useCallback(
    (newFilters: FilterState) => {
      // Cualquier cambio de filtros vuelve a página 1.
      writeUrl({ filters: newFilters, page: 1 })
    },
    [writeUrl],
  )

  const handlePageChange = useCallback(
    (newPage: number) => {
      writeUrl({ page: newPage })
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    [writeUrl],
  )

  // Fetch con debounce y cancelación. La URL es la única fuente de verdad.
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    const run = async () => {
      setLoading(true)
      try {
        const params = filtersToParams(filters)
        params.set("limit", String(PAGE_SIZE))
        params.set("page", String(page))

        const res = await fetch(`${API_BASE}/profesionales/verificados?${params.toString()}`, {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (cancelled) return

        const raw = Array.isArray(data) ? data : data?.data ?? []
        const mapped = sortClientSide(raw.map(mapProfessional), filters.sortBy)

        setProfessionals(mapped)
        setMeta(
          data?.meta ?? {
            totalItems: mapped.length,
            totalPages: 1,
            currentPage: 1,
          },
        )
      } catch (error: any) {
        if (error?.name !== "AbortError" && !cancelled) {
          console.error("Error fetching professionals:", error)
          setProfessionals([])
          setMeta({ totalItems: 0, totalPages: 1, currentPage: 1 })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    // Debounce sólo para el typing del keyword; el resto podría ser inmediato,
    // pero un mismo timeout es suficiente y mantiene la UX consistente.
    debounceTimer.current = setTimeout(run, 350)

    return () => {
      cancelled = true
      controller.abort()
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [filters, page])

  const hasActiveFilters =
    filters.keyword ||
    filters.profession ||
    filters.specialty ||
    filters.province ||
    filters.city ||
    filters.verifiedOnly

  return (
    <div className="w-full bg-background">
      <Header />

      <section className="relative pt-28 pb-6 px-4 md:px-6 bg-white">
        <div className="absolute inset-0 bg-gray-50 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-7xl font-bold text-foreground mb-4 tracking-tight">
              Todos los
              <br />
              <span className="text-primary">Profesionales</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explora nuestra red completa de profesionales verificados. Filtra y encuentra el experto que necesitas.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <ProfessionalsFilters filters={filters} onFiltersChange={handleFiltersChange} />
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-4">
        <p className="text-sm text-muted-foreground">
          {meta.totalItems} profesional{meta.totalItems !== 1 ? "es" : ""} encontrado
          {meta.totalItems !== 1 ? "s" : ""}
          {loading && <span className="ml-2 animate-pulse text-blue-500">Cargando...</span>}
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-16">
        {professionals.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {professionals.map((professional, index) => (
                <div
                  key={professional.id}
                  className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-80 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                    <img
                      src={professional.image}
                      alt={professional.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-60" />
                    {professional.verified && (
                      <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg z-20">
                        <span className="text-xs font-bold text-primary-foreground">✓ Verificado</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-1">{professional.name}</h3>
                    <p className="text-sm text-primary font-semibold mb-4">{professional.specialty}</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Experiencia</span>
                        <span className="font-semibold text-foreground">{professional.experience}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin size={14} />
                        {professional.location}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-blue-900">{professional.price}</span>
                        {professional.price !== "A convenir" && (
                          <span className="text-xs text-gray-500 font-medium">/ {professional.unit}</span>
                        )}
                      </div>
                      <Link
                        href={professional.slug ? `/perfil/${professional.slug}` : "/profesionales"}
                        className="bg-blue-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2 group"
                      >
                        Ver Perfil <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {meta.totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-3 rounded-full border border-gray-200 hover:bg-primary hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-black transition"
                    title="Página anterior"
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
                        if (page > 3) items.push("...")
                        const start = Math.max(2, page - 1)
                        const end = Math.min(totalPages - 1, page + 1)
                        for (let i = start; i <= end; i++) items.push(i)
                        if (page < totalPages - 2) items.push("...")
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
                              page === p
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                            title={`Ir a página ${p}`}
                          >
                            {p}
                          </button>
                        ),
                      )
                    })()}
                  </div>

                  <button
                    onClick={() => handlePageChange(Math.min(meta.totalPages, page + 1))}
                    disabled={page === meta.totalPages}
                    className="p-3 rounded-full border border-gray-200 hover:bg-primary hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-black transition"
                    title="Página siguiente"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
                <span className="text-xs text-gray-400 mt-2">
                  Página {page} de {meta.totalPages}
                </span>
              </div>
            )}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                {hasActiveFilters
                  ? "Aún no hay profesionales registrados con estos filtros."
                  : "Aún no hay profesionales verificados disponibles."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={() => handleFiltersChange(EMPTY_FILTERS)}
                  className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          )
        )}
      </section>

      <section className="max-w-4xl mx-auto px-4 md:px-6 pb-16">
        <div className="bg-background rounded-3xl p-8 md:p-12 border border-primary/20 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">¿Eres un profesional destacado?</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Únete a nuestra red de expertos verificados y conecta con clientes que buscan excelencia
          </p>
          <Link
            href="/preinscripcion"
            className="group px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/20 inline-flex items-center gap-3"
          >
            Crear perfil profesional
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function ProfessionalsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProfessionalsPageInner />
    </Suspense>
  )
}
