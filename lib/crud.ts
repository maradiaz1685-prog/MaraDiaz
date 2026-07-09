import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "./supabaseAdmin";
import { toCamelCase, toSnakeCase } from "./case";

// Los <select> HTML no tienen forma de representar "sin valor" salvo "" —
// para columnas de clave foránea (uuid nullable) eso rompe el insert/update,
// así que "" se traduce a null solo en campos *_id.
function nullifyEmptyForeignKeys(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    out[key] = key.endsWith("_id") && value === "" ? null : value;
  }
  return out;
}

export function createCrudHandlers(table: string) {
  async function GET() {
    const { data, error } = await supabaseAdmin.from(table).select("*");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json((data ?? []).map((row) => toCamelCase(row)));
  }

  async function POST(req: NextRequest) {
    const body = await req.json();
    const { id: _ignored, ...rest } = body;
    const { data, error } = await supabaseAdmin
      .from(table)
      .insert(nullifyEmptyForeignKeys(toSnakeCase(rest)))
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(toCamelCase(data), { status: 201 });
  }

  async function PUT(req: NextRequest) {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "Falta id" }, { status: 400 });
    }
    const { id, ...rest } = body;
    const { data, error } = await supabaseAdmin
      .from(table)
      .update(nullifyEmptyForeignKeys(toSnakeCase(rest)))
      .eq("id", id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(toCamelCase(data));
  }

  async function DELETE(req: NextRequest) {
    const { id } = await req.json();
    const { error } = await supabaseAdmin.from(table).delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return { GET, POST, PUT, DELETE };
}
