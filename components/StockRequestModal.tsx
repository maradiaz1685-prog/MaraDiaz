"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/types";

export default function StockRequestModal({
  productId,
  productName,
  whatsappPhone,
  onClose,
}: {
  productId: string;
  productName: string;
  whatsappPhone: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [consulta, setConsulta] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    await fetch("/api/stock-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        productName,
        clientName: nombre,
        clientPhone: telefono,
        message: consulta,
      }),
    });

    const lines = [
      `Hola! Mi nombre es ${nombre}.`,
      `Te escribo por el producto "${productName}", que vi que no tiene stock en este momento.`,
      consulta ? `Consulta: ${consulta}` : "",
      `Mi teléfono: ${telefono}`,
    ].filter(Boolean);

    window.open(whatsappLink(whatsappPhone, lines.join("\n")), "_blank", "noopener,noreferrer");

    setSubmitting(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 my-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold text-ink">{productName}</h2>
          <button onClick={onClose} aria-label="Cerrar" className="text-ink-soft hover:text-ink text-xl leading-none">
            ×
          </button>
        </div>

        {step === 1 ? (
          <div className="flex flex-col gap-5">
            <p className="text-sm text-ink-soft leading-relaxed">
              Hola, en este momento no tenemos stock en el local. Si lo deseas, dejanos una consulta.
            </p>
            <button
              onClick={() => setStep(2)}
              className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white text-sm font-semibold py-2.5 hover:opacity-90 transition-opacity"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2zm5.8 14.14c-.24.68-1.4 1.31-1.93 1.36-.5.05-1.05.24-3.5-.73-2.95-1.17-4.84-4.17-4.99-4.36-.15-.2-1.19-1.58-1.19-3.02s.75-2.14 1.02-2.43c.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.81 2 .88 2.14.07.15.12.32.02.51-.1.19-.15.31-.3.48-.15.17-.31.38-.44.5-.15.15-.31.31-.13.61.18.29.79 1.31 1.7 2.12 1.17 1.04 2.16 1.37 2.45 1.52.29.15.46.13.63-.08.18-.2.75-.87.95-1.17.2-.29.4-.24.67-.15.28.1 1.76.83 2.06.98.3.15.5.22.57.35.07.13.07.75-.17 1.43z" />
              </svg>
              Escribir por WhatsApp
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-sm text-ink-soft leading-relaxed">
              Por favor dejanos un mensaje y a la brevedad estaremos en contacto con vos. Saludos.
            </p>
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
            <div>
              <label className="block text-xs font-medium text-ink-soft mb-1.5">Consulta</label>
              <textarea
                value={consulta}
                onChange={(e) => setConsulta(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-1 flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white text-sm font-semibold py-2.5 hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {submitting ? "Enviando…" : "Enviar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
