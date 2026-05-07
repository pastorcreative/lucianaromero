# FluidCanvas Component

Componente Astro para renderizar un efecto de fluido metálico plateado usando ray marching y metaballs en WebGL.

## Uso

```astro
---
import FluidCanvas from '../components/FluidCanvas.astro';
---

<FluidCanvas 
  colorMin={0.42}
  colorMax={0.52}
  intensity={1.15}
  gamma={3.5}
  baseRadius={0.18}
  trailLength={20}
  smoothness={6.5}
  deformation={0.12}
  sizeVariationAmplitude={0.3}
  sizeVariationFrequency={0.5}
  sizeVariationBase={0.85}
  organicOffsetAmplitude={0.2}
  organicOffsetFrequencyX={0.8}
  organicOffsetFrequencyY={0.6}
  surfaceNoiseScale={2.5}
  trailDecay={0.8}
  mouseAttractionStrength={0.1}
  mouseInfluence={0.4}
  scrollSpeed={1.2}
  animationSpeed={1.0}
/>
```

## Props

### Propiedades de Brillo

- **colorMin** (number, default: 0.42)
  - Rango: 0-1
  - Color base más oscuro del metalizado
  - Valores más bajos = más oscuro

- **colorMax** (number, default: 0.52)
  - Rango: 0-1
  - Color highlight más claro del metalizado
  - Valores más altos = más brillante

- **intensity** (number, default: 1.15)
  - Multiplicador de intensidad del color
  - Valores más altos = mayor brillo general

- **gamma** (number, default: 3.5)
  - Post-processing gamma correction
  - Valores más altos = más oscuro
  - Valores más bajos = más brillante

### Propiedades de Forma Básicas

- **baseRadius** (number, default: 0.18)
  - Tamaño base de cada metaball
  - Valores más altos = esferas más grandes

- **trailLength** (number, default: 20)
  - Cantidad de metaballs en el trail
  - Valores más altos = trail más largo y efecto más denso
  - **IMPORTANTE**: Afecta el rendimiento

- **smoothness** (number, default: 6.5)
  - Factor de suavidad de fusión entre metaballs (parámetro k)
  - Valores más altos = fusión más suave
  - Valores más bajos = bordes más definidos

- **deformation** (number, default: 0.12)
  - Cantidad de deformación orgánica de la superficie
  - Valores más altos = más ondulación

### Propiedades de Forma Avanzadas

- **sizeVariationAmplitude** (number, default: 0.3)
  - Amplitud de la variación de tamaño entre metaballs
  - Valores más altos = mayor diferencia de tamaño entre esferas
  - Rango recomendado: 0.1 - 0.5

- **sizeVariationFrequency** (number, default: 0.5)
  - Frecuencia de la variación de tamaño
  - Valores más altos = cambios de tamaño más rápidos
  - Rango recomendado: 0.1 - 1.0

- **sizeVariationBase** (number, default: 0.85)
  - Tamaño base antes de aplicar variación
  - 1.0 = tamaño completo, 0.5 = mitad de tamaño
  - Rango recomendado: 0.5 - 1.0

- **organicOffsetAmplitude** (number, default: 0.2)
  - Amplitud del movimiento orgánico lateral
  - Valores más altos = movimiento más pronunciado
  - Rango recomendado: 0.1 - 0.5

- **organicOffsetFrequencyX** (number, default: 0.8)
  - Frecuencia del movimiento orgánico horizontal
  - Valores más altos = oscilación horizontal más rápida
  - Rango recomendado: 0.3 - 1.5

- **organicOffsetFrequencyY** (number, default: 0.6)
  - Frecuencia del movimiento orgánico vertical
  - Valores más altos = oscilación vertical más rápida
  - Rango recomendado: 0.3 - 1.5

- **surfaceNoiseScale** (number, default: 2.5)
  - Escala del ruido de superficie (detalles pequeños)
  - Valores más altos = detalles más finos
  - Valores más bajos = ondas más suaves
  - Rango recomendado: 1.0 - 5.0

- **trailDecay** (number, default: 0.8)
  - Factor de decaimiento del tamaño a lo largo del trail
  - 1.0 = sin decaimiento, 0.5 = decae a la mitad
  - Valores más bajos = trail más cónico
  - Rango recomendado: 0.5 - 1.0

- **mouseAttractionStrength** (number, default: 0.1)
  - Fuerza de atracción hacia el mouse
  - Valores más altos = mayor atracción
  - 0 = sin atracción
  - Rango recomendado: 0.0 - 0.3

### Propiedades de Movimiento

- **mouseInfluence** (number, default: 0.4)
  - Rango: 0-1
  - Influencia del mouse sobre el tamaño de las metaballs
  - 0 = sin influencia, 1 = máxima influencia

- **scrollSpeed** (number, default: 1.2)
  - Velocidad de respuesta al scroll
  - Valores más altos = movimiento más rápido al scrollear

- **animationSpeed** (number, default: 1.0)
  - Velocidad de animación temporal general
  - 0.5 = mitad de velocidad, 2.0 = doble velocidad

## Ejemplos de Configuración

### Fluido más orgánico y ondulante
```astro
<FluidCanvas 
  sizeVariationAmplitude={0.5}
  organicOffsetAmplitude={0.4}
  organicOffsetFrequencyX={1.2}
  organicOffsetFrequencyY={1.0}
  deformation={0.2}
/>
```

### Fluido más uniforme y estable
```astro
<FluidCanvas 
  sizeVariationAmplitude={0.1}
  sizeVariationBase={0.95}
  organicOffsetAmplitude={0.1}
  surfaceNoiseScale={1.5}
/>
```

### Trail más largo y fino
```astro
<FluidCanvas 
  trailLength={30}
  trailDecay={0.6}
  baseRadius={0.15}
/>
```

### Mayor interactividad con el mouse
```astro
<FluidCanvas 
  mouseInfluence={0.6}
  mouseAttractionStrength={0.2}
  scrollSpeed={1.5}
/>
```

### Superficie más detallada
```astro
<FluidCanvas 
  surfaceNoiseScale={4.0}
  deformation={0.18}
  smoothness={8.0}
/>
```

### Movimiento más rápido y caótico
```astro
<FluidCanvas 
  organicOffsetFrequencyX={1.5}
  organicOffsetFrequencyY={1.2}
  sizeVariationFrequency={1.0}
  animationSpeed={1.5}
/>
```

## Notas Técnicas

- El componente renderiza un canvas fullscreen con `position: fixed`
- El canvas tiene `pointer-events: none` para no interferir con la interacción
- El render usa Three.js con RawShaderMaterial
- El shader usa ray marching con 48 iteraciones
- El pixelRatio está limitado a 1.5 para optimizar rendimiento
- La posición inicial del fluido está a la derecha (x: 0.6)

## Optimización

Para mejor rendimiento:
- Mantener `trailLength` entre 15-25
- No exceder `gamma` de 5.0
- Mantener `smoothness` entre 5.0-8.0
- El componente ya limita pixelRatio a 1.5

## Troubleshooting

Si el fluido no es visible:
1. Verificar que los valores de `colorMin` y `colorMax` sean > 0
2. Reducir el valor de `gamma` (valores muy altos oscurecen mucho)
3. Aumentar `intensity`

Si el rendimiento es bajo:
1. Reducir `trailLength`
2. Aumentar `gamma` levemente
3. Verificar que no haya múltiples instancias del componente

Si el fluido se ve demasiado fragmentado:
1. Aumentar `smoothness` (7.0-8.0)
2. Reducir `sizeVariationAmplitude`
3. Aumentar `sizeVariationBase`

Si el movimiento es demasiado errático:
1. Reducir `organicOffsetAmplitude`
2. Reducir frecuencias (`organicOffsetFrequencyX/Y`)
3. Reducir `animationSpeed`
