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
        { name: 'instagram', label: 'URL Instagram', type: 'text', defaultValue: 'https://www.instagram.com/luromeromakeup/' },
        { name: 'tiktok', label: 'URL TikTok', type: 'text' },
        { name: 'youtube', label: 'URL YouTube', type: 'text' },
        { name: 'pinterest', label: 'URL Pinterest', type: 'text' },
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

    // ── Videos ───────────────────────────────────────────────────
    {
      name: 'videos',
      label: 'Vídeos (VideoPlayer)',
      type: 'array',
      fields: [
        { name: 'titulo', label: 'Título', type: 'text', required: true },
        {
          name: 'categoria',
          label: 'Categoría',
          type: 'select',
          options: [
            { label: 'Comercial', value: 'COMERCIAL' },
            { label: 'Editorial', value: 'EDITORIAL' },
          ],
        },
        { name: 'cliente', label: 'Cliente', type: 'text' },
        {
          name: 'archivo',
          label: 'Archivo de vídeo',
          type: 'upload',
          relationTo: 'media',
        },
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
