import { db } from "@/lib/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const key = searchParams.get("key");

  if (!key) {
    return new Response("Unauthorized", { status: 403 });
  }

  const snap = await getDoc(doc(db, "sessions", key));

  if (!snap.exists()) {
    return new Response("Invalid or expired", { status: 403 });
  }

  const session = snap.data();

  if (Date.now() > session.expires) {
    await deleteDoc(doc(db, "sessions", key));
    return new Response("Expired", { status: 403 });
  }

  if (session.id !== id) {
    return new Response("Invalid link", { status: 403 });
  }

  // 🔥 one-time use
  await deleteDoc(doc(db, "sessions", key));

  // 🔥 fetch original link
  const linksSnap = await getDocs(collection(db, "links"));

  for (const docSnap of linksSnap.docs) {
    const data = docSnap.data();
    if (data.customId === id) {
      return Response.redirect(data.externalLink);
    }
  }

  return new Response("Not found", { status: 404 });
}
