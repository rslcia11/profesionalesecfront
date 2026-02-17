"use client"

import { useState, useEffect, useCallback } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import RescheduleModal from "@/components/reschedule-modal"
import {
  Calendar,
  Clock,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Construction,
  Loader2,
  BookOpen,
  FileText,
  Edit,
  Trash2,
  Plus,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { citasApi, usuarioApi, articulosApi, type Articulo } from "@/lib/api"
import ArticleFormModal from "@/components/article-form-modal"
import ServicesManager from "@/components/services-manager"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function ProfesionalDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  // State
  const [loading, setLoading] = useState(true)
  const [citas, setCitas] = useState<any[]>([])
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false)
  const [selectedCita, setSelectedCita] = useState<any>(null)
  const [user, setUser] = useState<any>(null)

  // Articles state
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Articulo | null>(null)

  // Load Data
  const loadData = useCallback(async () => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      window.location.href = "/login"
      return
    }

    try {
      setLoading(true)
      // Run promises in parallel for better performance
      const [citasData, userData] = await Promise.all([
        citasApi.listar(token),
        usuarioApi.obtenerMiPerfil(token).catch(() => null)
      ])

      setUser(userData)

      // Map backend data to frontend structure because backend returns raw IDs and missing relations
      const mappedCitas = (Array.isArray(citasData) ? citasData : []).map((c: any) => ({
        ...c,
        // Construct proper date object from separate fields with safety checks
        fecha_hora: (function () {
          if (!c.fecha_cita || !c.hora_cita) return null;
          // Ensure string format YYYY-MM-DD
          const fechaStr = typeof c.fecha_cita === 'string' ? c.fecha_cita : new Date(c.fecha_cita).toISOString().split('T')[0];
          const horaStr = c.hora_cita.toString(); // Ensure string
          return `${fechaStr}T${horaStr}`;
        })(),
        // Map estado_id to string for UI logic
        estado: c.estado_id === 1 ? "pendiente" : c.estado_id === 2 ? "confirmada" : c.estado_id === 3 ? "completada" : "cancelada",
        // Map available name fields to what UI expects
        usuario: c.usuario || { nombre: c.alias || c.nombres_completos || "Cliente sin nombre" },
        // Map contact details and description
        descripcion: c.comentario || c.descripcion || "Sin motivo especificado",
        telefono: c.telefono || c.usuario?.telefono || "No disp.",
        correo: c.correo || c.usuario?.correo || "No disp."
      }))
      // Filter out invalid ones if strictly necessary, or keep and show "Fecha inválida"
      setCitas(mappedCitas.sort((a: any, b: any) => {
        const timeA = a.fecha_hora ? new Date(a.fecha_hora).getTime() : 0;
        const timeB = b.fecha_hora ? new Date(b.fecha_hora).getTime() : 0;
        return timeB - timeA;
      }))
    } catch (error) {
      console.error("Error loading professional dashboard:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Actions
  const handleEstadoCita = async (id: number, nuevoEstado: number) => {
    const token = localStorage.getItem("auth_token")
    if (!token) return

    try {
      await citasApi.cambiarEstado(id, nuevoEstado, token)

      // Reload data to ensure consistency or update local state
      loadData()

      toast({ title: "Estado actualizado", description: "La cita ha sido actualizada." })
    } catch (error) {
      toast({ title: "Error", description: "No se pudo actualizar la cita.", variant: "destructive" })
    }
  }

  const handleReschedule = (cita: any) => {
    setSelectedCita(cita)
    setIsRescheduleModalOpen(true)
  }

  // --- Articles functions ---
  const loadArticulos = useCallback(async () => {
    const token = localStorage.getItem("auth_token")
    if (!token) return
    try {
      const data = await articulosApi.listarMios(token)
      setArticulos(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error loading articles:", error)
    }
  }, [])

  useEffect(() => {
    loadArticulos()
  }, [loadArticulos])

  const handleCreateArticulo = async (data: { titulo: string; contenido: string; resumen?: string; imagen_url?: string }) => {
    const token = localStorage.getItem("auth_token")
    if (!token) return
    await articulosApi.crear(data, token)
    toast({ title: "Artículo publicado", description: "Tu artículo ha sido publicado exitosamente." })
    loadArticulos()
  }

  const handleUpdateArticulo = async (data: { titulo: string; contenido: string; resumen?: string; imagen_url?: string }) => {
    const token = localStorage.getItem("auth_token")
    if (!token || !editingArticle) return
    await articulosApi.actualizar(editingArticle.id, data, token)
    toast({ title: "Artículo actualizado", description: "Tu artículo ha sido actualizado." })
    setEditingArticle(null)
    loadArticulos()
  }

  const handleDeleteArticulo = async (id: number) => {
    const token = localStorage.getItem("auth_token")
    if (!token) return
    if (!confirm("¿Estás seguro de eliminar este artículo?")) return
    try {
      await articulosApi.eliminar(id, token)
      toast({ title: "Artículo eliminado", description: "El artículo ha sido eliminado." })
      loadArticulos()
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar el artículo.", variant: "destructive" })
    }
  }

  // Calculated Stats
  const estadisticas = {
    citasPendientes: citas.filter((c) => c.estado === "pendiente" || c.estado_id === 1).length,
    citasConfirmadas: citas.filter((c) => c.estado === "confirmada" || c.estado_id === 2).length,
    citasCompletadas: citas.filter((c) => c.estado === "completada" || c.estado_id === 3).length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </main>
        <Footer />
      </div>
    )
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
          <p className="text-gray-600 text-lg">
            Hola, <span className="font-semibold text-gray-800">{user?.nombre || "Profesional"}</span>
          </p>
        </div>

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium text-gray-600">Citas Completadas</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{estadisticas.citasCompletadas}</div>
              <p className="text-xs text-gray-500 mt-1">Histórico total</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para diferentes secciones */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="inline-flex h-11 items-center justify-center rounded-xl bg-white p-1 text-gray-400 border border-gray-100 shadow-sm">
              <TabsTrigger
                value="overview"
                className="rounded-lg px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Resumen
              </TabsTrigger>
              <TabsTrigger
                value="citas"
                className="rounded-lg px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Citas
              </TabsTrigger>
              <TabsTrigger
                value="articulos"
                className="rounded-lg px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Artículos
              </TabsTrigger>
              <TabsTrigger
                value="servicios"
                className="rounded-lg px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Servicios
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab: Resumen */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {citas.length > 0 ? (
                  citas.slice(0, 5).map((cita) => (
                    <div
                      key={cita.id}
                      className="flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <div className="flex flex-col gap-1 max-w-[50%]">
                        <p className="font-medium text-gray-900">{cita.usuario?.nombre || "Cliente"}</p>
                        <div className="flex flex-col text-xs text-gray-500 gap-0.5">
                          <span>{cita.telefono} • {cita.correo}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 italic">"{cita.descripcion}"</p>
                        <p className="text-xs text-gray-500 font-semibold text-blue-600">
                          {isNaN(new Date(cita.fecha_hora).getTime())
                            ? "Fecha no disponible"
                            : format(new Date(cita.fecha_hora), "PPP p", { locale: es })}
                        </p>
                      </div>
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
                      >
                        {cita.estado}
                      </Badge>

                      {/* Action Buttons for Pending Citas in Overview */}
                      {cita.estado === "pendiente" && (
                        <div className="flex gap-1 ml-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-green-600 hover:bg-green-100"
                            onClick={() => handleEstadoCita(cita.id, 2)}
                            title="Confirmar"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-600 hover:bg-red-100"
                            onClick={() => handleEstadoCita(cita.id, 4)}
                            title="Rechazar"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No tienes actividad reciente.</p>
                )}
              </CardContent>
            </Card>
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
                </CardTitle>
                <CardDescription className="text-gray-600">Administra tus citas y agenda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-3 text-gray-600 font-medium">Cliente</th>
                        <th className="text-left p-3 text-gray-600 font-medium">Motivo</th>
                        <th className="text-left p-3 text-gray-600 font-medium">Fecha y Hora</th>
                        <th className="text-left p-3 text-gray-600 font-medium">Estado</th>
                        <th className="text-right p-3 text-gray-600 font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {citas.map((cita) => (
                        <tr key={cita.id} className="border-b border-gray-200/50 hover:bg-gray-100 transition-colors">
                          <td className="p-3 text-gray-900 font-medium">
                            <div>{cita.usuario?.nombre || "N/A"}</div>
                            <div className="text-xs text-gray-500">{cita.telefono}</div>
                            <div className="text-xs text-gray-500">{cita.correo}</div>
                          </td>
                          <td className="p-3 text-gray-700 italic">"{cita.descripcion}"</td>
                          <td className="p-3 text-gray-700">
                            {isNaN(new Date(cita.fecha_hora).getTime())
                              ? "Fecha no disponible"
                              : format(new Date(cita.fecha_hora), "PPP p", { locale: es })}
                          </td>
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
                              {(cita.estado === "pendiente" || cita.estado === "confirmada") && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReschedule(cita)}
                                  className="bg-purple-600/10 border-purple-600/50 text-purple-600 hover:bg-purple-600/20"
                                  title="Reagendar"
                                >
                                  <Calendar className="h-4 w-4" />
                                </Button>
                              )}
                              {cita.estado === "pendiente" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEstadoCita(cita.id, 2)}
                                  className="bg-green-600/10 border-green-600/50 text-green-400 hover:bg-green-600/20"
                                  title="Confirmar"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              )}
                              {cita.estado === "confirmada" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEstadoCita(cita.id, 3)}
                                  className="bg-blue-600/10 border-blue-600/50 text-blue-400 hover:bg-blue-600/20"
                                  title="Completar"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              )}
                              {cita.estado !== "cancelada" && cita.estado !== "completada" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEstadoCita(cita.id, 4)}
                                  className="bg-red-600/10 border-red-600/50 text-red-400 hover:bg-red-600/20"
                                  title="Cancelar"
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
            <ServicesManager />
          </TabsContent>



          {/* Tab: Artículos */}
          <TabsContent value="articulos" className="space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  Mis Artículos
                </CardTitle>
                <Button
                  onClick={() => {
                    setEditingArticle(null)
                    setIsArticleModalOpen(true)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nuevo Artículo
                </Button>
              </CardHeader>
              <CardContent>
                {articulos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="bg-blue-50 p-4 rounded-full mb-4">
                      <FileText className="h-10 w-10 text-blue-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Aún no tienes artículos</h3>
                    <p className="text-gray-500 max-w-md mb-4">
                      Comparte tu conocimiento con la comunidad. Los artículos se publican en la sección de educación.
                    </p>
                    <Button
                      onClick={() => {
                        setEditingArticle(null)
                        setIsArticleModalOpen(true)
                      }}
                      variant="outline"
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Crear mi primer artículo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {articulos.map((articulo) => (
                      <div
                        key={articulo.id}
                        className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100"
                      >
                        <div className="flex-1 min-w-0 mr-4">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 truncate">{articulo.titulo}</h4>
                            <Badge
                              variant={articulo.estado === "publicado" ? "default" : articulo.estado === "archivado" ? "destructive" : "secondary"}
                              className="text-xs shrink-0"
                            >
                              {articulo.estado}
                            </Badge>
                          </div>
                          {articulo.resumen && (
                            <p className="text-sm text-gray-500 line-clamp-2">{articulo.resumen}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {articulo.fecha_publicacion ? new Date(articulo.fecha_publicacion).toLocaleDateString("es-EC") : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingArticle(articulo)
                              setIsArticleModalOpen(true)
                            }}
                            className="gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteArticulo(articulo.id)}
                            className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main >

      <Footer />

      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        cita={selectedCita}
        onSuccess={loadData}
      />

      <ArticleFormModal
        open={isArticleModalOpen}
        onOpenChange={setIsArticleModalOpen}
        article={editingArticle}
        onSubmit={editingArticle ? handleUpdateArticulo : handleCreateArticulo}
      />
    </div >
  )
}
