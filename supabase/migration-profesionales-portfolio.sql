-- Mara Diaz — galería de fotos de trabajos para cada profesional (empleada)
-- Ejecutar una sola vez en Supabase: Dashboard > SQL Editor > New query > pegar todo > Run

alter table employees
  add column if not exists portfolio_images jsonb not null default '[]'::jsonb;
