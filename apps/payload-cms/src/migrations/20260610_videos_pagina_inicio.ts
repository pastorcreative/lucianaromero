import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Vaciar vídeos de configuracion_sitio (se mueven a pagina_inicio)
  await db.execute(sql`DELETE FROM "configuracion_sitio_videos";`)

  // 2. Soltar FK e índices
  await db.execute(sql`ALTER TABLE "configuracion_sitio_videos" DROP CONSTRAINT IF EXISTS "configuracion_sitio_videos_parent_id_fk";`)
  await db.execute(sql`DROP INDEX IF EXISTS "configuracion_sitio_videos_order_idx";`)
  await db.execute(sql`DROP INDEX IF EXISTS "configuracion_sitio_videos_parent_id_idx";`)

  // 3. Renombrar tabla y enum
  await db.execute(sql`ALTER TABLE IF EXISTS "configuracion_sitio_videos" RENAME TO "pagina_inicio_videos";`)
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_configuracion_sitio_videos_categoria') THEN
        ALTER TYPE "public"."enum_configuracion_sitio_videos_categoria"
          RENAME TO "enum_pagina_inicio_videos_categoria";
      END IF;
    END $$;
  `)

  // 4. Nuevas columnas en pagina_inicio
  await db.execute(sql`ALTER TABLE "pagina_inicio" ADD COLUMN IF NOT EXISTS "bento_desc_galeria"       varchar;`)
  await db.execute(sql`ALTER TABLE "pagina_inicio" ADD COLUMN IF NOT EXISTS "bento_etiqueta_comercial" varchar;`)
  await db.execute(sql`ALTER TABLE "pagina_inicio" ADD COLUMN IF NOT EXISTS "bento_desc_comercial"     varchar;`)
  await db.execute(sql`ALTER TABLE "pagina_inicio" ADD COLUMN IF NOT EXISTS "bento_desc_novias"        varchar;`)
  await db.execute(sql`ALTER TABLE "pagina_inicio" ADD COLUMN IF NOT EXISTS "bento_etiqueta_cursos"    varchar;`)
  await db.execute(sql`ALTER TABLE "pagina_inicio" ADD COLUMN IF NOT EXISTS "bento_desc_cursos"        varchar;`)
  await db.execute(sql`ALTER TABLE "pagina_inicio" ADD COLUMN IF NOT EXISTS "seo_descripcion"          varchar;`)

  // 5. Nuevas columnas en pagina_bio
  await db.execute(sql`ALTER TABLE "pagina_bio" ADD COLUMN IF NOT EXISTS "resumen"         varchar;`)
  await db.execute(sql`ALTER TABLE "pagina_bio" ADD COLUMN IF NOT EXISTS "seo_descripcion" varchar;`)

  // 6. Tabla pagina_bio_lineas_destacadas
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pagina_bio_lineas_destacadas" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "texto"      varchar NOT NULL
    );
  `)
  await db.execute(sql`ALTER TABLE "pagina_bio_lineas_destacadas" ADD CONSTRAINT "pagina_bio_lineas_destacadas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_bio"("id") ON DELETE cascade ON UPDATE no action;`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "pagina_bio_lineas_destacadas_order_idx"     ON "pagina_bio_lineas_destacadas" ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "pagina_bio_lineas_destacadas_parent_id_idx" ON "pagina_bio_lineas_destacadas" ("_parent_id");`)

  // 7. Nuevas columnas en configuracion_sitio (redes ampliadas)
  await db.execute(sql`ALTER TABLE "configuracion_sitio" ADD COLUMN IF NOT EXISTS "redes_instagram_handle" varchar;`)
  await db.execute(sql`ALTER TABLE "configuracion_sitio" ADD COLUMN IF NOT EXISTS "redes_facebook"         varchar;`)
  await db.execute(sql`ALTER TABLE "configuracion_sitio" ADD COLUMN IF NOT EXISTS "redes_facebook_handle"  varchar;`)
  await db.execute(sql`ALTER TABLE "configuracion_sitio" ADD COLUMN IF NOT EXISTS "redes_linkedin"         varchar;`)
  await db.execute(sql`ALTER TABLE "configuracion_sitio" ADD COLUMN IF NOT EXISTS "redes_linkedin_handle"  varchar;`)
  await db.execute(sql`ALTER TABLE "configuracion_sitio" ADD COLUMN IF NOT EXISTS "redes_youtube_handle"   varchar;`)

  // 8. Tabla pagina_legal
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pagina_legal" (
      "id"                     serial PRIMARY KEY NOT NULL,
      "aviso_legal_title"      varchar,
      "aviso_legal_slug"       varchar,
      "aviso_legal_updated_at" varchar,
      "privacidad_title"       varchar,
      "privacidad_slug"        varchar,
      "privacidad_updated_at"  varchar,
      "cookies_title"          varchar,
      "cookies_slug"           varchar,
      "cookies_updated_at"     varchar,
      "updated_at"             timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at"             timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  // 9. Secciones de aviso legal
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "pagina_legal_aviso_legal_sections" ("_order" integer NOT NULL, "_parent_id" integer NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "heading" varchar);`)
  await db.execute(sql`ALTER TABLE "pagina_legal_aviso_legal_sections" ADD CONSTRAINT "pagina_legal_aviso_legal_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_legal"("id") ON DELETE cascade ON UPDATE no action;`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "pagina_legal_aviso_legal_sections_paragraphs" ("_order" integer NOT NULL, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "texto" varchar);`)
  await db.execute(sql`ALTER TABLE "pagina_legal_aviso_legal_sections_paragraphs" ADD CONSTRAINT "pagina_legal_aviso_legal_sections_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_legal_aviso_legal_sections"("id") ON DELETE cascade ON UPDATE no action;`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "pagina_legal_aviso_legal_sections_items" ("_order" integer NOT NULL, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "texto" varchar);`)
  await db.execute(sql`ALTER TABLE "pagina_legal_aviso_legal_sections_items" ADD CONSTRAINT "pagina_legal_aviso_legal_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_legal_aviso_legal_sections"("id") ON DELETE cascade ON UPDATE no action;`)

  // 10. Secciones de privacidad
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "pagina_legal_privacidad_sections" ("_order" integer NOT NULL, "_parent_id" integer NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "heading" varchar);`)
  await db.execute(sql`ALTER TABLE "pagina_legal_privacidad_sections" ADD CONSTRAINT "pagina_legal_privacidad_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_legal"("id") ON DELETE cascade ON UPDATE no action;`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "pagina_legal_privacidad_sections_paragraphs" ("_order" integer NOT NULL, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "texto" varchar);`)
  await db.execute(sql`ALTER TABLE "pagina_legal_privacidad_sections_paragraphs" ADD CONSTRAINT "pagina_legal_privacidad_sections_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_legal_privacidad_sections"("id") ON DELETE cascade ON UPDATE no action;`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "pagina_legal_privacidad_sections_items" ("_order" integer NOT NULL, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "texto" varchar);`)
  await db.execute(sql`ALTER TABLE "pagina_legal_privacidad_sections_items" ADD CONSTRAINT "pagina_legal_privacidad_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_legal_privacidad_sections"("id") ON DELETE cascade ON UPDATE no action;`)

  // 11. Secciones de cookies
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "pagina_legal_cookies_sections" ("_order" integer NOT NULL, "_parent_id" integer NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "heading" varchar);`)
  await db.execute(sql`ALTER TABLE "pagina_legal_cookies_sections" ADD CONSTRAINT "pagina_legal_cookies_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_legal"("id") ON DELETE cascade ON UPDATE no action;`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "pagina_legal_cookies_sections_paragraphs" ("_order" integer NOT NULL, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "texto" varchar);`)
  await db.execute(sql`ALTER TABLE "pagina_legal_cookies_sections_paragraphs" ADD CONSTRAINT "pagina_legal_cookies_sections_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_legal_cookies_sections"("id") ON DELETE cascade ON UPDATE no action;`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "pagina_legal_cookies_sections_items" ("_order" integer NOT NULL, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "texto" varchar);`)
  await db.execute(sql`ALTER TABLE "pagina_legal_cookies_sections_items" ADD CONSTRAINT "pagina_legal_cookies_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_legal_cookies_sections"("id") ON DELETE cascade ON UPDATE no action;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`SELECT 1;`)
}
