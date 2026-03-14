import * as THREE from 'three'
import { createOrb } from './createOrb'
import { playCapture, playSpawn } from './audio'

let scene, camera, renderer, container
let orbs = []
let callbacks = {}
let spawnInterval = null
let isRunning = false

export async function initAR(parentContainer, { onCapture }) {
  callbacks.onCapture = onCapture
  container = parentContainer
  isRunning = true

  // --- Setup Three.js ---
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x050510) // Fondo oscuro espacial

  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  )
  camera.position.z = 5

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)

  // --- Iluminación ---
  scene.add(new THREE.AmbientLight(0xffffff, 0.4))
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
  dirLight.position.set(5, 5, 5)
  scene.add(dirLight)

  // --- Spawn de orbes ---
  const spawnOrb = () => {
    if (!isRunning || orbs.length >= 15) return
    const orb = createOrb()
    
    // Posiciones aleatorias frente a la cámara
    orb.position.set(
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 4,
      Math.random() * -5 // Profundidad
    )
    
    orb.userData.baseY = orb.position.y
    orb.userData.phase = Math.random() * Math.PI * 2
    scene.add(orb)
    orbs.push(orb)
    playSpawn()
  }

  // Iniciamos spawn inmediatamente (o con el delay que quieras, pero aquí directo por simplicidad ahora)
  console.log('Iniciando spawn de orbes...')
  spawnOrb()
  spawnInterval = setInterval(spawnOrb, 1500)

  // --- Raycasting para clicks ---
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  const handlePointer = (e) => {
    // Evitar que el evento se propague si es necesario
    const x = e.touches ? e.touches[0].clientX : e.clientX
    const y = e.touches ? e.touches[0].clientY : e.clientY
    
    console.log('Click detectado en UI:', x, y)
    
    // Usar window.innerWidth/Height para mayor robustez en el cálculo de NDC
    mouse.x = (x / window.innerWidth) * 2 - 1
    mouse.y = -(y / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const hits = raycaster.intersectObjects(orbs, true)

    if (hits.length > 0) {
      let target = hits[0].object
      while (target.parent && !orbs.includes(target)) {
        target = target.parent
      }
      const idx = orbs.indexOf(target)
      if (idx > -1) {
        console.log('✅ ¡Orbe capturado!')
        scene.remove(target)
        orbs.splice(idx, 1)
        playCapture()
        callbacks.onCapture?.()
      }
    }
  }

  window.addEventListener('mousedown', handlePointer)
  window.addEventListener('touchstart', handlePointer, { passive: true })

  // --- Handle Resize ---
  const handleResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
  }
  window.addEventListener('resize', handleResize)

  // --- Loop de animación ---
  const animate = (time) => {
    if (!isRunning) return
    requestAnimationFrame(animate)

    orbs.forEach((orb) => {
      orb.position.y = orb.userData.baseY + Math.sin(time * 0.002 + orb.userData.phase) * 0.1
      orb.rotation.y += 0.02
      orb.rotation.x += 0.01
    })

    renderer.render(scene, camera)
  }
  animate(0)

  // Cleanup function stored for stopAR
  callbacks.cleanup = () => {
    window.removeEventListener('resize', handleResize)
    container.removeEventListener('mousedown', handlePointer)
    container.removeEventListener('touchstart', handlePointer)
    if (renderer.domElement && container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement)
    }
  }
}

export function stopAR() {
  isRunning = false
  clearInterval(spawnInterval)
  if (callbacks.cleanup) callbacks.cleanup()
  orbs = []
}