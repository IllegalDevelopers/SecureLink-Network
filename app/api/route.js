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

    // ✅ SAFE URL BUILD (NO SLASH ISSUE EVER)
    const apiEndpoint = new URL("/api/public/shorten", baseUrl);
    apiEndpoint.searchParams.set("api", apiKey);
    apiEndpoint.searchParams.set("url", url);

    const res = await fetch(apiEndpoint.toString());
    const data = await res.json();

    // 🔥 GET FINAL URL
    let finalUrl =
      data.shortenedUrl ||
      data.short ||
      data.url ||
      data.shortlink;

    if (!finalUrl) {
      return NextResponse.json({
        status: "error",
        message: "No shortened URL found"
      });
    }

    // ✅ FORCE CORRECT DOMAIN (NO STRING BUG)
    try {
      const fixedUrl = new URL(finalUrl);
      finalUrl = `${baseUrl}/start/${fixedUrl.pathname.split("/").pop()}`;
    } catch {
      // fallback (just in case)
      finalUrl = finalUrl.replace(/vercel\.appstart/g, "vercel.app/start");
    }

    return NextResponse.json({
      status: "success",
      shortenedUrl: finalUrl
    });

  } catch (err) {
    return NextResponse.json({
      status: "error",
      message: err.message
    });
  }
}
