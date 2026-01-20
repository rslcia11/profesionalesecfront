"use client"

import type React from "react"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, ChevronLeft, ChevronRight, Home, Upload, Eye, EyeOff } from "lucide-react"
import { Check } from "lucide-react" // Declared the Check variable
import { authApi, profesionalApi, saveToken } from "@/lib/api"

const mockData = {
  professions: [
    { id: 1, nombre: "Derecho" },
    { id: 2, nombre: "Salud" },
    { id: 3, nombre: "Economia y Administracion" },
    { id: 4, nombre: "Oficios y mas" },
    { id: 5, nombre: "Comunicacion" },
    { id: 6, nombre: "Educacion" },
    { id: 7, nombre: "Ingenieria y Tecnologia" },
    { id: 8, nombre: "Diseño y Construccion" },
    { id: 9, nombre: "Agraria" },
    { id: 10, nombre: "Arte y Cultura" },
    { id: 11, nombre: "Salud Mental" },
  ],
  specialties: {
    Derecho: [
      { id: 1, nombre: "Derecho Penal" },
      { id: 2, nombre: "Derecho Civil" },
      { id: 3, nombre: "Derecho Laboral" },
      { id: 4, nombre: "Derecho Constitucional" },
      { id: 5, nombre: "Derecho Administrativo" },
      { id: 6, nombre: "Derecho Mercantil" },
      { id: 7, nombre: "Derecho Internacional" },
      { id: 8, nombre: "Derecho Ambiental" },
    ],
    Salud: [
      { id: 9, nombre: "Medicina General" },
      { id: 10, nombre: "Enfermería" },
      { id: 11, nombre: "Odontología" },
      { id: 12, nombre: "Nutrición" },
      { id: 13, nombre: "Laboratorio Clínico" },
      { id: 14, nombre: "Obstetricia" },
      { id: 15, nombre: "Terapia Física" },
    ],
    "Economia y Administracion": [
      { id: 16, nombre: "Contabilidad" },
      { id: 17, nombre: "Auditoría" },
      { id: 18, nombre: "Finanzas" },
      { id: 19, nombre: "Administración de Empresas" },
      { id: 20, nombre: "Gestión de Talento Humano" },
      { id: 21, nombre: "Comercio Exterior" },
      { id: 22, nombre: "Logística y Operaciones" },
    ],
    "Oficios y mas": [
      { id: 23, nombre: "Cocinero/a" },
      { id: 24, nombre: "Mesero/a" },
      { id: 25, nombre: "Maestro Panadero" },
      { id: 26, nombre: "Mecánico Automotriz" },
      { id: 27, nombre: "Maestro Albañil" },
      { id: 28, nombre: "Carpintero" },
      { id: 29, nombre: "Electricista" },
      { id: 30, nombre: "Soldador" },
      { id: 31, nombre: "Pintor de Obra" },
      { id: 32, nombre: "Plomero" },
      { id: 33, nombre: "Chofer Profesional" },
    ],
    Comunicacion: [
      { id: 34, nombre: "Periodismo" },
      { id: 35, nombre: "Comunicación Corporativa" },
      { id: 36, nombre: "Producción Audiovisual" },
      { id: 37, nombre: "Relaciones Públicas" },
      { id: 38, nombre: "Locución" },
      { id: 39, nombre: "Diseño Publicitario" },
      { id: 40, nombre: "Gestión de Redes Sociales" },
    ],
    Educacion: [
      { id: 41, nombre: "Educación Inicial" },
      { id: 42, nombre: "Educación Básica" },
      { id: 43, nombre: "Educación Especial" },
      { id: 44, nombre: "Docencia en Matemáticas" },
      { id: 45, nombre: "Docencia en Lengua y Literatura" },
      { id: 46, nombre: "Docencia en Ciencias Sociales" },
      { id: 47, nombre: "Docencia en Ciencias Naturales" },
      { id: 48, nombre: "Educación Física" },
    ],
    "Ingenieria y Tecnologia": [
      { id: 49, nombre: "Ingeniería en Sistemas" },
      { id: 50, nombre: "Ingeniería Eléctrica" },
      { id: 51, nombre: "Ingeniería Electrónica" },
      { id: 52, nombre: "Ingeniería Mecánica" },
      { id: 53, nombre: "Ingeniería Industrial" },
      { id: 54, nombre: "Ingeniería en Telecomunicaciones" },
      { id: 55, nombre: "Ingeniería Civil" },
      { id: 56, nombre: "Ingeniería Química" },
      { id: 57, nombre: "Ingeniería Biomédica" },
      { id: 58, nombre: "Ingeniería en Energías Renovables" },
      { id: 59, nombre: "Ingeniería en Minas" },
      { id: 60, nombre: "Ingeniería en Petróleos" },
      { id: 61, nombre: "Ingeniería Geológica" },
      { id: 62, nombre: "Ingeniería en Transporte" },
      { id: 63, nombre: "Automatización Industrial" },
      { id: 64, nombre: "Desarrollo de Software" },
      { id: 65, nombre: "Ciberseguridad" },
      { id: 66, nombre: "Big Data" },
      { id: 67, nombre: "Inteligencia Artificial" },
    ],
    "Diseño y Construccion": [
      { id: 68, nombre: "Arquitectura" },
      { id: 69, nombre: "Dibujo Técnico" },
      { id: 70, nombre: "Topografía" },
      { id: 71, nombre: "Diseño de Interiores" },
      { id: 72, nombre: "Urbanismo" },
      { id: 73, nombre: "Construcción y Obra" },
      { id: 74, nombre: "Modelado 3D y Render" },
    ],
    Agraria: [
      { id: 75, nombre: "Ingeniería Agrícola" },
      { id: 76, nombre: "Ingeniería Forestal" },
      { id: 77, nombre: "Veterinaria" },
      { id: 78, nombre: "Agroindustria" },
      { id: 79, nombre: "Zootecnia" },
      { id: 80, nombre: "Gestión Ambiental Rural" },
      { id: 81, nombre: "Producción Agropecuaria" },
      { id: 82, nombre: "Riego y Drenaje" },
      { id: 83, nombre: "Silvicultura" },
    ],
    "Arte y Cultura": [
      { id: 84, nombre: "Música" },
      { id: 85, nombre: "Pintura" },
      { id: 86, nombre: "Danza" },
      { id: 87, nombre: "Teatro" },
      { id: 88, nombre: "Fotografía" },
      { id: 89, nombre: "Escultura" },
      { id: 90, nombre: "Diseño Gráfico" },
      { id: 91, nombre: "Cine y Dirección" },
    ],
    "Salud Mental": [
      { id: 92, nombre: "Psicología Clínica" },
      { id: 93, nombre: "Psicopedagogía" },
      { id: 94, nombre: "Terapia Ocupacional" },
      { id: 95, nombre: "Neuropsicología" },
      { id: 96, nombre: "Psicología Infantil" },
      { id: 97, nombre: "Psicología Organizacional" },
    ],
  },
  provinces: [
    { id: 1, nombre: "Azuay" },
    { id: 2, nombre: "Bolívar" },
    { id: 3, nombre: "Cañar" },
    { id: 4, nombre: "Carchi" },
    { id: 5, nombre: "Chimborazo" },
    { id: 6, nombre: "Cotopaxi" },
    { id: 7, nombre: "El Oro" },
    { id: 8, nombre: "Esmeraldas" },
    { id: 9, nombre: "Galápagos" },
    { id: 10, nombre: "Guayas" },
    { id: 11, nombre: "Imbabura" },
    { id: 12, nombre: "Loja" },
    { id: 13, nombre: "Los Ríos" },
    { id: 14, nombre: "Manabí" },
    { id: 15, nombre: "Morona Santiago" },
    { id: 16, nombre: "Napo" },
    { id: 17, nombre: "Orellana" },
    { id: 18, nombre: "Pastaza" },
    { id: 19, nombre: "Pichincha" },
    { id: 20, nombre: "Santa Elena" },
    { id: 21, nombre: "Santo Domingo de los Tsáchilas" },
    { id: 22, nombre: "Sucumbíos" },
    { id: 23, nombre: "Tungurahua" },
    { id: 24, nombre: "Zamora Chinchipe" },
  ],
  cities: {
    Azuay: [
      { id: 1, nombre: "Cuenca" },
      { id: 2, nombre: "Gualaceo" },
      { id: 3, nombre: "Paute" },
      { id: 4, nombre: "Sevilla de Oro" },
      { id: 5, nombre: "Santa Isabel" },
      { id: 6, nombre: "Sigsig" },
      { id: 7, nombre: "Oña" },
      { id: 8, nombre: "Nabón" },
      { id: 9, nombre: "Guachapala" },
      { id: 10, nombre: "Camilo Ponce Enríquez" },
    ],
    Bolívar: [
      { id: 11, nombre: "Guaranda" },
      { id: 12, nombre: "Caluma" },
      { id: 13, nombre: "Chillanes" },
      { id: 14, nombre: "Chimbo" },
      { id: 15, nombre: "Echeandía" },
      { id: 16, nombre: "Las Naves" },
      { id: 17, nombre: "San Miguel" },
    ],
    Cañar: [
      { id: 18, nombre: "Azogues" },
      { id: 19, nombre: "Biblián" },
      { id: 20, nombre: "La Troncal" },
      { id: 21, nombre: "Cañar" },
      { id: 22, nombre: "El Tambo" },
      { id: 23, nombre: "Suscal" },
      { id: 24, nombre: "Déleg" },
    ],
    Carchi: [
      { id: 25, nombre: "Tulcán" },
      { id: 26, nombre: "San Gabriel" },
      { id: 27, nombre: "El Ángel" },
      { id: 28, nombre: "Mira" },
      { id: 29, nombre: "Huaca" },
      { id: 30, nombre: "Bolívar" },
    ],
    Chimborazo: [
      { id: 31, nombre: "Riobamba" },
      { id: 32, nombre: "Alausí" },
      { id: 33, nombre: "Colta" },
      { id: 34, nombre: "Chambo" },
      { id: 35, nombre: "Guano" },
      { id: 36, nombre: "Pallatanga" },
      { id: 37, nombre: "Penipe" },
      { id: 38, nombre: "Cumandá" },
    ],
    Cotopaxi: [
      { id: 39, nombre: "Latacunga" },
      { id: 40, nombre: "La Maná" },
      { id: 41, nombre: "Pujilí" },
      { id: 42, nombre: "Salcedo" },
      { id: 43, nombre: "Sigchos" },
      { id: 44, nombre: "Saquisilí" },
    ],
    "El Oro": [
      { id: 45, nombre: "Machala" },
      { id: 46, nombre: "Arenillas" },
      { id: 47, nombre: "Atahualpa" },
      { id: 48, nombre: "Balsas" },
      { id: 49, nombre: "Chilla" },
      { id: 50, nombre: "El Guabo" },
      { id: 51, nombre: "Huaquillas" },
      { id: 52, nombre: "Las Lajas" },
      { id: 53, nombre: "Marcabelí" },
      { id: 54, nombre: "Pasaje" },
      { id: 55, nombre: "Piñas" },
      { id: 56, nombre: "Portovelo" },
      { id: 57, nombre: "Santa Rosa" },
      { id: 58, nombre: "Zaruma" },
    ],
    Esmeraldas: [
      { id: 59, nombre: "Esmeraldas" },
      { id: 60, nombre: "Valdez" },
      { id: 61, nombre: "Muisne" },
      { id: 62, nombre: "Rosa Zárate" },
      { id: 63, nombre: "San Lorenzo" },
      { id: 64, nombre: "Rioverde" },
    ],
    Galápagos: [
      { id: 65, nombre: "Puerto Baquerizo Moreno" },
      { id: 66, nombre: "Puerto Ayora" },
      { id: 67, nombre: "Puerto Villamil" },
    ],
    Guayas: [
      { id: 68, nombre: "Guayaquil" },
      { id: 69, nombre: "Alfredo Baquerizo Moreno" },
      { id: 70, nombre: "Balao" },
      { id: 71, nombre: "Balzar" },
      { id: 72, nombre: "Colimes" },
      { id: 73, nombre: "Daule" },
      { id: 74, nombre: "Durán" },
      { id: 75, nombre: "El Empalme" },
      { id: 76, nombre: "El Triunfo" },
      { id: 77, nombre: "General Antonio Elizalde" },
      { id: 78, nombre: "Isidro Ayora" },
      { id: 79, nombre: "Lomas de Sargentillo" },
      { id: 80, nombre: "Marcelino Maridueña" },
      { id: 81, nombre: "Milagro" },
      { id: 82, nombre: "Naranjal" },
      { id: 83, nombre: "Naranjito" },
      { id: 84, nombre: "Palestina" },
      { id: 85, nombre: "Pedro Carbo" },
      { id: 86, nombre: "Playas" },
      { id: 87, nombre: "Salitre" },
      { id: 88, nombre: "Samborondón" },
      { id: 89, nombre: "Santa Lucía" },
      { id: 90, nombre: "Simón Bolívar" },
      { id: 91, nombre: "Yaguachi" },
    ],
    Imbabura: [
      { id: 92, nombre: "Ibarra" },
      { id: 93, nombre: "Atuntaqui" },
      { id: 94, nombre: "Cotacachi" },
      { id: 95, nombre: "Otavalo" },
      { id: 96, nombre: "Pimampiro" },
      { id: 97, nombre: "Urcuquí" },
    ],
    Loja: [
      { id: 98, nombre: "Loja" },
      { id: 99, nombre: "Cariamanga" },
      { id: 100, nombre: "Catacocha" },
      { id: 101, nombre: "Catamayo" },
      { id: 102, nombre: "Celica" },
      { id: 103, nombre: "Gonzanamá" },
      { id: 104, nombre: "Macará" },
      { id: 105, nombre: "Paltas" },
      { id: 106, nombre: "Pindal" },
      { id: 107, nombre: "Puyango" },
      { id: 108, nombre: "Quilanga" },
      { id: 109, nombre: "Saraguro" },
      { id: 110, nombre: "Sozoranga" },
      { id: 111, nombre: "Zapotillo" },
    ],
    "Los Ríos": [
      { id: 112, nombre: "Babahoyo" },
      { id: 113, nombre: "Baba" },
      { id: 114, nombre: "Buena Fe" },
      { id: 115, nombre: "Mocache" },
      { id: 116, nombre: "Montalvo" },
      { id: 117, nombre: "Palenque" },
      { id: 118, nombre: "Pimocha" },
      { id: 119, nombre: "Quevedo" },
      { id: 120, nombre: "Quinsaloma" },
      { id: 121, nombre: "Ventanas" },
      { id: 122, nombre: "Vinces" },
    ],
    Manabí: [
      { id: 123, nombre: "Portoviejo" },
      { id: 124, nombre: "Bolívar" },
      { id: 125, nombre: "Chone" },
      { id: 126, nombre: "El Carmen" },
      { id: 127, nombre: "Flavio Alfaro" },
      { id: 128, nombre: "Jama" },
      { id: 129, nombre: "Jaramijó" },
      { id: 130, nombre: "Jipijapa" },
      { id: 131, nombre: "Junín" },
      { id: 132, nombre: "Manta" },
      { id: 133, nombre: "Montecristi" },
      { id: 134, nombre: "Olmedo" },
      { id: 135, nombre: "Paján" },
      { id: 136, nombre: "Pedernales" },
      { id: 137, nombre: "Pichincha" },
      { id: 138, nombre: "Puerto López" },
      { id: 139, nombre: "Rocafuerte" },
      { id: 140, nombre: "San Vicente" },
      { id: 141, nombre: "Santa Ana" },
      { id: 142, nombre: "Sucre" },
      { id: 143, nombre: "Tosagua" },
      { id: 144, nombre: "24 de Mayo" },
    ],
    "Morona Santiago": [
      { id: 145, nombre: "Macas" },
      { id: 146, nombre: "Gualaquiza" },
      { id: 147, nombre: "Sucúa" },
      { id: 148, nombre: "Huamboya" },
      { id: 149, nombre: "San Juan Bosco" },
      { id: 150, nombre: "Taisha" },
      { id: 151, nombre: "Logroño" },
      { id: 152, nombre: "Santiago de Méndez" },
      { id: 153, nombre: "Tiwintza" },
      { id: 154, nombre: "Pablo Sexto" },
    ],
    Napo: [
      { id: 155, nombre: "Tena" },
      { id: 156, nombre: "Archidona" },
      { id: 157, nombre: "Baeza" },
      { id: 158, nombre: "Carlos Julio Arosemena Tola" },
      { id: 159, nombre: "El Chaco" },
    ],
    Orellana: [
      { id: 160, nombre: "Coca" },
      { id: 161, nombre: "Nuevo Rocafuerte" },
      { id: 162, nombre: "La Joya de los Sachas" },
      { id: 163, nombre: "Loreto" },
      { id: 164, nombre: "Tiputini" },
    ],
    Pastaza: [
      { id: 165, nombre: "Puyo" },
      { id: 166, nombre: "Arajuno" },
      { id: 167, nombre: "Mera" },
      { id: 168, nombre: "Santa Clara" },
    ],
    Pichincha: [
      { id: 169, nombre: "Quito" },
      { id: 170, nombre: "Cayambe" },
      { id: 171, nombre: "Machachi" },
      { id: 172, nombre: "Puerto Quito" },
      { id: 173, nombre: "Pedro Vicente Maldonado" },
      { id: 174, nombre: "Sangolquí" },
      { id: 175, nombre: "Tabacundo" },
    ],
    "Santa Elena": [
      { id: 176, nombre: "Santa Elena" },
      { id: 177, nombre: "La Libertad" },
      { id: 178, nombre: "Salinas" },
    ],
    "Santo Domingo de los Tsáchilas": [
      { id: 179, nombre: "Santo Domingo" },
      { id: 180, nombre: "La Concordia" },
    ],
    Sucumbíos: [
      { id: 181, nombre: "Nueva Loja" },
      { id: 182, nombre: "Cáscales" },
      { id: 183, nombre: "Gonzalo Pizarro" },
      { id: 184, nombre: "Putumayo" },
      { id: 185, nombre: "Shushufindi" },
      { id: 186, nombre: "Sucumbíos" },
      { id: 187, nombre: "Tarapoa" },
    ],
    Tungurahua: [
      { id: 188, nombre: "Ambato" },
      { id: 189, nombre: "Baños" },
      { id: 190, nombre: "Cevallos" },
      { id: 191, nombre: "Mocha" },
      { id: 192, nombre: "Patate" },
      { id: 193, nombre: "Pelileo" },
      { id: 194, nombre: "Píllaro" },
      { id: 195, nombre: "Quero" },
      { id: 196, nombre: "Tisaleo" },
    ],
    "Zamora Chinchipe": [
      { id: 197, nombre: "Zamora" },
      { id: 198, nombre: "Yantzaza" },
      { id: 199, nombre: "Zumbi" },
      { id: 200, nombre: "El Pangui" },
      { id: 201, nombre: "Zapotillo" },
      { id: 202, nombre: "Palanda" },
      { id: 203, nombre: "Chinchipe" },
      { id: 204, nombre: "Nangaritza" },
    ],
  },
  workModes: ["Presencial", "Virtual", "Ambas modalidades"],
}

interface FormData {
  fullName: string
  cedula: string // Added cedula field
  email: string
  password: string
  confirmPassword: string
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
          contrasena_hash: formData.password,
          rol_id: 2, // Always 2 for professionals (handled by backend)
          telefono: formData.phone,
          cedula: formData.cedula,
        }

        console.log("[v0] Registering user:", registerData)
        const authResponse = await authApi.register(registerData)
        console.log("[v0] User registered successfully:", authResponse)

        // Step 2: Save token
        if (authResponse.token) {
          saveToken(authResponse.token)
          console.log("[v0] Token saved")
        }

        // Step 3: Create professional profile
        // Get IDs from the selected values
        const selectedProfession = mockData.professions.find((p) => p.nombre === formData.profession)
        const selectedSpecialty = mockData.specialties[formData.profession]?.find(
          (s) => s.nombre === formData.specialty,
        )
        const selectedProvince = mockData.provinces.find((p) => p.nombre === formData.province)
        const selectedCity = mockData.cities[formData.province]?.find((c) => c.nombre === formData.city)

        const perfilData = {
          profesion_id: selectedProfession?.id || 0,
          especialidad_id: selectedSpecialty?.id,
          ciudad_id: selectedCity?.id,
          descripcion: formData.description,
          tarifa_hora: formData.rate || undefined,
        }

        console.log("[v0] Creating professional profile:", perfilData)
        const perfilResponse = await profesionalApi.crearPerfil(perfilData, authResponse.token!)
        console.log("[v0] Professional profile created:", perfilResponse)

        // Step 4: Upload documents if provided (optional)
        if (authResponse.token) {
          try {
            const uploadPromises = []

            // Helper para subir solo si existe
            const uploadIfHasFile = async (file: File | null, tipo: string) => {
              if (file) return profesionalApi.subirDocumento(tipo, file, authResponse.token!)
            }

            if (formData.identity) uploadPromises.push(uploadIfHasFile(formData.identity, "cedula"))
            if (formData.title) uploadPromises.push(uploadIfHasFile(formData.title, "titulo"))
            if (formData.license) uploadPromises.push(uploadIfHasFile(formData.license, "licencia")) // opcional
            if (formData.profileImage) uploadPromises.push(uploadIfHasFile(formData.profileImage, "foto_perfil"))

            await Promise.all(uploadPromises)
            console.log("[v0] Documents uploaded successfully")
          } catch (uploadError: any) {
            console.error("Error subiendo documentos:", uploadError)
            // Assuming 'toast' is available in this scope
            // toast({
            //   title: "Registro exitoso con advertencia",
            //   description: "Tu perfil se creó, pero hubo un error al subir algunos documentos: " + uploadError.message,
            //   variant: "warning",
            // })
            // No hacemos throw aquí, permitimos que continúe al éxito
          }
        }

        setShowSuccessModal(true)
      } catch (error: any) {
        console.error("[v0] Registration error:", error)
        // Check if error is "User already exists" (status 409 or similar message) to guide user?
        // Assuming 'setErrors' and 'toast' are available in this scope
        // setErrors((prev) => ({ ...prev, form: error.message || "Error al registrar profesional" }))

        // toast({
        //     title: "Error de registro",
        //     description: error.message,
        //     variant: "destructive"
        // })
        alert(`Error al registrar: ${error instanceof Error ? error.message : "Error desconocido"}`)
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
        <div className="relative">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Contraseña (mínimo 8 caracteres, mayúscula y minúscula) *
          </label>
          <div className="relative">
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
        <div className="relative">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Confirmar Contraseña *
          </label>
          <div className="relative">
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
            {mockData.professions.map((prof) => (
              <option key={prof.id} value={prof.nombre}>
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
            {formData.profession &&
              mockData.specialties[formData.profession as keyof typeof mockData.specialties]?.map((spec) => (
                <option key={spec.id} value={spec.nombre}>
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
            onChange={(e) => handleSelectChange("province", e.target.value)}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Selecciona provincia</option>
            {mockData.provinces.map((prov) => (
              <option key={prov.id} value={prov.nombre}>
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
            {formData.province &&
              mockData.cities[formData.province as keyof typeof mockData.cities]?.map((city) => (
                <option key={city.id} value={city.nombre}>
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
