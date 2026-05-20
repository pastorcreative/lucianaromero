import type { CollectionConfig } from 'payload'

export const Cursos: CollectionConfig = {
  slug: 'cursos',
  labels: {
    singular: 'Curso',
    plural: 'Cursos',
  },
  access: { read: () => true },
  admin: {
    useAsTitle: 'heroTitle',
    defaultColumns: ['heroTitle', 'slug', 'updatedAt'],
    group: 'Contenido',
  },
  fields: [
    {
      name: 'slug',
      label: 'Slug (URL)',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL del curso, ej: peinado-inicial' },
    },
    {
      name: 'pageTitle',
      label: 'Título SEO de la página',
      type: 'text',
      required: true,
    },
    {
      name: 'heroTitle',
      label: 'Título del Hero',
      type: 'text',
      required: true,
    },
    {
      name: 'heroSubtitle',
      label: 'Subtítulo del Hero',
      type: 'text',
    },

    // ── Introducción ──────────────────────────────────────────────
    {
      name: 'intro',
      label: 'Introducción',
      type: 'group',
      fields: [
        { name: 'tag', label: 'Etiqueta', type: 'text' },
        {
          name: 'headingLines',
          label: 'Líneas del encabezado',
          type: 'array',
          minRows: 1,
          maxRows: 3,
          fields: [{ name: 'texto', label: 'Línea', type: 'text', required: true }],
        },
        { name: 'lead', label: 'Lead (frase destacada)', type: 'text' },
        {
          name: 'paragraphs',
          label: 'Párrafos (admite <strong>)',
          type: 'array',
          fields: [{ name: 'texto', label: 'Párrafo', type: 'textarea', required: true }],
        },
        {
          name: 'chips',
          label: 'Chips informativos',
          type: 'array',
          fields: [{ name: 'texto', label: 'Texto', type: 'text', required: true }],
        },
        {
          name: 'mainImage',
          label: 'Imagen principal',
          type: 'upload',
          relationTo: 'media',
        },
        { name: 'mainImageAlt', label: 'Alt imagen principal', type: 'text' },
        { name: 'mainImageLabel', label: 'Etiqueta imagen principal', type: 'text' },
        {
          name: 'secondaryImage',
          label: 'Imagen secundaria',
          type: 'upload',
          relationTo: 'media',
        },
        { name: 'secondaryImageAlt', label: 'Alt imagen secundaria', type: 'text' },
        { name: 'secondaryImageLabel', label: 'Etiqueta imagen secundaria', type: 'text' },
      ],
    },

    // ── Qué aprenderás / Modalidades ──────────────────────────────
    {
      name: 'learning',
      label: 'Sección de aprendizaje / Modalidades',
      type: 'group',
      fields: [
        { name: 'sectionTitle', label: 'Título de sección', type: 'text' },
        { name: 'sectionLabel', label: 'Etiqueta de sección', type: 'text' },
        {
          name: 'items',
          label: 'Puntos o modalidades',
          type: 'array',
          minRows: 1,
          fields: [
            { name: 'num', label: 'Número', type: 'text' },
            { name: 'title', label: 'Título', type: 'text', required: true },
            { name: 'body', label: 'Descripción', type: 'textarea', required: true },
            { name: 'tag', label: 'Etiqueta', type: 'text' },
          ],
        },
      ],
    },

    // ── Directora / Formadora ─────────────────────────────────────
    {
      name: 'director',
      label: 'Directora / Formadora',
      type: 'group',
      fields: [
        { name: 'photo', label: 'Foto', type: 'upload', relationTo: 'media' },
        { name: 'photoLabel', label: 'Etiqueta de la foto', type: 'text' },
        { name: 'photoYears', label: 'Años de experiencia', type: 'text' },
        { name: 'sectionLabel', label: 'Etiqueta de sección', type: 'text' },
        {
          name: 'nameLines',
          label: 'Nombre (líneas)',
          type: 'array',
          maxRows: 3,
          fields: [{ name: 'texto', label: 'Línea', type: 'text', required: true }],
        },
        { name: 'quote', label: 'Cita', type: 'textarea' },
        { name: 'body', label: 'Descripción', type: 'textarea' },
        {
          name: 'stats',
          label: 'Estadísticas',
          type: 'array',
          maxRows: 4,
          fields: [
            { name: 'value', label: 'Valor', type: 'text', required: true },
            { name: 'label', label: 'Etiqueta', type: 'text', required: true },
          ],
        },
      ],
    },

    // ── La Academia ───────────────────────────────────────────────
    {
      name: 'academy',
      label: 'La Academia',
      type: 'group',
      fields: [
        { name: 'sectionTitle', label: 'Título de sección', type: 'text' },
        { name: 'sectionLabel', label: 'Etiqueta de sección', type: 'text' },
        { name: 'name', label: 'Nombre del estudio', type: 'text' },
        { name: 'address', label: 'Dirección', type: 'text' },
        { name: 'addressStrong', label: 'Dirección (texto en negrita)', type: 'text' },
        { name: 'mapUrl', label: 'URL de Google Maps', type: 'text' },
        {
          name: 'modalities',
          label: 'Puntos destacados',
          type: 'array',
          fields: [{ name: 'texto', label: 'Punto', type: 'text', required: true }],
        },
        {
          name: 'photos',
          label: 'Fotos del estudio',
          type: 'array',
          fields: [
            { name: 'photo', label: 'Foto', type: 'upload', relationTo: 'media' },
            { name: 'alt', label: 'Texto alternativo', type: 'text' },
          ],
        },
      ],
    },

    // ── CTA / Inscripción ─────────────────────────────────────────
    {
      name: 'cta',
      label: 'Llamada a la acción (Inscripción)',
      type: 'group',
      fields: [
        { name: 'sectionLabel', label: 'Etiqueta de sección', type: 'text' },
        {
          name: 'headingLines',
          label: 'Líneas del encabezado',
          type: 'array',
          maxRows: 3,
          fields: [{ name: 'texto', label: 'Línea', type: 'text', required: true }],
        },
        { name: 'body', label: 'Descripción', type: 'textarea' },
        { name: 'instagramUrl', label: 'URL de Instagram', type: 'text' },
        { name: 'email', label: 'Email de contacto', type: 'email' },
        { name: 'emailSubject', label: 'Asunto del email', type: 'text' },
        { name: 'includesLabel', label: 'Etiqueta "Qué incluye"', type: 'text' },
        {
          name: 'includes',
          label: 'Qué incluye (lista)',
          type: 'array',
          fields: [{ name: 'texto', label: 'Ítem', type: 'text', required: true }],
        },
      ],
    },
  ],
}
