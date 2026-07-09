-- Mara Diaz — datos adicionales de registro: provincia, ciudad, dirección, ya-cliente
-- Ejecutar una sola vez en Supabase: Dashboard > SQL Editor > New query > pegar todo > Run

alter table registrations add column if not exists province text not null default '';
alter table registrations add column if not exists city text not null default '';
alter table registrations add column if not exists address text not null default '';
alter table registrations add column if not exists already_client boolean not null default false;
