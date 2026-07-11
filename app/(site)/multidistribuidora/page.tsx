import { getProducts, getDistributors, getSettings } from "@/lib/db";
import ClientAccessBar from "@/components/ClientAccessBar";
import ProductCard from "@/components/ProductCard";
import CartProvider from "@/components/CartProvider";

export const metadata = { title: "Multidistribuidora | Mara Diaz" };

export default async function MultidistribuidoraPage() {
  const [allProducts, distributors, settings] = await Promise.all([getProducts(), getDistributors(), getSettings()]);
  const products = allProducts.filter((p) => p.active);
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const distributorById = new Map(distributors.map((d) => [d.id, d]));

  const ofertas = products.filter((p) => p.productType === "oferta");
  const estacion = products.filter((p) => p.productType === "estacion");

  return (
    <CartProvider whatsappPhone={settings.whatsapp}>
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <header className="text-center max-w-2xl mx-auto mb-10">
        <p className="uppercase tracking-[0.2em] text-xs font-semibold text-brand-600 mb-3">Distribución</p>
        <h1 className="font-display text-4xl font-bold text-ink mb-4">Multidistribuidora</h1>
        <p className="text-ink-soft">
          Cosmética profesional al alcance de tu mano, para uso personal o para tu negocio.
        </p>
      </header>

      <ClientAccessBar />

      {ofertas.length > 0 && (
        <section className="mb-14">
          <h2 className="font-display text-2xl font-semibold text-ink mb-6">Ofertas</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ofertas.map((p) => (
              <ProductCard key={p.id} product={p} distributor={p.distributorId ? distributorById.get(p.distributorId) ?? null : null} />
            ))}
          </div>
        </section>
      )}

      {estacion.length > 0 && (
        <section className="mb-14">
          <h2 className="font-display text-2xl font-semibold text-ink mb-6">De estación</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {estacion.map((p) => (
              <ProductCard key={p.id} product={p} distributor={p.distributorId ? distributorById.get(p.distributorId) ?? null : null} />
            ))}
          </div>
        </section>
      )}

      {categories.map((cat) => (
        <section key={cat} className="mb-14">
          <h2 className="font-display text-2xl font-semibold text-ink mb-6">{cat}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products
              .filter((p) => p.category === cat)
              .map((p) => (
                <ProductCard key={p.id} product={p} distributor={p.distributorId ? distributorById.get(p.distributorId) ?? null : null} />
              ))}
          </div>
        </section>
      ))}

      {products.length === 0 && (
        <p className="text-center text-ink-soft">Todavía no hay productos cargados.</p>
      )}
    </div>
    </CartProvider>
  );
}
