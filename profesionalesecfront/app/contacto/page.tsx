"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ContactoPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    // Simular envío de correo (puedes conectar esto a tu backend /api/contact)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">Contáctanos</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <div className="space-y-8 animate-slide-in-left">
              <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
                <h2 className="text-2xl font-bold mb-6">Información de Contacto</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="font-bold">Email</p>
                      <a href="mailto:info@profesionales.ec" className="text-muted-foreground hover:text-primary transition-colors">
                        info@profesionales.ec
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="font-bold">Teléfono</p>
                      <a href="tel:+593998925381" className="text-muted-foreground hover:text-primary transition-colors">
                        +593 998 925 381
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="font-bold">Ubicación</p>
                      <p className="text-muted-foreground">
                        Quito, Ecuador
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social or Extra Info */}
              <div className="p-8">
                <h3 className="text-xl font-bold mb-4">¿Por qué contactarnos?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 size={18} className="text-primary" /> Soporte técnico especializado
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 size={18} className="text-primary" /> Consultas sobre preinscripción
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 size={18} className="text-primary" /> Alianzas y convenios
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card border border-border rounded-3xl p-8 shadow-xl animate-slide-in-right">
              {submitted ? (
                <div className="text-center py-12 space-y-6">
                  <div className="inline-flex items-center justify-center size-20 bg-primary/10 text-primary rounded-full mb-4">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">¡Mensaje Enviado!</h2>
                  <p className="text-muted-foreground">
                    Gracias por contactarnos. Un miembro de nuestro equipo te contactará pronto.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-all"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nombre Completo</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Tu nombre"
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Correo Electrónico</label>
                      <input 
                        required
                        type="email" 
                        placeholder="tu@correo.com"
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Asunto</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                      <option>Soporte Técnico</option>
                      <option>Información Profesional</option>
                      <option>Convenios / Alianzas</option>
                      <option>Otro</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mensaje</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="¿En qué podemos ayudarte?"
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/20 disabled:opacity-70"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Send size={20} />
                    )}
                    {loading ? "Enviando..." : "Enviar Mensaje"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
