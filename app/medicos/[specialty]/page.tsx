import Header from "@/components/header"
import SpecialtyProfessionals from "@/components/medicos/specialty-professionals"
import Footer from "@/components/footer"
import { notFound } from "next/navigation"

// Valid specialty slugs
const validSpecialties = [
  "odontologia",
  "nutricion",
  "medicina-general",
  "dermatologia",
  "urologia",
  "cardiologia",
  "toxicologia",
  "traumatologia",
  "radiologia",
  "reumatologia",
  "pediatria",
  "proctologia",
  "oftalmologia",
  "oncologia",
  "otorrinolaringologia",
  "neumologia",
  "inmunologia",
  "infectologia",
  "geriatria",
  "ginecologia",
  "enfermeria",
  "gastroenterologia",
  "endocrinologia",
  "medicina-especializada",
]

export function generateStaticParams() {
  return validSpecialties.map((specialty) => ({
    specialty,
  }))
}

export default async function SpecialtyPage({ params }: { params: Promise<{ specialty: string }> }) {
  const { specialty } = await params

  if (!validSpecialties.includes(specialty)) {
    notFound()
  }

  return (
    <main className="w-full">
      <Header />
      <SpecialtyProfessionals specialty={specialty} />
      <Footer />
    </main>
  )
}
