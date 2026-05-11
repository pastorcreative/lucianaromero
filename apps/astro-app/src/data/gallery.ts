import type { ImageMetadata } from 'astro';
import rawGallery from './gallery.json';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface GalleryImage {
    meta: ImageMetadata;
    label: string;
    alt: string;
}

export interface GalleryGroup {
    label: string;
    images: GalleryImage[];
}

// ── Globs — Vite resuelve estas rutas en build time ───────────────────────────

const comercialGlob = import.meta.glob<{ default: ImageMetadata }>(
    '../assets/img/COMERCIAL/**/*.webp',
    { eager: true }
);

const editorialGlob = import.meta.glob<{ default: ImageMetadata }>(
    '../assets/img/EDITORIAL/**/*.webp',
    { eager: true }
);

const noviasGlob = import.meta.glob<{ default: ImageMetadata }>(
    '../assets/img/NOVIAS/**/*.webp',
    { eager: true }
);

// ── Resolver ──────────────────────────────────────────────────────────────────

type Section = 'COMERCIAL' | 'EDITORIAL' | 'NOVIAS';

const GLOBS: Record<Section, Record<string, { default: ImageMetadata }>> = {
    COMERCIAL: comercialGlob,
    EDITORIAL: editorialGlob,
    NOVIAS:    noviasGlob,
};

function buildGroups(
    section: Section,
    raw: Array<{ brand: string; images: string[] }>
): GalleryGroup[] {
    const glob = GLOBS[section];

    return raw.map(({ brand, images }) => {
        const resolved: GalleryImage[] = [];

        for (const relPath of images) {
            // Key as stored by Vite: ../assets/img/COMERCIAL/BYLIA/IMG.webp
            const key = `../assets/img/${section}/${relPath}`;
            const mod = glob[key];
            if (!mod) continue;

            const filename = relPath.split('/').pop()?.replace(/\.webp$/i, '') ?? relPath;
            resolved.push({
                meta:  mod.default,
                label: brand,
                alt:   `${brand} — ${filename}`,
            });
        }

        return { label: brand, images: resolved };
    }).filter(g => g.images.length > 0);
}

// ── Exports ───────────────────────────────────────────────────────────────────

export const comercialGroups: GalleryGroup[] = buildGroups('COMERCIAL', rawGallery.comercial);
export const editorialGroups: GalleryGroup[] = buildGroups('EDITORIAL', rawGallery.editorial);
export const noviasGroups:    GalleryGroup[] = buildGroups('NOVIAS',    rawGallery.novias);

// Flat arrays para páginas que muestran todo mezclado
export const comercialImages: GalleryImage[] = comercialGroups.flatMap(g => g.images);
export const editorialImages: GalleryImage[] = editorialGroups.flatMap(g => g.images);
export const noviasImages:    GalleryImage[] = noviasGroups.flatMap(g => g.images);
