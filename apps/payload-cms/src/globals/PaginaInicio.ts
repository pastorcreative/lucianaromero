import type { GlobalConfig } from 'payload'

export const PaginaInicio: GlobalConfig = {
  slug: 'pagina-inicio',
  label: 'Inicio',
  access: { read: () => true },
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
        { name: 'etiquetaGaleria',   label: 'Etiqueta Galería',   type: 'text', defaultValue: 'GALLERY'   },
        { name: 'descGaleria',       label: 'Descripción Galería', type: 'text', defaultValue: 'Editoriales & retratos' },
        { name: 'etiquetaComercial', label: 'Etiqueta Comercial', type: 'text', defaultValue: 'COMERCIAL' },
        { name: 'descComercial',     label: 'Descripción Comercial', type: 'text', defaultValue: 'Campañas & marcas' },
        { name: 'etiquetaNovias',    label: 'Etiqueta Novias',    type: 'text', defaultValue: 'NOVIAS'    },
        { name: 'descNovias',        label: 'Descripción Novias', type: 'text', defaultValue: 'Maquillaje nupcial' },
        { name: 'etiquetaCursos',    label: 'Etiqueta Cursos',    type: 'text', defaultValue: 'COURSES'   },
        { name: 'descCursos',        label: 'Descripción Cursos', type: 'text', defaultValue: 'Formación profesional' },
      ],
    },

    // ── Vídeos (sección Multimedia) ───────────────────────────────
    {
      name: 'videos',
      label: 'Vídeos (sección Multimedia)',
      type: 'array',
      admin: { description: 'Vídeos que aparecen en el reproductor de la página de inicio.' },
      fields: [
        { name: 'titulo',   label: 'Título',   type: 'text', required: true },
        {
          name: 'categoria',
          label: 'Categoría',
          type: 'select',
          options: [
            { label: 'Comercial', value: 'COMERCIAL' },
            { label: 'Editorial', value: 'EDITORIAL' },
          ],
        },
        { name: 'cliente',  label: 'Cliente',  type: 'text' },
        {
          name: 'archivo',
          label: 'Archivo de vídeo',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },

    {
      name: 'seo',
      label: 'SEO',
      type: 'group',
      fields: [
        { name: 'titulo',     label: 'Título de página',  type: 'text',     defaultValue: 'LU.ROMERO — Make Up & Hair Artist' },
        { name: 'descripcion', label: 'Meta descripción', type: 'textarea', defaultValue: 'Portfolio de Luciana Romero, Makeup Artist & Hair Stylist en Barcelona. Especialista en maquillaje editorial, comercial y nupcial.' },
      ],
    },
  ],
}
