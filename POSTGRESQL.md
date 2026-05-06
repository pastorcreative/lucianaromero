# Configuración de PostgreSQL para Payload CMS

## Instalación de PostgreSQL

### macOS (Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Windows
Descarga e instala desde: https://www.postgresql.org/download/windows/

### Docker (multiplataforma)
```bash
docker run --name postgres-payload \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=payload \
  -p 5432:5432 \
  -d postgres:15
```

## Crear la base de datos

Una vez que PostgreSQL esté instalado y ejecutándose:

```bash
# Si no requiere contraseña (instalación local por defecto)
createdb payload

# Si requiere autenticación
psql -U postgres -c "CREATE DATABASE payload;"
```

## Configuración de cadena de conexión

Edita `apps/payload-cms/.env`:

```bash
# PostgreSQL local sin contraseña
DATABASE_URI=postgres://localhost:5432/payload

# PostgreSQL local con usuario y contraseña
DATABASE_URI=postgres://postgres:postgres@localhost:5432/payload

# PostgreSQL con Docker
DATABASE_URI=postgres://postgres:postgres@localhost:5432/payload

# PostgreSQL remoto (Railway, Render, Supabase, etc)
DATABASE_URI=postgres://usuario:contraseña@host.provider.com:5432/payload?sslmode=require
```

## Verificar conexión

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Listar bases de datos
\l

# Conectarse a la base de datos payload
\c payload

# Listar tablas (después de ejecutar Payload por primera vez)
\dt

# Salir
\q
```

## Proveedores de PostgreSQL (opciones cloud)

Si no quieres instalar PostgreSQL localmente, puedes usar:

- **Supabase**: https://supabase.com (incluye PostgreSQL gratis)
- **Railway**: https://railway.app (fácil de usar, tier gratuito)
- **Render**: https://render.com (PostgreSQL gratis)
- **Neon**: https://neon.tech (PostgreSQL serverless, tier gratuito)
- **Vercel Postgres**: https://vercel.com/storage/postgres (integrado con Vercel)

## Troubleshooting

### Error: "Connection refused"
- Verifica que PostgreSQL esté corriendo: `brew services list` (macOS) o `sudo systemctl status postgresql` (Linux)
- Verifica el puerto: PostgreSQL usa 5432 por defecto

### Error: "authentication failed"
- Verifica usuario y contraseña en la cadena de conexión
- En instalaciones locales nuevas, el usuario suele ser `postgres` sin contraseña

### Error: "database does not exist"
- Asegúrate de crear la base de datos primero: `createdb payload`
