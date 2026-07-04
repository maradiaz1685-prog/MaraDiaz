import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { readData, writeData } from "./data";

type Entity = { id: string };

export function createCrudHandlers<T extends Entity>(file: string) {
  async function GET() {
    const items = await readData<T[]>(file);
    return NextResponse.json(items);
  }

  async function POST(req: NextRequest) {
    const body = await req.json();
    const items = await readData<T[]>(file);
    const newItem = { ...body, id: randomUUID() } as T;
    items.push(newItem);
    await writeData(file, items);
    return NextResponse.json(newItem, { status: 201 });
  }

  async function PUT(req: NextRequest) {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "Falta id" }, { status: 400 });
    }
    const items = await readData<T[]>(file);
    const idx = items.findIndex((item) => item.id === body.id);
    if (idx === -1) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }
    items[idx] = { ...items[idx], ...body };
    await writeData(file, items);
    return NextResponse.json(items[idx]);
  }

  async function DELETE(req: NextRequest) {
    const { id } = await req.json();
    const items = await readData<T[]>(file);
    const filtered = items.filter((item) => item.id !== id);
    await writeData(file, filtered);
    return NextResponse.json({ ok: true });
  }

  return { GET, POST, PUT, DELETE };
}
