"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { BookOpen, Quote, ArrowRight } from "lucide-react"
import { articulosApi, type Articulo } from "@/lib/api"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface BlogSectionProps {
  professionIds?: number[]
  limit?: number
}

interface BlogCard {
  id: number
  title: string
  excerpt: string
  image: string
  date: string
  readTime: string
  author: string
  role: string
}

function pickRoleFromAutor(autor: Articulo["autor"]): string {
  const perfil = autor?.perfiles_profesionales?.[0]
  if (perfil?.especialidad?.nombre) return perfil.especialidad.nombre
  if (perfil?.profesion?.nombre) return perfil.profesion.nombre
  return "Profesional verificado"
}

function articuloToCard(a: Articulo): BlogCard {
  const words = a.contenido?.split(/\s+/).length || 0
  const minutes = Math.max(1, Math.ceil(words / 200))
  let dateStr = ""
  try {
    dateStr = format(new Date(a.fecha_publicacion), "d 'de' MMMM 'de' yyyy", { locale: es })
  } catch {
    dateStr = a.fecha_publicacion
  }
  const fallbackExcerpt = a.contenido ? a.contenido.substring(0, 150) + "..." : ""
  return {
    id: a.id,
    title: a.titulo,
    excerpt: a.resumen || fallbackExcerpt,
    image: a.imagen_url || "",
    date: dateStr,
    readTime: `${minutes} min`,
    author: a.autor?.nombre || "Profesional",
    role: pickRoleFromAutor(a.autor),
  }
}

export default function BlogSection({ professionIds, limit = 3 }: BlogSectionProps) {
  const [posts, setPosts] = useState<BlogCard[]>([])
  const [loaded, setLoaded] = useState(false)

  // Serializamos para evitar refetch en cada render del padre.
  const idsKey = useMemo(() => (professionIds ?? []).join(","), [professionIds])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const result = await articulosApi.listarPublicados({
          profesionIds: professionIds && professionIds.length > 0 ? professionIds : undefined,
          limit,
        })
        if (cancelled) return
        setPosts(result.data.map(articuloToCard))
      } catch (error) {
        console.error("Error loading articles:", error)
        if (!cancelled) setPosts([])
      } finally {
        if (!cancelled) setLoaded(true)
      }
    }

    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, limit])

  // No renderizar la sección si no hay artículos reales — regla "solo lo que existe".
  if (loaded && posts.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20 bg-background">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-4">
          <BookOpen className="text-accent" size={20} />
          <span className="text-sm font-semibold text-accent">Blog</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Consejos de Profesionales</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Aprende tips prácticos y valiosos de nuestros expertos para mejorar tu día a día
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {posts.map((post, index) => (
          <Link
            key={post.id}
            href={`/articulos/${post.id}`}
            className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-6"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="text-primary/30" size={48} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-60" />

              <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm p-2 rounded-full">
                <Quote className="text-primary-foreground" size={20} />
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span>{post.date}</span>
                <span>{post.readTime} lectura</span>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>

              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{post.author}</p>
                    <p className="text-xs text-muted-foreground">{post.role}</p>
                  </div>
                  <button
                    className="group/btn p-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
                    aria-label="Leer artículo"
                  >
                    <ArrowRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <Link
          href="/articulos"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-95 group"
        >
          Ver todos los artículos
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  )
}
