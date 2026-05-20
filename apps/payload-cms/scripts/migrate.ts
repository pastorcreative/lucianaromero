// @ts-nocheck
/**
 * Script de migración: importa contenido de los JSON del sitio Astro a Payload CMS.
 *
 * Ejecutar desde apps/payload-cms/:
 *   pnpm migrate
 *
 * NOTAS:
 *  - Los vídeos solo migran metadatos (título, categoría, cliente).
 *    Los archivos .mp4 deben subirse manualmente desde el panel de administración.
 *  - El script es idempotente en globals (sobreescribe) pero NO en colecciones:
 *    si un curso con el mismo slug ya existe, lo omite.
 */

import 'dotenv/config'
import path from 'path'
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

const ASTRO_IMG  = path.resolve(__dirname, '../../astro-app/src/assets/img')
const ASTRO_DATA = path.resolve(__dirname, '../../astro-app/src/data')

// ── Utilidades ────────────────────────────────────────────────────────────────

/** Caché filename → Media ID para evitar subir la misma imagen dos veces */
const imageCache = new Map<string, number | string>()

function getMimetype(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  const map: Record<string, string> = {
    '.webp':  'image/webp',
    '.avif':  'image/avif',
    '.jpg':   'image/jpeg',
    '.jpeg':  'image/jpeg',
    '.png':   'image/png',
    '.svg':   'image/svg+xml',
  }
  return map[ext] ?? 'application/octet-stream'
}

async function uploadImage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  folder: string,
  filename: string,
  alt: string,
): Promise<number | string | null> {
  const cacheKey = `${folder}/${filename}`
  if (imageCache.has(cacheKey)) {
    console.log(`    ↩  (cache) ${filename}`)
    return imageCache.get(cacheKey)!
  }

  // Idempotencia: busca si el archivo ya fue subido (mismo basename + alt)
  const basename = path.basename(filename)
  const existing = await payload.find({
    collection: 'media',
    where: { and: [{ filename: { equals: basename } }, { alt: { equals: alt } }] },
    limit: 1,
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

  const buffer = readFileSync(filePath)
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data:     buffer,
      mimetype: getMimetype(filename),
      name:     basename,
      size:     buffer.length,
    },
  })

  imageCache.set(cacheKey, doc.id)
  console.log(`    ✓ Subida: ${filename}  (id: ${doc.id})`)
  return doc.id
}

// ── Migración de Cursos ───────────────────────────────────────────────────────

async function migrarCursos(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('\n📚 Migrando cursos...')
  const raw = JSON.parse(readFileSync(path.join(ASTRO_DATA, 'cursos.json'), 'utf-8')) as Record<string, any>

  for (const curso of Object.values(raw)) {
    console.log(`\n  → ${curso.heroTitle}`)

    // Comprobamos si ya existe
    const existe = await payload.find({ collection: 'cursos', where: { slug: { equals: curso.slug } } })
    if (existe.totalDocs > 0) {
      console.log(`    ⏭  Ya existe, omitiendo.`)
      continue
    }

    // Imágenes de intro
    const mainImageId      = await uploadImage(payload, 'academia',               curso.intro.mainImage,      curso.intro.mainImageAlt)
    const secondaryImageId = await uploadImage(payload, 'academia',               curso.intro.secondaryImage, curso.intro.secondaryImageAlt)
    const directorPhotoId  = await uploadImage(payload, curso.director.photoFolder, curso.director.photo,      'Luciana Romero')

    // Fotos del estudio
    const academyPhotos: { photo: number | string | null; alt: string }[] = []
    for (const p of curso.academy.photos) {
      const id = await uploadImage(payload, 'academia', p.file, p.alt)
      academyPhotos.push({ photo: id, alt: p.alt })
    }

    await payload.create({
      collection: 'cursos',
      data: {
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
      },
    })

    console.log(`    ✓ Curso creado: ${curso.heroTitle}`)
  }
}

// ── Migración de Configuración del Sitio ─────────────────────────────────────

async function migrarConfiguracion(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('\n⚙️  Migrando configuración del sitio...')

  // Marcas
  console.log('\n  Marcas:')
  const brandsRaw = JSON.parse(readFileSync(path.join(ASTRO_DATA, 'brands.json'), 'utf-8')) as any[]
  const marcas: any[] = []
  for (const brand of brandsRaw) {
    const logoId = await uploadImage(payload, 'brands', brand.logo, brand.name)
    marcas.push({ nombre: brand.name, logo: logoId, url: brand.url })
  }

  // Revistas
  console.log('\n  Revistas:')
  const magazinesRaw = JSON.parse(readFileSync(path.join(ASTRO_DATA, 'magazines.json'), 'utf-8')) as any[]
  const revistas: any[] = []
  for (const mag of magazinesRaw) {
    const logoId = await uploadImage(payload, 'magazines', mag.logo, mag.name)
    revistas.push({ nombre: mag.name, logo: logoId, url: mag.url })
  }

  // Vídeos (solo metadatos — los .mp4 se suben manualmente)
  const videosRaw = JSON.parse(readFileSync(path.join(ASTRO_DATA, 'videos.json'), 'utf-8')) as any[]
  const videos = videosRaw.map((v) => ({
    titulo:    v.title,
    categoria: v.category,
    cliente:   v.client ?? '',
    // archivo: null  ← subir manualmente desde el admin
  }))

  await payload.updateGlobal({
    slug: 'configuracion-sitio',
    data: {
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
    },
  })

  console.log('\n  ✓ Configuración del sitio actualizada')
}

// ── Migración de Página Bio ───────────────────────────────────────────────────

async function migrarBio(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('\n👤 Migrando página Bio...')

  const fotoId = await uploadImage(payload, 'bento', 'lu-romero-bio.avif', 'Luciana Romero')

  await payload.updateGlobal({
    slug: 'pagina-bio',
    data: {
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
    },
  })

  console.log('  ✓ Página Bio actualizada')
}

// ── Migración de Galería ─────────────────────────────────────────────────────

async function migrarGaleria(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('\n🖼️  Migrando galería de imágenes...')

  const galleryRaw = JSON.parse(readFileSync(path.join(ASTRO_DATA, 'gallery.json'), 'utf-8')) as Record<
    string,
    Array<{ brand: string; images: string[] }>
  >

  const sections: Array<{ key: string; seccion: string; folder: string }> = [
    { key: 'comercial', seccion: 'COMERCIAL', folder: 'COMERCIAL' },
    { key: 'editorial', seccion: 'EDITORIAL', folder: 'EDITORIAL' },
    { key: 'novias',    seccion: 'NOVIAS',    folder: 'NOVIAS'    },
  ]

  for (const { key, seccion, folder } of sections) {
    console.log(`\n  → Sección ${seccion}`)
    const groups = galleryRaw[key] ?? []

    for (const { brand, images } of groups) {
      console.log(`    → ${brand} (${images.length} imágenes)`)

      // Idempotencia: omite si ya hay imágenes de este grupo/sección
      const existe = await payload.find({
        collection: 'galeria-imagenes',
        where: { and: [{ seccion: { equals: seccion } }, { grupo: { equals: brand } }] },
        limit: 1,
      })
      if (existe.totalDocs > 0) {
        console.log(`      ⏭  Ya migrado, omitiendo.`)
        continue
      }

      let orden = 0
      for (const imgPath of images) {
        const mediaId = await uploadImage(payload, folder, imgPath, brand)
        if (!mediaId) continue

        await payload.create({
          collection: 'galeria-imagenes',
          data: {
            imagen: mediaId,
            alt:    brand,
            seccion,
            grupo:  brand,
            orden:  orden++,
          },
        })
      }

      console.log(`      ✓ ${orden} imágenes creadas`)
    }
  }

  console.log('\n  ✓ Galería (colección legacy) migrada')
}

// ── Migración de Galerías (nueva colección ordenada) ─────────────────────────

async function migrarGaleriasNuevas(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('\n🖼️  Migrando galerías (nueva estructura ordenada)...')

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
    // Idempotencia: omite si ya existe el documento
    const existe = await payload.find({
      collection: 'galerias',
      where: { slug: { equals: galeria.slug } },
      limit: 1,
    })
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
        const mediaId = await uploadImage(payload, galeria.folder, imgPath, brand)
        if (mediaId) {
          imagenes.push({ imagen: mediaId, alt: brand, grupo: brand })
        }
      }
    }

    await payload.create({
      collection: 'galerias',
      data: {
        slug:      galeria.slug,
        titulo:    galeria.titulo,
        subtitulo: galeria.subtitulo,
        seoTitle:  galeria.seoTitle,
        imagenes,
      },
    })

    console.log(`  ✓ Galería '${galeria.slug}' creada con ${imagenes.length} imágenes`)
  }

  console.log('\n  ✓ Galerías nuevas migradas')
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Iniciando migración...')
  const payload = await getPayload({ config })

  await migrarCursos(payload)
  await migrarConfiguracion(payload)
  await migrarBio(payload)
  await migrarGaleria(payload)
  await migrarGaleriasNuevas(payload)

  console.log('\n✅ Migración completada con éxito.')
  process.exit(0)
}

main().catch((err) => {
  console.error('\n❌ Error durante la migración:', err)
  process.exit(1)
})
