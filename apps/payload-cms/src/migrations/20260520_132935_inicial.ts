import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_galeria_imagenes_seccion" AS ENUM('COMERCIAL', 'EDITORIAL', 'NOVIAS');
  CREATE TYPE "public"."enum_configuracion_sitio_videos_categoria" AS ENUM('COMERCIAL', 'EDITORIAL');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "cursos_intro_heading_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE "cursos_intro_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE "cursos_intro_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE "cursos_learning_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"num" varchar,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "cursos_director_name_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE "cursos_director_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "cursos_academy_modalities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE "cursos_academy_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"alt" varchar
  );
  
  CREATE TABLE "cursos_cta_heading_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE "cursos_cta_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE "cursos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"page_title" varchar NOT NULL,
  	"hero_title" varchar NOT NULL,
  	"hero_subtitle" varchar,
  	"intro_tag" varchar,
  	"intro_lead" varchar,
  	"intro_main_image_id" integer,
  	"intro_main_image_alt" varchar,
  	"intro_main_image_label" varchar,
  	"intro_secondary_image_id" integer,
  	"intro_secondary_image_alt" varchar,
  	"intro_secondary_image_label" varchar,
  	"learning_section_title" varchar,
  	"learning_section_label" varchar,
  	"director_photo_id" integer,
  	"director_photo_label" varchar,
  	"director_photo_years" varchar,
  	"director_section_label" varchar,
  	"director_quote" varchar,
  	"director_body" varchar,
  	"academy_section_title" varchar,
  	"academy_section_label" varchar,
  	"academy_name" varchar,
  	"academy_address" varchar,
  	"academy_address_strong" varchar,
  	"academy_map_url" varchar,
  	"cta_section_label" varchar,
  	"cta_body" varchar,
  	"cta_instagram_url" varchar,
  	"cta_email" varchar,
  	"cta_email_subject" varchar,
  	"cta_includes_label" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "galeria_imagenes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"imagen_id" integer NOT NULL,
  	"alt" varchar,
  	"seccion" "enum_galeria_imagenes_seccion" NOT NULL,
  	"grupo" varchar NOT NULL,
  	"orden" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "galerias_imagenes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"imagen_id" integer NOT NULL,
  	"grupo" varchar,
  	"alt" varchar
  );
  
  CREATE TABLE "galerias" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"titulo" varchar NOT NULL,
  	"subtitulo" varchar,
  	"seo_title" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"cursos_id" integer,
  	"galeria_imagenes_id" integer,
  	"galerias_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "configuracion_sitio_marcas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"logo_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "configuracion_sitio_revistas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"logo_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "configuracion_sitio_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"categoria" "enum_configuracion_sitio_videos_categoria",
  	"cliente" varchar,
  	"archivo_id" integer
  );
  
  CREATE TABLE "configuracion_sitio" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"identidad_nombre_sitio" varchar DEFAULT 'LU.ROMERO',
  	"identidad_descripcion_corta" varchar DEFAULT 'Make Up & Hair Artist',
  	"identidad_email" varchar DEFAULT 'luromeroestudio@gmail.com',
  	"identidad_ubicacion" varchar DEFAULT 'Barcelona, España',
  	"redes_instagram" varchar DEFAULT 'https://www.instagram.com/luromeromakeup/',
  	"redes_tiktok" varchar,
  	"redes_youtube" varchar,
  	"redes_pinterest" varchar,
  	"footer_copyright" varchar DEFAULT '© LU.ROMERO',
  	"footer_tagline" varchar DEFAULT 'Make Up & Hair Artist',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "pagina_inicio" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_subtitulo" varchar DEFAULT 'MAKE UP & HAIR ARTIST BASED IN BCN',
  	"bento_etiqueta_galeria" varchar DEFAULT 'GALLERY',
  	"bento_etiqueta_comerical" varchar DEFAULT 'COMERCIAL',
  	"bento_etiqueta_novias" varchar DEFAULT 'NOVIAS',
  	"seo_titulo" varchar DEFAULT 'LU.ROMERO — Make Up & Hair Artist',
  	"seo_descripcion" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "pagina_bio_parrafos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE "pagina_bio" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_titulo" varchar DEFAULT 'BIO',
  	"hero_subtitulo" varchar DEFAULT '— Make Up & Hair Artist · Barcelona',
  	"foto_id" integer,
  	"seo_titulo" varchar DEFAULT 'Bio — LU.ROMERO',
  	"seo_descripcion" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "pagina_galeria" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_titulo" varchar DEFAULT 'GALERÍA',
  	"hero_subtitulo" varchar DEFAULT '— Moda · Editorial · Comercial · Novias',
  	"secciones_editorial" varchar DEFAULT 'EDITORIAL',
  	"secciones_comercial" varchar DEFAULT 'COMERCIAL',
  	"secciones_novias" varchar DEFAULT 'NOVIAS',
  	"seo_titulo" varchar DEFAULT 'Galería — LU.ROMERO',
  	"seo_descripcion" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "pagina_comercial" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_titulo" varchar DEFAULT 'COMERCIAL',
  	"hero_subtitulo" varchar DEFAULT '— Publicidad & Marcas',
  	"seo_titulo" varchar DEFAULT 'Comercial — LU.ROMERO',
  	"seo_descripcion" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "pagina_novia" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_titulo" varchar DEFAULT 'NOVIAS',
  	"hero_subtitulo" varchar DEFAULT '— Maquillaje & Peinado para el día más especial',
  	"seo_titulo" varchar DEFAULT 'Novias — LU.ROMERO',
  	"seo_descripcion" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "pagina_contacto" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_titulo" varchar DEFAULT 'CONTACTO',
  	"hero_subtitulo" varchar DEFAULT '— Hablemos',
  	"formulario_titulo" varchar DEFAULT 'Envía un mensaje',
  	"formulario_descripcion" varchar,
  	"formulario_email_destino" varchar DEFAULT 'luromeroestudio@gmail.com',
  	"formulario_mensaje_exito" varchar DEFAULT '¡Mensaje enviado! Te responderé pronto.',
  	"seo_titulo" varchar DEFAULT 'Contacto — LU.ROMERO',
  	"seo_descripcion" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cursos_intro_heading_lines" ADD CONSTRAINT "cursos_intro_heading_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cursos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cursos_intro_paragraphs" ADD CONSTRAINT "cursos_intro_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cursos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cursos_intro_chips" ADD CONSTRAINT "cursos_intro_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cursos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cursos_learning_items" ADD CONSTRAINT "cursos_learning_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cursos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cursos_director_name_lines" ADD CONSTRAINT "cursos_director_name_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cursos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cursos_director_stats" ADD CONSTRAINT "cursos_director_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cursos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cursos_academy_modalities" ADD CONSTRAINT "cursos_academy_modalities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cursos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cursos_academy_photos" ADD CONSTRAINT "cursos_academy_photos_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cursos_academy_photos" ADD CONSTRAINT "cursos_academy_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cursos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cursos_cta_heading_lines" ADD CONSTRAINT "cursos_cta_heading_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cursos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cursos_cta_includes" ADD CONSTRAINT "cursos_cta_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cursos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cursos" ADD CONSTRAINT "cursos_intro_main_image_id_media_id_fk" FOREIGN KEY ("intro_main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cursos" ADD CONSTRAINT "cursos_intro_secondary_image_id_media_id_fk" FOREIGN KEY ("intro_secondary_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cursos" ADD CONSTRAINT "cursos_director_photo_id_media_id_fk" FOREIGN KEY ("director_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "galeria_imagenes" ADD CONSTRAINT "galeria_imagenes_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "galerias_imagenes" ADD CONSTRAINT "galerias_imagenes_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "galerias_imagenes" ADD CONSTRAINT "galerias_imagenes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."galerias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cursos_fk" FOREIGN KEY ("cursos_id") REFERENCES "public"."cursos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_galeria_imagenes_fk" FOREIGN KEY ("galeria_imagenes_id") REFERENCES "public"."galeria_imagenes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_galerias_fk" FOREIGN KEY ("galerias_id") REFERENCES "public"."galerias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "configuracion_sitio_marcas" ADD CONSTRAINT "configuracion_sitio_marcas_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "configuracion_sitio_marcas" ADD CONSTRAINT "configuracion_sitio_marcas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."configuracion_sitio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "configuracion_sitio_revistas" ADD CONSTRAINT "configuracion_sitio_revistas_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "configuracion_sitio_revistas" ADD CONSTRAINT "configuracion_sitio_revistas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."configuracion_sitio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "configuracion_sitio_videos" ADD CONSTRAINT "configuracion_sitio_videos_archivo_id_media_id_fk" FOREIGN KEY ("archivo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "configuracion_sitio_videos" ADD CONSTRAINT "configuracion_sitio_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."configuracion_sitio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pagina_bio_parrafos" ADD CONSTRAINT "pagina_bio_parrafos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_bio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pagina_bio" ADD CONSTRAINT "pagina_bio_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "cursos_intro_heading_lines_order_idx" ON "cursos_intro_heading_lines" USING btree ("_order");
  CREATE INDEX "cursos_intro_heading_lines_parent_id_idx" ON "cursos_intro_heading_lines" USING btree ("_parent_id");
  CREATE INDEX "cursos_intro_paragraphs_order_idx" ON "cursos_intro_paragraphs" USING btree ("_order");
  CREATE INDEX "cursos_intro_paragraphs_parent_id_idx" ON "cursos_intro_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "cursos_intro_chips_order_idx" ON "cursos_intro_chips" USING btree ("_order");
  CREATE INDEX "cursos_intro_chips_parent_id_idx" ON "cursos_intro_chips" USING btree ("_parent_id");
  CREATE INDEX "cursos_learning_items_order_idx" ON "cursos_learning_items" USING btree ("_order");
  CREATE INDEX "cursos_learning_items_parent_id_idx" ON "cursos_learning_items" USING btree ("_parent_id");
  CREATE INDEX "cursos_director_name_lines_order_idx" ON "cursos_director_name_lines" USING btree ("_order");
  CREATE INDEX "cursos_director_name_lines_parent_id_idx" ON "cursos_director_name_lines" USING btree ("_parent_id");
  CREATE INDEX "cursos_director_stats_order_idx" ON "cursos_director_stats" USING btree ("_order");
  CREATE INDEX "cursos_director_stats_parent_id_idx" ON "cursos_director_stats" USING btree ("_parent_id");
  CREATE INDEX "cursos_academy_modalities_order_idx" ON "cursos_academy_modalities" USING btree ("_order");
  CREATE INDEX "cursos_academy_modalities_parent_id_idx" ON "cursos_academy_modalities" USING btree ("_parent_id");
  CREATE INDEX "cursos_academy_photos_order_idx" ON "cursos_academy_photos" USING btree ("_order");
  CREATE INDEX "cursos_academy_photos_parent_id_idx" ON "cursos_academy_photos" USING btree ("_parent_id");
  CREATE INDEX "cursos_academy_photos_photo_idx" ON "cursos_academy_photos" USING btree ("photo_id");
  CREATE INDEX "cursos_cta_heading_lines_order_idx" ON "cursos_cta_heading_lines" USING btree ("_order");
  CREATE INDEX "cursos_cta_heading_lines_parent_id_idx" ON "cursos_cta_heading_lines" USING btree ("_parent_id");
  CREATE INDEX "cursos_cta_includes_order_idx" ON "cursos_cta_includes" USING btree ("_order");
  CREATE INDEX "cursos_cta_includes_parent_id_idx" ON "cursos_cta_includes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "cursos_slug_idx" ON "cursos" USING btree ("slug");
  CREATE INDEX "cursos_intro_intro_main_image_idx" ON "cursos" USING btree ("intro_main_image_id");
  CREATE INDEX "cursos_intro_intro_secondary_image_idx" ON "cursos" USING btree ("intro_secondary_image_id");
  CREATE INDEX "cursos_director_director_photo_idx" ON "cursos" USING btree ("director_photo_id");
  CREATE INDEX "cursos_updated_at_idx" ON "cursos" USING btree ("updated_at");
  CREATE INDEX "cursos_created_at_idx" ON "cursos" USING btree ("created_at");
  CREATE INDEX "galeria_imagenes_imagen_idx" ON "galeria_imagenes" USING btree ("imagen_id");
  CREATE INDEX "galeria_imagenes_updated_at_idx" ON "galeria_imagenes" USING btree ("updated_at");
  CREATE INDEX "galeria_imagenes_created_at_idx" ON "galeria_imagenes" USING btree ("created_at");
  CREATE INDEX "galerias_imagenes_order_idx" ON "galerias_imagenes" USING btree ("_order");
  CREATE INDEX "galerias_imagenes_parent_id_idx" ON "galerias_imagenes" USING btree ("_parent_id");
  CREATE INDEX "galerias_imagenes_imagen_idx" ON "galerias_imagenes" USING btree ("imagen_id");
  CREATE UNIQUE INDEX "galerias_slug_idx" ON "galerias" USING btree ("slug");
  CREATE INDEX "galerias_updated_at_idx" ON "galerias" USING btree ("updated_at");
  CREATE INDEX "galerias_created_at_idx" ON "galerias" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_cursos_id_idx" ON "payload_locked_documents_rels" USING btree ("cursos_id");
  CREATE INDEX "payload_locked_documents_rels_galeria_imagenes_id_idx" ON "payload_locked_documents_rels" USING btree ("galeria_imagenes_id");
  CREATE INDEX "payload_locked_documents_rels_galerias_id_idx" ON "payload_locked_documents_rels" USING btree ("galerias_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "configuracion_sitio_marcas_order_idx" ON "configuracion_sitio_marcas" USING btree ("_order");
  CREATE INDEX "configuracion_sitio_marcas_parent_id_idx" ON "configuracion_sitio_marcas" USING btree ("_parent_id");
  CREATE INDEX "configuracion_sitio_marcas_logo_idx" ON "configuracion_sitio_marcas" USING btree ("logo_id");
  CREATE INDEX "configuracion_sitio_revistas_order_idx" ON "configuracion_sitio_revistas" USING btree ("_order");
  CREATE INDEX "configuracion_sitio_revistas_parent_id_idx" ON "configuracion_sitio_revistas" USING btree ("_parent_id");
  CREATE INDEX "configuracion_sitio_revistas_logo_idx" ON "configuracion_sitio_revistas" USING btree ("logo_id");
  CREATE INDEX "configuracion_sitio_videos_order_idx" ON "configuracion_sitio_videos" USING btree ("_order");
  CREATE INDEX "configuracion_sitio_videos_parent_id_idx" ON "configuracion_sitio_videos" USING btree ("_parent_id");
  CREATE INDEX "configuracion_sitio_videos_archivo_idx" ON "configuracion_sitio_videos" USING btree ("archivo_id");
  CREATE INDEX "pagina_bio_parrafos_order_idx" ON "pagina_bio_parrafos" USING btree ("_order");
  CREATE INDEX "pagina_bio_parrafos_parent_id_idx" ON "pagina_bio_parrafos" USING btree ("_parent_id");
  CREATE INDEX "pagina_bio_foto_idx" ON "pagina_bio" USING btree ("foto_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "cursos_intro_heading_lines" CASCADE;
  DROP TABLE "cursos_intro_paragraphs" CASCADE;
  DROP TABLE "cursos_intro_chips" CASCADE;
  DROP TABLE "cursos_learning_items" CASCADE;
  DROP TABLE "cursos_director_name_lines" CASCADE;
  DROP TABLE "cursos_director_stats" CASCADE;
  DROP TABLE "cursos_academy_modalities" CASCADE;
  DROP TABLE "cursos_academy_photos" CASCADE;
  DROP TABLE "cursos_cta_heading_lines" CASCADE;
  DROP TABLE "cursos_cta_includes" CASCADE;
  DROP TABLE "cursos" CASCADE;
  DROP TABLE "galeria_imagenes" CASCADE;
  DROP TABLE "galerias_imagenes" CASCADE;
  DROP TABLE "galerias" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "configuracion_sitio_marcas" CASCADE;
  DROP TABLE "configuracion_sitio_revistas" CASCADE;
  DROP TABLE "configuracion_sitio_videos" CASCADE;
  DROP TABLE "configuracion_sitio" CASCADE;
  DROP TABLE "pagina_inicio" CASCADE;
  DROP TABLE "pagina_bio_parrafos" CASCADE;
  DROP TABLE "pagina_bio" CASCADE;
  DROP TABLE "pagina_galeria" CASCADE;
  DROP TABLE "pagina_comercial" CASCADE;
  DROP TABLE "pagina_novia" CASCADE;
  DROP TABLE "pagina_contacto" CASCADE;
  DROP TYPE "public"."enum_galeria_imagenes_seccion";
  DROP TYPE "public"."enum_configuracion_sitio_videos_categoria";`)
}
