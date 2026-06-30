// components/HeroCanvas.tsx
'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// ============================================================
// SHADERS
// ============================================================

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScrollVelocity;
  
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;
  
  varying vec3 vColor;
  varying float vAlpha;
  
  // Simplex Noise 3D
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
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
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
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vColor = aColor;
    
    vec3 pos = position;
    
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
    
    float scrollForce = uScrollVelocity * 2.5;
    float scrollDispersion = 1.0 + abs(scrollForce) * 0.8;
    
    float mouseInfluence = 0.6;
    vec2 mouseOffset = (uMouse - 0.5) * 2.0;
    vec3 mouseVec = vec3(mouseOffset * 0.8, mouseOffset.x * 0.4);
    
    float waveX = sin(position.y * 0.5 + uTime * 0.3) * 0.15;
    float waveY = cos(position.x * 0.5 + uTime * 0.2) * 0.15;
    float waveZ = sin(position.z * 0.4 + uTime * 0.25) * 0.15;
    
    float noiseCombined = noise1 * 0.5 + noise2 * 0.3;
    vec3 displacement = vec3(
      noiseCombined * 0.5 + waveX,
      noiseCombined * 0.5 + waveY,
      noiseCombined * 0.4 + waveZ
    );
    
    vec3 toMouse = mouseVec - pos;
    float distToMouse = length(toMouse);
    float mouseAttraction = exp(-distToMouse * 1.5) * mouseInfluence * 0.3;
    vec3 mouseForce = normalize(toMouse + 0.001) * mouseAttraction * 0.5;
    
    float scrollPhase = sin(uTime * 0.5 + aPhase * 3.0) * scrollForce * 0.1;
    vec3 scrollForceVec = normalize(pos + 0.001) * scrollPhase * 0.3;
    
    vec3 finalPos = pos + displacement * 0.4 + mouseForce + scrollForceVec;
    finalPos *= (1.0 + abs(scrollForce) * 0.05);
    
    float alphaBase = 0.4 + 0.6 * (1.0 - abs(finalPos.y) / 8.0);
    float scrollAlpha = 1.0 - abs(scrollForce) * 0.15;
    vAlpha = clamp(alphaBase * scrollAlpha, 0.1, 0.9);
    
    float sizeBase = aSize;
    float sizeScale = 1.0 + abs(scrollForce) * 0.5;
    float finalSize = sizeBase * sizeScale * (0.8 + 0.4 * sin(uTime * 0.5 + aPhase));
    
    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_PointSize = finalSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    
    if (dist > 0.5) discard;
    
    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    float core = 1.0 - smoothstep(0.0, 0.15, dist);
    
    vec3 finalColor = vColor * (0.8 + 0.3 * sin(uTime * 0.3 + dist * 5.0));
    
    float sparkle = pow(1.0 - dist * 2.0, 4.0) * 0.5;
    finalColor += vec3(1.0, 0.95, 0.85) * sparkle * 0.3;
    
    float alpha = glow * vAlpha * (0.7 + 0.3 * core);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`

// ============================================================
// PARTICLE SYSTEM
// ============================================================

interface ParticleSystemProps {
  mousePosition: { x: number; y: number }
  scrollVelocity: number
  particleCount?: number
  isLowPerf?: boolean
}

const ParticleSystem = ({ 
  mousePosition, 
  scrollVelocity,
  particleCount = 5000,
  isLowPerf = false
}: ParticleSystemProps) => {
  const meshRef = useRef<THREE.Points>(null)
  const { viewport } = useThree()
  const [uniforms] = useState({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uScrollVelocity: { value: 0 }
  })

  const { positions, colors, sizes, phases } = useMemo(() => {
    const count = isLowPerf ? Math.floor(particleCount * 0.5) : particleCount
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const siz = new Float32Array(count)
    const pha = new Float32Array(count)

    const colorPalette = [
      new THREE.Color(0xD4AF37),
      new THREE.Color(0xAA7C11),
      new THREE.Color(0xF5E6B8),
      new THREE.Color(0x8B7D3C),
    ]

    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.cos(phi) * 0.6
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) * 0.5

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      const variation = 0.7 + 0.3 * Math.random()
      col[i * 3] = color.r * variation
      col[i * 3 + 1] = color.g * variation
      col[i * 3 + 2] = color.b * variation

      siz[i] = 0.02 + Math.random() * 0.06
      pha[i] = Math.random() * Math.PI * 2
    }

    return { positions: pos, colors: col, sizes: siz, phases: pha }
  }, [particleCount, isLowPerf])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    return geo
  }, [positions, colors, sizes, phases])

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

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    
    uniforms.uTime.value = time
    uniforms.uMouse.value.lerp(
      new THREE.Vector2(mousePosition.x, mousePosition.y),
      0.05
    )
    
    uniforms.uScrollVelocity.value += (scrollVelocity - uniforms.uScrollVelocity.value) * 0.08
    
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
// MAIN COMPONENT
// ============================================================

export default function HeroCanvas() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLowPerf, setIsLowPerf] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const lastScrollY = useRef(0)
  const scrollVelocitySmooth = useRef(0)
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const mobile = window.innerWidth < 768
    setIsMobile(mobile)
    
    if (mobile) {
      setIsLowPerf(true)
    }
    
    const checkPerformance = () => {
      const start = performance.now()
      for (let i = 0; i < 1000; i++) {
        Math.sqrt(i)
      }
      const end = performance.now()
      if (end - start > 10) {
        setIsLowPerf(true)
      }
    }
    checkPerformance()
  }, [])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (throttleTimeout.current) return
      throttleTimeout.current = setTimeout(() => {
        const x = event.clientX / window.innerWidth
        const y = 1 - event.clientY / window.innerHeight
        setMousePosition({ x, y })
        throttleTimeout.current = null
      }, 50)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current)
      }
    }
  }, [])

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null
    const handleScroll = () => {
      if (scrollTimeout) return
      scrollTimeout = setTimeout(() => {
        const currentScrollY = window.scrollY
        const delta = currentScrollY - lastScrollY.current
        scrollVelocitySmooth.current += (delta - scrollVelocitySmooth.current) * 0.1
        setScrollVelocity(scrollVelocitySmooth.current)
        lastScrollY.current = currentScrollY
        scrollTimeout = null
      }, 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    lastScrollY.current = window.scrollY

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout) clearTimeout(scrollTimeout)
    }
  }, [])

  const particleCount = isLowPerf ? 1500 : isMobile ? 2500 : 5000

  return (
    <div className="fixed inset-0 -z-10 w-full h-full">
      <Canvas
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: !isMobile,
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
          position={[0, 0, isMobile ? 10 : 8]} 
          fov={isMobile ? 45 : 60}
        />
        <ParticleSystem 
          mousePosition={mousePosition} 
          scrollVelocity={scrollVelocity}
          particleCount={particleCount}
          isLowPerf={isLowPerf}
        />
      </Canvas>
    </div>
  )
}