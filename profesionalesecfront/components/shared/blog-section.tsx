import Link from "next/link"
import { BookOpen, Quote, ArrowRight } from "lucide-react"

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  image: string
  date: string
  readTime: string
  author: string
  role: string
}

interface BlogSectionProps {
  posts: BlogPost[]
}

export default function BlogSection({ posts }: BlogSectionProps) {
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
            href={`/consejos/${post.slug}`}
            className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-6"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-60" />

              {/* Quote Icon */}
              <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm p-2 rounded-full">
                <Quote className="text-primary-foreground" size={20} />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span>{post.date}</span>
                <span>{post.readTime} lectura</span>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>

              {/* Author Info */}
              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{post.author}</p>
                    <p className="text-xs text-muted-foreground">{post.role}</p>
                  </div>
                  <button className="group/btn p-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
                    <ArrowRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <Link
          href="/consejos"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-95 group"
        >
          Ver todos los consejos
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  )
}
