"use client"

import { API_URL, getToken } from "../api"
import type {
  Convenio,
  ConvenioFiltros,
  CrearConvenioData,
  ActualizarConvenioData,
  CambiarEstadoData,
} from "../validators/convenio"

/**
 * Create auth header for API requests
 */
function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` }
}

/**
 * Fetch wrapper that handles errors and auth
 */
async function fetchConvenios(endpoint: string, options: RequestInit = {}): Promise<any> {
  const isFormData = options.body instanceof FormData
  const defaultHeaders: Record<string, string> = {}

  if (!isFormData) {
    defaultHeaders["Content-Type"] = "application/json"
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  })

  if (res.status === 204) return null

  let data
  try {
    data = await res.json()
  } catch (e) {
    if (!res.ok) {
      throw new Error(`Error API (${res.status}): ${res.statusText}`)
    }
    return null
  }

  if (!res.ok) {
    throw new Error(data.error?.message || data.message || data.error || data.mensaje || "Error en la petición")
  }

  if (data.meta !== undefined) {
    return data
  }

  return data.data !== undefined ? data.data : data
}

/**
 * Convenios API client
 */
export const conveniosApi = {
  /**
   * Listar convenios publicados (público)
   * GET /convenios
   */
  async listarPublicos(limit = 10, offset = 0): Promise<{ data: Convenio[]; meta: { total: number; limit: number; offset: number } }> {
    return fetchConvenios(`/convenios?limit=${limit}&offset=${offset}`)
  },

  /**
   * Listar todos los convenios (admin)
   * GET /convenios/admin
   */
  async listarAdmin(filtros: ConvenioFiltros = {}): Promise<{ data: Convenio[]; meta: { total: number; page: number; limit: number } }> {
    const params = new URLSearchParams()
    if (filtros.page) params.append("page", filtros.page.toString())
    if (filtros.limit) params.append("limit", filtros.limit.toString())
    if (filtros.estado) params.append("estado", filtros.estado)
    if (filtros.search) params.append("search", filtros.search)
    if (filtros.incluir_eliminados) params.append("incluir_eliminados", "true")

    const query = params.toString() ? `?${params.toString()}` : ""
    return fetchConvenios(`/convenios/admin${query}`, {
      headers: authHeader(getToken() || ""),
    })
  },

  /**
   * Obtener un convenio por ID (público)
   * GET /convenios/:id
   */
  async obtenerPorId(id: number | string): Promise<Convenio> {
    return fetchConvenios(`/convenios/${id}`)
  },

  /**
   * Obtener un convenio por ID (admin)
   * GET /convenios/:id/admin
   */
  async obtenerPorIdAdmin(id: number | string, incluirEliminados = false): Promise<Convenio> {
    const query = incluirEliminados ? "?incluir_eliminados=true" : ""
    return fetchConvenios(`/convenios/${id}/admin${query}`, {
      headers: authHeader(getToken() || ""),
    })
  },

  /**
   * Crear un nuevo convenio
   * POST /convenios
   */
  async crear(data: CrearConvenioData): Promise<Convenio> {
    const token = getToken()
    if (!token) throw new Error("No autenticado")
    return fetchConvenios("/convenios", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(data),
    })
  },

  /**
   * Actualizar un convenio existente
   * PUT /convenios/:id
   */
  async actualizar(id: number | string, data: ActualizarConvenioData): Promise<Convenio> {
    const token = getToken()
    if (!token) throw new Error("No autenticado")
    return fetchConvenios(`/convenios/${id}`, {
      method: "PUT",
      headers: authHeader(token),
      body: JSON.stringify(data),
    })
  },

  /**
   * Cambiar el estado de un convenio
   * PATCH /convenios/:id/estado
   */
  async cambiarEstado(id: number | string, estado: CambiarEstadoData["estado"]): Promise<{ id: number; estado: string; fechaPublicacion?: string }> {
    const token = getToken()
    if (!token) throw new Error("No autenticado")
    return fetchConvenios(`/convenios/${id}/estado`, {
      method: "PATCH",
      headers: authHeader(token),
      body: JSON.stringify({ estado }),
    })
  },

  /**
   * Eliminar un convenio (soft delete)
   * DELETE /convenios/:id
   */
  async eliminar(id: number | string): Promise<void> {
    const token = getToken()
    if (!token) throw new Error("No autenticado")
    return fetchConvenios(`/convenios/${id}`, {
      method: "DELETE",
      headers: authHeader(token),
    })
  },

  /**
   * Restaurar un convenio eliminado
   * POST /convenios/:id/restaurar
   */
  async restaurar(id: number | string): Promise<Convenio> {
    const token = getToken()
    if (!token) throw new Error("No autenticado")
    return fetchConvenios(`/convenios/${id}/restaurar`, {
      method: "POST",
      headers: authHeader(token),
    })
  },
}
