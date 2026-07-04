import { readData } from "@/lib/data";
import { formatPrice, type Course, type CourseType } from "@/lib/types";

export const metadata = { title: "Escuela Profesional | Mara Diaz" };

const typeLabels: Record<CourseType, string> = {
  curso: "Cursos",
  taller: "Talleres",
  capacitacion: "Capacitaciones",
};

const typeOrder: CourseType[] = ["curso", "taller", "capacitacion"];

export default async function EscuelaPage() {
  const courses = (await readData<Course[]>("courses.json")).filter((c) => c.active);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <header className="text-center max-w-2xl mx-auto mb-14">
        <p className="uppercase tracking-[0.2em] text-xs font-semibold text-brand-600 mb-3">Formación</p>
        <h1 className="font-display text-4xl font-bold text-ink mb-4">Escuela Profesional</h1>
        <p className="text-ink-soft">
          Cursos, talleres y capacitaciones para formarte y actualizarte como profesional de la estética.
        </p>
      </header>

      {typeOrder.map((type) => {
        const items = courses.filter((c) => c.type === type);
        if (items.length === 0) return null;
        return (
          <section key={type} className="mb-14">
            <h2 className="font-display text-2xl font-semibold text-ink mb-6">{typeLabels[type]}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => (
                <article
                  key={c.id}
                  className="rounded-2xl border border-brand-100 overflow-hidden bg-white hover:shadow-xl hover:shadow-brand-100/50 transition-shadow"
                >
                  <div className="h-32 bg-gradient-to-br from-ink to-brand-700 flex items-center justify-center text-white/80">
                    {c.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.imageUrl} alt={c.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-display text-3xl">🎓</span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-semibold text-ink mb-2">{c.name}</h3>
                    <dl className="text-sm text-ink-soft space-y-1 mb-4">
                      <div className="flex justify-between">
                        <dt>Modalidad</dt>
                        <dd className="text-ink">{c.modality}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Duración</dt>
                        <dd className="text-ink">{c.duration}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Próximo inicio</dt>
                        <dd className="text-ink">
                          {new Date(c.startDate + "T00:00:00").toLocaleDateString("es-AR", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </dd>
                      </div>
                    </dl>
                    <div className="text-right font-semibold text-brand-700">{formatPrice(c.price)}</div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}

      {courses.length === 0 && (
        <p className="text-center text-ink-soft">Todavía no hay cursos cargados.</p>
      )}
    </div>
  );
}
