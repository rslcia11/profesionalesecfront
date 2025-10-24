"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const navItems = [
  { label: "INICIO", href: "#" },
  { label: "PROFESIONALES", href: "#profesionales" },
  { label: "EDUCACIÓN", href: "#educacion" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-12 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className={`text-2xl font-bold transition ${isScrolled ? "text-black" : "text-white"}`}>
            p<span className="text-sm">.ec</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition hover:opacity-70 ${
                  isScrolled ? "text-black" : "text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/crear-perfil"
              className={`text-sm font-medium underline transition hover:opacity-70 ${
                isScrolled ? "text-black" : "text-white"
              }`}
            >
              CREAR PERFIL PROFESIONAL
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            {isMobileMenuOpen ? (
              <X className={isScrolled ? "text-black" : "text-white"} />
            ) : (
              <Menu className={isScrolled ? "text-black" : "text-white"} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 space-y-3 pb-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block text-sm font-medium ${isScrolled ? "text-black" : "text-white"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/crear-perfil"
              className={`block text-sm font-medium ${isScrolled ? "text-black" : "text-white"}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              CREAR PERFIL PROFESIONAL
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
