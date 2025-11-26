import Header from "@/components/header"
import MedicosHero from "@/components/medicos/medicos-hero"
import MedicosCategories from "@/components/medicos/medicos-categories"
import FeaturedDoctor from "@/components/medicos/featured-doctor"
import BlogSection from "@/components/medicos/blog-section"
import Footer from "@/components/footer"

export const metadata = {
  title: "Médicos - Profesionales.EC",
  description:
    "Encuentra los mejores médicos y especialistas de salud en Ecuador. Profesionales verificados a tu disposición.",
}

export default function MedicosPage() {
  return (
    <main className="w-full">
      <Header />
      <MedicosHero />
      <MedicosCategories />
      <FeaturedDoctor />
      <BlogSection />
      <Footer />
    </main>
  )
}
