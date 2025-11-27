"use client"
import { use } from "react"
import { MapPin, ArrowLeft, Shield } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

const specialtyData = {
  contabilidad: {
    name: "Contabilidad",
    description: "Profesionales expertos en contabilidad, auditoría y gestión financiera",
  },
  finanzas: {
    name: "Finanzas",
    description: "Especialistas en inversiones, planificación financiera y análisis de mercados",
  },
  "recursos-humanos": {
    name: "Recursos Humanos",
    description: "Expertos en gestión del talento humano y desarrollo organizacional",
  },
  "marketing-y-ventas": {
    name: "Marketing y Ventas",
    description: "Profesionales en estrategias comerciales y marketing digital",
  },
  "administracion-de-empresas": {
    name: "Administración de Empresas",
    description: "Consultores en gestión empresarial y estrategia corporativa",
  },
  "negocios-internacionales": {
    name: "Negocios Internacionales",
    description: "Especialistas en comercio exterior e importaciones/exportaciones",
  },
}

const allProfessionals = [
  {
    id: 1,
    name: "Carlos Méndez",
    specialty: "Contabilidad",
    location: "Quito, Pichincha",
    image: "/accountant-male-professional-desk.jpg",
    price: "$45",
    unit: "hora",
    experience: "8 años",
    verified: true,
    specialty_id: "contabilidad",
    description: "Especialista en auditoría y contabilidad empresarial con enfoque en PYMES",
  },
  {
    id: 2,
    name: "Ana Salazar",
    specialty: "Finanzas",
    location: "Guayaquil, Guayas",
    image: "/finance-female-professional-office.jpg",
    price: "$55",
    unit: "hora",
    experience: "10 años",
    verified: true,
    specialty_id: "finanzas",
    description: "Experta en inversiones y planificación financiera corporativa",
  },
  {
    id: 3,
    name: "Roberto Torres",
    specialty: "Recursos Humanos",
    location: "Cuenca, Azuay",
    image: "/hr-male-professional-workspace.jpg",
    price: "$40",
    unit: "hora",
    experience: "6 años",
    verified: false,
    specialty_id: "recursos-humanos",
    description: "Gestión de talento humano y desarrollo organizacional",
  },
  {
    id: 4,
    name: "Diana Flores",
    specialty: "Marketing y Ventas",
    location: "Quito, Pichincha",
    image: "/marketing-female-professional-creative.jpg",
    price: "$50",
    unit: "hora",
    experience: "7 años",
    verified: true,
    specialty_id: "marketing-y-ventas",
    description: "Estrategias digitales y campañas de alto impacto en redes sociales",
  },
  {
    id: 5,
    name: "Miguel Ramírez",
    specialty: "Administración de Empresas",
    location: "Guayaquil, Guayas",
    image: "/business-admin-male-executive.jpg",
    price: "$65",
    unit: "hora",
    experience: "15 años",
    verified: true,
    specialty_id: "administracion-de-empresas",
    description: "MBA con especialización en gestión empresarial estratégica",
  },
  {
    id: 6,
    name: "Patricia Vargas",
    specialty: "Negocios Internacionales",
    location: "Quito, Pichincha",
    image: "/international-business-female-professional.jpg",
    price: "$60",
    unit: "hora",
    experience: "9 años",
    verified: true,
    specialty_id: "negocios-internacionales",
    description: "Importaciones, exportaciones y negociaciones internacionales",
  },
  {
    id: 7,
    name: "Fernando Castro",
    specialty: "Contabilidad",
    location: "Ambato, Tungurahua",
    image: "/accountant-male-young-professional.jpg",
    price: "$38",
    unit: "hora",
    experience: "5 años",
    verified: false,
    specialty_id: "contabilidad",
    description: "Soporte en facturación y registros contables para pequeñas empresas",
  },
  {
    id: 8,
    name: "Gabriela Morales",
    specialty: "Finanzas",
    location: "Cuenca, Azuay",
    image: "/finance-female-analyst-office.jpg",
    price: "$58",
    unit: "hora",
    experience: "11 años",
    verified: true,
    specialty_id: "finanzas",
    description: "Certificada en planificación financiera personal y corporativa",
  },
  {
    id: 9,
    name: "Luis Pérez",
    specialty: "Recursos Humanos",
    location: "Quito, Pichincha",
    image: "/hr-male-manager-modern-office.jpg",
    price: "$48",
    unit: "hora",
    experience: "8 años",
    verified: true,
    specialty_id: "recursos-humanos",
    description: "Psicólogo organizacional especializado en clima laboral",
  },
  {
    id: 10,
    name: "Sofía Jiménez",
    specialty: "Marketing y Ventas",
    location: "Guayaquil, Guayas",
    image: "/marketing-female-digital-specialist.jpg",
    price: "$42",
    unit: "hora",
    experience: "6 años",
    verified: false,
    specialty_id: "marketing-y-ventas",
    description: "Especialista en marketing digital y gestión de redes sociales",
  },
]

export default function SpecialtyPage({ params }: { params: Promise<{ specialty: string }> }) {
  const { specialty } = use(params)
  const specialtyInfo = specialtyData[specialty as keyof typeof specialtyData]

  const filteredProfessionals = specialtyInfo ? allProfessionals.filter((prof) => prof.specialty_id === specialty) : []

  return (
    <div className="w-full bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <Link
            href="/administracion"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Volver a Economía y Administración
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {specialtyInfo?.name || "Especialidad"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {specialtyInfo?.description || "Profesionales especializados en esta área"}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className="px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-sm font-semibold text-primary">{filteredProfessionals.length} Profesionales</span>
            </div>
          </div>
        </div>
      </section>

      {/* Professionals Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        {filteredProfessionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProfessionals.map((professional, index) => (
              <div
                key={professional.id}
                className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image Section */}
                <div className="relative h-80 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                  <img
                    src={professional.image || "/placeholder.svg?height=320&width=100%&query=professional"}
                    alt={professional.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Verified Badge */}
                  {professional.verified && (
                    <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Shield size={14} className="text-primary-foreground" />
                      <span className="text-xs font-semibold text-primary-foreground">Verificado</span>
                    </div>
                  )}

                  {/* Name & Specialty */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                      {professional.name}
                    </h3>
                    <p className="text-sm text-white/90">{professional.specialty}</p>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={16} className="text-primary" />
                    {professional.location}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{professional.description}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">{professional.experience} de experiencia</span>
                    <span className="text-lg font-bold text-primary">
                      {professional.price}
                      <span className="text-xs font-normal text-muted-foreground">/{professional.unit}</span>
                    </span>
                  </div>

                  <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-95">
                    Ver Perfil
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">No hay profesionales disponibles en esta especialidad</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
