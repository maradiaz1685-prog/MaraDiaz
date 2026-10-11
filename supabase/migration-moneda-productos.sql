-- Mara Diaz — moneda (pesos / dólares) por producto
-- Ejecutar una sola vez en Supabase: Dashboard > SQL Editor > New query > pegar todo > Run

alter table products
  add column if not exists currency text not null default 'ARS';
