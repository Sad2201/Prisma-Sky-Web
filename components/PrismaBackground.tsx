// components/PrismaBackground.tsx
'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// ============================================================
// SHADER DEL PRISMA INTERACTIVO
// ============================================================

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    vUv = uv;
    
    vec3 pos = position;
    
    // Crear efecto prisma con ondas
    float wave1 = sin(pos.x * 3.0 + uTime * 0.5) * 0.15;
    float wave2 = cos(pos.y * 3.0 + uTime * 0.4) * 0.15;
    float wave3 = sin((pos.x + pos.y) * 2.0 + uTime * 0.6) * 0.1;
    
    // Influencia del mouse
    float mouseInfluence = 0.3;
    vec2 mouseOffset = (uMouse - 0.5) * 2.0;
    float mouseWave = sin(pos.x * 2.0 + pos.y * 2.0 + uTime * 0.3) * 0.1;
    mouseWave += mouseOffset.x * 0.1 * pos.x;
    mouseWave += mouseOffset.y * 0.1 * pos.y;
    
    float elevation = wave1 + wave2 + wave3 + mouseWave * mouseInfluence;
    pos.z += elevation * 0.3;
    
    vElevation = elevation;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    // Colores del prisma basados en la posición y tiempo
    float hue = vUv.x * 0.8 + vUv.y * 0.2 + uTime * 0.03;
    
    // Paleta de colores dorados
    vec3 color1 = vec3(0.831, 0.686, 0.216); // #D4AF37
    vec3 color2 = vec3(0.667, 0.486, 0.067); // #AA7C11
    vec3 color3 = vec3(0.965, 0.902, 0.722); // #F5E6B8
    vec3 color4 = vec3(0.545, 0.490, 0.235); // #8B7D3C
    
    // Mezcla de colores con ondas
    float mix1 = sin(hue * 6.283) * 0.5 + 0.5;
    float mix2 = cos(hue * 6.283 + 1.5) * 0.5 + 0.5;
    float mix3 = sin(hue * 6.283 + 3.0) * 0.5 + 0.5;
    
    vec3 color = mix(
      mix(color1, color2, mix1),
      mix(color3, color4, mix2),
      mix3
    );
    
    // Intensidad basada en elevación
    float intensity = 0.3 + 0.7 * (vElevation * 2.0 + 0.5);
    color *= intensity;
    
    // Brillo en los bordes
    float edge = 1.0 - abs(vUv.x - 0.5) * 2.0;
    edge *= 1.0 - abs(vUv.y - 0.5) * 2.0;
    color += vec3(0.2, 0.15, 0.05) * edge * 0.3;
    
    // Efecto de brillo con el mouse
    vec2 mouseDir = vUv - uMouse;
    float mouseDist = length(mouseDir);
    float mouseGlow = exp(-mouseDist * 8.0) * 0.3;
    color += vec3(0.831, 0.686, 0.216) * mouseGlow;
    
    // Alpha con transparencia
    float alpha = 0.15 + 0.25 * intensity;
    alpha += edge * 0.1;
    
    gl_FragColor = vec4(color, alpha);
  }
`

// ============================================================
// COMPONENTE PRISMA
// ============================================================

const PrismaMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth
      const y = 1 - event.clientY / window.innerHeight
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) }
  }

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    uniforms.uTime.value = time
    uniforms.uMouse.value.lerp(
      new THREE.Vector2(mousePosition.x, mousePosition.y),
      0.05
    )
    
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time * 0.05) * 0.05
      meshRef.current.rotation.y = Math.sin(time * 0.03) * 0.05
    }
  })

  const geometry = new THREE.PlaneGeometry(4, 4, 64, 64)
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  })

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} />
  )
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function PrismaBackground() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
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
          depth: false,
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'transparent',
        }}
        frameloop={isMobile ? 'demand' : 'always'}
      >
        <PerspectiveCamera 
          makeDefault 
          position={[0, 0, isMobile ? 3.5 : 3]} 
          fov={isMobile ? 50 : 45}
        />
        <PrismaMesh />
      </Canvas>
    </div>
  )
}