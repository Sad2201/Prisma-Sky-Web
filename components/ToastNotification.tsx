// components/ToastNotification.tsx - NUEVO COMPONENTE
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { FaCheckCircle, FaTimes } from 'react-icons/fa'

interface ToastNotificationProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
  duration?: number
}

export default function ToastNotification({ 
  message, 
  type, 
  onClose, 
  duration = 5000 
}: ToastNotificationProps) {
  const toastRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación de entrada
      gsap.fromTo(toastRef.current,
        { opacity: 0, y: -30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
      )

      // Auto cerrar después de duración
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }, toastRef)

    return () => ctx.revert()
  }, [duration])

  const handleClose = () => {
    if (toastRef.current) {
      gsap.to(toastRef.current, {
        opacity: 0,
        y: -30,
        scale: 0.95,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: onClose
      })
    }
  }

  const isSuccess = type === 'success'

  return (
    <div
      ref={toastRef}
      className="fixed top-24 right-4 z-[100] max-w-sm w-full"
    >
      <div className={`
        relative p-4 rounded-xl border backdrop-blur-xl shadow-2xl
        ${isSuccess 
          ? 'bg-[#050505]/90 border-[#D4AF37]/30 shadow-[#D4AF37]/10' 
          : 'bg-[#050505]/90 border-red-500/30 shadow-red-500/10'
        }
      `}>
        <div className="flex items-start gap-4">
          {/* Icono */}
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center shrink-0
            ${isSuccess ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-red-500/20 text-red-400'}
          `}>
            {isSuccess ? <FaCheckCircle className="w-5 h-5" /> : <FaTimes className="w-5 h-5" />}
          </div>

          {/* Mensaje */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${isSuccess ? 'text-white' : 'text-red-200'}`}>
              {isSuccess ? '✅ Formulario enviado' : '❌ Error'}
            </p>
            <p className="text-xs text-[#DCDCDC]/60 mt-0.5">
              {message}
            </p>
          </div>

          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className="p-1 hover:bg-[#DCDCDC]/10 rounded-lg transition-colors text-[#DCDCDC]/40 hover:text-[#DCDCDC]/80"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Barra de progreso */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden rounded-b-xl">
          <div 
            className={`h-full transition-all duration-[${duration}ms] linear ${
              isSuccess ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11]' : 'bg-red-500'
            }`}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  )
}