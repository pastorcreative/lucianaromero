# Librerías del Frontend

El proyecto Astro incluye las siguientes librerías instaladas y configuradas:

## GSAP (GreenSock Animation Platform) v3.15.0

Librería profesional de animaciones JavaScript.

### Uso básico

```javascript
import gsap from 'gsap';

// Animación simple
gsap.to('.elemento', {
  x: 100,
  duration: 1,
  ease: 'power2.inOut'
});

// Timeline para animaciones secuenciales
const tl = gsap.timeline();
tl.to('.elemento1', { opacity: 1, duration: 1 })
  .to('.elemento2', { x: 200, duration: 1 })
  .to('.elemento3', { scale: 1.5, duration: 0.5 });
```

### Recursos
- [Documentación oficial](https://greensock.com/docs/)
- [Cheat Sheet](https://greensock.com/cheatsheet/)
- [Ejemplos CodePen](https://codepen.io/GreenSock/)

## Three.js v0.184.0

Librería para crear gráficos 3D en el navegador.

### Uso básico

```javascript
import * as THREE from 'three';

// Crear escena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// Crear geometría
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// Loop de animación
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
```

### Recursos
- [Documentación oficial](https://threejs.org/docs/)
- [Ejemplos](https://threejs.org/examples/)
- [Three.js Journey](https://threejs-journey.com/) (curso recomendado)

## Tailwind CSS v4.2.4

Framework CSS utility-first de última generación.

### Configuración

El proyecto usa Tailwind CSS v4 con el plugin de Vite. La configuración está en:
- `astro.config.mjs` - Plugin de Vite
- `src/styles/global.css` - Importación de Tailwind

### Uso básico

```html
<!-- Tailwind CSS v4 -->
<div class="bg-blue-500 text-white p-4 rounded-lg">
  <h1 class="text-2xl font-bold">Título</h1>
  <p class="text-gray-300">Contenido</p>
</div>
```

### Novedades de Tailwind v4

- **Importación CSS**: Usa `@import "tailwindcss"` en lugar de directivas
- **Configuración en CSS**: Variables CSS nativas para personalización
- **Mejor rendimiento**: Motor CSS más rápido
- **Zero-config**: Funciona sin archivo de configuración

### Personalización en v4

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --font-display: 'Inter', sans-serif;
}
```

### Recursos
- [Documentación Tailwind v4](https://tailwindcss.com/docs)
- [Tailwind Play](https://play.tailwindcss.com/) (playground)
- [Componentes UI](https://tailwindui.com/)

## Combinando las tres librerías

Ejemplo de cómo usar las tres juntas:

```astro
---
import '../styles/global.css';
---

<div class="container mx-auto p-8">
  <h1 class="text-4xl font-bold mb-4">Mi Proyecto</h1>
  
  <!-- Elemento animado con GSAP -->
  <div id="animated-box" class="w-32 h-32 bg-blue-500 rounded-lg"></div>
  
  <!-- Canvas para Three.js -->
  <div id="three-container" class="w-full h-96 bg-gray-900 rounded-lg"></div>
</div>

<script>
  import gsap from 'gsap';
  import * as THREE from 'three';

  // GSAP
  gsap.to('#animated-box', {
    x: 200,
    rotation: 360,
    duration: 2,
    repeat: -1,
    yoyo: true
  });

  // Three.js
  const container = document.getElementById('three-container');
  const scene = new THREE.Scene();
  // ... configuración de Three.js
</script>
```

## TypeScript

Todas las librerías tienen soporte completo para TypeScript:
- GSAP incluye sus propios tipos
- Three.js usa `@types/three` (ya instalado)
- Tailwind CSS funciona con IntelliSense en archivos Astro y HTML

## Plugins adicionales recomendados

### GSAP Plugins (premium)
- ScrollTrigger (animaciones al hacer scroll)
- ScrollSmoother (scroll suave)
- Draggable (interacciones drag & drop)

### Three.js Addons
- OrbitControls (controles de cámara)
- GLTFLoader (cargar modelos 3D)
- EffectComposer (post-processing)

### Tailwind Plugins
- @tailwindcss/typography
- @tailwindcss/forms
- @tailwindcss/aspect-ratio
