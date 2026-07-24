'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTheme } from 'next-themes'
import { useEffect, useLayoutEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import * as THREE from 'three'
import type { SectionBackdropVariant } from './section-backdrop'

const MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(MOTION_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function IdeaField({ color, animate }: { color: string; animate: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const particles = useMemo(() => Array.from({ length: 26 }, (_, index) => ({
    angle: (index / 26) * Math.PI * 2,
    radius: 2.7 + (index % 5) * 0.42,
    lift: Math.sin(index * 2.4) * 0.7,
    scale: index % 7 === 0 ? 0.22 : 0.1,
    speed: 0.035 + (index % 4) * 0.008,
  })), [])
  const { viewport, invalidate } = useThree()
  const mobile = viewport.width < 8
  const centerX = mobile ? 0 : -viewport.width * 0.25
  const fieldScale = mobile ? 0.82 : 1

  useLayoutEffect(() => {
    const instance = mesh.current
    if (!instance) return
    particles.forEach((particle, index) => {
      dummy.position.set(Math.cos(particle.angle) * particle.radius, Math.sin(particle.angle) * particle.radius * 0.44 + particle.lift, 0)
      dummy.scale.setScalar(particle.scale)
      dummy.updateMatrix()
      instance.setMatrixAt(index, dummy.matrix)
    })
    instance.instanceMatrix.needsUpdate = true
    invalidate()
  }, [dummy, particles, invalidate])

  useFrame(({ clock }) => {
    if (!animate || !mesh.current) return
    const elapsed = clock.elapsedTime
    particles.forEach((particle, index) => {
      const angle = particle.angle + elapsed * particle.speed
      dummy.position.set(Math.cos(angle) * particle.radius, Math.sin(angle) * particle.radius * 0.44 + particle.lift, Math.sin(angle * 2) * 0.5)
      dummy.rotation.set(angle, angle * 0.7, angle * 0.3)
      dummy.scale.setScalar(particle.scale * (0.82 + Math.sin(elapsed * 0.7 + index) * 0.18))
      dummy.updateMatrix()
      mesh.current?.setMatrixAt(index, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
    mesh.current.rotation.z = Math.sin(elapsed * 0.08) * 0.06
    mesh.current.rotation.y = Math.sin(elapsed * 0.11) * 0.08
  })

  return <group position={[centerX, mobile ? 1.6 : 0, 0]} scale={fieldScale}>
    <instancedMesh ref={mesh} args={[undefined, undefined, particles.length]}>
      <boxGeometry />
      <meshBasicMaterial color={color} transparent opacity={0.18} depthWrite={false} />
    </instancedMesh>
  </group>
}

function WorkField({ color, animate }: { color: string; animate: boolean }) {
  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const blocks = useMemo(() => Array.from({ length: 30 }, (_, index) => ({
    x: ((index * 47) % 13) - 6,
    y: ((index * 29) % 9) - 4,
    z: ((index * 17) % 7) * 0.2,
    scale: index % 6 === 0 ? 0.34 : 0.18,
    phase: index * 0.73,
  })), [])
  const { viewport, invalidate } = useThree()
  const mobile = viewport.width < 8
  const centerX = mobile ? 0 : viewport.width * 0.27

  useLayoutEffect(() => {
    const instance = mesh.current
    if (!instance) return
    blocks.forEach((block, index) => {
      dummy.position.set(block.x, block.y, block.z)
      dummy.scale.setScalar(block.scale)
      dummy.updateMatrix()
      instance.setMatrixAt(index, dummy.matrix)
    })
    instance.instanceMatrix.needsUpdate = true
    invalidate()
  }, [blocks, dummy, invalidate])

  useFrame(({ clock }) => {
    if (!animate || !mesh.current || !group.current) return
    const elapsed = clock.elapsedTime
    blocks.forEach((block, index) => {
      const pulse = 0.88 + Math.sin(elapsed * 0.55 + block.phase) * 0.12
      dummy.position.set(block.x, block.y + Math.sin(elapsed * 0.24 + block.phase) * 0.16, block.z)
      dummy.rotation.set(elapsed * 0.06 + block.phase, elapsed * 0.09 + block.phase, 0)
      dummy.scale.setScalar(block.scale * pulse)
      dummy.updateMatrix()
      mesh.current?.setMatrixAt(index, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
    group.current.rotation.y = Math.sin(elapsed * 0.1) * 0.08
  })

  return <group ref={group} position={[centerX, mobile ? -1.7 : 0, 0]} rotation={[0.08, -0.18, -0.08]} scale={mobile ? 0.72 : 1}>
    {[0, 1, 2].map((level) => <lineSegments key={level} position={[level * 0.75 - 0.75, level * 0.65 - 0.65, -0.4]} rotation={[0.25, 0.45, 0.08]} scale={2.2 + level * 0.55}>
      <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
      <lineBasicMaterial color={color} transparent opacity={0.075 - level * 0.012} />
    </lineSegments>)}
    <instancedMesh ref={mesh} args={[undefined, undefined, blocks.length]}>
      <boxGeometry />
      <meshBasicMaterial color={color} transparent opacity={0.17} depthWrite={false} />
    </instancedMesh>
  </group>
}

function FrameController({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => invalidate(), [active, reducedMotion, invalidate])
  useFrame(() => {
    if (active && !reducedMotion) invalidate()
  })
  return null
}

export default function SectionBackdropCanvas({ variant, active }: { variant: SectionBackdropVariant; active: boolean }) {
  const { resolvedTheme } = useTheme()
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia(MOTION_QUERY).matches, () => false)
  const color = resolvedTheme === 'dark' ? '#edede8' : '#181818'
  const animate = active && !reducedMotion

  return <Canvas orthographic camera={{ position: [0, 0, 12], zoom: 76, near: 0.1, far: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} frameloop="demand">
    <FrameController active={active} reducedMotion={reducedMotion} />
    {variant === 'idea' ? <IdeaField color={color} animate={animate} /> : <WorkField color={color} animate={animate} />}
  </Canvas>
}
