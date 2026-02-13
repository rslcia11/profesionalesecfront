import { Suspense } from "react"
import ProfessionalForm from "@/components/professional-form"

export default function CreateProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando formulario...</div>}>
      <ProfessionalForm />
    </Suspense>
  )
}
