"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { usuarioApi, profesionalApi, authApi, multimediaApi } from "@/lib/api"
import { useProfesional } from "@/context/profesional-context"
import { PROFILE_IMAGE_ACCEPTED_TYPES, PROFILE_IMAGE_MAX_SIZE_BYTES, PROFILE_IMAGE_MAX_SIZE_MB } from "@/constants/profile-upload"

export default function ConfiguracionPage() {
  const { user, perfil, token, loadData, loading } = useProfesional()
  const { toast } = useToast()

  const [perfilForm, setPerfilForm] = useState({
    nombre: "",
    telefono: "",
    foto_url: "",
  })
  const [perfilProfesionalForm, setPerfilProfesionalForm] = useState({
    descripcion: "",
    tarifa: "",
    permitir_reagendar: true,
  })
  const [passwordForm, setPasswordForm] = useState({
    contrasena_actual: "",
    nueva_contrasena: "",
    confirmar_nueva: "",
  })
  const [savingPersonal, setSavingPersonal] = useState(false)
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false)
  const [savingPerfilProfesional, setSavingPerfilProfesional] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string>("")
  const [profileImageError, setProfileImageError] = useState<string>("")

  useEffect(() => {
    setPerfilForm({
      nombre: user?.nombre || "",
      telefono: user?.telefono || "",
      foto_url: user?.foto_url || "",
    })
  }, [user])

  useEffect(() => {
    if (!profileImageFile) return
    const objectUrl = URL.createObjectURL(profileImageFile)
    setProfileImagePreview(objectUrl)
    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [profileImageFile])

  useEffect(() => {
    setPerfilProfesionalForm({
      descripcion: perfil?.descripcion || "",
      tarifa: perfil?.tarifa != null ? String(perfil.tarifa) : "",
      permitir_reagendar: perfil?.permitir_reagendar ?? true,
    })
  }, [perfil])

  const handleGuardarDatosPersonales = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    try {
      setSavingPersonal(true)
      setProfileImageError("")

      let fotoUrl = perfilForm.foto_url.trim()

      if (profileImageFile) {
        setUploadingProfileImage(true)
        const uploaded = await multimediaApi.subirFotoPerfil(profileImageFile, token)
        const uploadedUrl = uploaded?.url

        if (!uploadedUrl) {
          throw new Error("No se pudo obtener la URL de la imagen subida")
        }

        fotoUrl = uploadedUrl
      }

      await usuarioApi.actualizarPerfil(
        {
          nombre: perfilForm.nombre.trim(),
          telefono: perfilForm.telefono.trim(),
          foto_url: fotoUrl,
        },
        token,
      )

      setProfileImageFile(null)
      setProfileImagePreview("")

      toast({ title: "Datos personales actualizados" })
      await loadData()
    } catch (error: any) {
      const message = error.message || "No se pudo actualizar"
      setProfileImageError(message)
      toast({ title: "Error", description: message, variant: "destructive" })
    } finally {
      setUploadingProfileImage(false)
      setSavingPersonal(false)
    }
  }

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setProfileImageError("")

    if (!file) {
      setProfileImageFile(null)
      setProfileImagePreview("")
      return
    }

    if (!PROFILE_IMAGE_ACCEPTED_TYPES.includes(file.type)) {
      setProfileImageFile(null)
      setProfileImagePreview("")
      setProfileImageError("Formato inválido. Usa JPG, PNG o WEBP.")
      return
    }

    if (file.size > PROFILE_IMAGE_MAX_SIZE_BYTES) {
      setProfileImageFile(null)
      setProfileImagePreview("")
      setProfileImageError(`La imagen supera el límite de ${PROFILE_IMAGE_MAX_SIZE_MB}MB.`)
      return
    }

    setProfileImageFile(file)
  }

  const handleGuardarPerfilProfesional = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !perfil?.id) return

    const tarifaNormalizada = perfilProfesionalForm.tarifa.trim()
    const tarifaNumero = tarifaNormalizada === "" ? undefined : Number(tarifaNormalizada)
    const tarifa = Number.isFinite(tarifaNumero) ? tarifaNumero : undefined

    try {
      setSavingPerfilProfesional(true)
      await profesionalApi.actualizarPerfil(
        {
          id: perfil.id,
          descripcion: perfilProfesionalForm.descripcion,
          tarifa,
          permitir_reagendar: perfilProfesionalForm.permitir_reagendar,
        },
        token,
      )
      toast({ title: "Perfil profesional actualizado" })
      await loadData()
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "No se pudo actualizar", variant: "destructive" })
    } finally {
      setSavingPerfilProfesional(false)
    }
  }

  const handleCambiarContrasena = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    if (passwordForm.nueva_contrasena !== passwordForm.confirmar_nueva) {
      toast({ title: "Error", description: "Las contraseñas no coinciden", variant: "destructive" })
      return
    }

    try {
      setSavingPassword(true)
      await authApi.cambiarContrasena(token, {
        contrasena_actual: passwordForm.contrasena_actual,
        nueva_contrasena: passwordForm.nueva_contrasena,
      })
      setPasswordForm({ contrasena_actual: "", nueva_contrasena: "", confirmar_nueva: "" })
      toast({ title: "Contraseña actualizada correctamente" })
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "No se pudo cambiar la contraseña", variant: "destructive" })
    } finally {
      setSavingPassword(false)
    }
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
          <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-blue-500" /> Datos personales</CardTitle>
          <CardDescription>Edita solo tu información básica de cuenta.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGuardarDatosPersonales} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" value={perfilForm.nombre} onChange={(e) => setPerfilForm((prev) => ({ ...prev, nombre: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" value={perfilForm.telefono} onChange={(e) => setPerfilForm((prev) => ({ ...prev, telefono: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="foto">Foto de perfil</Label>
              <div className="mt-2 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={profileImagePreview || perfilForm.foto_url || "/logo-icono.png"}
                    alt="Vista previa foto de perfil"
                    className="h-16 w-16 rounded-full object-cover border"
                  />
                  <div className="text-sm text-muted-foreground">
                    <p>Sube una nueva imagen (JPG, PNG o WEBP).</p>
                    <p>Tamaño máximo: {PROFILE_IMAGE_MAX_SIZE_MB}MB.</p>
                  </div>
                </div>
                <Input id="foto" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleProfileImageChange} />
                {profileImageError ? <p className="text-sm text-red-600">{profileImageError}</p> : null}
              </div>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={savingPersonal || uploadingProfileImage}>
                {uploadingProfileImage ? "Subiendo imagen..." : savingPersonal ? "Guardando..." : "Guardar datos personales"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Perfil profesional activo</CardTitle>
          <CardDescription>Edita descripción, tarifa y reagendamiento del perfil seleccionado.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGuardarPerfilProfesional} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <textarea id="descripcion" className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={perfilProfesionalForm.descripcion} onChange={(e) => setPerfilProfesionalForm((prev) => ({ ...prev, descripcion: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="tarifa">Tarifa</Label>
              <Input id="tarifa" type="number" min="0" step="0.01" value={perfilProfesionalForm.tarifa} onChange={(e) => setPerfilProfesionalForm((prev) => ({ ...prev, tarifa: e.target.value }))} />
            </div>
            <div className="flex items-end gap-2">
              <input id="permitir_reagendar" type="checkbox" checked={perfilProfesionalForm.permitir_reagendar} onChange={(e) => setPerfilProfesionalForm((prev) => ({ ...prev, permitir_reagendar: e.target.checked }))} />
              <Label htmlFor="permitir_reagendar">Permitir reagendamiento</Label>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={savingPerfilProfesional || !perfil?.id}>{savingPerfilProfesional ? "Guardando..." : "Guardar perfil profesional"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Cambiar contraseña</CardTitle>
          <CardDescription>Debes ingresar tu contraseña actual.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCambiarContrasena} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="actual">Contraseña actual</Label>
              <Input id="actual" type="password" value={passwordForm.contrasena_actual} onChange={(e) => setPasswordForm((prev) => ({ ...prev, contrasena_actual: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="nueva">Nueva contraseña</Label>
              <Input id="nueva" type="password" value={passwordForm.nueva_contrasena} onChange={(e) => setPasswordForm((prev) => ({ ...prev, nueva_contrasena: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="confirmar">Confirmar nueva contraseña</Label>
              <Input id="confirmar" type="password" value={passwordForm.confirmar_nueva} onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmar_nueva: e.target.value }))} required />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={savingPassword}>{savingPassword ? "Actualizando..." : "Actualizar contraseña"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
