import { TopBar } from "@/components/layout/top-bar"
import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/sections/hero-section"
import { ServicesSection } from "@/components/sections/services-section"
import { AboutSection } from "@/components/sections/about-section"
import { FeaturedProfessionals } from "@/components/sections/featured-professionals"
import { Footer } from "@/components/layout/footer"
import { WhatsAppButton } from "@/components/common/whatsapp-button"

export default function Home() {
  return (
    <main className="min-h-screen">
      <TopBar />
      <Header />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <FeaturedProfessionals />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
