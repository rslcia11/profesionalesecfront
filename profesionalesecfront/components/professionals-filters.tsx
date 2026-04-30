"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { catalogosApi } from "@/lib/api"

interface CatalogItem {
  id: number
  nombre: string
  slug?: string
  profesion_id?: number
  provincia_id?: number
  provincia?: { id: number; nombre: string }
}

export interface FilterState {
  keyword: string
  profession: string
  specialty: string
  province: string
  city: string
  verifiedOnly: boolean
  sortBy: string
}

export const EMPTY_FILTERS: FilterState = {
  keyword: "",
  profession: "",
  specialty: "",
  province: "",
  city: "",
  verifiedOnly: false,
  sortBy: "featured",
}

interface FilterProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function ProfessionalsFilters({ filters, onFiltersChange }: FilterProps) {
  const [showFilters, setShowFilters] = useState(false)

  // Catálogos: cargados una sola vez al montar.
  const [professions, setProfessions] = useState<CatalogItem[]>([])
  const [allSpecialties, setAllSpecialties] = useState<CatalogItem[]>([])
  const [provinces, setProvinces] = useState<CatalogItem[]>([])
  const [allCities, setAllCities] = useState<CatalogItem[]>([])
  const [catalogsLoaded, setCatalogsLoaded] = useState(false)

  useEffect(() => {
    const loadCatalogs = async () => {
      const [profsData, specsData, provsData, citiesData] = await Promise.allSettled([
        catalogosApi.obtenerProfesiones(),
        catalogosApi.obtenerEspecialidades(),
        catalogosApi.obtenerProvincias(),
        catalogosApi.obtenerCiudades(),
      ])

      const sortByName = (a: CatalogItem, b: CatalogItem) => a.nombre.localeCompare(b.nombre)

      if (profsData.status === "fulfilled" && Array.isArray(profsData.value)) {
        setProfessions([...profsData.value].sort(sortByName))
      }
      if (specsData.status === "fulfilled" && Array.isArray(specsData.value)) {
        setAllSpecialties([...specsData.value].sort(sortByName))
      }
      if (provsData.status === "fulfilled" && Array.isArray(provsData.value)) {
        setProvinces([...provsData.value].sort(sortByName))
      }
      if (citiesData.status === "fulfilled" && Array.isArray(citiesData.value)) {
        setAllCities([...citiesData.value].sort(sortByName))
      }

      setCatalogsLoaded(true)
    }

    loadCatalogs()
  }, [])

  const update = (patch: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...patch })
  }

  // Cascadas dependientes
  const availableSpecialties = filters.profession
    ? allSpecialties.filter((s) => s.profesion_id?.toString() === filters.profession)
    : []

  const availableCities = filters.province
    ? allCities.filter((c) => c.provincia_id?.toString() === filters.province)
    : []

  // Si la profesión actual ya no existe en el catálogo (URL inválida), no lo bloqueamos:
  // mostramos el valor pero el dropdown lo refleja como "no seleccionable".

  return (
    <div className="w-full space-y-6">
      <div className="md:hidden">
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="relative w-6 h-5 flex flex-col justify-between">
            <span className="block h-0.5 w-full bg-primary-foreground rounded-full animate-pulse" style={{ animationDelay: "0s" }} />
            <span className="block h-0.5 w-full bg-primary-foreground rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
            <span className="block h-0.5 w-full bg-primary-foreground rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
          <span>Filtrar</span>
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div
        className={`space-y-6 transition-all duration-300 ease-in-out ${
          showFilters ? "block animate-in slide-in-from-top-4 fade-in" : "hidden"
        } md:block`}
      >
        {/* Search Bar */}
        <div className="w-full flex gap-3">
          <Input
            type="text"
            placeholder="Buscar por nombre, profesión o especialidad..."
            value={filters.keyword}
            onChange={(e) => update({ keyword: e.target.value })}
            className="w-full px-6 py-4 bg-card border border-border/50 rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Profesión */}
          <Select
            value={filters.profession || "all"}
            onValueChange={(value) =>
              update({
                profession: value === "all" ? "" : value,
                specialty: "", // reset cascada
              })
            }
          >
            <SelectTrigger className="w-full px-4 py-3 bg-card border border-border/50 rounded-lg text-sm">
              <SelectValue placeholder={catalogsLoaded ? "Profesión" : "Cargando..."} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las profesiones</SelectItem>
              {professions.map((prof) => (
                <SelectItem key={prof.id} value={prof.id.toString()}>
                  {prof.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Especialidad (depende de profesión) */}
          <Select
            value={filters.specialty || "all"}
            onValueChange={(value) => update({ specialty: value === "all" ? "" : value })}
            disabled={!filters.profession}
          >
            <SelectTrigger className="w-full px-4 py-3 bg-card border border-border/50 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <SelectValue placeholder="Especialidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las especialidades</SelectItem>
              {availableSpecialties.map((spec) => (
                <SelectItem key={spec.id} value={spec.id.toString()}>
                  {spec.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Provincia */}
          <Select
            value={filters.province || "all"}
            onValueChange={(value) =>
              update({
                province: value === "all" ? "" : value,
                city: "", // reset cascada
              })
            }
          >
            <SelectTrigger className="w-full px-4 py-3 bg-card border border-border/50 rounded-lg text-sm">
              <SelectValue placeholder={catalogsLoaded ? "Provincia" : "Cargando..."} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las provincias</SelectItem>
              {provinces.map((prov) => (
                <SelectItem key={prov.id} value={prov.id.toString()}>
                  {prov.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Ciudad (depende de provincia) */}
          <Select
            value={filters.city || "all"}
            onValueChange={(value) => update({ city: value === "all" ? "" : value })}
            disabled={!filters.province}
          >
            <SelectTrigger className="w-full px-4 py-3 bg-card border border-border/50 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <SelectValue placeholder="Ciudad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las ciudades</SelectItem>
              {availableCities.map((city) => (
                <SelectItem key={city.id} value={city.id.toString()}>
                  {city.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Segunda fila */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center flex-wrap">
          <div className="flex items-center gap-3">
            <Checkbox
              id="verified"
              checked={filters.verifiedOnly}
              onCheckedChange={(checked) => update({ verifiedOnly: Boolean(checked) })}
            />
            <Label htmlFor="verified" className="text-sm text-foreground cursor-pointer select-none">
              Solo verificados
            </Label>
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <Select value={filters.sortBy} onValueChange={(value) => update({ sortBy: value })}>
              <SelectTrigger className="w-full px-4 py-2 bg-card border border-border/50 rounded-lg text-sm">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Destacados</SelectItem>
                <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => onFiltersChange(EMPTY_FILTERS)}
            variant="outline"
            className="group relative px-6 py-2 text-sm font-medium bg-white hover:bg-primary hover:text-white text-primary border-2 border-primary transition-all duration-300 whitespace-nowrap overflow-hidden hover:scale-105 hover:shadow-lg"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:rotate-180 transition-transform duration-500"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
              Limpiar filtros
            </span>
            <span className="absolute inset-0 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </Button>
        </div>
      </div>
    </div>
  )
}
