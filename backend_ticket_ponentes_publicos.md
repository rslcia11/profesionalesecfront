# Backend Ticket: Ponentes Públicos + Auditoría de Archivos en Artículos

## Ticket 1: Incluir ponentes en el endpoint público de ponencias

### Problema

El endpoint público `GET /ponencias` **no incluye** los ponentes asignados (`PonenciaPonentes`) en la respuesta, lo que impide mostrarlos en la página pública de detalle del conversatorio.

### Causa raíz

En `controllers/ponencia.controller.js` → método `listar()` (línea 17-24), el `include` solo tiene `Ciudad` y `Provincia`, pero **no** `PonenciaPonente`:

```js
// ACTUAL (líneas 17-24):
const ponencias = await Ponencia.findAll({
  where: { estado: "publicada" },
  include: [
    { model: Ciudad, as: "ciudad", attributes: ["id", "nombre"] },
    { model: Provincia, as: "provincia", attributes: ["id", "nombre"] }
  ],
  order: [["fecha_inicio", "DESC"]],
});
```

> [!IMPORTANT]
> La asociación `Ponencia.hasMany(PonenciaPonente)` ya existe en `models/index.js` (línea 283). Solo falta agregarlo al `include`.

### Solución — 1 línea

```diff
 // En controllers/ponencia.controller.js → listar()
+ import { PonenciaPonente, Usuario } from "../models/index.js"; // si no están importados
 
  const ponencias = await Ponencia.findAll({
    where: { estado: "publicada" },
    include: [
      { model: Ciudad, as: "ciudad", attributes: ["id", "nombre"] },
      { model: Provincia, as: "provincia", attributes: ["id", "nombre"] },
+     { model: PonenciaPonente, include: [{ model: Usuario, attributes: ["nombre"], required: false }] }
    ],
    order: [["fecha_inicio", "DESC"]],
  });
```

Esto hará que cada ponencia en la respuesta incluya un array `PonenciaPonentes` con los datos de cada ponente (nombre, rol, etc.), sin afectar ningún otro endpoint.

### Prioridad

**Alta** — Sin esto, los ponentes nunca son visibles para usuarios no autenticados.

---

## Ticket 2 (Informativo): Estado actual de archivos en artículos

### ✅ PDFs e imágenes están soportados al 100%

| Componente | Estado | Detalle |
|---|---|---|
| **Multer (upload)** | ✅ | Acepta `imagen_portada` + `archivo_pdf`, 5MB max cada uno |
| **Cloudinary (storage)** | ✅ | Imagen → `articulos/imagenes/`, PDF → `articulos/documentos/` |
| **Controller** | ✅ | `req.files.imagen_portada[0]` y `req.files.archivo_pdf[0]` |
| **Service** | ✅ | Sube a Cloudinary, guarda URL en `imagen_url` / `pdf_url`, limpia archivos locales |
| **Frontend FormData** | ✅ | Campos `imagen_portada` y `archivo_pdf` coinciden exactamente con el backend |
| **Frontend UI** | ✅ | File input con preview (imagen) + file input para PDF |

### Flujo completo verificado

```
Frontend (FormData) → POST /articulos → multer (5MB, disk) → Controller → ArticuloService
  ├── imagen_portada → Cloudinary("articulos/imagenes") → articulo.imagen_url
  └── archivo_pdf    → Cloudinary("articulos/documentos") → articulo.pdf_url
```

> [!NOTE]
> El límite de `express.json()` (100KB) **no afecta** a los artículos porque usan `multipart/form-data` (multer), no JSON. El error `PayloadTooLargeError` del log no es de artículos.
