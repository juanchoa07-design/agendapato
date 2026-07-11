-- Esquema para la app de agenda del lavadero.
-- Correr este script completo en el SQL Editor de tu proyecto de Supabase.

create extension if not exists "pgcrypto";

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duration_minutes integer not null default 30,
  price numeric,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  service_id uuid references services(id) on delete set null,
  appointment_date date not null,
  appointment_time time not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  unique (appointment_date, appointment_time)
);

alter table services enable row level security;
alter table appointments enable row level security;

-- Servicios: cualquiera puede ver los activos (para el formulario público).
drop policy if exists "public can read active services" on services;
create policy "public can read active services"
  on services for select
  to anon
  using (active = true);

-- Servicios: solo el dueño logueado puede administrar (crear/editar/borrar/ver todos).
drop policy if exists "authenticated can manage services" on services;
create policy "authenticated can manage services"
  on services for all
  to authenticated
  using (true)
  with check (true);

-- Turnos: cualquiera puede agendarse (insertar), pero no puede leer ni modificar turnos ajenos.
drop policy if exists "public can create appointments" on appointments;
create policy "public can create appointments"
  on appointments for insert
  to anon
  with check (true);

-- Turnos: solo el dueño logueado puede ver y administrar la agenda.
drop policy if exists "authenticated can manage appointments" on appointments;
create policy "authenticated can manage appointments"
  on appointments for all
  to authenticated
  using (true)
  with check (true);

-- Función pública para calcular horarios libres: devuelve solo los horarios
-- ocupados de una fecha (sin datos del cliente), para que el formulario de
-- reserva pueda mostrar la grilla de disponibilidad sin exponer la tabla completa.
create or replace function get_booked_times(p_date date)
returns table(appointment_time time)
language sql
security definer
stable
as $$
  select appointment_time from appointments
  where appointment_date = p_date and status <> 'cancelled';
$$;

revoke all on function get_booked_times(date) from public;
grant execute on function get_booked_times(date) to anon, authenticated;

-- Datos de ejemplo para arrancar (podés editarlos luego desde /admin/servicios).
insert into services (name, duration_minutes, price) values
  ('Lavado exterior', 30, 3000),
  ('Lavado completo', 45, 5000),
  ('Lavado + encerado', 60, 8000)
on conflict do nothing;
