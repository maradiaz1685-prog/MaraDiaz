import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";

type Settings = {
  ownerName: string;
  bio: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  address: string;
};

export async function GET() {
  const settings = await readData<Settings>("settings.json");
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const body = (await req.json()) as Settings;
  await writeData("settings.json", body);
  return NextResponse.json(body);
}
