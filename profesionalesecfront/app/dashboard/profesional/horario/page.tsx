"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import ScheduleManager from "@/components/schedule-manager"
import { useProfesional } from "@/context/profesional-context"

export default function HorarioPage() {
  const { perfil, loading } = useProfesional()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!perfil) {
    return (
      <Card className="bg-white border-gray-200">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-500">Cargando perfil profesional...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <ScheduleManager perfilId={perfil.id} />
    </div>
  )
}
