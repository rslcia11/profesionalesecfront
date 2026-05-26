"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, FileText, Edit, Trash2, Plus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { articulosApi, type Articulo } from "@/lib/api"
import ArticleFormModal from "@/components/article-form-modal"
import { useProfesional } from "@/context/profesional-context"

export default function ArticulosPage() {
  const { token } = useProfesional()
  const { toast } = useToast()
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [loading, setLoading] = useState(true)
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Articulo | null>(null)

  const loadArticulos = useCallback(async () => {
    if (!token) return
    try {
      const data = await articulosApi.listarMios(token)
      setArticulos(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error loading articles:", error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) loadArticulos()
  }, [token, loadArticulos])

  const handleCreateArticulo = async (data: FormData | { titulo: string; contenido: string; resumen?: string; imagen_url?: string }) => {
    if (!token) return
    await articulosApi.crear(data, token)
    toast({ title: "Artículo enviado", description: "Tu artículo ha sido enviado para revisión." })
    loadArticulos()
  }

  const handleUpdateArticulo = async (data: FormData | { titulo: string; contenido: string; resumen?: string; imagen_url?: string }) => {
    if (!token || !editingArticle) return
    await articulosApi.actualizar(editingArticle.id, data, token)
    toast({ title: "Artículo actualizado", description: "Tu artículo ha sido actualizado." })
    setEditingArticle(null)
    loadArticulos()
  }

  const handleDeleteArticulo = async (id: number) => {
    if (!token) return
    if (!confirm("¿Estás seguro de eliminar este artículo?")) return
    try {
      await articulosApi.eliminar(id, token)
      toast({ title: "Artículo eliminado", description: "El artículo ha sido eliminado." })
      loadArticulos()
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar el artículo.", variant: "destructive" })
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Mis Artículos
          </CardTitle>
          <Button
            onClick={() => {
              setEditingArticle(null)
              setIsArticleModalOpen(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Artículo
          </Button>
        </CardHeader>
        <CardContent>
          {articulos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-blue-50 p-4 rounded-full mb-4">
                <FileText className="h-10 w-10 text-blue-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Aún no tienes artículos</h3>
              <p className="text-gray-500 max-w-md mb-4">
                Comparte tu conocimiento con la comunidad. Los artículos serán revisados por un administrador antes de su publicación.
              </p>
              <Button
                onClick={() => {
                  setEditingArticle(null)
                  setIsArticleModalOpen(true)
                }}
                variant="outline"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Crear mi primer artículo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {articulos.map((articulo) => (
                <div
                  key={articulo.id}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">{articulo.titulo}</h4>
                      <Badge
                        variant={articulo.estado === "publicado" ? "default" : articulo.estado === "archivado" ? "secondary" : "secondary"}
                        className={`text-xs shrink-0 ${articulo.estado === "archivado" ? "bg-yellow-500 hover:bg-yellow-600 text-white border-none" : ""}`}
                      >
                        {articulo.estado === "archivado" ? "En revisión" : articulo.estado}
                      </Badge>
                    </div>
                    {articulo.resumen && (
                      <p className="text-sm text-gray-500 line-clamp-2">{articulo.resumen}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {articulo.fecha_publicacion ? new Date(articulo.fecha_publicacion).toLocaleDateString("es-EC") : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingArticle(articulo)
                        setIsArticleModalOpen(true)
                      }}
                      className="gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteArticulo(articulo.id)}
                      className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ArticleFormModal
        open={isArticleModalOpen}
        onOpenChange={setIsArticleModalOpen}
        article={editingArticle}
        showFeaturedImageSection={false}
        onSubmit={editingArticle ? handleUpdateArticulo : handleCreateArticulo}
      />
    </div>
  )
}
