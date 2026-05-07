import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const limit = Number(url.searchParams.get("limit") ?? "20");
  const search = url.searchParams.get("search") ?? "";
  const department = url.searchParams.get("department") ?? "";
  const status = url.searchParams.get("status") ?? "";

  const filters: Record<string, unknown> = {};
  if (search) {
    filters.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (department) filters.department = department;
  if (status) filters.status = status;

  const client = await clientPromise;
  const db = client.db();
  const employees = await db
    .collection("employees")
    .find(filters)
    .sort({ hireDate: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  const total = await db.collection("employees").countDocuments(filters);

  return NextResponse.json({ employees, total, page, limit });
}

export async function POST(req: Request) {
  const body = await req.json();
  const payload = {
    ...body,
    salary: Number(body.salary) || 0,
    hireDate: body.hireDate || new Date().toISOString().slice(0, 10),
    status: body.status || "active",
  };

  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection("employees").insertOne(payload);

  return NextResponse.json({ success: true, employeeId: result.insertedId.toString() });
}
