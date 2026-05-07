import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return NextResponse.json({ success: false, message: "User not found." }, { status: 401 });
  }

  const passwordValid = await comparePassword(password, user.password);
  if (!passwordValid) {
    return NextResponse.json({ success: false, message: "Invalid credentials." }, { status: 401 });
  }

  const token = signToken({ userId: user._id.toString(), role: user.role, email: user.email });
  return NextResponse.json({ success: true, token, user: { email: user.email, role: user.role, name: user.name } });
}
