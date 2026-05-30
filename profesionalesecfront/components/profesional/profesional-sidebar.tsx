"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { PROFESIONAL_NAV_ITEMS } from "@/lib/profesional-nav"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

const COLLAPSED_WIDTH = 70
const EXPANDED_WIDTH = 312

type ProfesionalSidebarProps = {
  expanded: boolean
  onToggle: () => void
}

export default function ProfesionalSidebar({ expanded, onToggle }: ProfesionalSidebarProps) {
  const pathname = usePathname()

  return (
    <nav
      className="hidden lg:flex flex-col fixed top-0 left-0 h-full z-40 bg-white border-r border-gray-200 shadow-lg transition-[width] duration-300 ease-in-out"
      style={{
        width: expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
        overflow: "hidden",
      }}
    >
      <div
        className={cn(
          "mt-16 flex items-center pt-3",
          expanded ? "justify-between gap-3 px-3" : "justify-center px-0"
        )}
      >
        <span
          className={cn(
            "overflow-hidden whitespace-nowrap font-heading text-2xl font-semibold text-gray-900 transition-[opacity,width] duration-300 ease-in-out",
            expanded ? "w-auto opacity-100" : "w-0 opacity-0"
          )}
        >
          Menu
        </span>
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900",
            expanded ? "h-9 w-9 shrink-0" : "h-10 w-10"
          )}
          aria-label={expanded ? "Contraer sidebar" : "Expandir sidebar"}
        >
          {expanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex flex-col gap-1 px-2 py-4 mt-4">
        {PROFESIONAL_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard/profesional"
              ? pathname === "/dashboard/profesional"
              : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "relative flex items-center rounded-lg text-sm font-medium py-2.5 transition-colors whitespace-nowrap",
                expanded ? "gap-3 px-3" : "justify-center px-0",
                isActive
                  ? "text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              {isActive && (
                <span className="absolute inset-0 rounded-lg bg-blue-600 -z-10" />
              )}
              <Icon className="h-5 w-5 shrink-0" />
              <span
                className={cn(
                  "overflow-hidden transition-[opacity,width] duration-300 ease-in-out",
                  expanded && "text-sm font-medium",
                  isActive ? "text-white" : "text-gray-900"
                )}
                style={{
                  opacity: expanded ? 1 : 0,
                  width: expanded ? "auto" : 0,
                }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
