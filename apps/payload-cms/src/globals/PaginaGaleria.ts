import type { GlobalConfig } from 'payload'

export const PaginaGaleria: GlobalConfig = {
  slug: 'pagina-galeria',
  label: 'Galería',
  admin: { group: 'Páginas' },
  fields: [
    {
      name: 'hero',
      label: 'Hero de la página',
      type: 'group',
      fields: [
        { name: 'titulo', label: 'Título', type: 'text', defaultValue: 'GALERÍA' },
        {
          name: 'subtitulo',
          label: 'Subtítulo',
          type: 'text',
          defaultValue: '— Moda · Editorial · Comercial · Novias',
        },
      ],
    },
    {
      name: 'secciones',
      label: 'Etiquetas de secciones',
      type: 'group',
      fields: [
        { name: 'editorial', label: 'Etiqueta Editorial', type: 'text', defaultValue: 'EDITORIAL' },
        { name: 'comercial', label: 'Etiqueta Comercial', type: 'text', defaultValue: 'COMERCIAL' },
        { name: 'novias', label: 'Etiqueta Novias', type: 'text', defaultValue: 'NOVIAS' },
      ],
    },
    {
      name: 'seo',
      label: 'SEO',
      type: 'group',
      fields: [
        { name: 'titulo', label: 'Título de página', type: 'text', defaultValue: 'Galería — LU.ROMERO' },
        { name: 'descripcion', label: 'Meta descripción', type: 'textarea' },
      ],
    },
  ],
}
