import Link from "next/link";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/admin/LogoutButton";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/servicios", label: "Servicios" },
  { href: "/admin/turnos", label: "Turnos" },
  { href: "/admin/registros", label: "Registros" },
  { href: "/admin/cursos", label: "Escuela Profesional" },
  { href: "/admin/productos", label: "Multidistribuidora" },
  { href: "/admin/distribuidoras", label: "Distribuidoras" },
  { href: "/admin/porcentajes", label: "Porcentajes" },
  { href: "/admin/stock", label: "Stock" },
  { href: "/admin/empleados", label: "Empleados" },
  { href: "/admin/horarios", label: "Horarios" },
  { href: "/admin/configuracion", label: "Configuración" },
];

export default async function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const { count: pendingCount } = await supabaseAdmin
    .from("registrations")
    .select("id", { count: "exact", head: true })
    .eq("status", "pendiente");

  const { data: stockRows } = await supabaseAdmin
    .from("products")
    .select("stock, min_stock_alert")
    .not("min_stock_alert", "is", null)
    .gt("min_stock_alert", 0);
  const lowStockCount = (stockRows ?? []).filter((p) => p.stock <= (p.min_stock_alert ?? 0)).length;

  return (
    <div className="min-h-screen flex bg-brand-50/30">
      <aside className="w-64 shrink-0 bg-white border-r border-brand-100 flex flex-col">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-brand-100">
          <Logo size="sm" />
          <div>
            <p className="font-display font-semibold text-sm text-ink">Mara Diaz</p>
            <p className="text-[11px] text-ink-soft">Panel Admin</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-brand-50 hover:text-brand-700 transition-colors"
            >
              {item.label}
              {item.href === "/admin/registros" && Boolean(pendingCount) && (
                <span className="rounded-full bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 leading-none">
                  {pendingCount}
                </span>
              )}
              {item.href === "/admin/stock" && Boolean(lowStockCount) && (
                <span className="rounded-full bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 leading-none">
                  {lowStockCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-brand-100 space-y-1">
          <Link
            href="/"
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-brand-50 transition-colors"
          >
            Ver sitio público
          </Link>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 px-6 sm:px-10 py-10 max-w-5xl">{children}</main>
    </div>
  );
}
