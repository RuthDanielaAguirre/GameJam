# Light Hunt AR 🔮

Juego de realidad aumentada para Game Jam. Captura orbes de luz que aparecen sobre un portal en el mundo real.

## Setup

```bash
pnpm install
pnpm dev
```

## Generar tu imagen target (.mind)

1. Ve a: https://hiukim.github.io/mind-ar-js-doc/tools/compile
2. Sube tu imagen "portal" (necesita buen contraste, mínimo 2-3 estrellas)
3. Descarga el `.mind` generado
4. Ponlo en `/public/targets/portal.mind`
5. Cambia la URL en `src/game/ar.js` línea ~20:
   ```js
   imageTargetSrc: '/targets/portal.mind',
   ```

## Sonidos

Genera los sfx gratis en https://sfxr.me o https://jsfxr.com y ponlos en `/public/sounds/`:
- `capture.mp3` — sonido al capturar un orbe
- `spawn.mp3`   — sonido al aparecer un orbe
- `ambient.mp3` — música de fondo en loop

## División del equipo

| Persona | Archivos |
|---------|----------|
| Tú (AR + Three.js) | `src/game/ar.js`, `src/game/createOrb.js` |
| UI | `src/App.jsx`, `src/index.css` |
| Audio | `src/game/audio.js`, buscar/generar sfx |
| Efectos | `src/game/createOrb.js` (más partículas, más tipos) |

## Deploy

Cada `git push` a main despliega automáticamente en Vercel con HTTPS. 
Prueba siempre en móvil, el AR solo funciona con cámara real.