"use client";

import { useEffect, useState } from "react";
import type { Settings } from "@/lib/types";

const fieldDefs: { key: keyof Settings; label: string; type: "text" | "textarea" }[] = [
  { key: "ownerName", label: "Nombre del titular", type: "text" },
  { key: "bio", label: "Descripción / bio del negocio", type: "textarea" },
  { key: "phone", label: "Teléfono", type: "text" },
  { key: "whatsapp", label: "WhatsApp", type: "text" },
  { key: "instagram", label: "Instagram (URL)", type: "text" },
  { key: "facebook", label: "Facebook (URL)", type: "text" },
  { key: "address", label: "Dirección", type: "text" },
];

export default function AdminConfiguracionPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then(setSettings);
  }, []);

  function update(key: keyof Settings, value: string) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
  }

  if (!settings) return <p className="text-ink-soft text-sm">Cargando…</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Configuración</h1>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-brand-100 bg-white p-6 grid gap-4 sm:grid-cols-2 max-w-2xl"
      >
        {fieldDefs.map((f) => (
          <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
            <label className="block text-xs font-medium text-ink-soft mb-1.5">{f.label}</label>
            {f.type === "textarea" ? (
              <textarea
                value={settings[f.key]}
                onChange={(e) => update(f.key, e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            ) : (
              <input
                type="text"
                value={settings[f.key]}
                onChange={(e) => update(f.key, e.target.value)}
                className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            )}
          </div>
        ))}

        <div className="sm:col-span-2 flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-brand-600 text-white text-sm font-medium px-6 py-2.5 hover:bg-brand-700 transition-colors disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
          {saved && <span className="text-sm text-brand-600">Guardado ✓</span>}
        </div>
      </form>
    </div>
  );
}
