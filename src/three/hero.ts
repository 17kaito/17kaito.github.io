import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js'

export type HeroAPI = { cleanup: () => void; warpOut: () => Promise<void> }

export function mountThree(container: HTMLElement): HeroAPI {
  // -------------------------
  // Tunables (easy knobs)
  // -------------------------
  const STAGE_Y = 1.1              // lift scene higher in frame (0.5 = lower, 1.2 = higher) # base line 0.8 
  const FRAME_OFFSET = -0.2       // look slightly below stage; negative pushes subject up (-0.3 = lower, -0.8 = higher) # base line -0.5
  const ROT_SPEED = 0.25             // radians/sec for slow spin (0.1 = slower, 0.5 = faster)
  const WARP_MS = 1000               // warp animation duration (800 = faster, 1200 = slower)
  const LINE_COLOR = 0x374151        // much darker gray lines
  const NODE_COLOR = 0x6b7280        // darker gray nodes

  // -------------------------
  // Renderer
  // -------------------------
  const { clientWidth: w0, clientHeight: h0 } = container
  const width = Math.max(1, w0), height = Math.max(1, h0)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15
  renderer.domElement.style.cssText = 'width:100%;height:100%;display:block'
  container.appendChild(renderer.domElement)

  // Overlay for fade-to-black (warp)
  const overlay = document.createElement('div')
  Object.assign(overlay.style, {
    position: 'absolute', inset: '0', background: '#000', opacity: '0',
    pointerEvents: 'none', transition: 'none'
  } as CSSStyleDeclaration)
  container.appendChild(overlay)

  // -------------------------
  // Scene & Camera
  // -------------------------
  const scene = new THREE.Scene()
  scene.background = null

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(0, STAGE_Y + 1.1, 3.25)
  camera.lookAt(0, STAGE_Y + FRAME_OFFSET, 0)

  // Lights (subtle, lines don't need much)
  scene.add(new THREE.AmbientLight(0xffffff, 0.25))
  const key = new THREE.DirectionalLight(0xffffff, 0.6)
  key.position.set(3, 4, 2)
  scene.add(key)

  // Group we rotate
  const stage = new THREE.Group()
  stage.position.y = STAGE_Y
  scene.add(stage)

  // -------------------------
  // Metatron's Cube (procedural)
  // -------------------------
  const meta = makeMetatron(LINE_COLOR, NODE_COLOR)
  stage.add(meta.group)

  // -------------------------
  // Camera setup
  // -------------------------
  scene.add(camera)

  // -------------------------
  // Post-processing
  // -------------------------
  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.65, 0.4, 0.85)
  composer.addPass(bloom)

  const after = new AfterimagePass()
  after.uniforms['damp'].value = 0.96   // shorter trails when idle; we'll drop during warp
  composer.addPass(after)

  // -------------------------
  // Resize
  // -------------------------
  const onResize = () => {
    const w = Math.max(1, container.clientWidth), h = Math.max(1, container.clientHeight)
    renderer.setSize(w, h)
    composer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    camera.lookAt(0, STAGE_Y + FRAME_OFFSET, 0)
  }
  const ro = new ResizeObserver(onResize)
  ro.observe(container)
  window.addEventListener('resize', onResize)

  // -------------------------
  // Animation loop
  // -------------------------
  let raf = 0
  let warping = false

  const clock = new THREE.Clock()
  const loop = () => {
    const dt = clock.getDelta()

    // idle spin
    if (!warping) meta.group.rotation.y += ROT_SPEED * dt

    composer.render()
    raf = requestAnimationFrame(loop)
  }
  loop()

  // -------------------------
  // Warp API
  // -------------------------
  const warpOut = () => new Promise<void>((resolve) => {
    if (warping) return resolve()
    warping = true

    const t0 = performance.now()
    const fov0 = 45, fov1 = 110
    const exp0 = renderer.toneMappingExposure, exp1 = 1.9
    const damp0 = after.uniforms['damp'].value, damp1 = 0.88
    const bloom0 = bloom.strength, bloom1 = 1.1

    const animateWarp = () => {
      const t = Math.min(1, (performance.now() - t0) / WARP_MS)
      const e = easeInOutCubic(t)

      // camera punch
      camera.fov = lerp(fov0, fov1, e)
      camera.updateProjectionMatrix()
      renderer.toneMappingExposure = lerp(exp0, exp1, e)

      // trails & glow
      after.uniforms['damp'].value = lerp(damp0, damp1, e)
      bloom.strength = lerp(bloom0, bloom1, e)

      // Metatron shape transformation
      meta.transformWarp(e)

      // overlay fade to black toward the end
      overlay.style.opacity = String(Math.max(0, (t - 0.7) / 0.3))

      if (t < 1) {
        requestAnimationFrame(animateWarp)
      } else {
        resolve()
      }
    }
    animateWarp()
  })

  // -------------------------
  // Cleanup
  // -------------------------
  const cleanup = () => {
    cancelAnimationFrame(raf)
    ro.disconnect()
    window.removeEventListener('resize', onResize)
    container.removeChild(renderer.domElement)
    container.removeChild(overlay)
    composer.dispose()
    renderer.dispose()
    meta.dispose()
  }

  return { cleanup, warpOut }
}

/* --------------------------
   Helpers (geometry, stars)
---------------------------*/

// Build a canonical "Metatron" wireframe:
// - 13 nodes = center + 12 vertices of an icosahedron (unit radius)
// - edges: spokes from center + two tiers of pairwise edges (nearest & next-nearest)
//   for that dense sacred-geometry lattice.
// - tiny instanced node dots.
// 
// ADJUSTABLE SHAPE PARAMETERS:
// - R = 0.95: controls overall size (0.8 = smaller, 1.2 = larger)
// - TOL = 1e-3: edge detection tolerance (lower = more precise, higher = more edges)
// - dotGeo size: 0.028 controls node dot size
function makeMetatron(lineColor: number, nodeColor: number) {

  const group = new THREE.Group()

  // ----- vertices -----
  const phi = (1 + Math.sqrt(5)) / 2 // golden ratio
  const raw: THREE.Vector3[] = []
  // standard icosa coords before normalization
  const push = (x: number, y: number, z: number) => raw.push(new THREE.Vector3(x, y, z))
  // (0, ±1, ±φ)
  ;[1, -1].forEach(y => [phi, -phi].forEach(z => push(0, y, z)))
  // (±1, ±φ, 0)
  ;[1, -1].forEach(x => [phi, -phi].forEach(y => push(x, y, 0)))
  // (±φ, 0, ±1)
  ;[phi, -phi].forEach(x => [1, -1].forEach(z => push(x, 0, z)))

  // normalize all outer verts to a common radius and scale to fit the frame
  const R = 0.95  // ADJUST: 0.8 = smaller, 1.2 = larger
  const outer = raw.map(v => v.clone().normalize().multiplyScalar(R))
  const center = new THREE.Vector3(0, 0, 0)
  const verts = [center, ...outer] // index 0 = center, 1..12 = outer

  // ----- discover pairwise distances among outer verts -----
  const ds: number[] = []
  for (let i = 1; i < verts.length; i++) {
    for (let j = i + 1; j < verts.length; j++) {
      ds.push(verts[i].distanceTo(verts[j]))
    }
  }
  ds.sort((a, b) => a - b)
  // cluster to unique lengths with tolerance
  const uniq: number[] = []
  const TOL = 1e-3  // ADJUST: lower = more precise edge detection
  ds.forEach(d => {
    if (uniq.length === 0 || Math.abs(d - uniq[uniq.length - 1]) > TOL) uniq.push(d)
  })
  // For a normalized icosa, uniq[0] ~ edge length, uniq[1] ~ next tier
  const tiers = uniq.slice(0, 2)

  // ----- build edges -----
  const edges: Array<[number, number]> = []
  // spokes (center to every outer)
  for (let i = 1; i < verts.length; i++) edges.push([0, i])

  // two tiers of outer-outer connections for that "super cube" density
  for (let i = 1; i < verts.length; i++) {
    for (let j = i + 1; j < verts.length; j++) {
      const d = verts[i].distanceTo(verts[j])
      if (Math.abs(d - tiers[0]) < TOL || Math.abs(d - tiers[1]) < TOL) {
        edges.push([i, j])
      }
    }
  }

  // ----- line segments geometry -----
  const linePos = new Float32Array(edges.length * 2 * 3)
  let k = 0
  edges.forEach(([a, b]) => {
    const A = verts[a], B = verts[b]
    linePos[k++] = A.x; linePos[k++] = A.y; linePos[k++] = A.z
    linePos[k++] = B.x; linePos[k++] = B.y; linePos[k++] = B.z
  })
  const lineGeo = new THREE.BufferGeometry()
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3))
  const lineMat = new THREE.LineBasicMaterial({ color: lineColor, transparent: true, opacity: 0.95 })
  const lines = new THREE.LineSegments(lineGeo, lineMat)
  group.add(lines)

  // ----- node dots -----
  const dotGeo = new THREE.SphereGeometry(0.028, 12, 12)  // ADJUST: 0.02 = smaller dots, 0.04 = larger
  const dotMat = new THREE.MeshBasicMaterial({ color: nodeColor })
  const dots = new THREE.InstancedMesh(dotGeo, dotMat, verts.length)
  const m = new THREE.Matrix4()
  verts.forEach((v, i) => { m.makeTranslation(v.x, v.y, v.z); dots.setMatrixAt(i, m) })
  dots.instanceMatrix.needsUpdate = true
  group.add(dots)

  return {
    group,
    setLineOpacity: (o: number) => { (lines.material as THREE.LineBasicMaterial).opacity = o },
    transformWarp: (t: number) => {
      // Cool infinity effect: scale + rotate + fade
      const scale = lerp(1, 0.3, t)  // shrink down
      const rotation = lerp(0, Math.PI * 4, t)  // spin fast
      const opacity = lerp(0.95, 0.2, t)  // fade out
      
      group.scale.setScalar(scale)
      group.rotation.z = rotation
      ;(lines.material as THREE.LineBasicMaterial).opacity = opacity
      ;(dots.material as THREE.MeshBasicMaterial).opacity = opacity
    },
    dispose: () => {
      lineGeo.dispose(); (lineMat as THREE.Material).dispose()
      dotGeo.dispose(); (dotMat as THREE.Material).dispose()
    },
  }
}



// utils
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)


