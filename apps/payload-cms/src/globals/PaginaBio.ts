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
    {
      name: 'seo',
      label: 'SEO',
      type: 'group',
      fields: [
        { name: 'titulo', label: 'Título de página', type: 'text', defaultValue: 'Bio — LU.ROMERO' },
        { name: 'descripcion', label: 'Meta descripción', type: 'textarea' },
      ],
    },
  ],
}
