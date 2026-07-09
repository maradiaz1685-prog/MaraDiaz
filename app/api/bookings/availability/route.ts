import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { toCamelCase } from "@/lib/case";
import { generateSlots, weekdayNameFromDate } from "@/lib/slots";
import type { Service, DaySchedule, Booking } from "@/lib/types";

export async function GET(req: NextRequest) {
  const serviceId = req.nextUrl.searchParams.get("serviceId");
  const date = req.nextUrl.searchParams.get("date");

  if (!serviceId || !date) {
    return NextResponse.json({ error: "Falta serviceId o date" }, { status: 400 });
  }

  const { data: serviceRow, error: serviceError } = await supabaseAdmin
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .single();

  if (serviceError || !serviceRow) {
    return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
  }

  const service = toCamelCase(serviceRow) as unknown as Service;

  if (!service.scheduleStart || !service.scheduleEnd || !service.slotDurationMin) {
    return NextResponse.json({ slots: [], closed: false, reason: "sin-horario" });
  }

  const weekday = weekdayNameFromDate(date);
  const { data: scheduleRows } = await supabaseAdmin
    .from("schedule")
    .select("*")
    .eq("day", weekday)
    .single();

  const daySchedule = scheduleRows ? (toCamelCase(scheduleRows) as unknown as DaySchedule) : null;

  if (daySchedule?.closed) {
    return NextResponse.json({ slots: [], closed: true, reason: "cerrado" });
  }

  const allSlots = generateSlots(service.scheduleStart, service.scheduleEnd, service.slotDurationMin);

  const { data: bookingRows } = await supabaseAdmin
    .from("bookings")
    .select("time_slot")
    .eq("service_id", serviceId)
    .eq("booking_date", date);

  const taken = new Set((bookingRows ?? []).map((b) => b.time_slot as string));

  const slots = allSlots.map((time) => ({ time, available: !taken.has(time) }));

  return NextResponse.json({ slots, closed: false });
}
