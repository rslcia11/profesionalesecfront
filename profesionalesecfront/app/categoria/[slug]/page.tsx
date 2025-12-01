"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Search, Star, MapPin, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Professional {
    id: string
    name: string
    specialty: string
    image: string
    rating: number
    projects: number
    location: string
    phone: string
    email: string
    description: string
}

const categoryData: Record<string, { title: string; professionals: Professional[] }> = {
    "ingenieria-civil": {
        title: "Ingeniería Civil",
        professionals: [
            {
                id: "carlos-mendoza",
                name: "Ing. Carlos Mendoza",
                specialty: "Ingeniería Civil",
                image: "/professional-engineer.png",
                rating: 4.9,
                projects: 45,
                location: "Quito, Ecuador",
                phone: "+593 99 123 4567",
                email: "carlos.mendoza@ejemplo.com",
                description:
                    "Especialista en estructuras y proyectos de infraestructura con más de 15 años de experiencia.",
            },
            {
                id: "juan-perez",
                name: "Ing. Juan Pérez",
                specialty: "Ingeniería Civil",
                image: "/placeholder.svg?height=400&width=400",
                rating: 4.7,
                projects: 32,
                location: "Guayaquil, Ecuador",
                phone: "+593 99 234 5678",
                email: "juan.perez@ejemplo.com",
                description: "Experto en diseño de puentes y carreteras.",
            },
            {
                id: "sofia-martinez",
                name: "Ing. Sofía Martínez",
                specialty: "Ingeniería Civil",
                image: "/placeholder.svg?height=400&width=400",
                rating: 5.0,
                projects: 28,
                location: "Cuenca, Ecuador",
                phone: "+593 99 345 6789",
                email: "sofia.martinez@ejemplo.com",
                description: "Especializada en proyectos de construcción sostenible.",
            },
        ],
    },
    "ingenieria-industrial": {
        title: "Ingeniería Industrial",
        professionals: [
            {
                id: "roberto-salazar",
                name: "Ing. Roberto Salazar",
                specialty: "Ingeniería Industrial",
                image: "/industrial-engineer.jpg",
                rating: 4.8,
                projects: 52,
                location: "Quito, Ecuador",
                phone: "+593 99 456 7890",
                email: "roberto.salazar@ejemplo.com",
                description:
                    "Experto en optimización de procesos industriales y lean manufacturing.",
            },
            {
                id: "laura-castro",
                name: "Ing. Laura Castro",
                specialty: "Ingeniería Industrial",
                image: "/placeholder.svg?height=400&width=400",
                rating: 4.6,
                projects: 38,
                location: "Guayaquil, Ecuador",
                phone: "+593 99 567 8901",
                email: "laura.castro@ejemplo.com",
                description: "Especialista en gestión de cadenas de suministro.",
            },
        ],
    },
    "ingenieria-electronica": {
        title: "Ingeniería Electrónica",
        professionals: [
            {
                id: "diego-ramirez",
                name: "Ing. Diego Ramírez",
                specialty: "Ingeniería Electrónica",
                image: "/electronic-engineer.jpg",
                rating: 4.7,
                projects: 41,
                location: "Quito, Ecuador",
                phone: "+593 99 678 9012",
                email: "diego.ramirez@ejemplo.com",
                description:
                    "Especialista en sistemas de control y automatización industrial.",
            },
        ],
    },
    "ingenieria-sistemas": {
        title: "Ingeniería en Sistemas",
        professionals: [
            {
                id: "maria-torres",
                name: "Ing. María Torres",
                specialty: "Ingeniería en Sistemas",
                image: "/female-software-engineer.jpg",
                rating: 5.0,
                projects: 68,
                location: "Quito, Ecuador",
                phone: "+593 99 789 0123",
                email: "maria.torres@ejemplo.com",
                description:
                    "Desarrolladora full-stack con experiencia en aplicaciones empresariales y cloud computing.",
            },
            {
                id: "pablo-sanchez",
                name: "Ing. Pablo Sánchez",
                specialty: "Ingeniería en Sistemas",
                image: "/placeholder.svg?height=400&width=400",
                rating: 4.8,
                projects: 55,
                location: "Guayaquil, Ecuador",
                phone: "+593 99 890 1234",
                email: "pablo.sanchez@ejemplo.com",
                description: "Experto en ciberseguridad y arquitectura de redes.",
            },
        ],
    },
    "ingenieria-ambiental": {
        title: "Ingeniería Ambiental",
        professionals: [
            {
                id: "ana-gutierrez",
                name: "Ing. Ana Gutiérrez",
                specialty: "Ingeniería Ambiental",
                image: "/environmental-engineer.jpg",
                rating: 4.9,
                projects: 38,
                location: "Cuenca, Ecuador",
                phone: "+593 99 901 2345",
                email: "ana.gutierrez@ejemplo.com",
                description:
                    "Especialista en gestión de recursos hídricos y proyectos de sostenibilidad.",
            },
        ],
    },
    "ingenieria-robotica": {
        title: "Ingeniería Robótica",
        professionals: [
            {
                id: "fernando-leon",
                name: "Ing. Fernando León",
                specialty: "Ingeniería Robótica",
                image: "/placeholder.svg?height=400&width=400",
                rating: 4.9,
                projects: 29,
                location: "Quito, Ecuador",
                phone: "+593 99 012 3456",
                email: "fernando.leon@ejemplo.com",
                description:
                    "Experto en robótica industrial y sistemas autónomos.",
            },
        ],
    },
}

export default function CategoriaPage() {
    const params = useParams<{ slug: string }>()
    const slug = params.slug as string

    const category = categoryData[slug]

    if (!category) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Categoría no encontrada
                        </h1>
                        <Link href="/ingenieria-y-tecnologia">
                            <Button>Volver a Ingeniería y Tecnología</Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-white pt-20">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-5xl font-bold mb-4">{category.title}</h1>
                        <p className="text-xl text-gray-300 mb-8">
                            Encuentra los mejores profesionales en{" "}
                            {category.title.toLowerCase()}
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <Input
                                    type="text"
                                    placeholder="Buscar por nombre, especialidad o ubicación..."
                                    className="pl-12 h-14 bg-white text-gray-900"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Professionals Grid */}
                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">
                            {category.professionals.length} Profesionales Disponibles
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {category.professionals.map((professional) => (
                                <div
                                    key={professional.id}
                                    className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 hover:shadow-xl transition-all"
                                >
                                    <div className="relative h-64">
                                        <img
                                            src={professional.image || "/placeholder.svg"}
                                            alt={professional.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            {professional.name}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {professional.specialty}
                                        </p>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Star className="text-yellow-500 fill-yellow-500" size={16} />
                                                <span className="font-semibold">
                                                    {professional.rating}
                                                </span>
                                                <span>• {professional.projects} proyectos</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin size={16} />
                                                <span>{professional.location}</span>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                                            {professional.description}
                                        </p>

                                        <div className="flex gap-3">
                                            <Link href={`/perfil/${professional.id}`} className="flex-1">
                                                <Button className="w-full bg-gray-900 hover:bg-gray-800">
                                                    Ver Perfil
                                                </Button>
                                            </Link>
                                            <Button className="border-2 border-gray-200 bg-white hover:bg-gray-50 h-10 w-10 flex items-center justify-center rounded-md">
                                                <Phone size={18} />
                                            </Button>
                                            <Button className="border-2 border-gray-200 bg-white hover:bg-gray-50 h-10 w-10 flex items-center justify-center rounded-md">
                                                <Mail size={18} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-6 bg-gray-50">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            ¿Eres profesional en {category.title}?
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Únete a nuestra red y conecta con clientes que buscan tus servicios
                        </p>
                        <Link href="/registro-profesional">
                            <Button className="bg-gray-900 hover:bg-gray-800 h-12 px-8 text-lg">
                                Crear Perfil Profesional
                            </Button>
                        </Link>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    )
}
