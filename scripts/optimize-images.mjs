/**
 * optimize-images.mjs
 * Convierte todas las imágenes de COMERCIAL, EDITORIAL y NOVIAS a WebP
 * con un máximo de 1920px de ancho, respetando el aspect ratio.
 * Elimina el original después de convertir.
 *
 * Uso:  node scripts/optimize-images.mjs
 *       node scripts/optimize-images.mjs --dry-run   (sin cambios)
 */

import sharp from 'sharp';
import { readdir, unlink, stat } from 'node:fs/promises';
import { join, extname, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const ROOTS = [
    join(__dirname, '../apps/astro-app/src/assets/img/COMERCIAL'),
    join(__dirname, '../apps/astro-app/src/assets/img/EDITORIAL'),
    join(__dirname, '../apps/astro-app/src/assets/img/NOVIAS'),
];

const CONVERTIBLE = new Set(['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.heic', '.avif', '.bmp', '.gif']);
const MAX_WIDTH    = 1920;
const DRY_RUN      = process.argv.includes('--dry-run');

if (DRY_RUN) console.log('⚠️  DRY RUN — no se hará ningún cambio\n');

// ── Recorre carpetas recursivamente ──────────────────────────────────────────
async function collectFiles(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const files   = [];
    for (const e of entries) {
        const full = join(dir, e.name);
        if (e.isDirectory()) {
            files.push(...await collectFiles(full));
        } else if (e.isFile()) {
            const ext = extname(e.name).toLowerCase();
            if (CONVERTIBLE.has(ext)) files.push(full);
        }
    }
    return files;
}

// ── Formatea bytes legibles ───────────────────────────────────────────────────
function fmt(bytes) {
    if (bytes < 1024)       return `${bytes} B`;
    if (bytes < 1024 ** 2)  return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

// ── Procesa un fichero ────────────────────────────────────────────────────────
async function processFile(src) {
    const dir      = dirname(src);
    const stem     = basename(src, extname(src));
    const dest     = join(dir, `${stem}.webp`);

    // Si ya existe un .webp con el mismo nombre base, sólo borramos el original
    // para no recomprimir algo que ya está optimizado.
    let already = false;
    try { await stat(dest); already = true; } catch {}

    const sizeBefore = (await stat(src)).size;

    if (already && dest !== src) {
        console.log(`  ⏭  ${basename(src)} → ya existe ${basename(dest)}, eliminando original`);
        if (!DRY_RUN) await unlink(src);
        return { skipped: true, saved: 0 };
    }

    if (!DRY_RUN) {
        const img = sharp(src);
        const meta = await img.metadata();

        // Redimensionar sólo si supera el ancho máximo
        if ((meta.width ?? 0) > MAX_WIDTH) {
            img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
        }

        await img
            .webp({ quality: 82, effort: 4 })
            .toFile(dest);

        const sizeAfter = (await stat(dest)).size;
        const saved     = sizeBefore - sizeAfter;

        // Eliminar original sólo si es distinto al destino
        if (src !== dest) await unlink(src);

        console.log(
            `  ✅  ${basename(src).padEnd(40)} → ${basename(dest)}  ` +
            `${fmt(sizeBefore)} → ${fmt(sizeAfter)}  (${saved >= 0 ? '-' : '+'}${fmt(Math.abs(saved))})`
        );
        return { skipped: false, saved };
    } else {
        console.log(`  📦  ${basename(src)} → ${basename(dest)}  (${fmt(sizeBefore)})`);
        return { skipped: false, saved: 0 };
    }
}

// ── Main ──────────────────────────────────────────────────────────────────────
let totalFiles = 0;
let totalSaved = 0;

for (const root of ROOTS) {
    const label = root.split('/').slice(-1)[0];
    console.log(`\n📂 ${label}`);

    const files = await collectFiles(root);
    if (files.length === 0) {
        console.log('   (sin imágenes convertibles)');
        continue;
    }

    for (const file of files) {
        const { skipped, saved } = await processFile(file);
        if (!skipped) { totalFiles++; totalSaved += saved; }
    }
}

console.log('\n─────────────────────────────────────────────');
if (DRY_RUN) {
    console.log(`🔍 Encontradas ${totalFiles} imágenes a convertir (dry-run, sin cambios)`);
} else {
    console.log(`✨ ${totalFiles} imágenes convertidas · ${fmt(totalSaved)} ahorrados`);
}
