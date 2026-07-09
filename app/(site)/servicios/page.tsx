import { getServices, getEmployees } from "@/lib/db";
import ServiceCard from "@/components/ServiceCard";

export const metadata = { title: "Servicios | Mara Diaz" };

export default async function ServiciosPage() {
  const [allServices, employees] = await Promise.all([getServices(), getEmployees()]);
  const services = allServices.filter((s) => s.active);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <header className="text-center max-w-2xl mx-auto mb-14">
        <p className="uppercase tracking-[0.2em] text-xs font-semibold text-brand-600 mb-3">Estética</p>
        <h1 className="font-display text-4xl font-bold text-ink mb-4">Servicios</h1>
        <p className="text-ink-soft">
          Tratamientos faciales y corporales realizados con productos profesionales, pensados para cuidar tu piel.
        </p>
      </header>

      {services.length === 0 ? (
        <p className="text-center text-ink-soft">Todavía no hay servicios cargados.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const employee = employees.find((e) => e.id === s.employeeId);
            return (
              <ServiceCard
                key={s.id}
                service={s}
                employeeName={employee?.name ?? null}
                employeePhone={employee?.phone ?? null}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
