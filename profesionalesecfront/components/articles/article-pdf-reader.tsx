"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, ExternalLink, FileWarning, Loader2, X } from "lucide-react"
import { Document, Page, pdfjs } from "react-pdf"
import { cn } from "@/lib/utils"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString()

interface ArticlePdfReaderProps {
  pdfUrl: string
  title: string
  summary?: string
  onClose?: () => void
}

interface LoadedPdfDocument {
  numPages: number
}

interface ViewportSize {
  width: number
  height: number
}

interface SpreadDescriptor {
  index: number
  pages: number[]
}

interface SpreadSize {
  width: number
  height: number
  pageWidth: number
  pageHeight: number
  gap: number
}

interface TurnEvent {
  preventDefault: () => void
}

interface TurnWhenOptions {
  turning?: (event: TurnEvent, page: number) => void
  turned?: (_event: unknown, page: number) => void
}

interface TurnOptions {
  width: number
  height: number
  display: "single"
  autoCenter: boolean
  acceleration: boolean
  elevation: number
  gradients: boolean
  duration: number
  page: number
  when?: TurnWhenOptions
}

interface TurnElement {
  turn(options: TurnOptions): unknown
  turn(method: "destroy"): unknown
  turn(method: "page"): number
  turn(method: "page", page: number): unknown
  turn(method: "size", width: number, height: number): unknown
  data(key: string): unknown
}

interface JQueryFactory {
  (element: HTMLElement): TurnElement
}

interface TurnWindow extends Window {
  $?: JQueryFactory
  jQuery?: JQueryFactory
}

const PDF_PAGE_RATIO = 1 / 1.414
const DEFAULT_VIEWPORT_WIDTH = 1280
const DEFAULT_VIEWPORT_HEIGHT = 800
const MIN_PAGE_WIDTH = 160
const MAX_PAGE_WIDTH = 860
const MOBILE_VIEWPORT_HORIZONTAL_MARGIN = 4
const DESKTOP_VIEWPORT_HORIZONTAL_MARGIN = 8
const MOBILE_VIEWPORT_VERTICAL_CHROME = 16
const DESKTOP_VIEWPORT_VERTICAL_CHROME = 16
const MOBILE_PAGE_GAP = 8
const DESKTOP_PAGE_GAP = 18

const PAGE_RENDER_STATUS = {
  READY: "ready",
  RENDERING: "rendering",
  ERROR: "error",
} as const

type PageRenderStatus = (typeof PAGE_RENDER_STATUS)[keyof typeof PAGE_RENDER_STATUS]

const getViewportSize = (): ViewportSize => {
  if (typeof window === "undefined") {
    return {
      width: DEFAULT_VIEWPORT_WIDTH,
      height: DEFAULT_VIEWPORT_HEIGHT,
    }
  }

  return {
    width: Math.max(Math.floor(window.innerWidth), 1),
    height: Math.max(Math.floor(window.innerHeight), 1),
  }
}

const getSpreadDescriptors = (numPages: number): SpreadDescriptor[] => Array.from(
  { length: Math.ceil(numPages / 2) },
  (_, index) => ({
    index,
    pages: [index * 2 + 1, index * 2 + 2].filter((pageNumber) => pageNumber <= numPages),
  }),
)

export default function ArticlePdfReader({ pdfUrl, title, summary, onClose }: ArticlePdfReaderProps) {
  const pdfReaderLog = (...args: unknown[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[ArticlePdfReader]", ...args)
    }
  }

  const flipbookRef = useRef<HTMLDivElement | null>(null)
  const spreadRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const turnElementRef = useRef<TurnElement | null>(null)
  const spreadReadyRef = useRef<boolean[]>([])
  const isProgrammaticTurnRef = useRef(false)

  const [viewportSize, setViewportSize] = useState<ViewportSize>(getViewportSize)
  const [numPages, setNumPages] = useState(0)
  const [hasError, setHasError] = useState(false)
  const [isDocumentLoading, setIsDocumentLoading] = useState(true)
  const [activeSpreadIndex, setActiveSpreadIndex] = useState(0)
  const [pendingSpreadIndex, setPendingSpreadIndex] = useState<number | null>(null)
  const [renderedSpreadIndexes, setRenderedSpreadIndexes] = useState<number[]>([0])
  const [pageRenderState, setPageRenderState] = useState<Record<number, PageRenderStatus>>({})
  const [isTurnReady, setIsTurnReady] = useState(false)

  const destroyTurnInstance = () => {
    if (!turnElementRef.current) {
      return
    }

    pdfReaderLog("destroying turn instance")

    try {
      turnElementRef.current.turn("destroy")
    } catch (error) {
      pdfReaderLog("turn destroy failed", error)
    }

    turnElementRef.current = null
    isProgrammaticTurnRef.current = false
    setIsTurnReady(false)
  }

  useEffect(() => {
    pdfReaderLog("pdf input changed", {
      title,
      pdfUrl,
    })

    destroyTurnInstance()
    spreadRefs.current = {}
    setNumPages(0)
    setHasError(false)
    setIsDocumentLoading(true)
    setActiveSpreadIndex(0)
    setPendingSpreadIndex(null)
    setRenderedSpreadIndexes([0])
    setPageRenderState({})
  }, [pdfUrl])

  useEffect(() => {
    const updateViewport = () => {
      const nextViewport = getViewportSize()

      setViewportSize((currentViewport) => {
        if (
          currentViewport.width === nextViewport.width
          && currentViewport.height === nextViewport.height
        ) {
          return currentViewport
        }

        pdfReaderLog("viewport size measured", nextViewport)
        return nextViewport
      })
    }

    updateViewport()
    const animationFrameId = window.requestAnimationFrame(updateViewport)
    const timeoutId = window.setTimeout(updateViewport, 120)

    window.addEventListener("resize", updateViewport)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.clearTimeout(timeoutId)
      window.removeEventListener("resize", updateViewport)
    }
  }, [])

  useEffect(() => () => {
    destroyTurnInstance()
  }, [])

  const spreads = getSpreadDescriptors(numPages)
  const spreadCount = spreads.length
  const isMobileViewport = viewportSize.width < 768
  const viewportHorizontalMargin = isMobileViewport
    ? MOBILE_VIEWPORT_HORIZONTAL_MARGIN
    : DESKTOP_VIEWPORT_HORIZONTAL_MARGIN
  const viewportVerticalChrome = isMobileViewport
    ? MOBILE_VIEWPORT_VERTICAL_CHROME
    : DESKTOP_VIEWPORT_VERTICAL_CHROME
  const pageGap = isMobileViewport ? MOBILE_PAGE_GAP : DESKTOP_PAGE_GAP
  const availableWidth = Math.max(viewportSize.width - viewportHorizontalMargin, MIN_PAGE_WIDTH * 2)
  const availableHeight = Math.max(viewportSize.height - viewportVerticalChrome, MIN_PAGE_WIDTH)
  const pageWidth = Math.max(
    Math.floor(Math.min((availableWidth - pageGap) / 2, availableHeight * PDF_PAGE_RATIO, MAX_PAGE_WIDTH)),
    MIN_PAGE_WIDTH,
  )
  const pageHeight = Math.floor(pageWidth / PDF_PAGE_RATIO)
  const spreadSize: SpreadSize = {
    width: pageWidth * 2 + pageGap,
    height: pageHeight,
    pageWidth,
    pageHeight,
    gap: pageGap,
  }
  const renderedSpreadIndexSet = new Set(renderedSpreadIndexes)

  const spreadReadiness = spreads.map((spread) => {
    const spreadElement = spreadRefs.current[spread.index]
    const renderedCanvasCount = spreadElement?.querySelectorAll("canvas").length ?? 0
    const allPagesReady = spread.pages.every((pageNumber) => pageRenderState[pageNumber] === PAGE_RENDER_STATUS.READY)
    return allPagesReady && renderedCanvasCount >= spread.pages.length
  })

  const currentVisibleSpreadIndex = pendingSpreadIndex ?? activeSpreadIndex
  const currentVisibleSpread = spreads[currentVisibleSpreadIndex] ?? null
  const activeSpreadReady = spreadReadiness[activeSpreadIndex] ?? false
  const pendingSpreadReady = pendingSpreadIndex === null
    ? true
    : (spreadReadiness[pendingSpreadIndex] ?? false)
  const isPreparingSpread = !hasError && (isDocumentLoading || (numPages > 0 && (!activeSpreadReady || !pendingSpreadReady || !isTurnReady)))
  const canGoPrevious = activeSpreadIndex > 0 && pendingSpreadIndex === null
  const canGoNext = activeSpreadIndex < spreadCount - 1 && pendingSpreadIndex === null
  const loading = (
    <div className="flex min-h-[60vh] items-center justify-center text-white">
      <Loader2 className="h-7 w-7 animate-spin" />
    </div>
  )

  useEffect(() => {
    spreadReadyRef.current = spreadReadiness
  }, [spreadReadiness])

  useEffect(() => {
    if (numPages === 0) {
      return
    }

    pdfReaderLog("spread page size ready", {
      viewportSize,
      spreadSize,
      spreadCount,
    })

    setPageRenderState({})
    setPendingSpreadIndex(null)
  }, [numPages, spreadSize.width, spreadSize.height, viewportSize])

  useEffect(() => {
    if (numPages === 0) {
      return
    }

    setPageRenderState((currentState) => {
      const nextState = { ...currentState }
      let hasChanges = false

      for (const spreadIndex of renderedSpreadIndexes) {
        const spread = spreads[spreadIndex]

        if (!spread) {
          continue
        }

        for (const pageNumber of spread.pages) {
          if (nextState[pageNumber] === PAGE_RENDER_STATUS.READY) {
            continue
          }

          nextState[pageNumber] = PAGE_RENDER_STATUS.RENDERING
          hasChanges = true
        }
      }

      return hasChanges ? nextState : currentState
    })
  }, [numPages, renderedSpreadIndexes, spreads])

  useEffect(() => {
    if (!turnElementRef.current || !activeSpreadReady) {
      return
    }

    pdfReaderLog("resizing turn instance", spreadSize)
    turnElementRef.current.turn("size", spreadSize.width, spreadSize.height)
  }, [activeSpreadReady, spreadSize.height, spreadSize.width])

  useEffect(() => {
    if (hasError || numPages === 0 || !activeSpreadReady || !flipbookRef.current || turnElementRef.current) {
      return
    }

    let cancelled = false

    const initializeTurn = async () => {
      try {
        const jqueryModule = await import("jquery")
        const jQueryFactory = (jqueryModule.default ?? jqueryModule) as unknown as JQueryFactory
        const turnWindow = window as TurnWindow

        turnWindow.$ = jQueryFactory
        turnWindow.jQuery = jQueryFactory

        await import("turn.js")

        if (cancelled || !flipbookRef.current) {
          return
        }

        const turnElement = jQueryFactory(flipbookRef.current)

        if (turnElement.data("turn")) {
          turnElement.turn("destroy")
        }

        pdfReaderLog("initializing turn", {
          spreadCount,
          activeSpreadIndex,
          spreadSize,
        })

        turnElement.turn({
          width: spreadSize.width,
          height: spreadSize.height,
          display: "single",
          autoCenter: true,
          acceleration: true,
          elevation: 48,
          gradients: true,
          duration: 900,
          page: activeSpreadIndex + 1,
          when: {
            turning: (event, page) => {
              const targetSpreadIndex = page - 1
              const isReady = spreadReadyRef.current[targetSpreadIndex] ?? false

              pdfReaderLog("turning requested", {
                targetSpreadIndex,
                isReady,
                isProgrammatic: isProgrammaticTurnRef.current,
              })

              if (isProgrammaticTurnRef.current || isReady) {
                return
              }

              event.preventDefault()
              setPendingSpreadIndex(targetSpreadIndex)
              setRenderedSpreadIndexes((currentState) => {
                const nextState = new Set(currentState)
                nextState.add(targetSpreadIndex)

                if (targetSpreadIndex > 0) {
                  nextState.add(targetSpreadIndex - 1)
                }

                if (targetSpreadIndex < spreadCount - 1) {
                  nextState.add(targetSpreadIndex + 1)
                }

                return Array.from(nextState).sort((left, right) => left - right)
              })
            },
            turned: (_event, page) => {
              const nextSpreadIndex = page - 1

              pdfReaderLog("turn completed", {
                nextSpreadIndex,
              })

              setActiveSpreadIndex(nextSpreadIndex)
              setPendingSpreadIndex(null)
              setRenderedSpreadIndexes((currentState) => {
                const nextState = new Set(currentState)
                nextState.add(nextSpreadIndex)

                if (nextSpreadIndex > 0) {
                  nextState.add(nextSpreadIndex - 1)
                }

                if (nextSpreadIndex < spreadCount - 1) {
                  nextState.add(nextSpreadIndex + 1)
                }

                return Array.from(nextState).sort((left, right) => left - right)
              })

              window.setTimeout(() => {
                isProgrammaticTurnRef.current = false
              }, 0)
            },
          },
        })

        turnElementRef.current = turnElement
        setIsTurnReady(true)
      } catch (error) {
        pdfReaderLog("turn initialization failed", error)
        setHasError(true)
      }
    }

    void initializeTurn()

    return () => {
      cancelled = true
    }
  }, [activeSpreadIndex, activeSpreadReady, hasError, numPages, spreadCount, spreadSize.height, spreadSize.width])

  useEffect(() => {
    if (!turnElementRef.current || pendingSpreadIndex === null || !pendingSpreadReady) {
      return
    }

    pdfReaderLog("pending spread ready, advancing turn", {
      pendingSpreadIndex,
      spread: spreads[pendingSpreadIndex]?.pages,
    })

    isProgrammaticTurnRef.current = true
    turnElementRef.current.turn("page", pendingSpreadIndex + 1)
  }, [pendingSpreadIndex, pendingSpreadReady, spreads])

  const requestSpreadChange = (targetSpreadIndex: number) => {
    if (targetSpreadIndex < 0 || targetSpreadIndex >= spreadCount || targetSpreadIndex === activeSpreadIndex) {
      return
    }

    pdfReaderLog("spread change requested", {
      from: activeSpreadIndex,
      to: targetSpreadIndex,
      pages: spreads[targetSpreadIndex]?.pages,
    })

    setRenderedSpreadIndexes((currentState) => {
      const nextState = new Set(currentState)
      nextState.add(targetSpreadIndex)

      if (targetSpreadIndex > 0) {
        nextState.add(targetSpreadIndex - 1)
      }

      if (targetSpreadIndex < spreadCount - 1) {
        nextState.add(targetSpreadIndex + 1)
      }

      return Array.from(nextState).sort((left, right) => left - right)
    })

    if (spreadReadiness[targetSpreadIndex] && turnElementRef.current) {
      isProgrammaticTurnRef.current = true
      turnElementRef.current.turn("page", targetSpreadIndex + 1)
      return
    }

    setPendingSpreadIndex(targetSpreadIndex)
  }

  if (hasError) {
    pdfReaderLog("rendering full error state", {
      numPages,
      pdfUrl,
    })

    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 bg-stone-950 px-6 text-center text-amber-100">
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-4 top-4 inline-flex items-center justify-center rounded-full border border-black/15 bg-white h-10 w-10 text-black backdrop-blur transition hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
        <FileWarning className="h-8 w-8" />
        <p className="font-semibold">No se pudo cargar el PDF.</p>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            pdfReaderLog("open original pdf clicked from error state", { pdfUrl })
          }}
          className="text-sm font-semibold underline underline-offset-4"
        >
          Abrir archivo original
        </a>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_32%),linear-gradient(180deg,#111827_0%,#09090b_100%)] text-white",
        "[&_.react-pdf__Document]:flex [&_.react-pdf__Document]:h-full [&_.react-pdf__Document]:min-h-0 [&_.react-pdf__Document]:flex-1 [&_.react-pdf__Document]:flex-col",
        "[&_.react-pdf__Page]:flex [&_.react-pdf__Page]:h-full [&_.react-pdf__Page]:items-center [&_.react-pdf__Page]:justify-center",
        "[&_.react-pdf__Page__canvas]:!h-auto [&_.react-pdf__Page__canvas]:max-h-full [&_.react-pdf__Page__canvas]:max-w-full",
        "[&_.page-wrapper]:bg-transparent [&_.turn-page]:bg-transparent [&_.turn-page-wrapper]:bg-transparent",
      )}
    >
      {onClose ? (
        <div className="absolute right-2 top-2 z-50 flex items-center gap-2 sm:right-3 sm:top-3">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              pdfReaderLog("open original pdf clicked", {
                pdfUrl,
                activeSpreadIndex,
              })
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/12 bg-white text-black backdrop-blur transition hover:bg-gray-100"
            title="Abrir PDF en nueva pestana"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/12 bg-white text-black backdrop-blur transition hover:bg-gray-100"
            aria-label="Cerrar lector"
            title="Cerrar lector"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : null}

      <Document
        key={pdfUrl}
        file={pdfUrl}
        loading={loading}
        error={null}
        noData={null}
        onLoadProgress={(progress) => {
          pdfReaderLog("document load progress", {
            loaded: progress.loaded,
            total: progress.total,
            pdfUrl,
          })
        }}
        onLoadSuccess={(document: LoadedPdfDocument) => {
          const nextSpreadCount = Math.ceil(document.numPages / 2)

          pdfReaderLog("document load success", {
            numPages: document.numPages,
            pdfUrl,
            viewportSize,
            spreadSize,
          })

          setNumPages(document.numPages)
          setHasError(false)
          setIsDocumentLoading(false)
          setActiveSpreadIndex(0)
          setPendingSpreadIndex(null)
          setRenderedSpreadIndexes(nextSpreadCount > 1 ? [0, 1] : [0])
          setPageRenderState({})
        }}
        onLoadError={(error) => {
          pdfReaderLog("document load error", {
            pdfUrl,
            error,
          })
          setIsDocumentLoading(false)
          setHasError(true)
        }}
        onSourceError={(error) => {
          pdfReaderLog("document source error", {
            pdfUrl,
            error,
          })
          setIsDocumentLoading(false)
          setHasError(true)
        }}
      >
        <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.06),_transparent_58%)]" />

            <button
              type="button"
              onClick={() => {
                requestSpreadChange(activeSpreadIndex - 1)
              }}
              disabled={!canGoPrevious}
              aria-label="Spread anterior"
              className="absolute left-2 top-1/2 z-30 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/12 bg-white text-black backdrop-blur transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 sm:left-3 md:left-4"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                requestSpreadChange(activeSpreadIndex + 1)
              }}
              disabled={!canGoNext}
              aria-label="Spread siguiente"
              className="absolute right-2 top-1/2 z-30 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/12 bg-white text-black backdrop-blur transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 sm:right-3 md:right-4"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {numPages > 0 && isPreparingSpread ? (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/35 backdrop-blur-[2px]">
                <Loader2 className="h-7 w-7 animate-spin text-white" />
                <p className="px-4 text-center text-sm text-stone-200">
                  {currentVisibleSpread
                    ? `Preparando paginas ${currentVisibleSpread.pages.join(" y ")} para el efecto de libro...`
                    : "Preparando visor..."}
                </p>
              </div>
            ) : null}

            <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
              <div
                ref={flipbookRef}
                className={cn(
                  "mx-auto",
                  !isTurnReady && "opacity-0",
                )}
                style={{ width: spreadSize.width, height: spreadSize.height }}
              >
                {spreads.map((spread) => {
                  const shouldRenderSpread = renderedSpreadIndexSet.has(spread.index)

                  return (
                    <div
                      key={`${pdfUrl}-spread-${spread.index}`}
                      ref={(element) => {
                        spreadRefs.current[spread.index] = element
                      }}
                      className="h-full w-full bg-transparent"
                    >
                      <div
                        className="relative flex h-full w-full items-center justify-center bg-transparent"
                        style={{ gap: spreadSize.gap }}
                      >
                        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-8 -translate-x-1/2 bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_0%,rgba(0,0,0,0.18)_40%,rgba(0,0,0,0.35)_50%,rgba(0,0,0,0.18)_60%,rgba(255,255,255,0.02)_100%)] blur-[1px]" />

                        {spread.pages.map((pageNumber, pageIndex) => (
                          <div
                            key={`${pdfUrl}-spread-${spread.index}-page-${pageNumber}`}
                            className="relative flex h-full shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-white shadow-[0_28px_70px_rgba(0,0,0,0.45)]"
                            style={{ width: spreadSize.pageWidth, height: spreadSize.pageHeight }}
                          >
                            {shouldRenderSpread ? (
                              <Page
                                key={`${pdfUrl}-${pageNumber}-${spreadSize.pageWidth}-${spreadSize.pageHeight}`}
                                className="flex h-full w-full items-center justify-center"
                                pageNumber={pageNumber}
                                width={spreadSize.pageWidth}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                                loading={
                                  <div className="flex min-h-80 items-center justify-center text-slate-900">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                  </div>
                                }
                                onLoadSuccess={(page) => {
                                  pdfReaderLog("page load success", {
                                    pageNumber,
                                    spreadIndex: spread.index,
                                    width: page.width,
                                    height: page.height,
                                    originalWidth: page.originalWidth,
                                    originalHeight: page.originalHeight,
                                    requestedWidth: spreadSize.pageWidth,
                                  })

                                  setHasError(false)
                                  setPageRenderState((currentState) => ({
                                    ...currentState,
                                    [pageNumber]: PAGE_RENDER_STATUS.RENDERING,
                                  }))
                                }}
                                onRenderSuccess={() => {
                                  pdfReaderLog("page render success", {
                                    pageNumber,
                                    spreadIndex: spread.index,
                                    spreadPages: spread.pages,
                                  })

                                  setHasError(false)
                                  setPageRenderState((currentState) => ({
                                    ...currentState,
                                    [pageNumber]: PAGE_RENDER_STATUS.READY,
                                  }))
                                }}
                                onRenderError={(error) => {
                                  pdfReaderLog("page render error", {
                                    pageNumber,
                                    spreadIndex: spread.index,
                                    error,
                                  })

                                  setHasError(true)
                                  setPageRenderState((currentState) => ({
                                    ...currentState,
                                    [pageNumber]: PAGE_RENDER_STATUS.ERROR,
                                  }))
                                }}
                                onLoadError={(error) => {
                                  pdfReaderLog("page load error", {
                                    pageNumber,
                                    spreadIndex: spread.index,
                                    error,
                                  })

                                  setHasError(true)
                                  setPageRenderState((currentState) => ({
                                    ...currentState,
                                    [pageNumber]: PAGE_RENDER_STATUS.ERROR,
                                  }))
                                }}
                                canvasBackground="white"
                              />
                            ) : (
                              <div className="h-full w-full bg-[linear-gradient(135deg,#f6f7fb_0%,#edf1f7_100%)]" />
                            )}
                            <div
                              className="absolute inset-0 z-10 cursor-pointer"
                              onClick={(event) => {
                                event.stopPropagation()
                                if (pageIndex === 0) {
                                  if (canGoPrevious) {
                                    requestSpreadChange(activeSpreadIndex - 1)
                                  }
                                } else {
                                  if (canGoNext) {
                                    requestSpreadChange(activeSpreadIndex + 1)
                                  }
                                }
                              }}
                              aria-hidden="true"
                            />
                          </div>
                        ))}

                        {spread.pages.length === 1 ? (
                          <div
                            className="relative flex h-full shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-white/5 shadow-[0_28px_70px_rgba(0,0,0,0.2)]"
                            style={{ width: spreadSize.pageWidth, height: spreadSize.pageHeight }}
                          />
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </Document>

      <p className="sr-only">Visor tipo libro a pantalla completa para {title}</p>
    </div>
  )
}
