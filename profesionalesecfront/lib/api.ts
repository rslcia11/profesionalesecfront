const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

interface RegisterData {
  nombre: string
  correo: string
  contrasena_hash: string
  rol_id: number
  telefono?: string
  cedula?: string
}

interface PerfilProfesionalData {
  profesion_id: number
  especialidad_id?: number
  ciudad_id?: number
  descripcion: string
  tarifa_hora?: number
}

interface ApiResponse {
  message?: string
  mensaje?: string
  token?: string
  usuario?: any
  perfil?: any
}

// Auth API
export const authApi = {
  async register(data: RegisterData): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/auth/registro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Error al registrar usuario")
    }

    return response.json()
  },

  async login(correo: string, contrasena_hash: string): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correo, contrasena_hash }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Error al iniciar sesión")
    }

    return response.json()
  },
}

// Profesional API
export const profesionalApi = {
  async crearPerfil(data: PerfilProfesionalData, token: string): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/profesionales/perfil`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Error al crear perfil profesional")
    }

    return response.json()
  },

  async subirDocumento(tipo: string, archivo: File, token: string): Promise<ApiResponse> {
    const formData = new FormData()
    formData.append("archivo", archivo)
    formData.append("tipo", tipo)

    const response = await fetch(`${API_URL}/profesionales/documentos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Error al subir documento")
    }

    return response.json()
  },
}

// Catálogos API
export const catalogosApi = {
  async obtenerProfesiones(): Promise<any[]> {
    const response = await fetch(`${API_URL}/catalogos/profesiones`)
    if (!response.ok) throw new Error("Error al obtener profesiones")
    return response.json()
  },

  async obtenerEspecialidades(): Promise<any[]> {
    const response = await fetch(`${API_URL}/catalogos/especialidades`)
    if (!response.ok) throw new Error("Error al obtener especialidades")
    return response.json()
  },

  async obtenerProvincias(): Promise<any[]> {
    const response = await fetch(`${API_URL}/catalogos/provincias`)
    if (!response.ok) throw new Error("Error al obtener provincias")
    return response.json()
  },

  async obtenerCiudades(): Promise<any[]> {
    const response = await fetch(`${API_URL}/catalogos/ciudades`)
    if (!response.ok) throw new Error("Error al obtener ciudades")
    return response.json()
  },
}

// Token helpers
export const saveToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
  }
}

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
}