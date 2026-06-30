// components/Header.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes } from 'react-icons/fa'

const navLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#empresa', label: 'Empresa' },
  { href: '#documentacion', label: 'Documentación' },
  { href: '#postular', label: 'Postular' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      const sections = navLinks.map(link => link.href.replace('#', ''))
      const scrollPosition = window.scrollY + 100
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    
    setTimeout(() => {
      if (href === '#inicio') {
        scrollToTop()
        return
      }
      
      const target = document.querySelector(href)
      if (target) {
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - 80
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
      }
    }, 150)
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'backdrop-blur-xl bg-[#050505]/80 border-b border-[#D4AF37]/20 shadow-2xl shadow-[#D4AF37]/5'
          : 'backdrop-blur-sm bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 md:space-x-3 group cursor-pointer focus:outline-none"
            aria-label="Volver al inicio"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-9 h-9 md:w-12 md:h-12 bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20"
            >
              <span className="text-[#050505] font-bold text-sm md:text-xl">PS</span>
            </motion.div>
            <span className="text-lg md:text-2xl font-light tracking-wider">
              PRISMA<span className="text-[#D4AF37] font-bold">SKY</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 group ${
                  activeSection === link.href.replace('#', '')
                    ? 'text-[#D4AF37]'
                    : 'text-[#DCDCDC]/70 hover:text-[#DCDCDC]'
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#D4AF37] transition-all duration-500 ${
                  activeSection === link.href.replace('#', '') ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
            <Link
              href="#postular"
              onClick={(e) => handleNavClick(e, '#postular')}
              className="ml-4 px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#050505] font-semibold rounded-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 hover:scale-105"
            >
              Postular
            </Link>
          </nav>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#DCDCDC] hover:text-[#D4AF37] transition-colors duration-300 relative z-50"
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMobileMenuOpen ? (
              <FaTimes className="w-5 h-5 md:w-6 md:h-6" />
            ) : (
              <FaBars className="w-5 h-5 md:w-6 md:h-6" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-[#050505]/98 backdrop-blur-xl border-t border-[#D4AF37]/10 fixed top-16 left-0 right-0"
            style={{ height: 'calc(100vh - 4rem)' }}
          >
            <div className="flex flex-col h-full px-4 py-4 space-y-1 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 text-base ${
                    activeSection === link.href.replace('#', '')
                      ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                      : 'text-[#DCDCDC]/70 hover:bg-[#D4AF37]/5 hover:text-[#DCDCDC]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="#postular"
                onClick={(e) => handleNavClick(e, '#postular')}
                className="block px-4 py-3 mt-2 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#050505] font-semibold rounded-lg text-center"
              >
                Postular
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}