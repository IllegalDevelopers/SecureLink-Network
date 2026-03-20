import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const apiKey = searchParams.get("api");
  const url = searchParams.get("url");

  if (!apiKey || !url) {
    return NextResponse.json({
      status: "error",
      message: "Missing api or url"
    });
  }

  try {
    const baseUrl = req.nextUrl.origin;

    const res = await fetch(
      `${baseUrl}/api/public/shorten?api=${apiKey}&url=${encodeURIComponent(url)}`
    );

    const data = await res.json();

    // 🔥 IMPORTANT FIX
    return NextResponse.json({
      shortenedUrl: data.shortenedUrl || data.short || data.url
    });

  } catch (err) {
    return NextResponse.json({
      status: "error",
      message: err.message
    });
  }
}
