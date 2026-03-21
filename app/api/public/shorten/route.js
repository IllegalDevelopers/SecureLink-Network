import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

function generateId(length = 6) {
  return Math.random().toString(36).substring(2, 2 + length);
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const apiKey = searchParams.get("api");
    const longUrl = searchParams.get("url");

    if (!apiKey || !longUrl) {
      return NextResponse.json({
        status: "error",
        message: "Missing params"
      });
    }

    // 🔍 Find user
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

    // 🔥 External shortener call
    let domain = user.domain;
    let token = user.apiToken;

    // ensure https
    if (!domain.startsWith("http")) {
      domain = "https://" + domain;
    }

    // remove trailing slash (IMPORTANT FIX)
    domain = domain.replace(/\/+$/, "");

    const apiUrl = `${domain}/api?api=${token}&url=${encodeURIComponent(longUrl)}`;

    const res = await fetch(apiUrl);
    const data = await res.json();

    const externalShort =
      data.shortenedUrl || data.short || data.url;

    // 🔥 Generate custom ID
    const customId = generateId();

    // 💾 Save to DB
    await addDoc(collection(db, "links"), {
      customId,
      externalLink: externalShort,
      originalUrl: longUrl,
      createdAt: new Date()
    });

    // 🔥 BASE URL FIX (NO SLASH ISSUE EVER)
    const baseUrl = (
      process.env.BASE_URL ||
      `${req.nextUrl.protocol}//${req.nextUrl.host}`
    ).replace(/\/+$/, "");

    // 🔥 FINAL RESPONSE (IMPORTANT: shortenedUrl use karo)
    return NextResponse.json({
      status: "success",
      shortenedUrl: `${baseUrl}/start/${customId}`
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: "error",
      message: "Server error"
    });
  }
}
