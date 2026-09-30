import { getServices, getEmployees, getSettings } from "@/lib/db";
import ServiceCard from "@/components/ServiceCard";
import ProfessionalCard from "@/components/ProfessionalCard";

export const metadata = { title: "Servicios | Mara Diaz" };

export default async function ServiciosPage() {
  const [allServices, employees, settings] = await Promise.all([getServices(), getEmployees(), getSettings()]);
  const services = allServices.filter((s) => s.active);
  const servicesWithoutProfessional = services.filter((s) => !s.employeeId);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <header className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-xs font-semibold tracking-widest text-brand-500 uppercase mb-3">Servicios</p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink mb-4">
          Elegí tu tratamiento y a tu profesional
        </h1>
        <p className="text-ink-soft">
          Conocé a nuestro equipo, mirá sus trabajos y contratá directamente por WhatsApp.
        </p>
      </header>

      {employees.length > 0 && (
        <section className="mb-16">
          <h2 className="font-display text-2xl font-semibold text-ink mb-6">Nuestras profesionales</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {employees.map((employee) => (
              <ProfessionalCard
                key={employee.id}
                employee={employee}
                services={services.filter((s) => s.employeeId === employee.id)}
                businessWhatsapp={settings.whatsapp}
              />
            ))}
          </div>
        </section>
      )}

      {servicesWithoutProfessional.length > 0 && (
        <section>
          {employees.length > 0 && (
            <h2 className="font-display text-2xl font-semibold text-ink mb-6">Otros servicios</h2>
          )}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicesWithoutProfessional.map((s) => (
              <ServiceCard key={s.id} service={s} employeeName={null} employeePhone={null} businessWhatsapp={settings.whatsapp} />
            ))}
          </div>
        </section>
      )}

      {services.length === 0 && employees.length === 0 && (
        <p className="text-center text-ink-soft">Todavía no hay servicios cargados.</p>
      )}
    </div>
  );
}
