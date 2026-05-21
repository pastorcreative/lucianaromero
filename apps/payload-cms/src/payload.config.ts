import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { es } from '@payloadcms/translations/languages/es'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Cursos } from './collections/Cursos'
import { GaleriaImagenes } from './collections/GaleriaImagenes'
import { Galerias } from './collections/Galerias'

import { ConfiguracionSitio } from './globals/ConfiguracionSitio'
import { PaginaInicio } from './globals/PaginaInicio'
import { PaginaBio } from './globals/PaginaBio'
import { PaginaGaleria } from './globals/PaginaGaleria'
import { PaginaComerical } from './globals/PaginaComerical'
import { PaginaNovia } from './globals/PaginaNovia'
import { PaginaContacto } from './globals/PaginaContacto'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterNavLinks: [
        {
          path: '/components/LanzarProduccion',
          exportName: 'LanzarProduccionButton',
        },
      ],
    },
  },
  i18n: {
    supportedLanguages: { es },
    fallbackLanguage: 'es',
  },
  localization: false,
  collections: [Users, Media, Cursos, GaleriaImagenes, Galerias],
  globals: [
    ConfiguracionSitio,
    PaginaInicio,
    PaginaBio,
    PaginaGaleria,
    PaginaComerical,
    PaginaNovia,
    PaginaContacto,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.NODE_ENV === 'production'
          ? process.env.DATABASE_URL || ''
          : process.env.DEV_DATABASE_URL || process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    ...(process.env.NODE_ENV === 'production' || process.env.R2_BUCKET
      ? (() => {
          const bucket          = process.env.R2_BUCKET
          const accessKeyId     = process.env.R2_ACCESS_KEY_ID
          const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
          const endpoint        = process.env.R2_ENDPOINT

          if (!bucket || !accessKeyId || !secretAccessKey || !endpoint) {
            throw new Error(
              'Faltan variables de entorno para Cloudflare R2: R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT',
            )
          }

          return [
            s3Storage({
              collections: { media: true },
              bucket,
              config: {
                credentials: { accessKeyId, secretAccessKey },
                region:   'auto',
                endpoint,
              },
            }),
          ]
        })()
      : []),
  ],
})

