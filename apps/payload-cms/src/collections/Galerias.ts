import type { CollectionConfig } from 'payload'

export const Galerias: CollectionConfig = {
  slug: 'galerias',
  labels: { singular: 'Galería', plural: 'Galerías' },
  access: { read: () => true },
  admin: {
    group: 'Contenido',
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'slug', 'updatedAt'],
    description:
      'Cada documento representa una sección de galería. Las imágenes se ordenan arrastrando las filas.',
  },
  fields: [
    // ── Identidad ──────────────────────────────────────────────────────────────
    {
      name: 'slug',
      label: 'Slug (URL)',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Segmento de URL: editorial · comercial · novias',
        position: 'sidebar',
      },
    },
    {
      name: 'titulo',
      label: 'Título de la sección',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitulo',
      label: 'Subtítulo',
      type: 'text',
    },
    {
      name: 'seoTitle',
      label: 'Título SEO',
      type: 'text',
      admin: { position: 'sidebar' },
    },

    // ── Imágenes ───────────────────────────────────────────────────────────────
    {
      name: 'imagenes',
      label: 'Imágenes',
      type: 'array',
      admin: {
        description: 'Arrastra las filas para cambiar el orden. El orden aquí es el orden en el sitio.',
        components: {},
      },
      fields: [
        {
          name: 'imagen',
          label: 'Imagen',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'grupo',
          label: 'Etiqueta / Grupo',
          type: 'text',
          admin: {
            description: 'Nombre del proyecto o cliente. Aparece como pie en el lightbox.',
          },
        },
        {
          name: 'alt',
          label: 'Texto alternativo (accesibilidad)',
          type: 'text',
        },
      ],
    },
  ],
}
