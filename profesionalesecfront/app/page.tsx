import Header from "@/components/header"
import Hero from "@/components/hero"
import Services from "@/components/services"
import Convenios from "@/components/convenios"
import VideoSection from "@/components/video-section"
import ConnectingProfessionals from "@/components/connecting-professionals"
import FeaturedProfessionals from "@/components/featured-professionals"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="w-full">
      <Header />
      <Hero />
      <Services />
      <Convenios />
      <VideoSection />
      <ConnectingProfessionals />
      <FeaturedProfessionals />
      <Footer />
    </main>
  )
}
