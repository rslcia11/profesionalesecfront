"use client"

export default function CommunicationProfessionals() {
  const professionals = [
    {
      name: "Juan Martínez",
      specialty: "Periodismo",
      image: "/communication-journalist.jpg",
    },
    {
      name: "Laura Fernández",
      specialty: "Comunicación Estratégica",
      image: "/communication-strategist.jpg",
    },
    {
      name: "Carlos Gómez",
      specialty: "Producción Audiovisual",
      image: "/communication-producer.jpg",
    },
  ]

  return (
    <section id="comunicadores-destacados" className="py-24 md:py-32 px-4 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">Comunicadores destacados del mes</h2>
          <p className="text-lg text-muted-foreground">Profesionales reconocidos por su creatividad y expertise</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {professionals.map((professional, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl mb-6 h-96 bg-gradient-to-br from-primary/20 to-accent/20">
                <img
                  src={professional.image || "/placeholder.svg"}
                  alt={professional.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-1">{professional.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{professional.specialty}</p>
              <button className="text-primary text-sm font-medium hover:underline">Ver perfil →</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
