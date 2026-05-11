import type { ImageMetadata } from 'astro';
import rawCursos from './cursos.json';

type RawCurso = (typeof rawCursos)[keyof typeof rawCursos];

// ── Public types ───────────────────────────────────────────────────────────────

export interface IntroData {
    tag: string;
    headingLines: string[];
    lead: string;
    paragraphs: string[];
    chips: string[];
    mainImageMeta: ImageMetadata;
    mainImageAlt: string;
    mainImageLabel: string;
    secondaryImageMeta: ImageMetadata;
    secondaryImageAlt: string;
    secondaryImageLabel: string;
}

export interface LearningItem {
    num: string;
    title: string;
    body: string;
    tag: string;
}

export interface LearningData {
    sectionTitle: string;
    sectionLabel: string;
    items: LearningItem[];
}

export interface DirectorStat {
    value: string;
    label: string;
}

export interface DirectorData {
    photoMeta: ImageMetadata;
    photoLabel: string;
    photoYears: string;
    sectionLabel: string;
    nameLines: string[];
    quote: string;
    body: string;
    stats: DirectorStat[];
}

export interface AcademyPhoto {
    meta: ImageMetadata;
    alt: string;
}

export interface AcademyData {
    sectionTitle: string;
    sectionLabel: string;
    name: string;
    address: string;
    addressStrong: string;
    mapUrl: string;
    modalities: string[];
    photos: AcademyPhoto[];
}

export interface CtaData {
    sectionLabel: string;
    headingLines: string[];
    body: string;
    instagramUrl: string;
    email: string;
    emailSubject: string;
    includesLabel: string;
    includes: string[];
}

export interface CursoData {
    slug: string;
    pageTitle: string;
    heroTitle: string;
    heroSubtitle: string;
    intro: IntroData;
    learning: LearningData;
    director: DirectorData;
    academy: AcademyData;
    cta: CtaData;
}

// ── Image resolvers ────────────────────────────────────────────────────────────

const academiaGlob = import.meta.glob<{ default: ImageMetadata }>(
    '../assets/img/academia/*.{webp,avif,jpg,png,jpeg}',
    { eager: true }
);

const bentoGlob = import.meta.glob<{ default: ImageMetadata }>(
    '../assets/img/bento/*.{webp,avif,jpg,png,jpeg}',
    { eager: true }
);

function resolveImage(folder: 'academia' | 'bento', file: string): ImageMetadata {
    const glob = folder === 'academia' ? academiaGlob : bentoGlob;
    const key = `../assets/img/${folder}/${file}`;
    const mod = glob[key];
    if (!mod) throw new Error(`Course image not found: ${key}`);
    return mod.default;
}

// ── Build resolved cursos ──────────────────────────────────────────────────────

function buildCurso(raw: RawCurso): CursoData {
    return {
        slug:         raw.slug,
        pageTitle:    raw.pageTitle,
        heroTitle:    raw.heroTitle,
        heroSubtitle: raw.heroSubtitle,
        intro: {
            tag:                 raw.intro.tag,
            headingLines:        raw.intro.headingLines,
            lead:                raw.intro.lead,
            paragraphs:          raw.intro.paragraphs,
            chips:               raw.intro.chips,
            mainImageMeta:       resolveImage('academia', raw.intro.mainImage),
            mainImageAlt:        raw.intro.mainImageAlt,
            mainImageLabel:      raw.intro.mainImageLabel,
            secondaryImageMeta:  resolveImage('academia', raw.intro.secondaryImage),
            secondaryImageAlt:   raw.intro.secondaryImageAlt,
            secondaryImageLabel: raw.intro.secondaryImageLabel,
        },
        learning: {
            sectionTitle: raw.learning.sectionTitle,
            sectionLabel: raw.learning.sectionLabel,
            items:        raw.learning.items,
        },
        director: {
            photoMeta:    resolveImage(raw.director.photoFolder as 'academia' | 'bento', raw.director.photo),
            photoLabel:   raw.director.photoLabel,
            photoYears:   raw.director.photoYears,
            sectionLabel: raw.director.sectionLabel,
            nameLines:    raw.director.nameLines,
            quote:        raw.director.quote,
            body:         raw.director.body,
            stats:        raw.director.stats,
        },
        academy: {
            sectionTitle:  raw.academy.sectionTitle,
            sectionLabel:  raw.academy.sectionLabel,
            name:          raw.academy.name,
            address:       raw.academy.address,
            addressStrong: raw.academy.addressStrong,
            mapUrl:        raw.academy.mapUrl,
            modalities:    raw.academy.modalities,
            photos:        raw.academy.photos.map(p => ({
                meta: resolveImage('academia', p.file),
                alt:  p.alt,
            })),
        },
        cta: {
            sectionLabel:  raw.cta.sectionLabel,
            headingLines:  raw.cta.headingLines,
            body:          raw.cta.body,
            instagramUrl:  raw.cta.instagramUrl,
            email:         raw.cta.email,
            emailSubject:  raw.cta.emailSubject,
            includesLabel: raw.cta.includesLabel,
            includes:      raw.cta.includes,
        },
    };
}

export const cursos: Record<string, CursoData> = Object.fromEntries(
    Object.entries(rawCursos).map(([slug, raw]) => [slug, buildCurso(raw)])
);
