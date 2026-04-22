"use client"

import { useState, useEffect } from "react"
import { Facebook, Instagram, Linkedin, Music, Youtube, Save, Loader2, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { profesionalApi } from "@/lib/api"

interface SocialMediaManagerProps {
  perfil: any
  onUpdate: () => void
}

export default function SocialMediaManager({ perfil, onUpdate }: SocialMediaManagerProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    facebook_url: perfil?.facebook_url || "",
    instagram_url: perfil?.instagram_url || "",
    tiktok_url: perfil?.tiktok_url || "",
    linkedin_url: perfil?.linkedin_url || "",
    x_url: perfil?.x_url || "",
    yt_url: perfil?.yt_url || "",
  })
  const { toast } = useToast()

  useEffect(() => {
    if (perfil) {
      setFormData({
        facebook_url: perfil.facebook_url || "",
        instagram_url: perfil.instagram_url || "",
        tiktok_url: perfil.tiktok_url || "",
        linkedin_url: perfil.linkedin_url || "",
        x_url: perfil.x_url || "",
        yt_url: perfil.yt_url || "",
      })
    }
  }, [perfil])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("auth_token")
    if (!token || !perfil?.id) return

    try {
      setLoading(true)
      await profesionalApi.actualizarPerfil(
        {
          id: perfil.id,
          ...formData,
        },
        token
      )

      toast({
        title: "Perfil actualizado",
        description: "Tus redes sociales han sido guardadas correctamente.",
      })
      onUpdate()
    } catch (error: any) {
      console.error("Error updating social media:", error)
      toast({
        title: "Error al actualizar",
        description: error.message || "No se pudieron guardar las redes sociales.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-100 mb-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800 tracking-tight">
              <div className="p-2 bg-pink-50 rounded-lg">
                <Globe className="h-6 w-6 text-pink-600" />
              </div>
              Redes Sociales
            </CardTitle>
            <CardDescription className="text-gray-500">
              Mantén tus enlaces actualizados para que tus clientes puedan conocer más de tu trabajo.
            </CardDescription>
          </div>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-100 transition-all hover:scale-105"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar Cambios
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Facebook className="h-4 w-4 text-blue-600" /> Facebook
            </label>
            <Input
              name="facebook_url"
              value={formData.facebook_url}
              onChange={handleInputChange}
              placeholder="https://facebook.com/tu-usuario"
              className="bg-gray-50/50 border-gray-200 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Instagram className="h-4 w-4 text-pink-600" /> Instagram
            </label>
            <Input
              name="instagram_url"
              value={formData.instagram_url}
              onChange={handleInputChange}
              placeholder="https://instagram.com/tu-usuario"
              className="bg-gray-50/50 border-gray-200 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="h-4 w-4 flex items-center justify-center font-bold text-[10px] border border-gray-900 rounded-sm leading-none">X</div> Twitter / X
            </label>
            <Input
              name="x_url"
              value={formData.x_url}
              onChange={handleInputChange}
              placeholder="https://x.com/tu-usuario"
              className="bg-gray-50/50 border-gray-200 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Linkedin className="h-4 w-4 text-blue-700" /> LinkedIn
            </label>
            <Input
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/tu-usuario"
              className="bg-gray-50/50 border-gray-200 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Music className="h-4 w-4 text-gray-900" /> TikTok
            </label>
            <Input
              name="tiktok_url"
              value={formData.tiktok_url}
              onChange={handleInputChange}
              placeholder="https://tiktok.com/@tu-usuario"
              className="bg-gray-50/50 border-gray-200 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Youtube className="h-4 w-4 text-red-600" /> YouTube
            </label>
            <Input
              name="yt_url"
              value={formData.yt_url}
              onChange={handleInputChange}
              placeholder="https://youtube.com/@tu-canal"
              className="bg-gray-50/50 border-gray-200 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
            />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
