-- Mara Diaz — registro de clientes/profesionales con descuentos
-- Ejecutar una sola vez en Supabase: Dashboard > SQL Editor > New query > pegar todo > Run

create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  status text not null default 'pendiente' check (status in ('pendiente', 'cliente', 'profesional')),
  discount_percent integer,
  applies_servicios boolean not null default false,
  applies_cursos boolean not null default false,
  applies_productos boolean not null default false,
  access_code text not null unique,
  created_at timestamptz not null default now()
);

alter table registrations enable row level security;
-- Sin policies: todo el acceso pasa por nuestras API routes con la service role key
-- (igual que el resto de las tablas del proyecto).
