import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";

type DaySchedule = { day: string; open: string; close: string; closed: boolean };

export async function GET() {
  const schedule = await readData<DaySchedule[]>("schedule.json");
  return NextResponse.json(schedule);
}

export async function PUT(req: NextRequest) {
  const body = (await req.json()) as DaySchedule[];
  await writeData("schedule.json", body);
  return NextResponse.json(body);
}
