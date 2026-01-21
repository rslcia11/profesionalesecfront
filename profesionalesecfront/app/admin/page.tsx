"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { profesionalApi, adminApi } from "@/lib/api"

type Ponencia = {
  id: number
  titulo: string
  descripcion: string
  fecha_inicio: Date
  fecha_fin: Date
  precio: number
  cupo: number
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

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("auth_token")
      if (!token) return

      try {
        const stats = await adminApi.getStats(token)
        console.log("Stats received in Admin Page:", stats); // DEBUG
        setPonencias(stats.ponencias)

        // Map backend data to frontend structure
        const mappedProfiles = stats.profesionales.map((p: any) => ({
          id: p.usuario_id, // Important: using user ID as main ID? or profile ID? Using user_id for actions likely.
          verificado: p.verificado,
          estado: p.estado_id === 1 ? "rechazado" : p.estado_id === 2 ? "pendiente" : "aprobado",
          nombre: p.usuario?.nombre || "Sin nombre",
          correo: p.usuario?.correo || "",
          telefono: p.usuario?.telefono || "No disponible (API)",
          cedula: p.usuario?.cedula || "No disponible (API)",
          profesion: p.profesion ? p.profesion.nombre : "Sin profesión",
          especialidad: p.especialidad ? p.especialidad.nombre : "Sin especialidad",
          ciudad: p.ciudad ? p.ciudad.nombre : "",
          provincia: p.ciudad?.provincia ? p.ciudad.provincia.nombre : "",
          tarifa: p.tarifa_hora ? `$${p.tarifa_hora}` : "No definida",
          fecha_registro: p.usuario?.creado_en || new Date().toISOString(),
          descripcion: p.descripcion || "Sin descripción",
          documentos: p.documentos || [],
          foto_url: p.usuario?.foto_url || null,
          direccion_texto: p.direccion ? `${p.direccion.calle_principal} ${p.direccion.referencia ? `(${p.direccion.referencia})` : ""}` : "No registrada",
          link_maps: p.direccion?.link_maps || null,
          // Keep original structure for compatibility if needed
          perfil_estado: {
            estado: p.estado_id === 1 ? "rechazado" : p.estado_id === 2 ? "pendiente" : "aprobado",
          },
        }))
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
    }
    loadData()
  }, [])

  // Dialog states
  const [isConversatorioDialogOpen, setIsConversatorioDialogOpen] = useState(false)
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false)
  const [isProfileDetailsOpen, setIsProfileDetailsOpen] = useState(false) // Nuevo estado para detalles
  const [selectedProfile, setSelectedProfile] = useState<any>(null) // Nuevo estado para perfil seleccionado
  const [editingItem, setEditingItem] = useState<any>(null)

  // Form states
  const [conversatorioForm, setConversatorioForm] = useState({
    titulo: "",
    descripcion: "",
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
    precio: 0,
    cupo: 0,
    estado: "borrador" as const,
  })

  const [planForm, setPlanForm] = useState({
    nombre: "",
    descripcion: "",
    precio_base: 0,
    tipo: "suscripcion" as const,
    duracion_dias: 30,
    activo: true,
  })

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
        const res = await adminApi.createPonencia({ ...conversatorioForm, profesion_id: 1 }, token) // Default ID or selector
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
      fecha_fin: new Date(),
      precio: 0,
      cupo: 0,
      estado: "borrador",
    })
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
    setConversatorioForm(ponencia)
    setIsConversatorioDialogOpen(true)
  }

  const handleEditPlan = (plan: Plan) => {
    setEditingItem(plan)
    setPlanForm(plan)
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
            <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 shadow-sm">
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
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label className="text-sm font-medium">Fecha Inicio</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "justify-start text-left font-normal focus:border-blue-500/50 transition-colors",
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
                          </div>
                          <div className="grid gap-2">
                            <Label className="text-sm font-medium">Fecha Fin</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "justify-start text-left font-normal focus:border-blue-500/50 transition-colors",
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

                <div className="grid gap-4">
                  {perfilesPendientes.length === 0 ? (
                    <Card className="bg-white border-gray-200">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="h-12 w-12 text-gray-500 mb-4" />
                        <h3 className="text-lg font-semibold mb-1">No hay profesionales registrados</h3>
                        <p className="text-sm text-gray-500">Aún no hay perfiles profesionales en el sistema</p>
                      </CardContent>
                    </Card>
                  ) : (
                    perfilesPendientes.map((perfil, index) => (
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

        </div>
      </main>

      <Footer />
    </div>
  )
}
