export interface ContactEmailData {
  nombre: string
  correo: string
  asunto: string
  mensaje: string
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export function buildContactEmailTemplate(data: ContactEmailData) {
  const nombre = escapeHtml(data.nombre)
  const correo = escapeHtml(data.correo)
  const asunto = escapeHtml(data.asunto)
  const mensaje = escapeHtml(data.mensaje).replaceAll("\n", "<br />")

  return {
    subject: `Nuevo mensaje de contacto: ${data.asunto}`,
    text: [
      "Nuevo mensaje desde /contacto",
      `Nombre: ${data.nombre}`,
      `Correo: ${data.correo}`,
      `Asunto: ${data.asunto}`,
      "Mensaje:",
      data.mensaje,
    ].join("\n"),
    html: `
      <div style="margin:0;padding:24px;background:#f8fafc;font-family:Inter,Segoe UI,Arial,sans-serif;color:#0f172a;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;box-shadow:0 10px 35px rgba(15,23,42,0.08);">
          <div style="padding:24px 28px;background:linear-gradient(135deg,#0f172a,#334155);color:#ffffff;">
            <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.8;">Profesionales.ec</p>
            <h1 style="margin:0;font-size:22px;line-height:1.3;">Nuevo mensaje de contacto</h1>
          </div>
          <div style="padding:28px;">
            <p style="margin:0 0 16px 0;font-size:14px;color:#475569;">Se recibió una nueva consulta desde la página <strong>/contacto</strong>.</p>
            <div style="border:1px solid #e2e8f0;border-radius:12px;padding:16px;background:#f8fafc;">
              <p style="margin:0 0 10px 0;"><strong>Nombre:</strong> ${nombre}</p>
              <p style="margin:0 0 10px 0;"><strong>Correo:</strong> ${correo}</p>
              <p style="margin:0 0 10px 0;"><strong>Asunto:</strong> ${asunto}</p>
              <p style="margin:0;"><strong>Mensaje:</strong><br />${mensaje}</p>
            </div>
          </div>
        </div>
      </div>
    `,
  }
}
