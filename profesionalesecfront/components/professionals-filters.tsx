"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"

const PROFESSIONS = [
  { id: 1, name: "Derecho" },
  { id: 2, name: "Salud" },
  { id: 3, name: "Economia y Administracion" },
  { id: 4, name: "Oficios y mas" },
  { id: 5, name: "Comunicacion" },
  { id: 6, name: "Educacion" },
  { id: 7, name: "Ingenieria y Tecnologia" },
  { id: 8, name: "Diseño y Construccion" },
  { id: 9, name: "Agraria" },
  { id: 10, name: "Arte y Cultura" },
  { id: 11, name: "Salud Mental" },
]

const SPECIALTIES = {
  1: [
    { id: 1, name: "Derecho Penal" },
    { id: 2, name: "Derecho Civil" },
    { id: 3, name: "Derecho Laboral" },
    { id: 4, name: "Derecho Constitucional" },
    { id: 5, name: "Derecho Administrativo" },
    { id: 6, name: "Derecho Mercantil" },
    { id: 7, name: "Derecho Internacional" },
    { id: 8, name: "Derecho Ambiental" },
  ],
  2: [
    { id: 9, name: "Medicina General" },
    { id: 10, name: "Enfermería" },
    { id: 11, name: "Odontología" },
    { id: 12, name: "Nutrición" },
    { id: 13, name: "Laboratorio Clínico" },
    { id: 14, name: "Obstetricia" },
    { id: 15, name: "Terapia Física" },
  ],
  3: [
    { id: 16, name: "Contabilidad" },
    { id: 17, name: "Auditoría" },
    { id: 18, name: "Finanzas" },
    { id: 19, name: "Administración de Empresas" },
    { id: 20, name: "Gestión de Talento Humano" },
    { id: 21, name: "Comercio Exterior" },
    { id: 22, name: "Logística y Operaciones" },
  ],
  4: [
    { id: 23, name: "Cocinero/a" },
    { id: 24, name: "Mesero/a" },
    { id: 25, name: "Maestro Panadero" },
    { id: 26, name: "Mecánico Automotriz" },
    { id: 27, name: "Maestro Albañil" },
    { id: 28, name: "Carpintero" },
    { id: 29, name: "Electricista" },
    { id: 30, name: "Soldador" },
    { id: 31, name: "Pintor de Obra" },
    { id: 32, name: "Plomero" },
    { id: 33, name: "Chofer Profesional" },
  ],
  5: [
    { id: 34, name: "Periodismo" },
    { id: 35, name: "Comunicación Corporativa" },
    { id: 36, name: "Producción Audiovisual" },
    { id: 37, name: "Relaciones Públicas" },
    { id: 38, name: "Locución" },
    { id: 39, name: "Diseño Publicitario" },
    { id: 40, name: "Gestión de Redes Sociales" },
  ],
  6: [
    { id: 41, name: "Educación Inicial" },
    { id: 42, name: "Educación Básica" },
    { id: 43, name: "Educación Especial" },
    { id: 44, name: "Docencia en Matemáticas" },
    { id: 45, name: "Docencia en Lengua y Literatura" },
    { id: 46, name: "Docencia en Ciencias Sociales" },
    { id: 47, name: "Docencia en Ciencias Naturales" },
    { id: 48, name: "Educación Física" },
  ],
  7: [
    { id: 49, name: "Ingeniería en Sistemas" },
    { id: 50, name: "Ingeniería Eléctrica" },
    { id: 51, name: "Ingeniería Electrónica" },
    { id: 52, name: "Ingeniería Mecánica" },
    { id: 53, name: "Ingeniería Industrial" },
    { id: 54, name: "Ingeniería en Telecomunicaciones" },
    { id: 55, name: "Ingeniería Civil" },
    { id: 56, name: "Ingeniería Química" },
    { id: 57, name: "Ingeniería Biomédica" },
    { id: 58, name: "Ingeniería en Energías Renovables" },
    { id: 59, name: "Ingeniería en Minas" },
    { id: 60, name: "Ingeniería en Petróleos" },
    { id: 61, name: "Ingeniería Geológica" },
    { id: 62, name: "Ingeniería en Transporte" },
    { id: 63, name: "Automatización Industrial" },
    { id: 64, name: "Desarrollo de Software" },
    { id: 65, name: "Ciberseguridad" },
    { id: 66, name: "Big Data" },
    { id: 67, name: "Inteligencia Artificial" },
  ],
  8: [
    { id: 68, name: "Arquitectura" },
    { id: 69, name: "Dibujo Técnico" },
    { id: 70, name: "Topografía" },
    { id: 71, name: "Diseño de Interiores" },
    { id: 72, name: "Urbanismo" },
    { id: 73, name: "Construcción y Obra" },
    { id: 74, name: "Modelado 3D y Render" },
  ],
  9: [
    { id: 75, name: "Ingeniería Agrícola" },
    { id: 76, name: "Ingeniería Forestal" },
    { id: 77, name: "Veterinaria" },
    { id: 78, name: "Agroindustria" },
    { id: 79, name: "Zootecnia" },
    { id: 80, name: "Gestión Ambiental Rural" },
    { id: 81, name: "Producción Agropecuaria" },
    { id: 82, name: "Riego y Drenaje" },
    { id: 83, name: "Silvicultura" },
  ],
  10: [
    { id: 84, name: "Música" },
    { id: 85, name: "Pintura" },
    { id: 86, name: "Danza" },
    { id: 87, name: "Teatro" },
    { id: 88, name: "Fotografía" },
    { id: 89, name: "Escultura" },
    { id: 90, name: "Diseño Gráfico" },
    { id: 91, name: "Cine y Dirección" },
  ],
  11: [
    { id: 92, name: "Psicología Clínica" },
    { id: 93, name: "Psicopedagogía" },
    { id: 94, name: "Terapia Ocupacional" },
    { id: 95, name: "Neuropsicología" },
    { id: 96, name: "Psicología Infantil" },
    { id: 97, name: "Psicología Organizacional" },
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
  1: [
    { id: 1, name: "Cuenca" },
    { id: 2, name: "Gualaceo" },
    { id: 3, name: "Paute" },
    { id: 4, name: "Sevilla de Oro" },
    { id: 5, name: "Santa Isabel" },
    { id: 6, name: "Sigsig" },
    { id: 7, name: "Oña" },
    { id: 8, name: "Nabón" },
    { id: 9, name: "Guachapala" },
    { id: 10, name: "Camilo Ponce Enríquez" },
  ],
  2: [
    { id: 11, name: "Guaranda" },
    { id: 12, name: "Caluma" },
    { id: 13, name: "Chillanes" },
    { id: 14, name: "Chimbo" },
    { id: 15, name: "Echeandía" },
    { id: 16, name: "Las Naves" },
    { id: 17, name: "San Miguel" },
  ],
  3: [
    { id: 18, name: "Azogues" },
    { id: 19, name: "Biblián" },
    { id: 20, name: "La Troncal" },
    { id: 21, name: "Cañar" },
    { id: 22, name: "El Tambo" },
    { id: 23, name: "Suscal" },
    { id: 24, name: "Déleg" },
  ],
  4: [
    { id: 25, name: "Tulcán" },
    { id: 26, name: "San Gabriel" },
    { id: 27, name: "El Ángel" },
    { id: 28, name: "Mira" },
    { id: 29, name: "Huaca" },
    { id: 30, name: "Bolívar" },
  ],
  5: [
    { id: 31, name: "Riobamba" },
    { id: 32, name: "Alausí" },
    { id: 33, name: "Colta" },
    { id: 34, name: "Chambo" },
    { id: 35, name: "Guano" },
    { id: 36, name: "Pallatanga" },
    { id: 37, name: "Penipe" },
    { id: 38, name: "Cumandá" },
  ],
  6: [
    { id: 39, name: "Latacunga" },
    { id: 40, name: "La Maná" },
    { id: 41, name: "Pujilí" },
    { id: 42, name: "Salcedo" },
    { id: 43, name: "Sigchos" },
    { id: 44, name: "Saquisilí" },
  ],
  7: [
    { id: 45, name: "Machala" },
    { id: 46, name: "Arenillas" },
    { id: 47, name: "Atahualpa" },
    { id: 48, name: "Balsas" },
    { id: 49, name: "Chilla" },
    { id: 50, name: "El Guabo" },
    { id: 51, name: "Huaquillas" },
    { id: 52, name: "Las Lajas" },
    { id: 53, name: "Marcabelí" },
    { id: 54, name: "Pasaje" },
    { id: 55, name: "Piñas" },
    { id: 56, name: "Portovelo" },
    { id: 57, name: "Santa Rosa" },
    { id: 58, name: "Zaruma" },
  ],
  8: [
    { id: 59, name: "Esmeraldas" },
    { id: 60, name: "Valdez" },
    { id: 61, name: "Muisne" },
    { id: 62, name: "Rosa Zárate" },
    { id: 63, name: "San Lorenzo" },
    { id: 64, name: "Rioverde" },
  ],
  9: [
    { id: 65, name: "Puerto Baquerizo Moreno" },
    { id: 66, name: "Puerto Ayora" },
    { id: 67, name: "Puerto Villamil" },
  ],
  10: [
    { id: 68, name: "Guayaquil" },
    { id: 69, name: "Alfredo Baquerizo Moreno" },
    { id: 70, name: "Balao" },
    { id: 71, name: "Balzar" },
    { id: 72, name: "Colimes" },
    { id: 73, name: "Daule" },
    { id: 74, name: "Durán" },
    { id: 75, name: "El Empalme" },
    { id: 76, name: "El Triunfo" },
    { id: 77, name: "General Antonio Elizalde" },
    { id: 78, name: "Isidro Ayora" },
    { id: 79, name: "Lomas de Sargentillo" },
    { id: 80, name: "Marcelino Maridueña" },
    { id: 81, name: "Milagro" },
    { id: 82, name: "Naranjal" },
    { id: 83, name: "Naranjito" },
    { id: 84, name: "Palestina" },
    { id: 85, name: "Pedro Carbo" },
    { id: 86, name: "Playas" },
    { id: 87, name: "Salitre" },
    { id: 88, name: "Samborondón" },
    { id: 89, name: "Santa Lucía" },
    { id: 90, name: "Simón Bolívar" },
    { id: 91, name: "Yaguachi" },
  ],
  11: [
    { id: 92, name: "Ibarra" },
    { id: 93, name: "Atuntaqui" },
    { id: 94, name: "Cotacachi" },
    { id: 95, name: "Otavalo" },
    { id: 96, name: "Pimampiro" },
    { id: 97, name: "Urcuquí" },
  ],
  12: [
    { id: 98, name: "Loja" },
    { id: 99, name: "Cariamanga" },
    { id: 100, name: "Catacocha" },
    { id: 101, name: "Catamayo" },
    { id: 102, name: "Celica" },
    { id: 103, name: "Gonzanamá" },
    { id: 104, name: "Macará" },
    { id: 105, name: "Paltas" },
    { id: 106, name: "Pindal" },
    { id: 107, name: "Puyango" },
    { id: 108, name: "Quilanga" },
    { id: 109, name: "Saraguro" },
    { id: 110, name: "Sozoranga" },
    { id: 111, name: "Zapotillo" },
  ],
  13: [
    { id: 112, name: "Babahoyo" },
    { id: 113, name: "Baba" },
    { id: 114, name: "Buena Fe" },
    { id: 115, name: "Mocache" },
    { id: 116, name: "Montalvo" },
    { id: 117, name: "Palenque" },
    { id: 118, name: "Pimocha" },
    { id: 119, name: "Quevedo" },
    { id: 120, name: "Quinsaloma" },
    { id: 121, name: "Ventanas" },
    { id: 122, name: "Vinces" },
  ],
  14: [
    { id: 123, name: "Portoviejo" },
    { id: 124, name: "Bolívar" },
    { id: 125, name: "Chone" },
    { id: 126, name: "El Carmen" },
    { id: 127, name: "Flavio Alfaro" },
    { id: 128, name: "Jama" },
    { id: 129, name: "Jaramijó" },
    { id: 130, name: "Jipijapa" },
    { id: 131, name: "Junín" },
    { id: 132, name: "Manta" },
    { id: 133, name: "Montecristi" },
    { id: 134, name: "Olmedo" },
    { id: 135, name: "Paján" },
    { id: 136, name: "Pedernales" },
    { id: 137, name: "Pichincha" },
    { id: 138, name: "Puerto López" },
    { id: 139, name: "Rocafuerte" },
    { id: 140, name: "San Vicente" },
    { id: 141, name: "Santa Ana" },
    { id: 142, name: "Sucre" },
    { id: 143, name: "Tosagua" },
    { id: 144, name: "24 de Mayo" },
  ],
  15: [
    { id: 145, name: "Macas" },
    { id: 146, name: "Gualaquiza" },
    { id: 147, name: "Sucúa" },
    { id: 148, name: "Huamboya" },
    { id: 149, name: "San Juan Bosco" },
    { id: 150, name: "Taisha" },
    { id: 151, name: "Logroño" },
    { id: 152, name: "Santiago de Méndez" },
    { id: 153, name: "Tiwintza" },
    { id: 154, name: "Pablo Sexto" },
  ],
  16: [
    { id: 155, name: "Tena" },
    { id: 156, name: "Archidona" },
    { id: 157, name: "Baeza" },
    { id: 158, name: "Carlos Julio Arosemena Tola" },
    { id: 159, name: "El Chaco" },
  ],
  17: [
    { id: 160, name: "Coca" },
    { id: 161, name: "Nuevo Rocafuerte" },
    { id: 162, name: "La Joya de los Sachas" },
    { id: 163, name: "Loreto" },
    { id: 164, name: "Tiputini" },
  ],
  18: [
    { id: 165, name: "Puyo" },
    { id: 166, name: "Arajuno" },
    { id: 167, name: "Mera" },
    { id: 168, name: "Santa Clara" },
  ],
  19: [
    { id: 169, name: "Quito" },
    { id: 170, name: "Cayambe" },
    { id: 171, name: "Machachi" },
    { id: 172, name: "Puerto Quito" },
    { id: 173, name: "Pedro Vicente Maldonado" },
    { id: 174, name: "Sangolquí" },
    { id: 175, name: "Tabacundo" },
  ],
  20: [
    { id: 176, name: "Santa Elena" },
    { id: 177, name: "La Libertad" },
    { id: 178, name: "Salinas" },
  ],
  21: [
    { id: 179, name: "Santo Domingo" },
    { id: 180, name: "La Concordia" },
  ],
  22: [
    { id: 181, name: "Nueva Loja" },
    { id: 182, name: "Cáscales" },
    { id: 183, name: "Gonzalo Pizarro" },
    { id: 184, name: "Putumayo" },
    { id: 185, name: "Shushufindi" },
    { id: 186, name: "Sucumbíos" },
    { id: 187, name: "Tarapoa" },
  ],
  23: [
    { id: 188, name: "Ambato" },
    { id: 189, name: "Baños" },
    { id: 190, name: "Cevallos" },
    { id: 191, name: "Mocha" },
    { id: 192, name: "Patate" },
    { id: 193, name: "Pelileo" },
    { id: 194, name: "Píllaro" },
    { id: 195, name: "Quero" },
    { id: 196, name: "Tisaleo" },
  ],
  24: [
    { id: 197, name: "Zamora" },
    { id: 198, name: "Yantzaza" },
    { id: 199, name: "Zumbi" },
    { id: 200, name: "El Pangui" },
    { id: 201, name: "Zapotillo" },
    { id: 202, name: "Palanda" },
    { id: 203, name: "Chinchipe" },
    { id: 204, name: "Nangaritza" },
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
