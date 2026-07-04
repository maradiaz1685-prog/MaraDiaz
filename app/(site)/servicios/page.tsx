import { getServices } from "@/lib/db";
import { formatPrice } from "@/lib/types";

export const metadata = { title: "Servicios | Mara Diaz" };

export default async function ServiciosPage() {
  const services = (await getServices()).filter((s) => s.active);

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
          {services.map((s) => (
            <article
              key={s.id}
              className="rounded-2xl border border-brand-100 overflow-hidden bg-white hover:shadow-xl hover:shadow-brand-100/50 transition-shadow"
            >
              <div className="h-36 bg-gradient-to-br from-brand-200 to-brand-500 flex items-center justify-center text-white/80">
                {s.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.imageUrl} alt={s.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-display text-3xl">✦</span>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold text-ink mb-2">{s.name}</h3>
                <p className="text-sm text-ink-soft leading-relaxed mb-4">{s.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-soft">{s.durationMin} min</span>
                  <span className="font-semibold text-brand-700">{formatPrice(s.price)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
