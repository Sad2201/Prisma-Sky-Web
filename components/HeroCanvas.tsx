// components/HeroCanvas.tsx
'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// ============================================================
// 1. SHADER MATERIAL AVANZADO CON SIMPLEX NOISE 3D
// ============================================================

// Vertex Shader - Con Simplex Noise 3D paramétrico
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScrollVelocity;
  
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;
  
  varying vec3 vColor;
  varying float vAlpha;
  
  // Simplex Noise 3D - Implementación completa
  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
  }
  
  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    // Primera esquina
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    // Otras esquinas
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    // Permutaciones
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    // Gradientes: mapear 7x7 puntos
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * 7.0 * n_);
    vec4 x_ = floor(j * 7.0 * n_);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ * n_ + ns.x;
    vec4 y = y_ * n_ + ns.y;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    // Normalizar gradientes
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    // Mezclar resultados
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vColor = aColor;
    
    // Calcular posición base con ruido
    vec3 pos = position;
    
    // Ruido 3D paramétrico
    float noise1 = snoise(vec3(
      position.x * 0.3 + uTime * 0.08,
      position.y * 0.3 + uTime * 0.05,
      position.z * 0.3 + uTime * 0.06
    ));
    
    float noise2 = snoise(vec3(
      position.x * 0.5 + uTime * 0.12 + aPhase,
      position.y * 0.5 + uTime * 0.08 + aPhase * 2.0,
      position.z * 0.5 + uTime * 0.1
    ));
    
    // Scroll velocity influence - Dispersión vectorial
    float scrollForce = uScrollVelocity * 2.5;
    float scrollDispersion = 1.0 + abs(scrollForce) * 0.8;
    
    // Mouse influence - Movimiento líquido
    float mouseInfluence = 0.6;
    vec2 mouseOffset = (uMouse - 0.5) * 2.0;
    vec3 mouseVec = vec3(mouseOffset * 0.8, mouseOffset.x * 0.4);
    
    // Aplicar desplazamientos
    float waveX = sin(position.y * 0.5 + uTime * 0.3) * 0.15;
    float waveY = cos(position.x * 0.5 + uTime * 0.2) * 0.15;
    float waveZ = sin(position.z * 0.4 + uTime * 0.25) * 0.15;
    
    // Ruido principal con scroll y mouse
    float noiseCombined = noise1 * 0.5 + noise2 * 0.3;
    vec3 displacement = vec3(
      noiseCombined * 0.5 + waveX,
      noiseCombined * 0.5 + waveY,
      noiseCombined * 0.4 + waveZ
    );
    
    // Mouse attraction/repulsion
    vec3 toMouse = mouseVec - pos;
    float distToMouse = length(toMouse);
    float mouseAttraction = exp(-distToMouse * 1.5) * mouseInfluence * 0.3;
    vec3 mouseForce = normalize(toMouse + 0.001) * mouseAttraction * 0.5;
    
    // Scroll dispersion - Expansión radial
    float scrollPhase = sin(uTime * 0.5 + aPhase * 3.0) * scrollForce * 0.1;
    vec3 scrollForceVec = normalize(pos + 0.001) * scrollPhase * 0.3;
    
    // Posición final
    vec3 finalPos = pos + displacement * 0.4 + mouseForce + scrollForceVec;
    finalPos *= (1.0 + abs(scrollForce) * 0.05);
    
    // Cálculo de alpha basado en posición y scroll
    float alphaBase = 0.4 + 0.6 * (1.0 - abs(finalPos.y) / 8.0);
    float scrollAlpha = 1.0 - abs(scrollForce) * 0.15;
    vAlpha = clamp(alphaBase * scrollAlpha, 0.1, 0.9);
    
    // Tamaño de partícula dinámico
    float sizeBase = aSize;
    float sizeScale = 1.0 + abs(scrollForce) * 0.5;
    float finalSize = sizeBase * sizeScale * (0.8 + 0.4 * sin(uTime * 0.5 + aPhase));
    
    // Proyección final
    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_PointSize = finalSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

// Fragment Shader - Partículas luminosas con efecto de aureola
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    // Crear punto circular con degradado
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    
    if (dist > 0.5) discard;
    
    // Efecto de brillo y aureola
    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    float core = 1.0 - smoothstep(0.0, 0.15, dist);
    
    // Color con variación temporal
    vec3 finalColor = vColor * (0.8 + 0.3 * sin(uTime * 0.3 + dist * 5.0));
    
    // Efecto de destello
    float sparkle = pow(1.0 - dist * 2.0, 4.0) * 0.5;
    finalColor += vec3(1.0, 0.95, 0.85) * sparkle * 0.3;
    
    // Alpha con transparencia suave
    float alpha = glow * vAlpha * (0.7 + 0.3 * core);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`

// ============================================================
// 2. SISTEMA DE PARTÍCULAS CON COMPORTAMIENTO LÍQUIDO
// ============================================================

interface ParticleSystemProps {
  mousePosition: { x: number; y: number }
  scrollVelocity: number
}

const ParticleSystem = ({ mousePosition, scrollVelocity }: ParticleSystemProps) => {
  const meshRef = useRef<THREE.Points>(null)
  const { viewport } = useThree()
  const [uniforms] = useState({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uScrollVelocity: { value: 0 }
  })

  // Generar datos de partículas
  const particleCount = 5000
  const { positions, colors, sizes, phases } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const col = new Float32Array(particleCount * 3)
    const siz = new Float32Array(particleCount)
    const pha = new Float32Array(particleCount)

    const colorPalette = [
      new THREE.Color(0xD4AF37), // Dorado
      new THREE.Color(0xAA7C11), // Dorado oscuro
      new THREE.Color(0xF5E6B8), // Dorado claro
      new THREE.Color(0x8B7D3C), // Verde oliva dorado
    ]

    for (let i = 0; i < particleCount; i++) {
      // Distribución esférica con mayor densidad en el centro
      const radius = 4 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.cos(phi) * 0.6
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) * 0.5

      // Color con variación
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      const variation = 0.7 + 0.3 * Math.random()
      col[i * 3] = color.r * variation
      col[i * 3 + 1] = color.g * variation
      col[i * 3 + 2] = color.b * variation

      siz[i] = 0.02 + Math.random() * 0.06
      pha[i] = Math.random() * Math.PI * 2
    }

    return { positions: pos, colors: col, sizes: siz, phases: pha }
  }, [particleCount])

  // Crear buffer geometry
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    return geo
  }, [positions, colors, sizes, phases])

  // Crear material con shaders
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }, [uniforms])

  // Limpiar recursos GPU
  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
      if (meshRef.current) {
        meshRef.current.geometry.dispose()
        if (Array.isArray(meshRef.current.material)) {
          meshRef.current.material.forEach(m => m.dispose())
        } else {
          meshRef.current.material.dispose()
        }
      }
    }
  }, [geometry, material])

  // Actualizar uniforms en cada frame
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    
    // Suavizar mouse
    uniforms.uTime.value = time
    uniforms.uMouse.value.lerp(
      new THREE.Vector2(mousePosition.x, mousePosition.y),
      0.05
    )
    
    // Suavizar scroll velocity con inercia
    uniforms.uScrollVelocity.value += (scrollVelocity - uniforms.uScrollVelocity.value) * 0.08
    
    // Rotación lenta de todo el sistema
    if (meshRef.current) {
      const scrollForce = Math.abs(scrollVelocity) * 0.3
      const rotationSpeed = 0.03 + scrollForce * 0.15
      
      meshRef.current.rotation.x += Math.sin(time * 0.02) * 0.001
      meshRef.current.rotation.y += rotationSpeed * 0.02
      meshRef.current.rotation.z += Math.cos(time * 0.015) * 0.0005
    }
  })

  return (
    <points ref={meshRef} geometry={geometry} material={material} />
  )
}

// ============================================================
// 3. COMPONENTE PRINCIPAL
// ============================================================

export default function HeroCanvas() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const lastScrollY = useRef(0)
  const scrollVelocitySmooth = useRef(0)

  useEffect(() => {
    // Mouse tracking con suavizado
    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth
      const y = 1 - event.clientY / window.innerHeight
      setMousePosition({ x, y })
    }

    // Scroll velocity tracking con aceleración
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY.current
      
      // Calcular velocidad con suavizado
      scrollVelocitySmooth.current += (delta - scrollVelocitySmooth.current) * 0.1
      setScrollVelocity(scrollVelocitySmooth.current)
      
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Scroll inicial
    lastScrollY.current = window.scrollY

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 w-full h-full">
      <Canvas
        dpr={[1, 2]}
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
      >
        <PerspectiveCamera 
          makeDefault 
          position={[0, 0, 8]} 
          fov={60}
        />
        <ParticleSystem 
          mousePosition={mousePosition} 
          scrollVelocity={scrollVelocity} 
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
      </Canvas>
    </div>
  )
}