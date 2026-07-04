"use client";

import EntityManager from "@/components/admin/EntityManager";

export default function AdminCursosPage() {
  return (
    <EntityManager
      apiPath="/api/courses"
      title="Escuela Profesional"
      fields={[
        { key: "name", label: "Nombre", type: "text" },
        {
          key: "type",
          label: "Tipo",
          type: "select",
          options: [
            { value: "curso", label: "Curso" },
            { value: "taller", label: "Taller" },
            { value: "capacitacion", label: "Capacitación" },
          ],
        },
        { key: "modality", label: "Modalidad", type: "text" },
        { key: "duration", label: "Duración", type: "text" },
        { key: "price", label: "Precio", type: "number" },
        { key: "startDate", label: "Fecha de inicio", type: "date" },
        { key: "imageUrl", label: "Foto", type: "image", showInTable: false },
        { key: "active", label: "Activo", type: "checkbox" },
      ]}
      emptyItem={{
        name: "",
        type: "curso",
        modality: "Presencial",
        duration: "",
        price: 0,
        startDate: new Date().toISOString().slice(0, 10),
        imageUrl: "",
        active: true,
      }}
    />
  );
}
