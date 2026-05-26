"use client"

import { useProfesional } from "@/context/profesional-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, TrendingUp, Loader2, Plus } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { citasApi } from "@/lib/api"

export default function ProfesionalDashboardPage() {
  const { user, perfil, perfiles, token, loading } = useProfesional()
  const [citas, setCitas] = useState<any[]>([])
  const [citasLoading, setCitasLoading] = useState(true)

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

  const loadCitas = useCallback(async () => {
    if (!token) return
    try {
      setCitasLoading(true)
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
      setCitas(mappedCitas)
    } catch (error) {
      console.error("Error loading citas:", error)
    } finally {
      setCitasLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) loadCitas()
  }, [token, loadCitas])

  const estadisticas = {
    citasPendientes: citas.filter((c) => c.estado === "pendiente" || c.estado_id === 1).length,
    citasConfirmadas: citas.filter((c) => c.estado === "confirmada" || c.estado_id === 2).length,
    citasCompletadas: citas.filter((c) => c.estado === "completada" || c.estado_id === 3).length,
  }

  if (loading || citasLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-blue-600">
              Dashboard Profesional
            </h1>
            <p className="text-gray-600 text-lg">
              Hola, <span className="font-semibold text-gray-800">{user?.nombre || "Profesional"}</span>
            </p>
          </div>

          <Button
            className="bg-blue-600 hover:bg-blue-700 gap-2 w-fit"
            onClick={() => window.location.href = "/dashboard/profesional/crear-perfil"}
          >
            <Plus className="h-4 w-4" />
            Crear Nuevo Perfil
          </Button>
        </div>
      </div>

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
    </div>
  )
}
