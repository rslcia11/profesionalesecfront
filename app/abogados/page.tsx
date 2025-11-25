import Header from "@/components/header"
import Footer from "@/components/footer"
import LawyersHero from "@/components/lawyers-hero"
import LawyersServices from "@/components/lawyers-services"
import LawyersProfessionals from "@/components/lawyers-professionals"
import CTA from "@/components/cta"

export const metadata = {
  title: "Abogados - Profesionales.EC",
  description: "Encuentra los mejores abogados especializados en Ecuador. Derecho Penal, Civil y Laboral.",
}

export default function LawyersPage() {
  return (
    <main className="w-full">
      <Header />
      <LawyersHero />
      <LawyersServices />
      <LawyersProfessionals />
      <CTA />
      <Footer />
    </main>
  )
}


