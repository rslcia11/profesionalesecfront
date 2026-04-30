import { NextResponse } from "next/server"
import { z } from "zod"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001"

const contactSchema = z.object({
  nombre: z.string().min(2, "Nombre inválido").max(120),
  correo: z.string().email("Correo inválido"),
  asunto: z.string().min(3, "Asunto inválido").max(160),
  mensaje: z.string().min(10, "Mensaje muy corto").max(3000),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          issues: parsed.error.issues,
        },
        { status: 400 }
      )
    }

    const response = await fetch(`${BACKEND_URL}/api/contacto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...parsed.data,
        source: "web-contacto",
      }),
    })

    if (!response.ok) {
      let backendError = "No se pudo enviar el mensaje"
      try {
        const payload = await response.json()
        backendError = payload?.error || payload?.message || backendError
      } catch {
        // ignore body parse errors
      }

      return NextResponse.json({ error: backendError }, { status: response.status })
    }

    return NextResponse.json({ ok: true, message: "Mensaje enviado" }, { status: 200 })
  } catch (error) {
    console.error("Error enviando contacto:", error)
    return NextResponse.json(
      { error: "Error interno al procesar la solicitud" },
      { status: 500 }
    )
  }
}
