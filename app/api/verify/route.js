import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { token, timestamp } = await req.json();

    // 🔥 Basic anti-bypass checks
    if (!token) {
      return NextResponse.json({ error: "Invalid session" });
    }

    const now = Date.now();

    // ⏳ Minimum 5 sec wait required
    if (now - timestamp < 5000) {
      return NextResponse.json({ error: "Wait not completed" });
    }

    // ✅ Generate access key (temporary)
    const accessKey = Math.random().toString(36).substring(2);

    return NextResponse.json({
      success: true,
      accessKey
    });

  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}