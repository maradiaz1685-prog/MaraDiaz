"use client";

import { useEffect, useState } from "react";
import EntityManager from "@/components/admin/EntityManager";
import type { Employee } from "@/lib/types";

export default function AdminServiciosPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then(setEmployees);
  }, []);

  const employeeOptions = [
    { value: "", label: "Sin asignar" },
    ...employees.map((e) => ({ value: e.id, label: e.name })),
  ];

  return (
    <EntityManager
      apiPath="/api/services"
      title="Servicios"
      dynamicOptions={{ employeeId: employeeOptions }}
      fields={[
        { key: "name", label: "Nombre", type: "text" },
        { key: "description", label: "Descripción", type: "textarea", showInTable: false },
        { key: "price", label: "Precio", type: "number" },
        { key: "durationMin", label: "Duración (min)", type: "number" },
        {
          key: "employeeId",
          label: "Empleado que lo realiza",
          type: "select",
          showInTable: false,
          helperText: (item) => {
            const emp = employees.find((e) => e.id === item.employeeId);
            return emp?.phone ? `Teléfono de ${emp.name}: ${emp.phone}` : "";
          },
        },
        { key: "scheduleStart", label: "Turnos desde", type: "time", showInTable: false },
        { key: "scheduleEnd", label: "Turnos hasta", type: "time", showInTable: false },
        { key: "slotDurationMin", label: "Duración de cada turno (min)", type: "number", showInTable: false },
        { key: "imageUrl", label: "Foto", type: "image", showInTable: false },
        { key: "active", label: "Activo", type: "checkbox" },
      ]}
      emptyItem={{
        name: "",
        description: "",
        price: 0,
        durationMin: 30,
        employeeId: "",
        scheduleStart: "",
        scheduleEnd: "",
        slotDurationMin: 30,
        imageUrl: "",
        active: true,
      }}
    />
  );
}
