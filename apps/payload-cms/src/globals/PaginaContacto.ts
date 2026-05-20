import type { GlobalConfig } from 'payload'

export const PaginaContacto: GlobalConfig = {
  slug: 'pagina-contacto',
  label: 'Contacto',
  admin: { group: 'Páginas' },
  fields: [
    {
      name: 'hero',
      label: 'Hero de la página',
      type: 'group',
      fields: [
        { name: 'titulo', label: 'Título', type: 'text', defaultValue: 'CONTACTO' },
        { name: 'subtitulo', label: 'Subtítulo', type: 'text', defaultValue: '— Hablemos' },
      ],
    },
    {
      name: 'formulario',
      label: 'Formulario de contacto',
      type: 'group',
      fields: [
        { name: 'titulo', label: 'Título del formulario', type: 'text', defaultValue: 'Envía un mensaje' },
        { name: 'descripcion', label: 'Descripción', type: 'textarea' },
        { name: 'emailDestino', label: 'Email destino', type: 'email', defaultValue: 'luromeroestudio@gmail.com' },
        { name: 'mensajeExito', label: 'Mensaje de éxito', type: 'text', defaultValue: '¡Mensaje enviado! Te responderé pronto.' },
      ],
    },
    {
      name: 'seo',
      label: 'SEO',
      type: 'group',
      fields: [
        { name: 'titulo', label: 'Título de página', type: 'text', defaultValue: 'Contacto — LU.ROMERO' },
        { name: 'descripcion', label: 'Meta descripción', type: 'textarea' },
      ],
    },
  ],
}
