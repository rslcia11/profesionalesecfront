"use client"

import { MessageCircle, Home, ChevronRight } from "lucide-react"
import Link from "next/link"

const specialtyData: Record<string, { name: string; description: string }> = {
  odontologia: {
    name: "Odontología",
    description: "Especialistas en salud dental y tratamientos odontológicos",
  },
  nutricion: {
    name: "Nutrición",
    description: "Profesionales en nutrición y dietética para tu bienestar",
  },
  cardiologia: {
    name: "Cardiología",
    description: "Especialistas en salud cardiovascular y del corazón",
  },
  pediatria: {
    name: "Pediatría",
    description: "Médicos especializados en la salud infantil",
  },
  dermatologia: {
    name: "Dermatología",
    description: "Especialistas en salud de la piel",
  },
  "medicina-general": {
    name: "Medicina General",
    description: "Atención médica integral para toda la familia",
  },
  urologia: {
    name: "Urología",
    description: "Especialistas en sistema urinario",
  },
  toxicologia: {
    name: "Toxicología",
    description: "Expertos en toxicología médica",
  },
  traumatologia: {
    name: "Traumatología",
    description: "Especialistas en lesiones y fracturas",
  },
  radiologia: {
    name: "Radiología",
    description: "Profesionales en diagnóstico por imagen",
  },
  reumatologia: {
    name: "Reumatología",
    description: "Especialistas en enfermedades reumáticas",
  },
  proctologia: {
    name: "Proctología",
    description: "Especialistas en salud digestiva",
  },
  oftalmologia: {
    name: "Oftalmología",
    description: "Especialistas en salud visual",
  },
  oncologia: {
    name: "Oncología",
    description: "Especialistas en tratamiento del cáncer",
  },
  otorrinolaringologia: {
    name: "Otorrinolaringología",
    description: "Especialistas en oído, nariz y garganta",
  },
  neumologia: {
    name: "Neumología",
    description: "Especialistas en enfermedades respiratorias",
  },
  inmunologia: {
    name: "Inmunología",
    description: "Especialistas en sistema inmunológico",
  },
  infectologia: {
    name: "Infectología",
    description: "Especialistas en enfermedades infecciosas",
  },
  geriatria: {
    name: "Geriatría",
    description: "Especialistas en salud del adulto mayor",
  },
  ginecologia: {
    name: "Ginecología",
    description: "Especialistas en salud de la mujer",
  },
  enfermeria: {
    name: "Enfermería",
    description: "Profesionales en cuidados de enfermería",
  },
  gastroenterologia: {
    name: "Gastroenterología",
    description: "Especialistas en sistema digestivo",
  },
  endocrinologia: {
    name: "Endocrinología",
    description: "Especialistas en hormonas y metabolismo",
  },
  "medicina-especializada": {
    name: "Medicina Especializada",
    description: "Profesionales en diversas especialidades médicas",
  },
}

// Sample professionals data - in a real app, this would come from a database
// const professionalsData: Record<string, any[]> = {
//   odontologia: [
//     {
//       name: "Dra. Yajaira González Fierro",
//       title: "Md.",
//       specialty: "Odontóloga - Rehabilitación Oral",
//       experience: "10+ años de experiencia",
//       education: "Universidad Nacional de Loja, Especialidad Universidad Estatal de Talca, Chile",
//       image: "/female-dentist-professional-portrait.jpg",
//       whatsapp: "593995364807",
//       location: "https://maps.app.goo.gl/5GotSDq2mvddaLqu5",
//     },
//     {
//       name: "Dr. Roberto Pérez",
//       title: "Md.",
//       specialty: "Odontólogo - Ortodoncia",
//       experience: "8 años de experiencia",
//       education: "Universidad Central del Ecuador",
//       image: "/male-dentist-professional.jpg",
//       whatsapp: "593987654321",
//       location: "https://maps.app.goo.gl/example1",
//     },
//   ],
//   cardiologia: [
//     {
//       name: "Dr. Carlos Mendoza",
//       title: "Md.",
//       specialty: "Cardiólogo",
//       experience: "15 años de experiencia",
//       education: "Universidad San Francisco de Quito",
//       image: "/female-doctor-cardiology.jpg",
//       whatsapp: "593987654322",
//       location: "https://maps.app.goo.gl/example2",
//     },
//   ],
//   nutricion: [
//     {
//       name: "Dra. María Fernández",
//       title: "Lic.",
//       specialty: "Nutricionista Clínica",
//       experience: "7 años de experiencia",
//       education: "Pontificia Universidad Católica del Ecuador",
//       image: "/female-nutritionist-professional.jpg",
//       whatsapp: "593987654323",
//       location: "https://maps.app.goo.gl/example3",
//     },
//   ],
//   pediatria: [
//     {
//       name: "Dr. Luis Ramírez",
//       title: "Md.",
//       specialty: "Pediatra",
//       experience: "12 años de experiencia",
//       education: "Universidad de Guayaquil",
//       image: "/male-pediatrician-professional-portrait.jpg",
//       whatsapp: "593987654324",
//       location: "https://maps.app.goo.gl/example4",
//     },
//   ],
// }

export default function SpecialtyProfessionals({ specialty }: { specialty: string }) {
  const info = specialtyData[specialty]
  const professionals: any[] = []

  if (!info) return null

  return (
    <div className="min-h-screen bg-background">
      <section className="py-6 px-4 border-b border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <Home size={16} />
              <span>Inicio</span>
            </Link>
            <ChevronRight size={16} className="text-muted-foreground/50" />
            <Link href="/medicos" className="text-muted-foreground hover:text-primary transition-colors">
              Médicos
            </Link>
            <ChevronRight size={16} className="text-muted-foreground/50" />
            <span className="text-foreground font-medium">{info.name}</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">{info.name}</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">{info.description}</p>
        </div>
      </section>

      {/* Professionals Grid */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {professionals.length > 0 ? (
            <>
              <h2 className="text-3xl font-bold text-foreground mb-12">
                Profesionales Disponibles ({professionals.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {professionals.map((professional, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all group"
                  >
                    <div className="relative h-80 overflow-hidden">
                      <img
                        src={professional.image || "/placeholder.svg"}
                        alt={professional.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />

                      <div className="absolute top-4 left-4 px-3 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-full text-xs font-bold">
                        {professional.title}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-2">{professional.name}</h3>
                      <p className="text-primary font-semibold mb-3">{professional.specialty}</p>
                      <p className="text-sm text-muted-foreground mb-2">{professional.experience}</p>
                      <p className="text-xs text-muted-foreground mb-6 leading-relaxed">{professional.education}</p>

                      <div className="flex gap-3">
                        <a
                          href={professional.location}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-full text-sm font-semibold hover:bg-secondary/80 transition-all border border-border/50"
                        >
                          Consultorio
                        </a>
                        <a
                          href={`https://api.whatsapp.com/send?phone=${professional.whatsapp}&text=Hola,%20${encodeURIComponent(professional.name)},%20necesito%20agendar%20una%20cita`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-all"
                        >
                          Agendar
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Próximamente</h3>
                <p className="text-muted-foreground mb-8">
                  Estamos trabajando para traerte los mejores profesionales en {info.name}. Pronto tendrás acceso a
                  especialistas verificados en esta área.
                </p>
                <Link
                  href="/medicos"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all"
                >
                  Ver otras especialidades
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
