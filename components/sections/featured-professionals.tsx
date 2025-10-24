export function FeaturedProfessionals() {
  const professionals = [
    {
      id: 1,
      name: "Profesional Destacado",
      specialty: "Ingeniería",
      image: "/professional-engineer.png",
    },
    {
      id: 2,
      name: "Profesional Destacado",
      specialty: "Medicina",
      image: "/professional-doctor.jpg",
    },
    {
      id: 3,
      name: "Profesional Destacado",
      specialty: "Derecho",
      image: "/professional-lawyer.png",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-black">Profesionales destacados del mes</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {professionals.map((professional) => (
            <div key={professional.id} className="group cursor-pointer">
              <div className="relative h-80 rounded-lg overflow-hidden mb-4">
                <img
                  src={professional.image || "/placeholder.svg"}
                  alt={professional.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-bold text-black mb-1">{professional.name}</h3>
              <p className="text-gray-600">{professional.specialty}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
