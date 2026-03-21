import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const key = searchParams.get("key");

  // 🔒 key check
  if (!key || !global.accessKeys || !global.accessKeys[key]) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const session = global.accessKeys[key];

  // ⏳ expiry
  if (Date.now() > session.expires) {
    delete global.accessKeys[key];
    return new NextResponse("Expired", { status: 403 });
  }

  // 🔒 id bind
  if (session.id !== id) {
    return new NextResponse("Invalid link", { status: 403 });
  }

  // 🔥 one-time use
  delete global.accessKeys[key];

  try {
    const snap = await getDocs(collection(db, "links"));

    for (const docSnap of snap.docs) {
      const data = docSnap.data();

      if (data.customId === id) {

        // 🔥 PROXY (NO URL LEAK)
        const response = await fetch(data.externalLink);

        const contentType = response.headers.get("content-type");

        return new Response(response.body, {
          headers: {
            "Content-Type": contentType || "text/html",
            "Referrer-Policy": "no-referrer"
          }
        });
      }
    }

    return new NextResponse("Not found", { status: 404 });

  } catch (err) {
    return new NextResponse("Server error", { status: 500 });
  }
}
