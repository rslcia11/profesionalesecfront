import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { API_URL } from "./api"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUrl(path: string | null | undefined) {
  if (!path) return null;

  // Solución Modular: Si es un PDF de Cloudinary, usar el proxy para obtener URL firmada
  // Esto elimina errores 401 al usar firmas dinámicas en el backend
  if (path.includes('cloudinary.com') && path.toLowerCase().endsWith('.pdf')) {
    const match = path.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (match && match[1]) {
      // Eliminar el .pdf del final para el public_id si es necesario, 
      // pero el backend lo maneja mejor si va completo o sin extension.
      // Cloudinary prefiere el public_id sin extensión para firmas de recursos 'image'.
      const publicId = match[1].replace(/\.pdf$/i, '');
      return `${API_URL}/multimedia/view/${publicId}`;
    }
  }

  if (path.startsWith('http')) return path;
  const baseUrl = API_URL.replace('/api', '');
  return `${baseUrl}/${path.startsWith('/') ? path.slice(1) : path}`;
}
