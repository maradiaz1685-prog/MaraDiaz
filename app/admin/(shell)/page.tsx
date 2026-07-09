import Link from "next/link";
import { getServices, getCourses, getProducts, getEmployees } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function AdminDashboard() {
  const [services, courses, products, employees, pendingResult] = await Promise.all([
    getServices(),
    getCourses(),
    getProducts(),
    getEmployees(),
    supabaseAdmin.from("registrations").select("id", { count: "exact", head: true }).eq("status", "pendiente"),
  ]);

  const pendingCount = pendingResult.count ?? 0;

  const cards = [
    { href: "/admin/servicios", label: "Servicios", count: services.length },
    { href: "/admin/cursos", label: "Escuela Profesional", count: courses.length },
    { href: "/admin/productos", label: "Multidistribuidora", count: products.length },
    { href: "/admin/empleados", label: "Empleados", count: employees.length },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Panel</h1>
      <p className="text-ink-soft text-sm mb-8">
        Bienvenida, Mara. Desde acá cargás y modificás todo el contenido del sitio.
      </p>

      {pendingCount > 0 && (
        <Link
          href="/admin/registros"
          className="block rounded-2xl border border-red-200 bg-red-50 p-5 mb-8 hover:border-red-300 transition-colors"
        >
          <p className="text-sm font-semibold text-red-600">
            {pendingCount} {pendingCount === 1 ? "persona nueva se registró" : "personas nuevas se registraron"} en el sitio
          </p>
          <p className="text-xs text-red-500 mt-0.5">Tocá acá para revisar y decidir si les das un descuento</p>
        </Link>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-brand-100 bg-white p-6 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100/50 transition-all"
          >
            <p className="text-3xl font-display font-bold text-brand-600">{c.count}</p>
            <p className="text-sm font-medium text-ink mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Link
          href="/admin/horarios"
          className="rounded-2xl border border-brand-100 bg-white p-6 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100/50 transition-all"
        >
          <p className="text-sm font-medium text-ink">Horarios de atención</p>
          <p className="text-xs text-ink-soft mt-1">Editar días y horarios</p>
        </Link>
        <Link
          href="/admin/configuracion"
          className="rounded-2xl border border-brand-100 bg-white p-6 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100/50 transition-all"
        >
          <p className="text-sm font-medium text-ink">Configuración</p>
          <p className="text-xs text-ink-soft mt-1">Teléfono, redes sociales y datos del negocio</p>
        </Link>
      </div>
    </div>
  );
}
