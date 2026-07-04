"use client";

import EntityManager from "@/components/admin/EntityManager";

export default function AdminEmpleadosPage() {
  return (
    <EntityManager
      apiPath="/api/employees"
      title="Empleados"
      fields={[
        { key: "name", label: "Nombre", type: "text" },
        { key: "role", label: "Cargo", type: "text" },
        { key: "bio", label: "Descripción", type: "textarea", showInTable: false },
        { key: "photoUrl", label: "URL de foto", type: "text", showInTable: false },
      ]}
      emptyItem={{ name: "", role: "", bio: "", photoUrl: "" }}
    />
  );
}
