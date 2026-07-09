import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { toCamelCase, toSnakeCase } from "@/lib/case";
import { createClient } from "@/lib/supabase/server";

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

  const { data, error } = await supabaseAdmin.from("registrations").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map((row) => toCamelCase(row)));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, province, city, address, alreadyClient } = body;

  if (!name || !phone || !province || !city) {
    return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
  }

  const accessCode = randomUUID().replace(/-/g, "").slice(0, 10);

  const { data, error } = await supabaseAdmin
    .from("registrations")
    .insert({
      name,
      phone,
      province,
      city,
      address: address ?? "",
      already_client: Boolean(alreadyClient),
      access_code: accessCode,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(toCamelCase(data), { status: 201 });
}

export async function PUT(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.id) {
    return NextResponse.json({ error: "Falta id" }, { status: 400 });
  }
  const { id, ...rest } = body;

  const { data, error } = await supabaseAdmin
    .from("registrations")
    .update(toSnakeCase(rest))
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(toCamelCase(data));
}

export async function DELETE(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await req.json();
  const { error } = await supabaseAdmin.from("registrations").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
