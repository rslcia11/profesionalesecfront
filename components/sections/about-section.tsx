export function AboutSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left Column */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">¿Quiénes Somos?</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              En Profesionales Ecuador creemos en el poder de la excelencia, la educación continua y la colaboración
              entre expertos.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Somos una plataforma diseñada para conectar a profesionales de diversas áreas con personas, empresas e
              instituciones que valoran el conocimiento especializado y la formación de calidad.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Nuestro propósito es crear un espacio confiable donde el crecimiento profesional y la capacitación sean
              accesibles para todos.
            </p>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">p</span>
                </div>
                <h3 className="text-xl font-bold text-black">Misión</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Impulsar el desarrollo profesional en Ecuador y en la región, proporcionando difusión, capacitación y
                networking basada en altos estándares de calidad, ética y excelencia académica.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">p</span>
                </div>
                <h3 className="text-xl font-bold text-black">Visión</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Convertirnos en la principal red de profesionales en Ecuador, reconocida por su contribución activa al
                crecimiento educativo, social y empresarial del país.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
