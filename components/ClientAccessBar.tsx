"use client";

import { useEffect, useState } from "react";

type Access = {
  phone: string;
  name: string;
  status: "cliente" | "profesional";
  discountPercent: number | null;
  appliesProductos: boolean;
};

const STORAGE_KEY = "md_access";

export default function ClientAccessBar() {
  const [access, setAccess] = useState<Access | null>(null);
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setAccess(JSON.parse(raw));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setNotFound(false);

    const res = await fetch("/api/registrations/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!data.found || data.status === "pendiente") {
      setNotFound(true);
      return;
    }

    const next: Access = {
      phone,
      name: data.name,
      status: data.status,
      discountPercent: data.discountPercent ?? null,
      appliesProductos: Boolean(data.appliesProductos),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.location.reload();
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }

  if (access) {
    return (
      <div className="rounded-2xl bg-brand-600 text-white px-5 py-3 mb-8 flex items-center justify-between flex-wrap gap-2 text-sm">
        <span>
          Hola, {access.name} — estás viendo precios de{" "}
          {access.status === "profesional" ? "profesional" : "cliente"}.
        </span>
        <button onClick={handleLogout} className="underline hover:no-underline">
          Salir
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-brand-200 bg-brand-50/60 px-5 py-4 mb-8">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="text-sm font-medium text-brand-700 hover:underline"
        >
          ¿Sos cliente o profesional? Ingresá tu teléfono para ver tus precios
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-ink-soft mb-1.5">Tu teléfono</label>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej: 2954123456"
              className="rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-brand-600 text-white text-sm font-medium px-5 py-2 hover:bg-brand-700 transition-colors disabled:opacity-60"
          >
            {submitting ? "Buscando…" : "Ver mis precios"}
          </button>
          {notFound && (
            <span className="text-xs text-red-500 w-full">
              No encontramos ese número o todavía no tenés un descuento asignado.
            </span>
          )}
        </form>
      )}
    </div>
  );
}
