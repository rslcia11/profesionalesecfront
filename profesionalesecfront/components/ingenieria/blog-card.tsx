import Link from "next/link"
import { Clock } from "lucide-react"

interface BlogCardProps {
    post: {
        id: string
        title: string
        excerpt: string
        image: string
        category: string
        author: string
        authorImage: string
        readTime: string
        date: string
    }
}

export function BlogCard({ post }: BlogCardProps) {
    return (
        <Link href={`/blog/ingenieria/${post.id}`}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col">
                <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
                <div className="p-6 flex-1 flex flex-col">
                    <span className="text-sm text-gray-500 mb-2">{post.category}</span>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-balance">{post.title}</h3>
                    <p className="text-gray-600 mb-4 flex-1">{post.excerpt}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                            <img
                                src={post.authorImage || "/placeholder.svg"}
                                alt={post.author}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{post.author}</p>
                                <p className="text-xs text-gray-500">{post.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock size={16} />
                            <span>{post.readTime}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
