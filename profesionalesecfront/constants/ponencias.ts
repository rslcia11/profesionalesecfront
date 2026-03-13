import { FileText, Globe, Users } from "lucide-react"

export const EDUCATIONAL_CONTEXT_REASONS = [
    {
        title: "Interactividad como motor del aprendizaje",
        icon: FileText,
        desc: "Según la teoría del aprendizaje social (Bandura, 1977), la interacción directa refuerza el aprendizaje al permitir que los participantes asimilen ideas en contextos prácticos."
    },
    {
        title: "Importancia de la interdisciplinariedad",
        icon: Globe,
        desc: "Estudios recientes destacan que el 78% de los profesionales perciben un aumento en la demanda de habilidades interdisciplinares (World Economic Forum, 2022)."
    },
    {
        title: "Metodologías innovadoras",
        icon: Users,
        desc: "La mezcla de formatos TEDx y talleres prácticos fomenta la participación, lo que aumenta la retención de información en un 60% más que las conferencias tradicionales (Harvard Business Review, 2020)."
    }
]

export const MAGAZINE_BANNER_CONFIG = {
    title: "Revista Científica Profesionales Ecuador",
    description: "Investigación, innovación y conocimiento multidisciplinario desde Ecuador para el mundo.",
    linkText: "LEER REVISTA DE PROFESIONALES ECUADOR",
    defaultLink: "https://profesionales.ec/revista/"
}

export const FALLBACK_STAT_LABELS = {
    date: "Fecha",
    location: "Ubicación",
    investment: "Inversión",
    capacity: "Cupos"
}

export const UI_MESSAGES = {
    loading: "Sincronizando...",
    errorGeneric: "No se pudo cargar el conversatorio.",
    errorNotFound: "No se encontró el conversatorio.",
    backToEducation: "VOLVER A EDUCACIÓN",
    reviveTitle: "REVIVE JUNTO A NOSOTROS EL CONVERSATORIO",
    educationalContextTitle: "¿POR QUÉ ESTE FORMATO?",
    premiumContentTitle: "CONTENIDO PREMIUM",
    videoSummary: "RESUMEN EN VIDEO",
    momentsGallery: "GALERÍA DE MOMENTOS",
    joinTitle: "ÚNETE AL CONVERSATORIO",
    joinDesc: "No pierdas la oportunidad de ser parte de este encuentro transformador. Pocos cupos disponibles.",
    successInscripton: "¡INSCRIPCIÓN EXITOSA!",
    successInscriptonDesc: "Te hemos registrado correctamente. En breve recibirás un correo con los detalles del evento."
}
