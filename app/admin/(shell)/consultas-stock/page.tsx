"use client";

import { useEffect, useState } from "react";
import { whatsappLink, type StockRequest } from "@/lib/types";

export default function AdminConsultasStockPage() {
  const [requests, setRequests] = useState<StockRequest[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/stock-requests");
    const data = await res.json();
    setRequests(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function markAtendida(id: string) {
    await fetch("/api/stock-requests", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "atendida" }),
    });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta consulta? No se puede deshacer.")) return;
    await fetch("/api/stock-requests", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Consultas de stock</h1>
      <p className="text-ink-soft text-sm mb-8">
        Clientes que quisieron comprar un producto sin stock desde Multidistribuidora y dejaron su consulta.
      </p>

      {loading ? (
        <p className="text-ink-soft text-sm">Cargando…</p>
      ) : requests.length === 0 ? (
        <p className="text-ink-soft text-sm">No hay consultas todavía.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div key={r.id} className="rounded-2xl border border-brand-100 bg-white p-5">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-ink">{r.clientName}</p>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        r.status === "pendiente" ? "bg-amber-100 text-amber-700" : "bg-brand-100 text-brand-700"
                      }`}
                    >
                      {r.status === "pendiente" ? "Pendiente" : "Atendida"}
                    </span>
                  </div>
                  <p className="text-sm text-ink-soft">{r.clientPhone}</p>
                  <p className="text-sm text-ink mt-2">
                    Producto sin stock: <span className="font-medium">{r.productName}</span>
                  </p>
                  {r.message && <p className="text-sm text-ink-soft mt-1">"{r.message}"</p>}
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={whatsappLink(
                      r.clientPhone,
                      `Hola ${r.clientName}! Te escribimos por tu consulta sobre "${r.productName}".`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#25D366] text-white text-xs font-semibold px-4 py-2 hover:opacity-90 transition-opacity"
                  >
                    Responder por WhatsApp
                  </a>
                  {r.status === "pendiente" && (
                    <button
                      onClick={() => markAtendida(r.id)}
                      className="text-brand-600 text-sm font-medium hover:underline"
                    >
                      Marcar atendida
                    </button>
                  )}
                  <button onClick={() => handleDelete(r.id)} className="text-red-500 text-sm font-medium hover:underline">
                    Borrar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
