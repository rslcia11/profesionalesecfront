import Header from "@/components/header"
import Hero from "@/components/hero"
import Services from "@/components/services"
import Convenios from "@/components/convenios"
import ConnectingProfessionals from "@/components/connecting-professionals"
import FeaturedProfessionals from "@/components/featured-professionals"
import LearnAndGrow from "@/components/learn-and-grow"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="w-full">
      <Header />
      <Hero />
      <Services />
      <Convenios />
      <ConnectingProfessionals />
      <FeaturedProfessionals />
      <LearnAndGrow />
      <Footer />
    </main>
  )
}
