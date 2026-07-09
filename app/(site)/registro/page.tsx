"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegistroPage() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nombre, phone: telefono }),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError("No se pudo completar el registro. Probá de nuevo.");
      return;
    }

    setSuccess(true);
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-20">
      <header className="text-center mb-10">
        <p className="uppercase tracking-[0.2em] text-xs font-semibold text-brand-600 mb-3">Mara Diaz</p>
        <h1 className="font-display text-3xl font-bold text-ink mb-4">Registrate</h1>
        <p className="text-ink-soft text-sm">
          Dejanos tu nombre y WhatsApp. Vas a formar parte de nuestra comunidad y podés llegar a recibir
          descuentos exclusivos en servicios, cursos o productos.
        </p>
      </header>

      {success ? (
        <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-8 text-center">
          <p className="text-brand-700 font-semibold mb-2">¡Listo, {nombre}!</p>
          <p className="text-sm text-ink-soft mb-6">
            Te registramos correctamente. Si te asignamos un descuento, te vamos a avisar por WhatsApp.
          </p>
          <Link
            href="/"
            className="inline-block rounded-full bg-brand-600 text-white text-sm font-medium px-6 py-2.5 hover:bg-brand-700 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-brand-100 bg-white p-8 flex flex-col gap-4 shadow-sm">
          <div>
            <label className="block text-xs font-medium text-ink-soft mb-1.5">Nombre</label>
            <input
              required
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-soft mb-1.5">WhatsApp</label>
            <input
              required
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: 2954123456"
              className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-brand-600 text-white text-sm font-semibold py-2.5 hover:bg-brand-700 transition-colors disabled:opacity-60"
          >
            {submitting ? "Registrando…" : "Registrarme"}
          </button>
        </form>
      )}
    </div>
  );
}
