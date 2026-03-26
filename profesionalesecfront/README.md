# ProfesionalEs

App web progresiva construida con [Next.js](https://nextjs.org), [Capacitor](https://capacitorjs.com/) y Tailwind CSS.

## Requisitos previos

- Node.js 18+
- npm / yarn / pnpm
- [Android Studio](https://developer.android.com/studio) (para Android)
- [Xcode](https://developer.apple.com/xcode/) (para iOS)
- Xcode Command Line Tools

## Desarrollo web

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3001](http://localhost:3001) en el navegador.

---

## Build para Android

```bash
# 1. Build de Next.js
npm run build

# 2. Sincronizar con Android
npx cap sync android
```

Abrir en Android Studio:

```bash
npx cap open android
```

O desde Android Studio: **File → Open** → seleccionar carpeta `android/`

### URL del servidor

Para desarrollo con emulator Android, la app se conecta a `http://10.0.2.2:3001` (IP especial del emulador Android para acessar el host).

**Nota**: Si el dev server está corriendo en otra IP (no localhost), cambiar la URL en `capacitor.config.ts`:

```typescript
server: {
  url: 'http://TU_IP:3001'
}
```

---

## Build para iOS

```bash
# 1. Build de Next.js
npm run build

# 2. Sincronizar con iOS
npx cap sync ios
```

Abrir en Xcode:

```bash
npx cap open ios
```

O desde Xcode: **File → Open** → seleccionar carpeta `ios/App/`

### URL del servidor

Para desarrollo con iOS Simulator, la app se conecta a `http://localhost:3001`.

---

## Notas importantes

- La app es **online-only** — requiere conexión a internet para funcionar correctamente
- El build de Next.js (`out/`) se ignora cuando `server.url` está configurado en `capacitor.config.ts`
- Para cambiar entre URLs de Android/iOS, editar `capacitor.config.ts`

## Estructura del proyecto

```
├── app/                  # Páginas de Next.js (App Router)
├── src/                  # Componentes y utilidades
├── public/               # Assets estáticos
├── ios/                  # Proyecto iOS (Capacitor)
├── android/              # Proyecto Android (Capacitor)
├── capacitor.config.ts   # Configuración de Capacitor
└── next.config.ts        # Configuración de Next.js
```

## Troubleshooting

### Pantalla en blanco en iOS

- Verificar que `server.url` en `capacitor.config.ts` apunte a `http://localhost:3001`
- Verificar que el dev server esté corriendo en `localhost:3001`

### Pantalla en blanco en Android

- Verificar que `server.url` apunte a `http://10.0.2.2:3001` (emulador) o la IP de tu computadora (dispositivo real)
- En dispositivo real, la computadora y el celular deben estar en la misma red WiFi

### Errores de sincronización

```bash
# Limpiar y resincronizar
npx cap sync android --force
npx cap sync ios --force
```
