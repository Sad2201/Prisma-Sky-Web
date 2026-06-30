// app/page.tsx - VERSIÓN COMPLETA
'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'

// ✅ Importación dinámica del Canvas Hero
const HeroCanvas = dynamic(
  () => import('@/components/HeroCanvas'),
  { 
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[#050505]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent animate-pulse" />
      </div>
    )
  }
)

// ✅ Importación del Prisma Background
const PrismaBackground = dynamic(
  () => import('@/components/PrismaBackground'),
  { 
    ssr: false,
    loading: () => null
  }
)

import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import BentoGrid from '@/components/BentoGrid'
import Methodology from '@/components/Methodology'
import AboutCompany from '@/components/AboutCompany'
import TechDocs from '@/components/TechDocs'
import Footer from '@/components/Footer'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ['start start', 'end end']
  })

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = document.querySelectorAll('.section-reveal')
      
      sections.forEach((section) => {
        gsap.fromTo(section,
          { 
            opacity: 0.4,
            y: 40,
            scale: 0.97
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom-=100',
              end: 'top center',
              toggleActions: 'play none none reverse',
              scrub: 0.6
            }
          }
        )
      })

      gsap.to('.progress-bar-fill', {
        width: '100%',
        scrollTrigger: {
          trigger: mainRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1
        }
      })

      document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault()
          const href = anchor.getAttribute('href')
          if (href) {
            const target = document.querySelector(href)
            if (target) {
              const targetPosition = target.getBoundingClientRect().top + window.scrollY - 80
              window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
              })
            }
          }
        })
      })
    }, mainRef)

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      ctx.revert()
    }
  }, [])

  return (
    <div ref={mainRef} className="min-h-screen bg-[#050505] relative">
      {/* ✅ PRISMA BACKGROUND - VISIBLE Y FUNCIONAL */}
      <PrismaBackground />

      {/* ✅ Canvas Hero - Encima del prisma */}
      <div className="fixed inset-0 -z-5">
        <HeroCanvas />
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-[#D4AF37]/10 z-50">
        <div className="progress-bar-fill h-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] w-0" />
      </div>

      {/* Overlay Gradient */}
      <div className="fixed inset-0 pointer-events-none z-5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/0 via-[#050505]/20 to-[#050505]/60" />
      </div>

      {/* Contenido */}
      <div className="relative z-10">
        <Header />
        
        <main>
          <div className="section-reveal" id="inicio">
            <HeroSection />
          </div>

          <div className="section-reveal" id="servicios">
            <BentoGrid />
          </div>

          <div className="section-reveal" id="metodologia">
            <Methodology />
          </div>

          <div className="section-reveal" id="empresa">
            <AboutCompany />
          </div>

          <div className="section-reveal" id="documentacion">
            <TechDocs />
          </div>

          <div className="section-reveal" id="postular">
            <Footer />
          </div>
        </main>
      </div>

      <style jsx>{`
        .section-reveal {
          will-change: transform, opacity;
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  )
}