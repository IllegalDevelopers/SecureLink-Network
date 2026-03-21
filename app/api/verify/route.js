import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { token, timestamp, id } = await req.json();

    // 🔒 1. Basic validation
    if (!token || !timestamp || !id) {
      return NextResponse.json({ success: false, error: "Invalid request" });
    }

    const now = Date.now();

    // ⏳ 2. Minimum wait (5 sec)
    if (now - timestamp < 5000) {
      return NextResponse.json({ success: false, error: "Wait not completed" });
    }

    // 🔒 3. Check token exists
    if (!global.tokens || !global.tokens[token]) {
      return NextResponse.json({ success: false, error: "Invalid token" });
    }

    const tokenData = global.tokens[token];

    // ⏳ 4. Token expiry (5 min)
    if (now - tokenData.createdAt > 5 * 60 * 1000) {
      delete global.tokens[token];
      return NextResponse.json({ success: false, error: "Token expired" });
    }

    // 🔥 5. Prevent reuse
    if (tokenData.used) {
      return NextResponse.json({ success: false, error: "Already verified" });
    }

    // ✅ mark used
    tokenData.used = true;

    // 🔐 6. Generate secure access key
    const accessKey = crypto.randomUUID();

    global.accessKeys = global.accessKeys || {};
    global.accessKeys[accessKey] = {
      token,
      id, // 🔥 bind with id (IMPORTANT)
      expires: now + 2 * 60 * 1000 // 2 min expiry
    };

    return NextResponse.json({
      success: true,
      accessKey
    });

  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
