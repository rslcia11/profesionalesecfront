"use client"

import { Calendar, User, ChevronDown } from "lucide-react"
import { useState } from "react"

export default function BlogSection() {
  const [expandedPost, setExpandedPost] = useState<number | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const blogPosts = [
    {
      title: "5 Consejos para mantener una sonrisa saludable",
      excerpt:
        "La salud bucal es fundamental para tu bienestar general. Descubre los mejores consejos de nuestros odontólogos expertos.",
      fullContent: `La salud bucal es fundamental para tu bienestar general. Aquí te compartimos 5 consejos esenciales:

1. Cepíllate los dientes al menos dos veces al día, preferiblemente después de cada comida. Usa un cepillo de cerdas suaves y reemplázalo cada 3 meses.

2. Usa hilo dental diariamente. El hilo dental llega a lugares que el cepillo no puede alcanzar, removiendo placa y restos de comida entre los dientes.

3. Limita el consumo de azúcares y alimentos ácidos. Estos pueden erosionar el esmalte dental y causar caries.

4. Visita a tu dentista cada 6 meses para limpiezas profesionales y chequeos preventivos.

5. Mantén una dieta balanceada rica en calcio y vitaminas que fortalezcan tus dientes y encías.

Recuerda: la prevención es la mejor inversión en tu salud dental.`,
      author: "Dra. Yajaira González",
      specialty: "Odontóloga",
      date: "15 Ene 2025",
      image: "/dental-health-care-tips.jpg",
      category: "Odontología",
    },
    {
      title: "¿Cómo prevenir enfermedades cardiovasculares?",
      excerpt:
        "La prevención es clave para un corazón sano. Conoce las recomendaciones de nuestros cardiólogos para cuidar tu salud cardiovascular.",
      fullContent: `Las enfermedades cardiovasculares son una de las principales causas de mortalidad, pero muchas son prevenibles. Aquí te comparto las mejores estrategias:

1. Mantén una dieta saludable baja en grasas saturadas y rica en frutas, verduras y granos enteros.

2. Realiza actividad física regularmente. Al menos 30 minutos de ejercicio moderado 5 días a la semana.

3. Controla tu presión arterial y colesterol. Realiza chequeos periódicos y sigue las indicaciones médicas.

4. Evita el tabaco y limita el consumo de alcohol.

5. Maneja el estrés con técnicas de relajación, meditación o actividades que disfrutes.

6. Mantén un peso saludable según tu estatura y complexión.

Tu corazón es tu motor de vida, cuídalo con decisiones saludables cada día.`,
      author: "Dr. Carlos Mendoza",
      specialty: "Cardiólogo",
      date: "12 Ene 2025",
      image: "/heart-health-cardiovascular-care.jpg",
      category: "Cardiología",
    },
    {
      title: "Nutrición balanceada: La base de una vida saludable",
      excerpt:
        "Una alimentación equilibrada es esencial para tu salud. Descubre qué alimentos incluir en tu dieta diaria según nuestros nutricionistas.",
      fullContent: `Una nutrición balanceada es el pilar fundamental de una vida saludable. Aquí te explico cómo lograrlo:

1. Incluye todos los grupos alimenticios: proteínas, carbohidratos complejos, grasas saludables, frutas y verduras.

2. Come porciones adecuadas. No se trata de comer menos, sino de comer mejor y en cantidades apropiadas.

3. Mantén horarios regulares de comida. Esto ayuda a tu metabolismo y evita la ansiedad por comer.

4. Hidrátate adecuadamente. Bebe al menos 8 vasos de agua al día.

5. Reduce el consumo de alimentos procesados y azúcares refinados.

6. Aumenta el consumo de fibra con frutas, verduras y granos enteros.

Recuerda: una buena nutrición no es una dieta temporal, es un estilo de vida que beneficia tu salud a largo plazo.`,
      author: "Dra. María Fernández",
      specialty: "Nutricionista",
      date: "10 Ene 2025",
      image: "/healthy-nutrition-balanced-diet.jpg",
      category: "Nutrición",
    },
  ]

  const faqs = [
    {
      question: "¿Cada cuánto debo visitar al dentista?",
      answer:
        "Se recomienda visitar al dentista cada 6 meses para una limpieza profesional y revisión preventiva. Esto ayuda a detectar problemas a tiempo y mantener una salud bucal óptima. En algunos casos, dependiendo de tu condición dental, tu dentista puede recomendar visitas más frecuentes.",
      author: "Dra. Yajaira González",
      specialty: "Odontóloga",
    },
    {
      question: "¿Qué debo hacer si tengo presión arterial alta?",
      answer:
        "Es fundamental seguir un plan de control integral que incluya: medicación prescrita por tu médico (si es necesario), una dieta baja en sodio y rica en potasio, ejercicio regular (30 minutos diarios), control de peso, reducción del estrés y monitoreo constante de tu presión. También es importante evitar el tabaco y limitar el consumo de alcohol.",
      author: "Dr. Carlos Mendoza",
      specialty: "Cardiólogo",
    },
    {
      question: "¿Cómo puedo mejorar mi digestión naturalmente?",
      answer:
        "Para mejorar tu digestión de forma natural: incluye fibra en tu dieta (frutas, verduras, granos enteros), mantén una hidratación adecuada (8 vasos de agua al día), come porciones moderadas, mastica bien los alimentos, establece horarios regulares para tus comidas, realiza actividad física regularmente y reduce el estrés. También es importante evitar comidas muy procesadas o ricas en grasas.",
      author: "Dra. María Fernández",
      specialty: "Nutricionista",
    },
  ]

  const togglePost = (index: number) => {
    setExpandedPost(expandedPost === index ? null : index)
  }

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <section className="py-24 md:py-32 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Blog Posts Section */}
        <div className="mb-24">
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Nuestro Blog</h2>
            <p className="text-lg text-muted-foreground">Consejos y recomendaciones de nuestros especialistas</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article
                key={index}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-full text-xs font-bold">
                    {post.category}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {expandedPost === index ? post.fullContent : post.excerpt}
                  </p>

                  <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{post.date}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => togglePost(index)}
                    className="flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
                  >
                    {expandedPost === index ? "Leer menos" : "Leer más"}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${expandedPost === index ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <div>
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Preguntas Frecuentes</h2>
            <p className="text-lg text-muted-foreground">Respuestas de nuestros profesionales</p>
          </div>

          <div className="grid md:grid-cols-1 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-primary/10 overflow-hidden transition-all hover:shadow-lg"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-4 hover:bg-primary/5 transition-colors"
                >
                  <h3 className="text-xl font-bold text-foreground">{faq.question}</h3>
                  <ChevronDown
                    size={24}
                    className={`flex-shrink-0 text-primary transition-transform ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedFaq === index && (
                  <div className="px-6 md:px-8 pb-6 md:pb-8">
                    <p className="text-muted-foreground leading-relaxed mb-4">{faq.answer}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{faq.author}</p>
                        <p className="text-xs text-muted-foreground">{faq.specialty}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
