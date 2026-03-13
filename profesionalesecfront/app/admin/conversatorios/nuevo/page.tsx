"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ConversatorioForm from "@/components/conversatorio-form"
import { catalogosApi, adminApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NuevoConversatorioPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [profesiones, setProfesiones] = useState<any[]>([])
  const [provincias, setProvincias] = useState<any[]>([])

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        toast({ title: "Acceso Denegado", description: "Debes iniciar sesión como administrador.", variant: "destructive" })
        router.push("/login")
        return
      }

      try {
        // Verificar si es admin con una llamada que requiera ese rol
        await adminApi.getStats(token)
        
        // Cargar catálogos
        const [profs, provs] = await Promise.all([
          catalogosApi.obtenerProfesiones(),
          catalogosApi.obtenerProvincias()
        ])
        
        setProfesiones(Array.isArray(profs) ? profs : [])
        setProvincias(Array.isArray(provs) ? provs : [])
        setLoading(false)
      } catch (error) {
        console.error("Auth/Load error:", error)
        toast({ title: "Error", description: "No tienes permisos para acceder a esta página.", variant: "destructive" })
        router.push("/admin")
      }
    }

    checkAuthAndLoadData()
  }, [router, toast])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-bold animate-pulse">Cargando configuraciones...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Button 
                variant="outline" 
                onClick={() => router.push("/admin")}
                className="group border-slate-200 hover:border-blue-500 text-slate-600 hover:text-blue-600 bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl px-6 py-6 flex items-center gap-3 mb-8"
              >
                <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                  <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-400">Navegación</span>
                  <span className="block text-sm font-black text-slate-700">Volver al Dashboard Administrativo</span>
                </div>
              </Button>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Nuevo Conversatorio</h1>
              <p className="text-slate-500 font-medium italic">Configura una nueva experiencia de aprendizaje para la comunidad.</p>
            </div>
          </div>

          <ConversatorioForm 
            profesiones={profesiones} 
            provincias={provincias} 
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
