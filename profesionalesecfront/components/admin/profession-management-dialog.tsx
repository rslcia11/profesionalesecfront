"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { catalogosApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Edit, Loader2, Plus, Settings } from "lucide-react"

type Profesion = { id: number; nombre: string }
type Especialidad = { id: number; nombre: string; profesion_id: number }

type Props = {
  profesiones: Profesion[]
  onRefreshProfesiones: () => Promise<void>
}

export default function ProfessionManagementDialog({ profesiones, onRefreshProfesiones }: Props) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [selectedProfesionId, setSelectedProfesionId] = useState<number | null>(null)
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([])
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(false)

  const [newProfesionNombre, setNewProfesionNombre] = useState("")
  const [editingProfesionId, setEditingProfesionId] = useState<number | null>(null)
  const [editingNombre, setEditingNombre] = useState("")
  const [newEspecialidadNombre, setNewEspecialidadNombre] = useState("")

  const [saving, setSaving] = useState(false)

  const selectedProfesion = useMemo(
    () => profesiones.find((p) => p.id === selectedProfesionId) || null,
    [profesiones, selectedProfesionId],
  )

  useEffect(() => {
    if (!open) return
    if (!selectedProfesionId && profesiones.length > 0) {
      setSelectedProfesionId(profesiones[0].id)
    }
  }, [open, profesiones, selectedProfesionId])

  const loadEspecialidades = async (profesionId: number) => {
    setLoadingEspecialidades(true)
    try {
      const data = await catalogosApi.obtenerEspecialidades(profesionId)
      setEspecialidades(Array.isArray(data) ? data : [])
    } catch {
      toast({
        title: "Error",
        description: "No se pudieron cargar las especialidades.",
        variant: "destructive",
      })
      setEspecialidades([])
    } finally {
      setLoadingEspecialidades(false)
    }
  }

  useEffect(() => {
    if (!open || !selectedProfesionId) return
    loadEspecialidades(selectedProfesionId)
  }, [open, selectedProfesionId])

  const createProfesion = async () => {
    const token = localStorage.getItem("auth_token")
    if (!token) return
    if (!newProfesionNombre.trim()) return

    setSaving(true)
    try {
      await catalogosApi.crearProfesion({ nombre: newProfesionNombre.trim() }, token)
      setNewProfesionNombre("")
      await onRefreshProfesiones()
      toast({ title: "Profesión creada", description: "La profesión fue registrada correctamente." })
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "No se pudo crear la profesión.", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const updateProfesion = async () => {
    const token = localStorage.getItem("auth_token")
    if (!token || !editingProfesionId) return
    if (!editingNombre.trim()) return

    setSaving(true)
    try {
      await catalogosApi.actualizarProfesion(editingProfesionId, { nombre: editingNombre.trim() }, token)
      setEditingProfesionId(null)
      setEditingNombre("")
      await onRefreshProfesiones()
      toast({ title: "Profesión actualizada", description: "Los cambios se guardaron correctamente." })
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "No se pudo actualizar la profesión.", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const createEspecialidad = async () => {
    const token = localStorage.getItem("auth_token")
    if (!token || !selectedProfesionId) return
    if (!newEspecialidadNombre.trim()) return

    setSaving(true)
    try {
      await catalogosApi.crearEspecialidad({ nombre: newEspecialidadNombre.trim(), profesion_id: selectedProfesionId }, token)
      setNewEspecialidadNombre("")
      await loadEspecialidades(selectedProfesionId)
      toast({ title: "Especialidad creada", description: "Especialidad agregada correctamente." })
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "No se pudo crear la especialidad.", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Settings className="h-4 w-4 mr-2" />
          Gestionar profesiones
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white w-[95vw] max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestión de Profesiones y Especialidades</DialogTitle>
          <DialogDescription>
            Crea y edita profesiones, y administra especialidades por cada profesión.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nueva profesión</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Ej. Psicología"
                  value={newProfesionNombre}
                  onChange={(e) => setNewProfesionNombre(e.target.value)}
                />
                <Button onClick={createProfesion} disabled={saving || !newProfesionNombre.trim()}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} <span className="ml-2">Crear</span>
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-3 space-y-2 max-h-[360px] overflow-y-auto">
              <p className="text-sm text-gray-500">Profesiones existentes</p>
              {profesiones.map((p) => (
                <div key={p.id} className="rounded-md border p-2">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      className={`text-left text-sm flex-1 ${selectedProfesionId === p.id ? "font-semibold text-blue-700" : "text-gray-800"}`}
                      onClick={() => setSelectedProfesionId(p.id)}
                    >
                      {p.nombre}
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingProfesionId(p.id)
                        setEditingNombre(p.nombre)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  {editingProfesionId === p.id && (
                    <div className="mt-2 flex flex-col sm:flex-row gap-2">
                      <Input value={editingNombre} onChange={(e) => setEditingNombre(e.target.value)} />
                      <Button size="sm" onClick={updateProfesion} disabled={saving || !editingNombre.trim()}>Guardar</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="font-medium">Especialidades</p>
              <p className="text-sm text-gray-500">
                {selectedProfesion ? `Profesión seleccionada: ${selectedProfesion.nombre}` : "Selecciona una profesión"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Nueva especialidad</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Ej. Psicología Clínica"
                  value={newEspecialidadNombre}
                  onChange={(e) => setNewEspecialidadNombre(e.target.value)}
                  disabled={!selectedProfesionId}
                />
                <Button onClick={createEspecialidad} disabled={saving || !selectedProfesionId || !newEspecialidadNombre.trim()}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} <span className="ml-2">Agregar</span>
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-3 min-h-[220px] max-h-[360px] overflow-y-auto">
              {loadingEspecialidades ? (
                <div className="text-sm text-gray-500 flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Cargando...</div>
              ) : especialidades.length === 0 ? (
                <p className="text-sm text-gray-500">No hay especialidades registradas para esta profesión.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {especialidades.map((e) => (
                    <Badge key={e.id} variant="secondary">{e.nombre}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
