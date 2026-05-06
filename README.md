# Luciana Romero - Monorepo

Monorepo con Astro (frontend) y Payload CMS (backend) configurados como workspaces de npm.

## Estructura del Proyecto

```
lucianaromero/
├── apps/
│   ├── astro-app/       # Frontend con Astro
│   └── payload-cms/     # Backend con Payload CMS
├── package.json         # Configuración del monorepo
└── README.md
```

## Requisitos Previos

- Node.js >= 18.0.0
- PostgreSQL (para Payload CMS) - [Ver guía de instalación](./POSTGRESQL.md)

## Instalación

Desde la raíz del monorepo:

```bash
npm install
```

## Configuración

### Payload CMS

1. Copia el archivo de ejemplo de variables de entorno:
   ```bash
   cp apps/payload-cms/.env.example apps/payload-cms/.env
   ```

2. Edita `apps/payload-cms/.env` y configura:
   - `PAYLOAD_SECRET`: Una clave secreta segura
   - `DATABASE_URI`: URL de conexión a PostgreSQL (por defecto: `postgres://localhost:5432/payload`)

3. Crea la base de datos en PostgreSQL:
   ```bash
   createdb payload
   ```
   O si tienes usuario/contraseña:
   ```bash
   psql -U postgres -c "CREATE DATABASE payload;"
   ```

## Comandos Disponibles

### Desarrollo

Ejecutar ambos proyectos en modo desarrollo:
```bash
npm run dev
```

Ejecutar solo Astro:
```bash
npm run dev:astro
```

Ejecutar solo Payload:
```bash
npm run dev:payload
```

### Producción

Build de Astro:
```bash
npm run build:astro
```

Build de Payload:
```bash
npm run build:payload
```

## URLs de Desarrollo

- **Astro**: http://localhost:4321
- **Payload CMS**: http://localhost:3001
- **Payload Admin**: http://localhost:3001/admin

## Tecnologías

### Frontend (Astro)
- **Astro**: 6.2.2
- **GSAP**: 3.15.0 (animaciones)
- **Three.js**: 0.184.0 (3D graphics)
- **Tailwind CSS**: 4.2.4 (styling)

[Ver guía de uso de las librerías frontend](./FRONTEND_LIBS.md)

### Backend (Payload CMS)
- **Payload CMS**: 3.84.1
- **Next.js**: 15.4.11
- **Base de Datos**: PostgreSQL
- **Editor de Contenido**: Lexical

## Próximos Pasos

1. Instala y arranca PostgreSQL en tu máquina local
2. Crea la base de datos: `createdb payload`
3. Configura las variables de entorno en `apps/payload-cms/.env`
4. Ejecuta `npm run dev` para iniciar ambos proyectos
5. Visita http://localhost:3001/admin para crear tu primer usuario en Payload
6. Comienza a desarrollar tu aplicación web

### Ejemplo de cadena de conexión para PostgreSQL

```bash
# PostgreSQL local sin autenticación
DATABASE_URI=postgres://localhost:5432/payload

# PostgreSQL con usuario y contraseña
DATABASE_URI=postgres://usuario:contraseña@localhost:5432/payload

# PostgreSQL remoto (ej: Railway, Supabase, etc)
DATABASE_URI=postgres://usuario:contraseña@host.ejemplo.com:5432/payload
```
