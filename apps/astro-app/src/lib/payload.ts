/**
 * lib/payload.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * Capa de acceso a datos del CMS Payload. Punto único para todos los tipos y
 * llamadas a la API. Ningún componente ni página debe leer JSON locales para
 * el contenido gestionado desde el CMS.
 *
 * Configura la URL base en apps/astro-app/.env:
 *   PUBLIC_PAYLOAD_URL=http://localhost:3001
 */

// ── Entorno ───────────────────────────────────────────────────────────────────

export const PAYLOAD_URL: string =
  (import.meta.env.PUBLIC_PAYLOAD_URL as string | undefined) ?? 'http://localhost:3001'

// ── Tipo de imagen ────────────────────────────────────────────────────────────

/**
 * Sustituye `ImageMetadata` de Astro para imágenes servidas por Payload.
 * Compatible con <img src={img.src} width={img.width} height={img.height} />.
 */
export interface ImgProps {
  src: string
  width?: number | null
  height?: number | null
}

// ── Tipos Payload (respuesta API) ─────────────────────────────────────────────

type PayloadMedia = {
  url:      string
  width?:   number | null
  height?:  number | null
  alt?:     string
  filename?: string
}

type PayloadTexto = { texto: string }

// ── Helpers internos ──────────────────────────────────────────────────────────

/**
 * Convierte un objeto Media de Payload en ImgProps.
 * Prefija con PAYLOAD_URL si la URL es relativa.
 */
export function toImg(media: PayloadMedia | null | undefined): ImgProps {
  if (!media?.url) return { src: '' }
  const src = media.url.startsWith('http') ? media.url : `${PAYLOAD_URL}${media.url}`
  return { src, width: media.width, height: media.height }
}

/** Extrae un array de strings de un array de {texto} de Payload */
function texts(arr: PayloadTexto[] | undefined): string[] {
  return (arr ?? []).map((t) => t.texto)
}

/** Wrapper de fetch con manejo de errores y warn en build. */
async function get<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/${endpoint}`)
    if (!res.ok) {
      console.warn(`[payload] ${endpoint} → ${res.status} ${res.statusText}`)
      return null
    }
    return res.json() as Promise<T>
  } catch {
    console.warn(`[payload] ${endpoint} → sin conexión (¿Payload en marcha?)`)
    return null
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// CURSOS
// ══════════════════════════════════════════════════════════════════════════════

export interface LearningItem {
  num:   string
  title: string
  body:  string
  tag:   string
}

export interface LearningData {
  sectionTitle: string
  sectionLabel: string
  items:        LearningItem[]
}

export interface DirectorStat {
  value: string
  label: string
}

export interface IntroData {
  tag:                 string
  headingLines:        string[]
  lead:                string
  paragraphs:          string[]
  chips:               string[]
  mainImageMeta:       ImgProps
  mainImageAlt:        string
  mainImageLabel:      string
  secondaryImageMeta:  ImgProps
  secondaryImageAlt:   string
  secondaryImageLabel: string
}

export interface DirectorData {
  photoMeta:    ImgProps
  photoLabel:   string
  photoYears:   string
  sectionLabel: string
  nameLines:    string[]
  quote:        string
  body:         string
  stats:        DirectorStat[]
}

export interface AcademyPhoto {
  meta: ImgProps
  alt:  string
}

export interface AcademyData {
  sectionTitle:  string
  sectionLabel:  string
  name:          string
  address:       string
  addressStrong: string
  mapUrl:        string
  modalities:    string[]
  photos:        AcademyPhoto[]
}

export interface CtaData {
  sectionLabel:  string
  headingLines:  string[]
  body:          string
  instagramUrl:  string
  email:         string
  emailSubject:  string
  includesLabel: string
  includes:      string[]
}

export interface CursoData {
  slug:         string
  pageTitle:    string
  heroTitle:    string
  heroSubtitle: string
  intro:        IntroData
  learning:     LearningData
  director:     DirectorData
  academy:      AcademyData
  cta:          CtaData
}

/** Mapea un documento raw de Payload al shape que usan los componentes. */
function mapCurso(raw: Record<string, any>): CursoData {
  return {
    slug:         raw.slug         ?? '',
    pageTitle:    raw.pageTitle    ?? '',
    heroTitle:    raw.heroTitle    ?? '',
    heroSubtitle: raw.heroSubtitle ?? '',

    intro: {
      tag:                 raw.intro?.tag              ?? '',
      headingLines:        texts(raw.intro?.headingLines),
      lead:                raw.intro?.lead             ?? '',
      paragraphs:          texts(raw.intro?.paragraphs),
      chips:               texts(raw.intro?.chips),
      mainImageMeta:       toImg(raw.intro?.mainImage),
      mainImageAlt:        raw.intro?.mainImageAlt     ?? '',
      mainImageLabel:      raw.intro?.mainImageLabel   ?? '',
      secondaryImageMeta:  toImg(raw.intro?.secondaryImage),
      secondaryImageAlt:   raw.intro?.secondaryImageAlt   ?? '',
      secondaryImageLabel: raw.intro?.secondaryImageLabel ?? '',
    },

    learning: {
      sectionTitle: raw.learning?.sectionTitle ?? '',
      sectionLabel: raw.learning?.sectionLabel ?? '',
      items:        raw.learning?.items        ?? [],
    },

    director: {
      photoMeta:    toImg(raw.director?.photo),
      photoLabel:   raw.director?.photoLabel   ?? '',
      photoYears:   raw.director?.photoYears   ?? '',
      sectionLabel: raw.director?.sectionLabel ?? '',
      nameLines:    texts(raw.director?.nameLines),
      quote:        raw.director?.quote        ?? '',
      body:         raw.director?.body         ?? '',
      stats:        raw.director?.stats        ?? [],
    },

    academy: {
      sectionTitle:  raw.academy?.sectionTitle  ?? '',
      sectionLabel:  raw.academy?.sectionLabel  ?? '',
      name:          raw.academy?.name          ?? '',
      address:       raw.academy?.address       ?? '',
      addressStrong: raw.academy?.addressStrong ?? '',
      mapUrl:        raw.academy?.mapUrl        ?? '',
      modalities:    texts(raw.academy?.modalities),
      photos:        (raw.academy?.photos ?? []).map((p: Record<string, any>) => ({
        meta: toImg(p.photo),
        alt:  p.alt ?? '',
      })),
    },

    cta: {
      sectionLabel:  raw.cta?.sectionLabel  ?? '',
      headingLines:  texts(raw.cta?.headingLines),
      body:          raw.cta?.body          ?? '',
      instagramUrl:  raw.cta?.instagramUrl  ?? '',
      email:         raw.cta?.email         ?? '',
      emailSubject:  raw.cta?.emailSubject  ?? '',
      includesLabel: raw.cta?.includesLabel ?? '',
      includes:      texts(raw.cta?.includes),
    },
  }
}

/** Devuelve todos los cursos ordenados por slug. */
export async function fetchCursos(): Promise<CursoData[]> {
  const data = await get<{ docs: Record<string, any>[] }>(
    'cursos?depth=2&limit=100&sort=slug',
  )
  return (data?.docs ?? []).map(mapCurso)
}

/** Devuelve un curso por su slug, o null si no existe. */
export async function fetchCurso(slug: string): Promise<CursoData | null> {
  const data = await get<{ docs: Record<string, any>[] }>(
    `cursos?where[slug][equals]=${encodeURIComponent(slug)}&depth=2&limit=1`,
  )
  const raw = data?.docs?.[0]
  return raw ? mapCurso(raw) : null
}

// ══════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DEL SITIO  (marcas, revistas, vídeos)
// ══════════════════════════════════════════════════════════════════════════════

export interface MarcaItem   { nombre: string; logoSrc: string; url: string }
export interface RevistaItem { nombre: string; logoSrc: string; url: string }
export interface VideoItem   { titulo: string; categoria: string; cliente: string }

export interface ConfiguracionData {
  marcas:   MarcaItem[]
  revistas: RevistaItem[]
  videos:   VideoItem[]
}

/** Devuelve marcas, revistas y metadatos de vídeos desde el global de configuración. */
export async function fetchConfiguracion(): Promise<ConfiguracionData> {
  const raw = await get<Record<string, any>>('globals/configuracion-sitio?depth=1')
  return {
    marcas: (raw?.marcas ?? []).map((m: Record<string, any>) => ({
      nombre:  m.nombre ?? '',
      logoSrc: toImg(m.logo).src,
      url:     m.url    ?? '',
    })),
    revistas: (raw?.revistas ?? []).map((r: Record<string, any>) => ({
      nombre:  r.nombre ?? '',
      logoSrc: toImg(r.logo).src,
      url:     r.url    ?? '',
    })),
    videos: (raw?.videos ?? []).map((v: Record<string, any>) => ({
      titulo:    v.titulo    ?? '',
      categoria: v.categoria ?? '',
      cliente:   v.cliente   ?? '',
    })),
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// PÁGINA BIO
// ══════════════════════════════════════════════════════════════════════════════

export interface BioData {
  hero:     { titulo: string; subtitulo: string }
  fotoMeta: ImgProps
  parrafos: string[]
}

/** Devuelve el contenido de la página Bio desde Payload. */
export async function fetchBio(): Promise<BioData> {
  const raw = await get<Record<string, any>>('globals/pagina-bio?depth=1')
  return {
    hero: {
      titulo:    raw?.hero?.titulo    ?? 'BIO',
      subtitulo: raw?.hero?.subtitulo ?? '',
    },
    fotoMeta: toImg(raw?.foto),
    parrafos: texts(raw?.parrafos),
  }
}
