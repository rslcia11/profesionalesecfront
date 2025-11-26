"use client"

import { useState } from "react"

export function LoginDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Botón para abrir el diálogo */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-full bg-white text-gray-900 text-sm font-semibold shadow-sm hover:bg-gray-100 transition"
      >
        Iniciar sesión
      </button>

      {/* Fondo oscuro */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Iniciar sesión</h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Correo</label>
                <input
                  type="email"
                  className="border rounded-lg px-3 py-2 text-gray-900"
                  placeholder="tu@email.com"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  className="border rounded-lg px-3 py-2 text-gray-900"
                  placeholder="••••••••"
                />
              </div>

              <button className="mt-2 w-full bg-gray-900 text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition">
                Entrar
              </button>

              <button
                onClick={() => setOpen(false)}
                className="w-full py-2 text-gray-600 hover:text-gray-900 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
