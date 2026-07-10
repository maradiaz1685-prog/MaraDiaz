import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappButton from "@/components/WhatsappButton";
import { getSettings, getServices, getCourses, getProducts } from "@/lib/db";

// El contenido se administra desde el panel y tiene que reflejarse al
// instante en el sitio público, sin esperar un redeploy — nunca renderizar
// estas páginas como estáticas.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, services, courses, products] = await Promise.all([
    getSettings(),
    getServices(),
    getCourses(),
    getProducts(),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsappButton
        phone={settings.whatsapp}
        services={services.filter((s) => s.active).map((s) => ({ id: s.id, name: s.name }))}
        courses={courses.filter((c) => c.active).map((c) => ({ id: c.id, name: c.name }))}
        products={products.filter((p) => p.active).map((p) => ({ id: p.id, name: p.name }))}
      />
    </>
  );
}
