"use client";

import EntityManager from "@/components/admin/EntityManager";

export default function AdminServiciosPage() {
  return (
    <EntityManager
      apiPath="/api/services"
      title="Servicios"
      fields={[
        { key: "name", label: "Nombre", type: "text" },
        { key: "description", label: "Descripción", type: "textarea", showInTable: false },
        { key: "price", label: "Precio", type: "number" },
        { key: "durationMin", label: "Duración (min)", type: "number" },
        { key: "imageUrl", label: "Foto", type: "image", showInTable: false },
        { key: "active", label: "Activo", type: "checkbox" },
      ]}
      emptyItem={{
        name: "",
        description: "",
        price: 0,
        durationMin: 30,
        imageUrl: "",
        active: true,
      }}
    />
  );
}
