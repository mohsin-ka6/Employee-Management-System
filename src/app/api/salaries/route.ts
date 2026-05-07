import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const records = await db.collection("employees").find().sort({ salary: -1 }).toArray();
  return NextResponse.json({ records });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.employeeId) {
    return NextResponse.json({ success: false, message: "employeeId is required" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  await db.collection("employees").updateOne(
    { _id: new ObjectId(body.employeeId) },
    { $set: { salary: Number(body.salary) } }
  );
  return NextResponse.json({ success: true });
}
