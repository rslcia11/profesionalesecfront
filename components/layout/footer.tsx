import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Profesionales.ec</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Conectando profesionales en Ecuador</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Profesionales
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Educación
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4">Servicios</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Buscar Profesional
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Crear Perfil
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:info@profesionales.ec" className="hover:text-white transition">
                  info@profesionales.ec
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>+593 (0) 2 XXXX XXXX</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1" />
                <span>Quito, Ecuador</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2025 Profesionales.ec. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">
                Privacidad
              </a>
              <a href="#" className="hover:text-white transition">
                Términos
              </a>
              <a href="#" className="hover:text-white transition">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
