"use client";

import { useEffect, useState } from "react";
import { formatPrice, discountedPrice, viewerDiscountPercent, type Product, type Distributor } from "@/lib/types";

type Access = {
  status: "cliente" | "profesional";
  discountPercent: number | null;
  appliesProductos: boolean;
};

export default function ProductCard({ product, distributor }: { product: Product; distributor: Distributor | null }) {
  const [access, setAccess] = useState<Access | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("md_access");
    if (!raw) return;
    try {
      setAccess(JSON.parse(raw));
    } catch {
      // ignora storage corrupto
    }
  }, []);

  const isOferta = product.productType === "oferta" && Boolean(product.offerDiscountPercent);
  const publicPrice = isOferta
    ? discountedPrice(product.price, product.offerDiscountPercent as number)
    : product.price;

  const viewerPercent = viewerDiscountPercent(access?.status ?? null, access?.discountPercent, access?.appliesProductos, product);
  const finalPrice = viewerPercent > 0 ? discountedPrice(publicPrice, viewerPercent) : publicPrice;
  const showStrikethrough = isOferta || viewerPercent > 0;

  return (
    <article className="rounded-2xl border border-brand-100 overflow-hidden bg-white hover:shadow-xl hover:shadow-brand-100/50 transition-shadow relative">
      {product.productType === "oferta" && (
        <span className="absolute top-3 left-3 z-10 rounded-full bg-red-500 text-white text-[11px] font-bold px-3 py-1">
          OFERTA
        </span>
      )}
      {product.productType === "estacion" && (
        <span className="absolute top-3 left-3 z-10 rounded-full bg-amber-500 text-white text-[11px] font-bold px-3 py-1">
          DE ESTACIÓN
        </span>
      )}

      <div className="h-40 bg-brand-50 flex items-center justify-center text-brand-300">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-3xl">🧴</span>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-lg font-semibold text-ink">{product.name}</h3>
          {distributor && (
            <div className="flex items-center gap-1.5 shrink-0" title={distributor.name}>
              {distributor.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={distributor.logoUrl} alt={distributor.name} className="h-6 w-6 rounded-full object-cover border border-brand-100" />
              ) : (
                <span className="text-[10px] text-ink-soft">{distributor.name}</span>
              )}
            </div>
          )}
        </div>
        <p className="text-sm text-ink-soft leading-relaxed mb-4">{product.description}</p>
        <div className="flex items-center justify-end text-sm">
          <span>
            {showStrikethrough && (
              <span className="text-ink-soft line-through mr-2">{formatPrice(product.price)}</span>
            )}
            <span className="font-semibold text-brand-700">{formatPrice(finalPrice)}</span>
          </span>
        </div>
      </div>
    </article>
  );
}
