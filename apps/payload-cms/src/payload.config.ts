import { postgresAdapter } from '@payloadcms/db-postgres'
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
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})

