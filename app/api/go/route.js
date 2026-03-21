import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const key = searchParams.get("key");

  // 🔒 Require access key
  if (!key) {
    return NextResponse.json({ error: "Unauthorized" });
  }

  const snap = await getDocs(collection(db, "links"));

  for (const docSnap of snap.docs) {
    const data = docSnap.data();

    if (data.customId === id) {
      return NextResponse.redirect(data.externalLink);
    }
  }

  return NextResponse.json({ error: "Not found" });
}
