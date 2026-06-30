// app/page.tsx
'use client'

import { useEffect, useRef, Suspense, lazy } from 'react'
import { useScroll, useSpring } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ✅ Lazy loading para mejorar rendimiento
const PrismaBackground = lazy(() => import('@/components/PrismaBackground'))
const HeroCanvas = lazy(() => import('@/components/HeroCanvas'))
const Header = lazy(() => import('@/components/Header'))
const HeroSection = lazy(() => import('@/components/HeroSection'))
const BentoGrid = lazy(() => import('@/components/BentoGrid'))
const Methodology = lazy(() => import('@/components/Methodology'))
const AboutCompany = lazy(() => import('@/components/AboutCompany'))
const TechDocs = lazy(() => import('@/components/TechDocs'))
const Footer = lazy(() => import('@/components/Footer'))

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
          { opacity: 0.4, y: 40, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom-=100',
              end: 'top center',
              toggleActions: 'play none none reverse',
              scrub: 0.5
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

      // Smooth scroll
      document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault()
          const href = anchor.getAttribute('href')
          if (href) {
            const target = document.querySelector(href)
            if (target) {
              const targetPosition = target.getBoundingClientRect().top + window.scrollY - 80
              window.scrollTo({ top: targetPosition, behavior: 'smooth' })
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
      {/* Prisma Background - Siempre visible */}
      <Suspense fallback={null}>
        <PrismaBackground />
      </Suspense>

      {/* Hero Canvas - Encima del prisma */}
      <Suspense fallback={null}>
        <div className="fixed inset-0 -z-5 pointer-events-none">
          <HeroCanvas />
        </div>
      </Suspense>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-[#D4AF37]/10 z-50">
        <div className="progress-bar-fill h-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] w-0" />
      </div>

      {/* Contenido con fondos transparentes */}
      <div className="relative z-10">
        <Suspense fallback={<div className="h-16" />}>
          <Header />
        </Suspense>
        
        <main>
          <div className="section-reveal bg-transparent" id="inicio">
            <Suspense fallback={<div className="min-h-screen" />}>
              <HeroSection />
            </Suspense>
          </div>

          <div className="section-reveal bg-transparent" id="servicios">
            <Suspense fallback={<div className="min-h-[400px]" />}>
              <BentoGrid />
            </Suspense>
          </div>

          <div className="section-reveal bg-transparent" id="metodologia">
            <Suspense fallback={<div className="min-h-[400px]" />}>
              <Methodology />
            </Suspense>
          </div>

          <div className="section-reveal bg-transparent" id="empresa">
            <Suspense fallback={<div className="min-h-[400px]" />}>
              <AboutCompany />
            </Suspense>
          </div>

          <div className="section-reveal bg-transparent" id="documentacion">
            <Suspense fallback={<div className="min-h-[400px]" />}>
              <TechDocs />
            </Suspense>
          </div>

          <div className="section-reveal bg-transparent" id="postular">
            <Suspense fallback={<div className="min-h-[400px]" />}>
              <Footer />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}