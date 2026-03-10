# Guía de Integración Frontend: Gestión de Artículos (Admin)

Este documento describe los cambios recientes no commiteados en el backend que habilitan a los Administradores (`superadmin`, `moderador` y `editor`) a gestionar completamente el módulo de artículos. También incluye una guía sobre cómo el Frontend debe consumir estos nuevos y actualizados endpoints.

---

## 🛠️ Resumen de Cambios (Backend) No Commiteados

1. **Nuevo Middleware de Autorización (`middlewares/auth.js`)**:
   Se creó el middleware `isProfesionalOrAdmin` para reemplazar `isProfesional` en rutas de creación y edición, permitiendo el acceso tanto a profesionales como a administradores y editores.
2. **Actualización de Rutas (`routes/articulos.routes.js`)**:
   - `POST /` (Crear Artículo): Usa el nuevo middleware `isProfesionalOrAdmin`.
   - `PUT /:id` (Editar Artículo): Usa el nuevo middleware `isProfesionalOrAdmin`.
   - `GET /admin/todos` (Listado Completo Admin): Nueva ruta exclusiva para administradores. Protegida por el middleware `canModerateArticles`.
3. **Actualización de Lógica de Edición (`services/ArticuloService.js`)**:
   - Para el método `actualizarArticulo`, se agregó una validación que exime a los administradores de ser los dueños (autores) de un artículo, permitiendo así que puedan editar artículos de cualquier otro usuario sin recibir un error de tipo `403 No autorizado para modificar este articulo`.
4. **Nuevo Método para Listado de Moderación (`services/ArticuloService.js` / `controllers/articulo.controller.js`)**:
   - Se agregó el método `listarTodos` que devuelve absolutamente todos los registros de artículos (en base al `created_at` descendente) sin filtrar la columna `estado`. Esto permite visualizar los `borrador` y `archivados`.

---

## 🚀 Guía de Uso para el Frontend

### 1. Listado Competitivo del Panel de Administración

Anteriormente se consumía el endpoint público (`GET /api/articulos`), el cual únicamente retorna registros que en base de datos tienen `estado: "publicado"`.
A partir de ahora, el Panel del **Administrador/Moderador** debe consumir este nuevo endpoint:

- **Endpoint:** `GET /api/articulos/admin/todos`
- **Autorización:** Bearer Token de un usuario con rol `superadmin`, `moderador` o `editor`.
- **Respuesta:** Array completo de todos los artículos, indistinto de su estado (`borrador`, `publicado`, `archivado`), incluyendo los datos formativos del autor (`id`, `nombre`, `correo`, `foto_url`).

_Uso en la UI:_ Esto te permitirá construir una tabla en el panel administrativo donde podrás filtrar y actuar sobre artículos "borrador" de profesionales aún no publicados.

### 2. Creación de un Artículo por un Administrador

Para crear un artículo estando logueado como administrador, no hay necesidad de un endpoint diferente. El endpoint regular ahora acepta tokens de administrador.

- **Endpoint:** `POST /api/articulos`
- **Formato:** `multipart/form-data` (porque admite archivos como `imagen_portada` y `archivo_pdf`).
- **Estados aplicables:** Puedes de igual forma adjuntar en el body/form un campo `estado` (ej. `"borrador"`) si no lo quieres publicar directamente, caso contrario el endpoint inferirá `"publicado"` por defecto.

_Importante:_ En el payload enviado, ya no se obtendrá un `403 Acceso restringido a profesionales`.

### 3. Edición de Artículos (Ajenos)

Cuando un moderador o superadmin detecte un artículo que necesita una corrección (sea propio o de un profesional), puede utilizar el endpoint regular de actualización:

- **Endpoint:** `PUT /api/articulos/:id`
- **Formato:** `multipart/form-data`
- **Autorización:** Bearer Token del moderador o superadmin.
- **Acción:** Puede actualizar el contenido, el título, reemplazar las imágenes y hasta **cambiar el estado** del artículo desde "borrador" a "publicado". La solicitud será aprobada sin la validación previa de titularidad.
