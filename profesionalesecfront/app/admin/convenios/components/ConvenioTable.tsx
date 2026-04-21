"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  RotateCcw,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatUrl } from "@/lib/utils"
import { type Convenio } from "@/lib/validators/convenio"

interface ConvenioTableProps {
  convenios: Convenio[]
  isLoading: boolean
  onCreate: () => void
  onEdit: (convenio: Convenio) => void
  onDelete: (convenio: Convenio) => void
  onRestore: (convenio: Convenio) => void
  onChangeState: (convenio: Convenio, newState: "borrador" | "publicada" | "archivada") => void
  // Pagination
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
  // Filters
  estadoFilter: string
  onEstadoFilterChange: (estado: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

const ESTADO_COLORS = {
  borrador: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  publicada: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  archivada: "bg-gray-500/20 text-gray-400 border-gray-500/30",
}

const ESTADO_LABELS = {
  borrador: "Borrador",
  publicada: "Publicada",
  archivada: "Archivada",
}

export function ConvenioTable({
  convenios,
  isLoading,
  onCreate,
  onEdit,
  onDelete,
  onRestore,
  onChangeState,
  page,
  totalPages,
  total,
  onPageChange,
  estadoFilter,
  onEstadoFilterChange,
  searchQuery,
  onSearchChange,
}: ConvenioTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<Convenio | null>(null)
  const [restoreConfirm, setRestoreConfirm] = useState<Convenio | null>(null)
  const [stateChangeConfirm, setStateChangeConfirm] = useState<{ convenio: Convenio; newState: "borrador" | "publicada" | "archivada" } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDelete = async () => {
    if (!deleteConfirm) return
    setIsProcessing(true)
    try {
      await onDelete(deleteConfirm)
    } finally {
      setIsProcessing(false)
      setDeleteConfirm(null)
    }
  }

  const handleRestore = async () => {
    if (!restoreConfirm) return
    setIsProcessing(true)
    try {
      await onRestore(restoreConfirm)
    } finally {
      setIsProcessing(false)
      setRestoreConfirm(null)
    }
  }

  const handleStateChange = async () => {
    if (!stateChangeConfirm) return
    setIsProcessing(true)
    try {
      await onChangeState(stateChangeConfirm.convenio, stateChangeConfirm.newState)
    } finally {
      setIsProcessing(false)
      setStateChangeConfirm(null)
    }
  }

  return (
    <>
      <Card className="bg-white border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl font-bold">Gestión de Convenios</CardTitle>
            <Button
              onClick={onCreate}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Convenio
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={estadoFilter} onValueChange={onEstadoFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="borrador">Borrador</SelectItem>
                <SelectItem value="publicada">Publicada</SelectItem>
                <SelectItem value="archivada">Archivada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : convenios.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium">No hay convenios</p>
              <p className="text-sm">Crea tu primer convenio para comenzar</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200 hover:bg-gray-50">
                      <TableHead className="text-gray-600">Logo</TableHead>
                      <TableHead className="text-gray-600">Título</TableHead>
                      <TableHead className="text-gray-600">Descripción</TableHead>
                      <TableHead className="text-gray-600">Beneficios</TableHead>
                      <TableHead className="text-gray-600">Estado</TableHead>
                      <TableHead className="text-gray-600 text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {convenios.map((convenio) => (
                      <TableRow
                        key={convenio.id}
                        className={cn(
                          "border-gray-200 hover:bg-gray-50 transition-colors",
                          convenio.eliminado && "opacity-60 bg-red-50/30"
                        )}
                      >
                        {/* Logo */}
                        <TableCell>
                          {convenio.logoUrl ? (
                            <img
                              src={formatUrl(convenio.logoUrl) || convenio.logoUrl}
                              alt={convenio.titulo}
                              className="w-12 h-12 rounded-full object-cover border border-gray-200"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).style.display = "none"
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                              <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>

                        {/* Título */}
                        <TableCell className="font-medium max-w-[200px]">
                          <div className="truncate">{convenio.titulo}</div>
                          {convenio.categorias && (
                            <div className="text-xs text-muted-foreground truncate">
                              {convenio.categorias}
                            </div>
                          )}
                        </TableCell>

                        {/* Descripción */}
                        <TableCell className="max-w-[250px]">
                          <div className="line-clamp-2 text-sm text-muted-foreground">
                            {convenio.descripcion}
                          </div>
                        </TableCell>

                        {/* Beneficios count */}
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {convenio.beneficios?.length || 0} beneficios
                          </Badge>
                        </TableCell>

                        {/* Estado */}
                        <TableCell>
                          <Badge
                            className={cn(
                              "border",
                              ESTADO_COLORS[convenio.estado as keyof typeof ESTADO_COLORS] ||
                                ESTADO_COLORS.borrador
                            )}
                          >
                            {ESTADO_LABELS[convenio.estado as keyof typeof ESTADO_LABELS] ||
                              convenio.estado}
                          </Badge>
                          {convenio.eliminado && (
                            <Badge variant="destructive" className="ml-1 text-xs">
                              Eliminado
                            </Badge>
                          )}
                        </TableCell>

                        {/* Acciones */}
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {convenio.link && (
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="hover:bg-blue-500/20 hover:text-blue-600"
                                title="Ver link"
                              >
                                <a
                                  href={convenio.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            )}

                            {convenio.eliminado ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setRestoreConfirm(convenio)}
                                  className="hover:bg-emerald-500/20 hover:text-emerald-600"
                                  title="Restaurar"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeleteConfirm(convenio)}
                                  className="hover:bg-red-500/20 hover:text-red-600"
                                  title="Eliminar permanentemente"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                {/* State change dropdown */}
                                <Select
                                  value={convenio.estado}
                                  onValueChange={(newState: "borrador" | "publicada" | "archivada") =>
                                    setStateChangeConfirm({ convenio, newState })
                                  }
                                >
                                  <SelectTrigger className="h-8 w-[130px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="borrador">Borrador</SelectItem>
                                    <SelectItem value="publicada">Publicada</SelectItem>
                                    <SelectItem value="archivada">Archivada</SelectItem>
                                  </SelectContent>
                                </Select>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onEdit(convenio)}
                                  className="hover:bg-blue-500/20 hover:text-blue-600"
                                  title="Editar"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeleteConfirm(convenio)}
                                  className="hover:bg-red-500/20 hover:text-red-600"
                                  title="Eliminar"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <div className="text-sm text-muted-foreground">
                    Página {page} de {totalPages} ({total} registros)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(page - 1)}
                      disabled={page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(page + 1)}
                      disabled={page >= totalPages}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar convenio?</DialogTitle>
            <DialogDescription>
              {deleteConfirm?.eliminado
                ? `Esta acción eliminará permanentemente "${deleteConfirm?.titulo}". Esta acción no se puede deshacer.`
                : `El convenio "${deleteConfirm?.titulo}" será marcado como eliminado. Podrás restaurarlo más tarde.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isProcessing}>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog open={!!restoreConfirm} onOpenChange={() => setRestoreConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Restaurar convenio?</DialogTitle>
            <DialogDescription>
              El convenio "{restoreConfirm?.titulo}" será restaurado y vuelto a marcar como borrador.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestoreConfirm(null)}>
              Cancelar
            </Button>
            <Button onClick={handleRestore} disabled={isProcessing}>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Restaurar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* State Change Confirmation Dialog */}
      <Dialog
        open={!!stateChangeConfirm}
        onOpenChange={() => setStateChangeConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar estado</DialogTitle>
            <DialogDescription>
              {stateChangeConfirm && (
                <>
                  El convenio "{stateChangeConfirm.convenio.titulo}" cambiará de "
                  {ESTADO_LABELS[stateChangeConfirm.convenio.estado as keyof typeof ESTADO_LABELS]}
                  " a "{ESTADO_LABELS[stateChangeConfirm.newState]}".
                  {stateChangeConfirm.newState === "publicada" &&
                    " Estará visible públicamente."}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStateChangeConfirm(null)}>
              Cancelar
            </Button>
            <Button onClick={handleStateChange} disabled={isProcessing}>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
