import Link from "next/link";
import Logo from "./Logo";
import { getSettings, getSchedule } from "@/lib/db";

export default async function Footer() {
  const [settings, schedule] = await Promise.all([getSettings(), getSchedule()]);

  return (
    <footer id="contacto" className="bg-ink text-white/80 mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Logo size="sm" />
            <span className="font-display font-semibold text-white text-lg">Mara Diaz</span>
          </div>
          <p className="text-sm leading-relaxed text-white/60">{settings.bio}</p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Secciones</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/servicios" className="hover:text-brand-300 transition-colors">Servicios</Link></li>
            <li><Link href="/escuela" className="hover:text-brand-300 transition-colors">Escuela Profesional</Link></li>
            <li><Link href="/multidistribuidora" className="hover:text-brand-300 transition-colors">Multidistribuidora</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Contacto</h3>
          <ul className="space-y-2 text-sm">
            <li>{settings.address}</li>
            <li>
              <a href={`tel:${settings.phone}`} className="hover:text-brand-300 transition-colors">
                {settings.phone}
              </a>
            </li>
            <li>
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-brand-300 transition-colors">
                Instagram
              </a>
            </li>
            <li>
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-brand-300 transition-colors">
                Facebook
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Horarios</h3>
          <ul className="space-y-1.5 text-sm">
            {schedule.map((d) => (
              <li key={d.day} className="flex justify-between gap-4">
                <span>{d.day}</span>
                <span className="text-white/50">{d.closed ? "Cerrado" : `${d.open} - ${d.close}`}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Mara Diaz — Escuela Profesional de Estética. Todos los derechos reservados.
      </div>
    </footer>
  );
}
