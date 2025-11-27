"use client"

import { BookOpen, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

const allBlogPosts = [
  {
    id: 1,
    slug: "5-claves-contabilidad-eficiente",
    title: "5 Claves para una Contabilidad Eficiente",
    author: "María Fernanda Castro",
    role: "Contadora Pública",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop",
    excerpt:
      "La organización es fundamental. Mantén tus documentos ordenados digitalmente, reconcilia tus cuentas mensualmente y siempre separa las finanzas personales de las empresariales.",
    date: "15 Nov 2024",
    readTime: "5 min",
    category: "Contabilidad",
  },
  {
    id: 2,
    slug: "invertir-dinero-forma-inteligente",
    title: "Cómo Invertir tu Dinero de Forma Inteligente",
    author: "Luis Aguirre",
    role: "Asesor de Inversiones",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop",
    excerpt:
      "Diversifica siempre tu portafolio. No pongas todos tus huevos en una sola canasta. Considera inversiones a largo plazo y mantén un fondo de emergencia antes de invertir.",
    date: "12 Nov 2024",
    readTime: "7 min",
    category: "Finanzas",
  },
  {
    id: 3,
    slug: "gestion-talento-equipos-remotos",
    title: "Gestión del Talento en Equipos Remotos",
    author: "Andrea Villacrés",
    role: "Especialista en RRHH",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    excerpt:
      "La comunicación clara y frecuente es clave. Establece objetivos medibles, celebra los logros del equipo y fomenta la cultura organizacional incluso a distancia.",
    date: "08 Nov 2024",
    readTime: "6 min",
    category: "Recursos Humanos",
  },
  {
    id: 4,
    slug: "marketing-digital-pymes",
    title: "Marketing Digital para PYMEs: Guía Completa",
    author: "Carlos Montero",
    role: "Director de Marketing Digital",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    excerpt:
      "Las redes sociales y el SEO son tus mejores aliados. Define tu público objetivo, crea contenido de valor y mide tus resultados constantemente para optimizar tu estrategia.",
    date: "05 Nov 2024",
    readTime: "8 min",
    category: "Marketing",
  },
  {
    id: 5,
    slug: "negociacion-efectiva-empresa",
    title: "Técnicas de Negociación Efectiva en los Negocios",
    author: "Patricia Morales",
    role: "Consultora de Negocios",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop",
    excerpt:
      "Escucha activamente, prepara tus argumentos con datos y busca siempre soluciones ganar-ganar. La negociación no es sobre ganar, es sobre crear valor para ambas partes.",
    date: "01 Nov 2024",
    readTime: "6 min",
    category: "Administración",
  },
  {
    id: 6,
    slug: "comercio-internacional-exportar",
    title: "Cómo Empezar a Exportar: Primeros Pasos",
    author: "Daniel Ortega",
    role: "Especialista en Comercio Exterior",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=600&fit=crop",
    excerpt:
      "Investiga los mercados objetivo, cumple con las normativas y certificaciones necesarias. El comercio internacional requiere planificación y conocimiento de los procesos aduaneros.",
    date: "28 Oct 2024",
    readTime: "9 min",
    category: "Negocios Internacionales",
  },
]

export default function ConsejosPage() {
  return (
    <div className="w-full bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <BookOpen className="text-primary" size={20} />
            <span className="text-sm font-semibold text-primary">Blog de Profesionales</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Consejos de Expertos</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aprende de los mejores profesionales con artículos prácticos para tu día a día
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allBlogPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/consejos/${post.slug}`}
              className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="text-xs font-semibold text-primary-foreground">{post.category}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{post.author}</p>
                    <p className="text-xs text-muted-foreground">{post.role}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock size={14} />
                    {post.readTime}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-primary font-medium group-hover:gap-2 transition-all">
                  <span>Leer más</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
