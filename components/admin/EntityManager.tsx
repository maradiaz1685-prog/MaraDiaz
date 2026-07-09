"use client";

import { useEffect, useState } from "react";

export type FieldType = "text" | "textarea" | "number" | "date" | "time" | "checkbox" | "select" | "image";

export type FieldConfig = {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  showInTable?: boolean;
  helperText?: (item: Record<string, unknown>) => string;
};

type Item = Record<string, unknown> & { id: string };

function ImageUploadInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json().catch(() => ({}));

    setUploading(false);
    e.target.value = "";

    if (!res.ok) {
      setError(data.error || "Error al subir la imagen");
      return;
    }

    onChange(data.url);
  }

  return (
    <div className="flex items-center gap-3">
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-14 w-14 rounded-lg object-cover border border-brand-200" />
      ) : (
        <div className="h-14 w-14 shrink-0 rounded-lg bg-brand-50 border border-dashed border-brand-200 flex items-center justify-center text-brand-300 text-[10px] text-center px-1">
          Sin foto
        </div>
      )}
      <div>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFile}
          disabled={uploading}
          className="text-xs text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-brand-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-brand-700 hover:file:bg-brand-200"
        />
        {uploading && <p className="text-xs text-brand-600 mt-1">Subiendo…</p>}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
}

export default function EntityManager({
  apiPath,
  title,
  fields,
  emptyItem,
  dynamicOptions,
}: {
  apiPath: string;
  title: string;
  fields: FieldConfig[];
  emptyItem: Record<string, unknown>;
  dynamicOptions?: Record<string, { value: string; label: string }[]>;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch(apiPath);
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiPath]);

  function openNew() {
    setEditing({ ...emptyItem, id: "" } as Item);
  }

  function openEdit(item: Item) {
    setEditing({ ...item });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const isNew = !editing.id;
    await fetch(apiPath, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    setEditing(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este ítem? No se puede deshacer.")) return;
    await fetch(apiPath, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  function updateField(key: string, value: unknown) {
    setEditing((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  const tableFields = fields.filter((f) => f.showInTable !== false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
        <button
          onClick={openNew}
          className="rounded-full bg-brand-600 text-white text-sm font-medium px-5 py-2.5 hover:bg-brand-700 transition-colors"
        >
          + Agregar
        </button>
      </div>

      {editing && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-2xl border border-brand-200 bg-brand-50/50 p-6 grid gap-4 sm:grid-cols-2"
        >
          {fields.map((f) => (
            <div key={f.key} className={f.type === "textarea" || f.type === "image" ? "sm:col-span-2" : ""}>
              <label className="block text-xs font-medium text-ink-soft mb-1.5">{f.label}</label>
              {f.type === "image" ? (
                <ImageUploadInput
                  value={(editing[f.key] as string) ?? ""}
                  onChange={(url) => updateField(f.key, url)}
                />
              ) : f.type === "textarea" ? (
                <textarea
                  value={(editing[f.key] as string) ?? ""}
                  onChange={(e) => updateField(f.key, e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              ) : f.type === "checkbox" ? (
                <label className="flex items-center gap-2 text-sm mt-2">
                  <input
                    type="checkbox"
                    checked={Boolean(editing[f.key])}
                    onChange={(e) => updateField(f.key, e.target.checked)}
                    className="h-4 w-4 rounded border-brand-300 text-brand-600"
                  />
                  Activo
                </label>
              ) : f.type === "select" ? (
                <>
                  <select
                    value={(editing[f.key] as string) ?? ""}
                    onChange={(e) => updateField(f.key, e.target.value)}
                    className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  >
                    {(dynamicOptions?.[f.key] ?? f.options ?? []).map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  {f.helperText && (
                    <p className="text-xs text-ink-soft mt-1.5">{f.helperText(editing)}</p>
                  )}
                </>
              ) : (
                <input
                  type={
                    f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "time" ? "time" : "text"
                  }
                  value={(editing[f.key] as string | number) ?? ""}
                  onChange={(e) =>
                    updateField(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)
                  }
                  className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              )}
            </div>
          ))}

          <div className="sm:col-span-2 flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-brand-600 text-white text-sm font-medium px-6 py-2.5 hover:bg-brand-700 transition-colors disabled:opacity-60"
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-full border border-brand-200 text-ink-soft text-sm font-medium px-6 py-2.5 hover:bg-white transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-ink-soft text-sm">Cargando…</p>
      ) : items.length === 0 ? (
        <p className="text-ink-soft text-sm">No hay ítems todavía. Agregá el primero.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-brand-100">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-ink-soft text-xs uppercase tracking-wide">
              <tr>
                {tableFields.map((f) => (
                  <th key={f.key} className="text-left px-4 py-3 font-medium">
                    {f.label}
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-brand-50/40">
                  {tableFields.map((f) => {
                    let display: string;
                    if (f.type === "checkbox") {
                      display = item[f.key] ? "Sí" : "No";
                    } else if (f.type === "select") {
                      const opts = dynamicOptions?.[f.key] ?? f.options ?? [];
                      display = opts.find((o) => o.value === item[f.key])?.label ?? String(item[f.key] ?? "");
                    } else {
                      display = String(item[f.key] ?? "");
                    }
                    return (
                      <td key={f.key} className="px-4 py-3 text-ink">
                        {display}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(item)}
                      className="text-brand-600 font-medium hover:underline mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 font-medium hover:underline"
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
