// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import astroConsent from 'astro-consent';

// https://astro.build/config
export default defineConfig({
  site: 'https://lucianaromero.com',
  integrations: [
    icon(),
    sitemap({
      filter: (page) => !page.includes('/admin') && !page.includes('/api'),
    }),
    astroConsent({
      siteName: 'LU.ROMERO',
      headline: 'Gestión de cookies',
      description:
        'Usamos cookies técnicas esenciales para el funcionamiento del sitio y, con tu consentimiento, cookies analíticas para mejorar la experiencia. Puedes aceptar todas, rechazarlas o personalizar tus preferencias.',
      acceptLabel: 'Aceptar todas',
      rejectLabel: 'Rechazar todas',
      manageLabel: 'Personalizar',
      cookiePolicyUrl: '/politica-de-cookies',
      privacyPolicyUrl: '/politica-de-privacidad',
      displayUntilIdle: true,
      displayIdleDelayMs: 1500,
      presentation: 'banner',
      consent: {
        days: 365,
        storageKey: 'lu-romero-consent',
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});