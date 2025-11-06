export default function About() {
  return (
    <section id="nosotros" className="py-24 md:py-32 px-4 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative h-96 md:h-full rounded-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
              alt="Nosotros"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <span className="text-primary font-semibold text-xs tracking-widest uppercase mb-4 block">
              Sobre nosotros
            </span>

            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-foreground">Tu plataforma de confianza</h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              En Profesionales.EC creemos en conectar talento con oportunidades. Nuestra misión es proporcionar una
              plataforma segura, confiable y de fácil uso para que profesionales de Ecuador prosperen.
            </p>

            <div className="space-y-6 mb-10">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Misión</h3>
                <p className="text-muted-foreground text-sm">
                  Impulsar el desarrollo profesional en Ecuador proporcionando una plataforma segura y confiable para
                  conectar expertos con oportunidades.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Visión</h3>
                <p className="text-muted-foreground text-sm">
                  Ser la principal red de profesionales reconocida por calidad, confianza y excelencia.
                </p>
              </div>
            </div>

            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all text-sm">
              Más información
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
