// components/HeroSection.tsx - VERSIÓN COMPLETA CORREGIDA
'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroCanvas from './HeroCanvas'
import { FaArrowDown, FaCheckCircle } from 'react-icons/fa'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface MetricItem {
  value: string
  label: string
  icon?: React.ReactNode
}

const metrics: MetricItem[] = [
  {
    value: '99.2%',
    label: 'Score de Performance Garantizado',
    icon: <FaCheckCircle className="w-4 h-4 text-[#D4AF37]" />
  },
  {
    value: '+45M',
    label: 'Reproducciones en Contenido Viral',
    icon: <FaCheckCircle className="w-4 h-4 text-[#D4AF37]" />
  },
  {
    value: '99.99%',
    label: 'Disponibilidad Cloud Garantizada',
    icon: <FaCheckCircle className="w-4 h-4 text-[#D4AF37]" />
  }
]

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const metricsRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Configuración inicial
      gsap.set('.hero-metric', { opacity: 0, y: 20 })

      // Animación de entrada del contenido
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 1 }
      })

      tl.fromTo('.hero-badge', 
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8 }
      )
      .fromTo('.hero-title span', 
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.9 },
        '-=0.3'
      )
      .fromTo('.hero-subtitle', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.4'
      )
      .fromTo('.hero-cta', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6 },
        '-=0.3'
      )
      .fromTo('.hero-metrics .hero-metric', 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.6 },
        '-=0.2'
      )

      // Scroll Indicator Animation - MÁS SUTIL
      gsap.to(scrollIndicatorRef.current, {
        y: 8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      // Parallax efecto para el canvas - MÁS SUTIL
      gsap.to(canvasRef.current, {
        y: 50,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      })

      // ScrollTrigger para métricas
      ScrollTrigger.create({
        trigger: metricsRef.current,
        start: 'top bottom-=100',
        end: 'top center',
        onEnter: () => {
          gsap.to('.hero-metric', {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: 'power2.out'
          })
        }
      })

      // Animación de fade para el contenido al hacer scroll
      gsap.to(contentRef.current, {
        opacity: 0.6,
        scale: 0.98,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative min-h-screen w-full overflow-hidden bg-[#050505] flex items-center justify-center"
    >
      {/* Grid de perspectiva 3D - MÁS SUTIL */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.03)_0%,_transparent_70%)]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(212,175,55,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,175,55,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, transparent 70%)'
        }} />
      </div>

      {/* Canvas 3D con parallax */}
      <div ref={canvasRef} className="absolute inset-0 w-full h-full will-change-transform">
        <HeroCanvas />
      </div>

      {/* Overlay Gradient - MÁS SUTIL */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/0 via-[#050505]/20 to-[#050505]/70 pointer-events-none" />

      {/* Contenido Principal */}
      <div ref={contentRef} className="hero-content relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <div className="hero-badge inline-block mb-6 px-6 py-2 border border-[#D4AF37]/20 rounded-full backdrop-blur-sm bg-[#D4AF37]/5">
          <span className="text-xs tracking-[0.3em] uppercase text-[#DCDCDC]">
            Innovación <span className="text-[#D4AF37]">·</span> Tecnología <span className="text-[#D4AF37]">·</span> Futuro
          </span>
        </div>

        {/* Título */}
        <h1 className="hero-title text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-none mb-6">
          <span className="block bg-gradient-to-r from-white to-[#DCDCDC] bg-clip-text text-transparent">
            PRISMA
          </span>
          <span className="block bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] bg-clip-text text-transparent">
            SKY
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="hero-subtitle max-w-2xl mx-auto text-lg sm:text-xl text-[#DCDCDC]/80 font-light tracking-wide mb-8">
          Donde la tecnología redefine los límites de la innovación
        </p>

        {/* CTA Buttons */}
        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#servicios"
            className="group relative px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#050505] font-semibold rounded-lg overflow-hidden shadow-lg shadow-[#D4AF37]/20"
          >
            <span className="relative z-10">Explorar Servicios</span>
            <span className="absolute inset-0 bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#postular"
            className="px-8 py-4 border-2 border-[#D4AF37]/30 text-[#DCDCDC] font-semibold rounded-lg hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 backdrop-blur-sm"
          >
            Postular Ahora
          </motion.a>
        </div>

        {/* Métricas de Social Proof */}
        <div 
          ref={metricsRef}
          className="hero-metrics mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
        >
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="hero-metric flex items-center justify-center gap-3 p-4 rounded-xl bg-[#0A0A0A]/50 backdrop-blur-sm border border-[#D4AF37]/10"
            >
              <span className="text-2xl font-bold text-[#D4AF37]">{metric.value}</span>
              <span className="text-xs text-[#DCDCDC]/60 text-left">{metric.label}</span>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div ref={scrollIndicatorRef} className="scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-12 border-2 border-[#D4AF37]/30 rounded-full flex items-start justify-center p-2">
            <FaArrowDown className="w-3 h-3 text-[#D4AF37]" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-content {
          will-change: transform, opacity;
        }
        
        .hero-metric {
          will-change: transform, opacity;
        }
        
        .scroll-indicator {
          will-change: transform;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .hero-badge,
          .hero-title span,
          .hero-subtitle,
          .hero-cta,
          .hero-metric {
            opacity: 1 !important;
            transform: none !important;
          }
          .scroll-indicator {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}