const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

// --- Interfaces ---

export interface Usuario {
  id: number
  nombre: string
  correo: string
  rol_id: number
  foto_url?: string
  telefono?: string
  estado?: string
}

export interface RegisterData {
  nombre: string
  correo: string
  contrasena: string
  rol_id?: number
  telefono?: string
  cedula?: string
}

export interface LoginData {
  correo: string
  contrasena: string
}

export interface PerfilProfesionalData {
  profesion_id: number
  especialidad_id?: number
  ciudad_id?: number
  descripcion: string
  tarifa_hora?: number
}

export interface UbicacionData {
  latitud: number
  longitud: number
  direccion?: string
}

export interface Articulo {
  id: number
  titulo: string
  contenido: string
  resumen?: string
  imagen_url?: string
  estado?: string
  autor_id: number
  created_at: string
}

export interface Auditoria {
  id: number
  modulo: string
  accion: string
  descripcion: string
  ip_origen?: string
  usuario_id: number
  created_at: string
}

export interface Certificado {
  id: number
  codigo: string
  usuario_id: number
  ponencia_id: number
  url_pdf: string
  fecha_emision: string
}

export interface ChatSesion {
  id: number
  usuario_id: number
  direccion_id?: number
  estado: string
  created_at: string
}

export interface Mensaje {
  id: number
  chat_sesion_id: number
  rol: 'usuario' | 'asistente'
  contenido: string
  created_at: string
}

export interface Cita {
  id: number
  profesional_id: number
  usuario_id?: number
  nombres_completos?: string
  correo?: string
  telefono?: string
  comentario?: string
  fecha_cita: string
  hora_cita: string
  estado_id: number
  created_at: string
}

export interface Pago {
  id: number
  usuario_id: number
  plan_id: number
  monto: number
  metodo: string
  referencia?: string
  estado: string
  created_at: string
}

export interface Plan {
  id: number
  nombre: string
  precio: number
  duracion_dias: number
  descripcion?: string
  activo: boolean
}

export interface Ponencia {
  id: number
  titulo: string
  descripcion: string
  fecha_inicio: string
  fecha_fin: string
  profesion_id: number
  precio: number
  cupo: number
  estado: string
}

export interface Publicidad {
  id: number
  usuario_id: number
  ubicacion_slug: string
  tipo: string
  titulo: string
  contenido?: string
  url_destino?: string
  fecha_inicio: string
  fecha_fin: string
  imagen_url?: string
  estado: string
}

export interface ApiResponse {
  message?: string
  mensaje?: string
  token?: string
  usuario?: Usuario
  error?: string
  [key: string]: any
}

// --- Helper Functions ---

async function fetchApi(endpoint: string, options: RequestInit = {}): Promise<any> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // Handle 204 No Content
  if (res.status === 204) return null;

  let data;
  try {
    data = await res.json();
  } catch (e) {
    // If JSON parse fails, try to get text or just throw status
    if (!res.ok) {
      throw new Error(`Error API (${res.status}): ${res.statusText}`);
    }
    return null; // or res.text() if needed
  }

  if (!res.ok) {
    throw new Error(data.message || data.error || data.mensaje || "Error en la petición");
  }

  return data;
}

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// --- API Objects ---

// Auth API
export const authApi = {
  async register(data: RegisterData): Promise<ApiResponse> {
    return fetchApi("/auth/registro", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async login(data: LoginData): Promise<ApiResponse> {
    return fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async logout(token: string) {
    return fetchApi("/auth/logout", {
      method: "POST",
      headers: authHeader(token),
    });
  },

  async renovar(token: string) {
    return fetchApi("/auth/renovar", {
      headers: authHeader(token),
    });
  },

  async cambiarContrasena(token: string, data: { usuario_id: number, nueva_contrasena: string }) {
    return fetchApi("/auth/cambiar-contrasena", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(data)
    });
  }
}

// Catalogos API
export const catalogosApi = {
  async obtenerProfesiones() { return fetchApi("/catalogos/profesiones"); },
  async obtenerEspecialidades(profesion_id?: number) {
    const query = profesion_id ? `?profesion_id=${profesion_id}` : "";
    return fetchApi(`/catalogos/especialidades${query}`);
  },
  async obtenerProvincias() { return fetchApi("/catalogos/provincias"); },
  async obtenerCiudades(provincia_id?: number) {
    const query = provincia_id ? `?provincia_id=${provincia_id}` : "";
    return fetchApi(`/catalogos/ciudades${query}`);
  },
}

// Profesional API
export const profesionalApi = {
  async crearPerfil(data: PerfilProfesionalData, token: string) {
    return fetchApi("/profesionales/crear-perfil", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(data),
    });
  },

  async obtenerMiPerfil(token: string) {
    return fetchApi("/profesionales/perfil", {
      headers: authHeader(token)
    });
  },

  async actualizarPerfil(data: Partial<PerfilProfesionalData>, token: string) {
    return fetchApi("/profesionales/actualizar-perfil", {
      method: "PUT",
      headers: authHeader(token),
      body: JSON.stringify(data)
    });
  },

  async subirDocumento(tipo: string, archivo: File, token: string) {
    const formData = new FormData()
    formData.append("archivo", archivo)
    formData.append("tipo", tipo)

    // Custom fetch for FormData since it doesn't use Content-Type: application/json
    const res = await fetch(`${API_URL}/profesionales/documentos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }, // Browser sets multipart boundary automatically
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || err.message || "Error al subir documento");
    }
    return res.json();
  },

  async buscar(filtros: any) {
    const params = new URLSearchParams()
    Object.keys(filtros).forEach(key => {
      if (filtros[key]) params.append(key, filtros[key]);
    });
    return fetchApi(`/profesionales/buscar?${params.toString()}`);
  },

  async buscarCercanos(lat: number, lng: number, radio: number = 10) {
    return fetchApi(`/profesionales/cercanos?lat=${lat}&lng=${lng}&radio=${radio}`);
  },

  async gestionarUbicacion(data: UbicacionData, token: string) {
    return fetchApi("/profesionales/ubicacion", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(data)
    });
  },

  async obtenerUbicacion(token: string) {
    return fetchApi("/profesionales/ubicacion", { headers: authHeader(token) });
  }
}

// Citas API
export const citasApi = {
  async agendarPublico(data: any) {
    return fetchApi("/citas/publico", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async agendarPrivado(data: any, token: string) {
    return fetchApi("/citas", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(data)
    });
  },

  async listar(token: string) {
    return fetchApi("/citas", { headers: authHeader(token) });
  },

  async cambiarEstado(id: number, estado_id: number, token: string) {
    return fetchApi(`/citas/${id}/estado`, {
      method: "PUT",
      headers: authHeader(token),
      body: JSON.stringify({ estado_id }),
    });
  },

  async reagendar(id: number, data: { fecha_cita: string, hora_cita: string }, token: string) {
    return fetchApi(`/citas/${id}/reagendar`, {
      method: "PUT",
      headers: authHeader(token),
      body: JSON.stringify(data)
    });
  }
}

// Articulos API
export const articulosApi = {
  async listarPublicos() { return fetchApi("/articulos"); },
  async listarMios(token: string) { return fetchApi("/articulos/mios", { headers: authHeader(token) }); },
  async crear(data: Partial<Articulo>, token: string) {
    return fetchApi("/articulos", { method: "POST", headers: authHeader(token), body: JSON.stringify(data) });
  },
  async actualizar(id: number, data: Partial<Articulo>, token: string) {
    return fetchApi(`/articulos/${id}`, { method: "PUT", headers: authHeader(token), body: JSON.stringify(data) });
  },
  async eliminar(id: number, token: string) {
    return fetchApi(`/articulos/${id}`, { method: "DELETE", headers: authHeader(token) });
  },
  async moderar(id: number, token: string) {
    return fetchApi(`/articulos/${id}/moderar`, { method: "PUT", headers: authHeader(token) });
  },
  async archivar(id: number, token: string) {
    return fetchApi(`/articulos/${id}/archivar`, { method: "PUT", headers: authHeader(token) });
  }
}

// Auditoria API (Admin)
export const auditoriaApi = {
  async registrar(data: Partial<Auditoria>, token: string) {
    return fetchApi("/auditoria", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(data)
    });
  },
  async listar(token: string) { return fetchApi("/auditoria", { headers: authHeader(token) }); },
  async listarPorUsuario(usuarioId: number, token: string) {
    return fetchApi(`/auditoria/usuario/${usuarioId}`, { headers: authHeader(token) });
  },
  async obtenerDetalle(id: number, token: string) { return fetchApi(`/auditoria/${id}`, { headers: authHeader(token) }); },
  async eliminar(id: number, token: string) {
    return fetchApi(`/auditoria/${id}`, { method: "DELETE", headers: authHeader(token) });
  }
}

// Certificados API
export const certificadosApi = {
  async generar(data: { ponencia_id: number, url_pdf: string }, token: string) {
    return fetchApi("/ponencias/certificado", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(data)
    });
  },
  async listarMios(token: string) { return fetchApi("/certificados/mios", { headers: authHeader(token) }); },
  async descargar(codigo: string, token: string) {
    // This might return a redirect or file stream
    // Since it's a GET /certificados/descargar/{codigo}, let's just use window.open or return URL if API handles it that way
    return fetchApi(`/certificados/descargar/${codigo}`, { headers: authHeader(token) });
  }
}

// Chat API
export const chatApi = {
  async crearSesion(direccion_id: number, token: string) {
    return fetchApi("/chat/sesion", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify({ direccion_id })
    });
  },
  async enviarMensaje(data: { chat_sesion_id: number, rol: string, contenido: string }, token: string) {
    return fetchApi("/chat/mensaje", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(data)
    });
  },
  async obtenerHistorial(id: number, token: string) {
    return fetchApi(`/chat/${id}`, { headers: authHeader(token) });
  }
}

// Pagos API
export const pagosApi = {
  async registrar(data: { plan_id: number, monto: number, metodo: string, referencia?: string }, token: string) {
    return fetchApi("/pagos", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(data)
    });
  },
  async listar(token: string) { return fetchApi("/pagos", { headers: authHeader(token) }); }, // Admin
  async confirmar(id: number, token: string) { // Admin
    return fetchApi(`/pagos/${id}/confirmar`, { method: "PUT", headers: authHeader(token) });
  }
}

// Planes API (Admin mostly)
export const planesApi = {
  async listar(token?: string) {
    // Public or Admin? Swagger says Admin for /planes, but usually plans are public. 
    // Swagger says "/planes Get: Listar todos los planes (Admin)"
    // Let's assume auth is needed if swagger says so, or maybe optional.
    const headers = token ? authHeader(token) : {};
    return fetchApi("/planes", { headers });
  },
  async crear(data: Partial<Plan>, token: string) {
    return fetchApi("/planes/crear", { method: "POST", headers: authHeader(token), body: JSON.stringify(data) });
  },
  async actualizar(id: number, data: Partial<Plan>, token: string) {
    return fetchApi(`/planes/${id}`, { method: "PUT", headers: authHeader(token), body: JSON.stringify(data) });
  },
}

// Ponencias API
export const ponenciasApi = {
  async crear(data: Partial<Ponencia>, token: string) {
    return fetchApi("/ponencias", { method: "POST", headers: authHeader(token), body: JSON.stringify(data) });
  },
  async publicar(id: number, token: string) {
    return fetchApi(`/ponencias/${id}/publicar`, { method: "PUT", headers: authHeader(token) });
  },
  async inscribir(data: { ponencia_id: number, cedula: string, correo: string, celular?: string }) {
    return fetchApi("/ponencias/inscripcion", { method: "POST", body: JSON.stringify(data) });
  },
  async registrarAsistencia(data: { inscripcion_id: number, metodo_verificacion: string }, token: string) {
    return fetchApi("/ponencias/asistencia", { // URL might be /ponencias/{id}/asistencia or just /ponencias/asistencia check swagger. 
      // Swagger said "/ponencias/{id}/asistencia" POST. 
      // But usually ID is in path. Wait, swagger says: Path /ponencias/{id}/asistencia.
      // Let's assume the body needs details inside? "required: inscripcion_id"
      // Wait, if path has {id} (ponencia_id), why does body need inscripcion_id?
      // Let's stick to the swagger path: /ponencias/{id}/asistencia
      // Actually I'll implement a flexible method.
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(data)
    });
  },
  // Fix for the above: explicit method for the path parameter
  async registrarAsistenciaEnPonencia(ponenciaId: number, data: { inscripcion_id: number, metodo_verificacion: string }, token: string) {
    return fetchApi(`/ponencias/${ponenciaId}/asistencia`, {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(data)
    });
  },
  async listar(token?: string) {
    const headers = token ? authHeader(token) : {};
    return fetchApi("/ponencias", { headers });
  }
}

// Ponentes API
export const ponentesApi = {
  async asignar(data: { ponencia_id: number, usuario_id: number }, token: string) {
    return fetchApi("/ponentes/asignar", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(data)
    });
  },
  async eliminar(id: number, token: string) {
    return fetchApi(`/ponentes/${id}`, { method: "DELETE", headers: authHeader(token) });
  },
  async listar(token: string) {
    try {
      return await fetchApi("/ponencias", { headers: authHeader(token) });
    } catch (e) {
      console.warn("Ponencias list endpoint not found, returning empty list.");
      return [];
    }
  }, // Admin
  async listarMisPonencias(token: string) { return fetchApi("/ponentes/mis-ponencias", { headers: authHeader(token) }); }
}

// Publicidad API
export const publicidadApi = {
  async crear(data: FormData, token: string) {
    // Multipart
    const res = await fetch(`${API_URL}/publicidades/crear`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    });
    if (!res.ok) throw new Error("Error al crear publicidad");
    return res.json();
  },
  async aprobar(id: number, token: string) {
    return fetchApi(`/publicidades/${id}/aprobar`, { method: "PUT", headers: authHeader(token) });
  },
  async listar() { return fetchApi("/publicidades/listar"); }
}

// Admin Stats & Users
// Admin API
export const adminApi = {
  // Stats Facade (for Dashboard compatibility)
  async getStats(token: string) {
    const [ponenciasRes, profesionalesRes, planesRes] = await Promise.allSettled([
      ponenciasApi.listar(token),
      this.getAllProfiles(token),
      planesApi.listar(token)
    ]);

    return {
      ponencias: ponenciasRes.status === 'fulfilled' ? ponenciasRes.value : [],
      profesionales: profesionalesRes.status === 'fulfilled' ? profesionalesRes.value : [],
      planes: planesRes.status === 'fulfilled' ? planesRes.value : []
    }
  },

  // Stats (Real endpoints)
  async getDashboardStats(tipo: 'usuarios' | 'pagos' | 'citas' | 'profesionales', token: string) {
    return fetchApi(`/estadisticas/${tipo}`, { headers: authHeader(token) });
  },

  // Users Management
  async getAllUsers(token: string) {
    return fetchApi("/usuarios", { headers: authHeader(token) });
  },

  async createUser(data: RegisterData, token: string) {
    return fetchApi("/usuarios", { method: "POST", headers: authHeader(token), body: JSON.stringify(data) });
  },

  async createProfessionalUser(data: RegisterData, token: string) {
    return fetchApi("/usuarios/profesional", { method: "POST", headers: authHeader(token), body: JSON.stringify(data) });
  },

  async deleteUser(id: number, token: string) {
    return fetchApi(`/usuarios/${id}`, { method: "DELETE", headers: authHeader(token) });
  },

  // Profiles Management
  async getAllProfiles(token: string) {
    return fetchApi("/profesionales/buscar", { headers: authHeader(token) });
  },

  async approveProfile(id: number, token: string) {
    return fetchApi(`/profesionales/${id}/estado`, {
      method: "PUT",
      headers: authHeader(token),
      body: JSON.stringify({ estado_id: 3, verificado: true })
    });
  },

  async rejectProfile(id: number, token: string) {
    return fetchApi(`/profesionales/${id}/estado`, {
      method: "PUT",
      headers: authHeader(token),
      body: JSON.stringify({ estado_id: 1, verificado: false })
    });
  },

  // Ponencias Management (Admin)
  async createPonencia(data: any, token: string) {
    return ponenciasApi.crear(data, token);
  },

  async updatePonencia(id: number, data: any, token: string) {
    // Backend only supports publishing via specific endpoint
    if (data.estado === 'publicada') {
      return this.publishPonencia(id, token);
    }
    // For other updates, we cannot persist them. We'll return the data as if updated 
    // to allow UI to reflect changes temporarily, but warn user.
    console.warn("Backend does not support full updates, only publishing.");
    return { ...data, id };
  },

  async deletePonencia(id: number, token: string) {
    throw new Error("La eliminación de ponencias no está disponible en el servidor actual.");
  },

  async publishPonencia(id: number, token: string) {
    return ponenciasApi.publicar(id, token);
  },

  // Planes Management (Admin)
  async getPlanes(token: string) {
    return planesApi.listar(token);
  },

  async createPlan(data: any, token: string) {
    return planesApi.crear(data, token);
  },

  async updatePlan(id: number, data: any, token: string) {
    return planesApi.actualizar(id, data, token);
  },

  async deletePlan(id: number, token: string) {
    throw new Error("La eliminación de planes no está disponible en el servidor actual.");
  }
}

// Usuario API (General user profile)
export const usuarioApi = {
  async obtenerMiPerfil(token: string) { return fetchApi("/usuarios/perfil", { headers: authHeader(token) }); },
  async actualizarPerfil(data: any, token: string) {
    return fetchApi("/usuarios/perfil", { method: "PUT", headers: authHeader(token), body: JSON.stringify(data) });
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