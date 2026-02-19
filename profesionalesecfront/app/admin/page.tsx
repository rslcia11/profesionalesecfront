"use client"

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
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { adminApi, catalogosApi, ponenciasApi, profesionalApi, articulosApi, API_URL, ponentesApi, type Articulo } from "@/lib/api"
import ArticleFormModal from "@/components/article-form-modal"
import { Eye } from "lucide-react"
import LocationMap from "@/components/shared/location-map"

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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("conversatorios")
  const { toast } = useToast()

  const [ponencias, setPonencias] = useState<Ponencia[]>([])
  const [perfilesPendientes, setPerfilesPendientes] = useState<PerfilPendiente[]>([])

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

  useEffect(() => {
    const formatUrl = (path: string | null | undefined) => {
      if (!path) return null;
      if (path.startsWith('http')) return path;
      const baseUrl = API_URL.replace('/api', '');
      return `${baseUrl}/${path.startsWith('/') ? path.slice(1) : path}`;
    };

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
        console.log("Stats received in Admin Page:", stats); // DEBUG
        setPonencias(stats.ponencias)

        // Map backend data to frontend structure
        const mappedProfiles = stats.profesionales.map((p: any) => {
          // Backend states: 1=borrador, 2=pendiente, 3=aprobado, 4=rechazado
          const getEstado = (estadoId: number): "aprobado" | "rechazado" | "pendiente" => {
            switch (estadoId) {
              case 3: return "aprobado";
              case 4: return "rechazado";
              default: return "pendiente";
            }
          };
          const estado = getEstado(p.estado_id);

          return {
            id: p.usuario_id,
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
            direccion_texto: p.direccion ? `${p.direccion.calle_principal} ${p.direccion.referencia ? `(${p.direccion.referencia})` : ""}` : "No registrada",
            link_maps: p.direccion?.link_maps || null,
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

      // Load articles (public endpoint, no auth needed)
      try {
        const articlesData = await articulosApi.listarPublicados()
        setAdminArticulos(Array.isArray(articlesData) ? articlesData : [])
      } catch (error) {
        console.error("Error loading articles:", error)
      }
    }
    loadData()
  }, [])

  // Dialog states
  const [isConversatorioDialogOpen, setIsConversatorioDialogOpen] = useState(false)
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false)
  const [isProfileDetailsOpen, setIsProfileDetailsOpen] = useState(false) // Nuevo estado para detalles
  const [selectedProfile, setSelectedProfile] = useState<any>(null) // Nuevo estado para perfil seleccionado
  const [editingItem, setEditingItem] = useState<any>(null)

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

  // Form states
  const [conversatorioForm, setConversatorioForm] = useState({
    titulo: "",
    descripcion: "",
    fecha_inicio: new Date(),
    hora_inicio: "09:00",
    fecha_fin: new Date(),
    hora_fin: "11:00",
    precio: 0,
    cupo: 0,
    profesion_id: 0,
    estado: "borrador" as const,
    provincia_id: 0,
    ciudad_id: 0,
    direccion: "",
    latitud: undefined as number | undefined,
    longitud: undefined as number | undefined,
  })

  const [planForm, setPlanForm] = useState({
    nombre: "",
    descripcion: "",
    precio_base: 0,
    tipo: "suscripcion" as const,
    duracion_dias: 30,
    activo: true,
  })

  // Location helpers for Conversatorio Form
  const handleLocationChange = (lat: number, lng: number) => {
    setConversatorioForm((prev) => ({ ...prev, latitud: lat, longitud: lng }))
  }

  const handleProvinciaChange = async (provinciaId: string) => {
    const id = Number(provinciaId)
    setConversatorioForm((prev) => ({ ...prev, provincia_id: id, ciudad_id: 0 }))
    setCiudades([])
    if (id) {
      try {
        const res = await catalogosApi.obtenerCiudades(id)
        // Filter logic similar to ProfessionalForm
        const filtered = Array.isArray(res) ? res.filter((c: any) => c.provincia_id === id || (c.provincia && c.provincia.id === id)) : []
        setCiudades(filtered)
      } catch (error) {
        console.error("Error loading cities:", error)
      }
    }
  }

  const aprobarPerfil = async (id: number) => {
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
    }
  }

  const rechazarPerfil = async (id: number) => {
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
    }
  }

  const handleSaveConversatorio = async () => {
    if (!conversatorioForm.titulo || !conversatorioForm.descripcion) {
      toast({ title: "Error", description: "Completa campos obligatorios", variant: "destructive" })
      return
    }

    const token = localStorage.getItem("auth_token")
    if (!token) return

    try {
      if (editingItem) {
        await adminApi.updatePonencia(editingItem.id, conversatorioForm, token)
        setPonencias(
          ponencias.map((p) => (p.id === editingItem.id ? { ...conversatorioForm, id: editingItem.id } : p)),
        )
        toast({ title: "Conversatorio Actualizado", description: "Actualización exitosa" })
      } else {
        const res = await adminApi.createPonencia({ ...conversatorioForm, profesion_id: conversatorioForm.profesion_id || 1 }, token)
        setPonencias([...ponencias, res.ponencia])
        toast({ title: "Conversatorio Creado", description: "Creación exitosa" })
      }
      setIsConversatorioDialogOpen(false)
      setEditingItem(null)
      resetConversatorioForm()
      setIsConversatorioDialogOpen(false)
      setEditingItem(null)
      resetConversatorioForm()
    } catch (e: any) {
      toast({
        title: "Error al actualizar",
        description: e.message || "Error desconocido",
        variant: "destructive"
      })
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

  const resetConversatorioForm = () => {
    setConversatorioForm({
      titulo: "",
      descripcion: "",
      fecha_inicio: new Date(),
      hora_inicio: "09:00",
      fecha_fin: new Date(),
      hora_fin: "11:00",
      precio: 0,
      cupo: 0,
      profesion_id: 0,
      estado: "borrador",
      provincia_id: 0,
      ciudad_id: 0,
      direccion: "",
      latitud: undefined,
      longitud: undefined,
    })
  }

  // ---- Ponentes Management ----
  const loadPonentes = async (ponenciaId: number) => {
    setLoadingPonentes(true)
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) return
      // The ponentes list comes from /ponencias endpoint — we filter locally
      // or we use ponentesApi.listar which returns all ponencias with their ponentes
      const data = await ponentesApi.listar(token)
      const ponenciaData = Array.isArray(data?.ponencias ? data.ponencias : data) ? (data.ponencias || data) : []
      const found = ponenciaData.find((p: any) => p.id === ponenciaId)
      setPonentesList(found?.ponentes || [])
    } catch (e) {
      console.error("Error loading ponentes:", e)
      setPonentesList([])
    } finally {
      setLoadingPonentes(false)
    }
  }

  const handleAsignarPonente = async (ponenciaId: number, usuarioId?: number | null, nombrePonente?: string) => {
    const token = localStorage.getItem("auth_token")
    if (!token) return
    try {
      const payload: any = { ponencia_id: ponenciaId }
      if (usuarioId) payload.usuario_id = usuarioId
      if (nombrePonente) payload.nombre_ponente = nombrePonente

      if (!payload.usuario_id && !payload.nombre_ponente) {
        toast({ title: "Error", description: "Debe seleccionar un profesional o ingresar un nombre.", variant: "destructive" })
        return
      }

      await ponentesApi.asignar(payload, token)
      toast({ title: "Ponente Asignado", description: "El ponente fue asignado correctamente." })
      setExternalSpeakerName("")
      loadPonentes(ponenciaId)
    } catch (e) {
      toast({ title: "Error", description: "No se pudo asignar el ponente.", variant: "destructive" })
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

  const handleEditConversatorio = (ponencia: Ponencia) => {
    setEditingItem(ponencia)
    setConversatorioForm({
      ...ponencia,
      // Ensure backend time strings (HH:mm:ss) are sliced to HH:mm for input[type="time"]
      hora_inicio: ponencia.hora_inicio ? ponencia.hora_inicio.slice(0, 5) : "09:00",
      hora_fin: ponencia.hora_fin ? ponencia.hora_fin.slice(0, 5) : "11:00",
      profesion_id: ponencia.profesion_id || 0, // Ensure it has a value
      provincia_id: (ponencia as any).provincia_id || 0,
      ciudad_id: (ponencia as any).ciudad_id || 0,
      direccion: (ponencia as any).direccion || "",
      latitud: (ponencia as any).latitud,
      longitud: (ponencia as any).longitud,
    } as any)

    // Load cities if province is selected
    if ((ponencia as any).provincia_id) {
      catalogosApi.obtenerCiudades((ponencia as any).provincia_id).then(res => {
        setCiudades(Array.isArray(res) ? res : [])
      })
    }

    setIsConversatorioDialogOpen(true)
  }

  const handleEditPlan = (plan: Plan) => {
    setEditingItem(plan)
    setPlanForm(plan as any)
    setIsPlanDialogOpen(true)
  }

  const handleDeleteConversatorio = async (id: number) => {
    if (!confirm("Confirmar eliminación")) return
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
    if (!confirm("Confirmar eliminación")) return
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

  const openProfileDetails = (profile: any) => {
    setSelectedProfile(profile)
    setIsProfileDetailsOpen(true)
  }

  // Articles moderation handlers
  const handleModerarArticulo = async (id: number) => {
    const token = localStorage.getItem("auth_token")
    if (!token) return
    try {
      await articulosApi.moderar(id, token)
      toast({ title: "Artículo moderado", description: "El artículo ha sido aprobado y publicado." })
      const data = await articulosApi.listarPublicados()
      setAdminArticulos(Array.isArray(data) ? data : [])
    } catch (error) {
      toast({ title: "Error", description: "No se pudo moderar el artículo.", variant: "destructive" })
    }
  }

  const handleArchivarArticulo = async (id: number) => {
    const token = localStorage.getItem("auth_token")
    if (!token) return
    if (!confirm("¿Estás seguro de archivar este artículo?")) return
    try {
      await articulosApi.archivar(id, token)
      toast({ title: "Artículo archivado", description: "El artículo ha sido archivado." })
      const data = await articulosApi.listarPublicados()
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
      const articlesData = await articulosApi.listarPublicados()
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
      const articlesData = await articulosApi.listarPublicados()
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
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Panel de Administración
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Gestiona conversatorios, perfiles profesionales y planes de pago de forma eficiente
            </p>
          </div>

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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 shadow-sm">
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
            </TabsList>

            {/* CONVERSATORIOS TAB */}
            <TabsContent value="conversatorios" className="space-y-4">
              <div className="animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-1">Gestión de Conversatorios</h2>
                    <p className="text-sm text-gray-500">Crea, edita y administra tus eventos educativos</p>
                  </div>
                  <Dialog open={isConversatorioDialogOpen} onOpenChange={setIsConversatorioDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-200 transition-all duration-300 hover:scale-105"
                        onClick={() => {
                          setEditingItem(null)
                          resetConversatorioForm()
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Conversatorio
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border-gray-200 max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl">{editingItem ? "Editar" : "Crear"} Conversatorio</DialogTitle>
                        <DialogDescription className="text-gray-500">
                          {editingItem ? "Modifica" : "Completa"} los detalles del conversatorio. Los campos marcados
                          son obligatorios.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="titulo" className="text-sm font-medium flex items-center gap-1">
                            Título <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="titulo"
                            placeholder="Ej: Innovación en Tecnología Educativa"
                            value={conversatorioForm.titulo}
                            onChange={(e) => setConversatorioForm({ ...conversatorioForm, titulo: e.target.value })}
                            className="focus:border-blue-500/50 transition-colors"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="descripcion" className="text-sm font-medium flex items-center gap-1">
                            Descripción <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="descripcion"
                            placeholder="Describe el contenido y objetivos del conversatorio..."
                            value={conversatorioForm.descripcion}
                            onChange={(e) =>
                              setConversatorioForm({ ...conversatorioForm, descripcion: e.target.value })
                            }
                            className="focus:border-blue-500/50 transition-colors min-h-[100px]"
                            rows={4}
                          />
                        </div>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <Label className="text-sm font-semibold text-emerald-700 mb-2 block">Inicio del Evento</Label>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "justify-start text-left font-normal focus:border-emerald-500/50 transition-colors flex-1 bg-white",
                                      !conversatorioForm.fecha_inicio && "text-muted-foreground",
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {conversatorioForm.fecha_inicio ? (
                                      format(conversatorioForm.fecha_inicio, "PPP", { locale: es })
                                    ) : (
                                      <span>Seleccionar fecha</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-white border-gray-200">
                                  <Calendar
                                    mode="single"
                                    selected={conversatorioForm.fecha_inicio}
                                    onSelect={(date) =>
                                      date && setConversatorioForm({ ...conversatorioForm, fecha_inicio: date })
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                <Input
                                  type="time"
                                  value={conversatorioForm.hora_inicio}
                                  onChange={(e) => setConversatorioForm({ ...conversatorioForm, hora_inicio: e.target.value })}
                                  className="pl-9 w-full sm:w-36 bg-white focus:border-emerald-500/50"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <Label className="text-sm font-semibold text-blue-700 mb-2 block">Finalización del Evento</Label>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "justify-start text-left font-normal focus:border-blue-500/50 transition-colors flex-1 bg-white",
                                      !conversatorioForm.fecha_fin && "text-muted-foreground",
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {conversatorioForm.fecha_fin ? (
                                      format(conversatorioForm.fecha_fin, "PPP", { locale: es })
                                    ) : (
                                      <span>Seleccionar fecha</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-white border-gray-200">
                                  <Calendar
                                    mode="single"
                                    selected={conversatorioForm.fecha_fin}
                                    onSelect={(date) =>
                                      date && setConversatorioForm({ ...conversatorioForm, fecha_fin: date })
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                <Input
                                  type="time"
                                  value={conversatorioForm.hora_fin}
                                  onChange={(e) => setConversatorioForm({ ...conversatorioForm, hora_fin: e.target.value })}
                                  className="pl-9 w-full sm:w-36 bg-white focus:border-blue-500/50"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="precio" className="text-sm font-medium">
                              Precio (USD)
                            </Label>
                            <Input
                              id="precio"
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              value={conversatorioForm.precio}
                              onChange={(e) =>
                                setConversatorioForm({
                                  ...conversatorioForm,
                                  precio: e.target.value === "" ? 0 : Number.parseFloat(e.target.value),
                                })
                              }
                              className="focus:border-blue-500/50 transition-colors"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="cupo" className="text-sm font-medium">
                              Cupo Máximo
                            </Label>
                            <Input
                              id="cupo"
                              type="number"
                              min="1"
                              placeholder="100"
                              value={conversatorioForm.cupo || ""}
                              onChange={(e) =>
                                setConversatorioForm({
                                  ...conversatorioForm,
                                  cupo: e.target.value === "" ? 0 : Number.parseInt(e.target.value)
                                })
                              }
                              className="focus:border-blue-500/50 transition-colors"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="provincia" className="text-sm font-medium">Provincia</Label>
                              <Select
                                value={conversatorioForm.provincia_id ? conversatorioForm.provincia_id.toString() : ""}
                                onValueChange={(val) => handleProvinciaChange(val)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar provincia" />
                                </SelectTrigger>
                                <SelectContent>
                                  {provincias.map((prov: any) => (
                                    <SelectItem key={prov.id} value={prov.id.toString()}>{prov.nombre}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="ciudad" className="text-sm font-medium">Ciudad</Label>
                              <Select
                                value={conversatorioForm.ciudad_id ? conversatorioForm.ciudad_id.toString() : ""}
                                onValueChange={(val) => setConversatorioForm(prev => ({ ...prev, ciudad_id: Number(val) }))}
                                disabled={!conversatorioForm.provincia_id}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar ciudad" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ciudades.map((ciudad: any) => (
                                    <SelectItem key={ciudad.id} value={ciudad.id.toString()}>{ciudad.nombre}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-4 border border-gray-100 rounded-lg p-4 bg-gray-50/50">
                            <Label className="text-sm font-medium block mb-2">Ubicación del Evento (Manual)</Label>
                            <div className="grid gap-4">
                              <div className="h-[300px] w-full rounded-md overflow-hidden border">
                                <LocationMap
                                  lat={conversatorioForm.latitud}
                                  lng={conversatorioForm.longitud}
                                  onChange={handleLocationChange}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Haz clic en el mapa para establecer las coordenadas exactas.
                              </p>
                              <div className="grid gap-2">
                                <Label htmlFor="direccion" className="text-sm font-medium">Dirección Escrita</Label>
                                <Textarea
                                  id="direccion"
                                  placeholder="Ej: Av. Amazonas y Naciones Unidas, Edificio X, Piso 2"
                                  value={conversatorioForm.direccion || ""}
                                  onChange={(e) => setConversatorioForm({ ...conversatorioForm, direccion: e.target.value })}
                                  rows={2}
                                />
                              </div>
                            </div>
                          </div>

                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="estado" className="text-sm font-medium">
                            Estado
                          </Label>
                          <Select
                            value={conversatorioForm.estado}
                            onValueChange={(value: any) =>
                              setConversatorioForm({ ...conversatorioForm, estado: value })
                            }
                          >
                            <SelectTrigger className="focus:border-blue-500/50 transition-colors">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200">
                              <SelectItem value="borrador">Borrador</SelectItem>
                              <SelectItem value="publicada">Publicada</SelectItem>
                              <SelectItem value="finalizada">Finalizada</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="profesion" className="text-sm font-medium">
                            Profesión Relacionada
                          </Label>
                          <Select
                            value={conversatorioForm.profesion_id ? conversatorioForm.profesion_id.toString() : ""}
                            onValueChange={(value: string) =>
                              setConversatorioForm({ ...conversatorioForm, profesion_id: Number(value) })
                            }
                          >
                            <SelectTrigger className="focus:border-blue-500/50 transition-colors">
                              <SelectValue placeholder="Seleccionar profesión" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200">
                              {profesiones.map((prof: any) => (
                                <SelectItem key={prof.id} value={prof.id.toString()}>
                                  {prof.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsConversatorioDialogOpen(false)
                            setEditingItem(null)
                            resetConversatorioForm()
                          }}
                          className="hover:bg-gray-100 transition-colors"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleSaveConversatorio}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                        >
                          {editingItem ? "Actualizar" : "Crear"} Conversatorio
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
                              <TableCell>{getEstadoBadge(ponencia.estado)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
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
                                    onClick={() => handleEditConversatorio(ponencia)}
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

                {/* Ponentes Management Panel */}
                {selectedPonenciaId && (
                  <Card className="bg-white border-gray-200 mt-4 animate-in fade-in duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-emerald-600" />
                            Ponentes — {ponencias.find(p => p.id === selectedPonenciaId)?.titulo || ""}
                          </CardTitle>
                          <CardDescription>Asigna o remueve ponentes de este conversatorio</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setSelectedPonenciaId(null); setPonentesList([]); }}
                          className="hover:bg-gray-100"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                              onClick={() => handleAsignarPonente(selectedPonenciaId, null, externalSpeakerName)}
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
                                handleAsignarPonente(selectedPonenciaId, Number(value))
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
                                <p className="font-medium text-gray-900">{ponente.usuario?.nombre || `Usuario #${ponente.usuario_id}`}</p>
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
                    </CardContent>
                  </Card>
                )}

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
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 hover:scale-105"
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Aprobar
                              </Button>
                            )}
                            {perfil.estado !== "rechazado" && (
                              <Button
                                onClick={() => rechazarPerfil(perfil.id)}
                                variant="destructive"
                                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:scale-105"
                              >
                                <X className="mr-2 h-4 w-4" />
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
          </Tabs>

          {/* Dialog Detalle Perfil */}
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
                            href={doc.url}
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

      <Footer />
    </div>
  )
}
