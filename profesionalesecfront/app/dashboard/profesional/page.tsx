"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  Star,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Plus,
  Eye,
  Briefcase,
} from "lucide-react"

export default function ProfesionalDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Estado para citas
  const [citas, setCitas] = useState([
    {
      id: 1,
      cliente: "María González",
      telefono: "0987654321",
      fecha: "2025-12-05",
      hora: "10:00",
      estado: "confirmada",
      servicio: "Consulta Legal",
    },
    {
      id: 2,
      cliente: "Juan Pérez",
      telefono: "0998765432",
      fecha: "2025-12-06",
      hora: "14:00",
      estado: "pendiente",
      servicio: "Asesoría",
    },
    {
      id: 3,
      cliente: "Ana Rodríguez",
      telefono: "0976543210",
      fecha: "2025-12-07",
      hora: "11:30",
      estado: "pendiente",
      servicio: "Consulta",
    },
  ])

  // Estado para servicios
  const [servicios, setServicios] = useState([
    {
      id: 1,
      nombre: "Consulta Legal",
      descripcion: "Asesoría legal especializada",
      precio: 50,
      duracion: "1 hora",
      activo: true,
    },
    {
      id: 2,
      nombre: "Asesoría Empresarial",
      descripcion: "Consultoría para empresas",
      precio: 120,
      duracion: "2 horas",
      activo: true,
    },
    {
      id: 3,
      nombre: "Revisión de Documentos",
      descripcion: "Análisis de contratos y documentos",
      precio: 80,
      duracion: "1.5 horas",
      activo: false,
    },
  ])

  // Estado para ofertas de empleo
  const [ofertas, setOfertas] = useState([
    {
      id: 1,
      titulo: "Abogado Senior",
      empresa: "LexCorp",
      ubicacion: "Quito",
      salario: "2000-3000",
      tipo: "Tiempo completo",
      fecha: "2025-11-25",
    },
    {
      id: 2,
      titulo: "Asesor Legal",
      empresa: "Grupo Legal",
      ubicacion: "Guayaquil",
      salario: "1500-2000",
      tipo: "Medio tiempo",
      fecha: "2025-11-28",
    },
    {
      id: 3,
      titulo: "Consultor Jurídico",
      empresa: "Estudio Jurídico",
      ubicacion: "Cuenca",
      salario: "1800-2500",
      tipo: "Tiempo completo",
      fecha: "2025-11-30",
    },
  ])

  // Funciones para citas
  const confirmarCita = (id: number) => {
    setCitas(citas.map((c) => (c.id === id ? { ...c, estado: "confirmada" } : c)))
  }

  const cancelarCita = (id: number) => {
    setCitas(citas.map((c) => (c.id === id ? { ...c, estado: "cancelada" } : c)))
  }

  const completarCita = (id: number) => {
    setCitas(citas.map((c) => (c.id === id ? { ...c, estado: "completada" } : c)))
  }

  // Funciones para servicios
  const toggleServicio = (id: number) => {
    setServicios(servicios.map((s) => (s.id === id ? { ...s, activo: !s.activo } : s)))
  }

  const eliminarServicio = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este servicio?")) {
      setServicios(servicios.filter((s) => s.id !== id))
    }
  }

  // Estadísticas
  const estadisticas = {
    citasPendientes: citas.filter((c) => c.estado === "pendiente").length,
    citasConfirmadas: citas.filter((c) => c.estado === "confirmada").length,
    citasCompletadas: citas.filter((c) => c.estado === "completada").length,
    serviciosActivos: servicios.filter((s) => s.activo).length,
    calificacionPromedio: 4.8,
    ingresosEsteMes: 1250,
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8 mt-20">
        {/* Header del Dashboard */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Dashboard Profesional
          </h1>
          <p className="text-gray-600">Gestiona tu actividad profesional, citas y servicios</p>
        </div>

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-gray-200 hover:border-yellow-300 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Citas Pendientes</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{estadisticas.citasPendientes}</div>
              <p className="text-xs text-gray-500 mt-1">Requieren confirmación</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:border-green-300 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Citas Confirmadas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{estadisticas.citasConfirmadas}</div>
              <p className="text-xs text-gray-500 mt-1">Próximas citas agendadas</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Servicios Activos</CardTitle>
              <Briefcase className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{estadisticas.serviciosActivos}</div>
              <p className="text-xs text-gray-500 mt-1">De {servicios.length} totales</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:border-purple-300 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Ingresos del Mes</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">${estadisticas.ingresosEsteMes}</div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +12% vs mes anterior
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para diferentes secciones */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Resumen
            </TabsTrigger>
            <TabsTrigger value="citas" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Citas
            </TabsTrigger>
            <TabsTrigger value="servicios" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Servicios
            </TabsTrigger>
            <TabsTrigger value="ofertas" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Ofertas de Empleo
            </TabsTrigger>
          </TabsList>

          {/* Tab: Resumen */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Actividad Reciente */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-400" />
                    Actividad Reciente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {citas.slice(0, 3).map((cita) => (
                    <div
                      key={cita.id}
                      className="flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{cita.cliente}</p>
                        <p className="text-sm text-gray-600">{cita.servicio}</p>
                        <p className="text-xs text-gray-500">
                          {cita.fecha} - {cita.hora}
                        </p>
                      </div>
                      <Badge variant={cita.estado === "confirmada" ? "default" : "secondary"}>{cita.estado}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Calificaciones */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    Calificaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl font-bold text-yellow-400">{estadisticas.calificacionPromedio}</div>
                    <div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Basado en 47 reseñas</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-12">5★</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400" style={{ width: "85%" }} />
                      </div>
                      <span className="text-sm text-gray-600 w-8">85%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-12">4★</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400" style={{ width: "10%" }} />
                      </div>
                      <span className="text-sm text-gray-600 w-8">10%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-12">3★</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400" style={{ width: "3%" }} />
                      </div>
                      <span className="text-sm text-gray-600 w-8">3%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-12">2★</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400" style={{ width: "1%" }} />
                      </div>
                      <span className="text-sm text-gray-600 w-8">1%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-12">1★</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400" style={{ width: "1%" }} />
                      </div>
                      <span className="text-sm text-gray-600 w-8">1%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Citas */}
          <TabsContent value="citas" className="space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    Gestión de Citas
                  </span>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Cita
                  </Button>
                </CardTitle>
                <CardDescription className="text-gray-600">Administra tus citas y agenda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-3 text-gray-600 font-medium">Cliente</th>
                        <th className="text-left p-3 text-gray-600 font-medium">Servicio</th>
                        <th className="text-left p-3 text-gray-600 font-medium">Fecha</th>
                        <th className="text-left p-3 text-gray-600 font-medium">Hora</th>
                        <th className="text-left p-3 text-gray-600 font-medium">Teléfono</th>
                        <th className="text-left p-3 text-gray-600 font-medium">Estado</th>
                        <th className="text-right p-3 text-gray-600 font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {citas.map((cita) => (
                        <tr key={cita.id} className="border-b border-gray-200/50 hover:bg-gray-100 transition-colors">
                          <td className="p-3 text-gray-900 font-medium">{cita.cliente}</td>
                          <td className="p-3 text-gray-700">{cita.servicio}</td>
                          <td className="p-3 text-gray-700">{cita.fecha}</td>
                          <td className="p-3 text-gray-700">{cita.hora}</td>
                          <td className="p-3 text-gray-700">{cita.telefono}</td>
                          <td className="p-3">
                            <Badge
                              variant={
                                cita.estado === "confirmada"
                                  ? "default"
                                  : cita.estado === "pendiente"
                                    ? "secondary"
                                    : cita.estado === "completada"
                                      ? "outline"
                                      : "destructive"
                              }
                              className={
                                cita.estado === "confirmada"
                                  ? "bg-green-600 text-white"
                                  : cita.estado === "pendiente"
                                    ? "bg-yellow-600 text-white"
                                    : cita.estado === "completada"
                                      ? "bg-blue-600 text-white"
                                      : "bg-red-600 text-white"
                              }
                            >
                              {cita.estado}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-end gap-2">
                              {cita.estado === "pendiente" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => confirmarCita(cita.id)}
                                  className="bg-green-600/10 border-green-600/50 text-green-400 hover:bg-green-600/20"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              )}
                              {cita.estado === "confirmada" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => completarCita(cita.id)}
                                  className="bg-blue-600/10 border-blue-600/50 text-blue-400 hover:bg-blue-600/20"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              )}
                              {cita.estado !== "cancelada" && cita.estado !== "completada" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => cancelarCita(cita.id)}
                                  className="bg-red-600/10 border-red-600/50 text-red-400 hover:bg-red-600/20"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Servicios */}
          <TabsContent value="servicios" className="space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-400" />
                    Mis Servicios
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Servicio
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border-gray-200 text-gray-900">
                      <DialogHeader>
                        <DialogTitle>Agregar Nuevo Servicio</DialogTitle>
                        <DialogDescription className="text-gray-600">
                          Crea un nuevo servicio que ofrezcas a tus clientes
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="nombre">Nombre del Servicio</Label>
                          <Input id="nombre" placeholder="Ej: Consulta Legal" className="bg-gray-100 border-gray-200" />
                        </div>
                        <div>
                          <Label htmlFor="descripcion">Descripción</Label>
                          <Textarea
                            id="descripcion"
                            placeholder="Describe tu servicio..."
                            className="bg-gray-100 border-gray-200"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="precio">Precio (USD)</Label>
                            <Input id="precio" type="number" placeholder="50" className="bg-gray-100 border-gray-200" />
                          </div>
                          <div>
                            <Label htmlFor="duracion">Duración</Label>
                            <Input id="duracion" placeholder="1 hora" className="bg-gray-100 border-gray-200" />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Crear Servicio</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
                <CardDescription className="text-gray-600">Gestiona los servicios que ofreces</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servicios.map((servicio) => (
                    <Card
                      key={servicio.id}
                      className={`bg-white border-gray-200 hover:border-yellow-300 transition-all duration-300 ${servicio.activo ? "" : "opacity-60"}`}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-lg">
                          <span className="text-gray-900">{servicio.nombre}</span>
                          <Badge
                            variant={servicio.activo ? "default" : "secondary"}
                            className={servicio.activo ? "bg-green-600 text-white" : "bg-gray-600 text-white"}
                          >
                            {servicio.activo ? "Activo" : "Inactivo"}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-gray-600">{servicio.descripcion}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-400" />
                            <span className="text-gray-900 font-bold">${servicio.precio}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-400" />
                            <span className="text-gray-700">{servicio.duracion}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleServicio(servicio.id)}
                            className={
                              servicio.activo
                                ? "bg-yellow-600/10 border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20"
                                : "bg-green-600/10 border-green-600/50 text-green-400 hover:bg-green-600/20"
                            }
                          >
                            {servicio.activo ? "Desactivar" : "Activar"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-blue-600/10 border-blue-600/50 text-blue-400 hover:bg-blue-600/20"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => eliminarServicio(servicio.id)}
                            className="bg-red-600/10 border-red-600/50 text-red-400 hover:bg-red-600/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Ofertas de Empleo */}
          <TabsContent value="ofertas" className="space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-gray-900 mb-1">Ofertas de Empleo</CardTitle>
                    <CardDescription className="text-gray-600">
                      Explora y postúlate para ofertas de empleo
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ofertas.map((oferta) => (
                    <Card
                      key={oferta.id}
                      className="bg-white border-gray-200 hover:border-yellow-300 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg text-gray-900 mb-1">{oferta.titulo}</CardTitle>
                            <CardDescription className="text-gray-600">{oferta.empresa}</CardDescription>
                          </div>
                          <Badge className="bg-blue-600 text-white">{oferta.tipo}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Users className="h-4 w-4 text-blue-400" />
                            <span>{oferta.ubicacion}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <DollarSign className="h-4 w-4 text-green-400" />
                            <span>${oferta.salario}/mes</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{oferta.fecha}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-green-600/10 border-green-600/50 text-green-400 hover:bg-green-600/20"
                          >
                            Postular
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}
