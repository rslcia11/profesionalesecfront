import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border/30 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">P</span>
              </div>
              <span className="font-bold text-sm">Profesionales.EC</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              La plataforma de confianza para conectar con los mejores profesionales
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-foreground">Navegación</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#servicios" className="text-xs text-muted-foreground hover:text-foreground transition">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="#profesionales" className="text-xs text-muted-foreground hover:text-foreground transition">
                  Profesionales
                </Link>
              </li>
              <li>
                <Link href="#nosotros" className="text-xs text-muted-foreground hover:text-foreground transition">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="#contacto" className="text-xs text-muted-foreground hover:text-foreground transition">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-foreground">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition">
                  Guías
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition">
                  Ayuda
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-foreground">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition cursor-pointer">
                <Mail size={14} />
                info@profesionales.ec
              </li>
              <li className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition cursor-pointer">
                <Phone size={14} />
                +593 (0) 2 xxxx xxxx
              </li>
              <li className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin size={14} />
                Quito, Ecuador
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground mb-4 md:mb-0">
            © 2025 Profesionales.EC. Todos los derechos reservados.
          </p>
          <div className="flex gap-3">
            <Link
              href="https://www.facebook.com/profile.php?id=61556825827660"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition flex items-center justify-center"
            >
              <Facebook size={16} />
            </Link>
            <Link
              href="https://www.instagram.com/profesionalesec/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition flex items-center justify-center"
            >
              <Instagram size={16} />
            </Link>
            <Link
              href="https://wa.me/593999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition flex items-center justify-center overflow-hidden"
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-2lAiFHrtBZPphZEYJnn1KSX7sCnLms.png"
                alt="WhatsApp"
                width={20}
                height={20}
                className="object-contain"
              />
            </Link>
            <Link
              href="#"
              className="w-9 h-9 rounded-full border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition flex items-center justify-center"
            >
              <Linkedin size={16} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
