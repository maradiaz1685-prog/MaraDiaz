"use client";

import { useEffect, useState } from "react";

type BookingRow = {
  id: string;
  serviceId: string;
  serviceName: string;
  bookingDate: string;
  timeSlot: string;
  clientName: string;
  clientPhone: string;
  createdAt: string;
};

export default function AdminTurnosPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/bookings");
    const data = await res.json();
    setBookings(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCancel(id: string) {
    if (!confirm("¿Cancelar este turno? No se puede deshacer.")) return;
    await fetch("/api/bookings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  const grouped = bookings.reduce<Record<string, BookingRow[]>>((acc, b) => {
    (acc[b.bookingDate] ??= []).push(b);
    return acc;
  }, {});
  const dates = Object.keys(grouped).sort();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Turnos</h1>
      <p className="text-ink-soft text-sm mb-8">Turnos reservados por clientes desde el sitio público.</p>

      {loading ? (
        <p className="text-ink-soft text-sm">Cargando…</p>
      ) : bookings.length === 0 ? (
        <p className="text-ink-soft text-sm">Todavía no hay turnos reservados.</p>
      ) : (
        dates.map((date) => (
          <div key={date} className="mb-8">
            <h2 className="text-sm font-semibold text-brand-700 mb-3">
              {new Date(date + "T00:00:00").toLocaleDateString("es-AR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-brand-100">
              <table className="w-full text-sm">
                <thead className="bg-brand-50 text-ink-soft text-xs uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Hora</th>
                    <th className="text-left px-4 py-3 font-medium">Servicio</th>
                    <th className="text-left px-4 py-3 font-medium">Cliente</th>
                    <th className="text-left px-4 py-3 font-medium">Teléfono</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100">
                  {grouped[date]
                    .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
                    .map((b) => (
                      <tr key={b.id} className="hover:bg-brand-50/40">
                        <td className="px-4 py-3 text-ink font-medium">{b.timeSlot}</td>
                        <td className="px-4 py-3 text-ink">{b.serviceName}</td>
                        <td className="px-4 py-3 text-ink">{b.clientName}</td>
                        <td className="px-4 py-3 text-ink">{b.clientPhone}</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleCancel(b.id)}
                            className="text-red-500 font-medium hover:underline"
                          >
                            Cancelar
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
