"use client"

import { useEffect, useRef, useState } from "react"
import { FileWarning, Loader2 } from "lucide-react"
import { Document, Page, pdfjs } from "react-pdf"
import { cn } from "@/lib/utils"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString()

const ARTICLE_PDF_PREVIEW_VARIANT = {
  DOCUMENT: "document",
  THUMBNAIL: "thumbnail",
} as const

type ArticlePdfPreviewVariant = (typeof ARTICLE_PDF_PREVIEW_VARIANT)[keyof typeof ARTICLE_PDF_PREVIEW_VARIANT]

interface ArticlePdfPreviewProps {
  pdfUrl: string
  title: string
  fallbackMessage?: string
  compact?: boolean
  variant?: ArticlePdfPreviewVariant
  className?: string
}

function PdfPreviewFallback({ compact, message }: { compact: boolean; message: string }) {
  return (
    <div className={`flex h-full flex-col items-center justify-center text-center text-blue-700 ${compact ? "gap-1 px-3 text-[11px]" : "min-h-80 gap-2 px-6 text-sm"}`}>
      <FileWarning className={compact ? "h-4 w-4" : "h-5 w-5"} />
      <p>{message}</p>
      <p className={compact ? "text-[10px] text-blue-600" : "text-xs text-blue-600"}>Abrilo en otra pestaña para ver el documento completo.</p>
    </div>
  )
}

export default function ArticlePdfPreview({
  pdfUrl,
  title,
  fallbackMessage = "No se pudo cargar la vista previa del PDF.",
  compact = false,
  variant = ARTICLE_PDF_PREVIEW_VARIANT.DOCUMENT,
  className,
}: ArticlePdfPreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [pageWidth, setPageWidth] = useState(0)
  const [hasError, setHasError] = useState(false)
  const isThumbnail = variant === ARTICLE_PDF_PREVIEW_VARIANT.THUMBNAIL

  const loadingClassName = cn(
    "flex h-full items-center justify-center text-blue-700",
    compact ? "" : "min-h-80",
  )

  const pageClassName = cn(
    "flex w-full",
    isThumbnail ? "items-start justify-start" : "items-start justify-center",
  )

  useEffect(() => {
    const element = containerRef.current

    if (!element) {
      return
    }

    const updateWidth = () => {
      setPageWidth(Math.floor(element.clientWidth))
    }

    updateWidth()

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateWidth)

      return () => {
        window.removeEventListener("resize", updateWidth)
      }
    }

    const observer = new ResizeObserver(() => {
      updateWidth()
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        "h-full w-full bg-white [&_.react-pdf__Document]:h-full [&_.react-pdf__Page]:h-full [&_.react-pdf__Page__canvas]:!h-auto [&_.react-pdf__Page__canvas]:block [&_.react-pdf__Page__canvas]:max-w-none",
        isThumbnail && "overflow-hidden [&_.react-pdf__Page__canvas]:!w-full",
        className,
      )}
      title={`Vista previa de ${title}`}
    >
      {/** `react-pdf` needs a fixed worker and client-side render only. */}
      <Document
        file={pdfUrl}
        loading={
          <div className={loadingClassName}>
            <Loader2 className={`${compact ? "h-4 w-4" : "h-5 w-5"} animate-spin`} />
          </div>
        }
        noData={null}
        error={<PdfPreviewFallback compact={compact} message={fallbackMessage} />}
        onLoadError={() => {
          setHasError(true)
        }}
        onSourceError={() => {
          setHasError(true)
        }}
        onLoadSuccess={() => {
          setHasError(false)
        }}
      >
        {hasError ? (
          <PdfPreviewFallback compact={compact} message={fallbackMessage} />
        ) : pageWidth <= 0 ? (
          <div className={loadingClassName}>
            <Loader2 className={`${compact ? "h-4 w-4" : "h-5 w-5"} animate-spin`} />
          </div>
        ) : (
          <Page
            key={`${pdfUrl}-${pageWidth}`}
            className={pageClassName}
            pageNumber={1}
            width={pageWidth}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            loading={
              <div className={loadingClassName}>
                <Loader2 className={`${compact ? "h-4 w-4" : "h-5 w-5"} animate-spin`} />
              </div>
            }
            onLoadError={() => {
              setHasError(true)
            }}
            onRenderSuccess={() => {
              setHasError(false)
            }}
            canvasBackground="white"
          />
        )}
      </Document>
    </div>
  )
}
