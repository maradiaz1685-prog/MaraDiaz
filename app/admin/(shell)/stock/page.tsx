"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";

export default function AdminStockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const withAlert = products.filter(
    (p) => p.minStockAlert !== null && p.minStockAlert !== undefined && p.minStockAlert > 0
  );
  const low = withAlert.filter((p) => p.stock <= (p.minStockAlert ?? 0));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Stock</h1>
      <p className="text-ink-soft text-sm mb-8">
        Productos con stock igual o por debajo del mínimo que configuraste al cargarlos en Multidistribuidora.
      </p>

      {loading ? (
        <p className="text-ink-soft text-sm">Cargando…</p>
      ) : withAlert.length === 0 ? (
        <p className="text-ink-soft text-sm">
          Todavía no configuraste un stock mínimo de alerta en ningún producto. Podés hacerlo desde{" "}
          <Link href="/admin/productos" className="text-brand-600 hover:underline">
            Multidistribuidora
          </Link>
          .
        </p>
      ) : low.length === 0 ? (
        <p className="text-brand-600 text-sm">Todo el stock está por encima del mínimo configurado. Sin alertas.</p>
      ) : (
        <div className="space-y-3">
          {low.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-red-200 bg-red-50/60 p-5 flex items-center justify-between flex-wrap gap-3"
            >
              <div>
                <p className="font-semibold text-ink">{p.name}</p>
                <p className="text-xs text-ink-soft">{p.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-red-600">
                  {p.stock} en stock (mínimo {p.minStockAlert})
                </p>
                <Link href="/admin/productos" className="text-xs text-brand-600 hover:underline">
                  Reponer desde Multidistribuidora
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
