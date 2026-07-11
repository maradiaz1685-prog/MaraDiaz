"use client";

import EntityManager from "@/components/admin/EntityManager";

export default function AdminDistribuidorasPage() {
  return (
    <EntityManager
      apiPath="/api/distributors"
      title="Distribuidoras / Laboratorios"
      fields={[
        { key: "name", label: "Nombre", type: "text" },
        { key: "phone", label: "Teléfono", type: "text" },
        { key: "email", label: "Mail", type: "text", showInTable: false },
        { key: "address", label: "Dirección", type: "text", showInTable: false },
        { key: "logoUrl", label: "Logo", type: "image", showInTable: false },
      ]}
      emptyItem={{
        name: "",
        address: "",
        phone: "",
        email: "",
        logoUrl: "",
      }}
    />
  );
}
