import type { GlobalConfig } from 'payload'

export const PaginaComerical: GlobalConfig = {
  slug: 'pagina-comercial',
  label: 'Comercial',
  admin: { group: 'Páginas' },
  fields: [
    {
      name: 'hero',
      label: 'Hero de la página',
      type: 'group',
      fields: [
        { name: 'titulo', label: 'Título', type: 'text', defaultValue: 'COMERCIAL' },
        {
          name: 'subtitulo',
          label: 'Subtítulo',
          type: 'text',
          defaultValue: '— Publicidad & Marcas',
        },
      ],
    },
    {
      name: 'seo',
      label: 'SEO',
      type: 'group',
      fields: [
        { name: 'titulo', label: 'Título de página', type: 'text', defaultValue: 'Comercial — LU.ROMERO' },
        { name: 'descripcion', label: 'Meta descripción', type: 'textarea' },
      ],
    },
  ],
}
