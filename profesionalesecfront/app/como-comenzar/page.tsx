import Header from "@/components/header"
import Footer from "@/components/footer"
import { UserPlus, FileCheck, Clock, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ComoComenzar() {
  const steps = [
    {
      icon: UserPlus,
      title: "Paso 1: Regístrate",
      description:
        "Completa el formulario de registro con tus datos personales y profesionales. Elige entre el plan gratuito o el plan prioritario ($10 USD) para una revisión acelerada.",
      action: "Ir a Registro",
      link: "/preinscripcion",
    },
    {
      icon: FileCheck,
      title: "Paso 2: Sube tus documentos",
      description:
        "Adjunta tu cédula de identidad, títulos académicos y certificaciones profesionales. Estos documentos nos ayudan a verificar tu perfil y brindarte mayor credibilidad.",
      action: "",
      link: "",
    },
    {
      icon: Clock,
      title: "Paso 3: Espera la aprobación",
      description:
        "Nuestro equipo revisará tu perfil. Si elegiste el plan prioritario, tu solicitud será procesada en máximo 24 horas. El plan gratuito puede tomar algunos días adicionales.",
      action: "",
      link: "",
    },
    {
      icon: CheckCircle,
      title: "Paso 4: ¡Comienza a conectar!",
      description:
        "Una vez aprobado tu perfil, recibirás un correo de confirmación y podrás empezar a aparecer en nuestro directorio. Los clientes podrán contactarte directamente a través de la plataforma.",
      action: "Ver Profesionales",
      link: "/profesionales",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 bg-gradient-to-b from-black to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-oswald text-4xl md:text-6xl font-bold text-white mb-6 text-balance">
            ¿Cómo comenzar en Profesionales.ec?
          </h1>
          <p className="font-arimo text-lg md:text-xl text-gray-300 mb-8 text-pretty max-w-2xl mx-auto">
            Sigue estos sencillos pasos para formar parte de la red de profesionales certificados más grande de Ecuador
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-oswald text-2xl font-bold text-foreground mb-3">{step.title}</h3>
                    <p className="font-arimo text-muted-foreground leading-relaxed mb-4">{step.description}</p>

                    {step.action && step.link && (
                      <Link
                        href={step.link}
                        className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300"
                      >
                        {step.action}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>

                  {/* Step Number */}
                  <div className="absolute top-4 right-4 md:relative md:top-0 md:right-0">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <span className="font-oswald text-2xl font-bold text-muted-foreground">{index + 1}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-oswald text-3xl md:text-4xl font-bold text-foreground mb-6">
            Beneficios de formar parte de Profesionales.ec
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-oswald text-xl font-bold text-foreground mb-3">Visibilidad profesional</h3>
              <p className="font-arimo text-muted-foreground text-sm">
                Aparece en nuestro directorio donde clientes potenciales te encontrarán fácilmente
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="font-oswald text-xl font-bold text-foreground mb-3">Certificación verificada</h3>
              <p className="font-arimo text-muted-foreground text-sm">
                Tu perfil estará respaldado por nuestra verificación de credenciales
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-oswald text-xl font-bold text-foreground mb-3">Red de networking</h3>
              <p className="font-arimo text-muted-foreground text-sm">
                Accede a conversatorios y eventos para crecer profesionalmente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-oswald text-3xl md:text-4xl font-bold text-foreground mb-6">¿Listo para comenzar?</h2>
          <p className="font-arimo text-muted-foreground mb-8">
            Únete a cientos de profesionales que ya están creciendo con nosotros
          </p>
          <Link
            href="/preinscripcion"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Crear mi perfil profesional
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
