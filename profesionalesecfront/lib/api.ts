// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface RegisterUserData {
  nombre: string;
  correo: string;
  contrasena_hash: string;
  telefono?: string;
  cedula?: string;
  rol_id?: number;
}

interface RegisterResponse {
  message: string;
  token: string;
  usuario: {
    id: number;
    nombre: string;
    correo: string;
    rol_id: number;
    activo: boolean;
  };
}

export const authService = {
  /**
   * Registrar un nuevo usuario
   */
  async register(userData: RegisterUserData): Promise<RegisterResponse> {
    const response = await fetch(`${API_URL}/auth/registro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrar usuario');
    }

    return response.json();
  },

  /**
   * Iniciar sesión
   */
  async login(correo: string, contrasena: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo,
        contrasena_hash: contrasena,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al iniciar sesión');
    }

    return response.json();
  },
};

export default authService;