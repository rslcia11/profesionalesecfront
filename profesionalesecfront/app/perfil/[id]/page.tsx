"use client"

import { useParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Star, MapPin, Briefcase, Mail, Phone, Award } from "lucide-react"

// Botón simple local (para evitar errores)
const Button = ({ className = "", children, ...props }) => (
    <button
        className={`px-4 py-2 rounded-lg font-medium transition ${className}`}
        {...props}
    >
        {children}
    </button>
)

export default function PerfilProfesional() {
    const { id } = useParams()

    const professionals: Record<string, any> = {
        "carlos-mendoza": {
            id: "carlos-mendoza",
            name: "Ing. Carlos Mendoza",
            specialty: "Ingeniería Civil",
            image: "/professional-engineer.png",
            rating: 4.9,
            projects: 45,
            location: "Quito, Ecuador",
            email: "carlos.mendoza@profesionales.ec",
            phone: "+593 99 123 4567",
            description:
                "Ingeniero Civil con más de 15 años de experiencia en proyectos de construcción.",
            experience: "15 años de experiencia",
            certifications: ["Ingeniero Civil Certificado", "PMP", "Perito Certificado"],
            services: ["Diseño estructural", "Supervisión de obras", "Gestión de proyectos"],
        },

        "maria-torres": {
            id: "maria-torres",
            name: "Ing. María Torres",
            specialty: "Ingeniería en Sistemas",
            image: "/female-software-engineer.jpg",
            rating: 5.0,
            projects: 68,
            location: "Guayaquil, Ecuador",
            email: "maria.torres@profesionales.ec",
            phone: "+593 98 234 5678",
            description:
                "Especialista en desarrollo de software y transformación digital.",
            experience: "12 años de experiencia",
            certifications: ["AWS Architect", "Scrum Master", "Full Stack Developer"],
            services: ["Desarrollo web", "Consultoría digital", "Integración de sistemas"],
        },

        "ana-gutierrez": {
            id: "ana-gutierrez",
            name: "Ing. Ana Gutiérrez",
            specialty: "Ingeniería Ambiental",
            image: "/environmental-engineer.jpg",
            rating: 4.9,
            projects: 38,
            location: "Quito, Ecuador",
            email: "ana.gutierrez@profesionales.ec",
            phone: "+593 96 456 7890",
            description:
                "Experta en sostenibilidad, impacto ambiental y gestión de recursos.",
            experience: "8 años de experiencia",
            certifications: ["Evaluador Ambiental", "ISO 14001 Auditor"],
            services: [
                "Estudios ambientales",
                "Gestión de residuos",
                "Proyectos de sostenibilidad",
            ],
        },

        "roberto-salazar": {
            id: "roberto-salazar",
            name: "Ing. Roberto Salazar",
            specialty: "Ingeniería Industrial",
            image: "/industrial-engineer.jpg",
            rating: 4.8,
            projects: 52,
            location: "Cuenca, Ecuador",
            email: "roberto.salazar@profesionales.ec",
            phone: "+593 97 345 6789",
            description:
                "Optimización de procesos, manufactura y logística.",
            experience: "10 años",
            certifications: ["Six Sigma Black Belt", "Lean Manufacturing"],
            services: ["Optimización", "Logística", "Sistemas de calidad"],
        },

        "diego-ramirez": {
            id: "diego-ramirez",
            name: "Ing. Diego Ramírez",
            specialty: "Ingeniería Electrónica",
            image: "/electronic-engineer.jpg",
            rating: 4.7,
            projects: 41,
            location: "Ambato, Ecuador",
            email: "diego.ramirez@profesionales.ec",
            phone: "+593 95 567 8901",
            description:
                "Experto en automatización, IoT y sistemas electrónicos.",
            experience: "9 años",
            certifications: ["CCNP", "Domótica", "IoT Specialist"],
            services: [
                "Automatización",
                "Diseño electrónico",
                "Instalación domótica",
            ],
        },
    }

    const professional = professionals[id]

    if (!professional) {
        return (
            <>
                <Header />
                <div className="pt-32 text-center">
                    <h1 className="text-3xl font-bold">Profesional no encontrado</h1>
                    <p className="text-gray-500 mt-4">El perfil que buscas no existe.</p>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />

            <div className="min-h-screen bg-gray-50 pt-28 pb-16">
                <div className="max-w-6xl mx-auto px-6">

                    {/* HERO */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <div className="grid md:grid-cols-3 gap-8">

                            {/* Foto */}
                            <div>
                                <img
                                    src={professional.image}
                                    alt={professional.name}
                                    className="rounded-xl w-full border"
                                />

                                <div className="mt-4 space-y-2 text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <Star className="text-yellow-500" />
                                        <span>{professional.rating} ⭐</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <MapPin />
                                        <span>{professional.location}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Briefcase />
                                        <span>{professional.experience}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="md:col-span-2">
                                <h1 className="text-4xl font-bold mb-2">{professional.name}</h1>
                                <p className="text-xl text-gray-600 mb-4">{professional.specialty}</p>

                                <p className="text-gray-700 mb-6">{professional.description}</p>

                                <div className="flex gap-4 mb-6">
                                    <Button className="bg-black text-white flex items-center gap-2">
                                        <Mail /> Contactar
                                    </Button>

                                    <Button className="border border-black text-black bg-transparent flex items-center gap-2">
                                        <Phone /> Llamar
                                    </Button>
                                </div>

                                <p className="text-gray-600 text-sm">Email</p>
                                <p className="font-medium mb-4">{professional.email}</p>

                                <p className="text-gray-600 text-sm">Teléfono</p>
                                <p className="font-medium">{professional.phone}</p>
                            </div>

                        </div>
                    </div>

                    {/* CERTIFICATIONS */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                            <Award /> Certificaciones
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            {professional.certifications.map((cert: string, index: number) => (
                                <div key={index} className="bg-gray-100 p-4 rounded-lg">
                                    {cert}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SERVICES */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-3xl font-bold mb-6">Servicios</h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            {professional.services.map((s: string, index: number) => (
                                <div key={index} className="p-4 bg-gray-100 rounded-lg">
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </>
    )
}
