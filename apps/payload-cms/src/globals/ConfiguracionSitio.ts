import type { GlobalConfig } from 'payload'

export const ConfiguracionSitio: GlobalConfig = {
  slug: 'configuracion-sitio',
  label: 'Configuración del Sitio',
  access: { read: () => true },
  admin: { group: 'Ajustes' },
  fields: [
    // ── Identidad ─────────────────────────────────────────────────
    {
      name: 'identidad',
      label: 'Identidad',
      type: 'group',
      fields: [
        { name: 'nombreSitio', label: 'Nombre del sitio', type: 'text', defaultValue: 'LU.ROMERO' },
        { name: 'descripcionCorta', label: 'Descripción corta (tagline)', type: 'text', defaultValue: 'Make Up & Hair Artist' },
        { name: 'email', label: 'Email principal', type: 'email', defaultValue: 'luromeroestudio@gmail.com' },
        { name: 'ubicacion', label: 'Ubicación', type: 'text', defaultValue: 'Barcelona, España' },
      ],
    },

    // ── Redes sociales ────────────────────────────────────────────
    {
      name: 'redes',
      label: 'Redes Sociales',
      type: 'group',
      fields: [
        { name: 'instagram',       label: 'URL Instagram',         type: 'text', defaultValue: 'https://www.instagram.com/luromeromakeup/' },
        { name: 'instagramHandle', label: 'Handle Instagram',      type: 'text', defaultValue: '@luromeromakeup' },
        { name: 'facebook',        label: 'URL Facebook',          type: 'text', defaultValue: 'https://www.facebook.com/people/Luciana-Romero-Make-Up-Artist/100063943687534/' },
        { name: 'facebookHandle',  label: 'Nombre Facebook',       type: 'text', defaultValue: 'Luciana Romero MUA' },
        { name: 'linkedin',        label: 'URL LinkedIn',          type: 'text', defaultValue: 'https://www.linkedin.com/in/lucianaromeromakeup/' },
        { name: 'linkedinHandle',  label: 'Handle LinkedIn',       type: 'text', defaultValue: 'lucianaromeromakeup' },
        { name: 'youtube',         label: 'URL YouTube',           type: 'text', defaultValue: 'https://www.youtube.com/@lucianaromero9645' },
        { name: 'youtubeHandle',   label: 'Handle YouTube',        type: 'text', defaultValue: '@lucianaromero9645' },
        { name: 'tiktok',          label: 'URL TikTok',            type: 'text' },
        { name: 'pinterest',       label: 'URL Pinterest',         type: 'text' },
      ],
    },

    // ── Marcas ────────────────────────────────────────────────────
    {
      name: 'marcas',
      label: 'Marcas (sección Clientes)',
      type: 'array',
      admin: { description: 'Logos que aparecen en la sección de clientes.' },
      fields: [
        { name: 'nombre', label: 'Nombre', type: 'text', required: true },
        { name: 'logo', label: 'Logo (SVG)', type: 'upload', relationTo: 'media' },
        { name: 'url', label: 'URL de la marca', type: 'text' },
      ],
    },

    // ── Revistas ──────────────────────────────────────────────────
    {
      name: 'revistas',
      label: 'Revistas (sección Magazines)',
      type: 'array',
      admin: { description: 'Logos de revistas que aparecen en la sección de prensa.' },
      fields: [
        { name: 'nombre', label: 'Nombre', type: 'text', required: true },
        { name: 'logo', label: 'Logo (SVG)', type: 'upload', relationTo: 'media' },
        { name: 'url', label: 'URL de la revista', type: 'text' },
      ],
    },

    // ── Footer ────────────────────────────────────────────────────
    {
      name: 'footer',
      label: 'Footer',
      type: 'group',
      fields: [
        { name: 'copyright', label: 'Texto de copyright', type: 'text', defaultValue: '© LU.ROMERO' },
        { name: 'tagline', label: 'Tagline del footer', type: 'text', defaultValue: 'Make Up & Hair Artist' },
      ],
    },
  ],
}
