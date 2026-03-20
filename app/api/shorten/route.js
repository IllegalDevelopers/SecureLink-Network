import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    let { longUrl, domain, apiToken } = await req.json();

    // 🔥 FIX: add https automatically
    if (!domain.startsWith("http")) {
      domain = "https://" + domain;
    }

    const apiUrl = `${domain}/api?api=${apiToken}&url=${encodeURIComponent(longUrl)}`;

    const res = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const text = await res.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({
        error: "External API not returning JSON",
        raw: text
      });
    }

    return NextResponse.json(data);

  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}