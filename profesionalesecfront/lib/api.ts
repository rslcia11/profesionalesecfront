export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

// --- Interfaces ---

export interface Usuario {
  id: number
  nombre: string
  correo: string
  rol_id: number
  foto_url?: string
  telefono?: string
  cedula?: string // Added based on DB schema
  estado?: string
}

export interface RegisterData {
  nombre: string
  correo: string
  contrasena: string
  rol_id?: number
  telefono?: string
  cedula?: string
  foto_url?: string
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
  telefono?: string
  cedula?: string // Added
  foto_url?: string
  latitud?: number
  longitud?: number
  calle_principal?: string
  referencia?: string
  permitir_reagendar?: boolean
  tarifa?: number
  tarifa_hora?: number // Added for compatibility with admin view
}

export interface UbicacionData {
  latitud: number
  longitud: number
  direccion?: string
}

export interface Articulo {
  id: number
  usuario_id: number
  titulo: string
  contenido: string
  resumen?: string
  imagen_url?: string
  estado: "borrador" | "publicado" | "archivado"
  fecha_publicacion: string
  created_at: string
  updated_at: string
  autor?: {
    id: number
    nombre: string
    correo: string
    foto_url?: string
    perfil_profesional?: {
      profesion_id: number
      especialidad_id?: number
    }
  }
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
  slug?: string
  titulo: string
  descripcion: string
  fecha_inicio: string
  hora_inicio?: string
  fecha_fin: string
  hora_fin?: string
  subtitulo?: string
  profesion_id: number
  precio: number
  cupo: number
  estado: string
  provincia_id?: number
  ciudad_id?: number
  ciudad?: { id: number; nombre: string }
  provincia?: { id: number; nombre: string }
  direccion?: string
  latitud?: number
  longitud?: number
  imagen_banner?: string
  video_url?: string
  galeria_fotos?: string[] | any
  es_destacado?: boolean
  url_revista_general?: string
  foto_revista_general?: string
  resumen_formato?: string
  dias?: PonenciaDia[]
}

export interface PonenciaDia {
  id?: number
  ponencia_id?: number
  fecha: string
  orden: number
  titulo_dia?: string
  hora_inicio?: string
  hora_fin?: string
  ponentes?: PonenciaPonente[]
}

export interface PonenciaPonente {
  id?: number
  ponencia_id?: number
  dia_id?: number
  usuario_id?: number
  nombre_ponente?: string
  profesion?: string
  tema_charla?: string
  foto_revista_url?: string
  url_revista_personal?: string
  slug?: string // NUEVO
  biografia?: string // NUEVO
  video_url?: string // NUEVO
  slogan?: string // NUEVO
  fondo_banner?: string // PREMIUM
  galeria_fotos?: string[] // PREMIUM
  orden: number
  usuario?: { id: number; nombre: string; foto_url?: string }
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

export interface Revista {
  id: number
  titulo: string
  descripcion: string
  portada_url?: string
  pdf_url: string
  fecha_publicacion: string
  edicion?: string
  activo: boolean
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
  const isFormData = options.body instanceof FormData;
  const defaultHeaders: Record<string, string> = {};

  if (!isFormData) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
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
    throw new Error(data.error?.message || data.message || data.error || data.mensaje || "Error en la petición");
  }

  // Golden Rule #6: API Contract Support { data, error, meta }
  return data.data !== undefined ? data.data : data;
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
  },

  async verificarEmail(token: string): Promise<ApiResponse> {
    return fetchApi(`/auth/verificar-email/${token}`, {
      method: "GET",
    });
  },

  async solicitarRecuperacion(correo: string): Promise<ApiResponse> {
    return fetchApi("/auth/recuperar-contrasena", {
      method: "POST",
      body: JSON.stringify({ correo }),
    });
  },

  async restablecerContrasena(token: string, nueva_contrasena: string): Promise<ApiResponse> {
    return fetchApi("/auth/restablecer-contrasena", {
      method: "POST",
      body: JSON.stringify({ token, nueva_contrasena }),
    });
  }
}

// Catalogos API
export const catalogosApi = {
  async obtenerProfesiones() { return fetchApi("/catalogos/profesiones"); },
  async obtenerEspecialidades(profesion_id?: number) {
    // The backend does not properly filter by profesion_id via query parameter
    // So we fetch all and filter locally
    const data = await fetchApi(`/catalogos/especialidades`);
    if (profesion_id && Array.isArray(data)) {
      return data.filter((item: any) => item.profesion_id === profesion_id || item.profesiones_id === profesion_id);
    }
    return data;
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

  async obtenerMiPerfil(token: string, id?: number) {
    const query = id ? `?id=${id}` : ""
    return fetchApi(`/profesionales/perfil${query}`, {
      headers: authHeader(token)
    });
  },

  async actualizarPerfil(data: Partial<PerfilProfesionalData> & { id: number }, token: string) {
    return fetchApi("/profesionales/actualizar-perfil", {
      method: "PUT",
      headers: authHeader(token),
      body: JSON.stringify(data)
    });
  },

  async subirDocumento(tipo: string, archivo: File, token: string, perfilId?: number) {
    const formData = new FormData()
    formData.append("archivo", archivo)
    formData.append("tipo", tipo)
    if (perfilId) formData.append("perfilId", perfilId.toString())

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
      if (filtros[key] !== undefined && filtros[key] !== null) params.append(key, filtros[key].toString());
    });
    return fetchApi(`/profesionales/buscar?${params.toString()}`);
  },

  async obtenerVerificados(filtros: any = {}) {
    const params = new URLSearchParams()
    Object.keys(filtros).forEach(key => {
      if (filtros[key] !== undefined && filtros[key] !== "") {
        params.append(key, filtros[key].toString());
      }
    });
    
    // Usamos fetch nativo para evitar que fetchApi nos quite el objeto `meta`
    const res = await fetch(`${API_URL}/profesionales/verificados?${params.toString()}`);
    if (!res.ok) {
      throw new Error("Error fetching verificados");
    }
    return res.json(); // Devolvemos el json completo { data: [...], meta: {...} }
  },

  async buscarCercanos(lat: number, lng: number, radio: number = 10) {
    return fetchApi(`/profesionales/cercanos?lat=${lat}&lng=${lng}&radio=${radio}`);
  },

  async obtenerPublico(slug: string) {
    return fetchApi(`/profesionales/publico/${slug}`);
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
  },

  async obtenerDestacados() {
    return fetchApi("/profesionales/destacados");
  },
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
    const headers = token ? authHeader(token) : {};
    return fetchApi("/planes/listar-planes", { headers });
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
  },
  async listarTodas(token: string) {
    return fetchApi("/ponencias/todas", { headers: authHeader(token) });
  },
  async obtener(slug: string) {
    return fetchApi(`/ponencias/${slug}`);
  },
  async obtenerPorId(id: number, token: string) {
    return fetchApi(`/ponencias/id/${id}`, { headers: authHeader(token) });
  },
  async listarInscritos(id: number, token: string) {
    return fetchApi(`/ponencias/${id}/inscritos`, { headers: authHeader(token) });
  },
  async estadoCupos(id: number) {
    return fetchApi(`/ponencias/${id}/estado-cupos`);
  },
  async generarCertificadosMasivo(id: number, token: string) {
    return fetchApi(`/ponencias/${id}/generar-certificados-masivo`, {
      method: "POST",
      headers: authHeader(token),
    });
  },
  async actualizar(id: number, data: Partial<Ponencia>, token: string) {
    return fetchApi(`/ponencias/${id}`, {
      method: "PUT",
      headers: authHeader(token),
      body: JSON.stringify(data)
    });
  },
}

// Revistas API
export const revistaApi = {
  async listarPublicadas() { return fetchApi("/revistas"); },
  async listarTodas(token: string) { return fetchApi("/revistas/todas", { headers: authHeader(token) }); },
  async crear(data: Partial<Revista>, token: string) {
    return fetchApi("/revistas", { method: "POST", headers: authHeader(token), body: JSON.stringify(data) });
  },
  async actualizar(id: number, data: Partial<Revista>, token: string) {
    return fetchApi(`/revistas/${id}`, { method: "PUT", headers: authHeader(token), body: JSON.stringify(data) });
  },
  async eliminar(id: number, token: string) {
    return fetchApi(`/revistas/${id}`, { method: "DELETE", headers: authHeader(token) });
  }
}

// Ponentes API
export const ponentesApi = {
  async asignar(data: { ponencia_id: number, usuario_id?: number, nombre_ponente?: string }, token: string) {
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
      return await fetchApi("/ponentes", { headers: authHeader(token) });
    } catch (e) {
      console.warn("Ponentes list endpoint not found, returning empty list.");
      return [];
    }
  }, // Admin
  async listarMisPonencias(token: string) { return fetchApi("/ponentes/mis-ponencias", { headers: authHeader(token) }); },
  async obtenerPerfilPublico(ponenciaId: string | number, slug: string) {
    return fetchApi(`/ponentes/perfil/${ponenciaId}/${slug}`);
  }
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
      ponenciasApi.listarTodas(token).catch(() => ponenciasApi.listar(token)),
      this.getAllProfiles(token),
      planesApi.listar(token)
    ]);

    // Extract arrays from API responses (APIs return { ponencias: [...] }, { planes: [...] }, etc.)
    const ponenciasData = ponenciasRes.status === 'fulfilled' ? ponenciasRes.value : {};
    const profesionalesData = profesionalesRes.status === 'fulfilled' ? profesionalesRes.value : [];
    const planesData = planesRes.status === 'fulfilled' ? planesRes.value : {};

    return {
      ponencias: Array.isArray(ponenciasData) ? ponenciasData : (ponenciasData.ponencias || []),
      profesionales: Array.isArray(profesionalesData) ? profesionalesData : [],
      planes: Array.isArray(planesData) ? planesData : (planesData.planes || [])
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
    return fetchApi("/profesionales", { headers: authHeader(token) });
  },

  async approveProfile(id: number, token: string) {
    return fetchApi(`/profesionales/estado-perfil/${id}`, {
      method: "PUT",
      headers: authHeader(token),
      body: JSON.stringify({ estado: "aprobado" })
    });
  },

  async rejectProfile(id: number, token: string) {
    return fetchApi(`/profesionales/estado-perfil/${id}`, {
      method: "PUT",
      headers: authHeader(token),
      body: JSON.stringify({ estado: "rechazado" })
    });
  },

  // Ponencias Management (Admin)
  async createPonencia(data: any, token: string) {
    return ponenciasApi.crear(data, token);
  },

  async updatePonencia(id: number, data: any, token: string) {
    // 1. Update general fields
    const updateRes = await fetchApi(`/ponencias/${id}`, {
      method: "PUT",
      headers: authHeader(token),
      body: JSON.stringify(data)
    });

    // 2. If the user wants to publish, call the separate publish endpoint
    if (data.estado === 'publicada') {
      await this.publishPonencia(id, token);
    }
    
    return updateRes;
  },

  async deletePonencia(id: number, token: string) {
    return fetchApi(`/ponencias/${id}`, {
      method: "DELETE",
      headers: authHeader(token)
    });
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
    return fetchApi(`/planes/${id}`, {
      method: "DELETE",
      headers: authHeader(token)
    });
  },

  async toggleDestacado(id: number, token: string) {
    return fetchApi(`/profesionales/destacado/${id}`, {
      method: "PATCH",
      headers: authHeader(token),
    });
  }
}

// Servicios API
export const serviciosApi = {
  async crear(data: { perfilId: number, descripcion: string }, token: string) {
    return fetchApi("/servicios", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(data),
    });
  },
  async listarMios(perfilId: number, token: string) {
    return fetchApi(`/servicios/mis-servicios?perfilId=${perfilId}`, { headers: authHeader(token) });
  },
  async listarPorPerfil(slug: string) {
    return fetchApi(`/servicios/perfil/${slug}`);
  },
  async actualizar(id: number, data: { descripcion: string }, token: string) {
    return fetchApi(`/servicios/${id}`, {
      method: "PUT",
      headers: authHeader(token),
      body: JSON.stringify(data),
    });
  },
  async eliminar(id: number, token: string) {
    return fetchApi(`/servicios/${id}`, {
      method: "DELETE",
      headers: authHeader(token),
    });
  },
}

// Usuario API (General user profile)
export const usuarioApi = {
  async obtenerMiPerfil(token: string) { return fetchApi("/usuarios/perfil", { headers: authHeader(token) }); },
  async actualizarPerfil(data: any, token: string) {
    return fetchApi("/usuarios/perfil", { method: "PUT", headers: authHeader(token), body: JSON.stringify(data) });
  }
}

// Multimedia API
export const multimediaApi = {
  async subir(archivo: File, folder = "conversatorios", token: string): Promise<{ url: string, public_id: string, format: string }> {
    const formData = new FormData()
    formData.append("archivo", archivo)
    formData.append("folder", folder)

    const res = await fetch(`${API_URL}/multimedia/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || err.message || "Error al subir archivo");
    }
    const data = await res.json();
    return data.data;
  }
}

// Articulos API
export const articulosApi = {
  async listarPublicados() {
    return fetchApi("/articulos");
  },
  async listarMios(token: string) {
    return fetchApi("/articulos/mios", { headers: authHeader(token) });
  },
  async crear(data: FormData | { titulo: string; contenido: string; resumen?: string; imagen_url?: string }, token: string) {
    if (data instanceof FormData) {
      return fetchApi("/articulos", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // Browser sets multipart boundary
        body: data,
      });
    }
    return fetchApi("/articulos", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(data),
    });
  },
  async actualizar(id: number, data: FormData | Partial<Articulo>, token: string) {
    if (data instanceof FormData) {
      return fetchApi(`/articulos/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
    }
    return fetchApi(`/articulos/${id}`, {
      method: "PUT",
      headers: authHeader(token),
      body: JSON.stringify(data),
    });
  },
  async eliminar(id: number, token: string) {
    return fetchApi(`/articulos/${id}`, {
      method: "DELETE",
      headers: authHeader(token),
    });
  },
  async moderar(id: number, token: string) {
    return fetchApi(`/articulos/${id}/moderar`, {
      method: "PUT",
      headers: authHeader(token),
    });
  },
  async archivar(id: number, token: string) {
    return fetchApi(`/articulos/${id}/archivar`, {
      method: "PUT",
      headers: authHeader(token),
    });
  },
  async listarTodos(token: string) {
    return fetchApi("/articulos/admin/todos", {
      headers: authHeader(token),
    });
  },
}

// Horarios API
export const horariosApi = {
  async obtenerPorPerfil(perfilId: number, token: string) {
    return fetchApi(`/horarios/perfil/${perfilId}`, {
      headers: authHeader(token),
    });
  },

  async actualizar(data: { perfilId: number; matriz: boolean[] }, token: string) {
    if (!data.matriz || data.matriz.length !== 168) {
      throw new Error(`La matriz de horario debe tener exactamente 168 elementos (7x24). Recibidos: ${data.matriz?.length || 0}`);
    }
    return fetchApi(`/horarios/actualizar`, {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify({
        perfilId: Number(data.perfilId),
        matriz: data.matriz
      }),
    });
  },

  async obtenerPublico(slug: string) {
    return fetchApi(`/horarios/publico/${slug}`);
  },
};

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
