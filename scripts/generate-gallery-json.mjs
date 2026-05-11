/**
 * generate-gallery-json.mjs
 * Escanea las carpetas COMERCIAL, EDITORIAL y NOVIAS y genera
 * src/data/gallery.json con la estructura de grupos por marca/revista.
 *
 * Uso:  node scripts/generate-gallery-json.mjs
 */

import { readdir, writeFile } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMG_ROOT   = join(__dirname, '../apps/astro-app/src/assets/img');

const SECTIONS = {
    comercial: 'COMERCIAL',
    editorial: 'EDITORIAL',
    novias:    'NOVIAS',
};

async function walkSection(sectionDir) {
    const map = new Map();

    async function walk(dir, brand) {
        const entries = await readdir(dir, { withFileTypes: true });
        for (const e of entries) {
            const full = join(dir, e.name);
            if (e.isDirectory()) {
                // El primer nivel define la marca; los subdirectorios siguen con la misma
                await walk(full, brand ?? e.name);
            } else if (extname(e.name).toLowerCase() === '.webp') {
                if (!brand) continue;
                // Ruta relativa respecto al directorio de sección (sin slash inicial)
                const rel = full.slice(sectionDir.length + 1);
                if (!map.has(brand)) map.set(brand, []);
                map.get(brand).push(rel);
            }
        }
    }

    await walk(sectionDir, null);

    return Array.from(map.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([brand, images]) => ({ brand, images: images.sort() }));
}

const result = {};
for (const [key, folder] of Object.entries(SECTIONS)) {
    result[key] = await walkSection(join(IMG_ROOT, folder));
}

const outPath = join(__dirname, '../apps/astro-app/src/data/gallery.json');
await writeFile(outPath, JSON.stringify(result, null, 2), 'utf-8');

const total = Object.values(result).reduce((n, arr) => n + arr.reduce((m, g) => m + g.images.length, 0), 0);
console.log(`✅  gallery.json generado — ${total} imágenes en ${Object.values(result).flat().length} grupos`);
