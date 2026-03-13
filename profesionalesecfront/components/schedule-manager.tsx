"use client"

import { useState, useEffect, useCallback } from "react"
import { Save, Clock, Loader2, AlertCircle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { horariosApi } from "@/lib/api"
import ScheduleGrid from "@/components/schedule-grid"

interface ScheduleManagerProps {
  perfilId: number
}

export default function ScheduleManager({ perfilId }: ScheduleManagerProps) {
  const [matrix, setMatrix] = useState<boolean[]>(new Array(168).fill(false))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const loadSchedule = useCallback(async () => {
    const token = localStorage.getItem("auth_token")
    if (!token || !perfilId) return

    try {
      setLoading(true)
      const data = await horariosApi.obtenerPorPerfil(perfilId, token)
      
      // If data is returned, it should have a 'matriz' field
      if (data && data.matriz) {
        setMatrix(data.matriz)
      } else if (Array.isArray(data)) {
        // Handle case where API might return array directly (unlikely based on api.ts but safe)
        setMatrix(data)
      }
    } catch (error) {
      console.error("Error loading schedule:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar tu horario de disponibilidad.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [perfilId, toast])

  useEffect(() => {
    loadSchedule()
  }, [loadSchedule])

  const handleSave = async () => {
    const token = localStorage.getItem("auth_token")
    if (!token || !perfilId) return

    try {
      setSaving(true)
      await horariosApi.actualizar({ perfilId, matriz: matrix }, token)
      toast({
        title: "Horario guardado",
        description: "Tu disponibilidad ha sido actualizada exitosamente.",
      })
    } catch (error: any) {
      console.error("Error saving schedule:", error)
      toast({
        title: "Error al guardar",
        description: error.message || "No se pudo actualizar el horario.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card className="bg-white border-gray-200">
        <CardContent className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-500">Cargando tu horario...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100 mb-6 px-6">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800 tracking-tight">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            Gestión de Horario
          </CardTitle>
          <CardDescription className="text-gray-500 max-w-md">
            Define los días y horas en los que estás disponible para recibir citas. 
            Tus clientes verán estos espacios al agendar.
          </CardDescription>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all hover:scale-105 min-w-[160px]"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Guardar Horario
          </Button>
          <p className="text-[10px] text-gray-400 font-medium">Última actualización: hoy</p>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-8">
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-semibold mb-1">¿Cómo configurar tu horario?</p>
            <p>Haz clic en los bloques de tiempo para marcar tu disponibilidad. Puedes hacer clic en el nombre del día para activar/desactivar todo el día completo.</p>
          </div>
        </div>

        <div className="relative rounded-2xl border border-gray-200 bg-gray-50/30 p-2 sm:p-4">
          <ScheduleGrid 
            matrix={matrix} 
            onChange={setMatrix} 
          />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600/20 border border-blue-600/50" />
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-gray-300" />
              <span>No disponible</span>
            </div>
          </div>
          <p className="italic">El horario se guarda automáticamente para el perfil actual.</p>
        </div>
      </CardContent>
    </Card>
  )
}
