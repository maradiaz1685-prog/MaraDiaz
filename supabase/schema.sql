-- Mara Diaz — schema inicial + datos de ejemplo
-- Ejecutar una sola vez en Supabase: Dashboard > SQL Editor > New query > pegar todo > Run

create extension if not exists pgcrypto;

-- ==================== TABLAS ====================

create table if not exists settings (
  id smallint primary key default 1 check (id = 1),
  owner_name text not null default '',
  bio text not null default '',
  phone text not null default '',
  whatsapp text not null default '',
  instagram text not null default '',
  facebook text not null default '',
  address text not null default ''
);

create table if not exists schedule (
  day text primary key,
  open text not null default '',
  close text not null default '',
  closed boolean not null default false,
  sort_order smallint not null default 0
);

create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  bio text not null default '',
  photo_url text not null default ''
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price numeric not null default 0,
  duration_min integer not null default 0,
  image_url text not null default '',
  active boolean not null default true
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('curso', 'taller', 'capacitacion')),
  modality text not null default '',
  duration text not null default '',
  price numeric not null default 0,
  start_date date,
  image_url text not null default '',
  active boolean not null default true
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price numeric not null default 0,
  category text not null default '',
  stock integer not null default 0,
  image_url text not null default '',
  active boolean not null default true
);

-- ==================== SEGURIDAD ====================
-- RLS habilitado sin policies: solo la service_role key (uso exclusivo del
-- servidor, nunca expuesta al navegador) puede leer/escribir. El sitio público
-- y el panel admin pasan siempre por nuestras propias API routes.

alter table settings enable row level security;
alter table schedule enable row level security;
alter table employees enable row level security;
alter table services enable row level security;
alter table courses enable row level security;
alter table products enable row level security;

-- ==================== DATOS INICIALES ====================

insert into settings (id, owner_name, bio, phone, whatsapp, instagram, facebook, address)
values (
  1,
  'Mara Diaz',
  'Técnica en estética y cosmetología, con años de trayectoria formando profesionales de la belleza. Directora de la Escuela Profesional de Estética Mara Diaz.',
  '+5492954311685',
  '+5492954311685',
  'https://www.instagram.com/maradiaz.sr',
  'https://www.facebook.com/maradiaz.sr',
  'Santa Rosa, La Pampa'
)
on conflict (id) do nothing;

insert into schedule (day, open, close, closed, sort_order) values
  ('Lunes', '09:00', '18:00', false, 1),
  ('Martes', '09:00', '18:00', false, 2),
  ('Miércoles', '09:00', '18:00', false, 3),
  ('Jueves', '09:00', '18:00', false, 4),
  ('Viernes', '09:00', '18:00', false, 5),
  ('Sábado', '09:00', '13:00', false, 6),
  ('Domingo', '', '', true, 7)
on conflict (day) do nothing;

insert into employees (name, role, bio, photo_url) values
  ('Mara Diaz', 'Directora / Esteticista profesional', 'Fundadora de la escuela, especialista en cosmetología y tratamientos faciales.', ''),
  ('Nombre Empleada', 'Cosmetóloga', 'Editá este perfil desde el panel admin con los datos reales del equipo.', '');

insert into services (name, description, price, duration_min, image_url, active) values
  ('Limpieza facial profunda', 'Higiene facial con extracción, exfoliación e hidratación adaptada a cada tipo de piel.', 15000, 60, '', true),
  ('Depilación facial', 'Depilación con cera o hilo, incluye diseño de cejas.', 6000, 30, '', true),
  ('Diseño y laminado de cejas', 'Diseño personalizado con laminado para un efecto duradero y prolijo.', 9000, 45, '', true),
  ('Extensión de pestañas pelo a pelo', 'Aplicación una a una para un efecto natural, con mantenimiento a los 21 días.', 22000, 90, '', true),
  ('Lifting de pestañas', 'Curvatura y realce del pestañeo natural sin necesidad de extensiones.', 12000, 50, '', true),
  ('Peeling químico facial', 'Renovación celular para manchas, acné y textura de la piel.', 18000, 45, '', true),
  ('Masaje descontracturante', 'Masaje corporal para aliviar tensión muscular y mejorar la circulación.', 16000, 60, '', true),
  ('Manicuría y esmaltado semipermanente', 'Cuidado de manos con esmaltado semipermanente de larga duración.', 10000, 60, '', true),
  ('Depilación definitiva (sesión)', 'Tratamiento de depilación definitiva por zona, con equipamiento profesional.', 14000, 30, '', true);

insert into courses (name, type, modality, duration, price, start_date, image_url, active) values
  ('Curso de Maquillaje Profesional', 'curso', 'Presencial', '3 meses', 45000, '2026-08-03', '', true),
  ('Capacitación en Cosmetología', 'capacitacion', 'Presencial e intensivo', '6 meses', 80000, '2026-09-01', '', true),
  ('Curso de Cosmiatría', 'curso', 'Presencial', '4 meses', 65000, '2026-08-17', '', true),
  ('Taller de Extensión de Pestañas', 'taller', 'Presencial', '1 día', 20000, '2026-07-20', '', true),
  ('Taller de Diseño y Laminado de Cejas', 'taller', 'Presencial', '1 día', 18000, '2026-07-27', '', true),
  ('Curso de Manicuría y Esmaltado Semipermanente', 'curso', 'Presencial', '2 meses', 38000, '2026-08-10', '', true),
  ('Capacitación en Depilación Definitiva', 'capacitacion', 'Presencial', '1 mes', 40000, '2026-09-14', '', true),
  ('Taller de Automaquillaje', 'taller', 'Presencial', '1 día', 12000, '2026-08-08', '', true);

insert into products (name, description, price, category, stock, image_url, active) values
  ('Kit de Cosméticos Premium', 'Set completo para maquillaje profesional: base, corrector, rubor y polvos.', 32000, 'Maquillaje', 10, '', true),
  ('Paleta de sombras profesional', '18 tonos mate y shimmer de alta pigmentación.', 21000, 'Maquillaje', 14, '', true),
  ('Crema hidratante facial', 'Hidratación profunda para todo tipo de piel, uso diario.', 8500, 'Skincare', 25, '', true),
  ('Sérum de ácido hialurónico', 'Hidratación intensiva y efecto antiedad.', 13500, 'Skincare', 18, '', true),
  ('Protector solar facial FPS 50', 'Protección diaria con base libre de aceites.', 11000, 'Skincare', 20, '', true),
  ('Set de pinceles profesionales', '12 pinceles de alta calidad para maquillaje profesional.', 18000, 'Accesorios', 15, '', true),
  ('Esponjas de maquillaje (pack x3)', 'Esponjas blending para base y corrector.', 4500, 'Accesorios', 30, '', true),
  ('Esmalte semipermanente', 'Larga duración, gran variedad de colores.', 6500, 'Uñas', 40, '', true),
  ('Kit de manicuría profesional', 'Herramientas completas para manicuría y pedicuría.', 24000, 'Uñas', 8, '', true),
  ('Aceite capilar reparador', 'Nutrición e hidratación para puntas resecas.', 9500, 'Cabello', 22, '', true),
  ('Plancha de pestañas eléctrica', 'Curvatura profesional sin necesidad de rulero.', 15500, 'Accesorios', 12, '', true);
