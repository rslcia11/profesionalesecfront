"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, XCircle, MessageCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { citasApi } from "@/lib/api"
import RescheduleModal from "@/components/reschedule-modal"
import { useProfesional } from "@/context/profesional-context"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function CitasPage() {
  const { token } = useProfesional()
  const { toast } = useToast()
  const [citas, setCitas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false)
  const [selectedCita, setSelectedCita] = useState<any>(null)

  const getClienteTelefono = (cita: any): string | null => {
    const candidates = [
      cita?.paciente_telefono,
      cita?.cliente?.telefono,
      cita?.paciente?.telefono,
      cita?.solicitante?.telefono,
      cita?.contacto_telefono,
      cita?.telefono,
      cita?.usuario?.telefono,
    ]
    const telefono = candidates.find(
      (value) =>
        value !== null &&
        value !== undefined &&
        String(value).trim() !== "" &&
        String(value).trim().toLowerCase() !== "no disp.",
    )
    return telefono ? String(telefono).trim() : null
  }

  const normalizePhoneForWhatsApp = (phone: string | null): string | null => {
    if (!phone) return null
    const normalized = phone.replace(/[^\d]/g, "")
    return normalized.length >= 7 ? normalized : null
  }

  const getClienteWhatsAppUrl = (cita: any): string | null => {
    const telefono = normalizePhoneForWhatsApp(getClienteTelefono(cita))
    if (!telefono) return null
    return `https://wa.me/${telefono}`
  }

  const loadCitas = useCallback(async () => {
    if (!token) return
    try {
      const citasData = await citasApi.listar(token)
      const mappedCitas = (Array.isArray(citasData) ? citasData : []).map((c: any) => ({
        ...c,
        fecha_hora: (function () {
          if (!c.fecha_cita || !c.hora_cita) return null
          const fechaStr = typeof c.fecha_cita === "string" ? c.fecha_cita : new Date(c.fecha_cita).toISOString().split("T")[0]
          const horaStr = c.hora_cita.toString()
          return `${fechaStr}T${horaStr}`
        })(),
        estado: c.estado_id === 1 ? "pendiente" : c.estado_id === 2 ? "confirmada" : c.estado_id === 3 ? "completada" : "cancelada",
        usuario: c.usuario || { nombre: c.alias || c.nombres_completos || "Cliente sin nombre" },
        descripcion: c.comentario || c.descripcion || "Sin motivo especificado",
        telefono: getClienteTelefono(c) || "No disp.",
        correo: c.correo || c.usuario?.correo || "No disp.",
      }))
      setCitas(
        mappedCitas.sort((a: any, b: any) => {
          const timeA = a.fecha_hora ? new Date(a.fecha_hora).getTime() : 0
          const timeB = b.fecha_hora ? new Date(b.fecha_hora).getTime() : 0
          return timeB - timeA
        })
      )
    } catch (error) {
      console.error("Error loading citas:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las citas.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [token, toast])

  useEffect(() => {
    if (token) loadCitas()
  }, [token, loadCitas])

  const handleEstadoCita = async (id: number, nuevoEstado: number) => {
    if (!token) return
    try {
      await citasApi.cambiarEstado(id, nuevoEstado, token)
      loadCitas()
      toast({ title: "Estado actualizado", description: "La cita ha sido actualizada." })
    } catch (error) {
      toast({ title: "Error", description: "No se pudo actualizar la cita.", variant: "destructive" })
    }
  }

  const handleReschedule = (cita: any) => {
    setSelectedCita(cita)
    setIsRescheduleModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
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
                {citas.map((cita) => {
                  const clienteWhatsappUrl = getClienteWhatsAppUrl(cita)
                  return (
                    <tr key={cita.id} className="border-b border-gray-200/50 hover:bg-gray-100 transition-colors">
                      <td className="p-3 text-gray-900 font-medium">
                        <div>{cita.usuario?.nombre || "N/A"}</div>
                        <div className="text-xs text-gray-500">{cita.telefono}</div>
                        <div className="text-xs text-gray-500">{cita.correo}</div>
                      </td>
                      <td className="p-3 text-gray-700 italic">&quot;{cita.descripcion}&quot;</td>
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
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!clienteWhatsappUrl}
                            onClick={() => {
                              if (!clienteWhatsappUrl) return
                              window.open(clienteWhatsappUrl, "_blank", "noopener,noreferrer")
                            }}
                            className="bg-emerald-600/10 border-emerald-600/50 text-emerald-500 hover:bg-emerald-600/20 disabled:opacity-50"
                            title={clienteWhatsappUrl ? "WhatsApp cliente" : "Cliente sin teléfono"}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
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
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        cita={selectedCita}
        onSuccess={loadCitas}
      />
    </div>
  )
}
