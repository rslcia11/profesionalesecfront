"use client"

import { API_URL, getToken } from "../api"
import type {
  CarouselPlacement,
  CarouselPlacementResponse,
  CreateCarouselSlideData,
  ReorderCarouselSlidesData,
  UpdateCarouselSlideData,
} from "../validators/carousel"

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` }
}

async function fetchCarousels(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  let data: any = null
  try {
    data = await res.json()
  } catch {
    if (!res.ok) {
      throw new Error(`Error API (${res.status}): ${res.statusText}`)
    }
  }

  if (!res.ok) {
    throw new Error(data?.error?.message || data?.message || "Error en la petición")
  }

  return data?.data ?? data
}

export const carouselsApi = {
  async getPublic(placementKey: string): Promise<CarouselPlacementResponse> {
    return fetchCarousels(`/carruseles/${placementKey}`)
  },

  async listAdminPlacements(): Promise<CarouselPlacement[]> {
    const token = getToken()
    if (!token) throw new Error("No autenticado")
    return fetchCarousels("/carruseles/admin/placements", {
      headers: authHeader(token),
    })
  },

  async getAdminPlacement(placementKey: string, includeInactive = true): Promise<CarouselPlacementResponse> {
    const token = getToken()
    if (!token) throw new Error("No autenticado")
    const query = includeInactive ? "?includeInactive=true" : ""
    return fetchCarousels(`/carruseles/admin/${placementKey}${query}`, {
      headers: authHeader(token),
    })
  },

  async createSlide(payload: CreateCarouselSlideData) {
    const token = getToken()
    if (!token) throw new Error("No autenticado")
    return fetchCarousels("/carruseles/admin/slides", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(payload),
    })
  },

  async updateSlide(id: number, payload: UpdateCarouselSlideData) {
    const token = getToken()
    if (!token) throw new Error("No autenticado")
    return fetchCarousels(`/carruseles/admin/slides/${id}`, {
      method: "PUT",
      headers: authHeader(token),
      body: JSON.stringify(payload),
    })
  },

  async deleteSlide(id: number) {
    const token = getToken()
    if (!token) throw new Error("No autenticado")
    return fetchCarousels(`/carruseles/admin/slides/${id}`, {
      method: "DELETE",
      headers: authHeader(token),
    })
  },

  async reorderSlides(payload: ReorderCarouselSlidesData) {
    const token = getToken()
    if (!token) throw new Error("No autenticado")
    return fetchCarousels("/carruseles/admin/slides/reorder", {
      method: "PATCH",
      headers: authHeader(token),
      body: JSON.stringify(payload),
    })
  },
}
