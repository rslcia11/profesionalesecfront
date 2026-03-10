# Backend Ticket: Corregir Branding en Correos Electrónicos

**Prioridad:** Media — No afecta funcionalidad pero sí profesionalidad  
**Archivos a modificar:** 3

---

## Fix 1: Remitente dice "EcoAlerta" en vez de "Profesionales.ec"

**Archivo:** `services/core/mail.service.js` — línea 20

```diff
- from: `"EcoAlerta" <${process.env.MAIL_USER}>`,
+ from: `"Profesionales.ec" <${process.env.MAIL_USER}>`,
```

---

## Fix 2: Footer del template de recuperación dice "EcoAlerta"

**Archivo:** `utils/emailTemplates.js` — línea 17

```diff
- Este es un mensaje automático de EcoAlerta. Por favor no respondas a este correo.
+ Este es un mensaje automático de Profesionales.ec. Por favor no respondas a este correo.
```

---

## Fix 3: Link hardcodeado en correo de aprobación de perfil

**Archivo:** `services/ProfesionalService.js` — línea 361

```diff
- <a href="https://tudominio.com/login">Iniciar Sesión Aquí</a>
+ <a href="${process.env.FRONTEND_URL}/login">Iniciar Sesión Aquí</a>
```

> [!CAUTION]
> Este es el más importante. Actualmente al aprobar un perfil, el profesional recibe un email con un link que va a `tudominio.com` — un dominio que no existe. Debe usar `FRONTEND_URL` como ya lo hace el correo de recuperación de contraseña.

---

## Fix 4: Correo de soporte incorrecto en email de rechazo

**Archivo:** `services/ProfesionalService.js` — línea 385

```diff
- soporte@ecoalerta.com
+ info@profesionales.ec
```

---

## Verificación

Después de aplicar los fixes, verificar con:

1. Registrar un nuevo usuario → Email debe llegar de "Profesionales.ec"
2. Aprobar un perfil desde admin → Email debe tener link funcional al login real
3. Rechazar un perfil → Email debe mostrar correo de soporte correcto
4. Solicitar recuperación de contraseña → Footer debe decir "Profesionales.ec"
