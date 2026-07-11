-- Mara Diaz — distribuidoras/laboratorios + sistema de precios, descuentos y stock por producto
-- Ejecutar una sola vez en Supabase: Dashboard > SQL Editor > New query > pegar todo > Run

create table if not exists distributors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null default '',
  phone text not null default '',
  email text not null default '',
  logo_url text not null default '',
  created_at timestamptz not null default now()
);

alter table distributors enable row level security;
-- Sin policies: todo el acceso pasa por nuestras API routes con la service role key
-- (igual que el resto de las tablas del proyecto).

alter table products
  add column if not exists distributor_id uuid references distributors(id) on delete set null,
  add column if not exists cost numeric not null default 0,
  add column if not exists profit_percent numeric not null default 0,
  add column if not exists professional_discount_percent numeric,
  add column if not exists client_discount_percent numeric,
  add column if not exists product_type text not null default 'normal' check (product_type in ('normal', 'estacion', 'oferta')),
  add column if not exists offer_discount_percent numeric,
  add column if not exists min_stock_alert integer;

alter table settings
  add column if not exists default_professional_discount_percent numeric not null default 0,
  add column if not exists default_client_discount_percent numeric not null default 0,
  add column if not exists default_offer_percent numeric not null default 0;
