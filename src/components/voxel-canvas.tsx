'use client'

import { Canvas, events, useFrame, useThree } from '@react-three/fiber'
import { useTheme } from 'next-themes'
import { useEffect, useLayoutEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import * as THREE from 'three'

export type VoxelVariant = 'pixel-robot' | 'pixel-cat' | 'light-bulb' | 'potato' | 'shape' | 'build' | 'connect' | 'portal' | 'endless-stair' | 'cantilever'

type VoxelPart = 'body' | 'secondary' | 'detail' | 'feet' | 'face' | 'mouth' | 'ray' | 'sprout' | 'accent' | 'brick-red' | 'brick-blue' | 'brick-yellow'
type Voxel = { x: number; y: number; z: number; t: number; tone?: number; part?: VoxelPart; suspended?: boolean; group?: number }

const RBY = {
  red: '#c94a45',
  blue: '#3f6eb5',
  yellow: '#dbad3b',
} as const

// Deterministic generator so a scene renders identically on every visit.
function rng(seed: number) {
  let state = seed
  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

function generate(variant: VoxelVariant): Voxel[] {
  const random = rng(variant.length * 7919 + 43)
  const voxels: Voxel[] = []
  if (variant === 'pixel-robot') {
    // Monitor head with a recessed face panel.
    for (let x = 1; x <= 11; x++) for (let y = 11; y <= 17; y++) for (let z = 0; z <= 5; z++) {
      const corner = (x === 1 || x === 11) && (y === 11 || y === 17)
      if (!corner) voxels.push({ x, y, z, t: 0, part: 'body' })
    }
    for (const [x, y] of [[4, 15], [8, 15], [4, 12], [5, 11], [6, 11], [7, 11], [8, 12]] as const) {
      voxels.push({ x, y, z: 6, t: 0, tone: 0, part: 'face' })
    }

    // Armored torso with three front controls.
    for (let x = 3; x <= 9; x++) for (let y = 4; y <= 10; y++) for (let z = 0; z <= 5; z++) {
      const corner = (x === 3 || x === 9) && (y === 4 || y === 10)
      if (!corner) voxels.push({ x, y, z, t: 0, part: 'secondary' })
    }
    for (const [x, y] of [[5, 7], [7, 7], [6, 6]] as const) {
      voxels.push({ x, y, z: 6, t: 0, part: 'accent' })
    }

    // Segmented arms, antenna, legs, and broad feet.
    for (const [x, y, z] of [
      [2, 8, 2], [1, 8, 2], [0, 7, 2], [-1, 6, 2],
      [10, 8, 2], [11, 8, 2], [12, 7, 2], [13, 6, 2],
    ] as const) voxels.push({ x, y, z, t: 0, part: 'detail' })
    for (const [x, y, z] of [[6, 18, 2], [6, 19, 2], [7, 20, 2]] as const) {
      voxels.push({ x, y, z, t: 0, part: 'accent' })
    }
    for (const x of [4, 5, 7, 8]) for (let y = 1; y <= 3; y++) for (let z = 1; z <= 4; z++) {
      voxels.push({ x, y, z, t: 0, part: 'detail' })
    }
    for (let x = 2; x <= 5; x++) for (let z = 0; z <= 5; z++) voxels.push({ x, y: 0, z, t: 0, part: 'feet' })
    for (let x = 7; x <= 10; x++) for (let z = 0; z <= 5; z++) voxels.push({ x, y: 0, z, t: 0, part: 'feet' })
  } else if (variant === 'pixel-cat') {
    // A seated cat with a broad head, tapered body, pointed ears, and curled tail.
    for (let x = 2; x <= 10; x++) for (let y = 9; y <= 14; y++) for (let z = 0; z < 4; z++) {
      const corner = (x === 2 || x === 10) && (y === 9 || y === 14)
      if (!corner) voxels.push({ x, y, z, t: 0, part: 'body' })
    }
    for (const [x, y, z] of [
      [2, 15, 1], [3, 15, 1], [2, 16, 1],
      [9, 15, 1], [10, 15, 1], [10, 16, 1],
    ] as const) voxels.push({ x, y, z, t: 0, part: 'detail' })

    for (let y = 4; y < 9; y++) {
      const inset = y < 6 ? 1 : 0
      for (let x = 3 + inset; x <= 9 - inset; x++) for (let z = 0; z < 4; z++) {
        voxels.push({ x, y, z, t: 0, part: 'body' })
      }
    }
    for (let x = 3; x <= 5; x++) for (let z = 0; z < 4; z++) voxels.push({ x, y: 3, z, t: 0, part: 'feet' })
    for (let x = 7; x <= 9; x++) for (let z = 0; z < 4; z++) voxels.push({ x, y: 3, z, t: 0, part: 'feet' })

    // The stepped tail curls upward beside the body and wiggles on hover.
    for (const [x, y, z] of [[10, 4, 1], [11, 4, 1], [12, 5, 1], [12, 6, 1], [12, 7, 1], [11, 8, 1]] as const) {
      voxels.push({ x, y, z, t: 0, part: 'detail' })
    }

    for (const [x, y] of [[4, 12], [8, 12], [6, 10], [5, 9], [7, 9]] as const) {
      voxels.push({ x, y, z: 4, t: 0, tone: 0, part: 'face' })
    }
    for (const [x, y, z] of [[1, 10, 4], [11, 10, 4]] as const) {
      voxels.push({ x, y, z, t: 0, part: 'detail', suspended: true })
    }
  } else if (variant === 'light-bulb') {
    // A classic wide globe that narrows sharply before the screw base.
    const globe: Array<[number, number, number]> = [
      [19, 1, 1], [18, 3, 2], [17, 4, 3], [16, 5, 3], [15, 6, 4],
      [14, 6, 4], [13, 6, 4], [12, 5, 3], [11, 5, 3], [10, 4, 3],
      [9, 3, 2], [8, 2, 2],
    ]
    for (const [y, halfWidth, halfDepth] of globe) {
      for (let x = -halfWidth; x <= halfWidth; x++) for (let z = -halfDepth; z <= halfDepth; z++) {
        if ((x / (halfWidth + 0.4)) ** 2 + (z / (halfDepth + 0.4)) ** 2 <= 1) {
          voxels.push({ x, y, z, t: 0, part: 'body' })
        }
      }
    }

    for (let y = 6; y <= 7; y++) for (let x = -2; x <= 2; x++) for (let z = -2; z <= 2; z++) {
      voxels.push({ x, y, z, t: 0, part: 'secondary' })
    }
    for (let y = 1; y <= 5; y++) {
      const halfWidth = y % 2 === 0 ? 3 : 2
      for (let x = -halfWidth; x <= halfWidth; x++) for (let z = -2; z <= 2; z++) {
        voxels.push({ x, y, z, t: 0, part: 'detail' })
      }
    }
    for (let x = -1; x <= 1; x++) for (let z = -1; z <= 1; z++) {
      voxels.push({ x, y: 0, z, t: 0, part: 'face' })
    }

    // The front filament and radiating marks make the symbol readable head-on.
    for (const [x, y] of [[-2, 13], [-2, 12], [-1, 11], [0, 10], [1, 11], [2, 12], [2, 13]] as const) {
      voxels.push({ x, y, z: 5, t: 0, part: 'face' })
    }
    for (const [x, y, z] of [
      [-9, 15, 0], [-8, 15, 0], [8, 15, 0], [9, 15, 0],
      [-7, 20, 0], [-6, 19, 0], [6, 19, 0], [7, 20, 0],
      [0, 22, 0], [0, 23, 0],
    ] as const) voxels.push({ x, y, z, t: 0, part: 'ray', suspended: true })
  } else if (variant === 'potato') {
    // A squat, asymmetric tuber with an uneven outline rather than an egg shape.
    for (let y = 1; y <= 10; y++) {
      const centerX = 6.2 + Math.sin(y * 0.83) * 0.55
      const centerZ = 3.1 + Math.cos(y * 0.67) * 0.25
      const vertical = (y - 5.5) / 5.2
      const width = 6.7 * Math.sqrt(Math.max(0, 1 - vertical ** 2)) + 0.8
      const depthRadius = 3.5 * Math.sqrt(Math.max(0, 1 - vertical ** 2)) + 0.55
      for (let x = 0; x <= 13; x++) for (let z = 0; z <= 7; z++) {
        const lump = Math.sin(x * 1.35 + y * 0.7) * 0.07
        const horizontal = (x - centerX) / width
        const depth = (z - centerZ) / depthRadius
        if (horizontal ** 2 + depth ** 2 <= 1 + lump) {
          voxels.push({ x, y, z, t: 0, part: 'body' })
        }
      }
    }
    // Place the face one voxel in front of the potato's outer surface.
    for (const [x, y, part] of [
      [4, 7, 'face'], [8, 7, 'face'],
      [5, 4, 'mouth'], [6, 4, 'mouth'], [7, 4, 'mouth'],
    ] as const) {
      const surface = voxels.filter((voxel) => voxel.x === x && voxel.y === y).sort((a, b) => b.z - a.z)[0]
      if (surface) voxels.push({ x, y, z: surface.z + 1, t: 0, tone: 0, part })
    }
    for (const [x, y, z] of [
      [7, 10, 3], [7, 11, 3], [7, 12, 3],
      [6, 12, 3], [5, 13, 3],
      [8, 12, 3], [9, 13, 3],
    ] as const) voxels.push({ x, y, z, t: 0, part: 'sprout' })
    for (const x of [4, 5, 8, 9]) for (let z = 2; z <= 4; z++) {
      voxels.push({ x, y: 0, z, t: 0, part: 'feet' })
    }
  } else if (variant === 'shape') {
    // Three fundamental forms overlap in depth as a compact geometric still life.
    for (let y = 1; y <= 8; y++) for (let x = -6; x <= -2; x++) for (let z = -4; z <= 0; z++) {
      if (((x + 4) / 2.5) ** 2 + ((z + 2) / 2.5) ** 2 <= 1) {
        voxels.push({ x, y, z, t: 0, part: 'body', group: 0 })
      }
    }
    for (let x = -3; x <= 3; x++) for (let y = 0; y <= 6; y++) for (let z = 0; z <= 6; z++) {
      if ((x / 3.4) ** 2 + ((y - 3) / 3.4) ** 2 + ((z - 3) / 3.4) ** 2 <= 1) {
        voxels.push({ x, y, z, t: 0, part: 'secondary', group: 1 })
      }
    }
    for (let y = 0; y <= 7; y++) {
      const halfWidth = Math.max(0, 4 - Math.floor(y / 2))
      for (let x = -halfWidth; x <= halfWidth; x++) for (let z = -halfWidth; z <= halfWidth; z++) {
        voxels.push({ x: x + 4, y: y + 1, z: z - 2, t: 0, part: 'accent', group: 2 })
      }
    }
  } else if (variant === 'build') {
    // Staggered toy bricks use raised voxel studs to make the interlocking system legible.
    let brick = 0
    const addBrick = (x: number, y: number, z: number, width: number, depth: number, part: VoxelPart, suspended = false) => {
      const group = brick++
      for (let bx = 0; bx < width; bx++) for (let by = 0; by < 2; by++) for (let bz = 0; bz < depth; bz++) {
        voxels.push({ x: x + bx, y: y + by, z: z + bz, t: 0, part, suspended, group })
      }
      for (let bx = 0; bx < width; bx += 2) for (let bz = 0; bz < depth; bz += 2) {
        voxels.push({ x: x + bx, y: y + 2, z: z + bz, t: 0, part, suspended, group })
      }
    }
    addBrick(-6, 0, -2, 6, 4, 'brick-blue')
    addBrick(0, 0, -2, 6, 4, 'brick-red')
    addBrick(-4, 3, -2, 6, 4, 'brick-yellow')
    addBrick(2, 3, -2, 4, 4, 'brick-blue')
    addBrick(-6, 6, -2, 4, 4, 'brick-red')
    addBrick(-2, 6, -2, 6, 4, 'brick-blue')
    addBrick(-3, 11, -2, 6, 4, 'brick-yellow', true)
  } else if (variant === 'connect') {
    // Two upright links are joined by one horizontal link passing through both openings.
    const addUprightLink = (centerX: number, part: VoxelPart, group: number) => {
      for (let x = -4; x <= 4; x++) for (let y = -4; y <= 4; y++) {
        const outer = (x / 4.4) ** 2 + (y / 4.4) ** 2 <= 1
        const opening = (x / 2.25) ** 2 + (y / 2.25) ** 2 < 1
        if (outer && !opening) {
          for (let z = -1; z <= 1; z++) voxels.push({ x: centerX + x, y: y + 4, z, t: 0, part, group })
        }
      }
    }
    const addHorizontalLink = () => {
      for (let x = -6; x <= 6; x++) for (let z = -4; z <= 4; z++) {
        const outer = (x / 6.4) ** 2 + (z / 4.4) ** 2 <= 1
        const opening = (x / 4.15) ** 2 + (z / 2.25) ** 2 < 1
        if (outer && !opening) {
          for (let y = -1; y <= 1; y++) voxels.push({ x, y: y + 4, z, t: 0, part: 'brick-blue', group: 1 })
        }
      }
    }
    addUprightLink(-7, 'brick-red', 0)
    addHorizontalLink()
    addUprightLink(7, 'brick-yellow', 2)
  } else if (variant === 'portal') {
    // Two unequal piers and an offset lintel form a doorway that changes shape in rotation.
    for (const x of [0, 1, 10, 11]) for (let z = 0; z < 3; z++) {
      const height = x < 2 ? 12 : 9
      for (let y = 0; y < height; y++) voxels.push({ x, y, z, t: 0 })
    }
    for (let x = 0; x < 9; x++) for (let z = 0; z < 2; z++) for (let y = 12; y < 14; y++) voxels.push({ x, y, z, t: 0 })
    for (let i = 0; i < 7; i++) {
      voxels.push({ x: 4 + i, y: 7 + Math.floor(i / 3), z: 4, t: 0 })
      if (i % 2 === 0) voxels.push({ x: 4 + i, y: 8 + Math.floor(i / 3), z: 4, t: 0 })
    }
    for (const [x, y, z] of [[3, 10, 3], [8, 11, 3], [9, 6, 4]] as const) voxels.push({ x, y, z, t: 0, suspended: true })
  } else if (variant === 'endless-stair') {
    const path: Array<[number, number]> = []
    for (let x = 0; x < 12; x++) path.push([x, 0])
    for (let z = 1; z < 12; z++) path.push([11, z])
    for (let x = 10; x >= 0; x--) path.push([x, 11])
    for (let z = 10; z >= 1; z--) path.push([0, z])
    path.forEach(([x, z], i) => {
      const y = Math.floor(i / 4)
      const inwardX = z === 0 ? 0 : z === 11 ? 0 : x === 0 ? 1 : -1
      const inwardZ = x === 0 || x === 11 ? 0 : z === 0 ? 1 : -1
      for (let width = 0; width < 2; width++) voxels.push({ x: x + inwardX * width, y, z: z + inwardZ * width, t: 0 })
    })
    // Sparse supports make the loop feel architectural without closing its center.
    for (const index of [0, 11, 22, 33]) {
      const [x, z] = path[index]
      for (let y = 0; y < Math.floor(index / 4); y += 2) voxels.push({ x, y, z, t: 0 })
    }
  } else {
    // Opposing structures reach toward one another but leave a charged central gap.
    for (const left of [true, false]) {
      const start = left ? 0 : 21
      for (let x = start; x < start + 4; x++) for (let z = 1; z < 6; z++) for (let y = 0; y < 7; y++) {
        if (x === start || x === start + 3 || z === 1 || z === 5) voxels.push({ x, y, z, t: 0 })
      }
      const from = left ? 3 : 14
      const to = left ? 11 : 21
      for (let x = from; x < to; x++) for (let z = 2; z < 5; z++) for (let y = 7; y < 9; y++) voxels.push({ x, y, z, t: 0 })
    }
    for (const [x, y, z] of [[11, 10, 3], [12, 6, 3], [13, 9, 3], [10, 5, 4]] as const) voxels.push({ x, y, z, t: 0, suspended: true })
  }
  const maxY = Math.max(...voxels.map((v) => v.y)) || 1
  for (const v of voxels) {
    v.t = v.tone ?? (v.y / maxY) * 0.72 + random() * 0.28
  }
  return voxels
}

function measure(voxels: Voxel[], centerVisualMass = false) {
  const box = new THREE.Box3()
  for (const voxel of voxels) box.expandByPoint(new THREE.Vector3(voxel.x, voxel.y, voxel.z))
  const size = box.getSize(new THREE.Vector3()).addScalar(0.9)
  const scale = 10.5 / Math.max(size.x, size.y, size.z, 1)
  const center = box.getCenter(new THREE.Vector3())
  if (centerVisualMass) {
    center.x = voxels.reduce((sum, voxel) => sum + voxel.x, 0) / voxels.length
    center.z = voxels.reduce((sum, voxel) => sum + voxel.z, 0) / voxels.length
  }
  return {
    center,
    scale,
    floorY: -size.y * scale * 0.5,
    // A padded bounding sphere keeps every Y-axis rotation inside the viewport.
    frameSize: size.length() * scale * 1.08,
  }
}

function Voxels({ voxels, variant, darkMode, active, hovered, reducedMotion }: { voxels: Voxel[]; variant: VoxelVariant; darkMode: boolean; active: boolean; hovered: boolean; reducedMotion: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const assemblyElapsed = useRef(0)
  const animationElapsed = useRef(0)
  const assembled = useRef(reducedMotion)
  const matricesReady = useRef(false)
  const excitement = useRef(0)
  const { center, scale } = useMemo(() => measure(voxels, variant === 'potato'), [voxels, variant])
  const hasSuspended = useMemo(() => voxels.some((voxel) => voxel.suspended), [voxels])
  const palettes = useMemo(() => {
    const face = new THREE.Color(darkMode ? '#171716' : '#20201e')
    const white = new THREE.Color('#f4f4ef')
    const processNeutral = new THREE.Color(darkMode ? '#aaa9a1' : '#c8c7bf')
    const neck = new THREE.Color(darkMode ? '#c4c4bd' : '#d4d4cc')
    const metal = new THREE.Color(darkMode ? '#8f8f88' : '#9f9f98')
    const neutralFeet = new THREE.Color(darkMode ? '#aaa9a1' : '#c8c7bf')
    const hover = {
      bulb: new THREE.Color('#ffe34d'), mouth: new THREE.Color('#bd5b56'), ray: new THREE.Color('#ffd000'),
      potato: new THREE.Color('#b58a5c'), feet: new THREE.Color('#806548'), sprout: new THREE.Color('#76956a'),
      robotBody: new THREE.Color('#e9ece8'), robotPanel: new THREE.Color('#315da8'), robotJoint: new THREE.Color('#3f4650'),
      robotFeet: new THREE.Color('#c94343'), robotAccent: new THREE.Color('#e4b83f'),
      red: new THREE.Color(RBY.red), blue: new THREE.Color(RBY.blue), yellow: new THREE.Color(RBY.yellow),
    }
    return voxels.map((voxel) => {
      let resting = white
      if (voxel.part === 'face' || voxel.part === 'mouth') resting = face
      else if (voxel.part === 'ray') resting = hover.ray
      else if (variant === 'shape' || variant === 'build' || variant === 'connect') resting = processNeutral
      else if (variant === 'light-bulb' && voxel.part === 'detail') resting = metal
      else if (variant === 'light-bulb' && voxel.part === 'secondary') resting = neck
      else if (variant === 'potato' && voxel.part === 'feet') resting = neutralFeet

      let activeColor = resting
      if (voxel.part === 'mouth') activeColor = hover.mouth
      else if (voxel.part === 'sprout') activeColor = hover.sprout
      else if (variant === 'potato' && voxel.part === 'feet') activeColor = hover.feet
      else if (variant === 'potato' && voxel.part !== 'face') activeColor = hover.potato
      else if (variant === 'light-bulb' && voxel.part === 'body') activeColor = hover.bulb
      else if (variant === 'shape') activeColor = voxel.part === 'body' ? hover.blue
        : voxel.part === 'secondary' ? hover.red : hover.yellow
      else if (variant === 'build' || variant === 'connect') activeColor = voxel.part === 'brick-red' ? hover.red
        : voxel.part === 'brick-yellow' ? hover.yellow : hover.blue
      else if (variant === 'pixel-robot' && voxel.part !== 'face') {
        activeColor = voxel.part === 'secondary' ? hover.robotPanel
          : voxel.part === 'detail' ? hover.robotJoint
            : voxel.part === 'feet' ? hover.robotFeet
              : voxel.part === 'accent' ? hover.robotAccent : hover.robotBody
      }
      return { resting: resting.clone(), hover: activeColor.clone() }
    })
  }, [voxels, variant, darkMode])
  const scratch = useMemo(() => ({
    matrix: new THREE.Matrix4(),
    position: new THREE.Vector3(),
    quaternion: new THREE.Quaternion(),
    size: new THREE.Vector3(),
    color: new THREE.Color(),
  }), [])
  const invalidate = useThree((state) => state.invalidate)

  useLayoutEffect(() => {
    const instance = mesh.current
    if (!instance) return
    palettes.forEach(({ resting }, index) => {
      instance.setColorAt(index, resting)
    })
    if (instance.instanceColor) instance.instanceColor.needsUpdate = true
    invalidate()
  }, [palettes, invalidate])

  useLayoutEffect(() => {
    const instance = mesh.current
    if (!instance) return
    assemblyElapsed.current = 0
    animationElapsed.current = 0
    assembled.current = reducedMotion
    matricesReady.current = false
    excitement.current = 0
    instance.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    invalidate()
  }, [voxels, reducedMotion, invalidate])

  useFrame((_, delta) => {
    const instance = mesh.current
    if (!instance) return
    const step = Math.min(delta, 0.05)
    if (active && !reducedMotion) {
      animationElapsed.current += step
      if (!assembled.current) assemblyElapsed.current += step
    }
    const hoverTarget = active && hovered ? 1 : 0
    excitement.current = reducedMotion ? hoverTarget : THREE.MathUtils.damp(excitement.current, hoverTarget, 7, step)

    const animateInstances = !matricesReady.current || !assembled.current || (active && !reducedMotion && (hasSuspended || hovered || excitement.current > 0.001))
    if (!animateInstances) return

    const elapsed = animationElapsed.current
    const { matrix, position, quaternion, size, color } = scratch

    voxels.forEach((voxel, index) => {
      const delay = (index % 17) * 0.022 + voxel.t * 0.28
      const rawProgress = reducedMotion || assembled.current ? 1 : Math.min(1, Math.max(0, (assemblyElapsed.current - delay) / 1.05))
      const progress = 1 - Math.pow(1 - rawProgress, 3)
      const float = active && !reducedMotion && assembled.current && voxel.suspended ? Math.sin(elapsed * 1.15 + index) * 0.18 : 0
      const wiggle = active && !reducedMotion && assembled.current && variant !== 'shape' && variant !== 'build' && (voxel.part === 'detail' || voxel.part === 'sprout')
        ? Math.sin(elapsed * 8 + index * 0.8) * 0.16 * excitement.current
        : 0
      const brickGroup = voxel.group ?? 0
      const brickDetach = variant === 'build' && assembled.current
        ? excitement.current * (0.5 - Math.cos(elapsed * 2.4) * 0.5) * (0.75 + (brickGroup % 3) * 0.18)
        : 0
      const brickAngle = brickGroup * 2.17
      const shapeGroup = voxel.group ?? 1
      const shapeLift = variant === 'shape' && assembled.current
        ? excitement.current * (0.35 + Math.sin(elapsed * 2.6 + shapeGroup * 2.1) * 0.3)
        : 0
      const shapeSpread = variant === 'shape' && assembled.current
        ? excitement.current * (shapeGroup - 1) * 0.55
        : 0
      const chainShift = variant === 'connect' && assembled.current
        ? excitement.current * Math.sin(elapsed * 2.2) * (shapeGroup - 1) * 0.65
        : 0
      const chainLift = variant === 'connect' && assembled.current
        ? excitement.current * (0.5 - Math.cos(elapsed * 2.2) * 0.5) * (shapeGroup === 1 ? 0.45 : -0.15)
        : 0
      position.set(
        voxel.x - center.x + (1 - progress) * Math.sin(index * 2.17) * 2.4 + wiggle + Math.cos(brickAngle) * brickDetach + shapeSpread + chainShift,
        voxel.y - center.y - (1 - progress) * (4 + (index % 7) * 0.45) + float + Math.abs(wiggle) * 0.5 + Math.sin(brickAngle) * brickDetach * 0.65 + shapeLift + chainLift,
        voxel.z - center.z + (1 - progress) * Math.cos(index * 1.73) * 2.4 + Math.sin(brickAngle * 1.3) * brickDetach * 0.65,
      )
      const cubeScale = 0.18 + progress * 0.82
      size.setScalar(cubeScale)
      if (voxel.part === 'ray') {
        size.multiplyScalar(excitement.current)
        position.x *= 0.86 + excitement.current * 0.14
        position.y = center.y + (position.y - center.y) * (0.86 + excitement.current * 0.14)
      }
      if (voxel.part === 'mouth') {
        size.y *= 1 + excitement.current * 1.15
        position.y -= excitement.current * 0.35
      }
      matrix.compose(position, quaternion, size)
      instance.setMatrixAt(index, matrix)
      const palette = palettes[index]
      instance.setColorAt(index, color.copy(palette.resting).lerp(palette.hover, excitement.current))
    })
    if (!assembled.current && (reducedMotion || assemblyElapsed.current > 1.8)) assembled.current = true
    matricesReady.current = true
    instance.instanceMatrix.needsUpdate = true
    if (instance.instanceColor) instance.instanceColor.needsUpdate = true
  })

  return <group scale={scale}>
    <instancedMesh ref={mesh} args={[undefined, undefined, voxels.length]} castShadow={!darkMode} frustumCulled={false}>
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      <meshLambertMaterial />
    </instancedMesh>
  </group>
}

function BulbGlow({ hovered, reducedMotion }: { hovered: boolean; reducedMotion: boolean }) {
  const sprite = useRef<THREE.Sprite>(null)
  const texture = useMemo(() => {
    const size = 64
    const data = new Uint8Array(size * size * 4)
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const distance = Math.hypot(x - size / 2, y - size / 2) / (size / 2)
      const alpha = Math.max(0, 1 - distance) ** 2
      const offset = (y * size + x) * 4
      data[offset] = 255
      data[offset + 1] = 207
      data[offset + 2] = 0
      data[offset + 3] = Math.round(alpha * 255)
    }
    const nextTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
    nextTexture.needsUpdate = true
    return nextTexture
  }, [])
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => () => texture.dispose(), [texture])

  useLayoutEffect(() => {
    if (!sprite.current || !reducedMotion) return
    sprite.current.material.opacity = hovered ? 0.42 : 0
    sprite.current.scale.setScalar(hovered ? 9 : 7)
    invalidate()
  }, [hovered, reducedMotion, invalidate])

  useFrame((_, delta) => {
    if (!sprite.current || reducedMotion) return
    const target = hovered ? 0.42 : 0
    sprite.current.material.opacity = THREE.MathUtils.damp(sprite.current.material.opacity, target, 7, delta)
    const scale = THREE.MathUtils.damp(sprite.current.scale.x, hovered ? 9 : 7, 7, delta)
    sprite.current.scale.setScalar(scale)
  })

  return <sprite ref={sprite} position={[0, 1.1, -1.5]} scale={7}>
    <spriteMaterial map={texture} color="#ffd000" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
  </sprite>
}

function GroundShadow({ voxels, darkMode }: { voxels: Voxel[]; darkMode: boolean }) {
  const { floorY, frameSize } = useMemo(() => measure(voxels), [voxels])
  if (darkMode) return null
  return <mesh position={[0, floorY - 0.08, 0]} rotation-x={-Math.PI / 2} receiveShadow>
    <planeGeometry args={[frameSize * 1.2, frameSize * 1.2]} />
    <shadowMaterial color="#8f8f87" transparent opacity={0.14} />
  </mesh>
}

function Rig({ children, animate, hovered, rotation }: { children: React.ReactNode; animate: boolean; hovered: boolean; rotation: { x: number; y: number } }) {
  const group = useRef<THREE.Group>(null)
  const elapsed = useRef(0)
  const excitement = useRef(0)
  const invalidate = useThree((state) => state.invalidate)

  useLayoutEffect(() => {
    if (animate || !group.current) return
    group.current.rotation.set(rotation.x, Math.PI / 5 + rotation.y, 0)
    group.current.position.set(0, 0, 0)
    group.current.scale.setScalar(1)
    excitement.current = 0
    invalidate()
  }, [animate, rotation, invalidate])

  useFrame(({ pointer }, delta) => {
    if (!animate || !group.current) return
    const step = Math.min(delta, 0.05)
    elapsed.current += step
    excitement.current = THREE.MathUtils.damp(excitement.current, hovered ? 1 : 0, 7, step)
    const targetY = Math.PI / 5 + rotation.y + Math.sin(elapsed.current * 0.22) * 0.34 + pointer.x * 0.08
    const targetX = rotation.x + pointer.y * 0.055
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 2.2, step)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 2.2, step)
    group.current.rotation.z = Math.sin(elapsed.current * 5.5) * 0.018 * excitement.current
    group.current.position.y = excitement.current * 0.08
    group.current.scale.setScalar(1 + excitement.current * 0.04)
  })
  return <group ref={group} rotation-y={Math.PI / 5}>{children}</group>
}

function Fit({ frameSize }: { frameSize: number }) {
  const fittedSize = useRef('')
  useFrame(({ camera, size }) => {
    if (!(camera instanceof THREE.OrthographicCamera) || size.width <= 0 || size.height <= 0) return
    const nextSize = `${size.width}:${size.height}:${frameSize}`
    if (fittedSize.current === nextSize) return
    const zoom = Math.min(size.width, size.height) / frameSize
    if (!Number.isFinite(zoom) || zoom <= 0) return
    camera.zoom = zoom
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    fittedSize.current = nextSize
  })
  return null
}

function FrameController({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => invalidate(), [active, reducedMotion, invalidate])
  useFrame(() => {
    if (active && !reducedMotion) invalidate()
  })
  return null
}

const MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const safeEvents: typeof events = (store) => {
  const manager = events(store)
  const connect = manager.connect
  manager.connect = (target) => {
    if (target) connect?.(target)
  }
  return manager
}

function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(MOTION_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

export default function VoxelCanvas({ variant = 'pixel-robot', active = true, hovered = false, rotation = { x: 0, y: 0 } }: { variant?: VoxelVariant; active?: boolean; hovered?: boolean; rotation?: { x: number; y: number } }) {
  const { resolvedTheme } = useTheme()
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia(MOTION_QUERY).matches, () => false)
  const voxels = useMemo(() => generate(variant), [variant])
  const frameSize = useMemo(() => measure(voxels).frameSize, [voxels])

  const darkMode = resolvedTheme === 'dark'

  return <Canvas
    events={safeEvents}
    shadows={darkMode ? false : 'percentage'}
    orthographic
    camera={{ position: [16, 14, 16], zoom: 34, near: 0.1, far: 100 }}
    dpr={[1, 2]}
    gl={{ antialias: true, alpha: true }}
    onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    style={{ background: 'transparent' }}
    frameloop="demand"
  >
    <FrameController active={active} reducedMotion={reducedMotion} />
    <Fit frameSize={frameSize} />
    <ambientLight intensity={1.05} />
    <directionalLight position={[6, 10, 4]} intensity={1.8} castShadow={!darkMode} shadow-mapSize-width={512} shadow-mapSize-height={512} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-normalBias={0.04} />
    <directionalLight position={[-6, 4, -8]} intensity={0.5} />
    <Rig animate={active && !reducedMotion} hovered={hovered} rotation={rotation}>
      {variant === 'light-bulb' && <BulbGlow hovered={hovered} reducedMotion={reducedMotion} />}
      <Voxels voxels={voxels} variant={variant} darkMode={darkMode} active={active} hovered={hovered} reducedMotion={reducedMotion} />
    </Rig>
    <GroundShadow voxels={voxels} darkMode={darkMode} />
  </Canvas>
}
