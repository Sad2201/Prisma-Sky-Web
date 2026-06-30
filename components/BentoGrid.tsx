// components/BentoGrid.tsx - VERSIÓN MEJORADA
'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, Variants } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  FaCode, FaVideo, FaRobot, FaArrowRight, FaServer, 
  FaDatabase, FaCloud, FaNetworkWired, FaChartLine,
  FaPalette, FaCogs, FaRocket, FaShieldAlt,
  FaMicrochip, FaLayerGroup, FaBolt, FaUsers
} from 'react-icons/fa'
import TechDrawer, { type ServiceId } from './TechDrawer'
import SectionBackground from './SectionBackground'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ServiceCard {
  id: ServiceId
  icon: React.ReactNode
  title: string
  subtitle: string
  description: string
  problem: string
  solution: string
  stats: {
    value: string
    label: string
  }[]
  technologies: string[]
  features: string[]
  size: 'large' | 'medium' | 'small'
  color: string
  gradient: string
  iconColor: string
}

const services: ServiceCard[] = [
  {
    id: 'development',
    icon: <FaCode className="w-8 h-8" />,
    title: 'Desarrollo Web',
    subtitle: 'Arquitectura de alto rendimiento',
    description: 'Construimos experiencias digitales ultrarrápidas con Next.js, React y TypeScript. Optimización Core Web Vitals para posicionamiento premium.',
    problem: 'Lentitud de carga y pérdida de clientes en pasarelas de pago',
    solution: 'Arquitectura Next.js SSR/ISR con Edge Middleware',
    stats: [
      { value: '99.9%', label: 'Uptime' },
      { value: '<100ms', label: 'Tiempo de respuesta' },
      { value: '98%', label: 'Lighthouse Score' }
    ],
    technologies: ['Next.js SSR/ISR', 'Edge Middleware', 'GraphQL', 'Core Web Vitals'],
    features: [
      'Rendimiento sub-100ms',
      'SEO optimizado',
      'Escalabilidad automática',
      'Seguridad enterprise'
    ],
    size: 'large',
    color: '#D4AF37',
    gradient: 'from-[#D4AF37]/20 via-[#AA7C11]/10 to-transparent',
    iconColor: '#D4AF37'
  },
  {
    id: 'content',
    icon: <FaVideo className="w-7 h-7" />,
    title: 'Contenido Audiovisual',
    subtitle: 'Storytelling de alto impacto',
    description: 'Producción cinematográfica que domina algoritmos. Color grading profesional y hooks de retención para maximizar engagement.',
    problem: 'Baja retención en redes sociales y falta de posicionamiento',
    solution: 'Color Grading cinematográfico + hooks de retención del 85%',
    stats: [
      { value: '85%', label: 'Retención en 3s' },
      { value: '3.2x', label: 'Engagement' },
      { value: '+45%', label: 'Watch Time' }
    ],
    technologies: ['Color Grading', '4K HDR', 'Algoritmos', 'Storytelling'],
    features: [
      'Producción 4K HDR',
      'Estrategia algorítmica',
      'Multi-plataforma',
      'Analytics en tiempo real'
    ],
    size: 'medium',
    color: '#D4AF37',
    gradient: 'from-[#D4AF37]/15 via-[#AA7C11]/5 to-transparent',
    iconColor: '#D4AF37'
  },
  {
    id: 'automation',
    icon: <FaRobot className="w-7 h-7" />,
    title: 'Automatización IA',
    subtitle: 'Pipelines inteligentes',
    description: 'Sistemas CRM impulsados por IA que optimizan operaciones, automatizan ventas y transforman leads en clientes.',
    problem: 'Ineficiencias operativas y fugas de leads',
    solution: 'Pipelines IA con OpenAI + WhatsApp API Enterprise',
    stats: [
      { value: '87%', label: 'Reducción manual' },
      { value: '+45%', label: 'Conversión' },
      { value: '94%', label: 'Score precisión' }
    ],
    technologies: ['OpenAI API', 'WhatsApp API', 'CRM Integration', 'Machine Learning'],
    features: [
      'Automatización 24/7',
      'Respuesta instantánea',
      'Integración CRM',
      'Analytics predictivo'
    ],
    size: 'medium',
    color: '#D4AF37',
    gradient: 'from-[#D4AF37]/10 via-[#AA7C11]/5 to-transparent',
    iconColor: '#D4AF37'
  }
]

// Componente de feature badge
const FeatureBadge = ({ text, icon }: { text: string; icon?: React.ReactNode }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#D4AF37]/5 border border-[#D4AF37]/10 rounded-lg">
    {icon && <span className="text-[#D4AF37]">{icon}</span>}
    <span className="text-xs text-[#DCDCDC]/70">{text}</span>
  </div>
)

// Componente de estadísticas
const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <div className="text-xl font-bold text-[#D4AF37]">{value}</div>
    <div className="text-[10px] text-[#DCDCDC]/40">{label}</div>
  </div>
)

// Definir variantes
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
}

export default function BentoGrid() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [hoveredId, setHoveredId] = useState<ServiceId | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<ServiceId | null>(null)

  const handleOpenDrawer = (serviceId: ServiceId) => {
    setSelectedService(serviceId)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setTimeout(() => setSelectedService(null), 300)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: ServiceId) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = ((y - centerY) / centerY) * -6
    const rotateY = ((x - centerX) / centerX) * 6
    
    const card = e.currentTarget
    gsap.to(card, {
      rotateX,
      rotateY,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000,
      overwrite: 'auto'
    })
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 1000,
      overwrite: 'auto'
    })
  }

  const getSizeClasses = (size: 'large' | 'medium' | 'small') => {
    switch (size) {
      case 'large':
        return 'col-span-1 md:col-span-2 row-span-2'
      case 'medium':
        return 'col-span-1 md:col-span-1 row-span-1'
      case 'small':
        return 'col-span-1 md:col-span-1 row-span-1'
      default:
        return 'col-span-1 row-span-1'
    }
  }

  return (
    <>
      <section
        id="servicios"
        ref={ref}
        className="py-24 bg-[#050505] relative overflow-hidden"
      >
        {/* ✅ Fondo dinámico */}
        <SectionBackground variant="particles" intensity="medium" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#D4AF37] font-medium mb-4 border border-[#D4AF37]/20 px-4 py-2 rounded-full">
              Arquitectura de Soluciones
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
              Casos de <span className="text-[#D4AF37]">Uso</span>
            </h2>
            <p className="max-w-2xl mx-auto text-[#DCDCDC]/70 text-lg font-light">
              Soluciones que resuelven problemas reales del mercado con tecnología de vanguardia
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={cardVariants}
                className={`${getSizeClasses(service.size)} relative`}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div
                  className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#0A0A0A] to-[#050505] border border-[#D4AF37]/10 p-6 cursor-pointer transition-all duration-300 will-change-transform"
                  style={{
                    transformStyle: 'preserve-3d',
                    boxShadow: hoveredId === service.id 
                      ? '0 20px 60px rgba(212, 175, 55, 0.12)'
                      : '0 10px 30px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseMove={(e) => handleMouseMove(e, service.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Gradiente de fondo */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Contenido */}
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Header - Icono y stats */}
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="w-14 h-14 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center"
                        style={{ color: service.iconColor }}
                      >
                        {service.icon}
                      </div>
                      <div className="flex gap-3">
                        {service.stats.slice(0, 2).map((stat, i) => (
                          <StatItem key={i} value={stat.value} label={stat.label} />
                        ))}
                      </div>
                    </div>

                    {/* Título y subtítulo */}
                    <h3 className="text-xl font-bold text-white mb-1">
                      {service.title}
                    </h3>
                    <p className="text-sm text-[#DCDCDC]/40 mb-3">
                      {service.subtitle}
                    </p>

                    {/* Descripción */}
                    <p className="text-[#DCDCDC]/60 text-sm leading-relaxed flex-1">
                      {service.description}
                    </p>

                    {/* Problema/Solución - Solo en tarjetas grandes */}
                    {service.size === 'large' && (
                      <div className="mt-4 p-3 bg-[#D4AF37]/5 border border-[#D4AF37]/10 rounded-lg">
                        <div className="flex items-start gap-2 text-xs">
                          <span className="text-[#D4AF37] font-medium min-w-[60px]">Problema:</span>
                          <span className="text-[#DCDCDC]/60">{service.problem}</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs mt-1">
                          <span className="text-[#D4AF37] font-medium min-w-[60px]">Solución:</span>
                          <span className="text-[#DCDCDC]/60">{service.solution}</span>
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {service.features.slice(0, service.size === 'large' ? 4 : 2).map((feature, i) => (
                        <FeatureBadge 
                          key={i} 
                          text={feature}
                          icon={i === 0 ? <FaBolt className="w-3 h-3" /> : undefined}
                        />
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-4 border-t border-[#D4AF37]/10 flex items-center justify-between">
                      <div className="flex gap-3">
                        {service.stats.slice(service.size === 'large' ? 2 : 0).map((stat, i) => (
                          <StatItem key={i} value={stat.value} label={stat.label} />
                        ))}
                      </div>
                      <button
                        onClick={() => handleOpenDrawer(service.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg text-[#D4AF37] text-sm font-medium hover:bg-[#D4AF37]/20 transition-all duration-300 group"
                      >
                        Ver más
                        <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Borde brillante en hover */}
                  {hoveredId === service.id && (
                    <div className="absolute inset-0 rounded-2xl border border-[#D4AF37]/20 pointer-events-none" />
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <TechDrawer
        isOpen={drawerOpen}
        serviceId={selectedService}
        onClose={handleCloseDrawer}
      />
    </>
  )
}