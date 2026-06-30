// components/PrismaBackground.tsx
'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// ============================================================
// PIRÁMIDE PRISMÁTICA CON SHADERS
// ============================================================

const PrismaPyramid = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -(event.clientY / window.innerHeight) * 2 + 1
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    
    if (meshRef.current) {
      // Rotación suave de la pirámide
      meshRef.current.rotation.x = Math.sin(time * 0.15) * 0.1 + mousePosition.y * 0.1
      meshRef.current.rotation.y = time * 0.15 + mousePosition.x * 0.3
      meshRef.current.rotation.z = Math.sin(time * 0.1) * 0.05
      
      // Movimiento de flotación
      meshRef.current.position.y = Math.sin(time * 0.3) * 0.1
    }
  })

  // Geometría de pirámide con base prismática
  const geometry = new THREE.ConeGeometry(1.5, 2.2, 6)
  const edges = new THREE.EdgesGeometry(geometry)
  
  // Material con efecto prismático
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xD4AF37),
    metalness: 0.8,
    roughness: 0.15,
    transparent: true,
    opacity: 0.25,
    wireframe: false,
    emissive: new THREE.Color(0xD4AF37),
    emissiveIntensity: 0.1,
    clearcoat: 0.3,
    clearcoatRoughness: 0.2,
    envMapIntensity: 1.5,
  })

  // Material para los bordes brillantes
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0xD4AF37,
    transparent: true,
    opacity: 0.4,
  })

  return (
    <group>
      {/* Pirámide principal */}
      <mesh ref={meshRef} geometry={geometry} material={material} />
      
      {/* Bordes brillantes */}
      <lineSegments geometry={edges} material={edgeMaterial} />
      
      {/* Partículas alrededor de la pirámide */}
      <ParticleRing />
    </group>
  )
}

// ============================================================
// ANILLO DE PARTÍCULAS ALREDEDOR DE LA PIRÁMIDE
// ============================================================

const ParticleRing = () => {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 200
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2
    const radius = 1.8 + Math.random() * 0.5
    const height = (Math.random() - 0.5) * 2.5
    
    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = height
    positions[i * 3 + 2] = Math.sin(angle) * radius
    
    const color = new THREE.Color(0xD4AF37)
    color.multiplyScalar(0.5 + 0.5 * Math.random())
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.04,
    transparent: true,
    opacity: 0.6,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.1
    }
  })

  return <points ref={particlesRef} geometry={geometry} material={material} />
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function PrismaBackground() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="fixed inset-0 -z-20 w-full h-full pointer-events-none">
      <Canvas
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'transparent',
        }}
        camera={{ 
          position: [0, 0, isMobile ? 4.5 : 4], 
          fov: isMobile ? 50 : 45 
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#D4AF37" />
        <PrismaPyramid />
      </Canvas>
    </div>
  )
}