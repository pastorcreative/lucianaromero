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
export interface VideoItem   { titulo: string; categoria: string; cliente: string; archivoUrl: string }
export interface RedSocialItem {
  nombre: string
  handle: string
  icon:   string
  url:    string
}

export interface ConfiguracionData {
  marcas:   MarcaItem[]
  revistas: RevistaItem[]
  identidad: { nombreSitio: string; descripcionCorta: string; email: string; ubicacion: string }
  redes:    RedSocialItem[]
  footer:   { copyright: string; tagline: string }
}

/** Devuelve marcas, revistas, identidad, redes y footer desde el global de configuración. */
export async function fetchConfiguracion(): Promise<ConfiguracionData> {
  const raw = await get<Record<string, any>>('globals/configuracion-sitio?depth=1')

  const r = raw?.redes ?? {}
  const redes: RedSocialItem[] = []
  if (r.instagram) redes.push({ nombre: 'Instagram', handle: r.instagramHandle ?? r.instagram, icon: 'lucide:instagram', url: r.instagram })
  if (r.facebook)  redes.push({ nombre: 'Facebook',  handle: r.facebookHandle  ?? r.facebook,  icon: 'lucide:facebook',  url: r.facebook  })
  if (r.linkedin)  redes.push({ nombre: 'LinkedIn',  handle: r.linkedinHandle  ?? r.linkedin,  icon: 'lucide:linkedin',  url: r.linkedin  })
  if (r.youtube)   redes.push({ nombre: 'YouTube',   handle: r.youtubeHandle   ?? r.youtube,   icon: 'lucide:youtube',   url: r.youtube   })
  if (r.tiktok)    redes.push({ nombre: 'TikTok',    handle: r.tiktok,                          icon: 'lucide:music',     url: r.tiktok    })

  const email = raw?.identidad?.email ?? 'luromeroestudio@gmail.com'
  if (email) redes.push({ nombre: 'Email', handle: email, icon: 'lucide:mail', url: `mailto:${email}` })

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
    identidad: {
      nombreSitio:      raw?.identidad?.nombreSitio      ?? 'LU.ROMERO',
      descripcionCorta: raw?.identidad?.descripcionCorta ?? 'Make Up & Hair Artist',
      email,
      ubicacion:        raw?.identidad?.ubicacion        ?? 'Barcelona, España',
    },
    redes,
    footer: {
      copyright: raw?.footer?.copyright ?? '© LU.ROMERO',
      tagline:   raw?.footer?.tagline   ?? 'Make Up & Hair Artist',
    },
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// PÁGINA BIO
// ══════════════════════════════════════════════════════════════════════════════

export interface BioData {
  hero:             { titulo: string; subtitulo: string }
  fotoMeta:         ImgProps
  parrafos:         string[]
  lineasDestacadas: string[]
  resumen:          string
  seo:              { titulo: string; descripcion: string }
}

/** Devuelve el contenido de la página Bio desde Payload. */
export async function fetchBio(): Promise<BioData> {
  const raw = await get<Record<string, any>>('globals/pagina-bio?depth=1')
  return {
    hero: {
      titulo:    raw?.hero?.titulo    ?? 'BIO',
      subtitulo: raw?.hero?.subtitulo ?? '',
    },
    fotoMeta:         toImg(raw?.foto),
    parrafos:         texts(raw?.parrafos),
    lineasDestacadas: texts(raw?.lineasDestacadas),
    resumen:          raw?.resumen ?? '',
    seo: {
      titulo:      raw?.seo?.titulo      ?? 'Bio — LU.ROMERO',
      descripcion: raw?.seo?.descripcion ?? '',
    },
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// PÁGINA INICIO
// ══════════════════════════════════════════════════════════════════════════════

export interface PaginaInicioData {
  hero:    { subtitulo: string }
  bento:   {
    etiquetaGaleria:   string; descGaleria:   string
    etiquetaComercial: string; descComercial: string
    etiquetaNovias:    string; descNovias:    string
    etiquetaCursos:    string; descCursos:    string
  }
  videos:  VideoItem[]
  seo:     { titulo: string; descripcion: string }
}

/** Devuelve el contenido de la página de inicio desde Payload. */
export async function fetchPaginaInicio(): Promise<PaginaInicioData> {
  const raw = await get<Record<string, any>>('globals/pagina-inicio?depth=1')
  return {
    hero: {
      subtitulo: raw?.hero?.subtitulo ?? 'MAKE UP & HAIR ARTIST BASED IN BCN',
    },
    bento: {
      etiquetaGaleria:   raw?.bento?.etiquetaGaleria   ?? 'GALLERY',
      descGaleria:       raw?.bento?.descGaleria        ?? 'Editoriales & retratos',
      etiquetaComercial: raw?.bento?.etiquetaComercial  ?? 'COMERCIAL',
      descComercial:     raw?.bento?.descComercial      ?? 'Campañas & marcas',
      etiquetaNovias:    raw?.bento?.etiquetaNovias     ?? 'NOVIAS',
      descNovias:        raw?.bento?.descNovias         ?? 'Maquillaje nupcial',
      etiquetaCursos:    raw?.bento?.etiquetaCursos     ?? 'COURSES',
      descCursos:        raw?.bento?.descCursos         ?? 'Formación profesional',
    },
    videos: (raw?.videos ?? []).map((v: Record<string, any>) => ({
      titulo:     v.titulo     ?? '',
      categoria:  v.categoria  ?? '',
      cliente:    v.cliente    ?? '',
      archivoUrl: v.archivo ? toImg(v.archivo).src : '',
    })),
    seo: {
      titulo:      raw?.seo?.titulo      ?? 'LU.ROMERO — Make Up & Hair Artist',
      descripcion: raw?.seo?.descripcion ?? '',
    },
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// TEXTOS LEGALES
// ══════════════════════════════════════════════════════════════════════════════

export interface LegalSection {
  heading:    string
  paragraphs: string[]
  items:      string[]
}

export interface LegalPageData {
  title:     string
  slug:      string
  updatedAt: string
  sections:  LegalSection[]
}

export interface LegalData {
  avisoLegal: LegalPageData
  privacidad: LegalPageData
  cookies:    LegalPageData
}

function mapLegalPage(raw: Record<string, any> | undefined, defaults: LegalPageData): LegalPageData {
  if (!raw) return defaults
  return {
    title:     raw.title     ?? defaults.title,
    slug:      raw.slug      ?? defaults.slug,
    updatedAt: raw.updatedAt ?? defaults.updatedAt,
    sections: (raw.sections ?? []).map((s: Record<string, any>) => ({
      heading:    s.heading    ?? '',
      paragraphs: texts(s.paragraphs),
      items:      texts(s.items),
    })),
  }
}

/** Devuelve los textos legales desde Payload. Cae en fallback vacío si no hay datos. */
export async function fetchLegal(): Promise<LegalData> {
  const raw = await get<Record<string, any>>('globals/pagina-legal?depth=0')
  const empty: LegalPageData = { title: '', slug: '', updatedAt: '', sections: [] }
  return {
    avisoLegal: mapLegalPage(raw?.avisoLegal, { ...empty, title: 'Aviso Legal',            slug: 'aviso-legal'           }),
    privacidad: mapLegalPage(raw?.privacidad, { ...empty, title: 'Política de Privacidad', slug: 'politica-de-privacidad' }),
    cookies:    mapLegalPage(raw?.cookies,    { ...empty, title: 'Política de Cookies',    slug: 'politica-de-cookies'   }),
  }
}
