// components/Footer.tsx - VERSIÓN COMPLETA REDISEÑADA CON NOTIFICACIONES
'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import Link from 'next/link'
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaYoutube,
  FaArrowRight,
  FaCheck,
  FaCode,
  FaDatabase,
  FaCloud,
  FaFileAlt,
  FaGitAlt,
  FaShieldAlt,
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaBuilding,
  FaVideo,
  FaRobot,
  FaArrowLeft,
  FaRocket,
  FaChartLine,
  FaCogs
} from 'react-icons/fa'
import ToastNotification from './ToastNotification'
import SectionBackground from './SectionBackground'

// ============================================================
// 1. TIPOS Y DEFINICIONES
// ============================================================

type Step = 1 | 2 | 3

interface FormData {
  name: string
  email: string
  company: string
  service: 'development' | 'content' | 'automation' | ''
  budget: '2k-5k' | '5k-10k' | '10k+' | ''
  message: string
  acceptTerms: boolean
}

interface FormErrors {
  name?: string
  email?: string
  company?: string
  service?: string
  budget?: string
  message?: string
  acceptTerms?: string
  submit?: string
}

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error'
}

// ============================================================
// 2. CONSTANTES
// ============================================================

const serviceOptions = [
  {
    value: 'development' as const,
    label: 'Desarrollo Next.js',
    icon: <FaCode className="w-5 h-5" />,
    description: 'Arquitectura web escalable',
    color: '#D4AF37'
  },
  {
    value: 'content' as const,
    label: 'Estrategia Viral',
    icon: <FaVideo className="w-5 h-5" />,
    description: 'Contenido de alto impacto',
    color: '#D4AF37'
  },
  {
    value: 'automation' as const,
    label: 'Automatización AI',
    icon: <FaRobot className="w-5 h-5" />,
    description: 'Pipelines inteligentes',
    color: '#D4AF37'
  }
]

const budgetOptions = [
  {
    value: '2k-5k' as const,
    label: '$2K - $5K',
    description: 'Proyecto inicial',
    icon: <FaRocket className="w-4 h-4" />
  },
  {
    value: '5k-10k' as const,
    label: '$5K - $10K',
    description: 'Proyecto intermedio',
    icon: <FaChartLine className="w-4 h-4" />
  },
  {
    value: '10k+' as const,
    label: '+$10K',
    description: 'Proyecto enterprise',
    icon: <FaCogs className="w-4 h-4" />
  }
]

const engineeringLinks = [
  { label: 'Arquitectura de Software', href: '#', icon: <FaCode className="w-3 h-3" /> },
  { label: 'Open Source', href: '#', icon: <FaGitAlt className="w-3 h-3" /> },
  { label: 'Status del Sistema', href: '#', icon: <FaCloud className="w-3 h-3" /> },
  { label: 'Documentación de API', href: '#documentacion', icon: <FaFileAlt className="w-3 h-3" /> },
  { label: 'GitHub Corporativo', href: '#', icon: <FaDatabase className="w-3 h-3" /> }
]

const socialLinks = [
  { icon: <FaLinkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
  { icon: <FaTwitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
  { icon: <FaGithub className="w-5 h-5" />, href: '#', label: 'GitHub' },
  { icon: <FaYoutube className="w-5 h-5" />, href: '#', label: 'YouTube' }
]

// ============================================================
// 3. FUNCIONES DE VALIDACIÓN
// ============================================================

const validateField = (field: keyof FormData, value: string | boolean): string | undefined => {
  switch (field) {
    case 'name':
      if (!value || (typeof value === 'string' && value.length < 2)) {
        return 'El nombre debe tener al menos 2 caracteres'
      }
      if (typeof value === 'string' && value.length > 100) {
        return 'El nombre es demasiado largo'
      }
      return undefined

    case 'email':
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!value || (typeof value === 'string' && !emailRegex.test(value))) {
        return 'Email corporativo inválido'
      }
      return undefined

    case 'company':
      if (!value || (typeof value === 'string' && value.length < 2)) {
        return 'El nombre de la empresa es requerido'
      }
      return undefined

    case 'service':
      if (!value) return 'Selecciona un servicio'
      return undefined

    case 'budget':
      if (!value) return 'Selecciona un rango de presupuesto'
      return undefined

    case 'message':
      if (!value || (typeof value === 'string' && value.length < 10)) {
        return 'El mensaje debe tener al menos 10 caracteres'
      }
      if (typeof value === 'string' && value.length > 2000) {
        return 'El mensaje es demasiado largo'
      }
      return undefined

    case 'acceptTerms':
      if (!value) return 'Debes aceptar los términos'
      return undefined

    default:
      return undefined
  }
}

const validateStep = (step: Step, formData: FormData): { isValid: boolean; errors: FormErrors } => {
  const fieldsToValidate: (keyof FormData)[] = []

  if (step === 1) {
    fieldsToValidate.push('name', 'email', 'company')
  } else if (step === 2) {
    fieldsToValidate.push('service')
  } else if (step === 3) {
    fieldsToValidate.push('budget', 'message', 'acceptTerms')
  }

  let isValid = true
  const newErrors: FormErrors = {}

  fieldsToValidate.forEach(field => {
    const value = formData[field]
    const error = validateField(field, value)
    if (error) {
      newErrors[field] = error
      isValid = false
    }
  })

  return { isValid, errors: newErrors }
}

// ============================================================
// 4. COMPONENTE PRINCIPAL
// ============================================================

export default function Footer() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const formRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    service: '',
    budget: '',
    message: '',
    acceptTerms: false
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [touchedFields, setTouchedFields] = useState<Set<keyof FormData>>(new Set())
  
  // ✅ Estado para la notificación
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  })

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleFieldChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setTouchedFields(prev => new Set(prev).add(field))

    const error = validateField(field, value)
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const validateCurrentStep = (): boolean => {
    const result = validateStep(currentStep, formData)
    setErrors(prev => ({ ...prev, ...result.errors }))
    return result.isValid
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep === 3) {
        handleSubmit()
      } else {
        setCurrentStep(prev => (prev + 1) as Step)
        gsap.fromTo('.step-content',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        )
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => (prev - 1) as Step)
      gsap.fromTo('.step-content',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      )
    }
  }

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return

    setIsSubmitting(true)
    setErrors(prev => ({ ...prev, submit: undefined }))

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          service: formData.service,
          budget: formData.budget,
          message: formData.message,
          acceptTerms: formData.acceptTerms
        })
      })

      const result = await response.json()

      if (!response.ok) {
        const errorMessage = result.error || result.details?.[0]?.message || 'Error al enviar el formulario'
        throw new Error(errorMessage)
      }

      // ✅ ÉXITO - Mostrar notificación
      setToast({
        show: true,
        message: '✅ Tu postulación ha sido recibida exitosamente. Nuestro equipo de ingeniería evaluará tu infraestructura en las próximas 24 horas.',
        type: 'success'
      })

      // Animación de desvanecimiento del formulario
      if (formRef.current) {
        gsap.to(formRef.current, {
          opacity: 0,
          y: -30,
          duration: 0.6,
          ease: 'power3.out',
          onComplete: () => {
            setIsSubmitted(true)
            setIsSubmitting(false)

            if (successRef.current) {
              gsap.fromTo(successRef.current,
                { opacity: 0, y: 40, scale: 0.9 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.8,
                  ease: 'power3.out',
                  delay: 0.2
                }
              )
            }
          }
        })
      }

    } catch (error) {
      console.error('Error al enviar:', error)
      setIsSubmitting(false)

      // ✅ ERROR - Mostrar notificación de error
      const errorMessage = error instanceof Error ? error.message : 'Error al enviar el formulario'
      
      setToast({
        show: true,
        message: `❌ ${errorMessage}`,
        type: 'error'
      })

      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }))
    }
  }

  // Resetear errores de submit al cambiar de paso
  useEffect(() => {
    setErrors(prev => ({ ...prev, submit: undefined }))
  }, [currentStep])

  // ============================================================
  // COMPONENTES INTERNOS
  // ============================================================

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <button
            onClick={() => {
              if (step < currentStep) {
                setCurrentStep(step as Step)
              }
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
              step === currentStep
                ? 'bg-[#D4AF37] text-[#050505]'
                : step < currentStep
                ? 'bg-[#D4AF37]/30 text-[#DCDCDC] cursor-pointer hover:bg-[#D4AF37]/50'
                : 'bg-[#DCDCDC]/10 text-[#DCDCDC]/30 cursor-default'
            }`}
          >
            {step < currentStep ? <FaCheck className="w-3 h-3" /> : step}
          </button>
          {step < 3 && (
            <div className={`w-12 h-0.5 ${
              step < currentStep ? 'bg-[#D4AF37]/30' : 'bg-[#DCDCDC]/10'
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      <footer
        id="postular"
        ref={ref}
        className="bg-[#0A0A0A] relative overflow-hidden"
      >
        {/* ✅ Fondo dinámico */}
        <SectionBackground variant="glow" intensity="medium" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16"
          >
            {/* Columna de Brand - Izquierda */}
            <div className="lg:col-span-4">
              <Link href="/" className="flex items-center space-x-3 group">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20"
                >
                  <span className="text-[#050505] font-bold text-xl">PS</span>
                </motion.div>
                <span className="text-2xl font-light tracking-wider">
                  PRISMA<span className="text-[#D4AF37] font-bold">SKY</span>
                </span>
              </Link>
              <p className="mt-4 text-[#DCDCDC]/60 text-sm max-w-md leading-relaxed">
                Ingeniería de software premium y producción audiovisual de alto impacto.
                Transformamos marcas con tecnología de vanguardia.
              </p>

              <div className="mt-8">
                <h4 className="text-xs uppercase tracking-[0.2em] text-[#DCDCDC]/40 font-semibold mb-4">
                  Enlaces de Ingeniería
                </h4>
                <div className="space-y-2">
                  {engineeringLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex items-center gap-2 text-[#DCDCDC]/60 hover:text-[#D4AF37] transition-colors duration-300 text-sm py-1 group"
                    >
                      <span className="text-[#D4AF37] group-hover:scale-110 transition-transform">
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-xs uppercase tracking-[0.2em] text-[#DCDCDC]/40 font-semibold mb-4">
                  Conéctate
                </h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -3 }}
                      className="w-10 h-10 rounded-full border border-[#D4AF37]/20 flex items-center justify-center text-[#DCDCDC]/60 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300"
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-4 bg-[#050505] border border-[#D4AF37]/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#27C93F] animate-pulse" />
                  <span className="text-sm font-medium text-[#D4AF37]">99.99% Operational</span>
                </div>
                <p className="text-xs text-[#DCDCDC]/30 mt-1">Todos los servicios activos</p>
              </div>
            </div>

            {/* Formulario Multi-Step - Derecha */}
            <div className="lg:col-span-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-[#050505] rounded-2xl border border-[#D4AF37]/10 p-6 sm:p-8 min-h-[500px]"
              >
                <h3 className="text-2xl font-bold text-white mb-2">
                  Foro de <span className="text-[#D4AF37]">Diagnóstico Técnico</span>
                </h3>
                <p className="text-[#DCDCDC]/60 text-sm mb-6">
                  Completa los pasos para recibir una evaluación personalizada de tu proyecto
                </p>

                <StepIndicator />

                {/* Mensaje de error general */}
                {errors.submit && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {errors.submit}
                  </div>
                )}

                {/* Formulario */}
                <div ref={formRef} className="step-content">
                  {!isSubmitted ? (
                    <>
                      {/* Paso 1: Datos de Identidad */}
                      {currentStep === 1 && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs uppercase tracking-[0.15em] text-[#DCDCDC]/40 font-medium mb-1.5">
                              Nombre completo *
                            </label>
                            <div className="relative">
                              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#DCDCDC]/30" />
                              <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                onBlur={() => {
                                  setTouchedFields(prev => new Set(prev).add('name'))
                                  const error = validateField('name', formData.name)
                                  setErrors(prev => ({ ...prev, name: error }))
                                }}
                                className={`w-full pl-10 pr-4 py-3 bg-[#0A0A0A] border rounded-lg text-white placeholder-[#DCDCDC]/30 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300 outline-none ${
                                  touchedFields.has('name') && errors.name
                                    ? 'border-red-500/50'
                                    : 'border-[#DCDCDC]/10'
                                }`}
                                placeholder="Tu nombre completo"
                                disabled={isSubmitting}
                              />
                            </div>
                            {touchedFields.has('name') && errors.name && (
                              <p className="text-xs text-red-400 mt-1">{errors.name}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs uppercase tracking-[0.15em] text-[#DCDCDC]/40 font-medium mb-1.5">
                              Email corporativo *
                            </label>
                            <div className="relative">
                              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[#DCDCDC]/30" />
                              <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleFieldChange('email', e.target.value)}
                                onBlur={() => {
                                  setTouchedFields(prev => new Set(prev).add('email'))
                                  const error = validateField('email', formData.email)
                                  setErrors(prev => ({ ...prev, email: error }))
                                }}
                                className={`w-full pl-10 pr-4 py-3 bg-[#0A0A0A] border rounded-lg text-white placeholder-[#DCDCDC]/30 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300 outline-none ${
                                  touchedFields.has('email') && errors.email
                                    ? 'border-red-500/50'
                                    : 'border-[#DCDCDC]/10'
                                }`}
                                placeholder="tu@empresa.com"
                                disabled={isSubmitting}
                              />
                            </div>
                            {touchedFields.has('email') && errors.email && (
                              <p className="text-xs text-red-400 mt-1">{errors.email}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs uppercase tracking-[0.15em] text-[#DCDCDC]/40 font-medium mb-1.5">
                              Empresa *
                            </label>
                            <div className="relative">
                              <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-[#DCDCDC]/30" />
                              <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => handleFieldChange('company', e.target.value)}
                                onBlur={() => {
                                  setTouchedFields(prev => new Set(prev).add('company'))
                                  const error = validateField('company', formData.company)
                                  setErrors(prev => ({ ...prev, company: error }))
                                }}
                                className={`w-full pl-10 pr-4 py-3 bg-[#0A0A0A] border rounded-lg text-white placeholder-[#DCDCDC]/30 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300 outline-none ${
                                  touchedFields.has('company') && errors.company
                                    ? 'border-red-500/50'
                                    : 'border-[#DCDCDC]/10'
                                }`}
                                placeholder="Nombre de tu empresa"
                                disabled={isSubmitting}
                              />
                            </div>
                            {touchedFields.has('company') && errors.company && (
                              <p className="text-xs text-red-400 mt-1">{errors.company}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Paso 2: Selección de Servicio */}
                      {currentStep === 2 && (
                        <div className="space-y-4">
                          <label className="block text-xs uppercase tracking-[0.15em] text-[#DCDCDC]/40 font-medium mb-2">
                            Selecciona el servicio que necesitas *
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {serviceOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => handleFieldChange('service', option.value)}
                                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                                  formData.service === option.value
                                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-lg shadow-[#D4AF37]/10'
                                    : 'border-[#DCDCDC]/10 hover:border-[#D4AF37]/30 bg-[#0A0A0A]'
                                }`}
                                disabled={isSubmitting}
                              >
                                <div className="text-[#D4AF37] mb-2">{option.icon}</div>
                                <div className="text-sm font-medium text-white">{option.label}</div>
                                <div className="text-xs text-[#DCDCDC]/40 mt-1">{option.description}</div>
                              </button>
                            ))}
                          </div>
                          {errors.service && (
                            <p className="text-xs text-red-400 mt-1">{errors.service}</p>
                          )}
                        </div>
                      )}

                      {/* Paso 3: Presupuesto y Mensaje */}
                      {currentStep === 3 && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs uppercase tracking-[0.15em] text-[#DCDCDC]/40 font-medium mb-2">
                              Rango de inversión estimado *
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {budgetOptions.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => handleFieldChange('budget', option.value)}
                                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                                    formData.budget === option.value
                                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-lg shadow-[#D4AF37]/10'
                                      : 'border-[#DCDCDC]/10 hover:border-[#D4AF37]/30 bg-[#0A0A0A]'
                                  }`}
                                  disabled={isSubmitting}
                                >
                                  <div className="text-[#D4AF37] mb-2">{option.icon}</div>
                                  <div className="text-lg font-bold text-[#D4AF37]">{option.label}</div>
                                  <div className="text-xs text-[#DCDCDC]/40 mt-1">{option.description}</div>
                                </button>
                              ))}
                            </div>
                            {errors.budget && (
                              <p className="text-xs text-red-400 mt-1">{errors.budget}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs uppercase tracking-[0.15em] text-[#DCDCDC]/40 font-medium mb-1.5">
                              Descripción del proyecto *
                            </label>
                            <div className="relative">
                              <textarea
                                value={formData.message}
                                onChange={(e) => handleFieldChange('message', e.target.value)}
                                onBlur={() => {
                                  setTouchedFields(prev => new Set(prev).add('message'))
                                  const error = validateField('message', formData.message)
                                  setErrors(prev => ({ ...prev, message: error }))
                                }}
                                rows={4}
                                className={`w-full pl-4 pr-4 py-3 bg-[#0A0A0A] border rounded-lg text-white placeholder-[#DCDCDC]/30 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300 outline-none resize-none ${
                                  touchedFields.has('message') && errors.message
                                    ? 'border-red-500/50'
                                    : 'border-[#DCDCDC]/10'
                                }`}
                                placeholder="Cuéntanos sobre tu proyecto, objetivos y desafíos..."
                                disabled={isSubmitting}
                              />
                            </div>
                            {touchedFields.has('message') && errors.message && (
                              <p className="text-xs text-red-400 mt-1">{errors.message}</p>
                            )}
                            <div className="text-right text-xs text-[#DCDCDC]/30 mt-1">
                              {formData.message.length}/2000
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={formData.acceptTerms}
                              onChange={(e) => handleFieldChange('acceptTerms', e.target.checked)}
                              className="mt-1 w-4 h-4 rounded border-[#DCDCDC]/20 bg-[#0A0A0A] text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0"
                              disabled={isSubmitting}
                            />
                            <div>
                              <label className="text-sm text-[#DCDCDC]/60">
                                Acepto los términos de privacidad y el tratamiento de mis datos
                              </label>
                              {errors.acceptTerms && (
                                <p className="text-xs text-red-400 mt-1">{errors.acceptTerms}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Navegación */}
                      <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#D4AF37]/10">
                        <button
                          type="button"
                          onClick={handlePrevious}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                            currentStep === 1
                              ? 'text-[#DCDCDC]/20 cursor-not-allowed'
                              : 'text-[#DCDCDC]/60 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5'
                          }`}
                          disabled={currentStep === 1 || isSubmitting}
                        >
                          <FaArrowLeft className="w-3 h-3" />
                          Anterior
                        </button>

                        <button
                          type="button"
                          onClick={handleNext}
                          disabled={isSubmitting}
                          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                            isSubmitting
                              ? 'bg-[#DCDCDC]/10 text-[#DCDCDC]/30 cursor-not-allowed'
                              : 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#050505] hover:shadow-lg hover:shadow-[#D4AF37]/20'
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <FaSpinner className="w-4 h-4 animate-spin" />
                              <span>Enviando...</span>
                            </>
                          ) : currentStep === 3 ? (
                            <>
                              <span>Enviar diagnóstico</span>
                              <FaArrowRight className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              <span>Siguiente</span>
                              <FaArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Mensaje de éxito */
                    <div ref={successRef}>
                      <div className="text-center py-8">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                          className="w-20 h-20 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-6"
                        >
                          <FaCheck className="w-10 h-10 text-[#D4AF37]" />
                        </motion.div>
                        <h4 className="text-2xl font-bold text-white mb-3">
                          Postulación Recibida
                        </h4>
                        <p className="text-[#DCDCDC]/70 text-sm max-w-md mx-auto leading-relaxed">
                          Nuestro equipo de ingeniería evaluará tu infraestructura en las próximas 24 horas.
                          Te contactaremos para agendar una sesión de diagnóstico técnico.
                        </p>
                        <button
                          onClick={() => {
                            setIsSubmitted(false)
                            setFormData({
                              name: '',
                              email: '',
                              company: '',
                              service: '',
                              budget: '',
                              message: '',
                              acceptTerms: false
                            })
                            setCurrentStep(1)
                            setErrors({})
                            setTouchedFields(new Set())
                            // ✅ Restaurar visibilidad del formulario
                            if (formRef.current) {
                              gsap.to(formRef.current, {
                                opacity: 1,
                                y: 0,
                                duration: 0.5,
                                ease: 'power2.out'
                              })
                            }
                          }}
                          className="mt-6 px-6 py-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/20 transition-all duration-300"
                        >
                          Enviar otra solicitud
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="mt-12 pt-8 border-t border-[#D4AF37]/10"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[#DCDCDC]/40 text-sm">
                © {new Date().getFullYear()} PRISMA SKY. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-4 text-xs text-[#DCDCDC]/30">
                <span className="flex items-center gap-1.5">
                  <FaShieldAlt className="w-3 h-3 text-[#D4AF37]" />
                  Enterprise Grade
                </span>
                <span>|</span>
                <span>v2.5.0</span>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* ✅ Toast Notification */}
      {toast.show && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
          duration={6000}
        />
      )}
    </>
  )
}