"use client"

import { useState } from "react"
import { Star, MapPin, ArrowRight, Palette, Music, Theater, Camera } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface FilterState {
  keyword: string
  specialty: string
  province: string
  city: string
  verifiedOnly: boolean
  minRating: number
  sortBy: string
}

export default function ArteCulturaPage() {
  const [filters, setFilters] = useState<FilterState>({
    keyword: "",
    specialty: "",
    province: "",
    city: "",
    verifiedOnly: false,
    minRating: 0,
    sortBy: "featured",
  })

  const specialties = [
    { id: "musica", name: "Música", icon: Music },
    { id: "pintura", name: "Pintura y Escultura", icon: Palette },
    { id: "modelaje", name: "Modelaje", icon: Camera },
    { id: "escenicas", name: "Artes Escénicas", icon: Theater },
    { id: "actuacion", name: "Actuación", icon: Theater },
  ]

  const artists = [
    {
      id: 1,
      name: "DJ Jeiko",
      specialty: "DJ y Productor Musical",
      rating: 5.0,
      reviews: 87,
      location: "Quito, Ecuador",
      image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=1000&fit=crop",
      price: "$500",
      unit: "evento",
      experience: "10 años",
      category: "musica",
      featured: true,
      verified: true,
      specialty_id: "musica",
      province: "19",
      city: "4",
      description: "DJ profesional con experiencia en eventos corporativos y privados",
    },
    {
      id: 2,
      name: "María Fernández",
      specialty: "Pintora Contemporánea",
      rating: 4.9,
      reviews: 65,
      location: "Cuenca, Ecuador",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop",
      price: "$1200",
      unit: "obra",
      experience: "15 años",
      category: "pintura",
      featured: true,
      verified: true,
      specialty_id: "pintura",
      province: "1",
      city: "7",
      description: "Artista especializada en arte abstracto y retratos",
    },
    {
      id: 3,
      name: "Carlos Ruiz",
      specialty: "Actor de Teatro",
      rating: 4.8,
      reviews: 92,
      location: "Guayaquil, Ecuador",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
      price: "$300",
      unit: "presentación",
      experience: "12 años",
      category: "actuacion",
      featured: true,
      verified: true,
      specialty_id: "actuacion",
      province: "10",
      city: "1",
      description: "Actor profesional con amplia experiencia en teatro y cine",
    },
    {
      id: 4,
      name: "Laura Sánchez",
      specialty: "Modelo Profesional",
      rating: 4.9,
      reviews: 134,
      location: "Quito, Ecuador",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop",
      price: "$400",
      unit: "sesión",
      experience: "8 años",
      category: "modelaje",
      featured: true,
      verified: true,
      specialty_id: "modelaje",
      province: "19",
      city: "4",
      description: "Modelo con experiencia en pasarelas y fotografía comercial",
    },
    {
      id: 5,
      name: "Roberto Vega",
      specialty: "Escultor",
      rating: 5.0,
      reviews: 45,
      location: "Quito, Ecuador",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop",
      price: "$2000",
      unit: "escultura",
      experience: "20 años",
      category: "pintura",
      featured: false,
      verified: true,
      specialty_id: "pintura",
      province: "19",
      city: "4",
      description: "Escultor reconocido especializado en obras de gran formato",
    },
    {
      id: 6,
      name: "Andrea Morales",
      specialty: "Cantante Profesional",
      rating: 4.8,
      reviews: 78,
      location: "Guayaquil, Ecuador",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop",
      price: "$600",
      unit: "evento",
      experience: "9 años",
      category: "musica",
      featured: false,
      verified: true,
      specialty_id: "musica",
      province: "10",
      city: "1",
      description: "Vocalista con repertorio variado para eventos especiales",
    },
    {
      id: 7,
      name: "Diego Torres",
      specialty: "Bailarín Folklórico",
      rating: 4.7,
      reviews: 56,
      location: "Cuenca, Ecuador",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=1000&fit=crop",
      price: "$250",
      unit: "presentación",
      experience: "11 años",
      category: "escenicas",
      featured: false,
      verified: true,
      specialty_id: "escenicas",
      province: "1",
      city: "7",
      description: "Bailarín especializado en danzas tradicionales ecuatorianas",
    },
    {
      id: 8,
      name: "Valentina Cruz",
      specialty: "Fotógrafa Artística",
      rating: 4.9,
      reviews: 112,
      location: "Quito, Ecuador",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop",
      price: "$350",
      unit: "sesión",
      experience: "7 años",
      category: "pintura",
      featured: false,
      verified: false,
      specialty_id: "pintura",
      province: "19",
      city: "4",
      description: "Fotógrafa especializada en retratos y fotografía conceptual",
    },
  ]

  const filteredArtists = artists.filter((artist) => {
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase()
      if (!artist.name.toLowerCase().includes(keyword) && !artist.specialty.toLowerCase().includes(keyword)) {
        return false
      }
    }
    if (filters.specialty && artist.specialty_id !== filters.specialty) return false
    if (filters.province && artist.province !== filters.province) return false
    if (filters.city && artist.city !== filters.city) return false
    if (filters.verifiedOnly && !artist.verified) return false
    if (filters.minRating && artist.rating < filters.minRating) return false
    return true
  })

  const sortedArtists = [...filteredArtists].sort((a, b) => {
    switch (filters.sortBy) {
      case "rating-high":
        return b.rating - a.rating
      case "reviews-high":
        return b.reviews - a.reviews
      case "price-low":
        return Number.parseInt(a.price.replace("$", "")) - Number.parseInt(b.price.replace("$", ""))
      case "price-high":
        return Number.parseInt(b.price.replace("$", "")) - Number.parseInt(a.price.replace("$", ""))
      case "featured":
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    }
  })

  return (
    <div className="w-full bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 md:px-6 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight text-balance">
              Artistas y
              <br />
              <span className="text-primary">Profesionales del Arte</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
              Descubre talento ecuatoriano excepcional. Conecta con artistas verificados para tus proyectos y eventos.
            </p>
          </div>

          {/* Specialties Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {specialties.map((spec) => (
              <button
                key={spec.id}
                onClick={() => setFilters({ ...filters, specialty: filters.specialty === spec.id ? "" : spec.id })}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  filters.specialty === spec.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "bg-card text-foreground border border-border hover:border-primary/50 hover:shadow-md"
                }`}
              >
                <spec.icon size={18} />
                {spec.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Buscar artista por nombre o especialidad..."
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            className="w-full px-6 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
          />

          {/* Additional Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Verified Only */}
            <label className="flex items-center gap-3 px-4 py-3 bg-background rounded-xl cursor-pointer hover:bg-background/80 transition-all">
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary/50"
              />
              <span className="text-sm text-foreground">Solo verificados</span>
            </label>

            {/* Min Rating */}
            <select
              value={filters.minRating}
              onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
              className="px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
            >
              <option value={0}>Todas las calificaciones</option>
              <option value={4}>4+ estrellas</option>
              <option value={4.5}>4.5+ estrellas</option>
              <option value={4.8}>4.8+ estrellas</option>
            </select>

            {/* Sort By */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
            >
              <option value="featured">Destacados</option>
              <option value="rating-high">Mejor calificación</option>
              <option value="reviews-high">Más reseñas</option>
              <option value="price-low">Menor precio</option>
              <option value="price-high">Mayor precio</option>
            </select>

            {/* Clear Filters */}
            {(filters.keyword || filters.specialty || filters.verifiedOnly || filters.minRating > 0) && (
              <button
                onClick={() =>
                  setFilters({
                    keyword: "",
                    specialty: "",
                    province: "",
                    city: "",
                    verifiedOnly: false,
                    minRating: 0,
                    sortBy: "featured",
                  })
                }
                className="px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-all"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mt-6">
          {sortedArtists.length} artista{sortedArtists.length !== 1 ? "s" : ""} encontrado
          {sortedArtists.length !== artists.length ? "s (filtrado)" : "s"}
        </p>
      </section>

      {/* Artists Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-32">
        {sortedArtists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedArtists.map((artist, index) => (
              <div
                key={artist.id}
                className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image Section */}
                <div className="relative h-80 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                  <img
                    src={artist.image || "/placeholder.svg?height=320&width=100%&query=artist"}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-60" />

                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold text-foreground">{artist.rating}</span>
                  </div>

                  {/* Verified Badge */}
                  {artist.verified && (
                    <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                      <span className="text-xs font-bold text-primary-foreground">✓ Verificado</span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">{artist.name}</h3>
                  <p className="text-sm text-primary font-semibold mb-3 line-clamp-1">{artist.specialty}</p>

                  {/* Info Grid */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Experiencia</span>
                      <span className="font-semibold text-foreground">{artist.experience}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Reseñas</span>
                      <span className="font-semibold text-foreground">{artist.reviews} valoraciones</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin size={12} />
                      <span className="line-clamp-1">{artist.location}</span>
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div>
                      <div className="text-xl font-bold text-primary">{artist.price}</div>
                      <div className="text-xs text-muted-foreground">por {artist.unit}</div>
                    </div>
                    <button className="group/btn px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 flex items-center gap-2">
                      Ver perfil
                      <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
            <Palette size={64} className="mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg text-muted-foreground mb-4">
              No se encontraron artistas con los filtros seleccionados.
            </p>
            <button
              onClick={() =>
                setFilters({
                  keyword: "",
                  specialty: "",
                  province: "",
                  city: "",
                  verifiedOnly: false,
                  minRating: 0,
                  sortBy: "featured",
                })
              }
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </section>

      {/* Bottom CTA Section */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 pb-32">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-12 border border-primary/20 text-center">
          <Palette size={48} className="mx-auto mb-6 text-primary" />
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">¿Eres un artista profesional?</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Únete a nuestra comunidad de artistas verificados y conecta con clientes que valoran tu talento
          </p>
          <button className="group px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/20 inline-flex items-center gap-3">
            Crear perfil de artista
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
