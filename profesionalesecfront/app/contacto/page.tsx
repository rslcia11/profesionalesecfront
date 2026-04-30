"use client"

import { useState, type FormEvent } from "react"
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface FormData {
  nombre: string
  correo: string
  asunto: string
  mensaje: string
}

interface FormTouched {
  nombre: boolean
  correo: boolean
  asunto: boolean
  mensaje: boolean
}

export default function ContactoPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    correo: "",
    asunto: "Soporte Técnico",
    mensaje: "",
  })
  const [touched, setTouched] = useState<FormTouched>({
    nombre: false,
    correo: false,
    asunto: false,
    mensaje: false,
  })

  const validateField = (field: keyof FormData, value: string): string => {
    const trimmedValue = value.trim()

    if (field === "nombre") {
      if (!trimmedValue) return "El nombre es obligatorio"
      if (trimmedValue.length < 2) return "El nombre debe tener al menos 2 caracteres"
      return ""
    }

    if (field === "correo") {
      if (!trimmedValue) return "El correo electrónico es obligatorio"
      if (!EMAIL_REGEX.test(trimmedValue)) return "Ingresa un correo electrónico válido"
      return ""
    }

    if (field === "asunto") {
      if (!trimmedValue) return "El asunto es obligatorio"
      if (trimmedValue.length < 3) return "El asunto debe tener al menos 3 caracteres"
      return ""
    }

    if (!trimmedValue) return "El mensaje es obligatorio"
    if (trimmedValue.length < 10) return "El mensaje debe tener al menos 10 caracteres"
    return ""
  }

  const fieldErrors = {
    nombre: validateField("nombre", formData.nombre),
    correo: validateField("correo", formData.correo),
    asunto: validateField("asunto", formData.asunto),
    mensaje: validateField("mensaje", formData.mensaje),
  }

  const isFormValid = Object.values(fieldErrors).every((fieldError) => !fieldError)

  const shouldShowFieldError = (field: keyof FormData) => {
    if (field === "correo") {
      return touched.correo || formData.correo.length > 0
    }

    return touched[field]
  }

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const handleFieldBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const allTouched: FormTouched = {
      nombre: true,
      correo: true,
      asunto: true,
      mensaje: true,
    }

    setTouched(allTouched)

    if (!isFormValid) {
      setError("Revisa los campos marcados antes de enviar")
      return
    }

    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || "No se pudo enviar el mensaje")
      }

      setSubmitted(true)
      setFormData({
        nombre: "",
        correo: "",
        asunto: "Soporte Técnico",
        mensaje: "",
      })
      setTouched({
        nombre: false,
        correo: false,
        asunto: false,
        mensaje: false,
      })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Error al enviar")
    } finally {
      setLoading(false)
    }
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
                        value={formData.nombre}
                        onChange={(e) => handleFieldChange("nombre", e.target.value)}
                        onBlur={() => handleFieldBlur("nombre")}
                        placeholder="Tu nombre"
                        aria-invalid={shouldShowFieldError("nombre") && Boolean(fieldErrors.nombre)}
                        aria-describedby={shouldShowFieldError("nombre") && fieldErrors.nombre ? "nombre-error" : undefined}
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/20"
                      />
                      {shouldShowFieldError("nombre") && fieldErrors.nombre ? (
                        <p id="nombre-error" className="text-sm text-red-500 font-medium">
                          {fieldErrors.nombre}
                        </p>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Correo Electrónico</label>
                      <input 
                        required
                        type="email" 
                        value={formData.correo}
                        onChange={(e) => handleFieldChange("correo", e.target.value)}
                        onBlur={() => handleFieldBlur("correo")}
                        placeholder="tu@correo.com"
                        aria-invalid={shouldShowFieldError("correo") && Boolean(fieldErrors.correo)}
                        aria-describedby={shouldShowFieldError("correo") && fieldErrors.correo ? "correo-error" : undefined}
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/20"
                      />
                      {shouldShowFieldError("correo") && fieldErrors.correo ? (
                        <p id="correo-error" className="text-sm text-red-500 font-medium">
                          {fieldErrors.correo}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Asunto</label>
                    <select 
                      value={formData.asunto}
                      onChange={(e) => handleFieldChange("asunto", e.target.value)}
                      onBlur={() => handleFieldBlur("asunto")}
                      aria-invalid={shouldShowFieldError("asunto") && Boolean(fieldErrors.asunto)}
                      aria-describedby={shouldShowFieldError("asunto") && fieldErrors.asunto ? "asunto-error" : undefined}
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/20"
                    >
                      <option>Soporte Técnico</option>
                      <option>Información Profesional</option>
                      <option>Convenios / Alianzas</option>
                      <option>Otro</option>
                    </select>
                    {shouldShowFieldError("asunto") && fieldErrors.asunto ? (
                      <p id="asunto-error" className="text-sm text-red-500 font-medium">
                        {fieldErrors.asunto}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mensaje</label>
                    <textarea 
                      required
                      rows={5}
                      value={formData.mensaje}
                      onChange={(e) => handleFieldChange("mensaje", e.target.value)}
                      onBlur={() => handleFieldBlur("mensaje")}
                      placeholder="¿En qué podemos ayudarte?"
                      aria-invalid={shouldShowFieldError("mensaje") && Boolean(fieldErrors.mensaje)}
                      aria-describedby={shouldShowFieldError("mensaje") && fieldErrors.mensaje ? "mensaje-error" : undefined}
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/20"
                    ></textarea>
                    {shouldShowFieldError("mensaje") && fieldErrors.mensaje ? (
                      <p id="mensaje-error" className="text-sm text-red-500 font-medium">
                        {fieldErrors.mensaje}
                      </p>
                    ) : null}
                  </div>

                  {error ? (
                    <p className="text-sm text-red-500 font-medium">{error}</p>
                  ) : null}

                  <button 
                    disabled={loading || !isFormValid}
                    type="submit"
                    className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
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
