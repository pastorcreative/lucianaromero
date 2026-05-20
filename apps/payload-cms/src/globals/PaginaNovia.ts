import type { GlobalConfig } from 'payload'

export const PaginaNovia: GlobalConfig = {
  slug: 'pagina-novia',
  label: 'Novias',
  admin: { group: 'Páginas' },
  fields: [
    {
      name: 'hero',
      label: 'Hero de la página',
      type: 'group',
      fields: [
        { name: 'titulo', label: 'Título', type: 'text', defaultValue: 'NOVIAS' },
        {
          name: 'subtitulo',
          label: 'Subtítulo',
          type: 'text',
          defaultValue: '— Maquillaje & Peinado para el día más especial',
        },
      ],
    },
    {
      name: 'seo',
      label: 'SEO',
      type: 'group',
      fields: [
        { name: 'titulo', label: 'Título de página', type: 'text', defaultValue: 'Novias — LU.ROMERO' },
        { name: 'descripcion', label: 'Meta descripción', type: 'textarea' },
      ],
    },
  ],
}
