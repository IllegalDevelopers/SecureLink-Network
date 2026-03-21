import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { token, timestamp, id } = await req.json();

    if (!token || !timestamp || !id) {
      return NextResponse.json({ success: false, error: "Invalid request" });
    }

    const now = Date.now();

    // ⏳ wait check
    if (now - timestamp < 5000) {
      return NextResponse.json({ success: false, error: "Wait not completed" });
    }

    // 🔒 token check
    if (!global.tokens || !global.tokens[token]) {
      return NextResponse.json({ success: false, error: "Invalid token" });
    }

    const tokenData = global.tokens[token];

    // ⏳ expiry
    if (now - tokenData.createdAt > 5 * 60 * 1000) {
      delete global.tokens[token];
      return NextResponse.json({ success: false, error: "Token expired" });
    }

    // 🔥 reuse block
    if (tokenData.used) {
      return NextResponse.json({ success: false, error: "Already verified" });
    }

    tokenData.used = true;

    // 🔐 access key
    const accessKey = crypto.randomUUID();

    global.accessKeys = global.accessKeys || {};
    global.accessKeys[accessKey] = {
      token,
      id,
      expires: now + 2 * 60 * 1000
    };

    return NextResponse.json({
      success: true,
      accessKey
    });

  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
