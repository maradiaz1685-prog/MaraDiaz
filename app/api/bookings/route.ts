import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { toCamelCase } from "@/lib/case";
import { generateSlots, weekdayNameFromDate } from "@/lib/slots";
import { createClient } from "@/lib/supabase/server";
import type { Service, DaySchedule } from "@/lib/types";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*, services(name)")
    .order("booking_date", { ascending: true })
    .order("time_slot", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const bookings = (data ?? []).map((row) => {
    const { services, ...rest } = row as typeof row & { services: { name: string } | null };
    return { ...toCamelCase(rest), serviceName: services?.name ?? "" };
  });

  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { serviceId, date, timeSlot, clientName, clientPhone } = body;

  if (!serviceId || !date || !timeSlot || !clientName || !clientPhone) {
    return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
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
    return NextResponse.json({ error: "Este servicio no tiene turnos configurados" }, { status: 400 });
  }

  const validSlots = generateSlots(service.scheduleStart, service.scheduleEnd, service.slotDurationMin);
  if (!validSlots.includes(timeSlot)) {
    return NextResponse.json({ error: "Horario inválido para este servicio" }, { status: 400 });
  }

  const weekday = weekdayNameFromDate(date);
  const { data: scheduleRow } = await supabaseAdmin.from("schedule").select("*").eq("day", weekday).single();
  const daySchedule = scheduleRow ? (toCamelCase(scheduleRow) as unknown as DaySchedule) : null;
  if (daySchedule?.closed) {
    return NextResponse.json({ error: "Ese día no se atiende" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .insert({
      service_id: serviceId,
      booking_date: date,
      time_slot: timeSlot,
      client_name: clientName,
      client_phone: clientPhone,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Ese horario ya fue reservado por otra persona" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(toCamelCase(data), { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await req.json();
  const { error } = await supabaseAdmin.from("bookings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
