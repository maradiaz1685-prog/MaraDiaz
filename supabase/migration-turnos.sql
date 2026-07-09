-- Mara Diaz — turnos: empleados extendidos, horarios por servicio, reservas
-- Ejecutar una sola vez en Supabase: Dashboard > SQL Editor > New query > pegar todo > Run

-- ==================== EMPLEADOS: nuevos campos ====================

alter table employees add column if not exists category text not null default '';
alter table employees add column if not exists phone text not null default '';
alter table employees add column if not exists address text not null default '';
alter table employees add column if not exists license_number text not null default '';

-- ==================== SERVICIOS: empleado asignado + horario ====================

alter table services add column if not exists employee_id uuid references employees(id) on delete set null;
alter table services add column if not exists schedule_start text;
alter table services add column if not exists schedule_end text;
alter table services add column if not exists slot_duration_min integer;

-- ==================== TURNOS ====================

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  booking_date date not null,
  time_slot text not null,
  client_name text not null,
  client_phone text not null,
  created_at timestamptz not null default now(),
  unique (service_id, booking_date, time_slot)
);

alter table bookings enable row level security;
-- Sin policies: todo el acceso pasa por nuestras API routes con la service role key
-- (igual que el resto de las tablas del proyecto).

-- Ejemplo: asignar categoría/matrícula a la directora y armar un servicio con horario
-- (opcional — podés cargar esto después desde el panel admin en vez de correrlo acá)
-- update employees set category = 'Estética general', phone = '+5492954311685', address = 'Santa Rosa, La Pampa', license_number = '' where name = 'Mara Diaz';
