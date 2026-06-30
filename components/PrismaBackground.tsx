// components/PrismaBackground.tsx
'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// ============================================================
// PIRÁMIDE PRISMÁTICA 3D
// ============================================================

const PrismaPyramid = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const edgesRef = useRef<THREE.LineSegments>(null)
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
      meshRef.current.rotation.x = Math.sin(time * 0.15) * 0.1 + mousePosition.y * 0.1
      meshRef.current.rotation.y = time * 0.15 + mousePosition.x * 0.3
      meshRef.current.rotation.z = Math.sin(time * 0.1) * 0.05
      meshRef.current.position.y = Math.sin(time * 0.3) * 0.1
    }
    
    if (edgesRef.current) {
      edgesRef.current.rotation.copy(meshRef.current?.rotation || new THREE.Euler())
      edgesRef.current.position.copy(meshRef.current?.position || new THREE.Vector3())
    }
  })

  // Geometría de pirámide hexagonal (prismática)
  const geometry = new THREE.ConeGeometry(1.8, 2.5, 6)
  const edges = new THREE.EdgesGeometry(geometry)
  
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xD4AF37),
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.3,
    emissive: new THREE.Color(0xD4AF37),
    emissiveIntensity: 0.15,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
    envMapIntensity: 2,
    side: THREE.DoubleSide,
  })

  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0xD4AF37,
    transparent: true,
    opacity: 0.6,
  })

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} material={material} />
      <lineSegments ref={edgesRef} geometry={edges} material={edgeMaterial} />
      <ParticleRing />
    </group>
  )
}

// ============================================================
// ANILLO DE PARTÍCULAS
// ============================================================

const ParticleRing = () => {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 300
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2
    const radius = 2.2 + Math.random() * 0.8
    const height = (Math.random() - 0.5) * 3
    
    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = height
    positions[i * 3 + 2] = Math.sin(angle) * radius
    
    const color = new THREE.Color(0xD4AF37)
    color.multiplyScalar(0.4 + 0.6 * Math.random())
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
    
    sizes[i] = 0.02 + Math.random() * 0.04
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.PointsMaterial({
    size: 0.05,
    transparent: true,
    opacity: 0.7,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  })

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.08
      particlesRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.05
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
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
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
          width: '100%',
          height: '100%',
          background: 'transparent',
        }}
        camera={{ 
          position: [0, 0.5, isMobile ? 5 : 4.5], 
          fov: isMobile ? 55 : 45 
        }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#D4AF37" />
        <pointLight position={[-5, -3, -5]} intensity={0.8} color="#AA7C11" />
        <pointLight position={[0, 5, 0]} intensity={1} color="#F5E6B8" />
        <PrismaPyramid />
      </Canvas>
    </div>
  )
}