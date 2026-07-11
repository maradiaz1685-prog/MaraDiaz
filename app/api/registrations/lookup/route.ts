import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  if (!phone) {
    return NextResponse.json({ error: "Falta el teléfono" }, { status: 400 });
  }

  const target = normalizePhone(phone);
  if (target.length < 6) {
    return NextResponse.json({ found: false });
  }

  const { data, error } = await supabaseAdmin
    .from("registrations")
    .select("name, phone, status, discount_percent, access_code, applies_productos");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const match = (data ?? []).find((r) => {
    const stored = normalizePhone(r.phone as string);
    return stored.length >= 6 && (stored === target || stored.endsWith(target) || target.endsWith(stored));
  });

  if (!match) {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({
    found: true,
    name: match.name,
    status: match.status,
    discountPercent: match.discount_percent,
    accessCode: match.access_code,
    appliesProductos: match.applies_productos,
  });
}
