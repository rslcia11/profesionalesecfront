"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AlertCircle, ArrowLeft, CheckCircle2, Home, Loader2 } from "lucide-react"
import { payphoneApi, type PayPhonePriorityConfirmData } from "@/lib/api"

interface StoredCheckoutContext {
  clientTransactionId: string
}

const CHECKOUT_CONTEXT_STORAGE_KEY = "payphone_priority_checkout_context"

function readStoredCheckoutContext(): StoredCheckoutContext | null {
  if (typeof window === "undefined") return null

  const rawValue = window.localStorage.getItem(CHECKOUT_CONTEXT_STORAGE_KEY)
  if (!rawValue) return null

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<StoredCheckoutContext>

    if (
      typeof parsedValue.clientTransactionId === "string"
    ) {
      return {
        clientTransactionId: parsedValue.clientTransactionId,
      }
    }
  } catch {
    return null
  }

  return null
}

export default function PayPhonePriorityResultPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [confirmationResult, setConfirmationResult] = useState<PayPhonePriorityConfirmData | null>(null)

  useEffect(() => {
    const confirmCheckout = async () => {
      const searchParams = new URLSearchParams(window.location.search)
      const storedContext = readStoredCheckoutContext()
      const payphonePaymentId = searchParams.get("paymentId") || searchParams.get("id")
      const clientTransactionId = searchParams.get("clientTransactionId") || storedContext?.clientTransactionId
      if (!clientTransactionId) {
        setErrorMessage("No pudimos identificar tu transacción PayPhone para confirmar el pago.")
        setIsLoading(false)
        return
      }

      if (!payphonePaymentId) {
        setErrorMessage("PayPhone no devolvió el identificador del pago. Tu solicitud no pudo confirmarse automáticamente.")
        setIsLoading(false)
        return
      }

      try {
        const result = await payphoneApi.confirmPriorityCheckout(
          {
            id: payphonePaymentId,
            clientTransactionId,
          },
        )

        setConfirmationResult(result)
        window.localStorage.removeItem(CHECKOUT_CONTEXT_STORAGE_KEY)
      } catch (error) {
        const message = error instanceof Error
          ? error.message
          : "No pudimos confirmar tu pago PayPhone en este momento."

        setErrorMessage(message)
      } finally {
        setIsLoading(false)
      }
    }

    void confirmCheckout()
  }, [])

  const normalizedStatus = confirmationResult?.confirmation.normalizedStatus
  const isApprovedPendingReview = confirmationResult?.approved === true

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
            {isLoading ? <Loader2 className="size-7 animate-spin" /> : isApprovedPendingReview ? <CheckCircle2 className="size-7" /> : <AlertCircle className="size-7" />}
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">PayPhone priority</p>
            <h1 className="text-2xl font-bold">Resultado del pago</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
            Estamos confirmando tu pago con PayPhone. Esto puede tardar unos segundos.
          </div>
        ) : errorMessage ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
              <p className="font-semibold">No pudimos confirmar el pago automáticamente</p>
              <p className="mt-2 text-sm">{errorMessage}</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
              Si el débito ya se realizó, NO significa activación inmediata. El pago debe quedar validado y pasar por revisión manual/admin.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`rounded-2xl p-5 ${isApprovedPendingReview ? "border border-green-200 bg-green-50 text-green-900" : "border border-amber-200 bg-amber-50 text-amber-900"}`}>
              <p className="font-semibold">
                {isApprovedPendingReview ? "Pago registrado correctamente" : "La confirmación fue procesada"}
              </p>
              <p className="mt-2 text-sm">
                {isApprovedPendingReview
                  ? "Tu pago fue validado y registramos tu perfil/solicitud. Todo quedó pendiente de revisión/validación manual; NO hay activación automática."
                  : "PayPhone devolvió un estado distinto de aprobado. Si necesitás continuar, revisá el estado con soporte o intentá nuevamente."}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
              <p><span className="font-semibold text-slate-900">Estado PayPhone:</span> {normalizedStatus || "sin estado informado"}</p>
              <p className="mt-2"><span className="font-semibold text-slate-900">Transacción:</span> {confirmationResult?.transaction.client_transaction_id}</p>
              {confirmationResult?.manualReviewMessage ? (
                <p className="mt-2"><span className="font-semibold text-slate-900">Revisión:</span> {confirmationResult.manualReviewMessage}</p>
              ) : null}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Home className="size-4" />
            Volver al inicio
          </Link>
          <Link
            href="/crear-perfil?plan=priority&payment=payphone"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            <ArrowLeft className="size-4" />
            Volver al formulario
          </Link>
        </div>
      </div>
    </main>
  )
}
