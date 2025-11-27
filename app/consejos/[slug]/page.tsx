"use client"
import { use } from "react"
import { ArrowLeft, Clock, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

const blogPostsData = {
  "5-claves-contabilidad-eficiente": {
    id: 1,
    title: "5 Claves para una Contabilidad Eficiente",
    author: "María Fernanda Castro",
    role: "Contadora Pública",
    authorImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=600&fit=crop",
    date: "15 Nov 2024",
    readTime: "5 min",
    category: "Contabilidad",
    content: `
      <h2>La organización es fundamental</h2>
      <p>Mantener tus documentos ordenados digitalmente es el primer paso hacia una contabilidad eficiente. Utiliza herramientas digitales para escanear y archivar facturas, recibos y documentos importantes.</p>
      
      <h2>Reconcilia tus cuentas mensualmente</h2>
      <p>No esperes al final del año para revisar tus cuentas. La reconciliación mensual te permite detectar errores a tiempo y mantener un control real de tu situación financiera.</p>
      
      <h2>Separa las finanzas personales de las empresariales</h2>
      <p>Este es uno de los errores más comunes. Mantén cuentas bancarias separadas y nunca mezcles gastos personales con los de tu negocio. Esto simplificará enormemente tu contabilidad y declaraciones de impuestos.</p>
      
      <h2>Automatiza procesos</h2>
      <p>Existen múltiples herramientas que pueden automatizar tareas repetitivas como la emisión de facturas, el seguimiento de gastos y la generación de reportes financieros.</p>
      
      <h2>Busca asesoría profesional</h2>
      <p>Un contador profesional no es un gasto, es una inversión. Te ayudará a optimizar impuestos, evitar multas y tomar decisiones financieras informadas para tu negocio.</p>
    `,
  },
  "invertir-dinero-forma-inteligente": {
    id: 2,
    title: "Cómo Invertir tu Dinero de Forma Inteligente",
    author: "Luis Aguirre",
    role: "Asesor de Inversiones",
    authorImage: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=600&fit=crop",
    date: "12 Nov 2024",
    readTime: "7 min",
    category: "Finanzas",
    content: `
      <h2>Diversifica siempre tu portafolio</h2>
      <p>El principio básico de la inversión inteligente es la diversificación. No pongas todos tus huevos en una sola canasta. Distribuye tus inversiones entre diferentes clases de activos: acciones, bonos, bienes raíces y fondos mutuos.</p>
      
      <h2>Inversiones a largo plazo</h2>
      <p>El tiempo es tu mejor aliado en las inversiones. Las inversiones a largo plazo (5-10 años o más) tienden a generar mejores rendimientos y te permiten superar la volatilidad del mercado.</p>
      
      <h2>Fondo de emergencia primero</h2>
      <p>Antes de invertir, asegúrate de tener un fondo de emergencia que cubra de 3 a 6 meses de gastos. Esto te dará tranquilidad y evitará que tengas que liquidar inversiones en momentos desfavorables.</p>
      
      <h2>Educa tu educación financiera</h2>
      <p>Invierte en tu educación financiera. Lee libros, toma cursos y mantente informado sobre los mercados. Cuanto más sepas, mejores decisiones tomarás.</p>
      
      <h2>Consulta con expertos</h2>
      <p>Un asesor financiero certificado puede ayudarte a crear un plan de inversión personalizado según tus objetivos, tolerancia al riesgo y horizonte temporal.</p>
    `,
  },
  "gestion-talento-equipos-remotos": {
    id: 3,
    title: "Gestión del Talento en Equipos Remotos",
    author: "Andrea Villacrés",
    role: "Especialista en RRHH",
    authorImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop",
    date: "08 Nov 2024",
    readTime: "6 min",
    category: "Recursos Humanos",
    content: `
      <h2>Comunicación clara y frecuente</h2>
      <p>La comunicación es aún más crítica en equipos remotos. Establece canales claros, usa herramientas de videoconferencia regularmente y asegúrate de que todos entiendan sus responsabilidades.</p>
      
      <h2>Objetivos medibles y claros</h2>
      <p>En el trabajo remoto, los resultados importan más que las horas. Establece KPIs claros y medibles para cada miembro del equipo y revísalos regularmente.</p>
      
      <h2>Celebra los logros</h2>
      <p>No olvides reconocer y celebrar los logros del equipo. Las celebraciones virtuales, los reconocimientos públicos y las recompensas mantienen la motivación alta.</p>
      
      <h2>Cultura organizacional a distancia</h2>
      <p>Fomentar la cultura de empresa requiere esfuerzo extra en equipos remotos. Organiza actividades virtuales, espacios informales de conversación y mantén los valores de la empresa presentes en todas las interacciones.</p>
      
      <h2>Herramientas adecuadas</h2>
      <p>Invierte en las herramientas correctas: plataformas de gestión de proyectos, software de comunicación y sistemas de seguimiento que faciliten el trabajo colaborativo.</p>
    `,
  },
}

export default function ConsejoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const post = blogPostsData[slug as keyof typeof blogPostsData]

  // Get other posts for recommendations
  const otherPosts = Object.entries(blogPostsData)
    .filter(([key]) => key !== slug)
    .slice(0, 2)

  return (
    <div className="w-full bg-background">
      <Header />

      {/* Hero Image */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={post?.image || "/placeholder.svg?height=600&width=1200"}
          alt={post?.title || "Consejo"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </section>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 md:px-6 -mt-32 relative z-10">
        <div className="bg-card rounded-2xl p-8 md:p-12 border border-border/50 shadow-2xl">
          {/* Back Button */}
          <Link
            href="/consejos"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Volver a consejos
          </Link>

          {/* Category Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <span className="text-sm font-semibold text-primary">{post?.category}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{post?.title}</h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 pb-8 mb-8 border-b border-border/50">
            <div className="flex items-center gap-3">
              <img
                src={post?.authorImage || "/placeholder.svg?height=48&width=48"}
                alt={post?.author || "Autor"}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-foreground">{post?.author}</p>
                <p className="text-sm text-muted-foreground">{post?.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={16} />
              {post?.date}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={16} />
              {post?.readTime} de lectura
            </div>
          </div>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: post?.content || "" }}
          />
        </div>

        {/* Other Posts */}
        <section className="mt-16 mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Otros consejos que te pueden interesar</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {otherPosts.map(([slug, otherPost]) => (
              <Link
                key={otherPost.id}
                href={`/consejos/${slug}`}
                className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={otherPost.image || "/placeholder.svg?height=192&width=400"}
                    alt={otherPost.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-xs font-semibold text-primary-foreground">{otherPost.category}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {otherPost.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{otherPost.author}</span>
                    <div className="flex items-center gap-2 text-primary font-medium">
                      Leer más
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </article>

      <Footer />
    </div>
  )
}
