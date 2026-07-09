"use client";

import { useEffect, useState } from "react";
import { whatsappLink, type Registration, type RegistrationStatus } from "@/lib/types";

const STATUS_LABELS: Record<RegistrationStatus, string> = {
  pendiente: "Pendiente",
  cliente: "Cliente",
  profesional: "Profesional",
};

const STATUS_STYLES: Record<RegistrationStatus, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  cliente: "bg-brand-100 text-brand-700",
  profesional: "bg-purple-100 text-purple-700",
};

type EditState = {
  status: RegistrationStatus;
  discountPercent: number;
  appliesServicios: boolean;
  appliesCursos: boolean;
  appliesProductos: boolean;
};

function scopeLabel(r: { appliesServicios: boolean; appliesCursos: boolean; appliesProductos: boolean }) {
  const labels: string[] = [];
  if (r.appliesServicios) labels.push("Servicios");
  if (r.appliesCursos) labels.push("Escuela Profesional");
  if (r.appliesProductos) labels.push("Multidistribuidora");
  if (labels.length === 3) return "todo el sitio";
  return labels.join(" y ");
}

export default function AdminRegistrosPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/registrations");
    const data = await res.json();
    setRegistrations(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openEdit(r: Registration) {
    setEditingId(r.id);
    setEdit({
      status: r.status === "pendiente" ? "cliente" : r.status,
      discountPercent: r.discountPercent ?? 10,
      appliesServicios: r.appliesServicios,
      appliesCursos: r.appliesCursos,
      appliesProductos: r.appliesProductos,
    });
  }

  async function handleSave(id: string) {
    if (!edit) return;
    setSaving(true);
    await fetch("/api/registrations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...edit }),
    });
    setSaving(false);
    setEditingId(null);
    setEdit(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este registro? No se puede deshacer.")) return;
    await fetch("/api/registrations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  function whatsappUrlFor(r: Registration) {
    const link = `${window.location.origin}/mi-descuento/${r.accessCode}`;
    const scope = scopeLabel(r);
    const message =
      r.status === "profesional"
        ? `Hola ${r.name}! Gracias por registrarte. La administración te da un descuento del ${r.discountPercent}% por ser profesional en ${scope}. ¡Bienvenido/a a Mara Diaz! Ya podés verlo acá: ${link}`
        : `Hola ${r.name}! Gracias por registrarte en Mara Diaz. Por eso te damos un descuento del ${r.discountPercent}% en ${scope}. Ya podés verlo acá: ${link}`;
    return whatsappLink(r.phone, message);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Registros</h1>
      <p className="text-ink-soft text-sm mb-8">
        Personas que se registraron en el sitio. Marcalas como cliente o profesional y, si querés, asignales un
        descuento — al guardar vas a poder avisarles por WhatsApp.
      </p>

      {loading ? (
        <p className="text-ink-soft text-sm">Cargando…</p>
      ) : registrations.length === 0 ? (
        <p className="text-ink-soft text-sm">Todavía no hay registros.</p>
      ) : (
        <div className="space-y-4">
          {registrations.map((r) => (
            <div key={r.id} className="rounded-2xl border border-brand-100 bg-white p-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-ink">{r.name}</p>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[r.status]}`}>
                      {STATUS_LABELS[r.status]}
                    </span>
                  </div>
                  <p className="text-sm text-ink-soft">{r.phone}</p>
                  <p className="text-xs text-ink-soft mt-0.5">
                    {r.city}, {r.province}
                    {r.address ? ` · ${r.address}` : ""}
                    {" · "}
                    {r.alreadyClient ? "Ya era cliente" : "Cliente nuevo"}
                  </p>
                  {r.status !== "pendiente" && r.discountPercent ? (
                    <p className="text-xs text-brand-600 mt-1">
                      {r.discountPercent}% de descuento en {scopeLabel(r)}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center gap-3">
                  {r.status !== "pendiente" && Boolean(r.discountPercent) && (
                    <a
                      href={whatsappUrlFor(r)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-[#25D366] text-white text-xs font-semibold px-4 py-2 hover:opacity-90 transition-opacity"
                    >
                      Avisar por WhatsApp
                    </a>
                  )}
                  <button
                    onClick={() => openEdit(r)}
                    className="text-brand-600 text-sm font-medium hover:underline"
                  >
                    {r.status === "pendiente" ? "Revisar" : "Editar"}
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-red-500 text-sm font-medium hover:underline"
                  >
                    Borrar
                  </button>
                </div>
              </div>

              {editingId === r.id && edit && (
                <div className="mt-4 pt-4 border-t border-brand-100 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-ink-soft mb-1.5">Estado</label>
                    <select
                      value={edit.status}
                      onChange={(e) => setEdit({ ...edit, status: e.target.value as RegistrationStatus })}
                      className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                    >
                      <option value="cliente">Cliente</option>
                      <option value="profesional">Profesional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-soft mb-1.5">Descuento (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={edit.discountPercent}
                      onChange={(e) => setEdit({ ...edit, discountPercent: Number(e.target.value) })}
                      className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-ink-soft mb-1.5">¿En qué le hacemos el descuento?</label>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 text-sm text-ink">
                        <input
                          type="checkbox"
                          checked={edit.appliesServicios}
                          onChange={(e) => setEdit({ ...edit, appliesServicios: e.target.checked })}
                          className="h-4 w-4 rounded border-brand-300 text-brand-600"
                        />
                        Servicios
                      </label>
                      <label className="flex items-center gap-2 text-sm text-ink">
                        <input
                          type="checkbox"
                          checked={edit.appliesCursos}
                          onChange={(e) => setEdit({ ...edit, appliesCursos: e.target.checked })}
                          className="h-4 w-4 rounded border-brand-300 text-brand-600"
                        />
                        Escuela Profesional
                      </label>
                      <label className="flex items-center gap-2 text-sm text-ink">
                        <input
                          type="checkbox"
                          checked={edit.appliesProductos}
                          onChange={(e) => setEdit({ ...edit, appliesProductos: e.target.checked })}
                          className="h-4 w-4 rounded border-brand-300 text-brand-600"
                        />
                        Multidistribuidora
                      </label>
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex gap-3">
                    <button
                      onClick={() => handleSave(r.id)}
                      disabled={saving}
                      className="rounded-full bg-brand-600 text-white text-sm font-medium px-6 py-2.5 hover:bg-brand-700 transition-colors disabled:opacity-60"
                    >
                      {saving ? "Guardando…" : "Guardar"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEdit(null);
                      }}
                      className="rounded-full border border-brand-200 text-ink-soft text-sm font-medium px-6 py-2.5 hover:bg-brand-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
