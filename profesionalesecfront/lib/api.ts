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

  async listarTodos(): Promise<any[]> {
    const response = await fetch(`${API_URL}/profesionales`)
    if (!response.ok) throw new Error("Error al obtener profesionales")
    return response.json()
  },

  async buscar(filtros: any): Promise<any[]> {
    const params = new URLSearchParams()

    if (filtros.profesion_id) params.append("profesion_id", filtros.profesion_id)
    if (filtros.especialidad_id) params.append("especialidad_id", filtros.especialidad_id)
    if (filtros.provincia_id) params.append("provincia_id", filtros.provincia_id)
    if (filtros.ciudad_id) params.append("ciudad_id", filtros.ciudad_id)
    if (filtros.nombre) params.append("nombre", filtros.nombre)

    const response = await fetch(`${API_URL}/profesionales/buscar?${params.toString()}`)
    if (!response.ok) throw new Error("Error al buscar profesionales")
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

// Admin API
export const adminApi = {
  // Stats
  // Stats
  async getStats(token: string) {
    // Para simplificar, obtenemos los arrays y contamos en el front
    // En produccion deberia haber un endpoint /admin/stats

    // Usamos Promis.allSettled para que si falla uno (ej. ponencias), carguen los demás
    const [ponenciasResult, profesionalesResult, planesResult] = await Promise.allSettled([
      this.getPonencias(token),
      this.getAllProfiles(token),
      this.getPlanes(token)
    ]);

    return {
      ponencias: ponenciasResult.status === 'fulfilled' ? ponenciasResult.value : [],
      profesionales: profesionalesResult.status === 'fulfilled' ? profesionalesResult.value : [],
      planes: planesResult.status === 'fulfilled' ? planesResult.value : []
    }
  },

  // Ponencias
  async getPonencias(token: string) {
    const response = await fetch(`${API_URL}/ponencias`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!response.ok) throw new Error("Error al obtener ponencias")
    return response.json()
  },

  async createPonencia(data: any, token: string) {
    const response = await fetch(`${API_URL}/ponencias`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error("Error al crear ponencia")
    return response.json()
  },

  async updatePonencia(id: number, data: any, token: string) {
    const response = await fetch(`${API_URL}/ponencias/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error("Error al actualizar ponencia")
    return response.json()
  },

  async deletePonencia(id: number, token: string) {
    const response = await fetch(`${API_URL}/ponencias/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!response.ok) throw new Error("Error al eliminar ponencia")
    return response.json()
  },

  async publishPonencia(id: number, token: string) {
    const response = await fetch(`${API_URL}/ponencias/${id}/publicar`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!response.ok) throw new Error("Error al publicar ponencia")
    return response.json()
  },

  // Perfiles - Obtener TODOS los profesionales (para admin)
  async getAllProfiles(token: string) {
    const response = await fetch(`${API_URL}/profesionales`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!response.ok) throw new Error("Error al obtener profesionales")
    return response.json()
  },

  async approveProfile(id: number, token: string) {
    const response = await fetch(`${API_URL}/profesionales/${id}/estado`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ estado_id: 3, verificado: true }) // 3 = Aprobado/Verificado
    })
    if (!response.ok) throw new Error("Error al aprobar perfil")
    return response.json()
  },

  async rejectProfile(id: number, token: string) {
    const response = await fetch(`${API_URL}/profesionales/${id}/estado`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ estado_id: 1, verificado: false }) // 1 = Borrador/Rechazado (o puedes usar otro estado_id si existe)
    })
    if (!response.ok) throw new Error("Error al rechazar perfil")
    return response.json()
  },

  // Planes
  async getPlanes(token: string) {
    const response = await fetch(`${API_URL}/planes`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!response.ok) throw new Error("Error al obtener planes")
    return response.json()
  },

  async createPlan(data: any, token: string) {
    const response = await fetch(`${API_URL}/planes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error("Error al crear plan")
    return response.json()
  },

  async updatePlan(id: number, data: any, token: string) {
    const response = await fetch(`${API_URL}/planes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error("Error al actualizar plan")
    return response.json()
  },

  async deletePlan(id: number, token: string) {
    // Soft delete: update active to false
    const response = await fetch(`${API_URL}/planes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ activo: false })
    })
    if (!response.ok) throw new Error("Error al eliminar plan")
    return response.json()
  }
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