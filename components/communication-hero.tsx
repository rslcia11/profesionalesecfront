"use client"

export default function CommunicationHero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center bg-black/40 overflow-hidden pt-20">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `url('/communication-professionals.jpg')`,
        }}
      />
      <div className="absolute inset-0 -z-10 bg-black/50" />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <div className="mb-6 text-emerald-400 font-medium text-sm tracking-widest">Expertos en comunicación en Pec</div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Impulsa tu mensaje
          <br />
          Con los mejores
        </h1>

        <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
          Acceso a profesionales especializados en periodismo, comunicación estratégica y producción audiovisual.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all">
            Buscar Comunicador
          </button>
          <button className="px-8 py-4 border border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition-all">
            Crear Perfil
          </button>
        </div>
      </div>
    </section>
  )
}
