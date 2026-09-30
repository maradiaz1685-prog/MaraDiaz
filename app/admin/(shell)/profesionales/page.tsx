"use client";

import { useState } from "react";
import EntityManager from "@/components/admin/EntityManager";

function PortfolioBlock({
  item,
  updateField,
}: {
  item: Record<string, unknown>;
  updateField: (key: string, value: unknown) => void;
}) {
  const images = Array.isArray(item.portfolioImages) ? (item.portfolioImages as string[]) : [];
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

    updateField("portfolioImages", [...images, data.url]);
  }

  function removeImage(url: string) {
    updateField(
      "portfolioImages",
      images.filter((img) => img !== url)
    );
  }

  return (
    <div className="rounded-xl border border-brand-200 bg-white p-4">
      <p className="text-xs font-semibold text-ink mb-1">Fotos de trabajos realizados</p>
      <p className="text-xs text-ink-soft mb-3">
        Se muestran en la página de Servicios, en la galería de esta profesional.
      </p>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {images.map((url) => (
            <div key={url} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-16 w-16 rounded-lg object-cover border border-brand-200" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                aria-label="Quitar foto"
                className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white text-xs leading-none flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
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
  );
}

export default function AdminProfesionalesPage() {
  return (
    <EntityManager
      apiPath="/api/employees"
      title="Profesionales"
      fields={[
        { key: "name", label: "Nombre", type: "text" },
        { key: "role", label: "Cargo", type: "text" },
        { key: "category", label: "Categoría / especialidad", type: "text" },
        { key: "phone", label: "Teléfono", type: "text" },
        { key: "address", label: "Dirección", type: "text", showInTable: false },
        { key: "licenseNumber", label: "Matrícula", type: "text", showInTable: false },
        { key: "bio", label: "Descripción", type: "textarea", showInTable: false },
        { key: "photoUrl", label: "Foto de perfil", type: "image", showInTable: false },
        {
          key: "portfolio",
          label: "Trabajos",
          type: "custom",
          showInTable: false,
          render: (item, updateField) => <PortfolioBlock item={item} updateField={updateField} />,
        },
      ]}
      emptyItem={{
        name: "",
        role: "",
        category: "",
        phone: "",
        address: "",
        licenseNumber: "",
        bio: "",
        photoUrl: "",
        portfolioImages: [],
      }}
    />
  );
}
