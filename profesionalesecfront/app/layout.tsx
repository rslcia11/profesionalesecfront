import type React from "react"
import type { Metadata } from "next"
import { Oswald, Arimo, Varela_Round } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import PageLoader from "@/components/page-loader"

const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" })
const arimo = Arimo({ subsets: ["latin"], variable: "--font-arimo" })
const varelaRound = Varela_Round({ weight: "400", subsets: ["latin"], variable: "--font-varela" })

export const metadata: Metadata = {
  title: "Profesionales.EC - Plataforma de Profesionales",
  description: "Conecta con los mejores profesionales en Ecuador. Tu plataforma de confianza.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${oswald.variable} ${arimo.variable} ${varelaRound.variable} font-body antialiased`}>
        <PageLoader />
        {children}
        <WhatsAppFloat />
        <Analytics />
      </body>
    </html>
  )
}
