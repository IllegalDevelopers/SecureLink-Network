import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  limit,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import crypto from "crypto";

function normalizeDomain(domain) {
  if (!domain) return "";
  return domain.startsWith("http://") || domain.startsWith("https://")
    ? domain
    : `https://${domain}`;
}

function generateCustomId(length = 8) {
  return crypto.randomBytes(length).toString("base64url").slice(0, length);
}

async function getUniqueCustomId() {
  let customId = "";
  let exists = true;
  let attempts = 0;

  while (exists && attempts < 5) {
    customId = generateCustomId(8);

    const q = query(
      collection(db, "links"),
      where("customId", "==", customId),
      limit(1)
    );

    const snap = await getDocs(q);
    exists = !snap.empty;
    attempts++;
  }

  if (exists) {
    throw new Error("Unable to generate unique link ID");
  }

  return customId;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { apiKey, url } = body;

    if (!apiKey || !url) {
      return NextResponse.json(
        { success: false, error: "Missing apiKey or url" },
        { status: 400 }
      );
    }

    // Find user by unique API key
    const userQuery = query(
      collection(db, "users"),
      where("apiKey", "==", apiKey),
      limit(1)
    );

    const userSnap = await getDocs(userQuery);

    // If user deleted, no record => API auto expired
    if (userSnap.empty) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired API key" },
        { status: 401 }
      );
    }

    const userDoc = userSnap.docs[0];
    const user = userDoc.data();

    // Optional soft-delete / disable support
    if (user.isActive === false) {
      return NextResponse.json(
        { success: false, error: "API access disabled" },
        { status: 403 }
      );
    }

    if (!user.apiToken || !user.domain) {
      return NextResponse.json(
        { success: false, error: "Shortener settings not configured" },
        { status: 400 }
      );
    }

    const domain = normalizeDomain(user.domain);
    const apiUrl = `${domain}/api?api=${encodeURIComponent(
      user.apiToken
    )}&url=${encodeURIComponent(url)}`;

    const shortenerRes = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json,text/plain,*/*",
      },
      cache: "no-store",
    });

    const text = await shortenerRes.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "External shortener did not return valid JSON",
        },
        { status: 502 }
      );
    }

    if (data.status !== "success") {
      return NextResponse.json(
        {
          success: false,
          error: data.message || "Shortening failed",
        },
        { status: 400 }
      );
    }

    let externalShort = data.shortenedUrl || data.short || data.url;

    if (!externalShort) {
      return NextResponse.json(
        {
          success: false,
          error: "External shortener did not return a short URL",
        },
        { status: 502 }
      );
    }

    externalShort = externalShort.replace(/\\\//g, "/");

    const customId = await getUniqueCustomId();
    const finalLink = `${req.nextUrl.origin}/start/${customId}`;

    await addDoc(collection(db, "links"), {
      userId: userDoc.id,
      username: user.username || "",
      longUrl: url,
      externalLink: externalShort,
      customId,
      clicks: 0,
      createdAt: new Date(),
      source: "public_api",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Link shortened successfully",
        shortLink: finalLink,
        customId,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
