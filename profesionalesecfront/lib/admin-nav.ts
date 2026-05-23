import {
  LayoutDashboard,
  Users,
  UserCheck,
  DollarSign,
  FileText,
  Landmark,
  Handshake,
  Image,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type AdminNavItem = {
  href: string
  label: string
  icon: LucideIcon
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/conversatorios", label: "Conversatorios", icon: Users },
  { href: "/admin/profesionales", label: "Profesionales", icon: UserCheck },
  { href: "/admin/planes", label: "Planes", icon: DollarSign },
  { href: "/admin/articulos", label: "Artículos", icon: FileText },
  { href: "/admin/bancos", label: "Bancos", icon: Landmark },
  { href: "/admin/convenios", label: "Convenios", icon: Handshake },
  { href: "/admin/carruseles", label: "Carruseles", icon: Image },
]