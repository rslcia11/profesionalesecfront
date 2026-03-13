"use client"

import { useEffect, useState } from "react"
import { profesionalApi, horariosApi } from "@/lib/api"
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Check, Linkedin, Music } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BookingForm from "@/components/booking-form"
import LocationMap from "@/components/shared/location-map"
import ScheduleGrid from "@/components/schedule-grid"

export default function ProfessionalProfile() {
    const params = useParams()
    const [professional, setProfessional] = useState<any>(null)
    const [schedule, setSchedule] = useState<boolean[] | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            if (!params.id) return
            try {
                setLoading(true)
                const allData = await profesionalApi.obtenerVerificados()
                if (Array.isArray(allData)) {
                    const found = allData.find((p: any) => p.id.toString() === params.id)
                    setProfessional(found || null)
                    
                    if (found) {
                        try {
                            const schedData = await horariosApi.obtenerPublico(found.id)
                            if (schedData && schedData.matriz) {
                                setSchedule(schedData.matriz)
                            }
                        } catch (err) {
                            console.warn("No availability data found or error fetching it:", err)
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching profile:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [params.id])

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        )
    }

    // Not Found State
    if (!professional) {
        return (
            <div className="min-h-screen bg-white font-sans flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Profesional no encontrado</h2>
                    <Link href="/profesionales" className="text-black underline">Volver al directorio</Link>
                </div>
                <Footer />
            </div>
        )
    }

    // Data Mapping
    const { usuario, profesion, especialidad, descripcion, tarifa, ciudad, direccion, lat, lng, calle_principal, referencia, facebook_url, instagram_url, x_url, linkedin_url, tiktok_url } = professional
    const name = usuario?.nombre || "Profesional"
    const title = profesion?.nombre || "Profesional"
    const subTitle = especialidad?.nombre ? `${title} Especializada en ${especialidad.nombre}` : title
    const specialty = especialidad?.nombre || ""
    const bio = descripcion || "Profesional verificado con amplia experiencia en su campo."
    const image = usuario?.foto_url || "/placeholder.svg"
    const price = tarifa ? `$${tarifa}` : "A convenir"
    const locationName = ciudad?.nombre || "Ecuador"
    const phone = usuario?.telefono || ""
    const email = usuario?.correo || ""
    const whatsappLink = `https://wa.me/593${phone.replace(/^0/, "")}?text=Hola, deseo agendar una cita.`



    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            <Header />

            {/* SPACER for Fixed Header (Adjusted for h-16 header + top bar) */}
            <div className="h-24 md:h-28 bg-black"></div>

            {/* NAME BAR (Black Background) */}
            <div className="bg-black text-white py-8 text-center">
                <h1 className="text-3xl md:text-5xl font-bold">{name}</h1>
            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12">

                {/* TOP SECTION: Photo & Branding/Info */}
                <div className="flex flex-col md:flex-row gap-12 mb-16 items-center md:items-start">

                    {/* LEFT: Photo (Circle) - Centered visually in this column */}
                    <div className="w-full md:w-1/2 flex justify-center md:justify-end pr-0 md:pr-12">
                        <div className="w-64 h-64 md:w-[450px] md:h-[450px] rounded-full overflow-hidden shadow-2xl border-[10px] border-white -mt-4 bg-gray-200">
                            <img src={image} alt={name} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* RIGHT: Info & Branding */}
                    <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left pt-4">
                        {/* P.ec Logo Block */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="text-6xl font-serif font-black tracking-tighter leading-none">P<span className="text-3xl">.ec</span></div>
                            <div className="text-sm uppercase tracking-widest text-gray-800 border-l-2 border-black pl-3 py-1 text-left leading-tight">
                                Directorio<br />digital de<br />profesionales
                            </div>
                        </div>

                        {/* Name & Subtitle */}
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{name}</h2>
                        <p className="text-gray-500 text-lg mb-6 max-w-md">{subTitle}</p>

                        {/* Social Icons */}
                        <div className="flex flex-wrap gap-4 mt-2">
                            {facebook_url && (
                                <a href={facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-12 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-blue-600 hover:border-blue-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group shadow-sm" title="Facebook">
                                    <Facebook size={20} className="group-hover:scale-110 transition-transform" />
                                </a>
                            )}
                            {instagram_url && (
                                <a href={instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-12 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-pink-600 hover:border-pink-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group shadow-sm" title="Instagram">
                                    <Instagram size={20} className="group-hover:scale-110 transition-transform" />
                                </a>
                            )}
                            {x_url && (
                                <a href={x_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-12 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-black hover:border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group shadow-sm" title="Twitter / X">
                                    <div className="size-5 flex items-center justify-center font-bold text-[10px] border border-gray-400 group-hover:border-black rounded-sm leading-none transition-colors">X</div>
                                </a>
                            )}
                            {linkedin_url && (
                                <a href={linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-12 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-blue-800 hover:border-blue-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group shadow-sm" title="LinkedIn">
                                    <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                                </a>
                            )}
                            {tiktok_url && (
                                <a href={tiktok_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-12 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-black hover:border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group shadow-sm" title="TikTok">
                                    <Music size={20} className="group-hover:scale-110 transition-transform" />
                                </a>
                            )}
                            {phone && (
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-12 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-green-600 hover:border-green-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group shadow-sm" title="WhatsApp">
                                    <Phone size={20} className="group-hover:scale-110 transition-transform" />
                                </a>
                            )}
                            {email && (
                                <a href={`mailto:${email}`} className="flex items-center justify-center size-12 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-gray-900 hover:border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group shadow-sm" title="Email">
                                    <Mail size={20} className="group-hover:scale-110 transition-transform" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* MIDDLE SECTION: Form, Bio & Contact */}
                <div className="flex flex-col md:flex-row gap-16 mb-20 border-t border-gray-100 pt-16">                    {/* LEFT: Agenda Form */}
                    <div className="w-full md:w-1/2">
                        <h3 className="text-xl font-bold uppercase text-gray-800 mb-8 border-b pb-4">AGENDA UNA CITA</h3>
                        <BookingForm
                            professional={{
                                id: professional.id, // Fixed: use perfil_id instead of usuario_id
                                name: name,
                                specialty: specialty
                            }}
                            schedule={schedule}
                        />
                    </div>

                    {/* RIGHT: Conóceme & Contact */}
                    <div className="w-full md:w-1/2 flex flex-col gap-12">
                        {/* Conóceme */}
                        <div>
                            <h3 className="text-xl font-bold uppercase text-gray-800 mb-6 border-b pb-4">CONÓCEME</h3>
                            <p className="text-gray-500 leading-relaxed text-sm md:text-base text-justify">
                                {bio}
                            </p>
                        </div>

                        {/* Servicios */}
                        {professional.servicios && professional.servicios.length > 0 && (
                            <div className="mt-12">
                                <h3 className="text-xl font-bold uppercase text-gray-800 mb-6 border-b pb-4">SERVICIOS</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    {professional.servicios.map((servicio: any) => (
                                        <div key={servicio.servicio_id} className="flex items-center gap-3 group">
                                            <div className="text-xl font-serif font-black tracking-tighter leading-none shrink-0">P<span className="text-sm">.ec</span></div>
                                            <p className="text-gray-500 text-sm md:text-base border-l border-gray-100 pl-3 group-hover:text-black group-hover:border-black transition-all">
                                                {servicio.descripcion}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Disponibilidad Horaria */}
                        {schedule && (
                            <div className="mt-12">
                                <h3 className="text-xl font-bold uppercase text-gray-800 mb-6 border-b pb-4">DISPONIBILIDAD HORARIA</h3>
                                <ScheduleGrid 
                                    matrix={schedule} 
                                    readOnly={true} 
                                />
                            </div>
                        )}



                        {/* Contact Info (Moved here since Map is gone) */}
                        {/* Ubicación y Mapa */}
                        <div>
                            <h3 className="text-xl font-bold uppercase text-gray-800 mb-6 border-b pb-4">UBICACIÓN & CONTACTO</h3>

                            <div className="space-y-6">
                                {/* Dirección Textual */}
                                <div className="flex items-start gap-4">
                                    <div className="bg-gray-100 p-3 rounded-full">
                                        <MapPin className="text-black" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{locationName}</h4>
                                        {(calle_principal || direccion?.calle_principal) && (
                                            <p className="text-gray-600 mt-1">{calle_principal || direccion.calle_principal}</p>
                                        )}
                                        {(referencia || direccion?.referencia) && (
                                            <p className="text-gray-500 text-sm mt-1 italic">Ref: {referencia || direccion.referencia}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Mapa */}
                                {(lat || direccion?.latitud) && (lng || direccion?.longitud) && (
                                    <div className="w-full h-64 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                        <LocationMap
                                            lat={Number(lat || direccion.latitud)}
                                            lng={Number(lng || direccion.longitud)}
                                            readonly={true}
                                            address={calle_principal || direccion?.calle_principal}
                                        />
                                    </div>
                                )}

                                {/* Botones de Contacto */}
                                <div className="flex flex-wrap gap-4 pt-6 mt-6 border-t border-gray-100">
                                    {phone && (
                                        <a href={whatsappLink} target="_blank" className="flex-1 bg-green-500 text-white px-6 py-4 rounded-lg font-bold hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                            <Phone size={20} /> Contactar por WhatsApp
                                        </a>
                                    )}
                                    {email && (
                                        <a href={`mailto:${email}`} className="flex-1 bg-gray-900 text-white px-6 py-4 rounded-lg font-bold hover:bg-black transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                                            <Mail size={20} /> Enviar Email
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {/* Floating WhatsApp fixed again just in case */}
            <div className="fixed bottom-6 left-6 z-50">
                <a href={whatsappLink} target="_blank" className="bg-[#25D366] p-4 rounded-full shadow-lg text-white block hover:scale-110 transition">
                    <Phone size={28} fill="white" />
                </a>
            </div>

            <Footer />
        </div>
    )
}
