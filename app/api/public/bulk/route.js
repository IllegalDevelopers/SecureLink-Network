import { NextResponse } from "next/server";

export async function POST(req) {
  const { apiKey, urls } = await req.json();

  if (!apiKey || !urls || !Array.isArray(urls)) {
    return NextResponse.json({ error: "Invalid input" });
  }

  const results = [];

  for (const url of urls) {
    const res = await fetch(`${req.nextUrl.origin}/api/public`, {
      method: "POST",
      body: JSON.stringify({ apiKey, url })
    });

    const data = await res.json();
    results.push({ url, result: data });
  }

  return NextResponse.json({ results });
}