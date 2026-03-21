import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function GET() {
  const token = crypto.randomUUID();

  await setDoc(doc(db, "tokens", token), {
    createdAt: Date.now(),
    used: false
  });

  return Response.json({ token });
}
