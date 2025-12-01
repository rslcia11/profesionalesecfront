import Link from "next/link"
import { MapPin, Star, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfessionalCardProps {
    id: string
    name: string
    specialty: string
    image: string
    rating: number
    projects: number
    location: string
}

export function ProfessionalCard({ id, name, specialty, image, rating, projects, location }: ProfessionalCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <img src={image || "/placeholder.svg"} alt={name} className="w-full h-48 object-cover" />
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
                <p className="text-gray-600 mb-4">{specialty}</p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <Star className="text-yellow-500 fill-yellow-500" size={16} />
                        <span className="font-semibold">{rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Briefcase size={16} />
                        <span>{projects} proyectos</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <MapPin size={16} />
                    <span>{location}</span>
                </div>

                <div className="flex gap-3">
                    <Link href={`/perfil/${id}`} className="flex-1">
                        <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 h-10 px-4 rounded-lg">Ver perfil</Button>
                    </Link>
                    <Button className="flex-1 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white bg-transparent h-10 px-4 rounded-lg">
                        Contactar
                    </Button>
                </div>
            </div>
        </div>
    )
}
