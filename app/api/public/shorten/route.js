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
    return NextResponse.json({
      status: "error",
      message: "Missing api or url"
    });
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
    return NextResponse.json({
      status: "error",
      message: "Invalid API key"
    });
  }

  // 🔥 External shortener
  let domain = user.domain;
  let token = user.apiToken;

  if (!domain.startsWith("http")) {
    domain = "https://" + domain;
  }

  const apiUrl = `${domain}/api?api=${token}&url=${encodeURIComponent(longUrl)}`;

  let externalShort = null;

  try {
    const res = await fetch(apiUrl);

    const text = await res.text(); // 🔥 safe read

    if (text) {
      const data = JSON.parse(text);
      externalShort =
        data.shortenedUrl || data.short || data.url || data.shortlink;
    }
  } catch (err) {
    console.log("External API error:", err.message);
  }

  // 🔥 fallback (never fail)
  if (!externalShort) {
    externalShort = longUrl;
  }

  // 🔥 Generate ID
  const customId = generateId();

  // 💾 Save
  await addDoc(collection(db, "links"), {
    customId,
    externalLink: externalShort,
    originalUrl: longUrl,
    createdAt: new Date()
  });

  // 🔥 Dynamic domain (no slash issue)
  const baseUrl = req.nextUrl.origin.replace(/\/$/, "");
  const finalUrl = `${baseUrl}/start/${customId}`;

  // 🔥 UNIVERSAL RESPONSE (all bots supported)
  return NextResponse.json({
    status: "success",
    shortenedUrl: finalUrl, // ✅ main
    shortlink: finalUrl,    // ✅ backup
    short: finalUrl,        // ✅ backup
    url: finalUrl           // ✅ backup
  });
}
