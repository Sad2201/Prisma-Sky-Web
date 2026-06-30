// components/SectionBackground.tsx - NUEVO COMPONENTE
'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface SectionBackgroundProps {
  variant: 'gradient' | 'particles' | 'mesh' | 'glow'
  className?: string
  intensity?: 'low' | 'medium' | 'high'
}

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function SectionBackground({ 
  variant, 
  className = '', 
  intensity = 'medium' 
}: SectionBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const intensityMap = {
    low: { opacity: 0.3, blur: 'blur-3xl' },
    medium: { opacity: 0.5, blur: 'blur-3xl' },
    high: { opacity: 0.7, blur: 'blur-2xl' }
  }

  const config = intensityMap[intensity]

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      // Animación de entrada sutil
      gsap.fromTo(container,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container.parentElement,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Movimiento parallax sutil
      gsap.to(container, {
        y: -30,
        scrollTrigger: {
          trigger: container.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      })
    }, container)

    return () => ctx.revert()
  }, [])

  const renderBackground = () => {
    switch (variant) {
      case 'gradient':
        return (
          <div className={`absolute inset-0 ${config.blur} opacity-${config.opacity}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 via-[#AA7C11]/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-tl from-[#D4AF37]/10 via-transparent to-[#AA7C11]/5" />
          </div>
        )

      case 'particles':
        return (
          <div className={`absolute inset-0 ${config.blur} opacity-${config.opacity}`}>
            <div className="absolute inset-0" style={{
              backgroundImage: `
                radial-gradient(circle at 20% 50%, rgba(212,175,55,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(212,175,55,0.08) 0%, transparent 40%),
                radial-gradient(circle at 50% 80%, rgba(212,175,55,0.06) 0%, transparent 60%)
              `
            }} />
            {/* Puntos decorativos */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                radial-gradient(circle at 10% 30%, #D4AF37 1px, transparent 1px),
                radial-gradient(circle at 30% 70%, #D4AF37 1px, transparent 1px),
                radial-gradient(circle at 50% 20%, #D4AF37 1px, transparent 1px),
                radial-gradient(circle at 70% 60%, #D4AF37 1px, transparent 1px),
                radial-gradient(circle at 90% 40%, #D4AF37 1px, transparent 1px)
              `,
              backgroundSize: '200px 200px',
              backgroundPosition: '0 0, 50px 50px, 100px 0, 150px 50px, 200px 0'
            }} />
          </div>
        )

      case 'mesh':
        return (
          <div className={`absolute inset-0 ${config.blur} opacity-${config.opacity}`}>
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(45deg, rgba(212,175,55,0.05) 25%, transparent 25%),
                linear-gradient(-45deg, rgba(212,175,55,0.05) 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, rgba(212,175,55,0.05) 75%),
                linear-gradient(-45deg, transparent 75%, rgba(212,175,55,0.05) 75%)
              `,
              backgroundSize: '60px 60px',
              backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px'
            }} />
          </div>
        )

      case 'glow':
        return (
          <div className={`absolute inset-0 ${config.blur} opacity-${config.opacity}`}>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#D4AF37]/10 animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-[#AA7C11]/8 animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[#D4AF37]/6 animate-pulse delay-500" />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      {renderBackground()}
    </div>
  )
}