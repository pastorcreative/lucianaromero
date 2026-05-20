import type { CollectionConfig } from 'payload'

export const GaleriaImagenes: CollectionConfig = {
  slug: 'galeria-imagenes',
  label: { singular: 'Imagen de galería', plural: 'Imágenes de galería' },
  access: { read: () => true },
  admin: {
    group: 'Contenido',
    useAsTitle: 'grupo',
    defaultColumns: ['imagen', 'seccion', 'grupo', 'orden'],
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
      name: 'alt',
      label: 'Texto alternativo',
      type: 'text',
    },
    {
      name: 'seccion',
      label: 'Sección',
      type: 'select',
      required: true,
      options: [
        { label: 'Comercial', value: 'COMERCIAL' },
        { label: 'Editorial', value: 'EDITORIAL' },
        { label: 'Novias',    value: 'NOVIAS' },
      ],
    },
    {
      name: 'grupo',
      label: 'Grupo / Marca / Publicación',
      type: 'text',
      required: true,
    },
    {
      name: 'orden',
      label: 'Orden dentro del grupo',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
