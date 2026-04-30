import Header from "@/components/header"
import Footer from "@/components/footer"
import { Users, Target, Eye, Award, Lightbulb, Shield, Heart, CheckCircle2 } from "lucide-react"

export default function SobreNosotrosPage() {
  const valores = [
    {
      icon: Award,
      title: "Excelencia",
      description: "Promovemos siempre lo mejor de cada profesional.",
    },
    {
      icon: Lightbulb,
      title: "Innovación",
      description: "Apostamos por la mejora continua y el uso de nuevas tecnologías.",
    },
    {
      icon: Shield,
      title: "Ética",
      description: "Actuamos con transparencia, respeto y responsabilidad.",
    },
    {
      icon: Heart,
      title: "Compromiso Social",
      description: "Buscamos impactar positivamente en nuestra sociedad.",
    },
  ]

  const razones = [
    "Somos un espacio de crecimiento y formación continua.",
    "Contamos con una red de expertos evaluados y certificados.",
    "Trabajamos bajo principios éticos y legales que protegen a todos nuestros usuarios.",
    "Nos comprometemos con tu desarrollo personal y profesional.",
  ]

  const compromisos = [
    "Evaluamos cuidadosamente el perfil de cada profesional antes de su incorporación a la plataforma.",
    "Organizamos conversatorios y eventos con los más altos estándares de calidad.",
    "Fomentamos la actualización constante y la difusión de conocimientos a través de contenidos confiables y pertinentes.",
    "Protegemos y promovemos la imagen de nuestros profesionales, siempre respetando acuerdos claros y transparentes.",
  ]

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto divide-y divide-black/10">
          <section className="pb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-4">Profesionales Ecuador</p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-950 mb-6">Sobre Nosotros</h1>
            <p className="max-w-3xl text-base md:text-lg leading-relaxed text-slate-700">
              Somos una plataforma creada para conectar conocimiento, experiencia y oportunidades. Impulsamos la
              formación continua, la colaboración profesional y el crecimiento de expertos en distintas áreas.
            </p>
          </section>

          <section className="py-14 grid gap-10 md:grid-cols-2">
            <article>
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-slate-950">Misión</h2>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Impulsar el desarrollo profesional en Ecuador y en la región, proporcionando una plataforma de difusión,
                capacitación y networking basada en altos estándares de calidad, ética y excelencia académica.
              </p>
            </article>

            <article>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-slate-950">Visión</h2>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Convertirnos en la principal red de profesionales en Ecuador, reconocida por su contribución activa al
                crecimiento educativo, social y empresarial del país.
              </p>
            </article>
          </section>

          <section className="py-14 grid gap-10 lg:grid-cols-12">
            <article className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-5">
                <Users className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-slate-950">¿Quiénes Somos?</h2>
              </div>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  En <span className="text-primary font-semibold">Profesionales Ecuador</span> creemos en el poder de
                  la excelencia, la educación continua y la colaboración entre expertos.
                </p>
                <p>
                  Somos una plataforma diseñada para conectar a profesionales de diversas áreas con personas, empresas e
                  instituciones que valoran el conocimiento especializado y la formación de calidad.
                </p>
                <p className="text-slate-600 italic">
                  Nuestro propósito es crear un espacio confiable donde el crecimiento profesional y la capacitación sean
                  accesibles para todos.
                </p>
              </div>
            </article>

            <article className="lg:col-span-5 lg:border-l lg:border-black/10 lg:pl-8">
              <h2 className="text-2xl font-bold text-slate-950 mb-5">Nuestra Historia</h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  <span className="text-primary font-semibold">Profesionales Ecuador</span> nace de la visión
                  compartida del <span className="font-semibold text-slate-950">Ing. Terry Mendieta</span> y el{" "}
                  <span className="font-semibold text-slate-950">Ing. Juan Estrada</span>, quienes identificaron la
                  necesidad de un espacio serio y organizado para conectar a expertos de diferentes áreas.
                </p>
                <p>
                  Contamos además con el valioso apoyo del{" "}
                  <span className="font-semibold text-slate-950">Dr. Luis Gutiérrez</span> en nuestro primer
                  conversatorio, marcando el inicio de esta gran comunidad.
                </p>
                <p className="font-medium text-primary">
                  Desde entonces, hemos crecido consolidándonos como un referente en conversatorios, formación continua y
                  eventos de alta calidad.
                </p>
              </div>
            </article>
          </section>

          <section className="py-14">
            <h2 className="text-3xl font-bold text-slate-950 mb-8">Fundadores</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="pb-6 border-b border-black/10">
                <div className="w-14 h-14 border-2 border-primary text-primary rounded-full flex items-center justify-center text-lg font-bold mb-4">
                  TM
                </div>
                <h3 className="text-xl font-bold text-slate-950">Terry Mendieta</h3>
                <p className="text-primary font-medium text-sm">CEO / Fundador</p>
              </div>

              <div className="pb-6 border-b border-black/10">
                <div className="w-14 h-14 border-2 border-primary text-primary rounded-full flex items-center justify-center text-lg font-bold mb-4">
                  JE
                </div>
                <h3 className="text-xl font-bold text-slate-950">Juan Estrada</h3>
                <p className="text-primary font-medium text-sm">CEO / Fundador</p>
              </div>
            </div>
          </section>

          <section className="py-14">
            <h2 className="text-3xl font-bold text-slate-950 mb-8">Nuestros Valores</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {valores.map((valor, index) => {
                const Icon = valor.icon
                return (
                  <article key={index} className="pb-6 border-b border-black/10">
                    <div className="flex items-start gap-4">
                      <Icon className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <h3 className="text-lg font-bold text-slate-950 mb-2">{valor.title}</h3>
                        <p className="text-slate-700 text-sm leading-relaxed">{valor.description}</p>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="py-14 grid gap-10 lg:grid-cols-2">
            <article>
              <h2 className="text-3xl font-bold text-slate-950 mb-6">¿Por Qué Confiar en Profesionales Ecuador?</h2>
              <ul className="space-y-4">
                {razones.map((razon, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-700 leading-relaxed">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>{razon}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article>
              <h2 className="text-3xl font-bold text-slate-950 mb-6">Nuestro Compromiso</h2>
              <ul className="space-y-4">
                {compromisos.map((compromiso, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-700 leading-relaxed">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0"></span>
                    <span>{compromiso}</span>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section className="pt-14">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-950 mb-5">Conversatorios y Eventos</h2>
            <div className="border-l-2 border-primary pl-5 space-y-4 text-slate-700 leading-relaxed">
              <p>
                En cada evento, conversatorio o actividad organizada por{" "}
                <span className="text-primary font-semibold">Profesionales Ecuador</span>, los participantes autorizan
                la grabación de audio y video, así como la captura de fotografías.
              </p>
              <p>
                Estas grabaciones podrán ser utilizadas posteriormente con fines promocionales, educativos o comerciales,
                sin limitaciones territoriales ni temporales.
              </p>
              <p className="font-semibold text-slate-950">
                Importante: El profesional autoriza de manera gratuita el uso comercial de su imagen, salvo que se
                llegue a un acuerdo diferente por escrito en algún caso extraordinario. Todos los contenidos generados
                en nuestros conversatorios son propiedad de Profesionales Ecuador, salvo pacto en contrario formalizado
                por escrito.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
