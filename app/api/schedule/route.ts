import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { toCamelCase } from "@/lib/case";
import type { DaySchedule } from "@/lib/types";

export async function GET() {
  const { data, error } = await supabaseAdmin.from("schedule").select("*").order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map((row) => toCamelCase(row)));
}

export async function PUT(req: NextRequest) {
  const body = (await req.json()) as DaySchedule[];
  const rows = body.map((d, i) => ({
    day: d.day,
    open: d.open,
    close: d.close,
    closed: d.closed,
    sort_order: i + 1,
  }));
  const { error } = await supabaseAdmin.from("schedule").upsert(rows, { onConflict: "day" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = await supabaseAdmin.from("schedule").select("*").order("sort_order");
  return NextResponse.json((data ?? []).map((row) => toCamelCase(row)));
}
