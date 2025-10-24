"use client"

import { useState, useEffect } from "react"
import { Mail, Facebook, Instagram } from "lucide-react"

export function TopBar() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Hide top bar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 bg-black text-white transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Mail size={16} />
          <a href="mailto:info@profesionales.ec" className="hover:text-gray-300 transition">
            info@profesionales.ec
          </a>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition"
            aria-label="Facebook"
          >
            <Facebook size={18} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </a>
        </div>
      </div>
    </div>
  )
}
