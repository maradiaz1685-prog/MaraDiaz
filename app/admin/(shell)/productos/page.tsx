"use client";

import EntityManager from "@/components/admin/EntityManager";

export default function AdminProductosPage() {
  return (
    <EntityManager
      apiPath="/api/products"
      title="Multidistribuidora"
      fields={[
        { key: "name", label: "Nombre", type: "text" },
        { key: "description", label: "Descripción", type: "textarea", showInTable: false },
        { key: "category", label: "Categoría", type: "text" },
        { key: "price", label: "Precio", type: "number" },
        { key: "stock", label: "Stock", type: "number" },
        { key: "imageUrl", label: "URL de imagen", type: "text", showInTable: false },
        { key: "active", label: "Activo", type: "checkbox" },
      ]}
      emptyItem={{
        name: "",
        description: "",
        category: "",
        price: 0,
        stock: 0,
        imageUrl: "",
        active: true,
      }}
    />
  );
}
