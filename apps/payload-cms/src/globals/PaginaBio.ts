import type { GlobalConfig } from 'payload'

export const PaginaBio: GlobalConfig = {
  slug: 'pagina-bio',
  label: 'Bio',
  access: { read: () => true },
  admin: { group: 'Páginas' },
  fields: [
    {
      name: 'hero',
      label: 'Hero de la página',
      type: 'group',
      fields: [
        { name: 'titulo', label: 'Título', type: 'text', defaultValue: 'BIO' },
        { name: 'subtitulo', label: 'Subtítulo', type: 'text', defaultValue: '— Make Up & Hair Artist · Barcelona' },
      ],
    },
    {
      name: 'foto',
      label: 'Foto de perfil',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'parrafos',
      label: 'Párrafos de la bio',
      type: 'array',
      minRows: 1,
      admin: { description: 'El primer párrafo aparece en tamaño mayor y cursiva.' },
      fields: [
        { name: 'texto', label: 'Párrafo', type: 'textarea', required: true },
      ],
    },

    // ── BioPreview ────────────────────────────────────────────────
    {
      name: 'lineasDestacadas',
      label: 'Líneas destacadas (BioPreview)',
      type: 'array',
      admin: { description: 'Las líneas que aparecen en la sección de presentación de la página de inicio.' },
      fields: [
        { name: 'texto', label: 'Texto', type: 'text', required: true },
      ],
    },
    {
      name: 'resumen',
      label: 'Resumen (BioPreview)',
      type: 'textarea',
      admin: { description: 'Texto breve que aparece bajo las líneas destacadas en la página de inicio.' },
      defaultValue: 'Luciana Romero nació en Argentina. Con más de 17 años de carrera, fusiona la pasión artística con el trabajo profesional en moda, publicidad y eventos. Actualmente basada en Barcelona.',
    },

    {
      name: 'seo',
      label: 'SEO',
      type: 'group',
      fields: [
        { name: 'titulo',      label: 'Título de página',  type: 'text',     defaultValue: 'Bio — LU.ROMERO' },
        { name: 'descripcion', label: 'Meta descripción',  type: 'textarea', defaultValue: 'Conoce a Luciana Romero, Makeup Artist & Hair Stylist con sede en Barcelona. Especialista en maquillaje editorial, comercial y nupcial para moda y publicidad.' },
      ],
    },
  ],
}
