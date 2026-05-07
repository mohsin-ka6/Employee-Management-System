import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const client = await clientPromise;
  const db = client.db();
  const employee = await db.collection("employees").findOne({ _id: new ObjectId(params.id) });

  if (!employee) {
    return NextResponse.json({ success: false, message: "Employee not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, employee });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { _id, ...fields } = body;
  const update: Record<string, unknown> = {
    ...fields,
    salary: fields.salary !== undefined ? Number(fields.salary) : undefined,
  };

  Object.keys(update).forEach((key) => {
    if (update[key] === undefined) {
      delete update[key];
    }
  });

  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection("employees").updateOne({ _id: new ObjectId(params.id) }, { $set: update });

  if (result.matchedCount === 0) {
    return NextResponse.json({ success: false, message: "Employee not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const client = await clientPromise;
  const db = client.db();
  await db.collection("employees").deleteOne({ _id: new ObjectId(params.id) });

  return NextResponse.json({ success: true });
}
