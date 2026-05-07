import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const users = await db.collection("users").find({}, { projection: { password: 0 } }).toArray();
  return NextResponse.json({ users });
}
