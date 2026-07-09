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
        { key: "category", label: "Categoría / especialidad", type: "text" },
        { key: "phone", label: "Teléfono", type: "text" },
        { key: "address", label: "Dirección", type: "text", showInTable: false },
        { key: "licenseNumber", label: "Matrícula", type: "text", showInTable: false },
        { key: "bio", label: "Descripción", type: "textarea", showInTable: false },
        { key: "photoUrl", label: "Foto", type: "image", showInTable: false },
      ]}
      emptyItem={{
        name: "",
        role: "",
        category: "",
        phone: "",
        address: "",
        licenseNumber: "",
        bio: "",
        photoUrl: "",
      }}
    />
  );
}
