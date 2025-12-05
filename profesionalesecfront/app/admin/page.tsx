"use client"

import { useState } from "react"
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
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

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
  nombre: string
  correo: string
  profesion: string
  telefono: string
  fecha_registro: Date
  estado: "pendiente" | "aprobado" | "rechazado"
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

  const [ponencias, setPonencias] = useState<Ponencia[]>([
    {
      id: 1,
      titulo: "Innovación en Tecnología Educativa",
      descripcion: "Conversatorio sobre las últimas tendencias en EdTech y transformación digital en la educación",
      fecha_inicio: new Date("2025-02-15"),
      fecha_fin: new Date("2025-02-15"),
      precio: 10.0,
      cupo: 100,
      estado: "publicada",
    },
    {
      id: 2,
      titulo: "Liderazgo en la Era Digital",
      descripcion: "Estrategias de liderazgo para profesionales modernos en un entorno digital cambiante",
      fecha_inicio: new Date("2025-03-20"),
      fecha_fin: new Date("2025-03-20"),
      precio: 15.0,
      cupo: 50,
      estado: "borrador",
    },
  ])

  const [perfilesPendientes, setPerfilesPendientes] = useState<PerfilPendiente[]>([
    {
      id: 1,
      nombre: "María González",
      correo: "maria@example.com",
      profesion: "Abogada Especialista en Derecho Corporativo",
      telefono: "0999123456",
      fecha_registro: new Date("2025-01-15"),
      estado: "pendiente",
    },
    {
      id: 2,
      nombre: "Carlos Ramírez",
      correo: "carlos@example.com",
      profesion: "Médico Cardiólogo",
      telefono: "0988654321",
      fecha_registro: new Date("2025-01-20"),
      estado: "pendiente",
    },
  ])

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
    {
      id: 2,
      nombre: "Plan Premium",
      descripcion: "Acceso completo con beneficios exclusivos y soporte prioritario",
      precio_base: 25.0,
      tipo: "suscripcion",
      duracion_dias: 30,
      activo: true,
    },
    {
      id: 3,
      nombre: "Publicación Destacada",
      descripcion: "Destacar tu perfil por 7 días en la página principal",
      precio_base: 5.0,
      tipo: "one_time",
      duracion_dias: 7,
      activo: true,
    },
  ])

  // Dialog states
  const [isConversatorioDialogOpen, setIsConversatorioDialogOpen] = useState(false)
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false)
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

  const aprobarPerfil = (id: number) => {
    setPerfilesPendientes(perfilesPendientes.map((p) => (p.id === id ? { ...p, estado: "aprobado" as const } : p)))
    toast({
      title: "Perfil Aprobado",
      description: "El perfil ha sido aprobado exitosamente y ya está visible en la plataforma.",
    })
  }

  const rechazarPerfil = (id: number) => {
    setPerfilesPendientes(perfilesPendientes.map((p) => (p.id === id ? { ...p, estado: "rechazado" as const } : p)))
    toast({
      title: "Perfil Rechazado",
      description: "El perfil ha sido rechazado. El usuario será notificado.",
      variant: "destructive",
    })
  }

  const handleSaveConversatorio = () => {
    if (!conversatorioForm.titulo || !conversatorioForm.descripcion) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    if (editingItem) {
      setPonencias(ponencias.map((p) => (p.id === editingItem.id ? { ...conversatorioForm, id: editingItem.id } : p)))
      toast({
        title: "Conversatorio Actualizado",
        description: `"${conversatorioForm.titulo}" ha sido actualizado exitosamente.`,
      })
    } else {
      setPonencias([...ponencias, { ...conversatorioForm, id: Date.now() }])
      toast({
        title: "Conversatorio Creado",
        description: `"${conversatorioForm.titulo}" ha sido creado exitosamente.`,
      })
    }
    setIsConversatorioDialogOpen(false)
    setEditingItem(null)
    resetConversatorioForm()
  }

  const handleSavePlan = () => {
    if (!planForm.nombre || !planForm.descripcion) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    if (editingItem) {
      setPlanes(planes.map((p) => (p.id === editingItem.id ? { ...planForm, id: editingItem.id } : p)))
      toast({
        title: "Plan Actualizado",
        description: `"${planForm.nombre}" ha sido actualizado exitosamente.`,
      })
    } else {
      setPlanes([...planes, { ...planForm, id: Date.now() }])
      toast({
        title: "Plan Creado",
        description: `"${planForm.nombre}" ha sido creado exitosamente.`,
      })
    }
    setIsPlanDialogOpen(false)
    setEditingItem(null)
    resetPlanForm()
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

  const handleDeleteConversatorio = (id: number) => {
    const ponencia = ponencias.find((p) => p.id === id)
    if (confirm(`¿Estás seguro de eliminar "${ponencia?.titulo}"? Esta acción no se puede deshacer.`)) {
      setPonencias(ponencias.filter((p) => p.id !== id))
      toast({
        title: "Conversatorio Eliminado",
        description: "El conversatorio ha sido eliminado exitosamente.",
      })
    }
  }

  const handleDeletePlan = (id: number) => {
    const plan = planes.find((p) => p.id === id)
    if (confirm(`¿Estás seguro de eliminar "${plan?.nombre}"? Esta acción no se puede deshacer.`)) {
      setPlanes(planes.filter((p) => p.id !== id))
      toast({
        title: "Plan Eliminado",
        description: "El plan ha sido eliminado exitosamente.",
      })
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
                Perfiles Pendientes
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
                                  precio: Number.parseFloat(e.target.value),
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
                              value={conversatorioForm.cupo}
                              onChange={(e) =>
                                setConversatorioForm({ ...conversatorioForm, cupo: Number.parseInt(e.target.value) })
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
                              <TableCell>${ponencia.precio.toFixed(2)}</TableCell>
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

            {/* PERFILES PENDIENTES TAB */}
            <TabsContent value="perfiles" className="space-y-4">
              <div className="animate-in fade-in duration-300">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-1">Perfiles Profesionales Pendientes</h2>
                  <p className="text-sm text-gray-500">
                    Revisa y aprueba los perfiles profesionales que esperan validación
                  </p>
                </div>

                <div className="grid gap-4">
                  {perfilesPendientes.filter((p) => p.estado === "pendiente").length === 0 ? (
                    <Card className="bg-white border-gray-200">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="h-12 w-12 text-gray-500 mb-4" />
                        <h3 className="text-lg font-semibold mb-1">No hay perfiles pendientes</h3>
                        <p className="text-sm text-gray-500">Todos los perfiles han sido revisados y procesados</p>
                      </CardContent>
                    </Card>
                  ) : (
                    perfilesPendientes
                      .filter((p) => p.estado === "pendiente")
                      .map((perfil, index) => (
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
                                <span>{perfil.telefono}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-500">Registro:</span>
                                <span>{format(perfil.fecha_registro, "dd/MM/yyyy")}</span>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <Button
                                onClick={() => aprobarPerfil(perfil.id)}
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 hover:scale-105"
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Aprobar Perfil
                              </Button>
                              <Button
                                onClick={() => rechazarPerfil(perfil.id)}
                                variant="destructive"
                                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:scale-105"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Rechazar Perfil
                              </Button>
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
                              value={planForm.precio_base}
                              onChange={(e) =>
                                setPlanForm({ ...planForm, precio_base: Number.parseFloat(e.target.value) })
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
                                setPlanForm({ ...planForm, duracion_dias: Number.parseInt(e.target.value) || null })
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
                            <span className="font-semibold">${plan.precio_base.toFixed(2)}</span>
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
        </div>
      </main>

      <Footer />
    </div>
  )
}
