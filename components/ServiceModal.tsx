"use client";

import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/types";

type Slot = { time: string; available: boolean };

export default function ServiceModal({
  serviceId,
  serviceName,
  serviceDescription,
  employeeName,
  employeePhone,
  businessWhatsapp,
  bookable,
  onClose,
}: {
  serviceId: string;
  serviceName: string;
  serviceDescription: string;
  employeeName: string | null;
  employeePhone: string | null;
  businessWhatsapp: string;
  bookable: boolean;
  onClose: () => void;
}) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const contactPhone = employeePhone || businessWhatsapp;

  const [date, setDate] = useState(todayStr);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(bookable);
  const [closed, setClosed] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function loadAvailability(forDate: string) {
    setLoadingSlots(true);
    setSelected(null);
    setError("");
    const res = await fetch(`/api/bookings/availability?serviceId=${serviceId}&date=${forDate}`);
    const data = await res.json();
    setSlots(data.slots ?? []);
    setClosed(Boolean(data.closed));
    setLoadingSlots(false);
  }

  useEffect(() => {
    if (bookable) loadAvailability(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, bookable]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId,
        date,
        timeSlot: selected,
        clientName: nombre,
        clientPhone: telefono,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "No se pudo reservar el turno");
      loadAvailability(date);
      return;
    }

    setSuccess(true);
  }

  const dateLabel = new Date(date + "T00:00:00").toLocaleDateString("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  function notifyEmployeeUrl() {
    const message = [
      `Hola${employeeName ? " " + employeeName : ""}! Soy ${nombre}.`,
      `Reservé un turno para "${serviceName}" el ${dateLabel} a las ${selected}.`,
      `Mi teléfono: ${telefono}`,
    ].join("\n");
    return whatsappLink(contactPhone, message);
  }

  function doubtUrl() {
    return whatsappLink(contactPhone, `Hola! Tengo una consulta sobre "${serviceName}".`);
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 my-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-ink">{serviceName}</h2>
          <button onClick={onClose} aria-label="Cerrar" className="text-ink-soft hover:text-ink text-xl leading-none">
            ×
          </button>
        </div>

        {success ? (
          <div className="text-center py-6">
            <p className="text-brand-600 font-semibold mb-2">¡Turno reservado!</p>
            <p className="text-sm text-ink-soft mb-6">
              {serviceName} — {dateLabel} a las {selected}
            </p>
            <a
              href={notifyEmployeeUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-full bg-[#25D366] text-white text-sm font-semibold py-2.5 mb-3 hover:opacity-90 transition-opacity"
            >
              Avisar a {employeeName || "Mara Diaz"} por WhatsApp
            </a>
            <button
              onClick={onClose}
              className="rounded-full border border-brand-200 text-ink-soft text-sm font-medium px-6 py-2.5 hover:bg-brand-50 transition-colors"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-ink-soft leading-relaxed">{serviceDescription}</p>

            {employeeName && (
              <p className="text-xs text-brand-600">
                Atiende: <strong>{employeeName}</strong>
              </p>
            )}

            {bookable && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2 border-t border-brand-100">
                <div>
                  <label className="block text-xs font-medium text-ink-soft mb-1.5 mt-3">Solicitar turno — Fecha</label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-soft mb-1.5">Horario</label>
                  {loadingSlots ? (
                    <p className="text-xs text-ink-soft">Buscando horarios…</p>
                  ) : closed ? (
                    <p className="text-xs text-red-500">Ese día no se atiende. Probá con otra fecha.</p>
                  ) : slots.length === 0 ? (
                    <p className="text-xs text-ink-soft">No hay turnos configurados para este servicio.</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {slots.map((s) => (
                        <button
                          key={s.time}
                          type="button"
                          disabled={!s.available}
                          onClick={() => setSelected(s.time)}
                          className={`rounded-lg px-2 py-2 text-xs font-medium border transition-colors ${
                            !s.available
                              ? "bg-brand-50 text-brand-200 border-brand-100 cursor-not-allowed line-through"
                              : selected === s.time
                                ? "bg-brand-600 text-white border-brand-600"
                                : "border-brand-200 text-ink-soft hover:bg-brand-50"
                          }`}
                        >
                          {s.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selected && (
                  <>
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

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-full bg-brand-600 text-white text-sm font-semibold py-2.5 hover:bg-brand-700 transition-colors disabled:opacity-60"
                    >
                      {submitting ? "Reservando…" : `Solicitar turno de ${selected}`}
                    </button>
                  </>
                )}
              </form>
            )}

            <a
              href={doubtUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-[#25D366] text-[#1f9e57] text-sm font-medium py-2.5 mt-1 hover:bg-[#25D366]/5 transition-colors"
            >
              ¿Tenés dudas? Escribir por WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
