"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"

// Mock data - reemplaza con datos de tu base de datos
const PROFESSIONS = [
  { id: 1, name: "Salud" },
  { id: 2, name: "Legal" },
  { id: 3, name: "Tecnología" },
  { id: 4, name: "Diseño" },
  { id: 5, name: "Finanzas" },
  { id: 6, name: "Coaching" },
  { id: 7, name: "Ingeniería" },
]

const SPECIALTIES = {
  1: [
    { id: 1, name: "Médico Cirujano" },
    { id: 2, name: "Psicólogo Clínico" },
    { id: 3, name: "Dentista Estética" },
  ],
  2: [
    { id: 4, name: "Abogado Especialista" },
    { id: 5, name: "Notario Público" },
    { id: 6, name: "Procurador" },
  ],
  3: [
    { id: 7, name: "Ingeniero de Software" },
    { id: 8, name: "Desarrollador Web" },
    { id: 9, name: "Especialista en Ciberseguridad" },
  ],
  4: [
    { id: 10, name: "Arquitecto Diseñador" },
    { id: 11, name: "Diseñador Gráfico" },
    { id: 12, name: "UX/UI Designer" },
  ],
  5: [
    { id: 13, name: "Asesor Financiero" },
    { id: 14, name: "Contador Público" },
    { id: 15, name: "Asesor Fiscal" },
  ],
  6: [
    { id: 16, name: "Coach Empresarial" },
    { id: 17, name: "Coach de Vida" },
    { id: 18, name: "Coach Ejecutivo" },
  ],
  7: [
    { id: 19, name: "Especialista en Energía" },
    { id: 20, name: "Ingeniero Civil" },
    { id: 21, name: "Ingeniero Industrial" },
  ],
}

const PROVINCES = [
  { id: 1, name: "Azuay" },
  { id: 2, name: "Bolívar" },
  { id: 3, name: "Cañar" },
  { id: 4, name: "Carchi" },
  { id: 5, name: "Chimborazo" },
  { id: 6, name: "Cotopaxi" },
  { id: 7, name: "El Oro" },
  { id: 8, name: "Esmeraldas" },
  { id: 9, name: "Galápagos" },
  { id: 10, name: "Guayas" },
  { id: 11, name: "Imbabura" },
  { id: 12, name: "Loja" },
  { id: 13, name: "Los Ríos" },
  { id: 14, name: "Manabí" },
  { id: 15, name: "Morona Santiago" },
  { id: 16, name: "Napo" },
  { id: 17, name: "Orellana" },
  { id: 18, name: "Pastaza" },
  { id: 19, name: "Pichincha" },
  { id: 20, name: "Santa Elena" },
  { id: 21, name: "Santo Domingo de los Tsáchilas" },
  { id: 22, name: "Sucumbíos" },
  { id: 23, name: "Tungurahua" },
  { id: 24, name: "Zamora Chinchipe" },
]

const CITIES = {
  10: [
    { id: 1, name: "Guayaquil" },
    { id: 2, name: "Durán" },
    { id: 3, name: "Samborondón" },
  ],
  19: [
    { id: 4, name: "Quito" },
    { id: 5, name: "Cayambe" },
    { id: 6, name: "Machachi" },
  ],
  1: [
    { id: 7, name: "Cuenca" },
    { id: 8, name: "Gualaceo" },
    { id: 9, name: "Paute" },
  ],
}

interface FilterProps {
  onFiltersChange: (filters: FilterState) => void
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

export function ProfessionalsFilters({ onFiltersChange }: FilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    keyword: "",
    profession: "",
    specialty: "",
    province: "",
    city: "",
    verifiedOnly: false,
    sortBy: "featured",
  })

  // Cuando los filtros cambian, notifica al componente padre
  useEffect(() => {
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, keyword: e.target.value })
  }

  const handleProfessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Resetear especialidad cuando cambia profesión
    setFilters({
      ...filters,
      profession: e.target.value,
      specialty: "",
    })
  }

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, specialty: e.target.value })
  }

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Resetear ciudad cuando cambia provincia
    setFilters({
      ...filters,
      province: e.target.value,
      city: "",
    })
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, city: e.target.value })
  }

  const handleVerifiedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, verifiedOnly: e.target.checked })
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, sortBy: e.target.value })
  }

  const handleReset = () => {
    setFilters({
      keyword: "",
      profession: "",
      specialty: "",
      province: "",
      city: "",
      verifiedOnly: false,
      sortBy: "featured",
    })
  }

  // Obtener especialidades disponibles según profesión seleccionada
  const availableSpecialties = filters.profession
    ? SPECIALTIES[Number.parseInt(filters.profession) as keyof typeof SPECIALTIES] || []
    : []

  // Obtener ciudades disponibles según provincia seleccionada
  const availableCities = filters.province ? CITIES[Number.parseInt(filters.province) as keyof typeof CITIES] || [] : []

  return (
    <div className="w-full space-y-6">
      {/* Search Bar */}
      <div className="w-full">
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={filters.keyword}
          onChange={handleKeywordChange}
          className="w-full px-6 py-4 bg-card border border-border/50 rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profession Select */}
        <div className="relative">
          <select
            value={filters.profession}
            onChange={handleProfessionChange}
            className="w-full px-4 py-3 bg-card border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer pr-10"
          >
            <option value="">Profesión</option>
            {PROFESSIONS.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Specialty Select - Dependent on Profession */}
        <div className="relative">
          <select
            value={filters.specialty}
            onChange={handleSpecialtyChange}
            disabled={!filters.profession}
            className="w-full px-4 py-3 bg-card border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Especialidad</option>
            {availableSpecialties.map((spec) => (
              <option key={spec.id} value={spec.id}>
                {spec.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Province Select */}
        <div className="relative">
          <select
            value={filters.province}
            onChange={handleProvinceChange}
            className="w-full px-4 py-3 bg-card border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer pr-10"
          >
            <option value="">Provincia</option>
            {PROVINCES.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* City Select - Dependent on Province */}
        <div className="relative">
          <select
            value={filters.city}
            onChange={handleCityChange}
            disabled={!filters.province}
            className="w-full px-4 py-3 bg-card border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Ciudad</option>
            {availableCities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Second Row of Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center flex-wrap">
        {/* Verified Only Checkbox */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="verified"
            checked={filters.verifiedOnly}
            onChange={handleVerifiedChange}
            className="w-5 h-5 rounded border border-border/50 cursor-pointer accent-primary"
          />
          <label htmlFor="verified" className="text-sm text-foreground cursor-pointer font-medium">
            Solo verificados
          </label>
        </div>

        {/* Sort Select */}
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="px-4 py-2 bg-card border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer pr-10"
          >
            <option value="featured">Destacados</option>
            <option value="price-low">Precio menor a mayor</option>
            <option value="price-high">Precio mayor a menor</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-all"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  )
}
