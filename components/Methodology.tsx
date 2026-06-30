// components/Methodology.tsx
'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaSearch, FaCode, FaShieldAlt } from 'react-icons/fa'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const steps = [
  {
    id: 'discovery',
    number: '01',
    title: 'Descubrimiento Técnico',
    description: 'Análisis profundo de la infraestructura existente, identificación de bottlenecks y definición de la arquitectura óptima.',
    details: [
      'Auditoría de infraestructura',
      'Mapeo de cuellos de botella térmicos/lógicos',
      'Diagramas de arquitectura en la nube'
    ],
    icon: <FaSearch className="w-6 h-6" />,
    duration: '2-3 semanas',
    color: '#D4AF37'
  },
  {
    id: 'modular',
    number: '02',
    title: 'Programación Modular',
    description: 'Desarrollo ágil con arquitectura basada en microservicios y componentes reutilizables. Implementación de CI/CD, testing automatizado y documentación en tiempo real.',
    details: [
      'Inyección de CI/CD pipelines',
      'Pruebas unitarias automatizadas con Jest',
      'Desarrollo modular atomizado'
    ],
    icon: <FaCode className="w-6 h-6" />,
    duration: '4-8 semanas',
    color: '#D4AF37'
  },
  {
    id: 'audit',
    number: '03',
    title: 'Auditoría Final',
    description: 'Revisión exhaustiva de rendimiento, accesibilidad y seguridad. Optimización de Core Web Vitals, pruebas de carga y validación de estándares AAA.',
    details: [
      'Pruebas de carga de estrés',
      'Auditoría de accesibilidad WCAG AAA',
      'Optimización Vercel Edge'
    ],
    icon: <FaShieldAlt className="w-6 h-6" />,
    duration: '1-2 semanas',
    color: '#D4AF37'
  }
]

export default function Methodology() {
  const sectionRef = useRef<HTMLElement>(null)
  const numbersRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación de números de fondo
      numbersRef.current.forEach((el, index) => {
        if (el) {
          gsap.fromTo(el,
            { opacity: 0.02, scale: 0.8 },
            {
              opacity: 0.08,
              scale: 1,
              scrollTrigger: {
                trigger: el,
                start: 'top center',
                end: 'bottom center',
                scrub: 1,
                toggleActions: 'play reverse play reverse'
              }
            }
          )
        }
      })

      // Animación de entrada de tarjetas
      const cards = document.querySelectorAll('.methodology-card')
      cards.forEach((card, index) => {
        gsap.fromTo(card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: card,
              start: 'top bottom-=100',
              end: 'top center',
              toggleActions: 'play none none reverse'
            },
            delay: index * 0.1
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="metodologia"
      ref={sectionRef}
      className="py-24 bg-[#0A0A0A] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#D4AF37] font-medium mb-4 border border-[#D4AF37]/20 px-4 py-2 rounded-full">
            Metodología
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
            Control de <span className="text-[#D4AF37]">Calidad</span>
          </h2>
          <p className="max-w-2xl mx-auto text-[#DCDCDC]/70 text-lg font-light">
            Un flujo de trabajo estructurado para garantizar la excelencia en cada proyecto
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Número de fondo masivo */}
              <div
                ref={(el) => { numbersRef.current[index] = el }}
                className="absolute -top-20 -left-10 text-9xl font-black text-white/[0.02] select-none pointer-events-none"
                style={{ 
                  background: 'linear-gradient(135deg, #D4AF37, #AA7C11)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {step.number}
              </div>

              {/* Tarjeta */}
              <div className="methodology-card relative bg-[#050505] rounded-2xl border border-[#D4AF37]/10 p-8 pl-16 hover:border-[#D4AF37]/30 transition-all duration-500">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                        {step.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-[#DCDCDC]/70 text-base leading-relaxed mb-4">
                      {step.description}
                    </p>

                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#DCDCDC]/60">
                          <span className="text-[#D4AF37] mt-1">▸</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:text-right shrink-0">
                    <div className="px-4 py-2 bg-[#D4AF37]/5 border border-[#D4AF37]/10 rounded-lg">
                      <span className="text-xs text-[#DCDCDC]/50">Duración estimada</span>
                      <p className="text-lg font-semibold text-[#D4AF37]">{step.duration}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Línea conectora */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-16 top-full w-0.5 h-12 bg-gradient-to-b from-[#D4AF37]/30 to-transparent" />
              )}
            </div>
          ))}
        </div>

        {/* Stats adicionales */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { value: '100%', label: 'Test Coverage' },
            { value: '0.1s', label: 'Tiempo de respuesta' },
            { value: 'AAA', label: 'Estándar de accesibilidad' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center p-6 bg-[#050505] rounded-xl border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-300"
            >
              <div className="text-3xl font-bold text-[#D4AF37] mb-1">{stat.value}</div>
              <div className="text-sm text-[#DCDCDC]/60">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}