import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  limit
} from "firebase/firestore";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import crypto from "crypto";

const INVITE_CODE = "KUNALVIP";

// 🔥 normalize domain
function normalizeDomain(domain) {
  if (!domain) return "";
  return domain.startsWith("http://") || domain.startsWith("https://")
    ? domain
    : `https://${domain}`;
}

export async function POST(req) {
  try {
    const { username, password, inviteCode, apiToken, domain } = await req.json();

    // 🔒 Validate fields
    if (!username || !password || !inviteCode || !apiToken || !domain) {
      return NextResponse.json(
        { success: false, error: "All fields required" },
        { status: 400 }
      );
    }

    // 🔑 Invite Code check
    if (inviteCode !== INVITE_CODE) {
      return NextResponse.json(
        { success: false, error: "Invalid Invite Code" },
        { status: 403 }
      );
    }

    // 🔍 Check existing user (case insensitive)
    const q = query(
      collection(db, "users"),
      where("username", "==", username.toLowerCase()),
      limit(1)
    );

    const snap = await getDocs(q);

    if (!snap.empty) {
      return NextResponse.json(
        { success: false, error: "Username already exists" },
        { status: 409 }
      );
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 Generate secure API key
    const apiKey = crypto.randomBytes(32).toString("hex");

    // 🌐 Fix domain
    const fixedDomain = normalizeDomain(domain);

    // 💾 Save user
    await addDoc(collection(db, "users"), {
      username: username.toLowerCase(),
      password: hashedPassword,
      apiToken,
      domain: fixedDomain,
      apiKey, // 🔥 important
      isActive: true, // 🔥 future control
      createdAt: new Date()
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration Successful ✅",
        apiKey // 🔥 show once (optional)
      },
      { status: 201 }
    );

  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Internal server error"
      },
      { status: 500 }
    );
  }
}