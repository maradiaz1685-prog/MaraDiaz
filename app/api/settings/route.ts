import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { toCamelCase, toSnakeCase } from "@/lib/case";

export async function GET() {
  const { data, error } = await supabaseAdmin.from("settings").select("*").eq("id", 1).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(toCamelCase(data));
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabaseAdmin
    .from("settings")
    .update(toSnakeCase(body))
    .eq("id", 1)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(toCamelCase(data));
}
