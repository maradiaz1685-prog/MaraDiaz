import { NextRequest, NextResponse } from "next/server";
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

  const { data, error } = await supabaseAdmin
    .from("stock_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map((row) => toCamelCase(row)));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { productId, productName, clientName, clientPhone, message } = body;

  if (!productName || !clientName || !clientPhone) {
    return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("stock_requests")
    .insert({
      product_id: productId || null,
      product_name: productName,
      client_name: clientName,
      client_phone: clientPhone,
      message: message ?? "",
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
    .from("stock_requests")
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
  const { error } = await supabaseAdmin.from("stock_requests").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
