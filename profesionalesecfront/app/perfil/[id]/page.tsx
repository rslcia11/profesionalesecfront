"use client"

import { useEffect, useState } from "react"
import { profesionalApi, horariosApi } from "@/lib/api"
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Check, Linkedin, Music, Youtube } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BookingForm from "@/components/booking-form"
import LocationMap from "@/components/shared/location-map"
import { formatUrl } from "@/lib/utils"

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
                const found = await profesionalApi.obtenerPublico(params.id as string)
                setProfessional(found || null)
                
                if (found) {
                    try {
                        const schedData = await horariosApi.obtenerPublico(params.id as string)
                        if (schedData && schedData.matriz) {
                            setSchedule(schedData.matriz)
                        }
                    } catch (err) {
                        console.warn("No availability data found or error fetching it:", err)
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
    const { usuario, profesion, especialidad, descripcion, tarifa, ciudad, direccion, lat, lng, calle_principal, referencia, facebook_url, instagram_url, x_url, linkedin_url, tiktok_url, yt_url, show_phone, show_email } = professional
    const name = usuario?.nombre || "Profesional"
    const title = profesion?.nombre || "Profesional"
    const subTitle = especialidad?.nombre ? `${title} Especializada en ${especialidad.nombre}` : title
    const specialty = especialidad?.nombre || ""
    const bio = descripcion || "Profesional verificado con amplia experiencia en su campo."
    const image = formatUrl(usuario?.foto_url) || "/logo-black.png"
    const price = tarifa ? `$${tarifa}` : "A convenir"
    const locationName = ciudad?.nombre || "Ecuador"
    // Respetar preferencias de privacidad del profesional
    const phone = show_phone !== false ? (usuario?.telefono || "") : ""
    const email = show_email !== false ? (usuario?.correo || "") : ""
    const whatsappLink = `https://wa.me/593${phone.replace(/^0/, "")}?text=Hola, deseo agendar una cita.`



    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            <Header />



            {/* MAIN CONTENT CONTAINER */}
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 pt-24 md:pt-32">

                {/* TOP SECTION: Photo & Branding/Info */}
                <div className="flex flex-col md:flex-row gap-2 md:gap-12 mb-16 items-center md:items-start">

                    {/* LEFT: Photo (Circle) - Centered visually in this column */}
                    <div className="w-full md:w-1/2 flex justify-center md:justify-end pr-0 md:pr-12">
                        <div className="w-72 h-72 md:w-[500px] md:h-[500px] rounded-full overflow-hidden border-4 md:border-[10px] border-white bg-gray-100">
                            <img src={image} alt={name} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* RIGHT: Info & Branding */}
                    <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left pt-0 md:pt-4">
                        {/* Name & Subtitle */}
                        <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 tracking-tighter">{name}</h2>
                        <p className="text-gray-500 text-xl md:text-2xl mb-8 max-w-xl font-medium leading-tight">{subTitle}</p>

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
                            {yt_url && (
                                <a href={yt_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-12 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-red-600 hover:border-red-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group shadow-sm" title="YouTube">
                                    <Youtube size={20} className="group-hover:scale-110 transition-transform" />
                                </a>
                            )}
                            {phone && (
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-12 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-green-600 hover:border-green-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group shadow-sm" title="WhatsApp">
                                    <svg viewBox="0 0 24 24" className="size-5 fill-current group-hover:scale-110 transition-transform" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                    </svg>
                                </a>
                            )}
                            {email && (
                                <a href={`mailto:${email}`} className="flex items-center justify-center size-12 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-gray-900 hover:border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group shadow-sm" title="Email">
                                    <Mail size={20} className="group-hover:scale-110 transition-transform" />
                                </a>
                            )}
                        </div>

                        {/* Servicios */}
                        {professional.servicios && professional.servicios.length > 0 && (
                            <div className="w-full mt-12">
                                <h3 className="text-xl font-bold uppercase text-gray-800 mb-6 border-b pb-4">SERVICIOS</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    {professional.servicios.map((servicio: any) => (
                                        <div key={servicio.servicio_id} className="flex items-center gap-3 group">
                                            <img src="/logo-icono.png" alt="P.ec" className="h-10 w-auto object-contain shrink-0" />
                                            <p className="text-gray-500 text-sm md:text-base border-l border-gray-100 pl-3 group-hover:text-black group-hover:border-black transition-all">
                                                {servicio.descripcion}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* MIDDLE SECTION: Form, Bio & Contact */}
                <div className="flex flex-col md:flex-row gap-16 mb-20 border-t border-gray-100 pt-16">                    {/* LEFT: Agenda Form */}
                    <div className="w-full md:w-1/2">
                        <h3 className="text-xl font-bold uppercase text-gray-800 mb-8 border-b pb-4">AGENDA UNA CITA</h3>
                        <BookingForm
                            professional={{
                                id: professional?.usuario?.id || professional.id,
                                slug: String(params.id || ""),
                                name: name,
                                specialty: specialty
                            }}
                            schedule={schedule}
                        />
                    </div>

                    {/* RIGHT: Conóceme & Contact */}
                    <div className="w-full md:w-1/2 flex flex-col gap-12">
                        {/* Conóceme */}
                        <div className="bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100">
                            <h3 className="text-xl font-bold uppercase text-gray-800 mb-8 border-b border-gray-200 pb-4 text-center">CONÓCEME</h3>
                            <p className="text-gray-600 leading-relaxed text-base md:text-lg text-center max-w-2xl mx-auto whitespace-pre-wrap">
                                {bio}
                            </p>
                        </div>

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
                                            <svg viewBox="0 0 24 24" className="size-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                            </svg> Contactar por WhatsApp
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
                    <svg viewBox="0 0 24 24" className="size-7 fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                </a>
            </div>

            <Footer />
        </div>
    )
}
