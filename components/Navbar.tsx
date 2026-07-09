"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/escuela", label: "Escuela Profesional" },
  { href: "/multidistribuidora", label: "Multidistribuidora" },
  { href: "/#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-brand-100">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-18 py-3">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Logo size="sm" />
          <span className="font-display font-semibold text-lg leading-tight text-ink">
            Mara Diaz
            <span className="block text-[11px] font-sans font-normal tracking-wide text-brand-600 uppercase">
              Escuela Profesional de Estética
            </span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-7 text-sm font-medium text-ink-soft">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-brand-600 transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/registro"
              className="rounded-full bg-brand-600 text-white px-4 py-2 text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              Registrarme
            </Link>
          </li>
        </ul>

        <button
          className="md:hidden text-ink p-2 -mr-2"
          aria-label="Abrir menú"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-brand-100 bg-white">
          <ul className="flex flex-col px-4 py-3 gap-1 text-sm font-medium text-ink-soft">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block py-2.5 hover:text-brand-600 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/registro"
                className="block py-2.5 font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                onClick={() => setOpen(false)}
              >
                Registrarme
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
