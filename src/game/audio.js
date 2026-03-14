import { Howl } from 'howler'

// Sonidos — pon tus archivos en /public/sounds/
// Puedes generar sfx gratis en: sfxr.me o jsfxr.com
const captureSound = new Howl({ src: ['/sounds/capture.mp3'], volume: 0.8 })
const spawnSound   = new Howl({ src: ['/sounds/spawn.mp3'],   volume: 0.4 })
const ambientSound = new Howl({ src: ['/sounds/ambient.mp3'], loop: true, volume: 0.25 })

export const playCapture = () => captureSound.play()
export const playSpawn   = () => spawnSound.play()
export const playAmbient = () => ambientSound.play()
export const stopAmbient = () => ambientSound.stop()