"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, ChevronLeft, ChevronRight, Home, Upload, Eye, EyeOff } from "lucide-react"
import { Check, X } from "lucide-react" // Declared the Check variable
import { authApi, profesionalApi, catalogosApi, saveToken, usuarioApi } from "@/lib/api"


import LocationMap from "@/components/shared/location-map"
import { getAddressFromCoordinates, getCoordinatesFromAddress } from "@/lib/geocoding"

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
  rate: string
  workMode: string
  province: string // Stores ID as string
  city: string // Stores ID as string
  address: string
  reference: string
  identityFront: File | null
  identityBack: File | null
  title: File | null
  license: File | null
  showPhone: boolean
  showEmail: boolean
  tags: string
  lat?: number
  lng?: number
}

interface CatalogItem {
  id: number;
  nombre: string;
}


interface FormErrors {
  [key: string]: string
}

interface FormTouched {
  [key: string]: boolean
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
    rate: "",
    workMode: "",
    province: "",
    city: "",
    address: "",
    reference: "",
    identityFront: null,
    identityBack: null,
    title: null,
    license: null,
    showPhone: false,
    showEmail: false,
    tags: "",
    lat: undefined,
    lng: undefined,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<FormTouched>({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const isAddressManuallyEdited = useRef(false)
  const emailInputRef = useRef<HTMLInputElement>(null)

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

  // Prompt for location on step 2
  useEffect(() => {
    if (currentStep === 2 && formData.lat === undefined && formData.lng === undefined) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude
            const lng = position.coords.longitude

            // Set coordinates directly first
            setFormData((prev) => ({ ...prev, lat, lng }))

            try {
              const { address, province, city } = await getAddressFromCoordinates(lat, lng)
              
              let newFormData: Partial<FormData> = {}
              if (address && !isAddressManuallyEdited.current) {
                newFormData.address = address
              }

              // Match province
              if (province && provinces.length > 0) {
                const queryProv = province.toLowerCase();
                const matchedProv = provinces.find(p => p.nombre.toLowerCase().includes(queryProv) || queryProv.includes(p.nombre.toLowerCase()))
                
                if (matchedProv) {
                  newFormData.province = String(matchedProv.id)

                  // Load cities for the matched province
                  try {
                    const res = await catalogosApi.obtenerCiudades(matchedProv.id)
                    const filteredCities = Array.isArray(res) ? res.filter((c: any) => c.provincia_id === matchedProv.id || (c.provincia && c.provincia.id === matchedProv.id)) : []
                    setCities(filteredCities)

                    // Match city
                    if (city && filteredCities.length > 0) {
                      const queryCity = city.toLowerCase();
                      const matchedCity = filteredCities.find((c: any) => c.nombre.toLowerCase().includes(queryCity) || queryCity.includes(c.nombre.toLowerCase()))
                      if (matchedCity) {
                        newFormData.city = String(matchedCity.id)
                      }
                    }
                  } catch (cityErr) {
                    console.error("Error al cargar ciudades en geolocalización:", cityErr)
                  }
                }
              }

              if (Object.keys(newFormData).length > 0) {
                setFormData(prev => ({ ...prev, ...newFormData }))
              }
            } catch (error) {
              console.error("Error obteniendo dirección:", error)
            }
          },
          (error) => {
            console.error("Error de geolocalización:", error)
          }
        )
      }
    }
  }, [currentStep, formData.lat, formData.lng])

  const steps = [

    { title: "Datos Personales", description: "Información básica" },
    { title: "Información Profesional", description: "Tu experiencia" },
    { title: "Ubicación", description: "Dónde trabajas" },
    { title: "Documentos", description: "Verifica tu identidad" },
    { title: "Preferencias", description: "Configuración final" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "address") {
      isAddressManuallyEdited.current = value.trim() !== ""
    }

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

    if (name === "rate") {
      if (value === "") {
        setFormData((prev) => ({ ...prev, [name]: "" }))
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
        return
      }
      if (!/^\d*\.?\d{0,2}$/.test(value)) {
        return
      }
      setFormData((prev) => ({ ...prev, [name]: value }))
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
      return
    }

    if (e.target.type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked })
    } else if (e.target.type === "number") {
      setFormData({ ...formData, [name]: Number.parseFloat(value) || 0 })
    } else {
      setFormData({ ...formData, [name]: value })
    }

    if (touched[name]) {
       validateField(name, value)
    }
  }

  const handleSelectChange = async (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
       validateField(name, value)
    }

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

    if (name === "city" && value) {
      const selectedCity = cities.find((c: any) => c.id === Number(value))
      const selectedProvince = provinces.find((p: any) => p.id === Number(formData.province))

      if (selectedCity && selectedProvince) {
        getCoordinatesFromAddress(`${selectedCity.nombre}, ${selectedProvince.nombre}, Ecuador`)
          .then(coords => {
            if (coords) {
              handleLocationChange(coords.lat, coords.lng)
            }
          })
          .catch(err => console.error("Error auto-centering map:", err))
      }
    }
  }

  const handleFileChange = (name: string, file: File | null) => {
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [name]: "Formato no soportado (solo .png, .jpg, .jpeg, .webp)" }));
        setFormData(prev => ({ ...prev, [name]: null }));
        return;
      }
      
      const maxSize = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, [name]: "El archivo no debe pesar más de 5MB" }));
        setFormData(prev => ({ ...prev, [name]: null }));
        return;
      }
    }

    setFormData({ ...formData, [name]: file })
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name, file)
  }

  const handleLocationChange = async (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, lat, lng }))
    setTouched(prev => ({ ...prev, map: true }))

    if (!isAddressManuallyEdited.current) {
      const { address, reference } = await getAddressFromCoordinates(lat, lng)
      if (address) {
        setFormData(prev => ({
          ...prev,
          address: address,
          reference: reference || prev.reference
        }))
        setTouched(prev => ({ ...prev, address: true }))
        validateField("address", address)
      }
    }
  }

  const validateField = (name: string, value: any) => {
    let error = ""
    switch (name) {
      case "fullName":
        if (!value.trim()) error = "Nombre requerido"
        break
      case "cedula":
        if (!value.trim()) error = "Cédula requerida"
        else if (value.length !== 10) error = "Debe tener 10 dígitos"
        break
      case "email":
        if (!value.trim()) {
          error = "Correo electrónico requerido"
        } else if (!value.includes("@")) {
          error = "El correo debe contener un '@'"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Formato inválido (ej: usuario@dominio.com)"
        }
        break
      case "password":
        if (!value) error = "Contraseña requerida"
        else if (value.length < 8) error = "Mínimo 8 caracteres"
        else if (!/[A-Z]/.test(value)) error = "Debe incluir una mayúscula"
        else if (!/[a-z]/.test(value)) error = "Debe incluir una minúscula"
        else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) error = "Debe incluir un carácter especial (ej: @, $, !)"
        break
      case "confirmPassword":
        if (value !== formData.password) error = "Las contraseñas no coinciden"
        break
      case "phone":
        if (!value.trim()) error = "Teléfono requerido"
        else if (value.length !== 10) error = "Debe tener 10 dígitos"
        break
      case "profileImage":
        if (!value) error = "Foto de perfil requerida"
        break
      case "profession":
        if (!value) error = "Profesión requerida"
        break
      case "specialty":
        if (!value) error = "Especialidad requerida"
        break
      case "description":
        if (!value.trim()) error = "Descripción requerida"
        else if (value.length > 80) error = "Descripción no puede exceder 80 caracteres"
        break
      case "yearsExperience":
        if (value < 0 || value > 70 || !Number.isInteger(Number(value))) error = "Años válidos requeridos (0-70 como número entero)"
        break
      case "workMode":
        if (!value) error = "Modalidad de trabajo requerida"
        break
      case "province":
        if (!value) error = "Provincia requerida"
        break
      case "city":
        if (!value) error = "Ciudad requerida"
        break
      case "address":
        if (!value.trim()) error = "Dirección requerida"
        break
      case "map":
        if (formData.lat === undefined || formData.lng === undefined) error = "Por favor, haz clic o mueve el pin en el mapa"
        break
      case "identityFront":
        if (!value) error = "La foto frontal de la cédula es obligatoria"
        break
      case "identityBack":
        if (!value) error = "La foto posterior de la cédula es obligatoria"
        break
      case "tags":
        if (!value.trim()) error = "Al menos una palabra clave requerida"
        break
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
    return !error
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name, value)
  }

  const getInputBorderColor = (name: string) => {
    if (errors[name]) return "border-red-400"
    if (touched[name] && !errors[name] && formData[name as keyof FormData] !== "" && formData[name as keyof FormData] !== null) return "border-green-500"
    return "border-border"
  }

  const validateStep = (): boolean => {
    const currentFieldsToValidate: string[] = []
    switch (currentStep) {
      case 0:
        currentFieldsToValidate.push("fullName", "cedula", "email", "password", "confirmPassword", "phone", "profileImage")
        break
      case 1:
        currentFieldsToValidate.push("profession", "specialty", "description", "yearsExperience", "workMode")
        break
      case 2:
        currentFieldsToValidate.push("province", "city", "address", "map")
        break
      case 3:
        currentFieldsToValidate.push("identityFront", "identityBack")
        break
      case 4:
        currentFieldsToValidate.push("tags")
        break
    }

    let isValid = true
    const newTouched = { ...touched }

    currentFieldsToValidate.forEach(field => {
      newTouched[field] = true
      const value = field === "map" ? (formData.lat !== undefined ? "valid" : undefined) : formData[field as keyof FormData]
      const isFieldValid = validateField(field, value)
      if (!isFieldValid) isValid = false
    })

    setTouched(newTouched)
    return isValid
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
          lat: formData.lat,
          lng: formData.lng,
          latitud: formData.lat, // Required for Direccion creation in backend
          longitud: formData.lng, // Required for Direccion creation in backend
          tarifa: formData.rate ? parseFloat(formData.rate) : 0,
          tarifa_hora: formData.rate ? parseFloat(formData.rate) : 0,
        }

        console.log("[v0] Creating professional profile with full data:", perfilData)
        await profesionalApi.crearPerfil(perfilData, token)
        console.log("[v0] Professional profile created")

        // Step 4: Upload other verification documents (async)
        const otherDocs = [
          { file: formData.identityFront, type: "cedula_frontal" },
          { file: formData.identityBack, type: "cedula_posterior" },
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
        
        const errorMsg = error.message ? error.message.toLowerCase() : ""
        if (errorMsg.includes("correo") && errorMsg.includes("registrado")) {
          // Keep all data, but clear email
          setFormData(prev => ({ ...prev, email: "" }))
          
          // Set error and touched for email
          setErrors(prev => ({ ...prev, email: "Este correo ya se encuentra registrado" }))
          setTouched(prev => ({ ...prev, email: true }))
          
          // Change step to the personal info step (Step 0)
          setSlideDirection("left")
          setCurrentStep(0)
          
          // Focus on the input after the step transition finishes
          setTimeout(() => {
            if (emailInputRef.current) {
              emailInputRef.current.focus()
            }
          }, 500) // 500ms to allow the slide animation to finish
        } else {
          alert(`Error al registrar: ${error.message || "Error desconocido"}`)
        }
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
            onBlur={handleBlur}
            className={`w-full px-4 py-3 bg-card border ${getInputBorderColor("fullName")} rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.fullName && touched.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Cédula *</label>
          <input
            type="text"
            name="cedula"
            value={formData.cedula}
            onChange={handleInputChange}
            onBlur={handleBlur}
            pattern="\d*"
            inputMode="numeric"
            className={`w-full px-4 py-3 bg-card border ${getInputBorderColor("cedula")} rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.cedula && touched.cedula && <p className="text-red-400 text-sm mt-1">{errors.cedula}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Teléfono de Contacto *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            onBlur={handleBlur}
            pattern="\d*"
            inputMode="numeric"
            className={`w-full px-4 py-3 bg-card border ${getInputBorderColor("phone")} rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.phone && touched.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Correo Electrónico *</label>
          <input
            ref={emailInputRef}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 bg-card border ${getInputBorderColor("email")} rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.email && touched.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Contraseña (mínimo 8 caracteres, mayúscula, minúscula y especial) *
          </label>
          <div className="relative mt-auto">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 bg-card border ${getInputBorderColor("password")} rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && touched.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
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
              onBlur={handleBlur}
              className={`w-full px-4 py-3 bg-card border ${getInputBorderColor("confirmPassword")} rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && touched.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">Foto de Perfil *</label>
        <input
          id="profileImage"
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={(e) => handleFileChange("profileImage", e.target.files?.[0] || null)}
          className="hidden"
        />
        <label
          htmlFor="profileImage"
          className={`flex items-center justify-center w-full h-32 border-2 border-dashed ${errors.profileImage ? "border-red-400" : formData.profileImage ? "border-green-500 bg-green-500/10" : "border-border"} rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300 group`}
        >
          <div className="flex flex-col items-center justify-center">
            {formData.profileImage ? (
              <CheckCircle2 className="size-8 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
            ) : (
              <Upload className="size-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
            )}
            <p className={`text-sm ${formData.profileImage ? "text-green-600 font-medium" : "text-muted-foreground"}`}>
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
            onBlur={(e) => {
              setTouched(prev => ({ ...prev, profession: true }))
              validateField("profession", e.target.value)
            }}
            className={`w-full px-4 py-3 bg-card border ${getInputBorderColor("profession")} rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
          >
            <option value="">Selecciona tu profesión</option>
            {professions.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.nombre}
              </option>
            ))}
          </select>
          {errors.profession && touched.profession && <p className="text-red-400 text-sm mt-1">{errors.profession}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Especialidad *</label>
          <select
            name="specialty"
            value={formData.specialty}
            onChange={(e) => handleSelectChange("specialty", e.target.value)}
            onBlur={(e) => {
              setTouched(prev => ({ ...prev, specialty: true }))
              validateField("specialty", e.target.value)
            }}
            disabled={!formData.profession}
            className={`w-full px-4 py-3 bg-card border ${getInputBorderColor("specialty")} rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50`}
          >
            <option value="">Selecciona tu especialidad</option>
            {specialties.map((spec) => (
              <option key={spec.id} value={spec.id}>
                {spec.nombre}
              </option>
            ))}
          </select>
          {errors.specialty && touched.specialty && <p className="text-red-400 text-sm mt-1">{errors.specialty}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Años de Experiencia</label>
          <input
            type="number"
            name="yearsExperience"
            min="0"
            max="70"
            step="1"
            value={formData.yearsExperience === 0 ? "" : formData.yearsExperience}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onFocus={(e) => {
              if (formData.yearsExperience === 0) {
                e.target.value = ""
              }
            }}
            placeholder="0"
            className={`w-full px-4 py-3 bg-card border ${getInputBorderColor("yearsExperience")} rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.yearsExperience && touched.yearsExperience && <p className="text-red-400 text-sm mt-1">{errors.yearsExperience}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Tarifa o Precio (Opcional)</label>
          <input
            type="text"
            inputMode="decimal"
            name="rate"
            value={formData.rate}
            onChange={handleInputChange}
            onBlur={(e) => {
              const val = e.target.value;
              if (val) {
                const num = parseFloat(val);
                if (!isNaN(num)) {
                  setFormData(prev => ({ ...prev, rate: num.toFixed(2) }));
                }
              }
            }}
            placeholder="0.00"
            className={`w-full px-4 py-3 bg-card border ${errors.rate ? "border-red-400" : "border-border"} rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.rate && <p className="text-red-400 text-sm mt-1">{errors.rate}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-muted-foreground mb-2">Modalidad de Trabajo *</label>
          <select
            name="workMode"
            value={formData.workMode}
            onChange={(e) => handleSelectChange("workMode", e.target.value)}
            onBlur={(e) => {
              setTouched(prev => ({ ...prev, workMode: true }))
              validateField("workMode", e.target.value)
            }}
            className={`w-full px-4 py-3 bg-card border ${getInputBorderColor("workMode")} rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
          >
            <option value="">Selecciona la modalidad</option>
            {workModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
          {errors.workMode && touched.workMode && <p className="text-red-400 text-sm mt-1">{errors.workMode}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Descripción, escribe tu presentación como profesional* (máximo 80 caracteres)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          onBlur={handleBlur}
          maxLength={80}
          rows={4}
          className={`w-full px-4 py-3 bg-card border ${getInputBorderColor("description")} rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
        />
        <p className="text-xs text-muted-foreground mt-1">{formData.description.length}/80 caracteres</p>
        {errors.description && touched.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
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
            onBlur={(e) => {
              setTouched(prev => ({ ...prev, province: true }))
              validateField("province", e.target.value)
            }}
            className={`w-full px-4 py-3 bg-card border ${getInputBorderColor("province")} rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
          >
            <option value="">Selecciona provincia</option>
            {provinces.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.nombre}
              </option>
            ))}
          </select>
          {errors.province && touched.province && <p className="text-red-400 text-sm mt-1">{errors.province}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Ciudad *</label>
          <select
            name="city"
            value={formData.city}
            onChange={(e) => handleSelectChange("city", e.target.value)}
            onBlur={(e) => {
              setTouched(prev => ({ ...prev, city: true }))
              validateField("city", e.target.value)
            }}
            disabled={!formData.province}
            className={`w-full px-4 py-3 bg-card border ${getInputBorderColor("city")} rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50`}
          >
            <option value="">Selecciona ciudad</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.nombre}
              </option>
            ))}
          </select>
          {errors.city && touched.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
        </div>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-muted-foreground mb-4">Ubicación en el Mapa</label>
        <div className={`border ${errors.map && touched.map ? 'border-red-400' : 'border-border'} rounded-lg overflow-hidden`}>
          <LocationMap
            lat={formData.lat}
            lng={formData.lng}
            onChange={handleLocationChange}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Mueve el pin o haz clic en el mapa para establecer tu ubicación exacta.
        </p>
        {errors.map && touched.map && <p className="text-red-400 text-sm mt-1">{errors.map}</p>}
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Dirección Exacta * <span className="text-red-500 font-normal text-xs ml-1">(por favor revisa que la dirección esté correcta)</span>
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 bg-card border ${getInputBorderColor("address")} rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
        />
        {errors.address && touched.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
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
  )

  const renderDocuments = () => (
    <div className="space-y-6">
      <h2 className="font-oswald text-2xl font-bold text-foreground mb-8">Documentos de Verificación</h2>
      <p className="text-muted-foreground text-sm mb-4">
        Todos los documentos son opcionales. Puedes subirlos más tarde.
      </p>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-4">
            Documento de Identidad (Cédula o DNI) - Obligatorio
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Parte Frontal</p>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={(e) => handleFileChange("identityFront", e.target.files?.[0] || null)}
                className="hidden"
                id="identityFront"
              />
              <label
                htmlFor="identityFront"
                className={`flex items-center justify-center w-full h-32 border-2 border-dashed ${errors.identityFront ? "border-red-400" : formData.identityFront ? "border-green-500 bg-green-500/10" : "border-border"} rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300 group`}
              >
                <div className="flex flex-col items-center justify-center px-2 text-center">
                  {formData.identityFront ? (
                    <CheckCircle2 className="size-6 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
                  ) : (
                    <Upload className="size-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  )}
                  <p className={`text-xs truncate w-full ${formData.identityFront ? "text-green-600 font-medium" : "text-muted-foreground"}`}>
                    {formData.identityFront ? formData.identityFront.name : "Subir Frontal"}
                  </p>
                </div>
              </label>
              {errors.identityFront && <p className="text-red-400 text-xs mt-1 text-center">{errors.identityFront}</p>}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Parte Posterior</p>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={(e) => handleFileChange("identityBack", e.target.files?.[0] || null)}
                className="hidden"
                id="identityBack"
              />
              <label
                htmlFor="identityBack"
                className={`flex items-center justify-center w-full h-32 border-2 border-dashed ${errors.identityBack ? "border-red-400" : formData.identityBack ? "border-green-500 bg-green-500/10" : "border-border"} rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300 group`}
              >
                <div className="flex flex-col items-center justify-center px-2 text-center">
                  {formData.identityBack ? (
                    <CheckCircle2 className="size-6 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
                  ) : (
                    <Upload className="size-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  )}
                  <p className={`text-xs truncate w-full ${formData.identityBack ? "text-green-600 font-medium" : "text-muted-foreground"}`}>
                    {formData.identityBack ? formData.identityBack.name : "Subir Posterior"}
                  </p>
                </div>
              </label>
              {errors.identityBack && <p className="text-red-400 text-xs mt-1 text-center">{errors.identityBack}</p>}
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Título Profesional - Opcional</label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={(e) => handleFileChange("title", e.target.files?.[0] || null)}
            className="hidden"
            id="title"
          />
          <label
            htmlFor="title"
            className={`flex items-center justify-center w-full h-32 border-2 border-dashed ${errors.title ? "border-red-400" : formData.title ? "border-green-500 bg-green-500/10" : "border-border"} rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300 group`}
          >
            <div className="flex flex-col items-center justify-center">
              {formData.title ? (
                <CheckCircle2 className="size-8 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
              ) : (
                <Upload className="size-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
              )}
              <p className={`text-sm ${formData.title ? "text-green-600 font-medium" : "text-muted-foreground"}`}>
                {formData.title ? formData.title.name : "Sube tu título profesional"}
              </p>
            </div>
          </label>
          {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Licencia Profesional - Opcional
          </label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={(e) => handleFileChange("license", e.target.files?.[0] || null)}
            className="hidden"
            id="license"
          />
          <label
            htmlFor="license"
            className={`flex items-center justify-center w-full h-32 border-2 border-dashed ${errors.license ? "border-red-400" : formData.license ? "border-green-500 bg-green-500/10" : "border-border"} rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300 group`}
          >
            <div className="flex flex-col items-center justify-center">
              {formData.license ? (
                <CheckCircle2 className="size-8 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
              ) : (
                <Upload className="size-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
              )}
              <p className={`text-sm ${formData.license ? "text-green-600 font-medium" : "text-muted-foreground"}`}>
                {formData.license ? formData.license.name : "Sube tu licencia profesional"}
              </p>
            </div>
          </label>
          {errors.license && <p className="text-red-400 text-sm mt-1">{errors.license}</p>}
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
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Palabras Clave (Tags) * <span className="text-red-500 font-normal text-xs ml-1">(Las usamos para que te encuentren más fácilmente en el buscador)</span>
          <br />
          <span className="text-gray-500 font-normal text-xs ml-1">Te recomendamos usar palabras clave relacionadas con tu especialidad, servicios y experiencia.</span>
        </label>
        
        <div className={`w-full min-h-[50px] px-3 py-2 bg-card border ${errors.tags ? "border-red-400" : "border-border"} rounded-lg text-foreground focus-within:ring-2 focus-within:ring-primary flex flex-wrap gap-2 items-center`}>
          {formData.tags.split(',').filter(Boolean).map((tag, index) => (
            <span key={index} className="flex items-center gap-1.5 bg-green-100/60 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              <button
                type="button"
                className="hover:bg-green-200/50 rounded-full p-0.5 transition-colors focus:outline-none"
                onClick={() => {
                  const updatedTags = formData.tags.split(',').filter(Boolean).filter((_, i) => i !== index).join(',');
                  setFormData(prev => ({ ...prev, tags: updatedTags }));
                  setTouched(prev => ({ ...prev, tags: true }))
                  validateField("tags", updatedTags)
                }}
              >
                <X size={14} className="text-green-700" />
              </button>
              <span>{tag}</span>
            </span>
          ))}

          <input
            type="text"
            value={tagInput}
            onChange={(e) => {
              setTagInput(e.target.value)
              if (errors.tags) setErrors(prev => ({ ...prev, tags: "" }))
            }}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                const newTag = tagInput.trim();
                // Avoid empty tags or duplicates
                if (newTag) {
                  const currentList = formData.tags.split(',').filter(Boolean);
                  if (!currentList.includes(newTag)) {
                    currentList.push(newTag);
                    const finalTags = currentList.join(',')
                    setFormData(prev => ({ ...prev, tags: finalTags }));
                    setTouched(prev => ({ ...prev, tags: true }))
                    validateField("tags", finalTags)
                  }
                  setTagInput("");
                }
              } else if (e.key === 'Backspace' && tagInput === '') {
                // Feature to remove last tag automatically if backspace on empty input
                e.preventDefault();
                const currentList = formData.tags.split(',').filter(Boolean);
                if (currentList.length > 0) {
                  currentList.pop();
                  const finalTags = currentList.join(',')
                  setFormData(prev => ({ ...prev, tags: finalTags }));
                  setTouched(prev => ({ ...prev, tags: true }))
                  validateField("tags", finalTags)
                }
              }
            }}
            placeholder="Escribe una palabra y presiona espacio"
            className="flex-1 min-w-[120px] bg-transparent focus:outline-none placeholder:text-muted-foreground/50 text-foreground"
          />
        </div>
        {errors.tags && touched.tags && <p className="text-red-400 text-sm mt-1">{errors.tags}</p>}
        <p className="text-xs text-muted-foreground mt-2">Usa espacio para agregar una nueva etiqueta</p>
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
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;

              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (isCompleted) {
                        setSlideDirection("left");
                        setCurrentStep(index);
                        setErrors({});
                      }
                    }}
                    disabled={!isCompleted && !isActive}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${isCompleted
                      ? "bg-primary text-primary-foreground cursor-pointer hover:opacity-80"
                      : isActive
                        ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background cursor-default"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                  >
                    {isCompleted ? <Check size={20} /> : index + 1}
                  </button>
                  <p
                    className={`text-sm mt-2 font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {step.title}
                  </p>
                </div>
              );
            })}
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
                <div className="space-y-4 mb-6">
                  <p className="font-arimo text-muted-foreground">
                    Tu cuenta ha sido creada exitosamente.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-blue-700 dark:text-blue-300 font-medium mb-1">
                      ¡Un paso más!
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Hemos enviado un enlace a tu correo electrónico. Por favor, revísalo y haz clic en el enlace para <b>activar tu cuenta</b>.
                    </p>
                  </div>
                  <p className="font-arimo text-xs text-muted-foreground">
                    Tu perfil profesional será revisado por nuestro equipo una vez que verifiques tu correo.
                  </p>
                </div>
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
