import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

function generateId(length = 6) {
  return Math.random().toString(36).substring(2, 2 + length);
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const apiKey = searchParams.get("api");
  const longUrl = searchParams.get("url");

  if (!apiKey || !longUrl) {
    return NextResponse.json({ status: "error", message: "Missing params" });
  }

  const snap = await getDocs(collection(db, "users"));

  let user = null;

  snap.forEach(doc => {
    const data = doc.data();
    if (data.apiKey === apiKey && data.isActive) {
      user = data;
    }
  });

  if (!user) {
    return NextResponse.json({ status: "error", message: "Invalid API key" });
  }

  // 🔥 External shortener
  let domain = user.domain;
  let token = user.apiToken;

  if (!domain.startsWith("http")) {
    domain = "https://" + domain;
  }

  const apiUrl = `${domain}/api?api=${token}&url=${encodeURIComponent(longUrl)}`;

  const res = await fetch(apiUrl);
  const data = await res.json();

  const externalShort = data.shortenedUrl || data.short || data.url;

  // 🔥 Generate ID
  const customId = generateId();

  // 💾 Save
  await addDoc(collection(db, "links"), {
    customId,
    externalLink: externalShort,
    originalUrl: longUrl,
    createdAt: new Date()
  });

  // 🔥 Dynamic domain fix
  const baseUrl = req.nextUrl.origin;

  return NextResponse.json({
    status: "success",
    shortenedUrl: `${baseUrl}/start/${customId}`
  });
}
