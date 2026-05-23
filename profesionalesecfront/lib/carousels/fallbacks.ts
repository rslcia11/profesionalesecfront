import type { ManagedCarouselSlide } from "@/lib/validators/carousel"

export const carouselFallbacks: Record<string, ManagedCarouselSlide[]> = {
  home: [
    { id: -1, placementKey: "home", title: "Conectando profesionales de excelencia", subtitle: null, imageUrl: "/images/0cef6a13d87d872103747b3f8da1cd07.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 0, isActive: true },
    { id: -2, placementKey: "home", title: "Conectando profesionales de excelencia", subtitle: null, imageUrl: "/images/2.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 1, isActive: true },
    { id: -3, placementKey: "home", title: "Conectando profesionales de excelencia", subtitle: null, imageUrl: "/images/3.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 2, isActive: true },
  ],
  educacion: [
    { id: -11, placementKey: "educacion", title: "Profesionales en Educación", subtitle: "Docentes calificados para transformar el aprendizaje", imageUrl: "/teacher-classroom-students.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 0, isActive: true },
    { id: -12, placementKey: "educacion", title: "Excelencia Educativa", subtitle: "Conecta con los mejores educadores del país", imageUrl: "/university-professor-lecture.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 1, isActive: true },
    { id: -13, placementKey: "educacion", title: "Educación de Calidad", subtitle: "Profesores verificados y con experiencia comprobada", imageUrl: "/online-education-teacher.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 2, isActive: true },
  ],
  salud: [
    { id: -21, placementKey: "salud", title: "Cuidamos Tu Salud", subtitle: "Profesionales médicos comprometidos con tu bienestar", imageUrl: "/doctor-consultation-patient-healthcare.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 0, isActive: true },
    { id: -22, placementKey: "salud", title: "Excelencia en Atención Médica", subtitle: "Especialistas altamente calificados a tu servicio", imageUrl: "/medical-team-hospital-professionals.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 1, isActive: true },
    { id: -23, placementKey: "salud", title: "Salud con Tecnología de Punta", subtitle: "Diagnósticos precisos y tratamientos efectivos", imageUrl: "/healthcare-technology-modern-medicine.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 2, isActive: true },
  ],
  derecho: [
    { id: -31, placementKey: "derecho", title: "Expertos en Derecho", subtitle: "Asesoría legal profesional para resolver tus necesidades jurídicas", imageUrl: "/lawyer-team-office-consultation.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 0, isActive: true },
    { id: -32, placementKey: "derecho", title: "Justicia y Asesoría Legal", subtitle: "Protegemos tus derechos con excelencia profesional", imageUrl: "/lawyer-courtroom-justice-scales.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 1, isActive: true },
    { id: -33, placementKey: "derecho", title: "Soluciones Legales Integrales", subtitle: "Tu mejor aliado en asuntos legales y jurídicos", imageUrl: "/lawyer-consultation-client-meeting.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 2, isActive: true },
  ],
  administracion: [
    { id: -41, placementKey: "administracion", title: "Expertos en Economía y Administración", subtitle: "Potencia tu negocio con profesionales certificados", imageUrl: "/business-professionals-team-meeting-office.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 0, isActive: true },
    { id: -42, placementKey: "administracion", title: "Gestión Empresarial de Excelencia", subtitle: "Impulsa el crecimiento de tu organización", imageUrl: "/financial-advisor-consulting-client-modern-office.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 1, isActive: true },
    { id: -43, placementKey: "administracion", title: "Soluciones Estratégicas para tu Empresa", subtitle: "Profesionales comprometidos con tu éxito", imageUrl: "/business-team-collaboration-strategy-planning.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 2, isActive: true },
  ],
  agraria: [
    { id: -51, placementKey: "agraria", title: "Innovación Agrícola para el Futuro", subtitle: "Conecta con especialistas en agronomía y tecnología agrícola", imageUrl: "/agriculture-modern-farming-technology.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 0, isActive: true },
    { id: -52, placementKey: "agraria", title: "Producción Pecuaria Sostenible", subtitle: "Expertos en zootecnia y manejo de ganado", imageUrl: "/livestock-farming-professional.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 1, isActive: true },
    { id: -53, placementKey: "agraria", title: "Agroindustria y Transformación", subtitle: "Profesionales en procesamiento y valor agregado", imageUrl: "/agroindustry-food-processing.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 2, isActive: true },
  ],
  oficios: [
    { id: -61, placementKey: "oficios", title: "Profesionales en Oficios", subtitle: "Expertos certificados en servicios especializados", imageUrl: "/craftsman-skilled-work-professional.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 0, isActive: true },
    { id: -62, placementKey: "oficios", title: "Calidad y Experiencia", subtitle: "Encuentra el profesional ideal para tu proyecto", imageUrl: "/photography-professional-camera-work.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 1, isActive: true },
    { id: -63, placementKey: "oficios", title: "Servicios Confiables", subtitle: "Profesionales verificados y evaluados por clientes", imageUrl: "/beauty-salon-professional-service.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 2, isActive: true },
  ],
  "salud-mental": [
    { id: -71, placementKey: "salud-mental", title: "Apoyo profesional para tu bienestar emocional", subtitle: "Especialistas en salud mental comprometidos con tu equilibrio psicológico", imageUrl: "/mental-health-therapy-counseling.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 0, isActive: true },
    { id: -72, placementKey: "salud-mental", title: "Encuentra el psicólogo ideal para ti", subtitle: "Profesionales certificados en diversas áreas de la psicología", imageUrl: "/psychology-clinical-therapy-session.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 1, isActive: true },
    { id: -73, placementKey: "salud-mental", title: "Tu salud mental es nuestra prioridad", subtitle: "Atención personalizada para cada etapa de tu vida", imageUrl: "/mental-wellness-emotional-health.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 2, isActive: true },
  ],
  "ingenieria-y-tecnologia": [
    { id: -81, placementKey: "ingenieria-y-tecnologia", title: "Profesionales en Ingeniería y Tecnología", subtitle: "Expertos en innovación y soluciones tecnológicas", imageUrl: "/placeholder.svg?height=600&width=1200", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 0, isActive: true },
    { id: -82, placementKey: "ingenieria-y-tecnologia", title: "Tecnología de Vanguardia", subtitle: "Ingenieros certificados para tus proyectos", imageUrl: "/placeholder.svg?height=600&width=1200", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 1, isActive: true },
    { id: -83, placementKey: "ingenieria-y-tecnologia", title: "Innovación y Desarrollo", subtitle: "Soluciones tecnológicas con profesionales verificados", imageUrl: "/placeholder.svg?height=600&width=1200", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 2, isActive: true },
  ],
  comunicacion: [
    { id: -91, placementKey: "comunicacion", title: "Expertos en Comunicación y Medios", subtitle: "Conectamos tu mensaje con el mundo", imageUrl: "/communication-professional-media-broadcast.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 0, isActive: true },
    { id: -92, placementKey: "comunicacion", title: "Periodistas y Comunicadores", subtitle: "Información veraz y profesional", imageUrl: "/journalism-news-reporter-professional.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 1, isActive: true },
    { id: -93, placementKey: "comunicacion", title: "Comunicación Digital y Marketing", subtitle: "Tu marca en todas las plataformas", imageUrl: "/digital-marketing-social-media.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 2, isActive: true },
  ],
  "diseno-y-construccion": [
    { id: -101, placementKey: "diseno-y-construccion", title: "Profesionales en Diseño y Construcción", subtitle: "Expertos para materializar tus proyectos arquitectónicos", imageUrl: "/architect-blueprint-construction.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 0, isActive: true },
    { id: -102, placementKey: "diseno-y-construccion", title: "Diseño y Construcción de Excelencia", subtitle: "Arquitectos, diseñadores y constructores certificados", imageUrl: "/placeholder.svg?height=600&width=1200", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 1, isActive: true },
    { id: -103, placementKey: "diseno-y-construccion", title: "Transforma tus Espacios", subtitle: "De la idea al proyecto terminado con profesionales verificados", imageUrl: "/placeholder.svg?height=600&width=1200", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 2, isActive: true },
  ],
  "arte-y-cultura": [
    { id: -111, placementKey: "arte-y-cultura", title: "Artistas y Profesionales del Arte", subtitle: "Talento ecuatoriano excepcional para tus proyectos", imageUrl: "/artist-painting-studio.png", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 0, isActive: true },
    { id: -112, placementKey: "arte-y-cultura", title: "Creatividad Sin Límites", subtitle: "Conecta con artistas verificados y profesionales", imageUrl: "/musician-performing-stage.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 1, isActive: true },
    { id: -113, placementKey: "arte-y-cultura", title: "Arte y Cultura Ecuatoriana", subtitle: "Encuentra el talento perfecto para tu evento", imageUrl: "/theater-performance-actors.jpg", imagePublicId: null, ctaLabel: null, ctaUrl: null, sortOrder: 2, isActive: true },
  ],
}

export function getCarouselFallback(placementKey: string): ManagedCarouselSlide[] {
  return (carouselFallbacks[placementKey] || []).map((slide) => ({ ...slide }))
}
