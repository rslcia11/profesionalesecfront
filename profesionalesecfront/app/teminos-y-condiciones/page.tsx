"use client"

import { motion } from "framer-motion"
import {
    FileText,
    Shield,
    Scale,
    AlertCircle,
    CheckCircle2,
    Lock,
    Users,
    BookOpen,
    Brain,
    Eye,
    Gavel,
    Phone,
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function TerminosYCondicionesPage() {
    const sections = [
        {
            id: "introduccion",
            icon: FileText,
            title: "1. Introducción",
            content: `Bienvenido(a) a Profesionales Ecuador. Estos Términos y Condiciones regulan el acceso, uso y participación en nuestra plataforma digital (www.profesionales.ec) y en todos los servicios relacionados que ofrecemos.

Al acceder, navegar, registrarte o utilizar nuestros servicios, aceptas expresamente y sin reservas estar sujeto(a) a los presentes Términos y Condiciones, así como a nuestra Política de Privacidad y demás políticas aplicables.

Si no estás de acuerdo con estos términos, te solicitamos abstenerte de utilizar nuestros servicios.`,
        },
        {
            id: "informacion-general",
            icon: Shield,
            title: "2. Información General",
            content: `Profesionales Ecuador es una plataforma que promueve la visibilidad, conexión y desarrollo de profesionales en distintas áreas de especialización en el Ecuador.

Actuamos como intermediarios digitales, brindando espacios de exposición, formación y difusión profesional, sin asumir responsabilidad directa sobre los servicios ofrecidos por los profesionales registrados.`,
        },
        {
            id: "definiciones",
            icon: BookOpen,
            title: "3. Definiciones",
            content: `• "Plataforma": Sitio web, aplicaciones móviles y demás servicios digitales gestionados por Profesionales Ecuador.
• "Profesional": Persona evaluada y aceptada para formar parte de la plataforma y sus actividades.
• "Usuario": Cualquier persona que accede a consultar, interactuar o contratar a través de la plataforma.
• "Conversatorio": Evento de difusión y exposición profesional organizado por Profesionales Ecuador.
• "Contenido": Toda información, documentos, imágenes, videos, audios, textos, publicaciones y demás material disponible en la plataforma.`,
        },
        {
            id: "registro",
            icon: CheckCircle2,
            title: "4. Registro y Evaluación de Profesionales",
            content: `El acceso como profesional registrado en Profesionales Ecuador no es automático ni garantizado.

Evaluación previa: Todos los aspirantes a formar parte de la plataforma serán objeto de una evaluación exhaustiva realizada por el equipo de Profesionales Ecuador.

Se considerarán aspectos como:
• Formación académica verificada.
• Experiencia profesional demostrable.
• Reputación, referencias y trayectoria.
• Cumplimiento ético y profesional.

Profesionales Ecuador se reserva el derecho exclusivo de aceptar o rechazar solicitudes sin necesidad de justificar su decisión, en resguardo de la calidad y reputación de la plataforma.

El profesional garantiza que toda información proporcionada es fidedigna, actualizada, legalmente verificable y que no vulnera derechos de terceros.`,
        },
        {
            id: "perfiles",
            icon: Users,
            title: "5. Perfiles Profesionales",
            content: `Al registrarse y aceptar su incorporación, el profesional:

• Autoriza expresamente a Profesionales Ecuador a publicar y difundir su perfil, incluyendo:
  - Nombre completo.
  - Imagen personal.
  - Formación académica, experiencia, certificaciones y otros datos profesionales relevantes.

• Dicha autorización incluye el uso de los datos para:
  - Promoción dentro y fuera de la plataforma.
  - Material publicitario, educativo o institucional.
  - Campañas de marketing, comunicaciones en redes sociales, medios digitales, impresos o audiovisuales.

Esta cesión de derechos de imagen y datos profesionales es gratuita, ilimitada en tiempo y territorio, y no generará contraprestaciones económicas salvo que se acuerde expresamente por escrito.`,
        },
        {
            id: "conversatorios",
            icon: Brain,
            title: "6. Conversatorios y Eventos",
            content: `Al inscribirse o participar en cualquier conversatorio, seminario, webinar o evento organizado por Profesionales Ecuador, el participante acepta y autoriza expresamente lo siguiente:

• La grabación total o parcial de audio y video del evento.
• La captura de fotografías durante el desarrollo del evento.
• El uso, reproducción, distribución y difusión de dichas grabaciones e imágenes con fines promocionales, educativos o comerciales, sin limitaciones territoriales ni temporales.

Asimismo:

• Los contenidos generados en los conversatorios (grabaciones, imágenes, presentaciones, intervenciones de los participantes) serán propiedad exclusiva de Profesionales Ecuador, salvo pacto escrito en contrario.
• El participante renuncia expresamente a reclamar derechos patrimoniales, compensaciones económicas o contraprestaciones por el uso de dicho contenido.

Nota: El profesional autoriza el uso comercial sin compensación económica, salvo que se llegue por escrito a otro tipo de acuerdo en algún caso extraordinario.`,
        },
        {
            id: "propiedad",
            icon: Lock,
            title: "7. Propiedad Intelectual",
            content: `Todo el contenido de la plataforma, incluyendo pero no limitado a textos, gráficos, logos, íconos, imágenes, clips de audio, clips de video, descargas digitales, compilaciones de datos y software, es propiedad exclusiva de Profesionales Ecuador o de sus proveedores de contenido, y está protegido por las leyes nacionales e internacionales sobre propiedad intelectual.

Está estrictamente prohibido copiar, reproducir, distribuir, modificar o crear obras derivadas de cualquier material sin autorización escrita de Profesionales Ecuador.`,
        },
        {
            id: "licencia",
            icon: FileText,
            title: "8. Licencia Limitada",
            content: `Profesionales Ecuador otorga a los usuarios una licencia limitada, revocable, no exclusiva y no transferible para acceder y utilizar los servicios ofrecidos exclusivamente para fines personales, informativos y no comerciales, conforme a los presentes términos.

Cualquier uso no autorizado cancelará automáticamente la licencia concedida.`,
        },
        {
            id: "conducta",
            icon: AlertCircle,
            title: "9. Conducta del Usuario y Obligaciones",
            content: `El usuario o profesional registrado se compromete a:

• Utilizar la plataforma conforme a la legislación vigente y a los principios de buena fe y conducta ética.
• No publicar ni difundir información falsa, inexacta, ilícita o que infrinja derechos de terceros.
• No realizar actos de suplantación de identidad ni de apropiación indebida de datos o contenidos de otros usuarios.

Cualquier incumplimiento podrá conllevar la suspensión inmediata del acceso a la plataforma y las acciones legales correspondientes.`,
        },
        {
            id: "seguridad",
            icon: Shield,
            title: "10. Seguridad y Protección de Cuentas",
            content: `Cada usuario es responsable exclusivo de mantener la confidencialidad de sus credenciales de acceso (usuario y contraseña), así como de todas las actividades que ocurran bajo su cuenta.

Profesionales Ecuador no será responsable de pérdidas o daños derivados del uso indebido de las credenciales por parte del usuario o de terceros.`,
        },
        {
            id: "membresias",
            icon: CheckCircle2,
            title: "11. Membresías, Pagos y Tarifas",
            content: `Algunos servicios o eventos ofrecidos por Profesionales Ecuador podrán estar sujetos a tarifas, pagos por membresías o acceso restringido.

• Todas las tarifas aplicables serán claramente informadas antes de la contratación o inscripción.
• Profesionales Ecuador se reserva el derecho de actualizar precios o condiciones de acceso en cualquier momento.
• Los pagos no son reembolsables, salvo disposición legal específica o error imputable a Profesionales Ecuador.`,
        },
        {
            id: "limitaciones",
            icon: AlertCircle,
            title: "12. Limitaciones de Responsabilidad",
            content: `Profesionales Ecuador:

• No garantiza la disponibilidad continua, sin errores ni interrupciones de su plataforma o servicios.
• No se hace responsable de los resultados obtenidos por el usuario como consecuencia de la interacción o contratación de profesionales a través de la plataforma.
• No asume responsabilidad por daños indirectos, incidentales, especiales, consecuentes o punitivos relacionados con el uso de la plataforma.

El usuario acepta que utiliza la plataforma bajo su propio riesgo.`,
        },
        {
            id: "garantias",
            icon: Eye,
            title: "13. Exclusión de Garantías",
            content: `La plataforma y sus servicios se proporcionan "TAL CUAL" y "SEGÚN DISPONIBILIDAD", sin garantías de ningún tipo, ya sean expresas o implícitas, incluyendo pero no limitándose a garantías de comerciabilidad, idoneidad para un propósito particular o no infracción.`,
        },
        {
            id: "modificaciones",
            icon: FileText,
            title: "14. Modificaciones",
            content: `Profesionales Ecuador podrá modificar en cualquier momento:

• Estos Términos y Condiciones.
• Las características, funcionalidades y servicios ofrecidos.

Las modificaciones entrarán en vigencia desde su publicación en la plataforma. El uso continuado de los servicios implicará la aceptación tácita de las nuevas condiciones.`,
        },
        {
            id: "proteccion-datos",
            icon: Lock,
            title: "15. Protección de Datos Personales",
            content: `Profesionales Ecuador se compromete al tratamiento ético, seguro y conforme a la legislación ecuatoriana vigente de todos los datos personales recopilados.

Para más información, el usuario debe consultar la Política de Privacidad disponible en la plataforma.`,
        },
        {
            id: "enlaces",
            icon: Shield,
            title: "16. Enlaces Externos",
            content: `Nuestra plataforma puede contener enlaces a sitios web de terceros. Profesionales Ecuador no controla, respalda ni asume responsabilidad sobre el contenido, políticas de privacidad o prácticas de dichos sitios.`,
        },
        {
            id: "indemnizacion",
            icon: Scale,
            title: "17. Indemnización",
            content: `El usuario se compromete a indemnizar, defender y mantener indemne a Profesionales Ecuador, sus directores, colaboradores y aliados frente a cualquier reclamo, pérdida, daño, responsabilidad, costo o gasto (incluidos honorarios legales) derivados del incumplimiento de estos Términos y Condiciones o del uso indebido de la plataforma.`,
        },
        {
            id: "legislacion",
            icon: Gavel,
            title: "18. Legislación Aplicable y Jurisdicción",
            content: `Este contrato se regirá e interpretará conforme a las leyes vigentes en la República del Ecuador.

Toda controversia o disputa que se derive del presente acuerdo será resuelta ante los tribunales de la ciudad de Loja, renunciando expresamente las partes a cualquier otro fuero que pudiera corresponderles.`,
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
            <Header />

            <main className="pt-24 pb-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                            <Scale className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-blue-400 font-medium">Términos Legales</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            Términos y <span className="text-blue-400">Condiciones</span>
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            Fecha de última actualización: 20 de febrero de 2025
                        </p>
                    </motion.div>

                    <div className="space-y-6">
                        {sections.map((section, index) => {
                            const Icon = section.icon
                            return (
                                <motion.div
                                    key={section.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{section.title}</h2>
                                            <div className="text-gray-300 leading-relaxed whitespace-pre-line">{section.content}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="mt-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8"
                    >
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                <Phone className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-4">19. Contacto</h2>
                                <p className="text-gray-300 mb-6">
                                    Para cualquier duda, comentario, solicitud o reclamo relacionado con estos Términos y Condiciones,
                                    puede contactarnos a:
                                </p>
                            </div>
                        </div>
                        <div className="space-y-3 ml-16">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <span className="text-blue-400">📞</span>
                                </div>
                                <span className="text-white">Teléfono de contacto: 0994147639</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <span className="text-blue-400">📧</span>
                                </div>
                                <a href="mailto:info@profesionales.ec" className="text-blue-400 hover:text-blue-300 transition-colors">
                                    info@profesionales.ec
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
