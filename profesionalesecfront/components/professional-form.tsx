"use client"

import type React from "react"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, ChevronLeft, ChevronRight, Home, Upload } from "lucide-react"
import { Check } from "lucide-react" // Declared the Check variable

const mockData = {
  professions: [
    "Derecho",
    "Salud",
    "Economia y Administracion",
    "Oficios y mas",
    "Comunicacion",
    "Educacion",
    "Ingenieria y Tecnologia",
    "Diseño y Construccion",
    "Agraria",
    "Arte y Cultura",
    "Salud Mental",
  ],
  specialties: {
    Derecho: [
      "Derecho Penal",
      "Derecho Civil",
      "Derecho Laboral",
      "Derecho Constitucional",
      "Derecho Administrativo",
      "Derecho Mercantil",
      "Derecho Internacional",
      "Derecho Ambiental",
    ],
    Salud: [
      "Medicina General",
      "Enfermería",
      "Odontología",
      "Nutrición",
      "Laboratorio Clínico",
      "Obstetricia",
      "Terapia Física",
    ],
    "Economia y Administracion": [
      "Contabilidad",
      "Auditoría",
      "Finanzas",
      "Administración de Empresas",
      "Gestión de Talento Humano",
      "Comercio Exterior",
      "Logística y Operaciones",
    ],
    "Oficios y mas": [
      "Cocinero/a",
      "Mesero/a",
      "Maestro Panadero",
      "Mecánico Automotriz",
      "Maestro Albañil",
      "Carpintero",
      "Electricista",
      "Soldador",
      "Pintor de Obra",
      "Plomero",
      "Chofer Profesional",
    ],
    Comunicacion: [
      "Periodismo",
      "Comunicación Corporativa",
      "Producción Audiovisual",
      "Relaciones Públicas",
      "Locución",
      "Diseño Publicitario",
      "Gestión de Redes Sociales",
    ],
    Educacion: [
      "Educación Inicial",
      "Educación Básica",
      "Educación Especial",
      "Docencia en Matemáticas",
      "Docencia en Lengua y Literatura",
      "Docencia en Ciencias Sociales",
      "Docencia en Ciencias Naturales",
      "Educación Física",
    ],
    "Ingenieria y Tecnologia": [
      "Ingeniería en Sistemas",
      "Ingeniería Eléctrica",
      "Ingeniería Electrónica",
      "Ingeniería Mecánica",
      "Ingeniería Industrial",
      "Ingeniería en Telecomunicaciones",
      "Ingeniería Civil",
      "Ingeniería Química",
      "Ingeniería Biomédica",
      "Ingeniería en Energías Renovables",
      "Ingeniería en Minas",
      "Ingeniería en Petróleos",
      "Ingeniería Geológica",
      "Ingeniería en Transporte",
      "Automatización Industrial",
      "Desarrollo de Software",
      "Ciberseguridad",
      "Big Data",
      "Inteligencia Artificial",
    ],
    "Diseño y Construccion": [
      "Arquitectura",
      "Dibujo Técnico",
      "Topografía",
      "Diseño de Interiores",
      "Urbanismo",
      "Construcción y Obra",
      "Modelado 3D y Render",
    ],
    Agraria: [
      "Ingeniería Agrícola",
      "Ingeniería Forestal",
      "Veterinaria",
      "Agroindustria",
      "Zootecnia",
      "Gestión Ambiental Rural",
      "Producción Agropecuaria",
      "Riego y Drenaje",
      "Silvicultura",
    ],
    "Arte y Cultura": [
      "Música",
      "Pintura",
      "Danza",
      "Teatro",
      "Fotografía",
      "Escultura",
      "Diseño Gráfico",
      "Cine y Dirección",
    ],
    "Salud Mental": [
      "Psicología Clínica",
      "Psicopedagogía",
      "Terapia Ocupacional",
      "Neuropsicología",
      "Psicología Infantil",
      "Psicología Organizacional",
    ],
  },
  provinces: [
    "Azuay",
    "Bolívar",
    "Cañar",
    "Carchi",
    "Chimborazo",
    "Cotopaxi",
    "El Oro",
    "Esmeraldas",
    "Galápagos",
    "Guayas",
    "Imbabura",
    "Loja",
    "Los Ríos",
    "Manabí",
    "Morona Santiago",
    "Napo",
    "Orellana",
    "Pastaza",
    "Pichincha",
    "Santa Elena",
    "Santo Domingo de los Tsáchilas",
    "Sucumbíos",
    "Tungurahua",
    "Zamora Chinchipe",
  ],
  cities: {
    Azuay: [
      "Cuenca",
      "Gualaceo",
      "Paute",
      "Sevilla de Oro",
      "Santa Isabel",
      "Sigsig",
      "Oña",
      "Nabón",
      "Guachapala",
      "Camilo Ponce Enríquez",
    ],
    Bolívar: ["Guaranda", "Caluma", "Chillanes", "Chimbo", "Echeandía", "Las Naves", "San Miguel"],
    Cañar: ["Azogues", "Biblián", "La Troncal", "Cañar", "El Tambo", "Suscal", "Déleg"],
    Carchi: ["Tulcán", "San Gabriel", "El Ángel", "Mira", "Huaca", "Bolívar"],
    Chimborazo: ["Riobamba", "Alausí", "Colta", "Chambo", "Guano", "Pallatanga", "Penipe", "Cumandá"],
    Cotopaxi: ["Latacunga", "La Maná", "Pujilí", "Salcedo", "Sigchos", "Saquisilí"],
    "El Oro": [
      "Machala",
      "Arenillas",
      "Atahualpa",
      "Balsas",
      "Chilla",
      "El Guabo",
      "Huaquillas",
      "Las Lajas",
      "Marcabelí",
      "Pasaje",
      "Piñas",
      "Portovelo",
      "Santa Rosa",
      "Zaruma",
    ],
    Esmeraldas: ["Esmeraldas", "Valdez", "Muisne", "Rosa Zárate", "San Lorenzo", "Rioverde"],
    Galápagos: ["Puerto Baquerizo Moreno", "Puerto Ayora", "Puerto Villamil"],
    Guayas: [
      "Guayaquil",
      "Alfredo Baquerizo Moreno",
      "Balao",
      "Balzar",
      "Colimes",
      "Daule",
      "Durán",
      "El Empalme",
      "El Triunfo",
      "General Antonio Elizalde",
      "Isidro Ayora",
      "Lomas de Sargentillo",
      "Marcelino Maridueña",
      "Milagro",
      "Naranjal",
      "Naranjito",
      "Palestina",
      "Pedro Carbo",
      "Playas",
      "Salitre",
      "Samborondón",
      "Santa Lucía",
      "Simón Bolívar",
      "Yaguachi",
    ],
    Imbabura: ["Ibarra", "Atuntaqui", "Cotacachi", "Otavalo", "Pimampiro", "Urcuquí"],
    Loja: [
      "Loja",
      "Cariamanga",
      "Catacocha",
      "Catamayo",
      "Celica",
      "Gonzanamá",
      "Macará",
      "Paltas",
      "Pindal",
      "Puyango",
      "Quilanga",
      "Saraguro",
      "Sozoranga",
      "Zapotillo",
    ],
    "Los Ríos": [
      "Babahoyo",
      "Baba",
      "Buena Fe",
      "Mocache",
      "Montalvo",
      "Palenque",
      "Pimocha",
      "Quevedo",
      "Quinsaloma",
      "Ventanas",
      "Vinces",
    ],
    Manabí: [
      "Portoviejo",
      "Bolívar",
      "Chone",
      "El Carmen",
      "Flavio Alfaro",
      "Jama",
      "Jaramijó",
      "Jipijapa",
      "Junín",
      "Manta",
      "Montecristi",
      "Olmedo",
      "Paján",
      "Pedernales",
      "Pichincha",
      "Puerto López",
      "Rocafuerte",
      "San Vicente",
      "Santa Ana",
      "Sucre",
      "Tosagua",
      "24 de Mayo",
    ],
    "Morona Santiago": [
      "Macas",
      "Gualaquiza",
      "Sucúa",
      "Huamboya",
      "San Juan Bosco",
      "Taisha",
      "Logroño",
      "Santiago de Méndez",
      "Tiwintza",
      "Pablo Sexto",
    ],
    Napo: ["Tena", "Archidona", "Baeza", "Carlos Julio Arosemena Tola", "El Chaco"],
    Orellana: ["Coca", "Nuevo Rocafuerte", "La Joya de los Sachas", "Loreto", "Tiputini"],
    Pastaza: ["Puyo", "Arajuno", "Mera", "Santa Clara"],
    Pichincha: ["Quito", "Cayambe", "Machachi", "Puerto Quito", "Pedro Vicente Maldonado", "Sangolquí", "Tabacundo"],
    "Santa Elena": ["Santa Elena", "La Libertad", "Salinas"],
    "Santo Domingo de los Tsáchilas": ["Santo Domingo", "La Concordia"],
    Sucumbíos: ["Nueva Loja", "Cáscales", "Gonzalo Pizarro", "Putumayo", "Shushufindi", "Sucumbíos", "Tarapoa"],
    Tungurahua: ["Ambato", "Baños", "Cevallos", "Mocha", "Patate", "Pelileo", "Píllaro", "Quero", "Tisaleo"],
    "Zamora Chinchipe": ["Zamora", "Yantzaza", "Zumbi", "El Pangui", "Zapotillo", "Palanda", "Chinchipe", "Nangaritza"],
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
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") // Get plan from URL

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
    showPhone: false,
    showEmail: false,
    tags: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right")

  const steps = [
    { title: "Datos Personales", description: "Información básica" },
    { title: "Información Profesional", description: "Tu experiencia" },
    { title: "Ubicación", description: "Dónde trabajas" },
    { title: "Documentos", description: "Verifica tu identidad" },
    { title: "Preferencias", description: "Configuración final" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "cedula" || name === "phone") {
      // Only allow numeric characters
      if (!/^\d*$/.test(value)) {
        return // Don't update if non-numeric
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

  const validateStep = (): boolean => {
    const newErrors: FormErrors = {}

    switch (currentStep) {
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

  const handleSubmit = () => {
    if (validateStep()) {
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

        <div className="relative overflow-hidden">
          <div
            className={`transition-all duration-500 ease-in-out ${
              slideDirection === "right" ? "animate-in slide-in-from-right" : "animate-in slide-in-from-left"
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
                    <span className="font-bold text-primary"> $10 USD</span> a través de los siguientes métodos:
                  </p>

                  <div className="bg-muted/50 rounded-xl p-6 mb-6 text-left">
                    <h4 className="font-bold text-foreground mb-4 text-center">Métodos de Pago</h4>

                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-sm text-foreground mb-2">Transferencia Bancaria:</h5>
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

                      <div className="border-t border-border pt-4">
                        <h5 className="font-semibold text-sm text-foreground mb-2">PayPal:</h5>
                        <p className="text-sm text-muted-foreground">pagos@profesionales.ec</p>
                      </div>
                    </div>
                  </div>

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
