"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/types";
import { PROVINCIAS_ARGENTINA } from "@/lib/provincias";

type Option = { id: string; name: string };

type Category = "servicio" | "escuela" | "producto";

const CATEGORY_LABELS: Record<Category, string> = {
  servicio: "Servicio",
  escuela: "Escuela Profesional",
  producto: "Producto",
};

export default function WhatsappButton({
  phone,
  services,
  courses,
  products,
}: {
  phone: string;
  services: Option[];
  courses: Option[];
  products: Option[];
}) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [provincia, setProvincia] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [categoria, setCategoria] = useState<Category>("servicio");
  const [itemId, setItemId] = useState("");
  const [consulta, setConsulta] = useState("");

  const optionsByCategory: Record<Category, Option[]> = {
    servicio: services,
    escuela: courses,
    producto: products,
  };

  const currentOptions = optionsByCategory[categoria];
  const selectedItem = currentOptions.find((o) => o.id === itemId);

  function resetForm() {
    setNombre("");
    setTelefono("");
    setProvincia("");
    setCiudad("");
    setCategoria("servicio");
    setItemId("");
    setConsulta("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const lines = [
      `Hola! Mi nombre es ${nombre}.`,
      `Teléfono: ${telefono}`,
      provincia || ciudad ? `Ubicación: ${[ciudad, provincia].filter(Boolean).join(", ")}` : "",
      `Consulta sobre: ${CATEGORY_LABELS[categoria]}${selectedItem ? " — " + selectedItem.name : ""}`,
      consulta ? `Mensaje: ${consulta}` : "",
    ].filter(Boolean);

    window.open(whatsappLink(phone, lines.join("\n")), "_blank", "noopener,noreferrer");
    setOpen(false);
    resetForm();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Escribir por WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 hover:scale-105 transition-transform"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2zm5.8 14.14c-.24.68-1.4 1.31-1.93 1.36-.5.05-1.05.24-3.5-.73-2.95-1.17-4.84-4.17-4.99-4.36-.15-.2-1.19-1.58-1.19-3.02s.75-2.14 1.02-2.43c.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.81 2 .88 2.14.07.15.12.32.02.51-.1.19-.15.31-.3.48-.15.17-.31.38-.44.5-.15.15-.31.31-.13.61.18.29.79 1.31 1.7 2.12 1.17 1.04 2.16 1.37 2.45 1.52.29.15.46.13.63-.08.18-.2.75-.87.95-1.17.2-.29.4-.24.67-.15.28.1 1.76.83 2.06.98.3.15.5.22.57.35.07.13.07.75-.17 1.43z" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 my-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-semibold text-ink">Escribinos por WhatsApp</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="text-ink-soft hover:text-ink text-xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-xs font-medium text-ink-soft mb-1.5">Teléfono</label>
                  <input
                    required
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink-soft mb-1.5">Provincia</label>
                  <select
                    value={provincia}
                    onChange={(e) => setProvincia(e.target.value)}
                    className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  >
                    <option value="">Seleccioná…</option>
                    {PROVINCIAS_ARGENTINA.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-soft mb-1.5">Ciudad</label>
                  <input
                    type="text"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-soft mb-1.5">La consulta es por</label>
                <div className="flex gap-2">
                  {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategoria(cat);
                        setItemId("");
                      }}
                      className={`flex-1 rounded-full px-3 py-2 text-xs font-medium border transition-colors ${
                        categoria === cat
                          ? "bg-brand-600 text-white border-brand-600"
                          : "border-brand-200 text-ink-soft hover:bg-brand-50"
                      }`}
                    >
                      {CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-soft mb-1.5">
                  {CATEGORY_LABELS[categoria]}
                </label>
                <select
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                >
                  <option value="">Seleccioná una opción…</option>
                  {currentOptions.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-soft mb-1.5">Consulta</label>
                <textarea
                  value={consulta}
                  onChange={(e) => setConsulta(e.target.value)}
                  rows={3}
                  placeholder="Contanos qué necesitás…"
                  className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              <button
                type="submit"
                className="mt-1 flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white text-sm font-semibold py-2.5 hover:opacity-90 transition-opacity"
              >
                Enviar por WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
