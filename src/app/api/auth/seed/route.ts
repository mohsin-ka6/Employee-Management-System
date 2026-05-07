import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD ?? "Admin@123";

  const hashedPassword = await hashPassword(password);
  await db.collection("users").updateOne(
    { email },
    {
      $set: {
        name: "System Administrator",
        password: hashedPassword,
        role: "admin",
        createdAt: new Date().toISOString(),
      },
    },
    { upsert: true }
  );

  return NextResponse.json({ success: true, message: "Admin account seeded or updated.", email, password });
}
