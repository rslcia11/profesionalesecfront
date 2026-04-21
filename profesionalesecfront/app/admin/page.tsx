"use client"
import { useRouter } from "next/navigation"

import { useState, useEffect, useMemo } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  CalendarIcon,
  Users,
  FileText,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  AlertCircle,
  TrendingUp,
  Clock,
  MapPin,
  BookOpen,
  CheckCircle2,
  XCircle,
  UserPlus,
  Info,
  Globe,
  Eye,
  Loader2,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Music,
  Upload
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import { formatUrl, cn } from "@/lib/utils"
import { adminApi, catalogosApi, ponenciasApi, profesionalApi, articulosApi, API_URL, ponentesApi, revistaApi, multimediaApi, type Articulo } from "@/lib/api"
import dynamic from "next/dynamic"
const LocationMap = dynamic(() => import("@/components/shared/location-map"), { ssr: false })
import { useAnimatedConfirm, AnimatedConfirm } from "@/components/shared/animated-confirm"
import ArticleFormModal from "@/components/article-form-modal"

type Ponencia = {
  id: number
  titulo: string
  descripcion: string
  fecha_inicio: Date
  hora_inicio?: string
  fecha_fin: Date
  hora_fin?: string
  precio: number
  cupo: number
  profesion_id?: number
  estado: "borrador" | "publicada" | "finalizada"
  imagen_banner?: string
  video_url?: string
  galeria_fotos?: string[] | string
  es_destacado?: boolean
  direccion?: string
  latitud?: number
  longitud?: number
  provincia_id?: number
  ciudad_id?: number
}

type PerfilPendiente = {
  id: number
  verificado: boolean
  estado: "pendiente" | "aprobado" | "rechazado"
  nombre: string
  correo: string
  telefono: string
  profesion: string
  fecha_registro: string
  perfil_estado: {
    estado: "pendiente" | "aprobado" | "rechazado"
  }
}

type Plan = {
  id: number
  nombre: string
  descripcion: string
  precio_base: number
  tipo: "suscripcion" | "one_time"
  duracion_dias: number | null
  activo: boolean
}

type Revista = {
  id: number
  titulo: string
  descripcion: string
  portada_url: string
  pdf_url: string
  fecha_publicacion: string
  edicion: string
  activo: boolean
}

export default function AdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const { confirm: animatedConfirm, isOpen: isConfirmOpen, options: confirmOptions, handleConfirm: onConfirm, handleCancel: onCancel } = useAnimatedConfirm()

  const [activeTab, setActiveTab] = useState("dashboard")

  const [ponencias, setPonencias] = useState<Ponencia[]>([])
  const [perfilesPendientes, setPerfilesPendientes] = useState<PerfilPendiente[]>([])
  const [processingProfiles, setProcessingProfiles] = useState<Record<number, "approving" | "rejecting" | null>>({})

  const [planes, setPlanes] = useState<Plan[]>([
    {
      id: 1,
      nombre: "Plan Básico",
      descripcion: "Acceso básico a la plataforma con funcionalidades esenciales",
      precio_base: 10.0,
      tipo: "suscripcion",
      duracion_dias: 30,
      activo: true,
    },
  ])

  // Articles state for moderation
  const [adminArticulos, setAdminArticulos] = useState<Articulo[]>([])

  // Professions catalog for conversatorio form
  const [profesiones, setProfesiones] = useState<any[]>([])
  const [provincias, setProvincias] = useState<any[]>([])
  const [ciudades, setCiudades] = useState<any[]>([])

  // Ponentes management
  const [selectedPonenciaId, setSelectedPonenciaId] = useState<number | null>(null)
  const [ponentesList, setPonentesList] = useState<any[]>([])
  const [loadingPonentes, setLoadingPonentes] = useState(false)

  // External Speaker State
  const [isExternalSpeaker, setIsExternalSpeaker] = useState(false)
  const [externalSpeakerName, setExternalSpeakerName] = useState("")

  // Inscritos Management
  const [selectedInscritosPonencia, setSelectedInscritosPonencia] = useState<any>(null)
  const [isInscritosDialogOpen, setIsInscritosDialogOpen] = useState(false)
  const [inscritosList, setInscritosList] = useState<any[]>([])
  const [loadingInscritos, setLoadingInscritos] = useState(false)
  const [generatingCertificates, setGeneratingCertificates] = useState(false)

  // Revistas Management
  const [revistas, setRevistas] = useState<Revista[]>([])
  const [loadingRevistas, setLoadingRevistas] = useState(false)
  const [isRevistaDialogOpen, setIsRevistaDialogOpen] = useState(false)
  const [revistaForm, setRevistaForm] = useState<Partial<Revista>>({
    titulo: "",
    descripcion: "",
    portada_url: "",
    pdf_url: "",
    fecha_publicacion: new Date().toISOString().split("T")[0],
    edicion: "",
    activo: true
  })
  const resetRevistaForm = () => {
    setRevistaForm({
      titulo: "",
      descripcion: "",
      portada_url: "",
      pdf_url: "",
      fecha_publicacion: new Date().toISOString().split("T")[0],
      edicion: "",
      activo: true
    })
  }

  const loadData = async () => {
    const token = localStorage.getItem("auth_token")
    if (!token) return

    // Load professions catalog
    try {
      const profs = await catalogosApi.obtenerProfesiones()
      setProfesiones(Array.isArray(profs) ? profs : [])
      const provs = await catalogosApi.obtenerProvincias()
      setProvincias(Array.isArray(provs) ? provs : [])
    } catch (e) {
      console.warn("Could not load professions catalog:", e)
    }

    try {
      const stats = await adminApi.getStats(token)
      setPonencias(stats.ponencias)

      // Map backend data to frontend structure
      const mappedProfiles = stats.profesionales.map((p: any) => {
        const getEstado = (estadoId: number): "aprobado" | "rechazado" | "pendiente" => {
          switch (estadoId) {
            case 3: return "aprobado";
            case 4: return "rechazado";
            default: return "pendiente";
          }
        };
        const estado = getEstado(p.estado_id);

          return {
            id: p.id,
            usuario_id: p.usuario_id,
            verificado: p.verificado,
            estado,
            nombre: p.usuario?.nombre || "Sin nombre",
            correo: p.usuario?.correo || "",
            telefono: p.telefono || p.usuario?.telefono || "No disponible (API)",
            cedula: p.cedula || p.usuario?.cedula || p.usuario?.identificacion || p.usuario?.dni || p.usuario?.nro_identificacion || p.usuario?.cedula_identidad || "No disponible (API)",
            profesion: p.profesion ? p.profesion.nombre : "Sin profesión",
            especialidad: p.especialidad ? p.especialidad.nombre : "Sin especialidad",
            ciudad: p.ciudad ? p.ciudad.nombre : "",
            provincia: p.ciudad?.provincia ? p.ciudad.provincia.nombre : "",
            tarifa: p.tarifa ? `$${p.tarifa}` : (p.tarifa_hora ? `$${p.tarifa_hora}` : "No definida"),
            fecha_registro: p.usuario?.creado_en || new Date().toISOString(),
            descripcion: p.descripcion || "Sin descripción",
            documentos: p.documentos || [],
            foto_url: formatUrl(p.foto_url || p.usuario?.foto_url || p.usuario?.foto || p.usuario?.avatar || p.usuario?.imagen_url),
            direccion_texto: (p.calle_principal || p.direccion?.calle_principal)
              ? `${p.calle_principal || p.direccion?.calle_principal} ${(p.referencia || p.direccion?.referencia) ? `(${p.referencia || p.direccion?.referencia})` : ""}`
              : "No registrada",
            link_maps: (p.lat && p.lng) || (p.latitud && p.longitud)
              ? `https://www.google.com/maps?q=${p.lat || p.latitud},${p.lng || p.longitud}`
              : p.direccion?.link_maps || null,
            perfil_estado: { estado },
          };
        })
        setPerfilesPendientes(mappedProfiles)

        setPlanes(stats.planes)
      } catch (error) {
        console.error("Error loading admin data:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del panel.",
          variant: "destructive",
        })
      }

    // Load articles
    try {
      const articlesData = await articulosApi.listarTodos(token)
      setAdminArticulos(Array.isArray(articlesData) ? articlesData : [])
    } catch (error: any) {
      const publicArticles = await articulosApi.listarPublicados().catch(() => [])
      setAdminArticulos(Array.isArray(publicArticles) ? publicArticles : [])
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Dialog states
  const [isUploading, setIsUploading] = useState(false)
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false)
  const [isProfileDetailsOpen, setIsProfileDetailsOpen] = useState(false) // Nuevo estado para detalles
  const [selectedProfile, setSelectedProfile] = useState<any>(null) // Nuevo estado para perfil seleccionado
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isConversatorioDetailsOpen, setIsConversatorioDetailsOpen] = useState(false)
  const [selectedConversatorio, setSelectedConversatorio] = useState<any>(null)

  // Articles administration states
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false)
  const [isArticleDetailsOpen, setIsArticleDetailsOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Articulo | null>(null)

  // Filter state
  const [filterStatus, setFilterStatus] = useState<"todos" | "pendiente" | "aprobado" | "rechazado">("todos")

  // Computed: Filter and Sort Profiles
  const filteredProfiles = useMemo(() => {
    let result = [...perfilesPendientes]

    // 1. Filter by status
    if (filterStatus !== "todos") {
      result = result.filter((p) => p.estado === filterStatus)
    }

    // 2. Sort by date (Newest first), fallback to ID
    result.sort((a, b) => {
      const dateA = new Date(a.fecha_registro).getTime()
      const dateB = new Date(b.fecha_registro).getTime()

      // If valid dates, compare them
      if (!isNaN(dateA) && !isNaN(dateB) && dateA !== dateB) {
        return dateB - dateA
      }

      // Fallback: Sort by ID (usually higher ID = newer)
      return b.id - a.id
    })

    return result
  }, [perfilesPendientes, filterStatus])

  const [planForm, setPlanForm] = useState({
    nombre: "",
    descripcion: "",
    precio_base: 0,
    tipo: "suscripcion" as const,
    duracion_dias: 30,
    activo: true,
  })

  const aprobarPerfil = async (id: number) => {
    setProcessingProfiles((prev) => ({ ...prev, [id]: "approving" }))
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) return

      await adminApi.approveProfile(id, token)
      setPerfilesPendientes(
        perfilesPendientes.map((p) =>
          p.id === id ? { ...p, estado: "aprobado", perfil_estado: { estado: "aprobado" }, verificado: true } : p,
        ),
      )

      toast({
        title: "Perfil Aprobado",
        description: "El perfil ha sido aprobado exitosamente.",
      })
    } catch (e) {
      toast({ title: "Error", description: "No se pudo aprobar el perfil", variant: "destructive" })
    } finally {
      setProcessingProfiles((prev) => ({ ...prev, [id]: null }))
    }
  }

  const rechazarPerfil = async (id: number) => {
    setProcessingProfiles((prev) => ({ ...prev, [id]: "rejecting" }))
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) return

      await adminApi.rejectProfile(id, token)
      setPerfilesPendientes(
        perfilesPendientes.map((p) =>
          p.id === id ? { ...p, estado: "rechazado", perfil_estado: { estado: "rechazado" }, verificado: false } : p,
        ),
      )

      toast({
        title: "Perfil Rechazado",
        description: "El perfil ha sido rechazado.",
        variant: "destructive",
      })
    } catch (e) {
      toast({ title: "Error", description: "No se pudo rechazar el perfil", variant: "destructive" })
    } finally {
      setProcessingProfiles((prev) => ({ ...prev, [id]: null }))
    }
  }

  const handleSavePlan = async () => {
    if (!planForm.nombre) return

    const token = localStorage.getItem("auth_token")
    if (!token) return

    try {
      if (editingItem) {
        await adminApi.updatePlan(editingItem.id, planForm, token)
        setPlanes(planes.map((p) => (p.id === editingItem.id ? { ...planForm, id: editingItem.id } : p)))
        toast({ title: "Plan Actualizado" })
      } else {
        const res = await adminApi.createPlan(planForm, token)
        setPlanes([...planes, res])
        toast({ title: "Plan Creado" })
      }
      setIsPlanDialogOpen(false)
      setEditingItem(null)
      resetPlanForm()
    } catch (e) {
      toast({ title: "Error", description: "Error al guardar plan", variant: "destructive" })
    }
  }

  // ---- Ponentes Management ----
  const loadPonentes = async (ponenciaId: number) => {
    setLoadingPonentes(true)
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) return
      const data = await ponentesApi.listar(token)
      // Backend returns flat array: [{ id, ponencia_id, nombre, tipo, correo, ... }]
      const allPonentes = Array.isArray(data) ? data : []
      setPonentesList(allPonentes.filter((p: any) => p.ponencia_id === ponenciaId))
    } catch (e) {
      console.error("Error loading ponentes:", e)
      setPonentesList([])
    } finally {
      setLoadingPonentes(false)
    }
  }

  const handleAsignarPonente = async (ponenciaId: number, usuarioId?: number | null, nombrePonente?: string) => {
    console.log("handleAsignarPonente called", { ponenciaId, usuarioId, nombrePonente })
    const token = localStorage.getItem("auth_token")
    if (!token) {
      console.error("No token found")
      return
    }

    try {
      const payload: any = { ponencia_id: ponenciaId }
      if (usuarioId) payload.usuario_id = usuarioId
      if (nombrePonente) payload.nombre_ponente = nombrePonente

      console.log("Sending payload:", payload)

      if (!payload.usuario_id && !payload.nombre_ponente) {
        toast({ title: "Error", description: "Debe seleccionar un profesional o ingresar un nombre.", variant: "destructive" })
        return
      }

      await ponentesApi.asignar(payload, token)
      console.log("Assignment successful")
      toast({ title: "Ponente Asignado", description: "El ponente fue asignado correctamente." })
      setExternalSpeakerName("")
      loadPonentes(ponenciaId)
    } catch (e: any) {
      console.error("Error assigning ponente:", e)
      toast({ title: "Error", description: "No se pudo asignar el ponente: " + (e.message || "Error desconocido"), variant: "destructive" })
    }
  }

  const handleEliminarPonente = async (ponenteId: number) => {
    const token = localStorage.getItem("auth_token")
    if (!token) return
    try {
      await ponentesApi.eliminar(ponenteId, token)
      toast({ title: "Ponente Removido", description: "El ponente fue removido del conversatorio." })
      if (selectedPonenciaId) loadPonentes(selectedPonenciaId)
    } catch (e) {
      toast({ title: "Error", description: "No se pudo remover el ponente.", variant: "destructive" })
    }
  }

  const loadInscritos = async (ponenciaId: number) => {
    setLoadingInscritos(true)
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) return
      const res = await ponenciasApi.listarInscritos(ponenciaId, token)
      setInscritosList(res.inscripciones || [])
    } catch (e) {
      console.error("Error loading inscritos:", e)
      toast({ title: "Error", description: "No se pudieron cargar los inscritos.", variant: "destructive" })
    } finally {
      setLoadingInscritos(false)
    }
  }

  const handleGenerarCertificados = async (ponenciaId: number) => {
    const ok = await animatedConfirm({
      title: "Generar Certificados",
      message: "¿Generar certificados masivos? Se enviará un correo a todos los asistentes.",
      confirmText: "Generar",
      variant: "info"
    })
    if (!ok) return
    
    setGeneratingCertificates(true)
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) return
      await ponenciasApi.generarCertificadosMasivo(ponenciaId, token)
      toast({ 
        title: "Proceso Iniciado", 
        description: "La generación de certificados ha comenzado. Los usuarios los recibirán por correo." 
      })
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "No se pudo iniciar el proceso.", variant: "destructive" })
    } finally {
      setGeneratingCertificates(false)
    }
  }

  const handleSaveRevista = async () => {
    const token = localStorage.getItem("auth_token")
    if (!token) return
    try {
      if (editingItem) {
        await revistaApi.actualizar(editingItem.id, revistaForm, token)
        toast({ title: "Revista Actualizada", description: "Los cambios han sido guardados." })
      } else {
        await revistaApi.crear(revistaForm, token)
        toast({ title: "Revista Creada", description: "La nueva edición ha sido publicada." })
      }
      setIsRevistaDialogOpen(false)
      loadData()
      setEditingItem(null)
    } catch (e) {
      toast({ title: "Error", description: "No se pudo guardar la revista.", variant: "destructive" })
    }
  }

  const handleEliminarRevista = async (id: number) => {
    const ok = await animatedConfirm({
      title: "Eliminar Revista",
      message: "¿Estás seguro de eliminar esta revista? Esta acción no se puede deshacer.",
      confirmText: "Eliminar",
      variant: "danger"
    })
    if (!ok) return
    const token = localStorage.getItem("auth_token")
    if (!token) return
    try {
      await revistaApi.eliminar(id, token)
      toast({ title: "Revista Eliminada", description: "El registro ha sido borrado." })
      loadData()
    } catch (e) {
      toast({ title: "Error", description: "No se pudo eliminar la revista.", variant: "destructive" })
    }
  }

  const resetPlanForm = () => {
    setPlanForm({
      nombre: "",
      descripcion: "",
      precio_base: 0,
      tipo: "suscripcion",
      duracion_dias: 30,
      activo: true,
    })
  }

  const handleEditPlan = (plan: Plan) => {
    setEditingItem(plan)
    setPlanForm(plan as any)
    setIsPlanDialogOpen(true)
  }

  const handlePublicarPonencia = async (id: number) => {
    try {
      const token = localStorage.getItem("auth_token") || ""
      await ponenciasApi.publicar(id, token)
      toast({ title: "Publicado", description: "El conversatorio ahora es visible para el público." })
      loadData()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleDeleteConversatorio = async (id: number) => {
    const ok = await animatedConfirm({
      title: "Eliminar Conversatorio",
      message: "¿Estás seguro de eliminar este evento? Esta acción es permanente.",
      confirmText: "Eliminar",
      variant: "danger"
    })
    if (!ok) return
    const token = localStorage.getItem("auth_token")
    if (!token) return

    try {
      await adminApi.deletePonencia(id, token)
      setPonencias(ponencias.filter((p) => p.id !== id))
      toast({ title: "Eliminado", description: "Conversatorio eliminado" })
    } catch (e) {
      toast({ title: "Error", variant: "destructive" })
    }
  }

  const handleDeletePlan = async (id: number) => {
    const ok = await animatedConfirm({
      title: "Eliminar Plan",
      message: "¿Estás seguro de eliminar este plan de suscripción?",
      confirmText: "Eliminar",
      variant: "danger"
    })
    if (!ok) return
    const token = localStorage.getItem("auth_token")
    if (!token) return

    try {
      await adminApi.deletePlan(id, token)
      setPlanes(planes.filter((p) => p.id !== id))
      toast({ title: "Eliminado", description: "Plan eliminado" })
    } catch (e) {
      toast({ title: "Error", variant: "destructive" })
    }
  }

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, { color: string; text: string }> = {
      borrador: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", text: "Borrador" },
      publicada: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", text: "Publicada" },
      finalizada: { color: "bg-gray-500/20 text-gray-400 border-gray-500/30", text: "Finalizada" },
      pendiente: { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", text: "Pendiente" },
      aprobado: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", text: "Aprobado" },
      rechazado: { color: "bg-red-500/20 text-red-400 border-red-500/30", text: "Rechazado" },
    }
    const variant = variants[estado] || variants.borrador
    return <Badge className={cn("border", variant.color)}>{variant.text}</Badge>
  }

  const openProfileDetails = async (profile: any) => {
    setSelectedProfile(profile)
    setIsProfileDetailsOpen(true)

    // Fetch full profile data to get documents and other details not in the list summary
    const token = localStorage.getItem("auth_token")
    if (token) {
      try {
        const fullData = await profesionalApi.obtenerMiPerfil(token, profile.id)
        const detailedProfile = Array.isArray(fullData) ? fullData[0] : (fullData.perfil || fullData)
        
        if (detailedProfile) {
          setSelectedProfile((prev: any) => ({
            ...prev,
            ...detailedProfile,
            // Flatten nested objects that might have been overwritten
            profesion: detailedProfile.profesion?.nombre || detailedProfile.profesion || prev.profesion,
            especialidad: detailedProfile.especialidad?.nombre || detailedProfile.especialidad || prev.especialidad,
            ciudad: detailedProfile.ciudad?.nombre || detailedProfile.ciudad || prev.ciudad,
            provincia: detailedProfile.ciudad?.provincia?.nombre || detailedProfile.provincia || prev.provincia,
            // Ensure documents are mapped even if field names vary
            documentos: detailedProfile.documentos || detailedProfile.PerfilDocumentos || detailedProfile.perfil_documentos || prev.documentos || []
          }))
        }
      } catch (error) {
        console.error("Error fetching full profile details:", error)
      }
    }
  }

  const openConversatorioDetails = (ponencia: Ponencia) => {
    setSelectedConversatorio(ponencia)
    setIsConversatorioDetailsOpen(true)
    // Load speakers for this specific ponencia
    loadPonentes(ponencia.id)
  }

  // Articles moderation handlers
  const handleModerarArticulo = async (id: number) => {
    const token = localStorage.getItem("auth_token")
    if (!token) return
    try {
      await articulosApi.moderar(id, token)
      toast({ title: "Artículo moderado", description: "El artículo ha sido aprobado y publicado." })
      const data = await articulosApi.listarTodos(token).catch(() => articulosApi.listarPublicados())
      setAdminArticulos(Array.isArray(data) ? data : [])
    } catch (error) {
      toast({ title: "Error", description: "No se pudo moderar el artículo.", variant: "destructive" })
    }
  }

  const handleArchivarArticulo = async (id: number) => {
    const ok = await animatedConfirm({
      title: "Archivar Artículo",
      message: "¿Estás seguro de archivar este artículo? Ya no será visible en la web.",
      confirmText: "Archivar",
      variant: "warning"
    })
    if (!ok) return
    const token = localStorage.getItem("auth_token")
    if (!token) return
    try {
      await articulosApi.archivar(id, token)
      toast({ title: "Artículo archivado", description: "El artículo ha sido archivado." })
      const data = await articulosApi.listarTodos(token).catch(() => articulosApi.listarPublicados())
      setAdminArticulos(Array.isArray(data) ? data : [])
    } catch (error) {
      toast({ title: "Error", description: "No se pudo archivar el artículo.", variant: "destructive" })
    }
  }

  const handleCreateArticuloAdmin = async (data: FormData | Partial<Articulo>) => {
    const token = localStorage.getItem("auth_token")
    if (!token) return
    try {
      await articulosApi.crear(data as any, token)
      toast({ title: "Artículo Creado", description: "El artículo ha sido publicado exitosamente." })
      const articlesData = await articulosApi.listarTodos(token).catch(() => articulosApi.listarPublicados())
      setAdminArticulos(Array.isArray(articlesData) ? articlesData : [])
      setIsArticleModalOpen(false)
    } catch (e) {
      toast({ title: "Error", description: "No se pudo crear el artículo", variant: "destructive" })
    }
  }

  const handleUpdateArticuloAdmin = async (data: FormData | Partial<Articulo>) => {
    const token = localStorage.getItem("auth_token")
    if (!token || !selectedArticle) return
    try {
      await articulosApi.actualizar(selectedArticle.id, data, token)
      toast({ title: "Artículo Actualizado", description: "Cambios guardados exitosamente." })
      const articlesData = await articulosApi.listarTodos(token).catch(() => articulosApi.listarPublicados())
      setAdminArticulos(Array.isArray(articlesData) ? articlesData : [])
      setIsArticleModalOpen(false)
    } catch (e) {
      toast({ title: "Error", description: "No se pudo actualizar el artículo", variant: "destructive" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Panel de Administración
              </h1>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-6 bg-white border border-gray-200 shadow-sm">
                <TabsTrigger
                  value="dashboard"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="conversatorios"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Conversatorios
                </TabsTrigger>
                <TabsTrigger value="perfiles" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Profesionales
                </TabsTrigger>
                <TabsTrigger value="planes" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Planes de Pago
                </TabsTrigger>
                <TabsTrigger value="articulos" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Artículos
                </TabsTrigger>
                <TabsTrigger
                  value="convenios"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  onClick={() => router.push("/admin/convenios")}
                >
                  Convenios
                </TabsTrigger>
              </TabsList>

              {/* DASHBOARD TAB */}
              <TabsContent value="dashboard" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <Card className="bg-white border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Conversatorios Activos</CardTitle>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {ponencias.filter((p) => p.estado === "publicada").length}
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Total de {ponencias.length} conversatorios
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <Card className="bg-white border-gray-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-100 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Perfiles Pendientes</CardTitle>
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {perfilesPendientes.filter((p) => p.estado === "pendiente").length}
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Esperando aprobación
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <Card className="bg-white border-gray-200 hover:border-amber-300 transition-all duration-300 hover:shadow-xl hover:shadow-amber-100 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Planes Activos</CardTitle>
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-amber-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{planes.filter((p) => p.activo).length}</div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    De {planes.length} planes totales
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* CONVERSATORIOS TAB */}
            <TabsContent value="conversatorios" className="space-y-4">
              <div className="animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-1">Gestión de Conversatorios</h2>
                    <p className="text-sm text-gray-500">Crea, edita y administra tus eventos educativos</p>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-200 transition-all duration-300 hover:scale-105"
                    onClick={() => router.push("/admin/conversatorios/nuevo")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Conversatorio
                  </Button>
                </div>

                <Card className="bg-white border-gray-200">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-200 hover:bg-gray-50">
                            <TableHead className="text-gray-600">Título</TableHead>
                            <TableHead className="text-gray-600">Fecha</TableHead>
                            <TableHead className="text-gray-600">Precio</TableHead>
                            <TableHead className="text-gray-600">Cupo</TableHead>
                            <TableHead className="text-gray-600">Asistentes</TableHead>
                            <TableHead className="text-gray-600">Estado</TableHead>
                            <TableHead className="text-gray-600 text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ponencias.map((ponencia) => (
                            <TableRow key={ponencia.id} className="border-gray-200 hover:bg-gray-50 transition-colors">
                              <TableCell className="font-medium">{ponencia.titulo}</TableCell>
                              <TableCell>{format(ponencia.fecha_inicio, "dd/MM/yyyy")}</TableCell>
                              <TableCell>${Number(ponencia.precio || 0).toFixed(2)}</TableCell>
                              <TableCell>{ponencia.cupo}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="link" 
                                  size="sm" 
                                  className="p-0 h-auto font-bold text-blue-600"
                                  onClick={() => {
                                    setSelectedInscritosPonencia(ponencia)
                                    loadInscritos(ponencia.id)
                                    setIsInscritosDialogOpen(true)
                                  }}
                                >
                                  Ver Inscritos
                                </Button>
                              </TableCell>
                              <TableCell>{getEstadoBadge(ponencia.estado)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openConversatorioDetails(ponencia)}
                                    className="hover:bg-amber-500/20 hover:text-amber-600 transition-colors"
                                    title="Ver Detalles"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  {ponencia.estado === "borrador" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handlePublicarPonencia(ponencia.id)}
                                      className="hover:bg-blue-500/20 hover:text-blue-600 transition-colors"
                                      title="Publicar Ahora"
                                    >
                                      <Globe className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedPonenciaId(ponencia.id)
                                      loadPonentes(ponencia.id)
                                    }}
                                    className="hover:bg-emerald-500/20 hover:text-emerald-600 transition-colors"
                                    title="Gestionar Ponentes"
                                  >
                                    <UserPlus className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push(`/admin/conversatorios/editar/${ponencia.id}`)}
                                    className="hover:bg-blue-500/20 hover:text-blue-600 transition-colors"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteConversatorio(ponencia.id)}
                                    className="hover:bg-red-500/20 hover:text-red-600 transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Ponentes Management Dialog */}
                <Dialog open={!!selectedPonenciaId} onOpenChange={(open) => { if (!open) { setSelectedPonenciaId(null); setPonentesList([]); } }}>
                  <DialogContent className="bg-white border-gray-200 max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-lg flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-emerald-600" />
                        Ponentes — {ponencias.find(p => p.id === selectedPonenciaId)?.titulo || ""}
                      </DialogTitle>
                      <DialogDescription>Asigna o remueve ponentes de este conversatorio</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                      {/* Assign new ponente */}
                      <div className="flex flex-col gap-3 w-full bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="external-speaker"
                            checked={isExternalSpeaker}
                            onCheckedChange={(checked) => setIsExternalSpeaker(checked as boolean)}
                          />
                          <Label htmlFor="external-speaker" className="cursor-pointer text-sm font-medium text-gray-700">
                            ¿Es un ponente externo (no registrado)?
                          </Label>
                        </div>

                        {isExternalSpeaker ? (
                          <div className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                            <Input
                              placeholder="Nombre del ponente externo (ej. Dr. Invitado Especial)"
                              value={externalSpeakerName}
                              onChange={(e) => setExternalSpeakerName(e.target.value)}
                              className="bg-white"
                            />
                            <Button
                              onClick={() => handleAsignarPonente(selectedPonenciaId!, null, externalSpeakerName)}
                              disabled={!externalSpeakerName.trim()}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                            >
                              <UserPlus className="h-4 w-4 sm:mr-2" />
                              <span className="hidden sm:inline">Asignar Externo</span>
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                            <Select
                              onValueChange={(value: string) => {
                                handleAsignarPonente(selectedPonenciaId!, Number(value))
                              }}
                            >
                              <SelectTrigger className="flex-1 bg-white">
                                <SelectValue placeholder="Seleccionar profesional registrado..." />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-200 h-64">
                                {perfilesPendientes
                                  .filter((p) => p.estado === "aprobado")
                                  .map((prof) => (
                                    <SelectItem key={prof.id} value={prof.id.toString()}>
                                      {prof.nombre} — {prof.profesion}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      {/* Current ponentes list */}
                      {loadingPonentes ? (
                        <p className="text-sm text-gray-500 py-4 text-center">Cargando ponentes...</p>
                      ) : ponentesList.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4 text-center">No hay ponentes asignados a este conversatorio.</p>
                      ) : (
                        <div className="space-y-2">
                          {ponentesList.map((ponente: any) => (
                            <div
                              key={ponente.id}
                              className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100"
                            >
                              <div>
                                <p className="font-medium text-gray-900">
                                  {ponente.nombre_ponente || ponente.usuario?.nombre || `Usuario #${ponente.usuario_id}`}
                                </p>
                                <p className="text-xs text-gray-500">{ponente.usuario?.correo || ""}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEliminarPonente(ponente.id)}
                                className="hover:bg-red-500/20 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Inscritos Management Dialog */}
                <Dialog open={isInscritosDialogOpen} onOpenChange={setIsInscritosDialogOpen}>
                  <DialogContent className="bg-white border-gray-200 max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-3xl">
                    <DialogHeader className="px-8 py-6 border-b bg-gray-50/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
                            <Users className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">
                              Participantes Inscritos
                            </DialogTitle>
                            <DialogDescription className="text-gray-500">
                              Gestiona la asistencia y certificados para: <span className="font-bold text-gray-700">{selectedInscritosPonencia?.titulo}</span>
                            </DialogDescription>
                          </div>
                        </div>
                        <Button
                          disabled={generatingCertificates || inscritosList.length === 0}
                          onClick={() => handleGenerarCertificados(selectedInscritosPonencia.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          {generatingCertificates ? "Generando..." : "Generar Certificados Masivo"}
                        </Button>
                      </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-8">
                      {loadingInscritos ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
                          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          <p className="text-sm font-medium">Cargando lista de participantes...</p>
                        </div>
                      ) : inscritosList.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-gray-700">Sin inscritos aún</h3>
                          <p className="text-gray-500 text-sm">Nadie se ha registrado para este evento todavía.</p>
                        </div>
                      ) : (
                        <div className="border rounded-2xl overflow-hidden border-gray-100 shadow-sm">
                          <Table>
                            <TableHeader className="bg-gray-50">
                              <TableRow>
                                <TableHead className="font-bold">Nombre</TableHead>
                                <TableHead className="font-bold">Cédula</TableHead>
                                <TableHead className="font-bold">Contacto</TableHead>
                                <TableHead className="font-bold text-center">Asistencia</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {inscritosList.map((insc) => (
                                <TableRow key={insc.id} className="hover:bg-gray-50 transition-colors">
                                  <TableCell className="font-medium text-gray-900">
                                    {insc.usuario?.nombre || "Usuario no registrado"}
                                  </TableCell>
                                  <TableCell className="text-gray-600 font-mono text-xs">
                                    {insc.cedula || insc.usuario?.cedula || "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-xs">
                                      <p className="text-gray-900">{insc.correo || insc.usuario?.correo}</p>
                                      <p className="text-gray-400">{insc.celular || insc.usuario?.telefono || "-"}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {insc.asistencia ? (
                                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Presente
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="text-gray-400 border-gray-200">
                                        Falta
                                      </Badge>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

              </div>
            </TabsContent>

            {/* PROFESIONALES TAB */}
            <TabsContent value="perfiles" className="space-y-4">
              <div className="animate-in fade-in duration-300">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-1">Gestión de Profesionales</h2>
                  <p className="text-sm text-gray-500">
                    Administra todos los perfiles profesionales registrados
                  </p>
                </div>

                <div className="flex space-x-2 p-1 bg-muted/50 rounded-lg w-fit mb-4">
                  {(["todos", "pendiente", "aprobado", "rechazado"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterStatus === status
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                      <span className="ml-2 text-xs opacity-70">
                        ({status === "todos"
                          ? perfilesPendientes.length
                          : perfilesPendientes.filter(p => p.estado === status).length})
                      </span>
                    </button>
                  ))}
                </div>

                <div className="grid gap-4">
                  {filteredProfiles.length === 0 ? (
                    <Card className="bg-white border-gray-200">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="h-12 w-12 text-gray-500 mb-4" />
                        <h3 className="text-lg font-semibold mb-1">No se encontraron profesionales</h3>
                        <p className="text-sm text-gray-500">No hay perfiles con el estado "{filterStatus}"</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredProfiles.map((perfil, index) => (
                      <Card
                        key={perfil.id}
                        className="bg-white border-gray-200 hover:border-emerald-300 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl mb-2">{perfil.nombre}</CardTitle>
                              <CardDescription className="text-base">{perfil.profesion}</CardDescription>
                            </div>
                            {getEstadoBadge(perfil.estado)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-500">Correo:</span>
                              <span>{perfil.correo}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-500">Teléfono:</span>
                              <span>{perfil.telefono || "No registrado"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-500">Registro:</span>
                              <span>{format(new Date(perfil.fecha_registro), "dd/MM/yyyy")}</span>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              onClick={() => openProfileDetails(perfil)}
                              className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-all"
                            >
                              Ver Detalles
                            </Button>
                            {perfil.estado !== "aprobado" && (
                              <Button
                                onClick={() => aprobarPerfil(perfil.id)}
                                disabled={!!processingProfiles[perfil.id]}
                                className={cn(
                                  "flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 hover:scale-105",
                                  processingProfiles[perfil.id] && "opacity-50 cursor-not-allowed"
                                )}
                              >
                                {processingProfiles[perfil.id] === "approving" ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="mr-2 h-4 w-4" />
                                )}
                                Aprobar
                              </Button>
                            )}
                            {perfil.estado !== "rechazado" && (
                              <Button
                                onClick={() => rechazarPerfil(perfil.id)}
                                variant="destructive"
                                disabled={!!processingProfiles[perfil.id]}
                                className={cn(
                                  "flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:scale-105",
                                  processingProfiles[perfil.id] && "opacity-50 cursor-not-allowed"
                                )}
                              >
                                {processingProfiles[perfil.id] === "rejecting" ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <X className="mr-2 h-4 w-4" />
                                )}
                                Rechazar
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            {/* PLANES DE PAGO TAB */}
            <TabsContent value="planes" className="space-y-4">
              <div className="animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-1">Gestión de Planes de Pago</h2>
                    <p className="text-sm text-gray-500">Crea y administra los planes de suscripción y pagos únicos</p>
                  </div>
                  <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg shadow-amber-200 transition-all duration-300 hover:scale-105"
                        onClick={() => {
                          setEditingItem(null)
                          resetPlanForm()
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Plan
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border-gray-200 max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-xl">{editingItem ? "Editar" : "Crear"} Plan de Pago</DialogTitle>
                        <DialogDescription className="text-gray-500">
                          {editingItem ? "Modifica" : "Completa"} los detalles del plan. Los campos marcados son
                          obligatorios.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="plan-nombre" className="text-sm font-medium flex items-center gap-1">
                            Nombre del Plan <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="plan-nombre"
                            placeholder="Ej: Plan Premium"
                            value={planForm.nombre}
                            onChange={(e) => setPlanForm({ ...planForm, nombre: e.target.value })}
                            className="focus:border-amber-500/50 transition-colors"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="plan-descripcion" className="text-sm font-medium flex items-center gap-1">
                            Descripción <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="plan-descripcion"
                            placeholder="Describe los beneficios y características del plan..."
                            value={planForm.descripcion}
                            onChange={(e) => setPlanForm({ ...planForm, descripcion: e.target.value })}
                            className="focus:border-amber-500/50 transition-colors min-h-[100px]"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="plan-precio" className="text-sm font-medium">
                              Precio (USD)
                            </Label>
                            <Input
                              id="plan-precio"
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              value={planForm.precio_base || ""}
                              onChange={(e) =>
                                setPlanForm({
                                  ...planForm,
                                  precio_base: e.target.value === "" ? 0 : Number.parseFloat(e.target.value)
                                })
                              }
                              className="focus:border-amber-500/50 transition-colors"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="plan-tipo" className="text-sm font-medium">
                              Tipo de Plan
                            </Label>
                            <Select
                              value={planForm.tipo}
                              onValueChange={(value: any) => setPlanForm({ ...planForm, tipo: value })}
                            >
                              <SelectTrigger className="focus:border-amber-500/50 transition-colors">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-200">
                                <SelectItem value="suscripcion">Suscripción</SelectItem>
                                <SelectItem value="one_time">Pago Único</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        {planForm.tipo === "suscripcion" && (
                          <div className="grid gap-2">
                            <Label htmlFor="plan-duracion" className="text-sm font-medium">
                              Duración (días)
                            </Label>
                            <Input
                              id="plan-duracion"
                              type="number"
                              min="1"
                              placeholder="30"
                              value={planForm.duracion_dias || ""}
                              onChange={(e) =>
                                setPlanForm({
                                  ...planForm,
                                  duracion_dias: e.target.value === "" ? 0 : (Number.parseInt(e.target.value) || 0)
                                })
                              }
                              className="focus:border-amber-500/50 transition-colors"
                            />
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsPlanDialogOpen(false)
                            setEditingItem(null)
                            resetPlanForm()
                          }}
                          className="hover:bg-gray-100 transition-colors"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleSavePlan}
                          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 transition-all duration-300"
                        >
                          {editingItem ? "Actualizar" : "Crear"} Plan
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid gap-4">
                  {planes.map((plan, index) => (
                    <Card
                      key={plan.id}
                      className="bg-white border-gray-200 hover:border-amber-300 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{plan.nombre}</CardTitle>
                            <CardDescription className="text-base">{plan.descripcion}</CardDescription>
                          </div>
                          <Badge
                            className={cn(
                              "border",
                              plan.activo
                                ? "bg-emerald-500/20 text-emerald-600 border-emerald-500/30"
                                : "bg-gray-200 text-gray-600 border-gray-300",
                            )}
                          >
                            {plan.activo ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-amber-600" />
                            <span className="text-gray-500">Precio:</span>
                            <span className="font-semibold">${Number(plan.precio_base).toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-amber-600" />
                            <span className="text-gray-500">Tipo:</span>
                            <span className="font-semibold">
                              {plan.tipo === "suscripcion" ? "Suscripción" : "Pago Único"}
                            </span>
                          </div>
                          {plan.duracion_dias && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-amber-600" />
                              <span className="text-gray-500">Duración:</span>
                              <span className="font-semibold">{plan.duracion_dias} días</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleEditPlan(plan)}
                            variant="outline"
                            className="flex-1 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all duration-300 hover:scale-105"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar Plan
                          </Button>
                          <Button
                            onClick={() => handleDeletePlan(plan.id)}
                            variant="destructive"
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:scale-105"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* ARTICULOS TAB */}
            <TabsContent value="articulos" className="space-y-4">
              <div className="animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Moderación de Artículos</h2>
                      <p className="text-sm text-gray-500">Supervisa e impulsa el contenido de la comunidad</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-sm font-medium bg-white px-3 py-1">
                      {adminArticulos.length} {adminArticulos.length === 1 ? 'artículo' : 'artículos'}
                    </Badge>
                    <Button
                      onClick={() => {
                        setSelectedArticle(null)
                        setIsArticleModalOpen(true)
                      }}
                      className="bg-blue-600 hover:bg-blue-700 shadow-md transition-all active:scale-95 gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Nuevo Artículo
                    </Button>
                  </div>
                </div>

                {adminArticulos.length === 0 ? (
                  <Card className="bg-white border-gray-200 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="bg-gray-50 p-6 rounded-full mb-4">
                        <BookOpen className="h-12 w-12 text-gray-300" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay artículos publicados</h3>
                      <p className="text-gray-400 max-w-sm">Los artículos creados por profesionales aparecerán aquí para tu supervisión.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {adminArticulos.map((articulo) => (
                      <Card key={articulo.id} className="bg-white border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md group overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex h-full">
                            {/* Icon/Image Placeholder */}
                            <div className="w-24 bg-gray-50 border-r border-gray-100 flex flex-col items-center justify-center relative overflow-hidden group-hover:bg-blue-50 transition-colors">
                              {articulo.imagen_url ? (
                                <img src={articulo.imagen_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity" />
                              ) : (
                                <FileText className="h-8 w-8 text-gray-300 group-hover:text-blue-200" />
                              )}
                              <Badge className="z-10 text-[10px] absolute top-2 left-2 px-1">
                                #{articulo.id}
                              </Badge>
                            </div>

                            <div className="flex-1 p-5 min-w-0">
                              <div className="flex justify-between items-start mb-2">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5",
                                    articulo.estado === "publicado"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                      : articulo.estado === "archivado"
                                        ? "bg-red-50 text-red-700 border-red-100"
                                        : "bg-yellow-50 text-yellow-700 border-yellow-100"
                                  )}
                                >
                                  {articulo.estado}
                                </Badge>
                                <span className="text-[10px] text-gray-400 font-medium">
                                  {articulo.fecha_publicacion ? new Date(articulo.fecha_publicacion).toLocaleDateString("es-EC") : ""}
                                </span>
                              </div>

                              <h3 className="text-base font-bold text-gray-900 truncate mb-1 group-hover:text-blue-600 transition-colors">
                                {articulo.titulo}
                              </h3>

                              <div className="flex items-center gap-2 mb-4">
                                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                                  <Users className="h-3 w-3 text-blue-600" />
                                </div>
                                <span className="text-xs text-gray-600 font-medium truncate">
                                  {articulo.autor?.nombre || "Autor desconocido"}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 border-t pt-4">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => {
                                    setSelectedArticle(articulo)
                                    setIsArticleDetailsOpen(true)
                                  }}
                                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 gap-1.5"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  Detalles
                                </Button>

                                {articulo.estado === "publicado" ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleArchivarArticulo(articulo.id)}
                                    className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors px-3"
                                    title="Archivar"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleModerarArticulo(articulo.id)}
                                    className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-colors px-3"
                                    title="Publicar"
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="revistas" className="space-y-4">
              <div className="animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-1">Gestión de Revistas</h2>
                    <p className="text-sm text-gray-500">Publica y administra las ediciones digitales</p>
                  </div>
                  <Dialog open={isRevistaDialogOpen} onOpenChange={setIsRevistaDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-200 transition-all duration-300 hover:scale-105"
                        onClick={() => {
                          setEditingItem(null)
                          setRevistaForm({
                            titulo: "",
                            descripcion: "",
                            portada_url: "",
                            pdf_url: "",
                            fecha_publicacion: new Date().toISOString().split("T")[0],
                            edicion: "",
                            activo: true
                          })
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Revista
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border-gray-200 max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-xl">{editingItem ? "Editar" : "Publicar"} Revista</DialogTitle>
                        <DialogDescription className="text-gray-500">
                          {editingItem ? "Modifica" : "Completa"} los detalles de la edición digital.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="rev_titulo">Título</Label>
                            <Input id="rev_titulo" value={revistaForm.titulo} onChange={e => setRevistaForm({...revistaForm, titulo: e.target.value})} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="rev_edicion">Edición</Label>
                            <Input id="rev_edicion" value={revistaForm.edicion} onChange={e => setRevistaForm({...revistaForm, edicion: e.target.value})} placeholder="Ej: Marzo 2024" />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="rev_desc">Descripción</Label>
                          <Textarea id="rev_desc" value={revistaForm.descripcion} onChange={e => setRevistaForm({...revistaForm, descripcion: e.target.value})} rows={3} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="rev_portada">URL Portada</Label>
                          <Input id="rev_portada" value={revistaForm.portada_url} onChange={e => setRevistaForm({...revistaForm, portada_url: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="rev_pdf">URL PDF</Label>
                          <Input id="rev_pdf" value={revistaForm.pdf_url} onChange={e => setRevistaForm({...revistaForm, pdf_url: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-end">
                          <div className="grid gap-2">
                            <Label htmlFor="rev_fecha">Fecha Publicación</Label>
                            <Input id="rev_fecha" type="date" value={revistaForm.fecha_publicacion} onChange={e => setRevistaForm({...revistaForm, fecha_publicacion: e.target.value})} />
                          </div>
                          <div className="flex items-center space-x-2 pb-2">
                            <Checkbox id="rev_activo" checked={revistaForm.activo} onCheckedChange={checked => setRevistaForm({...revistaForm, activo: !!checked})} />
                            <Label htmlFor="rev_activo">Visible al público</Label>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRevistaDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSaveRevista} className="bg-blue-600 text-white">Guardar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card className="bg-white border-gray-200">
                  <Table>
                    <TableHeader className="bg-gray-50/50">
                      <TableRow>
                        <TableHead className="w-[100px]">Portada</TableHead>
                        <TableHead>Título / Edición</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {revistas.map(revista => (
                        <TableRow key={revista.id}>
                          <TableCell>
                            <div className="w-12 h-16 bg-slate-100 rounded border flex items-center justify-center overflow-hidden">
                              {revista.portada_url ? <img src={revista.portada_url} className="w-full h-full object-cover" /> : <BookOpen className="h-6 w-6 text-slate-300" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-slate-900">{revista.titulo}</div>
                            <div className="text-xs text-slate-500">{revista.edicion}</div>
                          </TableCell>
                          <TableCell className="text-sm text-slate-500">{revista.fecha_publicacion}</TableCell>
                          <TableCell>
                            {revista.activo ? (
                              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Visible</Badge>
                            ) : (
                              <Badge variant="outline" className="text-gray-400">Oculto</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => {
                                setEditingItem(revista)
                                setRevistaForm(revista)
                                setIsRevistaDialogOpen(true)
                              }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEliminarRevista(revista.id)} className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {revistas.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="h-40 text-center text-slate-400">
                            No hay revistas registradas.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Dialog Detalle Perfil */}
          {/* Dialog Detalle Conversatorio */}
          <Dialog open={isConversatorioDetailsOpen} onOpenChange={setIsConversatorioDetailsOpen}>
            <DialogContent className="bg-white border-gray-200 max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  {selectedConversatorio?.titulo}
                  {selectedConversatorio && getEstadoBadge(selectedConversatorio.estado)}
                </DialogTitle>
                <DialogDescription className="text-gray-500 text-lg">
                  Detalles completos del evento seleccionado
                </DialogDescription>
              </DialogHeader>

              {selectedConversatorio && (
                <div className="grid gap-6 py-4">
                  {/* Resumen y Descripción */}
                  <div className="space-y-4">
                    <Card className="bg-amber-50 border-amber-100 shadow-none">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-amber-900 mb-1 flex items-center gap-2">
                          <BookOpen className="h-4 w-4" /> Resumen Informativo
                        </h3>
                        <p className="text-amber-800 text-sm italic">
                          {selectedConversatorio.resumen || "No se ha proporcionado un resumen para este evento."}
                        </p>
                      </CardContent>
                    </Card>

                    <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-3 text-lg border-b pb-2 flex items-center gap-2">
                        <Info className="h-5 w-5 text-blue-500" /> Descripción del Conversatorio
                      </h3>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedConversatorio.descripcion}
                      </div>
                    </div>
                  </div>

                  {/* Grid de Información de Sesión */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Panel de Tiempo */}
                    <Card className="border-gray-100 shadow-sm bg-gray-50/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Clock className="h-4 w-4 text-emerald-600" /> Horarios y Logística
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 flex items-center gap-2"><CalendarIcon className="h-4 w-4" /> Fecha:</span>
                          <span className="font-semibold">{format(new Date(selectedConversatorio.fecha_inicio), "PPP", { locale: es })}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 flex items-center gap-2"><Clock className="h-4 w-4" /> Inicio:</span>
                          <span className="font-semibold text-emerald-700">
                            {format(new Date(selectedConversatorio.fecha_inicio), "p")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 flex items-center gap-2"><Clock className="h-4 w-4" /> Fin:</span>
                          <span className="font-semibold text-red-700">
                            {format(new Date(selectedConversatorio.fecha_fin), "p")}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Panel de Capacidad y Costo */}
                    <Card className="border-gray-100 shadow-sm bg-gray-50/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-amber-600" /> Inversión y Disponibilidad
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 flex items-center gap-2"><DollarSign className="h-4 w-4" /> Precio:</span>
                          <span className="text-lg font-bold text-gray-900">${Number(selectedConversatorio.precio).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 flex items-center gap-2"><Users className="h-4 w-4" /> Cupos Totales:</span>
                          <span className="font-semibold">{selectedConversatorio.cupo} personas</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Estado:</span>
                          <Badge variant="outline" className="capitalize">{selectedConversatorio.estado}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Ubicación Geográfica */}
                  <Card className="border-gray-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-gray-50 pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-500" /> Localización del Evento
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="p-4 space-y-2 border-b">
                        <p className="text-sm font-medium text-gray-800">{selectedConversatorio.direccion_texto || "Dirección no especificada"}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded">Lat: {selectedConversatorio.latitud ? Number(selectedConversatorio.latitud).toFixed(6) : "N/A"}</span>
                          <span className="bg-gray-100 px-2 py-1 rounded">Long: {selectedConversatorio.longitud ? Number(selectedConversatorio.longitud).toFixed(6) : "N/A"}</span>
                          {selectedConversatorio.latitud && selectedConversatorio.longitud && (
                            <a
                              href={`https://www.google.com/maps?q=${selectedConversatorio.latitud},${selectedConversatorio.longitud}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline font-medium flex items-center gap-1"
                            >
                              <Globe className="h-3 w-3" /> Ver en Google Maps
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="h-64 relative bg-gray-100 flex items-center justify-center">
                        {selectedConversatorio.latitud && selectedConversatorio.longitud ? (
                          <LocationMap
                            lat={selectedConversatorio.latitud}
                            lng={selectedConversatorio.longitud}
                            readonly
                          />
                        ) : (
                          <div className="flex flex-col items-center text-gray-400 gap-2">
                            <MapPin className="h-8 w-8 opacity-20" />
                            <span className="text-xs">Ubicación física no disponible</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ponentes Asignados */}
                  <Card className="border-gray-100 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <UserPlus className="h-4 w-4 text-emerald-600" /> Ponentes Asignados
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingPonentes ? (
                        <p className="text-sm text-gray-500 text-center py-4">Cargando ponentes...</p>
                      ) : ponentesList.length === 0 ? (
                        <p className="text-sm text-gray-400 italic text-center py-4">No hay ponentes asignados a este conversatorio.</p>
                      ) : (
                        <div className="space-y-2">
                          {ponentesList.map((ponente: any) => (
                            <div key={ponente.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                                {(ponente.nombre || ponente.nombre_ponente || "P").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{ponente.nombre || ponente.nombre_ponente}</p>
                                <p className="text-xs text-gray-500">{ponente.tipo === 'registrado' ? 'Profesional EC' : 'Experto Invitado'}{ponente.correo ? ` · ${ponente.correo}` : ''}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Footer */}
                  <div className="flex justify-end pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsConversatorioDetailsOpen(false)} className="px-8 hover:bg-gray-100">
                      Cerrar Detalles
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={isProfileDetailsOpen} onOpenChange={setIsProfileDetailsOpen}>
            <DialogContent className="bg-white border-gray-200 max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  {selectedProfile?.nombre}
                  {selectedProfile && getEstadoBadge(selectedProfile.estado)}
                </DialogTitle>
                <DialogDescription className="text-gray-500 text-lg">
                  {selectedProfile?.profesion}
                </DialogDescription>
              </DialogHeader>

              {selectedProfile && (
                <div className="grid gap-6 py-4">
                  {/* Info Personal */}
                  <Card className="bg-gray-50 border-none shadow-none">
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold text-gray-700">Cédula:</span>
                        <span>{selectedProfile.cedula}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold text-gray-700">Correo:</span>
                        <span>{selectedProfile.correo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold text-gray-700">Teléfono:</span>
                        <span>{selectedProfile.telefono || "No registrado"}</span>
                      </div>
                      <div className="flex items-start gap-2 col-span-1 md:col-span-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-700">Ubicación:</span>
                          <span>
                            {selectedProfile.ciudad}
                            {selectedProfile.provincia ? `, ${selectedProfile.provincia}` : ""}
                          </span>
                          <span className="text-sm text-gray-500">{selectedProfile.direccion_texto}</span>
                          {selectedProfile.link_maps && (
                            <a href={selectedProfile.link_maps} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">
                              Ver en Google Maps
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold text-gray-700">Tarifa:</span>
                        <span>{selectedProfile.tarifa}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold text-gray-700">Fecha Registro:</span>
                        <span>{format(new Date(selectedProfile.fecha_registro), "dd/MM/yyyy HH:mm")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">Verificado:</span>
                        <span className={selectedProfile.verificado ? "text-emerald-600 font-bold" : "text-gray-500"}>
                          {selectedProfile.verificado ? "SÍ" : "NO"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Redes Sociales */}
                  {(selectedProfile.facebook_url || selectedProfile.instagram_url || selectedProfile.tiktok_url || selectedProfile.linkedin_url || selectedProfile.x_url) && (
                    <div>
                      <h3 className="font-semibold mb-3 text-lg">Redes Sociales</h3>
                      <div className="flex flex-wrap gap-4">
                        {selectedProfile.facebook_url && (
                          <a href={selectedProfile.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                            <Facebook className="h-4 w-4" />
                            <span className="text-sm font-medium">Facebook</span>
                          </a>
                        )}
                        {selectedProfile.instagram_url && (
                          <a href={selectedProfile.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-pink-50 text-pink-700 rounded-lg border border-pink-100 hover:bg-pink-100 transition-colors">
                            <Instagram className="h-4 w-4" />
                            <span className="text-sm font-medium">Instagram</span>
                          </a>
                        )}
                        {selectedProfile.x_url && (
                          <a href={selectedProfile.x_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                            <div className="h-4 w-4 flex items-center justify-center font-bold text-[10px] border border-gray-700 rounded-sm leading-none">X</div>
                            <span className="text-sm font-medium">Twitter / X</span>
                          </a>
                        )}
                        {selectedProfile.linkedin_url && (
                          <a href={selectedProfile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                            <Linkedin className="h-4 w-4" />
                            <span className="text-sm font-medium">LinkedIn</span>
                          </a>
                        )}
                        {selectedProfile.tiktok_url && (
                          <a href={selectedProfile.tiktok_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                            <Music className="h-4 w-4" />
                            <span className="text-sm font-medium">TikTok</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Descripción */}
                  <div>
                    <h3 className="font-semibold mb-2 text-lg">Descripción Profesional</h3>
                    <div className="p-4 bg-white border rounded-lg text-gray-700 whitespace-pre-wrap shadow-sm min-h-[100px]">
                      {selectedProfile.descripcion}
                    </div>
                  </div>

                  {/* Documentos */}
                  <div>
                    <h3 className="font-semibold mb-2 text-lg">Documentos de Verificación ({selectedProfile.documentos?.length || 0})</h3>
                    {selectedProfile.documentos && selectedProfile.documentos.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedProfile.documentos.map((doc: any, index: number) => (
                          <a
                            key={index}
                            href={formatUrl(doc.url) || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-blue-50 transition-colors group bg-white"
                          >
                            <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 text-blue-600">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="font-medium text-gray-900 truncate">{doc.tipo || "Documento"}</span>
                              <span className="text-xs text-gray-500">Clic para ver</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic p-4 border border-dashed rounded-lg bg-gray-50">
                        No hay documentos adjuntos a este perfil.
                      </p>
                    )}
                  </div>

                  {/* Foto Referencia (si hay) */}
                  {selectedProfile.foto_url && (
                    <div className="mt-2">
                      <h3 className="font-semibold mb-2 text-lg">Foto de Perfil</h3>
                      <img src={selectedProfile.foto_url} alt="Foto Perfil" className="w-32 h-32 rounded-full object-cover border-2 border-gray-200" />
                    </div>
                  )}

                  {/* Acciones Footer */}
                  <div className="flex gap-3 justify-end mt-6 pt-6 border-t">
                    <Button variant="outline" onClick={() => setIsProfileDetailsOpen(false)}>
                      Cerrar
                    </Button>
                    {selectedProfile.estado !== "aprobado" && (
                      <Button
                        onClick={() => {
                          aprobarPerfil(selectedProfile.id)
                          setIsProfileDetailsOpen(false)
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Aprobar Perfil
                      </Button>
                    )}
                    {selectedProfile.estado !== "rechazado" && (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          rechazarPerfil(selectedProfile.id)
                          setIsProfileDetailsOpen(false)
                        }}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Rechazar Perfil
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Diálogo Detalle Artículo */}
          <Dialog open={isArticleDetailsOpen} onOpenChange={setIsArticleDetailsOpen}>
            <DialogContent className="bg-white border-gray-200 max-w-4xl max-h-[90vh] overflow-y-auto">
              {selectedArticle && (
                <div className="animate-in fade-in duration-300">
                  <DialogHeader className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={cn(
                        "text-[10px] font-bold uppercase",
                        selectedArticle.estado === 'publicado' ? "bg-emerald-500" : "bg-gray-400"
                      )}>
                        {selectedArticle.estado}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {selectedArticle.fecha_publicacion ? new Date(selectedArticle.fecha_publicacion).toLocaleDateString("es-EC") : ""}
                      </span>
                    </div>
                    <DialogTitle className="text-3xl font-bold text-gray-900 leading-tight">
                      {selectedArticle.titulo}
                    </DialogTitle>
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                        {selectedArticle.autor?.foto_url ? (
                          <img src={selectedArticle.autor.foto_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Users className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{selectedArticle.autor?.nombre}</p>
                        <p className="text-xs text-gray-500">Autor del artículo</p>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="space-y-6">
                    {selectedArticle.imagen_url && (
                      <div className="rounded-xl overflow-hidden border bg-gray-50 aspect-video relative group">
                        <img
                          src={selectedArticle.imagen_url}
                          alt={selectedArticle.titulo}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {selectedArticle.resumen && (
                      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 italic text-gray-600 text-lg leading-relaxed">
                        "{selectedArticle.resumen}"
                      </div>
                    )}

                    <div className="prose prose-blue max-w-none text-gray-800 leading-relaxed">
                      <div dangerouslySetInnerHTML={{ __html: selectedArticle.contenido }} />
                    </div>
                  </div>

                  <DialogFooter className="mt-8 pt-6 border-t border-gray-100 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsArticleDetailsOpen(false)}
                      className="px-6"
                    >
                      Cerrar
                    </Button>

                    {selectedArticle.estado === 'publicado' ? (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleArchivarArticulo(selectedArticle.id)
                          setIsArticleDetailsOpen(false)
                        }}
                        className="bg-red-600 hover:bg-red-700 gap-2 px-6"
                      >
                        <XCircle className="h-4 w-4" />
                        Archivar Artículo
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          handleModerarArticulo(selectedArticle.id)
                          setIsArticleDetailsOpen(false)
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 gap-2 px-6"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Publicar Artículo
                      </Button>
                    )}
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Modal de Creación/Edición (Reutilizado) */}
          <ArticleFormModal
            open={isArticleModalOpen}
            onOpenChange={setIsArticleModalOpen}
            article={selectedArticle}
            onSubmit={selectedArticle ? handleUpdateArticuloAdmin : handleCreateArticuloAdmin}
          />

        </div>
      </main>

      <AnimatedConfirm
        isOpen={isConfirmOpen}
        options={confirmOptions}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />

      <Footer />
    </div>
  )
}
