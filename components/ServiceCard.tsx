"use client";

import { useState } from "react";
import { formatPrice, type Service } from "@/lib/types";
import BookingModal from "./BookingModal";

export default function ServiceCard({
  service,
  employeeName,
  employeePhone,
}: {
  service: Service;
  employeeName: string | null;
  employeePhone: string | null;
}) {
  const [showBooking, setShowBooking] = useState(false);

  const bookable = Boolean(service.scheduleStart && service.scheduleEnd && service.slotDurationMin);

  return (
    <article className="rounded-2xl border border-brand-100 overflow-hidden bg-white hover:shadow-xl hover:shadow-brand-100/50 transition-shadow">
      <div className="h-36 bg-gradient-to-br from-brand-200 to-brand-500 flex items-center justify-center text-white/80">
        {service.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={service.imageUrl} alt={service.name} className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-3xl">✦</span>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-display text-lg font-semibold text-ink mb-2">{service.name}</h3>
        <p className="text-sm text-ink-soft leading-relaxed mb-4">{service.description}</p>

        {employeeName && (
          <p className="text-xs text-brand-600 mb-3">
            Atiende: <strong>{employeeName}</strong>
            {employeePhone ? ` · ${employeePhone}` : ""}
          </p>
        )}

        <div className="flex items-center justify-between text-sm mb-4">
          <span className="text-ink-soft">{service.durationMin} min</span>
          <span className="font-semibold text-brand-700">{formatPrice(service.price)}</span>
        </div>

        {bookable && (
          <button
            onClick={() => setShowBooking(true)}
            className="w-full rounded-full bg-brand-600 text-white text-sm font-medium py-2.5 hover:bg-brand-700 transition-colors"
          >
            Reservar turno
          </button>
        )}
      </div>

      {showBooking && (
        <BookingModal serviceId={service.id} serviceName={service.name} onClose={() => setShowBooking(false)} />
      )}
    </article>
  );
}
