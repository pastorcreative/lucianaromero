import type { GlobalConfig } from 'payload'

export const PaginaInicio: GlobalConfig = {
  slug: 'pagina-inicio',
  label: 'Inicio',
  admin: { group: 'Páginas' },
  fields: [
    {
      name: 'hero',
      label: 'Hero',
      type: 'group',
      fields: [
        {
          name: 'subtitulo',
          label: 'Subtítulo (bajo el logo)',
          type: 'text',
          defaultValue: 'MAKE UP & HAIR ARTIST BASED IN BCN',
        },
      ],
    },
    {
      name: 'bento',
      label: 'Bento Grid (sección de categorías)',
      type: 'group',
      fields: [
        { name: 'etiquetaGaleria', label: 'Etiqueta Galería', type: 'text', defaultValue: 'GALLERY' },
        { name: 'etiquetaComerical', label: 'Etiqueta Comercial', type: 'text', defaultValue: 'COMERCIAL' },
        { name: 'etiquetaNovias', label: 'Etiqueta Novias', type: 'text', defaultValue: 'NOVIAS' },
      ],
    },
    {
      name: 'seo',
      label: 'SEO',
      type: 'group',
      fields: [
        { name: 'titulo', label: 'Título de página', type: 'text', defaultValue: 'LU.ROMERO — Make Up & Hair Artist' },
        { name: 'descripcion', label: 'Meta descripción', type: 'textarea' },
      ],
    },
  ],
}
