// @ts-nocheck
/**
 * Script de migración hacia PRODUCCIÓN.
 * Usa la REST API de Payload (no el SDK local), por lo que puede apuntar
 * a cualquier instancia remota sin necesidad de acceso directo a la BD.
 *
 * Variables de entorno requeridas (añadir al .env de payload-cms):
 *   PAYLOAD_PROD_URL      URL base de producción (ej. https://lucianaromero-payload-cms.vercel.app)
 *   PAYLOAD_PROD_EMAIL    Email del usuario administrador en producción
 *   PAYLOAD_PROD_PASSWORD Contraseña del usuario administrador en producción
 *
 * Ejecutar desde apps/payload-cms/:
 *   pnpm migrate:prod
 *
 * NOTAS:
 *  - El script es idempotente: omite documentos/imágenes que ya existen.
 *  - La colección legacy "galeria-imagenes" NO se migra (está obsoleta).
 *  - Los vídeos solo migran metadatos; los .mp4 se suben manualmente.
 */

import 'dotenv/config'
import path from 'path'
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

const ASTRO_IMG  = path.resolve(__dirname, '../../astro-app/src/assets/img')
const ASTRO_DATA = path.resolve(__dirname, '../../astro-app/src/data')

const PROD_URL = (process.env.PAYLOAD_PROD_URL ?? 'https://lucianaromero-payload-cms.vercel.app').replace(/\/$/, '')
const EMAIL    = process.env.PAYLOAD_PROD_EMAIL
const PASSWORD = process.env.PAYLOAD_PROD_PASSWORD

// ── Auth ──────────────────────────────────────────────────────────────────────

let authToken: string | null = null

async function login() {
  if (!EMAIL || !PASSWORD) {
    throw new Error(
      'Faltan variables de entorno: PAYLOAD_PROD_EMAIL y PAYLOAD_PROD_PASSWORD son obligatorias.',
    )
  }
  const res = await fetch(`${PROD_URL}/api/users/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Login fallido (${res.status}): ${body}`)
  }
  const data = await res.json()
  authToken = data.token
  console.log('✓ Autenticado en producción')
}

function authHeaders(): Record<string, string> {
  return { Authorization: `JWT ${authToken}` }
}

// ── Helpers REST ──────────────────────────────────────────────────────────────

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${PROD_URL}/api/${endpoint}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers ?? {}) },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API error ${res.status} en /${endpoint}: ${body}`)
  }
  return res.json()
}

async function apiFind(collection: string, params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString()
  return apiFetch(`${collection}?${qs}`)
}

async function apiCreate(collection: string, data: Record<string, unknown>) {
  return apiFetch(collection, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  })
}

async function apiUpdateGlobal(slug: string, data: Record<string, unknown>) {
  return apiFetch(`globals/${slug}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  })
}

async function apiBulkDelete(collection: string) {
  const res = await fetch(
    `${PROD_URL}/api/${collection}?where[id][exists]=true`,
    { method: 'DELETE', headers: authHeaders() },
  )
  if (!res.ok) {
    const body = await res.text()
    console.warn(`    ⚠  No se pudo vaciar ${collection} (${res.status}): ${body}`)
    return
  }
  const data = await res.json()
  console.log(`    ✓ ${collection}: ${data.docs?.length ?? '?'} documentos eliminados`)
}

// ── Limpieza ──────────────────────────────────────────────────────────────────

async function limpiarProduccion() {
  console.log('\n🗑️  Limpiando colecciones en producción...')
  await apiBulkDelete('cursos')
  await apiBulkDelete('galerias')
  await apiBulkDelete('galeria-imagenes')
  await apiBulkDelete('media')
  imageCache.clear()
  console.log('  ✓ Limpieza completada\n')
}



const imageCache = new Map<string, number | string>()

function getMimetype(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  const map: Record<string, string> = {
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png':  'image/png',
    '.svg':  'image/svg+xml',
  }
  return map[ext] ?? 'application/octet-stream'
}

async function uploadImage(
  folder: string,
  filename: string,
  alt: string,
): Promise<number | string | null> {
  const cacheKey = `${folder}/${filename}`
  if (imageCache.has(cacheKey)) {
    console.log(`    ↩  (cache) ${filename}`)
    return imageCache.get(cacheKey)!
  }

  const basename = path.basename(filename)

  // Idempotencia: busca si ya existe por nombre de archivo
  const existing = await apiFind('media', {
    'where[filename][equals]': basename,
    'limit': '1',
  })
  if (existing.totalDocs > 0) {
    const id = existing.docs[0].id
    imageCache.set(cacheKey, id)
    console.log(`    ↩  (ya existe) ${basename}  (id: ${id})`)
    return id
  }

  const filePath = path.join(ASTRO_IMG, folder, filename)
  if (!existsSync(filePath)) {
    console.warn(`    ⚠  No encontrada: ${filePath}`)
    return null
  }

  const buffer  = readFileSync(filePath)
  const blob    = new Blob([buffer], { type: getMimetype(basename) })
  const form    = new FormData()
  form.append('file', blob, basename)
  // Payload REST API requiere los campos extra como JSON en '_payload'
  form.append('_payload', JSON.stringify({ alt }))

  // No incluir Content-Type en los headers: fetch lo pone con el boundary correcto
  const res = await fetch(`${PROD_URL}/api/media`, {
    method:  'POST',
    headers: authHeaders(),
    body:    form,
  })
  if (!res.ok) {
    const body = await res.text()
    console.warn(`    ⚠  Error subiendo ${basename} (${res.status}): ${body}`)
    return null
  }
  const data = await res.json()
  const id   = data.doc?.id ?? data.id
  imageCache.set(cacheKey, id)
  console.log(`    ✓ Subida: ${filename}  (id: ${id})`)
  return id
}

// ── Migración de Cursos ───────────────────────────────────────────────────────

async function migrarCursos() {
  console.log('\n📚 Migrando cursos...')
  const raw = JSON.parse(readFileSync(path.join(ASTRO_DATA, 'cursos.json'), 'utf-8')) as Record<string, any>

  for (const curso of Object.values(raw)) {
    console.log(`\n  → ${curso.heroTitle}`)

    const existe = await apiFind('cursos', { 'where[slug][equals]': curso.slug, 'limit': '1' })
    if (existe.totalDocs > 0) {
      console.log(`    ⏭  Ya existe, omitiendo.`)
      continue
    }

    const mainImageId      = await uploadImage('academia',               curso.intro.mainImage,      curso.intro.mainImageAlt)
    const secondaryImageId = await uploadImage('academia',               curso.intro.secondaryImage, curso.intro.secondaryImageAlt)
    const directorPhotoId  = await uploadImage(curso.director.photoFolder, curso.director.photo,      'Luciana Romero')

    const academyPhotos: { photo: number | string | null; alt: string }[] = []
    for (const p of curso.academy.photos) {
      const id = await uploadImage('academia', p.file, p.alt)
      academyPhotos.push({ photo: id, alt: p.alt })
    }

    await apiCreate('cursos', {
      slug:         curso.slug,
      pageTitle:    curso.pageTitle,
      heroTitle:    curso.heroTitle,
      heroSubtitle: curso.heroSubtitle,

      intro: {
        tag:                 curso.intro.tag,
        headingLines:        curso.intro.headingLines.map((t: string) => ({ texto: t })),
        lead:                curso.intro.lead,
        paragraphs:          curso.intro.paragraphs.map((t: string) => ({ texto: t })),
        chips:               curso.intro.chips.map((t: string) => ({ texto: t })),
        mainImage:           mainImageId,
        mainImageAlt:        curso.intro.mainImageAlt,
        mainImageLabel:      curso.intro.mainImageLabel,
        secondaryImage:      secondaryImageId,
        secondaryImageAlt:   curso.intro.secondaryImageAlt,
        secondaryImageLabel: curso.intro.secondaryImageLabel,
      },

      learning: {
        sectionTitle: curso.learning.sectionTitle,
        sectionLabel: curso.learning.sectionLabel,
        items:        curso.learning.items,
      },

      director: {
        photo:        directorPhotoId,
        photoLabel:   curso.director.photoLabel,
        photoYears:   curso.director.photoYears,
        sectionLabel: curso.director.sectionLabel,
        nameLines:    curso.director.nameLines.map((t: string) => ({ texto: t })),
        quote:        curso.director.quote,
        body:         curso.director.body,
        stats:        curso.director.stats,
      },

      academy: {
        sectionTitle:  curso.academy.sectionTitle,
        sectionLabel:  curso.academy.sectionLabel,
        name:          curso.academy.name,
        address:       curso.academy.address,
        addressStrong: curso.academy.addressStrong,
        mapUrl:        curso.academy.mapUrl,
        modalities:    curso.academy.modalities.map((t: string) => ({ texto: t })),
        photos:        academyPhotos,
      },

      cta: {
        sectionLabel:  curso.cta.sectionLabel,
        headingLines:  curso.cta.headingLines.map((t: string) => ({ texto: t })),
        body:          curso.cta.body,
        instagramUrl:  curso.cta.instagramUrl,
        email:         curso.cta.email,
        emailSubject:  curso.cta.emailSubject,
        includesLabel: curso.cta.includesLabel,
        includes:      curso.cta.includes.map((t: string) => ({ texto: t })),
      },
    })

    console.log(`    ✓ Curso creado: ${curso.heroTitle}`)
  }
}

// ── Migración de Configuración del Sitio ─────────────────────────────────────

async function migrarConfiguracion() {
  console.log('\n⚙️  Migrando configuración del sitio...')

  console.log('\n  Marcas:')
  const brandsRaw = JSON.parse(readFileSync(path.join(ASTRO_DATA, 'brands.json'), 'utf-8')) as any[]
  const marcas: any[] = []
  for (const brand of brandsRaw) {
    const logoId = await uploadImage('brands', brand.logo, brand.name)
    marcas.push({ nombre: brand.name, logo: logoId, url: brand.url })
  }

  console.log('\n  Revistas:')
  const magazinesRaw = JSON.parse(readFileSync(path.join(ASTRO_DATA, 'magazines.json'), 'utf-8')) as any[]
  const revistas: any[] = []
  for (const mag of magazinesRaw) {
    const logoId = await uploadImage('magazines', mag.logo, mag.name)
    revistas.push({ nombre: mag.name, logo: logoId, url: mag.url })
  }

  const videosRaw = JSON.parse(readFileSync(path.join(ASTRO_DATA, 'videos.json'), 'utf-8')) as any[]
  const videos = videosRaw.map((v) => ({
    titulo:    v.title,
    categoria: v.category,
    cliente:   v.client ?? '',
  }))

  await apiUpdateGlobal('configuracion-sitio', {
    identidad: {
      nombreSitio:      'LU.ROMERO',
      descripcionCorta: 'Make Up & Hair Artist',
      email:            'luromeroestudio@gmail.com',
      ubicacion:        'Barcelona, España',
    },
    redes: {
      instagram: 'https://www.instagram.com/luromeromakeup/',
    },
    marcas,
    revistas,
    videos,
    footer: {
      copyright: '© LU.ROMERO',
      tagline:   'Make Up & Hair Artist',
    },
  })

  console.log('\n  ✓ Configuración del sitio actualizada')
}

// ── Migración de Página Bio ───────────────────────────────────────────────────

async function migrarBio() {
  console.log('\n👤 Migrando página Bio...')

  const fotoId = await uploadImage('bento', 'lu-romero-bio.avif', 'Luciana Romero')

  await apiUpdateGlobal('pagina-bio', {
    hero: {
      titulo:    'BIO',
      subtitulo: '— Make Up & Hair Artist · Barcelona',
    },
    foto: fotoId,
    parrafos: [
      { texto: 'Luciana Romero nació en Argentina. Estuvo durante su infancia y adolescencia formando parte de talleres de dibujo y pintura donde fue creando su pequeño universo de texturas, detalles, formas, líneas y colores.' },
      { texto: 'El maquillaje y el peinado llegan a su vida por casualidad y logran atraparla por completo. Desde aquel momento y con 16 años de carrera que le anteceden, logró el perfecto engranaje de dos piezas fundamentales, la pasión y el trabajo.' },
      { texto: 'Luciana se destaca por su intervención artística en las más importantes revistas de moda, publicidades, desfiles, campañas gráficas, novias y eventos sociales.' },
      { texto: 'Creativa, innovadora, detallista, apasionada y talentosa, Luciana Romero se convirtió rápidamente en una referente del maquillaje y el peinado.' },
      { texto: 'Actualmente reside en Barcelona, España, desde donde expande su arte al mundo entero.' },
    ],
    seo: { titulo: 'Bio — LU.ROMERO' },
  })

  console.log('  ✓ Página Bio actualizada')
}

// ── Migración de Galerías ─────────────────────────────────────────────────────

async function migrarGalerias() {
  console.log('\n🖼️  Migrando galerías...')

  const galleryRaw = JSON.parse(
    readFileSync(path.join(ASTRO_DATA, 'gallery.json'), 'utf-8'),
  ) as Record<string, Array<{ brand: string; images: string[] }>>

  const GALERIAS = [
    {
      slug:      'editorial',
      titulo:    'GALLERY',
      subtitulo: '— Editorial & Moda',
      seoTitle:  'Gallery — LU.ROMERO',
      key:       'editorial',
      folder:    'EDITORIAL',
    },
    {
      slug:      'comercial',
      titulo:    'COMERCIAL',
      subtitulo: '— Publicidad & Marcas',
      seoTitle:  'Comercial — LU.ROMERO',
      key:       'comercial',
      folder:    'COMERCIAL',
    },
    {
      slug:      'novias',
      titulo:    'NOVIAS',
      subtitulo: '— Maquillaje & Peinado para el día más especial',
      seoTitle:  'Novias — LU.ROMERO',
      key:       'novias',
      folder:    'NOVIAS',
    },
  ]

  for (const galeria of GALERIAS) {
    const existe = await apiFind('galerias', { 'where[slug][equals]': galeria.slug, 'limit': '1' })
    if (existe.totalDocs > 0) {
      console.log(`  ⏭  ${galeria.slug} ya existe, omitiendo.`)
      continue
    }

    console.log(`\n  → ${galeria.slug}`)
    const groups = galleryRaw[galeria.key] ?? []
    const imagenes: Array<{ imagen: number | string; alt: string; grupo: string }> = []

    for (const { brand, images } of groups) {
      console.log(`    → ${brand} (${images.length} imágenes)`)
      for (const imgPath of images) {
        const mediaId = await uploadImage(galeria.folder, imgPath, brand)
        if (mediaId) {
          imagenes.push({ imagen: mediaId, alt: brand, grupo: brand })
        }
      }
    }

    await apiCreate('galerias', {
      slug:      galeria.slug,
      titulo:    galeria.titulo,
      subtitulo: galeria.subtitulo,
      seoTitle:  galeria.seoTitle,
      imagenes,
    })

    console.log(`  ✓ Galería '${galeria.slug}' creada con ${imagenes.length} imágenes`)
  }

  console.log('\n  ✓ Galerías migradas')
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const reset = process.argv.includes('--reset')

  console.log(`🚀 Iniciando migración hacia PRODUCCIÓN${reset ? ' (con reset)' : ''}`)
  console.log(`   URL: ${PROD_URL}\n`)

  await login()

  if (reset) {
    await limpiarProduccion()
  }

  await migrarCursos()
  await migrarConfiguracion()
  await migrarBio()
  await migrarGalerias()

  console.log('\n✅ Migración a producción completada con éxito.')
  process.exit(0)
}

main().catch((err) => {
  console.error('\n❌ Error durante la migración a producción:', err)
  process.exit(1)
})
