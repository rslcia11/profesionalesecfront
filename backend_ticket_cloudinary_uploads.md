# Ticket de Backend: Configuración de subida de imágenes/documentos (Cloudinary)

**Asignado a:** Equipo de Backend
**Severidad:** Crítica (Bloqueante)
**Módulo:** Registro de Perfil Profesional (`/api/profesionales/documentos`)

### 🐛 Descripción del Problema

Actualmente, todo intento de subir una foto de perfil, un documento de identidad (cédula frontal/posterior), un título o una licencia profesional al endpoint `POST /api/profesionales/documentos` falla en el entorno de producción (VPS).

El error devuelto por la API al solicitar la carga de archivos `multipart/form-data` es un error interno del servidor (HTTP 500) desencadenado por el SDK de Cloudinary.

**Log capturado en el frontend:**

```json
{
  "error": "Error al subir imagen a Cloudinary: Must supply cloud_name"
}
```

### 💡 Diagnóstico

El servidor backend no tiene configuradas (o no está leyendo correctamente) las variables de entorno asociadas a la cuenta de Cloudinary.

### ✅ Tareas Requeridas

1. Revisar el archivo `.env` del servidor backend remoto (VPS).
2. Asegurar que las variables de entorno de Cloudinary estén correctamente mapeadas y pobladas:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   *(O según los nombres exactos que usa el código de backend)*
3. Reiniciar el proceso del servidor backend (PM2/Docker) para que aplique la carga de las nuevas variables.
4. (Opcional) Agregar control de errores en la ruta para que responda un código de estado `500` más detallado si faltan las variables, pero idealmente corregir el entorno de producción.

### 🧪 Verificación esperada

Una vez configurado, el frontend podrá mandar archivos al endpoint sin recibir el error de credenciales faltantes y los profesionales podrán registrar correctamente sus evidencias.
