import Header from "@/components/header"
import { ArrowRight, Users, Trophy, Handshake } from 'lucide-react'

export default function EducacionPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-gray-700 to-gray-900 text-white py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Educación</h1>
                    <p className="text-xl text-gray-300 max-w-2xl text-pretty">
                        Conversatorios, eventos y oportunidades de aprendizaje para profesionales
                    </p>
                </div>
            </section>

            {/* Próximos Conversatorios */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <h2 className="text-3xl font-bold mb-4">Próximos Conversatorios</h2>
                    <p className="text-gray-600 mb-8 text-lg">Próximamente Junio 2025</p>

                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900">
                            Segundo Conversatorio Nacional Multidisciplinario de P.ec
                        </h3>
                        <p className="text-lg text-gray-700 mb-4">
                            Innovación, Conocimiento y Futuro: Desafíos y Oportunidades en el Mundo Profesional
                        </p>
                        <p className="text-gray-600 mb-6">
                            <strong>Lugar:</strong> Por Confirmarse
                        </p>
                        <a
                            href="https://profesionales.ec/preparando-conversatorio/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gray-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-900 transition-colors"
                        >
                            Más Información del Evento
                        </a>
                    </div>
                </div>
            </section>

            {/* Conversatorios Realizados */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <h2 className="text-3xl font-bold mb-4">Conversatorios Realizados</h2>
                    <p className="text-gray-600 mb-8 text-lg">19, 20 y 21 de Marzo de 2025</p>

                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 border border-gray-300">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900">
                            Primer Conversatorio Nacional Multidisciplinario de P.ec
                        </h3>
                        <p className="text-lg text-gray-700 mb-4">
                            Innovación, Derecho y Aprendizaje Colaborativo, avalado por el Colegio de Abogado de Loja y sus avales.
                        </p>
                        <p className="text-gray-700 mb-6">
                            <strong>Lugar:</strong> Auditorio Manuel Carrión Pinzano, Judicatura de Loja
                        </p>
                        <a
                            href="https://profesionales.ec/educacion/1er-cnmp/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gray-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-900 transition-colors"
                        >
                            Ver evento gratis
                        </a>
                    </div>
                </div>
            </section>

            {/* SE PARTE DE PROFESIONALES.EC */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <h2 className="text-4xl font-bold mb-16 text-center">SE PARTE DE PROFESIONALES.EC</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Ponente */}
                        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-gray-500 transition-all hover:scale-105">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-6 text-gray-300 text-center">PONENTE</h3>
                            <p className="text-gray-300 mb-8 leading-relaxed text-center">
                                "Únete al selecto grupo de expertos que lideran los conversatorios de Profesionales.ec.
                                Comparte tu experiencia, tus conocimientos y tus ideas con una audiencia ávida de aprender y crecer.
                                Sé parte del cambio que impulsa a los profesionales a alcanzar nuevas metas mientras posicionas tu
                                prestigio como referente en tu sector."
                            </p>
                            <a
                                href="https://wa.link/i65ui8"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-600 transition-colors w-full"
                            >
                                Más información <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>

                        {/* Asistente */}
                        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-gray-500 transition-all hover:scale-105">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                                    <Trophy className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-6 text-gray-300 text-center">ASISTENTE</h3>
                            <p className="text-gray-300 mb-8 leading-relaxed text-center">
                                "Participa en los conversatorios de Profesionales.ec y adquiere conocimientos directamente de expertos
                                en diversas áreas. Aprovecha esta oportunidad para aprender, interactuar con ponentes destacados y
                                resolver tus dudas. Haz que tu desarrollo profesional sea más dinámico y enriquecedor, conectando con
                                ideas innovadoras y soluciones prácticas."
                            </p>
                            <a
                                href="https://wa.link/soekak"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-600 transition-colors w-full"
                            >
                                Más Información <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>

                        {/* Patrocinador */}
                        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-gray-500 transition-all hover:scale-105">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                                    <Handshake className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-6 text-gray-300 text-center">PATROCINADOR</h3>
                            <p className="text-gray-300 mb-8 leading-relaxed text-center">
                                "Impulsa tu marca apoyando los conversatorios de Profesionales.ec. Sé parte de un espacio donde expertos
                                y profesionales se reúnen para compartir conocimientos y experiencias. Como patrocinador, posiciona tu
                                marca frente a una comunidad en crecimiento, refuerza tu compromiso con el desarrollo profesional y
                                destaca en un entorno de innovación y aprendizaje."
                            </p>
                            <a
                                href="https://wa.link/55n3u5"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-600 transition-colors w-full"
                            >
                                Más información <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Artículos Recientes */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-gray-700 font-semibold mb-2">Our New Articles</p>
                        <h2 className="text-4xl font-bold mb-4">Conocimiento Actualizado</h2>
                        <p className="text-gray-600">Lo último en tendencias y novedades profesionales</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                        {/* Artículo 1 */}
                        <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all hover:scale-105">
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                        Derecho
                                    </span>
                                    <span className="text-gray-500 text-sm">26 Jul</span>
                                </div>
                                <h3 className="text-lg font-bold mb-3 text-gray-900 leading-tight">
                                    El momento procesal oportuno para presentar los diferentes medios de prueba
                                </h3>
                                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                    Resumen: El presente ensayo tiene como finalidad efectuar un estudio exhaustivo sobre los medios probatorios reconocidos por el orden jurídico y la manera de evacuarlos legalmente...
                                </p>
                                <a
                                    href="https://profesionales.ec/el-momento-procesal-oportuno-para-presentar-los-diferentes-medios-de-prueba-y-la-manera-de-evacuarlos-legalmente/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-800 font-semibold hover:text-gray-900 text-sm inline-flex items-center gap-2"
                                >
                                    Continue reading <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>
                        </article>

                        {/* Artículo 2 */}
                        <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all hover:scale-105">
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                        Diseño y Construcción
                                    </span>
                                    <span className="text-gray-500 text-sm">10 Jul</span>
                                </div>
                                <h3 className="text-lg font-bold mb-3 text-gray-900 leading-tight">
                                    Bambú Estructural: El 'Acero Vegetal' que Está Redefiniendo la Construcción Sostenible en Ecuador
                                </h3>
                                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                    "Hemos patentado conexiones de acero inoxidable que resuelven el punto débil histórico del bambú", explica Bamba mientras muestra las juntas que permiten crear estructuras de hasta cinco pisos...
                                </p>
                                <a
                                    href="https://profesionales.ec/bambu-estructural-el-acero-vegetal-que-esta-redefiniendo-la-construccion-sostenible-en-ecuador/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-800 font-semibold hover:text-gray-900 text-sm inline-flex items-center gap-2"
                                >
                                    Continue reading <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>
                        </article>

                        {/* Artículo 3 */}
                        <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all hover:scale-105">
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                        Derecho
                                    </span>
                                    <span className="text-gray-500 text-sm">09 Jul</span>
                                </div>
                                <h3 className="text-lg font-bold mb-3 text-gray-900 leading-tight">
                                    Derecho Predictivo: Cómo los Algoritmos están Anticipando Fallos Judiciales en Ecuador
                                </h3>
                                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                    Según datos del Observatorio Judicial Ecuatoriano, el 52% de los bufetes grandes en Quito y Guayaquil ya utilizan herramientas de análisis predictivo, reduciendo en un 40% los casos perdidos...
                                </p>
                                <a
                                    href="https://profesionales.ec/derecho-predictivo-como-los-algoritmos-estan-anticipando-fallos-judiciales-en-ecuador/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-800 font-semibold hover:text-gray-900 text-sm inline-flex items-center gap-2"
                                >
                                    Continue reading <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>
                        </article>

                        {/* Artículo 4 */}
                        <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all hover:scale-105">
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                        Comunicación
                                    </span>
                                    <span className="text-gray-500 text-sm">09 Jul</span>
                                </div>
                                <h3 className="text-lg font-bold mb-3 text-gray-900 leading-tight">
                                    De la oficina a TikTok: Cómo los ejecutivos ecuatorianos están humanizando las marcas
                                </h3>
                                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                    El año 2023 marcó un punto de inflexión. Según un estudio de la consultora BrandWatch EC, el 68% de las empresas ecuatorianas con más de 200 empleados tienen al menos un ejecutivo C-level activo en redes sociales...
                                </p>
                                <a
                                    href="https://profesionales.ec/de-la-oficina-a-tiktok-como-los-ejecutivos-ecuatorianos-estan-humanizando-las-marcas-con-contenido-espontaneo/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-800 font-semibold hover:text-gray-900 text-sm inline-flex items-center gap-2"
                                >
                                    Continue reading <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>
                        </article>
                    </div>

                    <div className="text-center">
                        <a
                            href="https://profesionales.ec/profesionales.ec"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gray-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-900 transition-colors"
                        >
                            View More Articles <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-20 bg-gradient-to-br from-gray-700 to-gray-900 text-white">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-4">Join Our Newsletter Now</h2>
                    <p className="text-gray-300 mb-2 text-lg">
                        Do You Like The Theme? <strong>Share With Your Friends!</strong>
                    </p>
                    <p className="text-gray-300 mb-8 text-sm">
                        Sociable on as carriage my position weddings raillery consider. Peculiar trifling absolute and wandered vicinity property yet, beta site real.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-4">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 px-6 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-gray-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors"
                        >
                            Subscribe
                        </button>
                    </form>
                    <p className="text-gray-300 text-xs">
                        Will be used in accordance with our <a href="#" className="underline hover:text-white">Privacy Policy</a>
                    </p>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-gray-700 font-semibold mb-2">Handcrafted With Integrity</p>
                        <h2 className="text-4xl font-bold mb-4">What They Say <strong>About Us</strong></h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                            <p className="text-gray-700 leading-relaxed mb-4">
                                "When it's about controlling hundreds of articles, product pages for web shops, or user profiles in social networks, all of them potentially with different sizes, formats, rules for differing elements."
                            </p>
                            <p className="text-gray-600 text-sm">
                                Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel.
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                            <p className="text-gray-700 leading-relaxed">
                                Convallis arcu erat, accumsan id imperdiet et, porttitor at sem. Curabitur aliquet quam id dui posuere blandit. Vivamus suscipit tortor eget felis porttitor volutpat. Vivamus suscipit tortor eget felis.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
