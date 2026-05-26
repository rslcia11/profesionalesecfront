import {
  LayoutDashboard,
  Calendar,
  FileText,
  Briefcase,
  Clock,
  Share2,
  Settings,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type ProfesionalNavItem = {
  href: string
  label: string
  icon: LucideIcon
}

export const PROFESIONAL_NAV_ITEMS: ProfesionalNavItem[] = [
  { href: "/dashboard/profesional", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/profesional/citas", label: "Citas", icon: Calendar },
  { href: "/dashboard/profesional/articulos", label: "Artículos", icon: FileText },
  { href: "/dashboard/profesional/servicios", label: "Servicios", icon: Briefcase },
  { href: "/dashboard/profesional/horario", label: "Horario", icon: Clock },
  { href: "/dashboard/profesional/redes", label: "Redes Sociales", icon: Share2 },
  { href: "/dashboard/profesional/configuracion", label: "Configuración", icon: Settings },
]
