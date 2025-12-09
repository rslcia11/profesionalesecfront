"use client"

import type React from "react"
import { useState } from "react"
import { Upload, ChevronRight, ChevronLeft, Check, Home, CheckCircle2 } from "lucide-react"
import Link from "next/link"

const mockData = {
  professions: ["Médico", "Ingeniero", "Abogado", "Arquitecto", "Contador", "Psicólogo"],
  specialties: {
    Médico: ["Cardiología", "Pediatría", "Neurología", "Dermatología"],
    Ingeniero: ["Civil", "Eléctrico", "Sistemas", "Industrial"],
    Abogado: ["Civil", "Penal", "Laboral", "Corporativo"],
    Arquitecto: ["Diseño", "Restauración", "Urbanismo"],
    Contador: ["Auditoría", "Tributaria", "Contabilidad General"],
    Psicólogo: ["Clínica", "Organizacional", "Educativa"],
  },
  provinces: ["Pichincha", "Guayas", "Azuay", "Tungurahua", "Manabí", "Chimborazo", "Cotopaxi", "Imbabura"],
  cities: {
    Pichincha: ["Quito", "Rumiñahui", "Mejía"],
    Guayas: ["Guayaquil", "Samborondón", "Durán"],
    Azuay: ["Cuenca", "Girón", "Paute"],
    Tungurahua: ["Ambato", "Latacunga", "Pelileo"],
    Manabí: ["Portoviejo", "Manta", "Salinas"],
    Chimborazo: ["Riobamba", "Guaranda", "Alausí"],
    Cotopaxi: ["Latacunga", "Ambato", "Pujilí"],
    Imbabura: ["Ibarra", "Otavalo", "San Miguel"],
  },
  workModes: ["Presencial", "Virtual", "Ambas modalidades"],
}

interface FormData {
  fullName: string
  cedula: string // Added cedula field
  email: string
  password: string
  phone: string
  profileImage: File | null
  profession: string
  specialty: string
  description: string
  yearsExperience: number
  rate: number
  workMode: string
  province: string
  city: string
  address: string
  reference: string
  identity: File | null
  title: File | null
  license: File | null
  showPhone: boolean
  showEmail: boolean
  tags: string
}

interface FormErrors {
  [key: string]: string
}

export default function ProfessionalForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    cedula: "", // Added cedula field
    email: "",
    password: "",
    phone: "",
    profileImage: null,
    profession: "",
    specialty: "",
    description: "",
    yearsExperience: 0,
    rate: 0,
    workMode: "",
    province: "",
    city: "",
    address: "",
    reference: "",
    identity: null,
    title: null,
    license: null,
    showPhone: true,
    showEmail: false,
    tags: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const steps = [
    { title: "Datos Personales", description: "Información básica" },
    { title: "Información Profesional", description: "Tu experiencia" },
    { title: "Ubicación", description: "Dónde trabajas" },
    { title: "Documentos", description: "Verifica tu identidad" },
    { title: "Preferencias", description: "Configuración final" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked })
    } else if (type === "number") {
      setFormData({ ...formData, [name]: Number(value) })
    } else {
      setFormData({ ...formData, [name]: value })
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
    if (name === "profession") {
      setFormData((prev) => ({ ...prev, specialty: "" }))
    }
    if (name === "province") {
      setFormData((prev) => ({ ...prev, city: "" }))
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleFileChange = (name: string, file: File | null) => {
    setFormData({ ...formData, [name]: file })
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}

    switch (step) {
      case 0:
        if (!formData.fullName.trim()) newErrors.fullName = "Nombre requerido"
        if (!formData.cedula.trim()) newErrors.cedula = "Cédula requerida"
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Email válido requerido"
        }
        if (!formData.password || formData.password.length < 8) {
          newErrors.password = "Contraseña de al menos 8 caracteres"
        }
        if (!formData.phone.trim()) newErrors.phone = "Teléfono requerido"
        if (!formData.profileImage) newErrors.profileImage = "Foto de perfil requerida"
        break
      case 1:
        if (!formData.profession) newErrors.profession = "Profesión requerida"
        if (!formData.specialty) newErrors.specialty = "Especialidad requerida"
        if (!formData.description.trim()) newErrors.description = "Descripción requerida"
        if (formData.yearsExperience < 0) newErrors.yearsExperience = "Años válidos requeridos"
        if (!formData.workMode) newErrors.workMode = "Modalidad de trabajo requerida"
        break
      case 2:
        if (!formData.province) newErrors.province = "Provincia requerida"
        if (!formData.city) newErrors.city = "Ciudad requerida"
        if (!formData.address.trim()) newErrors.address = "Dirección requerida"
        break
      case 3:
        break
      case 4:
        if (!formData.tags.trim()) newErrors.tags = "Al menos una palabra clave requerida"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep(Math.min(currentStep + 1, steps.length - 1))
        setIsTransitioning(false)
      }, 300)
    }
  }

  const handlePrev = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentStep(Math.max(currentStep - 1, 0))
      setIsTransitioning(false)
    }, 300)
  }

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      console.log("Form submitted:", formData)
      setShowSuccessModal(true)
    }
  }

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <h2 className="font-oswald text-2xl font-bold text-foreground mb-8">Información Personal</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Nombre Completo *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Cédula *</label>
          <input
            type="text"
            name="cedula"
            value={formData.cedula}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.cedula && <p className="text-red-400 text-sm mt-1">{errors.cedula}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Teléfono de Contacto *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Correo Electrónico *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Contraseña (mínimo 8 caracteres) *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">Foto de Perfil *</label>
        <input
          id="profileImage"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange("profileImage", e.target.files?.[0] || null)}
          className="hidden"
        />
        <label
          htmlFor="profileImage"
          className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
        >
          <div className="flex flex-col items-center justify-center">
            <Upload className="size-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-muted-foreground text-sm">
              {formData.profileImage ? formData.profileImage.name : "Sube tu foto de perfil"}
            </p>
          </div>
        </label>
        {errors.profileImage && <p className="text-red-400 text-sm mt-1">{errors.profileImage}</p>}
      </div>
    </div>
  )

  const renderProfessionalInfo = () => (
    <div className="space-y-6">
      <h2 className="font-oswald text-2xl font-bold text-foreground mb-8">Información Profesional</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Profesión *</label>
          <select
            name="profession"
            value={formData.profession}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Selecciona tu profesión</option>
            {mockData.professions.map((prof) => (
              <option key={prof} value={prof}>
                {prof}
              </option>
            ))}
          </select>
          {errors.profession && <p className="text-red-400 text-sm mt-1">{errors.profession}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Especialidad *</label>
          <select
            name="specialty"
            value={formData.specialty}
            onChange={handleInputChange}
            disabled={!formData.profession}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            <option value="">Selecciona tu especialidad</option>
            {formData.profession &&
              mockData.specialties[formData.profession as keyof typeof mockData.specialties]?.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
          </select>
          {errors.specialty && <p className="text-red-400 text-sm mt-1">{errors.specialty}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Años de Experiencia</label>
          <input
            type="number"
            name="yearsExperience"
            min="0"
            value={formData.yearsExperience}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Tarifa o Precio (Opcional)</label>
          <input
            type="number"
            name="rate"
            min="0"
            step="0.01"
            value={formData.rate || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-muted-foreground mb-2">Modalidad de Trabajo *</label>
          <select
            name="workMode"
            value={formData.workMode}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Selecciona la modalidad</option>
            {mockData.workModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
          {errors.workMode && <p className="text-red-400 text-sm mt-1">{errors.workMode}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">Descripción Profesional *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
      </div>
    </div>
  )

  const renderLocation = () => (
    <div className="space-y-6">
      <h2 className="font-oswald text-2xl font-bold text-foreground mb-8">Ubicación</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Provincia *</label>
          <select
            name="province"
            value={formData.province}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Selecciona provincia</option>
            {mockData.provinces.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
          {errors.province && <p className="text-red-400 text-sm mt-1">{errors.province}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Ciudad *</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            disabled={!formData.province}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            <option value="">Selecciona ciudad</option>
            {formData.province &&
              mockData.cities[formData.province as keyof typeof mockData.cities]?.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>
          {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-muted-foreground mb-2">Dirección Exacta *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-muted-foreground mb-2">Referencia (Opcional)</label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  )

  const renderDocuments = () => (
    <div className="space-y-6">
      <h2 className="font-oswald text-2xl font-bold text-foreground mb-8">Documentos de Verificación</h2>
      <p className="text-muted-foreground text-sm mb-4">
        Todos los documentos son opcionales. Puedes subirlos más tarde.
      </p>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Documento de Identidad (Cédula o DNI) - Opcional
          </label>
          <input
            type="file"
            onChange={(e) => handleFileChange("identity", e.target.files?.[0] || null)}
            className="hidden"
            id="identity"
          />
          <label
            htmlFor="identity"
            className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center justify-center">
              <Upload className="size-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-muted-foreground text-sm">
                {formData.identity ? formData.identity.name : "Sube tu documento de identidad"}
              </p>
            </div>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Título Profesional - Opcional</label>
          <input
            type="file"
            onChange={(e) => handleFileChange("title", e.target.files?.[0] || null)}
            className="hidden"
            id="title"
          />
          <label
            htmlFor="title"
            className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center justify-center">
              <Upload className="size-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-muted-foreground text-sm">
                {formData.title ? formData.title.name : "Sube tu título profesional"}
              </p>
            </div>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Licencia Profesional - Opcional
          </label>
          <input
            type="file"
            onChange={(e) => handleFileChange("license", e.target.files?.[0] || null)}
            className="hidden"
            id="license"
          />
          <label
            htmlFor="license"
            className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center justify-center">
              <Upload className="size-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-muted-foreground text-sm">
                {formData.license ? formData.license.name : "Sube tu licencia profesional"}
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  )

  const renderPreferences = () => (
    <div className="space-y-6">
      <h2 className="font-oswald text-2xl font-bold text-foreground mb-8">Preferencias y Privacidad</h2>
      <div className="space-y-4">
        <label className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-primary/5 transition-colors cursor-pointer">
          <input
            type="checkbox"
            name="showPhone"
            checked={formData.showPhone}
            onChange={handleInputChange}
            className="w-4 h-4 rounded border-border bg-card cursor-pointer"
          />
          <div>
            <p className="font-medium text-foreground">Mostrar teléfono en perfil público</p>
            <p className="text-sm text-muted-foreground">Los clientes podrán contactarte directamente</p>
          </div>
        </label>
        <label className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-primary/5 transition-colors cursor-pointer">
          <input
            type="checkbox"
            name="showEmail"
            checked={formData.showEmail}
            onChange={handleInputChange}
            className="w-4 h-4 rounded border-border bg-card cursor-pointer"
          />
          <div>
            <p className="font-medium text-foreground">Mostrar correo en perfil público</p>
            <p className="text-sm text-muted-foreground">Tu correo será visible para otros usuarios</p>
          </div>
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">Palabras Clave (Tags) *</label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.tags && <p className="text-red-400 text-sm mt-1">{errors.tags}</p>}
        <p className="text-xs text-muted-foreground mt-1">Separa con comas</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 group"
        >
          <Home className="size-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-varela">Volver al inicio</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-oswald text-4xl md:text-5xl font-bold text-foreground mb-4">Crear Perfil Profesional</h1>
          <p className="font-arimo text-lg text-muted-foreground">
            Completa tu información para comenzar a conectar con clientes
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                    index < currentStep
                      ? "bg-primary text-primary-foreground"
                      : index === currentStep
                        ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < currentStep ? <Check size={20} /> : index + 1}
                </div>
                <p
                  className={`text-sm mt-2 font-medium ${index === currentStep ? "text-primary" : "text-muted-foreground"}`}
                >
                  {step.title}
                </p>
              </div>
            ))}
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div
          className={`bg-card border border-border rounded-2xl p-8 md:p-12 shadow-lg transition-all duration-300 ${
  isTransitioning ? "opacity-0 transform -translate-x-8" : "opacity-100 transform translate-x-0"
}`}
        >
          {currentStep === 0 && renderPersonalInfo()}
          {currentStep === 1 && renderProfessionalInfo()}
          {currentStep === 2 && renderLocation()}
          {currentStep === 3 && renderDocuments()}
          {currentStep === 4 && renderPreferences()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8 justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="font-varela flex items-center gap-2 px-6 py-3 bg-muted text-foreground rounded-full font-semibold hover:bg-muted/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
            Anterior
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="font-varela flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:shadow-primary/20"
            >
              <Check size={18} />
              Crear Perfil
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="font-varela flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:shadow-primary/20"
            >
              Siguiente
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-500 delay-150">
                <CheckCircle2 className="size-10 text-green-500" />
              </div>
              <h3 className="font-oswald text-2xl font-bold text-foreground mb-2">¡Perfil Creado!</h3>
              <p className="font-arimo text-muted-foreground mb-6">
                Tu información ha sido enviada correctamente. Te llegará un correo electrónico cuando tu perfil sea
                aprobado por nuestro equipo.
              </p>
              <Link
                href="/"
                className="font-varela inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:shadow-primary/20"
              >
                <Home className="size-5" />
                Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
