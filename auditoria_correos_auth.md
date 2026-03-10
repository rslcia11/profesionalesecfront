# Auditoría: Flujos de Correo, Autenticación y Recuperación de Contraseña

## Resumen Ejecutivo

Los correos electrónicos **SÍ están implementados** en los puntos clave del flujo. La recuperación de contraseña tiene un flujo completo funcional (solicitud → email con link → formulario de reset → validación de token). Sin embargo, hay **3 problemas de branding** en el backend que deben corregirse.

---

## 1. Registro de Cuenta — ✅ Funciona

| Parte | Estado | Detalle |
|---|---|---|
| Backend `POST /auth/registrar` | ✅ | Crea usuario con bcrypt hash |
| Correo de bienvenida | ✅ | Se envía al correo del usuario |
| Contenido del email | ✅ | Dice "tu perfil está siendo revisado, te notificaremos" |
| Validación de contraseña | ✅ | 8+ chars, mayúscula, minúscula, número, carácter especial |

**Flujo:** Usuario se registra → Se crea con `rol_id: 2` (profesional) → Se envía email de bienvenida → Login bloqueado hasta aprobación del perfil.

---

## 2. Aprobación de Perfil — ✅ Funciona (con 1 bug de branding)

| Parte | Estado | Detalle |
|---|---|---|
| `ProfesionalService.estadoPerfil()` estado_id=3 | ✅ | Actualiza a `verificado: true` |
| Correo de aprobación | ✅ | Se envía con credenciales (correo + "la que definiste") |
| Correo de rechazo (estado_id=4) | ✅ | Se envía notificación de rechazo |

> [!WARNING]
> **Bug:** El link de login en el correo de aprobación está **hardcodeado** como `https://tudominio.com/login` en vez de usar `process.env.FRONTEND_URL`.
>
> **Archivo:** `services/ProfesionalService.js` línea 361
>
> ```diff
> - <a href="https://tudominio.com/login">Iniciar Sesión Aquí</a>
> + <a href="${process.env.FRONTEND_URL}/login">Iniciar Sesión Aquí</a>
> ```

---

## 3. Recuperación de Contraseña — ✅ Funciona completo

### Backend

| Paso | Endpoint | Estado |
|---|---|---|
| 1. Solicitar reset | `POST /auth/recuperar-contrasena` | ✅ Genera token crypto de 32 bytes, válido 1 hora |
| 2. Envío de email | `MailService.enviarCorreo()` | ✅ Usa template HTML con botón "Restablecer Contraseña" |
| 3. URL del reset | `FRONTEND_URL/restablecer?token=xxx` | ✅ Usa variable de entorno `FRONTEND_URL` |
| 4. Restablecer | `POST /auth/restablecer-contrasena` | ✅ Valida token + expiración + fuerza de contraseña |
| 5. Limpieza | Token se anula después del reset | ✅ `reset_password_token: null` |

### Frontend

| Página | Ruta | Estado |
|---|---|---|
| Solicitar recuperación | `/recuperar-contrasena` | ✅ Formulario con campo de correo → `authApi.solicitarRecuperacion()` |
| Restablecer contraseña | `/restablecer?token=xxx` | ✅ Lee token de URL → formulario nueva contraseña → `authApi.restablecerContrasena()` |

---

## 4. Cambio de Contraseña Temporal — ✅ Funciona

| Parte | Estado | Detalle |
|---|---|---|
| `POST /auth/cambiar-contrasena` | ✅ | Recibe `usuario_id` + `nueva_contrasena` |
| Flag `requiere_cambio_contrasena` | ✅ | Si es `true`, login devuelve 403 con `requiereCambio: true` |
| Correo de confirmación | ✅ | Notifica al usuario que la contraseña fue cambiada |

---

## 5. Login — ✅ Funciona con validaciones

| Validación | Estado | Detalle |
|---|---|---|
| Credenciales incorrectas | ✅ | Devuelve 401/404 genérico (no revela si el correo existe) |
| Contraseña temporal | ✅ | Si `requiere_cambio_contrasena = true` → 403 con `requiereCambio: true` |
| Perfil no aprobado | ✅ | Si `rol_id=2` y `PerfilProfesional.estado_id !== 3` → 403 "perfil en revisión" |
| Token JWT | ✅ | 4 horas de expiración, incluye `id`, `nombre`, `rol` |

---

## ⚠️ Problemas de Branding Encontrados (Backend — requiere fix en VPS)

Estos son problemas que **NO afectan funcionalidad** pero sí la profesionalidad:

### 1. Nombre del remitente incorrecto

**Archivo:** `services/core/mail.service.js` línea 20

```diff
- from: `"EcoAlerta" <${process.env.MAIL_USER}>`,
+ from: `"Profesionales.ec" <${process.env.MAIL_USER}>`,
```

### 2. Footer del template de recuperación incorrecto

**Archivo:** `utils/emailTemplates.js` línea 17

```diff
- Este es un mensaje automático de EcoAlerta. Por favor no respondas a este correo.
+ Este es un mensaje automático de Profesionales.ec. Por favor no respondas a este correo.
```

### 3. Link hardcodeado en correo de aprobación

**Archivo:** `services/ProfesionalService.js` línea 361

```diff
- <a href="https://tudominio.com/login">Iniciar Sesión Aquí</a>
+ <a href="${process.env.FRONTEND_URL}/login">Iniciar Sesión Aquí</a>
```

### 4. Email de rechazo referencia soporte incorrecto

**Archivo:** `services/ProfesionalService.js` línea 385

```diff
- soporte@ecoalerta.com
+ info@profesionales.ec (o el correo de soporte real)
```

---

## Diagrama del Flujo Completo

```mermaid
graph TD
    A[Usuario se registra] -->|POST /auth/registrar| B[Cuenta creada]
    B -->|"📧 Email: Bienvenida"| C[Espera aprobación]
    C -->|Admin aprueba estado_id=3| D[Perfil aprobado]
    D -->|"📧 Email: Aprobado + credenciales"| E[Login habilitado]
    C -->|Admin rechaza estado_id=4| F[Perfil rechazado]
    F -->|"📧 Email: Notificación rechazo"| G[Login bloqueado]
    
    E -->|POST /auth/login| H[JWT Token 4h]
    
    I[Olvidé contraseña] -->|POST /auth/recuperar-contrasena| J[Token crypto 32 bytes]
    J -->|"📧 Email: Link de reset 1h"| K[/restablecer?token=xxx]
    K -->|POST /auth/restablecer-contrasena| L[Contraseña actualizada]
    
    M[Contraseña temporal] -->|Login devuelve 403| N[/cambiar-contrasena]
    N -->|POST /auth/cambiar-contrasena| O[Flag limpiado]
    O -->|"📧 Email: Confirmación cambio"| E
```
