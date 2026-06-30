// components/TechDocs.tsx - Versión corregida
'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, Variants } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  FaCode, 
  FaServer, 
  FaNetworkWired,
  FaCodeBranch,  // ← Reemplaza FaGitBranch con FaCodeBranch
  FaGitAlt        // ← Alternativa si prefieres
} from 'react-icons/fa'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

type TabId = 'api' | 'deployment' | 'vram'

interface Tab {
  id: TabId
  label: string
  icon: React.ReactNode
  content: string
  language: string
}

const tabs: Tab[] = [
  {
    id: 'api',
    label: 'API Setup',
    icon: <FaServer className="w-4 h-4" />,
    language: 'typescript',
    content: `// 📡 API Endpoint Configuration
import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { WhatsApp } from '@prismasky/whatsapp'

export async function POST(req: Request) {
  const { trigger, payload } = await req.json()
  
  const pipeline = await new AutomationPipeline()
    .setTrigger(trigger)
    .setOpenAI(new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-4-turbo-preview'
    }))
    .setWhatsApp(new WhatsApp({
      enterprise: true,
      webhook: process.env.WHATSAPP_WEBHOOK
    }))
    .build()
  
  const result = await pipeline.execute(payload)
  
  return NextResponse.json({
    status: 'success',
    data: result,
    timestamp: new Date().toISOString()
  })
}`
  },
  {
    id: 'deployment',
    label: 'Deployment Pipeline',
    icon: <FaCodeBranch className="w-4 h-4" />, // ← Ahora usa FaCodeBranch
    language: 'yaml',
    content: `# 🚀 CI/CD Pipeline Configuration
# PRISMA SKY - Deployment Strategy

name: Production Deployment
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Run Tests
        run: npm test -- --coverage
      
      - name: Build Application
        run: npm run build
      
      - name: Deploy to Vercel Edge
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.ORG_ID }}
          vercel-project-id: \${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
      
      - name: Health Check
        run: curl -f https://prismasky.com/api/health || exit 1`
  },
  {
    id: 'vram',
    label: 'VRAM Optimizer',
    icon: <FaCode className="w-4 h-4" />,
    language: 'typescript',
    content: `// 🎨 VRAM Garbage Collection
// Optimización de memoria GPU para Canvas 3D

class VRAMOptimizer {
  private textureCache: Map<string, THREE.Texture>
  private geometryCache: Map<string, THREE.BufferGeometry>
  private maxCacheSize: number = 1024 * 1024 * 512
  
  constructor() {
    this.textureCache = new Map()
    this.geometryCache = new Map()
    this.setupGarbageCollection()
  }
  
  private setupGarbageCollection(): void {
    setInterval(() => {
      this.collectGarbage()
    }, 30000)
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.collectGarbage()
      }
    })
  }
  
  private collectGarbage(): void {
    const currentMemory = this.getCurrentMemoryUsage()
    
    if (currentMemory > this.maxCacheSize) {
      const sortedCache = Array.from(this.textureCache.entries())
        .sort((a, b) => a[1].lastAccess - b[1].lastAccess)
      
      for (const [key, texture] of sortedCache) {
        if (texture.refCount === 0) {
          texture.dispose()
          this.textureCache.delete(key)
        }
        
        if (this.getCurrentMemoryUsage() < this.maxCacheSize) {
          break
        }
      }
    }
  }
  
  private getCurrentMemoryUsage(): number {
    return Array.from(this.textureCache.values())
      .reduce((total, tex) => total + tex.image?.data?.length || 0, 0)
  }
}

export const vramOptimizer = new VRAMOptimizer()`
  }
]

// ✅ Definir variantes
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
}

export default function TechDocs() {
  const [activeTab, setActiveTab] = useState<TabId>('api')
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const codeRef = useRef<HTMLDivElement>(null)

  const activeContent = tabs.find(tab => tab.id === activeTab)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: codeRef.current,
        start: 'top bottom-=50',
        onEnter: () => {
          gsap.fromTo(codeRef.current,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="documentacion"
      ref={sectionRef}
      className="py-24 bg-[#0A0A0A] border-t border-[#D4AF37]/10 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#D4AF37] font-medium mb-4 border border-[#D4AF37]/20 px-4 py-2 rounded-full">
            Documentación Técnica
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
            Arquitectura <span className="text-[#D4AF37]">Activa</span>
          </h2>
          <p className="max-w-2xl mx-auto text-[#DCDCDC]/70 text-lg font-light">
            Código en producción, documentación en tiempo real
          </p>
        </motion.div>

        <div ref={codeRef} className="bg-[#050505] border border-[#D4AF37]/20 rounded-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-[#D4AF37]/10 p-2 bg-[#0A0A0A]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                    : 'text-[#DCDCDC]/40 hover:text-[#DCDCDC]/70 hover:bg-[#D4AF37]/5'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
            <div className="flex-1" />
            <span className="text-xs text-[#DCDCDC]/20 font-mono px-4">
              v2.4.1 · Production Ready
            </span>
          </div>

          {/* Content */}
          <div className="p-6 overflow-x-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <span className="text-xs text-[#DCDCDC]/30 font-mono">
                {activeContent?.language}.{activeContent?.id === 'deployment' ? 'yml' : 'ts'}
              </span>
            </div>
            
            <pre className="font-mono text-sm text-[#DCDCDC] leading-relaxed whitespace-pre-wrap">
              <code>{activeContent?.content}</code>
            </pre>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between border-t border-[#D4AF37]/10 p-3 bg-[#0A0A0A]">
            <div className="flex items-center gap-4 text-xs text-[#DCDCDC]/30 font-mono">
              <span>✓ Build: Passing</span>
              <span>✓ Tests: 124/124</span>
              <span>✓ Coverage: 98.7%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#DCDCDC]/30 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#27C93F] animate-pulse" />
              <span>System Operational</span>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-[#050505] border border-[#D4AF37]/10 rounded-full">
            <FaNetworkWired className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs text-[#DCDCDC]/60 font-mono">
              Proyecto: <span className="text-[#D4AF37]">sard2201/prismasky-web</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}