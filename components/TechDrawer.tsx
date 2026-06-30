// components/TechDrawer.tsx - VERSIÓN COMPLETA CORREGIDA
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

// ============================================================
// CONTENIDO DE SERVICIOS - COMPLETO
// ============================================================

const serviceContents: Record<ServiceId, ServiceContent> = {
  development: {
    id: 'development',
    title: 'Arquitectura Web & CTO-as-a-Service',
    subtitle: 'Ingeniería de alto rendimiento para marcas exigentes',
    description: 'Construimos infraestructuras digitales escalables que superan los estándares de la industria, optimizando cada aspecto técnico para garantizar velocidad, seguridad y experiencia de usuario excepcional.',
    color: '#D4AF37',
    specs: [
      {
        icon: <FaRocket className="w-5 h-5" />,
        title: 'Jamstack Architecture',
        description: 'Arquitectura moderna que combina pre-renderizado estático con funcionalidades dinámicas mediante API, garantizando velocidad extrema y seguridad nativa.',
        metrics: ['Performance Score: 99%', 'TTI: < 200ms', 'Security Rating: A+'],
        technologies: ['Next.js 14', 'React 18', 'TypeScript', 'GraphQL', 'PostgreSQL'],
        deliverables: ['Arquitectura modular completa', 'Documentación técnica exhaustiva', 'CI/CD Pipeline configurado', 'Pruebas de rendimiento automatizadas']
      },
      {
        icon: <FaDatabase className="w-5 h-5" />,
        title: 'Edge Database & Caching',
        description: 'Bases de datos distribuidas con caching perimetral que reduce la latencia global y mejora la experiencia de usuarios en cualquier región del mundo.',
        metrics: ['Read Latency: < 50ms', 'Cache Hit Rate: 95%', 'Global Distribution: 15+ regions'],
        technologies: ['Redis', 'Vercel KV', 'Upstash', 'Prisma', 'Edge Config'],
        deliverables: ['Estrategia de caching definida', 'Migración de datos optimizada', 'Monitoreo en tiempo real', 'Backup automation configurada']
      },
      {
        icon: <FaCloud className="w-5 h-5" />,
        title: 'Image Optimization Pipeline',
        description: 'Sistema automatizado de optimización de imágenes que transforma automáticamente assets a formatos modernos (WebP, AVIF) con carga progresiva y Lazy Loading inteligente.',
        metrics: ['Image Weight Reduction: 75%', 'LCP: < 1.2s', 'CLS: 0.0'],
        technologies: ['Next/Image', 'Sharp', 'WebP', 'AVIF', 'Cloudinary'],
        deliverables: ['Pipeline de optimización', 'Estrategia de lazy loading', 'Soporte para múltiples formatos', 'Dashboard de monitoreo de assets']
      },
      {
        icon: <FaNetworkWired className="w-5 h-5" />,
        title: 'GraphQL Federation',
        description: 'API Gateway unificado que federada múltiples servicios de backend, proporcionando una interfaz única y eficiente para el frontend con resolución optimizada de datos.',
        metrics: ['API Response: < 100ms', 'Query Complexity: Optimizada', 'Cache Efficiency: 90%'],
        technologies: ['Apollo Federation', 'GraphQL', 'WebSocket', 'REST', 'gRPC'],
        deliverables: ['Federación de servicios', 'Documentación GraphQL', 'Sistema de monitoreo', 'Rate limiting implementado']
      }
    ],
    architecture: {
      title: 'Arquitectura de Red',
      description: 'Nuestra infraestructura está diseñada para escalar horizontalmente con alta disponibilidad. Usamos un enfoque de microservicios con orquestación en Kubernetes, complementado con Edge Functions que reducen la latencia global.',
      diagram: [
        '🌐 CDN Global Distribution',
        '⚡ Edge Middleware Layer',
        '🔄 Service Mesh (Istio)',
        '📡 GraphQL Federation',
        '💾 Distributed Cache (Redis)',
        '🗄️ Database Clusters (PostgreSQL)',
        '📊 Analytics & Monitoring (Datadog)'
      ]
    }
  },
  content: {
    id: 'content',
    title: 'Producción de Contenido de Alto Impacto',
    subtitle: 'Storytelling visual que domina algoritmos y retiene audiencias',
    description: 'Creamos narrativas visuales que combinan arte y ciencia, utilizando técnicas cinematográficas avanzadas y estrategias algorítmicas para maximizar el engagement y la retención.',
    color: '#D4AF37',
    specs: [
      {
        icon: <FaPalette className="w-5 h-5" />,
        title: 'Cinematic Color Grading',
        description: 'Técnicas profesionales de corrección y gradación de color que garantizan una estética cinematográfica consistente en todos los dispositivos y plataformas.',
        metrics: ['Color Accuracy: 99% Rec.709', 'HDR Support: Dolby Vision', 'Consistency: 95% cross-device'],
        technologies: ['DaVinci Resolve', 'Color Space', 'HDR', 'ACES', 'LUTs'],
        deliverables: ['Presets de color personalizados', 'Guía de estilo visual', 'Optimización para múltiples plataformas', 'Control de calidad visual']
      },
      {
        icon: <FaChartLine className="w-5 h-5" />,
        title: 'Retention Analytics & Hooks',
        description: 'Análisis de patrones de retención que identifican los momentos críticos donde se pierde audiencia, diseñando hooks visuales y narrativos para mantener el engagement.',
        metrics: ['Retention Rate: 85% @ 3s', 'Engagement: 3.2x promedio', 'Watch Time: +45%'],
        technologies: ['YouTube Analytics', 'Facebook API', 'TikTok Analytics', 'Google Analytics'],
        deliverables: ['Mapa de retención visual', 'Estrategia de hooks', 'Reportes mensuales de engagement', 'Optimización continua de contenido']
      },
      {
        icon: <FaMicrochip className="w-5 h-5" />,
        title: 'Video Compression Pipeline',
        description: 'Sistema inteligente de compresión que mantiene la calidad visual mientras optimiza los archivos para streaming rápido en diferentes dispositivos y velocidades de conexión.',
        metrics: ['Size Reduction: 60-70%', 'Quality Degradation: < 5%', 'Adaptive Bitrate: Soporte'],
        technologies: ['FFmpeg', 'H.264', 'H.265', 'VP9', 'AV1'],
        deliverables: ['Pipeline de compresión', 'Estrategia de adaptación', 'Testeo en múltiples dispositivos', 'Documentación técnica de codificación']
      },
      {
        icon: <FaCogs className="w-5 h-5" />,
        title: 'Algorithm-Optimized Content',
        description: 'Contenido diseñado específicamente para los algoritmos de las principales plataformas, maximizando el alcance orgánico y la viralidad mediante estrategias basadas en datos.',
        metrics: ['Organic Reach: +150%', 'Viral Coefficient: 1.8', 'Algorithm Score: 92%'],
        technologies: ['Facebook Graph API', 'TikTok Creative API', 'Twitter API', 'Instagram Graph'],
        deliverables: ['Estrategia algorítmica', 'Calendario de contenido', 'A/B Testing constante', 'Dashboards de rendimiento']
      }
    ],
    architecture: {
      title: 'Flujo de Producción Audiovisual',
      description: 'Nuestro pipeline de producción integra herramientas de edición profesional con sistemas de analíticas en tiempo real, permitiendo ajustes instantáneos basados en el rendimiento del contenido en las plataformas.',
      diagram: [
        '📹 Captura RAW (4K/8K)',
        '🎬 Edición y Color Grading',
        '📊 Analytics Engine',
        '🧠 AI Content Optimization',
        '📱 Platform Adaptation',
        '🚀 Multi-Platform Distribution',
        '📈 Performance Monitoring'
      ]
    }
  },
  automation: {
    id: 'automation',
    title: 'Automatización de Backend con IA',
    subtitle: 'Sistemas inteligentes que optimizan operaciones y maximizan conversiones',
    description: 'Implementamos pipelines de automatización avanzada que utilizan inteligencia artificial para optimizar procesos, reducir costos operativos y mejorar la experiencia del cliente.',
    color: '#D4AF37',
    specs: [
      {
        icon: <FaRobot className="w-5 h-5" />,
        title: 'AI-Powered Lead Management',
        description: 'Sistema inteligente que clasifica, califica y asigna leads automáticamente utilizando modelos de machine learning para maximizar la conversión.',
        metrics: ['Lead Scoring Accuracy: 94%', 'Conversion Rate: +45%', 'Response Time: < 5s'],
        technologies: ['OpenAI API', 'TensorFlow', 'Scikit-learn', 'Salesforce', 'HubSpot'],
        deliverables: ['Modelo de scoring entrenado', 'Dashboard de leads', 'Integración con CRM', 'Sistema de recomendación']
      },
      {
        icon: <FaNetworkWired className="w-5 h-5" />,
        title: 'WhatsApp Automation Pipeline',
        description: 'Flujo automatizado de comunicación con clientes a través de WhatsApp Enterprise, con respuestas personalizadas mediante IA y seguimiento inteligente de conversaciones.',
        metrics: ['Response Time: < 5s', 'Automation Rate: 75%', 'Customer Satisfaction: 92%'],
        technologies: ['WhatsApp Business API', 'OpenAI', 'Twilio', 'Webhooks', 'AWS Lambda'],
        deliverables: ['Pipeline de comunicación', 'Flujos conversacionales', 'Sistema de seguimiento', 'Dashboard de interacciones']
      },
      {
        icon: <FaChartLine className="w-5 h-5" />,
        title: 'Predictive Analytics',
        description: 'Sistema que analiza patrones de comportamiento y tendencias del mercado para predecir oportunidades y riesgos, permitiendo decisiones estratégicas basadas en datos.',
        metrics: ['Prediction Accuracy: 89%', 'Revenue Impact: +23%', 'Risk Reduction: 67%'],
        technologies: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Tableau'],
        deliverables: ['Modelo predictivo', 'Dashboards interactivos', 'Alertas inteligentes', 'Recomendaciones estratégicas']
      },
      {
        icon: <FaShieldAlt className="w-5 h-5" />,
        title: 'Security & Compliance',
        description: 'Sistema de seguridad automatizado que monitoriza constantemente amenazas, gestiona permisos de acceso y asegura el cumplimiento de normativas como GDPR y CCPA.',
        metrics: ['Security Score: 98%', 'Compliance Rate: 100%', 'Incident Response: < 30s'],
        technologies: ['OAuth 2.0', 'JWT', 'SOC 2', 'GDPR', 'Cloudflare'],
        deliverables: ['Auditoría de seguridad', 'Políticas de acceso', 'Sistema de monitoreo', 'Reportes de cumplimiento']
      }
    ],
    architecture: {
      title: 'Pipeline de Automatización',
      description: 'Nuestra arquitectura de automatización conecta múltiples servicios y APIs en un flujo orquestado que procesa datos en tiempo real, activando acciones automáticas basadas en reglas de negocio e inteligencia artificial.',
      diagram: [
        '📨 Webhook Triggers',
        '🧠 AI Processing Engine',
        '🔄 Service Orchestration',
        '📱 WhatsApp Gateway',
        '💾 CRM Integration',
        '📊 Analytics Pipeline',
        '📝 Automatic Reporting'
      ]
    }
  }
}

// ============================================================
// COMPONENTE PRINCIPAL - CON SCROLL INTERNO FUNCIONAL
// ============================================================

export default function TechDrawer({ isOpen, serviceId, onClose }: TechDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<'specs' | 'architecture'>('specs')
  const [activeSpecIndex, setActiveSpecIndex] = useState(0)

  const service = serviceId ? serviceContents[serviceId] : null

  // ✅ Animación de entrada/salida
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
      
      // ✅ Resetear scroll al abrir
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

  // ✅ Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // ✅ Resetear estado cuando cambia el servicio
  useEffect(() => {
    setActiveSpecIndex(0)
    setActiveTab('specs')
  }, [serviceId])

  if (!service) return null

  // ✅ Obtener la especificación actual de forma segura
  const currentSpec = service.specs[activeSpecIndex] || service.specs[0]

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[#050505]/80 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer con scroll interno */}
      <div
        ref={drawerRef}
        className="fixed inset-y-0 right-0 w-full md:w-[600px] z-50 bg-[#0A0A0A] border-l border-[#D4AF37]/20 shadow-2xl"
        style={{ transform: 'translateX(100%)' }}
      >
        {/* ✅ Contenedor con scroll interno - CORREGIDO */}
        <div 
          ref={scrollContainerRef}
          className="h-full overflow-y-auto overflow-x-hidden"
          style={{ 
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
            scrollbarColor: '#D4AF37 transparent'
          }}
        >
          <div ref={contentRef} className="p-6 pb-32">
            {/* Header */}
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

            {/* Tabs */}
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

            {/* Contenido */}
            <div>
              {activeTab === 'specs' ? (
                <>
                  {/* ✅ Navegación de especificaciones */}
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#D4AF37]/20 scrollbar-track-transparent">
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

                  {/* ✅ Detalle de especificación - CON VERIFICACIÓN DE SEGURIDAD */}
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

                      {/* ✅ Métricas - CON VERIFICACIÓN */}
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

                      {/* ✅ Tecnologías - CON VERIFICACIÓN */}
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

                      {/* ✅ Deliverables - CON VERIFICACIÓN */}
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
                /* ✅ Arquitectura */
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

            {/* ✅ Espacio para el footer fijo */}
            <div className="h-4" />
          </div>
        </div>

        {/* ✅ Footer fijo abajo - Siempre visible */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#D4AF37]/10 p-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#050505] font-semibold rounded-lg hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300"
          >
            Solicitar asesoría técnica
          </button>
        </div>
      </div>

      {/* ✅ Estilos para scrollbar */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.2);
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.4);
        }
      `}</style>
    </>
  )
}