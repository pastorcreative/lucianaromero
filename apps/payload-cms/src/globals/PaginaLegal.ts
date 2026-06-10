import type { GlobalConfig } from 'payload'

/** Campos reutilizables para una sección de texto legal */
const seccionFields = [
  { name: 'heading',    label: 'Encabezado',  type: 'text' as const },
  {
    name: 'paragraphs',
    label: 'Párrafos',
    type: 'array' as const,
    fields: [{ name: 'texto', label: 'Párrafo', type: 'textarea' as const }],
  },
  {
    name: 'items',
    label: 'Lista de ítems',
    type: 'array' as const,
    fields: [{ name: 'texto', label: 'Ítem', type: 'text' as const }],
  },
]

const paginaLegalGroup = (name: string, label: string, defaultTitle: string, defaultSlug: string) => ({
  name,
  label,
  type: 'group' as const,
  fields: [
    { name: 'title',     label: 'Título',             type: 'text' as const, defaultValue: defaultTitle },
    { name: 'slug',      label: 'Slug (URL)',          type: 'text' as const, defaultValue: defaultSlug, admin: { readOnly: true } },
    { name: 'updatedAt', label: 'Fecha de actualización', type: 'text' as const, defaultValue: '19 de mayo de 2026' },
    {
      name: 'sections',
      label: 'Secciones',
      type: 'array' as const,
      fields: seccionFields,
    },
  ],
})

export const PaginaLegal: GlobalConfig = {
  slug: 'pagina-legal',
  label: 'Textos Legales',
  access: { read: () => true },
  admin: {
    group: 'Ajustes',
    description: 'Aviso Legal, Política de Privacidad y Política de Cookies.',
  },
  fields: [
    paginaLegalGroup('avisoLegal',  'Aviso Legal',              'Aviso Legal',              'aviso-legal'),
    paginaLegalGroup('privacidad',  'Política de Privacidad',   'Política de Privacidad',   'politica-de-privacidad'),
    paginaLegalGroup('cookies',     'Política de Cookies',      'Política de Cookies',      'politica-de-cookies'),
  ],
}
