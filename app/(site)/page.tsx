import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import { getSettings, getEmployees } from "@/lib/db";

export default async function HomePage() {
  const [settings, employees] = await Promise.all([getSettings(), getEmployees()]);

  const areas = [
    {
      href: "/servicios",
      title: "Servicios",
      desc: "Tratamientos de estética facial y corporal realizados por profesionales.",
      icon: "M12 2a5 5 0 0 1 5 5c0 2.5-2 4-2 6v2H9v-2c0-2-2-3.5-2-6a5 5 0 0 1 5-5zM9 19h6M10 22h4",
    },
    {
      href: "/escuela",
      title: "Escuela Profesional",
      desc: "Cursos, talleres y capacitaciones para formarte como profesional de la belleza.",
      icon: "M22 10l-10-5L2 10l10 5 10-5zM6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5",
    },
    {
      href: "/multidistribuidora",
      title: "Multidistribuidora",
      desc: "Venta de productos de cosmética profesional para vos y tu negocio.",
      icon: "M3 7l1.5-3h15L21 7M3 7v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7M3 7h18M9 11a3 3 0 0 0 6 0",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <div className="relative w-full max-h-[560px] aspect-[3/2] overflow-hidden bg-white">
          <Image
            src="/hero.png"
            alt="Mara Diaz — Centro de Estudios y Estética Integral"
            fill
            priority
            className="object-contain"
          />
        </div>
        <div className="bg-gradient-to-r from-brand-700 to-brand-500 py-6">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/servicios"
              className="rounded-full bg-white text-brand-700 font-semibold px-7 py-3 text-sm shadow-lg hover:bg-brand-50 transition-colors"
            >
              Ver servicios
            </Link>
            <Link
              href="/escuela"
              className="rounded-full border border-white/70 text-white font-semibold px-7 py-3 text-sm hover:bg-white/10 transition-colors"
            >
              Ver cursos
            </Link>
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink">Nuestras áreas</h2>
          <p className="mt-3 text-ink-soft">
            Tres formas de acompañarte: cuidando tu piel, formándote como profesional, y abasteciendo tu negocio.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {areas.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group rounded-2xl border border-brand-100 p-8 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-100/50 transition-all bg-white"
            >
              <div className="h-14 w-14 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d={a.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-ink mb-2">{a.title}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{a.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:gap-2 transition-all">
                Conocer más →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Registro */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">Sumate a la comunidad Mara Diaz</h2>
            <p className="text-white/70 max-w-xl">
              Registrate con tu nombre y WhatsApp — podés llegar a recibir descuentos exclusivos en servicios,
              cursos o productos.
            </p>
          </div>
          <Link
            href="/registro"
            className="shrink-0 rounded-full bg-brand-500 text-white font-semibold px-7 py-3 text-sm shadow-lg hover:bg-brand-400 transition-colors"
          >
            Registrarme
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="bg-brand-50/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 grid gap-12 md:grid-cols-2 items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink mb-4">Quiénes somos</h2>
            <p className="text-ink-soft leading-relaxed mb-6">{settings.bio}</p>
            <ul className="space-y-3">
              {employees.map((e) => (
                <li key={e.id} className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-full bg-brand-200 text-brand-800 flex items-center justify-center font-display font-semibold text-sm shrink-0">
                    {e.name.charAt(0)}
                  </span>
                  <div>
                    <p className="font-medium text-ink text-sm">{e.name}</p>
                    <p className="text-xs text-ink-soft">{e.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-brand-400 to-brand-700 aspect-[4/3] flex items-center justify-center text-white">
            <div className="scale-[2.2]">
              <Logo size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink mb-4">¿Hablamos?</h2>
        <p className="text-ink-soft mb-8 max-w-xl mx-auto">
          Escribinos por WhatsApp o seguinos en redes para conocer novedades, cursos y promociones.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#25D366] text-white font-semibold px-7 py-3 text-sm shadow-lg hover:opacity-90 transition-opacity"
          >
            WhatsApp
          </a>
          <a
            href={settings.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 text-white font-semibold px-7 py-3 text-sm shadow-lg hover:opacity-90 transition-opacity"
          >
            Instagram
          </a>
          <a
            href={settings.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#1877F2] text-white font-semibold px-7 py-3 text-sm shadow-lg hover:opacity-90 transition-opacity"
          >
            Facebook
          </a>
        </div>
      </section>
    </div>
  );
}
