"use client";

import { useEffect, useState } from "react";
import EntityManager from "@/components/admin/EntityManager";
import { formatPrice, type Currency } from "@/lib/types";

function PriceBlock({
  item,
  updateField,
}: {
  item: Record<string, unknown>;
  updateField: (key: string, value: unknown) => void;
}) {
  const currency = (item.currency as Currency) ?? "ARS";
  const inputClass =
    "w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400";

  return (
    <div className="rounded-xl border border-brand-200 bg-white p-4">
      <p className="text-xs font-semibold text-ink mb-3">Precio de venta</p>
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <input
          type="number"
          min={0}
          step="any"
          value={Number(item.price) || ""}
          onChange={(e) => updateField("price", Number(e.target.value))}
          className={inputClass}
          placeholder="Monto"
        />
        <select
          value={currency}
          onChange={(e) => updateField("currency", e.target.value)}
          className="rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        >
          <option value="ARS">Pesos ($)</option>
          <option value="USD">Dólares (US$)</option>
        </select>
      </div>
    </div>
  );
}

function DiscountColumn({
  label,
  percentKey,
  price,
  currency,
  item,
  updateField,
}: {
  label: string;
  percentKey: string;
  price: number;
  currency: Currency;
  item: Record<string, unknown>;
  updateField: (key: string, value: unknown) => void;
}) {
  const percent = Number(item[percentKey]) || 0;
  const inputClass =
    "w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400";
  const montoEquivalente = price > 0 ? Math.round(((price * percent) / 100) * 100) / 100 : 0;

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
          <p className="text-[10px] text-ink-soft mt-1">Monto fijo ({currency === "USD" ? "US$" : "$"})</p>
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
  const currency = (item.currency as Currency) ?? "ARS";
  return (
    <div className="grid grid-cols-2 gap-4">
      <DiscountColumn
        label="Descuento a profesionales"
        percentKey="professionalDiscountPercent"
        price={price}
        currency={currency}
        item={item}
        updateField={updateField}
      />
      <DiscountColumn
        label="Descuento a clientes"
        percentKey="clientDiscountPercent"
        price={price}
        currency={currency}
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
      groupByKey="distributorId"
      searchKeys={["name", "category", "description", "distributorId"]}
      fields={[
        { key: "name", label: "Nombre", type: "text" },
        { key: "description", label: "Descripción", type: "textarea", showInTable: false },
        { key: "category", label: "Categoría", type: "text" },
        { key: "distributorId", label: "Distribuidora / Laboratorio", type: "select", showInTable: false },
        { key: "pricing", label: "Precio", type: "custom", showInTable: false, render: (item, updateField) => <PriceBlock item={item} updateField={updateField} /> },
        {
          key: "price",
          label: "Precio",
          type: "number",
          hideInForm: true,
          format: (item) => formatPrice(Number(item.price) || 0, (item.currency as Currency) ?? "ARS"),
        },
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
          helperText: () => "Solo se aplica si el Tipo es \"Oferta\". Si lo dejás vacío o en 0, se usa el % general de ofertas (Admin → Porcentajes).",
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
        currency: "ARS",
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
