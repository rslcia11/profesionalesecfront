# TICKET TÉCNICO: Mejoras en Módulo de Ponencias (Conversatorios)

## Objetivo

Ampliar la capacidad del módulo de ponencias para registrar horarios específicos y permitir la asignación de ponentes externos que no poseen una cuenta en la plataforma.

## Cambios Requeridos

### 1. Modelos (Sequelize)

#### Ponencia (`models/Ponencia.js`)

Añadir soporte para horarios de inicio y fin:

- **hora_inicio**: `DataTypes.TIME`, allowNull: true.
- **hora_fin**: `DataTypes.TIME`, allowNull: true.

#### PonenciaPonente (`models/PonenciaPonente.js`)

Permitir el registro de ponentes sin cuenta de usuario:

- **usuario_id**: Cambiar a `allowNull: true`.
- **nombre_ponente**: Añadir campo `DataTypes.STRING(255)`, allowNull: true.

> [!NOTE]
> La tabla debe validar que al menos uno de los dos (`usuario_id` o `nombre_ponente`) esté presente.

### 2. Controladores (`controllers/ponente.controller.js`)

#### `asignar`

- Modificar para recibir opcionalmente `nombre_ponente`.
- Si se recibe `usuario_id`, se asocia al perfil profesional.
- Si se recibe `nombre_ponente`, se guarda como texto plano para ponentes externos.

#### `listar`

- Ajustar la consulta para que, si `usuario_id` es nulo, devuelva el `nombre_ponente` manual en el objeto de respuesta.
- Asegurar que el frontend reciba una estructura consistente para ambos casos (ej: un campo `nombre` unificado o bien diferenciado).

### 3. Rutas y Endpoints

- Mantener los endpoints actuales de `/api/ponencias` y `/api/ponentes`, asegurando que el `POST` y `PUT` de ponencias acepten los nuevos campos de hora.

## Criterios de Aceptación

1. Se puede crear una ponencia con `hora_inicio` y `hora_fin`.
2. Se puede asignar un ponente a una ponencia usando solo su nombre (sin ID de usuario).
3. El listado de ponentes devuelve tanto profesionales registrados como nombres manuales.
