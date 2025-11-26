import Header from "@/components/header"
import Hero from "@/components/hero"
import Services from "@/components/services"
import VideoSection from "@/components/video-section"
import Professionals from "@/components/professionals"
import About from "@/components/about"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="w-full">
      <Header />
      <Hero />
      <Services />
      <VideoSection />
      <Professionals />
      <About />
      <CTA />
      <Footer />
    </main>
  )
}
