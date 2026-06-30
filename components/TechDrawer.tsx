// components/TechDrawer.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { 
  FaTimes, FaCode, FaVideo, FaRobot, FaServer, 
  FaDatabase, FaCloud, FaChartLine, FaShieldAlt,
  FaRocket, FaMicrochip, FaNetworkWired, FaPalette,
  FaCogs, FaArrowRight, FaCheckCircle
} from 'react-icons/fa'

export type ServiceId = 'development' | 'content' | 'automation'

export interface TechDrawerProps {
  isOpen: boolean
  serviceId: ServiceId | null
  onClose: () => void
}

export interface TechnicalSpec {
  icon: React.ReactNode
  title: string
  description: string
  metrics: string[]
  technologies: string[]
  deliverables: string[]
}

export interface ServiceContent {
  id: ServiceId
  title: string
  subtitle: string
  description: string
  color: string
  specs: TechnicalSpec[]
  architecture: {
    title: string
    description: string
    diagram: string[]
  }
}

const serviceContents: Record<ServiceId, ServiceContent> = {
  development: {
    id: 'development',
    title: 'Arquitectura Web & CTO-as-a-Service',
    subtitle: 'Ingeniería de alto rendimiento para marcas exigentes',
    description: 'Construimos infraestructuras digitales escalables que superan los estándares de la industria.',
    color: '#D4AF37',
    specs: [
      {
        icon: <FaRocket className="w-5 h-5" />,
        title: 'Jamstack Architecture',
        description: 'Arquitectura moderna que combina pre-renderizado estático con funcionalidades dinámicas.',
        metrics: ['Performance: 99%', 'TTI: < 200ms', 'Security: A+'],
        technologies: ['Next.js 14', 'React 18', 'TypeScript', 'GraphQL'],
        deliverables: ['Arquitectura modular', 'Documentación', 'CI/CD Pipeline']
      },
      {
        icon: <FaDatabase className="w-5 h-5" />,
        title: 'Edge Database & Caching',
        description: 'Bases de datos distribuidas con caching perimetral.',
        metrics: ['Latency: < 50ms', 'Cache Hit: 95%', 'Regions: 15+'],
        technologies: ['Redis', 'Vercel KV', 'Prisma'],
        deliverables: ['Estrategia de caching', 'Monitoreo real-time']
      },
      {
        icon: <FaCloud className="w-5 h-5" />,
        title: 'Image Optimization Pipeline',
        description: 'Sistema automatizado de optimización de imágenes.',
        metrics: ['Reduction: 75%', 'LCP: < 1.2s', 'CLS: 0.0'],
        technologies: ['Next/Image', 'Sharp', 'WebP', 'AVIF'],
        deliverables: ['Pipeline optimizado', 'Lazy loading']
      },
      {
        icon: <FaNetworkWired className="w-5 h-5" />,
        title: 'GraphQL Federation',
        description: 'API Gateway unificado para múltiples servicios.',
        metrics: ['Response: < 100ms', 'Cache: 90%'],
        technologies: ['Apollo', 'GraphQL', 'WebSocket'],
        deliverables: ['Federación de servicios', 'Documentación']
      }
    ],
    architecture: {
      title: 'Arquitectura de Red',
      description: 'Infraestructura escalable con alta disponibilidad.',
      diagram: ['🌐 CDN Global', '⚡ Edge Middleware', '📡 GraphQL Federation']
    }
  },
  content: {
    id: 'content',
    title: 'Producción de Contenido de Alto Impacto',
    subtitle: 'Storytelling visual que domina algoritmos',
    description: 'Creamos narrativas visuales que combinan arte y ciencia.',
    color: '#D4AF37',
    specs: [
      {
        icon: <FaPalette className="w-5 h-5" />,
        title: 'Cinematic Color Grading',
        description: 'Técnicas profesionales de corrección de color.',
        metrics: ['Accuracy: 99%', 'HDR Support', 'Consistency: 95%'],
        technologies: ['DaVinci Resolve', 'HDR', 'ACES'],
        deliverables: ['Presets de color', 'Guía visual']
      },
      {
        icon: <FaChartLine className="w-5 h-5" />,
        title: 'Retention Analytics & Hooks',
        description: 'Análisis de patrones de retención.',
        metrics: ['Retention: 85%', 'Engagement: 3.2x', 'Watch: +45%'],
        technologies: ['YouTube Analytics', 'Facebook API'],
        deliverables: ['Mapa de retención', 'Estrategia de hooks']
      }
    ],
    architecture: {
      title: 'Flujo de Producción',
      description: 'Pipeline integrado con herramientas profesionales.',
      diagram: ['📹 Captura RAW', '🎬 Edición', '📊 Analytics']
    }
  },
  automation: {
    id: 'automation',
    title: 'Automatización de Backend con IA',
    subtitle: 'Sistemas inteligentes que optimizan operaciones',
    description: 'Pipelines de automatización con inteligencia artificial.',
    color: '#D4AF37',
    specs: [
      {
        icon: <FaRobot className="w-5 h-5" />,
        title: 'AI-Powered Lead Management',
        description: 'Sistema que clasifica y califica leads automáticamente.',
        metrics: ['Accuracy: 94%', 'Conversion: +45%', 'Response: < 5s'],
        technologies: ['OpenAI API', 'TensorFlow'],
        deliverables: ['Modelo de scoring', 'Dashboard']
      },
      {
        icon: <FaNetworkWired className="w-5 h-5" />,
        title: 'WhatsApp Automation Pipeline',
        description: 'Comunicación automatizada con clientes.',
        metrics: ['Response: < 5s', 'Automation: 75%', 'Satisfaction: 92%'],
        technologies: ['WhatsApp API', 'OpenAI', 'Twilio'],
        deliverables: ['Pipeline de comunicación', 'Flujos conversacionales']
      }
    ],
    architecture: {
      title: 'Pipeline de Automatización',
      description: 'Arquitectura que conecta múltiples servicios en tiempo real.',
      diagram: ['📨 Webhook Triggers', '🧠 AI Engine', '📱 WhatsApp Gateway']
    }
  }
}

export default function TechDrawer({ isOpen, serviceId, onClose }: TechDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<'specs' | 'architecture'>('specs')
  const [activeSpecIndex, setActiveSpecIndex] = useState(0)

  const service = serviceId ? serviceContents[serviceId] : null

  useEffect(() => {
    const drawer = drawerRef.current
    const content = contentRef.current

    if (!drawer) return

    if (isOpen && service) {
      gsap.set(drawer, { x: '100%', opacity: 0 })
      gsap.set(content, { opacity: 0, y: 20 })

      const tl = gsap.timeline({
        defaults: { ease: 'power4.out', duration: 0.8 }
      })

      tl.to(drawer, { x: '0%', opacity: 1, duration: 0.9, ease: 'power4.out' })
        .to(content, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, delay: 0.2 })

      document.body.style.overflow = 'hidden'
      
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0
      }
    } else {
      gsap.to(drawer, {
        x: '100%',
        opacity: 0,
        duration: 0.6,
        ease: 'power3.inOut',
        onComplete: () => {
          document.body.style.overflow = 'unset'
        }
      })
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, service])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    setActiveSpecIndex(0)
    setActiveTab('specs')
  }, [serviceId])

  if (!service) return null

  const currentSpec = service.specs[activeSpecIndex] || service.specs[0]

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[#050505]/80 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        ref={drawerRef}
        className="fixed inset-y-0 right-0 w-full md:w-[600px] z-50 bg-[#0A0A0A] border-l border-[#D4AF37]/20 shadow-2xl"
        style={{ transform: 'translateX(100%)' }}
      >
        <div className="flex flex-col h-full">
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-4"
            style={{ 
              overscrollBehavior: 'contain',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin',
              scrollbarColor: '#D4AF37 transparent'
            }}
          >
            <div ref={contentRef}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ 
                        background: `linear-gradient(135deg, ${service.color}20, ${service.color}10)`,
                        border: `1px solid ${service.color}30`
                      }}
                    >
                      {service.id === 'development' && <FaCode className="w-6 h-6 text-[#D4AF37]" />}
                      {service.id === 'content' && <FaVideo className="w-6 h-6 text-[#D4AF37]" />}
                      {service.id === 'automation' && <FaRobot className="w-6 h-6 text-[#D4AF37]" />}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-xl font-bold text-white truncate">
                        {service.title}
                      </h2>
                      <p className="text-sm text-[#DCDCDC]/60 truncate">{service.subtitle}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[#D4AF37]/10 transition-colors duration-300 text-[#DCDCDC]/60 hover:text-[#D4AF37] shrink-0 ml-2"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              <p className="text-[#DCDCDC]/70 text-sm leading-relaxed mb-6">
                {service.description}
              </p>

              <div className="flex gap-2 mb-6 border-b border-[#D4AF37]/10">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    activeTab === 'specs'
                      ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                      : 'text-[#DCDCDC]/40 hover:text-[#DCDCDC]/70'
                  }`}
                >
                  Especificaciones
                </button>
                <button
                  onClick={() => setActiveTab('architecture')}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    activeTab === 'architecture'
                      ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                      : 'text-[#DCDCDC]/40 hover:text-[#DCDCDC]/70'
                  }`}
                >
                  Arquitectura
                </button>
              </div>

              <div>
                {activeTab === 'specs' ? (
                  <>
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                      {service.specs.map((spec, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveSpecIndex(index)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all duration-300 shrink-0 ${
                            activeSpecIndex === index
                              ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                              : 'text-[#DCDCDC]/40 hover:text-[#DCDCDC]/70 hover:bg-[#D4AF37]/5'
                          }`}
                        >
                          <span className="text-[#D4AF37]">{spec.icon}</span>
                          {spec.title}
                        </button>
                      ))}
                    </div>

                    {currentSpec && (
                      <div className="bg-[#050505] rounded-lg border border-[#D4AF37]/10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                            {currentSpec.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {currentSpec.title}
                            </h3>
                            <p className="text-sm text-[#DCDCDC]/60">
                              {currentSpec.description}
                            </p>
                          </div>
                        </div>

                        {currentSpec.metrics && currentSpec.metrics.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                            {currentSpec.metrics.map((metric, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 text-xs text-[#DCDCDC]/60 bg-[#D4AF37]/5 rounded-lg px-3 py-2"
                              >
                                <FaCheckCircle className="w-3 h-3 text-[#D4AF37] shrink-0" />
                                <span>{metric}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {currentSpec.technologies && currentSpec.technologies.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-xs uppercase tracking-[0.15em] text-[#DCDCDC]/40 font-medium mb-2">
                              Tecnologías
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {currentSpec.technologies.map((tech, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-3 py-1.5 bg-[#D4AF37]/5 border border-[#D4AF37]/10 rounded-lg text-[#DCDCDC]/70"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {currentSpec.deliverables && currentSpec.deliverables.length > 0 && (
                          <div>
                            <h4 className="text-xs uppercase tracking-[0.15em] text-[#DCDCDC]/40 font-medium mb-2">
                              Deliverables
                            </h4>
                            <ul className="space-y-1">
                              {currentSpec.deliverables.map((deliverable, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-[#DCDCDC]/60">
                                  <FaArrowRight className="w-3 h-3 text-[#D4AF37] mt-1 shrink-0" />
                                  <span>{deliverable}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-[#050505] rounded-lg border border-[#D4AF37]/10 p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {service.architecture.title}
                    </h3>
                    <p className="text-sm text-[#DCDCDC]/60 leading-relaxed mb-4">
                      {service.architecture.description}
                    </p>
                    <div className="space-y-2">
                      {service.architecture.diagram.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 text-sm text-[#DCDCDC]/70 bg-[#D4AF37]/5 rounded-lg px-4 py-2 border border-[#D4AF37]/5"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="h-20" />
            </div>
          </div>

          <div className="flex-shrink-0 bg-[#0A0A0A] border-t border-[#D4AF37]/10 p-6">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#050505] font-semibold rounded-lg hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300"
            >
              Solicitar asesoría técnica
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 2px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
      `}</style>
    </>
  )
}