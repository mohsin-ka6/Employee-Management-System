import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const departments = await db.collection("employees").distinct("department");
  return NextResponse.json({ departments });
}

export async function POST(req: Request) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db();
  await db.collection("employees").updateMany({ department: body.from }, { $set: { department: body.to } });
  return NextResponse.json({ success: true });
}
