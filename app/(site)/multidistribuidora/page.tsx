import { getProducts } from "@/lib/db";
import { formatPrice } from "@/lib/types";

export const metadata = { title: "Multidistribuidora | Mara Diaz" };

export default async function MultidistribuidoraPage() {
  const products = (await getProducts()).filter((p) => p.active);
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <header className="text-center max-w-2xl mx-auto mb-14">
        <p className="uppercase tracking-[0.2em] text-xs font-semibold text-brand-600 mb-3">Distribución</p>
        <h1 className="font-display text-4xl font-bold text-ink mb-4">Multidistribuidora</h1>
        <p className="text-ink-soft">
          Cosmética profesional al alcance de tu mano, para uso personal o para tu negocio.
        </p>
      </header>

      {categories.map((cat) => (
        <section key={cat} className="mb-14">
          <h2 className="font-display text-2xl font-semibold text-ink mb-6">{cat}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products
              .filter((p) => p.category === cat)
              .map((p) => (
                <article
                  key={p.id}
                  className="rounded-2xl border border-brand-100 overflow-hidden bg-white hover:shadow-xl hover:shadow-brand-100/50 transition-shadow"
                >
                  <div className="h-40 bg-brand-50 flex items-center justify-center text-brand-300">
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-display text-3xl">🧴</span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-semibold text-ink mb-2">{p.name}</h3>
                    <p className="text-sm text-ink-soft leading-relaxed mb-4">{p.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className={p.stock > 0 ? "text-brand-600" : "text-red-500"}>
                        {p.stock > 0 ? `${p.stock} en stock` : "Sin stock"}
                      </span>
                      <span className="font-semibold text-brand-700">{formatPrice(p.price)}</span>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </section>
      ))}

      {products.length === 0 && (
        <p className="text-center text-ink-soft">Todavía no hay productos cargados.</p>
      )}
    </div>
  );
}
