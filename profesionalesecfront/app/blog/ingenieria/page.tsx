"use client"

import { notFound } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Calendar, Clock, ArrowLeft, Share2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { use } from "react"

interface BlogArticleProps {
    params: Promise<{ id: string }>
}

export default function BlogArticle({ params }: BlogArticleProps) {
    const { id } = use(params)

    const blogArticles: Record<string, any> = {
        "eficiencia-proyectos": {
            title: "Cómo Mejorar la Eficiencia en Proyectos de Ingeniería",
            author: "Ing. Carlos Mendoza",
            authorImage: "/professional-engineer.png",
            authorBio: "Ingeniero Civil con más de 15 años de experiencia en gestión de proyectos de infraestructura.",
            date: "15 de octubre de 2023",
            category: "Ingeniería Civil",
            image: "/artificial-intelligence-technology.png",
            readTime: "5 min",
            content: `
        <h2>Introducción</h2>
        <p>La eficiencia en proyectos de ingeniería es crucial para el éxito de cualquier iniciativa. En este artículo, exploraremos las mejores prácticas y herramientas que pueden ayudarte a optimizar tus proyectos.</p>
        
        <h2>1. Planificación Estratégica</h2>
        <p>Una planificación adecuada es la base de cualquier proyecto exitoso. Es fundamental definir claramente los objetivos, alcances y entregables desde el inicio. Utiliza metodologías como PMBOK o PRINCE2 para estructurar tu planificación.</p>
        
        <h2>2. Uso de Herramientas Digitales</h2>
        <p>Las herramientas de gestión de proyectos como Microsoft Project, Primavera P6 o herramientas ágiles como Jira pueden mejorar significativamente la coordinación del equipo. La digitalización permite un seguimiento en tiempo real del progreso del proyecto.</p>
        
        <h2>3. Comunicación Efectiva</h2>
        <p>Establece canales de comunicación claros entre todos los stakeholders. Las reuniones regulares de seguimiento y los informes de progreso ayudan a identificar problemas tempranamente y tomar acciones correctivas a tiempo.</p>
        
        <h2>4. Gestión de Riesgos</h2>
        <p>Identifica y evalúa los riesgos potenciales desde el inicio del proyecto. Desarrolla planes de contingencia y mantén un registro actualizado de riesgos. La gestión proactiva de riesgos puede evitar retrasos costosos.</p>
        
        <h2>Conclusión</h2>
        <p>Implementar estas estrategias puede mejorar significativamente la eficiencia de tus proyectos de ingeniería. Recuerda que la mejora continua es clave para el éxito a largo plazo.</p>
      `,
        },
        "ia-construccion": {
            title: "El Impacto de la Inteligencia Artificial en la Construcción Moderna",
            author: "Ing. María Torres",
            authorImage: "/female-software-engineer.jpg",
            authorBio: "Ingeniera en Sistemas especializada en IA aplicada a la construcción y BIM.",
            date: "10 de octubre de 2023",
            category: "Ingeniería en Sistemas",
            image: "/ai-construction-technology.jpg",
            readTime: "7 min",
            content: `
        <h2>La Revolución de la IA en la Construcción</h2>
        <p>La inteligencia artificial está transformando radicalmente la industria de la construcción, desde el diseño hasta la ejecución de proyectos. Esta tecnología promete mejorar la eficiencia, reducir costos y aumentar la seguridad en las obras.</p>
        
        <h2>Aplicaciones Principales</h2>
        <p>La IA se utiliza en múltiples áreas: modelado predictivo para anticipar problemas, optimización de rutas de maquinaria pesada, análisis de datos de sensores IoT para mantenimiento predictivo, y sistemas de visión por computadora para inspecciones de calidad.</p>
        
        <h2>BIM y Machine Learning</h2>
        <p>La combinación de Building Information Modeling (BIM) con algoritmos de machine learning permite crear modelos más precisos y detectar conflictos de diseño antes de la construcción. Esto reduce significativamente los errores y retrabajos.</p>
        
        <h2>Seguridad Mejorada</h2>
        <p>Los sistemas de IA pueden monitorear las obras en tiempo real, identificando comportamientos inseguros y alertando al personal. Esto ha demostrado reducir los accidentes laborales en un 30% en proyectos que implementan estas tecnologías.</p>
        
        <h2>El Futuro</h2>
        <p>Se espera que la IA continúe evolucionando, con robots de construcción autónomos y sistemas de diseño generativo que crearán estructuras más eficientes y sostenibles. La industria debe adaptarse a estos cambios para mantenerse competitiva.</p>
      `,
        },
        "automatizacion-industrial": {
            title: "Automatización Industrial: Tendencias 2024",
            author: "Ing. Roberto Salazar",
            authorImage: "/industrial-engineer.jpg",
            authorBio: "Ingeniero Industrial con experiencia en automatización y optimización de procesos.",
            date: "5 de octubre de 2023",
            category: "Ingeniería Industrial",
            image: "/industrial-automation-robots.jpg",
            readTime: "6 min",
            content: `
        <h2>La Nueva Era de la Manufactura</h2>
        <p>La automatización industrial está experimentando una transformación sin precedentes. Las tecnologías emergentes están redefiniendo cómo operan las fábricas y cómo se optimizan los procesos de producción.</p>
        
        <h2>Robótica Colaborativa (Cobots)</h2>
        <p>Los robots colaborativos están diseñados para trabajar junto a los humanos de manera segura. A diferencia de los robots industriales tradicionales, los cobots son más flexibles, fáciles de programar y pueden realizar tareas que requieren destreza y adaptabilidad.</p>
        
        <h2>Internet Industrial de las Cosas (IIoT)</h2>
        <p>La conectividad de máquinas y equipos permite recopilar datos en tiempo real sobre el rendimiento de la producción. Estos datos se utilizan para mantenimiento predictivo, optimización de procesos y mejora de la eficiencia energética.</p>
        
        <h2>Gemelos Digitales</h2>
        <p>Los gemelos digitales son réplicas virtuales de sistemas físicos que permiten simular y optimizar procesos antes de implementarlos. Esta tecnología reduce riesgos y costos asociados con cambios en la línea de producción.</p>
        
        <h2>Tendencias para 2024</h2>
        <p>Esperamos ver mayor adopción de IA en la toma de decisiones, integración de realidad aumentada para mantenimiento, y sistemas autónomos de gestión de inventario. La sostenibilidad también será un factor clave en las decisiones de automatización.</p>
      `,
        },
        "energia-renovable": {
            title: "Energía Renovable: Soluciones para el Futuro Sostenible",
            author: "Ing. Ana Gutiérrez",
            authorImage: "/environmental-engineer.jpg",
            authorBio: "Ingeniera Ambiental especializada en proyectos de energía renovable y sostenibilidad.",
            date: "1 de octubre de 2023",
            category: "Ingeniería Ambiental",
            image: "/renewable-energy-solar-panels.png",
            readTime: "8 min",
            content: `
        <h2>El Imperativo de la Energía Renovable</h2>
        <p>El cambio climático y la necesidad de reducir las emisiones de carbono han acelerado la transición hacia fuentes de energía renovable. Esta transformación no solo es necesaria, sino también económicamente viable.</p>
        
        <h2>Energía Solar: La Líder en Crecimiento</h2>
        <p>La energía solar fotovoltaica ha experimentado una reducción de costos del 90% en la última década. Los nuevos paneles de alta eficiencia y los sistemas de almacenamiento de baterías están haciendo que la energía solar sea competitiva incluso sin subsidios.</p>
        
        <h2>Energía Eólica: Potencia en Alta Mar</h2>
        <p>Los parques eólicos marinos están ganando terreno, especialmente en Europa y Asia. Las turbinas más grandes y eficientes pueden generar electricidad suficiente para miles de hogares, aprovechando los vientos constantes del océano.</p>
        
        <h2>Integración de Redes Inteligentes</h2>
        <p>Las redes eléctricas inteligentes son esenciales para gestionar la variabilidad de las fuentes renovables. Los sistemas de gestión de demanda y almacenamiento de energía permiten equilibrar la oferta y demanda en tiempo real.</p>
        
        <h2>Proyectos Innovadores en Ecuador</h2>
        <p>Ecuador está invirtiendo en proyectos hidroeléctricos y solares para diversificar su matriz energética. Proyectos como Coca Codo Sinclair demuestran el compromiso del país con la energía limpia.</p>
        
        <h2>Oportunidades Profesionales</h2>
        <p>La demanda de ingenieros especializados en energía renovable está creciendo exponencialmente. Se necesitan profesionales capaces de diseñar, implementar y mantener estos sistemas sostenibles.</p>
      `,
        },
        "iot-ciudades-inteligentes": {
            title: "IoT y Ciudades Inteligentes: El Futuro Urbano",
            author: "Ing. Diego Ramírez",
            authorImage: "/electronic-engineer.jpg",
            authorBio: "Ingeniero Electrónico especializado en IoT y sistemas embebidos para ciudades inteligentes.",
            date: "28 de septiembre de 2023",
            category: "Ingeniería Electrónica",
            image: "/smart-city-iot-sensors.jpg",
            readTime: "6 min",
            content: `
        <h2>La Visión de las Ciudades Inteligentes</h2>
        <p>Las ciudades inteligentes utilizan tecnología IoT para mejorar la calidad de vida de sus habitantes. Sensores, conectividad y análisis de datos transforman la gestión urbana, haciéndola más eficiente y sostenible.</p>
        
        <h2>Infraestructura de Sensores</h2>
        <p>Miles de sensores distribuidos por la ciudad recopilan datos sobre tráfico, calidad del aire, consumo de energía, gestión de residuos y más. Esta información se procesa en tiempo real para tomar decisiones informadas.</p>
        
        <h2>Movilidad Inteligente</h2>
        <p>Los sistemas de transporte inteligente utilizan datos de tráfico en tiempo real para optimizar rutas de autobuses, gestionar semáforos adaptativos y proporcionar información actualizada a los ciudadanos sobre las mejores opciones de transporte.</p>
        
        <h2>Gestión Energética</h2>
        <p>Las redes eléctricas inteligentes permiten un uso más eficiente de la energía. El alumbrado público LED conectado puede ajustar su intensidad según la presencia de personas, reduciendo el consumo hasta un 80%.</p>
        
        <h2>Desafíos de Seguridad</h2>
        <p>La ciberseguridad es crítica en las ciudades inteligentes. Los sistemas deben protegerse contra ataques que podrían interrumpir servicios esenciales. Se requieren protocolos de seguridad robustos y actualizaciones constantes.</p>
        
        <h2>Casos de Éxito</h2>
        <p>Ciudades como Barcelona, Singapur y Ámsterdam son ejemplos de implementación exitosa de tecnologías IoT. Sus experiencias proporcionan valiosas lecciones para otras ciudades que buscan modernizarse.</p>
      `,
        },
        "estructuras-sismicas": {
            title: "Diseño Estructural Antisísmico: Nuevas Normativas",
            author: "Ing. Carlos Mendoza",
            authorImage: "/professional-engineer.png",
            authorBio: "Ingeniero Civil con más de 15 años de experiencia en gestión de proyectos de infraestructura.",
            date: "25 de septiembre de 2023",
            category: "Ingeniería Civil",
            image: "/earthquake-resistant-building.png",
            readTime: "9 min",
            content: `
        <h2>La Importancia del Diseño Antisísmico</h2>
        <p>En países ubicados en zonas sísmicas como Ecuador, el diseño estructural antisísmico no es opcional, es una necesidad. Las nuevas normativas buscan mejorar la seguridad de las edificaciones frente a eventos sísmicos.</p>
        
        <h2>Actualizaciones de la Norma NEC</h2>
        <p>La Norma Ecuatoriana de la Construcción (NEC) ha incorporado actualizaciones importantes basadas en estudios sísmicos recientes y lecciones aprendidas de terremotos pasados. Los requisitos son ahora más estrictos pero garantizan mayor seguridad.</p>
        
        <h2>Sistemas de Aislamiento Sísmico</h2>
        <p>Los aisladores sísmicos en la base de las estructuras permiten que el edificio se mueva independientemente del suelo durante un sismo. Esta tecnología, aunque costosa, puede reducir las fuerzas sísmicas hasta en un 80%.</p>
        
        <h2>Materiales y Técnicas Innovadoras</h2>
        <p>El uso de concreto de alta resistencia, acero de refuerzo especial y técnicas como muros de corte y marcos resistentes a momento mejoran significativamente el comportamiento estructural durante sismos.</p>
        
        <h2>Análisis por Elementos Finitos</h2>
        <p>El software avanzado permite simular el comportamiento de estructuras durante sismos. Los ingenieros pueden optimizar diseños y verificar que cumplan con los requisitos de seguridad antes de la construcción.</p>
        
        <h2>Retrofitting de Estructuras Existentes</h2>
        <p>Muchas edificaciones antiguas no cumplen con las normativas actuales. El reforzamiento estructural (retrofitting) es esencial para mejorar su resistencia sísmica y proteger la vida de los ocupantes.</p>
        
        <h2>Responsabilidad Profesional</h2>
        <p>Los ingenieros civiles tienen la responsabilidad ética y legal de diseñar estructuras seguras. Es fundamental mantenerse actualizado con las normativas y mejores prácticas en diseño antisísmico.</p>
      `,
        },
    }

    const article = blogArticles[id]

    if (!article) {
        notFound()
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-white pt-20">
                {/* Hero Section */}
                <article className="max-w-4xl mx-auto px-6 py-12">
                    <Link
                        href="/blog/ingenieria"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Volver al blog
                    </Link>

                    <div className="mb-8">
                        <span className="inline-block bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            {article.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-balance">{article.title}</h1>

                        <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
                            <div className="flex items-center gap-2">
                                <Calendar size={18} />
                                <span>{article.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={18} />
                                <span>{article.readTime} de lectura</span>
                            </div>
                            <Button className="border-2 border-gray-200 bg-transparent hover:bg-gray-50 h-9 px-4 text-sm gap-2">
                                <Share2 size={16} />
                                Compartir
                            </Button>
                        </div>

                        {/* Author Info */}
                        <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl mb-8">
                            <img
                                src={article.authorImage || "/placeholder.svg"}
                                alt={article.author}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-bold text-gray-900 text-lg">{article.author}</p>
                                <p className="text-gray-600 text-sm">{article.authorBio}</p>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="mb-12 rounded-2xl overflow-hidden">
                        <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-auto object-cover" />
                    </div>

                    {/* Article Content */}
                    <div
                        className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* Author CTA */}
                    <div className="mt-16 p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-white text-center">
                        <User className="mx-auto mb-4" size={48} />
                        <h3 className="text-2xl font-bold mb-3">¿Te gustó este artículo?</h3>
                        <p className="text-gray-300 mb-6">
                            Conecta con {article.author} y otros profesionales en nuestra plataforma
                        </p>
                        <Link href="/registro-profesional">
                            <Button className="bg-white text-gray-900 hover:bg-gray-100 h-12 px-8 text-lg">
                                Crear Perfil Profesional
                            </Button>
                        </Link>
                    </div>
                </article>

                {/* Related Articles */}
                <section className="py-16 px-6 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Artículos relacionados</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {Object.entries(blogArticles)
                                .filter(([articleId]) => articleId !== id)
                                .slice(0, 3)
                                .map(([articleId, post]) => (
                                    <Link key={articleId} href={`/blog/ingenieria/${articleId}`}>
                                        <article className="bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all">
                                            <img
                                                src={post.image || "/placeholder.svg"}
                                                alt={post.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="p-6">
                                                <span className="text-xs font-semibold text-gray-600 mb-2 block">{post.category}</span>
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <span>{post.date}</span>
                                                    <span>•</span>
                                                    <span>{post.readTime}</span>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    )
}
