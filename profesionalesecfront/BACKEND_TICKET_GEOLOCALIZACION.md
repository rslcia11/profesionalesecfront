# Ticket Backend: Inclusión de Datos de Dirección en `obtenerVerificados`

## Contexto

Se ha implementado en el Frontend la funcionalidad de Geolocalización (Mapa Leaflet) para que los profesionales registren su ubicación exacta.
Estos datos (`latitud`, `longitud`, `calle_principal`, `referencia`) **YA se están guardando correctamente** en la base de datos (tablas `perfiles_profesionales` y `direcciones`) mediante los métodos `crearPerfil` y `actualizarPerfil` existentes.

## Problema Actual

El endpoint que alimenta el perfil público (`obtenerVerificados`) **NO retorna** la información de la dirección. Por lo tanto, aunque los datos existen en la BD, no se muestran en la  vista pública del perfil.

## Requerimiento

Modificar el método `obtenerVerificados` en `services/ProfesionalService.js` para que incluya la información de la dirección asociada al usuario profesional.

## Código Solicitado

Reemplazar el método actual por el siguiente:

```javascript
  // 8. OBTENER SOLO PERFILES VERIFICADOS
  static async obtenerVerificados() {
    // 1. Obtener los perfiles base con sus relaciones (Usuario, Profesion, etc.)
    const profesionales = await PerfilProfesional.findAll({
      where: { verificado: true },
      include: [
        { 
          model: Usuario, 
          as: "usuario", 
          attributes: ["id", "nombre", "correo", "foto_url", "telefono", "cedula"] 
        },
        { model: Profesion, as: "profesion", attributes: ["id", "nombre"] },
        { model: Especialidad, as: "especialidad", attributes: ["id", "nombre"] },
        {
          model: Ciudad,
          as: "ciudad",
          attributes: ["id", "nombre"],
          include: [{ model: Provincia, as: "provincia", attributes: ["id", "nombre"] }],
        },
        { model: Servicio, as: "servicios", attributes: ["servicio_id", "descripcion"] }
      ]
    });

    // 2. Iterar y anexar la dirección principal para cada profesional
    const resultados = [];
    for (const p of profesionales) {
      const dir = await Direccion.findOne({
        where: { usuario_id: p.usuario_id, es_principal: true },
        attributes: ["calle_principal", "referencia", "latitud", "longitud"],
      });

      resultados.push({
        ...p.toJSON(),
        direccion: dir
          ? {
              ...dir.toJSON(),
              link_maps: `https://www.google.com/maps?q=${dir.latitud},${dir.longitud}`,
            }
          : null,
      });
    }

    return resultados;
  }
```

## Pruebas

Una vez desplegado:

1. Acceder al detalle de un perfil verificado.

---

## 3. Actualización de Tipos de Documentos (Enum)

**Contexto:**
El formulario de registro ahora permite subir la **Cédula Frontal** y **Cédula Posterior** por separado.
Actualmente, el modelo `PerfilDocumento` tiene un ENUM restringido: `('cedula', 'titulo', 'certificado', 'licencia', 'otros')`.

**Requerimiento:**
Ampliar el ENUM del modelo `PerfilDocumento` (y en la base de datos) para soportar tipos más específicos.

**Cambio en Modelo (`models/PerfilDocumento.js`):**

```javascript
// Antes
tipo: { type: DataTypes.ENUM("cedula","titulo","certificado","licencia","otros") },

// Después
tipo: { type: DataTypes.ENUM("cedula", "cedula_frontal", "cedula_posterior", "titulo", "certificado", "licencia", "otros") },
```

**Nota:** Por ahora, el frontend está enviando ambos archivos con el tipo antiguo `"cedula"` para no romper el sistema actual. Una vez actualizado el backend, el frontend se actualizará para enviar los tipos correctos.
