"use client";

import { useState } from "react";
import { formatPrice, whatsappLink, type Employee, type Service } from "@/lib/types";
import ServiceModal from "./ServiceModal";

export default function ProfessionalCard({
  employee,
  services,
  businessWhatsapp,
}: {
  employee: Employee;
  services: Service[];
  businessWhatsapp: string;
}) {
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const contactPhone = employee.phone || businessWhatsapp;
  const portfolio = employee.portfolioImages ?? [];

  function hireUrl() {
    return whatsappLink(
      contactPhone,
      `Hola ${employee.name}! Vi tu perfil en la página de Mara Diaz y quiero contratarte.`
    );
  }

  return (
    <article className="rounded-2xl border border-brand-100 overflow-hidden bg-white hover:shadow-xl hover:shadow-brand-100/50 transition-shadow">
      <div className="h-56 bg-gradient-to-br from-brand-200 to-brand-500 flex items-center justify-center text-white/80">
        {employee.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={employee.photoUrl} alt={employee.name} className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-4xl">✦</span>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-display text-lg font-semibold text-ink">{employee.name}</h3>
        {(employee.category || employee.role) && (
          <p className="text-xs text-brand-600 font-medium mb-2">{employee.category || employee.role}</p>
        )}
        {employee.bio && <p className="text-sm text-ink-soft leading-relaxed mb-4">{employee.bio}</p>}

        {portfolio.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-2">Trabajos realizados</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {portfolio.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setLightbox(url)}
                  className="shrink-0 h-20 w-20 rounded-lg overflow-hidden border border-brand-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {services.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-2">Servicios y valores</p>
            <div className="flex flex-col gap-1.5">
              {services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveService(s)}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm border border-brand-100 hover:bg-brand-50 transition-colors text-left"
                >
                  <span className="text-ink">{s.name}</span>
                  <span className="font-semibold text-brand-700 shrink-0">{formatPrice(s.price)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <a
          href={hireUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center rounded-full bg-[#25D366] text-white text-sm font-semibold py-2.5 hover:opacity-90 transition-opacity"
        >
          Contratar a {employee.name.split(" ")[0]} por WhatsApp
        </a>
      </div>

      {activeService && (
        <ServiceModal
          serviceId={activeService.id}
          serviceName={activeService.name}
          serviceDescription={activeService.description}
          employeeName={employee.name}
          employeePhone={employee.phone}
          businessWhatsapp={businessWhatsapp}
          bookable={Boolean(activeService.scheduleStart && activeService.scheduleEnd && activeService.slotDurationMin)}
          onClose={() => setActiveService(null)}
        />
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 px-4 py-8"
          onClick={() => setLightbox(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" className="max-h-full max-w-full rounded-lg object-contain" />
        </div>
      )}
    </article>
  );
}
