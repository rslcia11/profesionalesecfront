#!/bin/sh
set -e

PLACEHOLDER="__NEXT_PUBLIC_API_URL_PLACEHOLDER__"

if [ -n "$NEXT_PUBLIC_API_URL" ]; then
  echo "🔧 Inyectando variable de entorno en runtime para NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"
  
  # Buscar y reemplazar en todos los archivos JS autogenerados por Next.js
  find /app/.next -type f -name "*.js" -exec sed -i "s|${PLACEHOLDER}|${NEXT_PUBLIC_API_URL}|g" {} +
  
  # Reemplazar también en los archivos del servidor standalone
  if [ -f "/app/server.js" ]; then
    sed -i "s|${PLACEHOLDER}|${NEXT_PUBLIC_API_URL}|g" /app/server.js
  fi
else
  echo "⚠️ Advertencia: NEXT_PUBLIC_API_URL no está definido en el runtime."
fi

# Ejecutar el comando original que se le pasó (ej: node server.js)
exec "$@"
