"use client"

import { Suspense } from "react"
import ProfessionalForm from "@/components/professional-form"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function CreateAdditionalProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando formulario...</div>}>
          <ProfessionalForm isAdditionalProfile={true} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
