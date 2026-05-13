"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { bankAccountsApi, type BankAccount, type BankAccountPayload } from "@/lib/api"
import { Loader2, Pencil, Plus } from "lucide-react"

interface BankAccountFormState {
  bank_name: string
  account_type: string
  account_number: string
  holder_identifier: string
  holder_name: string
  email: string
}

const EMPTY_FORM: BankAccountFormState = {
  bank_name: "",
  account_type: "",
  account_number: "",
  holder_identifier: "",
  holder_name: "",
  email: "",
}

const REQUIRED_FIELDS: Array<keyof BankAccountFormState> = [
  "bank_name",
  "account_type",
  "account_number",
  "holder_identifier",
  "holder_name",
]

const toPayload = (form: BankAccountFormState): BankAccountPayload => ({
  bank_name: form.bank_name.trim(),
  account_type: form.account_type.trim(),
  account_number: form.account_number.trim(),
  holder_identifier: form.holder_identifier.trim(),
  holder_name: form.holder_name.trim(),
  email: form.email.trim() || null,
})

const toForm = (account: BankAccount): BankAccountFormState => ({
  bank_name: account.bank_name,
  account_type: account.account_type,
  account_number: account.account_number,
  holder_identifier: account.holder_identifier,
  holder_name: account.holder_name,
  email: account.email ?? "",
})

export default function BankAccountsManagement() {
  const { toast } = useToast()
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(null)
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null)
  const [form, setForm] = useState<BankAccountFormState>(EMPTY_FORM)

  const loadAccounts = async () => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const data = await bankAccountsApi.listAdmin(token)
      setAccounts(Array.isArray(data) ? data : [])
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las cuentas bancarias.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAccounts()
  }, [])

  const openCreateDialog = () => {
    setEditingAccount(null)
    setForm(EMPTY_FORM)
    setIsDialogOpen(true)
  }

  const openEditDialog = (account: BankAccount) => {
    setEditingAccount(account)
    setForm(toForm(account))
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingAccount(null)
    setForm(EMPTY_FORM)
  }

  const handleFieldChange = (field: keyof BankAccountFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    const token = localStorage.getItem("auth_token")
    if (!token) return

    const payload = toPayload(form)
    const missingField = REQUIRED_FIELDS.find((field) => !payload[field])

    if (missingField) {
      toast({
        title: "Campos incompletos",
        description: "Completa los campos obligatorios antes de guardar.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      if (editingAccount) {
        const updatedAccount = await bankAccountsApi.update(editingAccount.id, payload, token)
        setAccounts((prev) => prev.map((account) => (account.id === updatedAccount.id ? updatedAccount : account)))
        toast({ title: "Cuenta actualizada" })
      } else {
        const createdAccount = await bankAccountsApi.create(payload, token)
        setAccounts((prev) => [...prev, createdAccount].sort((left, right) => left.id - right.id))
        toast({ title: "Cuenta creada" })
      }

      closeDialog()
    } catch (error) {
      const description = error instanceof Error ? error.message : "No se pudo guardar la cuenta bancaria."
      toast({ title: "Error", description, variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleStatus = async (account: BankAccount) => {
    const token = localStorage.getItem("auth_token")
    if (!token) return

    setStatusUpdatingId(account.id)

    try {
      const updatedAccount = await bankAccountsApi.updateStatus(account.id, !account.is_active, token)
      setAccounts((prev) => prev.map((item) => (item.id === updatedAccount.id ? updatedAccount : item)))
      toast({ title: updatedAccount.is_active ? "Cuenta activada" : "Cuenta desactivada" })
    } catch (error) {
      const description = error instanceof Error ? error.message : "No se pudo actualizar el estado."
      toast({ title: "Error", description, variant: "destructive" })
    } finally {
      setStatusUpdatingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Gestión de Bancos</h2>
          <p className="text-sm text-gray-500">Administra las cuentas visibles para el pago del plan priority.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Nueva cuenta
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-white border-gray-200 max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAccount ? "Editar cuenta bancaria" : "Nueva cuenta bancaria"}</DialogTitle>
              <DialogDescription>
                Completa los datos que verán los usuarios en el paso final del plan priority.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="bank_name">Banco</Label>
                <Input id="bank_name" value={form.bank_name} onChange={(event) => handleFieldChange("bank_name", event.target.value)} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="account_type">Tipo de cuenta</Label>
                <Input id="account_type" value={form.account_type} onChange={(event) => handleFieldChange("account_type", event.target.value)} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="account_number">Número Cuenta</Label>
                <Input id="account_number" value={form.account_number} onChange={(event) => handleFieldChange("account_number", event.target.value)} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="holder_identifier">RUC/Identificación</Label>
                <Input id="holder_identifier" value={form.holder_identifier} onChange={(event) => handleFieldChange("holder_identifier", event.target.value)} />
              </div>

              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="holder_name">Titular</Label>
                <Input id="holder_name" value={form.holder_name} onChange={(event) => handleFieldChange("holder_name", event.target.value)} />
              </div>

              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="email">Correo</Label>
                <Input id="email" type="email" value={form.email} onChange={(event) => handleFieldChange("email", event.target.value)} placeholder="Opcional" />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
              <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editingAccount ? "Guardar cambios" : "Crear cuenta"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white border-gray-200 overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando cuentas bancarias...
            </div>
          ) : accounts.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">No hay cuentas bancarias registradas.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Banco</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Número</TableHead>
                    <TableHead>Titular</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.bank_name}</TableCell>
                      <TableCell>{account.account_type}</TableCell>
                      <TableCell>{account.account_number}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div>{account.holder_name}</div>
                          <div className="text-xs text-gray-500">{account.holder_identifier}</div>
                        </div>
                      </TableCell>
                      <TableCell>{account.email || "—"}</TableCell>
                      <TableCell>
                        <Badge className={account.is_active ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-600 border-gray-200"}>
                          {account.is_active ? "Activa" : "Inactiva"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(account)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </Button>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Visible</span>
                            <Switch
                              checked={account.is_active}
                              disabled={statusUpdatingId === account.id}
                              onCheckedChange={() => handleToggleStatus(account)}
                            />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
