"use client"

import { MessageCircle, MapPinned } from "lucide-react"

export default function FeaturedDoctor() {
  const mainFeatured = {
    name: "Dra. Yajaira González Fierro",
    title: "Md.",
    specialty: "Odontóloga",
    degree:
      "Odontóloga graduada en el año 2011 en la Universidad Nacional de Loja, con estudios de especialidad en la Universidad Estatal de Talca, Chile, en el año 2019.",
    experience:
      "Con más de 10 años de experiencia, como especialista en rehabilitación oral, puedo restaurar la boca del paciente, devolviéndole su sonrisa y mejorando su calidad de vida. Los especialistas pueden realizar desde rehabilitaciones orales mínimas (como un único diente) hasta rehabilitaciones orales completas (toda la cavidad oral).",
    image: "/female-dentist-professional-portrait.jpg",
    whatsapp: "593995364807",
    location: "https://maps.app.goo.gl/5GotSDq2mvddaLqu5",
  }

  const otherFeatured = [
    {
      name: "Dr. Carlos Mendoza",
      specialty: "Cardiólogo",
      image: "/female-doctor-cardiology.jpg",
      whatsapp: "593987654321",
      location: "https://maps.app.goo.gl/example1",
    },
    {
      name: "Dra. María Fernández",
      specialty: "Nutricionista",
      image: "/female-nutritionist-professional.jpg",
      whatsapp: "593987654322",
      location: "https://maps.app.goo.gl/example2",
    },
    {
      name: "Dr. Luis Ramírez",
      specialty: "Pediatra",
      image: "/male-pediatrician-professional-portrait.jpg",
      whatsapp: "593987654323",
      location: "https://maps.app.goo.gl/example3",
    },
  ]

  return (
    <section className="py-24 md:py-32 px-4 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Profesionales destacados del mes</h2>
          <p className="text-lg text-muted-foreground">La mejor selección de especialistas de la salud</p>
        </div>

        <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl overflow-hidden border border-primary/10 mb-12">
          <div className="grid md:grid-cols-5 gap-0">
            {/* Image Side */}
            <div className="md:col-span-2 relative h-[500px] md:h-auto overflow-hidden">
              <img
                src={mainFeatured.image || "/placeholder.svg"}
                alt={mainFeatured.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:bg-gradient-to-r" />

              {/* Title badge on image */}
              <div className="absolute top-6 left-6 px-4 py-2 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-full text-sm font-bold">
                {mainFeatured.title}
              </div>

              <div className="absolute top-6 right-6 px-4 py-2 bg-accent/90 backdrop-blur-sm text-accent-foreground rounded-full text-sm font-bold">
                ⭐ Mejor del Mes
              </div>
            </div>

            {/* Content Side */}
            <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{mainFeatured.name}</h3>
              <p className="text-xl text-primary font-semibold mb-6">{mainFeatured.specialty}</p>

              {/* Education */}
              <div className="space-y-4 mb-8">
                <p className="text-sm text-muted-foreground leading-relaxed">{mainFeatured.degree}</p>
                <p className="text-sm text-foreground leading-relaxed">{mainFeatured.experience}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={mainFeatured.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-full font-semibold hover:bg-secondary/80 transition-all border border-border/50"
                >
                  <MapPinned size={18} />
                  Consultorio
                </a>
                <a
                  href={`https://api.whatsapp.com/send?phone=${mainFeatured.whatsapp}&text=Hola,%20${encodeURIComponent(mainFeatured.name)},%20necesito%20agendar%20una%20cita%20medica`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/20"
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {otherFeatured.map((doctor, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={doctor.image || "/placeholder.svg"}
                  alt={doctor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
              </div>

              <div className="p-6">
                <h4 className="text-xl font-bold text-foreground mb-1">{doctor.name}</h4>
                <p className="text-primary font-semibold mb-4">{doctor.specialty}</p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <a
                    href={doctor.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-semibold hover:bg-secondary/80 transition-all"
                  >
                    <MapPinned size={14} />
                    Ver
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?phone=${doctor.whatsapp}&text=Hola,%20${encodeURIComponent(doctor.name)},%20necesito%20agendar%20una%20cita`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-all"
                  >
                    <MessageCircle size={14} />
                    Agendar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
