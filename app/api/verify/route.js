import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { token, timestamp, id } = await req.json();

    // 🔒 1. validation
    if (!token || !timestamp || !id) {
      return NextResponse.json({ success: false, error: "Invalid request" });
    }

    const now = Date.now();

    // ⏳ 2. wait check
    if (now - timestamp < 5000) {
      return NextResponse.json({ success: false, error: "Wait not completed" });
    }

    // 🔒 3. check token in DB
    const tokenRef = doc(db, "tokens", token);
    const tokenSnap = await getDoc(tokenRef);

    if (!tokenSnap.exists()) {
      return NextResponse.json({ success: false, error: "Invalid token" });
    }

    const tokenData = tokenSnap.data();

    // ⏳ 4. expiry check
    if (now - tokenData.createdAt > 5 * 60 * 1000) {
      await deleteDoc(tokenRef);
      return NextResponse.json({ success: false, error: "Token expired" });
    }

    // 🔥 5. reuse block
    if (tokenData.used) {
      return NextResponse.json({ success: false, error: "Already verified" });
    }

    // ✅ mark used
    await setDoc(tokenRef, {
      ...tokenData,
      used: true
    });

    // 🔐 6. generate access key
    const accessKey = crypto.randomUUID();

    // 💾 store session in DB
    await setDoc(doc(db, "sessions", accessKey), {
      token,
      id,
      expires: now + 2 * 60 * 1000
    });

    return NextResponse.json({
      success: true,
      accessKey
    });

  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message
    });
  }
}
