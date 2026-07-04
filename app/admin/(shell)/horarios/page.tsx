"use client";

import { useEffect, useState } from "react";
import type { DaySchedule } from "@/lib/types";

export default function AdminHorariosPage() {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/schedule")
      .then((res) => res.json())
      .then((data) => {
        setSchedule(data);
        setLoading(false);
      });
  }, []);

  function update(index: number, patch: Partial<DaySchedule>) {
    setSchedule((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await fetch("/api/schedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(schedule),
    });
    setSaving(false);
    setSaved(true);
  }

  if (loading) return <p className="text-ink-soft text-sm">Cargando…</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Horarios de atención</h1>

      <div className="rounded-2xl border border-brand-100 bg-white divide-y divide-brand-100">
        {schedule.map((d, i) => (
          <div key={d.day} className="flex items-center gap-4 px-5 py-4 flex-wrap">
            <span className="w-28 font-medium text-sm text-ink">{d.day}</span>

            <label className="flex items-center gap-2 text-xs text-ink-soft">
              <input
                type="checkbox"
                checked={d.closed}
                onChange={(e) => update(i, { closed: e.target.checked })}
                className="h-4 w-4 rounded border-brand-300 text-brand-600"
              />
              Cerrado
            </label>

            {!d.closed && (
              <>
                <label className="flex items-center gap-2 text-xs text-ink-soft">
                  Abre
                  <input
                    type="time"
                    value={d.open}
                    onChange={(e) => update(i, { open: e.target.value })}
                    className="rounded-lg border border-brand-200 px-2 py-1.5 text-sm"
                  />
                </label>
                <label className="flex items-center gap-2 text-xs text-ink-soft">
                  Cierra
                  <input
                    type="time"
                    value={d.close}
                    onChange={(e) => update(i, { close: e.target.value })}
                    className="rounded-lg border border-brand-200 px-2 py-1.5 text-sm"
                  />
                </label>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-brand-600 text-white text-sm font-medium px-6 py-2.5 hover:bg-brand-700 transition-colors disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
        {saved && <span className="text-sm text-brand-600">Guardado ✓</span>}
      </div>
    </div>
  );
}
