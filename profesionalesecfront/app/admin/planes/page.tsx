"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAnimatedConfirm, AnimatedConfirm } from "@/components/shared/animated-confirm"
import { adminApi } from "@/lib/api"
import { cn } from "@/lib/utils"
import { DollarSign, FileText, Clock, Plus, Edit, Trash2 } from "lucide-react"

type Plan = {
  id: number
  nombre: string
  descripcion: string
  precio_base: number
  tipo: "suscripcion" | "one_time"
  duracion_dias: number | null
  activo: boolean
}

export default function AdminPlanesPage() {
  const { toast } = useToast()
  const { confirm: animatedConfirm, isOpen: isConfirmOpen, options: confirmOptions, handleConfirm: onConfirm, handleCancel: onCancel } = useAnimatedConfirm()

  const [planes, setPlanes] = useState<Plan[]>([])
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [planForm, setPlanForm] = useState({
    nombre: "",
    descripcion: "",
    precio_base: 0,
    tipo: "suscripcion" as const,
    duracion_dias: 30,
    activo: true,
  })

  const resetPlanForm = () => {
    setPlanForm({
      nombre: "",
      descripcion: "",
      precio_base: 0,
      tipo: "suscripcion",
      duracion_dias: 30,
      activo: true,
    })
  }

  const loadData = async () => {
    const token = localStorage.getItem("auth_token")
    if (!token) return

    try {
      const stats = await adminApi.getStats(token)
      setPlanes(stats.planes)
    } catch (error) {
      console.error("Error loading plans:", error)
      toast({ title: "Error", description: "No se pudieron cargar los planes.", variant: "destructive" })
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSavePlan = async () => {
    if (!planForm.nombre) return

    const token = localStorage.getItem("auth_token")
    if (!token) return

    try {
      if (editingItem) {
        await adminApi.updatePlan(editingItem.id, planForm, token)
        setPlanes(planes.map((p) => (p.id === editingItem.id ? { ...planForm, id: editingItem.id } : p)))
        toast({ title: "Plan Actualizado" })
      } else {
        const res = await adminApi.createPlan(planForm, token)
        setPlanes([...planes, res])
        toast({ title: "Plan Creado" })
      }
      setIsPlanDialogOpen(false)
      setEditingItem(null)
      resetPlanForm()
    } catch {
      toast({ title: "Error", description: "Error al guardar plan", variant: "destructive" })
    }
  }

  const handleEditPlan = (plan: Plan) => {
    setEditingItem(plan)
    setPlanForm(plan as any)
    setIsPlanDialogOpen(true)
  }

  const handleDeletePlan = async (id: number) => {
    const ok = await animatedConfirm({
      title: "Eliminar Plan",
      message: "¿Estás seguro de eliminar este plan de suscripción?",
      confirmText: "Eliminar",
      variant: "danger"
    })
    if (!ok) return
    const token = localStorage.getItem("auth_token")
    if (!token) return

    try {
      await adminApi.deletePlan(id, token)
      setPlanes(planes.filter((p) => p.id !== id))
      toast({ title: "Eliminado", description: "Plan eliminado" })
    } catch {
      toast({ title: "Error", variant: "destructive" })
    }
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Gestión de Planes de Pago</h2>
          <p className="text-sm text-gray-500">Crea y administra los planes de suscripción y pagos únicos</p>
        </div>
        <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg shadow-amber-200 transition-all duration-300 hover:scale-105"
              onClick={() => {
                setEditingItem(null)
                resetPlanForm()
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-gray-200 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">{editingItem ? "Editar" : "Crear"} Plan de Pago</DialogTitle>
              <DialogDescription className="text-gray-500">
                {editingItem ? "Modifica" : "Completa"} los detalles del plan. Los campos marcados son
                obligatorios.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="plan-nombre" className="text-sm font-medium flex items-center gap-1">
                  Nombre del Plan <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="plan-nombre"
                  placeholder="Ej: Plan Premium"
                  value={planForm.nombre}
                  onChange={(e) => setPlanForm({ ...planForm, nombre: e.target.value })}
                  className="focus:border-amber-500/50 transition-colors"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plan-descripcion" className="text-sm font-medium flex items-center gap-1">
                  Descripción <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="plan-descripcion"
                  placeholder="Describe los beneficios y características del plan..."
                  value={planForm.descripcion}
                  onChange={(e) => setPlanForm({ ...planForm, descripcion: e.target.value })}
                  className="focus:border-amber-500/50 transition-colors min-h-[100px]"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="plan-precio" className="text-sm font-medium">
                    Precio (USD)
                  </Label>
                  <Input
                    id="plan-precio"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={planForm.precio_base || ""}
                    onChange={(e) =>
                      setPlanForm({
                        ...planForm,
                        precio_base: e.target.value === "" ? 0 : Number.parseFloat(e.target.value)
                      })
                    }
                    className="focus:border-amber-500/50 transition-colors"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="plan-tipo" className="text-sm font-medium">
                    Tipo de Plan
                  </Label>
                  <Select
                    value={planForm.tipo}
                    onValueChange={(value: any) => setPlanForm({ ...planForm, tipo: value })}
                  >
                    <SelectTrigger className="focus:border-amber-500/50 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="suscripcion">Suscripción</SelectItem>
                      <SelectItem value="one_time">Pago Único</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {planForm.tipo === "suscripcion" && (
                <div className="grid gap-2">
                  <Label htmlFor="plan-duracion" className="text-sm font-medium">
                    Duración (días)
                  </Label>
                  <Input
                    id="plan-duracion"
                    type="number"
                    min="1"
                    placeholder="30"
                    value={planForm.duracion_dias || ""}
                    onChange={(e) =>
                      setPlanForm({
                        ...planForm,
                        duracion_dias: e.target.value === "" ? 0 : (Number.parseInt(e.target.value) || 0)
                      })
                    }
                    className="focus:border-amber-500/50 transition-colors"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsPlanDialogOpen(false)
                  setEditingItem(null)
                  resetPlanForm()
                }}
                className="hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSavePlan}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 transition-all duration-300"
              >
                {editingItem ? "Actualizar" : "Crear"} Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {planes.map((plan, index) => (
          <Card
            key={plan.id}
            className="bg-white border-gray-200 hover:border-amber-300 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{plan.nombre}</CardTitle>
                  <CardDescription className="text-base">{plan.descripcion}</CardDescription>
                </div>
                <Badge
                  className={cn(
                    "border",
                    plan.activo
                      ? "bg-emerald-500/20 text-emerald-600 border-emerald-500/30"
                      : "bg-gray-200 text-gray-600 border-gray-300",
                  )}
                >
                  {plan.activo ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-amber-600" />
                  <span className="text-gray-500">Precio:</span>
                  <span className="font-semibold">${Number(plan.precio_base).toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-amber-600" />
                  <span className="text-gray-500">Tipo:</span>
                  <span className="font-semibold">
                    {plan.tipo === "suscripcion" ? "Suscripción" : "Pago Único"}
                  </span>
                </div>
                {plan.duracion_dias && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span className="text-gray-500">Duración:</span>
                    <span className="font-semibold">{plan.duracion_dias} días</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleEditPlan(plan)}
                  variant="outline"
                  className="flex-1 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all duration-300 hover:scale-105"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Plan
                </Button>
                <Button
                  onClick={() => handleDeletePlan(plan.id)}
                  variant="destructive"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:scale-105"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AnimatedConfirm
        isOpen={isConfirmOpen}
        options={confirmOptions}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </div>
  )
}