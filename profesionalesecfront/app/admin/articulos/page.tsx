"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import dynamic from "next/dynamic"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAnimatedConfirm, AnimatedConfirm } from "@/components/shared/animated-confirm"
import { articulosApi, type Articulo } from "@/lib/api"
import { formatUrl, cn } from "@/lib/utils"
import ArticleFormModal from "@/components/article-form-modal"
import ArticleReaderDialog from "@/components/articles/article-reader-dialog"
import {
  BookOpen,
  Plus,
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  Users,
  X,
  ArrowRight,
} from "lucide-react"

const ArticlePdfPreview = dynamic(() => import("@/components/articles/article-pdf-preview"), { ssr: false })

function formatArticleDate(dateStr: string) {
  try {
    return format(new Date(dateStr), "d 'de' MMMM 'de' yyyy", { locale: es })
  } catch {
    return dateStr
  }
}

export default function AdminArticulosPage() {
  const { toast } = useToast()
  const { confirm: animatedConfirm, isOpen: isConfirmOpen, options: confirmOptions, handleConfirm: onConfirm, handleCancel: onCancel } = useAnimatedConfirm()

  const [adminArticulos, setAdminArticulos] = useState<Articulo[]>([])
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false)
  const [isArticleDetailsOpen, setIsArticleDetailsOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Articulo | null>(null)
  const [archivingArticleId, setArchivingArticleId] = useState<number | null>(null)

  const selectedArticlePdfUrl = selectedArticle?.pdf_url
    ? formatUrl(selectedArticle.pdf_url) ?? selectedArticle.pdf_url
    : null

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    const token = localStorage.getItem("auth_token")
    if (!token) return
    try {
      const articlesData = await articulosApi.listarTodos(token)
      setAdminArticulos(Array.isArray(articlesData) ? articlesData : [])
    } catch {
      const publicResult = await articulosApi.listarPublicados().catch(() => null)
      setAdminArticulos(publicResult?.data ?? [])
    }
  }

  const handleModerarArticulo = async (id: number) => {
    const token = localStorage.getItem("auth_token")
    if (!token) return
    try {
      await articulosApi.moderar(id, token)
      toast({ title: "Artículo moderado", description: "El artículo ha sido aprobado y publicado." })
      await loadArticles()
    } catch {
      toast({ title: "Error", description: "No se pudo moderar el artículo.", variant: "destructive" })
    }
  }

  const handleArchivarArticulo = async (id: number) => {
    const ok = await animatedConfirm({
      title: "Archivar Artículo",
      message: "¿Estás seguro de archivar este artículo? Ya no será visible en la web.",
      confirmText: "Archivar",
      variant: "warning"
    })
    if (!ok) return
    const token = localStorage.getItem("auth_token")
    if (!token) return
    try {
      await articulosApi.archivar(id, token)
      toast({ title: "Artículo archivado", description: "El artículo ha sido archivado." })
      await loadArticles()
    } catch {
      toast({ title: "Error", description: "No se pudo archivar el artículo.", variant: "destructive" })
    }
  }

  const handleCreateArticuloAdmin = async (data: FormData | Partial<Articulo>) => {
    const token = localStorage.getItem("auth_token")
    if (!token) return
    try {
      await articulosApi.crear(data as any, token)
      toast({ title: "Artículo Creado", description: "El artículo ha sido publicado exitosamente." })
      await loadArticles()
      setIsArticleModalOpen(false)
    } catch {
      toast({ title: "Error", description: "No se pudo crear el artículo", variant: "destructive" })
    }
  }

  const handleUpdateArticuloAdmin = async (data: FormData | Partial<Articulo>) => {
    const token = localStorage.getItem("auth_token")
    if (!token || !selectedArticle) return
    try {
      await articulosApi.actualizar(selectedArticle.id, data, token)
      toast({ title: "Artículo Actualizado", description: "Cambios guardados exitosamente." })
      await loadArticles()
      setIsArticleModalOpen(false)
    } catch {
      toast({ title: "Error", description: "No se pudo actualizar el artículo", variant: "destructive" })
    }
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Moderación de Artículos</h2>
            <p className="text-sm text-gray-500">Supervisa e impulsa el contenido de la comunidad</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm font-medium bg-white px-3 py-1">
            {adminArticulos.length} {adminArticulos.length === 1 ? 'artículo' : 'artículos'}
          </Badge>
          <Button
            onClick={() => {
              setSelectedArticle(null)
              setIsArticleModalOpen(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 shadow-md transition-all active:scale-95 gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Artículo
          </Button>
        </div>
      </div>

      {adminArticulos.length === 0 ? (
        <Card className="bg-white border-gray-200 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <BookOpen className="h-12 w-12 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay artículos publicados</h3>
            <p className="text-gray-400 max-w-sm">Los artículos creados por profesionales aparecerán aquí para tu supervisión.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {adminArticulos.map((articulo, index) => {
            const excerpt = articulo.resumen || `${articulo.contenido?.slice(0, 150) || ""}...`
            const articlePdfUrl = formatUrl(articulo.pdf_url) || articulo.pdf_url

            return (
              <div
                key={articulo.id}
                onClick={() => {
                  setSelectedArticle(articulo)
                }}
                className="group block w-full bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-6 cursor-pointer"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                  {articlePdfUrl ? (
                    <ArticlePdfPreview
                      pdfUrl={articlePdfUrl}
                      title={articulo.titulo}
                      compact={true}
                      variant="thumbnail"
                      className="transition-transform duration-700 group-hover:scale-[1.03]"
                      fallbackMessage="Vista previa no disponible para este artículo."
                    />
                  ) : articulo.imagen_url ? (
                    <img
                      src={formatUrl(articulo.imagen_url) || ""}
                      alt={articulo.titulo}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-gray-500">
                      <BookOpen className="text-primary/30" size={56} />
                      <p className="text-sm font-medium">Sin PDF disponible</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent opacity-70" />

                  <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                    {articulo.autor?.foto_url ? (
                      <img
                        src={articulo.autor.foto_url}
                        alt={articulo.autor.nombre || "Autor"}
                        className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border-2 border-white shadow-sm">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <span className="text-sm font-semibold text-gray-900">
                      {articulo.autor?.nombre || "Autor desconocido"}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-3 text-xs text-gray-500">
                    <span>{formatArticleDate(articulo.fecha_publicacion)}</span>
                  </div>

                  <h4 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {articulo.titulo}
                  </h4>

                  <p className="text-sm text-gray-600 leading-relaxed mb-5 line-clamp-3">{excerpt}</p>
                </div>

                <div className="px-6 pb-6">
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{articulo.autor?.nombre || "Autor desconocido"}</p>
                    </div>

                    {articulo.estado === "publicado" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleArchivarArticulo(articulo.id)
                        }}
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors px-3"
                        title="Archivar"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleModerarArticulo(articulo.id)
                        }}
                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-colors px-3"
                        title="Publicar"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Dialog open={isArticleDetailsOpen} onOpenChange={setIsArticleDetailsOpen}>
        <DialogContent className="bg-white border-gray-200 max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedArticle && (
            <div className="animate-in fade-in duration-300">
              <DialogHeader className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={cn(
                    "text-[10px] font-bold uppercase",
                    selectedArticle.estado === 'publicado' ? "bg-emerald-500" : "bg-gray-400"
                  )}>
                    {selectedArticle.estado}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {selectedArticle.fecha_publicacion ? new Date(selectedArticle.fecha_publicacion).toLocaleDateString("es-EC") : ""}
                  </span>
                </div>
                <DialogTitle className="text-3xl font-bold text-gray-900 leading-tight">
                  {selectedArticle.titulo}
                </DialogTitle>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    {selectedArticle.autor?.foto_url ? (
                      <img src={selectedArticle.autor.foto_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Users className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{selectedArticle.autor?.nombre}</p>
                    <p className="text-xs text-gray-500">Autor del artículo</p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {selectedArticle.imagen_url && (
                  <div className="rounded-xl overflow-hidden border bg-gray-50 aspect-video relative group">
                    <img
                      src={selectedArticle.imagen_url}
                      alt={selectedArticle.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {selectedArticle.resumen && (
                  <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 italic text-gray-600 text-lg leading-relaxed">
                    "{selectedArticle.resumen}"
                  </div>
                )}

                {selectedArticlePdfUrl && (
                  <div className="space-y-3 rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                        <FileText className="h-4 w-4" />
                        Documento PDF adjunto
                      </div>
                      <Button asChild variant="outline" size="icon" aria-label="Abrir PDF" className="border-blue-200 bg-white text-blue-700 hover:bg-blue-50">
                        <a
                          href={selectedArticlePdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

                <div className="prose prose-blue max-w-none text-gray-800 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: selectedArticle.contenido }} />
                </div>
              </div>

              <DialogFooter className="mt-8 pt-6 border-t border-gray-100 gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsArticleDetailsOpen(false)}
                  aria-label="Cerrar"
                >
                  <X className="h-4 w-4" />
                </Button>

                {selectedArticle.estado === 'publicado' ? (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleArchivarArticulo(selectedArticle.id)
                      setIsArticleDetailsOpen(false)
                    }}
                    className="bg-red-600 hover:bg-red-700 gap-2 px-6"
                  >
                    <XCircle className="h-4 w-4" />
                    Archivar Artículo
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      handleModerarArticulo(selectedArticle.id)
                      setIsArticleDetailsOpen(false)
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 gap-2 px-6"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Publicar Artículo
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ArticleFormModal
        open={isArticleModalOpen}
        onOpenChange={setIsArticleModalOpen}
        article={selectedArticle}
        onSubmit={selectedArticle ? handleUpdateArticuloAdmin : handleCreateArticuloAdmin}
      />

      <AnimatedConfirm
        isOpen={isConfirmOpen}
        options={confirmOptions}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />

      <ArticleReaderDialog
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  )
}