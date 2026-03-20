import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "Username required" });
    }

    const snap = await getDocs(collection(db, "users"));

    let user = null;

    snap.forEach(doc => {
      const data = doc.data();
      if (data.username === username) {
        user = data;
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" });
    }

    return NextResponse.json({
      username: user.username,
      apiKey: user.apiKey,
      domain: user.domain
    });

  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}