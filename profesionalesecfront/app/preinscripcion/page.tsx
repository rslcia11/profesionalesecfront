"use client"

import { useState } from "react"
import { Check, CreditCard, ArrowRight, Clock, Zap, Users, Shield } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function PreinscripcionPage() {
  const [selectedPlan, setSelectedPlan] = useState<"free" | "paid" | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Header />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              <Zap size={16} />
              ¡Estás a un paso de ser parte de Profesionales.ec!
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent">
              Preinscripción Profesional
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Ahora millones de ecuatorianos podrán acceder a tus servicios profesionales. Elige la opción que mejor se
              ajuste a tus necesidades.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Free Plan */}
            <div
              className={`relative group bg-gradient-to-br from-gray-900 to-gray-800 border-2 rounded-2xl p-8 transition-all duration-500 cursor-pointer hover:scale-105 ${
                selectedPlan === "free"
                  ? "border-emerald-500 shadow-2xl shadow-emerald-500/20"
                  : "border-gray-700 hover:border-gray-600"
              }`}
              onClick={() => setSelectedPlan("free")}
            >
              {selectedPlan === "free" && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-in zoom-in duration-300">
                  Seleccionado
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <Users className="text-emerald-400" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Preinscripción GRATIS</h3>
                  <p className="text-emerald-400 text-sm font-medium">Sin costo inicial</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-white">$0</span>
                  <span className="text-gray-400 text-lg">USD</span>
                </div>
                <p className="text-gray-400 text-sm">Registro sin costo</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">Perfil profesional completo</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">Apareces en búsquedas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">Subir fotos y documentos</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">
                    Proceso de verificación estándar <span className="text-yellow-400 font-semibold">(3-5 días)</span>
                  </span>
                </li>
              </ul>

              <Link
                href="/crear-perfil"
                className={`w-full py-4 px-6 rounded-xl font-semibold text-center transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedPlan === "free"
                    ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg hover:shadow-emerald-500/50"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Inscribirme Gratis
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Paid Plan - Priority */}
            <div
              className={`relative group bg-gradient-to-br from-emerald-900/30 via-gray-900 to-gray-800 border-2 rounded-2xl p-8 transition-all duration-500 cursor-pointer hover:scale-105 ${
                selectedPlan === "paid"
                  ? "border-emerald-500 shadow-2xl shadow-emerald-500/30"
                  : "border-emerald-600/50 hover:border-emerald-500/70"
              }`}
              onClick={() => setSelectedPlan("paid")}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                ⚡ MÁS POPULAR
              </div>

              {selectedPlan === "paid" && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-in zoom-in duration-300">
                  Seleccionado
                </div>
              )}

              <div className="flex items-center gap-3 mb-6 mt-4">
                <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                  <Zap className="text-emerald-400" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Evita la Lista de Espera</h3>
                  <p className="text-emerald-400 text-sm font-medium">Activación inmediata</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                    $10
                  </span>
                  <span className="text-gray-400 text-lg">USD</span>
                </div>
                <p className="text-emerald-400 text-sm font-medium">Pago único - Sin mensualidades</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-white font-medium">Todo lo del plan gratuito</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-white font-medium">
                    Verificación prioritaria <span className="text-emerald-400">(24-48 horas)</span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-white font-medium">Insignia de verificado destacada</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-white font-medium">Mejor posicionamiento en búsquedas</span>
                </li>
              </ul>

              <Link
                href="/crear-perfil?plan=priority"
                className={`w-full py-4 px-6 rounded-xl font-semibold text-center transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedPlan === "paid"
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-xl hover:shadow-emerald-500/50"
                    : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg"
                }`}
              >
                Inscribirme Ahora - $10
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Payment Methods for Paid Plan */}
          {selectedPlan === "paid" && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-center text-white">Métodos de Pago Disponibles</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                        <CreditCard className="text-blue-400" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">Transferencia Bancaria</h4>
                        <p className="text-sm text-gray-400">Completa el formulario y realiza la transferencia</p>
                      </div>
                    </div>
                    <Link
                      href="/crear-perfil?plan=priority&payment=bank"
                      className="w-full block text-center py-3 px-4 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-all"
                    >
                      Continuar con Transferencia
                    </Link>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                        <CreditCard className="text-emerald-400" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">Tarjeta de Crédito/Débito</h4>
                        <p className="text-sm text-gray-400">Completa el formulario y realiza el pago</p>
                      </div>
                    </div>
                    <Link
                      href="/crear-perfil?plan=priority&payment=card"
                      className="w-full block text-center py-3 px-4 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-500 transition-all"
                    >
                      Continuar con Tarjeta
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trust Badges */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">1000+</div>
              <div className="text-sm text-gray-400">Profesionales Activos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">5000+</div>
              <div className="text-sm text-gray-400">Búsquedas Diarias</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">24/7</div>
              <div className="text-sm text-gray-400">Soporte Técnico</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">100%</div>
              <div className="text-sm text-gray-400">Seguro</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
