"use client"

import {
  Smile,
  Apple,
  Stethoscope,
  Radiation,
  Activity,
  Heart,
  FlaskConical,
  Bone,
  Radio,
  Footprints,
  Baby,
  Users,
  Eye,
  Pill,
  Ear,
  PersonStanding,
  Waves,
  ShieldCheck,
  Bug,
  UserRound,
  Crown,
  UserPlus,
  Utensils,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export default function MedicosCategories() {
  const categories = [
    { id: "odontologia", name: "Odontología", icon: Smile, available: true },
    { id: "nutricion", name: "Nutrición", icon: Apple, available: true },
    { id: "medicina-general", name: "Medicina General", icon: Stethoscope, available: true },
    { id: "dermatologia", name: "Dermatología", icon: Radiation, available: true },
    { id: "urologia", name: "Urología", icon: Activity, available: true },
    { id: "cardiologia", name: "Cardiología", icon: Heart, available: true },
    { id: "toxicologia", name: "Toxicología", icon: FlaskConical, available: true },
    { id: "traumatologia", name: "Traumatología", icon: Bone, available: true },
    { id: "radiologia", name: "Radiología", icon: Radio, available: true },
    { id: "reumatologia", name: "Reumatología", icon: Footprints, available: true },
    { id: "pediatria", name: "Pediatría", icon: Baby, available: true },
    { id: "proctologia", name: "Proctología", icon: Users, available: true },
    { id: "oftalmologia", name: "Oftalmología", icon: Eye, available: true },
    { id: "oncologia", name: "Oncología", icon: Pill, available: true },
    { id: "otorrinolaringologia", name: "Otorrinolaringología", icon: Ear, available: true },
    { id: "nefrologia", name: "Nefrología", icon: PersonStanding, available: false },
    { id: "neumologia", name: "Neumología", icon: Waves, available: true },
    { id: "inmunologia", name: "Inmunología", icon: ShieldCheck, available: true },
    { id: "infectologia", name: "Infectología", icon: Bug, available: true },
    { id: "geriatria", name: "Geriatría", icon: UserRound, available: true },
    { id: "ginecologia", name: "Ginecología", icon: Crown, available: true },
    { id: "enfermeria", name: "Enfermería", icon: UserPlus, available: true },
    { id: "gastroenterologia", name: "Gastroenterología", icon: Utensils, available: true },
    { id: "endocrinologia", name: "Endocrinología", icon: Activity, available: true },
    { id: "medicina-especializada", name: "Medicina Especializada", icon: Sparkles, available: true },
  ]

  return (
    <section id="categorias" className="py-24 md:py-32 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Servicios Profesionales</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encuentra al especialista que necesitas. Todos nuestros profesionales están verificados.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            const href = category.available ? `/medicos/${category.id}` : "#proximamente"

            return (
              <Link
                key={category.id}
                href={href}
                className={`group relative p-6 rounded-xl border border-border/50 transition-all duration-300 ${
                  category.available
                    ? "hover:border-primary/30 hover:bg-primary/5 cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex flex-col items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Icon className="text-primary w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{category.name}</h3>
                  </div>

                  <div className="w-full">
                    {category.available ? (
                      <span className="text-sm font-medium text-primary group-hover:underline">
                        Ver médicos disponibles →
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">Próximamente</span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
