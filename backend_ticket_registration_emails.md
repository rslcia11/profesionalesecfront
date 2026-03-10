# Ticket de Backend: Envío transaccional de correos (Nodemailer/SMTP)

**Asignado a:** Equipo de Backend
**Severidad:** Alta
**Módulo:** Autenticación (`/api/auth/registro` y recuperación)

### 🐛 Descripción del Problema

Cuando un usuario completa la creación de un perfil y se registra en la plataforma a través de `POST /api/auth/registro`, la base de datos guarda correctamente los registros, pero el sistema no dispara ningún correo de confirmación de registro ni de bienvenida.

Además, se ha reportado que los flujos de "Aprobación/Rechazo de perfil" y "Recuperación de contraseña" también están sufriendo problemas de entrega de correos electrónicos.

### 💡 Diagnóstico y Contexto

Dado que el Frontend envía toda la información correcta a los endpoints, la interrupción del flujo radica en la capa de Backend que procesa estas reglas de negocio. Esto usualmente se debe a alguna de las siguientes causas en el entorno de producción:

1. El archivo `.env` del servidor (VPS) no tiene configuradas las credenciales del host SMTP (Ej: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`).
2. El proveedor de correos (ej. Gmail, SES, SendGrid) bloqueó las peticiones porque faltan configuraciones de seguridad (como "Contraseñas de aplicación" en Gmail).
3. Hay un error interno no capturado (`try/catch`) en el bloque de código que invoca la función de enviar emails.

### ✅ Tareas Requeridas

1. Validar que la configuración de Nodemailer/Servicio de email esté apuntando al puerto y host SMTP correctos dentro del entorno remoto.
2. Hacer pruebas de envío locales para verificar que la cuenta de correo emisora no se encuentre bloqueada, o revisar la bandeja de "Alertas de seguridad" del proveedor del correo.
3. Asegurar de que los siguientes eventos disparen correos satisfactoriamente:
   - Registro exitoso (`/auth/registro`).
   - Perfil Profesional Aprobado / Rechazado.
   - Solicitud de Recuperación de contraseña (`/auth/recuperar-contrasena`).

### 🧪 Verificación esperada

Al registrarse utilizando un nuevo correo de prueba en la página `Crear Perfil`, la bandeja de entrada del usuario de pruebas debe recibir exitosamente un mail de la plataforma instantes después de que el frontend notifique el registro exitoso.
