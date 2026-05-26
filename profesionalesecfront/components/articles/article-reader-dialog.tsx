"use client"

import { BookOpen, X } from "lucide-react"
import dynamic from "next/dynamic"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import type { Articulo } from "@/lib/api"
import { formatUrl } from "@/lib/utils"

const ArticlePdfReader = dynamic(() => import("@/components/articles/article-pdf-reader"), { ssr: false })

interface ArticleReaderDialogProps {
  article: Articulo | null
  onClose: () => void
}

export default function ArticleReaderDialog({ article, onClose }: ArticleReaderDialogProps) {
  const articlePdfUrl = article?.pdf_url ? formatUrl(article.pdf_url) || article.pdf_url : ""

  return (
    <Dialog
      open={article !== null}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="h-[100dvh] w-screen max-w-none translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-none border-0 bg-transparent p-0 shadow-none sm:max-w-none"
      >
        {article && (
          <div className="h-[100dvh] w-full">
            <DialogTitle className="sr-only">{article.titulo}</DialogTitle>
            <DialogDescription className="sr-only">
              {articlePdfUrl
                ? `Visualizador en pantalla completa del PDF del articulo ${article.titulo}.`
                : `Detalle del articulo ${article.titulo}. Este articulo no tiene PDF disponible.`}
            </DialogDescription>
            {articlePdfUrl ? (
              <ArticlePdfReader
                pdfUrl={articlePdfUrl}
                title={article.titulo}
                summary={article.resumen}
                onClose={onClose}
              />
            ) : (
              <div className="flex h-[100dvh] flex-col items-center justify-center gap-4 bg-stone-950 px-6 text-center text-amber-100">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="absolute right-4 top-4 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 h-10 w-10 text-white backdrop-blur transition hover:bg-white/15"
                >
                  <X className="h-5 w-5" />
                </button>
                <BookOpen className="h-9 w-9" />
                <p className="font-semibold">Este artículo no tiene PDF disponible.</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
