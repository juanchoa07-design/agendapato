# Agenda del lavadero

App para que los clientes agenden turnos de lavado online y el dueño gestione la agenda desde un panel de administración.

- **Público** (`/`): formulario de reserva (nombre, teléfono, email, servicio, fecha y horario disponible).
- **Admin** (`/admin/agenda`, `/admin/servicios`): login del dueño, ver/gestionar los turnos del día y administrar los servicios ofrecidos.

Construida con Next.js (App Router) + TypeScript + Tailwind CSS + Supabase (Postgres + Auth).

## 1. Crear el proyecto en Supabase

1. Andá a [supabase.com](https://supabase.com), creá una cuenta gratis y un nuevo proyecto.
2. En el proyecto, andá a **SQL Editor** → **New query**, pegá el contenido de [`supabase/schema.sql`](./supabase/schema.sql) y ejecutalo. Esto crea las tablas `services` y `appointments`, las políticas de seguridad (RLS) y carga 3 servicios de ejemplo.
3. Andá a **Authentication → Users → Add user** y creá el usuario del dueño (email + contraseña). Con esa cuenta vas a entrar a `/admin`.
4. Andá a **Project Settings → API** y copiá:
   - **Project URL**
   - **anon public key**

## 2. Configurar las variables de entorno

Copiá `.env.local.example` a `.env.local` y completá con los valores del paso anterior:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

## 3. Correr el proyecto localmente

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) para la página de reserva, y [http://localhost:3000/admin](http://localhost:3000/admin) para el panel del dueño (te va a pedir el email/contraseña que creaste en el paso 1.3).

## Cómo funciona

- **Horario comercial y duración de los turnos**: se configura en [`lib/slots.ts`](./lib/slots.ts) (`BUSINESS_HOURS` y `SLOT_MINUTES`). Por defecto: lunes a viernes 8:00–18:00, sábados 8:00–13:00, turnos cada 30 minutos, domingo cerrado.
- **Servicios**: se administran desde `/admin/servicios` (nombre, duración, precio, activo/inactivo). Solo los servicios activos aparecen en el formulario público.
- **Turnos**: cualquiera puede crear un turno desde `/`, pero solo el dueño autenticado puede verlos y cambiarles el estado (completado/cancelado) desde `/admin/agenda`. Esto está garantizado por las políticas de RLS en `supabase/schema.sql`, no solo por la interfaz.
- **Un turno por horario**: la base de datos impide que se reserve dos veces el mismo día y hora (constraint `unique` en `appointments`).

## Desplegar (cuando quieras publicarlo)

El proyecto está listo para desplegar en [Vercel](https://vercel.com) (capa gratuita): conectá el repo, agregá las mismas variables de entorno de `.env.local` en la configuración del proyecto en Vercel, y desplegá. Avisame cuando quieras hacerlo y te ayudo con los pasos.
