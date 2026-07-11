"use client";

import { useEffect, useState } from "react";

export default function AdminPorcentajesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [professionalPercent, setProfessionalPercent] = useState(0);
  const [applyProfessionalAll, setApplyProfessionalAll] = useState(false);
  const [clientPercent, setClientPercent] = useState(0);
  const [applyClientAll, setApplyClientAll] = useState(false);
  const [offerPercent, setOfferPercent] = useState(0);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setProfessionalPercent(data.defaultProfessionalDiscountPercent ?? 0);
        setClientPercent(data.defaultClientDiscountPercent ?? 0);
        setOfferPercent(data.defaultOfferPercent ?? 0);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        defaultProfessionalDiscountPercent: professionalPercent,
        defaultClientDiscountPercent: clientPercent,
        defaultOfferPercent: offerPercent,
      }),
    });

    if (applyProfessionalAll) {
      await fetch("/api/products/apply-percent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: "professional", percent: professionalPercent }),
      });
    }
    if (applyClientAll) {
      await fetch("/api/products/apply-percent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: "client", percent: clientPercent }),
      });
    }

    setSaving(false);
    setSaved(true);
    setApplyProfessionalAll(false);
    setApplyClientAll(false);
  }

  const inputClass =
    "w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400";

  if (loading) {
    return <p className="text-ink-soft text-sm">Cargando…</p>;
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Porcentajes</h1>
      <p className="text-ink-soft text-sm mb-8">
        Estos porcentajes se usan como valor por defecto al cargar un producto nuevo en Multidistribuidora. También
        podés tildar la casilla para aplicarlo de una a todos los productos que ya tenés cargados.
      </p>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-brand-200 bg-brand-50/50 p-6 space-y-6">
        <div>
          <label className="block text-xs font-medium text-ink-soft mb-1.5">% Descuento a profesionales</label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={professionalPercent}
              onChange={(e) => setProfessionalPercent(Number(e.target.value))}
              className={inputClass}
            />
            <label className="flex items-center gap-2 text-sm text-ink whitespace-nowrap">
              <input
                type="checkbox"
                checked={applyProfessionalAll}
                onChange={(e) => setApplyProfessionalAll(e.target.checked)}
                className="h-4 w-4 rounded border-brand-300 text-brand-600"
              />
              Aplicar a todos los productos
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-soft mb-1.5">% Descuento a clientes</label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={clientPercent}
              onChange={(e) => setClientPercent(Number(e.target.value))}
              className={inputClass}
            />
            <label className="flex items-center gap-2 text-sm text-ink whitespace-nowrap">
              <input
                type="checkbox"
                checked={applyClientAll}
                onChange={(e) => setApplyClientAll(e.target.checked)}
                className="h-4 w-4 rounded border-brand-300 text-brand-600"
              />
              Aplicar a todos los productos
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-soft mb-1.5">% para ofertas</label>
          <input
            type="number"
            value={offerPercent}
            onChange={(e) => setOfferPercent(Number(e.target.value))}
            className={inputClass}
          />
          <p className="text-xs text-ink-soft mt-1.5">
            Valor por defecto para el % de descuento cuando marcás un producto como &quot;Oferta&quot; en su carga.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-brand-600 text-white text-sm font-medium px-6 py-2.5 hover:bg-brand-700 transition-colors disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
          {saved && <span className="text-sm text-brand-600">Guardado ✓</span>}
        </div>
      </form>
    </div>
  );
}
