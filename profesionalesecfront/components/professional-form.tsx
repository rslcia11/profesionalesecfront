"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, ChevronLeft, ChevronRight, Home, Upload, Eye, EyeOff } from "lucide-react"
import { Check } from "lucide-react" // Declared the Check variable
import { authApi, profesionalApi, catalogosApi, saveToken, usuarioApi } from "@/lib/api"

const workModes = ["Presencial", "Virtual", "Ambas modalidades"]


interface FormData {
  fullName: string
  cedula: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  profileImage: File | null
  profession: string // Stores ID as string
  specialty: string // Stores ID as string
  description: string
  yearsExperience: number
  rate: number
  workMode: string
  province: string // Stores ID as string
  city: string // Stores ID as string
  address: string
  reference: string
  identity: File | null
  title: File | null
  license: File | null
  showPhone: boolean
  showEmail: boolean
  tags: string
}

interface CatalogItem {
  id: number;
  nombre: string;
}


interface FormErrors {
  [key: string]: string
}

export default function ProfessionalForm() {
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") // Get plan from URL

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"bank" | "card" | "paypal" | null>(null)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    cedula: "", // Added cedula field
    email: "",
    password: "",
    confirmPassword: "",
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
    showPhone: false,
    showEmail: false,
    tags: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Catalogs State
  const [professions, setProfessions] = useState<CatalogItem[]>([])
  const [specialties, setSpecialties] = useState<CatalogItem[]>([])
  const [provinces, setProvinces] = useState<CatalogItem[]>([])
  const [cities, setCities] = useState<CatalogItem[]>([])

  // Load initial catalogs
  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [profRes, provRes] = await Promise.all([
          catalogosApi.obtenerProfesiones(),
          catalogosApi.obtenerProvincias()
        ])
        setProfessions(profRes || [])
        setProvinces(provRes || [])
      } catch (error) {
        console.error("Error loading catalogs:", error)
      }
    }
    loadCatalogs()
  }, [])

  const steps = [

    { title: "Datos Personales", description: "Información básica" },
    { title: "Información Profesional", description: "Tu experiencia" },
    { title: "Ubicación", description: "Dónde trabajas" },
    { title: "Documentos", description: "Verifica tu identidad" },
    { title: "Preferencias", description: "Configuración final" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Nombres: no permite números
    if (name === "fullName") {
      if (/\d/.test(value)) {
        return // No actualiza si hay números
      }
    }

    // Cédula y teléfono: solo números, máximo 10 dígitos
    if (name === "cedula" || name === "phone") {
      if (!/^\d*$/.test(value)) {
        return // No actualiza si hay caracteres no numéricos
      }
      if (value.length > 10) {
        return // No permite más de 10 dígitos
      }
    }

    if (name === "yearsExperience") {
      const numValue = value === "" ? 0 : Number.parseInt(value, 10)
      setFormData((prev) => ({ ...prev, [name]: numValue }))
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }))
      }
      return
    }

    if (e.target.type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked })
    } else if (e.target.type === "number") {
      setFormData({ ...formData, [name]: Number.parseFloat(value) || 0 })
    } else {
      setFormData({ ...formData, [name]: value })
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleSelectChange = async (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "profession") {
      setFormData((prev) => ({ ...prev, specialty: "" }))
      setSpecialties([]) // Clear previous
      if (value) {
        try {
          // Backend returns ALL specialties, filter client-side
          const res = await catalogosApi.obtenerEspecialidades(Number(value))
          // Assuming response array has 'profesion_id' based on user SQL
          const filtered = Array.isArray(res) ? res.filter((s: any) => s.profesion_id === Number(value)) : []
          setSpecialties(filtered)
        } catch (error) {
          console.error("Error loading specialties:", error)
        }
      }
    }

    if (name === "province") {
      setFormData((prev) => ({ ...prev, city: "" }))
      setCities([])
      if (value) {
        try {
          // Backend returns ALL cities, filter client-side
          const res = await catalogosApi.obtenerCiudades(Number(value))
          // Assuming response array has 'provincia_id' or 'provincia.id'
          // Standard sequelize include usually nests, but plain ID is often available too.
          // Let's safe check both or just provincia_id as it is standard FK
          const filtered = Array.isArray(res) ? res.filter((c: any) => c.provincia_id === Number(value) || (c.provincia && c.provincia.id === Number(value))) : []
          setCities(filtered)
        } catch (error) {
          console.error("Error loading cities:", error)
        }
      }
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

  const validateStep = (): boolean => {
    const newErrors: FormErrors = {}

    switch (currentStep) {
      case 0:
        if (!formData.fullName.trim()) newErrors.fullName = "Nombre requerido"

        if (!formData.cedula.trim()) {
          newErrors.cedula = "Cédula requerida"
        } else if (formData.cedula.length !== 10) {
          newErrors.cedula = "Debe tener 10 dígitos"
        }

        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Email válido requerido"
        }
        if (!formData.password) {
          newErrors.password = "Contraseña requerida"
        } else {
          if (formData.password.length < 8) {
            newErrors.password = "Mínimo 8 caracteres"
          } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = "Debe incluir una mayúscula"
          } else if (!/[a-z]/.test(formData.password)) {
            newErrors.password = "Debe incluir una minúscula"
          }
        }

        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Las contraseñas no coinciden"
        }

        if (!formData.phone.trim()) {
          newErrors.phone = "Teléfono requerido"
        } else if (formData.phone.length !== 10) {
          newErrors.phone = "Debe tener 10 dígitos"
        }

        if (!formData.profileImage) newErrors.profileImage = "Foto de perfil requerida"
        break
      case 1:
        if (!formData.profession) newErrors.profession = "Profesión requerida"
        if (!formData.specialty) newErrors.specialty = "Especialidad requerida"
        if (!formData.description.trim()) newErrors.description = "Descripción requerida"
        if (formData.description.length > 80) newErrors.description = "Descripción no puede exceder 80 caracteres"
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

  const nextStep = () => {
    if (validateStep()) {
      setSlideDirection("right") // Set direction for next step
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    setSlideDirection("left") // Set direction for previous step
    setCurrentStep((prev) => prev - 1)
    setErrors({})
  }

  const handleSubmit = async () => {
    if (validateStep()) {
      try {
        console.log("[v0] Starting form submission with backend integration")

        // Step 1: Register user with auth API
        const registerData = {
          nombre: formData.fullName,
          correo: formData.email,
          contrasena: formData.password,
          cedula: formData.cedula,
          telefono: formData.phone,
          rol_id: 2, // Always 2 for professionals
        }

        console.log("[v0] Registering user:", registerData)
        const authResponse = await authApi.register(registerData)
        const token = authResponse.token

        if (!token) throw new Error("No se recibió el token de autenticación")
        console.log("[v0] User registered successfully")

        // Step 2: Upload profile image FIRST to get URL (if exists)
        let finalFotoUrl = ""
        if (formData.profileImage) {
          try {
            console.log("[v0] Uploading profile image...")
            const photoRes = await profesionalApi.subirDocumento("foto_perfil", formData.profileImage, token)
            // The backend returns the saved document info: { mensaje: "...", doc: { id: ..., url: "..." } }
            finalFotoUrl = photoRes.doc?.url || photoRes.archivo?.url || photoRes.url || photoRes.path || ""
            console.log("[v0] Profile image uploaded:", finalFotoUrl)
          } catch (uploadError) {
            console.warn("Could not upload profile image, continuing without it:", uploadError)
          }
        }

        // Step 2.5: SURGICAL FIX - Explicitly update user record in 'usuarios' table
        // This ensures cedula and foto_url are saved where the admin panel looks for them
        try {
          console.log("[v0] Updating user profile record in 'usuarios' table...")
          const userUpdateData = {
            nombre: formData.fullName,
            telefono: formData.phone,
            cedula: formData.cedula,
            foto_url: finalFotoUrl
          }
          await usuarioApi.actualizarPerfil(userUpdateData, token)
          console.log("[v0] User profile record updated successfully")
        } catch (updateError) {
          console.warn("[v0] Could not update user profile record:", updateError)
        }

        // Step 3: Create professional profile with ALL data (persists to 'profesionales' table)
        const perfilData: any = {
          profesion_id: Number(formData.profession),
          especialidad_id: Number(formData.specialty),
          ciudad_id: Number(formData.city),
          descripcion: formData.description,
          telefono: formData.phone,
          cedula: formData.cedula,
          foto_url: finalFotoUrl,
          calle_principal: formData.address,
          referencia: formData.reference,
          tarifa: formData.rate || 0,
          tarifa_hora: formData.rate || 0,
        }

        console.log("[v0] Creating professional profile with full data:", perfilData)
        await profesionalApi.crearPerfil(perfilData, token)
        console.log("[v0] Professional profile created")

        // Step 4: Upload other verification documents (async)
        const otherDocs = [
          { file: formData.identity, type: "cedula" },
          { file: formData.title, type: "titulo" },
          { file: formData.license, type: "licencia" },
        ]

        await Promise.all(
          otherDocs
            .filter(d => d.file)
            .map(d => profesionalApi.subirDocumento(d.type, d.file as File, token).catch(err => {
              console.error(`Error uploading ${d.type}:`, err)
            }))
        )

        console.log("[v0] Verification documents processed")
        setShowSuccessModal(true)
      } catch (error: any) {
        console.error("[v0] Registration error:", error)
        alert(`Error al registrar: ${error.message || "Error desconocido"}`)
      }
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
            pattern="\d*"
            inputMode="numeric"
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
            pattern="\d*"
            inputMode="numeric"
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
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Contraseña (mínimo 8 caracteres, mayúscula y minúscula) *
          </label>
          <div className="relative mt-auto">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Confirmar Contraseña *
          </label>
          <div className="relative mt-auto">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
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
            onChange={(e) => handleSelectChange("profession", e.target.value)}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Selecciona tu profesión</option>
            {professions.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.nombre}
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
            onChange={(e) => handleSelectChange("specialty", e.target.value)}
            disabled={!formData.profession}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            <option value="">Selecciona tu especialidad</option>
            {specialties.map((spec) => (
              <option key={spec.id} value={spec.id}>
                {spec.nombre}
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
            value={formData.yearsExperience === 0 ? "" : formData.yearsExperience}
            onChange={handleInputChange}
            onFocus={(e) => {
              if (formData.yearsExperience === 0) {
                e.target.value = ""
              }
            }}
            placeholder="0"
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
            onChange={(e) => handleSelectChange("workMode", e.target.value)}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Selecciona la modalidad</option>
            {workModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
          {errors.workMode && <p className="text-red-400 text-sm mt-1">{errors.workMode}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Descripción Profesional * (máximo 80 caracteres)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          maxLength={80}
          rows={4}
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground mt-1">{formData.description.length}/80 caracteres</p>
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
            onChange={(e) => handleSelectChange("province", e.target.value)}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Selecciona provincia</option>
            {provinces.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.nombre}
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
            onChange={(e) => handleSelectChange("city", e.target.value)}
            disabled={!formData.province}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            <option value="">Selecciona ciudad</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.nombre}
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
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${index < currentStep
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

        <div className="relative overflow-hidden">
          <div
            className={`transition-all duration-500 ease-in-out ${slideDirection === "right" ? "animate-in slide-in-from-right" : "animate-in slide-in-from-left"
              }`}
          >
            {currentStep === 0 && renderPersonalInfo()}
            {currentStep === 1 && renderProfessionalInfo()}
            {currentStep === 2 && renderLocation()}
            {currentStep === 3 && renderDocuments()}
            {currentStep === 4 && renderPreferences()}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8 justify-between">
          <button
            onClick={prevStep}
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
              onClick={nextStep}
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
          <div className="bg-card border border-border rounded-2xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-500 delay-150">
                <CheckCircle2 className="size-10 text-green-500" />
              </div>
              <h3 className="font-oswald text-2xl font-bold text-foreground mb-2">¡Datos Enviados Correctamente!</h3>

              {plan === "priority" ? (
                <>
                  <p className="font-arimo text-muted-foreground mb-6">
                    Has elegido la opción de registro prioritario. Para completar tu inscripción, realiza el pago de
                    <span className="font-bold text-primary"> $10 USD</span> a través de uno de los siguientes métodos:
                  </p>

                  {!selectedPaymentMethod ? (
                    <div className="space-y-3 mb-6">
                      <button
                        onClick={() => setSelectedPaymentMethod("bank")}
                        className="w-full px-6 py-4 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl text-foreground font-semibold transition-all hover:shadow-lg"
                      >
                        Transferencia Bancaria
                      </button>
                      <button
                        onClick={() => setSelectedPaymentMethod("card")}
                        className="w-full px-6 py-4 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl text-foreground font-semibold transition-all hover:shadow-lg"
                      >
                        Tarjeta de Crédito/Débito (Payphone)
                      </button>
                      <button
                        onClick={() => setSelectedPaymentMethod("paypal")}
                        className="w-full px-6 py-4 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl text-foreground font-semibold transition-all hover:shadow-lg"
                      >
                        PayPal
                      </button>
                    </div>
                  ) : (
                    <div className="bg-muted/50 rounded-xl p-6 mb-6 text-left">
                      {selectedPaymentMethod === "bank" && (
                        <div>
                          <h4 className="font-bold text-foreground mb-4 text-center">Transferencia Bancaria</h4>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>
                              <span className="font-medium">Banco:</span> Banco del Pacífico
                            </p>
                            <p>
                              <span className="font-medium">Cuenta:</span> 1234567890
                            </p>
                            <p>
                              <span className="font-medium">Titular:</span> Profesionales.ec
                            </p>
                            <p>
                              <span className="font-medium">Tipo:</span> Cuenta Corriente
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedPaymentMethod === "card" && (
                        <div>
                          <h4 className="font-bold text-foreground mb-4 text-center">Tarjeta de Crédito/Débito</h4>
                          <p className="text-sm text-muted-foreground mb-4 text-center">
                            Haz clic en el botón para ir a Payphone y completar tu pago de forma segura
                          </p>
                          <a
                            href="https://payphone.app/pay/profesionales-ec"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-center hover:bg-primary/90 transition-all"
                          >
                            Ir a Payphone
                          </a>
                        </div>
                      )}

                      {selectedPaymentMethod === "paypal" && (
                        <div>
                          <h4 className="font-bold text-foreground mb-4 text-center">PayPal</h4>
                          <div className="text-sm text-muted-foreground space-y-2">
                            <p className="text-center">Envía el pago a:</p>
                            <p className="text-center font-semibold text-foreground text-lg">pagos@profesionales.ec</p>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => setSelectedPaymentMethod(null)}
                        className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        ← Elegir otro método
                      </button>
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground mb-6 bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">Importante:</span> Una vez
                    realizado el pago, tu solicitud de registro será revisada en un{" "}
                    <span className="font-bold">máximo de 24 horas</span>. Recibirás un correo electrónico con la
                    confirmación de tu perfil.
                  </p>
                </>
              ) : (
                <p className="font-arimo text-muted-foreground mb-6">
                  Tu información ha sido enviada correctamente. Te llegará un correo electrónico cuando tu perfil sea
                  aprobado por nuestro equipo.
                </p>
              )}

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
