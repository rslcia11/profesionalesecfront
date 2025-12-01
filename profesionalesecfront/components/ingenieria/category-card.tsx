import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CategoryCardProps {
    icon: LucideIcon
    title: string
    description: string
    count: number
    slug: string
}

export function CategoryCard({ icon: Icon, title, description, count, slug }: CategoryCardProps) {
    return (
        <Link href={`/categoria/${slug}`}>
            <div className="group h-full p-8 border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-lg transition-all cursor-pointer">
                <div className="bg-gray-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:bg-gray-900 transition-colors">
                    <Icon className="text-gray-700 group-hover:text-white transition-colors" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 mb-4">{description}</p>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{count} profesionales</span>
                    <Button className="bg-transparent text-gray-900 font-semibold hover:bg-transparent text-sm px-2 h-auto py-0">
                        VER PROFESIONALES →
                    </Button>
                </div>
            </div>
        </Link>
    )
}
