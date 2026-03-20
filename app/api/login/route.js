import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "All fields required" });
    }

    // 🔍 Find user
    const q = query(collection(db, "users"), where("username", "==", username));
    const snap = await getDocs(q);

    if (snap.empty) {
      return NextResponse.json({ error: "User not found" });
    }

    const userDoc = snap.docs[0];
    const user = userDoc.data();

    // 🔐 Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid password" });
    }

    // ✅ Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: userDoc.id,
        username: user.username,
        apiKey: user.apiKey,   // 🔥 added
        apiToken: user.apiToken,
        domain: user.domain
      }
    });

    // 🔒 Set secure auth cookie
    response.cookies.set("authToken", userDoc.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 // 1 day
    });

    return response;

  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}