"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { conveniosApi } from "@/lib/api/convenios"
import { type Convenio, type CrearConvenioData, type ActualizarConvenioData } from "@/lib/validators/convenio"
import { ConvenioTable } from "./components/ConvenioTable"
import { ConvenioModal } from "./components/ConvenioModal"

export default function AdminConveniosPage() {
  const { toast } = useToast()

  const [convenios, setConvenios] = useState<Convenio[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingConvenio, setEditingConvenio] = useState<Convenio | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(20)

  const [estadoFilter, setEstadoFilter] = useState("todos")
  const [searchQuery, setSearchQuery] = useState("")

  const loadConvenios = useCallback(async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) return

      const filtros: Parameters<typeof conveniosApi.listarAdmin>[0] = {
        page,
        limit,
        estado: estadoFilter !== "todos" ? estadoFilter : undefined,
        search: searchQuery || undefined,
        incluir_eliminados: true,
      }

      const result = await conveniosApi.listarAdmin(filtros)

      setConvenios(result.data || [])
      setTotal(result.meta?.total || 0)
      setTotalPages(Math.ceil((result.meta?.total || 0) / limit))
    } catch (error: any) {
      console.error("Error loading convenios:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar los convenios.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [page, limit, estadoFilter, searchQuery, toast])

  useEffect(() => {
    loadConvenios()
  }, [loadConvenios])

  const handleCreate = () => {
    setEditingConvenio(null)
    setIsModalOpen(true)
  }

  const handleEdit = (convenio: Convenio) => {
    setEditingConvenio(convenio)
    setIsModalOpen(true)
  }

  const handleSubmit = async (data: CrearConvenioData | ActualizarConvenioData) => {
    setIsSubmitting(true)
    try {
      if (editingConvenio) {
        await conveniosApi.actualizar(editingConvenio.id, data)
        toast({
          title: "Convenio Actualizado",
          description: "Los cambios han sido guardados exitosamente.",
        })
      } else {
        await conveniosApi.crear(data as CrearConvenioData)
        toast({
          title: "Convenio Creado",
          description: "El nuevo convenio ha sido creado exitosamente.",
        })
      }
      loadConvenios()
    } catch (error: any) {
      console.error("Error saving convenio:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar el convenio.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (convenio: Convenio) => {
    try {
      await conveniosApi.eliminar(convenio.id)
      toast({
        title: "Convenio Eliminado",
        description: "El convenio ha sido marcado como eliminado.",
      })
      loadConvenios()
    } catch (error: any) {
      console.error("Error deleting convenio:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el convenio.",
        variant: "destructive",
      })
    }
  }

  const handleRestore = async (convenio: Convenio) => {
    try {
      await conveniosApi.restaurar(convenio.id)
      toast({
        title: "Convenio Restaurado",
        description: "El convenio ha sido restaurado exitosamente.",
      })
      loadConvenios()
    } catch (error: any) {
      console.error("Error restoring convenio:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo restaurar el convenio.",
        variant: "destructive",
      })
    }
  }

  const handleChangeState = async (convenio: Convenio, newState: "borrador" | "publicada" | "archivada") => {
    try {
      await conveniosApi.cambiarEstado(convenio.id, newState)
      toast({
        title: "Estado Actualizado",
        description: `El convenio ahora está en estado "${newState}".`,
      })
      loadConvenios()
    } catch (error: any) {
      console.error("Error changing estado:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo cambiar el estado.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
            <svg
              className="h-7 w-7 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Gestión de Convenios
            </h1>
            <p className="text-muted-foreground">
              Administra los convenios, descuentos y beneficios para los profesionales
            </p>
          </div>
        </div>
      </div>

      <ConvenioTable
        convenios={convenios}
        isLoading={isLoading}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRestore={handleRestore}
        onChangeState={handleChangeState}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        estadoFilter={estadoFilter}
        onEstadoFilterChange={setEstadoFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ConvenioModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        convenio={editingConvenio}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}