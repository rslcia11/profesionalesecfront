import Header from "@/components/header"
import Footer from "@/components/footer"
import CommunicationHero from "@/components/communication-hero"
import CommunicationServices from "@/components/communication-services"
import CommunicationProfessionals from "@/components/communication-professionals"
import CTA from "@/components/cta"
n
export const metadata = {
  title: "Comunicación - Profesionales.EC",
  description:
    "Encuentra los mejores profesionales en comunicación. Periodismo, comunicación estratégica y producción audiovisual.",
}

export default function CommunicationPage() {
  return (
    <main className="w-full">
      <Header />
      <CommunicationHero />
      <CommunicationServices />
      <CommunicationProfessionals />
      <CTA />
      <Footer />
    </main>
  )
}
