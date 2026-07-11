import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Aplica en bloque el % default de profesionales/clientes a TODOS los
// productos ya cargados (usado desde /admin/porcentajes cuando la admin
// tilda "aplicar a todos los productos").
export async function POST(req: NextRequest) {
  const { field, percent } = await req.json();

  if (field !== "professional" && field !== "client") {
    return NextResponse.json({ error: "Campo inválido" }, { status: 400 });
  }

  const column = field === "professional" ? "professional_discount_percent" : "client_discount_percent";

  const { error } = await supabaseAdmin
    .from("products")
    .update({ [column]: percent })
    .not("id", "is", null);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
