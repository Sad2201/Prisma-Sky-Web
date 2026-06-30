// components/AboutCompany.tsx
'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView, Variants } from 'framer-motion' // ← Importar Variants
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaCode, FaRocket, FaShieldAlt, FaEye, FaBullseye, FaMicrochip } from 'react-icons/fa'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ValueItem {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

const values: ValueItem[] = [
  {
    icon: <FaCode className="w-6 h-6" />,
    title: 'Rigor Técnico',
    description: 'Cero tolerancia al código sucio. Auditorías constantes, revisión de pares y estándares de calidad AAA en cada línea de código.',
    color: '#D4AF37'
  },
  {
    icon: <FaRocket className="w-6 h-6" />,
    title: 'Innovación Líquida',
    description: 'Interfaces dinámicas que se adaptan al comportamiento del usuario. Experiencias inmersivas que evolucionan en tiempo real con el contexto.',
    color: '#D4AF37'
  },
  {
    icon: <FaShieldAlt className="w-6 h-6" />,
    title: 'Transparencia Algorítmica',
    description: 'Sistemas medibles y documentados. Cada decisión técnica está respaldada por datos y métricas claras de rendimiento.',
    color: '#D4AF37'
  }
]

// ✅ Definir variantes con el tipo correcto
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
}

export default function AboutCompany() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const valuesRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      valuesRef.current.forEach((el, index) => {
        if (el) {
          gsap.fromTo(el,
            { opacity: 0, y: 30, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              scrollTrigger: {
                trigger: el,
                start: 'top bottom-=50',
                end: 'top center',
                toggleActions: 'play none none reverse'
              },
              delay: index * 0.15,
              ease: 'power3.out'
            }
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="empresa"
      ref={sectionRef}
      className="py-24 bg-[#0A0A0A] border-t border-[#D4AF37]/10 relative overflow-hidden"
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37] rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#D4AF37] rounded-full filter blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header de sección */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#D4AF37] font-medium mb-4 border border-[#D4AF37]/20 px-4 py-2 rounded-full">
            Identidad Corporativa
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
            Ingeniería <span className="text-[#D4AF37]">Superior</span>
          </h2>
          <p className="max-w-3xl mx-auto text-[#DCDCDC]/70 text-lg font-light leading-relaxed">
            Construimos la infraestructura tecnológica que impulsa a las marcas líderes del mercado
          </p>
        </motion.div>

        {/* Misión y Visión */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          {/* Misión */}
          <motion.div
            variants={itemVariants}
            className="relative group"
          >
            <div className="relative bg-[#050505] rounded-2xl border border-[#D4AF37]/10 p-8 hover:border-[#D4AF37]/30 transition-all duration-500 h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                  <FaBullseye className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white">Misión</h3>
              </div>
              <p className="text-[#DCDCDC]/70 text-base leading-relaxed">
                Democratizar la infraestructura tecnológica de alto rendimiento y la producción audiovisual de nivel cinematográfico para marcas que exigen excelencia, fusionando código limpio con narrativas algorítmicas que dominan el mercado.
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </motion.div>

          {/* Visión */}
          <motion.div
            variants={itemVariants}
            className="relative group"
          >
            <div className="relative bg-[#050505] rounded-2xl border border-[#D4AF37]/10 p-8 hover:border-[#D4AF37]/30 transition-all duration-500 h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                  <FaEye className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white">Visión</h3>
              </div>
              <p className="text-[#DCDCDC]/70 text-base leading-relaxed">
                Consolidarnos como la agencia tecnológica y creativa de referencia en la región, liderando el desarrollo web de ultra-lujo y la automatización inteligente basada en IA para transformar el ecosistema digital empresarial.
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </motion.div>
        </motion.div>

        {/* Valores de Ingeniería */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              ref={(el) => { valuesRef.current[index] = el }}
              className="relative group"
            >
              <div className="bg-[#050505] rounded-2xl border border-[#D4AF37]/10 p-8 hover:border-[#D4AF37]/30 transition-all duration-500 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h4 className="text-lg font-bold text-white">{value.title}</h4>
                </div>
                <p className="text-[#DCDCDC]/60 text-sm leading-relaxed">
                  {value.description}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Badge de calidad */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-[#050505] border border-[#D4AF37]/10 rounded-full">
            <FaMicrochip className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-sm text-[#DCDCDC]/60">
              Certificados en <span className="text-[#D4AF37]">Next.js</span>, <span className="text-[#D4AF37]">React</span>, <span className="text-[#D4AF37]">TypeScript</span> y <span className="text-[#D4AF37]">AWS Cloud</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}