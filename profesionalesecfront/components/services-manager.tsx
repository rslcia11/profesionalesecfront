"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Edit, Trash2, Briefcase, Loader2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { serviciosApi } from "@/lib/api"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Servicio {
    servicio_id: number
    descripcion: string
}

interface ServicesManagerProps {
    perfilId: number
}

export default function ServicesManager({ perfilId }: ServicesManagerProps) {
    const [servicios, setServicios] = useState<Servicio[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingService, setEditingService] = useState<Servicio | null>(null)
    const [formData, setFormData] = useState({ descripcion: "" })
    const [actionLoading, setActionLoading] = useState(false)
    const [serviceToDelete, setServiceToDelete] = useState<Servicio | null>(null)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const { toast } = useToast()

    const loadServicios = useCallback(async () => {
        const token = localStorage.getItem("auth_token")
        if (!token || !perfilId) return

        try {
            setLoading(true)
            const data = await serviciosApi.listarMios(perfilId, token)
            setServicios(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("Error loading services:", error)
            toast({
                title: "Error",
                description: "No se pudieron cargar tus servicios.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }, [toast])

    useEffect(() => {
        loadServicios()
    }, [loadServicios])

    const handleSave = async () => {
        if (!formData.descripcion.trim()) {
            toast({ title: "Campo requerido", description: "La descripción del servicio no puede estar vacía.", variant: "destructive" })
            return
        }

        const token = localStorage.getItem("auth_token")
        if (!token) return

        try {
            setActionLoading(true)
            if (editingService) {
                await serviciosApi.actualizar(editingService.servicio_id, formData, token)
                toast({ title: "Servicio actualizado", description: "Tu servicio ha sido actualizado." })
            } else {
                await serviciosApi.crear({ ...formData, perfilId }, token)
                toast({ title: "Servicio creado", description: "Nuevo servicio agregado a tu perfil." })
            }
            setIsDialogOpen(false)
            setEditingService(null)
            setFormData({ descripcion: "" })
            loadServicios()
        } catch (error) {
            console.error("Error saving service:", error)
            toast({ title: "Error", description: "No se pudo guardar el servicio.", variant: "destructive" })
        } finally {
            setActionLoading(false)
        }
    }

    const handleDeleteClick = (servicio: Servicio) => {
        setServiceToDelete(servicio)
        setIsDeleteOpen(true)
    }

    const confirmDelete = async () => {
        if (!serviceToDelete) return

        const token = localStorage.getItem("auth_token")
        if (!token) return

        try {
            setActionLoading(true)
            await serviciosApi.eliminar(serviceToDelete.servicio_id, token)
            toast({ title: "Servicio eliminado", description: "El servicio ha sido removido." })
            loadServicios()
            setIsDeleteOpen(false)
            setServiceToDelete(null)
        } catch (error) {
            toast({ title: "Error", description: "No se pudo eliminar el servicio.", variant: "destructive" })
        } finally {
            setActionLoading(false)
        }
    }

    const openEdit = (servicio: Servicio) => {
        setEditingService(servicio)
        setFormData({ descripcion: servicio.descripcion })
        setIsDialogOpen(true)
    }

    const openCreate = () => {
        setEditingService(null)
        setFormData({ descripcion: "" })
        setIsDialogOpen(true)
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100 mb-4">
                <div>
                    <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                        Mis Servicios
                    </CardTitle>
                    <CardDescription className="text-gray-500 mt-1">
                        Gestiona los servicios que ofreces para que aparezcan en tu perfil público.
                    </CardDescription>
                </div>
                <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 shadow-md transition-all hover:scale-105">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Servicio
                </Button>
            </CardHeader>
            <CardContent>
                {servicios.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <div className="bg-blue-50 p-4 rounded-full mb-4">
                            <Briefcase className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-1">Aún no tienes servicios registrados</h3>
                        <p className="text-gray-500 max-w-sm mb-6 text-sm">
                            Agrega los servicios que ofreces para que tus clientes sepan en qué puedes ayudarles.
                        </p>
                        <Button onClick={openCreate} variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                            Crear mi primer servicio
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {servicios.map((servicio) => (
                            <div
                                key={servicio.servicio_id}
                                className="group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all duration-300"
                            >
                                <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                                        <span className="font-medium text-gray-700 truncate group-hover:text-blue-700 transition-colors">
                                            {servicio.descripcion}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => openEdit(servicio)}
                                        className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                                        title="Editar"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleDeleteClick(servicio)}
                                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create/Edit Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingService ? "Editar Servicio" : "Nuevo Servicio"}</DialogTitle>
                            <DialogDescription>
                                Describe el servicio que ofreces de forma clara y concisa.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <Input
                                    id="descripcion"
                                    placeholder="Ej: Asesoría legal en divorcios"
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    maxLength={100}
                                />
                                <div className="text-xs text-right text-gray-400">
                                    {formData.descripcion.length}/100 caracteres
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={actionLoading}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSave} disabled={actionLoading || !formData.descripcion.trim()} className="bg-blue-600 hover:bg-blue-700">
                                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Guardar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-red-600">
                                <Trash2 className="h-5 w-5" />
                                Eliminar Servicio
                            </DialogTitle>
                            <DialogDescription className="pt-2">
                                ¿Estás seguro de que deseas eliminar este servicio? <br />
                                <span className="font-semibold text-gray-900 block mt-1">"{serviceToDelete?.descripcion}"</span>
                                <span className="block mt-2 text-xs text-red-500">Esta acción no se puede deshacer.</span>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={actionLoading}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={confirmDelete}
                                disabled={actionLoading}
                                className="bg-red-600 hover:bg-red-700 text-white border-none"
                            >
                                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sí, eliminar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}
