import Link from "next/link"
import type { LucideIcon } from "lucide-react"

export interface ServiceCategory {
  id: string | number
  name: string
  description: string
  icon: LucideIcon
  count?: number
  professionId: number
  specialtyId: number
}

interface ProfessionalServicesGridProps {
  title: string
  subtitle: string
  categories: ServiceCategory[]
  emptyMessage?: string
}

function buildHref(category: ServiceCategory): string {
  const params = new URLSearchParams()
  params.set("profesion_id", String(category.professionId))
  params.set("especialidad_id", String(category.specialtyId))
  return `/profesionales?${params.toString()}`
}

export default function ProfessionalServicesGrid({
  title,
  subtitle,
  categories,
  emptyMessage = "Aún no hay especialidades registradas para esta categoría.",
}: ProfessionalServicesGridProps) {
  return (
    <section className="py-16 md:py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl">{subtitle}</p>
        </div>

        {categories.length === 0 ? (
          <div className="bg-card border-2 border-dashed border-border rounded-2xl p-12 text-center">
            <p className="text-muted-foreground text-lg mb-4">{emptyMessage}</p>
            <Link
              href="/profesionales"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all"
            >
              Ver todos los profesionales
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, idx) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.id}
                  href={buildHref(category)}
                  className="group p-8 bg-card border-2 border-border rounded-2xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-6 cursor-pointer"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <Icon className="text-primary group-hover:text-primary-foreground transition-colors" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{category.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    {category.count !== undefined && category.count > 0 ? (
                      <span className="text-sm text-muted-foreground">
                        {category.count} {category.count === 1 ? "profesional" : "profesionales"}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Aún sin profesionales</span>
                    )}
                    <span className="text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
                      Ver más →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
