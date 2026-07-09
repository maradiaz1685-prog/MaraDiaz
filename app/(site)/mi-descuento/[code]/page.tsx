import Link from "next/link";
import { getRegistrationByCode, getServices, getCourses, getProducts } from "@/lib/db";
import { formatPrice, discountedPrice } from "@/lib/types";

export const metadata = { title: "Tu descuento | Mara Diaz" };

export default async function MiDescuentoPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const registration = await getRegistrationByCode(code);

  if (!registration || registration.status === "pendiente" || !registration.discountPercent) {
    return (
      <div className="mx-auto max-w-md px-4 sm:px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-ink mb-3">No encontramos este descuento</h1>
        <p className="text-ink-soft text-sm mb-6">
          El link no es válido o todavía no tenés un descuento asignado. Si creés que es un error, escribinos.
        </p>
        <Link href="/" className="text-brand-600 font-medium hover:underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const percent = registration.discountPercent;
  const isProfesional = registration.status === "profesional";

  const [services, courses, products] = await Promise.all([
    registration.appliesServicios ? getServices() : Promise.resolve([]),
    registration.appliesCursos ? getCourses() : Promise.resolve([]),
    registration.appliesProductos ? getProducts() : Promise.resolve([]),
  ]);

  const activeServices = services.filter((s) => s.active);
  const activeCourses = courses.filter((c) => c.active);
  const activeProducts = products.filter((p) => p.active);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <header className="text-center max-w-2xl mx-auto mb-14">
        <p className="uppercase tracking-[0.2em] text-xs font-semibold text-brand-600 mb-3">
          {isProfesional ? "Descuento profesional" : "Descuento exclusivo"}
        </p>
        <h1 className="font-display text-4xl font-bold text-ink mb-4">¡Hola, {registration.name}!</h1>
        <p className="text-ink-soft">
          {isProfesional
            ? `La administración te da un ${percent}% de descuento por ser profesional. ¡Bienvenido/a a Mara Diaz!`
            : `Por registrarte en Mara Diaz, tenés un ${percent}% de descuento. ¡Gracias por sumarte!`}
        </p>
        <span className="inline-block mt-5 rounded-full bg-brand-600 text-white font-display font-bold text-lg px-6 py-2">
          {percent}% OFF
        </span>
      </header>

      {activeServices.length > 0 && (
        <section className="mb-16">
          <h2 className="font-display text-2xl font-semibold text-ink mb-6">Servicios</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeServices.map((s) => (
              <article key={s.id} className="rounded-2xl border border-brand-100 bg-white p-6">
                <h3 className="font-display text-lg font-semibold text-ink mb-2">{s.name}</h3>
                <p className="text-sm text-ink-soft mb-4">{s.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-soft">{s.durationMin} min</span>
                  <span>
                    <span className="text-ink-soft line-through mr-2">{formatPrice(s.price)}</span>
                    <span className="font-semibold text-brand-700">{formatPrice(discountedPrice(s.price, percent))}</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeCourses.length > 0 && (
        <section className="mb-16">
          <h2 className="font-display text-2xl font-semibold text-ink mb-6">Escuela Profesional</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeCourses.map((c) => (
              <article key={c.id} className="rounded-2xl border border-brand-100 bg-white p-6">
                <h3 className="font-display text-lg font-semibold text-ink mb-2">{c.name}</h3>
                <p className="text-sm text-ink-soft mb-4">
                  {c.modality} · {c.duration}
                </p>
                <div className="text-right text-sm">
                  <span className="text-ink-soft line-through mr-2">{formatPrice(c.price)}</span>
                  <span className="font-semibold text-brand-700">{formatPrice(discountedPrice(c.price, percent))}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeProducts.length > 0 && (
        <section className="mb-16">
          <h2 className="font-display text-2xl font-semibold text-ink mb-6">Multidistribuidora</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeProducts.map((p) => (
              <article key={p.id} className="rounded-2xl border border-brand-100 bg-white p-6">
                <h3 className="font-display text-lg font-semibold text-ink mb-2">{p.name}</h3>
                <p className="text-sm text-ink-soft mb-4">{p.category}</p>
                <div className="text-right text-sm">
                  <span className="text-ink-soft line-through mr-2">{formatPrice(p.price)}</span>
                  <span className="font-semibold text-brand-700">{formatPrice(discountedPrice(p.price, percent))}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="text-center">
        <p className="text-sm text-ink-soft">
          Mostrá esta página o mencioná tu nombre al contactarnos para aplicar tu descuento.
        </p>
      </div>
    </div>
  );
}
