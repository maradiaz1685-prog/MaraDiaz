"use client";

import { useEffect, useState } from "react";
import EntityManager from "@/components/admin/EntityManager";
import { priceFromCost, profitPercentFromPrice } from "@/lib/types";

function PricingBlock({
  item,
  updateField,
}: {
  item: Record<string, unknown>;
  updateField: (key: string, value: unknown) => void;
}) {
  const cost = Number(item.cost) || 0;
  const profitPercent = Number(item.profitPercent) || 0;
  const price = Number(item.price) || 0;

  function handleCostChange(v: number) {
    updateField("cost", v);
    updateField("price", priceFromCost(v, profitPercent));
  }
  function handleProfitChange(v: number) {
    updateField("profitPercent", v);
    updateField("price", priceFromCost(cost, v));
  }
  function handlePriceChange(v: number) {
    updateField("price", v);
    updateField("profitPercent", profitPercentFromPrice(cost, v));
  }

  const inputClass =
    "w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400";
  const labelClass = "block text-xs font-medium text-ink-soft mb-1.5";

  return (
    <div className="rounded-xl border border-brand-200 bg-white p-4">
      <p className="text-xs font-semibold text-ink mb-3">Precio</p>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Costo (compra)</label>
          <input
            type="number"
            value={cost}
            onChange={(e) => handleCostChange(Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>% Ganancia</label>
          <input
            type="number"
            value={profitPercent}
            onChange={(e) => handleProfitChange(Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Precio final</label>
          <input
            type="number"
            value={price}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            className={inputClass}
          />
        </div>
      </div>
      <p className="text-xs text-ink-soft mt-2">
        Poné costo + % de ganancia y el precio final se calcula solo. O escribí el precio final directamente y el %
        de ganancia se ajusta.
      </p>
    </div>
  );
}

function DiscountColumn({
  label,
  percentKey,
  price,
  item,
  updateField,
}: {
  label: string;
  percentKey: string;
  price: number;
  item: Record<string, unknown>;
  updateField: (key: string, value: unknown) => void;
}) {
  const percent = Number(item[percentKey]) || 0;
  const inputClass =
    "w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400";
  const montoEquivalente = price > 0 ? Math.round((price * percent) / 100) : 0;

  function handlePercentChange(v: number) {
    updateField(percentKey, v);
  }

  function handleMontoChange(v: number) {
    if (price > 0) {
      updateField(percentKey, Math.round(((v / price) * 100 * 10)) / 10);
    }
  }

  return (
    <div>
      <label className="block text-xs font-medium text-ink-soft mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <input
            type="number"
            value={percent}
            onChange={(e) => handlePercentChange(Number(e.target.value))}
            className={inputClass}
            placeholder="%"
          />
          <p className="text-[10px] text-ink-soft mt-1">Porcentaje</p>
        </div>
        <span className="text-xs text-ink-soft">o</span>
        <div className="flex-1">
          <input
            type="number"
            value={montoEquivalente || ""}
            onChange={(e) => handleMontoChange(Number(e.target.value))}
            className={inputClass}
            placeholder="$"
          />
          <p className="text-[10px] text-ink-soft mt-1">Monto fijo ($)</p>
        </div>
      </div>
    </div>
  );
}

function DiscountsBlock({
  item,
  updateField,
}: {
  item: Record<string, unknown>;
  updateField: (key: string, value: unknown) => void;
}) {
  const price = Number(item.price) || 0;
  return (
    <div className="grid grid-cols-2 gap-4">
      <DiscountColumn
        label="Desc. profesionales"
        percentKey="professionalDiscountPercent"
        price={price}
        item={item}
        updateField={updateField}
      />
      <DiscountColumn
        label="Desc. clientes"
        percentKey="clientDiscountPercent"
        price={price}
        item={item}
        updateField={updateField}
      />
    </div>
  );
}

export default function AdminProductosPage() {
  const [distributorOptions, setDistributorOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetch("/api/distributors")
      .then((res) => res.json())
      .then((data) => {
        const opts = (Array.isArray(data) ? data : []).map((d: { id: string; name: string }) => ({
          value: d.id,
          label: d.name,
        }));
        setDistributorOptions([{ value: "", label: "Sin distribuidora" }, ...opts]);
      })
      .catch(() => setDistributorOptions([{ value: "", label: "Sin distribuidora" }]));
  }, []);

  return (
    <EntityManager
      apiPath="/api/products"
      title="Multidistribuidora"
      dynamicOptions={{
        distributorId: distributorOptions,
        productType: [
          { value: "normal", label: "Normal" },
          { value: "estacion", label: "De estación" },
          { value: "oferta", label: "Oferta" },
        ],
      }}
      fields={[
        { key: "name", label: "Nombre", type: "text" },
        { key: "description", label: "Descripción", type: "textarea", showInTable: false },
        { key: "category", label: "Categoría", type: "text" },
        { key: "distributorId", label: "Distribuidora / Laboratorio", type: "select", showInTable: false },
        { key: "pricing", label: "Precio", type: "custom", showInTable: false, render: (item, updateField) => <PricingBlock item={item} updateField={updateField} /> },
        { key: "price", label: "Precio", type: "number", hideInForm: true },
        {
          key: "discounts",
          label: "Descuentos",
          type: "custom",
          showInTable: false,
          render: (item, updateField) => <DiscountsBlock item={item} updateField={updateField} />,
        },
        { key: "productType", label: "Tipo", type: "select" },
        {
          key: "offerDiscountPercent",
          label: "% Oferta",
          type: "number",
          showInTable: false,
          helperText: () => "Solo se aplica si el Tipo de arriba es \"Oferta\".",
        },
        { key: "stock", label: "Stock", type: "number" },
        { key: "minStockAlert", label: "Stock mínimo para alerta", type: "number", showInTable: false },
        { key: "imageUrl", label: "Foto", type: "image", showInTable: false },
        { key: "active", label: "Activo", type: "checkbox" },
      ]}
      emptyItem={{
        name: "",
        description: "",
        category: "",
        distributorId: "",
        price: 0,
        cost: 0,
        profitPercent: 0,
        professionalDiscountPercent: 0,
        clientDiscountPercent: 0,
        productType: "normal",
        offerDiscountPercent: 0,
        stock: 0,
        minStockAlert: 0,
        imageUrl: "",
        active: true,
      }}
    />
  );
}
