"use client"

import { useState } from "react"
import Link from "next/link"
import {
  MapPin,
  ArrowRight,
  Briefcase,
  TrendingUp,
  Users,
  Building2,
  Calculator,
  PieChart,
  Award,
  BookOpen,
  Quote,
  CheckCircle,
  Star,
  ChevronRight,
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ImageHeroCarousel from "@/components/administracion/hero-carousel"

interface FilterState {
  keyword: string
  specialty: string
  province: string
  city: string
  verifiedOnly: boolean
  sortBy: string
}

export default function AdministracionPage() {
  const [filters, setFilters] = useState<FilterState>({
    keyword: "",
    specialty: "",
    province: "",
    city: "",
    verifiedOnly: false,
    sortBy: "featured",
  })

  const specialties = [
    { id: "contabilidad", name: "Contabilidad", icon: Calculator },
    { id: "finanzas", name: "Finanzas", icon: TrendingUp },
    { id: "recursos-humanos", name: "Recursos Humanos", icon: Users },
    { id: "marketing-y-ventas", name: "Marketing y Ventas", icon: PieChart },
    { id: "administracion-de-empresas", name: "Administración de Empresas", icon: Building2 },
    { id: "negocios-internacionales", name: "Negocios Internacionales", icon: Briefcase },
  ]

  const allProfessionals = [
    {
      id: 1,
      name: "Carlos Méndez",
      specialty: "Contabilidad",
      experience: 8,
      city: "Quito",
      province: "Pichincha",
      verified: true,
      image: "/accountant-male-professional-desk.jpg",
      price: 45,
    },
    {
      id: 2,
      name: "Ana Salazar",
      specialty: "Finanzas",
      experience: 10,
      city: "Guayaquil",
      province: "Guayas",
      verified: true,
      image: "/finance-female-professional-office.jpg",
      price: 55,
    },
    {
      id: 3,
      name: "Roberto Torres",
      specialty: "Recursos Humanos",
      experience: 6,
      city: "Cuenca",
      province: "Azuay",
      verified: false,
      image: "/hr-male-professional-workspace.jpg",
      price: 40,
    },
    {
      id: 4,
      name: "Diana Flores",
      specialty: "Marketing y Ventas",
      experience: 7,
      city: "Quito",
      province: "Pichincha",
      verified: true,
      image: "/marketing-female-professional-creative.jpg",
      price: 50,
    },
    {
      id: 5,
      name: "Miguel Ramírez",
      specialty: "Administración de Empresas",
      experience: 15,
      city: "Guayaquil",
      province: "Guayas",
      verified: true,
      image: "/business-admin-male-executive.jpg",
      price: 65,
    },
    {
      id: 6,
      name: "Patricia Vargas",
      specialty: "Negocios Internacionales",
      experience: 9,
      city: "Quito",
      province: "Pichincha",
      verified: true,
      image: "/international-business-female-professional.jpg",
      price: 60,
    },
    {
      id: 7,
      name: "Fernando Castro",
      specialty: "Contabilidad",
      experience: 5,
      city: "Ambato",
      province: "Tungurahua",
      verified: false,
      image: "/accountant-male-young-professional.jpg",
      price: 38,
    },
    {
      id: 8,
      name: "Gabriela Morales",
      specialty: "Finanzas",
      experience: 11,
      city: "Cuenca",
      province: "Azuay",
      verified: true,
      image: "/finance-female-analyst-office.jpg",
      price: 58,
    },
    {
      id: 9,
      name: "Luis Pérez",
      specialty: "Recursos Humanos",
      experience: 8,
      city: "Quito",
      province: "Pichincha",
      verified: true,
      image: "/hr-male-manager-modern-office.jpg",
      price: 48,
    },
    {
      id: 10,
      name: "Sofía Jiménez",
      specialty: "Marketing y Ventas",
      experience: 6,
      city: "Guayaquil",
      province: "Guayas",
      verified: false,
      image: "/marketing-female-digital-specialist.jpg",
      price: 42,
    },
  ]

  const featuredProfessional = {
    name: "María Elena Rodríguez",
    specialty: "Contabilidad y Auditoría",
    image: "/featured-accountant-professional-office.jpg",
    experience: 12,
    city: "Quito",
    description:
      "Contadora Pública Autorizada con más de 12 años de experiencia en auditoría financiera y consultoría empresarial. Especializada en optimización fiscal y planificación estratégica para PYMES y grandes corporaciones.",
    achievements: [
      "Certificación CPA Internacional",
      "Más de 100 empresas asesoradas exitosamente",
      "Especialista en NIIF y normativa tributaria ecuatoriana",
      "Docente universitaria en contabilidad avanzada",
    ],
    verified: true,
    clients: 87,
    satisfaction: 98,
  }

  const filteredProfessionals = allProfessionals.filter((professional) => {
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase()
      if (
        !professional.name.toLowerCase().includes(keyword) &&
        !professional.specialty.toLowerCase().includes(keyword)
      ) {
        return false
      }
    }
    if (filters.specialty && professional.specialty.toLowerCase() !== filters.specialty.toLowerCase()) return false
    if (filters.province && professional.province !== filters.province) return false
    if (filters.city && professional.city !== filters.city) return false
    if (filters.verifiedOnly && !professional.verified) return false
    return true
  })

  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
    switch (filters.sortBy) {
      case "price-low":
        return Number.parseInt(a.price.toString()) - Number.parseInt(b.price.toString())
      case "price-high":
        return Number.parseInt(b.price.toString()) - Number.parseInt(a.price.toString())
      case "featured":
      default:
        return (b.verified ? 1 : 0) - (a.verified ? 1 : 0)
    }
  })

  const heroSlides = [
    {
      image: "/business-professionals-team-meeting-office.jpg",
      title: "Nuestros profesionales Potenciarán tu empresa",
      subtitle: "Mejoramos tu empresa",
      ctaText: "BUSCAR PROFESIONAL",
      ctaLink: "#profesionales",
    },
    {
      image: "/financial-advisor-consulting-client-modern-office.jpg",
      title: "Expertos en Finanzas y Administración",
      subtitle: "Impulsa tu crecimiento",
      ctaText: "BUSCAR PROFESIONAL",
      ctaLink: "#profesionales",
    },
    {
      image: "/business-team-collaboration-strategy-planning.jpg",
      title: "Transforma tu Negocio",
      subtitle: "Alcanza tus metas",
      ctaText: "BUSCAR PROFESIONAL",
      ctaLink: "#profesionales",
    },
  ]

  const blogPosts = [
    {
      id: 1,
      title: "5 Claves para una Contabilidad Eficiente",
      author: "María Fernanda Castro",
      role: "Contadora Pública",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop",
      excerpt:
        "La organización es fundamental. Mantén tus documentos ordenados digitalmente, reconcilia tus cuentas mensualmente y siempre separa las finanzas personales de las empresariales.",
      date: "15 Nov 2024",
      readTime: "5 min",
    },
    {
      id: 2,
      title: "Cómo Invertir tu Dinero de Forma Inteligente",
      author: "Luis Aguirre",
      role: "Asesor de Inversiones",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop",
      excerpt:
        "Diversifica siempre tu portafolio. No pongas todos tus huevos en una sola canasta. Considera inversiones a largo plazo y mantén un fondo de emergencia antes de invertir.",
      date: "12 Nov 2024",
      readTime: "7 min",
    },
    {
      id: 3,
      title: "Gestión del Talento en Equipos Remotos",
      author: "Andrea Villacrés",
      role: "Especialista en RRHH",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
      excerpt:
        "La comunicación clara y frecuente es clave. Establece objetivos medibles, celebra los logros del equipo y fomenta la cultura organizacional incluso a distancia.",
      date: "08 Nov 2024",
      readTime: "6 min",
    },
  ]

  const scrollToProfessionals = () => {
    const element = document.getElementById("lista-profesionales")
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative group">
        <ImageHeroCarousel slides={heroSlides} autoplay={true} autoplayInterval={5000} />
      </section>

      {/* Specialties Section */}
      <section id="profesionales" className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Especialidades en
            <span className="text-primary"> Economía y Administración</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encuentra expertos verificados en todas las áreas de tu negocio
          </p>
        </div>

        {/* Specialties Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {specialties.map((spec) => {
            const IconComponent = spec.icon
            return (
              <Link
                key={spec.id}
                href={`/administracion/${spec.id}`}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  filters.specialty === spec.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "bg-card text-foreground border border-border hover:border-primary/50 hover:shadow-md"
                }`}
              >
                <IconComponent size={18} />
                {spec.name}
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured Professional Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Award className="text-primary" size={20} />
            <span className="text-sm font-semibold text-primary">Destacado del Mes</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Profesional del Mes</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Reconocemos la excelencia y dedicación de nuestros mejores profesionales
          </p>
        </div>

        <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-background rounded-3xl overflow-hidden border border-primary/20 shadow-2xl hover:shadow-primary/10 transition-all duration-500">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative h-96 md:h-auto overflow-hidden group">
              <img
                src={featuredProfessional.image || "/placeholder.svg"}
                alt={featuredProfessional.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="text-primary" size={24} />
                  <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    Verificado
                  </span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-foreground mb-2">{featuredProfessional.name}</h3>
                  <p className="text-lg text-primary font-semibold">{featuredProfessional.specialty}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Briefcase size={16} />
                      <span>{featuredProfessional.experience} años de experiencia</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{featuredProfessional.city}</span>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">{featuredProfessional.description}</p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Star className="text-primary" size={18} />
                    Logros Destacados
                  </h4>
                  {featuredProfessional.achievements.map((achievement, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <ChevronRight className="text-primary flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-sm text-muted-foreground">{achievement}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/50">
                  <div className="text-center p-4 bg-primary/5 rounded-xl">
                    <Users className="mx-auto mb-2 text-primary" size={24} />
                    <div className="text-2xl font-bold text-foreground">{featuredProfessional.clients}+</div>
                    <div className="text-xs text-muted-foreground">Clientes</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-xl">
                    <TrendingUp className="mx-auto mb-2 text-primary" size={24} />
                    <div className="text-2xl font-bold text-foreground">{featuredProfessional.satisfaction}%</div>
                    <div className="text-xs text-muted-foreground">Satisfacción</div>
                  </div>
                </div>

                <Link
                  href={`/administracion/${featuredProfessional.specialty.toLowerCase().replace(/ /g, "-")}`}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/20 active:scale-95 group"
                >
                  Ver Perfil Completo
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section id="lista-profesionales" className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Buscar profesional por nombre o especialidad..."
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            className="w-full px-6 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
          />

          {/* Additional Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Sort By */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
            >
              <option value="featured">Destacados</option>
              <option value="price-low">Menor precio</option>
              <option value="price-high">Mayor precio</option>
            </select>

            {/* Clear Filters */}
            {(filters.keyword || filters.specialty || filters.verifiedOnly) && (
              <button
                onClick={() =>
                  setFilters({
                    keyword: "",
                    specialty: "",
                    province: "",
                    city: "",
                    verifiedOnly: false,
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
          {sortedProfessionals.length} profesional{sortedProfessionals.length !== 1 ? "es" : ""} encontrado
          {sortedProfessionals.length !== allProfessionals.length ? "s (filtrado)" : "s"}
        </p>
      </section>

      {/* Professionals Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-32">
        {sortedProfessionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProfessionals.map((professional, index) => (
              <div
                key={professional.id}
                className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image Section */}
                <div className="relative h-80 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                  <img
                    src={professional.image || "/placeholder.svg?height=320&width=100%&query=business professional"}
                    alt={professional.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-60" />

                  {/* Verified Badge */}
                  {professional.verified && (
                    <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                      <span className="text-xs font-bold text-primary-foreground">✓ Verificado</span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">{professional.name}</h3>
                  <p className="text-sm text-primary font-semibold mb-3 line-clamp-1">{professional.specialty}</p>

                  {/* Info Grid */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Experiencia</span>
                      <span className="font-semibold text-foreground">{professional.experience} años</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin size={12} />
                      <span className="line-clamp-1">{professional.city}</span>
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div>
                      <div className="text-xl font-bold text-primary">${professional.price}</div>
                      <div className="text-xs text-muted-foreground">por hora</div>
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
            <Briefcase size={64} className="mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg text-muted-foreground mb-4">
              No se encontraron profesionales con los filtros seleccionados.
            </p>
            <button
              onClick={() =>
                setFilters({
                  keyword: "",
                  specialty: "",
                  province: "",
                  city: "",
                  verifiedOnly: false,
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

      {/* Blog Posts Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-4">
            <BookOpen className="text-accent" size={20} />
            <span className="text-sm font-semibold text-accent">Blog</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Consejos de Profesionales</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aprende tips prácticos y valiosos de nuestros expertos para mejorar tu día a día
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/consejos/${post.id === 1 ? "5-claves-contabilidad-eficiente" : post.id === 2 ? "invertir-dinero-forma-inteligente" : "gestion-talento-equipos-remotos"}`}
              className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-60" />

                {/* Quote Icon */}
                <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm p-2 rounded-full">
                  <Quote className="text-primary-foreground" size={20} />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{post.date}</span>
                  <span>{post.readTime} lectura</span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>

                {/* Author Info */}
                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{post.author}</p>
                      <p className="text-xs text-muted-foreground">{post.role}</p>
                    </div>
                    <button className="group/btn p-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
                      <ArrowRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/consejos"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-95"
          >
            Ver todos los consejos
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 pb-32">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-12 border border-primary/20 text-center">
          <Building2 size={48} className="mx-auto mb-6 text-primary" />
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¿Eres profesional en administración o economía?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Únete a nuestra red de expertos verificados y amplía tus oportunidades de negocio
          </p>
          <button className="group px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/20 inline-flex items-center gap-3">
            Crear perfil profesional
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
