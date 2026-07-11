-- Mara Diaz — consultas de "sin stock" desde el carrito de Multidistribuidora
-- Ejecutar una sola vez en Supabase: Dashboard > SQL Editor > New query > pegar todo > Run

create table if not exists stock_requests (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  client_name text not null,
  client_phone text not null,
  message text not null default '',
  status text not null default 'pendiente' check (status in ('pendiente', 'atendida')),
  created_at timestamptz not null default now()
);

alter table stock_requests enable row level security;
-- Sin policies: todo el acceso pasa por nuestras API routes con la service role key
-- (igual que el resto de las tablas del proyecto).
