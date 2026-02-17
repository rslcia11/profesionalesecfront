# 🎫 Ticket Técnico: Upgrade Módulo de Artículos (Media & Uploads)

## 📌 Objetivo

Habilitar el soporte para archivos adjuntos (Imágenes y PDFs) en el módulo de artículos y permitir la subida de archivos reales a Cloudinary/Servidor, superando la limitación actual de solo "URLs de texto".

## 🛠 Requerimientos del Backend

### 1. Modelo de Datos (`models/Articulo.js`)

- [ ] __Añadir campo `pdf_url`__: TIPO `STRING` o `TEXT` para almacenar el enlace al archivo PDF adjunto.
- [ ] **Añadir campo `metadata` (Opcional)**: TIPO `JSON` para almacenar información adicional de los archivos (tamaño, nombre original).

### 2. Middleware de Subida (`routes/articulos.routes.js`)

- [ ] **Integrar `multer`**: Configurar el router para aceptar `multipart/form-data`.
- [ ] __Campos requeridos__: `imagen_portada` (1 archivo) y `archivo_pdf` (1 archivo).

### 3. Lógica de Controlador (`controllers/articulo.controller.js` & `ArticuloService.js`)

- [ ] **Integrar `CloudinaryService`**: Procesar los archivos recibidos en `req.files` y subirlos a Cloudinary.
- [ ] **Actualizar CRUD**:
   - En `crear`: Guardar las URLs retornadas por Cloudinary en `imagen_url` y `pdf_url`.
   - En `actualizar`: Manejar el reemplazo de archivos (si se sube uno nuevo, eliminar el anterior de Cloudinary).

## 🚀 Endpoint Final Esperado

`POST /api/articulos`

- Headers: `Content-Type: multipart/form-data`
- Body:
   - `titulo`: String
   - `contenido`: String (HTML/Markdown)
   - `resumen`: String
   - `imagen`: File (Imagen)
   - `pdf`: File (PDF)

## ⚠️ Notas de Seguridad

- Validar mimetypes: Solo permitir `image/*` para la portada y `application/pdf` para el adjunto.
- Límite de tamaño: 5MB por archivo.

Confirmado: Con lo que hay actualmente, no se puede subir desde la PC al módulo de artículos.

Aquí la confirmación técnica de por qué:

El "Embudo" está cerrado: El backend de artículos está configurado para recibir solo texto (application/json). Si le envías un archivo desde la PC (multipart/form-data), el servidor simplemente lo ignora o da error porque no tiene el "receptor" (llamado Multer) activado para esa ruta.
La Base de Datos es limitada: Actualmente, la tabla de artículos solo tiene un espacio para guardar una "dirección web" (URL) de imagen, pero no tiene donde guardar un PDF.
Falta el puente a la nube: Aunque el proyecto sabe subir cosas a la nube (Cloudinary), el código de artículos no tiene "conectado" ese servicio todavía.
En conclusión: Aunque el motor de subida existe en el proyecto (en otros módulos), el módulo de artículos es una "puerta" que ahora mismo solo acepta texto. Para que puedas subir desde tu PC, sí o sí hay que hacer los cambios que te mencioné en el Back (o que los haga quien corresponda con el ticket que te dejé).

¿Te gustaría que simplemente profesionalicemos el diseño del editor de texto para que al menos puedas escribir con formato, o prefieres dejarlo así hasta que el Back esté listo?

